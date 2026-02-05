## Context

A tela de registro atualmente utiliza uma paleta de cores azul enquanto a tela de login segue a identidade visual roxa do FibroLog. O arquivo `app/register.tsx` possui seu próprio `StyleSheet` com cores hardcoded que precisam ser alinhadas com o padrão estabelecido em `app/login.tsx`.

**Estado atual:**
- `app/register.tsx`: Usa cores azuis (`#E6F4FE`, `#0066CC`, `#ddd`)
- `app/login.tsx`: Usa paleta roxa padronizada (`#faf5ff`, `#6b21a8`, `#9333ea`, `#a855f7`, `#e9d5ff`)
- Estrutura dos inputs difere: login tem labels explícitos, registro usa apenas placeholders

**Constraints:**
- React Native com Expo SDK 54
- TypeScript strict mode
- StyleSheet.create() para estilos (padrão do projeto)
- Manter funcionalidade existente intacta (apenas mudanças visuais)

## Goals / Non-Goals

**Goals:**
- Padronizar paleta de cores da tela de registro para roxo (purple-50 a purple-800)
- Alinhar estrutura visual com tela de login (labels, espaçamentos, hierarquia)
- Manter consistência de UX entre fluxos de autenticação
- Preservar todos os comportamentos funcionais existentes (validação, navegação, loading states)

**Non-Goals:**
- Criar componentes compartilhados entre login/registro (refatoração futura)
- Adicionar temas dinâmicos ou dark mode (fora do escopo)
- Modificar lógica de validação ou integração com API
- Alterar estrutura de navegação ou rotas

## Decisions

### 1. Mapeamento de Cores: Substituição Direta vs. Sistema de Tokens

**Decisão:** Substituição direta de valores hex no StyleSheet.

**Rationale:**
- O projeto ainda não possui sistema de design tokens centralizado
- Criar tokens agora seria over-engineering para uma mudança isolada
- Ambas as telas (login e registro) usam cores hardcoded atualmente
- Mantém consistência com padrão existente do código

**Alternativas consideradas:**
- **Sistema de tokens em `constants/theme.ts`**: Melhor para escala, mas requer refatoração de `app/login.tsx` também (fora do escopo desta mudança)
- **Uso de variáveis locais**: Adiciona complexidade sem benefício claro para apenas uma tela

### 2. Estrutura de Inputs: Labels vs. Placeholders

**Decisão:** Adicionar labels acima dos inputs seguindo padrão do login.

**Rationale:**
- Melhor acessibilidade (screen readers identificam campos claramente)
- Consistência visual com `app/login.tsx`
- Placeholders desaparecem durante digitação, labels permanecem visíveis
- Alinha com boas práticas de UX para formulários

**Alternativas consideradas:**
- **Manter apenas placeholders**: Mais limpo visualmente, mas pior para acessibilidade e inconsistente com login

### 3. Ajuste de Espaçamentos e Layout

**Decisão:** Aplicar espaçamentos similares ao login com ajustes mínimos.

**Rationale:**
- Login usa `paddingHorizontal: 32` e `marginBottom` consistentes
- Registro atualmente usa `padding: 20` genérico
- Alinhamento visual melhora percepção de coesão entre telas
- ScrollView do registro requer `paddingBottom` adicional para evitar corte de conteúdo

**Mapeamento específico:**
```
container.backgroundColor: #E6F4FE → #faf5ff (purple-50)
titulo.color: #0066CC → #6b21a8 (purple-800)
subtitulo.color: #666 → #9333ea (purple-600)
input.borderColor: #ddd → #e9d5ff (purple-200)
input.color: (herdado) → #6b21a8 (purple-800)
botao.backgroundColor: #0066CC → #a855f7 (purple-500)
botaoDesabilitado: opacity: 0.6 → backgroundColor: #d8b4fe (purple-300)
textoVoltar.color: #0066CC → #9333ea (purple-600)
```

### 4. Estado de Loading do Botão

**Decisão:** Mudar de `opacity: 0.6` para cor de fundo específica (`#d8b4fe`).

**Rationale:**
- Segue padrão já implementado em `app/login.tsx` (`.loginButtonDisabled`)
- Feedback visual mais claro e consistente
- Cor roxa clara mantém identidade visual mesmo em estado desabilitado

## Risks / Trade-offs

**[Risco] Divergência futura entre login e registro**  
→ **Mitigação:** Documentar paleta padrão em comentários inline. Considerar criação de `constants/colors.ts` em refatoração futura.

**[Risco] Testes de snapshot quebrados (se existirem)**  
→ **Mitigação:** Verificar existência de testes visuais e atualizar snapshots após implementação.

**[Trade-off] Código duplicado entre login e registro**  
→ **Aceitável:** Componentes compartilhados podem ser extraídos futuramente quando houver mais telas de autenticação. Prematuro neste momento.

**[Trade-off] Cores hardcoded ao invés de tokens**  
→ **Aceitável:** Mantém consistência com código atual. Sistema de tokens deve ser introduzido em refatoração maior que cubra toda aplicação.
