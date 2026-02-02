## ADDED Requirements

### Requirement: Utilizar token de acesso em chamadas autenticadas
O sistema SHALL exigir que o aplicativo envie um token de acesso JWT válido no cabeçalho de autorização para acessar recursos protegidos do paciente.

#### Scenario: Chamada autenticada com token válido
- **WHEN** o aplicativo envia uma requisição a um endpoint protegido com o cabeçalho `Authorization: Bearer <token_válido>`
- **THEN** o sistema aceita a requisição, identifica corretamente o paciente associado ao token e processa a operação solicitada

#### Scenario: Chamada autenticada com token ausente
- **WHEN** o aplicativo envia uma requisição a um endpoint protegido sem o cabeçalho de autorização
- **THEN** o sistema retorna uma resposta de erro com código de status 401 indicando que a autenticação é necessária

#### Scenario: Chamada autenticada com token expirado ou inválido
- **WHEN** o aplicativo envia uma requisição a um endpoint protegido com um token expirado ou inválido
- **THEN** o sistema retorna uma resposta de erro com código de status 401 indicando que o token é inválido ou expirou, e não executa a operação solicitada
