# HumaniQ - Plataforma de Avaliação Psicológica

## Overview
HumaniQ is a hierarchical user management system (Admin → Company → Employee) designed for mass psychological assessments in the workplace. It aims to streamline testing, analyze work-life quality, psychosocial risks, organizational climate, and occupational stress, providing data isolation between companies. The platform offers comprehensive tools for monitoring psychosocial states and managing risks, aligning with regulatory and international standards.

## User Preferences
I prefer simple language and clear explanations. I want iterative development with frequent updates. Ask before making major architectural changes. Do not make changes to the `shared` folder without explicit instruction. I prefer detailed explanations for complex features or decisions.

## System Architecture

### UI/UX Decisions
The frontend uses React with Vite, Shadcn/UI, and Tailwind CSS for a modern, responsive design. Revolutionary glassmorphism designs with animated elements are used for advanced dashboards. Components like `ResultadoVisualizacao` unify test result display.

### Technical Implementations
- **Backend**: Express.js + TypeScript
- **Frontend**: React + Vite
- **Database**: Neon PostgreSQL (via Replit Database)
- **ORM**: Drizzle
- **Authentication**: JWT + bcrypt
- **State Management**: React Query (TanStack Query)
- **Routing**: React Router DOM
- **API Structure**: RESTful API
- **Security**: JWT tokens, CORS enabled
- **Performance**: PostgreSQL connection pool
- **Payment Processing**: Stripe (Checkout Sessions, Webhooks, Subscription Management)

### Feature Specifications
- **User Roles**: Admin, Company, Employee with distinct permissions.
- **Invitation System**: Hierarchical invitations (Admin invites Company, Company invites Employee).
- **Psychological Tests**: Supports multiple types including QVT, RPO, Clima e Bem-Estar, Estresse Ocupacional, Karasek-Siegrist, PAS, MGRP, and **HumaniQ Insight** (comprehensive organizational climate assessment with 48 questions across 4 dimensions: Psychological Safety, Internal Communication, Belonging, and Organizational Justice). **Integration with AI & PRG**: HumaniQ Insight results are automatically aggregated and included in the AI-powered psychosocial analysis (Estado Psicossocial) and PRG (Programa de Gestão de Riscos) reports, contributing to overall organizational health metrics, risk assessments, and strategic recommendations.
- **Result Visualization**: Unified component for consistent display.
- **Data Isolation**: Companies view only their employees' results; employees view only their own.
- **Psychosocial State Monitoring**: Aggregated, anonymized insights with AI-powered analysis (Google Gemini API), risk classification, automated recommendations, and a glassmorphism UI. Compliant with NR1 and ISO 45003.
- **PRG Module (Programa de Gestão de Riscos Psicossociais)**: Full psychosocial risk management dashboard with real-time data, dynamic filters, 6 KPI cards, AI-powered analysis, interactive tabs, and 3 embedded charts (Risk Matrix, Risk Distribution, Parliament Chart). Includes professional company identification headers and HumaniQ AI institutional branding footer.
  - **Export Options**:
    - **(1) PDF Complete Report**: Professional HTML report following PGR market standards, with cover page, clickable table of contents, detailed KPI analysis, psychosocial dimensions, risk matrix, AI analysis, comprehensive recommendations (9 fields), compliance section, and "Sobre a HumaniQ AI" section.
    - **(2) QR Code Público - Relatório Executivo**: Free public access system via QR Code, generating a shareable URL to a complete executive report with professional responsive design, 6 main tabs (Resumo Executivo, Indicadores Detalhados, Dimensões Psicossociais, Análise de Riscos, Análise IA, Plano de Ações), and HumaniQ AI institutional footer.
    - **(3) Action Plan HTML**: Complete implementation guide with step-by-step actions, timelines, and budget estimates for all recommendations.
- **Colaborador Module**: Enhanced collaborator profile management including `avatar` field and a dedicated endpoint for employee data.
- **ERP Integration Module**: Comprehensive integration with 9 major Brazilian ERPs (TOTVS, SAP, SENIOR, SANKHYA, MICROSOFT Dynamics 365, ORACLE, BENNER, LINX, OUTRO) for bulk employee invite generation using direct login credentials. Features backend endpoints for login, fetching employee data, bulk invitations, and connection health checks. Frontend uses a simplified modal for user input.
- **Test Availability Control System**: Manages test availability and recurrence for employees. New `teste_disponibilidade` table tracks status, recurrence periods, and release history. Features automatic blocking of completed tests, company controls for manual release and recurrence configuration, and informative employee views with availability status and next availability dates.
  - **CORREÇÃO CRÍTICA (27/10/2025)**: Implementado bloqueio síncrono obrigatório de testes após conclusão no endpoint `/api/testes/resultado`. Anteriormente, o bloqueio era executado de forma assíncrona em background (`setImmediate`), permitindo falhas silenciosas que deixavam testes disponíveis mesmo após conclusão. Agora, o bloqueio é executado de forma síncrona antes de responder ao cliente, garantindo integridade total. Se o bloqueio falhar, uma exceção é lançada e o processo é interrompido. Logs detalhados de auditoria foram adicionados para rastreamento completo do processo.
- **Enhanced Company Invitation System (28/10/2025)**: Sistema aprimorado de convites empresariais com controle de acesso temporal.
  - **Novos Campos no Convite**: CNPJ da empresa, número de colaboradores planejado, e tempo de acesso ao sistema (em dias)
  - **Bloqueio Automático**: Empresas e colaboradores têm acesso bloqueado automaticamente após expiração do período definido
  - **Middleware de Verificação**: `checkEmpresaExpiration` verifica automaticamente status de acesso em cada requisição
  - **Restauração Manual**: Admin pode restaurar acesso via endpoints `/api/empresas/:id/restaurar-acesso` e `/api/empresas/:id/bloquear-acesso`
  - **Campos no Schema**: `empresas.cnpj`, `empresas.numeroColaboradores`, `empresas.diasAcesso`, `empresas.dataExpiracao`
  - **Validação**: Todos os testes só podem ser realizados uma vez por colaborador (sistema já implementado via `teste_disponibilidade`)
- **Quick Check de Estresse Ocupacional**: Interactive demonstrative test at `/quick-check` for visitor conversion. Features an identical interface to platform tests, including pre-test animation, question layout, processing animation, and a result screen with graphs, risk classification, and optimized CTAs. Incorporates conversion strategies like preview cards, personalized risk alerts, social proof, benefit listings, and comparative tables.
- **Landing Page Profissional**: Marketing landing page at `/landing` designed for client conversion. Features modern design with gradients and glassmorphism, applying NLP and mental triggers (authority, scarcity, urgency, social proof, reciprocity, contrast) through content structure, interactive sections, and strategic CTAs.
- **Admin Convites Page Redesign**: UI/UX overhaul of the `/admin/convites` page with a modern card-based layout, gradient backgrounds, glassmorphism effects, enhanced statistics dashboard (5 KPI cards), smart status badges, modal-based invite creation, quick action buttons, and advanced filtering.
- **CEO Dashboard Enhancement (Company Details)**: 30+ strategic indicators with intelligent insights for individual companies, including Organizational Health Index, Retention Rate, coverage metrics, 5-level alert system, temporal analysis, risk analysis panel, and predictive metrics. Located at `/admin/empresas/:id`.
- **Admin Executive Dashboard**: Comprehensive business intelligence dashboard at `/admin` for CEO-level decision making. Features aggregated metrics from all companies including:
  - **Financial Metrics**: MRR (Monthly Recurring Revenue), ARR (Annual Recurring Revenue), revenue growth, ticket medio, revenue projections
  - **Conversion Funnel**: Complete tracking from landing page visits → demo tests → checkout → purchases with conversion rates at each stage
  - **Strategic KPIs**: LTV (Valor Vitalício), CAC (Custo de Aquisição de Cliente), LTV/CAC Ratio, Payback Period
  - **Business Growth**: Active companies, new companies this month, churn rate, growth percentage
  - **Collaborator Metrics**: Total collaborators, active count, average per company, monthly growth
  - **Plan Distribution**: Breakdown by Essencial, Profissional, and Enterprise plans with revenue attribution
  - **Interactive Charts**: 6-month revenue trends, plan distribution pie chart, conversion funnel visualization
  - **Future Projections**: Next month revenue forecast, quarterly projection based on growth trends
- **Stripe Payment Integration**: Complete subscription payment system with Stripe Checkout Sessions. Features include:
  - Three pricing tiers: Essencial (R$15/employee), Profissional (R$25/employee), Enterprise (R$35/employee)
  - Checkout pages at `/checkout/:planType` with Stripe Checkout integration
  - Success and cancellation pages (`/checkout/success`, `/checkout/cancelado`)
  - Backend API routes for creating checkout sessions, managing subscriptions, and canceling subscriptions
  - Webhook handlers for Stripe events (checkout.session.completed, subscription updates, payment failures)
  - Database schema extensions for storing Stripe customer IDs, subscription IDs, plan types, and subscription status
  - Landing page integration with "Começar Agora" buttons linking to checkout flows

### System Design Choices
Migration from Supabase to a local API backend. Manual Zod schemas are used. API returns camelCase.

## External Dependencies
- **Database**: Neon PostgreSQL
- **Frontend Libraries**: React, Vite, Shadcn/UI, Tailwind CSS, TanStack Query, React Router DOM, Recharts
- **Backend Libraries**: Express.js, TypeScript, Drizzle, bcrypt, jsonwebtoken
- **AI Integration**: Google Gemini API
- **Payment Processing**: Stripe (@stripe/stripe-js)