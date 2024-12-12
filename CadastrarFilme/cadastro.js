// Função para verificar se estamos editando um filme
function checkForEdit() {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");

  if (id) {
    loadMovieDetails(id); // Carrega os detalhes do filme por ID
    document.getElementById("formTitle").innerText = "Editar Filme"; // Atualiza o título da página
  } else {
    document.getElementById("formTitle").innerText = "Cadastrar Filme";
  }
}

// Função para carregar os detalhes de um filme por ID
async function loadMovieDetails(id) {
  try {
    const response = await fetch(`http://localhost:8080/filme/${id}`);
    if (!response.ok) throw new Error("Erro ao carregar os dados do filme.");

    const filme = await response.json();

    // Preenche os campos do formulário com os dados do filme
    document.getElementById("filmeId").value = filme.id;
    document.getElementById("titulo").value = filme.titulo;
    document.getElementById("duracao").value = filme.duracao;
    document.getElementById("genero").value = filme.genero;
    document.getElementById("indicacao").value = filme.indicacao;
    document.getElementById("descricao").value = filme.descricao;
    document.getElementById("foto").value = filme.foto;

    // Atualiza a pré-visualização da imagem
    const preview = document.getElementById("imagePreview");
    if (filme.foto) {
      preview.src = filme.foto;
      preview.style.display = "block";
    } else {
      preview.style.display = "none";
    }
  } catch (error) {
    console.error(error);
    alert("Erro ao carregar os dados do filme. Tente novamente mais tarde.");
  }
}

// Exibe a pré-visualização da imagem enquanto o usuário digita o link
document.getElementById('foto').addEventListener('input', function (event) {
  const imageUrl = event.target.value;
  const preview = document.getElementById('imagePreview');

  // Valida se a URL inserida é de uma imagem
  const isImageUrl = imageUrl.match(/\.(jpeg|jpg|gif|png)$/) != null;

  if (isImageUrl) {
    preview.src = imageUrl;
    preview.style.display = 'block';
  } else {
    preview.style.display = 'none';
  }
});

// Submissão do formulário para salvar o filme (adicionar ou editar)
document.getElementById("cadastroFilmeForm").addEventListener("submit", async function (event) {
  event.preventDefault();

  const id = document.getElementById("filmeId").value; // Campo oculto para edição
  const data = {
    titulo: document.getElementById("titulo").value,
    duracao: document.getElementById("duracao").value,
    genero: document.getElementById("genero").value,
    indicacao: document.getElementById("indicacao").value,
    descricao: document.getElementById("descricao").value,
    foto: document.getElementById("foto").value,
  };

  const url = id ? `http://localhost:8080/filme/${id}` : "http://localhost:8080/filme";
  const method = id ? "PUT" : "POST";

  try {
    const response = await fetch(url, {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      alert("Filme salvo com sucesso!");
      const confirmRedirect = confirm("Deseja voltar à lista de filmes?");
      if (confirmRedirect) {
        window.location.href = "../ListarFilmes/ListaFilmes.html";
      }
    } else {
      alert("Erro ao salvar o filme. Por favor, tente novamente.");
    }
  } catch (error) {
    console.error("Erro ao salvar o filme:", error);
    alert("Erro ao salvar o filme. Tente novamente mais tarde.");
  }
});

// Executa ao carregar a página para verificar se estamos editando um filme
checkForEdit();
