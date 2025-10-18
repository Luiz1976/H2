# 🚀 INSTRUÇÕES PARA APLICAR FUNÇÕES RPC SEGURAS

## ⚠️ IMPORTANTE
As funções RPC não puderam ser aplicadas automaticamente via API. É necessário aplicá-las manualmente no Dashboard do Supabase.

## 📋 PASSO A PASSO OBRIGATÓRIO

### 1️⃣ Acesse o Supabase Dashboard
- Vá para: https://supabase.com/dashboard
- Faça login na sua conta
- Selecione o projeto **Humaniq**

### 2️⃣ Abra o SQL Editor
- No menu lateral esquerdo, clique em **"SQL Editor"**
- Clique em **"New query"** para criar uma nova consulta

### 3️⃣ Cole o Conteúdo das Funções RPC
- Abra o arquivo `create-rpc-simple.sql` no seu editor de código
- **COPIE TODO O CONTEÚDO** do arquivo
- **COLE** no SQL Editor do Supabase

### 4️⃣ Execute o Script
- Clique no botão **"Run"** (ou pressione Ctrl+Enter)
- Aguarde a execução completa
- ✅ Verifique se não há erros na saída

### 5️⃣ Verifique se as Funções Foram Criadas
Execute esta consulta no SQL Editor para verificar:

```sql
SELECT 
  routine_name,
  routine_type,
  security_type
FROM information_schema.routines 
WHERE routine_schema = 'public' 
  AND routine_name LIKE '%_seguro'
ORDER BY routine_name;
```

**Resultado esperado:** Deve mostrar 4 funções:
- `criar_convite_colaborador_seguro`
- `criar_convite_empresa_seguro`
- `listar_convites_colaborador_seguro`
- `listar_convites_empresa_seguro`

### 6️⃣ Teste as Funções
Execute estes testes no SQL Editor:

```sql
-- Teste 1: Listar convites de empresa
SELECT listar_convites_empresa_seguro();

-- Teste 2: Listar convites de colaborador
SELECT listar_convites_colaborador_seguro();

-- Teste 3: Criar convite de empresa (teste)
SELECT criar_convite_empresa_seguro(
  'Empresa Teste Manual',
  'teste@empresa.com',
  7
);
```

## 🔄 APÓS APLICAR AS FUNÇÕES

### 1. Execute o teste automatizado:
```bash
node test-secure-rpc.js
```

### 2. Se o teste passar, continue com a integração frontend:
- As funções já estão sendo usadas em `AdminConvites.tsx`
- As funções já estão sendo usadas em `EmpresaGestaoConvites.tsx`

### 3. Teste o frontend:
- Acesse: http://localhost:8080/admin
- Teste a criação e listagem de convites
- Verifique se não há erros no console

## 📁 ARQUIVOS IMPORTANTES

- **`create-rpc-simple.sql`** - Contém as funções RPC para aplicar
- **`test-secure-rpc.js`** - Script para testar as funções após aplicação
- **`src/services/secureInvitationService.ts`** - Serviço que usa as funções RPC
- **`src/pages/admin/AdminConvites.tsx`** - Interface admin que usa as funções
- **`src/pages/empresa/EmpresaGestaoConvites.tsx`** - Interface empresa que usa as funções

## 🚨 PROBLEMAS COMUNS

### Se as funções não aparecerem após execução:
1. Verifique se não houve erros na execução
2. Aguarde alguns segundos e execute a consulta de verificação novamente
3. Se necessário, execute o script novamente

### Se o teste automatizado falhar:
1. Verifique se as funções foram realmente criadas no banco
2. Aguarde alguns minutos para o cache do Supabase atualizar
3. Execute o teste novamente

## ✅ PRÓXIMOS PASSOS APÓS SUCESSO

1. **Testar integração frontend completa**
2. **Configurar políticas RLS se necessário**
3. **Documentar o fluxo de autenticação**
4. **Monitorar logs de erro**

---

**⚡ AÇÃO NECESSÁRIA:** Você deve aplicar as funções RPC manualmente no Dashboard do Supabase antes de continuar!