# HumaniQ - Plataforma de Avaliação Psicológica

## Overview
HumaniQ is a hierarchical user management system (Admin → Company → Employee) designed for mass psychological assessments in the workplace. It aims to streamline testing, analyze work-life quality, psychosocial risks, organizational climate, and occupational stress, providing data isolation between companies. The platform offers comprehensive tools for monitoring psychosocial states and managing risks, aligning with regulatory and international standards. Its business vision is to provide a robust, AI-powered solution for organizational health, offering significant market potential in corporate wellness and risk management.

## User Preferences
I prefer simple language and clear explanations. I want iterative development with frequent updates. Ask before making major architectural changes. Do not make changes to the `shared` folder without explicit instruction. I prefer detailed explanations for complex features or decisions.

## System Architecture

### UI/UX Decisions
The frontend uses React with Vite, Shadcn/UI, and Tailwind CSS for a modern, responsive design across all devices. Revolutionary glassmorphism designs with animated elements are employed for advanced dashboards. A consistent, professional "HQ" lettermark logo with a blue-to-purple gradient is used throughout the platform. Components like `ResultadoVisualizacao` unify test result display, and `MobileHeader` provides mobile-first sidebar navigation.

### Technical Implementations
- **Backend**: Express.js + TypeScript
- **Frontend**: React + Vite
- **Database**: Neon PostgreSQL (via Replit Database)
- **ORM**: Drizzle
- **Authentication**: JWT + bcrypt
- **State Management**: React Query (TanStack Query)
- **Routing**: React Router DOM

### Feature Specifications
- **User Roles**: Admin, Company, Employee with distinct permissions.
- **Invitation System**: Hierarchical invitations (Admin invites Company, Company invites Employee) with temporal access control, CNPJ validation, and planned employee counts.
- **Psychological Tests**: Supports various tests including QVT, RPO, Clima e Bem-Estar, Estresse Ocupacional, Karasek-Siegrist, PAS, MGRP, and HumaniQ Insight (comprehensive organizational climate assessment). Test results are integrated with AI & PRG for psychosocial analysis. Tests are automatically blocked after completion.
- **Psychosocial State Monitoring**: Aggregated, anonymized insights with AI-powered analysis, risk classification, automated recommendations, compliant with NR1 and ISO 45003.
- **PRG Module (Programa de Gestão de Riscos Psicossociais)**: Full psychosocial risk management dashboard with real-time data, AI-powered analysis, interactive charts, and export options including professional PDF reports, public QR Code executive reports, and HTML action plans.
- **Colaborador Module**: Enhanced employee profile management.
- **ERP Integration Module**: Integration with 9 major Brazilian ERPs for bulk employee invitation generation.
- **Course Availability Control System (29/10/2025)**: Complete course access management system requiring explicit company administrator approval. All courses are locked by default upon employee creation. **Automatic Blocking**: Courses are automatically blocked when collaborator passes the final evaluation (score ≥ 70%), while certificate access remains available. Features database table `curso_disponibilidade`, backend API endpoints, auto-seeding on collaborator creation, company management UI at `/empresa/colaborador/:id/resultados`, and proper access enforcement on progress/module endpoints.
- **Interactive Course Panel for Companies (29/10/2025)**: Advanced interactive dashboard located at `/empresa/colaborador/:id/resultados` tab "Cursos e Certificados" featuring:
  - Real-time visualization of all 8 courses with completion status
  - Completed courses with certificate issuance date/time
  - In-progress courses with progress indicators
  - Pending courses identification
  - Centralized access to all issued certificates with direct download
  - Modern glassmorphism design with animated elements
  - Advanced filtering (All, Completed, In Progress, Available, Blocked)
  - Real-time search by course name or category
  - 4 statistical cards showing: Total Courses, Completed, In Progress, Available
  - Complete course information: icon, title, duration, modules, progress percentage
  - Visual progress bars for ongoing courses
  - Certificate cards with QR code, authentication code, issuance date
  - Direct PDF download and view buttons for certificates
  - Responsive design for all devices
  - Backend endpoint: `GET /api/colaboradores/:id/cursos-detalhes` (company role only)
- **Quick Check de Estresse Ocupacional**: Interactive demonstrative test at `/quick-check` for visitor conversion, mirroring platform test experience.
- **Landing Page Profissional**: Marketing landing page at `/landing` designed for client conversion, utilizing NLP and mental triggers.
- **Admin Dashboards**: Redesigned Admin Convites page with modern UI/UX and an Executive Dashboard for CEO-level business intelligence, including financial, conversion, strategic KPIs, and growth metrics.
- **Stripe Payment Integration**: Complete subscription payment system with three pricing tiers, checkout pages, webhook handling, and database schema extensions for subscription management.
- **Employee Certificate Viewing System (30/10/2025)**: Dedicated certificate viewing and download functionality for employees at `/colaborador/cursos/:slug/certificado`, with "Ver" (view in new tab) and "Baixar PDF" (download) buttons for all completed courses.
- **Online/Offline Status Indicator (30/10/2025)**: Discrete pulsating indicator in top-right corner of all screens showing real-time connection status with green dot + "ONLINE" text (with animated waves) when connected, red dot + "OFFLINE" text when disconnected.
- **AI Chatbot with E-Learning Integration (30/10/2025)**: Google Gemini-powered chatbot with comprehensive knowledge base updated to include all 8 professional courses from NR01 Capacitation Trail, certification system details, navigation paths, and course access control information.

### System Design Choices
The system migrated from Supabase to a local API backend. Manual Zod schemas are used for validation, and the API consistently returns camelCase. A PostgreSQL connection pool is used for performance.

## External Dependencies
- **Database**: Neon PostgreSQL
- **Frontend Libraries**: React, Vite, Shadcn/UI, Tailwind CSS, TanStack Query, React Router DOM, Recharts
- **Backend Libraries**: Express.js, TypeScript, Drizzle, bcrypt, jsonwebtoken
- **AI Integration**: Google Gemini API (chatbot and psychosocial analysis)
- **Payment Processing**: Stripe (@stripe/stripe-js)