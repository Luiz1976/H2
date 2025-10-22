import React, { useState, useEffect } from 'react';
import { UserPlus, Mail, Calendar, Clock, CheckCircle, AlertTriangle, Copy, Send, Eye, Trash2, Plus, Database, Upload, FileSpreadsheet, Link as LinkIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from 'sonner';
import { hybridInvitationService } from '../../services/invitationServiceHybrid';
import { useAuth } from '../../hooks/AuthContext';
import { StatusConvite } from '../../lib/enums';

interface ConviteColaborador {
  id: string;
  token: string;
  email: string;
  nome: string;
  status: StatusConvite;
  validade: string;
  created_at: string;
}

const EmpresaGerarConvite: React.FC = () => {
  const [convites, setConvites] = useState<ConviteColaborador[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNovoConviteModal, setShowNovoConviteModal] = useState(false);
  const [filtro, setFiltro] = useState('');
  const [statusFiltro, setStatusFiltro] = useState<'todos' | StatusConvite>('todos');
  const [novoConvite, setNovoConvite] = useState({
    email: '',
    nome: '',
    cargo: '',
    departamento: '',
    dias_expiracao: 7
  });
  const [enviandoConvite, setEnviandoConvite] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    carregarConvites();
  }, []);

  const carregarConvites = async () => {
    try {
      setLoading(true);
      console.log('🔄 Carregando convites da empresa...');
      
      if (!user?.empresaId) {
        console.error('❌ ID da empresa não encontrado');
        toast.error('Erro ao carregar convites', {
          description: 'ID da empresa não encontrado'
        });
        return;
      }

      const response = await hybridInvitationService.listarConvites('colaborador', user.empresaId);
      console.log('✅ Convites carregados:', response);
      
      if (response.success && response.data) {
        setConvites(response.data as ConviteColaborador[]);
      } else {
        console.error('❌ Erro na resposta:', response.message);
        setConvites([]);
      }
    } catch (error) {
      console.error('❌ Erro ao carregar convites:', error);
      toast.error('Erro ao carregar convites', {
        description: 'Tente novamente em alguns instantes'
      });
    } finally {
      setLoading(false);
    }
  };

  const criarConvite = async () => {
    try {
      setEnviandoConvite(true);
      console.log('🔄 Criando novo convite...', novoConvite);

      if (!user?.empresaId) {
        toast.error('Erro', { description: 'ID da empresa não encontrado' });
        return;
      }

      const response = await hybridInvitationService.criarConviteColaborador({
        empresa_id: user.empresaId,
        email: novoConvite.email,
        nome: novoConvite.nome,
        dias_expiracao: novoConvite.dias_expiracao
      });

      console.log('✅ Convite criado:', response);
      
      if (response.success) {
        toast.success('Convite criado com sucesso!', {
          description: `Convite enviado para ${novoConvite.nome}`
        });

        setNovoConvite({
          email: '',
          nome: '',
          cargo: '',
          departamento: '',
          dias_expiracao: 7
        });

        setShowNovoConviteModal(false);
        carregarConvites();
      } else {
        toast.error('Erro ao criar convite', {
          description: response.message
        });
      }

    } catch (error) {
      console.error('❌ Erro ao criar convite:', error);
      toast.error('Erro ao criar convite', {
        description: 'Tente novamente em alguns instantes'
      });
    } finally {
      setEnviandoConvite(false);
    }
  };

  const copiarLinkConvite = (token: string) => {
    const link = `${window.location.origin}/convite/${token}`;
    navigator.clipboard.writeText(link);
    toast.success('Link copiado!', {
      description: 'Link do convite copiado para a área de transferência'
    });
  };

  const reenviarConvite = async (conviteId: string) => {
    try {
      toast.info('Funcionalidade em desenvolvimento', {
        description: 'O reenvio de convites será implementado em breve'
      });
    } catch (error) {
      console.error('❌ Erro ao reenviar convite:', error);
      toast.error('Erro ao reenviar convite', {
        description: 'Tente novamente em alguns instantes'
      });
    }
  };

  const excluirConvite = async (conviteToken: string) => {
    try {
      console.log('🗑️ Excluindo convite com token:', conviteToken);
      
      const response = await hybridInvitationService.cancelarConvite(conviteToken, 'colaborador');
      
      if (response.success) {
        toast.success('Convite excluído com sucesso', {
          description: 'O convite foi cancelado e não poderá mais ser usado'
        });
        
        await carregarConvites();
      } else {
        console.error('❌ Erro na resposta:', response.message);
        toast.error('Erro ao excluir convite', {
          description: response.message || 'Tente novamente em alguns instantes'
        });
      }
    } catch (error) {
      console.error('❌ Erro ao excluir convite:', error);
      toast.error('Erro ao excluir convite', {
        description: 'Tente novamente em alguns instantes'
      });
    }
  };

  const getStatusConvite = (convite: ConviteColaborador): StatusConvite => {
    if (convite.status === 'cancelado') return 'cancelado' as StatusConvite;
    if (convite.status === StatusConvite.ACEITO) return StatusConvite.ACEITO;
    if (new Date(convite.validade) < new Date()) return StatusConvite.EXPIRADO;
    return StatusConvite.PENDENTE;
  };

  const getStatusBadge = (status: StatusConvite) => {
    switch (status) {
      case StatusConvite.ACEITO:
        return <Badge variant="default" className="bg-green-100 text-green-800" data-testid="badge-usado">Usado</Badge>;
      case StatusConvite.EXPIRADO:
        return <Badge variant="destructive" data-testid="badge-expirado">Expirado</Badge>;
      case 'cancelado' as StatusConvite:
        return <Badge variant="outline" className="bg-gray-100 text-gray-800" data-testid="badge-cancelado">Cancelado</Badge>;
      case StatusConvite.PENDENTE:
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800" data-testid="badge-pendente">Pendente</Badge>;
      default:
        return <Badge variant="outline" data-testid="badge-desconhecido">Desconhecido</Badge>;
    }
  };

  const convitesFiltrados = convites.filter(convite => {
    const matchesSearch = convite.nome.toLowerCase().includes(filtro.toLowerCase()) ||
                         convite.email.toLowerCase().includes(filtro.toLowerCase());
    
    const status = getStatusConvite(convite);
    const matchesStatus = statusFiltro === 'todos' || status === statusFiltro;
    
    return matchesSearch && matchesStatus;
  });

  const formatarData = (dataString: string) => {
    return new Date(dataString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950 p-6 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto"></div>
          <p className="text-white/70 text-lg">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg">
              <UserPlus className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white" data-testid="text-page-title">Gerar Convites</h1>
              <p className="text-white/70">Escolha como deseja convidar colaboradores</p>
            </div>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* CARD 1: Convite Individual */}
          <Card className="border-0 bg-white/10 backdrop-blur-xl shadow-2xl">
            <CardHeader className="border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                  <UserPlus className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl text-white" data-testid="text-card-individual-title">Convite Individual</CardTitle>
                  <CardDescription className="text-white/60">
                    Gere convites personalizados para colaboradores específicos
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Botão Novo Convite */}
              <Dialog open={showNovoConviteModal} onOpenChange={setShowNovoConviteModal}>
                <DialogTrigger asChild>
                  <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg" data-testid="button-novo-convite">
                    <Plus className="h-4 w-4 mr-2" />
                    Criar Novo Convite
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Criar Novo Convite</DialogTitle>
                    <DialogDescription>
                      Preencha os dados do colaborador para enviar um convite
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="nome">Nome do Colaborador *</Label>
                      <Input
                        id="nome"
                        value={novoConvite.nome}
                        onChange={(e) => setNovoConvite(prev => ({ ...prev, nome: e.target.value }))}
                        placeholder="Digite o nome completo"
                        data-testid="input-nome"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">E-mail *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={novoConvite.email}
                        onChange={(e) => setNovoConvite(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="colaborador@empresa.com"
                        data-testid="input-email"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cargo">Cargo</Label>
                      <Input
                        id="cargo"
                        value={novoConvite.cargo}
                        onChange={(e) => setNovoConvite(prev => ({ ...prev, cargo: e.target.value }))}
                        placeholder="Ex: Analista, Gerente..."
                        data-testid="input-cargo"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="departamento">Departamento</Label>
                      <Input
                        id="departamento"
                        value={novoConvite.departamento}
                        onChange={(e) => setNovoConvite(prev => ({ ...prev, departamento: e.target.value }))}
                        placeholder="Ex: TI, RH, Vendas..."
                        data-testid="input-departamento"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dias">Dias para Expiração</Label>
                      <Select
                        value={novoConvite.dias_expiracao.toString()}
                        onValueChange={(value) => setNovoConvite(prev => ({ ...prev, dias_expiracao: parseInt(value) }))}
                      >
                        <SelectTrigger data-testid="select-dias-expiracao">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="3">3 dias</SelectItem>
                          <SelectItem value="7">7 dias</SelectItem>
                          <SelectItem value="15">15 dias</SelectItem>
                          <SelectItem value="30">30 dias</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex justify-end space-x-2 pt-4">
                      <Button variant="outline" onClick={() => setShowNovoConviteModal(false)} data-testid="button-cancelar">
                        Cancelar
                      </Button>
                      <Button 
                        onClick={criarConvite}
                        disabled={enviandoConvite || !novoConvite.nome || !novoConvite.email}
                        data-testid="button-criar-convite"
                      >
                        {enviandoConvite ? 'Enviando...' : 'Criar Convite'}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Filtros */}
              <div className="space-y-3">
                <Input
                  placeholder="Buscar por nome ou email..."
                  value={filtro}
                  onChange={(e) => setFiltro(e.target.value)}
                  className="bg-white/5 border-white/20 text-white placeholder:text-white/40"
                  data-testid="input-buscar"
                />
                <Select value={statusFiltro} onValueChange={(value: any) => setStatusFiltro(value)}>
                  <SelectTrigger className="bg-white/5 border-white/20 text-white" data-testid="select-status-filtro">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos os Status</SelectItem>
                    <SelectItem value={StatusConvite.PENDENTE}>Pendentes</SelectItem>
                    <SelectItem value={StatusConvite.ACEITO}>Usados</SelectItem>
                    <SelectItem value={StatusConvite.EXPIRADO}>Expirados</SelectItem>
                    <SelectItem value="cancelado">Cancelados</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Lista de Convites */}
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {convitesFiltrados.length === 0 ? (
                  <Alert className="bg-yellow-500/10 border-yellow-500/20">
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    <AlertDescription className="text-white/70">
                      {convites.length === 0 
                        ? 'Nenhum convite foi enviado ainda.'
                        : 'Nenhum convite encontrado com os filtros aplicados.'
                      }
                    </AlertDescription>
                  </Alert>
                ) : (
                  convitesFiltrados.map((convite) => (
                    <div key={convite.id} className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-colors" data-testid={`card-convite-${convite.id}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-white" data-testid={`text-nome-${convite.id}`}>{convite.nome}</h3>
                            {getStatusBadge(getStatusConvite(convite))}
                          </div>
                          <p className="text-sm text-white/60 mb-1" data-testid={`text-email-${convite.id}`}>{convite.email}</p>
                          <div className="flex items-center gap-4 text-xs text-white/50">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {formatarData(convite.created_at)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              Expira: {formatarData(convite.validade)}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copiarLinkConvite(convite.token)}
                            title="Copiar link do convite"
                            className="bg-white/5 border-white/20 hover:bg-white/10"
                            data-testid={`button-copiar-${convite.id}`}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          {convite.status === StatusConvite.PENDENTE && getStatusConvite(convite) !== StatusConvite.EXPIRADO && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => reenviarConvite(convite.id)}
                              title="Reenviar convite"
                              className="bg-white/5 border-white/20 hover:bg-white/10"
                              data-testid={`button-reenviar-${convite.id}`}
                            >
                              <Send className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => excluirConvite(convite.token)}
                            title="Excluir convite"
                            className="bg-white/5 border-red-500/20 hover:bg-red-500/10 text-red-400"
                            data-testid={`button-excluir-${convite.id}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Estatísticas */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                  <p className="text-sm text-white/60">Total</p>
                  <p className="text-2xl font-bold text-white" data-testid="text-total-convites">{convites.length}</p>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                  <p className="text-sm text-white/60">Pendentes</p>
                  <p className="text-2xl font-bold text-white" data-testid="text-pendentes">
                    {convites.filter(c => getStatusConvite(c) === StatusConvite.PENDENTE).length}
                  </p>
                </div>
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                  <p className="text-sm text-white/60">Usados</p>
                  <p className="text-2xl font-bold text-white" data-testid="text-usados">
                    {convites.filter(c => getStatusConvite(c) === StatusConvite.ACEITO).length}
                  </p>
                </div>
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                  <p className="text-sm text-white/60">Expirados</p>
                  <p className="text-2xl font-bold text-white" data-testid="text-expirados">
                    {convites.filter(c => getStatusConvite(c) === StatusConvite.EXPIRADO).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CARD 2: Integração com ERP */}
          <Card className="border-0 bg-white/10 backdrop-blur-xl shadow-2xl">
            <CardHeader className="border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg">
                  <Database className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl text-white" data-testid="text-card-erp-title">Integração com ERP</CardTitle>
                  <CardDescription className="text-white/60">
                    Importe colaboradores diretamente do seu sistema ERP
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                {/* Informativo */}
                <Alert className="bg-emerald-500/10 border-emerald-500/20">
                  <Database className="h-4 w-4 text-emerald-400" />
                  <AlertDescription className="text-white/70">
                    <strong className="text-white">Em breve:</strong> Conecte seu ERP e importe colaboradores automaticamente com sincronização em tempo real.
                  </AlertDescription>
                </Alert>

                {/* Features futuras */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Funcionalidades Planejadas:</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg border border-white/10">
                      <LinkIcon className="h-5 w-5 text-emerald-400 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-white">Conexão Direta</h4>
                        <p className="text-sm text-white/60">Configure a conexão com seu sistema ERP de forma segura</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg border border-white/10">
                      <Upload className="h-5 w-5 text-emerald-400 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-white">Importação em Lote</h4>
                        <p className="text-sm text-white/60">Importe múltiplos colaboradores de uma vez</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg border border-white/10">
                      <FileSpreadsheet className="h-5 w-5 text-emerald-400 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-white">Sincronização Automática</h4>
                        <p className="text-sm text-white/60">Mantenha os dados sempre atualizados automaticamente</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg border border-white/10">
                      <CheckCircle className="h-5 w-5 text-emerald-400 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-white">Validação de Dados</h4>
                        <p className="text-sm text-white/60">Verificação automática de dados duplicados e inválidos</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <div className="pt-4">
                  <Button 
                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg opacity-50 cursor-not-allowed"
                    disabled
                    data-testid="button-conectar-erp"
                  >
                    <Database className="h-4 w-4 mr-2" />
                    Conectar ERP (Em breve)
                  </Button>
                  <p className="text-center text-xs text-white/40 mt-2">
                    Aguarde as próximas atualizações
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EmpresaGerarConvite;
