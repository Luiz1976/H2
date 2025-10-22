import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  FileText, 
  Sparkles, 
  Loader2,
  AlertTriangle,
  Activity,
  Users,
  Shield,
  TrendingUp,
  CheckCircle2
} from "lucide-react";
import MatrizRisco from "@/components/prg/MatrizRisco";
import GraficoDistribuicaoRiscos from "@/components/prg/GraficoDistribuicaoRiscos";
import GraficoRadarDimensoes from "@/components/prg/GraficoRadarDimensoes";

interface PRGData {
  indiceGlobal: number;
  kpis: {
    indiceEstresse: number;
    climaPositivo: number;
    satisfacaoChefia: number;
    riscoBurnout: number;
    maturidadePRG: number;
    segurancaPsicologica: number;
  };
  totalColaboradores: number;
  totalTestes: number;
  cobertura: number;
  dadosPorTipo: {
    clima: number;
    estresse: number;
    burnout: number;
    qvt: number;
    assedio: number;
    disc: number;
  };
  aiAnalysis: {
    sintese: string;
    dataGeracao: string;
  };
  recomendacoes: Array<{
    categoria: string;
    prioridade: string;
    titulo: string;
    descricao: string;
    acoesPraticas?: string[];
    prazo?: string;
    responsavel?: string;
    impactoEsperado?: string;
    recursos?: string[];
  }>;
  matrizRiscos: Array<{
    nome: string;
    probabilidade: 'A' | 'B' | 'C' | 'D' | 'E';
    severidade: 1 | 2 | 3 | 4 | 5;
    categoria: string;
  }>;
  distribuicaoRiscos: Array<{
    categoria: string;
    critico: number;
    alto: number;
    moderado: number;
    baixo: number;
  }>;
  dimensoesPsicossociais: Array<{
    dimensao: string;
    valor: number;
    meta: number;
  }>;
}

export default function PRGPublico() {
  const { token } = useParams<{ token: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [prgData, setPrgData] = useState<PRGData | null>(null);
  const [activeTab, setActiveTab] = useState("geral");

  useEffect(() => {
    const fetchPRGData = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!token) {
          throw new Error('Token de compartilhamento inválido');
        }

        console.log('📊 [PRG Público] Carregando dados compartilhados...');
        
        const response = await fetch(`/api/empresas/prg/publico/${token}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Não foi possível carregar os dados do PRG');
        }

        const data = await response.json();
        setPrgData(data);
        console.log('✅ [PRG Público] Dados carregados com sucesso');
        
      } catch (err) {
        console.error('❌ [PRG Público] Erro:', err);
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    };

    fetchPRGData();
  }, [token]);

  const getStatusBadge = (valor: number) => {
    if (valor >= 80) {
      return { label: "Saudável", color: "bg-green-500/20 text-green-300 border-green-500/30" };
    } else if (valor >= 60) {
      return { label: "Atenção", color: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30" };
    } else {
      return { label: "Crítico", color: "bg-red-500/20 text-red-300 border-red-500/30" };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950 p-6 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-blue-400 mx-auto" />
          <p className="text-white/70 text-lg">Carregando dashboard compartilhado...</p>
        </div>
      </div>
    );
  }

  if (error || !prgData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950 p-6 flex items-center justify-center">
        <Card className="border-red-500/50 bg-red-950/20 backdrop-blur-xl max-w-md">
          <CardContent className="p-6 text-center space-y-4">
            <AlertTriangle className="h-12 w-12 text-red-400 mx-auto" />
            <p className="text-white font-semibold">Acesso Inválido</p>
            <p className="text-white/60 text-sm">{error || 'Token de compartilhamento inválido ou expirado'}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const indiceGlobal = prgData.indiceGlobal;
  const statusGlobal = getStatusBadge(indiceGlobal);

  const kpis = [
    {
      titulo: "Índice de Estresse Ocupacional",
      valor: prgData.kpis.indiceEstresse,
      icon: Activity,
      color: prgData.kpis.indiceEstresse >= 60 ? "text-yellow-500" : "text-green-500",
      bgColor: prgData.kpis.indiceEstresse >= 60 ? "bg-yellow-500/10" : "bg-green-500/10"
    },
    {
      titulo: "Clima Organizacional Positivo",
      valor: prgData.kpis.climaPositivo,
      icon: Users,
      color: prgData.kpis.climaPositivo >= 60 ? "text-yellow-500" : "text-green-500",
      bgColor: prgData.kpis.climaPositivo >= 60 ? "bg-yellow-500/10" : "bg-green-500/10"
    },
    {
      titulo: "Satisfação com Chefia",
      valor: prgData.kpis.satisfacaoChefia,
      icon: CheckCircle2,
      color: "text-green-500",
      bgColor: "bg-green-500/10"
    },
    {
      titulo: "Risco de Burnout",
      valor: prgData.kpis.riscoBurnout,
      icon: AlertTriangle,
      color: prgData.kpis.riscoBurnout >= 60 ? "text-red-500" : "text-yellow-500",
      bgColor: prgData.kpis.riscoBurnout >= 60 ? "bg-red-500/10" : "bg-yellow-500/10"
    },
    {
      titulo: "Maturidade do PRG",
      valor: prgData.kpis.maturidadePRG,
      icon: TrendingUp,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10"
    },
    {
      titulo: "Percepção de Segurança Psicológica",
      valor: prgData.kpis.segurancaPsicologica,
      icon: Shield,
      color: "text-green-500",
      bgColor: "bg-green-500/10"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* HEADER */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 blur-3xl -z-10"></div>
          
          <Card className="border-0 bg-white/10 backdrop-blur-2xl shadow-2xl rounded-3xl overflow-hidden">
            <CardContent className="p-12">
              <div className="flex items-start justify-between gap-8 flex-wrap">
                <div className="flex-1 min-w-[300px] space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl blur-lg opacity-75 animate-pulse"></div>
                      <div className="relative p-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl">
                        <FileText className="h-12 w-12 text-white" />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-4xl font-black text-white">
                          PRG - Dashboard Compartilhado
                        </h1>
                        <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 backdrop-blur-xl">
                          <Sparkles className="h-3 w-3 mr-1" />
                          Visualização Pública
                        </Badge>
                      </div>
                      <p className="text-white/70 text-lg font-medium">
                        Programa de Gestão de Riscos Psicossociais
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 min-w-[250px]">
                  <p className="text-white/60 text-sm mb-3 uppercase tracking-wider">Índice Global PRG</p>
                  <div className="text-7xl font-black text-white mb-4">{indiceGlobal}%</div>
                  <Badge className={`${statusGlobal.color} border px-4 py-2 text-base backdrop-blur-xl`}>
                    {statusGlobal.label}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {kpis.map((kpi, index) => {
            const Icon = kpi.icon;
            const status = getStatusBadge(kpi.valor);
            
            return (
              <Card key={index} className="border-0 bg-white/10 backdrop-blur-xl shadow-lg hover:shadow-xl transition-all">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl ${kpi.bgColor}`}>
                      <Icon className={`h-6 w-6 ${kpi.color}`} />
                    </div>
                    <Badge className={`${status.color} border backdrop-blur-xl`}>
                      {status.label}
                    </Badge>
                  </div>
                  <h3 className="text-white/80 text-sm mb-2 font-medium">{kpi.titulo}</h3>
                  <div className="flex items-end gap-2">
                    <span className="text-4xl font-bold text-white">{kpi.valor}%</span>
                  </div>
                  <Progress value={kpi.valor} className="mt-3 h-2 bg-white/10" />
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* TABS */}
        <Card className="border-0 bg-white/10 backdrop-blur-xl shadow-xl">
          <CardContent className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-3 md:grid-cols-6 gap-2 bg-white/5 p-2 rounded-xl mb-6">
                <TabsTrigger value="geral" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-white text-white/60">
                  Visão Geral
                </TabsTrigger>
                <TabsTrigger value="dimensoes" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-white text-white/60">
                  Dimensões
                </TabsTrigger>
                <TabsTrigger value="riscos" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-white text-white/60">
                  Riscos
                </TabsTrigger>
                <TabsTrigger value="matriz" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-white text-white/60">
                  Matriz
                </TabsTrigger>
                <TabsTrigger value="ia" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-white text-white/60">
                  Análise IA
                </TabsTrigger>
                <TabsTrigger value="recomendacoes" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-white text-white/60">
                  Recomendações
                </TabsTrigger>
              </TabsList>

              <TabsContent value="geral" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-white/5 border-white/10">
                    <CardContent className="p-4 text-center">
                      <p className="text-white/60 text-sm mb-1">Colaboradores</p>
                      <p className="text-3xl font-bold text-white">{prgData.totalColaboradores}</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-white/5 border-white/10">
                    <CardContent className="p-4 text-center">
                      <p className="text-white/60 text-sm mb-1">Total de Testes</p>
                      <p className="text-3xl font-bold text-white">{prgData.totalTestes}</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-white/5 border-white/10">
                    <CardContent className="p-4 text-center">
                      <p className="text-white/60 text-sm mb-1">Cobertura</p>
                      <p className="text-3xl font-bold text-white">{prgData.cobertura}%</p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="dimensoes">
                <GraficoRadarDimensoes dados={prgData.dimensoesPsicossociais} />
              </TabsContent>

              <TabsContent value="riscos">
                <GraficoDistribuicaoRiscos dados={prgData.distribuicaoRiscos} />
              </TabsContent>

              <TabsContent value="matriz">
                <MatrizRisco riscos={prgData.matrizRiscos} />
              </TabsContent>

              <TabsContent value="ia" className="space-y-4">
                <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/20">
                  <CardContent className="p-6">
                    <h3 className="text-white font-bold text-lg mb-4">🤖 Análise Inteligente</h3>
                    <div className="text-white/80 space-y-3 leading-relaxed">
                      {prgData.aiAnalysis.sintese.split('\n\n').map((paragrafo, i) => (
                        <p key={i}>{paragrafo}</p>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="recomendacoes" className="space-y-4">
                {prgData.recomendacoes.map((rec, index) => (
                  <Card key={index} className="bg-white/5 border-white/10">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4 mb-3">
                        <Badge className={rec.prioridade === 'Alta' ? 'bg-red-500' : 'bg-yellow-500'}>
                          {rec.prioridade}
                        </Badge>
                        <h4 className="text-white font-bold flex-1">{rec.titulo}</h4>
                      </div>
                      <p className="text-white/70 mb-3">{rec.descricao}</p>
                      {rec.prazo && (
                        <p className="text-white/60 text-sm">⏰ Prazo: {rec.prazo}</p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* FOOTER */}
        <div className="text-center text-white/40 text-sm py-6">
          <p>Dashboard compartilhado via QR Code • HumaniQ • Acesso somente visualização</p>
        </div>

      </div>
    </div>
  );
}
