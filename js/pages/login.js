
const formularioLogin = document.getElementById("form-login");
const mensagemLogin = document.getElementById("mensagem-login");

formularioLogin.addEventListener("submit", function(evento) {
    evento.preventDefault();

    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value;

    const loginRealizado = Auth.login(email, senha);

    if (loginRealizado) {
        mensagemLogin.style.color = "green";
        mensagemLogin.textContent = "Login realizado com sucesso!";

        const usuario = Auth.obterUsuarioLogado();

        if (usuario.perfil === "leitor") {
        window.location.href = "leitor.html";
        
        } else if (usuario.perfil === "bibliotecario") {
        mensagemLogin.textContent =
        "A área administrativa ainda está em desenvolvimento.";
}
    } else {
        mensagemLogin.style.color = "#c62828";
        mensagemLogin.textContent = "E-mail ou senha incorretos.";
    }
});
