// import express
import express from "express";
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
app.use(express.static("public"));

// rotas
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// rota para listar os clientes
app.get("/clientes", (req, res) => {
  const sql = "select * from clientes";
  conexao.query(sql, (err, data) => {
    if (err) throw err;
    res.json(data);
  });
});

// exporta o app
export default app;
