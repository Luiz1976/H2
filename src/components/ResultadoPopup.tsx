import React, { useState, useEffect } from 'react';
import { X, Loader2, AlertTriangle, Eye, Download, Share2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { resultadosService } from '@/lib/database';
import { calcularResultadoKarasekSiegrist, type ResultadoKarasekSiegrist } from '@/lib/testes/karasek-siegrist';
import { KarasekRadarChart } from '@/components/charts/KarasekRadarChart';
import { KarasekGaugeChart } from '@/components/charts/KarasekGaugeChart';
import { KarasekBarChart } from '@/components/charts/KarasekBarChart';
import { KarasekProfessionalAnalysis } from '@/components/analysis/KarasekProfessionalAnalysis';
import { KarasekActionPlan } from '@/components/analysis/KarasekActionPlan';

interface ResultadoTeste {
  id: string;
  nomeTest: string;
  categoria: string;
  pontuacao: number;
  nivel: string;
  dataRealizacao: string;
  tipoTabela?: string;
}

interface ResultadoPopupProps {
  isOpen: boolean;
  onClose: () => void;
  resultado: ResultadoTeste | null;
}

export function ResultadoPopup({ isOpen, onClose, resultado }: ResultadoPopupProps) {
  const [dadosResultado, setDadosResultado] = useState<any>(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && resultado && resultado.id) {
      console.log('🔍 [ResultadoPopup] useEffect - resultado válido:', resultado);
      carregarDadosResultado();
    } else if (isOpen && !resultado) {
      console.warn('⚠️ [ResultadoPopup] useEffect - resultado é null/undefined');
      setErro('Resultado não encontrado');
    }
  }, [isOpen, resultado]);

  const carregarDadosResultado = async () => {
    if (!resultado || !resultado.id) {
      console.error('❌ [ResultadoPopup] Resultado inválido:', resultado);
      setErro('Dados do resultado não encontrados');
      return;
    }

    setCarregando(true);
    setErro(null);

    try {
      console.log('🔍 [ResultadoPopup] Carregando dados para resultado:', resultado.id);
      console.log('🔍 [ResultadoPopup] Tipo de tabela:', resultado.tipoTabela);
      console.log('🔍 [ResultadoPopup] Nome do teste:', resultado.nomeTest || 'Nome não disponível');

      let dadosCompletos = null;

      // Estratégia 1: Tentar buscar usando o serviço principal
      try {
        dadosCompletos = await resultadosService.buscarResultadoPorId(resultado.id);
        console.log('📊 [ResultadoPopup] Dados recebidos via serviço principal:', !!dadosCompletos);
      } catch (error) {
        console.log('⚠️ [ResultadoPopup] Falha no serviço principal:', error);
      }

      // Estratégia 2: Se falhou, tentar buscar diretamente nas tabelas específicas
      if (!dadosCompletos) {
        console.log('🔄 [ResultadoPopup] Tentando busca direta nas tabelas específicas...');
        
        try {
          // Importar supabase diretamente para busca de fallback
          const { supabase } = await import('@/lib/supabase');
          
          // Tentar na tabela resultados primeiro
          let { data, error } = await supabase
            .from('resultados')
            .select('*')
            .eq('id', resultado.id)
            .single();

          // Se não encontrou, tentar na tabela resultados_qvt
          if (error && error.code === 'PGRST116') {
            console.log('🔄 [ResultadoPopup] Tentando na tabela resultados_qvt...');
            const resultQVT = await supabase
              .from('resultados_qvt')
              .select('*')
              .eq('id', resultado.id)
              .single();
            
            data = resultQVT.data;
            error = resultQVT.error;
          }

          // Se ainda não encontrou, tentar na tabela resultados_rpo
          if (error && error.code === 'PGRST116') {
            console.log('🔄 [ResultadoPopup] Tentando na tabela resultados_rpo...');
            try {
              const resultRPO = await supabase
                .from('resultados_rpo')
                .select('*')
                .eq('id', resultado.id)
                .single();
              
              data = resultRPO.data;
              error = resultRPO.error;
            } catch (rpoError) {
              console.log('⚠️ [ResultadoPopup] Tabela resultados_rpo não disponível');
            }
          }

          if (data && !error) {
            console.log('✅ [ResultadoPopup] Dados encontrados via busca direta');
            dadosCompletos = data;
          }
        } catch (directError) {
          console.error('❌ [ResultadoPopup] Erro na busca direta:', directError);
        }
      }

      if (!dadosCompletos) {
        throw new Error('Resultado não encontrado em nenhuma tabela');
      }

      // Verificar se é teste Karasek-Siegrist e tem análise completa
      if (isKarasekSiegrist(resultado) && dadosCompletos.metadados?.analise_completa) {
        console.log('✅ [ResultadoPopup] Teste Karasek-Siegrist com análise completa encontrada');
        setDadosResultado(dadosCompletos.metadados.analise_completa);
      } else {
        console.log('⚠️ [ResultadoPopup] Teste genérico ou sem análise completa');
        // Para resultados QVT, mapear os campos específicos
        if (resultado.tipoTabela === 'resultados_qvt' || dadosCompletos.indice_geral !== undefined) {
          const dadosQVT = {
            id: dadosCompletos.id,
            pontuacao: Math.round((dadosCompletos.indice_geral || 0) * 20),
            nivel: dadosCompletos.nivel_geral || 'Não definido',
            percentual: dadosCompletos.percentual_geral || 0,
            indice_geral: dadosCompletos.indice_geral,
            satisfacao_funcao: dadosCompletos.satisfacao_funcao,
            relacao_lideranca: dadosCompletos.relacao_lideranca,
            estrutura_condicoes: dadosCompletos.estrutura_condicoes,
            recompensas_remuneracao: dadosCompletos.recompensas_remuneracao,
            equilibrio_vida_trabalho: dadosCompletos.equilibrio_vida_trabalho,
            dimensoes_criticas: dadosCompletos.dimensoes_criticas,
            pontos_fortes: dadosCompletos.pontos_fortes,
            risco_turnover: dadosCompletos.risco_turnover
          };
          setDadosResultado(dadosQVT);
        } else {
          setDadosResultado(dadosCompletos);
        }
      }

    } catch (error) {
      console.error('❌ [ResultadoPopup] Erro ao carregar dados:', error);
      setErro('Não foi possível carregar os dados do resultado');
    } finally {
      setCarregando(false);
    }
  };

  // Função para identificar se é um teste Karasek-Siegrist
  const isKarasekSiegrist = (resultado: ResultadoTeste): boolean => {
    if (!resultado) return false;
    
    const nomeTest = resultado.nomeTest?.toLowerCase() || '';
    return nomeTest.includes('karasek') || nomeTest.includes('siegrist') || 
           nomeTest.includes('demanda') || nomeTest.includes('controle') ||
           nomeTest.includes('esforço') || nomeTest.includes('recompensa');
  };

  // Função para identificar se é um teste de Clima Organizacional
  const isClimaOrganizacional = (resultado: ResultadoTeste): boolean => {
    if (!resultado) return false;
    
    const nomeTest = resultado.nomeTest?.toLowerCase() || '';
    return nomeTest.includes('clima organizacional') || 
           nomeTest.includes('pesquisa de clima') ||
           nomeTest === 'pesquisa de clima organizacional';
  };

  // Função para identificar se é um teste RPO (Riscos Psicossociais Ocupacionais)
  const isRPO = (resultado: ResultadoTeste): boolean => {
    if (!resultado) return false;
    
    const nomeTest = resultado.nomeTest?.toLowerCase() || '';
    return nomeTest.includes('rpo') || 
           nomeTest.includes('riscos psicossociais') ||
           nomeTest.includes('humaniq rpo') ||
           nomeTest === 'humaniq rpo - riscos psicossociais ocupacionais';
  };

  // Função para identificar se é um teste QVT (Qualidade de Vida no Trabalho)
  const isQVT = (resultado: ResultadoTeste): boolean => {
    if (!resultado) return false;
    
    const nomeTest = resultado.nomeTest?.toLowerCase() || '';
    return nomeTest.includes('qvt') || 
           nomeTest.includes('qualidade de vida') ||
           nomeTest.includes('qualidade vida trabalho') ||
           nomeTest.includes('vida no trabalho') ||
           nomeTest === 'qualidade de vida no trabalho';
  };

  const renderKarasekSiegristContent = (dados: ResultadoKarasekSiegrist) => (
    <div className="space-y-6">
      {/* Resumo Executivo */}
      <div className="bg-gradient-to-br from-slate-50 to-white p-6 rounded-xl border border-slate-200/60">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Resumo Executivo</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-1">
              {dados.riscoGeral.percentual}%
            </div>
            <div className="text-sm font-medium text-slate-600">Pontuação Total</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border border-emerald-100">
            <Badge className={`${obterCorRisco(dados.riscoGeral.nivel)} text-sm font-medium px-3 py-1`}>
              {dados.riscoGeral.classificacao}
            </Badge>
            <div className="text-sm font-medium text-slate-600 mt-1">Nível de Risco</div>
          </div>
        </div>
      </div>

      {/* Gráfico de Gauge */}
      <div className="bg-white p-6 rounded-xl border border-slate-200/60">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Nível de Risco Psicossocial</h3>
        <KarasekGaugeChart resultado={dados} />
      </div>

      {/* Gráfico Radar */}
      <div className="bg-white p-6 rounded-xl border border-slate-200/60">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Perfil Psicossocial</h3>
        <KarasekRadarChart resultado={dados} />
      </div>

      {/* Gráfico de Barras */}
      <div className="bg-white p-6 rounded-xl border border-slate-200/60">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Comparativo por Dimensões</h3>
        <KarasekBarChart resultado={dados} />
      </div>

      {/* Análise Profissional */}
      <KarasekProfessionalAnalysis resultado={dados} />

      {/* Plano de Ação */}
      <KarasekActionPlan resultado={dados} />
    </div>
  );

  const renderClimaOrganizacionalContent = (dados: any) => {
    // Extrair dados dos metadados se disponível
    const metadados = dados.metadados || dados;
    const analiseCompleta = metadados.analise_completa || {};
    const pontuacoesDimensoes = metadados.pontuacoes_dimensoes || {};
    
    return (
      <div className="space-y-6">
        {/* Resumo Executivo */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200/60">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Pesquisa de Clima Organizacional</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-1">
                {metadados.pontuacao_total || analiseCompleta.mediaGeral || 'N/A'}
              </div>
              <div className="text-sm font-medium text-slate-600">Pontuação Geral</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border border-emerald-100">
              <Badge className="text-sm font-medium px-3 py-1 bg-emerald-100 text-emerald-800 border border-emerald-200">
                {analiseCompleta.classificacaoGeral || analiseCompleta.nivelGeral || 'Não definido'}
              </Badge>
              <div className="text-sm font-medium text-slate-600 mt-1">Classificação</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl border border-purple-100">
              <div className="text-lg font-bold text-purple-600">
                {metadados.usuario_nome || 'Usuário'}
              </div>
              <div className="text-sm font-medium text-slate-600">Avaliado</div>
            </div>
          </div>
        </div>

        {/* Dimensões do Clima Organizacional */}
        {pontuacoesDimensoes && Object.keys(pontuacoesDimensoes).length > 0 && (
          <div className="bg-white p-6 rounded-xl border border-slate-200/60">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Dimensões Avaliadas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(pontuacoesDimensoes).map(([dimensao, pontuacao]) => (
                <div key={dimensao} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="text-sm text-slate-600 mb-2 capitalize">
                    {dimensao.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').trim()}
                  </div>
                  <div className="text-lg font-semibold text-slate-800">
                    {typeof pontuacao === 'number' ? pontuacao.toFixed(1) : pontuacao}
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 mt-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, Math.max(0, (typeof pontuacao === 'number' ? pontuacao : 0) * 10))}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Interpretação e Recomendações */}
        {(metadados.interpretacao || metadados.recomendacoes) && (
          <div className="bg-white p-6 rounded-xl border border-slate-200/60">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Análise e Recomendações</h3>
            <div className="space-y-4">
              {metadados.interpretacao && (
                <div>
                  <div className="text-sm font-medium text-blue-600 mb-2">Interpretação:</div>
                  <div className="text-sm text-slate-700 bg-blue-50 p-4 rounded-lg border border-blue-200">
                    {Array.isArray(metadados.interpretacao) 
                      ? metadados.interpretacao.join(' ') 
                      : metadados.interpretacao}
                  </div>
                </div>
              )}
              {metadados.recomendacoes && (
                <div>
                  <div className="text-sm font-medium text-green-600 mb-2">Recomendações:</div>
                  <div className="text-sm text-slate-700 bg-green-50 p-4 rounded-lg border border-green-200">
                    {Array.isArray(metadados.recomendacoes) 
                      ? metadados.recomendacoes.map((rec: string, index: number) => (
                          <div key={index} className="mb-2 last:mb-0">• {rec}</div>
                        ))
                      : metadados.recomendacoes}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Informações Técnicas */}
        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200/60">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Informações da Avaliação</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-slate-600">Versão do Teste:</span>
              <span className="ml-2 font-medium">{metadados.versao_teste || '1.0'}</span>
            </div>
            <div>
              <span className="text-slate-600">Data de Processamento:</span>
              <span className="ml-2 font-medium">
                {metadados.timestamp_processamento 
                  ? new Date(metadados.timestamp_processamento).toLocaleDateString('pt-BR')
                  : 'N/A'}
              </span>
            </div>
            <div>
              <span className="text-slate-600">E-mail:</span>
              <span className="ml-2 font-medium">{metadados.usuario_email || 'N/A'}</span>
            </div>
            <div>
              <span className="text-slate-600">Tipo de Teste:</span>
              <span className="ml-2 font-medium capitalize">{metadados.tipo_teste || 'clima-organizacional'}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderRPOContent = (dados: any) => {
    // Extrair dados dos metadados se disponível
    const metadados = dados.metadados || dados;
    const analiseCompleta = metadados.analise_completa || {};
    const pontuacoesDimensoes = metadados.pontuacoes_dimensoes || {};
    
    // Função para obter cor baseada no nível de risco
    const obterCorRiscoRPO = (nivel: string) => {
      switch (nivel?.toLowerCase()) {
        case 'baixo':
          return 'bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-800 border border-emerald-200';
        case 'moderado':
          return 'bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 border border-amber-200';
        case 'alto':
          return 'bg-gradient-to-r from-orange-100 to-red-100 text-orange-800 border border-orange-200';
        case 'muito alto':
          return 'bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border border-red-200';
        default:
          return 'bg-gradient-to-r from-slate-100 to-gray-100 text-slate-800 border border-slate-200';
      }
    };
  
    return (
      <div className="space-y-6">
        {/* Resumo Executivo */}
        <div className="bg-gradient-to-br from-red-50 to-orange-50 p-6 rounded-xl border border-red-200/60">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">HumaniQ RPO - Riscos Psicossociais Ocupacionais</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-1">
                {metadados.pontuacao_total || analiseCompleta.indiceGeralRisco || 'N/A'}
              </div>
              <div className="text-sm font-medium text-slate-600">Índice Geral de Risco</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl border border-orange-100">
              <Badge className={`text-sm font-medium px-3 py-1 ${obterCorRisco(analiseCompleta.classificacaoGeral || analiseCompleta.nivelGeral || 'moderado')}`}>
                {analiseCompleta.classificacaoGeral || analiseCompleta.nivelGeral || 'Não definido'}
              </Badge>
              <div className="text-sm font-medium text-slate-600 mt-1">Classificação de Risco</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl border border-purple-100">
              <div className="text-lg font-bold text-purple-600">
                {metadados.usuario_nome || 'Usuário'}
              </div>
              <div className="text-sm font-medium text-slate-600">Avaliado</div>
            </div>
          </div>
        </div>

        {/* Alertas Críticos */}
        {analiseCompleta.alertasCriticos && analiseCompleta.alertasCriticos.length > 0 && (
          <div className="bg-red-50 p-6 rounded-xl border border-red-200/60">
            <h3 className="text-lg font-semibold text-red-800 mb-4 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Alertas Críticos
            </h3>
            <div className="space-y-2">
              {analiseCompleta.alertasCriticos.map((alerta: string, index: number) => (
                <div key={index} className="flex items-start gap-2 text-sm text-red-700 bg-red-100 p-3 rounded-lg border border-red-200">
                  <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>{alerta}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dimensões dos Riscos Psicossociais */}
        {pontuacoesDimensoes && Object.keys(pontuacoesDimensoes).length > 0 && (
          <div className="bg-white p-6 rounded-xl border border-slate-200/60">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Dimensões dos Riscos Psicossociais</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(pontuacoesDimensoes).map(([dimensao, dados]) => {
                const dadosDimensao = typeof dados === 'object' ? dados as any : { media: dados };
                const media = dadosDimensao.media || dadosDimensao.pontuacao || dados;
                const classificacao = dadosDimensao.classificacao || 'Não definido';
                
                return (
                  <div key={dimensao} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="text-sm text-slate-600 mb-2 capitalize">
                      {dimensao.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').trim()}
                    </div>
                    <div className="text-lg font-semibold text-slate-800 mb-1">
                      {typeof media === 'number' ? media.toFixed(1) : media}
                    </div>
                    <Badge className={`text-xs px-2 py-1 ${obterCorRisco(classificacao)}`}>
                      {classificacao}
                    </Badge>
                    <div className="w-full bg-slate-200 rounded-full h-2 mt-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          classificacao?.toLowerCase() === 'alto' || classificacao?.toLowerCase() === 'muito alto' 
                            ? 'bg-gradient-to-r from-red-500 to-orange-500'
                            : classificacao?.toLowerCase() === 'moderado'
                            ? 'bg-gradient-to-r from-amber-500 to-yellow-500'
                            : 'bg-gradient-to-r from-emerald-500 to-teal-500'
                        }`}
                        style={{ width: `${Math.min(100, Math.max(0, (typeof media === 'number' ? media : 0) * 20))}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Interpretação e Recomendações */}
        {(metadados.interpretacao || metadados.recomendacoes || analiseCompleta.interpretacao || analiseCompleta.recomendacoes) && (
          <div className="bg-white p-6 rounded-xl border border-slate-200/60">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Análise e Recomendações</h3>
            <div className="space-y-4">
              {(metadados.interpretacao || analiseCompleta.interpretacao) && (
                <div>
                  <div className="text-sm font-medium text-blue-600 mb-2">Interpretação dos Riscos:</div>
                  <div className="text-sm text-slate-700 bg-blue-50 p-4 rounded-lg border border-blue-200">
                    {Array.isArray(metadados.interpretacao || analiseCompleta.interpretacao) 
                      ? (metadados.interpretacao || analiseCompleta.interpretacao).join(' ') 
                      : (metadados.interpretacao || analiseCompleta.interpretacao)}
                  </div>
                </div>
              )}
              {(metadados.recomendacoes || analiseCompleta.recomendacoes) && (
                <div>
                  <div className="text-sm font-medium text-green-600 mb-2">Recomendações de Intervenção:</div>
                  <div className="text-sm text-slate-700 bg-green-50 p-4 rounded-lg border border-green-200">
                    {Array.isArray(metadados.recomendacoes || analiseCompleta.recomendacoes) 
                      ? (metadados.recomendacoes || analiseCompleta.recomendacoes).map((rec: string, index: number) => (
                          <div key={index} className="mb-2 last:mb-0">• {rec}</div>
                        ))
                      : (metadados.recomendacoes || analiseCompleta.recomendacoes)}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Informações Técnicas */}
        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200/60">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Informações da Avaliação</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-slate-600">Versão do Teste:</span>
              <span className="ml-2 font-medium">{metadados.versao_teste || '1.0'}</span>
            </div>
            <div>
              <span className="text-slate-600">Data de Processamento:</span>
              <span className="ml-2 font-medium">
                {metadados.timestamp_processamento 
                  ? new Date(metadados.timestamp_processamento).toLocaleDateString('pt-BR')
                  : 'N/A'}
              </span>
            </div>
            <div>
              <span className="text-slate-600">E-mail:</span>
              <span className="ml-2 font-medium">{metadados.usuario_email || 'N/A'}</span>
            </div>
            <div>
              <span className="text-slate-600">Tipo de Teste:</span>
              <span className="ml-2 font-medium capitalize">{metadados.tipo_teste || 'rpo'}</span>
            </div>
            {metadados.perguntas_respondidas && (
              <div>
                <span className="text-slate-600">Perguntas Respondidas:</span>
                <span className="ml-2 font-medium">{metadados.perguntas_respondidas}</span>
              </div>
            )}
            <div>
              <span className="text-slate-600">Tempo de Avaliação:</span>
              <span className="ml-2 font-medium">{dados.tempo_gasto || 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderQVTContent = (dados: any) => {
    // Extrair dados dos metadados se disponível
    const metadados = dados.metadados || dados;
    
    // Função para obter cor baseada na pontuação
    const obterCorPontuacao = (pontuacao: number) => {
      if (pontuacao >= 4.0) return 'bg-green-500';
      if (pontuacao >= 3.5) return 'bg-lime-500';
      if (pontuacao >= 3.0) return 'bg-yellow-500';
      if (pontuacao >= 2.5) return 'bg-orange-500';
      return 'bg-red-500';
    };

    // Função para obter classificação baseada na pontuação
    const obterClassificacao = (pontuacao: number) => {
      if (pontuacao >= 4.0) return 'Excelente';
      if (pontuacao >= 3.5) return 'Bom';
      if (pontuacao >= 3.0) return 'Regular';
      if (pontuacao >= 2.5) return 'Baixo';
      return 'Crítico';
    };

    // Dimensões QVT
    const dimensoes = [
      { nome: 'Satisfação com a Função', valor: dados.satisfacao_funcao || 0, key: 'satisfacao_funcao' },
      { nome: 'Relação com Liderança', valor: dados.relacao_lideranca || 0, key: 'relacao_lideranca' },
      { nome: 'Estrutura e Condições', valor: dados.estrutura_condicoes || 0, key: 'estrutura_condicoes' },
      { nome: 'Recompensas e Remuneração', valor: dados.recompensas_remuneracao || 0, key: 'recompensas_remuneracao' },
      { nome: 'Equilíbrio Vida-Trabalho', valor: dados.equilibrio_vida_trabalho || 0, key: 'equilibrio_vida_trabalho' }
    ];

    // Identificar pontos fortes e críticos
    const pontoFortes = dimensoes.filter(d => d.valor >= 4.0);
    const dimensoesCriticas = dimensoes.filter(d => d.valor < 2.5);
    const riscoTurnover = dados.risco_turnover || dados.indice_geral < 2.5;

    return (
      <div className="space-y-6">
        {/* Resumo Executivo */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200/60">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Qualidade de Vida no Trabalho - Resumo Executivo</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-white rounded-xl border border-blue-100">
              <div className="text-3xl font-bold text-blue-600 mb-1">
                {(dados.indice_geral || 0).toFixed(1)}/5.0
              </div>
              <div className="text-sm font-medium text-slate-600">Índice Geral</div>
            </div>
            <div className="text-center p-4 bg-white rounded-xl border border-blue-100">
              <Badge className={`${obterCorPontuacao(dados.indice_geral || 0)} text-white text-sm font-medium px-3 py-1`}>
                {dados.nivel_geral || obterClassificacao(dados.indice_geral || 0)}
              </Badge>
              <div className="text-sm font-medium text-slate-600 mt-1">Classificação</div>
            </div>
            <div className="text-center p-4 bg-white rounded-xl border border-blue-100">
              <div className="text-2xl font-bold text-slate-800 mb-1">
                {(dados.percentual_geral || ((dados.indice_geral || 0) / 5) * 100).toFixed(0)}%
              </div>
              <div className="text-sm font-medium text-slate-600">Percentual Geral</div>
            </div>
          </div>
        </div>

        {/* Alertas Críticos */}
        {(riscoTurnover || dimensoesCriticas.length > 0) && (
          <div className="bg-gradient-to-br from-red-50 to-orange-50 p-6 rounded-xl border border-red-200/60">
            <h3 className="text-lg font-semibold text-red-800 mb-4 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Alertas Críticos
            </h3>
            <div className="space-y-3">
              {riscoTurnover && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-800">
                    <strong>Risco de Turnover Elevado:</strong> O índice geral indica alta probabilidade de rotatividade.
                  </AlertDescription>
                </Alert>
              )}
              {dimensoesCriticas.length > 0 && (
                <Alert className="border-orange-200 bg-orange-50">
                  <AlertDescription className="text-orange-800">
                    <strong>Dimensões Críticas:</strong> {dimensoesCriticas.map(d => d.nome).join(', ')} requerem atenção imediata.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </div>
        )}

        {/* Dimensões da Qualidade de Vida */}
        <div className="bg-white p-6 rounded-xl border border-slate-200/60">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Avaliação por Dimensões</h3>
          <div className="space-y-4">
            {dimensoes.map((dimensao, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-700">{dimensao.nome}</span>
                  <div className="flex items-center gap-2">
                    <Badge className={`${obterCorPontuacao(dimensao.valor)} text-white text-xs px-2 py-1`}>
                      {obterClassificacao(dimensao.valor)}
                    </Badge>
                    <span className="text-sm font-bold text-slate-800">{dimensao.valor.toFixed(1)}/5.0</span>
                  </div>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${obterCorPontuacao(dimensao.valor)}`}
                    style={{ width: `${(dimensao.valor / 5) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pontos Fortes */}
        {pontoFortes.length > 0 && (
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200/60">
            <h3 className="text-lg font-semibold text-green-800 mb-4">Pontos Fortes</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {pontoFortes.map((ponto, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-green-100">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div>
                    <div className="font-medium text-green-800">{ponto.nome}</div>
                    <div className="text-sm text-green-600">{ponto.valor.toFixed(1)}/5.0</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recomendações */}
        {(dados.recomendacoes || dados.insights) && (
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-xl border border-indigo-200/60">
            <h3 className="text-lg font-semibold text-indigo-800 mb-4">Recomendações e Insights</h3>
            <div className="space-y-3">
              {dados.recomendacoes && Array.isArray(dados.recomendacoes) && dados.recomendacoes.map((rec, index) => (
                <div key={index} className="p-4 bg-white rounded-lg border border-indigo-100">
                  <div className="text-sm text-indigo-800">{rec}</div>
                </div>
              ))}
              {dados.insights && Array.isArray(dados.insights) && dados.insights.map((insight, index) => (
                <div key={index} className="p-4 bg-white rounded-lg border border-purple-100">
                  <div className="text-sm text-purple-800">{insight}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Informações Técnicas */}
        <div className="bg-gradient-to-br from-slate-50 to-gray-50 p-6 rounded-xl border border-slate-200/60">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Informações Técnicas</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-slate-600">ID do Resultado:</span>
              <span className="ml-2 font-medium">{dados.id || 'N/A'}</span>
            </div>
            <div>
              <span className="text-slate-600">Data de Realização:</span>
              <span className="ml-2 font-medium">{dados.created_at ? new Date(dados.created_at).toLocaleDateString('pt-BR') : 'N/A'}</span>
            </div>
            <div>
              <span className="text-slate-600">Total de Perguntas:</span>
              <span className="ml-2 font-medium">{dados.total_perguntas || 'N/A'}</span>
            </div>
            <div>
              <span className="text-slate-600">Sessão:</span>
              <span className="ml-2 font-medium">{dados.session_id || 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderGenericContent = (dados: any) => {
    // Verificar se é um resultado QVT com dados específicos
    if (dados.indice_geral !== undefined || dados.satisfacao_funcao !== undefined) {
      return (
        <div className="space-y-6">
          {/* Resumo Geral */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200/60">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Qualidade de Vida no Trabalho</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <div className="text-sm text-slate-600">Índice Geral:</div>
                <div className="text-2xl font-bold text-blue-600">{dados.indice_geral?.toFixed(2) || 'N/A'}</div>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-slate-600">Nível:</div>
                <Badge variant="outline" className="text-sm">
                  {dados.nivel || resultado?.nivel || 'Não definido'}
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-slate-600">Percentual:</div>
                <div className="text-xl font-bold text-slate-800">{dados.percentual || resultado?.pontuacao || 0}%</div>
              </div>
            </div>
          </div>

          {/* Dimensões QVT */}
          <div className="bg-white p-6 rounded-xl border border-slate-200/60">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Dimensões Avaliadas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dados.satisfacao_funcao !== undefined && (
                <div className="p-4 bg-slate-50 rounded-lg">
                  <div className="text-sm text-slate-600 mb-1">Satisfação com a Função</div>
                  <div className="text-lg font-semibold text-slate-800">{dados.satisfacao_funcao?.toFixed(2) || 'N/A'}</div>
                </div>
              )}
              {dados.relacao_lideranca !== undefined && (
                <div className="p-4 bg-slate-50 rounded-lg">
                  <div className="text-sm text-slate-600 mb-1">Relação com Liderança</div>
                  <div className="text-lg font-semibold text-slate-800">{dados.relacao_lideranca?.toFixed(2) || 'N/A'}</div>
                </div>
              )}
              {dados.estrutura_condicoes !== undefined && (
                <div className="p-4 bg-slate-50 rounded-lg">
                  <div className="text-sm text-slate-600 mb-1">Estrutura e Condições</div>
                  <div className="text-lg font-semibold text-slate-800">{dados.estrutura_condicoes?.toFixed(2) || 'N/A'}</div>
                </div>
              )}
              {dados.recompensas_remuneracao !== undefined && (
                <div className="p-4 bg-slate-50 rounded-lg">
                  <div className="text-sm text-slate-600 mb-1">Recompensas e Remuneração</div>
                  <div className="text-lg font-semibold text-slate-800">{dados.recompensas_remuneracao?.toFixed(2) || 'N/A'}</div>
                </div>
              )}
              {dados.equilibrio_vida_trabalho !== undefined && (
                <div className="p-4 bg-slate-50 rounded-lg">
                  <div className="text-sm text-slate-600 mb-1">Equilíbrio Vida-Trabalho</div>
                  <div className="text-lg font-semibold text-slate-800">{dados.equilibrio_vida_trabalho?.toFixed(2) || 'N/A'}</div>
                </div>
              )}
            </div>
          </div>

          {/* Análises Específicas */}
          {(dados.dimensoes_criticas || dados.pontos_fortes || dados.risco_turnover !== undefined) && (
            <div className="bg-white p-6 rounded-xl border border-slate-200/60">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Análise Detalhada</h3>
              <div className="space-y-4">
                {dados.dimensoes_criticas && (
                  <div>
                    <div className="text-sm font-medium text-red-600 mb-2">Dimensões Críticas:</div>
                    <div className="text-sm text-slate-700 bg-red-50 p-3 rounded-lg border border-red-200">
                      {Array.isArray(dados.dimensoes_criticas) ? dados.dimensoes_criticas.join(', ') : dados.dimensoes_criticas}
                    </div>
                  </div>
                )}
                {dados.pontos_fortes && (
                  <div>
                    <div className="text-sm font-medium text-green-600 mb-2">Pontos Fortes:</div>
                    <div className="text-sm text-slate-700 bg-green-50 p-3 rounded-lg border border-green-200">
                      {Array.isArray(dados.pontos_fortes) ? dados.pontos_fortes.join(', ') : dados.pontos_fortes}
                    </div>
                  </div>
                )}
                {dados.risco_turnover !== undefined && (
                  <div>
                    <div className="text-sm font-medium text-orange-600 mb-2">Risco de Turnover:</div>
                    <div className="text-sm text-slate-700 bg-orange-50 p-3 rounded-lg border border-orange-200">
                      {dados.risco_turnover ? 'Alto risco identificado' : 'Risco baixo ou moderado'}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      );
    }

    // Renderização genérica para outros tipos de teste
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-br from-slate-50 to-white p-6 rounded-xl border border-slate-200/60">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Informações do Resultado</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="text-sm text-slate-600">Pontuação:</div>
              <div className="text-xl font-bold text-slate-800">{resultado?.pontuacao || dados?.pontuacao || 'N/A'}%</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-slate-600">Nível:</div>
              <Badge variant="outline" className="text-sm">
                {resultado?.nivel || dados?.nivel || 'Não definido'}
              </Badge>
            </div>
          </div>
          
          {/* Mostrar dados brutos se disponíveis */}
          {dados && Object.keys(dados).length > 0 && (
            <div className="mt-4 pt-4 border-t border-slate-200">
              <div className="text-sm text-slate-600 mb-2">Dados do Resultado:</div>
              <div className="bg-slate-100 p-3 rounded-lg text-xs font-mono text-slate-700 max-h-40 overflow-y-auto">
                {JSON.stringify(dados, null, 2)}
              </div>
            </div>
          )}
        </div>
        
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Visualização detalhada específica não disponível para este tipo de teste. Os dados básicos estão sendo exibidos acima.
          </AlertDescription>
        </Alert>
      </div>
    );
  };

  const obterCorRisco = (nivelRisco: string) => {
    switch (nivelRisco?.toLowerCase()) {
      case 'baixo':
        return 'bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-800 border border-emerald-200';
      case 'moderado':
        return 'bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 border border-amber-200';
      case 'alto':
        return 'bg-gradient-to-r from-orange-100 to-red-100 text-orange-800 border border-orange-200';
      case 'muito alto':
        return 'bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border border-red-200';
      default:
        return 'bg-gradient-to-r from-slate-100 to-gray-100 text-slate-800 border border-slate-200';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl">
            <Eye className="h-5 w-5" />
            {(resultado && resultado.nomeTest) ? resultado.nomeTest : 'Resultado do Teste'}
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          {carregando && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <span className="ml-2 text-slate-600">Carregando resultado...</span>
            </div>
          )}

          {erro && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Erro ao carregar resultado: {erro}
              </AlertDescription>
            </Alert>
          )}

          {!carregando && !erro && dadosResultado && (
              <>
                {isKarasekSiegrist(resultado!) ? 
                  renderKarasekSiegristContent(dadosResultado) : 
                  isClimaOrganizacional(resultado!) ?
                  renderClimaOrganizacionalContent(dadosResultado) :
                  isRPO(resultado!) ?
                  renderRPOContent(dadosResultado) :
                  isQVT(resultado!) ?
                  renderQVTContent(dadosResultado) :
                  renderGenericContent(dadosResultado)
                }
              </>
            )}
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Baixar PDF
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Share2 className="h-4 w-4" />
            Compartilhar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}