# KAPM - Kancelaria Adwokacka Prawników i Mediatorów

Monorepo zawierające kompletny system CMS dla kancelarii prawnej. Repozytorium łączy backend Django (API + panel administracyjny) oraz frontend Next.js (strona publiczna i SPA dla panelu).

## Najważniejsze funkcje
- Kompletny panel administracyjny z rolami (admin, editor, author, viewer) i statystykami
- Publiczny serwis prezentujący kancelarię (strony CMS, blog, zespół, specjalizacje, kontakt)
- JWT (access + refresh) z przechowywaniem ciasteczek HttpOnly po stronie frontendu
- Biblioteka mediów z obsługą uploadu i metadanych, moderowane komentarze i bogaty moduł blogowy
- Wielojęzyczność (pl/en) po stronie frontendu, przygotowane tłumaczenia po stronie backendu
- Przygotowanie do środowiska produkcyjnego: Docker Compose, PostgreSQL, Redis, Gunicorn, Makefile

## Stos technologiczny
### Backend
- Django 5.2.6, Django REST Framework, django-filter, drf-spectacular (Swagger/OpenAPI)
- djangorestframework-simplejwt (JWT), django-cors-headers, django-extensions
- Celery + Redis (broker/result backend), Pillow, Whitenoise
- Baza SQLite dla dev lokalnego lub PostgreSQL (docker/produkcja)

### Frontend
- Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS 3
- Radix UI, Framer Motion, React Hook Form, Zod, next-intl
- Własny klient API bazujący na Axiosie z odświeżaniem tokenów i obsługą cookies

### DevOps i narzędzia
- Dockerfile/Docker Compose (produkcyjny i deweloperski), Makefile
- Skonfigurowane środowiska `.env` (root, backend, frontend)
- Linting (ESLint), testy Django (`manage.py test`)

## Struktura repozytorium
```
KAPM-DJANGO/
├── kapm-backend/       # Projekt Django (config, CMS, auth, moduły upadłości i restrukturyzacji)
├── kapm-frontend/      # Projekt Next.js (App Router, komponenty, konteksty, i18n)
├── docker-compose.yml  # Zestaw usług produkcyjnych (frontend, backend, postgres, redis)
├── docker-compose.dev.yml
├── Makefile            # Skróty do komend dockerowych
├── navy-design-system/ # Biblioteka design systemu (Tailwind + Vite)
├── PROJEKT - KAPM ...  # Materiały analityczne i makiety
└── README_DOCKER.md    # Szczegóły konfiguracji dockerowej
```

## Wymagania wstępne (praca lokalna bez Dockera)
- Python 3.11+
- Node.js 18 LTS (lub nowszy kompatybilny z Next 15)
- npm 9+ lub inny menedżer paczek (npm używany w repo)
- opcjonalnie: PostgreSQL 15+, Redis 7+ jeśli chcesz odwzorować środowisko produkcyjne

## Szybki start
### Opcja 1: Docker Compose (rekomendowana)
1. Skopiuj plik `.env.example` do `.env` i uzupełnij `DJANGO_SECRET_KEY` oraz ewentualnie inne sekrety.
2. Uruchom środowisko developerskie (hot reload, mapowanie kodu):
   ```bash
   make dev       # alias dla docker-compose -f docker-compose.dev.yml up -d
   ```
3. Alternatywnie środowisko produkcyjne w Dockerze:
   ```bash
   make up        # alias dla docker-compose up -d
   ```
4. Adresy usług (dev/prod w Dockerze): frontend `http://localhost:3003`, backend `http://localhost:8003`, panel admina `http://localhost:8003/admin`.
5. Do zatrzymania/wyczyszczenia środowiska użyj `make down` lub `make clean`.

### Opcja 2: Lokalnie (bez Dockera)
#### Backend (Django)
```bash
cd kapm-backend
python -m venv venv
source venv/bin/activate            # Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python create_superuser.py          # domyślnie admin / admin123
python manage.py runserver 8004     # dopasuj port do frontendu (domyślnie 8004 w .env.local)
```
- Konfiguracja zmiennych znajduje się w `kapm-backend/.env`. Domyślnie `USE_SQLITE=True`; ustaw zmienne DB_* aby przełączyć się na PostgreSQL.
- Skrypty Celery nie są uruchamiane automatycznie; konfiguracja brokera `REDIS_URL` znajduje się w `.env`.

#### Frontend (Next.js)
```bash
cd kapm-frontend
npm install
npm run dev                       # domyślnie http://localhost:3004
```
- Skonfiguruj zmienne w `kapm-frontend/.env.local`; najważniejsze to `NEXT_PUBLIC_API_URL` (8004 dla lokalnego, 8003 dla Dockera) i `NEXT_PUBLIC_FRONTEND_URL`.
- Produkcyjne buildy: `npm run build` oraz `npm run start -p 3004` (możesz zmienić port przez zmienną `PORT`).

#### Logowanie testowe
- Panel admina Django: `admin` / `admin123` (utworzone przez `create_superuser.py`).
- Użytkownik frontendowy: logowanie na stronie `/pl/login` z tymi samymi danymi.
- Zmień hasła przed wdrożeniem produkcyjnym.

## Zmienne środowiskowe
| Lokalizacja | Klucz | Opis |
|------------|-------|------|
| `.env` | `DJANGO_SECRET_KEY` | Sekretny klucz produkcyjny dla Django/Gunicorn |
| `.env` | `DATABASE_URL` | Łącze do bazy PostgreSQL (używane przez docker-compose) |
| `.env` | `FRONTEND_PORT`/`BACKEND_PORT` | Porty mapowane przez Compose (3003/8003) |
| `kapm-backend/.env` | `DEBUG`, `USE_SQLITE`, `DB_*` | Konfiguracja środowiska backendu |
| `kapm-backend/.env` | `REDIS_URL`, `FRONTEND_URL` | Integracja z Redisem i CORS |
| `kapm-frontend/.env.local` | `NEXT_PUBLIC_API_URL` | Bazowy URL API używany przez frontend |
| `kapm-frontend/.env.local` | `NEXT_PUBLIC_FRONTEND_URL` | Publiczny URL frontendu (potrzebny do cookies) |

> Wskazówka: przy przełączaniu między Dockerem (3003/8003) a lokalnym developmentem (3004/8004) zaktualizuj `NEXT_PUBLIC_API_URL` i porty serwerów.

## Testy i jakość
- Backend: `cd kapm-backend && python manage.py test`
- Frontend: `cd kapm-frontend && npm run lint`
- W backendzie dostępna jest dokumentacja API w Swaggerze: `http://localhost:8003/api/docs/` (lub `8004`, zależnie od portu).

## Ważne komendy
- `python create_superuser.py` – tworzy konto admin/admin123 oraz ustawia podstawowe role.
- `make logs`, `make frontend`, `make backend` – szybki podgląd logów kontenerów.
- `docker-compose down -v` – pełne zatrzymanie i usunięcie wolumenów (wyczyści media oraz bazę w kontenerach).

## Wdrożenie produkcyjne
1. Ustaw `DEBUG=False` oraz własny `SECRET_KEY` (najlepiej z zmiennych środowiskowych).
2. Skonfiguruj PostgreSQL i Redis; zaktualizuj `DATABASE_URL` i `REDIS_URL`.
3. Uruchom migracje (`python manage.py migrate`) oraz statyczne pliki (`python manage.py collectstatic`).
4. Uruchom backend przez Gunicorna lub inny serwer WSGI (Dockerfile produkcyjny już wykorzystuje Gunicorna).
5. Za front odpowiada build Next.js (`npm run build` + `npm run start` lub hosting statyczny po `next export`).
6. Skonfiguruj HTTPS (np. za reverse proxy nginx) i domeny w `ALLOWED_HOSTS`.

## Dalsze materiały
- `README_DOCKER.md` – szczegółowe instrukcje dockera, portów i makefile.
- `kapm-frontend/PORTS_CONFIG.md` – dodatkowe uwagi o portach front/back.
- Folder `PROJEKT - KAPM - DJANGO` – materiały projektowe (makiety, opisy funkcjonalne).

Jeśli coś budzi wątpliwości lub porty różnią się od zakładanych w Twoim środowisku, sprawdź aktualne wartości w plikach `.env` i dopasuj konfigurację frontendu i backendu.
