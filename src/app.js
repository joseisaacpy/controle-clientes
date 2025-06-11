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

// middlewares:
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

// caminho do arquivos:
// listar clientes
const clientesCadastradosPath = path.join(
  __dirname + "/../public/views/clientes-cadastrados.html"
);
// pagina de login
const loginPath = path.join(__dirname + "/../public/views/login.html");
// pagina de formulario de cadastro
const formPath = path.join(__dirname + "/../public/views/form.html");

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

// rotas:
// rota principal
app.get("/", (req, res) => {
  if (req.session.usuarioAutenticado) {
    res.redirect("/admin");
  } else {
    res.redirect("/login");
  }
});

// rota para login get
app.get("/login", (req, res) => {
  res.sendFile(loginPath);
});

// rota para admin
app.get("/admin", (req, res) => {
  if (!req.session.usuarioAutenticado) {
    return res.redirect("/login");
  }
  res.sendFile(clientesCadastradosPath);
});

// rota para login post
app.post("/login", (req, res) => {
  const { usuario, senha } = req.body;
  if (usuario === process.env.ADM_USER && senha === process.env.ADM_PASSWORD) {
    req.session.usuarioAutenticado = true;
    res.redirect("/admin"); // Redireciona ao invés de carregar HTML direto
  } else {
    res
      .status(401)
      .send(
        "Usuário ou senha inválidos. <a href='/login'>Tentar novamente</a>"
      );
  }
});

// rota para formulário
app.get("/clientes/novo", (req, res) => {
  res.sendFile(formPath);
});

// rota para ver clientes cadastrados
app.get("/clientes", (req, res) => {
  res.sendFile(clientesCadastradosPath);
});

// rota para listar os clientes
app.get("/api/clientes", (req, res) => {
  const sql = "select * from clientes";
  conexao.query(sql, (err, data) => {
    if (err)
      return res.status(500).json({ message: "Erro no servidor", error: err });
    res.json(data);
  });
});

// rota para pegar um cliente pelo id
app.get("/api/clientes/:id", (req, res) => {
  const sql = "select * from clientes where id = ?";
  conexao.query(sql, [req.params.id], (err, data) => {
    if (err)
      return res.status(500).json({ message: "Erro no servidor", error: err });
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
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM clientes WHERE cpf = ?";
    conexao.query(sql, [cpf], (err, data) => {
      if (err) return reject(err);
      resolve(data);
    });
  });
}

// rota para cadastrar um cliente
app.post("/api/clientes", (req, res) => {
  const { nome, cpf, email, telefone } = req.body;

  // Verifica campos obrigatórios
  if (!nome || !cpf || !telefone) {
    return res
      .status(400)
      .json({ message: "Nome, CPF e telefone são obrigatórios." });
  }

  // Verifica CPF (11 dígitos sem máscara ou 14 com máscara)
  const cpfRegex = /^\d{11}$|^\d{3}\.\d{3}\.\d{3}\-\d{2}$/;
  if (!cpfRegex.test(cpf)) {
    return res
      .status(400)
      .json({ message: "CPF inválido. Use 00000000000 ou 000.000.000-00." });
  }

  // Verifica telefone (11 dígitos ou no formato (00) 00000-0000)
  const telefoneRegex = /^\d{11}$|^\(\d{2}\) \d{5}\-\d{4}$/;
  if (!telefoneRegex.test(telefone)) {
    return res.status(400).json({
      message: "Telefone inválido. Use 11999999999 ou (11) 99999-9999.",
    });
  }

  // Verifica email se informado
  if (email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Email inválido." });
    }
  }

  // Se tudo ok, insere no banco
  const cliente = { nome, cpf, email, telefone };
  const sql = "INSERT INTO clientes SET ?";
  conexao.query(sql, [cliente], (err, data) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Erro ao cadastrar cliente.", error: err });
    }
    res.status(201).json({ message: "Cliente cadastrado com sucesso.", data });
  });
});

// rota para deletar um cliente
app.delete("/api/clientes/:id", (req, res) => {
  const sql = "DELETE FROM clientes WHERE id = ?";

  conexao.query(sql, [req.params.id], (err, data) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Erro ao excluir cliente",
      });
    }

    if (data.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Cliente não encontrado",
      });
    }

    res.json({
      success: true,
      message: "Cliente excluído com sucesso",
    });
  });
});

// Tratamento de rota não encontrada
app.use((req, res) => {
  res.status(404).send("<h1>Página não encontrada</h1>");
});

// exporta o app
export default app;
