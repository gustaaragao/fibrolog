## Context

O projeto foi criado a partir de um template padrao do Expo Router (SDK 54) e atualmente possui diversas telas, rotas e componentes de exemplo que nao fazem parte do produto final do FibroLog. Ja existem telas de login recem implementadas e o objetivo e que o app rode essencialmente como um cliente de autenticacao da API do FibroLog, redirecionando o usuario autenticado para uma tela inicial protegida.

Do ponto de vista tecnico, precisamos:
- Simplificar a arvore de rotas do Expo Router, removendo telas de exemplo.
- Garantir um fluxo claro de autenticacao: tela de login → chamada de API → armazenamento de estado → redirecionamento.
- Manter o uso de TypeScript em modo strict, seguindo convencoes de nomenclatura e organizacao descritas em `AGENTS.md`.

## Goals / Non-Goals

**Goals:**
- Remover arquivos do boilerplate do Expo que nao sao usados no fluxo de login ou na tela apos login.
- Manter apenas as telas e componentes necessarios para o fluxo de autenticacao com a API do FibroLog.
- Implementar a chamada de login para a API (email/senha) com tratamento de erros e estados de carregamento.
- Definir a navegacao entre rota publica de login e rota privada (tela inicial apos login).
- Deixar o codigo preparado para futuras telas autenticadas, reutilizando o mesmo mecanismo de protecao.

**Non-Goals:**
- Implementar todas as telas funcionais do FibroLog apos o login (apenas uma tela inicial simples e suficiente).
- Tratar fluxos complexos de sessao (renovacao de token, logout em multiplos dispositivos, refresh silencioso etc.).
- Configurar testes automatizados ou EAS build como parte desta change.

## Decisions

- **Remocao de boilerplate do Expo:**
  - Decisao: apagar telas, rotas e componentes de exemplo que nao participam do fluxo de login ou da tela inicial pos-login.
  - Racional: reduz ruido, melhora a compreensao do codigo e diminui chance de navegar para telas que nao pertencem ao produto.

- **Separacao entre rotas publicas e privadas:**
  - Decisao: utilizar a estrutura do Expo Router para ter uma rota de login publica e um grupo de rotas privadas (por exemplo, `(app)` ou similar) que so sao acessiveis quando o usuario estiver autenticado.
  - Racional: segue boas praticas de apps autenticados, facilita aplicar protecao de rota e middleware de verificacao de sessao.

- **Armazenamento de estado de autenticacao:**
  - Decisao: manter um contexto de autenticacao (por exemplo, `AuthContext`) que armazena informacoes minimas do usuario/logado e o token retornado pela API.
  - Racional: centraliza a logica de autenticacao, facilita o acesso ao estado em qualquer tela privada e simplifica a integracao futura com logout/refresh.

- **Chamada de login para API:**
  - Decisao: criar uma funcao de servico em `services/api.ts` (ou modulo similar) que receba credenciais tipadas, faca a requisicao HTTP para a API do FibroLog e retorne um resultado tipado.
  - Racional: respeita o padrao de centralizar chamadas HTTP, facilita debug e manutencao; mantem a tela de login focada apenas em UI e tratamento de estados.

- **Feedback de erro e carregamento:**
  - Decisao: a tela de login deve exibir estado de loading durante a requisicao e mensagens de erro amigaveis em caso de falha.
  - Racional: melhora UX e facilita debug em ambiente de desenvolvimento.

## Risks / Trade-offs

- **Remocao de arquivos ainda uteis para referencia:**
  - Risco: ao deletar telas/arquivos de exemplo, perdemos referencias rapidas de codigo gerado pelo template.
  - Trade-off: preferimos um projeto limpo e focado; se necessario, podemos consultar a documentacao do Expo ou recriar exemplos.

- **Dependencia forte da API para fluxo principal:**
  - Risco: se a API estiver indisponivel, o app nao funciona alem da tela de login.
  - Trade-off: aceitavel para esta fase; no futuro podemos adicionar mocks ou modo offline.

- **Complexidade incremental de autenticacao no contexto:**
  - Risco: adicionar contexto de autenticacao sem planejar pode levar a acoplamento indesejado se o app crescer.
  - Trade-off: neste momento o escopo e pequeno; o desenho do contexto sera mantido simples e facil de refatorar depois.
