import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Calendar, 
  Clock, 
  Copy, 
  X, 
  CheckCircle, 
  XCircle,
  Search,
  Filter
} from 'lucide-react';
import { toast } from 'sonner';
import { authService } from '@/services/authService';
import { apiService } from '@/services/apiService';

interface ConviteEmpresa {
  id: string;
  emailContato?: string;
  nomeEmpresa?: string;
  email?: string;
  nome?: string;
  token: string;
  validade: string;
  status: string;
  linkConvite?: string;
  cargo?: string;
  departamento?: string;
}

export default function AdminConvites() {
  const [convites, setConvites] = useState<ConviteEmpresa[]>([]);
  const [filtroConvites, setFiltroConvites] = useState('');
  const [statusFiltroConvites, setStatusFiltroConvites] = useState<'todos' | 'pendente' | 'usado' | 'expirado'>('todos');

  useEffect(() => {
    carregarConvites();
  }, []);

  const carregarConvites = async () => {
    try {
      const response = await apiService.listarConvites();
      
      if (response.convites) {
        setConvites(response.convites);
      }
    } catch (error) {
      console.error('Erro ao carregar convites:', error);
      toast.error('Erro ao carregar convites');
    }
  };

  const cancelarConvite = async (conviteId: string) => {
    try {
      toast.info('Funcionalidade de cancelamento será implementada em breve');
      // TODO: Implementar endpoint de cancelamento no backend
    } catch (error) {
      console.error('Erro ao cancelar convite:', error);
      toast.error('Erro ao cancelar convite');
    }
  };

  const copiarUrlConvite = (token: string) => {
    const baseUrl = window.location.origin;
    const url = `${baseUrl}/aceitar-convite/${token}?tipo=empresa`;
    navigator.clipboard.writeText(url);
    toast.success('URL copiada para a área de transferência');
  };

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isConviteExpirado = (dataExpiracao: string) => {
    return new Date(dataExpiracao) < new Date();
  };

  const getStatusConvite = (convite: ConviteEmpresa) => {
    if (convite.status === 'usado') return 'usado';
    if (isConviteExpirado(convite.validade)) return 'expirado';
    return 'pendente';
  };

  const convitesFiltrados = convites.filter(convite => {
    const nomeEmpresa = convite.nomeEmpresa || convite.nome || '';
    const emailContato = convite.emailContato || convite.email || '';
    const matchesSearch = nomeEmpresa.toLowerCase().includes(filtroConvites.toLowerCase()) ||
                         emailContato.toLowerCase().includes(filtroConvites.toLowerCase());
    
    const status = getStatusConvite(convite);
    const matchesStatus = statusFiltroConvites === 'todos' || status === statusFiltroConvites;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (convite: ConviteEmpresa) => {
    const status = getStatusConvite(convite);
    
    switch (status) {
      case 'usado':
        return (
          <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Usado
          </span>
        );
      case 'expirado':
        return (
          <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
            <XCircle className="w-3 h-3 mr-1" />
            Expirado
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            Pendente
          </span>
        );
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Convites</h1>
        <p className="text-gray-600">Gerencie os convites enviados para empresas</p>
      </div>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar convites..."
                value={filtroConvites}
                onChange={(e) => setFiltroConvites(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={statusFiltroConvites}
              onChange={(e) => setStatusFiltroConvites(e.target.value as any)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="todos">Todos os status</option>
              <option value="pendente">Pendentes</option>
              <option value="usado">Usados</option>
              <option value="expirado">Expirados</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de Convites */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Empresa
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Criado em
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Expira em
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {convitesFiltrados.map((convite) => (
                <tr key={convite.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                          <Mail className="w-5 h-5 text-purple-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {convite.nomeEmpresa || convite.nome || 'N/A'}
                        </div>
                        <div className="text-sm text-gray-500">
                          Token: {convite.token.substring(0, 8)}...
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{convite.emailContato || convite.email || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(convite)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 text-gray-400 mr-1" />
                      {formatarData(convite.validade)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 text-gray-400 mr-1" />
                      {formatarData(convite.validade)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      {convite.status !== 'usado' && !isConviteExpirado(convite.validade) && (
                        <>
                          <button
                            onClick={() => copiarUrlConvite(convite.token)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Copiar URL do convite"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => cancelarConvite(convite.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Cancelar convite"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {convitesFiltrados.length === 0 && (
          <div className="text-center py-12">
            <Mail className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum convite encontrado</h3>
            <p className="mt-1 text-sm text-gray-500">
              {filtroConvites || statusFiltroConvites !== 'todos' 
                ? 'Tente ajustar os filtros de busca.' 
                : 'Nenhum convite foi enviado ainda.'}
            </p>
          </div>
        )}
      </div>

      {/* Resumo */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Mail className="h-8 w-8 text-gray-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Total</p>
              <p className="text-lg font-semibold text-gray-900">{convites.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Clock className="h-8 w-8 text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Pendentes</p>
              <p className="text-lg font-semibold text-gray-900">
                {convites.filter(c => getStatusConvite(c) === 'pendente').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Usados</p>
              <p className="text-lg font-semibold text-gray-900">
                {convites.filter(c => c.usado).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <XCircle className="h-8 w-8 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Expirados</p>
              <p className="text-lg font-semibold text-gray-900">
                {convites.filter(c => getStatusConvite(c) === 'expirado').length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}