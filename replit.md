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
3. Cria convites para colaboradores
4. Visualiza resultados dos colaboradores

### Colaborador
1. Recebe convite da empresa
2. Aceita convite e define senha
3. Realiza testes psicológicos
4. Visualiza seus próprios resultados

## Última Atualização
**Data**: 20 de outubro de 2025  
**Status**: Sistema funcional com backend e frontend integrados

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
