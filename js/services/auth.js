
const Auth = {
    inicializarAdmin() {
        const usuarios = Storage.carregar("bookspace_usuarios") || [];

        const emailAdmin = "admin@bookspace.com";

        const adminExiste = usuarios.some(function(usuario) {
            return usuario.email.toLowerCase() === emailAdmin;
        });

        if (!adminExiste) {
            const admin = {
                id: "admin-padrao",
                nome: "Administrador BookSpace",
                email: emailAdmin,
                senha: "123456",
                perfil: "bibliotecario"
            };

            usuarios.push(admin);
            Storage.salvar("bookspace_usuarios", usuarios);
        }
    },

    login(email, senha) {
        this.inicializarAdmin();

        const usuarios = Storage.carregar("bookspace_usuarios") || [];

        const usuario = usuarios.find(function(usuario) {
            return usuario.email === email && usuario.senha === senha;
        });

        if (!usuario) {
            return false;
        }

        const sessao = {
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email,
            perfil: usuario.perfil
        };

        Storage.salvar("bookspace_sessao", sessao);

        return true;
    },

    logout() {
        Storage.remover("bookspace_sessao");
    },

    obterUsuarioLogado() {
        return Storage.carregar("bookspace_sessao");
    }
};

// Garante o cadastro do administrador ao carregar o arquivo.
Auth.inicializarAdmin();
