# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Django + Next.js monorepo for KAPM (Kancelaria Adwokacka Prawników i Mediatorów) - a comprehensive CMS system for a law firm. The backend provides REST APIs and an admin panel, while the frontend delivers a public website and SPA admin dashboard.

## Key Commands

### Backend (Django) - Port 8004 for local, 8003 for Docker
```bash
cd kapm-backend
python manage.py runserver 8004      # Start development server
python manage.py test                # Run tests
python manage.py makemigrations      # Create migrations
python manage.py migrate             # Apply migrations
python create_superuser.py           # Create admin user (admin/admin123)
```

### Frontend (Next.js) - Port 3004 for local, 3003 for Docker
```bash
cd kapm-frontend
npm run dev                          # Start development server
npm run build                        # Build for production
npm run start                        # Start production server
npm run lint                         # Run ESLint
```

### Docker Commands
```bash
make dev                             # Start development environment (hot reload)
make up                              # Start production environment
make down                            # Stop all containers
make logs                            # View all logs
make clean                           # Clean everything including volumes
```

## Architecture Overview

### Backend Structure
- **config/** - Django settings and main URLs configuration
- **authentication/** - JWT authentication with refresh tokens in HttpOnly cookies
  - Login endpoint: `POST /api/auth/login/`
  - Refresh endpoint: `POST /api/auth/refresh/`
  - User roles: admin, editor, author, viewer
- **cms/** - Core CMS functionality with separate public and admin endpoints
  - Public API: `/api/public/` (no auth required)
  - Admin API: `/api/admin/` (JWT required)
  - Models: BlogPost, Page, Category, Tag, Comment, MediaFile, UserProfile
- **core/** - Legacy API endpoints for backward compatibility
- **upadlosc/** - Bankruptcy law module
- **restrukturyzacja/** - Restructuring law module

### Frontend Structure (App Router)
- **app/[locale]/** - Internationalized routes (pl/en)
  - **(public)/** - Public pages with MainLayout
  - **(auth)/** - Authentication pages with AuthLayout
  - **admin/** - Admin dashboard (requires authentication)
- **lib/api/** - Custom API client with automatic token refresh
- **contexts/AuthContext.tsx** - Global authentication state management
- **components/** - Reusable UI components built with Radix UI + Tailwind

### Authentication Flow
1. User logs in via `/api/auth/login/` - receives access token (5 min) + refresh token (7 days)
2. Frontend stores tokens in HttpOnly cookies
3. API client automatically refreshes access token when expired
4. Protected routes check authentication via AuthContext

### API Documentation
- Swagger UI available at `http://localhost:8003/api/docs/` (or port 8004 for local)
- OpenAPI schema at `/api/schema/`

## Port Configuration

**Critical**: Backend and frontend ports must match between `.env` files:

- **Local Development**: Frontend 3004, Backend 8004
- **Docker Development**: Frontend 3003, Backend 8003

Update these files when switching environments:
- `kapm-frontend/.env.local` - Set `NEXT_PUBLIC_API_URL`
- `kapm-backend/.env` - Ensure correct port in runserver command

## Database

- **Development**: SQLite (default, set `USE_SQLITE=True`)
- **Docker/Production**: PostgreSQL (set `USE_SQLITE=False` and configure DB_* variables)
- **Redis**: Used for Celery task queue and caching

## Testing

### Backend Testing
```bash
cd kapm-backend
python manage.py test                        # Run all tests
python manage.py test cms.tests              # Run specific app tests
python manage.py test --keepdb               # Keep test database between runs
```

### Frontend Testing
Currently uses ESLint for code quality. Unit tests can be added with Jest/Vitest.

## Common Development Tasks

### Adding a New API Endpoint
1. Define the viewset in appropriate app's `views.py`
2. Add URL pattern to app's `urls.py`
3. Update permissions in viewset (use `IsAuthenticatedOrReadOnly` for public read)
4. Generate TypeScript types if needed

### Creating New CMS Content Type
1. Define model in `cms/models.py`
2. Create serializer in `cms/serializers.py`
3. Add viewsets for both public and admin access
4. Run migrations
5. Update frontend to consume new endpoints

### Modifying User Roles/Permissions
1. Update `UserProfile.ROLE_CHOICES` in `cms/models.py`
2. Modify `has_permission` methods in viewsets
3. Update frontend role checks in `AuthContext`

## Environment Variables

Critical variables that must be configured:
- `DJANGO_SECRET_KEY` - Production secret key
- `NEXT_PUBLIC_API_URL` - Backend URL for frontend
- `NEXT_PUBLIC_FRONTEND_URL` - Frontend URL for cookies
- `DATABASE_URL` - PostgreSQL connection string (Docker/production)

## Security Considerations

- JWT tokens expire after 5 minutes (access) and 7 days (refresh)
- CORS configured for specific frontend URLs only
- All admin endpoints require authentication
- Media files served through Django in development, should use CDN in production
- Never commit real `.env` files with secrets

## Deployment Notes

1. Set `DEBUG=False` in production
2. Configure proper `ALLOWED_HOSTS` in Django settings
3. Run `python manage.py collectstatic` for static files
4. Use Gunicorn/uWSGI for Django, PM2/Docker for Next.js
5. Set up HTTPS with reverse proxy (nginx recommended)
6. Configure PostgreSQL and Redis for production use