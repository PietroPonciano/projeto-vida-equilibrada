# API Node Financeira

API em Node.js/Express para autenticacao, perfil de usuario, cadastro/importacao de gastos, relatorios financeiros, previsao de gastos com IA e geracao de PDF.

## Tecnologias

- Node.js
- Express
- PostgreSQL
- Sequelize
- JWT
- Multer
- PDFKit
- Jest e Supertest

## Estrutura do projeto

```text
.
+-- app.js                 # Configuracao do Express, middlewares e rotas
+-- index.js               # Entrada local da aplicacao
+-- server.js              # Inicializacao do banco e do servidor
+-- sequelize.js           # Configuracao do Sequelize
+-- vercel.json            # Configuracao de deploy na Vercel
+-- api/
|   +-- index.js           # Adaptador para deploy serverless na Vercel
+-- controllers/           # Controllers das rotas
+-- middleware/            # Middlewares de autenticacao e upload
+-- models/                # Models Sequelize
+-- services/              # Regras de negocio, IA, parsers e previsoes
+-- utils/                 # Utilitarios de banco, JWT, PDF e normalizacao
```

## Variaveis de ambiente

Crie um arquivo `.env` na raiz do projeto com as variaveis necessarias:

```env
DATABASE_URL=postgres://usuario:senha@host:porta/banco
JWT_SECRET=sua_chave_secreta
PORT=3000
NODE_ENV=development
```

Tambem existe suporte para `DJANGO_DATABASE_URL` como alternativa a `DATABASE_URL`.

## Como rodar localmente

Instale as dependencias:

```bash
npm install
```

Inicie a API:

```bash
npm start
```

Por padrao, a API sobe em:

```text
http://localhost:3000
```

## Testes

Para rodar os testes:

```bash
npm test
```

## Rotas principais

### Health check

- `GET /`

### Autenticacao

- `GET /auth/me`
- `POST /auth/register`
- `POST /auth/token`
- `POST /auth/token/refresh`
- `POST /auth/token/revoke`
- `POST /auth/change-password`
- `POST /auth/reset-password`

### Perfil

- `GET /perfil`
- `POST /perfil/confirmar-codigos`
- `PUT /perfil/atualizar`
- `PUT /perfil/desativar`

### Gastos

- `GET /gastos/mes-atual`
- `GET /gastos`
- `POST /gastos`
- `POST /gastos/ia`
- `GET /gastos/:id`
- `PUT /gastos/:id`
- `DELETE /gastos/:id`

### Extrato

- `POST /extrato/importar`

Aceita upload de arquivo via campo `file`, com suporte a CSV e PDF.

### Relatorio

- `GET /relatorio`
- `GET /relatorio/previsao`
- `GET /relatorio/pdf/:ano/:mes`

## Deploy na Vercel

O projeto atualmente mantem `api/index.js` como adaptador para a Vercel. Por isso, o `vercel.json` aponta para:

```json
{
  "src": "api/index.js",
  "use": "@vercel/node"
}
```

Se a pasta `api/` for removida, atualize o `vercel.json` para usar o `index.js` da raiz:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.js"
    }
  ]
}
```

## Observacoes

- Em ambiente de desenvolvimento, o Sequelize usa `sync({ alter: true })`.
- Em outros ambientes, usa `sync()` sem `alter`.
- Os tokens de autenticacao sao armazenados em cookies HTTP-only.
- O CORS esta configurado para aceitar `http://localhost:5173`.
