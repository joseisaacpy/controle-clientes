// import mysql
import mysql from "mysql";
// importa o dotenv
import dotenv from "dotenv";
dotenv.config();

// cria os dados de conexão
const conexao = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "jisn0910",
  database: "clientes",
  port: 3306,
});

// const conexao = mysql.createConnection({
//   host: process.env.HOST,
//   user: process.env.USER,
//   password: process.env.PASSWORD,
//   database: process.env.DATABASE,
//   port: process.env.PORT,
// });

// exporta a conexão
export default conexao;
