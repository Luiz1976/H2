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
- **PRG Module (Programa de Gestão de Riscos Psicossociais)**: Full psychosocial risk management dashboard using real-time data. Includes dynamic filters, 6 KPI cards, AI-powered intelligent analysis with a robust fallback system, 6 interactive tabs, 3 embedded charts (Risk Matrix, Risk Distribution, Radar Chart), and comprehensive export options (CSV, printable HTML Action Plan). Features fully enhanced AI analysis and recommendations sections with structured content, practical actions, timelines, and budget estimates.
- **Colaborador Module**: Enhanced collaborator profile management including `avatar` field, `GET /api/colaboradores/me` endpoint, and consistent display of collaborator data across the frontend.

### System Design Choices
Migration from Supabase to a local API backend for enhanced control. Manual Zod schemas are used due to `drizzle-zod` incompatibilities. API returns camelCase, with frontend handling necessary conversions.

## External Dependencies
- **Database**: Neon PostgreSQL
- **Frontend Libraries**: React, Vite, Shadcn/UI, Tailwind CSS, TanStack Query, Wouter, Recharts
- **Backend Libraries**: Express.js, TypeScript, Drizzle, bcrypt, jsonwebtoken
- **AI Integration**: Google Gemini API