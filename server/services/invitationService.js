// services/invitationService.js
// Serviço de convites usando solução híbrida com Service Role

import { supabaseAdmin } from '../config/supabase.js';
import { v4 as uuidv4 } from 'uuid';

// ========================================
// UTILITÁRIOS
// ========================================

const gerarToken = () => {
  return uuidv4().replace(/-/g, '').substring(0, 16);
};

const calcularDataExpiracao = (dias = 7) => {
  const agora = new Date();
  agora.setDate(agora.getDate() + dias);
  return agora.toISOString();
};

const validarEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// ========================================
// SERVIÇO DE CONVITES DE EMPRESA
// ========================================

export const criarConviteEmpresa = async (dadosConvite) => {
  try {
    const { nome_empresa, email_contato, admin_id, dias_expiracao = 7 } = dadosConvite;

    // Validações básicas
    if (!nome_empresa || nome_empresa.trim().length < 2) {
      throw new Error('Nome da empresa é obrigatório e deve ter pelo menos 2 caracteres');
    }

    if (!email_contato || !validarEmail(email_contato)) {
      throw new Error('Email de contato inválido');
    }

    if (!admin_id) {
      throw new Error('ID do admin é obrigatório');
    }

    // Verificar se o admin existe
    const { data: admin, error: adminError } = await supabaseAdmin
      .from('admins')
      .select('id')
      .eq('id', admin_id)
      .single();

    if (adminError || !admin) {
      throw new Error('Admin não encontrado');
    }

    // Verificar se já existe convite pendente para este email
    const { data: conviteExistente, error: checkError } = await supabaseAdmin
      .from('convites_empresa')
      .select('id, status')
      .eq('email_contato', email_contato.toLowerCase())
      .eq('status', 'pendente')
      .single();

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = não encontrado
      throw new Error('Erro ao verificar convites existentes');
    }

    if (conviteExistente) {
      throw new Error('Já existe um convite pendente para este email');
    }

    // Gerar dados do convite
    const token = gerarToken();
    const validade = calcularDataExpiracao(dias_expiracao);

    const novoConvite = {
      token,
      nome_empresa: nome_empresa.trim(),
      email_contato: email_contato.toLowerCase(),
      admin_id,
      status: 'pendente',
      validade,
      metadados: {
        criado_via: 'api_server',
        ip_origem: dadosConvite.ip_origem || null,
        user_agent: dadosConvite.user_agent || null
      }
    };

    // Criar convite usando Service Role (solução híbrida)
    const { data: convite, error: insertError } = await supabaseAdmin
      .from('convites_empresa')
      .insert(novoConvite)
      .select()
      .single();

    if (insertError) {
      console.error('❌ Erro ao criar convite:', insertError);
      throw new Error('Falha ao criar convite de empresa');
    }

    console.log('✅ Convite de empresa criado:', convite.id);

    return {
      success: true,
      message: 'Convite de empresa criado com sucesso',
      data: {
        id: convite.id,
        token: convite.token,
        nome_empresa: convite.nome_empresa,
        email_contato: convite.email_contato,
        status: convite.status,
        validade: convite.validade,
        created_at: convite.created_at
      }
    };

  } catch (error) {
    console.error('❌ Erro no serviço de convite empresa:', error.message);
    return {
      success: false,
      message: error.message || 'Erro interno ao criar convite'
    };
  }
};

// ========================================
// SERVIÇO DE CONVITES DE COLABORADOR
// ========================================

export const criarConviteColaborador = async (dadosConvite) => {
  try {
    const { nome, email, empresa_id, dias_expiracao = 7 } = dadosConvite;

    // Validações básicas
    if (!nome || nome.trim().length < 2) {
      throw new Error('Nome é obrigatório e deve ter pelo menos 2 caracteres');
    }

    if (!email || !validarEmail(email)) {
      throw new Error('Email inválido');
    }

    if (!empresa_id) {
      throw new Error('ID da empresa é obrigatório');
    }

    // Verificar se a empresa existe
    const { data: empresa, error: empresaError } = await supabaseAdmin
      .from('empresas')
      .select('id')
      .eq('id', empresa_id)
      .single();

    if (empresaError || !empresa) {
      throw new Error('Empresa não encontrada');
    }

    // Verificar se já existe convite pendente para este email na empresa
    const { data: conviteExistente, error: checkError } = await supabaseAdmin
      .from('convites_colaborador')
      .select('id, status')
      .eq('email', email.toLowerCase())
      .eq('empresa_id', empresa_id)
      .eq('status', 'pendente')
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      throw new Error('Erro ao verificar convites existentes');
    }

    if (conviteExistente) {
      throw new Error('Já existe um convite pendente para este email nesta empresa');
    }

    // Gerar dados do convite
    const token = gerarToken();
    const validade = calcularDataExpiracao(dias_expiracao);

    const novoConvite = {
      token,
      nome: nome.trim(),
      email: email.toLowerCase(),
      empresa_id,
      status: 'pendente',
      validade,
      metadados: {
        criado_via: 'api_server',
        ip_origem: dadosConvite.ip_origem || null,
        user_agent: dadosConvite.user_agent || null
      }
    };

    // Criar convite usando Service Role
    const { data: convite, error: insertError } = await supabaseAdmin
      .from('convites_colaborador')
      .insert(novoConvite)
      .select(`
        *,
        empresas (
          nome_empresa
        )
      `)
      .single();

    if (insertError) {
      console.error('❌ Erro ao criar convite colaborador:', insertError);
      throw new Error('Falha ao criar convite de colaborador');
    }

    console.log('✅ Convite de colaborador criado:', convite.id);

    return {
      success: true,
      message: 'Convite de colaborador criado com sucesso',
      data: {
        id: convite.id,
        token: convite.token,
        nome: convite.nome,
        email: convite.email,
        empresa_id: convite.empresa_id,
        empresa_nome: convite.empresas?.nome_empresa,
        status: convite.status,
        validade: convite.validade,
        created_at: convite.created_at
      }
    };

  } catch (error) {
    console.error('❌ Erro no serviço de convite colaborador:', error.message);
    return {
      success: false,
      message: error.message || 'Erro interno ao criar convite'
    };
  }
};

// ========================================
// SERVIÇOS DE CONSULTA
// ========================================

export const buscarConvitePorToken = async (token, tipo = 'empresa') => {
  try {
    const tabela = tipo === 'empresa' ? 'convites_empresa' : 'convites_colaborador';
    
    const query = supabaseAdmin
      .from(tabela)
      .select('*')
      .eq('token', token)
      .single();

    if (tipo === 'colaborador') {
      query.select(`
        *,
        empresas (
          nome_empresa
        )
      `);
    }

    const { data: convite, error } = await query;

    if (error || !convite) {
      return {
        success: false,
        message: 'Convite não encontrado'
      };
    }

    // Verificar se o convite ainda é válido
    const agora = new Date();
    const validade = new Date(convite.validade);

    if (agora > validade) {
      return {
        success: false,
        message: 'Convite expirado'
      };
    }

    if (convite.status !== 'pendente') {
      return {
        success: false,
        message: 'Convite já foi utilizado ou cancelado'
      };
    }

    return {
      success: true,
      data: convite
    };

  } catch (error) {
    console.error('❌ Erro ao buscar convite:', error.message);
    return {
      success: false,
      message: 'Erro interno ao buscar convite'
    };
  }
};

export const listarConvites = async (filtros = {}) => {
  try {
    const { tipo = 'empresa', admin_id, empresa_id, status, limite = 50 } = filtros;
    
    const tabela = tipo === 'empresa' ? 'convites_empresa' : 'convites_colaborador';
    
    let query = supabaseAdmin
      .from(tabela)
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limite);

    if (tipo === 'empresa' && admin_id) {
      query = query.eq('admin_id', admin_id);
    }

    if (tipo === 'colaborador' && empresa_id) {
      query = query.eq('empresa_id', empresa_id);
    }

    if (status) {
      query = query.eq('status', status);
    }

    const { data: convites, error } = await query;

    if (error) {
      throw new Error('Erro ao buscar convites');
    }

    return {
      success: true,
      data: convites || []
    };

  } catch (error) {
    console.error('❌ Erro ao listar convites:', error.message);
    return {
      success: false,
      message: error.message || 'Erro interno ao listar convites'
    };
  }
};