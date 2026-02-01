# 📱 CONTEXTO MESTRE: FibroLog App (Frontend)
Diretrizes, arquitetura e requisitos específicos para o aplicativo mobile FibroLog.

---

## 1. VISÃO GERAL DO APP

**Produto:** FibroLog - Sistema Digital para Monitoramento da Fibromialgia
**Plataforma:** Mobile (Android/iOS) via React Native + Expo
**Público-Alvo:** Pacientes com fibromialgia (foco em usabilidade e acessibilidade para "fibrofog")

### 1.1 Objetivos Principais
- Monitoramento diário de sintomas (Dor, Fadiga, Sono, Humor).
- Registro de crises com suporte a áudio (transcrição automática).
- Visualização de relatórios e histórico.
- Rede de apoio e alertas de medicação.

---

## 2. ARQUITETURA E STACK (APP)

### 2.1 Core
- **Framework:** React Native com Expo (Managed Workflow)
- **Linguagem:** TypeScript
- **Navegação:** Expo Router (File-based routing)
- **Estilização:** NativeWind (Tailwind CSS) ou StyleSheet padrão (Manter consistência com o projeto atual)
- **Gerenciamento de Estado:** React Context API ou Zustand (Simples e eficaz)

### 2.2 Estrutura de Pastas (Sugerida)
```
fibrolog-app/
├── app/                    # Rotas (Expo Router)
│   ├── (auth)/             # Rotas de autenticação (Login, Cadastro)
│   ├── (tabs)/             # Navegação principal (Home, Registros, Relatórios)
│   ├── modal.tsx           # Modais globais
│   └── _layout.tsx         # Layout raiz
├── components/             # Componentes reutilizáveis (Botões, Cards, Inputs)
├── hooks/                  # Custom Hooks (Lógica de negócio)
├── services/               # Integração com API (Axios/TanStack Query)
├── stores/                 # Gerenciamento de estado global
├── assets/                 # Imagens, Fontes, Ícones
└── constants/              # Cores, Temas, Configurações
```

---

## 3. FUNCIONALIDADES DETALHADAS (Baseado no Documento de Visão)

### 3.1 Autenticação e Perfil
- **Login/Cadastro:** E-mail e senha.
- **Perfil:** Dados básicos, foto, histórico médico (opcional).
- **Rede de Apoio:** Cadastro de contatos de confiança para notificações de crise.

### 3.2 Registro Diário (Wizard/Passo-a-passo)
1.  **Nível de Dor:** Escala NRS (0-10).
2.  **Mapa Corporal:** Seleção de áreas doloridas (interativo).
3.  **Fadiga e Sono:** Escalas visuais/numéricas.
4.  **Estado Emocional:** Seleção de ícones/emojis.
5.  **Validação:** RN006 - Apenas 1 registro diário (permite edição/sobrescrita).

### 3.3 Registro de Crises (Botão de Pânico/Acesso Rápido)
- **Funcionalidade:** Acesso imediato para registrar episódio agudo.
- **Áudio:** Gravação de relato (max 60s) para transcrição via IA (Whisper/Gemini).
- **Notificação:** Envio automático de alerta para Rede de Apoio (opcional).

### 3.4 Relatórios e Visualização
- **Dashboard:** Resumo semanal/mensal de sintomas.
- **Exportação:** Geração de PDF para consulta médica.
- **Gráficos:** Evolução da dor e humor ao longo do tempo.

### 3.5 Funcionalidades Auxiliares
- **Alertas:** Lembretes de medicação e consultas.
- **Conteúdo:** Sugestões de autocuidado e educação sobre a doença.

---

## 4. INTEGRAÇÃO COM API (Backend)

- **Cliente HTTP:** Axios configurado com Interceptors para JWT.
- **Base URL:** Definida via variáveis de ambiente (`EXPO_PUBLIC_API_URL`).
- **Autenticação:** Armazenamento seguro de tokens (Expo SecureStore).
- **Offline First:** Cache local para funcionamento básico sem internet (opcional, via Async Storage ou TanStack Query).

---

## 5. UI/UX E ACESSIBILIDADE

- **Design System:** Baseado em Material Design (Android) e Human Interface Guidelines (iOS).
- **Acessibilidade:**
    - Fontes legíveis e escaláveis.
    - Alto contraste para facilitar leitura.
    - Botões grandes e áreas de toque acessíveis (pensando em fadiga motora).
- **Feedback:** Feedback visual e háptico para ações de registro.

---

## 6. DIRETRIZES DE DESENVOLVIMENTO (APP)

1.  **Componentização:** Crie componentes pequenos e isolados.
2.  **Tipagem:** Use interfaces TypeScript para todas as props e respostas da API.
3.  **Tratamento de Erros:** Exiba mensagens amigáveis ao usuário (Toasts/Alertas).
4.  **Testes:** Testes unitários com Jest e componentes com React Native Testing Library.
