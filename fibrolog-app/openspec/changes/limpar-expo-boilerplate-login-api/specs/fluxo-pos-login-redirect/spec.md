## ADDED Requirements

### Requirement: Redirecionamento para tela inicial protegida apos login
O sistema SHALL redirecionar automaticamente o usuario autenticado para uma tela inicial protegida apos um login bem-sucedido.

#### Scenario: Redirecionamento apos login bem-sucedido
- **WHEN** o login do usuario e concluido com sucesso e o token e armazenado
- **THEN** o app navega da tela de login para a tela inicial protegida de forma automatica

#### Scenario: Impedir acesso a telas protegidas sem autenticacao
- **WHEN** o usuario tenta acessar uma rota/tela protegida sem possuir um token de autenticacao valido em memoria
- **THEN** o app redireciona o usuario para a tela de login e NAO renderiza o conteudo protegido

#### Scenario: App reaberto com sessao valida
- **WHEN** o app e iniciado e existe um token de autenticacao valido recuperado do armazenamento seguro
- **THEN** o app navega diretamente para a tela inicial protegida, sem exibir a tela de login

#### Scenario: Logout limpa sessao e volta para login
- **WHEN** o usuario solicita logout a partir de uma tela protegida
- **THEN** o app remove o token armazenado
- **THEN** o app volta a exibir a tela de login como rota inicial
