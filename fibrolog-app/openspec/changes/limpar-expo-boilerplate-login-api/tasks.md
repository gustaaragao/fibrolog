## 1. Limpeza de boilerplate do Expo

- [x] 1.1 Identificar e remover telas, rotas e componentes de exemplo do Expo que nao fazem parte do fluxo de login ou da tela inicial protegida (por exemplo, telas de "Hello world" e "Explore").
- [x] 1.2 Garantir que a estrutura de roteamento inicial esteja centrada no grupo de autenticacao `(auth)` e no grupo privado de telas autenticadas (por exemplo, `(tabs)`), conforme definido na change.

## 2. Implementacao do login via API FibroLog

- [x] 2.1 Confirmar que o servico de autenticacao (`auth-service`) chama o endpoint `POST /auth/token` com corpo `application/x-www-form-urlencoded` usando `username` (email) e `password` (senha).
- [x] 2.2 Garantir que a tela de login utilize o `AuthContext` para chamar o servico de login, exibindo estados de carregamento e mensagens de erro amigaveis para credenciais invalidas e erros de rede.
- [x] 2.3 Armazenar o `access_token` retornado de forma segura (por exemplo, via `expo-secure-store`) e disponibiliza-lo para futuras chamadas autenticadas.

## 3. Navegacao e fluxo pos-login

- [x] 3.1 Configurar o `AuthContext` para representar o estado de autenticacao do usuario (token, email) e expor metodos `signIn` e `signOut`.
- [x] 3.2 Ajustar o layout raiz (`app/_layout.tsx`) para alternar entre rotas publicas `(auth)` e rotas privadas `(tabs)` com base no estado de autenticacao.
- [x] 3.3 Garantir que rotas privadas nao sejam acessiveis sem token valido em memoria, redirecionando para a tela de login quando necessario.
- [x] 3.4 Definir uma tela inicial protegida simples dentro de `(tabs)` que represente o primeiro destino apos login bem-sucedido.

## 4. Testes manuais do fluxo de autenticacao

- [ ] 4.1 Subir a API FastAPI localmente em `http://localhost:8000` e garantir que o endpoint `POST /auth/token` esteja acessivel.
- [ ] 4.2 Rodar o app (por exemplo, `npm start`) e testar login com credenciais validas, verificando que o token e recebido, armazenado e que o usuario e redirecionado para a tela protegida.
- [ ] 4.3 Testar login com email ou senha incorretos, confirmando que nenhuma sessao e criada e que a mensagem "Email ou senha incorretos" (ou equivalente) e exibida.
- [ ] 4.4 Testar cenarios de falha de rede ou indisponibilidade da API, verificando que uma mensagem de erro generica e exibida e que o usuario pode tentar novamente.
