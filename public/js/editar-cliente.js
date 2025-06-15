const urlParams = new URLSearchParams(window.location.search);
const clienteId = urlParams.get("id");

const form = document.getElementById("formEditar");

// Buscar os dados do cliente:
async function carregarCliente() {
  try {
    const response = await fetch(`/api/clientes/${clienteId}`);
    const cliente = await response.json();

    document.getElementById("id").value = cliente.id;
    document.getElementById("nome").value = cliente.nome;
    document.getElementById("cpf").value = cliente.cpf;
    document.getElementById("email").value = cliente.email;
    document.getElementById("telefone").value = cliente.telefone;
    document.getElementById("produtos").value = cliente.produto_alugado;
  } catch (error) {
    alert("Erro ao carregar dados do cliente.");
  }
}

carregarCliente();

// Enviar as alterações:
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const id = document.getElementById("id").value;
  const nome = document.getElementById("nome").value.trim();
  const cpf = document.getElementById("cpf").value.trim();
  const email = document.getElementById("email").value.trim();
  const telefone = document.getElementById("telefone").value.trim();
  const produto_alugado = document.getElementById("produtos").value;

  try {
    const response = await fetch(`/api/clientes/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, cpf, email, telefone, produto_alugado }),
    });

    if (response.ok) {
      alert("Cliente atualizado com sucesso!");
      window.location.href = "/clientes";
    } else {
      alert("Erro ao atualizar cliente.");
    }
  } catch (error) {
    alert("Erro na requisição.");
  }
});
