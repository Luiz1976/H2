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

### System Design Choices
Migration from Supabase to a local API backend for enhanced control. Manual Zod schemas are used due to `drizzle-zod` incompatibilities. API returns camelCase, with frontend handling necessary conversions.

## External Dependencies
- **Database**: Neon PostgreSQL
- **Frontend Libraries**: React, Vite, Shadcn/UI, Tailwind CSS, TanStack Query, Wouter, Recharts
- **Backend Libraries**: Express.js, TypeScript, Drizzle, bcrypt, jsonwebtoken
- **AI Integration**: Google Gemini API