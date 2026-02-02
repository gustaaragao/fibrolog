## Context

O FibroLog utiliza FastAPI com autenticação baseada em JWT e fluxo OAuth2 Password, com o endpoint `/auth/token` já implementado em `fibrolog_api/routers/auth.py` e o schema `Token` definido em `fibrolog_api/schemas/token.py`. As senhas são armazenadas com hash (Argon2) via módulo de segurança do projeto.

O Documento III - P2527 define interfaces de login que descrevem como o paciente deve se autenticar, quais campos devem ser enviados e quais informações o sistema deve retornar em caso de sucesso ou erro. Hoje, esse contrato funcional não está formalizado na API, o que gera risco de divergência entre backend e aplicativo móvel.

Este design parte da proposta em `proposal.md`, que introduz as capacidades `login-paciente` e `gestao-sessao-paciente`, além de ajustar a capacidade existente `auth-token-endpoint`.

## Goals / Non-Goals

**Goals:**
- Garantir que o endpoint `/auth/token` atenda às interfaces de login descritas no Documento III - P2527, no que diz respeito a campos de entrada, respostas de sucesso/erro e códigos HTTP.
- Deixar explícito como o app deve autenticar o paciente via e-mail e senha, incluindo formato de requisição e mapeamento para o modelo de paciente (`Paciente`).
- Documentar o comportamento da sessão autenticada baseada em JWT (tempo de validade, uso em chamadas subsequentes, tratamento de expiração) do ponto de vista da API.
- Minimizar mudanças estruturais no código atual, reutilizando o fluxo já existente de autenticação e geração de tokens.

**Non-Goals:**
- Não redesenhar completamente o modelo de segurança (por exemplo, não trocar JWT por outro mecanismo de sessão).
- Não implementar, neste change, fluxos complementares como recuperação de senha, cadastro de paciente ou gerenciamento de múltiplos dispositivos.
- Não tratar aqui aspectos de UI/UX do aplicativo móvel; o foco é o contrato e o comportamento da API.

## Decisions

- Manter o endpoint de autenticação centralizado em `/auth/token` utilizando `OAuth2PasswordRequestForm` como mecanismo de entrada, pois ele já está integrado ao ecossistema FastAPI e simplifica a compatibilidade com clientes padrão.
- Utilizar o campo `username` do formulário OAuth2 para o e-mail do paciente, alinhando com o modelo atual que autentica por `Paciente.email`. Esta decisão evita a criação de payloads customizados adicionais apenas para login.
- Continuar retornando um objeto `Token` com `access_token` (JWT) e `token_type` igual a `'bearer'`, mantendo o padrão esperado pelo FastAPI e por clients OAuth2.
- Padronizar mensagens de erro de autenticação para uma string em português clara (`'Email ou senha incorretos'`) com código HTTP 400, conforme já implementado, garantindo consistência com o documento funcional.
- Documentar explicitamente, nas futuras specs de `login-paciente` e `gestao-sessao-paciente`, o tempo de expiração do token e o comportamento esperado da API quando o token expira (retorno 401, mensagem de erro padronizada), sem alterar inicialmente a mecânica de geração de tokens em `security.py`.

## Risks / Trade-offs

- Risco: Dependência do formato `OAuth2PasswordRequestForm` (campos `username` e `password`) pode divergir do formato textual do Documento III - P2527.
  - Mitigação: Documentar claramente no spec de `login-paciente` o mapeamento entre campos do formulário e campos do documento; se necessário, adicionar exemplos concretos de request/response.

- Trade-off: Manter um único endpoint `/auth/token` simplifica o backend, mas pode limitar variações futuras de login (por exemplo, diferentes tipos de credenciais).
  - Mitigação: Estruturar as specs de forma que futuras extensões (como outros tipos de login) possam ser adicionadas como novas capacidades e, se preciso, novos endpoints.

- Risco: Não alterar a implementação de `security.py` neste momento pode deixar pouco explícito para o time o tempo de expiração e detalhes do JWT.
  - Mitigação: Garantir que a spec de `gestao-sessao-paciente` explicite esses parâmetros e referencie claramente as configurações de expiração, servindo de fonte única de verdade.
