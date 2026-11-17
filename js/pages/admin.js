
const usuarioLogado = Auth.obterUsuarioLogado();

if (!usuarioLogado || usuarioLogado.perfil !== "bibliotecario") {
    window.location.replace("login.html");
} else {
    const botaoSair = document.getElementById("btnSair");
    const botaoLivros = document.getElementById("btnLivros");
    const botaoLeitores = document.getElementById("btnLeitores");
    const botaoEmprestimos = document.getElementById("btnEmprestimos");
    const botaoHistorico = document.getElementById("btnHistorico");
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


    botaoEmprestimos.addEventListener("click", function () {
        conteudo.innerHTML = `
            <h3>Gerenciamento de Empréstimos</h3>
            <p>Registre e acompanhe os empréstimos da biblioteca.</p>

            <form id="formEmprestimo">
                <label for="leitorEmprestimo">Leitor</label>
                <select id="leitorEmprestimo" required>
                    <option value="">Selecione um leitor</option>
                </select>

                <label for="livroEmprestimo">Livro</label>
                <select id="livroEmprestimo" required>
                    <option value="">Selecione um livro</option>
                </select>

                <button type="submit">
                    Registrar Empréstimo
                </button>
            </form>

            <p id="mensagemEmprestimo"></p>

            <h3>Empréstimos ativos</h3>
            <div id="listaEmprestimos"></div>
        `;


        // Exibir os empréstimos ativos
        function listarEmprestimos() {
            const listaEmprestimos =
                document.getElementById("listaEmprestimos");

            const emprestimos =
                Storage.carregar("bookspace_emprestimos") || [];

            const usuarios =
                Storage.carregar("bookspace_usuarios") || [];

            const livros =
                Storage.carregar("bookspace_livros") || [];

            const ativos = emprestimos.filter(function (emprestimo) {
                return emprestimo.status === "ativo";
            });

            listaEmprestimos.innerHTML = "";

            if (ativos.length === 0) {
                listaEmprestimos.textContent =
                    "Nenhum empréstimo ativo.";
                return;
            }

            ativos.forEach(function (emprestimo) {
                const leitor = usuarios.find(function (usuario) {
                    return usuario.id === emprestimo.leitorId;
                });

                const livro = livros.find(function (item) {
                    return item.id === emprestimo.livroId;
                });

                const item = document.createElement("div");
                item.className = "item-emprestimo";

                const descricao = document.createElement("p");

                const dataPrevista = emprestimo.dataPrevista
                    ? emprestimo.dataPrevista.split("-").reverse().join("/")
                    : "Não informada";

                // Exibir as informações do empréstimo ativo
                descricao.textContent =
                    "Leitor: " + (leitor ? leitor.nome : "Não encontrado") +
                    " | Livro: " + (livro ? livro.titulo : "Não encontrado") +
                    " | Devolução prevista: " + dataPrevista;

                // Botão para devolver o livro
                const botaoDevolver = document.createElement("button");
                botaoDevolver.type = "button";
                botaoDevolver.textContent = "Devolver";
                botaoDevolver.className = "btn-devolver";


                botaoDevolver.addEventListener("click", function () {
                    const mensagemEmprestimo =
                        document.getElementById("mensagemEmprestimo");

                    const confirmar = window.confirm(
                        "Confirmar devolução do livro: " +
                        (livro ? livro.titulo : "Não encontrado") + "?"
                    );

                    if (!confirmar) {
                        return;
                    }

                    // Buscar os dados atualizados
                    const emprestimosAtualizados =
                        Storage.carregar("bookspace_emprestimos") || [];

                    const livrosAtualizados =
                        Storage.carregar("bookspace_livros") || [];

                    const emprestimoAtual = emprestimosAtualizados.find(
                        function (item) {
                            return item.id === emprestimo.id;
                        }
                    );

                    const livroAtual = livrosAtualizados.find(
                        function (item) {
                            return item.id === emprestimo.livroId;
                        }
                    );

                    if (!emprestimoAtual ||
                        emprestimoAtual.status !== "ativo" ||
                        !livroAtual) {
                        mensagemEmprestimo.textContent =
                            "Não foi possível realizar a devolução.";
                        return;
                    }

                    // Registrar a data de devolução
                    const hoje = new Date();

                    const ano = hoje.getFullYear();
                    const mes = String(hoje.getMonth() + 1).padStart(2, "0");
                    const dia = String(hoje.getDate()).padStart(2, "0");

                    emprestimoAtual.dataDevolucao =
                        `${ano}-${mes}-${dia}`;

                    emprestimoAtual.status = "devolvido";

                    // Devolver o exemplar ao estoque
                    livroAtual.quantidadeDisponivel += 1;

                    // Salvar as alterações
                    Storage.salvar(
                        "bookspace_emprestimos",
                        emprestimosAtualizados
                    );

                    Storage.salvar(
                        "bookspace_livros",
                        livrosAtualizados
                    );

                    mensagemEmprestimo.textContent =
                        "Livro devolvido com sucesso!";

                    // Atualizar a lista de empréstimos ativos
                    listarEmprestimos();

                    // Atualizar os livros disponíveis na seleção
                    const selectLivro =
                        document.getElementById("livroEmprestimo");

                    selectLivro.innerHTML =
                        '<option value="">Selecione um livro</option>';

                    livrosAtualizados.forEach(function (item) {
                        if (item.quantidadeDisponivel > 0) {
                            const opcao = document.createElement("option");
                            opcao.value = item.id;
                            opcao.textContent = item.titulo;
                            selectLivro.appendChild(opcao);
                        }
                    });
                });

                item.appendChild(botaoDevolver);

                item.appendChild(descricao);
                listaEmprestimos.appendChild(item);
            });
        }

        listarEmprestimos();

        // Carregar leitores cadastrados
        const usuarios = Storage.carregar("bookspace_usuarios") || [];
        const leitores = usuarios.filter(function (usuario) {
            return usuario.perfil === "leitor";
        });

        const selectLeitor = document.getElementById("leitorEmprestimo");

        leitores.forEach(function (leitor) {
            const opcao = document.createElement("option");
            opcao.value = leitor.id;
            opcao.textContent = leitor.nome;
            selectLeitor.appendChild(opcao);
        });

        // Carregar livros disponíveis
        const livros = Storage.carregar("bookspace_livros") || [];

        const selectLivro = document.getElementById("livroEmprestimo");

        livros.forEach(function (livro) {
            if (livro.quantidadeDisponivel > 0) {
                const opcao = document.createElement("option");
                opcao.value = livro.id;
                opcao.textContent = livro.titulo;
                selectLivro.appendChild(opcao);
            }
        });

        // Capturar o formulário de empréstimos
        const formEmprestimo = document.getElementById("formEmprestimo");
        const mensagemEmprestimo = document.getElementById("mensagemEmprestimo");

        formEmprestimo.addEventListener("submit", function (evento) {
            evento.preventDefault();

            const leitorId = selectLeitor.value;
            const livroId = selectLivro.value;

            if (!leitorId || !livroId) {
                mensagemEmprestimo.textContent =
                    "Selecione um leitor e um livro.";
                return;
            }


            // RN-01: máximo de 3 empréstimos ativos por leitor
            const emprestimos = Storage.carregar("bookspace_emprestimos") || [];

            const emprestimosAtivos = emprestimos.filter(function (emprestimo) {
                return emprestimo.leitorId === leitorId &&
                    emprestimo.status === "ativo";
            });

            if (emprestimosAtivos.length >= 3) {
                mensagemEmprestimo.textContent =
                    "Este leitor já possui 3 empréstimos ativos.";
                return;
            }


            // RN-03: bloquear empréstimos para leitores com atrasos
            const hoje = new Date();
            hoje.setHours(0, 0, 0, 0);

            const possuiAtraso = emprestimosAtivos.some(function (emprestimo) {
                if (!emprestimo.dataPrevista) {
                    return false;
                }

                const dataPrevista = new Date(
                    emprestimo.dataPrevista + "T00:00:00"
                );

                return dataPrevista < hoje;
            });

            if (possuiAtraso) {
                mensagemEmprestimo.textContent =
                    "Este leitor possui empréstimos atrasados. Regularize as devoluções antes de realizar um novo empréstimo.";
                return;
            }


            // Verificar se o livro selecionado está disponível
            const livrosAtualizados =
                Storage.carregar("bookspace_livros") || [];

            const livroSelecionado = livrosAtualizados.find(function (livro) {
                return livro.id === livroId;
            });

            if (!livroSelecionado) {
                mensagemEmprestimo.textContent =
                    "Livro não encontrado.";
                return;
            }

            if (livroSelecionado.quantidadeDisponivel <= 0) {
                mensagemEmprestimo.textContent =
                    "Este livro não possui exemplares disponíveis.";
                return;
            }


            // RN-02: prazo de devolução de 7 dias corridos
            const agora = new Date();

            const dataEmprestimo = new Date(agora);
            dataEmprestimo.setHours(12, 0, 0, 0);

            const dataPrevista = new Date(dataEmprestimo);
            dataPrevista.setDate(dataPrevista.getDate() + 7);

            function formatarData(data) {
                const ano = data.getFullYear();
                const mes = String(data.getMonth() + 1).padStart(2, "0");
                const dia = String(data.getDate()).padStart(2, "0");
                return `${ano}-${mes}-${dia}`;
            }

            // Criar o empréstimo
            const novoEmprestimo = {
                id: "E" + Date.now(),
                leitorId: leitorId,
                livroId: livroId,
                dataEmprestimo: formatarData(dataEmprestimo),
                dataPrevista: formatarData(dataPrevista),
                dataDevolucao: null,
                status: "ativo"
            };

            // Atualizar o estoque do livro
            livroSelecionado.quantidadeDisponivel -= 1;

            // Salvar os dados
            emprestimos.push(novoEmprestimo);

            Storage.salvar("bookspace_livros", livrosAtualizados);
            Storage.salvar("bookspace_emprestimos", emprestimos);

            mensagemEmprestimo.textContent =
                "Empréstimo registrado com sucesso! Devolução prevista para " +
                dataPrevista.toLocaleDateString("pt-BR") + ".";

            // Limpar as seleções
            formEmprestimo.reset();

            // Atualizar a lista de empréstimos ativos
            listarEmprestimos();

            // Atualizar os livros disponíveis no campo de seleção
            selectLivro.innerHTML =
                '<option value="">Selecione um livro</option>';

            livrosAtualizados.forEach(function (livro) {
                if (livro.quantidadeDisponivel > 0) {
                    const opcao = document.createElement("option");
                    opcao.value = livro.id;
                    opcao.textContent = livro.titulo;
                    selectLivro.appendChild(opcao);
                }
            });

        });

    });

    // GERENCIAMENTO DO HISTÓRICO
    botaoHistorico.addEventListener("click", function () {
        conteudo.innerHTML = `
            <h3>Histórico de Empréstimos</h3>
            <p>Consulte os empréstimos realizados na biblioteca.</p>

            <h3>Registros de empréstimos</h3>
            <div id="listaHistorico"></div>
        `;

        // Carregar os registros de empréstimos
        const listaHistorico = document.getElementById("listaHistorico");

        const emprestimos = Storage.carregar("bookspace_emprestimos") || [];
        const usuarios = Storage.carregar("bookspace_usuarios") || [];
        const livros = Storage.carregar("bookspace_livros") || [];

        if (emprestimos.length === 0) {
            listaHistorico.textContent = "Nenhum empréstimo registrado.";
        } else {
            emprestimos.forEach(function (emprestimo) {
                const leitor = usuarios.find(function (usuario) {
                    return usuario.id === emprestimo.leitorId;
                });

                const livro = livros.find(function (item) {
                    return item.id === emprestimo.livroId;
                });

                const item = document.createElement("div");
                item.className = "item-historico";

                const descricao = document.createElement("p");
                const dataEmprestimo = emprestimo.dataEmprestimo
                    ? emprestimo.dataEmprestimo.split("-").reverse().join("/")
                    : "Não informada";

                const dataPrevista = emprestimo.dataPrevista
                    ? emprestimo.dataPrevista.split("-").reverse().join("/")
                    : "Não informada";

                const dataDevolucao = emprestimo.dataDevolucao
                    ? emprestimo.dataDevolucao.split("-").reverse().join("/")
                    : "Ainda não devolvido";
                let situacao = "Devolvido";

                if (emprestimo.status === "ativo") {
                    const hoje = new Date();
                    hoje.setHours(0, 0, 0, 0);

                    const prazo = emprestimo.dataPrevista
                        ? new Date(emprestimo.dataPrevista + "T00:00:00")
                        : null;

                    situacao = prazo && prazo < hoje ? "Atrasado" : "Ativo";
                }

                // Título do livro
                const tituloLivro = document.createElement("h4");
                tituloLivro.textContent = livro ? livro.titulo : "Livro não encontrado";

                // Informações do empréstimo
                descricao.textContent =
                    "Leitor: " + (leitor ? leitor.nome : "Não encontrado") + "\n" +
                    "Empréstimo: " + dataEmprestimo + "\n" +
                    "Previsão: " + dataPrevista + "\n" +
                    "Devolução: " + dataDevolucao + "\n" +
                    "Situação: " + situacao;

                // Adicionar os elementos ao bloco
                item.appendChild(tituloLivro);
                item.appendChild(descricao);
                listaHistorico.appendChild(item);
            });
        }
    });

}