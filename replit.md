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
- **PRG Module - Programa de Gestão de Riscos Psicossociais (FULLY IMPLEMENTED - October 21, 2025)**:
    - **Frontend Page**: `/empresa/prg` (EmpresaPRG.tsx)
    - **Route Configuration**: Registered in EmpresaDashboard.tsx
    - **Sidebar Link**: "PRG" in EmpresaSidebar.tsx with FileText icon
    - **Purpose**: Full psychosocial risk management program dashboard
    - **Design**: Glassmorphism design matching EmpresaEstadoPsicossocial
    - **Header**: Inspired by EmpresaEstadoPsicossocial with circular progress indicator (72% global index)
    - **Features**:
        - Dynamic filters (Period, Sector, Job Title, Test Type)
        - 6 KPI cards with real-time metrics and progress indicators
        - AI-powered intelligent analysis (HumaniQ AI) with automatic recommendations
        - 7 interactive tabs: Geral, Clima, Estresse, Burnout, QVT, Assédio, DISC
        - 3 embedded charts/graphs for visual data representation
        - 4 AI-generated action recommendations with priority badges
        - Export options: PDF Report, Excel Spreadsheet, QR Code
    - **Charts**: 3 charts integrated from attached_assets:
        - Radar Chart: General psychosocial condition (grafico1.png)
        - Bar Chart: Organizational climate dimensions (grafico2.png)
        - Thermometer: Occupational stress levels (grafico3.png)
    - **KPIs Tracked**:
        - Occupational Stress Index: 68% (Moderate)
        - Positive Organizational Climate: 74% (Attention)
        - Leadership Satisfaction: 82% (Healthy)
        - Burnout Risk: 41% (High)
        - PRG Maturity: 65% (Intermediate)
        - Psychological Safety Perception: 79% (Good)
    - **AI Recommendations**:
        - Implement active listening channels
        - Schedule programmed breaks
        - Train leaders in empathetic communication
        - Quarterly PRG review
    - **Compliance**: NR-01 and WHO guidelines
    - **UI Components**: Cards, Badges, Progress bars, Tabs, Select dropdowns
    - **Color Coding**: Green (80-100 Healthy), Yellow (60-79 Attention), Red (0-59 Critical)
    - **Assets Location**: `src/assets/prg/` (grafico1.png, grafico2.png, grafico3.png)
    - **Status**: Fully functional with placeholder data, ready for backend integration

### System Design Choices
The system migrated from Supabase to a fully local API backend to eliminate external dependencies and ensure greater control over data and authentication. Manual Zod schemas are used due to version incompatibilities with `drizzle-zod`. The API returns camelCase, and the frontend handles conversions to snake_case where necessary.

## External Dependencies
- **Database**: Neon PostgreSQL
- **Frontend Libraries**: React, Vite, Shadcn/UI, Tailwind CSS, TanStack Query, Wouter
- **Backend Libraries**: Express.js, TypeScript, Drizzle, bcrypt, jsonwebtoken