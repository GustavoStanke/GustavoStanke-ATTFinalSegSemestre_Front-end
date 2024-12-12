// Função para carregar a lista de filmes
async function loadMovies() {
  const movieList = document.getElementById("movie-list");

  try {
    const response = await fetch("http://localhost:8080/filme");
    if (!response.ok) throw new Error(`Erro na API: ${response.status}`);

    const movies = await response.json();
    let htmlContent = "";

    movies.forEach((movie) => {
      htmlContent += `
        <div class="col-12 col-md-6 col-lg-4">
          <div class="card shadow-sm">
            <img src="${movie.foto || 'https://via.placeholder.com/300x200'}" alt="${movie.titulo}" class="card-img-top">
            <div class="card-body">
              <h5 class="card-title">${movie.titulo}</h5>
              <p class="card-text">${movie.descricao || "Descrição não disponível"}</p>
              <p><strong>Gênero:</strong> ${movie.genero}</p>
              <p><strong>Duração:</strong> ${movie.duracao} minutos</p>
              <p><strong>Classificação:</strong> ${movie.indicacao} anos</p>
            </div>
            <div class="card-footer d-flex justify-content-between">
              <button class="btn btn-outline-primary" onclick="redirectToEdit(${movie.id})">
                <i class="bi bi-pencil"></i> Editar
              </button>
              <button class="btn btn-outline-danger" onclick="deleteMovie(${movie.id})">
                <i class="bi bi-trash"></i> Excluir
              </button>
            </div>
          </div>
        </div>
      `;
    });

    movieList.innerHTML = htmlContent;
  } catch (error) {
    console.error("Erro ao carregar filmes:", error);
    movieList.innerHTML = "<p class='text-danger'>Erro ao carregar filmes. Tente novamente mais tarde.</p>";
  }
}

// Função para redirecionar para a página de edição do filme
function redirectToEdit(id) {
  // Redireciona para a página de edição dentro da pasta CadastrarFilme
  window.location.href = `../CadastrarFilme/cadastroFilme.html?id=${id}`; // Caminho atualizado
}
// Função para deletar um filme
async function deleteMovie(id) {
  if (confirm("Tem certeza que deseja excluir este filme?")) {
    try {
      const response = await fetch(`http://localhost:8080/filme/${id}`, { method: "DELETE" });

      if (response.ok) {
        alert("Filme excluído com sucesso!");
        loadMovies(); // Recarrega a lista de filmes
      } else {
        alert("Erro ao excluir o filme.");
      }
    } catch (error) {
      console.error("Erro ao excluir filme:", error);
      alert("Erro ao excluir filme. Tente novamente.");
    }
  }
}

// Carrega a lista de filmes ao carregar a página
document.addEventListener("DOMContentLoaded", loadMovies);
