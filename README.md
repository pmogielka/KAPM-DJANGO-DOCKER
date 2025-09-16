# KAPM - Kancelaria Adwokacka Prawników i Mediatorów

System CMS dla kancelarii prawnej z panelem administracyjnym.

## 🚀 Technologie

### Backend
- Django 5.2.6
- Django REST Framework
- JWT Authentication (djangorestframework-simplejwt)
- CORS Headers
- PostgreSQL ready

### Frontend
- Next.js 15.5
- TypeScript
- Tailwind CSS v3
- Radix UI components
- JWT authentication z cookies
- Internationalization (PL/EN)

## 📦 Struktura projektu

```
KAPM-DJANGO/
├── kapm-backend/          # Django backend
│   ├── config/           # Konfiguracja Django
│   ├── cms/             # Aplikacja CMS
│   ├── authentication/   # JWT auth
│   ├── core/            # Modele podstawowe
│   ├── upadlosc/        # Moduł upadłości
│   └── restrukturyzacja/ # Moduł restrukturyzacji
├── kapm-frontend/         # Next.js frontend
│   ├── app/             # Next.js 13+ App Router
│   ├── components/      # Komponenty React
│   ├── contexts/        # React Context (Auth)
│   └── lib/            # Biblioteki (API client)
└── docker-compose.yml    # Docker configuration
```

## 🛠️ Instalacja

### Backend

```bash
cd kapm-backend
python -m venv venv
source venv/bin/activate  # na Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python create_superuser.py  # Tworzy admin/admin123
python manage.py runserver 8004
```

### Frontend

```bash
cd kapm-frontend
npm install
npm run dev  # Uruchamia na porcie 3004
```

## 🔑 Logowanie

- **URL**: http://localhost:3004/pl/login
- **Login**: admin
- **Hasło**: admin123

## 🎨 Design System

System wykorzystuje kolory Infino Legal:
- Navy: `#1e3a5f`
- Brand: `#445fe6`
- Border radius: `3px`

## 📱 Funkcjonalności

### Panel publiczny
- Strona główna
- Aktualności
- Specjalizacje
- Zespół
- Kontakt

### Panel administracyjny (wymaga logowania)
- Dashboard ze statystykami
- Zarządzanie blogiem
- Zarządzanie stronami
- Kategorie i tagi
- Biblioteka mediów
- Komentarze
- Użytkownicy

## 🐳 Docker

```bash
# Development
docker-compose -f docker-compose.dev.yml up

# Production
docker-compose up -d
```

## 📝 API Endpoints

### Publiczne
- `GET /api/public/blog/` - Lista postów
- `GET /api/public/pages/` - Lista stron
- `GET /api/public/categories/` - Kategorie
- `GET /api/public/tags/` - Tagi

### Chronione (wymagają JWT)
- `POST /api/auth/login/` - Logowanie
- `POST /api/auth/logout/` - Wylogowanie
- `GET /api/admin/dashboard/stats/` - Statystyki
- CRUD endpoints dla wszystkich modeli

## 🔒 Bezpieczeństwo

- JWT tokens (15 min access, 7 dni refresh)
- CORS skonfigurowany dla localhost:3004
- HttpOnly cookies dla refresh token
- Role-based access control (admin, editor, author, viewer)

## 📦 Deployment

1. Zmień `DEBUG = False` w `settings.py`
2. Ustaw `SECRET_KEY` w zmiennych środowiskowych
3. Skonfiguruj PostgreSQL
4. Uruchom `python manage.py collectstatic`
5. Użyj Gunicorn/uWSGI dla produkcji

## 🤝 Autor

Utworzono z pomocą Claude Code

---

## 🚀 Jak dodać do GitHub

```bash
# Jeśli nie masz jeszcze repozytorium na GitHub, utwórz je najpierw
# Następnie:

git remote add origin https://github.com/TWOJ_USER/KAPM-DJANGO.git
git branch -M main
git push -u origin main
```