// importações:
import mongoose from "mongoose";
import express from "express";
import path from "path";
import clientes from "../data/clientes.js";
import session from "express-session";
import cors from "cors";
import { fileURLToPath } from "url";
import { dirname } from "path";
import dotenv from "dotenv";
dotenv.config();

// conexão com o MongoDB
const conexaoMongo = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Conectado ao MongoDB");
  } catch (error) {
    console.error("Erro ao conectar ao MongoDB:", error);
  }
};

// chama a função de conexão com o MongoDB
conexaoMongo();

// constantes:
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// middlewares:
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

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
    res.redirect("/admin");
  } else {
    res
      .status(401)
      .send(
        "Usuário ou senha inválidos. <a href='/login'>Tentar novamente</a>"
      );
  }
});

// rota principal
app.get("/", (req, res) => {
  if (req.session.usuarioAutenticado) {
    res.redirect("/admin");
  } else {
    res.redirect("/login");
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
app.get("/api/clientes", async (req, res) => {
  try {
    const todosClientes = await clientes.find();
    res.json(todosClientes);
  } catch (error) {
    console.error("Erro ao buscar clientes:", error);
    res.status(500).json({ message: "Erro ao buscar clientes", error });
  }
});

// rota para pegar um cliente pelo id
app.get("/api/clientes/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const cliente = await clientes.findById(id);
    if (!cliente) {
      return res.status(404).json({ message: "Cliente não encontrado" });
    }
    res.json(cliente);
  } catch (error) {
    console.error("Erro ao buscar cliente:", error);
    res.status(500).json({ message: "Erro ao buscar cliente", error });
  }
});

// rota para cadastrar um cliente
app.post("/api/clientes", async (req, res) => {
  try {
    const { nome, cpf, email, telefone, produto_alugado } = req.body;
    const novoCliente = new clientes({
      nome,
      cpf,
      email,
      telefone,
      produto_alugado,
    });
    await novoCliente.save();
    res.status(201).json(novoCliente);
  } catch (error) {
    console.error("Erro ao cadastrar cliente:", error);
    res.status(500).json({ message: "Erro ao cadastrar cliente", error });
  }
});

// rota para deletar um cliente
app.delete("/api/clientes/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await clientes.deleteOne({ _id: id });
    res.status(200).json({ message: "Cliente excluído com sucesso" });
  } catch (error) {
    console.error("Erro ao excluir cliente:", error);
    res.status(500).json({ message: "Erro ao excluir cliente", error });
  }
});

// Tratamento de rota não encontrada
app.use((req, res) => {
  res.status(404).send("<h1>Página não encontrada</h1>");
});

// exportação do app
export default app;
