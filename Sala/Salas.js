// Função para carregar as salas cadastradas dinamicamente
async function loadSalas() {
  const salaList = document.getElementById("sala-list");

  try {
    // Faz a requisição para a API que retorna as salas
    const response = await fetch("http://localhost:8080/salas");
    if (!response.ok) throw new Error(`Erro na API: ${response.status}`);

    // Obtém as salas da resposta da API
    const salas = await response.json();
    let htmlContent = "";

    // Para cada sala, cria um item de lista com seus detalhes
    salas.forEach((sala) => {
      htmlContent += `
        <li class="list-group-item d-flex justify-content-between align-items-center shadow-sm rounded mb-3">
            <div>
                <h5 class="mb-1">Sala ${sala.numero}</h5>
                <p class="mb-1">Capacidade: ${sala.capacidade || "Não definida"}</p>
            </div>
            <div class="d-flex align-items-center">
                <!-- Exibe badge de disponibilidade -->
                <span class="badge ${sala.disponivel ? 'bg-success' : 'bg-danger'} me-3">
                    ${sala.disponivel ? 'Disponível' : 'Indisponível'}
                </span>
                <!-- Botões de Editar e Excluir -->
                <button class="btn btn-info btn-sm me-2" onclick="redirectToEdit(${sala.id})">
                    <i class="bi bi-pencil-square"></i> Editar
                </button>
                <button class="btn btn-danger btn-sm" onclick="deleteSala(${sala.id})">
                    <i class="bi bi-trash"></i> Excluir
                </button>
            </div>
        </li>
      `;
    });

    // Insere os itens de salas na lista dentro do HTML
    salaList.innerHTML = htmlContent;
  } catch (error) {
    console.error("Erro ao carregar salas:", error);
    salaList.innerHTML = "<p class='text-danger'>Erro ao carregar salas. Tente novamente mais tarde.</p>";
  }
}

// Função para redirecionar para a tela de cadastro de salas
function navigateToCadastro() {
  window.location.href = '../CadastroSala/CadastroSala.html'; // Redireciona para a página de cadastro de salas
}

// Função para redirecionar para a tela de edição de sala
function redirectToEdit(salaId) {
  window.location.href = `../CadastroSala/CadastroSala.html?id=${salaId}`; // Passa o ID da sala para a página de cadastro
}

// Função para excluir uma sala
async function deleteSala(salaId) {
  const confirmation = confirm("Tem certeza que deseja excluir esta sala?");
  if (!confirmation) return;

  try {
    // Faz a requisição para excluir a sala
    const response = await fetch(`http://localhost:8080/salas/${salaId}`, {
      method: 'DELETE',
    });

    // Verifica se a requisição foi bem-sucedida
    if (!response.ok) throw new Error(`Erro ao excluir a sala: ${response.status}`);

    // Recarrega a lista de salas após a exclusão
    loadSalas();
  } catch (error) {
    console.error("Erro ao excluir sala:", error);
    alert("Erro ao excluir a sala. Tente novamente mais tarde.");
  }
}

// Chama a função para carregar as salas assim que a página carregar
window.onload = loadSalas;
