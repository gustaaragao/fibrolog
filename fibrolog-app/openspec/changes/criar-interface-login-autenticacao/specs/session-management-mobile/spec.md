## ADDED Requirements

### Requirement: Armazenamento seguro de tokens de sessao
O sistema SHALL armazenar tokens de autenticacao recebidos da API FibroLog em armazenamento seguro no dispositivo, de forma a permitir restauracao de sessao em aberturas futuras do aplicativo.

#### Scenario: Salvar tokens apos login bem-sucedido
- **WHEN** o usuario realiza login com sucesso e o aplicativo recebe tokens validos da API
- **THEN** o aplicativo SHALL salvar os tokens em mecanismo de armazenamento seguro apropriado para a plataforma (por exemplo expo-secure-store) antes de navegar para a area principal.

### Requirement: Restauracao de sessao na inicializacao
O sistema SHALL tentar restaurar automaticamente a sessao do usuario ao iniciar o aplicativo, caso existam tokens validos armazenados.

#### Scenario: Sessao restaurada com sucesso
- **WHEN** o aplicativo e iniciado e existem tokens validos armazenados
- **THEN** o aplicativo SHALL considerar o usuario autenticado, pular a tela de login e navegar diretamente para a area principal.

#### Scenario: Restauracao de sessao falha ou tokens invalidos
- **WHEN** o aplicativo e iniciado e a restauracao de sessao falha (tokens ausentes, expirados ou invalidos)
- **THEN** o aplicativo SHALL limpar quaisquer tokens invalidos, considerar o usuario nao autenticado e exibir a tela de login.

### Requirement: Logout limpa sessao e retorna ao login
O sistema SHALL fornecer uma acao de logout que encerra a sessao atual e retorna o usuario para a tela de login.

#### Scenario: Logout bem-sucedido
- **WHEN** o usuario aciona explicitamente a opcao de sair da conta em uma tela autenticada
- **THEN** o aplicativo SHALL remover todos os tokens de autenticacao do armazenamento seguro, limpar o estado de usuario em memoria e navegar de volta para o fluxo de autenticacao exibindo a tela de login.
