# Konfiguracja Portów KAPM

## 🚀 Porty Aplikacji

### Frontend (Next.js)
- **Port**: `3003`
- **URL**: http://localhost:3003
- **Konfiguracja**: package.json

### Backend (Django) - planowany
- **Port**: `8003`
- **URL**: http://localhost:8003
- **API**: http://localhost:8003/api

## 📝 Uwagi

- Frontend jest skonfigurowany w `package.json` do działania na porcie 3003
- Backend Django będzie skonfigurowany na porcie 8003
- Zmienne środowiskowe są w pliku `.env.local`
- API calls z frontendu będą kierowane na `http://localhost:8003/api`

## 🔧 Uruchamianie

### Frontend
```bash
npm run dev
# Uruchomi się na http://localhost:3003
```

### Backend (gdy będzie gotowy)
```bash
python manage.py runserver 8003
# Uruchomi się na http://localhost:8003
```

## 🐳 Docker (planowane)
Gdy będziemy używać Docker, porty będą zmapowane:
- Frontend container: 3003:3003
- Backend container: 8003:8003