// import express
import express from "express";
// importa o path
import path from "path";
// instancia o express
const app = express();
// importa o arquivo de conexão
import conexao from "./data/conexao.js";
// importa o dotenv
import dotenv from "dotenv";
dotenv.config();

console.log("Usuário esperado:", process.env.ADM_USER);
console.log("Senha esperada:", process.env.ADM_PASSWORD);

// middlewares
// para aceitar json
app.use(express.json());
// para aceitar dados do form
app.use(express.urlencoded({ extended: true }));

// importa o dirname e o fileURLToPath
import { fileURLToPath } from "url";
import { dirname } from "path";
// define o __dirname numa variável
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// importa o express-session
import session from "express-session";
// configura o express-session
app.use(
  session({
    secret: "nodeExpress", // pode ser qualquer string segura
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60, // 1 hora (opcional)
    },
  })
);
// para servir arquivos estáticos
app.use(express.static(path.join(__dirname, "../public")));

// rotas
// rota principal
app.get("/", (req, res) => {});

// rota para login get
app.get("/login", (req, res) => {
  const loginPath = path.join(__dirname + "/../public/views/login.html");
  res.sendFile(loginPath);
});

// rota para admin
app.use("/admin", (req, res) => {
  if (!req.session.usuarioAutenticado) {
    return res.redirect("/login");
  }
  const clientesCadastradosPath = path.join(
    __dirname + "/../public/views/clientes-cadastrados.html"
  );
  res.sendFile(clientesCadastradosPath);
});

// rota para login post
app.post("/login", (req, res) => {
  const { usuario, senha } = req.body;
  if (usuario === process.env.ADM_USER && senha === process.env.ADM_PASSWORD) {
    req.session.usuarioAutenticado = true;
    const clientesCadastradosPath = path.join(
      __dirname + "/../public/views/clientes-cadastrados.html"
    );
    res.sendFile(clientesCadastradosPath);
  }
  res
    .status(401)
    .send("Usuário ou senha inválidos. <a href='/login'>Tentar novamente</a>");
});

// Tratamento de rota não encontrada
app.use((req, res) => {
  res.status(404).send("Página não encontrada");
});

// rota para formulário
app.get("/clientes/novo", (req, res) => {
  const formPath = path.join(__dirname + "/../public/views/form.html");
  res.sendFile(formPath);
});

// rota para ver clientes cadastrados
app.get("/clientes", (req, res) => {
  const clientesCadastradosPath = path.join(
    __dirname + "/../public/views/clientes-cadastrados.html"
  );
  res.sendFile(clientesCadastradosPath);
});

// rota para listar os clientes
app.get("/api/clientes", (req, res) => {
  const sql = "select * from clientes";
  conexao.query(sql, (err, data) => {
    if (err) throw err;
    res.json(data);
  });
});

// rota para pegar um cliente pelo id
app.get("/api/clientes/:id", (req, res) => {
  const sql = "select * from clientes where id = ?";
  conexao.query(sql, [req.params.id], (err, data) => {
    if (err) throw err;
    // verifica se o cliente foi encontrado
    if (data.length === 0) {
      res.status(404).json({ message: "Cliente não encontrado" });
      return;
    }
    res.json(data);
  });
});

// funcao para pegar um cliente pelo cpf
function buscarPeloCpf(cpf) {
  const sql = "select * from clientes where cpf = ?";
  const conexao = require("./data/conexao.js");
  conexao.query(sql, [cpf], (err, data) => {
    if (err) throw err;
    // verifica se o cliente foi encontrado
    if (data.length === 0) {
      res.status(404).json({ message: "Cliente não encontrado" });
      return;
    }
    res.json(data);
  });
}

// rota para cadastrar um cliente
app.post("/api/clientes", (req, res) => {
  const cliente = req.body;
  const sql = "insert into clientes set ?";
  conexao.query(sql, [cliente], (err, data) => {
    if (err) throw err;
    res.json(data);
  });
});

// exporta o app
export default app;
