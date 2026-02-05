## Why

A tela de registro (`/app/register.tsx`) atualmente usa uma paleta de cores azul (`#E6F4FE`, `#0066CC`), enquanto a tela de login (`/app/login.tsx`) usa uma paleta roxa consistente com a identidade visual do FibroLog (`#faf5ff`, `#6b21a8`, `#9333ea`, `#a855f7`). Essa inconsistência visual prejudica a experiência do usuário e a coesão da marca. Esta mudança padroniza as cores da tela de registro para alinhar com a paleta roxa já estabelecida no login.

## What Changes

- Substituir cores azuis por cores roxas na tela de registro
- Atualizar cor de fundo de `#E6F4FE` (azul claro) para `#faf5ff` (purple-50)
- Atualizar cores de título/subtítulo para escala roxa (`#6b21a8`, `#9333ea`)
- Atualizar cor do botão principal para `#a855f7` (purple-500)
- Atualizar cor das bordas dos inputs para `#e9d5ff` (purple-200)
- Atualizar cor do texto do botão secundário para `#9333ea` (purple-600)
- Adicionar labels aos campos de input (seguindo padrão do login)
- Melhorar estrutura do layout para consistência com tela de login

## Capabilities

### New Capabilities
- `ui-theme-consistency`: Garantir consistência visual entre telas de autenticação usando paleta de cores roxa padronizada

### Modified Capabilities
<!-- Nenhuma capability existente está sendo modificada - apenas implementação visual -->

## Impact

**Código afetado:**
- `app/register.tsx`: StyleSheet completo (cores, espaçamentos, estrutura)
- Possível impacto em testes de snapshot (se existirem)

**Sistemas afetados:**
- Nenhum impacto em APIs ou backend
- Apenas mudanças visuais/CSS no frontend

**Dependências:**
- Nenhuma nova dependência necessária
