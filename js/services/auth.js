
const Auth = {
    login(email, senha) {
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

