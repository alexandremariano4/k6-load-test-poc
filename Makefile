.PHONY: help docker-up docker-down api web install test test-verbose clean

help:
	@echo ===============================
	@echo   K6 Tests - Makefile Commands   
	@echo ===============================
	@echo [SETUP]
	@echo   make install           - Instala dependencias (web e api)
	@echo   make docker-up         - Inicia o Docker (banco de dados)
	@echo   make docker-down       - Para o Docker"
	@echo ==================================================================
	@echo [DESENVOLVIMENTO]
	@echo   make api               - Inicia o servidor da API
	@echo   make web               - Inicia o servidor web
	@echo ==================================================================
	@echo [TESTES K6]
	@echo   make test-accounts              - Executa testes K6 do endpoint accounts
	@echo   make test-verbose      		    - Executa testes K6 do endpoint accounts com verbose

# ============================================================================
# SETUP
# ============================================================================

install:
	@echo "Instalando dependencias..."
	cd apps/smartbit/web && npm i
	cd ../api && npm i
	@echo "Dependencias instaladas com sucesso!"

docker-up:
	@echo "Iniciando Docker (Banco de Dados)..."
	cd apps/smartbit/docker && docker compose up -d
	@echo "Docker iniciado! Banco de dados em localhost:5432"

docker-down:
	@echo "Parando Docker..."
	cd apps/smartbit/docker && docker compose down
	@echo "Docker parado!"

# ============================================================================
# DESENVOLVIMENTO
# ============================================================================

api:
	@echo "Iniciando API (http://localhost:3333)..."
	cd apps/smartbit/api && npm run dev

web:
	@echo "Iniciando Web (http://localhost:3000)..."
	cd apps/smartbit/web && npm run dev

# ============================================================================
# TESTES K6
# ============================================================================

test-accounts:
	@echo "Executando testes K6 do endpoint accounts..."
	k6 run .\tests\accounts.js

test-accounts-verbose:
	@echo "Executando testes K6 do endpoint accounts com verbose..."
	k6 run .\tests\accounts.js --verbose