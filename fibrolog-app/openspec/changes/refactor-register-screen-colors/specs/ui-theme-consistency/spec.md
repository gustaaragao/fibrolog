## ADDED Requirements

### Requirement: Tela de registro usa paleta roxa padronizada
A tela de registro SHALL usar a paleta de cores roxa consistente com a identidade visual do FibroLog, alinhada com a tela de login.

#### Scenario: Cor de fundo da tela
- **WHEN** usuário acessa a tela de registro
- **THEN** a cor de fundo SHALL ser `#fdf2f9` (pink-50)

#### Scenario: Cor do título principal
- **WHEN** título "Criar Conta" é renderizado
- **THEN** a cor do texto SHALL ser `#7d1e60` (pink-800)

#### Scenario: Cor do subtítulo
- **WHEN** subtítulo "Cadastre-se no FibroLog" é renderizado
- **THEN** a cor do texto SHALL ser `#b5228a` (pink-600)

### Requirement: Inputs usam paleta roxa e têm labels visíveis
Os campos de entrada SHALL usar cores roxas para bordas e texto, e MUST ter labels visíveis acima de cada campo para melhor acessibilidade.

#### Scenario: Cor da borda dos inputs
- **WHEN** campos de entrada são renderizados
- **THEN** a cor da borda SHALL ser `#facfe9` (pink-200)

#### Scenario: Cor do texto nos inputs
- **WHEN** usuário digita em um campo
- **THEN** a cor do texto SHALL ser `#7d1e60` (pink-800)

#### Scenario: Cor do placeholder
- **WHEN** campo está vazio
- **THEN** a cor do placeholder SHALL ser `#999` (cinza médio, consistente com login)

#### Scenario: Labels visíveis acima dos inputs
- **WHEN** campos de entrada são renderizados
- **THEN** cada campo MUST ter um label visível acima com cor `#7d1e60` (pink-800) e fontSize 16

### Requirement: Botão principal usa cor roxa
O botão de cadastro SHALL usar cor de fundo roxa consistente com a paleta do FibroLog.

#### Scenario: Cor do botão em estado normal
- **WHEN** botão "Cadastrar" está habilitado
- **THEN** a cor de fundo SHALL ser `#D330AA` (pink-500)

#### Scenario: Cor do botão em estado de loading/desabilitado
- **WHEN** botão está desabilitado ou em estado de loading
- **THEN** a cor de fundo SHALL ser `#f7a9d7` (pink-300)

#### Scenario: Cor do texto do botão
- **WHEN** botão é renderizado
- **THEN** a cor do texto SHALL ser `#fff` (branco)

### Requirement: Botão de navegação usa cor roxa
O link "Já tem uma conta? Faça login" SHALL usar cor de texto roxa consistente com a paleta.

#### Scenario: Cor do link de navegação
- **WHEN** link de navegação é renderizado
- **THEN** a cor do texto SHALL ser `#b5228a` (pink-600)

### Requirement: Espaçamentos e estrutura alinhados com login
A estrutura e espaçamentos da tela SHALL ser consistentes com a tela de login para manter coesão visual.

#### Scenario: Padding horizontal do container
- **WHEN** tela é renderizada
- **THEN** o container de formulário SHALL ter `paddingHorizontal: 32`

#### Scenario: Margem inferior dos inputs
- **WHEN** campos são renderizados
- **THEN** cada input container SHALL ter `marginBottom: 24` (exceto o último)

#### Scenario: Margem inferior do título
- **WHEN** título é renderizado
- **THEN** SHALL ter `marginBottom: 8`

#### Scenario: Margem inferior do subtítulo
- **WHEN** subtítulo é renderizado
- **THEN** SHALL ter `marginBottom: 48`
