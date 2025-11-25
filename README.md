# POC K6 - Teste de Carga no app SmartBit

Projeto de testes de carga usando **K6** para a API SmartBit. Este projeto demonstra como executar testes de performance, validar endpoints HTTP e interagir com banco de dados PostgreSQL.

**Status**: ✅ Projeto finalizado e otimizado

## 📋 Pré-requisitos

- **K6** (v1.4.2 ou superior)
- **Node.js** (v14 ou superior)
- **PostgreSQL** (v12 ou superior)
- **Docker** (opcional, para executar o banco via containers)
- **Make** (opcional, para usar os Makefiles)

## 📦 Instalando K6

### Windows (via Chocolatey)

Se você já tem o **Chocolatey** instalado:

```bash
choco install k6
```

Se não tem o Chocolatey, instale primeiro:
```bash
# Execute o PowerShell como Administrador e rode:
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
```

Depois instale o K6:
```bash
choco install k6
```

### Verificar instalação
```bash
k6 --version
```

Deve retornar algo como: `k6 v1.4.2 (windows/amd64)`

## 🛠️ Instalando Make (Opcional)

Make é usado para automatizar os comandos (docker, api, web, testes).

### Windows (via Chocolatey)

```bash
choco install make
```

### Verificar instalação
```bash
make --version
```

Deve retornar algo como: `GNU Make 4.3`

### Alternativa: Sem Make

Se preferir não instalar, você pode rodar os comandos manualmente:

```bash
# Em vez de: make docker-up
cd apps/smartbit/docker && docker compose up -d

# Em vez de: make api
cd apps/smartbit/api && npm run dev

# Em vez de: make test-accounts
$env:K6_ENABLE_COMMUNITY_EXTENSIONS = "true"; k6 run .\tests\accounts.js
```

## 🚀 Instalação

### 1. Clonar o projeto
```bash
git clone <seu-repositorio>
cd poc-k6
```

### 2. Instalar dependências
```bash
npm i
```

### 3. Configurar banco de dados

#### Execute o Docker
```bash
make docker-up
# Ou manualmente:
cd apps/smartbit/docker && docker compose up -d
```

#### Execute a carga inicial do banco
```bash
cd apps/smartbit/api
./setup.sh  # Execute em um terminal bash/WSL
```

### 4. Iniciar a aplicação

**Terminal 1 - API:**
```bash
make api
# Ou: cd apps/smartbit/api && npm run dev
```

**Terminal 2 - Web:**
```bash
make web
# Ou: cd apps/smartbit/web && npm run dev
```

## 📊 Executando os Testes K6

### Opção 1: Usando Make (Recomendado)

Se você instalou Make, use os comandos simplificados:

```bash
# Ver todos os comandos disponíveis
make help

# Instalar dependências
make install

# Iniciar Docker
make docker-up

# Executar API
make api

# Executar Web
make web

# Executar testes de contas
make test-accounts

# Executar testes com verbose
make test-accounts-verbose

# Executar todos os testes
make test
```

### Opção 2: Sem Make (Comandos Manuais)

Se não instalou Make, execute manualmente:

```bash
# Definir variável de ambiente para plugins
$env:K6_ENABLE_COMMUNITY_EXTENSIONS = "true"

# Teste de contas
k6 run .\tests\accounts.js

# Teste com modo verbose
k6 run .\tests\accounts.js --verbose

# Teste CI
k6 run .\tests\testCi.js

# Teste de ping
k6 run .\tests\pingServer.js
```

### Opção 3: Pela Pipeline GitHub Actions

1. Vá para **Actions** no seu repositório GitHub
2. Selecione **Pipeline de execução K6**
3. Clique em **Run workflow**
4. Configure as variáveis (opcional):
   - **test_file**: Escolha qual teste executar
   - **vus_1/2/3**: Número de usuários virtuais por stage
   - **duration_1/2/3**: Duração de cada stage
5. Clique em **Run workflow**
6. Os relatórios serão salvos como artifacts

## 📁 Estrutura do Projeto

```
poc-k6/
├── tests/
│   ├── accounts.js                          # Teste principal (carga + pico)
│   ├── testCi.js                            # Teste CI (k6.io)
│   ├── pingServer.js                        # Teste de ping da API
│   ├── scripts/
│   │   └── script-accounts.js               # Lógica de requisições de contas
│   ├── helpers/
│   │   ├── cpfGenerator.js                  # Gerador de CPF válido
│   │   ├── userGenerator.js                 # Gerador de usuários fictícios
│   │   └── randomString.js                  # Utilitários de strings aleatórias
│   ├── database/
│   │   └── dbConnection.js                  # Módulo de conexão com PostgreSQL
│   ├── options/
│   │   └── options.js                       # Configuração de stages e thresholds
│   ├── configuration/
│   │   └── generalConfig.js                 # Configuração geral (setup, teardown, handleSummary)
│   └── report/
│       ├── htmlReport.js                    # Gerador de relatório HTML
│       └── textSummary.js                   # Resumo em texto
├── .github/
│   └── workflows/
│       └── pipeline.yml                     # GitHub Actions CI/CD
├── apps/smartbit/
│   ├── api/                                 # API Node.js
│   ├── web/                                 # Frontend
│   └── docker/                              # Configuração Docker
├── Makefile                                 # Automação de comandos
├── k6EnableCommunity.bat                    # Script para habilitar extensões
└── README.md
```

## 🔧 Módulos e Responsabilidades

### **1. Testes Principais**

#### `accounts.js`
- **Tipo**: Teste de Pico (Spike Testing)
- **O que faz**: 
  - Stage 1: 30s crescendo até 100 VUs
  - Stage 2: 50s crescendo até 150 VUs (pico)
  - Stage 3: 30s reduzindo para 100 VUs
  - Cria novo usuário com dados aleatórios
  - Matricula o usuário em um plano
  - Valida todas as respostas
- **Extensões usadas**: Faker, SQL
- **Saída**: `logs/test-accounts.html`

#### `testCi.js`
- **Tipo**: Teste de Disponibilidade
- **O que faz**: Faz requisição GET em https://k6.io/
- **Uso**: Validar conectividade (usado na pipeline CI/CD)
- **Saída**: `logs/test-ci.html`

#### `pingServer.js`
- **Tipo**: Teste de Health Check
- **O que faz**: Verifica disponibilidade da API local
- **Endpoint**: GET http://localhost:3000/
- **Saída**: `logs/test-ping.html`

### **2. Scripts**

#### `scripts/script-accounts.js`
- **Responsabilidade**: Encapsular lógica de requisições
- **Funções**:
  - `createNewUser()`: POST /accounts
  - `enrollUser(data)`: POST /memberships
- **Retorno**: Objeto response do K6

### **3. Helpers**

#### `helpers/cpfGenerator.js`
- **Função**: `generateValidCPF()`
- **Retorno**: String com 11 dígitos válidos
- **Algoritmo**: Calcula dígitos verificadores módulo 11

#### `helpers/userGenerator.js`
- **Função**: `userGenerator()`
- **Retorno**: Objeto com:
  - `name`: Nome fictício (Faker)
  - `email`: Email único (Nome + UUID + @hotmail.com)
  - `cpf`: CPF válido gerado
- **Uso**: Dados realistas para testes

#### `helpers/randomString.js`
- **Funções**: `randomIntBetween()`, `randomString()`
- **Uso**: Gerar valores aleatórios

### **4. Banco de Dados**

#### `database/dbConnection.js`
- **Conexão**: PostgreSQL via xk6-sql
- **Credenciais**: admin:123@localhost:5432/smartbit
- **Funções disponíveis**:
  - `queryUsers()` - SELECT de todos os usuários
  - `getUserById(userId)` - SELECT por ID
  - `insertUser()` - INSERT novo usuário
  - `updateUser()` - UPDATE usuário
  - `deleteUser()` - DELETE por email
  - `deleteExcedentUsers()` - Limpa usuários de teste
  - `closeConnection()` - Fecha conexão

### **5. Configuração**

#### `options/options.js`
- **accountOptions()**: Retorna configuração de carga
- **Stages**:
  - Stage 1: 30s → 30 VUs
  - Stage 2: 60s → 50 VUs  
  - Stage 3: 90s → 100 VUs
- **Thresholds**:
  - `http_req_duration`: p(95)<200ms, p(99)<400ms, avg<150ms
  - `http_req_failed`: rate<0.01 (< 1%)
  - `http_reqs`: rate>30 (> 30 req/s)
- **Suporta variáveis de ambiente**: K6_VUS_1, K6_DURATION_1, etc.

#### `configuration/generalConfig.js`
- **setup()**: Função executada antes dos testes
- **teardown()**: Função executada após os testes
  - Deleta usuários criados
  - Fecha conexão com DB
- **defaultHandleSummary()**: Factory function para gerar relatórios
- **Uso**: Centralizar lógica de ciclo de vida

### **6. Relatórios**

#### `report/htmlReport.js`
- **Responsabilidade**: Gera relatório visual em HTML
- **Saída**: Arquivos HTML em `logs/`
- **Conteúdo**: Gráficos, métricas, testes passados/falhados

#### `report/textSummary.js`
- **Responsabilidade**: Gera sumário colorido no console
- **Saída**: Stdout formatado
- **Conteúdo**: Resumo de métricas e status dos testes

## 📊 Métricas e Thresholds

### VUs (Virtual Users)
- **O que é**: Usuários virtuais que executam o script em paralelo
- **Seu teste**: Começa com 30, vai até 150 (pico), volta para 100

### RPS (Requisições por Segundo)
- **Cálculo**: VUs × (Requisições por iteração / Tempo iteração)
- **Seu teste**: ~83-125 RPS dependendo do stage

### http_reqs
- **O que é**: Métrica que conta total de requisições HTTP
- **Seu threshold**: > 30 req/s
- **Saída**: `http_reqs..................: 10500  87.5/s`

### Thresholds
São critérios que definem se o teste **PASSA** ou **FALHA**:
```javascript
thresholds: {
    http_req_duration: ['p(95)<200'],    // 95% < 200ms = PASS
    http_req_failed: ['rate<0.01'],      // < 1% erro = PASS
    http_reqs: ['rate>30']               // > 30 req/s = PASS
}
```

## 📈 Interpretando Resultados

### Exemplo de Saída:
```
✓ status is 201
✓ body contains the correct name
✓ body contains the correct email

data_received........: 50 kB 10 kB/s
data_sent............: 25 kB 5 kB/s
http_req_duration....: avg=150ms p(95)=180ms p(99)=200ms
http_req_failed......: 0.5% ✓
http_reqs............: 10500 87.5/s ✓
iterations...........: 5250 ✓
```

**Status dos testes:**
- ✅ Todas as checks passaram
- ✅ Todos os thresholds foram respeitados
- ✅ Teste considerado bem-sucedido

## 🔄 Pipeline CI/CD

### GitHub Actions (`.github/workflows/pipeline.yml`)

**Triggers:**
- `workflow_dispatch`: Execução manual com variáveis customizáveis
- `push` para `master`: Execução automática

**Inputs disponíveis (execução manual):**
- `test_file`: Escolher teste (testCi.js, accounts.js, pingServer.js)
- `vu_1/2/3`: Número de VUs por stage
- `duration_1/2/3`: Duração de cada stage

**Saída:**
- Relatório HTML e logs salvos como artifacts
- Retenção: 7 dias

## 📚 Comandos Disponíveis (Make)

```bash
make help                    # Lista todos os comandos
make install                 # npm i nas pastas necessárias
make docker-up               # Inicia PostgreSQL
make docker-down             # Para PostgreSQL
make api                     # Executa API (foreground)
make api-bg                  # Executa API (background)
make web                     # Executa Web (foreground)
make web-bg                  # Executa Web (background)
make test                    # Executa testes (testCi.js)
make test-accounts           # Executa teste de contas
make test-accounts-verbose   # Teste de contas com verbose
make clean                   # Limpa arquivos temporários
```

## 🔐 Configuração do Banco de Dados

**Credenciais padrão:**
```
Host: localhost
Banco: smartbit
Porta: 5432
Usuário: admin
Senha: 123
```

**String de conexão:**
```
postgres://admin:123@localhost:5432/smartbit?sslmode=disable
```

## 🚦 Tipos de Teste Implementados

### Teste de Pico (Spike Testing) - accounts.js
```
VUs
150 |        ___
    |       /   \
100 |  ____/     \___
    | /               \
  0 |_________________
    0s   30s  80s   110s
```
- **Objetivo**: Simular picos repentinos de tráfego
- **Uso**: Validar como o servidor lida com todos acessando ao mesmo tempo
- **Seu teste**: Pico controlado entre 30-150 VUs

## 📚 Extensões K6 Utilizadas

- **k6/x/faker** (v0.4.4): Geração de dados fictícios realistas
- **k6/x/sql** (v1.0.5): Acesso direto ao banco de dados
- **k6/x/sql/driver/postgres** (v0.1.1): Driver PostgreSQL
- **k6-reporter**: Geração de relatórios HTML
- **jslib.k6.io/k6-utils**: Utilitários do K6 (UUID, random)

## 📖 Referências

- [Documentação K6](https://grafana.com/docs/k6/latest/)
- [xk6-sql Extension](https://grafana.com/docs/k6/latest/javascript-api/xk6-sql/)
- [xk6-faker Extension](https://github.com/grafana/xk6-faker)
- [K6 Best Practices](https://grafana.com/docs/k6/latest/testing-guides/load-testing/)

## 👨‍💼 Autor

Alexandre Mariano