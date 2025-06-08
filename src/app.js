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

// importa o dirname e o fileURLToPath
import { fileURLToPath } from "url";
import { dirname } from "path";
// define o __dirname numa variável
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// para servir arquivos estáticos
app.use(express.static(path.join(__dirname, "../public")));
// rotas
// Rota principal
app.get("/", (req, res) => {});

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
