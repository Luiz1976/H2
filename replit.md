# HumaniQ - Plataforma de Avaliação Psicológica

## Overview
HumaniQ is a hierarchical user management system (Admin → Company → Employee) designed for mass psychological assessments in the workplace. It aims to streamline testing, analyze work-life quality, psychosocial risks, organizational climate, and occupational stress, providing data isolation between companies. The platform offers comprehensive tools for monitoring psychosocial states and managing risks, aligning with regulatory and international standards.

## User Preferences
I prefer simple language and clear explanations. I want iterative development with frequent updates. Ask before making major architectural changes. Do not make changes to the `shared` folder without explicit instruction. I prefer detailed explanations for complex features or decisions.

## System Architecture

### UI/UX Decisions
The frontend uses React with Vite, Shadcn/UI, and Tailwind CSS for a modern, responsive design. Key components like `ResultadoVisualizacao` unify the display of test results. Revolutionary glassmorphism designs with animated elements are used for advanced dashboards like "Estado Psicossocial" and "PRG".

### Technical Implementations
- **Backend**: Express.js + TypeScript
- **Frontend**: React + Vite
- **Database**: Neon PostgreSQL (via Replit Database)
- **ORM**: Drizzle
- **Authentication**: JWT + bcrypt (10 rounds)
- **State Management**: React Query (TanStack Query)
- **Routing**: Wouter
- **API Structure**: RESTful API with distinct routes for authentication, invitations, companies, and psychological tests.
- **Security**: JWT tokens valid for 7 days.
- **Performance**: PostgreSQL connection pool (20 simultaneous connections, 10s connect, 20s idle timeout). CORS enabled for multiple origins.

### Feature Specifications
- **User Roles**: Admin, Company, Employee with distinct permissions.
- **Invitation System**: Hierarchical invitations (Admin invites Company, Company invites Employee).
- **Psychological Tests**: Supports multiple types including QVT, RPO, Clima e Bem-Estar, Estresse Ocupacional, Karasek-Siegrist, PAS, and MGRP.
- **Result Visualization**: Unified component for consistent display across all test types.
- **Data Isolation**: Companies view only their employees' results; employees view only their own.
- **Psychosocial State Monitoring**: Provides aggregated, anonymized insights into psychosocial risk factors (NR1 compliant, ISO 45003 framework). Features AI-powered analysis (Google Gemini API), risk classification, automated recommendations, and a revolutionary glassmorphism UI.
- **PRG Module (Programa de Gestão de Riscos Psicossociais)**: Full psychosocial risk management dashboard using real-time data. Includes dynamic filters, 6 KPI cards, AI-powered intelligent analysis with a robust fallback system, 6 interactive tabs, 3 embedded charts (Risk Matrix, Risk Distribution, **Parliament Chart** showing ALL colaboradores including "Não Avaliado" category for employees without completed tests), **professional company identification headers** (nome, CNPJ, endereço, setor with glassmorphism design), **HumaniQ AI institutional branding footer** (platform definition, methodology, compliance badges), and **3 comprehensive export options**: 
  - **(1) PDF Complete Report** - **PROFESSIONAL PGR MARKET STANDARD** HTML report following industry best practices with complete company identification and HumaniQ AI branding:
    - **Professional Cover Page**: Two logos (company 🏢 + HumaniQ AI), complete company data section (nome, CNPJ, endereço, setor/unidade), report metadata section (data, versão 1.0, período de análise, responsável técnico, plataforma geradora, tipo de relatório PGR-NR01), confidentiality notice footer (documento confidencial, uso exclusivo, LGPD compliance)
    - **Clickable Table of Contents**: 9 main sections with anchors
    - **Complete Summary**: All 6 KPIs with status badges
    - **Overview**: Test distribution by type
    - **Detailed KPI Analysis**: Descriptions and status indicators
    - **Psychosocial Dimensions**: Progress bars and gap indicators (38 dimensions from real data)
    - **Risk Matrix**: Complete table with probability, severity, and classification
    - **Risk Distribution**: Visual cards by category (critical/high/moderate/low)
    - **Full AI Analysis**: Structured paragraphs with professional formatting
    - **Complete Recommendations**: All 9 fields (categoria, prioridade, titulo, descricao, acoesPraticas with 5-6 steps, prazo, responsavel, impactoEsperado, recursos with R$ budget)
    - **Compliance Section**: NR-01, ISO 45003, LGPD
    - **"Sobre a HumaniQ AI" Section**: Complete platform definition, methodology explanation, 4 commitment cards (Autonomia e Imparcialidade, Sigilo e Confidencialidade, Integridade dos Dados, Conformidade Normativa), technical note with test and collaborator counts
    - **Professional Footer**: HumaniQ AI branding, generation timestamp, copyright and compliance notice
    **Completely organized, sectioned, and easy to understand following professional PGR market standards.**
  - **(2) QR Code Público - Relatório Executivo** - **FREE PUBLIC ACCESS SYSTEM (no login required)** accessible ONLY via QR Code. Generates unique token (empresaId-timestamp), displays modal with QR Code (qrserver.com API), shareable public URL, QR Code download option. Public route: `/prg/compartilhado/:token`. Backend validates token and returns PRG data without authentication. **Complete Executive Report** (`PRGPublico.tsx`) - Professional responsive design optimized for management and executives:
    - **Professional Company Header**: Company identification card (nome, CNPJ, endereço, setor) with glassmorphism design matching logged version
    - **6 Main Tabs**: Resumo Executivo, Indicadores Detalhados, Dimensões Psicossociais, Análise de Riscos, Análise IA, Plano de Ações
    - **"Resumo" Tab**: Overview, key metrics (colaboradores, testes, cobertura, status), PRG explanation
    - **"Indicadores" Tab**: 6 detailed KPIs (estresse, clima, liderança, burnout, maturidade, segurança) with executive interpretation for each metric
    - **"Dimensões" Tab**: Radar chart and comparative analysis with targets, showing gaps and achievement percentage
    - **"Riscos" Tab**: Risk matrix, distribution by category, complete legend
    - **"Análise" Tab**: Complete AI analysis professionally formatted
    - **"Ações" Tab**: Detailed action plan including ALL 9 fields (categoria, prioridade, titulo, descricao, acoesPraticas, prazo, responsavel, impactoEsperado, recursos/orçamento)
    - **HumaniQ AI Institutional Footer**: Complete platform definition (specialized in psychosocial/occupational risk analysis, NR-01 based, AI and scientific methodology, automated diagnostics, confidentiality and data integrity), compliance badges (NR-01, ISO 45003, Ethical AI)
    **100% responsive** for mobile, tablet, desktop. Modern layout with glassmorphism, gradients, subtle animations. Simplified objective language for non-technical executives.
  - **(3) Action Plan HTML** - Complete implementation guide (accessible via button above export cards) with step-by-step actions, timelines, budget estimates for all recommendations.
  - **Company Data Integration**: Database fields `cnpj`, `endereco`, `setor` added to empresas table. Both authenticated (`/api/empresas/prg`) and public (`/api/empresas/prg/publico/:token`) endpoints return complete company data (nomeEmpresa, cnpj, endereco, setor) for professional headers and PDF generation.
  Features fully enhanced AI analysis and recommendations sections with structured content, practical actions, timelines, and budget estimates. All exports functional and working with complete professional branding.
- **Colaborador Module**: Enhanced collaborator profile management including `avatar` field, `GET /api/colaboradores/me` endpoint, and consistent display of collaborator data across the frontend.
- **ERP Integration Module**: Comprehensive integration with 9 major Brazilian ERPs for bulk employee invite generation. Uses direct login credentials (username/password) instead of API keys. Pre-configured API URLs and health check endpoints for each ERP type:
  - **Functional ERPs (5 = 55.5%)**: TOTVS (200 OK), SAP (200 OK), SENIOR (401 auth ready), SANKHYA (401 auth ready), MICROSOFT Dynamics 365 (401 auth ready with tenant-specific URL)
  - **Configuration Required (3)**: ORACLE (requires client-specific URL: `{client}.oraclecloud.com`), BENNER (URL to be confirmed), OUTRO (custom placeholder)
  - **Under Investigation (1)**: LINX (connection error - may require IP whitelisting or SSL certificate)
  - **Backend Endpoints**: 
    - `POST /api/erp/login-and-fetch` - Authenticates with ERP and fetches employee data (name, email, position, department, gender)
    - `POST /api/erp/bulk-invite` - Creates mass invitations for imported employees
    - `GET /api/erp/test-connections` - Tests connectivity with all 9 ERPs (health checks, timeout 5s)
  - **Frontend**: Simplified modal interface requiring only 3 fields (ERP type, username, password). Automatic URL selection based on ERP type. No manual URL configuration needed.
  - **Security**: Credentials not persisted, 30s timeout for data fetch, Basic Auth by ERP type, health checks with 5s timeout
  - **Performance**: Average response time 569ms, 0 timeouts, endpoint-specific health checks
  - **Test Results**: Comprehensive connectivity testing with detailed status reports (see `relatorio_teste_erp_ajustado.md`)
- **Test Availability Control System**: Complete system for managing test availability and recurrence for employees (October 25, 2025):
  - **Database**: New `teste_disponibilidade` table with fields for availability status, recurrence period (days), release history, and next availability date
  - **Automatic Blocking**: Tests are automatically marked as unavailable after completion by the employee
  - **Company Controls**: 
    - "Release Again" button to manually unlock completed tests for employees
    - Recurrence configuration (in days) to automatically release tests after a defined period
    - Complete test management per employee via `GerenciamentoTestesColaborador` component
  - **Employee View**: 
    - Tests displayed with availability status (Available/Unavailable)
    - Visual indicators: gray cards with lock icon for unavailable tests
    - Informative messages explaining why tests are unavailable (completed, blocked by company, awaiting recurrence period)
    - Next availability date display when recurrence is configured
  - **Backend Endpoints**:
    - `GET /api/teste-disponibilidade/colaborador/testes` - Returns available tests for authenticated employee
    - `GET /api/teste-disponibilidade/empresa/colaborador/:id/testes` - Returns test information for a specific employee (company access)
    - `POST /api/teste-disponibilidade/empresa/colaborador/:id/teste/:testeId/liberar` - Manually releases a test
    - `PATCH /api/teste-disponibilidade/empresa/colaborador/:id/teste/:testeId/periodicidade` - Configures test recurrence
    - `POST /api/teste-disponibilidade/marcar-concluido` - Internal hook to mark test as unavailable after completion
  - **Features**: Professional audit history, unique constraint per employee/test, automatic release based on recurrence, complete data isolation by company
  - **Components**: `ColaboradorTestes` (employee view), `GerenciamentoTestesColaborador` (company management), updated `Testes` page with dynamic availability checking

### System Design Choices
Migration from Supabase to a local API backend for enhanced control. Manual Zod schemas are used due to `drizzle-zod` incompatibilities. API returns camelCase, with frontend handling necessary conversions.

## External Dependencies
- **Database**: Neon PostgreSQL
- **Frontend Libraries**: React, Vite, Shadcn/UI, Tailwind CSS, TanStack Query, Wouter, Recharts
- **Backend Libraries**: Express.js, TypeScript, Drizzle, bcrypt, jsonwebtoken
- **AI Integration**: Google Gemini API

## Recent Changes
- **Quick Check de Estresse Ocupacional - Interface 100% Idêntica aos Testes** (October 27, 2025): Teste interativo demonstrativo em `/quick-check` para conversão de visitantes
  - **Acesso**: Botões "Diagnóstico Gratuito" e "Iniciar Diagnóstico Gratuito Agora" na landing page redirecionam para o Quick Check
  - **Interface agora idêntica aos testes da plataforma**:
    - **Animação pré-teste** (LoadingAnimation.tsx): Fundo gradiente azul/roxo, ícone de cérebro, mensagens motivacionais rotativas, progress bar, 4 dots de progresso, frase "Você está prestes a descobrir insights valiosos sobre si mesmo"
    - **Layout de perguntas replicado exatamente do TestePerguntas.tsx**
  - **Experiência completa do teste**:
    - **1. Animação pré-teste (LoadingAnimation)**: 6 segundos, gradiente azul→roxo, ícone cérebro, mensagens motivacionais, progress bar, 4 dots
    - **2. Interface de perguntas (100% idêntica TestePerguntas.tsx)**:
      - Header escuro: "Pergunta X" + badge azul da dimensão (estresse/burnout/resiliencia)
      - Barra de progresso superior com contador "X de 7"
      - Texto da pergunta em destaque
      - "Selecione sua resposta"
      - Barra gradiente de cores: azul (Discordo) → cinza (Neutro) → verde (Concordo)
      - **5 botões quadrados A, B, C, D, E** (64x64px) com cores graduais:
        - A: Discordo totalmente (azul escuro)
        - B: Discordo (azul claro)
        - C: Neutro (cinza)
        - D: Concordo (verde claro)
        - E: Concordo totalmente (verde escuro)
      - Feedback "Salvando resposta..." → "Resposta salva com sucesso!" → "Avançando para próxima pergunta..."
      - Avanço automático após registro da resposta
      - Footer: "← Anterior" | "X de 7 respondidas" | "Avanço Automático: Responda para avançar automaticamente"
      - Botão "Finalizar Teste" verde após última pergunta
    - **3. Animação de processamento (ProcessingAnimation)**: 3 etapas com ícones animados e progress bars
    - **4. Tela de resultado**: Gráficos visuais, classificação de risco, pontuação, badges de valor, CTAs otimizados
  - **Estratégias de conversão otimizadas** (múltiplas técnicas de persuasão):
    1. **Card de Preview**: "Esta é apenas uma prévia!" com badges de valor (Conformidade NR-01, Gestão de Equipes, Planos de Ação)
    2. **Alerta Personalizado por Risco** (>3.5): Card vermelho urgente para riscos altos/críticos recomendando ação imediata ("Não deixe para depois")
    3. **Prova Social**: Card roxo com métricas "500+ Profissionais avaliados" e "50+ Empresas atendidas" - confiabilidade
    4. **Benefícios Específicos**: Card verde listando tudo que receberá:
       - 📄 Relatório Profissional em PDF (38 dimensões com gráficos)
       - 🎯 Plano de Ação Personalizado NR-01
       - 📊 Dashboard Interativo de evolução
       - ⚡ Resultados em Minutos (IA instantânea)
    5. **Tabela Comparativa**: Card amarelo mostrando "Preview Grátis vs. Completa"
       - 7 perguntas → 80 perguntas
       - 3 dimensões → 38 dimensões
       - Sem relatório PDF → Com PDF profissional
       - Sem plano NR-01 → Com plano completo
       - Sem gestão equipes → Com gestão completa
    6. **CTAs Estratégicos**:
       - Primário (gradiente indigo-purple): "✨ Acessar Avaliação Completa Agora"
       - Secundário (outline): "Voltar à Página Inicial"
    7. **Disclaimer Ético**: "⚠️ Este é um teste demonstrativo gratuito. Os resultados não substituem avaliação profissional."
    
    **Técnicas de persuasão aplicadas**: Reciprocidade (valor gratuito), Contraste (7 vs 80 perguntas), Prova Social (500+ usuários), Escassez implícita (riscos críticos = urgência), Autoridade (NR-01, métricas), Especificidade (lista exata de benefícios)
  - **Perguntas do Quick Check** (selecionadas do teste completo de Estresse Ocupacional):
    1. Pressão constante e difícil de manejar
    2. Dificuldade para desligar mentalmente do trabalho
    3. Sentimento de sobrecarga com responsabilidades
    4. Trabalho interfere no descanso e sono
    5. Exaustão emocional devido às demandas
    6. Exaustão frequente ao final do dia
    7. Desequilíbrio trabalho-vida pessoal
  - **Algoritmo de classificação**:
    - Média 1.0-2.0: Baixo Risco (verde)
    - Média 2.1-3.5: Risco Moderado (amarelo)
    - Média 3.6-4.5: Alto Risco (laranja)
    - Média 4.6-5.0: Risco Crítico (vermelho)
  - Componente: `QuickCheckEstresse.tsx`, Rota: `/quick-check` (pública, sem autenticação)
- **Landing Page Profissional** (October 27, 2025): Nova landing page de marketing em `/landing` criada para conversão de visitantes em clientes
  - **Design moderno e tecnológico**: Gradientes indigo/purple, glassmorphism, animações sutis, layout responsivo
  - **Técnicas de PNL e gatilhos mentais aplicadas**:
    - Autoridade: ISO 45003, NR-01, dados oficiais do MTE
    - Escassez: Prazo NR-01 (25/05/2026), fase educativa limitada
    - Urgência: Multas, passivos trabalhistas, dados alarmantes (472 mil afastamentos)
    - Prova social: 3 depoimentos reais com resultados mensuráveis
    - Reciprocidade: Diagnóstico gratuito completo, demo sem custo
    - Contraste: Comparativo ROI (R$ 400k custos vs R$ 29.9k investimento = 1.238% ROI)
  - **Estrutura de conteúdo otimizada**:
    - Hero section com headline impactante e estatística chocante
    - Seção de problema (dor): Custos invisíveis e impactos financeiros
    - Mudança regulatória (urgência): Linha do tempo NR-01, consequências
    - Solução completa: 9 módulos integrados detalhados
    - Benefícios por stakeholder: RH, Jurídico, Diretoria, Compliance (tabs interativas)
    - Prova social: Depoimentos com 5 estrelas
    - ROI e economia: Calculadora visual de economia potencial
    - CTA estratégicos: Diagnóstico gratuito posicionado em múltiplos pontos
  - **Componentes e funcionalidades**:
    - Header fixo com scroll effect
    - Navegação suave entre seções (smooth scroll)
    - Tabs interativas para benefícios por área
    - 9 cards de módulos com hover effects
    - Badges de urgência e destaque
    - Botões de CTA com gradientes e ícones
    - Footer completo com navegação
  - **Gatilhos específicos sem ameaças**:
    - Foco em proteção e oportunidade (não em medo)
    - Dados factuais e oficiais (não apelações emocionais)
    - Benefícios concretos e mensuráveis
    - Facilidade e rapidez (5 minutos, sem cartão, sem custo)
  - Rota configurada: `/landing` (página pública, sem autenticação)
- **Admin Convites Page Redesign** (October 25, 2025): Complete UI/UX overhaul for /admin/convites
  - Modern card-based layout replacing traditional table view
  - Gradient backgrounds and glassmorphism effects for visual appeal
  - Enhanced statistics dashboard with 5 KPI cards (Total, Aguardando, Aceitos, Expirados, Taxa de Conversão)
  - Smart status badges with color coding (blue for pending, orange for expiring soon, green for accepted, red for expired)
  - Days remaining countdown for active invites
  - Modal-based invite creation with elegant form design
  - Quick action buttons (Copy Link, Cancel) directly on cards
  - Advanced filtering with search and status dropdown
  - Refresh button with loading animation
  - Empty state with call-to-action
  - Fully responsive design optimized for desktop, tablet, and mobile
  - Professional color scheme with purple-blue gradients
- **CEO Dashboard Enhancement**: 30+ strategic indicators with intelligent insights
  - Organizational Health Index, Retention Rate, Coverage metrics
  - 5-level alert system (critical, high, medium, low) for coverage issues, risk areas, activity drops
  - Temporal analysis (morning, afternoon, evening, night test distribution)
  - Risk analysis panel for critical categories
  - Predictive metrics with next month forecasting
  - LGPD-compliant aggregated data only