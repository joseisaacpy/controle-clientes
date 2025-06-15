# 📋 Sistema de Cadastro de Clientes

Um sistema simples de cadastro, listagem, edição e exclusão de clientes utilizando Node.js, Express, MongoDB, HTML/CSS/JS e geração de planilhas Excel.

## 🚀 Tecnologias usadas:

- Node.js

- Express.js

- MongoDB (via Mongoose)

- ExcelJS

- HTML/CSS/JavaScript Vanilla

- dotenv (para variáveis de ambiente)

- express-session (para controle de login)

## 📁 Estrutura de Pastas:

```
├── public
│ ├── css
│ └── js
│ ├── clientes-cadastra.js
│ ├── editar-cliente.js
│ └── form.js
│ └── views
│ ├── clientes-cadastrados.html
│ ├── editar-cliente.html
│ ├── form.html
│ ├── login.html
│ └── index.html
├── src
│ ├── data
│ │ └── clientes.js (schema Mongoose)
│ └── app.js (configuração principal do app)
├── .env (configurações secretas)
├── server.js (arquivo que inicia o app)
├── package.json
└── .gitignore
```

### 🔗 Rotas principais da API:

| Método | Rota                | Descrição                                |
| ------ | ------------------- | ---------------------------------------- |
| GET    | `/api/clientes`     | Lista todos os clientes                  |
| GET    | `/api/clientes/:id` | Retorna um cliente pelo ID               |
| POST   | `/api/clientes`     | Cria um novo cliente                     |
| PUT    | `/api/clientes/:id` | Atualiza os dados de um cliente          |
| DELETE | `/api/clientes/:id` | Remove um cliente do banco               |
| GET    | `/clientes/baixar`  | Gera e baixa planilha Excel dos clientes |
