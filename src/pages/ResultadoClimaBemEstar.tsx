import { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Download, Share2, RefreshCw, TrendingUp, Award, Brain, Building2, AlertTriangle, Heart, Users, Loader2, CheckCircle, Eye, BarChart3, Radar, Gauge, Activity, Shield, MessageCircle, UserCheck, Scale } from "lucide-react";
import { calcularResultadoClimaBemEstar, gerarRecomendacoesInsight, type ResultadoClimaBemEstar } from "@/lib/testes/clima-bem-estar";
import { resultadosService } from "@/lib/database";
import { sessionService } from "@/lib/services/session-service";
import ClimaBemEstarAreaChart from "@/components/charts/ClimaBemEstarAreaChart";
import ClimaBemEstarRadarChart from "@/components/charts/ClimaBemEstarRadarChart";

export default function ResultadoClimaBemEstar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { resultadoId } = useParams<{ resultadoId: string }>();
  const [resultado, setResultado] = useState<ResultadoClimaBemEstar | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    processarResultado();
  }, []);

  const processarResultado = async () => {
    try {
      setCarregando(true);
      setErro(null);

      console.log('🔍 [CLIMA-RESULTADO] Resultado ID da URL:', resultadoId);

      // Se temos um ID na URL, buscar resultado existente
      if (resultadoId) {
        console.log('🔍 [CLIMA-RESULTADO] Buscando resultado existente com ID:', resultadoId);
        
        const resultadoExistente = await resultadosService.buscarResultadoPorId(resultadoId);
        
        if (resultadoExistente && resultadoExistente.metadados?.analise_completa) {
          console.log('✅ [CLIMA-RESULTADO] Resultado encontrado no banco:', resultadoExistente);
          const analise = resultadoExistente.metadados.analise_completa as ResultadoClimaBemEstar;
          // Compatibilidade: garantir que cada dimensão tenha `percentual` e, se necessário, estimar distribuição pela média
          if (analise && analise.dimensoes) {
            Object.entries(analise.dimensoes).forEach(([id, dim]) => {
              if (typeof dim.percentual !== 'number' && typeof dim.media === 'number') {
                dim.percentual = Math.round((dim.media / 5) * 100);
              }
              // Se não houver respostas por pergunta, manter como undefined; gráfico estimará pela média
            });
          }
          setResultado(analise);
          setCarregando(false);
          return;
        } else {
          console.log('❌ [CLIMA-RESULTADO] Resultado não encontrado ou sem análise completa');
        }
      }

      // Fallback: processar dados do estado da navegação (para compatibilidade)
      const { respostas, tempoTotal, perguntasRespondidas } = location.state || {};

      if (!respostas || Object.keys(respostas).length === 0) {
        throw new Error("Dados de resposta não encontrados e resultado não existe no banco");
      }

      console.log('🔍 [CLIMA-RESULTADO] Processando resultado com respostas:', respostas);

      // Calcular resultado usando a função específica do teste
      let analiseClima = calcularResultadoClimaBemEstar(respostas);
      console.log('🔍 [CLIMA-RESULTADO] Análise calculada (antes de add percentual):', analiseClima);

      // Adicionar o campo 'percentual' em cada dimensão para compatibilidade com gráficos
      if (analiseClima && analiseClima.dimensoes) {
        Object.keys(analiseClima.dimensoes).forEach(dimensaoId => {
          const dimensao = analiseClima.dimensoes[dimensaoId];
          if (dimensao && typeof dimensao.media === 'number') {
            dimensao.percentual = (dimensao.media / 5) * 100;
          }
        });
      }
      
      console.log('✅ [CLIMA-RESULTADO] Análise final (com percentual):', analiseClima);


      // Salvar resultado no banco de dados apenas se não temos ID
      if (!resultadoId) {
        const sessionId = sessionService.getSessionId();
        const dadosResultado = {
          usuario_id: null, // Anônimo
          session_id: sessionId,
          pontuacao_total: Math.round(analiseClima.mediaGeral * 20), // Converter para escala 0-100
          tempo_gasto: tempoTotal || 0,
          status: 'concluido' as const,
          metadados: {
            tipo_teste: '55fc21f9-cc10-4b4a-8765-3f5087eaf1f5', // UUID do teste clima-bem-estar
            teste_nome: 'HumaniQ Insight – Clima Organizacional e Bem-Estar Psicológico',
            pontuacoes_dimensoes: {
              seguranca_psicologica: analiseClima.dimensoes['segurancaPsicologica']?.media || 0,
              comunicacao_interna: analiseClima.dimensoes['comunicacaoInterna']?.media || 0,
              pertencimento: analiseClima.dimensoes['pertencimento']?.media || 0,
              justica_organizacional: analiseClima.dimensoes['justicaOrganizacional']?.media || 0
            },
            interpretacao: gerarInterpretacao(analiseClima),
            recomendacoes: gerarRecomendacoesInsight(analiseClima),
            analise_completa: analiseClima,
            versao_teste: '1.0',
            timestamp_processamento: new Date().toISOString(),
            perguntas_respondidas: perguntasRespondidas || Object.keys(respostas).length
          }
        };

        console.log('🔍 [CLIMA-RESULTADO] Salvando resultado no banco...');
        const resultadoSalvo = await resultadosService.salvarResultado(dadosResultado);
        console.log('✅ [CLIMA-RESULTADO] Resultado salvo com ID:', resultadoSalvo.id);
      }

      setResultado(analiseClima);
      setCarregando(false);

    } catch (error) {
      console.error('❌ [CLIMA-RESULTADO] Erro ao processar resultado:', error);
      setErro(error instanceof Error ? error.message : "Erro desconhecido");
      setCarregando(false);
    }
  };

  const gerarInterpretacao = (analise: ResultadoClimaBemEstar): string => {
    const { mediaGeral, classificacaoGeral, nivelGeral } = analise;
    
    let interpretacao = `Sua avaliação do Clima Organizacional e Bem-Estar Psicológico obteve uma média de ${mediaGeral?.toFixed(2) || 'N/A'} pontos, classificada como "${classificacaoGeral || 'N/A'}". `;
    
    switch (nivelGeral) {
      case 'saudavel':
        interpretacao += "Excelente! Você percebe um ambiente de trabalho muito positivo, com alta segurança psicológica, comunicação eficaz, forte senso de pertencimento e justiça organizacional.";
        break;
      case 'neutro':
        interpretacao += "Você percebe um ambiente de trabalho moderado. Algumas áreas estão funcionando bem, mas há oportunidades de melhoria para criar um clima mais positivo e saudável.";
        break;
      case 'problematico':
        interpretacao += "Atenção! Você percebe desafios significativos no clima organizacional que podem estar impactando seu bem-estar e o de seus colegas. É importante buscar melhorias.";
        break;
    }
    
    return interpretacao;
  };

  const obterCorPorNivel = (nivel: string) => {
    switch (nivel) {
      case 'saudavel': return 'text-green-700 bg-green-100 border-green-300';
      case 'neutro': return 'text-yellow-700 bg-yellow-100 border-yellow-300';
      case 'problematico': return 'text-red-700 bg-red-100 border-red-300';
      default: return 'text-gray-700 bg-gray-100 border-gray-300';
    }
  };

  const obterIconePorNivel = (nivel: string) => {
    switch (nivel) {
      case 'saudavel': return <CheckCircle className="h-5 w-5" />;
      case 'neutro': return <Eye className="h-5 w-5" />;
      case 'problematico': return <AlertTriangle className="h-5 w-5" />;
      default: return <Activity className="h-5 w-5" />;
    }
  };

  const obterIconePorDimensao = (dimensaoId: string) => {
    switch (dimensaoId) {
      case 'segurancaPsicologica': return <Shield className="h-5 w-5" />;
      case 'comunicacaoInterna': return <MessageCircle className="h-5 w-5" />;
      case 'pertencimento': return <UserCheck className="h-5 w-5" />;
      case 'justicaOrganizacional': return <Scale className="h-5 w-5" />;
      default: return <Activity className="h-5 w-5" />;
    }
  };

  const obterNomeDimensao = (dimensaoId: string) => {
    switch (dimensaoId) {
      case 'segurancaPsicologica': return 'Segurança Psicológica';
      case 'comunicacaoInterna': return 'Comunicação Interna';
      case 'pertencimento': return 'Pertencimento e Inclusão';
      case 'justicaOrganizacional': return 'Justiça Organizacional';
      default: return dimensaoId;
    }
  };

  if (carregando) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-emerald-600" />
          <h2 className="text-xl font-semibold text-slate-700">Carregando resultado...</h2>
          <p className="text-slate-500">Aguarde enquanto processamos seus dados</p>
        </div>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-red-600 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Erro ao carregar resultado
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-slate-600">{erro}</p>
            <div className="flex gap-2">
              <Button onClick={() => navigate('/testes')} variant="outline">
                Voltar aos Testes
              </Button>
              <Button onClick={processarResultado}>
                Tentar Novamente
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!resultado) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <AlertTriangle className="h-12 w-12 mx-auto text-orange-500" />
          <h2 className="text-xl font-semibold text-slate-700">Resultado não encontrado</h2>
          <Button onClick={() => navigate('/testes')}>
            Voltar aos Testes
          </Button>
        </div>
      </div>
    );
  }

  // Debug logs para verificar os dados
  console.log('🔍 [RESULTADO-CLIMA-DEBUG] Dados do resultado:', {
    mediaGeral: resultado.mediaGeral,
    nivelGeral: resultado.nivelGeral,
    classificacaoGeral: resultado.classificacaoGeral,
    dimensoes: Object.keys(resultado.dimensoes || {}),
    dimensoesData: resultado.dimensoes
  });

  // Verificar se gerarRecomendacoesInsight retorna dados
  const recomendacoes = gerarRecomendacoesInsight(resultado);
  console.log('🔍 [RESULTADO-CLIMA-DEBUG] Recomendações geradas:', recomendacoes);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => navigate('/testes')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar aos Testes
          </Button>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Baixar PDF
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Compartilhar
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigate('/teste/clima-bem-estar')}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refazer Teste
            </Button>
          </div>
        </div>

        {/* Título e Resumo Geral */}
        <Card className="bg-white shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-t-lg">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold">
                  HumaniQ Insight – Clima e Bem-Estar
                </CardTitle>
                <CardDescription className="text-emerald-100 mt-2">
                  Análise do Clima Organizacional e Bem-Estar Psicológico
                </CardDescription>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">
                  {resultado.mediaGeral?.toFixed(2) || 'N/A'}
                </div>
                <div className="text-sm text-emerald-100">
                  Média Geral
                </div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Classificação Geral */}
              <div className="text-center">
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 ${obterCorPorNivel(resultado.nivelGeral || 'neutro')}`}>
                  {obterIconePorNivel(resultado.nivelGeral || 'neutro')}
                  <span className="font-semibold">{resultado.classificacaoGeral || 'N/A'}</span>
                </div>
                <p className="text-sm text-slate-600 mt-2">Classificação Geral</p>
              </div>

              {/* Nível do Clima */}
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-700 mb-1">
                  {resultado.nivelGeral?.toUpperCase() || 'N/A'}
                </div>
                <p className="text-sm text-slate-600">Nível do Clima</p>
              </div>

              {/* Dimensões Avaliadas */}
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-700 mb-1">
                  4
                </div>
                <p className="text-sm text-slate-600">Dimensões Avaliadas</p>
              </div>
            </div>

            {/* Interpretação */}
            <Alert className="mt-6">
              <Brain className="h-4 w-4" />
              <AlertDescription className="text-base leading-relaxed">
                {gerarInterpretacao(resultado)}
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Análise por Dimensões */}
        <Card className="bg-white shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-emerald-600" />
              Análise por Dimensões
            </CardTitle>
            <CardDescription>
              Detalhamento das pontuações em cada área avaliada
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(resultado.dimensoes).map(([dimensaoId, dados]) => (
                <div key={dimensaoId} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {obterIconePorDimensao(dimensaoId)}
                      <span className="font-semibold text-slate-700">
                        {obterNomeDimensao(dimensaoId)}
                      </span>
                    </div>
                    <Badge className={obterCorPorNivel(dados.nivel)}>
                      {dados.classificacao}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Pontuação: {dados.pontuacao}</span>
                      <span>Média: {dados.media.toFixed(2)}</span>
                    </div>
                    <Progress 
                      value={(dados.media / 5) * 100} 
                      className="h-2"
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Gráfico Radar - Visão Geral das Dimensões */}
        <ClimaBemEstarRadarChart resultado={resultado} />

        {/* Gráfico de Área - Distribuição das Respostas */}
        <ClimaBemEstarAreaChart resultado={resultado} />

        {/* Recomendações */}
        <Card className="bg-white shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-emerald-600" />
              Recomendações Personalizadas
            </CardTitle>
            <CardDescription>
              Sugestões baseadas no seu perfil de clima organizacional
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {gerarRecomendacoesInsight(resultado).map((recomendacao, index) => (
                <div key={index} className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg">
                  <div className="flex-shrink-0 w-6 h-6 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-sm font-semibold">
                    {index + 1}
                  </div>
                  <p className="text-slate-700 text-sm leading-relaxed">
                    {recomendacao}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Próximos Passos */}
        <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-emerald-700">
              <Award className="h-5 w-5" />
              Próximos Passos
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                className="h-auto p-4 flex flex-col items-center gap-2 bg-white text-emerald-700 border-emerald-200 hover:bg-emerald-50"
                variant="outline"
                onClick={() => navigate('/teste/clima-bem-estar')}
              >
                <RefreshCw className="h-6 w-6" />
                <span className="font-semibold">Refazer Teste</span>
                <span className="text-xs text-center">
                  Acompanhe sua evolução
                </span>
              </Button>
              
              <Button 
                className="h-auto p-4 flex flex-col items-center gap-2 bg-white text-emerald-700 border-emerald-200 hover:bg-emerald-50"
                variant="outline"
              >
                <Download className="h-6 w-6" />
                <span className="font-semibold">Baixar Relatório</span>
                <span className="text-xs text-center">
                  PDF completo dos resultados
                </span>
              </Button>
              
              <Button 
                className="h-auto p-4 flex flex-col items-center gap-2 bg-white text-emerald-700 border-emerald-200 hover:bg-emerald-50"
                variant="outline"
                onClick={() => navigate('/testes')}
              >
                <Building2 className="h-6 w-6" />
                <span className="font-semibold">Outros Testes</span>
                <span className="text-xs text-center">
                  Explore outras avaliações
                </span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}