// Função para verificar se estamos editando uma sala
function checkForEdit() {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");

  if (id) {
    loadSalaDetails(id); // Carrega os detalhes da sala por ID
    document.getElementById("formTitle").innerText = "Editar Sala"; // Atualiza o título da página
  } else {
    document.getElementById("formTitle").innerText = "Cadastrar Sala";
  }
}

// Função para carregar os detalhes de uma sala por ID
async function loadSalaDetails(id) {
  try {
    const response = await fetch(`http://localhost:8080/salas/${id}`);
    if (!response.ok) throw new Error("Erro ao carregar os dados da sala.");

    const sala = await response.json();

    // Preenche os campos do formulário com os dados da sala
    document.getElementById("numero").value = sala.numero;
    document.getElementById("capacidade").value = sala.capacidade;
  } catch (error) {
    console.error(error);
    alert("Erro ao carregar os dados da sala. Tente novamente mais tarde.");
  }
}

// Submissão do formulário para salvar a sala (adicionar ou editar)
document.getElementById("cadastroSalaForm").addEventListener("submit", async function (event) {
  event.preventDefault();

  const id = new URLSearchParams(window.location.search).get("id"); // ID da sala para edição (se existir)
  const data = {
    numero: document.getElementById("numero").value,
    capacidade: document.getElementById("capacidade").value,
    disponivel: 1 
  };

  const url = id ? `http://localhost:8080/salas/${id}` : "http://localhost:8080/salas";
  const method = id ? "PUT" : "POST";

  try {
    const response = await fetch(url, {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      alert("Sala salva com sucesso!");
      const confirmRedirect = confirm("Deseja voltar à lista de salas?");
      if (confirmRedirect) {
        window.location.href = "../Sala/Salas.html"; // Redireciona para a lista de salas
      }
    } else {
      alert("Erro ao salvar a sala. Por favor, tente novamente.");
    }
  } catch (error) {
    console.error("Erro ao salvar a sala:", error);
    alert("Erro ao salvar a sala. Tente novamente mais tarde.");
  }
});

// Executa ao carregar a página para verificar se estamos editando uma sala
checkForEdit();
