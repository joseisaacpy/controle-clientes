// importa o dotenv
import dotenv from "dotenv";
dotenv.config();

// importa o arquivo de rotas
import app from "./src/app.js";

// cria a conexão com o banco de dados
const port = 3000;

// inicia o servidor
app.listen(port, "0.0.0.0", () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
