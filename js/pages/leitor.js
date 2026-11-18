
const usuarioLogado = Auth.obterUsuarioLogado();

if (!usuarioLogado || usuarioLogado.perfil !== "leitor") {
    window.location.replace("login.html");
} else {
    const boasVindas = document.getElementById("boas-vindas");
    const botaoSair = document.getElementById("btn-sair");
    const botaoCatalogo = document.getElementById("btn-catalogo");
    const conteudoLeitor = document.getElementById("conteudo-leitor");
    const botaoEmprestimos = document.getElementById("btn-emprestimos");
    const botaoHistorico = document.getElementById("btn-historico");

botaoCatalogo.addEventListener("click", function() {
    const livros = Storage.carregar("bookspace_livros") || [];

    conteudoLeitor.innerHTML = `
    <h3>Catálogo de Livros</h3>

    <label for="pesquisa-livros">Pesquisar livros:</label>
    <input
        type="search"
        id="pesquisa-livros"
        placeholder="Digite o título, autor ou categoria"
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

        const isbn = document.createElement("p");
        isbn.textContent = `ISBN: ${livro.isbn}`;

        const categoria = document.createElement("p");
        categoria.textContent = `Categoria: ${livro.categoria}`;

        const quantidadeTotal = document.createElement("p");
        quantidadeTotal.textContent =
        `Quantidade total: ${livro.quantidadeTotal}`;

    const disponibilidade = document.createElement("p");
    disponibilidade.textContent =
    `Disponíveis: ${livro.quantidadeDisponivel}`;

item.append(
    titulo,
    autor,
    isbn,
    categoria,
    quantidadeTotal,
    disponibilidade
);
        listaLivros.appendChild(item);
    });
}
    const campoPesquisa = document.getElementById("pesquisa-livros");

campoPesquisa.addEventListener("input", function() {
    const pesquisa = campoPesquisa.value.toLowerCase().trim();

    const livrosFiltrados = livros.filter(function(livro) {
    return (
        livro.titulo.toLowerCase().includes(pesquisa) ||
        livro.autor.toLowerCase().includes(pesquisa) ||
        livro.categoria.toLowerCase().includes(pesquisa)
        );
    });

    exibirLivros(livrosFiltrados);
    
});

    exibirLivros(livros);
});

botaoEmprestimos.addEventListener("click", function() {
    const emprestimos = Storage.carregar("bookspace_emprestimos") || [];

    const meusEmprestimos = emprestimos.filter(function(emprestimo) {
        return emprestimo.leitorId === usuarioLogado.id &&
               emprestimo.status === "ativo";
    });


    conteudoLeitor.innerHTML = `
        <h3>Meus Empréstimos</h3>
        <div id="lista-emprestimos"></div>
    `;

    const listaEmprestimos = document.getElementById("lista-emprestimos");

    if (meusEmprestimos.length === 0) {
        listaEmprestimos.textContent =
            "Você não possui empréstimos ativos no momento.";
        return;
    }

const livros = Storage.carregar("bookspace_livros") || [];

meusEmprestimos.forEach(function(emprestimo) {
    const livro = livros.find(function(item) {
        return item.id === emprestimo.livroId;
    });

    const nomeLivro = livro ? livro.titulo : "Livro não encontrado";

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const dataPrevista = new Date(emprestimo.dataPrevista + "T00:00:00");

    const atrasado = hoje > dataPrevista;

    const item = document.createElement("article");

    const titulo = document.createElement("h4");
    titulo.textContent = nomeLivro;
    const dataEmprestimo = document.createElement("p");

    dataEmprestimo.textContent =
    `Data do empréstimo: ${
        new Date(
            emprestimo.dataEmprestimo + "T12:00:00"
        ).toLocaleDateString("pt-BR")
    }`;
    const devolucao = document.createElement("p");
    devolucao.textContent =
        `Devolução prevista: ${dataPrevista.toLocaleDateString("pt-BR")}`;

    const status = document.createElement("p");
    status.textContent = atrasado ? "Status: Atrasado" : "Status: Em dia";
    status.style.color = atrasado ? "#c62828" : "#2e7d32";

    item.append(titulo,dataEmprestimo, devolucao, status);
    listaEmprestimos.appendChild(item);
});
});

botaoHistorico.addEventListener("click", function() {
    const emprestimos = Storage.carregar("bookspace_emprestimos") || [];

    const meuHistorico = emprestimos.filter(function(emprestimo) {
        return emprestimo.leitorId === usuarioLogado.id &&
               emprestimo.status === "devolvido";
    });

    conteudoLeitor.innerHTML = `
        <h3>Meu Histórico</h3>
        <div id="lista-historico"></div>
    `;

    const listaHistorico = document.getElementById("lista-historico");

    if (meuHistorico.length === 0) {
        listaHistorico.textContent =
            "Você ainda não possui livros devolvidos no histórico.";
        return;
    }

const livros = Storage.carregar("bookspace_livros") || [];

meuHistorico.forEach(function(emprestimo) {
    const livro = livros.find(function(item) {
        return item.id === emprestimo.livroId;
    });

    const nomeLivro = livro ? livro.titulo : "Livro não encontrado";

    const item = document.createElement("article");

    const titulo = document.createElement("h4");
    titulo.textContent = nomeLivro;

    const dataEmprestimo = document.createElement("p");
    dataEmprestimo.textContent =
        `Data do empréstimo: ${new Date(emprestimo.dataEmprestimo + "T00:00:00").toLocaleDateString("pt-BR")}`;

    const dataDevolucao = document.createElement("p");
    dataDevolucao.textContent =
        `Data da devolução: ${new Date(emprestimo.dataDevolucao + "T00:00:00").toLocaleDateString("pt-BR")}`;

    const status = document.createElement("p");
    status.textContent = "Status: Devolvido";
    status.style.color = "#2e7d32";

    item.append(titulo, dataEmprestimo, dataDevolucao, status);
    listaHistorico.appendChild(item);
});
});

    boasVindas.textContent = `Bem-vindo(a), ${usuarioLogado.nome}!`;

    botaoSair.addEventListener("click", function() {
        Auth.logout();
        window.location.replace("login.html");
    });
}
