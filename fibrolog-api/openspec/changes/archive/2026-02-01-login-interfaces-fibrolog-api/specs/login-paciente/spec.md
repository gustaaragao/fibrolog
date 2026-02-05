## ADDED Requirements

### Requirement: Autenticar paciente por email e senha
O sistema SHALL permitir que um paciente se autentique informando seu email cadastrado e uma senha válida, utilizando o endpoint de autenticação documentado.

#### Scenario: Login bem-sucedido com credenciais válidas
- **WHEN** o paciente envia uma requisição de autenticação com email cadastrado e senha correta
- **THEN** o sistema retorna uma resposta de sucesso contendo um token de acesso JWT e o tipo de token `bearer`

#### Scenario: Login falha com email não cadastrado
- **WHEN** o paciente envia uma requisição de autenticação com um email que não existe no cadastro
- **THEN** o sistema retorna uma resposta de erro com código de status 400 e mensagem indicando que email ou senha estão incorretos

#### Scenario: Login falha com senha incorreta
- **WHEN** o paciente envia uma requisição de autenticação com email cadastrado e senha incorreta
- **THEN** o sistema retorna uma resposta de erro com código de status 400 e mensagem indicando que email ou senha estão incorretos
