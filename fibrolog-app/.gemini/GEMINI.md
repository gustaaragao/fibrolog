# CONTEXTO DE DESENVOLVIMENTO: FibroLog App

Este documento fornece as diretrizes, tecnologias e convenções para o desenvolvimento do frontend (aplicativo mobile) do sistema FibroLog.

---

## 1. VISÃO GERAL DO PROJETO

- **Produto**: Sistema Digital para Monitoramento da Fibromialgia (FibroLog).
- **Objetivo**: Desenvolver um aplicativo mobile que permita a pacientes com fibromialgia registrar seus sintomas (dor, fadiga, sono), crises e outros dados relevantes para seu tratamento.
- **Plataforma**: Aplicativo mobile para Android e iOS.

---

## 2. ARQUITETURA E TECNOLOGIAS (FRONTEND)

### 2.1. Stack Tecnológica

- **Framework**: React Native com Expo.
- **Linguagem**: TypeScript.
- **Navegação**: Expo Router (navegação baseada em arquivos).
- **Estilização**: StyleSheet do React Native (sem bibliotecas de UI externas por padrão, para manter a performance).
- **Gerenciamento de Estado**: React Context API para estado global simples. Zustand pode ser considerado se a complexidade aumentar.
- **Requisições HTTP**: Fetch API ou Axios para comunicação com a API backend.
- **Linting e Formatação**: ESLint e Prettier.

### 2.2. Estrutura de Diretórios

```
fibrolog-app/
├── app/                      # Rotas e telas da aplicação (Expo Router)
│   ├── (tabs)/               # Layout de navegação com abas
│   │   ├── _layout.tsx       # Layout principal das abas
│   │   └── index.tsx         # Tela inicial
│   ├── modal.tsx             # Exemplo de tela modal
│   └── _layout.tsx           # Layout raiz da aplicação
├── assets/                   # Arquivos estáticos (fontes, imagens)
├── components/               # Componentes reutilizáveis
│   ├── ThemedText.tsx
│   └── ThemedView.tsx
├── constants/                # Constantes globais (cores, temas)
├── hooks/                    # Hooks customizados
└── services/                 # Módulos para interagir com serviços externos (ex: API)
    └── api.ts
```

### 2.3. Padrões de Design

-   **Component-Based Architecture**: A UI é construída a partir de componentes pequenos e reutilizáveis.
-   **Atomic Design (inspiração)**: Organize os componentes em complexidade crescente (atoms, molecules, organisms) se a aplicação crescer.
-   **Clean Separation**: Mantenha a lógica de UI separada da lógica de negócios. Componentes devem ser o mais "burros" possível, recebendo dados e funções via props. A lógica de busca de dados e manipulação de estado deve residir em hooks, services ou no nível da tela.

---

## 3. CONVENÇÕES DE CÓDIGO

### 3.1. Idioma e Nomenclatura

-   **Idioma**: Todo o código, comentários e documentação devem ser escritos em **Português (pt-BR)**.
-   **Nomenclatura de Arquivos**: `PascalCase.tsx` para componentes React (ex: `RegistroSintoma.tsx`), e `camelCase.ts` para outros arquivos (ex: `apiService.ts`).
-   **Componentes**: Nomes em `PascalCase` (ex: `BotaoPrincipal`).
-   **Variáveis e Funções**: `camelCase` (ex: `buscarRegistro`).
-   **Estilos**: `camelCase` para nomes de estilos no `StyleSheet` (ex: `container`, `tituloTexto`).

### 3.2. Estilo de Código e Qualidade

-   **Formatação**: Utilize **Prettier** para formatação automática do código.
-   **Linting**: Utilize **ESLint** para identificar e corrigir problemas no código.
-   **Tipagem**: **TypeScript** é obrigatório. Evite o uso de `any`. Defina tipos e interfaces para props, estados e dados da API.

### 3.3. Padrões de Componentes

-   **Componentes Funcionais**: Use exclusivamente componentes funcionais com Hooks.
-   **Props**: Defina uma `interface` ou `type` para as props de cada componente.
-   **Estilização**: Use `StyleSheet.create` para otimização. Evite `inline styles` sempre que possível.

### 3.4. Gerenciamento de Estado

-   **Estado Local**: Use o hook `useState` para estados que pertencem a um único componente.
-   **Estado Global**: Para estados compartilhados entre múltiplos componentes (ex: dados do usuário autenticado, tema), use a **Context API**. Se o estado se tornar muito complexo, considere migrar para Zustand.

---

## 4. INTERAÇÃO COM A API

-   **Centralização**: Crie um módulo de serviço (ex: `services/api.ts`) para centralizar todas as chamadas à API. Este módulo deve ser responsável por configurar a URL base, headers (como o token de autenticação) e o tratamento de erros.
-   **Tipos de Dados**: Crie interfaces TypeScript para os dados enviados e recebidos da API, garantindo consistência com os `schemas` do backend.
-   **Tratamento de Erro**: Implemente um tratamento de erro robusto para as chamadas de API, exibindo feedback claro para o usuário em caso de falha.

---

## 5. FLUXO DE DESENVOLVIMENTO

1.  **Criar Componentes**: Desenvolva os componentes de UI de forma isolada, se possível.
2.  **Desenvolver Telas**: Componha as telas (rotas) usando os componentes criados.
3.  **Integrar Lógica**: Adicione o gerenciamento de estado e a lógica de interação com a API.
4.  **Testar**: Teste a funcionalidade em emuladores e/ou dispositivos físicos para garantir consistência.

---

## 6. EXEMPLO DE CÓDIGO

### Componente de Botão
```typescript
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps } from 'react-native';

interface BotaoPrincipalProps extends TouchableOpacityProps {
  titulo: string;
}

export function BotaoPrincipal({ titulo, ...rest }: BotaoPrincipalProps) {
  return (
    <TouchableOpacity style={styles.container} {...rest}>
      <Text style={styles.texto}>{titulo}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  texto: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
```

### Chamada de API em uma Tela
```typescript
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList } from 'react-native';
import { api } from '../services/api'; // Módulo de API centralizado

interface Paciente {
  id: number;
  nome: string;
  email: string;
}

export default function TelaPacientes() {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarPacientes() {
      try {
        const response = await api.get('/pacientes');
        setPacientes(response.data);
      } catch (error) {
        console.error("Erro ao carregar pacientes:", error);
        // Exibir mensagem de erro para o usuário
      } finally {
        setLoading(false);
      }
    }

    carregarPacientes();
  }, []);

  if (loading) {
    return <Text>Carregando...</Text>;
  }

  return (
    <View>
      <FlatList
        data={pacientes}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <Text>{item.nome}</Text>}
      />
    </View>
  );
}
```
