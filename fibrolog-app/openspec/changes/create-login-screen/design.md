## Context

O projeto atual é uma aplicação Expo/React Native que precisa integrar com uma API FastAPI existente rodando em localhost:8000. A API possui endpoints de autenticação bem definidos (/auth) com schemas Pydantic para validação (PacienteSchema, Token, TokenData). O projeto Expo foi criado com configuração padrão, contendo múltiplos arquivos e telas de exemplo que não são necessários para o objetivo final.

A aplicação precisa de um fluxo de autenticação seguro que permita apenas usuários autenticados acessarem as funcionalidades principais.

## Goals / Non-Goals

**Goals:**
- Criar uma tela de login minimalista e funcional com validação adequada
- Integrar autenticação JWT com a API FastAPI existente
- Implementar navegação condicional baseada no estado de autenticação
- Limpar estrutura do projeto removendo arquivos desnecessários do Expo
- Garantir armazenamento seguro do token de autenticação

**Non-Goals:**
- Criar funcionalidades de registro de usuário (usar API existente)
- Implementar recuperação de senha nesta fase
- Modificar a API backend existente
- Adicionar autenticação biométrica ou social login

## Decisions

### 1. Stack de Navegação
**Decisão**: Usar React Navigation v6 com Stack Navigator
**Rationale**: É o padrão da comunidade React Native, oferece navegação condicional nativa e integração simples com estado de autenticação. Alternativas como React Router Native são menos adequadas para mobile.

### 2. Gerenciamento de Estado de Autenticação
**Decisão**: Usar Context API + AsyncStorage para persistência
**Rationale**: Para um fluxo simples de login/logout, Context API é suficiente e não adiciona complexidade desnecessária. AsyncStorage permite persistir o token entre sessões. Evita overhead de Redux/Zustand neste caso específico.

### 3. Validação de Formulário
**Decisão**: Usar react-hook-form + zod para validação
**Rationale**: react-hook-form oferece performance superior e zod permite replicar as validações do backend Pydantic (email, senha forte). Alternativa Formik é mais pesada para este caso de uso simples.

### 4. HTTP Client
**Decisão**: Usar Axios com interceptors para gerenciamento de token
**Rationale**: Axios oferece interceptors nativos para adicionar token automaticamente e tratar expiração. Fetch API nativo exigiria mais código boilerplate.

### 5. Estrutura de Projeto
**Decisão**: Organizar em `/src` com pastas `screens`, `components`, `services`, `contexts`
**Rationale**: Estrutura padrão que facilita manutenção e escalabilidade. Remove dependência da estrutura padrão do Expo.

### 6. Armazenamento de Token
**Decisão**: Usar @react-native-async-storage/async-storage com expo-secure-store como fallback
**Rationale**: AsyncStorage é suficiente para tokens JWT (não são secrets críticos), mas SecureStore oferece camada adicional de segurança em produção.

## Risks / Trade-offs

**Risco**: Token JWT sem refresh automático → **Mitigação**: Implementar logout automático na expiração e interceptor para detectar 401

**Risco**: Hardcoded localhost pode falhar em dispositivo físico → **Mitigação**: Usar variáveis de ambiente (expo-constants) para diferentes ambientes

**Risco**: Validação client-side pode divergir do backend → **Mitigação**: Manter schemas de validação sincronizados e sempre validar no backend também

**Risco**: AsyncStorage não é criptografado → **Mitigação**: Tokens JWT são autocontidos e temporários, mas considerar SecureStore para dados sensíveis

**Trade-off**: Simplicidade vs. Robustez → **Escolha**: Priorizar simplicidade nesta fase, com arquitetura que permite evolução para soluções mais robustas