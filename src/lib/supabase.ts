import { createClient } from '@supabase/supabase-js';

// Validação das variáveis de ambiente
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error('VITE_SUPABASE_URL não está definida nas variáveis de ambiente');
}

if (!supabaseAnonKey) {
  throw new Error('VITE_SUPABASE_ANON_KEY não está definida nas variáveis de ambiente');
}

// Criação do cliente Supabase com configurações otimizadas
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'x-client-info': 'humaniq-insight-hub',
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

// Função utilitária para retry com backoff exponencial
export const retryWithBackoff = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000,
  maxDelay: number = 10000
): Promise<T> => {
  let lastError: Error;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      
      // Se é o último attempt, lança o erro
      if (attempt === maxRetries) {
        console.error(`❌ [RETRY] Falha após ${maxRetries + 1} tentativas:`, lastError);
        throw lastError;
      }
      
      // Calcula delay com backoff exponencial
      const delay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay);
      console.warn(`⚠️ [RETRY] Tentativa ${attempt + 1} falhou, tentando novamente em ${delay}ms:`, error);
      
      // Aguarda antes da próxima tentativa
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError!;
};

// Função para verificar conexão com o Supabase
export const testConnection = async () => {
  try {
    const { data, error } = await supabase.from('_test').select('*').limit(1);
    if (error && error.code !== 'PGRST116') { // PGRST116 = tabela não encontrada (esperado)
      throw error;
    }
    return { success: true, message: 'Conexão com Supabase estabelecida com sucesso' };
  } catch (error) {
    console.error('Erro ao conectar com Supabase:', error);
    return { success: false, message: 'Erro ao conectar com Supabase', error };
  }
};