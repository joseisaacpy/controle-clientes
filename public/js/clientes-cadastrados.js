const ul = document.querySelector("ul");

async function listarClientes() {
  const request = await fetch("api/clientes");
  const data = await request.json();

  ul.innerHTML = "";
  if (data.length === 0) {
    const li = document.createElement("li");
    ul.appendChild(li);
    return;
  }

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

    <button>Editar</button>
    <button>Excluir</button>
    `;
    li.appendChild(itemCliente);

    ul.appendChild(li);
  });
}

document.addEventListener("DOMContentLoaded", listarClientes);
