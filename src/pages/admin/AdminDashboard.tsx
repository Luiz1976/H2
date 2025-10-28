import { useState, useEffect } from 'react';
import { 
  DollarSign, TrendingUp, Users, Building2, ShoppingCart, Target, 
  Percent, Activity, ArrowUpRight, ArrowDownRight, BarChart3, 
  Calendar, CheckCircle, XCircle, AlertCircle, Zap, Award,
  Eye, MousePointer, ShoppingBag, CreditCard, Sparkles
} from 'lucide-react';
import { toast } from 'sonner';
import { 
  LineChart, Line, BarChart, Bar, PieChart as RechartsPie, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  AreaChart, Area 
} from 'recharts';

interface DashboardMetrics {
  financeiro: {
    mrr: number;
    arr: number;
    receitaMensal: number;
    receitaTotal: number;
    ticketMedio: number;
    crescimentoMRR: number;
    projecaoProximoMes: number;
    projecaoTrimestre: number;
  };
  empresas: {
    total: number;
    ativas: number;
    inativas: number;
    novasEsteMes: number;
    crescimentoMensal: number;
    churnRate: number;
  };
  colaboradores: {
    total: number;
    ativos: number;
    mediaPorEmpresa: number;
    crescimentoMensal: number;
  };
  conversao: {
    visitantesLanding: number;
    testesDemonstracao: number;
    checkoutsIniciados: number;
    comprasFinalizadas: number;
    taxaLandingParaDemo: number;
    taxaDemoParaCheckout: number;
    taxaCheckoutParaCompra: number;
    taxaConversaoGeral: number;
  };
  planos: {
    distribuicao: Array<{ plano: string; quantidade: number; receita: number }>;
    essencial: number;
    profissional: number;
    enterprise: number;
  };
  tendencias: {
    receitaMensal: Array<{ mes: string; receita: number; empresas: number }>;
    crescimentoEmpresa: Array<{ mes: string; novas: number; canceladas: number }>;
  };
  kpis: {
    ltv: number;
    cac: number;
    ltvCacRatio: number;
    paybackPeriod: number;
  };
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarDashboard();
  }, []);

  const carregarDashboard = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      
      const response = await fetch('/api/admin/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Erro ao carregar dashboard');
      }

      const data = await response.json();
      console.log('📊 Dashboard carregado:', data);
      setMetrics(data);
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error);
      toast.error('Erro ao carregar dashboard executivo');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Carregando dashboard executivo...</p>
        </div>
      </div>
    );
  }

  if (!metrics) return null;

  const planosData = metrics.planos.distribuicao.map(p => ({
    name: p.plano,
    value: p.quantidade,
    receita: p.receita,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Sparkles className="w-8 h-8 mr-3 text-blue-600" />
              Dashboard Executivo
            </h1>
            <p className="text-gray-600 mt-1">Visão completa do negócio em tempo real</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Última atualização</p>
            <p className="text-lg font-semibold text-gray-900">{new Date().toLocaleString('pt-BR')}</p>
          </div>
        </div>
      </div>

      {/* KPIs Principais - Linha 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* MRR */}
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-lg">
              <DollarSign className="w-8 h-8" />
            </div>
            <div className="flex items-center space-x-1">
              {metrics.financeiro.crescimentoMRR >= 0 ? (
                <ArrowUpRight className="w-5 h-5 text-white" />
              ) : (
                <ArrowDownRight className="w-5 h-5 text-white" />
              )}
              <span className="text-sm font-medium">
                {Math.abs(metrics.financeiro.crescimentoMRR)}%
              </span>
            </div>
          </div>
          <p className="text-sm opacity-90 mb-1">MRR (Receita Mensal Recorrente)</p>
          <p className="text-3xl font-bold">R$ {metrics.financeiro.mrr.toLocaleString('pt-BR')}</p>
          <p className="text-xs opacity-75 mt-2">ARR: R$ {metrics.financeiro.arr.toLocaleString('pt-BR')}</p>
        </div>

        {/* Empresas Ativas */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-lg">
              <Building2 className="w-8 h-8" />
            </div>
            <div className="flex items-center space-x-1">
              {metrics.empresas.crescimentoMensal >= 0 ? (
                <ArrowUpRight className="w-5 h-5 text-white" />
              ) : (
                <ArrowDownRight className="w-5 h-5 text-white" />
              )}
              <span className="text-sm font-medium">
                {Math.abs(metrics.empresas.crescimentoMensal)}%
              </span>
            </div>
          </div>
          <p className="text-sm opacity-90 mb-1">Empresas Ativas</p>
          <p className="text-3xl font-bold">{metrics.empresas.ativas}</p>
          <p className="text-xs opacity-75 mt-2">
            {metrics.empresas.novasEsteMes} novas este mês
          </p>
        </div>

        {/* Taxa de Conversão Geral */}
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-lg">
              <Target className="w-8 h-8" />
            </div>
            <CheckCircle className="w-5 h-5 opacity-75" />
          </div>
          <p className="text-sm opacity-90 mb-1">Taxa de Conversão Geral</p>
          <p className="text-3xl font-bold">{metrics.conversao.taxaConversaoGeral}%</p>
          <p className="text-xs opacity-75 mt-2">
            {metrics.conversao.comprasFinalizadas} compras de {metrics.conversao.visitantesLanding} visitas
          </p>
        </div>

        {/* Ticket Médio */}
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-lg">
              <CreditCard className="w-8 h-8" />
            </div>
            <Award className="w-5 h-5 opacity-75" />
          </div>
          <p className="text-sm opacity-90 mb-1">Ticket Médio</p>
          <p className="text-3xl font-bold">R$ {metrics.financeiro.ticketMedio.toLocaleString('pt-BR')}</p>
          <p className="text-xs opacity-75 mt-2">
            {metrics.colaboradores.mediaPorEmpresa.toFixed(1)} colab/empresa
          </p>
        </div>
      </div>

      {/* Funil de Conversão */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <MousePointer className="w-5 h-5 mr-2 text-purple-600" />
          Funil de Conversão
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Visitantes Landing */}
          <div className="relative">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-5 border-2 border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <Eye className="w-6 h-6 text-blue-600" />
                <span className="text-xs font-medium text-blue-700">100%</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{metrics.conversao.visitantesLanding}</p>
              <p className="text-xs text-gray-600 mt-1">Visitantes Landing</p>
            </div>
            <div className="absolute -right-2 top-1/2 transform -translate-y-1/2 text-blue-400 hidden md:block">
              <ArrowUpRight className="w-6 h-6" />
            </div>
          </div>

          {/* Testes Demo */}
          <div className="relative">
            <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-5 border-2 border-green-200">
              <div className="flex items-center justify-between mb-2">
                <Activity className="w-6 h-6 text-green-600" />
                <span className="text-xs font-medium text-green-700">
                  {metrics.conversao.taxaLandingParaDemo}%
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{metrics.conversao.testesDemonstracao}</p>
              <p className="text-xs text-gray-600 mt-1">Testes Demo</p>
            </div>
            <div className="absolute -right-2 top-1/2 transform -translate-y-1/2 text-green-400 hidden md:block">
              <ArrowUpRight className="w-6 h-6" />
            </div>
          </div>

          {/* Checkouts Iniciados */}
          <div className="relative">
            <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-5 border-2 border-orange-200">
              <div className="flex items-center justify-between mb-2">
                <ShoppingCart className="w-6 h-6 text-orange-600" />
                <span className="text-xs font-medium text-orange-700">
                  {metrics.conversao.taxaDemoParaCheckout}%
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{metrics.conversao.checkoutsIniciados}</p>
              <p className="text-xs text-gray-600 mt-1">Checkouts Iniciados</p>
            </div>
            <div className="absolute -right-2 top-1/2 transform -translate-y-1/2 text-orange-400 hidden md:block">
              <ArrowUpRight className="w-6 h-6" />
            </div>
          </div>

          {/* Compras Finalizadas */}
          <div>
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-5 border-2 border-purple-200">
              <div className="flex items-center justify-between mb-2">
                <ShoppingBag className="w-6 h-6 text-purple-600" />
                <span className="text-xs font-medium text-purple-700">
                  {metrics.conversao.taxaCheckoutParaCompra}%
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{metrics.conversao.comprasFinalizadas}</p>
              <p className="text-xs text-gray-600 mt-1">Compras Finalizadas</p>
            </div>
          </div>
        </div>
      </div>

      {/* KPIs Estratégicos */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-xs text-gray-500">LTV</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">R$ {metrics.kpis.ltv.toLocaleString('pt-BR')}</p>
          <p className="text-xs text-gray-500 mt-1">Valor Vitalício</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <DollarSign className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-xs text-gray-500">CAC</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">R$ {metrics.kpis.cac.toLocaleString('pt-BR')}</p>
          <p className="text-xs text-gray-500 mt-1">Custo de Aquisição</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Percent className="w-5 h-5 text-purple-600" />
            </div>
            <span className={`text-xs font-medium ${
              metrics.kpis.ltvCacRatio >= 3 ? 'text-green-600' : 'text-orange-600'
            }`}>
              {metrics.kpis.ltvCacRatio >= 3 ? 'Saudável' : 'Atenção'}
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{metrics.kpis.ltvCacRatio}x</p>
          <p className="text-xs text-gray-500 mt-1">LTV/CAC Ratio</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Calendar className="w-5 h-5 text-orange-600" />
            </div>
            <span className="text-xs text-gray-500">Payback</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{metrics.kpis.paybackPeriod}</p>
          <p className="text-xs text-gray-500 mt-1">Meses para retorno</p>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Receita Mensal */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-green-600" />
            Evolução de Receita (6 meses)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={metrics.tendencias.receitaMensal}>
              <defs>
                <linearGradient id="colorReceita" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="mes" stroke="#94a3b8" style={{ fontSize: '12px' }} />
              <YAxis stroke="#94a3b8" style={{ fontSize: '12px' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px'
                }} 
              />
              <Area 
                type="monotone" 
                dataKey="receita" 
                stroke="#10b981" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorReceita)"
                name="Receita (R$)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Distribuição por Planos */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <Award className="w-5 h-5 mr-2 text-purple-600" />
            Distribuição por Planos
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsPie>
              <Pie
                data={planosData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {planosData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </RechartsPie>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Projeções */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <Zap className="w-6 h-6 mr-2" />
          Projeções Futuras
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm opacity-90 mb-1">Próximo Mês</p>
            <p className="text-3xl font-bold">R$ {metrics.financeiro.projecaoProximoMes.toLocaleString('pt-BR')}</p>
            <p className="text-xs opacity-75 mt-1">MRR projetado</p>
          </div>
          <div>
            <p className="text-sm opacity-90 mb-1">Próximo Trimestre</p>
            <p className="text-3xl font-bold">R$ {metrics.financeiro.projecaoTrimestre.toLocaleString('pt-BR')}</p>
            <p className="text-xs opacity-75 mt-1">Receita projetada</p>
          </div>
          <div>
            <p className="text-sm opacity-90 mb-1">Churn Rate</p>
            <p className="text-3xl font-bold">{metrics.empresas.churnRate}%</p>
            <p className="text-xs opacity-75 mt-1">Taxa de cancelamento</p>
          </div>
        </div>
      </div>
    </div>
  );
}
