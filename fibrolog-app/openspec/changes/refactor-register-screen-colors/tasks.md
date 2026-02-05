## 1. Atualizar cores do container e estrutura base

- [x] 1.1 Atualizar `container.backgroundColor` de `#E6F4FE` para `#faf5ff` (purple-50)
- [x] 1.2 Atualizar `content.padding` para usar estrutura similar ao login com `paddingHorizontal: 32`
- [x] 1.3 Adicionar `paddingBottom: 50` no formContainer para consistência

## 2. Atualizar cores e espaçamentos de título/subtítulo

- [x] 2.1 Atualizar `titulo.color` de `#0066CC` para `#6b21a8` (purple-800)
- [x] 2.2 Atualizar `titulo.marginBottom` para `8` (consistente com login)
- [x] 2.3 Atualizar `subtitulo.color` de `#666` para `#9333ea` (purple-600)
- [x] 2.4 Atualizar `subtitulo.marginBottom` para `48` (consistente com login)

## 3. Adicionar labels aos campos de input

- [x] 3.1 Criar estilo `label` com color `#6b21a8`, fontSize `16`, fontWeight `600`, marginBottom `8`
- [x] 3.2 Criar estilo `inputContainer` com marginBottom `24`
- [x] 3.3 Adicionar componente Text com label "Nome completo" acima do input de nome
- [x] 3.4 Adicionar componente Text com label "Email" acima do input de email
- [x] 3.5 Adicionar componente Text com label "Senha" acima do input de senha
- [x] 3.6 Adicionar componente Text com label "Confirmar senha" acima do input de confirmação

## 4. Atualizar cores dos campos de input

- [x] 4.1 Atualizar `input.borderColor` de `#ddd` para `#e9d5ff` (purple-200)
- [x] 4.2 Adicionar `input.color` com valor `#6b21a8` (purple-800)
- [x] 4.3 Atualizar `placeholderTextColor` para `#999` em todos os TextInput

## 5. Atualizar cores do botão principal

- [x] 5.1 Atualizar `botao.backgroundColor` de `#0066CC` para `#a855f7` (purple-500)
- [x] 5.2 Substituir estilo `botaoDesabilitado` com `opacity: 0.6` por `backgroundColor: #d8b4fe` (purple-300)
- [x] 5.3 Adicionar `marginTop: 16` no botão principal para consistência

## 6. Atualizar cores do botão de navegação

- [x] 6.1 Atualizar `textoVoltar.color` de `#0066CC` para `#9333ea` (purple-600)
- [x] 6.2 Atualizar `textoVoltar.fontWeight` para `500` (consistente com login)

## 7. Ajustes finais de estrutura e layout

- [x] 7.1 Renomear `formulario` para `formContainer` para consistência de nomenclatura
- [x] 7.2 Remover estilos não utilizados (se houver)
- [x] 7.3 Organizar ordem dos estilos no StyleSheet (container, layout, texto, inputs, botões)

## 8. Validação e testes

- [ ] 8.1 Testar tela no iOS para verificar renderização das cores
- [ ] 8.2 Testar tela no Android para verificar renderização das cores
- [ ] 8.3 Verificar acessibilidade dos labels com screen reader (se disponível)
- [ ] 8.4 Comparar visualmente com tela de login para garantir consistência
- [ ] 8.5 Testar estados de loading/disabled do botão
- [ ] 8.6 Verificar se existem testes de snapshot e atualizá-los se necessário
