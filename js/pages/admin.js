
const usuarioLogado = Auth.obterUsuarioLogado();

if (!usuarioLogado || usuarioLogado.perfil !== "bibliotecario") {
    window.location.replace("login.html");
} else {
    const botaoSair = document.getElementById("btnSair");
    const conteudo = document.getElementById("conteudo");
    const botaoLivros = document.getElementById("btnLivros");

botaoLivros.addEventListener("click", function () {
    const livros = Storage.carregar("bookspace_livros") || [];

    
conteudo.innerHTML = `
    <h3>Gerenciamento de Livros</h3>
    <p>Cadastre e consulte os livros da biblioteca.</p>

    <form id="formLivro">
        <input type="text" id="tituloLivro"
            placeholder="Título do livro" required>

        <input type="text" id="autorLivro"
            placeholder="Autor" required>

        <input type="text" id="isbnLivro"
            placeholder="ISBN" required>

        <input type="text" id="categoriaLivro"
            placeholder="Categoria" required>

        <input type="number" id="quantidadeLivro"
            placeholder="Quantidade" min="1" required>

        <button type="submit">Cadastrar Livro</button>
    </form>

    <p id="mensagemLivro"></p>

    <h3>Livros cadastrados</h3>
    <div id="listaLivros"></div>
`;


    const listaLivros = document.getElementById("listaLivros");

const formLivro = document.getElementById("formLivro");
const mensagemLivro = document.getElementById("mensagemLivro");

formLivro.addEventListener("submit", function (evento) {
    evento.preventDefault();

    const titulo = document.getElementById("tituloLivro").value.trim();
    const autor = document.getElementById("autorLivro").value.trim();
    const isbn = document.getElementById("isbnLivro").value.trim();
    const categoria = document.getElementById("categoriaLivro").value.trim();
    const quantidade = Number(document.getElementById("quantidadeLivro").value);

    const livrosCadastrados = Storage.carregar("bookspace_livros") || [];

    if (!titulo || !autor || !isbn || !categoria ||
        !Number.isInteger(quantidade) || quantidade < 1) {
        mensagemLivro.textContent = "Preencha os campos corretamente.";
        return;
    }

    const isbnExistente = livrosCadastrados.some(function (livro) {
        return livro.isbn === isbn;
    });

    if (isbnExistente) {
        mensagemLivro.textContent = "Já existe um livro com esse ISBN.";
        return;
    }

    const novoLivro = {
        id: "L" + Date.now(),
        titulo: titulo,
        autor: autor,
        isbn: isbn,
        categoria: categoria,
        quantidadeTotal: quantidade,
        quantidadeDisponivel: quantidade
    };

    livrosCadastrados.push(novoLivro);
    Storage.salvar("bookspace_livros", livrosCadastrados);

    mensagemLivro.textContent = "Livro cadastrado com sucesso!";
    formLivro.reset();

    const item = document.createElement("p");
    item.textContent = `${novoLivro.titulo} — ${novoLivro.autor} | Disponíveis: ${novoLivro.quantidadeDisponivel}`;

    const mensagemVazia = listaLivros.textContent.trim() === "Nenhum livro cadastrado.";

    if (mensagemVazia) {
        listaLivros.textContent = "";
    }

    listaLivros.appendChild(item);
});


    if (livros.length === 0) {
        listaLivros.textContent = "Nenhum livro cadastrado.";
        return;
    }

    livros.forEach(function (livro) {
        const item = document.createElement("p");
        item.textContent = `${livro.titulo} — ${livro.autor} | Disponíveis: ${livro.quantidadeDisponivel}`;
        listaLivros.appendChild(item);
    });
});

    conteudo.innerHTML = `
        <h3>Bem-vindo, ${usuarioLogado.nome}!</h3>
        <p>Selecione uma opção acima para gerenciar a biblioteca.</p>
    `;

    botaoSair.addEventListener("click", function () {
        Auth.logout();
        window.location.replace("login.html");
    });
}
