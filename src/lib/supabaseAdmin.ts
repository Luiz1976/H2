// supabaseAdmin.ts
// Cliente Supabase com Service Role para operações administrativas

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  throw new Error('VITE_SUPABASE_URL não está configurada');
}

if (!supabaseServiceKey) {
  console.warn('⚠️ VITE_SUPABASE_SERVICE_ROLE_KEY não configurada - operações administrativas podem falhar');
}

// Cliente administrativo com Service Role (apenas para backend/operações privilegiadas)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey || '', {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  },
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'X-Client-Info': 'humaniq-admin'
    }
  }
});

// Função para verificar se o service role está disponível
export const isServiceRoleAvailable = (): boolean => {
  return !!supabaseServiceKey;
};

// Função para executar operações administrativas com fallback
export const executeAdminOperation = async <T>(
  adminOperation: () => Promise<T>,
  fallbackOperation?: () => Promise<T>
): Promise<T> => {
  if (isServiceRoleAvailable()) {
    try {
      return await adminOperation();
    } catch (error) {
      console.warn('⚠️ Operação administrativa falhou, tentando fallback:', error);
      if (fallbackOperation) {
        return await fallbackOperation();
      }
      throw error;
    }
  } else {
    if (fallbackOperation) {
      console.warn('⚠️ Service role não disponível, usando fallback');
      return await fallbackOperation();
    } else {
      throw new Error('Service role não configurado e nenhum fallback disponível');
    }
  }
};