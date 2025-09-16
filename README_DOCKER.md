# 🐳 Docker Configuration dla KAPM

## 📍 WAŻNE: Konfiguracja Portów

### **Frontend ZAWSZE na porcie 3003**
### **Backend ZAWSZE na porcie 8003**

## 🚀 Szybki Start

### 1. Uruchomienie w trybie produkcyjnym:
```bash
docker-compose up -d
```

### 2. Uruchomienie w trybie deweloperskim:
```bash
docker-compose -f docker-compose.dev.yml up -d
```

### 3. Używając Makefile:
```bash
make dev   # Tryb deweloperski
make up    # Tryb produkcyjny
```

## 🔗 Adresy URL

- **Frontend**: http://localhost:3003
- **Backend API**: http://localhost:8003
- **Django Admin**: http://localhost:8003/admin

## 📦 Struktura Kontenerów

### Tryb Produkcyjny (`docker-compose.yml`):
1. **frontend** - Next.js (port 3003)
2. **backend** - Django z Gunicorn (port 8003)
3. **postgres** - PostgreSQL (wewnętrzny)
4. **redis** - Redis cache (wewnętrzny)

### Tryb Deweloperski (`docker-compose.dev.yml`):
1. **frontend-dev** - Next.js dev server (port 3003)
2. **backend-dev** - Django dev server (port 8003)
3. **postgres-dev** - PostgreSQL (port 5433)
4. **redis-dev** - Redis (port 6380)

## 🛠️ Komendy

### Podstawowe:
```bash
# Zbuduj kontenery
docker-compose build

# Uruchom
docker-compose up -d

# Zatrzymaj
docker-compose down

# Logi
docker-compose logs -f

# Restart
docker-compose restart
```

### Z Makefile:
```bash
make build    # Zbuduj kontenery
make up       # Uruchom produkcję
make dev      # Uruchom development
make down     # Zatrzymaj
make logs     # Pokaż logi
make frontend # Logi frontendu
make backend  # Logi backendu
make clean    # Wyczyść wszystko
make ports    # Sprawdź porty
```

## 🔧 Konfiguracja

### Zmienne środowiskowe:
Skopiuj `.env.example` do `.env` i uzupełnij:
```bash
cp .env.example .env
```

### Ważne zmienne:
- `FRONTEND_PORT=3003` - Port frontendu (NIE ZMIENIAĆ)
- `BACKEND_PORT=8003` - Port backendu (NIE ZMIENIAĆ)
- `DJANGO_SECRET_KEY` - Klucz bezpieczeństwa Django

## 📝 Uwagi

1. **Porty są STAŁE**:
   - Frontend ZAWSZE działa na 3003
   - Backend ZAWSZE działa na 8003

2. **Sieć Docker**:
   - Kontenery komunikują się przez wewnętrzną sieć `kapm-network`
   - Frontend łączy się z backendem przez `http://backend:8003`

3. **Volumes**:
   - PostgreSQL dane są persystowane w `postgres_data`
   - Media i static files Django w `media_volume` i `static_volume`

4. **Development**:
   - Kod jest montowany jako volume dla hot-reload
   - Zmiany w kodzie są widoczne od razu

## 🚨 Rozwiązywanie Problemów

### Port zajęty:
```bash
# Sprawdź co używa portu 3003
lsof -i :3003

# Sprawdź co używa portu 8003
lsof -i :8003

# Zabij proces
kill -9 <PID>
```

### Reset wszystkiego:
```bash
make clean
make build
make dev
```

## 📚 Dodatkowe Informacje

- Frontend (Next.js) konfiguracja w: `kapm-frontend/package.json`
- Backend (Django) konfiguracja w: `kapm-backend/config/settings.py`
- Docker networks: `kapm-network` (prod), `kapm-network-dev` (dev)

---

**PAMIĘTAJ**: Aplikacja ZAWSZE działa na portach 3003 (frontend) i 8003 (backend)!