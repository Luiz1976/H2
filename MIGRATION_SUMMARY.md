# HumaniQ Migration Summary: Lovable to Replit

## Migration Status: IN PROGRESS ✅

This document tracks the migration of the HumaniQ psychological assessment platform from Lovable (using Supabase) to Replit (using Neon PostgreSQL).

## Completed Tasks ✅

### 1. Package Installation ✅
- Installed Drizzle ORM (`drizzle-orm`, `drizzle-kit`)
- Installed PostgreSQL client (`postgres`)
- Installed authentication utilities (`bcryptjs`, `jsonwebtoken`, `@types/bcryptjs`, `@types/jsonwebtoken`)

### 2. Database Schema Creation ✅
- Created comprehensive Drizzle schema in `shared/schema.ts`
- Included all core tables:
  - `admins` - System administrators
  - `empresas` - Companies/Organizations
  - `colaboradores` - Employees/Collaborators
  - `testes` - Psychological tests
  - `resultados` - Test results
- Added proper indexes for performance
- Implemented TypeScript types and Zod validation schemas

### 3. Database Configuration ✅
- Created `drizzle.config.ts` for Drizzle Kit configuration
- Created `db/index.ts` for database connection
- Configured to use Neon PostgreSQL via `DATABASE_URL` environment variable

### 4. Authentication System ✅
- Created JWT-based authentication utilities (`server/utils/auth.ts`):
  - Password hashing with bcrypt
  - Token generation and verification
  - Invite token generation
- Created authentication middleware (`server/middleware/auth.ts`):
  - Token authentication
  - Role-based access control (admin, empresa, colaborador)
  - Route protection middleware

### 5. API Routes ✅
- Created authentication routes (`server/routes/auth.ts`):
  - `/api/auth/login` - Login endpoint for all user types
  - `/api/auth/register/admin` - Admin registration
- Created Express server setup (`server/index.ts`)

### 6. Database Schema Push ✅
- Successfully pushed schema to Neon PostgreSQL
- All tables created successfully
- Database is ready for use

## Remaining Tasks 📋

### 7. Update Frontend Services
- Modify `src/lib/supabase.ts` to use local API
- Update `src/services/authService.ts` to call `/api/auth/*` endpoints
- Update other service files to use local API instead of Supabase

### 8. Workflow Configuration
- Set up workflow to run both Vite frontend and Express backend
- Configure proper port forwarding (frontend on 5000, backend on different port)

### 9. Remove Supabase Dependencies
- Remove `@supabase/supabase-js` from package.json
- Clean up Supabase-specific code
- Remove `server/config/supabase.js`

### 10. Testing
- Test authentication flow (login, registration)
- Test invitation system
- Test psychological assessments
- Verify all features work correctly

## Project Structure

```
.
├── shared/
│   └── schema.ts          # Shared Drizzle schema
├── db/
│   └── index.ts           # Database connection
├── server/
│   ├── index.ts           # Express server
│   ├── utils/
│   │   └── auth.ts        # Auth utilities
│   ├── middleware/
│   │   └── auth.ts        # Auth middleware
│   └── routes/
│       └── auth.ts        # Auth routes
├── drizzle.config.ts      # Drizzle configuration
└── package.json           # Dependencies & scripts
```

## Key Features

### Hierarchical User Management
- **Admin** → Creates company invitations
- **Company (Empresa)** → Creates employee invitations
- **Employee (Colaborador)** → Takes psychological assessments

### Psychological Assessments
- Quality of Life at Work (QVT)
- Occupational Psychosocial Risks (RPO)
- Climate and Well-being tests
- Stress Occupational Assessment
- Karasek-Siegrist Model
- Harassment Perception (PAS)
- MGRP - Psychosocial Risk Management Model

## Environment Variables Required

```
DATABASE_URL=<neon-postgresql-url>  # Already configured by Replit
JWT_SECRET=<your-secret-key>        # TODO: Ask user for this
CORS_ORIGIN=http://localhost:5000  # Frontend URL
PORT=3001                           # Backend port
```

## Next Steps for User

1. The backend infrastructure is ready
2. Database schema has been pushed to Neon PostgreSQL
3. You need to:
   - Provide a JWT_SECRET for secure authentication
   - Update frontend code to use the new API endpoints
   - Test the migration thoroughly
   - Remove Supabase dependencies once confirmed working

## Notes

- The migration preserves all original functionality
- JWT-based auth replaces Supabase Auth
- Row Level Security (RLS) logic will be implemented in API middleware
- All psychological test data structures are preserved
