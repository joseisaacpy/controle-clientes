// Máscara dinâmica para CPF ou CNPJ
const cpfInput = document.getElementById("cpf");
cpfInput.addEventListener("input", function (e) {
  let value = e.target.value.replace(/\D/g, ""); // remove tudo que não é número

  if (value.length <= 11) {
    // Aplica máscara de CPF: 000.000.000-00
    value = value
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  } else {
    // Aplica máscara de CNPJ: 00.000.000/0000-00
    value = value
      .replace(/^(\d{2})(\d)/, "$1.$2")
      .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/\.(\d{3})(\d)/, ".$1/$2")
      .replace(/(\d{4})(\d{1,2})$/, "$1-$2");
  }

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
  const endereco = e.target.endereco.value.trim();
  const telefone = e.target.telefone.value.trim();
  const produto_alugado = e.target.produtos.value.trim();

  // Função para mostrar erro (você pode adaptar para mostrar no HTML)
  function mostrarErro(msg) {
    alert(msg);
  }

  // Validações básicas:
  if (nome.length < 3) {
    mostrarErro("O nome deve ter pelo menos 3 caracteres.");
    return;
  }

  // Validação simples de CPF ou CNPJ
  const cpfCnpjRegex =
    /^(\d{3}\.\d{3}\.\d{3}\-\d{2}|\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2})$/;

  if (!cpfCnpjRegex.test(cpf)) {
    mostrarErro(
      "CPF ou CNPJ inválido. Use os formatos: XXX.XXX.XXX-XX ou XX.XXX.XXX/0001-XX"
    );
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
      body: JSON.stringify({
        nome,
        cpf,
        email,
        endereco,
        telefone,
        produto_alugado,
      }),
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
