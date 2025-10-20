# HumaniQ - Plataforma de Avaliação Psicológica

## Visão Geral
Sistema hierárquico de gestão de usuários (Admin → Empresa → Colaborador) que fornece avaliações psicológicas no ambiente de trabalho.

## Arquitetura Atual

### Backend (Porta 3001)
- **Framework**: Express.js + TypeScript
- **Database**: Neon PostgreSQL (via Replit Database)
- **Autenticação**: JWT + bcrypt
- **ORM**: Drizzle

### Frontend (Porta 5000)
- **Framework**: React + Vite
- **UI**: Shadcn/UI + Tailwind CSS
- **State**: React Query (TanStack Query)
- **Routing**: Wouter

## Estrutura de Diretórios
```
├── server/               # Backend API
│   ├── index.ts         # Servidor Express
│   ├── routes/          # Rotas da API
│   │   ├── auth.ts      # Autenticação
│   │   ├── convites.ts  # Gestão de convites
│   │   ├── empresas.ts  # Gestão de empresas
│   │   └── testes.ts    # Testes psicológicos
│   └── middleware/      # Middleware (auth, etc)
├── src/                 # Frontend React
│   ├── services/        # Serviços da API
│   │   ├── apiService.ts       # API principal
│   │   └── authServiceNew.ts   # Autenticação
│   ├── hooks/           # React hooks
│   └── pages/           # Páginas do app
├── shared/              # Código compartilhado
│   └── schema.ts        # Schema Drizzle + Zod
└── db/                  # Migrações do banco
```

## Endpoints da API

### Autenticação
- `POST /api/auth/login` - Login de usuários
- `POST /api/auth/register/admin` - Registro de administrador

### Convites
- `POST /api/convites/empresa` - Criar convite para empresa
- `POST /api/convites/colaborador` - Criar convite para colaborador
- `GET /api/convites/token/:token` - Buscar convite por token
- `POST /api/convites/empresa/aceitar/:token` - Aceitar convite de empresa
- `POST /api/convites/colaborador/aceitar/:token` - Aceitar convite de colaborador
- `GET /api/convites/listar` - Listar convites (requer autenticação)

### Empresas
- `GET /api/empresas/me` - Obter dados da empresa logada
- `GET /api/empresas/colaboradores` - Listar colaboradores

### Testes Psicológicos
- `GET /api/testes` - Listar testes disponíveis
- `GET /api/testes/:id/perguntas` - Obter perguntas de um teste
- `POST /api/testes/resultado` - Submeter resultado de teste
- `GET /api/testes/resultados/meus` - Obter meus resultados

## Configuração

### Variáveis de Ambiente
```env
DATABASE_URL=postgresql://...  # Fornecido automaticamente pelo Replit
JWT_SECRET=...                 # Chave secreta para JWT
```

### Comandos NPM
```bash
npm run dev        # Inicia frontend (Vite) na porta 5000
npm run server     # Inicia backend (Express) na porta 3001
npm run db:push    # Sincroniza schema com banco de dados
```

## Testes Psicológicos Disponíveis
1. **QVT** - Qualidade de Vida no Trabalho
2. **RPO** - Riscos Psicossociais Ocupacionais
3. **Clima e Bem-Estar** - Avaliação do clima organizacional
4. **Estresse Ocupacional** - Medição de níveis de estresse
5. **Karasek-Siegrist** - Demanda-Controle-Suporte
6. **PAS** - Pesquisa de Ambiente de Segurança
7. **MGRP** - Modelo Geral de Riscos Psicossociais

## Status Atual

### ✅ Implementado
- Backend completo com 18 endpoints RESTful
- Autenticação JWT com bcrypt
- Sistema de convites hierárquico
- Integração frontend-backend
- Database PostgreSQL (Neon)
- Configuração Vite para Replit (`allowedHosts: true`)
- Migração completa de Supabase para API local

### 🔄 Componentes Migrados de Supabase → API Local
- ✅ `TodosResultados.tsx` - usa `apiService.obterMeusResultados()`
- ✅ `Resultado.tsx` - usa `apiService.obterResultadoPorId()`
- ✅ `ResultadoPopup.tsx` - usa `apiService.obterResultadoPorId()`
- ✅ `ResultadoVisualizacao.tsx` - componente compartilhado para exibição de resultados
- ✅ `clima-organizacional-service.ts` - cálculo de pontuação corrigido

### 📐 Arquitetura de Componentes
- **ResultadoVisualizacao**: Componente compartilhado que renderiza todos os tipos de teste (Karasek-Siegrist, Clima Organizacional, RPO, QVT, Genérico)
- **ResultadoPopup**: Dialog que usa `ResultadoVisualizacao` para exibir resultados em popup
- **Resultado.tsx**: Página que usa `ResultadoVisualizacao` para exibir resultados em tela completa
- **Layout unificado**: Ambas as páginas (`/resultado/:id` e `/empresa/colaborador/:id/resultados`) agora usam o mesmo componente de visualização, garantindo consistência visual

### 🔄 Em Uso
- Frontend usando `apiService.ts` e `authServiceNew.ts`
- Backend rodando em `http://localhost:3001`
- Frontend rodando em `http://localhost:5000`

### 📝 Notas Técnicas
- Mudança de `drizzle-zod` para schemas Zod manuais (incompatibilidade de versão)
- Middleware de autenticação diferenciado para admin/empresa/colaborador
- Endpoints de convites renomeados de `/api/invitations` para `/api/convites`
- API retorna camelCase; frontend converte para snake_case quando necessário
- Bug corrigido: `clima-organizacional-service.ts` agora usa `pontuacaoGeral` (soma das respostas) em vez de média convertida

## Fluxo de Usuário

### Admin
1. Registra-se via `/api/auth/register/admin`
2. Faz login via `/api/auth/login`
3. Cria convites para empresas
4. Monitora estatísticas globais

### Empresa
1. Recebe convite via e-mail (token)
2. Aceita convite e define senha
3. Faz login via `/api/auth/login`
4. Cria convites para colaboradores
5. Visualiza resultados dos colaboradores

### Colaborador
1. Recebe convite da empresa
2. Aceita convite e define senha
3. **IMPORTANTE**: Faz login com sua própria conta (email do colaborador)
4. Realiza testes psicológicos (autenticado como colaborador)
5. Visualiza seus próprios resultados

### ⚠️ Regra Importante de Autenticação
- **Colaboradores devem fazer login com suas próprias contas** para realizar testes
- Testes realizados com login de empresa NÃO aparecem para colaboradores
- Apenas testes feitos com login de colaborador são visíveis para:
  - O próprio colaborador (via `/api/testes/resultados/meus`)
  - A empresa vinculada (via `/api/empresas/colaboradores/:id/resultados`)

## 🚀 Preparado para Uso em Massa

### ✅ Otimizações Implementadas (20/10/2025)
- **Pool de Conexões PostgreSQL**: Configurado para até 20 conexões simultâneas
- **Timeout Otimizado**: 10s para conexão, 20s para idle
- **CORS Habilitado**: Permite múltiplas origens simultâneas
- **JWT Token**: Válido por 7 dias (604800 segundos)

### 📊 Testes de Carga Realizados
✅ **10 requisições simultâneas** de health check - Status 200  
✅ **5 logins simultâneos de empresa** - Status 200 (~2.3s cada)  
✅ **5 logins simultâneos de colaborador** - Status 200 (~2.3s cada)

### 🎯 Capacidade do Sistema
- **Usuários simultâneos**: Suporta múltiplas empresas e colaboradores logados ao mesmo tempo
- **Isolation**: Cada empresa só vê seus próprios colaboradores
- **Segurança**: Autenticação JWT com bcrypt (rounds: 10)
- **Performance**: Pool de 20 conexões PostgreSQL (Neon Database)

### ⚠️ Regras Importantes para Uso em Massa
1. **Colaboradores devem fazer login com suas próprias contas** para realizar testes
2. **Testes realizados com login de empresa** terão `colaboradorId = NULL` e não aparecerão para o colaborador
3. **Visibilidade de resultados**:
   - Colaborador: Vê apenas seus próprios resultados
   - Empresa: Vê resultados de todos os colaboradores vinculados
4. **Tokens JWT expiram em 7 dias** - usuário deve fazer login novamente após esse período

## Última Atualização
**Data**: 20 de outubro de 2025  
**Status**: Sistema PRONTO para uso em massa com múltiplos usuários simultâneos ✅

### 🔧 Correções Finais (20/10/2025 - 17:40)
- **Migração completa de Supabase → API Local**: Substituído `database.ts:resultadosService.salvarResultado()` para usar `apiService.submeterResultado()`
- **Todos os testes agora salvam via API local**: Karasek-Siegrist, Clima Organizacional, RPO, QVT, PAS, MGRP, Estresse Ocupacional
- **Erro "Supabase desabilitado" eliminado**: Sistema 100% funcional com backend local

### 🐛 Correção Crítica - Teste Clima e Bem-Estar (20/10/2025 - 18:20)
- **BUG CORRIGIDO**: Erro "supabase.from(...).insert(...).select is not a function" no teste de Clima e Bem-Estar
- **Causa**: `resultadosService.salvarResposta()` ainda usava Supabase para salvar respostas individuais durante o teste
- **Solução**: Migrado para localStorage com salvamento final via API local
- **Arquivos alterados**: `src/lib/database.ts` (linhas 139-198)
- **Status**: Teste de Clima e Bem-Estar 100% funcional sem Supabase ✅

### 🎨 Refatoração de UI (20/10/2025)
- Criado componente `ResultadoVisualizacao.tsx` para unificar a exibição de resultados
- Simplificado `ResultadoPopup.tsx` para usar o componente compartilhado
- Refatorado `Resultado.tsx` para usar o mesmo layout do popup
- Eliminada duplicação de código (~800 linhas de código removidas)
- Layout consistente entre `/resultado/:id` e visualização em popup

### 🐛 Correções de Bugs (20/10/2025)
- **Dados do colaborador nos resultados**: Corrigido endpoint `/api/testes/resultado/:id` para fazer JOIN com tabela de colaboradores
- **Listagem de resultados**: Corrigido endpoint `/api/empresas/colaboradores/:id/resultados` para incluir informações do teste
- Backend agora enriquece metadados com nome, cargo e departamento do colaborador
- Resultados exibem corretamente o nome e cargo do colaborador em vez de "Anônimo"
- Dados do teste também incluídos nos metadados (nome e categoria)
- Listagem de resultados agora mostra: nome do teste, pontuação, percentual e categoria corretamente
- **Visibilidade de resultados**: Corrigido para buscar resultados por `colaboradorId` OU `usuarioId` (compatibilidade)
- Endpoint `/api/testes/resultados/meus` agora usa `OR` para buscar resultados
- Endpoint `/api/empresas/colaboradores/:id/resultados` filtra corretamente por empresa

### 🔐 Credenciais de Teste
```
Admin:
  Email: admin@humaniq.com.br
  Senha: Admin123

Empresa:
  Email: rochatech@rocha.com
  Senha: Rocha123

Colaborador:
  Email: luiz.bastos@rochatech.com
  Senha: Luiz123
```
