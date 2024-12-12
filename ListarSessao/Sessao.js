// Função para carregar a lista de sessões
async function loadSessions() {
  const sessionList = document.getElementById("session-list");

  try {
    const response = await fetch("http://localhost:8080/sessao");
    if (!response.ok) throw new Error(`Erro na API: ${response.status}`);

    const sessions = await response.json();
    let htmlContent = "";

    sessions.forEach((session) => {
      // Formata a data no formato desejado (exemplo: "05/12/2024")
      const [ano, mes, dia] = session.data.split("-");
      const dataFormatada = `${dia}/${mes}/${ano}`;

      // Formata a hora no formato desejado (exemplo: "14:30")
      const horaFormatada = session.hora;

      // Verifica se a sessão já está marcada como "indisponível"
      const isUnavailable = session.ingressos.length >= session.sala.capacidade;

      htmlContent += `
        <div class="col-12 col-md-6 col-lg-4">
          <div class="card shadow-sm">
            <img src="${session.filme.foto || 'https://via.placeholder.com/300x200'}" 
                 alt="${session.filme.titulo}" class="card-img-top" style="block-size: 200px; object-fit: cover;">
            <div class="card-body">
              <h5 class="card-title">${session.filme.titulo}</h5>
              <p class="card-text"><strong>Sala:</strong> ${session.sala.numero}</p>
              <p><strong>Capacidade:</strong> ${session.sala.capacidade} lugares</p>
              <p><strong>Data:</strong> ${dataFormatada}</p> <!-- Exibição da data formatada -->
              <p><strong>Horário:</strong> ${horaFormatada}</p> <!-- Exibição da hora formatada -->
              <p><strong>Ingressos vendidos:</strong> ${session.ingressos.length}</p>
              
              <!-- Mostrar como indisponível se a capacidade foi atingida -->
              ${isUnavailable ? 
                '<p class="text-danger"><strong>Indisponível</strong></p>' : 
                ''}
            </div>
            <div class="card-footer d-flex justify-content-between">
              <!-- Botões de ação (Editar/Excluir) -->
              ${isUnavailable ? 
                '<button class="btn btn-outline-secondary" disabled><i class="bi bi-pencil"></i> Editar</button>' :
                `<button class="btn btn-outline-primary" onclick="redirectToEditSession(${session.id})">
                  <i class="bi bi-pencil"></i> Editar
                </button>`}
              ${isUnavailable ? 
                '<button class="btn btn-outline-secondary" disabled><i class="bi bi-trash"></i> Excluir</button>' :
                `<button class="btn btn-outline-danger" onclick="deleteSession(${session.id})">
                  <i class="bi bi-trash"></i> Excluir
                </button>`}
            </div>
          </div>
        </div>
      `;
    });

    sessionList.innerHTML = htmlContent;
  } catch (error) {
    console.error("Erro ao carregar sessões:", error);
    sessionList.innerHTML = "<p class='text-danger'>Erro ao carregar sessões. Tente novamente mais tarde.</p>";
  }
}

// Função para redirecionar para a página de edição da sessão
function redirectToEditSession(id) {
  window.location.href = `../CadastraraSessao/cadastroSessao.html?id=${id}`;
}
// Função para deletar uma sessão
async function deleteSession(id) {
  if (confirm("Tem certeza que deseja excluir esta sessão?")) {
    try {
      const response = await fetch(`http://localhost:8080/sessao/${id}`, { method: "DELETE" });

      if (response.ok) {
        alert("Sessão excluída com sucesso!");
        loadSessions(); // Recarrega a lista de sessões
      } else {
        alert("Erro ao excluir a sessão.");
      }
    } catch (error) {
      console.error("Erro ao excluir sessão:", error);
      alert("Erro ao excluir sessão. Tente novamente.");
    }
  }
}

// Carrega a lista de sessões ao carregar a página
document.addEventListener("DOMContentLoaded", loadSessions);
