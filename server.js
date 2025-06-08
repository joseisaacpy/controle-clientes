// importa o dotenv
import dotenv from "dotenv";
dotenv.config();

// importa o arquivo de conexão
import conexao from "./src/data/conexao.js";
// importa o arquivo de rotas
import app from "./src/app.js";

// cria a conexão com o banco de dados
conexao.connect();
const port = process.env.PORT || 3000;

// inicia o servidor
app.listen(port, () => {
  console.log(`servidor rodando em http://localhost:${port}`);
});
