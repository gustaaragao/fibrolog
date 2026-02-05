## 1. Alinhar contrato do endpoint de autenticação

- [x] 1.1 Revisar `fibrolog_api/routers/auth.py` para garantir que o comportamento do endpoint `/auth/token` está alinhado aos requisitos de `auth-token-endpoint` (payload form-url-encoded, mapeamento de campos, códigos HTTP e mensagens de erro em português).
- [x] 1.2 Ajustar, se necessário, a implementação de `login` em `auth.py` para aderir integralmente aos cenários de sucesso e erro definidos nos specs de `login-paciente` e `auth-token-endpoint`.

## 2. Garantir gestão correta da sessão com JWT

- [x] 2.1 Revisar `fibrolog_api/security.py` e configurações relacionadas para confirmar tempo de expiração do JWT e comportamento em caso de token inválido ou expirado, alinhando com os requisitos de `gestao-sessao-paciente`.
- [x] 2.2 Ajustar, se necessário, a validação do token de acesso (dependências de segurança, exceções levantadas) para garantir que chamadas sem token ou com token inválido/expirado retornem 401 conforme especificado.

## 3. Atualizar schemas e documentação da API

- [x] 3.1 Revisar `fibrolog_api/schemas/token.py` e demais schemas relacionados para assegurar que o modelo de resposta de autenticação reflete o contrato de `login-paciente` (campos obrigatórios, tipos e exemplos quando aplicável).
- [x] 3.2 Garantir que a documentação OpenAPI gerada pelo FastAPI para `/auth/token` esteja coerente com as interfaces de login descritas nos specs, adicionando ou ajustando `summary`, `description` e exemplos de request/response se necessário.

## 4. Validar comportamento via testes automatizados

- [x] 4.1 Criar ou atualizar testes em `tests/test_auth.py` cobrindo cenários de login bem-sucedido, email inexistente e senha incorreta, conforme definido em `login-paciente` e `auth-token-endpoint`.
- [x] 4.2 Criar ou atualizar testes cobrindo chamadas autenticadas com token válido, ausente e inválido/expirado, alinhados aos requisitos de `gestao-sessao-paciente`.
