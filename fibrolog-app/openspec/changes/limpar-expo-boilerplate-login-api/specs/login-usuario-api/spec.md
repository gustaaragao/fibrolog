## ADDED Requirements

### Requirement: Autenticacao de usuario via API FibroLog
O sistema SHALL autenticar o usuario chamando o endpoint `POST /auth/token` da API FibroLog, enviando as credenciais de acesso e armazenando o token de autenticacao retornado para uso nas proximas chamadas autenticadas.

#### Scenario: Login bem-sucedido
- **WHEN** o usuario informa um email e senha validos e toca no botao de login
- **THEN** o app envia uma requisicao `POST /auth/token` com corpo `application/x-www-form-urlencoded` contendo `username` (email) e `password` (senha)
- **THEN** a API retorna um objeto com `access_token` e `token_type`
- **THEN** o app armazena o `access_token` de forma segura e marca o usuario como autenticado

#### Scenario: Credenciais invalidas
- **WHEN** o usuario informa um email ou senha incorretos e a API retorna status 400 com uma mensagem de erro
- **THEN** o app NAO armazena qualquer token
- **THEN** o app exibe uma mensagem amigavel informando que o email ou a senha estao incorretos

#### Scenario: Erro de rede ou servidor
- **WHEN** ocorre falha de rede, timeout ou erro 5xx ao chamar `POST /auth/token`
- **THEN** o app NAO armazena qualquer token
- **THEN** o app exibe uma mensagem de erro generica informando que nao foi possivel realizar o login e permite nova tentativa

#### Scenario: Estado de carregamento durante login
- **WHEN** a requisicao de login esta em andamento
- **THEN** o app exibe um estado de carregamento (por exemplo, texto "Entrando..." ou indicador visual)
- **THEN** o botao de login e desabilitado para evitar envios duplicados
