import React, { useState, useEffect } from "react";
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
  Loader2,
  ChevronUp,
  ChevronDown,
  CheckCircle,
  Briefcase,
  Clock
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

export default function EmpresaPRG() {
  const [periodo, setPeriodo] = useState("90");
  const [setor, setSetor] = useState("todos");
  const [activeTab, setActiveTab] = useState("geral");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [prgData, setPrgData] = useState<PRGData | null>(null);
  const [recomendacoesExpandidas, setRecomendacoesExpandidas] = useState<Set<number>>(new Set());

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

  // Toggle expansão de recomendação
  const toggleRecomendacao = (index: number) => {
    setRecomendacoesExpandidas(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

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
  const handleExportarPlanoAcao = () => {
    if (!prgData) return;

    // Gerar documento HTML completo com todas as recomendações
    const htmlContent = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Plano de Ação - PRG HumaniQ</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      margin: 40px;
      color: #333;
      line-height: 1.6;
    }
    .header {
      text-align: center;
      margin-bottom: 40px;
      border-bottom: 3px solid #f97316;
      padding-bottom: 20px;
    }
    .header h1 {
      color: #f97316;
      margin: 0;
      font-size: 32px;
    }
    .header p {
      color: #666;
      margin: 10px 0 0 0;
    }
    .metrics {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 15px;
      margin-bottom: 30px;
    }
    .metric-card {
      background: #f8f9fa;
      padding: 15px;
      border-radius: 8px;
      border-left: 4px solid #f97316;
    }
    .metric-label {
      font-size: 12px;
      color: #666;
      text-transform: uppercase;
      font-weight: 600;
    }
    .metric-value {
      font-size: 24px;
      font-weight: bold;
      color: #f97316;
      margin-top: 5px;
    }
    .recomendacao {
      background: white;
      border: 2px solid #e5e7eb;
      border-radius: 12px;
      padding: 25px;
      margin-bottom: 25px;
      page-break-inside: avoid;
    }
    .rec-header {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 15px;
      flex-wrap: wrap;
    }
    .rec-title {
      font-size: 20px;
      font-weight: bold;
      color: #1f2937;
      flex: 1;
    }
    .badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
    }
    .badge-alta {
      background: #ef4444;
      color: white;
    }
    .badge-media {
      background: #f59e0b;
      color: white;
    }
    .badge-categoria {
      background: #3b82f6;
      color: white;
    }
    .rec-descricao {
      color: #4b5563;
      margin-bottom: 20px;
      font-size: 15px;
    }
    .rec-info {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin-bottom: 20px;
    }
    .info-item {
      background: #f3f4f6;
      padding: 10px;
      border-radius: 6px;
      font-size: 13px;
    }
    .info-label {
      font-weight: 600;
      color: #374151;
    }
    .section {
      margin-top: 20px;
    }
    .section-title {
      font-size: 14px;
      font-weight: 700;
      color: #059669;
      margin-bottom: 10px;
      text-transform: uppercase;
      display: flex;
      align-items: center;
      gap: 5px;
    }
    .acoes-list {
      list-style: none;
      padding: 0;
    }
    .acoes-list li {
      padding: 8px 0 8px 20px;
      position: relative;
      color: #4b5563;
    }
    .acoes-list li:before {
      content: "✓";
      position: absolute;
      left: 0;
      color: #059669;
      font-weight: bold;
    }
    .impacto-box {
      background: #d1fae5;
      border-left: 4px solid #059669;
      padding: 12px;
      border-radius: 6px;
      margin-top: 15px;
    }
    .recursos-box {
      background: #dbeafe;
      border-left: 4px solid #3b82f6;
      padding: 12px;
      border-radius: 6px;
      margin-top: 15px;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 2px solid #e5e7eb;
      text-align: center;
      color: #6b7280;
      font-size: 12px;
    }
    @media print {
      body { margin: 20px; }
      .recomendacao { page-break-inside: avoid; }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>📋 Plano de Ação - Programa de Gestão de Riscos Psicossociais</h1>
    <p>HumaniQ | Gerado em ${new Date().toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
  </div>

  <div class="metrics">
    <div class="metric-card">
      <div class="metric-label">Colaboradores</div>
      <div class="metric-value">${prgData.totalColaboradores}</div>
    </div>
    <div class="metric-card">
      <div class="metric-label">Testes Realizados</div>
      <div class="metric-value">${prgData.totalTestes}</div>
    </div>
    <div class="metric-card">
      <div class="metric-label">Índice Global PRG</div>
      <div class="metric-value">${prgData.indiceGlobal}%</div>
    </div>
  </div>

  ${prgData.recomendacoes.map((rec, index) => `
    <div class="recomendacao">
      <div class="rec-header">
        <div class="rec-title">${index + 1}. ${rec.titulo}</div>
        <span class="badge ${rec.prioridade === 'Alta' || rec.prioridade === 'alta' ? 'badge-alta' : 'badge-media'}">${rec.prioridade}</span>
        <span class="badge badge-categoria">${rec.categoria}</span>
      </div>
      
      <div class="rec-descricao">${rec.descricao}</div>
      
      ${rec.prazo || rec.responsavel ? `
        <div class="rec-info">
          ${rec.prazo ? `<div class="info-item"><span class="info-label">⏱️ Prazo:</span> ${rec.prazo}</div>` : ''}
          ${rec.responsavel ? `<div class="info-item"><span class="info-label">👥 Responsável:</span> ${rec.responsavel}</div>` : ''}
        </div>
      ` : ''}
      
      ${rec.acoesPraticas && rec.acoesPraticas.length > 0 ? `
        <div class="section">
          <div class="section-title">✅ Passos para Implementação</div>
          <ul class="acoes-list">
            ${rec.acoesPraticas.map(acao => `<li>${acao}</li>`).join('')}
          </ul>
        </div>
      ` : ''}
      
      ${rec.impactoEsperado ? `
        <div class="impacto-box">
          <strong>📈 Impacto Esperado:</strong> ${rec.impactoEsperado}
        </div>
      ` : ''}
      
      ${rec.recursos && rec.recursos.length > 0 ? `
        <div class="recursos-box">
          <strong>💼 Recursos Necessários:</strong><br>
          ${rec.recursos.map(r => `• ${r}`).join('<br>')}
        </div>
      ` : ''}
    </div>
  `).join('')}

  <div class="footer">
    <p><strong>HumaniQ</strong> - Plataforma de Avaliação Psicológica</p>
    <p>Documento gerado automaticamente pelo sistema PRG</p>
  </div>
</body>
</html>
    `;

    // Criar blob e baixar
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Plano-de-Acao-PRG-${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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

        {/* ANÁLISE INTELIGENTE DA IA - VERSÃO REVOLUCIONÁRIA */}
        <div className="relative overflow-hidden rounded-3xl border-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 backdrop-blur-xl shadow-2xl">
          {/* Partículas de fundo animadas */}
          <div className="absolute inset-0 opacity-20">
            {[...Array(15)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-white animate-pulse"
                style={{
                  width: `${Math.random() * 4 + 2}px`,
                  height: `${Math.random() * 4 + 2}px`,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${Math.random() * 3 + 2}s`
                }}
              />
            ))}
          </div>

          {/* Header futurista */}
          <div className="relative p-8 border-b border-white/10">
            <div className="flex items-start justify-between gap-6 flex-wrap">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl blur-xl opacity-50 animate-pulse"></div>
                  <div className="relative p-4 bg-gradient-to-br from-purple-500/30 to-blue-500/30 rounded-2xl backdrop-blur-xl border border-white/20">
                    <Brain className="h-8 w-8 text-white animate-pulse" />
                  </div>
                </div>
                <div>
                  <h2 className="text-3xl font-black text-white mb-1 bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
                    HumaniQ AI - Análise Inteligente
                  </h2>
                  <p className="text-white/80 font-medium text-sm">
                    Powered by Google Gemini AI • ISO 45003:2021 • NR-01 Compliant
                  </p>
                </div>
              </div>

              {/* Badges de credibilidade */}
              <div className="flex gap-2 flex-wrap">
                <Badge className="bg-gradient-to-r from-green-500/30 to-emerald-500/30 border border-green-400/30 text-green-100 backdrop-blur-xl px-3 py-1">
                  <Target className="h-3 w-3 mr-1" />
                  ISO 45003
                </Badge>
                <Badge className="bg-gradient-to-r from-blue-500/30 to-cyan-500/30 border border-blue-400/30 text-blue-100 backdrop-blur-xl px-3 py-1">
                  <Shield className="h-3 w-3 mr-1" />
                  NR-01
                </Badge>
                <Badge className="bg-gradient-to-r from-purple-500/30 to-pink-500/30 border border-purple-400/30 text-purple-100 backdrop-blur-xl px-3 py-1">
                  <Sparkles className="h-3 w-3 mr-1" />
                  AI-Powered
                </Badge>
              </div>
            </div>

            {/* Mini KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
              <div className="bg-white/5 backdrop-blur-xl rounded-xl p-3 border border-white/10">
                <p className="text-white/70 text-xs font-medium mb-1">Colaboradores Avaliados</p>
                <p className="text-white text-2xl font-bold">{prgData?.totalColaboradores || 0}</p>
              </div>
              <div className="bg-white/5 backdrop-blur-xl rounded-xl p-3 border border-white/10">
                <p className="text-white/70 text-xs font-medium mb-1">Testes Realizados</p>
                <p className="text-white text-2xl font-bold">{prgData?.totalTestes || 0}</p>
              </div>
              <div className="bg-white/5 backdrop-blur-xl rounded-xl p-3 border border-white/10">
                <p className="text-white/70 text-xs font-medium mb-1">Cobertura Populacional</p>
                <p className="text-white text-2xl font-bold">{prgData?.cobertura || 0}%</p>
              </div>
              <div className="bg-white/5 backdrop-blur-xl rounded-xl p-3 border border-white/10">
                <p className="text-white/70 text-xs font-medium mb-1">Índice Global PRG</p>
                <p className={`text-2xl font-bold ${prgData && prgData.indiceGlobal < 40 ? 'text-red-400' : prgData && prgData.indiceGlobal < 60 ? 'text-yellow-400' : 'text-green-400'}`}>
                  {prgData?.indiceGlobal || 0}%
                </p>
              </div>
            </div>
          </div>

          {/* Conteúdo principal da análise */}
          <div className="relative p-8 space-y-6">
            {/* Análise Visual Organizada */}
            {prgData?.aiAnalysis.sintese ? (
              <div className="space-y-4">
                {/* Processar e exibir a análise de forma estruturada */}
                {(() => {
                  const texto = prgData.aiAnalysis.sintese
                    .replace(/\*\*/g, '') // Remover asteriscos
                    .replace(/\*/g, '');
                  
                  // Dividir por parágrafos
                  const paragrafos = texto.split('\n\n').filter(p => p.trim());
                  
                  return paragrafos.map((paragrafo, idx) => {
                    // Detectar se é um título (começa com letra maiúscula e tem menos de 80 chars sem ponto final)
                    const ehTitulo = paragrafo.length < 80 && !paragrafo.endsWith('.') && paragrafo === paragrafo.toUpperCase();
                    
                    // Detectar listas (linhas que começam com •, -, ou número)
                    const linhas = paragrafo.split('\n');
                    const ehLista = linhas.some(l => l.trim().match(/^[•\-\d]/));
                    
                    if (ehTitulo) {
                      return (
                        <div key={idx} className="flex items-center gap-3 pt-4 pb-2">
                          <div className="p-2 bg-blue-500/20 rounded-lg">
                            <Target className="h-4 w-4 text-blue-300" />
                          </div>
                          <h4 className="text-white font-bold text-base">{paragrafo}</h4>
                        </div>
                      );
                    }
                    
                    if (ehLista) {
                      return (
                        <div key={idx} className="bg-white/5 backdrop-blur-xl rounded-xl p-5 border border-white/10">
                          <div className="space-y-2">
                            {linhas.map((linha, i) => {
                              const textoLimpo = linha.trim().replace(/^[•\-\d\.]+\s*/, '');
                              if (!textoLimpo) return null;
                              
                              return (
                                <div key={i} className="flex items-start gap-3">
                                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                                  <p className="text-white/85 text-sm leading-relaxed flex-1">{textoLimpo}</p>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    }
                    
                    // Parágrafo normal
                    return (
                      <div key={idx} className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-xl p-5 border border-white/10">
                        <p className="text-white/90 text-sm leading-relaxed">{paragrafo}</p>
                      </div>
                    );
                  });
                })()}
              </div>
            ) : (
              <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                <div className="flex items-center justify-center gap-3 py-8">
                  <Loader2 className="h-6 w-6 text-blue-300 animate-spin" />
                  <p className="text-white/70 text-sm">Gerando análise inteligente...</p>
                </div>
              </div>
            )}

            {/* Metodologia e Frameworks */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 backdrop-blur-xl rounded-xl p-4 border border-purple-400/20">
                <div className="flex items-center gap-2 mb-2">
                  <GraduationCap className="h-5 w-5 text-purple-300" />
                  <h4 className="text-purple-200 font-bold text-sm">Modelo Karasek-Theorell</h4>
                </div>
                <p className="text-purple-100/80 text-xs">Demanda-Controle-Suporte Social (1990)</p>
              </div>

              <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 backdrop-blur-xl rounded-xl p-4 border border-blue-400/20">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-5 w-5 text-blue-300" />
                  <h4 className="text-blue-200 font-bold text-sm">NR-01 (MTP nº 6.730/2020)</h4>
                </div>
                <p className="text-blue-100/80 text-xs">Gestão de Riscos Psicossociais</p>
              </div>

              <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 backdrop-blur-xl rounded-xl p-4 border border-green-400/20">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="h-5 w-5 text-green-300" />
                  <h4 className="text-green-200 font-bold text-sm">ISO 45003:2021</h4>
                </div>
                <p className="text-green-100/80 text-xs">Saúde e Segurança Psicológica</p>
              </div>
            </div>

            {/* Footer com timestamp */}
            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <div className="flex items-center gap-2 text-white/60 text-xs">
                <Calendar className="h-4 w-4" />
                <span>Última atualização: {new Date().toLocaleString('pt-BR')}</span>
              </div>
              <div className="flex items-center gap-2 text-white/60 text-xs">
                <Sparkles className="h-4 w-4" />
                <span>Análise em tempo real</span>
              </div>
            </div>
          </div>
        </div>

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
        </Tabs>

        {/* AÇÕES RECOMENDADAS - VERSÃO APRIMORADA */}
        <Card className="border-0 bg-gradient-to-br from-orange-900/80 to-red-900/80 backdrop-blur-xl shadow-xl">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500/30 rounded-lg">
                <Target className="h-6 w-6 text-orange-200" />
              </div>
              <div>
                <CardTitle className="text-white text-2xl font-bold">Ações Recomendadas pela IA</CardTitle>
                <CardDescription className="text-white/90 font-medium">
                  Plano de ação personalizado baseado nos resultados
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {prgData?.recomendacoes.map((rec, index) => {
              const IconComponent = getIconForRecomendacao(rec.categoria);
              const expandida = recomendacoesExpandidas.has(index);
              
              return (
                <div 
                  key={index} 
                  className="bg-white/10 rounded-xl border border-white/10 overflow-hidden transition-all hover:shadow-lg"
                  data-testid={`recomendacao-${index}`}
                >
                  {/* Header da recomendação */}
                  <div 
                    className="flex items-start gap-4 p-5 cursor-pointer hover:bg-white/15 transition-all"
                    onClick={() => toggleRecomendacao(index)}
                  >
                    <div className="p-3 bg-orange-500/30 rounded-xl">
                      <IconComponent className="h-6 w-6 text-orange-100" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <h4 className="text-white font-bold text-lg">{rec.titulo}</h4>
                        <Badge variant="outline" className={
                          rec.prioridade === "alta" || rec.prioridade === "Alta"
                            ? "bg-red-600/90 text-white border-red-400 font-bold" 
                            : "bg-yellow-600/90 text-white border-yellow-400 font-bold"
                        }>
                          {rec.prioridade === "alta" || rec.prioridade === "Alta" ? "Alta" : "Média"}
                        </Badge>
                        <Badge variant="outline" className="bg-blue-600/90 text-white border-blue-400">
                          {rec.categoria}
                        </Badge>
                      </div>
                      <p className="text-white/95 text-sm leading-relaxed">{rec.descricao}</p>
                      
                      {/* Indicadores rápidos */}
                      <div className="flex items-center gap-4 mt-3 text-xs text-white/70">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{rec.prazo}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          <span>{rec.responsavel}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      {expandida ? (
                        <ChevronUp className="h-5 w-5 text-white/60" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-white/60" />
                      )}
                    </div>
                  </div>

                  {/* Conteúdo expandido */}
                  {expandida && (
                    <div className="px-5 pb-5 space-y-4 border-t border-white/10 pt-4">
                      {/* Ações Práticas */}
                      {rec.acoesPraticas && rec.acoesPraticas.length > 0 && (
                        <div className="bg-white/5 rounded-lg p-4">
                          <h5 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-400" />
                            Passos para Implementação
                          </h5>
                          <div className="space-y-2">
                            {rec.acoesPraticas.map((acao, i) => (
                              <div key={i} className="flex items-start gap-2">
                                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-orange-400 flex-shrink-0" />
                                <p className="text-white/90 text-xs leading-relaxed flex-1">{acao}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Grid de informações */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {/* Impacto Esperado */}
                        {rec.impactoEsperado && (
                          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-1">
                              <TrendingUp className="h-4 w-4 text-green-400" />
                              <span className="text-green-300 font-semibold text-xs">Impacto Esperado</span>
                            </div>
                            <p className="text-white/90 text-xs">{rec.impactoEsperado}</p>
                          </div>
                        )}

                        {/* Recursos Necessários */}
                        {rec.recursos && rec.recursos.length > 0 && (
                          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-1">
                              <Briefcase className="h-4 w-4 text-blue-400" />
                              <span className="text-blue-300 font-semibold text-xs">Recursos Necessários</span>
                            </div>
                            <div className="space-y-1">
                              {rec.recursos.map((recurso, i) => (
                                <p key={i} className="text-white/90 text-xs">• {recurso}</p>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            <div className="pt-4">
              <Button 
                onClick={handleExportarPlanoAcao}
                className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 w-full text-white font-bold text-lg py-6 shadow-lg" 
                data-testid="button-exportar-plano"
              >
                <Download className="h-5 w-5 mr-2" />
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
