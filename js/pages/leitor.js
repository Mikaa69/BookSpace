
const usuarioLogado = Auth.obterUsuarioLogado();

if (!usuarioLogado || usuarioLogado.perfil !== "leitor") {
    window.location.replace("login.html");
} else {
    const boasVindas = document.getElementById("boas-vindas");
    const botaoSair = document.getElementById("btn-sair");

    boasVindas.textContent = `Bem-vindo(a), ${usuarioLogado.nome}!`;

    botaoSair.addEventListener("click", function() {
        Auth.logout();
        window.location.replace("login.html");
    });
}
