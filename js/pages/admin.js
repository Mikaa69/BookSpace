
const usuarioLogado = Auth.obterUsuarioLogado();

if (!usuarioLogado || usuarioLogado.perfil !== "bibliotecario") {
    window.location.replace("login.html");
} else {
    const botaoSair = document.getElementById("btnSair");
    const botaoLivros = document.getElementById("btnLivros");
    const botaoLeitores = document.getElementById("btnLeitores");
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

    botaoLeitores.addEventListener("click", function () {
        conteudo.innerHTML = `
            <h3>Gerenciamento de Leitores</h3>
            <p>Cadastre e consulte os leitores da biblioteca.</p>

            <form id="formLeitor">
                <input type="text" id="nomeLeitor"
                    placeholder="Nome completo" required>

                <input type="email" id="emailLeitor"
                    placeholder="E-mail" required>

                <input type="password" id="senhaLeitor"
                    placeholder="Senha" minlength="6" required>

                <button type="submit" id="btnSalvarLeitor">
                    Cadastrar Leitor
                </button>
            </form>

            <p id="mensagemLeitor"></p>

            <h3>Leitores cadastrados</h3>
            <div id="listaLeitores"></div>
        `;

        let leitorEmEdicaoId = null;
        const formLeitor = document.getElementById("formLeitor");
        const mensagemLeitor = document.getElementById("mensagemLeitor");
        const botaoSalvarLeitor = document.getElementById("btnSalvarLeitor");


        const listaLeitores = document.getElementById("listaLeitores");

        function listarLeitores() {
            const usuarios = Storage.carregar("bookspace_usuarios") || [];

            const leitores = usuarios.filter(function (usuario) {
                return usuario.perfil === "leitor";
            });

            listaLeitores.innerHTML = "";

            if (leitores.length === 0) {
                listaLeitores.textContent = "Nenhum leitor cadastrado.";
                return;
            }

            leitores.forEach(function (leitor) {
                const item = document.createElement("div");
                item.className = "item-leitor";

                const descricao = document.createElement("span");
                descricao.textContent =
                    leitor.nome + " — " + leitor.email;

                const botaoEditar = document.createElement("button");
                botaoEditar.type = "button";
                botaoEditar.textContent = "Editar";
                botaoEditar.className = "btn-editar";

                botaoEditar.addEventListener("click", function () {
                    leitorEmEdicaoId = leitor.id;

                    document.getElementById("nomeLeitor").value = leitor.nome;
                    document.getElementById("emailLeitor").value = leitor.email;

                    const campoSenha = document.getElementById("senhaLeitor");
                    campoSenha.value = "";
                    campoSenha.required = false;

                    botaoSalvarLeitor.textContent = "Salvar Alterações";

                    mensagemLeitor.textContent =
                        "Editando leitor: " + leitor.nome;
                });


                const botaoExcluir = document.createElement("button");
                botaoExcluir.type = "button";
                botaoExcluir.textContent = "Excluir";
                botaoExcluir.className = "btn-excluir";


                botaoExcluir.addEventListener("click", function () {
                    const emprestimos =
                        Storage.carregar("bookspace_emprestimos") || [];

                    const possuiEmprestimoAtivo = emprestimos.some(function (emprestimo) {
                        return emprestimo.leitorId === leitor.id &&
                            emprestimo.status === "ativo";
                    });

                    if (possuiEmprestimoAtivo) {
                        mensagemLeitor.textContent =
                            "Não é possível excluir um leitor com empréstimos ativos.";
                        return;
                    }

                    const confirmar = window.confirm(
                        "Deseja realmente excluir o leitor: " + leitor.nome + "?"
                    );

                    if (!confirmar) {
                        return;
                    }

                    const usuarios =
                        Storage.carregar("bookspace_usuarios") || [];

                    const usuariosAtualizados = usuarios.filter(function (usuario) {
                        return usuario.id !== leitor.id;
                    });

                    Storage.salvar("bookspace_usuarios", usuariosAtualizados);

                    if (leitorEmEdicaoId === leitor.id) {
                        leitorEmEdicaoId = null;
                        formLeitor.reset();
                        document.getElementById("senhaLeitor").required = true;
                        botaoSalvarLeitor.textContent = "Cadastrar Leitor";
                    }

                    mensagemLeitor.textContent =
                        "Leitor excluído com sucesso!";

                    listarLeitores();
                });

                item.appendChild(descricao);
                item.appendChild(botaoEditar);
                item.appendChild(botaoExcluir);

                listaLeitores.appendChild(item);
            });
        }
   
        formLeitor.addEventListener("submit", function (evento) {
            evento.preventDefault();

            const nome = document.getElementById("nomeLeitor").value.trim();
            const email = document.getElementById("emailLeitor").value.trim().toLowerCase();
            const senha = document.getElementById("senhaLeitor").value;

            if (!nome || !email ||
                (senha.length > 0 && senha.length < 6) ||
                (leitorEmEdicaoId === null && senha.length === 0)) {
                mensagemLeitor.textContent =
                    "Preencha os campos corretamente. A senha deve ter pelo menos 6 caracteres.";
                return;
            }

            const usuarios = Storage.carregar("bookspace_usuarios") || [];

            const emailExistente = usuarios.some(function (usuario) {
                return usuario.email.toLowerCase() === email &&
                    usuario.id !== leitorEmEdicaoId;
            });

            if (emailExistente) {
                mensagemLeitor.textContent =
                    "Já existe um usuário cadastrado com esse e-mail.";
                return;
            }

            if (leitorEmEdicaoId !== null) {
                const leitor = usuarios.find(function (usuario) {
                    return usuario.id === leitorEmEdicaoId &&
                        usuario.perfil === "leitor";
                });

                if (!leitor) {
                    mensagemLeitor.textContent = "Leitor não encontrado.";
                    return;
                }

                leitor.nome = nome;
                leitor.email = email;

                if (senha.length > 0) {
                    leitor.senha = senha;
                }

                Storage.salvar("bookspace_usuarios", usuarios);

                mensagemLeitor.textContent =
                    "Leitor atualizado com sucesso!";
            } else {
                const novoLeitor = {
                    id: "U" + Date.now(),
                    nome: nome,
                    email: email,
                    senha: senha,
                    perfil: "leitor"
                };

                usuarios.push(novoLeitor);
                Storage.salvar("bookspace_usuarios", usuarios);

                mensagemLeitor.textContent =
                    "Leitor cadastrado com sucesso!";
            }

            leitorEmEdicaoId = null;
            formLeitor.reset();
            document.getElementById("senhaLeitor").required = true;
            botaoSalvarLeitor.textContent = "Cadastrar Leitor";

            listarLeitores();
        });

        listarLeitores();

    });
}
