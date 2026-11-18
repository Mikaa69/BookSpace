
# 📚 BookSpace

Sistema web de gerenciamento de biblioteca desenvolvido como projeto acadêmico do curso de **Sistemas de Informação**.

O BookSpace permite organizar o acervo de livros, cadastrar leitores, controlar empréstimos e devoluções e consultar históricos, utilizando diferentes permissões para leitores e bibliotecários.

## Tecnologias utilizadas

- HTML5: estrutura das páginas.
- CSS3: estilização e responsividade.
- JavaScript: funcionalidades, validações e regras de negócio.
- localStorage: armazenamento local dos dados no navegador.
- Git e GitHub: versionamento e colaboração no desenvolvimento.

## Funcionalidades implementadas

### Área do leitor

- Login e logout.
- Identificação do perfil do usuário.
- Consulta ao catálogo de livros.
- Pesquisa por título, autor ou categoria.
- Visualização da disponibilidade dos livros.
- Consulta dos próprios empréstimos ativos.
- Consulta do histórico pessoal de empréstimos.
- Identificação de empréstimos atrasados.

### Área do bibliotecário

- Acesso ao painel administrativo.
- Cadastro, edição e exclusão de livros.
- Validação de ISBN e prevenção de duplicidades.
- Cadastro e gerenciamento de leitores.
- Registro de empréstimos e devoluções.
- Controle automático da quantidade de exemplares disponíveis.
- Pesquisa de empréstimos pelo nome do leitor ou título do livro.
- Consulta ao histórico geral de empréstimos.
- Identificação de empréstimos atrasados.
- Registro de datas e horários de empréstimos e devoluções.

## Regras de negócio

1. Cada leitor pode possuir, no máximo, **3 empréstimos ativos**.
2. O prazo de devolução é de **7 dias corridos**.
3. Leitores com empréstimos atrasados não podem realizar novos empréstimos.
4. Um livro só pode ser emprestado quando houver exemplares disponíveis.
5. Cada livro deve possuir um ISBN único.
6. Livros com empréstimos ativos não podem ser excluídos.
7. O estoque disponível é reduzido ao registrar um empréstimo e aumentado na devolução.
8. Cada leitor pode visualizar somente seu próprio histórico de empréstimos na interface.
9. Apenas bibliotecários podem acessar as funcionalidades administrativas.
10. Não é permitido cadastrar leitores com e-mails duplicados.

## Como executar

1. Baixe ou clone o repositório do BookSpace.
2. Abra a pasta do projeto no Visual Studio Code.
3. Utilize a extensão **Live Server** para executar o sistema.
4. Abra o arquivo `index.html` com a opção **Open with Live Server**.
5. Acesse a página de login e utilize uma conta cadastrada para entrar no sistema.

**Observação:** o BookSpace é um projeto front-end e não necessita de instalação de banco de dados ou servidor de aplicação. Os dados são armazenados localmente no navegador utilizado.

## Testes realizados

Foram realizados testes manuais para verificar:

- Consulta e pesquisa de livros.
- Visualização de empréstimos e histórico pessoal.
- Pesquisa e devolução de empréstimos.
- Atualização da disponibilidade dos livros.
- Responsividade em diferentes tamanhos de tela.
- Desempenho da pesquisa com um catálogo de 500 livros.
- Funcionamento das principais funcionalidades no Microsoft Edge.
- Bloqueio de acesso administrativo para leitores.
- Redirecionamento de usuários não autenticados.
- Separação do histórico de empréstimos por leitor.

A compatibilidade com Google Chrome e Mozilla Firefox ainda não foi verificada.

## Segurança e privacidade

O BookSpace utiliza `localStorage` para armazenar os dados do sistema, incluindo informações dos usuários, livros e empréstimos.

Por se tratar de um protótipo acadêmico desenvolvido exclusivamente com tecnologias front-end, existem limitações importantes:

- As senhas são armazenadas localmente sem criptografia ou hash.
- Os dados podem ser visualizados ou modificados pelas ferramentas de desenvolvedor do navegador.
- As verificações de autenticação e permissões são executadas no JavaScript do cliente.
- Os dados não são sincronizados entre navegadores ou dispositivos.
- O armazenamento local não oferece as mesmas garantias de segurança de um banco de dados com autenticação no servidor.

Os controles de acesso implementados demonstram o funcionamento dos perfis no protótipo, mas não constituem uma proteção segura contra manipulação intencional.

Para uma utilização real, seria necessário implementar um backend, autenticação segura, proteção de senhas, autorização no servidor e mecanismos adequados de proteção de dados pessoais.

**Recomenda-se utilizar somente dados fictícios durante os testes.**

## Organização do desenvolvimento

O projeto foi desenvolvido em dupla, com divisão de responsabilidades e utilização do Git para acompanhar as alterações.

### Angela Micaela Arce Calonga

Responsável pelo módulo de autenticação e leitor:

- Login e logout.
- Identificação do perfil.
- Área do leitor.
- Consulta e pesquisa de livros.
- Visualização dos empréstimos ativos.
- Histórico pessoal e identificação de atrasos.

### Mario Antonio Carvalho Dos Santos Borges

Responsável pelo módulo administrativo:

- Painel do bibliotecário.
- Cadastro e gerenciamento de livros.
- Cadastro e gerenciamento de leitores.
- Registro de empréstimos e devoluções.
- Controle de disponibilidade.
- Histórico geral e identificação de atrasos.

## Versionamento

O desenvolvimento utiliza Git e GitHub, com commits incrementais seguindo o padrão **Conventional Commits**.

Exemplos:

- `feat:` implementação de funcionalidades.
- `fix:` correção de problemas.
- `style:` ajustes visuais.
- `docs:` atualização da documentação.
- `refactor:` reorganização do código sem alteração de comportamento.

## Considerações finais

O BookSpace foi desenvolvido exclusivamente como projeto acadêmico do curso de Sistemas de Informação, com o objetivo de aplicar na prática os conhecimentos adquiridos durante a graduação.

O sistema possui finalidade exclusivamente educacional, não sendo destinado à utilização comercial ou ao gerenciamento de bibliotecas reais.
