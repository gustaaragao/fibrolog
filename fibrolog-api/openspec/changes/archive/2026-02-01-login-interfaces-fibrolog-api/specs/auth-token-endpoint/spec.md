## MODIFIED Requirements

### Requirement: Endpoint de autenticação de paciente
O endpoint de autenticação `/auth/token` SHALL receber credenciais de paciente utilizando o fluxo OAuth2 Password, mapeando o campo `username` do formulário para o email cadastrado do paciente e o campo `password` para a senha em texto puro a ser validada.

#### Scenario: Requisição de autenticação com payload válido
- **WHEN** o cliente envia uma requisição `POST /auth/token` com `Content-Type: application/x-www-form-urlencoded` contendo `username=<email_cadastrado>` e `password=<senha_correta>`
- **THEN** o sistema valida as credenciais e retorna resposta 200 com corpo contendo `access_token` (JWT) e `token_type` igual a `bearer`

#### Scenario: Requisição de autenticação com credenciais inválidas
- **WHEN** o cliente envia uma requisição `POST /auth/token` com email inexistente ou senha incorreta
- **THEN** o sistema retorna resposta 400 com mensagem textual em português indicando que email ou senha estão incorretos e não retorna token de acesso
