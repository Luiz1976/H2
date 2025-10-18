// src/services/authService.ts
import { supabase } from '../lib/supabase';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'empresa' | 'colaborador';
  redirectUrl: string;
  empresa_id?: string;
  permissoes?: any;
}

export interface AdminData {
  email: string;
  nome: string;
}

export interface EmpresaData {
  nome_empresa: string;
  email_contato: string;
  configuracoes?: any;
}

export interface ColaboradorData {
  nome: string;
  email: string;
  cargo?: string;
  departamento?: string;
  empresa_id: string;
  permissoes?: any;
}

export interface EmpresaCadastroData {
  email: string;
  nomeEmpresa: string;
  senha: string;
}

export interface ValidacaoSenha {
  valida: boolean;
  erros: string[];
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  message?: string;
  data?: any;
}

class AuthService {
  private currentUser: User | null = null;
  private initializationPromise: Promise<void>;

  constructor() {
    this.initializationPromise = this.initializeAuth();
  }

  // Método público para aguardar a inicialização
  async waitForInitialization(): Promise<void> {
    return this.initializationPromise;
  }

  private async initializeAuth() {
    console.log('🔄 [AuthService] === INICIANDO INICIALIZAÇÃO DA AUTENTICAÇÃO ===');
    console.log('🔄 [AuthService] URL atual:', window.location.href);
    console.log('🔄 [AuthService] Timestamp:', new Date().toISOString());
    
    try {
      // Primeiro, verificar o que já existe no localStorage
      const storedUserBefore = localStorage.getItem('currentUser');
      console.log('📦 [AuthService] localStorage ANTES da verificação:', storedUserBefore ? 'EXISTE' : 'VAZIO');
      
      // Se há usuário no localStorage, carregá-lo imediatamente
      if (storedUserBefore) {
        try {
          const parsedUser = JSON.parse(storedUserBefore);
          console.log('📦 [AuthService] Carregando usuário do localStorage:', parsedUser.email);
          this.currentUser = parsedUser;
        } catch (parseError) {
          console.error('❌ [AuthService] Erro ao parsear usuário do localStorage:', parseError);
          localStorage.removeItem('currentUser');
        }
      }
      
      // Verificar se há uma sessão ativa no Supabase (com timeout)
      console.log('📡 [AuthService] Verificando sessão do Supabase...');
      
      const sessionPromise = supabase.auth.getSession();
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout na verificação da sessão')), 5000)
      );
      
      let session, error;
      try {
        const result = await Promise.race([sessionPromise, timeoutPromise]);
        ({ data: { session }, error } = result as any);
      } catch (timeoutError) {
        console.warn('⚠️ [AuthService] Timeout na verificação do Supabase, usando localStorage');
        console.log('🏁 [AuthService] Inicialização concluída com fallback. Estado final:', {
          hasCurrentUser: !!this.currentUser,
          userEmail: this.currentUser?.email,
          userRole: this.currentUser?.role
        });
        return;
      }
      
      console.log('📡 [AuthService] Resultado da sessão:', {
        hasSession: !!session,
        hasUser: !!session?.user,
        userEmail: session?.user?.email,
        error: error?.message
      });
      
      if (error) {
        console.error('❌ [AuthService] Erro ao obter sessão do Supabase:', error);
        // Mesmo com erro do Supabase, manter usuário do localStorage se existir
        console.log('🔄 [AuthService] Mantendo usuário do localStorage devido ao erro do Supabase');
      }

      if (session?.user && !error) {
        console.log('👤 [AuthService] Processando usuário da sessão Supabase:', session.user.email);
        console.log('👤 [AuthService] Metadata do usuário:', session.user.user_metadata);
        
        // Obter dados do usuário baseado no JWT
        const userData = await this.getUserData(session.user.id, session.user.user_metadata?.role || 'colaborador');
        
        if (userData) {
          console.log('✅ [AuthService] Dados do usuário obtidos do Supabase:', {
            email: userData.email,
            role: userData.role,
            id: userData.id
          });
          this.currentUser = userData;
          localStorage.setItem('currentUser', JSON.stringify(userData));
          console.log('💾 [AuthService] Usuário salvo no localStorage');
        } else {
          console.log('❌ [AuthService] Falha ao obter dados do usuário do Supabase');
        }
      } else {
        console.log('🔍 [AuthService] Nenhuma sessão Supabase válida, verificando localStorage...');
        
        // Fallback para compatibilidade com sistema legado
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            console.log('📦 [AuthService] Usuário encontrado no localStorage:', {
              email: parsedUser.email,
              role: parsedUser.role,
              id: parsedUser.id
            });
            this.currentUser = parsedUser;
            console.log('✅ [AuthService] Usuário carregado do localStorage');
          } catch (parseError) {
            console.error('❌ [AuthService] Erro ao parsear usuário do localStorage:', parseError);
            localStorage.removeItem('currentUser');
          }
        } else {
          console.log('❌ [AuthService] Nenhum usuário encontrado no localStorage');
        }
      }
      
      console.log('🏁 [AuthService] Inicialização concluída. Estado final:', {
        hasCurrentUser: !!this.currentUser,
        userEmail: this.currentUser?.email,
        userRole: this.currentUser?.role
      });
      
    } catch (error) {
      console.error('❌ [AuthService] Erro crítico na inicialização:', error);
      console.error('❌ [AuthService] Stack trace:', error.stack);
    }
  }

  /**
   * Recupera dados do usuário baseado no ID e role
   */
  private async getUserData(userId: string, role: string): Promise<User | null> {
    try {
      let userData: any = null;
      let redirectUrl = '/';

      switch (role) {
        case 'admin':
          const { data: adminData } = await supabase
            .from('admins')
            .select('*')
            .eq('id', userId)
            .single();
          
          if (adminData) {
            userData = {
              id: adminData.id,
              email: adminData.email,
              name: adminData.nome,
              role: 'admin',
              redirectUrl: '/admin'
            };
          }
          break;

        case 'empresa':
          const { data: empresaData } = await supabase
            .from('empresas')
            .select('*')
            .eq('id', userId)
            .single();
          
          if (empresaData) {
            userData = {
              id: empresaData.id,
              email: empresaData.email_contato,
              name: empresaData.nome_empresa,
              role: 'empresa',
              redirectUrl: '/empresa',
              empresa_id: empresaData.id
            };
          }
          break;

        case 'colaborador':
          const { data: colaboradorData } = await supabase
            .from('colaboradores')
            .select('*, empresas(nome_empresa)')
            .eq('id', userId)
            .single();
          
          if (colaboradorData) {
            userData = {
              id: colaboradorData.id,
              email: colaboradorData.email,
              name: colaboradorData.nome,
              role: 'colaborador',
              redirectUrl: '/colaborador',
              empresa_id: colaboradorData.empresa_id,
              permissoes: colaboradorData.permissoes
            };
          }
          break;
          
        default:
          // Se o role não for reconhecido, tentar detectar baseado no user_metadata
          console.log('🔍 [DEBUG] Role não reconhecido, tentando detectar pelo user_metadata...');
          
          // Verificar se é empresa baseado no tipo no metadata
          const { data: { user } } = await supabase.auth.getUser();
          if (user?.user_metadata?.tipo === 'empresa') {
            console.log('🔍 [DEBUG] Detectado como empresa pelo metadata');
            const { data: empresaData } = await supabase
              .from('empresas')
              .select('*')
              .eq('id', userId)
              .single();
            
            if (empresaData) {
              userData = {
                id: empresaData.id,
                email: empresaData.email_contato,
                name: empresaData.nome_empresa,
                role: 'empresa',
                redirectUrl: '/empresa',
                empresa_id: empresaData.id
              };
            }
          }
          break;
      }

      return userData;
    } catch (error) {
      console.error('Erro ao recuperar dados do usuário:', error);
      return null;
    }
  }

  /**
   * Valida se a senha atende aos critérios de segurança
   */
  validarSenha(senha: string): ValidacaoSenha {
    const erros: string[] = [];

    if (senha.length < 8) {
      erros.push('A senha deve ter pelo menos 8 caracteres');
    }

    if (!/[A-Z]/.test(senha)) {
      erros.push('A senha deve conter pelo menos uma letra maiúscula');
    }

    if (!/[a-z]/.test(senha)) {
      erros.push('A senha deve conter pelo menos uma letra minúscula');
    }

    if (!/\d/.test(senha)) {
      erros.push('A senha deve conter pelo menos um número');
    }

    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(senha)) {
      erros.push('A senha deve conter pelo menos um símbolo especial');
    }

    return {
      valida: erros.length === 0,
      erros
    };
  }

  /**
   * Cria um novo administrador no sistema
   */
  async criarAdmin(dados: AdminData): Promise<AuthResponse> {
    try {
      // Verificar se email já existe
      const { data: existingAdmin } = await supabase
        .from('admins')
        .select('email')
        .eq('email', dados.email)
        .single();

      if (existingAdmin) {
        return { success: false, message: 'Este email já está cadastrado como administrador' };
      }

      // Inserir novo admin
      const { data: newAdmin, error } = await supabase
        .from('admins')
        .insert([{
          email: dados.email,
          nome: dados.nome
        }])
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar admin:', error);
        return { success: false, message: 'Erro ao criar administrador' };
      }

      const userData: User = {
        id: newAdmin.id,
        email: newAdmin.email,
        name: newAdmin.nome,
        role: 'admin',
        redirectUrl: '/admin'
      };

      return { 
        success: true, 
        user: userData, 
        message: 'Administrador criado com sucesso!' 
      };

    } catch (error) {
      console.error('Erro ao criar admin:', error);
      return { 
        success: false, 
        message: 'Erro interno do servidor. Tente novamente.' 
      };
    }
  }

  /**
   * Cria uma nova empresa no sistema
   */
  async criarEmpresa(dados: EmpresaData, adminId: string): Promise<AuthResponse> {
    try {
      // Verificar se email já existe
      const { data: existingEmpresa } = await supabase
        .from('empresas')
        .select('email_contato')
        .eq('email_contato', dados.email_contato)
        .single();

      if (existingEmpresa) {
        return { success: false, message: 'Este email já está cadastrado como empresa' };
      }

      // Inserir nova empresa
      const { data: newEmpresa, error } = await supabase
        .from('empresas')
        .insert([{
          nome_empresa: dados.nome_empresa,
          email_contato: dados.email_contato,
          admin_id: adminId,
          configuracoes: dados.configuracoes || {}
        }])
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar empresa:', error);
        return { success: false, message: 'Erro ao criar empresa' };
      }

      const userData: User = {
        id: newEmpresa.id,
        email: newEmpresa.email_contato,
        name: newEmpresa.nome_empresa,
        role: 'empresa',
        redirectUrl: '/empresa',
        empresa_id: newEmpresa.id
      };

      return { 
        success: true, 
        user: userData, 
        message: 'Empresa criada com sucesso!' 
      };

    } catch (error) {
      console.error('Erro ao criar empresa:', error);
      return { 
        success: false, 
        message: 'Erro interno do servidor. Tente novamente.' 
      };
    }
  }

  /**
   * Cria um novo colaborador no sistema
   */
  async criarColaborador(dados: ColaboradorData): Promise<AuthResponse> {
    try {
      // Verificar se email já existe
      const { data: existingColaborador } = await supabase
        .from('colaboradores')
        .select('email')
        .eq('email', dados.email)
        .single();

      if (existingColaborador) {
        return { success: false, message: 'Este email já está cadastrado como colaborador' };
      }

      // Inserir novo colaborador
      const { data: newColaborador, error } = await supabase
        .from('colaboradores')
        .insert([{
          nome: dados.nome,
          email: dados.email,
          cargo: dados.cargo,
          departamento: dados.departamento,
          empresa_id: dados.empresa_id,
          permissoes: dados.permissoes || {}
        }])
        .select('*, empresas(nome_empresa)')
        .single();

      if (error) {
        console.error('Erro ao criar colaborador:', error);
        return { success: false, message: 'Erro ao criar colaborador' };
      }

      const userData: User = {
        id: newColaborador.id,
        email: newColaborador.email,
        name: newColaborador.nome,
        role: 'colaborador',
        redirectUrl: '/colaborador',
        empresa_id: newColaborador.empresa_id,
        permissoes: newColaborador.permissoes
      };

      return { 
        success: true, 
        user: userData, 
        message: 'Colaborador criado com sucesso!' 
      };

    } catch (error) {
      console.error('Erro ao criar colaborador:', error);
      return { 
        success: false, 
        message: 'Erro interno do servidor. Tente novamente.' 
      };
    }
  }

  /**
   * Cadastra uma nova empresa no sistema (método legado - mantido para compatibilidade)
   */
  async cadastrarEmpresa(dados: EmpresaCadastroData): Promise<{ success: boolean; user?: User; message?: string }> {
    try {
      // Validar senha
      const validacaoSenha = this.validarSenha(dados.senha);
      if (!validacaoSenha.valida) {
        return { 
          success: false, 
          message: `Senha não atende aos critérios de segurança:\n${validacaoSenha.erros.join('\n')}` 
        };
      }

      // Criar empresa usando o novo método
      const empresaData: EmpresaData = {
        nome_empresa: dados.nomeEmpresa,
        email_contato: dados.email
      };

      // Buscar admin_id do convite
      const { data: conviteData } = await supabase
        .from('convites_empresa')
        .select('admin_id')
        .eq('email_contato', dados.email)
        .eq('status', 'pendente')
        .single();

      if (!conviteData) {
        return { 
          success: false, 
          message: 'Convite não encontrado ou já utilizado' 
        };
      }

      const result = await this.criarEmpresa(empresaData, conviteData.admin_id);

      if (result.success && result.user) {
        // Marcar convite como usado
        await supabase
          .from('convites_empresa')
          .update({ status: 'usado' })
          .eq('email_contato', dados.email)
          .eq('status', 'pendente');

        // Salvar senha no localStorage para compatibilidade
        const senhasSalvas = localStorage.getItem('empresas_senhas');
        const senhas = senhasSalvas ? JSON.parse(senhasSalvas) : {};
        senhas[dados.email] = dados.senha;
        localStorage.setItem('empresas_senhas', JSON.stringify(senhas));
      }

      return result;

    } catch (error) {
      return { 
        success: false, 
        message: 'Erro interno do servidor. Tente novamente.' 
      };
    }
  }

  /**
   * Login hierárquico com Supabase Auth
   */
  async login(email: string, password: string): Promise<{ success: boolean; user?: User; message?: string }> {
    try {
      console.log('🔐 [DEBUG] Iniciando login para:', email);
      
      // Primeiro, tentar login com Supabase Auth
      console.log('🔐 [DEBUG] Tentando login com Supabase Auth...');
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      console.log('🔐 [DEBUG] Resultado Supabase Auth:', { data: !!data, error: error?.message });

      if (error) {
        console.log('🔐 [DEBUG] Supabase Auth falhou, tentando método legado...');
        // Se falhar no Supabase, tentar método legado para compatibilidade
        return await this.loginLegacy(email, password);
      }

      if (data.user) {
        console.log('🔐 [DEBUG] Usuário encontrado no Supabase Auth:', data.user.id);
        // Tenta obter o role, se não existir, define como 'unknown' para forçar a detecção
        const userRole = data.user.user_metadata?.role || 'unknown';
        console.log('🔐 [DEBUG] Role do usuário (inicial):', userRole);
        
        const userData = await this.getUserData(data.user.id, userRole);

        if (userData) {
          console.log('🔐 [DEBUG] Dados do usuário recuperados:', userData.role);
          this.currentUser = userData;
          localStorage.setItem('currentUser', JSON.stringify(userData));
          return { success: true, user: userData };
        } else {
          console.log('🔐 [DEBUG] Falha ao recuperar dados do usuário');
        }
      }

      console.log('🔐 [DEBUG] Login falhou - nenhum usuário encontrado');
      return { success: false, message: 'Erro ao recuperar dados do usuário' };

    } catch (error) {
      console.error('🔐 [ERROR] Erro no login:', error);
      return { success: false, message: 'Erro interno do servidor' };
    }
  }

  /**
   * Login legado para compatibilidade com sistema anterior
   */
  private async loginLegacy(email: string, password: string): Promise<{ success: boolean; user?: User; message?: string }> {
    try {
      console.log('🔐 [DEBUG] Iniciando loginLegacy para:', email);
      // Buscar usuário nas tabelas do banco
      let userData: User | null = null;

      // Verificar se é admin
      console.log('🔐 [DEBUG] Verificando se é admin...');
      const { data: adminData, error: adminError } = await supabase
        .from('admins')
        .select('*')
        .eq('email', email)
        .single();

      console.log('🔐 [DEBUG] Resultado busca admin:', { adminData: !!adminData, error: adminError?.message });

      if (adminData && password === 'admin123') { // Senha fixa para admins em desenvolvimento
        console.log('🔐 [DEBUG] Admin encontrado e senha correta!');
        userData = {
          id: adminData.id,
          email: adminData.email,
          name: adminData.nome,
          role: 'admin',
          redirectUrl: '/admin'
        };
      } else if (adminData) {
        console.log('🔐 [DEBUG] Admin encontrado mas senha incorreta. Senha fornecida:', password);
      }

      // Verificar se é empresa
      if (!userData) {
        const { data: empresaData } = await supabase
          .from('empresas')
          .select('*')
          .eq('email_contato', email)
          .single();

        if (empresaData) {
          // Verificar senha no localStorage para compatibilidade
          const senhasSalvas = localStorage.getItem('empresas_senhas');
          if (senhasSalvas) {
            const senhas = JSON.parse(senhasSalvas);
            const senhaEmpresa = senhas[email];
            
            if (senhaEmpresa && senhaEmpresa === password) {
              userData = {
                id: empresaData.id,
                email: empresaData.email_contato,
                name: empresaData.nome_empresa,
                role: 'empresa',
                redirectUrl: '/empresa',
                empresa_id: empresaData.id
              };
            }
          }
        }
      }

      // Verificar se é colaborador
      if (!userData) {
        const { data: colaboradorData } = await supabase
          .from('colaboradores')
          .select('*, empresas(nome_empresa)')
          .eq('email', email)
          .single();

        if (colaboradorData) {
          // Para colaboradores, usar senha padrão ou sistema de convites
          userData = {
            id: colaboradorData.id,
            email: colaboradorData.email,
            name: colaboradorData.nome,
            role: 'colaborador',
            redirectUrl: '/colaborador',
            empresa_id: colaboradorData.empresa_id,
            permissoes: colaboradorData.permissoes
          };
        }
      }

      if (userData) {
        console.log('🔐 [DEBUG] Login legado bem-sucedido para:', userData.role);
        this.currentUser = userData;
        localStorage.setItem('currentUser', JSON.stringify(userData));
        return { success: true, user: userData };
      }

      console.log('🔐 [DEBUG] Login legado falhou - nenhum usuário encontrado');
      return { success: false, message: 'E-mail ou senha inválidos' };

    } catch (error) {
      console.error('🔐 [ERROR] Erro no login legado:', error);
      return { success: false, message: 'Erro interno do servidor' };
    }
  }

  /**
   * Logout do sistema
   */
  async logout(): Promise<void> {
    try {
      // Logout do Supabase Auth
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Erro ao fazer logout do Supabase:', error);
    }
    
    // Limpar dados locais
    this.currentUser = null;
    localStorage.removeItem('currentUser');
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  /**
   * Verifica se o usuário tem uma role específica
   */
  hasRole(role: 'admin' | 'empresa' | 'colaborador'): boolean {
    return this.currentUser?.role === role;
  }

  /**
   * Verifica se o usuário pertence a uma empresa específica
   */
  belongsToEmpresa(empresaId: string): boolean {
    return this.currentUser?.empresa_id === empresaId || this.currentUser?.role === 'admin';
  }

  /**
   * Obtém lista de empresas (apenas para admins)
   */
  async getEmpresas(): Promise<AuthResponse> {
    try {
      if (!this.hasRole('admin')) {
        return { success: false, message: 'Acesso negado' };
      }

      const { data: empresas, error } = await supabase
        .from('empresas')
        .select('*')
        .order('nome_empresa');

      if (error) {
        console.error('Erro ao buscar empresas:', error);
        return { success: false, message: 'Erro ao buscar empresas' };
      }

      return { success: true, data: empresas };

    } catch (error) {
      console.error('Erro ao buscar empresas:', error);
      return { success: false, message: 'Erro interno do servidor' };
    }
  }

  /**
   * Obtém lista de colaboradores de uma empresa
   */
  async getColaboradores(empresaId?: string): Promise<AuthResponse> {
    try {
      const targetEmpresaId = empresaId || this.currentUser?.empresa_id;

      if (!targetEmpresaId) {
        return { success: false, message: 'ID da empresa não encontrado' };
      }

      if (!this.belongsToEmpresa(targetEmpresaId)) {
        return { success: false, message: 'Acesso negado' };
      }

      const { data: colaboradores, error } = await supabase
        .from('colaboradores')
        .select('*, empresas(nome_empresa)')
        .eq('empresa_id', targetEmpresaId)
        .eq('ativo', true)
        .order('nome');

      if (error) {
        console.error('Erro ao buscar colaboradores:', error);
        return { success: false, message: 'Erro ao buscar colaboradores' };
      }

      return { success: true, data: colaboradores };

    } catch (error) {
      console.error('Erro ao buscar colaboradores:', error);
      return { success: false, message: 'Erro interno do servidor' };
    }
  }

  /**
   * Atualiza dados do usuário atual
   */
  async updateCurrentUser(dados: Partial<User>): Promise<AuthResponse> {
    try {
      if (!this.currentUser) {
        return { success: false, message: 'Usuário não autenticado' };
      }

      let updateData: any = {};
      let tableName = '';

      switch (this.currentUser.role) {
        case 'admin':
          tableName = 'admins';
          if (dados.name) updateData.nome = dados.name;
          if (dados.email) updateData.email = dados.email;
          break;

        case 'empresa':
          tableName = 'empresas';
          if (dados.name) updateData.nome_empresa = dados.name;
          if (dados.email) updateData.email_contato = dados.email;
          break;

        case 'colaborador':
          tableName = 'colaboradores';
          if (dados.name) updateData.nome = dados.name;
          if (dados.email) updateData.email = dados.email;
          break;
      }

      const { data, error } = await supabase
        .from(tableName)
        .update(updateData)
        .eq('id', this.currentUser.id)
        .select()
        .single();

      if (error) {
        console.error('Erro ao atualizar usuário:', error);
        return { success: false, message: 'Erro ao atualizar dados' };
      }

      // Atualizar dados locais
      const updatedUser = { ...this.currentUser, ...dados };
      this.currentUser = updatedUser;
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));

      return { success: true, user: updatedUser };

    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      return { success: false, message: 'Erro interno do servidor' };
    }
  }

  // ========================================
  // MÉTODOS LEGADOS - MANTIDOS PARA COMPATIBILIDADE
  // ========================================

  /**
   * Sincroniza dados entre localStorage e memória (método legado)
   * Mantido para compatibilidade com código existente
   */
  private sincronizarDados(): void {
    // Este método agora é um stub - a sincronização é feita via Supabase
    console.warn('sincronizarDados() é um método legado. Use os métodos Supabase.');
  }

  /**
   * Verifica integridade dos dados para debug (método legado)
   */
  verificarIntegridade(): { empresasMemoria: User[], empresasStorage: User[], senhasStorage: any } {
    console.warn('verificarIntegridade() é um método legado.');
    return { 
      empresasMemoria: [], 
      empresasStorage: [], 
      senhasStorage: {} 
    };
  }

  /**
   * Carrega empresas cadastradas do localStorage (método legado)
   */
  private carregarEmpresasCadastradas(): void {
    this.sincronizarDados();
  }

  /**
   * Obtém dados de um colaborador específico por ID
   */
  async getColaboradorById(colaboradorId: string): Promise<AuthResponse> {
    try {
      if (!this.currentUser) {
        return { success: false, message: 'Usuário não autenticado' };
      }
  
      // Verificar se é admin ou empresa
      if (!this.hasRole('admin') && !this.hasRole('empresa')) {
        return { success: false, message: 'Acesso negado' };
      }
  
      let query = supabase
        .from('colaboradores')
        .select('*, empresas(nome_empresa)')
        .eq('id', colaboradorId)
        .single();
  
      // Se for empresa, verificar se o colaborador pertence à empresa
      if (this.hasRole('empresa')) {
        query = query.eq('empresa_id', this.currentUser.empresa_id);
      }
  
      const { data: colaborador, error } = await query;
  
      if (error) {
        console.error('Erro ao buscar colaborador:', error);
        return { success: false, message: 'Colaborador não encontrado' };
      }
  
      return { success: true, data: colaborador };
  
    } catch (error) {
      console.error('Erro ao buscar colaborador:', error);
      return { success: false, message: 'Erro interno do servidor' };
    }
  }
  
  /**
   * Obtém resultados de testes de um colaborador específico
   */
  async getResultadosColaborador(colaboradorId: string): Promise<AuthResponse> {
    try {
      console.log('🔍 [getResultadosColaborador] Iniciando busca para colaborador:', colaboradorId);
      console.log('🔍 [getResultadosColaborador] Usuário atual:', this.currentUser);
      
      if (!this.currentUser) {
        console.log('❌ [getResultadosColaborador] Usuário não autenticado');
        return { success: false, message: 'Usuário não autenticado' };
      }
  
      // Verificar se é admin ou empresa
      if (!this.hasRole('admin') && !this.hasRole('empresa')) {
        console.log('❌ [getResultadosColaborador] Acesso negado - role:', this.currentUser.role);
        return { success: false, message: 'Acesso negado' };
      }

      // Buscar email do colaborador pelo ID informado
      const { data: colaboradorInfo, error: colaboradorInfoError } = await supabase
        .from('colaboradores')
        .select('email, empresa_id')
        .eq('id', colaboradorId)
        .single();

      if (colaboradorInfoError || !colaboradorInfo) {
        console.log('❌ [getResultadosColaborador] Colaborador não encontrado ou erro:', colaboradorInfoError);
        return { success: false, message: 'Colaborador não encontrado' };
      }

      // Se for empresa, garantir que o colaborador pertence à empresa do usuário
      if (this.hasRole('empresa') && this.currentUser?.empresa_id && colaboradorInfo.empresa_id !== this.currentUser.empresa_id) {
        console.log('❌ [getResultadosColaborador] Acesso negado - colaborador não pertence à sua empresa');
        return { success: false, message: 'Acesso negado ao colaborador' };
      }

      const colaboradorEmail = colaboradorInfo.email;

      console.log('📧 [getResultadosColaborador] Email do colaborador:', colaboradorEmail);

    // Buscar resultados em todas as tabelas relevantes
    console.log('📊 [getResultadosColaborador] Buscando resultados em todas as tabelas...');
    
    const todosResultados = [];
    
    // 1. Buscar na tabela principal 'resultados'
    console.log('🔍 [getResultadosColaborador] Buscando na tabela resultados...');
    let queryResultados = supabase
      .from('resultados')
      .select(`
        id,
        teste_id,
        usuario_id,
        session_id,
        pontuacao_total,
        tempo_gasto,
        status,
        data_realizacao,
        metadados,
        testes (
          nome,
          categoria,
          descricao
        )
      `)
      // Buscar por múltiplos possíveis identificadores do usuário:
      // - usuario_id pode ser o ID do colaborador ou (histórico) o email
      // - metadados pode conter user_email ou usuario_email
      .or(`usuario_id.eq.${colaboradorId},usuario_id.eq.${colaboradorEmail},metadados->>user_email.eq.${colaboradorEmail},metadados->>usuario_email.eq.${colaboradorEmail}`)
      .order('data_realizacao', { ascending: false });

    console.log('🔍 [DEBUG] Tentando consulta com email:', colaboradorEmail);
    const __queryResStr = (queryResultados as any)?.toString?.() || (queryResultados as any)?.url?.toString?.() || (queryResultados as any)?.url || '[sem toString/url]';
    console.log('🔍 [DEBUG] Query construída:', __queryResStr);

    const { data: resultados, error: errorResultados } = await queryResultados;

    if (resultados && !errorResultados) {
      console.log(`✅ [getResultadosColaborador] Encontrados ${resultados.length} resultados na tabela principal`);
      todosResultados.push(...resultados.map(r => ({ ...r, tipoTabela: 'resultados' })));
    }

    // 2. Buscar na tabela 'resultados_qvt'
    console.log('🔍 [getResultadosColaborador] Buscando na tabela resultados_qvt...');
    let queryQvt = supabase
      .from('resultados_qvt')
      .select(`
        id,
        session_id,
        indice_geral,
        created_at,
        user_email
      `)
      .eq('user_email', colaboradorEmail)
      .order('created_at', { ascending: false });

    console.log('🔍 [DEBUG] Tentando consulta com email (QVT):', colaboradorEmail);
    const __queryQvtStr = (queryQvt as any)?.toString?.() || (queryQvt as any)?.url?.toString?.() || (queryQvt as any)?.url || '[sem toString/url]';
    console.log('🔍 [DEBUG] Query construída (QVT):', __queryQvtStr);

    const { data: resultadosQvt, error: errorQvt } = await queryQvt;

    if (resultadosQvt && !errorQvt) {
      console.log(`✅ [getResultadosColaborador] Encontrados ${resultadosQvt.length} resultados QVT`);
      // Converter formato QVT para formato padrão (unificando identificadores)
      const resultadosQvtFormatados = resultadosQvt.map(r => ({
        id: r.id,
        teste_id: 'qualidade-vida-trabalho',
        usuario_id: null,
        session_id: r.session_id,
        pontuacao_total: Math.round((Number(r.indice_geral || 0)) * 20), // índice (1-5) -> percentual (0-100)
        tempo_gasto: null,
        status: 'concluido',
        data_realizacao: r.created_at,
        metadados: {
          tipo_teste: 'qualidade-vida-trabalho'
        },
        testes: {
          nome: 'Qualidade de Vida no Trabalho',
          categoria: 'Bem-estar',
          descricao: 'Avaliação da qualidade de vida no trabalho'
        },
        tipoTabela: 'resultados_qvt'
      }));
      todosResultados.push(...resultadosQvtFormatados);
    }

    // 3. Buscar na tabela 'resultados_rpo' (se existir)
    console.log('🔍 [getResultadosColaborador] Buscando na tabela resultados_rpo...');
    try {
      const { data: resultadosRpo, error: errorRpo } = await supabase
        .from('resultados_rpo')
        .select(`
          id,
          resultado_id,
          indice_geral,
          nivel_risco,
          pontuacoes_dimensoes,
          analise_detalhada,
          recomendacoes,
          created_at
        `)
        // Buscar resultados RPO vinculados aos resultados principais do colaborador
        .in('resultado_id', (resultados || []).map(r => r.id))
        .order('created_at', { ascending: false });

      if (resultadosRpo && !errorRpo) {
        console.log(`✅ [getResultadosColaborador] Encontrados ${resultadosRpo.length} resultados RPO`);
        const resultadosRpoFormatados = resultadosRpo.map(r => ({
          id: r.id,
          teste_id: 'riscos-psicossociais-ocupacionais',
          usuario_id: null,
          // Vincular a session_id do resultado principal se disponível
          session_id: (resultados || []).find(res => res.id === r.resultado_id)?.session_id || null,
          pontuacao_total: Math.round(Number(r.indice_geral || 0)),
          tempo_gasto: null,
          status: 'concluido',
          data_realizacao: r.created_at,
          metadados: {
            tipo_teste: 'riscos-psicossociais-ocupacionais',
            nivel_risco: r.nivel_risco,
            pontuacoes_dimensoes: r.pontuacoes_dimensoes,
            analise_detalhada: r.analise_detalhada,
            recomendacoes: r.recomendacoes,
          },
          testes: {
            nome: 'HumaniQ RPO - Riscos Psicossociais Ocupacionais',
            categoria: 'Riscos Psicossociais',
            descricao: 'Avaliação de riscos psicossociais no trabalho'
          },
          tipoTabela: 'resultados_rpo',
          resultadoPrincipalId: r.resultado_id
        }));
        todosResultados.push(...resultadosRpoFormatados);
      }
    } catch (rpoError) {
      console.log('⚠️ [getResultadosColaborador] Tabela resultados_rpo não encontrada ou erro:', rpoError);
    }

    // Log de resultados encontrados ou ausência de resultados
    if (todosResultados.length === 0) {
      console.log('⚠️ [getResultadosColaborador] Nenhum resultado encontrado para o colaborador');
    } else {
      console.log('📋 [getResultadosColaborador] Primeiros resultados encontrados:', todosResultados.slice(0, 3));
    }

      // Deduplicar resultados: preferir registros especializados (RPO/QVT) e mais recentes
      const prioridadeTabela = (tipo: string | undefined) => {
        if (tipo === 'resultados_rpo') return 3;
        if (tipo === 'resultados_qvt') return 2;
        return 1; // resultados (genéricos)
      };

      const normalizarNomeTeste = (r: any) => {
        const nome = (r?.testes?.nome || r?.metadados?.teste_nome || r?.teste_id || '').toLowerCase();
        if (nome.includes('qualidade de vida') || r?.teste_id === 'qualidade-vida-trabalho' || r?.metadados?.tipo_teste === 'qualidade-vida-trabalho') {
          return 'qualidade-vida-trabalho';
        }
        if (nome.includes('rpo') || nome.includes('riscos psicossociais')) {
          return 'riscos-psicossociais-ocupacionais';
        }
        return nome || (r?.teste_id || 'desconhecido');
      };

      const mapaDedup = new Map<string, any>();
      for (const r of todosResultados) {
        let chave: string;
        if (r.tipoTabela === 'resultados_rpo' && r.resultadoPrincipalId) {
          chave = `rpo|${r.resultadoPrincipalId}`;
        } else {
          const testeChave = normalizarNomeTeste(r);
          const sess = r.session_id || 'no-session';
          chave = `${testeChave}|${sess}`;
        }

        const existente = mapaDedup.get(chave);
        if (!existente) {
          mapaDedup.set(chave, r);
        } else {
          const pExist = prioridadeTabela(existente.tipoTabela);
          const pNovo = prioridadeTabela(r.tipoTabela);
          const dExist = new Date(existente.data_realizacao || existente.created_at).getTime();
          const dNovo = new Date(r.data_realizacao || r.created_at).getTime();
          if (pNovo > pExist || (pNovo === pExist && dNovo > dExist)) {
            mapaDedup.set(chave, r);
          }
        }
      }

      const todosResultadosFinal = Array.from(mapaDedup.values());

      // Ordenar todos os resultados por data
      todosResultadosFinal.sort((a, b) => {
        const dataA = new Date(a.data_realizacao || a.created_at);
        const dataB = new Date(b.data_realizacao || b.created_at);
        return dataB.getTime() - dataA.getTime();
      });
  
      // Formatar dados para o frontend
      const resultadosFormatados = todosResultadosFinal.map(resultado => {
        const formatado = {
          id: resultado.id,
          testeId: resultado.teste_id,
          nomeTest: resultado.testes?.nome || resultado.metadados?.teste_nome || 'Teste não identificado',
          categoria: resultado.testes?.categoria || resultado.metadados?.tipo_teste || 'Geral',
          pontuacao: resultado.pontuacao_total || 0,
          pontuacaoMaxima: 100,
          percentual: Math.round((resultado.pontuacao_total / 100) * 100) || 0,
          status: resultado.status || 'concluido',
          dataRealizacao: resultado.data_realizacao || resultado.created_at,
          tempoDuracao: resultado.tempo_gasto || 0,
          observacoes: resultado.metadados?.observacoes || '',
          tipoTabela: resultado.tipoTabela || 'resultados'
        };
        
        console.log('🔄 [getResultadosColaborador] Resultado formatado:', formatado);
        return formatado;
      });
  
      console.log('✅ [getResultadosColaborador] Retornando', resultadosFormatados.length, 'resultados formatados (deduplicados)');
      return { success: true, data: resultadosFormatados };
  
    } catch (error) {
      console.error('💥 [getResultadosColaborador] Erro interno:', error);
      return { success: false, message: 'Erro interno do servidor' };
    }
  }
  
  /**
   * Calcula o nível do resultado baseado no percentual
   */
  private calcularNivelResultado(percentual: number): 'baixo' | 'medio' | 'alto' | 'critico' {
    if (percentual >= 80) return 'alto';
    if (percentual >= 60) return 'medio';
    if (percentual >= 40) return 'baixo';
    return 'critico';
  }

  /**
   * Cadastra uma nova empresa no sistema (método legado - mantido para compatibilidade)
   */
  async cadastrarEmpresa(dados: EmpresaCadastroData): Promise<{ success: boolean; user?: User; message?: string }> {
    try {
      // Validar senha
      const validacaoSenha = this.validarSenha(dados.senha);
      if (!validacaoSenha.valida) {
        return { 
          success: false, 
          message: `Senha não atende aos critérios de segurança:\n${validacaoSenha.erros.join('\n')}` 
        };
      }

      // Criar empresa usando o novo método
      const empresaData: EmpresaData = {
        nome_empresa: dados.nomeEmpresa,
        email_contato: dados.email
      };

      // Buscar admin_id do convite
      const { data: conviteData } = await supabase
        .from('convites_empresa')
        .select('admin_id')
        .eq('email_contato', dados.email)
        .eq('status', 'pendente')
        .single();

      if (!conviteData) {
        return { 
          success: false, 
          message: 'Convite não encontrado ou já utilizado' 
        };
      }

      const result = await this.criarEmpresa(empresaData, conviteData.admin_id);

      if (result.success && result.user) {
        // Marcar convite como usado
        await supabase
          .from('convites_empresa')
          .update({ status: 'usado' })
          .eq('email_contato', dados.email)
          .eq('status', 'pendente');

        // Salvar senha no localStorage para compatibilidade
        const senhasSalvas = localStorage.getItem('empresas_senhas');
        const senhas = senhasSalvas ? JSON.parse(senhasSalvas) : {};
        senhas[dados.email] = dados.senha;
        localStorage.setItem('empresas_senhas', JSON.stringify(senhas));
      }

      return result;

    } catch (error) {
      return { 
        success: false, 
        message: 'Erro interno do servidor. Tente novamente.' 
      };
    }
  }

  /**
   * Login hierárquico com Supabase Auth
   */
  async login(email: string, password: string): Promise<{ success: boolean; user?: User; message?: string }> {
    try {
      console.log('🔐 [DEBUG] Iniciando login para:', email);
      
      // Primeiro, tentar login com Supabase Auth
      console.log('🔐 [DEBUG] Tentando login com Supabase Auth...');
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      console.log('🔐 [DEBUG] Resultado Supabase Auth:', { data: !!data, error: error?.message });

      if (error) {
        console.log('🔐 [DEBUG] Supabase Auth falhou, tentando método legado...');
        // Se falhar no Supabase, tentar método legado para compatibilidade
        return await this.loginLegacy(email, password);
      }

      if (data.user) {
        console.log('🔐 [DEBUG] Usuário encontrado no Supabase Auth:', data.user.id);
        // Tenta obter o role, se não existir, define como 'unknown' para forçar a detecção
        const userRole = data.user.user_metadata?.role || 'unknown';
        console.log('🔐 [DEBUG] Role do usuário (inicial):', userRole);
        
        const userData = await this.getUserData(data.user.id, userRole);

        if (userData) {
          console.log('🔐 [DEBUG] Dados do usuário recuperados:', userData.role);
          this.currentUser = userData;
          localStorage.setItem('currentUser', JSON.stringify(userData));
          return { success: true, user: userData };
        } else {
          console.log('🔐 [DEBUG] Falha ao recuperar dados do usuário');
        }
      }

      console.log('🔐 [DEBUG] Login falhou - nenhum usuário encontrado');
      return { success: false, message: 'Erro ao recuperar dados do usuário' };

    } catch (error) {
      console.error('🔐 [ERROR] Erro no login:', error);
      return { success: false, message: 'Erro interno do servidor' };
    }
  }

  /**
   * Login legado para compatibilidade com sistema anterior
   */
  private async loginLegacy(email: string, password: string): Promise<{ success: boolean; user?: User; message?: string }> {
    try {
      console.log('🔐 [DEBUG] Iniciando loginLegacy para:', email);
      // Buscar usuário nas tabelas do banco
      let userData: User | null = null;

      // Verificar se é admin
      console.log('🔐 [DEBUG] Verificando se é admin...');
      const { data: adminData, error: adminError } = await supabase
        .from('admins')
        .select('*')
        .eq('email', email)
        .single();

      console.log('🔐 [DEBUG] Resultado busca admin:', { adminData: !!adminData, error: adminError?.message });

      if (adminData && password === 'admin123') { // Senha fixa para admins em desenvolvimento
        console.log('🔐 [DEBUG] Admin encontrado e senha correta!');
        userData = {
          id: adminData.id,
          email: adminData.email,
          name: adminData.nome,
          role: 'admin',
          redirectUrl: '/admin'
        };
      } else if (adminData) {
        console.log('🔐 [DEBUG] Admin encontrado mas senha incorreta. Senha fornecida:', password);
      }

      // Verificar se é empresa
      if (!userData) {
        const { data: empresaData } = await supabase
          .from('empresas')
          .select('*')
          .eq('email_contato', email)
          .single();

        if (empresaData) {
          // Verificar senha no localStorage para compatibilidade
          const senhasSalvas = localStorage.getItem('empresas_senhas');
          if (senhasSalvas) {
            const senhas = JSON.parse(senhasSalvas);
            const senhaEmpresa = senhas[email];
            
            if (senhaEmpresa && senhaEmpresa === password) {
              userData = {
                id: empresaData.id,
                email: empresaData.email_contato,
                name: empresaData.nome_empresa,
                role: 'empresa',
                redirectUrl: '/empresa',
                empresa_id: empresaData.id
              };
            }
          }
        }
      }

      // Verificar se é colaborador
      if (!userData) {
        const { data: colaboradorData } = await supabase
          .from('colaboradores')
          .select('*, empresas(nome_empresa)')
          .eq('email', email)
          .single();

        if (colaboradorData) {
          // Para colaboradores, usar senha padrão ou sistema de convites
          userData = {
            id: colaboradorData.id,
            email: colaboradorData.email,
            name: colaboradorData.nome,
            role: 'colaborador',
            redirectUrl: '/colaborador',
            empresa_id: colaboradorData.empresa_id,
            permissoes: colaboradorData.permissoes
          };
        }
      }

      if (userData) {
        console.log('🔐 [DEBUG] Login legado bem-sucedido para:', userData.role);
        this.currentUser = userData;
        localStorage.setItem('currentUser', JSON.stringify(userData));
        return { success: true, user: userData };
      }

      console.log('🔐 [DEBUG] Login legado falhou - nenhum usuário encontrado');
      return { success: false, message: 'E-mail ou senha inválidos' };

    } catch (error) {
      console.error('🔐 [ERROR] Erro no login legado:', error);
      return { success: false, message: 'Erro interno do servidor' };
    }
  }

  /**
   * Logout do sistema
   */
  async logout(): Promise<void> {
    try {
      // Logout do Supabase Auth
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Erro ao fazer logout do Supabase:', error);
    }
    
    // Limpar dados locais
    this.currentUser = null;
    localStorage.removeItem('currentUser');
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  /**
   * Verifica se o usuário tem uma role específica
   */
  hasRole(role: 'admin' | 'empresa' | 'colaborador'): boolean {
    return this.currentUser?.role === role;
  }

  /**
   * Verifica se o usuário pertence a uma empresa específica
   */
  belongsToEmpresa(empresaId: string): boolean {
    return this.currentUser?.empresa_id === empresaId || this.currentUser?.role === 'admin';
  }

  /**
   * Obtém lista de empresas (apenas para admins)
   */
  async getEmpresas(): Promise<AuthResponse> {
    try {
      if (!this.hasRole('admin')) {
        return { success: false, message: 'Acesso negado' };
      }

      const { data: empresas, error } = await supabase
        .from('empresas')
        .select('*')
        .order('nome_empresa');

      if (error) {
        console.error('Erro ao buscar empresas:', error);
        return { success: false, message: 'Erro ao buscar empresas' };
      }

      return { success: true, data: empresas };

    } catch (error) {
      console.error('Erro ao buscar empresas:', error);
      return { success: false, message: 'Erro interno do servidor' };
    }
  }

  /**
   * Obtém lista de colaboradores de uma empresa
   */
  async getColaboradores(empresaId?: string): Promise<AuthResponse> {
    try {
      const targetEmpresaId = empresaId || this.currentUser?.empresa_id;

      if (!targetEmpresaId) {
        return { success: false, message: 'ID da empresa não encontrado' };
      }

      if (!this.belongsToEmpresa(targetEmpresaId)) {
        return { success: false, message: 'Acesso negado' };
      }

      const { data: colaboradores, error } = await supabase
        .from('colaboradores')
        .select('*, empresas(nome_empresa)')
        .eq('empresa_id', targetEmpresaId)
        .eq('ativo', true)
        .order('nome');

      if (error) {
        console.error('Erro ao buscar colaboradores:', error);
        return { success: false, message: 'Erro ao buscar colaboradores' };
      }

      return { success: true, data: colaboradores };

    } catch (error) {
      console.error('Erro ao buscar colaboradores:', error);
      return { success: false, message: 'Erro interno do servidor' };
    }
  }

  /**
   * Atualiza dados do usuário atual
   */
  async updateCurrentUser(dados: Partial<User>): Promise<AuthResponse> {
    try {
      if (!this.currentUser) {
        return { success: false, message: 'Usuário não autenticado' };
      }

      let updateData: any = {};
      let tableName = '';

      switch (this.currentUser.role) {
        case 'admin':
          tableName = 'admins';
          if (dados.name) updateData.nome = dados.name;
          if (dados.email) updateData.email = dados.email;
          break;

        case 'empresa':
          tableName = 'empresas';
          if (dados.name) updateData.nome_empresa = dados.name;
          if (dados.email) updateData.email_contato = dados.email;
          break;

        case 'colaborador':
          tableName = 'colaboradores';
          if (dados.name) updateData.nome = dados.name;
          if (dados.email) updateData.email = dados.email;
          break;
      }

      const { data, error } = await supabase
        .from(tableName)
        .update(updateData)
        .eq('id', this.currentUser.id)
        .select()
        .single();

      if (error) {
        console.error('Erro ao atualizar usuário:', error);
        return { success: false, message: 'Erro ao atualizar dados' };
      }

      // Atualizar dados locais
      const updatedUser = { ...this.currentUser, ...dados };
      this.currentUser = updatedUser;
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));

      return { success: true, user: updatedUser };

    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      return { success: false, message: 'Erro interno do servidor' };
    }
  }

  // ========================================
  // MÉTODOS LEGADOS - MANTIDOS PARA COMPATIBILIDADE
  // ========================================

  /**
   * Sincroniza dados entre localStorage e memória (método legado)
   * Mantido para compatibilidade com código existente
   */
  private sincronizarDados(): void {
    // Este método agora é um stub - a sincronização é feita via Supabase
    console.warn('sincronizarDados() é um método legado. Use os métodos Supabase.');
  }

  /**
   * Verifica integridade dos dados para debug (método legado)
   */
  verificarIntegridade(): { empresasMemoria: User[], empresasStorage: User[], senhasStorage: any } {
    console.warn('verificarIntegridade() é um método legado.');
    return { 
      empresasMemoria: [], 
      empresasStorage: [], 
      senhasStorage: {} 
    };
  }

  /**
   * Carrega empresas cadastradas do localStorage (método legado)
   */
  private carregarEmpresasCadastradas(): void {
    this.sincronizarDados();
  }
}

export const authService = new AuthService();