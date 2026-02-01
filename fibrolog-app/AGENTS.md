# AGENTS.md - FibroLog App

Este documento fornece diretrizes para agentes de codificacao que operam neste repositorio.

## Visao Geral do Projeto

- **Produto**: FibroLog - Sistema Digital para Monitoramento da Fibromialgia
- **Framework**: React Native com Expo (SDK 54)
- **Linguagem**: TypeScript (strict mode)
- **Navegacao**: Expo Router (file-based routing)
- **Idioma do codigo**: Portugues (pt-BR) para comentarios, variaveis e documentacao

---

## Comandos de Build/Lint/Test

### Comandos Principais

```bash
# Iniciar servidor de desenvolvimento
npm start                    # ou: npx expo start

# Executar em plataformas especificas
npm run android              # Inicia no Android
npm run ios                  # Inicia no iOS
npm run web                  # Inicia no navegador

# Linting
npm run lint                 # Executa ESLint via Expo

# Resetar projeto (remove boilerplate)
npm run reset-project        # Move app/ para app-example/
```

### Instalacao de Dependencias

```bash
# SEMPRE use npx expo install para pacotes do Expo
npx expo install <pacote>

# Para verificar e corrigir versoes de pacotes
npx expo install --fix
```

### Testes (Ainda Nao Configurados)

O projeto ainda nao possui testes configurados. Quando implementar:

```bash
# Instalar dependencias de teste
npx expo install jest-expo jest @types/jest --dev
npx expo install @testing-library/react-native --dev

# Executar todos os testes
npm test

# Executar um unico teste
npm test -- --testPathPattern="NomeDoComponente"
npm test -- caminho/para/arquivo.test.tsx

# Executar testes em modo watch
npm test -- --watch
```

### EAS Build (Producao)

```bash
# Instalar EAS CLI globalmente
npm install -g eas-cli

# Configurar projeto para EAS
eas build:configure

# Criar build de desenvolvimento
eas build --platform android --profile development
eas build --platform ios --profile development

# Criar build de producao
eas build --platform android --profile production
eas build --platform ios --profile production
```

---

## Estilo de Codigo

### Nomenclatura de Arquivos

| Tipo                    | Convencao        | Exemplo                        |
|-------------------------|------------------|--------------------------------|
| Componentes React       | `kebab-case.tsx` | `themed-text.tsx`              |
| Hooks customizados      | `kebab-case.ts`  | `use-theme-color.ts`           |
| Arquivos de servico     | `kebab-case.ts`  | `api-service.ts`               |
| Constantes              | `kebab-case.ts`  | `theme.ts`                     |
| Telas (em app/)         | `kebab-case.tsx` | `index.tsx`, `explore.tsx`     |

### Nomenclatura de Codigo

| Elemento              | Convencao      | Exemplo                           |
|-----------------------|----------------|-----------------------------------|
| Componentes           | `PascalCase`   | `ThemedText`, `BotaoPrincipal`    |
| Funcoes/Variaveis     | `camelCase`    | `buscarPacientes`, `corAtual`     |
| Hooks customizados    | `useCamelCase` | `useThemeColor`, `useColorScheme` |
| Tipos/Interfaces      | `PascalCase`   | `ThemedTextProps`, `Paciente`     |
| Estilos (StyleSheet)  | `camelCase`    | `titleContainer`, `stepContainer` |
| Constantes globais    | `UPPER_SNAKE`  | `API_BASE_URL`, `MAX_RETRIES`     |

### Ordem de Imports

```typescript
// 1. Pacotes externos do React Native/Expo
import { View, StyleSheet, Text } from 'react-native';
import { Stack } from 'expo-router';
import { Image } from 'expo-image';

// 2. Componentes internos (usando alias @/)
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

// 3. Hooks customizados
import { useThemeColor } from '@/hooks/use-theme-color';

// 4. Servicos e utilitarios
import { api } from '@/services/api';

// 5. Constantes e tipos
import { Colors } from '@/constants/theme';
import type { Paciente } from '@/types/paciente';
```

### Path Alias

Use `@/` para imports internos (configurado no `tsconfig.json`):

```typescript
// BOM
import { ThemedText } from '@/components/themed-text';

// EVITAR
import { ThemedText } from '../../../components/themed-text';
```

---

## Padroes de Componentes

### Estrutura de Componente

```typescript
import { StyleSheet, View, type ViewProps } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';

// 1. Definir tipos/interfaces de props
export type MeuComponenteProps = ViewProps & {
  titulo: string;
  variante?: 'primario' | 'secundario';
};

// 2. Componente funcional com named export
export function MeuComponente({
  titulo,
  variante = 'primario',
  style,
  ...rest
}: MeuComponenteProps) {
  const corFundo = useThemeColor({}, 'background');

  return (
    <View style={[styles.container, { backgroundColor: corFundo }, style]} {...rest}>
      {/* conteudo */}
    </View>
  );
}

// 3. Estilos no final do arquivo
const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 8,
  },
});
```

### Regras de Componentes

- Use **componentes funcionais** exclusivamente (nunca classes)
- Use **named exports** para componentes (exceto telas que usam `export default`)
- Defina **interfaces/types** para todas as props
- Use **StyleSheet.create()** para estilos (evite inline styles)
- Mantenha componentes **pequenos e focados** em uma responsabilidade

---

## TypeScript

### Configuracao

- **Strict mode**: Habilitado (`"strict": true`)
- **Path alias**: `@/*` mapeia para raiz do projeto

### Regras

- **NUNCA** use `any` - defina tipos apropriados
- Defina **interfaces** para dados da API
- Use **type inference** quando o tipo e obvio
- Prefira `type` para props de componentes, `interface` para shapes de dados

```typescript
// Props de componente - use type
export type BotaoProps = {
  titulo: string;
  onPress: () => void;
};

// Dados da API - use interface
interface Paciente {
  id: number;
  nome: string;
  email: string;
}
```

---

## Tratamento de Erros

### Padrao para Chamadas de API

```typescript
const [dados, setDados] = useState<Paciente[]>([]);
const [carregando, setCarregando] = useState(true);
const [erro, setErro] = useState<string | null>(null);

useEffect(() => {
  async function carregarDados() {
    try {
      const response = await api.get('/pacientes');
      setDados(response.data);
    } catch (error) {
      console.error('Erro ao carregar pacientes:', error);
      setErro('Nao foi possivel carregar os dados. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  }

  carregarDados();
}, []);
```

### Boas Praticas

- Use `try/catch/finally` para operacoes assincronas
- Sempre log erros com `console.error`
- Forneca feedback visual ao usuario (loading states, mensagens de erro)
- Centralize chamadas de API em `services/api.ts`

---

## Estrutura de Diretorios

```
fibrolog-app/
├── app/                    # Rotas/telas (Expo Router)
│   ├── (tabs)/             # Grupo de navegacao com abas
│   │   ├── _layout.tsx     # Configuracao das abas
│   │   ├── index.tsx       # Tela inicial
│   │   └── explore.tsx     # Tela explorar
│   ├── _layout.tsx         # Layout raiz (providers)
│   └── modal.tsx           # Tela modal
├── assets/                 # Arquivos estaticos
│   ├── fonts/              # Fontes customizadas
│   └── images/             # Imagens e icones
├── components/             # Componentes reutilizaveis
│   └── ui/                 # Componentes primitivos de UI
├── constants/              # Constantes globais
│   └── theme.ts            # Cores e fontes
├── hooks/                  # Hooks customizados
├── services/               # Modulos de API/servicos externos
├── types/                  # Tipos TypeScript compartilhados
└── gemini/                 # Documentacao para agentes AI
```

---

## Configuracoes do Projeto

### Expo SDK 54

- React Native: 0.81.5
- React: 19.1.0
- New Architecture: Habilitada
- React Compiler: Habilitado (experimental)
- Typed Routes: Habilitado

### ESLint

Usa `eslint-config-expo` com flat config. Execute `npm run lint` para verificar.

### Temas

Suporte a dark/light mode automatico (`userInterfaceStyle: "automatic"`).

---

## Diretrizes do GEMINI.md

Este projeto segue as diretrizes definidas em `gemini/GEMINI.md`:

1. **Idioma**: Todo codigo, comentarios e documentacao em Portugues (pt-BR)
2. **Arquitetura**: Component-Based com separacao clara de UI e logica
3. **Estado**: `useState` para local, Context API para global
4. **API**: Centralizar em `services/api.ts` com interfaces TypeScript
5. **Estilizacao**: `StyleSheet.create()` sempre, evitar inline styles

---

## Comandos Uteis para Desenvolvimento

```bash
# Diagnosticar problemas no projeto
npx expo-doctor

# Limpar cache e reiniciar
npx expo start --clear

# Abrir no tunnel (quando LAN nao funciona)
npx expo start --tunnel

# Gerar diretorios nativos
npx expo prebuild

# Compilar localmente
npx expo run:android
npx expo run:ios
```
