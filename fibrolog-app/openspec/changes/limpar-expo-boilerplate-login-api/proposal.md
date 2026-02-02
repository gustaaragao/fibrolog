## Why

O projeto atualmente ainda contem diversas telas e configuracoes padrao do boilerplate do Expo, o que dificulta focar e testar o fluxo real de login com a API do FibroLog. Esta change existe para simplificar o app deixando apenas o que e necessario para autenticar o usuario na API e redirecionar para a primeira tela apos login.

## What Changes

- Remover telas, rotas e componentes de exemplo gerados pelo template inicial do Expo Router.
- Manter e organizar apenas os arquivos relacionados ao fluxo de login ja implementado.
- Integrar o formulario de login com a API real do FibroLog para autenticar usuarios.
- Garantir tratamento de erros de autenticacao (credenciais invalidas, falha de rede, status inesperados).
- Redirecionar o usuario autenticado para uma tela inicial apos login bem-sucedido.
- Preparar a estrutura de navegacao para que, no futuro, outras telas autenticadas sejam adicionadas com facilidade.

## Capabilities

### New Capabilities
- `login-usuario-api`: Autenticar usuario na API do FibroLog a partir de email/senha no app mobile, armazenar o estado de autenticacao e lidar com erros de forma amigavel.
- `fluxo-pos-login-redirect`: Redirecionar automaticamente o usuario autenticado para uma tela inicial protegida, garantindo que apenas usuarios logados alcancem essa tela.

### Modified Capabilities
- `estrutura-navegacao-app`: Ajustar a navegacao existente para girar em torno do fluxo de login + tela inicial autenticada, removendo rotas de exemplo do boilerplate.

## Impact

- Telas e rotas em `app/` relacionadas ao boilerplate inicial serao removidas ou reestruturadas.
- Componentes de exemplo em `components/` que nao forem usados no fluxo de login serao removidos.
- Possivel atualizacao de hooks/contextos de autenticacao (por exemplo, contexto de usuario logado) para integrar com a API.
- Configuracoes de navegacao do Expo Router serao ajustadas para suportar fluxo publico (login) e privado (tela apos login).
