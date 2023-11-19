const url = "http://localhost:3000";

// Função para limpar os campos de entrada
function limparCampos() {
  document.getElementById('nome').value = '';
  document.getElementById('cadastroEmail').value = '';
  document.getElementById('cadastroSenha').value = '';
  document.getElementById('confirmSenha').value = '';
  document.getElementById('email').value = '';
  document.getElementById('senha').value = '';
}

function exibirFormularioCadastro() {
  document.getElementById("login-form").style.display = "none"; // Oculta o formulário de login
  document.getElementById("cadastro-form").style.display = "block"; // Exibe o formulário de cadastro
  document.title = "Tela de Cadastro"; // Atualiza o título da página
  limparCampos();
}

function voltarAoFormularioLogin() {
  document.getElementById("cadastro-form").style.display = "none"; // Oculta o formulário de cadastro
  document.getElementById("login-form").style.display = "block"; // Exibe o formulário de login
  document.title = "Tela de Login"; // Atualiza o título da página
  limparCampos();
}

// Evento de clique no botão "Cadastre-se Grátis" para exibir o formulário de cadastro
document.getElementById("cadastro-btn").addEventListener("click", exibirFormularioCadastro);

// Evento de clique no botão "Voltar" para retornar ao formulário de login
document.getElementById("voltar-btn").addEventListener("click", voltarAoFormularioLogin);

// Função para realizar o cadastro de um usuário
async function cadastrar() {
  // Coleta os valores inseridos nos campos do formulário de cadastro 
  const name = document.getElementById('nome').value;
  const email = document.getElementById('cadastroEmail').value;
  const password = document.getElementById('cadastroSenha').value;
  const confirmacaoSenha = document.getElementById("confirmSenha").value;

  // Verifica se a senha e a confirmação da senha coincidem
  if (password === confirmacaoSenha) {
    const createUserDto = {
      name,
      email,
      password,
    };

    // Configura as opções para a solicitação POST
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",

      },
      body: JSON.stringify(createUserDto),
    };

    try {
      // Envia a solicitação POST para o servidor
      const response = await fetch(`${url}/user`, requestOptions);

      if (response.ok) {
        // Se a solicitação for bem-sucedida, exibe os dados retornados
        const data = await response.json();
        console.log(data);
        alert("Cadastro bem-sucedido!");
        limparCampos();
        voltarAoFormularioLogin();
      } 
      else {
        // Se houver um erro na solicitação, exibe o status de erro
        console.error("Erro na solicitação:", response.status);
        limparCampos();
      }
    } catch (error) {
      // Se ocorrer um erro durante a solicitação, exibe o erro
      console.error("Erro na solicitação:", error);
      limparCampos();
    }
  } else {
    // Se a senha e a confirmação da senha não coincidirem, exibe um erro
    console.error("Senha errada");
    alert("Senha errada!");
    limparCampos();
  }
}

// Função para buscar informações de um usuário por ID
async function buscarUsuario() {
  // Configura as opções para a solicitação GET
  const email = document.getElementById('email').value;
  const password = document.getElementById('senha').value;

  const realizarLogin = {
    email,
    password,
  };

  // console.log(realizarLogin);
  
  const requestLogin = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
   
    },
    body: JSON.stringify(realizarLogin),
  };

  try {
    // Envia a solicitação GET para o servidor
    const response = await fetch(`${url}/login`, requestLogin);

    console.log(response);

    if (response.ok) {
      // Se a solicitação for bem-sucedida, exibe os dados retornados
      const token = await response.json();

      const access_token = token.access_token;

      console.log(access_token)
      
      alert("Login bem-sucedido!");
      // Limpe os campos do formulário  
      limparCampos();
      window.location.href = `../index.html?token=${access_token}`;

      console.log(mudar);
    } else {
      // Se houver um erro na solicitação, exibe o status de erro
      console.error("Erro na solicitação:", response.status);
      alert("Senha ou Email Errado!");
      // Limpe os campos do formulário 
      limparCampos();   
    }
  } catch (error) {
    // Se ocorrer um erro durante a solicitação, exibe o erro
    console.error("Erro na solicitação:", error);
    // Limpe os campos do formulário
    limparCampos();    
  }
}