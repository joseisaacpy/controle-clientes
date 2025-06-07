// importa o arquivo de conexão
import conexao from "./src/data/conexao.js";
// importa o arquivo de rotas
import app from "./src/app.js";

// cria a conexão com o banco de dados
conexao.connect();

// inicia o servidor
app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
});
