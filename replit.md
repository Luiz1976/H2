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
- **PRG Module (Programa de Gestão de Riscos Psicossociais)**: Full psychosocial risk management dashboard using real-time data. Includes dynamic filters, 6 KPI cards, AI-powered intelligent analysis with a robust fallback system, 6 interactive tabs, 3 embedded charts (Risk Matrix, Risk Distribution, Radar Chart), and **3 comprehensive export options**: 
  - **(1) PDF Complete Report** - Professional HTML report with: Cover page with gradient design and metadata; Clickable table of contents (9 sections); Complete summary with all 6 KPIs; Overview with test distribution by type; Detailed KPI analysis with descriptions and status badges; Full psychosocial dimensions analysis with progress bars and gap indicators; Complete risk matrix table with probability, severity and classification; Risk distribution by category with visual cards (critical/high/moderate/low); Full AI analysis with structured paragraphs; Complete recommendations with all 9 fields (category, priority, title, description, practical actions, timeline, responsible party, expected impact, resources/budget); Compliance section (NR-01, ISO 45003, LGPD); Professional footer with generation metadata. **Totalmente organizado, setorizado e fácil de entender.**
  - **(2) QR Code Público - Relatório Executivo** - **Sistema de compartilhamento LIVRE (sem necessidade de login)** acessível SOMENTE via QR Code. Gera token único (empresaId-timestamp), exibe modal com QR Code (qrserver.com API), URL pública compartilhável, opção de download do QR Code. Rota pública: `/prg/compartilhado/:token`. Backend valida token e retorna dados do PRG sem autenticação. **Relatório Executivo Completo** (`PRGPublico.tsx`) - Design profissional e responsivo otimizado para gestão e direção: **6 abas principais** (Resumo Executivo, Indicadores Detalhados, Dimensões Psicossociais, Análise de Riscos, Análise IA, Plano de Ações); Aba "Resumo" com visão geral, métricas principais (colaboradores, testes, cobertura, status) e explicação do PRG; Aba "Indicadores" com 6 KPIs detalhados (estresse, clima, liderança, burnout, maturidade, segurança) incluindo interpretação executiva de cada métrica; Aba "Dimensões" com gráfico radar e análise comparativa com metas, mostrando gaps e percentual de alcance; Aba "Riscos" com matriz de riscos, distribuição por categoria e legenda completa; Aba "Análise" com análise IA completa formatada profissionalmente; Aba "Ações" com plano de ações detalhado incluindo TODOS os 9 campos (categoria, prioridade, título, descrição, ações práticas, prazo, responsável, impacto esperado, recursos/orçamento). **100% responsivo** para mobile, tablet e desktop. Layout moderno com glassmorphism, gradientes e animações sutis. Linguagem simplificada e objetiva para executivos não-técnicos.
  - **(3) Action Plan HTML** - Complete implementation guide (accessible via button above export cards) with step-by-step actions, timelines, budget estimates for all recommendations.
  Features fully enhanced AI analysis and recommendations sections with structured content, practical actions, timelines, and budget estimates. All exports functional and working.
- **Colaborador Module**: Enhanced collaborator profile management including `avatar` field, `GET /api/colaboradores/me` endpoint, and consistent display of collaborator data across the frontend.

### System Design Choices
Migration from Supabase to a local API backend for enhanced control. Manual Zod schemas are used due to `drizzle-zod` incompatibilities. API returns camelCase, with frontend handling necessary conversions.

## External Dependencies
- **Database**: Neon PostgreSQL
- **Frontend Libraries**: React, Vite, Shadcn/UI, Tailwind CSS, TanStack Query, Wouter, Recharts
- **Backend Libraries**: Express.js, TypeScript, Drizzle, bcrypt, jsonwebtoken
- **AI Integration**: Google Gemini API