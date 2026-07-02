Com base no arquivo fornecido, aqui está um `README.md` completo, estruturado e profissional para a sua aplicação back-end (**API Node Financeira** / **Vida Equilibrada**):


# API Node Financeira — Vida Equilibrada

Esta é uma API REST desenvolvida em Node.js e Express que serve como o ecossistema back-end para a aplicação de gestão financeira inteligente **Vida Equilibrada**. A plataforma foi desenhada para auxiliar os utilizadores a gerirem as suas finanças pessoais através do registo de gastos, importação automática de extratos bancários, geração de relatórios consolidados em PDF e análise/previsão de despesas utilizando Inteligência Artificial.

---

## Funcionalidades Principais

* **Autenticação Segura**: Fluxo completo de registo, login, renovação e revogação de tokens com armazenamento seguro em cookies HTTP-only.
* **Gestão de Perfil**: Administração das configurações e dados de perfil do utilizador.
* **Controlo de Gastos**: Registo manual de despesas ou automatizado por IA.
* **Importação de Extratos**: Processamento automático de ficheiros nos formatos CSV e PDF enviado via upload (Multer).
* **Inteligência Artificial**: Módulos dedicados à classificação automática de transações, análise financeira personalizada e previsão de despesas futuras.
* **Relatórios Consolidados**: Geração de relatórios mensais dinâmicos e exportação de documentos PDF formatados através do PDFKit.
* **Indicadores Económicos**: Integração auxiliar com dados e índices do IPEA.

---

## Tecnologias Utilizadas

* **Runtime**: [Node.js](https://nodejs.org/)
* **Framework Web**: [Express](https://expressjs.com/)
* **Base de Dados**: [PostgreSQL](https://www.postgresql.org/)
* **ORM**: [Sequelize](https://sequelize.org/) (com suporte a migrações via `sequelize-cli`)
* **Autenticação**: [JSON Web Tokens (JWT)](https://jwt.io/) & `cookie-parser`
* **Upload de Ficheiros**: [Multer](https://github.com/expressjs/multer)
* **Geração de Documentos**: [PDFKit](https://pdfkit.org/) & `pdf-parse`
* **Testes Automatizados**: [Jest](https://jestjs.io/) & [Supertest](https://github.com/ladjs/supertest)

---

## Estrutura do Projeto

A arquitetura do projeto segue um padrão modular focado em separação de conceitos (MVC/Services):

```text
.
├── app.js                 # Configuração do Express, middlewares globais e rotas
├── index.js               # Ponto de entrada local da aplicação
├── server.js              # Inicialização e ligação à base de dados e servidor
├── sequelize.js           # Configuração e inicialização do ORM Sequelize
├── vercel.json            # Ficheiro de configuração para deploy na Vercel
├── api/
│   └── index.js           # Adaptador de entrada serverless para a Vercel
├── controllers/           # Controladores responsáveis pela lógica das rotas
├── middleware/            # Middlewares de segurança (auth) e uploads
├── models/                # Definição dos modelos e esquemas da base de dados (Sequelize)
├── services/              # Core business: integração com IA, parsers (CSV/PDF) e previsões
└── utils/                 # Funções utilitárias (JWT, PDF, db, integradores)



---

## Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto antes de iniciar a aplicação:

```env
DATABASE_URL=postgres://usuario:senha@host:porta/banco
JWT_SECRET=sua_chave_secreta_super_segura
PORT=3000
NODE_ENV=development

```

*Nota: O sistema também possui suporte nativo à variável `DJANGO_DATABASE_URL` como alternativa direta para conexão.*

---

## Como Executar Localmente

### 1. Clonar o repositório e instalar dependências

```bash
npm install

```

### 2. Executar a aplicação em ambiente de desenvolvimento

```bash
npm start

```

Por padrão, o servidor estará acessível em:

```text
http://localhost:3000

```

### 3. Executar a suíte de testes

```bash
npm test

```

---

## Rotas da API

### Verificação de Estado (Health Check)

* `GET /` — Retorna o estado e versão atual da API.

### Autenticação (`/auth`)

* `GET /auth/me` — Recupera os dados do utilizador atualmente autenticado.
* `POST /auth/register` — Cria uma nova conta na plataforma.
* `POST /auth/token` — Realiza o login e emite as credenciais.
* `POST /auth/token/refresh` — Atualiza o token expirado.
* `POST /auth/token/revoke` — Invalida o token ativo (Logout).
* `POST /auth/change-password` — Alteração interna de senha.
* `POST /auth/reset-password` — Recuperação de conta.

### Perfil (`/perfil`)

* `GET /perfil` — Obtém os detalhes do perfil.
* `POST /perfil/confirmar-codigos` — Verificação de segurança.
* `PUT /perfil/atualizar` — Atualiza as informações cadastrais.
* `PUT /perfil/desativar` — Desativa temporariamente ou permanentemente a conta.

### Gestão de Gastos (`/gastos`)

* `GET /gastos/mes-atual` — Filtra e exibe os gastos do mês corrente.
* `GET /gastos` — Lista geral de despesas históricas.
* `POST /gastos` — Criação manual de um registo de gasto.
* `POST /gastos/ia` — Processa e cria um gasto inteligente com auxílio de IA.
* `GET /gastos/:id` — Detalha uma despesa específica.
* `PUT /gastos/:id` — Atualiza dados de uma despesa existente.
* `DELETE /gastos/:id` — Remove um registo de despesa.

### Extrato Bancário (`/extrato`)

* `POST /extrato/importar` — Recebe um ficheiro (através do campo multipart `file`) para processamento e inserção em massa de lançamentos. Suporta os formatos **CSV** e **PDF**.

### Relatórios e Visões (`/relatorio`)

* `GET /relatorio` — Consolida os dados financeiros gerais.
* `GET /relatorio/previsao` — Retorna projeções futuras geradas pelo serviço de IA.
* `GET /relatorio/pdf/:ano/:mes` — Gera e faz o stream de um relatório analítico em formato PDF.

---

## Deploy (Vercel)

O projeto está configurado por padrão para funcionar de forma serverless na Vercel utilizando a pasta `api/` como ponto de entrada adaptado.

O ficheiro `vercel.json` de fábrica está configurado assim:

```json
{
  "src": "api/index.js",
  "use": "@vercel/node"
}

```

**Nota de Customização**: Caso prefira remover a subpasta `api/` e utilizar apenas a raiz do projeto para o deploy, atualize o seu `vercel.json` para a seguinte estrutura:

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

---

## Observações de Desenvolvimento

* **Sincronização de Tabelas**: Quando o ambiente (`NODE_ENV`) está definido como `development`, o ORM executa a função `sync({ alter: true })` para atualizar esquemas automaticamente. Em outros ambientes, utiliza apenas o `sync()` padrão por motivos de integridade de dados.
* **Segurança de Sessão**: Os tokens JWT de autenticação trafegam e são validados exclusivamente via cookies protegidos com a flag `HTTP-only`.
* **Configuração de CORS**: A política de CORS da API está previamente estruturada para aceitar requisições originadas do cliente em `http://localhost:5173` (padrão para aplicações React/Vite) com suporte a credenciais.

```

```
