## Why

O aplicativo FibroLog atualmente possui apenas o endpoint de autenticação técnico (`/auth/token`), sem uma especificação funcional clara de como o login deve se comportar para os diferentes tipos de usuário/paciente e sem interfaces de entrada/saída alinhadas ao documento de requisitos do sistema (Documento III - P2527). Este gap dificulta alinhar o backend com o app móvel e validar se o fluxo de login atende às regras de negócio e de segurança definidas no projeto.

## What Changes

- Definir, em nível de especificação, as interfaces de login descritas no Documento III - P2527 para o contexto da API FibroLog.
- Mapear essas interfaces para as rotas já existentes na API (principalmente `/auth/token`) e, se necessário, propor ajustes de contrato (campos de entrada/saída, mensagens de erro, códigos HTTP).
- Formalizar como o fluxo de autenticação via e‑mail e senha de paciente deve funcionar, incluindo validações mínimas e feedback de erro padronizado.
- Identificar se serão necessários novos endpoints ou variações (por exemplo, refresh de token, logout lógico, recuperação de senha) para cobrir completamente os casos descritos nas interfaces do documento.
- Criar base para especificações detalhadas e para o desenho técnico da autenticação, mantendo compatibilidade com o modelo atual de segurança (JWT + OAuth2 Password Flow).

## Capabilities

### New Capabilities
- `login-paciente`: Especifica o fluxo de autenticação do paciente no sistema FibroLog, incluindo formato de requisição, respostas de sucesso/erro, requisitos de validação e mapeamento para os campos definidos no Documento III - P2527.
- `gestao-sessao-paciente`: Define como o token de acesso é utilizado pelo app para manter a sessão autenticada do paciente, incluindo duração do token, tratamento de expiração e comportamento esperado do cliente quando o token se torna inválido.

### Modified Capabilities
- `auth-token-endpoint`: Ajusta e formaliza os requisitos do endpoint `/auth/token`, alinhando‑o às interfaces de login do Documento III - P2527 (campos obrigatórios, formato de credenciais, mensagens de erro padronizadas e requisitos mínimos de segurança na autenticação).

## Impact

- Código afetado principalmente em `fibrolog_api/routers/auth.py`, `fibrolog_api/schemas/token.py` e possivelmente em `fibrolog_api/security.py` caso sejam identificadas novas regras de expiração/renovação de token.
- Pode exigir criação ou atualização de schemas Pydantic relacionados a autenticação (por exemplo, payloads de login, respostas detalhadas de erro) e documentação OpenAPI gerada automaticamente pelo FastAPI.
- Impacta o app móvel FibroLog, que deverá ajustar (ou confirmar) o formato das requisições de login, o tratamento dos códigos de status e das mensagens de erro retornadas pela API.
- Serve de base para futuras extensões de autenticação (como recuperação de senha, reforço de políticas de senha ou suporte a outros tipos de credenciais), garantindo que qualquer evolução esteja ancorada em especificações claras.
