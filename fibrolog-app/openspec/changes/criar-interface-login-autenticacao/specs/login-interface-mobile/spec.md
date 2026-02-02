## ADDED Requirements

### Requirement: Login com email e senha
O sistema SHALL permitir que o usuario realize login informando email e senha na tela de login do aplicativo mobile.

#### Scenario: Login com credenciais validas
- **WHEN** o usuario informa um email valido e uma senha correta nos campos de login e toca no botao "Entrar"
- **THEN** o aplicativo SHALL enviar a requisicao de autenticacao para a API FibroLog, receber um token valido e navegar para a area principal do aplicativo (fluxo autenticado).

#### Scenario: Login com credenciais invalidas
- **WHEN** o usuario informa email ou senha incorretos e toca no botao "Entrar"
- **THEN** o aplicativo SHALL exibir uma mensagem de erro clara em portugues informando que as credenciais sao invalidas, sem navegar para a area autenticada.

#### Scenario: Campos obrigatorios nao preenchidos
- **WHEN** o usuario tenta acionar o botao "Entrar" com email ou senha vazios
- **THEN** o aplicativo SHALL impedir o envio da requisicao, exibir mensagens de validacao junto aos campos obrigatorios e nao chamar a API de autenticacao.

### Requirement: Feedback de carregamento e erros de rede no login
O sistema SHALL fornecer feedback visual de carregamento e tratamento padrao de erros de rede durante o processo de login.

#### Scenario: Requisicao de login em andamento
- **WHEN** o usuario toca no botao "Entrar" com credenciais validas e a requisicao de login esta em andamento
- **THEN** o aplicativo SHALL exibir um indicador de carregamento, desabilitar temporariamente o botao e impedir envios duplicados ate receber resposta da API.

#### Scenario: Erro de rede ou servidor indisponivel
- **WHEN** ocorre um erro de rede (sem conexao, timeout ou servidor indisponivel) durante a tentativa de login
- **THEN** o aplicativo SHALL exibir uma mensagem em portugues informando que nao foi possivel realizar o login por problema de conexao ou servidor, permitindo que o usuario tente novamente.
