# Todo Learning API

API REST para **gerenciar tarefas de estudo (todo)** com **autenticação (JWT)**, **paginação** e persistência em **MongoDB**.

## Principais funcionalidades

- **Cadastro e login** de usuários (`/api/auth/*`)
- **CRUD de tasks** vinculadas ao usuário autenticado (`/api/tasks`)
- **Paginação** na listagem de tasks (`page` e `limit`)
- **Segurança em 2 camadas**:
  - **API Key** obrigatória em **todas** as rotas (`x-api-key`)
  - **JWT Bearer token** obrigatório nas rotas protegidas (`Authorization: Bearer ...`)

## Stack

- **Node.js + TypeScript**
- **Express 5**
- **MongoDB** (driver oficial)
- **bcryptjs** (hash de senha)
- **jsonwebtoken** (JWT)
- **dotenv** (variáveis de ambiente)

## Pré-requisitos

- **Node.js** (recomendado: LTS)
- **MongoDB** (local ou Atlas)

## Configuração (.env)

Este projeto usa variáveis de ambiente via `dotenv`. Crie/ajuste o arquivo **`.env`** na raiz.

Variáveis usadas:

- **`DB_NAME`**: nome do banco (ex.: `todo-learning`)
- **`MONGO_URI`**: string de conexão do MongoDB (ex.: `mongodb://localhost:27017`)
- **`JWT_SECRET`**: segredo do JWT (**obrigatório**)
- **`API_KEY`**: chave exigida no header `x-api-key` (**obrigatório**)

Exemplo:

```env
DB_NAME=todo-learning
MONGO_URI=mongodb://localhost:27017
JWT_SECRET=uma-string-bem-secreta
API_KEY=sua-api-key-aqui
```

## Como rodar

Instalar dependências:

```bash
npm install
```

Rodar em desenvolvimento (watch):

```bash
npm run dev
```

Servidor sobe por padrão em:

- **Base URL**: `http://localhost:3000`

## Autenticação e headers obrigatórios

Este projeto exige **sempre**:

- **`x-api-key: <API_KEY>`** em todas as requisições (inclusive `/api/auth/*`)

E, nas rotas protegidas (`/api/tasks`):

- **`Authorization: Bearer <TOKEN_JWT>`**

## Endpoints

### Auth (público, mas exige API Key)

#### POST `/api/auth/register`

Body:

- **`name`** (string, obrigatório)
- **`email`** (string, obrigatório)
- **`password`** (string, obrigatório)

Exemplo:

```bash
curl -X POST http://localhost:3000/api/auth/register ^
  -H "Content-Type: application/json" ^
  -H "x-api-key: SUA_API_KEY" ^
  -d "{\"name\":\"Luan\",\"email\":\"luan@email.com\",\"password\":\"123456\"}"
```

#### POST `/api/auth/login`

Body:

- **`email`** (string, obrigatório)
- **`password`** (string, obrigatório)

Exemplo:

```bash
curl -X POST http://localhost:3000/api/auth/login ^
  -H "Content-Type: application/json" ^
  -H "x-api-key: SUA_API_KEY" ^
  -d "{\"email\":\"luan@email.com\",\"password\":\"123456\"}"
```

### Tasks (protegido: API Key + JWT)

#### GET `/api/tasks?page=1&limit=10`

Retorna tasks do usuário autenticado, com paginação.

Exemplo:

```bash
curl -X GET "http://localhost:3000/api/tasks?page=1&limit=10" ^
  -H "x-api-key: SUA_API_KEY" ^
  -H "Authorization: Bearer SEU_TOKEN"
```

Formato de paginação (exemplo):

```json
{
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

#### POST `/api/tasks`

Body:

- **`title`** (string, obrigatório)
- **`subject`** (string, obrigatório)
- **`description`** (string, opcional)
- **`priority`** (`low` | `medium` | `high`, opcional; padrão: `medium`)

Exemplo:

```bash
curl -X POST http://localhost:3000/api/tasks ^
  -H "Content-Type: application/json" ^
  -H "x-api-key: SUA_API_KEY" ^
  -H "Authorization: Bearer SEU_TOKEN" ^
  -d "{\"title\":\"Estudar JWT\",\"subject\":\"Node.js\",\"description\":\"Ler docs e praticar\",\"priority\":\"high\"}"
```

#### PUT `/api/tasks/:id`

Atualiza parcialmente (campos opcionais). Exemplos de campos aceitos:

- `title`, `subject`, `description`, `completed`, `priority`

Exemplo:

```bash
curl -X PUT http://localhost:3000/api/tasks/ID_DA_TASK ^
  -H "Content-Type: application/json" ^
  -H "x-api-key: SUA_API_KEY" ^
  -H "Authorization: Bearer SEU_TOKEN" ^
  -d "{\"completed\":true}"
```

#### DELETE `/api/tasks/:id`

Exemplo:

```bash
curl -X DELETE http://localhost:3000/api/tasks/ID_DA_TASK ^
  -H "x-api-key: SUA_API_KEY" ^
  -H "Authorization: Bearer SEU_TOKEN"
```

## Observações importantes

- As tasks são sempre filtradas por **usuário logado** (o `userId` vem do token JWT).
- Se `JWT_SECRET` não estiver definido, o projeto lança erro ao importar `utils/jwt.ts`.
