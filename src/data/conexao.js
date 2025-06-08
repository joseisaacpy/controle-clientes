// importa o mysql
import mysql from "mysql2";

// importa o dotenv
import dotenv from "dotenv";
dotenv.config();

// cria os dados de conexão
const conexao = mysql.createConnection({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: process.env.MYSQLPORT,
  timezone: "-03:00", // Define o fuso horário
});

conexao.connect((err) => {
  if (err) {
    console.error("Erro ao conectar no MySQL:", err);
    return;
  }
  console.log("Conectado ao banco de dados MySQL com sucesso!");
});

// exporta a conexão
export default conexao;
