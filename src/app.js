// import express
import express from "express";
// importa o path
import path from "path";
// instancia o express
const app = express();
// importa o arquivo de conexão
import conexao from "./data/conexao.js";

// middlewares
// para aceitar json
app.use(express.json());
// para aceitar dados do form
app.use(express.urlencoded({ extended: true }));
// para servir arquivos estáticos
app.use(express.static("../public"));

// importa o dirname e o fileURLToPath
import { fileURLToPath } from "url";
import { dirname } from "path";
// define o __dirname numa variável
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// rotas
// Rota principal
app.get("/", (req, res) => {
  const indexPath = path.join(__dirname + "/../public/index.html");
  res.sendFile(indexPath);
});

// rota para listar os clientes
app.get("/clientes", (req, res) => {
  const sql = "select * from clientes";
  conexao.query(sql, (err, data) => {
    if (err) throw err;
    res.json(data);
  });
});

// rota para pegar um cliente pelo id
app.get("/clientes/:id", (req, res) => {
  const sql = "select * from clientes where id = ?";
  conexao.query(sql, [req.params.id], (err, data) => {
    if (err) throw err;
    res.json(data);
  });
});

// rota para cadastrar um cliente
app.post("/clientes", (req, res) => {
  const cliente = req.body;
  const sql = "insert into clientes set ?";
  conexao.query(sql, [cliente], (err, data) => {
    if (err) throw err;
    res.json(data);
  });
});

// exporta o app
export default app;
