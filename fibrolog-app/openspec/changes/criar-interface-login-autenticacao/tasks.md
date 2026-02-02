## 1. Estrutura de autenticacao e navegacao

- [x] 1.1 Criar grupo de rotas `(auth)` em `app/(auth)/` com arquivos `login.tsx` e `signup.tsx` seguindo o padrao do Expo Router.
- [x] 1.2 Ajustar `app/_layout.tsx` para envolver a arvore de navegacao em um `AuthProvider` que decide entre `(auth)` e `(tabs)` com base no estado de autenticacao.
- [x] 1.3 Garantir que usuarios nao autenticados sejam sempre redirecionados para o fluxo `(auth)` e que usuarios autenticados acessem apenas o fluxo principal.

## 2. Contexto e servico de autenticacao

- [x] 2.1 Criar `AuthContext` e `AuthProvider` (por exemplo em `contexts/auth-context.tsx`) expondo `signIn`, `signUp`, `signOut` e `restoreSession`.
- [x] 2.2 Implementar `restoreSession` para ler tokens do armazenamento seguro, validar minimamente e popular o estado de usuario ou enviar para tela de login.
- [x] 2.3 Criar `services/auth-service.ts` integrando com `services/api.ts` para funcoes `login`, `signup` e, se aplicavel, `refreshToken`.
- [ ] 2.4 Implementar mapeamento de erros da API para mensagens amigaveis em portugues (credenciais invalidas, email ja utilizado, falhas de rede, timeouts).

## 3. Armazenamento seguro e gestao de sessao

- [x] 3.1 Instalar e configurar `expo-secure-store` para armazenamento seguro de tokens de autenticacao.
- [x] 3.2 Implementar persistencia de tokens apos login/cadastro bem-sucedidos, salvando antes de navegar para a area principal.
- [x] 3.3 Implementar limpeza de tokens e estado de usuario em `signOut`, garantindo navegacao de volta para a tela de login.

## 4. Tela de login (`login-interface-mobile`)

- [x] 4.1 Implementar tela `app/(auth)/login.tsx` com campos de email e senha, usando componentes de UI reutilizaveis (inputs, botoes, textos).
- [x] 4.2 Adicionar validacao local dos campos (obrigatoriedade, formato de email) e mensagens de erro junto aos campos quando invalidos.
- [x] 4.3 Integrar o envio do formulario de login com `AuthContext.signIn`, exibindo indicadores de carregamento e desabilitando envio duplicado.
- [x] 4.4 Exibir mensagens de erro globais (ex: credenciais invalidas, erro de rede) em componente apropriado, conforme especificado nas specs.

## 5. Tela de cadastro (`signup-interface-mobile`)

- [x] 5.1 Implementar tela `app/(auth)/signup.tsx` com campos definidos pelo produto (nome, email, senha, confirmacao de senha, etc.).
- [x] 5.2 Implementar validacoes locais: obrigatoriedade, formato de email e consistencia entre senha e confirmacao.
- [x] 5.3 Integrar o envio do formulario de cadastro com `AuthContext.signUp`, exibindo loading e tratamento de erros de API (email ja utilizado, dados invalidos).
- [x] 5.4 Garantir que cadastro bem-sucedido autentique o usuario e navegue para a area principal.

## 6. Experiencia de usuario e acessibilidade

- [x] 6.1 Ajustar comportamento do teclado (KeyboardAvoidingView ou equivalente) para nao cobrir campos e botoes principais nas telas de login/cadastro.
- [ ] 6.2 Configurar `returnKeyType` e `onSubmitEditing` para facilitar envio do formulario via teclado virtual.
- [x] 6.3 Garantir feedback visual adequado em botoes/links (toque, estados desabilitado/carregando) alinhado ao design system e prototipos.

## 7. Validacao, testes manuais e revisao visual

- [ ] 7.1 Validar manualmente cenarios principais de login: sucesso, credenciais invalidas, campos vazios, erros de rede/timeout.
- [ ] 7.2 Validar manualmente cenarios principais de cadastro: sucesso, campos invalidos, senhas divergentes, email ja utilizado.
- [ ] 7.3 Validar restauracao de sessao ao abrir o app e comportamento de logout.
- [ ] 7.4 Revisar as telas implementadas frente aos prototipos do documento `Documento III - P2527...` e ajustar detalhes visuais conforme necessario.
