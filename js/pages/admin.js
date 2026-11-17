
const usuarioLogado = Auth.obterUsuarioLogado();

if (!usuarioLogado || usuarioLogado.perfil !== "bibliotecario") {
    window.location.replace("login.html");
} else {
    const botaoSair = document.getElementById("btnSair");
    const botaoLivros = document.getElementById("btnLivros");
    const conteudo = document.getElementById("conteudo");

    conteudo.innerHTML = `
        <h3>Bem-vindo, ${usuarioLogado.nome}!</h3>
        <p>Selecione uma opção acima para gerenciar a biblioteca.</p>
    `;

    botaoSair.addEventListener("click", function () {
        Auth.logout();
        window.location.replace("login.html");
    });

    botaoLivros.addEventListener("click", function () {
        let livroEmEdicaoId = null;

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
                    placeholder="Quantidade" min="1" step="1" required>

                <button type="submit" id="btnSalvarLivro">
                    Cadastrar Livro
                </button>
            </form>

            <p id="mensagemLivro"></p>

            <h3>Livros cadastrados</h3>
            <div id="listaLivros"></div>
        `;

        const formLivro = document.getElementById("formLivro");
        const mensagemLivro = document.getElementById("mensagemLivro");
        const listaLivros = document.getElementById("listaLivros");
        const botaoSalvarLivro = document.getElementById("btnSalvarLivro");

        // Mostra os livros cadastrados e cria os botões de edição.
        function listarLivros() {
            const livros = Storage.carregar("bookspace_livros") || [];

            listaLivros.innerHTML = "";

            if (livros.length === 0) {
                listaLivros.textContent = "Nenhum livro cadastrado.";
                return;
            }

            livros.forEach(function (livro) {
                const item = document.createElement("div");
                item.className = "item-livro";

                const descricao = document.createElement("span");
                descricao.textContent =
                    `${livro.titulo} — ${livro.autor} | Disponíveis: ${livro.quantidadeDisponivel}`;

                const botaoEditar = document.createElement("button");
                botaoEditar.type = "button";
                botaoEditar.textContent = "Editar";
                botaoEditar.className = "btn-editar";

                botaoEditar.addEventListener("click", function () {
                    livroEmEdicaoId = livro.id;

                    document.getElementById("tituloLivro").value = livro.titulo;
                    document.getElementById("autorLivro").value = livro.autor;
                    document.getElementById("isbnLivro").value = livro.isbn;
                    document.getElementById("categoriaLivro").value = livro.categoria;
                    document.getElementById("quantidadeLivro").value = livro.quantidadeTotal;

                    botaoSalvarLivro.textContent = "Salvar Alterações";

                    mensagemLivro.textContent =
                        "Editando: " + livro.titulo;
                });

                const botaoExcluir = document.createElement("button");
                botaoExcluir.type = "button";
                botaoExcluir.textContent = "Excluir";
                botaoExcluir.className = "btn-excluir";


                botaoExcluir.addEventListener("click", function () {
                    const emprestimos = Storage.carregar("bookspace_emprestimos") || [];

                    const possuiEmprestimoAtivo = emprestimos.some(function (emprestimo) {
                        return emprestimo.livroId === livro.id &&
                            emprestimo.status === "ativo";
                    });

                    if (possuiEmprestimoAtivo) {
                        mensagemLivro.textContent =
                            "Não é possível excluir um livro com empréstimos ativos.";
                        return;
                    }

                    const confirmar = window.confirm(
                        "Deseja realmente excluir o livro: " + livro.titulo + "?"
                    );

                    if (!confirmar) {
                        return;
                    }

                    const livros = Storage.carregar("bookspace_livros") || [];

                    const livrosAtualizados = livros.filter(function (item) {
                        return item.id !== livro.id;
                    });

                    Storage.salvar("bookspace_livros", livrosAtualizados);

                    if (livroEmEdicaoId === livro.id) {
                        livroEmEdicaoId = null;
                        formLivro.reset();
                        botaoSalvarLivro.textContent = "Cadastrar Livro";
                    }

                    mensagemLivro.textContent = "Livro excluído com sucesso!";

                    listarLivros();
                });


                item.appendChild(descricao);
                item.appendChild(botaoEditar);
                item.appendChild(botaoExcluir);
                listaLivros.appendChild(item);

            });
        }

        // Cadastra um novo livro ou atualiza um livro existente.
        formLivro.addEventListener("submit", function (evento) {
            evento.preventDefault();

            const titulo = document.getElementById("tituloLivro").value.trim();
            const autor = document.getElementById("autorLivro").value.trim();
            const isbn = document.getElementById("isbnLivro").value.trim();
            const categoria = document.getElementById("categoriaLivro").value.trim();
            const quantidade = Number(
                document.getElementById("quantidadeLivro").value
            );

            if (!titulo || !autor || !isbn || !categoria ||
                !Number.isInteger(quantidade) || quantidade < 1) {
                mensagemLivro.textContent = "Preencha os campos corretamente.";
                return;
            }

            const livros = Storage.carregar("bookspace_livros") || [];

            const isbnExistente = livros.some(function (livro) {
                return livro.isbn === isbn && livro.id !== livroEmEdicaoId;
            });

            if (isbnExistente) {
                mensagemLivro.textContent = "Já existe um livro com esse ISBN.";
                return;
            }

            if (livroEmEdicaoId !== null) {
                const livro = livros.find(function (item) {
                    return item.id === livroEmEdicaoId;
                });

                if (!livro) {
                    mensagemLivro.textContent = "Livro não encontrado.";
                    return;
                }

                const exemplaresEmprestados =
                    livro.quantidadeTotal - livro.quantidadeDisponivel;

                if (quantidade < exemplaresEmprestados) {
                    mensagemLivro.textContent =
                        "A quantidade não pode ser menor que os exemplares emprestados.";
                    return;
                }

                livro.titulo = titulo;
                livro.autor = autor;
                livro.isbn = isbn;
                livro.categoria = categoria;
                livro.quantidadeTotal = quantidade;
                livro.quantidadeDisponivel =
                    quantidade - exemplaresEmprestados;

                Storage.salvar("bookspace_livros", livros);

                mensagemLivro.textContent = "Livro atualizado com sucesso!";
            } else {
                const novoLivro = {
                    id: "L" + Date.now(),
                    titulo: titulo,
                    autor: autor,
                    isbn: isbn,
                    categoria: categoria,
                    quantidadeTotal: quantidade,
                    quantidadeDisponivel: quantidade
                };

                livros.push(novoLivro);
                Storage.salvar("bookspace_livros", livros);

                mensagemLivro.textContent = "Livro cadastrado com sucesso!";
            }

            livroEmEdicaoId = null;
            formLivro.reset();
            botaoSalvarLivro.textContent = "Cadastrar Livro";

            listarLivros();
        });

        // Exibe os livros assim que o gerenciamento é aberto.
        listarLivros();
    });
}
