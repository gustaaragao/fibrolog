## ADDED Requirements

### Requirement: Tratamento padrao de erros de autenticacao no cliente mobile
O sistema SHALL mapear respostas de erro da API de autenticacao para mensagens amigaveis exibidas no aplicativo mobile, garantindo consistencia com as telas de login e cadastro.

#### Scenario: Credenciais invalidas retornadas pela API
- **WHEN** a API retorna erro indicando credenciais invalidas durante a tentativa de login
- **THEN** o aplicativo SHALL exibir mensagem de erro em portugues informando que o email ou a senha estao incorretos, sem revelar detalhes sensiveis da implementacao da API.

#### Scenario: Email ja utilizado no cadastro
- **WHEN** a API retorna erro indicando que o email informado ja esta cadastrado
- **THEN** o aplicativo SHALL exibir mensagem de erro clara informando que ja existe uma conta associada a esse email e SHALL nao autenticar o usuario.

### Requirement: Timeouts e falhas de rede na autenticacao
O sistema SHALL tratar timeouts e falhas de rede durante chamadas de autenticacao da mesma forma em todas as telas do aplicativo mobile.

#### Scenario: Timeout em chamada de autenticacao
- **WHEN** uma chamada de login ou cadastro atinge o tempo limite configurado de rede
- **THEN** o aplicativo SHALL cancelar a tentativa atual, exibir mensagem informando problema de conexao e permitir que o usuario tente novamente.
