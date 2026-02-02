## Why

O aplicativo FibroLog hoje nao possui uma interface dedicada para login e autenticacao integrada com a API de autenticacao existente. Isso dificulta o acesso seguro dos usuarios, obriga logins manuais via ferramentas externas e impede que o app ofereca uma experiencia de sessao consistente (manter usuario logado, feedback de erros de credenciais, etc.). Com a proximidade de validacoes com usuarios finais, precisamos de um fluxo de autenticacao funcional e amigavel diretamente no app Expo.

## What Changes

- Adicionar telas de login e cadastro inicial no app Expo (React Native) seguindo o design system atual.
- Integrar os formularios de login/cadastro com a API de autenticacao ja existente (endpoints de login, registro e refresh de token, se disponiveis).
- Implementar validacao de campos (email, senha, confirmacao de senha) com mensagens de erro claras em portugues.
- Exibir estados de carregamento e tratamento padrao de erros de autenticacao (credenciais invalidas, usuario inexistente, problema de rede).
- Gerenciar o estado de sessao do usuario (armazenar token de acesso de forma segura e redirecionar para as telas principais apos login bem-sucedido).
- Garantir fluxo de logout que limpe o estado de autenticacao e retorne o usuario para a tela de login.

## Capabilities

### New Capabilities
- `login-interface-mobile`: Interface de login, com campos de email/senha, validacao basica, feedback de erro e navegacao para reset/cadastro.
- `signup-interface-mobile`: Interface de criacao de conta inicial, com campos necessarios e integracao com endpoint de registro da API FibroLog.
- `session-management-mobile`: Gerenciamento de sessao dentro do app (armazenamento de token, restauracao de sessao, logout e redirecionamento de telas).

### Modified Capabilities
- `fibrolog-auth-api-integration`: Ajustar requisitos de integracao para cobrir o consumo dos endpoints de autenticacao especificamente a partir do cliente mobile Expo, incluindo tratamento padrao de erros e timeouts no app.

## Impact

- Telas e navegacao em `app/` (novas rotas para login, cadastro, e possivel fluxo de onboarding).
- Componentes de UI reutilizaveis em `components/` (inputs, botoes, feedback de erro) que serao usados nas telas de autenticacao.
- Modulos de servico em `services/` para encapsular chamadas a API de autenticacao (login, cadastro, refresh, logout).
- Gestao de estado de autenticacao (contexto global ou hook dedicado) para controlar se o usuario esta logado e quais telas estao acessiveis.
- Configuracoes de build e ambiente, caso sejam necessarias variaveis de ambiente para endpoints ou chaves especificas da API de autenticacao.
