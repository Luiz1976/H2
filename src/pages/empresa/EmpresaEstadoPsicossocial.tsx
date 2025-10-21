import { useQuery } from '@tanstack/react-query';
import { Brain, TrendingUp, AlertCircle, CheckCircle, Activity, BarChart3, Shield, Users, Calendar, Target, FileText, Lock, AlertTriangle, Sparkles, ChevronRight, Info } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface PsychosocialAnalysis {
  indiceGeralBemEstar: number;
  totalColaboradores: number;
  totalTestesRealizados: number;
  testesUltimos30Dias: number;
  cobertura: number;
  dimensoes: Array<{
    dimensaoId: string;
    nome: string;
    percentual: number;
    nivel: string;
    cor: string;
    total: number;
  }>;
  nr1Fatores: Array<{
    fator: string;
    nivel: string;
    percentual: number;
  }>;
  nr1Compliance: {
    status: string;
    ultimaAvaliacao: string | null;
    proximaAvaliacao: string;
    testesRealizados: number;
    cobertura: number;
  };
  alertasCriticos: string[];
  recomendacoes: Array<{
    categoria: string;
    prioridade: string;
    titulo: string;
    descricao: string;
  }>;
  ultimaAtualizacao: string;
}

function getNivelColor(nivel: string): "destructive" | "secondary" | "default" | "outline" {
  const nivelLower = nivel.toLowerCase();
  if (nivelLower.includes('crítico') || nivelLower.includes('alto risco')) return 'destructive';
  if (nivelLower.includes('atenção') || nivelLower.includes('moderado')) return 'destructive';
  if (nivelLower.includes('bom') || nivelLower.includes('excelente')) return 'default';
  return 'secondary';
}

function getNivelBgColor(nivel: string): string {
  const nivelLower = nivel.toLowerCase();
  if (nivelLower.includes('crítico') || nivelLower.includes('alto risco')) return 'bg-red-500';
  if (nivelLower.includes('atenção') || nivelLower.includes('moderado')) return 'bg-orange-500';
  if (nivelLower.includes('bom') || nivelLower.includes('excelente')) return 'bg-green-500';
  return 'bg-gray-500';
}

function getPrioridadeColor(prioridade: string): "destructive" | "secondary" | "default" | "outline" {
  if (prioridade === 'Alta') return 'destructive';
  if (prioridade === 'Média') return 'destructive';
  return 'secondary';
}

export default function EmpresaEstadoPsicossocial() {
  const { data, isLoading, error } = useQuery<{ analise: PsychosocialAnalysis }>({
    queryKey: ['/api/empresas/estado-psicossocial'],
  });

  const analise = data?.analise;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <Skeleton className="h-20 w-full" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20 p-6">
        <div className="max-w-7xl mx-auto">
          <Alert variant="destructive" data-testid="alert-error">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erro ao Carregar Análise</AlertTitle>
            <AlertDescription>
              Não foi possível carregar os dados psicossociais. Por favor, tente novamente.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  const indiceNivel = analise
    ? analise.indiceGeralBemEstar >= 75
      ? 'Excelente'
      : analise.indiceGeralBemEstar >= 60
      ? 'Bom'
      : analise.indiceGeralBemEstar >= 40
      ? 'Atenção'
      : 'Crítico'
    : 'Pendente';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header com LGPD Notice */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-3" data-testid="text-page-title">
                <Brain className="h-8 w-8 text-blue-600" />
                Estado Psicossocial da Empresa
              </h1>
              <p className="text-muted-foreground">
                Monitoramento contínuo do bem-estar organizacional e compliance NR1
              </p>
            </div>
            <Badge variant="outline" className="gap-2" data-testid="badge-lgpd">
              <Shield className="h-4 w-4" />
              LGPD Compliant
            </Badge>
          </div>

          {/* LGPD Privacy Notice */}
          <Alert className="border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/10" data-testid="alert-lgpd-notice">
            <Lock className="h-4 w-4 text-blue-600" />
            <AlertTitle className="text-blue-900 dark:text-blue-100">Proteção de Dados e Privacidade (LGPD - Lei 13.709/2018)</AlertTitle>
            <AlertDescription className="text-sm text-blue-700 dark:text-blue-300">
              <strong>Transparência:</strong> Esta análise utiliza dados anonimizados e agregados de testes psicológicos realizados por colaboradores.
              <strong className="ml-2">Finalidade:</strong> Avaliar riscos psicossociais conforme NR1 e promover bem-estar organizacional.
              <strong className="ml-2">Direitos:</strong> Os colaboradores têm direito de acesso, correção e exclusão de seus dados individuais.
              <strong className="ml-2">IA Explicável:</strong> Análises baseadas em padrões estatísticos validados (ISO 45003, WHO, Karasek-Siegrist).
            </AlertDescription>
          </Alert>
        </div>

        {/* Indicadores Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-blue-500" data-testid="card-bem-estar">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Activity className="h-4 w-4 text-blue-500" />
                Índice de Bem-Estar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-indice-bem-estar">
                {analise?.indiceGeralBemEstar || 0}%
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {indiceNivel} - {analise?.totalTestesRealizados || 0} testes analisados
              </p>
              <Progress value={analise?.indiceGeralBemEstar || 0} className="mt-2" />
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500" data-testid="card-cobertura">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Users className="h-4 w-4 text-green-500" />
                Cobertura de Avaliação
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-cobertura">
                {analise?.cobertura || 0}%
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {analise?.totalColaboradores || 0} colaboradores totais
              </p>
              <Progress value={analise?.cobertura || 0} className="mt-2" />
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500" data-testid="card-nr1">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Shield className="h-4 w-4 text-purple-500" />
                Compliance NR1
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-nr1-status">
                {analise?.nr1Compliance.status || 'Pendente'}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Próxima avaliação: {analise?.nr1Compliance.proximaAvaliacao 
                  ? format(new Date(analise.nr1Compliance.proximaAvaliacao), 'MMM yyyy', { locale: ptBR })
                  : 'Pendente'}
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500" data-testid="card-alertas">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-orange-500" />
                Alertas Críticos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-alertas-count">
                {analise?.alertasCriticos.length || 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {analise?.testesUltimos30Dias || 0} testes nos últimos 30 dias
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs para diferentes análises */}
        <Tabs defaultValue="nr1" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="nr1" data-testid="tab-nr1">NR1 - Riscos Psicossociais</TabsTrigger>
            <TabsTrigger value="dimensoes" data-testid="tab-dimensoes">Dimensões Avaliadas</TabsTrigger>
            <TabsTrigger value="ia" data-testid="tab-ia">Análise por IA</TabsTrigger>
            <TabsTrigger value="acoes" data-testid="tab-acoes">Plano de Ação</TabsTrigger>
          </TabsList>

          {/* NR1 - Fatores de Risco */}
          <TabsContent value="nr1" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-600" />
                  Fatores de Risco Psicossociais (NR1 - Maio 2025)
                </CardTitle>
                <CardDescription>
                  Avaliação conforme Norma Regulamentadora NR1 - Gerenciamento de Riscos Ocupacionais
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {analise?.nr1Fatores.map((fator, index) => (
                  <div key={index} className="space-y-2" data-testid={`nr1-fator-${index}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{fator.fator}</span>
                        <Badge variant={getNivelColor(fator.nivel)}>{fator.nivel}</Badge>
                      </div>
                      <span className="text-sm text-muted-foreground">{fator.percentual}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${getNivelBgColor(fator.nivel)}`}
                        style={{ width: `${fator.percentual}%` }}
                      ></div>
                    </div>
                  </div>
                ))}

                <Separator className="my-4" />

                <Alert className="border-purple-200 dark:border-purple-800 bg-purple-50/50 dark:bg-purple-900/10">
                  <Info className="h-4 w-4 text-purple-600" />
                  <AlertTitle className="text-purple-900 dark:text-purple-100">Sobre a NR1</AlertTitle>
                  <AlertDescription className="text-sm text-purple-700 dark:text-purple-300">
                    A partir de maio de 2025, as empresas devem avaliar e gerenciar riscos psicossociais incluindo:
                    carga de trabalho excessiva, falta de autonomia, assédio, violência, conflitos e falta de suporte.
                    Esta análise identifica áreas de risco e propõe medidas preventivas baseadas em evidências científicas.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Dimensões Psicossociais */}
          <TabsContent value="dimensoes" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  Análise Detalhada por Dimensão
                </CardTitle>
                <CardDescription>
                  Métricas baseadas em frameworks validados: ISO 45003, WHO Well-being, Karasek-Siegrist
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {analise?.dimensoes.length === 0 ? (
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertTitle>Dados Insuficientes</AlertTitle>
                    <AlertDescription>
                      Ainda não há testes suficientes para análise dimensional. Incentive seus colaboradores a realizarem os testes disponíveis.
                    </AlertDescription>
                  </Alert>
                ) : (
                  analise?.dimensoes.map((dimensao, index) => (
                    <div key={index} className="space-y-2" data-testid={`dimensao-${index}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{dimensao.nome}</span>
                          <Badge variant={getNivelColor(dimensao.nivel)}>{dimensao.nivel}</Badge>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {dimensao.percentual}% ({dimensao.total} avaliações)
                        </span>
                      </div>
                      <Progress value={dimensao.percentual} className="h-2" />
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Análise por IA */}
          <TabsContent value="ia" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-purple-600" />
                  Insights Gerados por Inteligência Artificial
                </CardTitle>
                <CardDescription>
                  Análise automatizada baseada em padrões estatísticos e frameworks científicos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Disclaimer LGPD para IA */}
                <Alert className="border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-900/10">
                  <Info className="h-4 w-4 text-amber-600" />
                  <AlertTitle className="text-amber-900 dark:text-amber-100">Transparência em IA (Art. 20, LGPD)</AlertTitle>
                  <AlertDescription className="text-sm text-amber-700 dark:text-amber-300">
                    <strong>Metodologia:</strong> As recomendações são geradas por algoritmos que analisam dados agregados e anonimizados.
                    <strong className="ml-2">Critérios:</strong> Thresholds baseados em pesquisas científicas (OIT, WHO, ISO 45003).
                    <strong className="ml-2">Revisão Humana:</strong> Estes insights devem ser validados por profissionais de RH e saúde ocupacional.
                    <strong className="ml-2">Não-discriminação:</strong> Os algoritmos não utilizam dados demográficos sensíveis.
                  </AlertDescription>
                </Alert>

                {analise?.recomendacoes.length === 0 ? (
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertTitle>Análise em Andamento</AlertTitle>
                    <AlertDescription>
                      Colete mais dados para gerar insights personalizados para sua organização.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <div className="space-y-3">
                    {analise?.recomendacoes.map((rec, index) => (
                      <div 
                        key={index}
                        className="flex gap-3 p-4 rounded-lg border border-border bg-card hover:bg-accent/5 transition-colors"
                        data-testid={`recomendacao-${index}`}
                      >
                        <div className="flex-shrink-0">
                          <Badge variant={getPrioridadeColor(rec.prioridade)}>
                            {rec.prioridade}
                          </Badge>
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-start justify-between">
                            <p className="text-sm font-medium">{rec.titulo}</p>
                            <Badge variant="outline" className="text-xs">
                              {rec.categoria}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{rec.descricao}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Alertas Críticos */}
            {analise && analise.alertasCriticos.length > 0 && (
              <Card className="border-red-200 dark:border-red-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-600">
                    <AlertTriangle className="h-5 w-5" />
                    Situações que Requerem Atenção Imediata
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {analise.alertasCriticos.map((alerta, index) => (
                      <li 
                        key={index}
                        className="flex items-start gap-2 text-sm"
                        data-testid={`alerta-critico-${index}`}
                      >
                        <ChevronRight className="h-4 w-4 mt-0.5 text-red-600 flex-shrink-0" />
                        <span>{alerta}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Plano de Ação */}
          <TabsContent value="acoes" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-green-600" />
                  Plano de Melhoria Contínua
                </CardTitle>
                <CardDescription>
                  Ações recomendadas para fortalecer o ambiente psicossocial
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  {/* Ações Prioritárias */}
                  {analise?.recomendacoes.filter(r => r.prioridade === 'Alta').length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-sm font-semibold text-red-600 dark:text-red-400">
                        Prioridade Alta (Ação Imediata)
                      </h3>
                      {analise.recomendacoes
                        .filter(r => r.prioridade === 'Alta')
                        .map((rec, index) => (
                          <div 
                            key={index}
                            className="flex gap-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800"
                          >
                            <CheckCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                            <div className="space-y-1">
                              <p className="text-sm font-medium">{rec.titulo}</p>
                              <p className="text-xs text-muted-foreground">{rec.descricao}</p>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}

                  {/* Ações de Médio Prazo */}
                  {analise?.recomendacoes.filter(r => r.prioridade === 'Média').length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-sm font-semibold text-orange-600 dark:text-orange-400">
                        Prioridade Média (Próximos 30 Dias)
                      </h3>
                      {analise.recomendacoes
                        .filter(r => r.prioridade === 'Média')
                        .map((rec, index) => (
                          <div 
                            key={index}
                            className="flex gap-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800"
                          >
                            <CheckCircle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                            <div className="space-y-1">
                              <p className="text-sm font-medium">{rec.titulo}</p>
                              <p className="text-xs text-muted-foreground">{rec.descricao}</p>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}

                  {/* Melhores Práticas */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                      Melhores Práticas ISO 45003
                    </h3>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p className="flex items-start gap-2">
                        <ChevronRight className="h-4 w-4 mt-0.5 text-blue-600 flex-shrink-0" />
                        Realize avaliações psicossociais regulares (mínimo anual, idealmente semestral)
                      </p>
                      <p className="flex items-start gap-2">
                        <ChevronRight className="h-4 w-4 mt-0.5 text-blue-600 flex-shrink-0" />
                        Mantenha canais confidenciais para relato de problemas psicossociais
                      </p>
                      <p className="flex items-start gap-2">
                        <ChevronRight className="h-4 w-4 mt-0.5 text-blue-600 flex-shrink-0" />
                        Treine líderes em prevenção de riscos psicossociais e saúde mental
                      </p>
                      <p className="flex items-start gap-2">
                        <ChevronRight className="h-4 w-4 mt-0.5 text-blue-600 flex-shrink-0" />
                        Documente todas as ações de prevenção e intervenção para compliance
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Documentação e Relatórios */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-purple-600" />
                  Documentação e Compliance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Última Análise:</span>
                  {analise?.ultimaAtualizacao 
                    ? format(new Date(analise.ultimaAtualizacao), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })
                    : 'Não disponível'}
                </p>
                <p className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Status NR1:</span>
                  {analise?.nr1Compliance.status}
                </p>
                <p className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Próxima Reavaliação:</span>
                  {analise?.nr1Compliance.proximaAvaliacao 
                    ? format(new Date(analise.nr1Compliance.proximaAvaliacao), "MMMM 'de' yyyy", { locale: ptBR })
                    : 'Pendente'}
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer com informações técnicas */}
        <Card className="border-slate-200 dark:border-slate-800">
          <CardContent className="pt-6">
            <div className="flex gap-3 text-xs text-muted-foreground">
              <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <div className="space-y-1">
                <p className="font-medium">Bases Científicas e Regulatórias</p>
                <p>
                  Esta análise segue padrões internacionais: <strong>ISO 45003:2021</strong> (Saúde e Segurança Psicológica),
                  <strong> OMS - WHO Mental Health at Work</strong>, <strong>Karasek-Siegrist Model</strong> (Job Demand-Control-Support),
                  e atende à <strong>NR1</strong> (Gerenciamento de Riscos Ocupacionais) e <strong>LGPD</strong> (Proteção de Dados).
                  Os dados são agregados e anonimizados para proteger a privacidade individual dos colaboradores.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
