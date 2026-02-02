## ADDED Requirements

### Requirement: Separacao entre rotas publicas e privadas
O sistema SHALL separar rotas publicas (nao autenticadas) e rotas privadas (autenticadas) utilizando a estrutura de roteamento do Expo Router.

#### Scenario: Grupo de rotas publicas
- **WHEN** o app e iniciado e nao ha sessao de usuario autenticada
- **THEN** a pilha de navegacao inicial exibe apenas as rotas do grupo publico, incluindo a tela de login

#### Scenario: Grupo de rotas privadas
- **WHEN** o usuario esta autenticado e possui um token valido em memoria
- **THEN** o app disponibiliza o grupo de rotas privadas, incluindo a tela inicial protegida e outras telas internas

### Requirement: Remocao de rotas de boilerplate
O sistema SHALL remover rotas, telas e componentes de exemplo do boilerplate do Expo que nao participem do fluxo de login ou da tela inicial protegida.

#### Scenario: Navegacao focada em login e telas autenticadas
- **WHEN** o app esta rodando apos a limpeza do boilerplate
- **THEN** as unicas rotas acessiveis sao a tela de login (publica) e as telas autenticadas definidas para este escopo

### Requirement: Protecao de todas as rotas privadas
O sistema SHALL proteger todas as rotas privadas com uma checagem centralizada de autenticacao antes de renderizar o conteudo.

#### Scenario: Bloqueio de acesso a rota privada sem token
- **WHEN** o usuario tenta acessar qualquer rota privada sem possuir token valido
- **THEN** o app redireciona para a tela de login e NAO exibe o conteudo privado
