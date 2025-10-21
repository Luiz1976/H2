import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  FileText, 
  Heart, 
  Sparkles, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2,
  Download,
  QrCode,
  FileSpreadsheet,
  Brain,
  Users,
  Shield,
  Activity,
  Target,
  MessageSquare,
  Coffee,
  GraduationCap,
  Calendar,
  Loader2
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

export default function EmpresaPRG() {
  const [periodo, setPeriodo] = useState("90");
  const [setor, setSetor] = useState("todos");
  const [activeTab, setActiveTab] = useState("geral");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [prgData, setPrgData] = useState<PRGData | null>(null);

  // Buscar dados do PRG ao carregar a página
  useEffect(() => {
    const fetchPRGData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const token = localStorage.getItem('authToken');
        if (!token) {
          throw new Error('Token de autenticação não encontrado');
        }

        console.log('📊 [PRG Frontend] Buscando dados do PRG...');
        
        const response = await fetch('/api/empresas/prg', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`Erro ao buscar dados: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('✅ [PRG Frontend] Dados recebidos:', data);
        
        setPrgData(data.prg);
      } catch (err) {
        console.error('❌ [PRG Frontend] Erro:', err);
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    };

    fetchPRGData();
  }, [periodo, setor]); // Recarregar quando filtros mudarem

  // Mapear ícones para recomendações
  const getIconForRecomendacao = (categoria: string) => {
    const iconMap: Record<string, any> = {
      'comunicação': MessageSquare,
      'comunicacao': MessageSquare,
      'bem-estar': Coffee,
      'liderança': GraduationCap,
      'lideranca': GraduationCap,
      'governança': Calendar,
      'governanca': Calendar
    };
    return iconMap[categoria.toLowerCase()] || Target;
  };

  // Funções de exportação
  const handleGerarPDF = () => {
    window.print(); // Abre diálogo de impressão (pode salvar como PDF)
  };

  const handleExportarExcel = () => {
    if (!prgData) return;
    
    // Criar dados CSV simples
    let csv = 'Métrica,Valor,Status\n';
    csv += `Índice Global,${prgData.indiceGlobal}%,${getStatusBadge(prgData.indiceGlobal).label}\n`;
    csv += `Índice de Estresse,${prgData.kpis.indiceEstresse}%,${getStatusBadge(prgData.kpis.indiceEstresse).label}\n`;
    csv += `Clima Positivo,${prgData.kpis.climaPositivo}%,${getStatusBadge(prgData.kpis.climaPositivo).label}\n`;
    csv += `Satisfação com Chefia,${prgData.kpis.satisfacaoChefia}%,${getStatusBadge(prgData.kpis.satisfacaoChefia).label}\n`;
    csv += `Risco de Burnout,${prgData.kpis.riscoBurnout}%,${getStatusBadge(prgData.kpis.riscoBurnout).label}\n`;
    csv += `Maturidade PRG,${prgData.kpis.maturidadePRG}%,${getStatusBadge(prgData.kpis.maturidadePRG).label}\n`;
    csv += `Segurança Psicológica,${prgData.kpis.segurancaPsicologica}%,${getStatusBadge(prgData.kpis.segurancaPsicologica).label}\n`;
    
    // Criar blob e download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `prg_relatorio_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleGerarQRCode = () => {
    alert('Funcionalidade de QR Code será implementada em breve');
  };

  const getStatusBadge = (valor: number) => {
    if (valor >= 80) {
      return { label: "Saudável", color: "bg-green-500/20 text-green-300 border-green-500/30" };
    } else if (valor >= 60) {
      return { label: "Atenção", color: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30" };
    } else {
      return { label: "Crítico", color: "bg-red-500/20 text-red-300 border-red-500/30" };
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950 p-6 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-blue-400 mx-auto" />
          <p className="text-white/70 text-lg">Carregando dados do PRG...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950 p-6 flex items-center justify-center">
        <Card className="border-red-500/50 bg-red-950/20 backdrop-blur-xl max-w-md">
          <CardContent className="p-6 text-center space-y-4">
            <AlertTriangle className="h-12 w-12 text-red-400 mx-auto" />
            <p className="text-white font-semibold">Erro ao carregar dados</p>
            <p className="text-white/60 text-sm">{error}</p>
            <Button onClick={() => window.location.reload()} variant="outline" className="bg-white/10">
              Tentar novamente
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const indiceGlobal = prgData?.indiceGlobal || 0;
  const statusGlobal = getStatusBadge(indiceGlobal);

  // Preparar KPIs com dados reais
  const kpis = prgData ? [
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
  ] : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* HEADER - Inspirado no EmpresaEstadoPsicossocial */}
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
                        <FileText className="h-12 w-12 text-white" />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-4xl font-black text-white" data-testid="text-page-title">
                          PRG
                        </h1>
                        <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 backdrop-blur-xl">
                          <Sparkles className="h-3 w-3 mr-1" />
                          IA Ativa
                        </Badge>
                      </div>
                      <p className="text-white/70 text-lg font-medium">
                        Programa de Gestão de Riscos Psicossociais
                      </p>
                    </div>
                  </div>

                  {/* Subtitle */}
                  <div className="space-y-3">
                    <h2 className="text-2xl font-bold text-white/90">
                      Análise integrada da condição psicossocial da sua empresa
                    </h2>
                    <p className="text-white/70 text-base leading-relaxed">
                      Conforme a NR-01 e diretrizes da OMS
                    </p>
                  </div>

                  {/* Trust Indicators */}
                  <div className="flex flex-wrap gap-3">
                    <Badge variant="outline" className="bg-white/5 border-white/20 text-white/80 backdrop-blur-xl">
                      <Shield className="h-3 w-3 mr-1" />
                      NR-01 Compliant
                    </Badge>
                    <Badge variant="outline" className="bg-white/5 border-white/20 text-white/80 backdrop-blur-xl">
                      <Heart className="h-3 w-3 mr-1" />
                      OMS Guidelines
                    </Badge>
                    <Badge variant="outline" className="bg-white/5 border-white/20 text-white/80 backdrop-blur-xl">
                      <Brain className="h-3 w-3 mr-1" />
                      ISO 45003
                    </Badge>
                  </div>
                </div>

                {/* Circular Progress - Índice Global */}
                <div className="flex items-center justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-purple-600/30 rounded-full blur-2xl animate-pulse"></div>
                    <div className="relative w-64 h-64 flex items-center justify-center">
                      <svg className="transform -rotate-90 w-full h-full">
                        <circle
                          cx="128"
                          cy="128"
                          r="110"
                          stroke="currentColor"
                          strokeWidth="16"
                          fill="none"
                          className="text-white/10"
                        />
                        <circle
                          cx="128"
                          cy="128"
                          r="110"
                          stroke="url(#gradient)"
                          strokeWidth="16"
                          fill="none"
                          strokeDasharray={`${2 * Math.PI * 110}`}
                          strokeDashoffset={`${2 * Math.PI * 110 * (1 - indiceGlobal / 100)}`}
                          strokeLinecap="round"
                          className="transition-all duration-1000"
                        />
                        <defs>
                          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#3b82f6" />
                            <stop offset="100%" stopColor="#8b5cf6" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-6xl font-black text-white mb-2">{indiceGlobal}%</span>
                        <Badge className={statusGlobal.color + " backdrop-blur-xl"}>
                          {statusGlobal.label}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* FILTROS DINÂMICOS */}
        <Card className="border-0 bg-white/10 backdrop-blur-xl shadow-xl">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80">Período</label>
                <Select value={periodo} onValueChange={setPeriodo}>
                  <SelectTrigger className="bg-white/5 border-white/20 text-white" data-testid="select-periodo">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">Últimos 30 dias</SelectItem>
                    <SelectItem value="90">Últimos 90 dias</SelectItem>
                    <SelectItem value="180">Últimos 180 dias</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80">Setor / Unidade</label>
                <Select value={setor} onValueChange={setSetor}>
                  <SelectTrigger className="bg-white/5 border-white/20 text-white" data-testid="select-setor">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos os setores</SelectItem>
                    <SelectItem value="operacional">Operacional</SelectItem>
                    <SelectItem value="administrativo">Administrativo</SelectItem>
                    <SelectItem value="comercial">Comercial</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80">Cargo</label>
                <Select defaultValue="todos">
                  <SelectTrigger className="bg-white/5 border-white/20 text-white" data-testid="select-cargo">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos os cargos</SelectItem>
                    <SelectItem value="gestao">Gestão</SelectItem>
                    <SelectItem value="operacional">Operacional</SelectItem>
                    <SelectItem value="tecnico">Técnico</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80">Tipo de Teste</label>
                <Select defaultValue="todos">
                  <SelectTrigger className="bg-white/5 border-white/20 text-white" data-testid="select-teste">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos os testes</SelectItem>
                    <SelectItem value="clima">Clima Organizacional</SelectItem>
                    <SelectItem value="estresse">Estresse Ocupacional</SelectItem>
                    <SelectItem value="burnout">Burnout</SelectItem>
                    <SelectItem value="qvt">QVT</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* KPIS - INDICADORES-CHAVE */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {kpis.map((kpi, index) => (
            <Card key={index} className="border-0 bg-white/10 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all" data-testid={`card-kpi-${index}`}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl ${kpi.bgColor}`}>
                    <kpi.icon className={`h-6 w-6 ${kpi.color}`} />
                  </div>
                  <Badge className={getStatusBadge(kpi.valor).color + " backdrop-blur-xl"}>
                    {getStatusBadge(kpi.valor).label}
                  </Badge>
                </div>
                <h3 className="text-sm font-medium text-white/80 mb-3">{kpi.titulo}</h3>
                <div className="space-y-2">
                  <div className="flex items-end gap-2">
                    <span className="text-4xl font-black text-white">{kpi.valor}%</span>
                  </div>
                  <Progress value={kpi.valor} className="h-2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* ANÁLISE INTELIGENTE DA IA */}
        <Card className="border-0 bg-gradient-to-br from-purple-900/30 to-blue-900/30 backdrop-blur-xl shadow-xl">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Brain className="h-6 w-6 text-purple-400" />
              <div>
                <CardTitle className="text-white text-2xl">Síntese da Análise Inteligente – HumaniQ AI</CardTitle>
                <CardDescription className="text-white/60">
                  Análise automática gerada pela inteligência artificial
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-white/90 text-lg leading-relaxed">
              "{prgData?.aiAnalysis.sintese || 'Gerando análise...'}"
            </p>
            
            <div className="flex gap-3">
              <Button 
                onClick={handleGerarPDF}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" 
                data-testid="button-gerar-pdf"
              >
                <Download className="h-4 w-4 mr-2" />
                Gerar Relatório Técnico PDF
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* TABS - RELATÓRIOS DETALHADOS */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-white/10 backdrop-blur-xl border-0 p-1 grid grid-cols-3 md:grid-cols-7 gap-2">
            <TabsTrigger value="geral" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white" data-testid="tab-geral">
              Geral
            </TabsTrigger>
            <TabsTrigger value="clima" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white" data-testid="tab-clima">
              Clima
            </TabsTrigger>
            <TabsTrigger value="estresse" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white" data-testid="tab-estresse">
              Estresse
            </TabsTrigger>
            <TabsTrigger value="burnout" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white" data-testid="tab-burnout">
              Burnout
            </TabsTrigger>
            <TabsTrigger value="qvt" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white" data-testid="tab-qvt">
              QVT
            </TabsTrigger>
            <TabsTrigger value="assedio" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white" data-testid="tab-assedio">
              Assédio
            </TabsTrigger>
            <TabsTrigger value="disc" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white" data-testid="tab-disc">
              DISC
            </TabsTrigger>
          </TabsList>

          {/* GERAL - Gráfico de Radar */}
          <TabsContent value="geral" className="space-y-6">
            {/* Gráfico Radar - Dimensões Psicossociais */}
            {prgData && <GraficoRadarDimensoes dados={prgData.dimensoesPsicossociais} />}

            {/* Matriz de Risco Qualitativa */}
            {prgData && <MatrizRisco riscos={prgData.matrizRiscos} />}
          </TabsContent>

          {/* CLIMA ORGANIZACIONAL */}
          <TabsContent value="clima" className="space-y-6">
            {/* Gráfico de Distribuição de Riscos */}
            {prgData && <GraficoDistribuicaoRiscos dados={prgData.distribuicaoRiscos} />}

            {/* Card com métricas de clima */}
            <Card className="border-0 bg-white/10 backdrop-blur-xl shadow-xl">
              <CardHeader>
                <CardTitle className="text-white text-xl">Indicadores de Clima Organizacional</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-blue-500/20 border border-blue-500/30 rounded-xl">
                  <p className="text-blue-300 text-sm font-semibold mb-1">Clima Positivo</p>
                  <p className="text-white text-3xl font-bold">{prgData?.kpis.climaPositivo}%</p>
                </div>
                <div className="p-4 bg-green-500/20 border border-green-500/30 rounded-xl">
                  <p className="text-green-300 text-sm font-semibold mb-1">Satisfação com Liderança</p>
                  <p className="text-white text-3xl font-bold">{prgData?.kpis.satisfacaoChefia}%</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ESTRESSE OCUPACIONAL */}
          <TabsContent value="estresse" className="space-y-6">
            {/* Gráfico Radar para Estresse */}
            {prgData && <GraficoRadarDimensoes dados={prgData.dimensoesPsicossociais} />}

            {/* Card com métricas de estresse */}
            <Card className="border-0 bg-white/10 backdrop-blur-xl shadow-xl">
              <CardHeader>
                <CardTitle className="text-white text-xl">Níveis de Estresse Ocupacional</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-white/80">Índice de Estresse</span>
                    <span className="text-white font-bold text-xl">{prgData?.kpis.indiceEstresse}%</span>
                  </div>
                  <Progress value={prgData?.kpis.indiceEstresse} className="h-3" />
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className={`p-4 rounded-xl ${(prgData?.kpis.riscoBurnout || 0) > 60 ? 'bg-red-500/20 border-red-500/30' : 'bg-yellow-500/20 border-yellow-500/30'} border`}>
                    <p className={`text-sm font-semibold mb-1 ${(prgData?.kpis.riscoBurnout || 0) > 60 ? 'text-red-300' : 'text-yellow-300'}`}>Risco de Burnout</p>
                    <p className="text-white text-3xl font-bold">{prgData?.kpis.riscoBurnout}%</p>
                  </div>
                  <div className="p-4 bg-green-500/20 border border-green-500/30 rounded-xl">
                    <p className="text-green-300 text-sm font-semibold mb-1">Segurança Psicológica</p>
                    <p className="text-white text-3xl font-bold">{prgData?.kpis.segurancaPsicologica}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* BURNOUT */}
          <TabsContent value="burnout">
            <Card className="border-0 bg-white/10 backdrop-blur-xl shadow-xl">
              <CardHeader>
                <CardTitle className="text-white text-xl">Burnout e Resiliência</CardTitle>
                <CardDescription className="text-white/60">
                  Mapa de calor por setor
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-white/60 text-center py-8">Dados em processamento...</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* QVT */}
          <TabsContent value="qvt">
            <Card className="border-0 bg-white/10 backdrop-blur-xl shadow-xl">
              <CardHeader>
                <CardTitle className="text-white text-xl">Qualidade de Vida no Trabalho</CardTitle>
                <CardDescription className="text-white/60">
                  Radar de satisfação
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-white/60 text-center py-8">Dados em processamento...</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ASSÉDIO */}
          <TabsContent value="assedio">
            <Card className="border-0 bg-white/10 backdrop-blur-xl shadow-xl">
              <CardHeader>
                <CardTitle className="text-white text-xl">Assédio Moral e Sexual</CardTitle>
                <CardDescription className="text-white/60">
                  Índice de percepção de segurança
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-white/60 text-center py-8">Dados em processamento...</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* DISC */}
          <TabsContent value="disc">
            <Card className="border-0 bg-white/10 backdrop-blur-xl shadow-xl">
              <CardHeader>
                <CardTitle className="text-white text-xl">Perfil Comportamental DISC</CardTitle>
                <CardDescription className="text-white/60">
                  Distribuição dos perfis (Dominância, Influência, Estabilidade, Conformidade)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-white/60 text-center py-8">Dados em processamento...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* AÇÕES RECOMENDADAS */}
        <Card className="border-0 bg-gradient-to-br from-orange-900/30 to-red-900/30 backdrop-blur-xl shadow-xl">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Target className="h-6 w-6 text-orange-400" />
              <div>
                <CardTitle className="text-white text-2xl">Ações Recomendadas pela IA</CardTitle>
                <CardDescription className="text-white/60">
                  Plano de ação personalizado baseado nos resultados
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {prgData?.recomendacoes.map((rec, index) => {
              const IconComponent = getIconForRecomendacao(rec.categoria);
              return (
                <div 
                  key={index} 
                  className="flex items-start gap-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all"
                  data-testid={`recomendacao-${index}`}
                >
                  <div className="p-3 bg-orange-500/20 rounded-xl">
                    <IconComponent className="h-5 w-5 text-orange-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-white font-semibold">{rec.titulo}</h4>
                      <Badge variant="outline" className={
                        rec.prioridade === "alta" 
                          ? "bg-red-500/20 text-red-300 border-red-500/30" 
                          : "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
                      }>
                        {rec.prioridade === "alta" ? "Alta" : "Média"}
                      </Badge>
                    </div>
                    <p className="text-white/70 text-sm">{rec.descricao}</p>
                  </div>
                </div>
              );
            })}

            <div className="pt-4">
              <Button className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 w-full" data-testid="button-exportar-plano">
                <Download className="h-4 w-4 mr-2" />
                Exportar Plano de Ação
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* RELATÓRIOS EXPORTÁVEIS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-0 bg-white/10 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all cursor-pointer" data-testid="card-export-pdf">
            <CardContent className="p-6 text-center space-y-4">
              <div className="flex justify-center">
                <div className="p-4 bg-red-500/20 rounded-2xl">
                  <Download className="h-8 w-8 text-red-400" />
                </div>
              </div>
              <div>
                <h3 className="text-white font-bold mb-2">Relatório PDF Completo</h3>
                <p className="text-white/60 text-sm">Com capa, gráficos e análise descritiva da IA</p>
              </div>
              <Button variant="outline" className="w-full bg-white/5 border-white/20 text-white hover:bg-white/10">
                Baixar PDF
              </Button>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white/10 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all cursor-pointer" data-testid="card-export-excel">
            <CardContent className="p-6 text-center space-y-4">
              <div className="flex justify-center">
                <div className="p-4 bg-green-500/20 rounded-2xl">
                  <FileSpreadsheet className="h-8 w-8 text-green-400" />
                </div>
              </div>
              <div>
                <h3 className="text-white font-bold mb-2">Planilha Excel</h3>
                <p className="text-white/60 text-sm">Dados brutos e índices por setor</p>
              </div>
              <Button 
                onClick={handleExportarExcel}
                variant="outline" 
                className="w-full bg-white/5 border-white/20 text-white hover:bg-white/10"
                data-testid="button-baixar-excel"
              >
                Baixar Excel
              </Button>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white/10 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all cursor-pointer" data-testid="card-export-qr">
            <CardContent className="p-6 text-center space-y-4">
              <div className="flex justify-center">
                <div className="p-4 bg-purple-500/20 rounded-2xl">
                  <QrCode className="h-8 w-8 text-purple-400" />
                </div>
              </div>
              <div>
                <h3 className="text-white font-bold mb-2">QR Code Exclusivo</h3>
                <p className="text-white/60 text-sm">Visualização online interativa</p>
              </div>
              <Button 
                onClick={handleGerarQRCode}
                variant="outline" 
                className="w-full bg-white/5 border-white/20 text-white hover:bg-white/10"
                data-testid="button-gerar-qrcode"
              >
                Gerar QR Code
              </Button>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
