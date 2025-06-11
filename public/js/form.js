// funcionalidade de mascara para os inputs cpf e telefone
const cpfInput = document.getElementById("cpf");
cpfInput.addEventListener("input", function (e) {
  let value = e.target.value.replace(/\D/g, ""); // Remove tudo que não for número
  if (value.length > 3 && value.length <= 6)
    value = value.replace(/(\d{3})(\d+)/, "$1.$2");
  else if (value.length > 6 && value.length <= 9)
    value = value.replace(/(\d{3})(\d{3})(\d+)/, "$1.$2.$3");
  else if (value.length > 9)
    value = value.replace(/(\d{3})(\d{3})(\d{3})(\d+)/, "$1.$2.$3-$4");
  e.target.value = value;
});

const telInput = document.getElementById("telefone");
telInput.addEventListener("input", function (e) {
  let value = e.target.value.replace(/\D/g, ""); // Remove tudo que não for número
  if (value.length > 2 && value.length <= 7)
    value = value.replace(/(\d{2})(\d+)/, "($1) $2");
  else if (value.length > 7)
    value = value.replace(/(\d{2})(\d{5})(\d+)/, "($1) $2-$3");
  e.target.value = value;
});

// Formulário de cadastro
const form = document.querySelector("form");

// Evento de envio do formulário
form.addEventListener("submit", async (e) => {
  // Evita o comportamento padrão do formulário
  e.preventDefault();

  const nome = e.target.nome.value.trim();
  const cpf = e.target.cpf.value.trim();
  const email = e.target.email.value.trim();
  const telefone = e.target.telefone.value.trim();

  // Função para mostrar erro (você pode adaptar para mostrar no HTML)
  function mostrarErro(msg) {
    alert(msg);
  }

  // Validações básicas:
  if (nome.length < 3) {
    mostrarErro("O nome deve ter pelo menos 3 caracteres.");
    return;
  }

  // Validação simples de CPF (apenas para checar formato)
  const cpfRegex = /^\d{3}\.\d{3}\.\d{3}\-\d{2}$/;
  if (!cpfRegex.test(cpf)) {
    mostrarErro("CPF inválido. Use o formato XXX.XXX.XXX-XX");
    return;
  }

  // Validação básica de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    mostrarErro("E-mail inválido.");
    return;
  }

  // Telefone é opcional, mas se preencher, validar
  if (telefone.length > 0) {
    const telefoneRegex = /^\(?\d{2}\)?\s?\d{4,5}\-?\d{4}$/;
    if (!telefoneRegex.test(telefone)) {
      mostrarErro("Telefone inválido. Exemplo: (11) 99999-9999");
      return;
    }
  }

  // Se passou todas validações, envia para o backend
  try {
    const response = await fetch("/api/clientes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nome, cpf, email, telefone }),
    });

    if (response.ok) {
      alert("Cliente cadastrado com sucesso!");
      form.reset();
    } else {
      alert("Erro ao cadastrar cliente.");
    }
  } catch (error) {
    alert("Erro na conexão com o servidor.");
  }
});
