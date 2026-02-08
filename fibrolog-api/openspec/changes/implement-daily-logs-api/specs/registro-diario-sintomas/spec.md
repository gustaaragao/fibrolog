## ADDED Requirements

### Requirement: Registro de Sintomas e Dores Diárias
O sistema DEVE permitir que o paciente registre seus sintomas diários e as regiões do corpo com dor, incluindo a intensidade de cada um em uma escala de 0 a 10.

#### Scenario: Registro completo com sucesso
- **WHEN** o paciente envia uma requisição POST para `/registros-diarios` com uma lista de sintomas, uma lista de regiões de dor, observações e um timestamp válido
- **THEN** o sistema DEVE criar um novo registro no banco de dados associado ao paciente e retornar status 201 (Created)

#### Scenario: Registro com listas vazias
- **WHEN** o paciente envia uma requisição POST para `/registros-diarios` com as listas `symptoms` e `painRegions` vazias, mas presentes
- **THEN** o sistema DEVE criar o registro com sucesso e retornar status 201 (Created)

### Requirement: Validação de Intensidade e Identificadores
O sistema DEVE validar se as intensidades informadas estão entre 0 e 10, se os IDs de sintomas estão entre "1" e "8", e se os IDs de regiões de dor estão entre "1" e "50".

#### Scenario: Falha na validação de intensidade
- **WHEN** o paciente envia um registro com uma intensidade de sintoma igual a 11
- **THEN** o sistema DEVE rejeitar a requisição e retornar status 400 (Bad Request)

#### Scenario: Falha na validação de ID de sintoma
- **WHEN** o paciente envia um ID de sintoma fora do intervalo "1"-"8" (ex: "9")
- **THEN** o sistema DEVE rejeitar a requisição e retornar status 400 (Bad Request)

### Requirement: Autenticação do Paciente
O sistema DEVE exigir autenticação via Bearer Token (JWT) e identificar automaticamente o `paciente_id` a partir do token.

#### Scenario: Requisição não autenticada
- **WHEN** o paciente tenta acessar o endpoint sem um token válido no cabeçalho Authorization
- **THEN** o sistema DEVE retornar status 401 (Unauthorized)
