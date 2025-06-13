const ul = document.querySelector("ul");
const spanQtdeClientes = document.getElementById("qtde-clientes");
const inputPesquisa = document.getElementById("pesquisa");

let listaClientes = []; // variável global para armazenar os dados carregados

async function listarClientes() {
  const request = await fetch("api/clientes");
  const data = await request.json();

  listaClientes = data; // guarda os clientes para filtrar depois
  console.log(listaClientes);
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
      <p>Nome: ${item.nome}</p>
      <p>CPF: ${item.cpf}</p>
      <p>Email: ${item.email}</p>
      <p>Telefone: ${item.telefone}</p>
      <p>Criação: ${dataFormatada}</p>
      <p>Último produto alugado: ${item.produto_alugado}</p>
      <button class="btn-editar" data-id="${item.id}">Editar</button>
      <button class="btn-excluir" data-id="${item.id}" data-nome="${item.nome}">Excluir</button>
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

    if (response.ok && result.success) {
      alert(`O cliente ${clienteNome} foi excluído com sucesso!`);
      listarClientes();
    } else {
      alert("Erro ao excluir o cliente");
      console.error("Erro ao excluir o cliente:", result.error);
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

// Função placeholder para edição
function editarCliente(event) {
  const clienteId = event.target.getAttribute("data-id");
  alert(`Função de editar cliente ID: ${clienteId} - A implementar!`);
}

// Eventos
inputPesquisa.addEventListener("input", filtrarClientes);
document.addEventListener("DOMContentLoaded", listarClientes);
