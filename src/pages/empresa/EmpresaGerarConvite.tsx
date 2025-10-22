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
import { Checkbox } from "@/components/ui/checkbox";
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

interface ErpColaborador {
  nome: string;
  email: string;
  cargo?: string;
  departamento?: string;
  sexo?: string;
  selected?: boolean;
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
  
  const [showErpLoginModal, setShowErpLoginModal] = useState(false);
  const [erpLoginForm, setErpLoginForm] = useState({
    erpType: 'TOTVS',
    username: '',
    password: '',
    customUrl: '', // URL customizada para Oracle, Microsoft, Benner, etc.
  });
  const [erpColaboradores, setErpColaboradores] = useState<ErpColaborador[]>([]);
  const [showColaboradoresTable, setShowColaboradoresTable] = useState(false);
  const [fetchingColaboradores, setFetchingColaboradores] = useState(false);
  const [generatingInvites, setGeneratingInvites] = useState(false);
  
  // ERPs que requerem URL customizada
  const erpsRequiremCustomUrl = ['ORACLE', 'MICROSOFT', 'BENNER', 'OUTRO'];

  useEffect(() => {
    carregarConvites();
  }, []);

  const fazerLoginERP = async () => {
    try {
      setFetchingColaboradores(true);
      
      if (!user?.empresaId) {
        toast.error('ID da empresa não encontrado');
        return;
      }

      if (!erpLoginForm.username || !erpLoginForm.password) {
        toast.error('Preencha todos os campos obrigatórios');
        return;
      }

      const response = await fetch('/api/erp/login-and-fetch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          erpType: erpLoginForm.erpType,
          username: erpLoginForm.username,
          password: erpLoginForm.password,
          empresaId: user.empresaId,
          ...(erpLoginForm.customUrl && { customUrl: erpLoginForm.customUrl }), // Envia URL customizada se fornecida
        }),
      });

      const data = await response.json();

      if (data.success) {
        const colaboradoresComSelecao = data.data.colaboradores.map((col: ErpColaborador) => ({
          ...col,
          selected: true,
        }));
        
        setErpColaboradores(colaboradoresComSelecao);
        setShowErpLoginModal(false);
        setShowColaboradoresTable(true);
        
        toast.success(`${data.data.totalColaboradores} colaboradores encontrados!`, {
          description: 'Selecione quais deseja convidar',
        });
      } else {
        toast.error('Erro ao conectar com o ERP', {
          description: data.error || 'Verifique suas credenciais',
        });
      }
    } catch (error) {
      console.error('Erro ao fazer login no ERP:', error);
      toast.error('Erro ao conectar com o ERP');
    } finally {
      setFetchingColaboradores(false);
    }
  };

  const gerarConvitesEmMassa = async () => {
    try {
      setGeneratingInvites(true);
      
      if (!user?.empresaId) {
        toast.error('ID da empresa não encontrado');
        return;
      }

      const selecionados = erpColaboradores.filter(col => col.selected);
      
      if (selecionados.length === 0) {
        toast.error('Selecione pelo menos um colaborador');
        return;
      }

      const response = await fetch('/api/erp/bulk-invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          empresaId: user.empresaId,
          colaboradores: selecionados,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Convites gerados com sucesso!', {
          description: `${data.data.invited} convites criados, ${data.data.skipped} ignorados`,
        });
        
        setShowColaboradoresTable(false);
        setErpColaboradores([]);
        setErpLoginForm({
          erpType: 'TOTVS',
          username: '',
          password: '',
        });
        
        carregarConvites();
      } else {
        toast.error('Erro ao gerar convites', {
          description: data.error,
        });
      }
    } catch (error) {
      console.error('Erro ao gerar convites em massa:', error);
      toast.error('Erro ao gerar convites');
    } finally {
      setGeneratingInvites(false);
    }
  };

  const toggleColaboradorSelecao = (email: string) => {
    setErpColaboradores(prev => 
      prev.map(col => 
        col.email === email ? { ...col, selected: !col.selected } : col
      )
    );
  };

  const toggleTodosColaboradores = () => {
    const todosSelecionados = erpColaboradores.every(col => col.selected);
    setErpColaboradores(prev => 
      prev.map(col => ({ ...col, selected: !todosSelecionados }))
    );
  };

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
      setConvites([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCriarConvite = async () => {
    try {
      setEnviandoConvite(true);

      if (!user?.empresaId) {
        toast.error('ID da empresa não encontrado');
        return;
      }

      if (!novoConvite.email || !novoConvite.nome) {
        toast.error('Preencha todos os campos obrigatórios');
        return;
      }

      const response = await fetch('/api/convites/colaborador', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: novoConvite.nome,
          email: novoConvite.email,
          cargo: novoConvite.cargo,
          departamento: novoConvite.departamento,
          empresa_id: user.empresaId,
          dias_expiracao: novoConvite.dias_expiracao
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Convite criado com sucesso!', {
          description: `Enviado para ${novoConvite.email}`
        });
        setShowNovoConviteModal(false);
        setNovoConvite({
          email: '',
          nome: '',
          cargo: '',
          departamento: '',
          dias_expiracao: 7
        });
        carregarConvites();
      } else {
        toast.error('Erro ao criar convite', {
          description: data.message || 'Erro desconhecido'
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

  const handleCopiarLink = (token: string) => {
    const link = `${window.location.origin}/aceitar-convite/${token}`;
    navigator.clipboard.writeText(link);
    toast.success('Link copiado!', {
      description: 'Link do convite copiado para a área de transferência'
    });
  };

  const handleDeletarConvite = async (id: string) => {
    try {
      const response = await fetch(`/api/convites/colaborador/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      
      if (data.success) {
        toast.success('Convite deletado com sucesso');
        carregarConvites();
      } else {
        toast.error('Erro ao deletar convite');
      }
    } catch (error) {
      console.error('Erro ao deletar convite:', error);
      toast.error('Erro ao deletar convite');
    }
  };

  const getStatusConvite = (convite: ConviteColaborador): StatusConvite => {
    if (convite.status === StatusConvite.ACEITO) {
      return StatusConvite.ACEITO;
    }
    
    const agora = new Date();
    const validade = new Date(convite.validade);
    
    if (agora > validade) {
      return StatusConvite.EXPIRADO;
    }
    
    return StatusConvite.PENDENTE;
  };

  const getStatusBadge = (status: StatusConvite) => {
    switch (status) {
      case StatusConvite.PENDENTE:
        return <Badge className="bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/30">Pendente</Badge>;
      case StatusConvite.ACEITO:
        return <Badge className="bg-green-500/20 text-green-300 hover:bg-green-500/30">Aceito</Badge>;
      case StatusConvite.EXPIRADO:
        return <Badge className="bg-red-500/20 text-red-300 hover:bg-red-500/30">Expirado</Badge>;
      default:
        return <Badge className="bg-gray-500/20 text-gray-300">Desconhecido</Badge>;
    }
  };

  const convitesFiltrados = convites.filter(convite => {
    const matchFiltro = !filtro || 
      convite.nome.toLowerCase().includes(filtro.toLowerCase()) ||
      convite.email.toLowerCase().includes(filtro.toLowerCase());
    
    const status = getStatusConvite(convite);
    const matchStatus = statusFiltro === 'todos' || status === statusFiltro;
    
    return matchFiltro && matchStatus;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
          <p className="mt-4 text-white/60">Carregando convites...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Gerar Convites</h1>
          <p className="text-white/60">Crie e gerencie convites para colaboradores</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* CARD 1: Convites Individuais */}
          <Card className="border-0 bg-white/10 backdrop-blur-xl shadow-2xl">
            <CardHeader className="border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                  <UserPlus className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl text-white" data-testid="text-card-individual-title">Convite Individual</CardTitle>
                  <CardDescription className="text-white/60">
                    Gere convites um por vez com dados personalizados
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <Dialog open={showNovoConviteModal} onOpenChange={setShowNovoConviteModal}>
                <DialogTrigger asChild>
                  <Button 
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg mb-6"
                    data-testid="button-novo-convite"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Convite
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Criar Novo Convite</DialogTitle>
                    <DialogDescription>
                      Preencha os dados do colaborador para gerar o convite
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="nome">Nome Completo *</Label>
                      <Input
                        id="nome"
                        placeholder="João Silva"
                        value={novoConvite.nome}
                        onChange={(e) => setNovoConvite(prev => ({ ...prev, nome: e.target.value }))}
                        data-testid="input-nome"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">E-mail *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="joao@empresa.com"
                        value={novoConvite.email}
                        onChange={(e) => setNovoConvite(prev => ({ ...prev, email: e.target.value }))}
                        data-testid="input-email"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cargo">Cargo</Label>
                      <Input
                        id="cargo"
                        placeholder="Analista"
                        value={novoConvite.cargo}
                        onChange={(e) => setNovoConvite(prev => ({ ...prev, cargo: e.target.value }))}
                        data-testid="input-cargo"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="departamento">Departamento</Label>
                      <Input
                        id="departamento"
                        placeholder="TI"
                        value={novoConvite.departamento}
                        onChange={(e) => setNovoConvite(prev => ({ ...prev, departamento: e.target.value }))}
                        data-testid="input-departamento"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dias_expiracao">Dias de Validade</Label>
                      <Input
                        id="dias_expiracao"
                        type="number"
                        min="1"
                        max="30"
                        value={novoConvite.dias_expiracao}
                        onChange={(e) => setNovoConvite(prev => ({ ...prev, dias_expiracao: parseInt(e.target.value) }))}
                        data-testid="input-dias-expiracao"
                      />
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                      <Button variant="outline" onClick={() => setShowNovoConviteModal(false)}>
                        Cancelar
                      </Button>
                      <Button 
                        onClick={handleCriarConvite}
                        disabled={enviandoConvite || !novoConvite.email || !novoConvite.nome}
                        data-testid="button-enviar-convite"
                      >
                        {enviandoConvite ? 'Enviando...' : 'Enviar Convite'}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <div className="grid grid-cols-4 gap-3">
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
              {showColaboradoresTable ? (
                <div className="space-y-4">
                  {/* Header com seleção e botão */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={erpColaboradores.every(col => col.selected)}
                        onCheckedChange={toggleTodosColaboradores}
                        data-testid="checkbox-select-all"
                      />
                      <span className="text-white text-sm">
                        {erpColaboradores.filter(col => col.selected).length} de {erpColaboradores.length} selecionados
                      </span>
                    </div>
                    <Button
                      onClick={() => {
                        setShowColaboradoresTable(false);
                        setErpColaboradores([]);
                      }}
                      variant="ghost"
                      className="text-white/60 hover:text-white"
                      size="sm"
                    >
                      Cancelar
                    </Button>
                  </div>

                  {/* Tabela de colaboradores */}
                  <div className="bg-white/5 border border-white/10 rounded-lg max-h-96 overflow-y-auto">
                    {erpColaboradores.map((col, index) => (
                      <div 
                        key={col.email}
                        className="flex items-center gap-3 p-3 border-b border-white/5 last:border-0 hover:bg-white/5"
                        data-testid={`colaborador-row-${index}`}
                      >
                        <Checkbox
                          checked={col.selected}
                          onCheckedChange={() => toggleColaboradorSelecao(col.email)}
                          data-testid={`checkbox-${col.email}`}
                        />
                        <div className="flex-1">
                          <p className="text-white font-medium">{col.nome}</p>
                          <p className="text-white/60 text-sm">{col.email}</p>
                          {(col.cargo || col.departamento) && (
                            <p className="text-white/40 text-xs mt-1">
                              {[col.cargo, col.departamento].filter(Boolean).join(' • ')}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Botão de ação */}
                  <Button
                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg"
                    onClick={gerarConvitesEmMassa}
                    disabled={generatingInvites || erpColaboradores.filter(col => col.selected).length === 0}
                    data-testid="button-gerar-convites-massa"
                  >
                    {generatingInvites ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Gerando Convites...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Gerar {erpColaboradores.filter(col => col.selected).length} Convites
                      </>
                    )}
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Informativo */}
                  <Alert className="bg-emerald-500/10 border-emerald-500/20">
                    <Database className="h-4 w-4 text-emerald-400" />
                    <AlertDescription className="text-white/70">
                      <strong className="text-white">Faça login no seu ERP</strong> e importe colaboradores automaticamente.
                    </AlertDescription>
                  </Alert>

                  {/* Features */}
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg border border-white/10">
                      <LinkIcon className="h-5 w-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-white">Login Direto</h4>
                        <p className="text-sm text-white/60">Use suas credenciais habituais do ERP</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg border border-white/10">
                      <Upload className="h-5 w-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-white">Importação em Lote</h4>
                        <p className="text-sm text-white/60">Busque e selecione múltiplos colaboradores</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg border border-white/10">
                      <CheckCircle className="h-5 w-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-white">Validação Automática</h4>
                        <p className="text-sm text-white/60">Verifica duplicatas e dados inválidos</p>
                      </div>
                    </div>
                  </div>

                  {/* CTA */}
                  <Dialog open={showErpLoginModal} onOpenChange={setShowErpLoginModal}>
                    <DialogTrigger asChild>
                      <Button 
                        className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg"
                        data-testid="button-conectar-erp"
                      >
                        <Database className="h-4 w-4 mr-2" />
                        Conectar ao ERP
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Login no ERP</DialogTitle>
                        <DialogDescription>
                          Entre com suas credenciais do sistema ERP
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Tipo de ERP</Label>
                          <Select value={erpLoginForm.erpType} onValueChange={(value) => setErpLoginForm(prev => ({ ...prev, erpType: value }))}>
                            <SelectTrigger data-testid="select-tipo-erp">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="TOTVS">TOTVS (Protheus/RM/Datasul)</SelectItem>
                              <SelectItem value="SAP">SAP (S/4HANA/Business One)</SelectItem>
                              <SelectItem value="ORACLE">Oracle Cloud ERP</SelectItem>
                              <SelectItem value="MICROSOFT">Microsoft Dynamics 365</SelectItem>
                              <SelectItem value="SENIOR">Senior</SelectItem>
                              <SelectItem value="LINX">Linx</SelectItem>
                              <SelectItem value="SANKHYA">Sankhya</SelectItem>
                              <SelectItem value="BENNER">Benner</SelectItem>
                              <SelectItem value="OUTRO">Outro</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Usuário</Label>
                          <Input
                            placeholder="Seu usuário do ERP"
                            value={erpLoginForm.username}
                            onChange={(e) => setErpLoginForm(prev => ({ ...prev, username: e.target.value }))}
                            data-testid="input-username"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Senha</Label>
                          <Input
                            type="password"
                            placeholder="Sua senha do ERP"
                            value={erpLoginForm.password}
                            onChange={(e) => setErpLoginForm(prev => ({ ...prev, password: e.target.value }))}
                            data-testid="input-password"
                          />
                        </div>
                        <div className="flex justify-end gap-2 pt-4">
                          <Button variant="outline" onClick={() => setShowErpLoginModal(false)}>
                            Cancelar
                          </Button>
                          <Button 
                            onClick={fazerLoginERP}
                            disabled={fetchingColaboradores || !erpLoginForm.username || !erpLoginForm.password}
                            data-testid="button-login-erp"
                          >
                            {fetchingColaboradores ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                                Conectando...
                              </>
                            ) : (
                              <>
                                <Database className="h-4 w-4 mr-2" />
                                Conectar e Buscar
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Lista de Convites Existentes */}
        <Card className="border-0 bg-white/10 backdrop-blur-xl shadow-2xl">
          <CardHeader>
            <CardTitle className="text-white">Convites Criados</CardTitle>
            <CardDescription className="text-white/60">
              Gerencie todos os convites enviados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-4">
                <Input
                  placeholder="Buscar por nome ou email..."
                  value={filtro}
                  onChange={(e) => setFiltro(e.target.value)}
                  className="flex-1 bg-white/5 border-white/10 text-white placeholder:text-white/40"
                  data-testid="input-filtro"
                />
                <Select value={statusFiltro} onValueChange={(value: any) => setStatusFiltro(value)}>
                  <SelectTrigger className="w-48 bg-white/5 border-white/10 text-white" data-testid="select-status-filtro">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos os Status</SelectItem>
                    <SelectItem value={StatusConvite.PENDENTE}>Pendentes</SelectItem>
                    <SelectItem value={StatusConvite.ACEITO}>Aceitos</SelectItem>
                    <SelectItem value={StatusConvite.EXPIRADO}>Expirados</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {convitesFiltrados.length === 0 ? (
                <div className="text-center py-12">
                  <Mail className="h-16 w-16 text-white/20 mx-auto mb-4" />
                  <p className="text-white/60">Nenhum convite encontrado</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {convitesFiltrados.map((convite) => {
                    const status = getStatusConvite(convite);
                    return (
                      <div
                        key={convite.id}
                        className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-colors"
                        data-testid={`convite-${convite.id}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-white">{convite.nome}</h3>
                              {getStatusBadge(status)}
                            </div>
                            <p className="text-sm text-white/60 mb-1">
                              <Mail className="inline h-3 w-3 mr-1" />
                              {convite.email}
                            </p>
                            <p className="text-xs text-white/40">
                              <Calendar className="inline h-3 w-3 mr-1" />
                              Expira em: {new Date(convite.validade).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleCopiarLink(convite.token)}
                              className="bg-white/5 border-white/20 hover:bg-white/10 text-white"
                              data-testid={`button-copiar-${convite.id}`}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                            {status === StatusConvite.PENDENTE && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDeletarConvite(convite.id)}
                                className="bg-red-500/10 border-red-500/20 hover:bg-red-500/20 text-red-400"
                                data-testid={`button-deletar-${convite.id}`}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmpresaGerarConvite;
