# POC K6 - Teste de Carga no app SmartBit

Projeto de testes de carga usando **K6** para a API SmartBit. Este projeto demonstra como executar testes de performance, validar endpoints HTTP e interagir com banco de dados PostgreSQL.

## 📋 Pré-requisitos

- **K6** (v1.2.0 ou superior)
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

# Em vez de: make test-verbose
$env:K6_ENABLE_COMMUNITY_EXTENSIONS = "true"; k6 run .\tests\accounts.js --verbose
```

## 🚀 Instalação

### 1. Clonar o projeto
```bash
git clone <seu-repositorio>
cd poc-k6
```

### 2. Instalar dependências
Use o comando abaixo dentro do diretório do app **web** e depois do diretório **api**
```bash
npm i
```

### 3. Configurar banco de dados

#### Execute o Docker
```bash
cd apps/smartbit/docker
docker compose up -d
```

#### Execute a carga inicial do banco
```bash
cd apps/smartbit/api
./setup.sh  # Execute em um terminal bash/WSL
```

### 4. Iniciar a aplicação

**Terminal 1 - API:**
```bash
cd apps/smartbit/api
npm run dev
```

**Terminal 2 - Web:**
```bash
cd apps/smartbit/web
npm run dev
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

# Executar testes
make test

# Executar testes com verbose
make test-verbose
```

### Opção 2: Sem Make (Comandos Manuais)

Se não instalou Make, execute manualmente:

```bash
# Definir variável de ambiente para plugins
$env:K6_ENABLE_COMMUNITY_EXTENSIONS = "true"

# Teste com extensões
k6 run .\tests\accounts.js

# Teste com modo verbose
k6 run .\tests\accounts.js --verbose
```

## 📁 Estrutura do Projeto

```
poc-k6/
├── tests/
│   ├── accounts.js                 # Teste principal de criação de contas
│   ├── pingServer.js               # Teste de ping na API
│   ├── helpers/
│   │   ├── cpfGenerator.js          # Gerador de CPF válido
│   │   └── userGenerator.js         # Gerador de usuários fictícios
│   ├── database/
│   │   └── dbConnection.js          # Módulo de conexão com PostgreSQL
│   ├── options/
│   │   └── loadOptions.js           # Configuração de stages e thresholds
│   └── report/
│       ├── htmlReport.js            # Gerador de relatório HTML
│       └── textSummary.js           # Resumo em texto
├── apps/smartbit/
│   ├── api/                         # API Node.js
│   ├── web/                         # Frontend
│   └── docker/                      # Configuração Docker
└── README.md
```

## 🔧 Módulos e Responsabilidades

### **1. Testes Principais**

#### `accounts.js`
- **Responsabilidade**: Testa criação de novas contas de usuário
- **O que faz**: 
  - Gera dados aleatórios de usuário (nome, email, CPF)
  - Faz requisição POST para criar conta
  - Valida resposta comparando com payload enviado
  - Executa em stages (ramp-up, steady, ramp-down)
- **Extensões usadas**: Faker, SQL

#### `pingServer.js`
- **Responsabilidade**: Verifica disponibilidade da API
- **O que faz**: Faz requisição GET simples e valida status 200

### **2. Helpers**

#### `helpers/cpfGenerator.js`
- **Responsabilidade**: Gerar CPF válido e único
- **Função**: `generateValidCPF()`
- **Retorno**: String com 11 dígitos (CPF válido com dígitos verificadores corretos)

#### `helpers/userGenerator.js`
- **Responsabilidade**: Gerar dados de usuário realistas
- **Função**: `userGenerator()`
- **Retorno**: Objeto com:
  - `name`: Nome fictício (via Faker)
  - `email`: Email único (nome + UUID parcial)
  - `cpf`: CPF válido gerado

### **3. Banco de Dados**

#### `database/dbConnection.js`
- **Responsabilidade**: Gerenciar conexão e operações no PostgreSQL
- **Funções disponíveis**:
  - `queryUsers()` - SELECT de todos os usuários
  - `getUserById(userId)` - SELECT por ID
  - `insertUser(name, email, cpf)` - INSERT
  - `updateUser(userId, name, email)` - UPDATE
  - `deleteUser(email)` - DELETE
  - `deleteExcedentUsers()` - Limpa usuários de teste
  - `closeConnection()` - Fecha conexão

### **4. Configuração**

#### `options/loadOptions.js`
- **Responsabilidade**: Define comportamento de carga e validação
- **Stages** (simulação de carga):
  - Ramp-up: 20s aumentando até 100 VUs
  - Steady: 30s mantendo 120 VUs
  - Ramp-down: 15s reduzindo para 0 VUs
- **Thresholds** (critérios de sucesso):
  - `http_req_duration`: 95% das requisições < 200ms
  - `http_req_failed`: Taxa de falha < 1%

### **5. Relatórios**

#### `report/htmlReport.js`
- **Responsabilidade**: Gera relatório visual em HTML
- **Saída**: `result.html`

#### `report/textSummary.js`
- **Responsabilidade**: Gera sumário em texto colorido
- **Saída**: Console com métricas formatadas

## 📈 Configuração do Banco de Dados

**Credenciais padrão:**
```
Host: localhost
Banco: smartbit
Porta: 5432
Usuário: admin
Senha: 123
```

**Configurar no `dbConnection.js`:**
```javascript
const db = sql.open(
    driver, 
    'postgres://admin:123@localhost:5432/smartbit?sslmode=disable'
);
```

## 📊 Interpretando Resultados

### Métricas Principais:
- **data_received**: Volume de dados recebidos
- **data_sent**: Volume de dados enviados
- **http_req_duration**: Tempo de resposta das requisições
- **http_req_failed**: Taxa de requisições com erro
- **iterations**: Número de iterações completadas

### Exemplo de Saída:
```
✓ status is 201
✓ body contains the correct name
✓ body contains the correct email
✓ body contains the correct cpf

data_received........: 50 kB 10 kB/s
data_sent............: 25 kB 5 kB/s
http_req_duration....: avg=150ms p(95)=180ms p(99)=200ms
http_req_failed......: 0.5% ✓
iterations...........: 100
```

## 📚 Referências

- [Documentação K6](https://grafana.com/docs/k6/latest/)
- [xk6-sql Extension](https://grafana.com/docs/k6/latest/javascript-api/xk6-sql/)
- [xk6-faker Extension](https://github.com/grafana/xk6-faker)

## 👨‍💼 Autor

Alexandre Mariano