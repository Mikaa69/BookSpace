
# BookSpace

Sistema de gerenciamento de biblioteca desenvolvido como projeto acadêmico.

## Tecnologias
- HTML
- CSS
- JavaScript
- localStorage

## Funcionalidades previstas
- Autenticação de usuários
- Cadastro e gerenciamento de livros
- Pesquisa no acervo
- Controle de empréstimos e devoluções
- Histórico de empréstimos
- Identificação de atrasos

## Integrantes
- Angela Micaela Arce Calonga
- Mario Antonio Carvalho Dos Santos Borges

## Como executar
As instruções de execução serão adicionadas conforme o desenvolvimento.


## Organização do desenvolvimento

O BookSpace é desenvolvido por uma equipe de dois integrantes.

### Módulo de autenticação e leitor
Responsável: Angela

- Login e logout
- Identificação do perfil do usuário
- Área inicial do leitor
- Pesquisa e consulta de livros
- Consulta de empréstimos ativos
- Histórico pessoal de empréstimos
- Visualização de atrasos

### Módulo administrativo
Responsável: Mario 

- Área inicial do bibliotecário
- Cadastro, edição e exclusão de livros
- Cadastro de leitores
- Registro de empréstimos e devoluções
- Controle da disponibilidade dos livros
- Consulta geral do histórico e dos atrasos

### Tecnologias
- HTML: estrutura das páginas
- CSS: estilização da interface
- JavaScript: funcionalidades e regras do sistema
- localStorage: armazenamento local dos dados

### Regras de negócio
- Cada leitor pode ter até 3 empréstimos ativos.
- O prazo de empréstimo é de 7 dias corridos.
- Leitores com empréstimos atrasados não podem realizar novos empréstimos.
- Um livro só pode ser emprestado se houver exemplares disponíveis.
- Cada livro deve possuir um ISBN único.
- Livros com empréstimos ativos não podem ser excluídos.
- Apenas bibliotecários podem realizar operações administrativas.

