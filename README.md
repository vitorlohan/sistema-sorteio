# Sistema de Sorteio

Sistema profissional de sorteio com 3 modalidades: Números, Nomes e Roleta.

## Stack

### Backend
- **TypeScript** + **Express** + **Mongoose** (MongoDB)
- **JWT** com refresh token rotation
- **HTTP/2** (com SSL) / HTTP/1.1 (fallback dev)
- Segurança: Helmet, CORS, Rate Limiting, bcrypt (salt 12), validação de inputs

### Frontend
- **React 19** + **TypeScript** + **Vite**
- React Router v7
- Axios com interceptors (refresh token automático)
- Paleta: Branco + Verde
- Responsivo (Desktop, Tablet, Mobile)

## Estrutura

```
sistema-sorteio/
├── backend/
│   ├── src/
│   │   ├── config/         # Conexão MongoDB
│   │   ├── controllers/    # AuthController, DrawController, TemplateController
│   │   ├── middlewares/     # Auth, Rate Limit, Validation, Error Handler
│   │   ├── models/         # User, DrawTemplate, DrawResult
│   │   ├── routes/         # Auth, Draw, Template routes
│   │   ├── services/       # AuthService, DrawService, TemplateService
│   │   ├── types/          # TypeScript interfaces e enums
│   │   ├── utils/          # JWT, Crypto utilities
│   │   ├── __tests__/      # Testes (Jest + Supertest + mongodb-memory-server)
│   │   └── server.ts       # Entry point
│   ├── .env                # Variáveis de ambiente
│   ├── .env.example        # Template de variáveis
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/     # Header, RouletteWheel
│   │   ├── hooks/          # useAuth (Context + Provider)
│   │   ├── pages/          # Home, Login, Register, Dashboard, NumberDraw, NameDraw, RouletteDraw
│   │   ├── services/       # API client, AuthService, DrawService, TemplateService
│   │   ├── styles/         # Global CSS (paleta branco + verde)
│   │   ├── types/          # TypeScript interfaces
│   │   ├── App.tsx         # Rotas e layout
│   │   └── main.tsx        # Entry point
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
└── README.md
```

## Configuração Rápida

### 1. Backend

```bash
cd backend
npm install

# Edite o .env com o endereço do seu MongoDB:
# MONGODB_URI=mongodb://localhost:27017/sistema-sorteio
# JWT_SECRET=sua_chave_secreta_forte
# JWT_REFRESH_SECRET=outra_chave_secreta_forte

npm run dev
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

O frontend roda em `http://localhost:5173` e faz proxy das requisições `/api` para o backend em `http://localhost:3000`.

### 3. Testes

```bash
cd backend
npm test
```

## Funcionalidades

| Funcionalidade | Descrição |
|---|---|
| **Sorteio de Números** | Quantidade, intervalo min/max, repetição opcional |
| **Sorteio de Nomes** | Textarea ou CSV, repetição opcional |
| **Roleta Interativa** | Canvas animado, cores customizáveis, ponteiro |
| **Autenticação** | Login/Registro com JWT + Refresh Token |
| **Templates** | Salvar/carregar modelos de sorteio (autenticado) |
| **Histórico** | Resultados salvos com TTL de 30 dias |

## Desenvolvedor

Desenvolvido por **Vitor Lohan**.

## Segurança

- ✅ Senhas com bcrypt (salt rounds: 12)
- ✅ JWT com refresh token rotation (detecção de reuso)
- ✅ Helmet (headers de segurança)
- ✅ CORS restrito
- ✅ Rate limiting (geral, auth, sorteios)
- ✅ Input validation (express-validator)
- ✅ Randomização criptográfica (crypto.randomBytes)
- ✅ Proteção contra NoSQL injection (mongoose strictQuery)
- ✅ HTTP/2 com SSL (produção)
- ✅ TTL index para limpeza automática de dados

## API Endpoints

### Auth
- `POST /api/auth/register` - Criar conta
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh` - Renovar token
- `POST /api/auth/logout` - Logout
- `POST /api/auth/logout-all` - Logout todas sessões
- `GET /api/auth/profile` - Perfil do usuário

### Draw
- `POST /api/draw/numbers` - Sortear números
- `POST /api/draw/names` - Sortear nomes
- `POST /api/draw/roulette` - Sortear roleta
- `GET /api/draw/history` - Histórico (autenticado)

### Templates
- `POST /api/templates` - Criar modelo
- `GET /api/templates` - Listar modelos (?type=number|name|roulette)
- `GET /api/templates/:id` - Buscar modelo
- `PUT /api/templates/:id` - Atualizar modelo
- `DELETE /api/templates/:id` - Excluir modelo

### Health
- `GET /api/health` - Status da API
