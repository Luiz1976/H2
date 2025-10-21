import { useQuery } from '@tanstack/react-query';
import { Brain, Heart, Shield, Users, TrendingUp, AlertCircle, CheckCircle, Activity, Target, Sparkles, Lock, Info, ChevronRight, ArrowRight, Star, Zap, Eye, Award, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
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

function getWellbeingMessage(score: number): { title: string; message: string; color: string } {
  if (score >= 75) {
    return {
      title: "Ambiente Psicossocial Excepcional",
      message: "Sua organização cultiva um espaço onde as pessoas florescem. Continue nutrindo esse ecossistema de bem-estar.",
      color: "from-emerald-500 to-teal-600"
    };
  } else if (score >= 60) {
    return {
      title: "Caminho Promissor de Evolução",
      message: "Você está construindo algo especial. Pequenos ajustes podem transformar um bom ambiente em extraordinário.",
      color: "from-blue-500 to-indigo-600"
    };
  } else if (score >= 40) {
    return {
      title: "Momento de Transformação",
      message: "Cada desafio é uma oportunidade disfarçada. Vamos juntos converter esses dados em ações que transformam vidas.",
      color: "from-amber-500 to-orange-600"
    };
  } else {
    return {
      title: "Tempo de Cuidado Urgente",
      message: "Seus colaboradores precisam de você agora. Este é o momento de agir com coragem e compaixão.",
      color: "from-rose-500 to-red-600"
    };
  }
}

function CircularProgress({ value, size = 160, strokeWidth = 12, label, sublabel }: { 
  value: number; 
  size?: number; 
  strokeWidth?: number;
  label: string;
  sublabel: string;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;
  
  const getColor = (val: number) => {
    if (val >= 75) return "#10b981";
    if (val >= 60) return "#3b82f6";
    if (val >= 40) return "#f59e0b";
    return "#ef4444";
  };

  return (
    <div className="relative inline-flex flex-col items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-slate-200 dark:text-slate-700"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={getColor(value)}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out drop-shadow-lg"
          style={{
            filter: `drop-shadow(0 0 8px ${getColor(value)}40)`
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-4xl font-black bg-gradient-to-br from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
          {value}%
        </div>
        <div className="text-xs font-bold text-slate-600 dark:text-slate-400 mt-1 uppercase tracking-wider">
          {label}
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-500">
          {sublabel}
        </div>
      </div>
    </div>
  );
}

function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  return (
    <div className="text-5xl font-black bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-pulse">
      {value}{suffix}
    </div>
  );
}

export default function EmpresaEstadoPsicossocial() {
  const { data, isLoading, error } = useQuery<{ analise: PsychosocialAnalysis }>({
    queryKey: ['/api/empresas/estado-psicossocial'],
  });

  const analise = data?.analise;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-600/20 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-blue-600/20 via-transparent to-transparent"></div>
        
        <div className="relative max-w-7xl mx-auto p-6 space-y-8">
          <div className="text-center space-y-4 py-12">
            <div className="inline-block p-6 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl">
              <Brain className="h-16 w-16 text-white animate-pulse" />
            </div>
            <h2 className="text-3xl font-bold text-white animate-pulse">
              Analisando o Pulso da sua Organização...
            </h2>
            <p className="text-white/70">Preparando insights que transformam</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-40 bg-white/10 backdrop-blur-xl rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800 p-6 flex items-center justify-center">
        <div className="max-w-2xl mx-auto">
          <Alert variant="destructive" className="border-2 shadow-2xl" data-testid="alert-error">
            <AlertCircle className="h-6 w-6" />
            <AlertTitle className="text-xl font-bold">Ops! Algo não saiu como esperado</AlertTitle>
            <AlertDescription className="mt-2">
              <p>Não conseguimos carregar a análise psicossocial neste momento.</p>
              <p className="mt-2 text-sm">Por favor, aguarde alguns instantes e tente novamente. Se o problema persistir, nossa equipe está pronta para ajudar.</p>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  const wellbeingInfo = getWellbeingMessage(analise?.indiceGeralBemEstar || 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-600/20 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-blue-600/20 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-pink-600/10 via-transparent to-transparent animate-pulse"></div>
      
      {/* Floating particles effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${10 + Math.random() * 20}s`
            }}
          />
        ))}
      </div>

      <div className="relative max-w-7xl mx-auto p-6 space-y-8">
        {/* HERO SECTION - IMPACTO EMOCIONAL IMEDIATO */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 blur-3xl -z-10"></div>
          
          <Card className="border-0 bg-white/10 backdrop-blur-2xl shadow-2xl rounded-3xl overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-blue-500/30 to-cyan-500/30 rounded-full blur-3xl -z-10 -translate-x-1/2 translate-y-1/2"></div>
            
            <CardContent className="p-12">
              <div className="flex items-start justify-between gap-8 flex-wrap">
                <div className="flex-1 min-w-[300px] space-y-6">
                  {/* Icon & Title */}
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl blur-lg opacity-75 animate-pulse"></div>
                      <div className="relative p-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl">
                        <Heart className="h-12 w-12 text-white" />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-4xl font-black text-white" data-testid="text-page-title">
                          Estado Psicossocial
                        </h1>
                        <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 backdrop-blur-xl">
                          <Sparkles className="h-3 w-3 mr-1" />
                          IA Ativa
                        </Badge>
                      </div>
                      <p className="text-white/70 text-lg font-medium">
                        Inteligência que cuida de pessoas
                      </p>
                    </div>
                  </div>

                  {/* Emotional Connection Message */}
                  <div className="space-y-3">
                    <h2 className={`text-3xl font-black bg-gradient-to-r ${wellbeingInfo.color} bg-clip-text text-transparent`}>
                      {wellbeingInfo.title}
                    </h2>
                    <p className="text-white/90 text-lg leading-relaxed">
                      {wellbeingInfo.message}
                    </p>
                  </div>

                  {/* Trust Indicators */}
                  <div className="flex flex-wrap gap-3">
                    <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 backdrop-blur-xl px-4 py-2">
                      <Shield className="h-4 w-4 mr-2" />
                      NR1 Compliant
                    </Badge>
                    <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 backdrop-blur-xl px-4 py-2">
                      <Lock className="h-4 w-4 mr-2" />
                      LGPD Protegido
                    </Badge>
                    <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 backdrop-blur-xl px-4 py-2">
                      <Award className="h-4 w-4 mr-2" />
                      ISO 45003
                    </Badge>
                  </div>
                </div>

                {/* Circular Progress - Visual Anchor */}
                <div className="flex items-center justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/50 to-purple-600/50 rounded-full blur-2xl animate-pulse"></div>
                    <CircularProgress 
                      value={analise?.indiceGeralBemEstar || 0}
                      size={200}
                      strokeWidth={16}
                      label="Bem-Estar"
                      sublabel={`${analise?.totalTestesRealizados || 0} avaliações`}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* INDICADORES VITAIS - Design Premium com Glassmorphism */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Colaboradores */}
          <Card className="group border-0 bg-white/10 backdrop-blur-2xl hover:bg-white/15 transition-all duration-500 rounded-2xl overflow-hidden shadow-2xl hover:shadow-blue-500/20 hover:scale-105" data-testid="card-colaboradores">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <CardContent className="p-6 relative">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-blue-500/20 rounded-xl backdrop-blur-xl border border-blue-500/30">
                  <Users className="h-6 w-6 text-blue-300" />
                </div>
                <TrendingUp className="h-5 w-5 text-emerald-400" />
              </div>
              <div className="space-y-2">
                <div className="text-sm font-bold text-blue-300 uppercase tracking-wider">
                  Colaboradores
                </div>
                <AnimatedCounter value={analise?.totalColaboradores || 0} />
                <div className="text-sm text-white/60">
                  Fazem parte desta jornada
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cobertura */}
          <Card className="group border-0 bg-white/10 backdrop-blur-2xl hover:bg-white/15 transition-all duration-500 rounded-2xl overflow-hidden shadow-2xl hover:shadow-emerald-500/20 hover:scale-105" data-testid="card-cobertura">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <CardContent className="p-6 relative">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-emerald-500/20 rounded-xl backdrop-blur-xl border border-emerald-500/30">
                  <Eye className="h-6 w-6 text-emerald-300" />
                </div>
                <Activity className="h-5 w-5 text-emerald-400" />
              </div>
              <div className="space-y-2">
                <div className="text-sm font-bold text-emerald-300 uppercase tracking-wider">
                  Cobertura
                </div>
                <AnimatedCounter value={analise?.cobertura || 0} suffix="%" />
                <Progress value={analise?.cobertura || 0} className="h-2 bg-white/10" />
                <div className="text-sm text-white/60">
                  Participação ativa
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Avaliações */}
          <Card className="group border-0 bg-white/10 backdrop-blur-2xl hover:bg-white/15 transition-all duration-500 rounded-2xl overflow-hidden shadow-2xl hover:shadow-purple-500/20 hover:scale-105" data-testid="card-avaliacoes">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <CardContent className="p-6 relative">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-purple-500/20 rounded-xl backdrop-blur-xl border border-purple-500/30">
                  <Brain className="h-6 w-6 text-purple-300" />
                </div>
                <Sparkles className="h-5 w-5 text-purple-400 animate-pulse" />
              </div>
              <div className="space-y-2">
                <div className="text-sm font-bold text-purple-300 uppercase tracking-wider">
                  Avaliações
                </div>
                <AnimatedCounter value={analise?.totalTestesRealizados || 0} />
                <div className="text-sm text-white/60">
                  Insights coletados
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Alertas */}
          <Card className="group border-0 bg-white/10 backdrop-blur-2xl hover:bg-white/15 transition-all duration-500 rounded-2xl overflow-hidden shadow-2xl hover:shadow-orange-500/20 hover:scale-105" data-testid="card-alertas">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <CardContent className="p-6 relative">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-orange-500/20 rounded-xl backdrop-blur-xl border border-orange-500/30">
                  <Zap className="h-6 w-6 text-orange-300" />
                </div>
                {(analise?.alertasCriticos.length || 0) > 0 && (
                  <div className="h-3 w-3 bg-red-500 rounded-full animate-pulse"></div>
                )}
              </div>
              <div className="space-y-2">
                <div className="text-sm font-bold text-orange-300 uppercase tracking-wider">
                  Pontos de Atenção
                </div>
                <AnimatedCounter value={analise?.alertasCriticos.length || 0} />
                <div className="text-sm text-white/60">
                  {(analise?.alertasCriticos.length || 0) === 0 
                    ? "Tudo sob controle!" 
                    : "Requerem sua atenção"}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CONTEÚDO PRINCIPAL - Tabs Modernos */}
        <Tabs defaultValue="ia" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/10 backdrop-blur-2xl border-0 p-2 rounded-2xl shadow-2xl">
            <TabsTrigger 
              value="ia" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-600 data-[state=active]:text-white rounded-xl transition-all duration-300"
              data-testid="tab-ia"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Análise IA</span>
              <span className="sm:hidden">IA</span>
            </TabsTrigger>
            <TabsTrigger 
              value="nr1"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-600 data-[state=active]:text-white rounded-xl transition-all duration-300"
              data-testid="tab-nr1"
            >
              <Shield className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">NR1</span>
              <span className="sm:hidden">NR1</span>
            </TabsTrigger>
            <TabsTrigger 
              value="dimensoes"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-600 data-[state=active]:text-white rounded-xl transition-all duration-300"
              data-testid="tab-dimensoes"
            >
              <Activity className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Dimensões</span>
              <span className="sm:hidden">Dim</span>
            </TabsTrigger>
            <TabsTrigger 
              value="acoes"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-600 data-[state=active]:text-white rounded-xl transition-all duration-300"
              data-testid="tab-acoes"
            >
              <Target className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Ações</span>
              <span className="sm:hidden">Ações</span>
            </TabsTrigger>
          </TabsList>

          {/* TAB: ANÁLISE POR IA - O Destaque Principal */}
          <TabsContent value="ia" className="space-y-6">
            {/* Privacy & Transparency Banner */}
            <Alert className="border-0 bg-gradient-to-r from-amber-500/20 to-orange-500/20 backdrop-blur-2xl shadow-2xl rounded-2xl">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-xl">
                  <Info className="h-6 w-6 text-amber-300" />
                </div>
                <div className="flex-1">
                  <AlertTitle className="text-white font-bold text-lg mb-2">
                    Transparência Total: Como Funciona Nossa IA
                  </AlertTitle>
                  <AlertDescription className="text-white/80 space-y-2">
                    <p><strong className="text-white">Metodologia:</strong> Análise de padrões em dados agregados e 100% anônimos dos seus colaboradores.</p>
                    <p><strong className="text-white">Frameworks Científicos:</strong> ISO 45003, OMS, Karasek-Siegrist, validados internacionalmente.</p>
                    <p><strong className="text-white">Sua Privacidade:</strong> Nenhum dado individual é exposto. LGPD Art. 20 garantido.</p>
                    <p><strong className="text-white">Próximo Passo:</strong> Valide com RH e Saúde Ocupacional para ação estratégica.</p>
                  </AlertDescription>
                </div>
              </div>
            </Alert>

            {/* AI-Generated Insights - Cards Premium */}
            {analise && analise.recomendacoes.length > 0 ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-black text-white flex items-center gap-3">
                    <Sparkles className="h-7 w-7 text-purple-400" />
                    Insights que Transformam
                  </h3>
                  <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 backdrop-blur-xl px-4 py-2">
                    {analise.recomendacoes.length} Recomendações Ativas
                  </Badge>
                </div>

                <div className="grid gap-4">
                  {analise.recomendacoes.map((rec, index) => {
                    const isPriority = rec.prioridade === 'Alta';
                    return (
                      <Card 
                        key={index}
                        className={`group border-0 backdrop-blur-2xl shadow-2xl rounded-2xl overflow-hidden hover:scale-[1.02] transition-all duration-500 ${
                          isPriority 
                            ? 'bg-gradient-to-r from-red-500/20 to-orange-500/20 hover:from-red-500/30 hover:to-orange-500/30' 
                            : 'bg-white/10 hover:bg-white/15'
                        }`}
                        data-testid={`recomendacao-${index}`}
                      >
                        <CardContent className="p-6">
                          <div className="flex gap-4">
                            <div className="flex-shrink-0">
                              <div className={`p-4 rounded-2xl backdrop-blur-xl ${
                                isPriority ? 'bg-red-500/30 border border-red-500/50' : 'bg-purple-500/30 border border-purple-500/50'
                              }`}>
                                {isPriority ? (
                                  <Zap className="h-6 w-6 text-red-300" />
                                ) : (
                                  <Star className="h-6 w-6 text-purple-300" />
                                )}
                              </div>
                            </div>
                            
                            <div className="flex-1 space-y-3">
                              <div className="flex items-start justify-between gap-4 flex-wrap">
                                <div className="flex-1 min-w-[200px]">
                                  <div className="flex items-center gap-3 mb-2">
                                    <Badge className={isPriority 
                                      ? "bg-red-500 text-white border-0" 
                                      : "bg-orange-500 text-white border-0"
                                    }>
                                      {rec.prioridade === 'Alta' ? 'URGENTE' : 'IMPORTANTE'}
                                    </Badge>
                                    <Badge variant="outline" className="bg-white/10 text-white/80 border-white/20 backdrop-blur-xl">
                                      {rec.categoria}
                                    </Badge>
                                  </div>
                                  <h4 className="text-xl font-bold text-white mb-2">
                                    {rec.titulo}
                                  </h4>
                                  <p className="text-white/80 leading-relaxed">
                                    {rec.descricao}
                                  </p>
                                </div>
                                
                                <Button 
                                  className={`${
                                    isPriority 
                                      ? 'bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700' 
                                      : 'bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700'
                                  } text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300`}
                                >
                                  Agir Agora
                                  <ArrowRight className="h-4 w-4 ml-2" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            ) : (
              <Card className="border-0 bg-white/10 backdrop-blur-2xl shadow-2xl rounded-2xl">
                <CardContent className="p-12 text-center">
                  <div className="max-w-md mx-auto space-y-4">
                    <div className="inline-block p-6 bg-purple-500/20 rounded-3xl backdrop-blur-xl">
                      <Brain className="h-16 w-16 text-purple-300" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">
                      IA Aprendendo Sobre Sua Organização
                    </h3>
                    <p className="text-white/70 text-lg">
                      Precisamos de mais dados para gerar insights personalizados. 
                      Incentive seus colaboradores a participarem das avaliações.
                    </p>
                    <div className="pt-4">
                      <Button className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white border-0 shadow-xl">
                        Ver Testes Disponíveis
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Alertas Críticos */}
            {analise && analise.alertasCriticos.length > 0 && (
              <Card className="border-0 bg-gradient-to-r from-red-500/20 to-rose-500/20 backdrop-blur-2xl shadow-2xl rounded-2xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent"></div>
                <CardHeader className="relative">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-red-500/30 rounded-xl backdrop-blur-xl border border-red-500/50 animate-pulse">
                      <AlertCircle className="h-6 w-6 text-red-300" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-white text-2xl font-black">
                        Situações que Pedem Sua Coragem
                      </CardTitle>
                      <CardDescription className="text-white/70 text-base mt-1">
                        Liderar é agir quando mais importa. Você tem o poder de transformar estas situações.
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="relative space-y-3">
                  {analise.alertasCriticos.map((alerta, index) => (
                    <div 
                      key={index}
                      className="flex items-start gap-4 p-4 bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 hover:bg-white/15 transition-all duration-300"
                      data-testid={`alerta-critico-${index}`}
                    >
                      <ChevronRight className="h-5 w-5 text-red-300 flex-shrink-0 mt-0.5" />
                      <p className="text-white/90 leading-relaxed flex-1">{alerta}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* TAB: NR1 */}
          <TabsContent value="nr1" className="space-y-6">
            <Card className="border-0 bg-white/10 backdrop-blur-2xl shadow-2xl rounded-2xl">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-500/20 rounded-xl backdrop-blur-xl border border-blue-500/30">
                    <Shield className="h-6 w-6 text-blue-300" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-white text-2xl font-black">
                      Fatores de Risco Psicossociais (NR1)
                    </CardTitle>
                    <CardDescription className="text-white/70 text-base mt-1">
                      Conformidade com NR1 - Vigente desde Maio 2025
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {analise?.nr1Fatores.map((fator, index) => {
                  const nivel = fator.nivel.toLowerCase();
                  const isCritico = nivel.includes('crítico') || nivel.includes('alto');
                  
                  return (
                    <div 
                      key={index} 
                      className="space-y-3 p-4 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 hover:border-white/20 transition-all"
                      data-testid={`nr1-fator-${index}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-white font-bold text-lg">{fator.fator}</span>
                          <Badge className={isCritico 
                            ? "bg-red-500 text-white border-0" 
                            : "bg-emerald-500 text-white border-0"
                          }>
                            {fator.nivel}
                          </Badge>
                        </div>
                        <span className="text-white/70 font-bold text-lg">{fator.percentual}%</span>
                      </div>
                      <Progress 
                        value={fator.percentual} 
                        className={`h-3 ${isCritico ? 'bg-red-500/20' : 'bg-emerald-500/20'}`}
                      />
                    </div>
                  );
                })}

                <Separator className="my-6 bg-white/20" />

                <Alert className="border-0 bg-blue-500/20 backdrop-blur-xl">
                  <Info className="h-5 w-5 text-blue-300" />
                  <AlertTitle className="text-white font-bold">Sobre a NR1 (Maio 2025)</AlertTitle>
                  <AlertDescription className="text-white/80 mt-2">
                    As empresas devem avaliar e gerenciar riscos como carga excessiva, falta de autonomia, 
                    assédio e conflitos. Nossa análise identifica áreas críticas e propõe ações preventivas baseadas em ciência.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB: DIMENSÕES */}
          <TabsContent value="dimensoes" className="space-y-6">
            <Card className="border-0 bg-white/10 backdrop-blur-2xl shadow-2xl rounded-2xl">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-emerald-500/20 rounded-xl backdrop-blur-xl border border-emerald-500/30">
                    <Activity className="h-6 w-6 text-emerald-300" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-white text-2xl font-black">
                      Dimensões Psicossociais
                    </CardTitle>
                    <CardDescription className="text-white/70 text-base mt-1">
                      Baseado em ISO 45003, OMS e Karasek-Siegrist
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {analise && analise.dimensoes.length > 0 ? (
                  analise.dimensoes.map((dimensao, index) => (
                    <div 
                      key={index}
                      className="space-y-3 p-4 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 hover:border-white/20 transition-all"
                      data-testid={`dimensao-${index}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-white font-bold text-lg">{dimensao.nome}</span>
                          <Badge className="bg-white/20 text-white border-white/30">
                            {dimensao.nivel}
                          </Badge>
                        </div>
                        <span className="text-white/70 font-bold">
                          {dimensao.percentual}% ({dimensao.total})
                        </span>
                      </div>
                      <Progress value={dimensao.percentual} className="h-3" />
                    </div>
                  ))
                ) : (
                  <Alert className="border-0 bg-white/5 backdrop-blur-xl">
                    <Info className="h-5 w-5 text-white/70" />
                    <AlertTitle className="text-white">Dados Insuficientes</AlertTitle>
                    <AlertDescription className="text-white/70">
                      Incentive seus colaboradores a realizarem os testes para análise dimensional completa.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB: PLANO DE AÇÃO */}
          <TabsContent value="acoes" className="space-y-6">
            <Card className="border-0 bg-white/10 backdrop-blur-2xl shadow-2xl rounded-2xl">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-orange-500/20 rounded-xl backdrop-blur-xl border border-orange-500/30">
                    <Target className="h-6 w-6 text-orange-300" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-white text-2xl font-black">
                      Jornada de Transformação
                    </CardTitle>
                    <CardDescription className="text-white/70 text-base mt-1">
                      Seu roteiro para construir um ambiente extraordinário
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* High Priority Actions */}
                {analise && analise.recomendacoes.filter(r => r.prioridade === 'Alta').length > 0 && (
                  <div className="space-y-4">
                    <h4 className="text-red-300 font-black text-lg flex items-center gap-2">
                      <Zap className="h-5 w-5" />
                      Ação Imediata (Próximos 7 Dias)
                    </h4>
                    <div className="space-y-3">
                      {analise.recomendacoes
                        .filter(r => r.prioridade === 'Alta')
                        .map((rec, index) => (
                          <div 
                            key={index}
                            className="flex gap-4 p-4 bg-red-500/20 backdrop-blur-xl rounded-xl border border-red-500/30"
                          >
                            <CheckCircle className="h-6 w-6 text-red-300 flex-shrink-0 mt-1" />
                            <div className="flex-1 space-y-1">
                              <p className="text-white font-bold">{rec.titulo}</p>
                              <p className="text-white/70 text-sm">{rec.descricao}</p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* Medium Priority Actions */}
                {analise && analise.recomendacoes.filter(r => r.prioridade === 'Média').length > 0 && (
                  <div className="space-y-4">
                    <h4 className="text-orange-300 font-black text-lg flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      Próximos 30 Dias
                    </h4>
                    <div className="space-y-3">
                      {analise.recomendacoes
                        .filter(r => r.prioridade === 'Média')
                        .map((rec, index) => (
                          <div 
                            key={index}
                            className="flex gap-4 p-4 bg-orange-500/20 backdrop-blur-xl rounded-xl border border-orange-500/30"
                          >
                            <CheckCircle className="h-6 w-6 text-orange-300 flex-shrink-0 mt-1" />
                            <div className="flex-1 space-y-1">
                              <p className="text-white font-bold">{rec.titulo}</p>
                              <p className="text-white/70 text-sm">{rec.descricao}</p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* Best Practices */}
                <div className="space-y-4">
                  <h4 className="text-blue-300 font-black text-lg flex items-center gap-2">
                    <Star className="h-5 w-5" />
                    Melhores Práticas ISO 45003
                  </h4>
                  <div className="space-y-2">
                    {[
                      "Avaliações regulares (semestral ideal, anual mínimo)",
                      "Canais confidenciais para relatos de problemas",
                      "Capacitação de líderes em saúde mental",
                      "Políticas claras de prevenção ao assédio",
                      "Flexibilidade para equilíbrio vida-trabalho"
                    ].map((pratica, index) => (
                      <div key={index} className="flex gap-3 text-white/80">
                        <ChevronRight className="h-5 w-5 text-blue-300 flex-shrink-0" />
                        <span>{pratica}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* FOOTER - Call to Action Final */}
        <Card className="border-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-2xl shadow-2xl rounded-2xl overflow-hidden">
          <CardContent className="p-8">
            <div className="flex items-center justify-between gap-6 flex-wrap">
              <div className="flex-1 min-w-[300px] space-y-3">
                <h3 className="text-2xl font-black text-white">
                  Pronto para Transformar Sua Organização?
                </h3>
                <p className="text-white/80 text-lg">
                  Cada ação que você toma hoje constrói o futuro que seus colaboradores merecem. 
                  Vamos juntos nessa jornada de cuidado e evolução.
                </p>
              </div>
              <Button className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white border-0 shadow-2xl hover:shadow-purple-500/50 px-8 py-6 text-lg font-bold rounded-xl transition-all duration-300 hover:scale-105">
                Implementar Mudanças
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Última Atualização */}
        {analise && (
          <div className="text-center">
            <p className="text-white/50 text-sm">
              Última atualização: {format(new Date(analise.ultimaAtualizacao), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
            </p>
          </div>
        )}
      </div>

      {/* Custom Animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float ease-in-out infinite;
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
}
