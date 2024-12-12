document.addEventListener('DOMContentLoaded', async () => {
  const filmeSelect = document.getElementById('filmeSelect');
  const salaSelect = document.getElementById('salaSelect');
  const idSessao = new URLSearchParams(window.location.search).get('id');

  try {
    // Carregar lista de filmes
    const filmesResponse = await fetch('http://localhost:8080/filme');
    const filmes = await filmesResponse.json();
    filmes.forEach(filme => {
      const option = document.createElement('option');
      option.value = filme.id;
      option.textContent = filme.titulo;
      filmeSelect.appendChild(option);
    });

    // Carregar lista de salas
    const salasResponse = await fetch('http://localhost:8080/salas');
    const salas = await salasResponse.json();
    salas.forEach(sala => {
      const option = document.createElement('option');
      option.value = sala.id;
      option.textContent = `Sala ${sala.numero}`;
      salaSelect.appendChild(option);
    });

    // Se estivermos editando uma sessão, carregar os dados
    if (idSessao) {
      loadSessaoDetails(idSessao);
    }
  } catch (error) {
    console.error('Erro ao carregar filmes ou salas:', error);
    alert('Erro ao carregar opções de filmes ou salas.');
  }
});

// Função para carregar os detalhes de uma sessão
async function loadSessaoDetails(id) {
  try {
    const response = await fetch(`http://localhost:8080/sessao/${id}`);
    if (!response.ok) throw new Error("Erro ao carregar os dados da sessão.");

    const sessao = await response.json();

    // Preenche os campos do formulário com os dados da sessão
    document.getElementById('filmeSelect').value = sessao.filme.id;
    document.getElementById('salaSelect').value = sessao.sala.id;
    document.getElementById('dataSessao').value = sessao.data;
    document.getElementById('horaSessao').value = sessao.hora.split(':')[0]; // Pega apenas a hora

    // Atualiza o título da página para "Editar Sessão"
    document.getElementById('formTitle').innerText = 'Editar Sessão';
  } catch (error) {
    console.error(error);
    alert('Erro ao carregar os dados da sessão.');
  }
}

// Submissão do formulário para salvar a sessão (adicionar ou editar)
document.getElementById('cadastroSessaoForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const form = event.target;

  // Verifica se o formulário é válido
  if (!form.checkValidity()) {
    form.classList.add('was-validated');
    return;
  }

  const idSessao = new URLSearchParams(window.location.search).get('id');
  const filmeId = document.getElementById('filmeSelect').value;
  const salaId = document.getElementById('salaSelect').value;
  const data = document.getElementById('dataSessao').value;
  const hora = document.getElementById('horaSessao').value + ':00'; // Garantir segundos no formato

  try {
    // Não verifica a disponibilidade da sala, apenas busca os dados necessários
    const sessao = {
      filme: { id: filmeId },
      sala: { id: salaId },
      data,
      hora
    };

    // Editar a sessão, se ID estiver presente, caso contrário criar nova sessão
    const url = idSessao ? `http://localhost:8080/sessao/${idSessao}` : 'http://localhost:8080/sessao';
    const method = idSessao ? 'PUT' : 'POST';

    const response = await fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sessao)
    });

    if (response.ok) {
      alert('Sessão salva com sucesso!');
      form.reset();
      form.classList.remove('was-validated');
      const confirmRedirect = confirm("Deseja voltar à lista de sessões?");
      if (confirmRedirect) {
        window.location.href = "../ListarSessao/ListaSessao.html"; // Substitua pelo caminho correto
      }
    } else {
      alert('Erro ao salvar a sessão.');
    }
  } catch (error) {
    console.error('Erro ao salvar a sessão:', error);
    alert('Erro ao salvar a sessão. Tente novamente mais tarde.');
  }


});
