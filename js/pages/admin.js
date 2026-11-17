
const usuarioLogado = Auth.obterUsuarioLogado();

if (!usuarioLogado || usuarioLogado.perfil !== "bibliotecario") {
    window.location.replace("login.html");
} else {
    const botaoSair = document.getElementById("btnSair");
    const conteudo = document.getElementById("conteudo");

    conteudo.innerHTML = `
        <h3>Bem-vindo, ${usuarioLogado.nome}!</h3>
        <p>Selecione uma opção acima para gerenciar a biblioteca.</p>
    `;

    botaoSair.addEventListener("click", function () {
        Auth.logout();
        window.location.replace("login.html");
    });
}
