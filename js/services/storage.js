
const Storage = {
    salvar(chave, dados) {
        localStorage.setItem(chave, JSON.stringify(dados));
    },

    carregar(chave) {
        const dados = localStorage.getItem(chave);

        if (dados === null) {
            return null;
        }

        return JSON.parse(dados);
    },

    remover(chave) {
        localStorage.removeItem(chave);
    }
};
