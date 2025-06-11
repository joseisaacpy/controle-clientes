const ul = document.querySelector("ul");
const spanQtdeClientes = document.getElementById("qtde-clientes");

async function listarClientes() {
  const request = await fetch("api/clientes");
  const data = await request.json();

  ul.innerHTML = "";
  if (data.length === 0) {
    const li = document.createElement("li");
    li.textContent = "Nenhum cliente cadastrado.";
    ul.appendChild(li);
    return;
  }

  spanQtdeClientes.textContent = `Quantidade de Clientes: ${data.length}`;

  data.forEach((item) => {
    const li = document.createElement("li");

    const itemCliente = document.createElement("div");
    itemCliente.classList.add("item-cliente");

    // Formatar a data
    const dataFormatada = new Date(item.criado_em).toLocaleDateString("pt-BR");

    itemCliente.innerHTML = `
    <p>Nome: ${item.nome}</p>
    <p>CPF: ${item.cpf}</p>
    <p>Email: ${item.email}</p>
    <p>Telefone: ${item.telefone}</p>
    <p>Criação: ${dataFormatada}</p>

    <button class="btn-editar" data-id="${item.id}">Editar</button>
    <button class="btn-excluir" data-id="${item.id}" data-nome="${item.nome}">Excluir</button>
    `;
    li.appendChild(itemCliente);

    ul.appendChild(li);
  });
  // Adicionar event listeners aos botões após criar os elementos
  adicionarEventListeners();
}

// funcao para adicionar os event listeners
function adicionarEventListeners() {
  // botões de exclusão
  const btnsExcluir = document.querySelectorAll(".btn-excluir");
  btnsExcluir.forEach((btn) => {
    // adiciona função de deletar aos botoes de excluir
    btn.addEventListener("click", excluirCliente);
  });
  // botões de edição
  const btnsEditar = document.querySelectorAll(".btn-editar");
  btnsEditar.forEach((btn) => {
    // adiciona função de editar aos botoes de editar
    btn.addEventListener("click", editarCliente);
  });
}

// função para excluir um cliente
async function excluirCliente(e) {
  const botao = e.target;
  const clienteID = botao.getAttribute("data-id");
  const clienteNome = botao.getAttribute("data-nome");
  // confirmação antes de excluir
  const confirmacao = confirm(
    "Tem certeza que deseja excluir o cliente " + clienteNome + "?"
  );

  if (!confirmacao) {
    return; // se cancelar, nao faz nada
  }
  // se deseja excluir
  try {
    // Desabilitar o botão durante a requisição
    botao.disabled = true;
    botao.textContent = "Excluindo...";

    // faz requisicao para excluir o cliente
    const response = await fetch(`/api/clientes/${clienteID}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const result = await response.json();
    if (response.ok && result.success) {
      alert(`O cliente ${clienteNome} foi excluido com sucesso!`);
      // ✅ Atualizar contador antes de recarregar
      const clientesAtuais = document.querySelectorAll(".item-cliente").length;
      spanQtdeClientes.textContent = `Quantidade de Clientes: ${
        clientesAtuais - 1
      }`;

      listarClientes();
    } else {
      alert("Erro ao excluir o cliente");
      console.log("Erro ao excluir o cliente:", result.error);
      // Reabilitar o botão em caso de erro
      botao.disabled = false;
      botao.textContent = "Excluir";
    }
  } catch (error) {
    console.log("Erro ao excluir o cliente:", error);
    alert("Erro ao excluir o cliente");
    // Reabilitar o botão em caso de erro
    botao.disabled = false;
    botao.textContent = "Excluir";
  }
}

// Função placeholder para edição (implementar depois)
function editarCliente(event) {
  const clienteId = event.target.getAttribute("data-id");
  alert(`Função de editar cliente ID: ${clienteId} - A implementar!`);
}

document.addEventListener("DOMContentLoaded", listarClientes);
