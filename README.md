# Kancelaria Adwokacka Przemysław Mogiełka (KAPM) 🏛️

## 📋 O projekcie

Kompleksowy system zarządzania treścią (CMS) oraz portal internetowy dla **Kancelarii Adwokackiej Przemysław Mogiełka**. System łączy profesjonalną stronę internetową z zaawansowanym panelem administracyjnym, umożliwiając efektywne zarządzanie treścią, blogiem prawniczym oraz komunikacją z klientami.

### 🎯 Główne cele biznesowe
- **Profesjonalna prezentacja kancelarii** - elegancka strona internetowa prezentująca usługi prawnicze
- **Blog prawniczy** - platforma do publikacji artykułów i analiz prawnych
- **System kontaktu** - sprawna komunikacja z potencjalnymi klientami
- **Panel administracyjny** - intuicyjne zarządzanie wszystkimi treściami
- **Wielojęzyczność** - obsługa klientów polskich i międzynarodowych

## 🚀 Kluczowe funkcjonalności

### 👥 Dla klientów kancelarii
- **Strona główna** z prezentacją kancelarii i aktualności
- **Specjalizacje prawne** - szczegółowy opis obszarów praktyki
- **Blog prawniczy** z kategoriami i wyszukiwarką
- **Zespół prawników** - profile i specjalizacje
- **Formularz kontaktowy** z walidacją i ochroną przed spamem
- **Wielojęzyczność** (polski/angielski)
- **Responsywny design** - idealna prezentacja na wszystkich urządzeniach

### ⚙️ Panel administracyjny
- **Role i uprawnienia** (Administrator, Redaktor, Autor, Czytelnik)
- **Zarządzanie treścią** - strony, wpisy blogowe, specjalizacje
- **Biblioteka mediów** - zarządzanie obrazami i dokumentami
- **Moderacja komentarzy** - kontrola nad dyskusją
- **Statystyki i raporty** - monitoring aktywności
- **API REST** z dokumentacją Swagger

### 🔐 Bezpieczeństwo
- **JWT Authentication** (access + refresh tokens)
- **HttpOnly Cookies** - bezpieczne przechowywanie tokenów
- **CORS Headers** - kontrola dostępu do API
- **Rate Limiting** - ochrona przed nadużyciami
- **Szyfrowanie haseł** - bcrypt
- **Walidacja danych** - Zod schemas

## 🛠️ Stack technologiczny

### Backend (Django)
| Technologia | Wersja | Zastosowanie |
|------------|--------|--------------|
| Django | 5.2.6 | Framework webowy |
| Django REST Framework | 3.15+ | API REST |
| PostgreSQL/SQLite | 15+ / 3 | Baza danych |
| Redis | 7+ | Cache i broker zadań |
| Celery | 5.3+ | Zadania asynchroniczne |
| Gunicorn | 23.0+ | Serwer WSGI |
| SimpleJWT | 5.3+ | Autoryzacja JWT |

### Frontend (Next.js)
| Technologia | Wersja | Zastosowanie |
|------------|--------|--------------|
| Next.js | 15.5.3 | Framework React |
| React | 19.1.1 | Biblioteka UI |
| TypeScript | 5.9.2 | Typowanie statyczne |
| Tailwind CSS | 3.4.17 | Stylowanie |
| Radix UI | Latest | Komponenty UI |
| Framer Motion | 12.23 | Animacje |
| React Hook Form | 7.62 | Obsługa formularzy |
| Axios | 1.12.2 | Klient HTTP |
| next-intl | 4.3.9 | Internacjonalizacja |

### DevOps
| Narzędzie | Zastosowanie |
|-----------|--------------|
| Docker & Docker Compose | Konteneryzacja |
| Nginx | Reverse proxy |
| GitHub Actions | CI/CD |
| Makefile | Automatyzacja zadań |

## 📁 Struktura projektu

```
KAPM-DJANGO/
├── 📂 kapm-backend/            # Backend Django
│   ├── authentication/         # System autoryzacji JWT
│   ├── cms/                   # Moduł zarządzania treścią
│   ├── core/                  # Wspólna funkcjonalność
│   ├── restrukturyzacja/      # Moduł restrukturyzacji
│   ├── upadlosc/              # Moduł upadłości
│   └── config/                # Konfiguracja Django
│
├── 📂 kapm-frontend/           # Frontend Next.js
│   ├── app/                   # App Router (Next.js 15)
│   │   ├── [locale]/          # Routing wielojęzyczny
│   │   ├── pl/               # Strony polskie
│   │   └── en/               # Strony angielskie
│   ├── components/            # Komponenty React
│   ├── contexts/             # Context API
│   ├── lib/                  # Biblioteki pomocnicze
│   └── public/               # Zasoby statyczne
│
├── 📂 navy-design-system/      # System projektowania
├── 📂 docker/                  # Konfiguracja Docker
├── docker-compose.yml          # Produkcja
├── docker-compose.dev.yml      # Development
└── Makefile                    # Skróty komend
```

## 🚀 Instalacja i uruchomienie

### Wymagania systemowe
- **Python** 3.11+
- **Node.js** 18 LTS lub nowszy
- **Docker** & Docker Compose (opcjonalne)
- **PostgreSQL** 15+ (produkcja)
- **Redis** 7+ (cache i Celery)

### 🐳 Opcja 1: Docker (zalecane)

#### Środowisko deweloperskie
```bash
# Sklonuj repozytorium
git clone https://github.com/pmogielka/KAPM-DJANGO-DOCKER.git
cd KAPM-DJANGO-DOCKER

# Skopiuj i skonfiguruj zmienne środowiskowe
cp .env.example .env
# Edytuj .env i ustaw DJANGO_SECRET_KEY

# Uruchom środowisko deweloperskie
make dev

# Aplikacja dostępna pod adresami:
# Frontend: http://localhost:3003
# Backend API: http://localhost:8003
# Django Admin: http://localhost:8003/admin
```

#### Środowisko produkcyjne
```bash
# Uruchom środowisko produkcyjne
make up

# Wykonaj migracje
make migrate

# Zbierz pliki statyczne
make collectstatic

# Stwórz superużytkownika
make createsuperuser
```

### 💻 Opcja 2: Lokalnie (bez Dockera)

#### Backend Django
```bash
cd kapm-backend

# Stwórz i aktywuj środowisko wirtualne
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Zainstaluj zależności
pip install -r requirements.txt

# Wykonaj migracje
python manage.py migrate

# Stwórz superużytkownika
python create_superuser.py  # Tworzy: admin/admin123

# Uruchom serwer deweloperski
python manage.py runserver 8004
```

#### Frontend Next.js
```bash
cd kapm-frontend

# Zainstaluj zależności
npm install

# Skonfiguruj zmienne środowiskowe
cp .env.example .env.local
# Edytuj .env.local - ustaw NEXT_PUBLIC_API_URL=http://localhost:8004

# Uruchom serwer deweloperski
npm run dev

# Aplikacja dostępna: http://localhost:3004
```

## 🔧 Konfiguracja

### Zmienne środowiskowe

#### Backend (.env w kapm-backend/)
```env
# Django
DEBUG=True
SECRET_KEY=your-secret-key-here
ALLOWED_HOSTS=localhost,127.0.0.1

# Baza danych
USE_SQLITE=True  # False dla PostgreSQL
DATABASE_URL=postgresql://user:pass@localhost:5432/kapm_db

# Redis & Celery
REDIS_URL=redis://localhost:6379/0

# CORS
FRONTEND_URL=http://localhost:3004
```

#### Frontend (.env.local w kapm-frontend/)
```env
# API
NEXT_PUBLIC_API_URL=http://localhost:8004
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3004

# JWT
NEXT_PUBLIC_JWT_ACCESS_LIFETIME=5
NEXT_PUBLIC_JWT_REFRESH_LIFETIME=1440
```

## 📝 Użytkowanie

### Logowanie do panelu
1. Przejdź do `/pl/login` (frontend) lub `/admin` (Django admin)
2. Użyj domyślnych danych: `admin` / `admin123`
3. **⚠️ Zmień hasło przed wdrożeniem produkcyjnym!**

### Role użytkowników
- **Administrator** - pełny dostęp do systemu
- **Redaktor** - zarządzanie treścią i moderacja
- **Autor** - tworzenie i edycja własnych treści
- **Czytelnik** - tylko podgląd treści

## 🧪 Testowanie

```bash
# Backend - testy Django
cd kapm-backend
python manage.py test

# Frontend - linting
cd kapm-frontend
npm run lint

# Frontend - build produkcyjny
npm run build
```

## 📚 Dokumentacja API

Po uruchomieniu backendu dostępna pod adresem:
- **Swagger UI**: http://localhost:8004/api/docs/
- **ReDoc**: http://localhost:8004/api/redoc/
- **Schema OpenAPI**: http://localhost:8004/api/schema/

## 🛡️ Bezpieczeństwo

### Przed wdrożeniem produkcyjnym
- [ ] Zmień domyślne hasła
- [ ] Ustaw własny `DJANGO_SECRET_KEY`
- [ ] Wyłącz `DEBUG=False`
- [ ] Skonfiguruj HTTPS (certyfikat SSL)
- [ ] Ustaw właściwe `ALLOWED_HOSTS`
- [ ] Skonfiguruj firewall
- [ ] Włącz monitoring i logi
- [ ] Wykonaj audit bezpieczeństwa

## 🚀 Deployment

### Rekomendowane środowisko produkcyjne
- **VPS/Cloud**: AWS EC2, DigitalOcean, Linode
- **Reverse Proxy**: Nginx z SSL (Let's Encrypt)
- **Baza danych**: PostgreSQL 15+ (managed)
- **Cache**: Redis (managed)
- **Storage**: S3 lub lokalny z backupem
- **Monitoring**: Sentry, New Relic
- **CI/CD**: GitHub Actions

### Komendy produkcyjne
```bash
# Build obrazów Docker
make build

# Deploy z migracjami
make deploy

# Backup bazy danych
make backup

# Monitorowanie logów
make logs
```

## 🤝 Współpraca

### Konwencje kodu
- **Python**: PEP 8, Black formatter
- **JavaScript/TypeScript**: ESLint + Prettier
- **Commits**: Conventional Commits
- **Branching**: Git Flow

### Struktura branchy
- `main` - kod produkcyjny
- `develop` - integracja zmian
- `feature/*` - nowe funkcjonalności
- `hotfix/*` - pilne poprawki

## 📞 Kontakt i wsparcie

**Kancelaria Adwokacka Przemysław Mogiełka**
- 🌐 Website: [w budowie]
- 📧 Email: kontakt@kapm.pl
- 📱 Telefon: +48 XXX XXX XXX

### Wsparcie techniczne
- **Issues**: [GitHub Issues](https://github.com/pmogielka/KAPM-DJANGO-DOCKER/issues)
- **Email**: dev@kapm.pl

## 📄 Licencja

© 2024 Kancelaria Adwokacka Przemysław Mogiełka. Wszystkie prawa zastrzeżone.

Ten projekt jest własnością prywatną i nie może być używany, kopiowany ani modyfikowany bez pisemnej zgody właściciela.

---

**Developed with ❤️ for legal excellence**