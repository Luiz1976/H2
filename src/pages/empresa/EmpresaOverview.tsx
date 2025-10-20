import React, { useState, useEffect } from 'react';
import { Users, UserPlus, TrendingUp, Award, Mail, Calendar, Clock, CheckCircle, Activity, Target, BarChart3 } from 'lucide-react';
import { empresaStatisticsService, EstatisticasEmpresa } from '../../services/empresaStatisticsService';
import { apiService } from '../../services/apiService';
import { useAuth } from '../../hooks/AuthContext';
import { toast } from 'sonner';

interface Colaborador {
  id: string;
  nome: string;
  email: string;
  cargo?: string;
  departamento?: string;
  ativo: boolean;
  created_at: string;
  updated_at: string;
  total_testes?: number;
  ultimo_teste?: string;
}

interface ConviteColaborador {
  id: string;
  token: string;
  email: string;
  nome: string;
  status: 'pendente' | 'usado' | 'expirado';
  validade: string;
  created_at: string;
}

export default function EmpresaOverview() {
  const { user } = useAuth();
  const [estatisticas, setEstatisticas] = useState<EstatisticasEmpresa>({
    total_colaboradores: 0,
    colaboradores_ativos: 0,
    total_testes_realizados: 0,
    convites_pendentes: 0,
    testes_este_mes: 0,
    media_pontuacao: 0
  });
  const [loading, setLoading] = useState(true);
  const [showConviteModal, setShowConviteModal] = useState(false);
  const [novoConvite, setNovoConvite] = useState({
    email: '',
    nome: '',
    cargo: '',
    departamento: '',
    dias_expiracao: 7
  });

  const carregarEstatisticas = async () => {
    if (!user?.empresaId) {
      console.log('🔍 [EmpresaOverview] Usuário sem empresaId:', user);
      return;
    }

    console.log('🔍 [EmpresaOverview] Iniciando carregamento de estatísticas para empresa:', user.empresaId);
    setLoading(true);
    
    try {
      const stats = await empresaStatisticsService.buscarEstatisticasEmpresa(user.empresaId);
      console.log('✅ [EmpresaOverview] Estatísticas carregadas com sucesso:', stats);
      setEstatisticas(stats);
    } catch (error) {
      console.error('❌ [EmpresaOverview] Erro ao carregar estatísticas:', error);
      toast.error('Erro ao carregar estatísticas da empresa');
    } finally {
      setLoading(false);
      console.log('🔍 [EmpresaOverview] Carregamento finalizado');
    }
  };

  useEffect(() => {
    carregarEstatisticas();
  }, [user?.empresaId]);



  const criarConviteColaborador = async () => {
    try {
      if (!novoConvite.email || !novoConvite.nome) {
        toast.error('Email e nome são obrigatórios');
        return;
      }

      if (!user?.empresaId) {
        toast.error('Empresa não identificada');
        return;
      }

      const response = await apiService.criarConviteColaborador({
        nome: novoConvite.nome,
        email: novoConvite.email,
        cargo: novoConvite.cargo,
        departamento: novoConvite.departamento,
        diasValidade: novoConvite.dias_expiracao
      });

      toast.success('Convite criado com sucesso!');
      
      // Gerar URL do convite
      const urlConvite = `${window.location.origin}/aceitar-convite/${response.token}`;
      
      // Copiar para clipboard
      navigator.clipboard.writeText(urlConvite);
      toast.info('URL do convite copiada para a área de transferência');
      
      setShowConviteModal(false);
      setNovoConvite({ email: '', nome: '', cargo: '', departamento: '', dias_expiracao: 7 });
      carregarEstatisticas();
    } catch (error) {
      console.error('Erro ao criar convite:', error);
      toast.error('Erro ao criar convite');
    }
  };

  const calcularTaxaParticipacao = (): string => {
    if (estatisticas.total_colaboradores === 0) return '0';
    return ((estatisticas.total_testes_realizados / estatisticas.total_colaboradores) * 100).toFixed(1);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {user?.name ? `${user.name} - Visão Geral` : 'Visão Geral'}
          </h1>
          <p className="text-gray-600">Acompanhe o desempenho e estatísticas da sua empresa</p>
        </div>
        <button
          onClick={() => setShowConviteModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <UserPlus className="w-4 h-4" />
          <span>Convidar Colaborador</span>
        </button>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total de Colaboradores</p>
              <p className="text-2xl font-semibold text-gray-900">{estatisticas.total_colaboradores}</p>
              <p className="text-xs text-gray-500">{estatisticas.colaboradores_ativos} ativos</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Activity className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Testes Realizados</p>
              <p className="text-2xl font-semibold text-gray-900">{estatisticas.total_testes_realizados}</p>
              <p className="text-xs text-gray-500">{estatisticas.testes_este_mes} este mês</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Média de Pontuação</p>
              <p className="text-2xl font-semibold text-gray-900">{estatisticas.media_pontuacao}</p>
              <p className="text-xs text-gray-500">Últimos 30 dias</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Convites Pendentes</p>
              <p className="text-2xl font-semibold text-gray-900">{estatisticas.convites_pendentes}</p>
              <p className="text-xs text-gray-500">Aguardando resposta</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Target className="h-8 w-8 text-indigo-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Taxa de Participação</p>
              <p className="text-2xl font-semibold text-gray-900">{calcularTaxaParticipacao()}%</p>
              <p className="text-xs text-gray-500">Colaboradores que fizeram testes</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Award className="h-8 w-8 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Nível de Engajamento</p>
              <p className="text-2xl font-semibold text-gray-900">
                {estatisticas.media_pontuacao >= 80 ? 'Alto' : 
                 estatisticas.media_pontuacao >= 60 ? 'Médio' : 'Baixo'}
              </p>
              <p className="text-xs text-gray-500">Baseado na pontuação média</p>
            </div>
          </div>
        </div>
      </div>

      {/* Gráficos e Resumos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Resumo Mensal</h3>
            <Calendar className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Testes realizados este mês</span>
              <span className="text-lg font-semibold text-gray-900">{estatisticas.testes_este_mes}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Colaboradores ativos</span>
              <span className="text-lg font-semibold text-gray-900">{estatisticas.colaboradores_ativos}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Convites pendentes</span>
              <span className="text-lg font-semibold text-gray-900">{estatisticas.convites_pendentes}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Indicadores de Performance</h3>
            <BarChart3 className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-gray-600">Taxa de Participação</span>
                <span className="text-sm font-medium text-gray-900">{calcularTaxaParticipacao()}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${Math.min(parseFloat(calcularTaxaParticipacao()), 100)}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-gray-600">Pontuação Média</span>
                <span className="text-sm font-medium text-gray-900">{estatisticas.media_pontuacao}/100</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full" 
                  style={{ width: `${estatisticas.media_pontuacao}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-gray-600">Colaboradores Ativos</span>
                <span className="text-sm font-medium text-gray-900">
                  {estatisticas.total_colaboradores > 0 
                    ? ((estatisticas.colaboradores_ativos / estatisticas.total_colaboradores) * 100).toFixed(1)
                    : 0}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-purple-600 h-2 rounded-full" 
                  style={{ 
                    width: `${estatisticas.total_colaboradores > 0 
                      ? (estatisticas.colaboradores_ativos / estatisticas.total_colaboradores) * 100
                      : 0}%` 
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Convite */}
      {showConviteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Convidar Novo Colaborador</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome do Colaborador
                </label>
                <input
                  type="text"
                  value={novoConvite.nome}
                  onChange={(e) => setNovoConvite({...novoConvite, nome: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Digite o nome do colaborador"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={novoConvite.email}
                  onChange={(e) => setNovoConvite({...novoConvite, email: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="email@colaborador.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cargo (Opcional)
                </label>
                <input
                  type="text"
                  value={novoConvite.cargo}
                  onChange={(e) => setNovoConvite({...novoConvite, cargo: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: Analista, Gerente, etc."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Departamento (Opcional)
                </label>
                <input
                  type="text"
                  value={novoConvite.departamento}
                  onChange={(e) => setNovoConvite({...novoConvite, departamento: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: RH, TI, Vendas, etc."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dias para Expiração
                </label>
                <select
                  value={novoConvite.dias_expiracao}
                  onChange={(e) => setNovoConvite({...novoConvite, dias_expiracao: parseInt(e.target.value)})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={3}>3 dias</option>
                  <option value={7}>7 dias</option>
                  <option value={15}>15 dias</option>
                  <option value={30}>30 dias</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowConviteModal(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={criarConviteColaborador}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Criar Convite
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}