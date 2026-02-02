## Context

O FibroLog e um aplicativo mobile desenvolvido com Expo + React Native e Expo Router, com suporte a temas claro/escuro e componentes reutilizaveis em `components/`. Ja existe (ou sera criada em outro change) uma integracao de backend para autenticacao (API FibroLog), mas ainda nao ha uma camada de interface grafica dedicada para login, cadastro e gestao de sessao no app.

Este design foca em como implementar as telas e fluxos de autenticacao no cliente mobile, alinhados ao design system atual e aos prototipos de alta fidelidade descritos no documento de referencia `Documento III - P2527 FibroLog - Sistema Digital para Monitoramento da Fibromialgia.docx.pdf`. Mesmo sem acesso direto ao conteudo do PDF aqui, assumimos que ele define estrutura basica das telas (logo, campos, botoes primarios/secundarios, mensagens de erro) e padroes visuais que devem ser respeitados.

Os fluxos principais a cobrir sao:
- Login com email e senha;
- Cadastro inicial (signup) com campos basicos definidos pelo produto;
- Restauracao de sessao a partir de token salvo;
- Logout que retorna o usuario para a tela de login.

## Goals / Non-Goals

**Goals:**
- Implementar telas de login e cadastro no app Expo, respeitando o design system existente e a hierarquia visual dos prototipos.
- Integrar essas telas com um servico de autenticacao encapsulado (camada `services/`), sem acoplar diretamente a logica de rede dentro dos componentes de UI.
- Gerenciar o estado de autenticacao por meio de um contexto global (ex: `AuthContext`) expondo metodos `signIn`, `signUp`, `signOut` e restauracao de sessao.
- Tratar estados de carregamento e erros de autenticacao com feedbacks claros em portugues, usando componentes reutilizaveis (ex: banners, textos de erro, indicadores de loading).
- Garantir navegacao consistente entre fluxo de autenticacao (`(auth)`) e fluxo principal da aplicacao (`(tabs)` ou similar) com base no estado logado/nao logado.

**Non-Goals:**
- Redesenhar todo o sistema de navegacao da aplicacao fora do escopo de autenticacao.
- Implementar logica detalhada de backend (validacao robusta de senha, politicas de bloqueio de conta, MFA, etc.). Esses comportamentos sao responsabilidade da API.
- Definir layout completo de todas as telas do FibroLog (diarios, dashboards, etc.); este design cobre apenas telas ligadas a autenticacao.
- Implementar recuperacao de senha completa se ainda nao estiver especificada nos prototipos/escopo; pode ser planejada como change separado.

## Decisions

### Estrutura de navegacao

- Criar um grupo de rotas para autenticacao em `app/(auth)/` contendo pelo menos:
  - `app/(auth)/login.tsx` – tela principal de login;
  - `app/(auth)/signup.tsx` – tela de cadastro inicial.
- Manter o fluxo principal existente (por exemplo `app/(tabs)/`) para usuarios autenticados.
- No layout raiz (`app/_layout.tsx`), envolver a arvore de navegacao em um `AuthProvider`. Esse provider decide qual grupo mostrar com base no estado `usuarioAutenticado` (ou presenca de token valido):
  - usuario nao autenticado → exibir grupo `(auth)`;
  - usuario autenticado → exibir grupo principal (ex: `(tabs)`).
- Essa separacao simplifica a logica de redirecionamento e deixa o roteamento alinhado com o comportamento esperado nos prototipos (telas de login/cadastro acessiveis apenas para usuarios nao logados).

### Estado de autenticacao e contexto

- Criar um contexto dedicado em algo como `contexts/auth-context.tsx` (ou `hooks/use-auth.ts` + provider):
  - Estado principal: informacoes do usuario autenticado (ex: id, nome, email), tokens (access/refresh) em memoria e flag `carregandoSessao` para restauracao inicial;
  - Metodos expostos: `signIn(credentials)`, `signUp(dadosCadastro)`, `signOut()`, `restoreSession()`.
- Na inicializacao do app, o `AuthProvider` chama `restoreSession()` que:
  - tenta ler tokens seguros do armazenamento (ver decisoes de armazenamento abaixo);
  - valida minimamente a presenca/expiracao; se valido, popula estado de usuario e marca usuario como autenticado;
  - enquanto isso ocorre, exibe uma tela de splash/loading leve para evitar flicker entre login e tela principal.

### Armazenamento de tokens e seguranca

- Utilizar `expo-secure-store` para armazenamento de tokens de autenticacao (`accessToken` e, se existir, `refreshToken`), evitando armazenamento em texto puro em `AsyncStorage`.
- Gravar apenas o minimo necessario (tokens e talvez um identificador de usuario) e manter demais dados de perfil em memoria ou recarregados da API apos login.
- No `signOut()`, apagar todos os tokens do armazenamento seguro e limpar o estado em memoria, forçando navegacao de volta para `(auth)`.

### Integracao com servico de autenticacao

- Centralizar chamadas de rede em um modulo `services/auth-service.ts`, que usa o cliente HTTP padrao do projeto (ex: `services/api.ts`). Esse modulo expora funcoes assincronas tipadas:
  - `login({ email, senha }): Promise<AuthResult>`;
  - `signup(dadosCadastro): Promise<AuthResult>`;
  - `refreshToken(tokenAtual): Promise<AuthResult>` (se suportado pela API).
- O `AuthContext` chama essas funcoes; os componentes de tela apenas chamam os metodos do contexto, sem lidar com detalhes de URL, status HTTP ou formatos de resposta.
- Padronizar tratamento de erros no `auth-service` (mapeando codigos da API para mensagens amigaveis em portugues), de modo que o contexto/telas so precisem exibir mensagens ja traduzidas.

### Telas e componentes de UI

- Basear a organizacao visual das telas nos prototipos do documento `Documento III - P2527...`, respeitando:
  - hierarquia tipografica (titulo, subtitulo, labels, textos auxiliares);
  - posicao relativa de logo, formularios e botoes;
  - uso de cores e espacos conforme o tema existente em `constants/theme.ts`.
- Construir telas de login e cadastro com componentes reutilizaveis em `components/ui/`, por exemplo:
  - `components/ui/text-input.tsx` – campo de texto estilizado com suporte a label, mensagem de erro e estados de foco;
  - `components/ui/primary-button.tsx` – botao principal com loading opcional e desabilitado;
  - `components/ui/error-banner.tsx` – componente para exibir erros globais (ex: "Email ou senha invalidos").
- Em `login.tsx`:
  - campos: email (com `keyboardType="email-address"`, `autoCapitalize="none"`), senha (com `secureTextEntry`);
  - acoes: botao principal "Entrar", links secundarios conforme prototipo (ex: "Criar conta", "Esqueci minha senha");
  - durante `signIn`, desabilitar campos/botao e exibir indicador de carregamento.
- Em `signup.tsx`:
  - campos conforme escopo do produto (nome, email, senha, confirmacao de senha, outros campos especificados no documento de requisitos/prototipos);
  - validacoes basicas de obrigatoriedade, formato de email e consistencia de senha/confirmacao antes de chamar a API;
  - feedback de erro semelhante ao login.

### Validacao e tratamento de erros

- Utilizar validacao simples baseada em estado local (ex: funcoes que verificam campos obrigatorios e formatos) para manter o fluxo leve. Se necessario futuramente, integrar com uma biblioteca de validacao de schemas.
- Diferenciar erros de validacao local (ex: campo vazio) de erros de servidor (ex: credenciais invalidas, usuario ja existente):
  - validacao local → mensagens abaixo do campo correspondente;
  - erro de servidor → mensagem em um `error-banner` no topo ou proximidade do botao principal, seguindo diretrizes de UX do prototipo.
- Sempre registrar erros inesperados com `console.error` para facilitar diagnostico em desenvolvimento.

### Acessibilidade e UX mobile

- Configurar `returnKeyType` apropriado e `onSubmitEditing` para permitir envio do formulario via teclado virtual.
- Garantir que o teclado nao cubra campos e botoes principais, usando `KeyboardAvoidingView` ou solucao equivalente conforme layout definido nos prototipos.
- Fornecer toque/feedback visual adequado em botoes e links (opacity, ripple no Android) usando componentes padrao do React Native ou wrappers ja existentes no projeto.

## Risks / Trade-offs

- **Risco:** Dependencia dos prototipos em PDF que nao estao diretamente acessiveis neste ambiente pode gerar divergencias finas de layout.
  - **Mitigacao:** Implementar a estrutura geral (campos, fluxos, estados) de forma alinhada ao que e tipico em telas de login/cadastro e ajustar detalhes visuais posteriormente com base na revisao dos prototipos pelo time de design.

- **Risco:** Uso de `expo-secure-store` adiciona dependencia nativa e possiveis particularidades em plataformas diferentes.
  - **Mitigacao:** Instalar o pacote via `npx expo install expo-secure-store`, seguir a documentacao oficial e testar fluxos de login/logout/restauracao em Android, iOS e web (para web, usar fallback adequado se necessario).

- **Risco:** Complexidade de restauracao de sessao (tokens expirados, refresh falhando) pode levar a estados inconsistentes na UI.
  - **Mitigacao:** Tratar falhas de restauracao como logout seguro (limpar tokens, enviar usuario para tela de login) e, se aplicavel, exibir mensagem amigavel informando que a sessao expirou.

- **Risco:** Acoplamento excessivo entre telas de autenticacao e detalhes da API.
  - **Mitigacao:** Manter uma camada clara `auth-service` e um `AuthContext` com interface estavel; se a API mudar, apenas essa camada precisa ser atualizada.
