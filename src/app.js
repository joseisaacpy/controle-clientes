// importações:
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
// import fs from "fs";
// import session from "express-session";
import cors from "cors";
import clientes from "./data/clientes.js";
import ExcelJS from "exceljs";
import { fileURLToPath } from "url";
import { dirname } from "path";
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
// pagina index
const indexPath = path.join(__dirname + "/../public/views/index.html");

// para servir arquivos estáticos
app.use(express.static(path.join(__dirname, "../public")));

// Rotas:

// Rota para o serviço fechado (liberar após pagamento)
app.use((req, res) => {
  res
    .status(404)
    .sendFile(path.join(__dirname, "../public/views/servico-fechado.html"));
});

// rota principal
app.get("/", (req, res) => {
  res.sendFile(indexPath);
});

// rota para ver clientes cadastrados
app.get("/clientes", (req, res) => {
  res.sendFile(clientesCadastradosPath);
});

// rota para formulário
app.get("/clientes/novo", (req, res) => {
  res.sendFile(formPath);
});

// rota para baixar arquivo com nome dos clientes
app.get("/clientes/baixar", async (req, res) => {
  try {
    // faz a busca dos clientes no banco de dados
    const todosClientes = await clientes.find().lean();

    if (!todosClientes || todosClientes.length === 0) {
      return res
        .status(404)
        .json({ message: "Nenhum cliente encontrado para exportar" });
    }
    // Criar uma nova planilha
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Clientes");

    // Definir colunas da planilha (ajuste conforme seu schema)
    worksheet.columns = [
      { header: "Nome", key: "nome", width: 30 },
      { header: "CPF", key: "cpf", width: 30 },
      { header: "Email", key: "email", width: 30 },
      { header: "Endereço", key: "endereco", width: 30 },
      { header: "Telefone", key: "telefone", width: 20 },
      { header: "Criação", key: "data_criacao", width: 20 },
      { header: "Último produto alugado", key: "produto_alugado", width: 20 },
    ];

    // Adicionar os dados dos clientes
    todosClientes.forEach((cliente) => {
      worksheet.addRow(cliente);
    });

    // Gerar o buffer do arquivo Excel
    const buffer = await workbook.xlsx.writeBuffer();

    // Configurar o header da resposta para download
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=clientes.xlsx");

    // Enviar o arquivo diretamente para o cliente
    res.send(buffer);
  } catch (error) {
    console.error("Erro ao gerar CSV de clientes:", error);
    res.status(500).json({ message: "Erro ao gerar CSV de clientes", error });
  }
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
    const { nome, cpf, email, endereco, telefone, produto_alugado } = req.body;
    const novoCliente = new clientes({
      nome,
      cpf,
      email,
      endereco,
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

// Rota para atualizar um cliente
app.put("/api/clientes/:id", async (req, res) => {
  const id = req.params.id; // geralmente o _id do Mongo é uma string
  const { nome, cpf, email, endereco, telefone, produto_alugado } = req.body;

  try {
    const cliente = await clientes.findById(id);

    if (!cliente) {
      return res.status(404).json({ error: "Cliente não encontrado" });
    }

    cliente.nome = nome;
    cliente.cpf = cpf;
    cliente.email = email;
    cliente.endereco = endereco;
    cliente.telefone = telefone;
    cliente.produto_alugado = produto_alugado;

    await cliente.save();

    res.json({ success: true, message: "Cliente atualizado com sucesso" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro no servidor" });
  }
});

// Tratamento de rota não encontrada
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "../public/views/404.html"));
});

// exportação do app
export default app;
