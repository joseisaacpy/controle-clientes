const ul = document.querySelector("ul");
const spanQtdeClientes = document.getElementById("qtde-clientes");
const inputPesquisa = document.getElementById("pesquisa");

let listaClientes = []; // variável global para armazenar os dados carregados

async function listarClientes() {
  const request = await fetch("api/clientes");
  const data = await request.json();

  listaClientes = data; // guarda os clientes para filtrar depois
  // console.log(listaClientes);
  renderizarClientes(listaClientes);
}

// Função separada para renderizar a lista de clientes
function renderizarClientes(clientes) {
  ul.innerHTML = "";

  if (clientes.length === 0) {
    const li = document.createElement("li");
    li.textContent = "Nenhum cliente encontrado.";
    ul.appendChild(li);
    spanQtdeClientes.textContent = `Quantidade de Clientes: 0`;
    return;
  }

  spanQtdeClientes.textContent = `Quantidade de Clientes: ${clientes.length}`;

  clientes.forEach((item) => {
    const li = document.createElement("li");

    const itemCliente = document.createElement("div");
    itemCliente.classList.add("item-cliente");

    const dataFormatada = new Date(item.data_criacao).toLocaleDateString(
      "pt-BR"
    );

    itemCliente.innerHTML = `
      <p><strong>Nome</strong>: ${item.nome}</p>
      <p><strong>CPF</strong>: ${item.cpf}</p>
      <p><strong>Email</strong>: ${item.email}</p>
      <p><strong>Endereço</strong>: ${item.endereco}</p>
      <p><strong>Telefone</strong>: ${item.telefone}</p>
      <p><strong>Criação</strong>: ${dataFormatada}</p>
      <p><strong>Último produto alugado</strong>: ${item.produto_alugado}</p>
      <button class="btn-editar" data-id="${item._id}">Editar</button>
      <button class="btn-excluir" data-id="${item._id}" data-nome="${item.nome}">Excluir</button>
    `;
    li.appendChild(itemCliente);
    ul.appendChild(li);
  });

  adicionarEventListeners();
}

// Função para filtrar clientes com base no texto digitado
function filtrarClientes() {
  const termo = inputPesquisa.value.toLowerCase(); // valor do input em minúsculo

  // filtra a lista original carregada do servidor
  const clientesFiltrados = listaClientes.filter((cliente) =>
    cliente.nome.toLowerCase().includes(termo)
  );

  // renderiza os clientes filtrados na tela
  renderizarClientes(clientesFiltrados);
}

// Função para adicionar os event listeners nos botões
function adicionarEventListeners() {
  // botões de exclusão
  const btnsExcluir = document.querySelectorAll(".btn-excluir");
  btnsExcluir.forEach((btn) => {
    btn.addEventListener("click", excluirCliente);
  });

  // botões de edição
  const btnsEditar = document.querySelectorAll(".btn-editar");
  btnsEditar.forEach((btn) => {
    btn.addEventListener("click", editarCliente);
  });
}

// função para excluir um cliente
async function excluirCliente(e) {
  const botao = e.target;
  const clienteID = botao.getAttribute("data-id");
  const clienteNome = botao.getAttribute("data-nome");
  console.log(clienteID, clienteNome);

  const confirmacao = confirm(
    `Tem certeza que deseja excluir o cliente ${clienteNome}?`
  );
  if (!confirmacao) return;

  try {
    botao.disabled = true;
    botao.textContent = "Excluindo...";

    const response = await fetch(`/api/clientes/${clienteID}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    const result = await response.json();

    if (response.ok) {
      alert(`O cliente ${clienteNome} foi excluído com sucesso!`);
      listarClientes(); // atualiza a lista de clientes
    } else {
      alert("Erro ao excluir o cliente");
      console.error("Erro ao excluir o cliente:", result.message);
      botao.disabled = false;
      botao.textContent = "Excluir";
    }
  } catch (error) {
    console.error("Erro ao excluir o cliente:", error);
    alert("Erro ao excluir o cliente");
    botao.disabled = false;
    botao.textContent = "Excluir";
  }
}

// Função para editar um cliente
// Função para edição rápida usando prompt
async function editarCliente(event) {
  const clienteId = event.target.getAttribute("data-id");

  try {
    // Busca os dados atuais do cliente
    const respostaGet = await fetch(`/api/clientes/${clienteId}`);
    const clienteAtual = await respostaGet.json();

    // Usa prompt para perguntar os novos dados (se cancelar ou deixar vazio, mantém o valor atual)
    const novoNome =
      prompt("Digite o novo nome do cliente:", clienteAtual.nome) ||
      clienteAtual.nome;
    const novoCpf =
      prompt("Digite o novo CPF do cliente:", clienteAtual.cpf) ||
      clienteAtual.cpf;
    const novoEmail =
      prompt("Digite o novo email do cliente:", clienteAtual.email) ||
      clienteAtual.email;

    const novoEndereco =
      prompt("Digite o novo endereço do cliente:", clienteAtual.endereco) ||
      clienteAtual.endereco;

    const novoTelefone =
      prompt("Digite o novo telefone do cliente:", clienteAtual.telefone) ||
      clienteAtual.telefone;
    const novoProdutoAlugado =
      prompt(
        "Digite o novo produto alugado do cliente:",
        clienteAtual.produto_alugado
      ) || clienteAtual.produto_alugado;

    // Faz a requisição PUT com os novos (ou antigos) dados
    const respostaPut = await fetch(`/api/clientes/${clienteId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nome: novoNome,
        cpf: novoCpf,
        email: novoEmail,
        endereco: novoEndereco,
        telefone: novoTelefone,
        produto_alugado: novoProdutoAlugado,
      }),
    });

    const resultado = await respostaPut.json();
    alert(resultado.message || "Cliente atualizado com sucesso!");
    listarClientes();
  } catch (error) {
    console.error("Erro ao atualizar cliente:", error);
    alert("Erro ao atualizar cliente.");
  }
}

// Eventos
inputPesquisa.addEventListener("input", filtrarClientes);
document.addEventListener("DOMContentLoaded", listarClientes);
