import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Building2, 
  Users, 
  Mail, 
  TrendingUp, 
  TrendingDown,
  Activity,
  Target,
  Award,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  BarChart3,
  PieChart,
  Briefcase
} from 'lucide-react';
import { toast } from 'sonner';
import { LineChart, Line, BarChart, Bar, PieChart as RechartsPie, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Indicadores {
  empresa: {
    id: string;
    nome: string;
    email: string;
    cnpj: string;
    setor: string;
    ativa: boolean;
    dataCadastro: string;
  };
  colaboradores: {
    total: number;
    ativos: number;
    inativos: number;
    comTestes: number;
    taxaConclusao: number;
  };
  convites: {
    gerados: number;
    utilizados: number;
    pendentes: number;
    expirados: number;
    taxaUtilizacao: number;
  };
  testes: {
    total: number;
    esteMes: number;
    ultimos7Dias: number;
    mediaPorColaborador: number;
    pontuacaoMedia: number;
    porCategoria: Record<string, number>;
    crescimentoMensal: number;
  };
  tendencia: Array<{
    mes: string;
    testes: number;
  }>;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function AdminEmpresaDetalhes() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [indicadores, setIndicadores] = useState<Indicadores | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarIndicadores();
  }, [id]);

  const carregarIndicadores = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      
      const response = await fetch(`/api/empresas/${id}/indicadores`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Erro ao carregar indicadores');
      }

      const data = await response.json();
      setIndicadores(data);
    } catch (error) {
      console.error('Erro ao carregar indicadores:', error);
      toast.error('Erro ao carregar indicadores da empresa');
      navigate('/admin');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando indicadores...</p>
        </div>
      </div>
    );
  }

  if (!indicadores) {
    return null;
  }

  const categoriaData = Object.entries(indicadores.testes.porCategoria).map(([nome, valor]) => ({
    nome,
    valor,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/admin')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                data-testid="button-voltar"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900" data-testid="text-nome-empresa">
                      {indicadores.empresa.nome}
                    </h1>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                      <span className="flex items-center">
                        <Mail className="w-4 h-4 mr-1" />
                        {indicadores.empresa.email}
                      </span>
                      {indicadores.empresa.setor && (
                        <span className="flex items-center">
                          <Briefcase className="w-4 h-4 mr-1" />
                          {indicadores.empresa.setor}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                indicadores.empresa.ativa 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {indicadores.empresa.ativa ? 'Ativa' : 'Inativa'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Cards Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Card Colaboradores */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow" data-testid="card-colaboradores">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500 font-medium">Taxa de Conclusão</p>
                <p className="text-lg font-bold text-blue-600">{indicadores.colaboradores.taxaConclusao}%</p>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1" data-testid="text-total-colaboradores">
              {indicadores.colaboradores.total}
            </h3>
            <p className="text-sm text-gray-500 mb-3">Colaboradores Cadastrados</p>
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center text-green-600">
                <CheckCircle className="w-3 h-3 mr-1" />
                {indicadores.colaboradores.ativos} ativos
              </span>
              <span className="flex items-center text-gray-400">
                <XCircle className="w-3 h-3 mr-1" />
                {indicadores.colaboradores.inativos} inativos
              </span>
            </div>
          </div>

          {/* Card Convites */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow" data-testid="card-convites">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-lg">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500 font-medium">Taxa de Utilização</p>
                <p className="text-lg font-bold text-green-600">{indicadores.convites.taxaUtilizacao}%</p>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1" data-testid="text-convites-gerados">
              {indicadores.convites.gerados}
            </h3>
            <p className="text-sm text-gray-500 mb-3">Convites Gerados</p>
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center text-green-600" data-testid="text-convites-utilizados">
                <CheckCircle className="w-3 h-3 mr-1" />
                {indicadores.convites.utilizados} utilizados
              </span>
              <span className="flex items-center text-yellow-600">
                <Clock className="w-3 h-3 mr-1" />
                {indicadores.convites.pendentes} pendentes
              </span>
            </div>
          </div>

          {/* Card Testes */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow" data-testid="card-testes">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500 font-medium">Este Mês</p>
                <p className="text-lg font-bold text-purple-600">{indicadores.testes.esteMes}</p>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1" data-testid="text-total-testes">
              {indicadores.testes.total}
            </h3>
            <p className="text-sm text-gray-500 mb-3">Testes Realizados</p>
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center text-purple-600">
                <Calendar className="w-3 h-3 mr-1" />
                {indicadores.testes.ultimos7Dias} últimos 7 dias
              </span>
            </div>
          </div>

          {/* Card Média */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow" data-testid="card-media">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center">
                {indicadores.testes.crescimentoMensal > 0 ? (
                  <div className="flex items-center text-green-600">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    <span className="text-xs font-medium">+{indicadores.testes.crescimentoMensal}</span>
                  </div>
                ) : indicadores.testes.crescimentoMensal < 0 ? (
                  <div className="flex items-center text-red-600">
                    <TrendingDown className="w-4 h-4 mr-1" />
                    <span className="text-xs font-medium">{indicadores.testes.crescimentoMensal}</span>
                  </div>
                ) : (
                  <div className="text-gray-400 text-xs">Sem mudança</div>
                )}
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1" data-testid="text-media-testes">
              {indicadores.testes.mediaPorColaborador}
            </h3>
            <p className="text-sm text-gray-500 mb-3">Média por Colaborador</p>
            <div className="flex items-center text-xs text-gray-600">
              <Award className="w-3 h-3 mr-1" />
              Pontuação média: {indicadores.testes.pontuacaoMedia}
            </div>
          </div>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Gráfico de Tendência */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6" data-testid="chart-tendencia">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
                Tendência de Testes (6 meses)
              </h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={indicadores.tendencia}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="mes" stroke="#94a3b8" style={{ fontSize: '12px' }} />
                <YAxis stroke="#94a3b8" style={{ fontSize: '12px' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }} 
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="testes" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', r: 5 }}
                  activeDot={{ r: 7 }}
                  name="Testes Realizados"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Gráfico de Categoria */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6" data-testid="chart-categorias">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <PieChart className="w-5 h-5 mr-2 text-purple-600" />
                Distribuição por Categoria
              </h3>
            </div>
            {categoriaData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPie>
                  <Pie
                    data={categoriaData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ nome, percent }) => `${nome}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="valor"
                  >
                    {categoriaData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }} 
                  />
                </RechartsPie>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-gray-400">
                <p>Nenhum teste realizado ainda</p>
              </div>
            )}
          </div>
        </div>

        {/* Cards Adicionais */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Engajamento */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Activity className="w-5 h-5 mr-2" />
              Engajamento
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm opacity-90">Colaboradores com testes</span>
                <span className="text-xl font-bold">{indicadores.colaboradores.comTestes}</span>
              </div>
              <div className="h-2 bg-white bg-opacity-20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-white rounded-full transition-all duration-500"
                  style={{ width: `${indicadores.colaboradores.taxaConclusao}%` }}
                />
              </div>
              <p className="text-xs opacity-75">
                {indicadores.colaboradores.taxaConclusao}% dos colaboradores já realizaram testes
              </p>
            </div>
          </div>

          {/* Performance */}
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Award className="w-5 h-5 mr-2" />
              Performance
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm opacity-90">Pontuação média</span>
                <span className="text-xl font-bold">{indicadores.testes.pontuacaoMedia}</span>
              </div>
              <div className="h-2 bg-white bg-opacity-20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-white rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((indicadores.testes.pontuacaoMedia / 100) * 100, 100)}%` }}
                />
              </div>
              <p className="text-xs opacity-75">
                Baseado em {indicadores.testes.total} testes realizados
              </p>
            </div>
          </div>

          {/* Crescimento */}
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Crescimento
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm opacity-90">Variação mensal</span>
                <span className="text-xl font-bold">
                  {indicadores.testes.crescimentoMensal > 0 ? '+' : ''}
                  {indicadores.testes.crescimentoMensal}
                </span>
              </div>
              <div className="text-xs opacity-75">
                {indicadores.testes.crescimentoMensal > 0 
                  ? '📈 Crescimento positivo em relação ao mês anterior'
                  : indicadores.testes.crescimentoMensal < 0
                  ? '📉 Redução em relação ao mês anterior'
                  : '➡️ Sem variação em relação ao mês anterior'
                }
              </div>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <p className="text-xs text-gray-500 text-center">
            🔒 Dados agregados e anônimos em conformidade com a LGPD. 
            Última atualização: {new Date().toLocaleString('pt-BR')}
          </p>
        </div>
      </div>
    </div>
  );
}
