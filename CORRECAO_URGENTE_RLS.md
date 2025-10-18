# 🚨 CORREÇÃO URGENTE - RLS COLABORADORES

## ❗ PROBLEMA IDENTIFICADO
Os erros **406** e **403** no cadastro de colaborador são causados por políticas RLS (Row Level Security) muito restritivas na tabela `colaboradores`.

## 🎯 SOLUÇÃO IMEDIATA

### PASSO 1: Acessar Supabase Dashboard
1. Abra seu navegador
2. Vá para: https://supabase.com/dashboard
3. Faça login na sua conta
4. Selecione o projeto **HumaniQ**

### PASSO 2: Desabilitar RLS Temporariamente
1. No menu lateral, clique em **"SQL Editor"**
2. Clique em **"New query"**
3. Cole exatamente este comando:

```sql
ALTER TABLE colaboradores DISABLE ROW LEVEL SECURITY;
```

4. Clique em **"Run"** (botão verde)
5. Você deve ver uma mensagem de sucesso

### PASSO 3: Testar o Cadastro
1. Volte para sua aplicação em http://localhost:5173
2. Tente fazer o cadastro de colaborador novamente
3. **Os erros 406 e 403 devem desaparecer**

### PASSO 4: Reabilitar RLS com Políticas Corretas
**⚠️ IMPORTANTE: Faça isso APENAS após confirmar que o cadastro funciona**

1. Volte ao **SQL Editor** no Supabase
2. Execute este script completo:

```sql
-- Reabilitar RLS
ALTER TABLE colaboradores ENABLE ROW LEVEL SECURITY;

-- Remover políticas antigas
DROP POLICY IF EXISTS "colaboradores_insert_policy" ON colaboradores;
DROP POLICY IF EXISTS "colaboradores_select_policy" ON colaboradores;
DROP POLICY IF EXISTS "colaboradores_update_policy" ON colaboradores;
DROP POLICY IF EXISTS "colaboradores_delete_policy" ON colaboradores;

-- Política INSERT: Permitir inserção via convites válidos
CREATE POLICY "colaboradores_insert_via_convite" ON colaboradores
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM convites_colaborador 
    WHERE email = colaboradores.email 
    AND empresa_id = colaboradores.empresa_id 
    AND status = 'pendente'
  )
);

-- Política SELECT: Permitir visualização para empresas autenticadas
CREATE POLICY "colaboradores_select_empresa" ON colaboradores
FOR SELECT
USING (
  auth.uid() IN (
    SELECT auth_user_id FROM empresas WHERE id = colaboradores.empresa_id
  )
);

-- Política UPDATE: Permitir atualização para empresas autenticadas
CREATE POLICY "colaboradores_update_empresa" ON colaboradores
FOR UPDATE
USING (
  auth.uid() IN (
    SELECT auth_user_id FROM empresas WHERE id = colaboradores.empresa_id
  )
);

-- Política DELETE: Permitir exclusão para empresas autenticadas
CREATE POLICY "colaboradores_delete_empresa" ON colaboradores
FOR DELETE
USING (
  auth.uid() IN (
    SELECT auth_user_id FROM empresas WHERE id = colaboradores.empresa_id
  )
);
```

## 🔍 VERIFICAÇÃO FINAL

Após executar todos os passos:

1. **Teste o cadastro de colaborador** - deve funcionar sem erros
2. **Verifique se não há mais erros 406/403** no console do navegador
3. **Confirme que os colaboradores são criados** na tabela

## 📞 SE ALGO DER ERRADO

Se ainda houver problemas após seguir todos os passos:

1. Verifique se executou todos os comandos SQL corretamente
2. Confirme se está no projeto correto no Supabase
3. Verifique se as variáveis de ambiente estão corretas no `.env`

## ✅ RESULTADO ESPERADO

- ✅ Cadastro de colaborador funcionando
- ✅ Sem erros 406/403 no console
- ✅ RLS reabilitado com políticas corretas
- ✅ Segurança mantida para operações futuras