# HumaniQ - Plataforma de Avaliação Psicológica

## Overview
HumaniQ is a hierarchical user management system (Admin → Company → Employee) designed to provide psychological assessments in the workplace. The platform aims to streamline the process of conducting and analyzing psychological tests, offering insights into work-life quality, psychosocial risks, organizational climate, and occupational stress. It is built for mass usage, supporting multiple simultaneous users and ensuring data isolation between companies.

## User Preferences
I prefer simple language and clear explanations. I want iterative development with frequent updates. Ask before making major architectural changes. Do not make changes to the `shared` folder without explicit instruction. I prefer detailed explanations for complex features or decisions.

## System Architecture

### UI/UX Decisions
The frontend utilizes React with Vite, styled using Shadcn/UI and Tailwind CSS for a modern and responsive user experience. Components like `ResultadoVisualizacao`, `ResultadoPopup`, and `Resultado.tsx` are designed for consistency in displaying test results across different views, unifying the layout and reducing code duplication.

### Technical Implementations
- **Backend**: Express.js + TypeScript
- **Frontend**: React + Vite
- **Database**: Neon PostgreSQL (via Replit Database)
- **ORM**: Drizzle
- **Authentication**: JWT + bcrypt (10 rounds)
- **State Management**: React Query (TanStack Query)
- **Routing**: Wouter
- **API Structure**: RESTful API with distinct routes for authentication, invitations, companies, and psychological tests.
- **Environment Variables**: `DATABASE_URL`, `JWT_SECRET`.
- **NPM Commands**: `npm run dev` (frontend), `npm run server` (backend), `npm run db:push` (DB sync).
- **Security**: JWT tokens are valid for 7 days.
- **Performance**: PostgreSQL connection pool configured for up to 20 simultaneous connections, with optimized timeouts (10s connect, 20s idle). CORS is enabled for multiple origins.

### Feature Specifications
- **User Roles**: Admin, Company, Employee with distinct permissions and workflows.
- **Invitation System**: Hierarchical invitations allowing Admins to invite Companies, and Companies to invite Employees.
- **Psychological Tests**:
    - QVT (Qualidade de Vida no Trabalho)
    - RPO (Riscos Psicossociais Ocupacionais)
    - Clima e Bem-Estar (Organizational Climate)
    - Estresse Ocupacional (Occupational Stress)
    - Karasek-Siegrist (Demand-Control-Support)
    - PAS (Pesquisa de Ambiente de Segurança)
    - MGRP (Modelo Geral de Riscos Psicossociais)
- **Result Visualization**: Unified component for displaying results for all test types, ensuring visual consistency.
- **Data Isolation**: Each company can only view results of its own employees. Employees can only view their own results.
- **Authentication Rules**: Employees must log in with their own accounts to perform tests; company logins will not record results for specific employees.
- **Psychosocial State Monitoring (IMPLEMENTED - October 21, 2025)**:
    - **Endpoint**: `GET /api/empresas/estado-psicossocial`
    - **Frontend Page**: `/empresa/estado-psicossocial` (EmpresaEstadoPsicossocial.tsx)
    - **Route Configuration**: Registered in EmpresaDashboard.tsx
    - **Sidebar Link**: "Estado Psicossocial da Empresa" in EmpresaSidebar.tsx
    - **Access Control**: Admins and Companies can access. Admins can view any company's data (defaults to first active company if no empresaId query param provided)
    - **Authentication**: Uses localStorage.getItem('authToken') with Bearer token in headers
    - **Data Fetching**: useEffect + useState pattern (NOT useQuery) to match other empresa pages
    - **AI Integration**: Google Gemini API via GOOGLE_API_KEY environment variable
    - **NR1 Compliance**: Tracks psychosocial risk factors (workload, autonomy, harassment, support, work-life balance) as required by Brazilian NR1 regulation (effective May 2025)
    - **LGPD Compliance**: Implements Article 20 requirements for AI-driven analysis with transparency, explainability, and data minimization
    - **ISO 45003 Framework**: Uses international standards for psychological health and safety at work
    - **UI Design**: Revolutionary glassmorphism design with:
        - Animated floating particles (20 elements)
        - Circular progress indicators with dynamic color coding
        - 4 interactive tabs: AI Analysis (purple), NR1 (blue), Dimensions (green), Actions (orange-red)
        - Emotional NLP messaging based on well-being scores
        - Scientific credibility badges (ISO 45003, WHO, Karasek-Siegrist)
        - Custom animations (float, shimmer, pulse)
    - **Features**:
        - Real-time aggregation of test results across all company employees
        - AI-powered insights with transparent methodology disclosure
        - Risk level classification (Critical, Attention, Moderate, Good)
        - Automated recommendations based on statistical patterns
        - Coverage metrics and compliance tracking
        - Critical alerts identification
        - Continuous improvement action plans
    - **Privacy**: All data is aggregated and anonymized; individual employee data is never exposed
    - **Error Handling**: Comprehensive error states with user-friendly messages
    - **Loading States**: Animated skeleton screens with glassmorphism effects
- **PRG Module - Programa de Gestão de Riscos Psicossociais (FULLY IMPLEMENTED WITH REAL DATA - October 21, 2025)**:
    - **Backend Endpoint**: `GET /api/empresas/prg` - Aggregates real test data and calculates KPIs
    - **Frontend Page**: `/empresa/prg` (EmpresaPRG.tsx, 777 lines)
    - **Route Configuration**: Registered in EmpresaDashboard.tsx
    - **Sidebar Link**: "PRG" in EmpresaSidebar.tsx with FileText icon
    - **Purpose**: Full psychosocial risk management program dashboard with real-time data analysis
    - **Design**: Glassmorphism design matching EmpresaEstadoPsicossocial
    - **Header**: Inspired by EmpresaEstadoPsicossocial with circular progress indicator showing global index
    - **Data Fetching**: useEffect + useState + fetch pattern with authToken (NOT useQuery)
    - **Auto-Refresh**: Reloads data when filters change (period, sector)
    - **Features**:
        - Dynamic filters (Period, Sector, Job Title, Test Type) - auto-reload on change
        - 6 KPI cards with real-time metrics calculated from test results:
            * Occupational Stress Index (from estresse category tests)
            * Positive Organizational Climate (from clima category tests)
            * Leadership Satisfaction (from lideranca category tests)
            * Burnout Risk (inverted burnout scores)
            * PRG Maturity (calculated from test coverage)
            * Psychological Safety Perception (from seguranca category tests)
        - AI-powered intelligent analysis using real test data
        - 6 interactive tabs: Geral, Clima, Estresse, Burnout, QVT, Assédio
        - 3 embedded charts/graphs for visual data representation
        - Real AI-generated action recommendations from backend
        - Export options: PDF Report (window.print), Excel Spreadsheet (CSV download), QR Code (placeholder)
    - **Backend Calculation Logic**:
        - Uses `testes.categoria` field to filter results by type
        - Calculates average scores per category for KPIs
        - Aggregates all test results for the company
        - **AI Analysis**: Uses Google Gemini API (same function as Estado Psicossocial) for real-time intelligent recommendations
        - Returns: indiceGlobal, kpis object, totalColaboradores, totalTestes, cobertura, dadosPorTipo, aiAnalysis, recomendacoes, matrizRiscos, distribuicaoRiscos, dimensoesPsicossociais
    - **Dynamic Charts (Implemented October 21, 2025)**: 3 interactive React/Recharts components rendering real-time data:
        - **MatrizRisco.tsx**: Qualitative risk matrix (Severity x Probability) with color-coded cells (Green=Trivial, Lime=Tolerable, Yellow=Moderate, Orange=Substantial, Red=Intolerable)
        - **GraficoDistribuicaoRiscos.tsx**: Stacked bar chart showing risk distribution by category (Critical, High, Moderate, Low)
        - **GraficoRadarDimensoes.tsx**: Radar chart for psychosocial dimensions (Autonomy, Social Support, Demands, Recognition, Balance, Safety) with current values vs targets
        - Components location: `src/components/prg/`
        - All charts use real backend data, replacing previous static images
    - **Export Functionality**:
        - PDF: Opens browser print dialog (can save as PDF)
        - Excel: Downloads CSV file with all KPIs and metrics
        - QR Code: Placeholder alert (future implementation)
    - **Compliance**: NR-01 and WHO guidelines
    - **UI Components**: Cards, Badges, Progress bars, Tabs, Select dropdowns with loading/error states
    - **Color Coding**: Green (80-100 Healthy), Yellow (60-79 Attention), Red (0-59 Critical)
    - **Status**: Fully functional with real backend integration, live data, and dynamic chart visualization using Recharts

- **Colaborador Module (UPDATED - October 21, 2025)**:
    - **Avatar Field**: Added `avatar` field to colaboradores schema (stores base64 or URL)
    - **Backend Endpoint**: `GET /api/colaboradores/me` - Returns authenticated collaborator's data (name, cargo, departamento, avatar)
    - **Service**: colaboradorService.ts migrated from Supabase to local API
    - **Frontend Display**:
        - Colaborador.tsx page shows avatar and cargo in main header with badges
        - AppSidebar.tsx displays avatar (clickable to change) and cargo below user name
        - AvatarSelector component allows uploading/selecting custom avatars
        - Falls back to default icon if no avatar is set
    - **JWT Enhancement**: Token now includes `colaboradorId` field for role='colaborador'
    - **Data Integrity**: Avatar and cargo are loaded from database and displayed consistently across all colaborador views

### System Design Choices
The system migrated from Supabase to a fully local API backend to eliminate external dependencies and ensure greater control over data and authentication. Manual Zod schemas are used due to version incompatibilities with `drizzle-zod`. The API returns camelCase, and the frontend handles conversions to snake_case where necessary.

## External Dependencies
- **Database**: Neon PostgreSQL
- **Frontend Libraries**: React, Vite, Shadcn/UI, Tailwind CSS, TanStack Query, Wouter
- **Backend Libraries**: Express.js, TypeScript, Drizzle, bcrypt, jsonwebtoken