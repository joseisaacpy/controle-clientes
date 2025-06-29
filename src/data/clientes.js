import mongoose from "mongoose";

const clienteSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
    trim: true,
  },
  cpf: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
  },
  endereco: {
    type: String,
    trim: true,
  },
  telefone: {
    type: String,
    trim: true,
  },
  data_criacao: {
    type: Date,
    default: Date.now,
  },
  produto_alugado: {
    type: String,
    trim: true,
  },
});

const Cliente = mongoose.model("Cliente", clienteSchema);

export default Cliente;
