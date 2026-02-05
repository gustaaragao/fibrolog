## ADDED Requirements

### Requirement: Cadastro inicial de usuario
O sistema SHALL permitir que o usuario crie uma nova conta a partir da tela de cadastro do aplicativo mobile, informando os campos minimos definidos pelo produto (por exemplo nome, email e senha).

#### Scenario: Cadastro com dados validos
- **WHEN** o usuario preenche todos os campos obrigatorios com dados validos e toca no botao de criar conta
- **THEN** o aplicativo SHALL enviar os dados para o endpoint de registro da API FibroLog, receber confirmacao de sucesso e autenticar o usuario, navegando para a area principal do aplicativo.

#### Scenario: Campos obrigatorios nao preenchidos ou invalidos
- **WHEN** o usuario tenta submeter o formulario de cadastro com campos obrigatorios vazios ou com formato invalido (por exemplo email invalido)
- **THEN** o aplicativo SHALL exibir mensagens de validacao proximas aos campos problematicos e SHALL impedir o envio da requisicao ate que os dados sejam corrigidos.

#### Scenario: Erro de cadastro retornado pela API
- **WHEN** a API FibroLog retorna erro ao tentar cadastrar o usuario (por exemplo email ja utilizado ou dados invalidos)
- **THEN** o aplicativo SHALL exibir uma mensagem de erro em portugues, sem autenticar o usuario nem navegar para a area principal.

### Requirement: Confirmacao de senha no cadastro
O sistema SHALL exigir confirmacao de senha no fluxo de cadastro para evitar erros de digitacao.

#### Scenario: Senhas divergentes
- **WHEN** o usuario preenche os campos de senha e confirmacao de senha com valores diferentes e tenta concluir o cadastro
- **THEN** o aplicativo SHALL exibir mensagem de erro informando que as senhas nao coincidem e SHALL impedir o envio da requisicao para a API.
