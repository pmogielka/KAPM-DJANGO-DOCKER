# Makefile dla łatwego zarządzania Docker
# Frontend: 3003, Backend: 8003

.PHONY: help
help:
	@echo "Dostępne komendy:"
	@echo "  make build       - Zbuduj wszystkie kontenery"
	@echo "  make up          - Uruchom aplikację (produkcja)"
	@echo "  make dev         - Uruchom w trybie deweloperskim"
	@echo "  make down        - Zatrzymaj kontenery"
	@echo "  make logs        - Pokaż logi"
	@echo "  make frontend    - Logi frontendu (port 3003)"
	@echo "  make backend     - Logi backendu (port 8003)"
	@echo "  make clean       - Wyczyść wszystko"
	@echo "  make ports       - Sprawdź używane porty"

# Build containers
.PHONY: build
build:
	docker-compose build

# Run production
.PHONY: up
up:
	docker-compose up -d
	@echo "✅ Aplikacja uruchomiona!"
	@echo "📍 Frontend: http://localhost:3003"
	@echo "📍 Backend:  http://localhost:8003"

# Run development
.PHONY: dev
dev:
	docker-compose -f docker-compose.dev.yml up -d
	@echo "✅ Środowisko deweloperskie uruchomione!"
	@echo "📍 Frontend (dev): http://localhost:3003"
	@echo "📍 Backend (dev):  http://localhost:8003"

# Stop containers
.PHONY: down
down:
	docker-compose down
	docker-compose -f docker-compose.dev.yml down

# Show logs
.PHONY: logs
logs:
	docker-compose logs -f

# Frontend logs (port 3003)
.PHONY: frontend
frontend:
	docker-compose logs -f frontend

# Backend logs (port 8003)
.PHONY: backend
backend:
	docker-compose logs -f backend

# Clean everything
.PHONY: clean
clean:
	docker-compose down -v
	docker-compose -f docker-compose.dev.yml down -v
	docker system prune -f

# Check ports
.PHONY: ports
ports:
	@echo "Sprawdzanie portów..."
	@echo "Port 3003 (Frontend):"
	@lsof -i :3003 || echo "  ✓ Port 3003 wolny"
	@echo "\nPort 8003 (Backend):"
	@lsof -i :8003 || echo "  ✓ Port 8003 wolny"

# Restart services
.PHONY: restart
restart:
	docker-compose restart
	@echo "✅ Usługi zrestartowane"
	@echo "📍 Frontend: http://localhost:3003"
	@echo "📍 Backend:  http://localhost:8003"