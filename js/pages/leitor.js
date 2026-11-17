
const usuarioLogado = Auth.obterUsuarioLogado();

if (!usuarioLogado || usuarioLogado.perfil !== "leitor") {
    window.location.replace("login.html");
} else {
    const boasVindas = document.getElementById("boas-vindas");
    const botaoSair = document.getElementById("btn-sair");
    const botaoCatalogo = document.getElementById("btn-catalogo");
    const conteudoLeitor = document.getElementById("conteudo-leitor");

botaoCatalogo.addEventListener("click", function() {
    const livros = Storage.carregar("bookspace_livros") || [];

    conteudoLeitor.innerHTML = `
    <h3>Catálogo de Livros</h3>

    <label for="pesquisa-livros">Pesquisar livros:</label>
    <input
        type="search"
        id="pesquisa-livros"
        placeholder="Digite o título ou autor"
    >

        <div id="lista-livros"></div>
    `;

    const listaLivros = document.getElementById("lista-livros");
    function exibirLivros(lista) {
    listaLivros.innerHTML = "";

    if (lista.length === 0) {
        listaLivros.textContent = "Nenhum livro encontrado.";
        return;
    }

    lista.forEach(function(livro) {
        const item = document.createElement("article");

        const titulo = document.createElement("h4");
        titulo.textContent = livro.titulo;

        const autor = document.createElement("p");
        autor.textContent = `Autor: ${livro.autor}`;

        const disponibilidade = document.createElement("p");
        disponibilidade.textContent =
            `Disponíveis: ${livro.quantidadeDisponivel}`;

        item.append(titulo, autor, disponibilidade);
        listaLivros.appendChild(item);
    });
}
    const campoPesquisa = document.getElementById("pesquisa-livros");

campoPesquisa.addEventListener("input", function() {
    const pesquisa = campoPesquisa.value.toLowerCase().trim();

    const livrosFiltrados = livros.filter(function(livro) {
        return (
            livro.titulo.toLowerCase().includes(pesquisa) ||
            livro.autor.toLowerCase().includes(pesquisa)
        );
    });

    exibirLivros(livrosFiltrados);
    
});

    exibirLivros(livros);
});

    boasVindas.textContent = `Bem-vindo(a), ${usuarioLogado.nome}!`;

    botaoSair.addEventListener("click", function() {
        Auth.logout();
        window.location.replace("login.html");
    });
}
