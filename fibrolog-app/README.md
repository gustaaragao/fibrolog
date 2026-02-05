# FibroLog App 👋

Aplicativo mobile do FibroLog para monitoramento de Fibromialgia.

## Configuração Inicial

1. **Instalar dependências**

   ```bash
   npm install
   ```

2. **Configurar variáveis de ambiente**

   Copie o arquivo `.env.example` para `.env`:
   
   ```bash
   cp .env.example .env
   ```
   
   Edite o `.env` e configure a URL da API:
   
   ```
   EXPO_PUBLIC_API_URL=http://localhost:8000
   ```

3. **Iniciar o app**

   ```bash
   npx expo start
   ```

## Variáveis de Ambiente

- `EXPO_PUBLIC_API_URL`: URL base da API backend (padrão: `http://localhost:8000`)

## Desenvolvimento

Este projeto usa [Expo Router](https://docs.expo.dev/router/introduction) para navegação baseada em arquivos.

### Estrutura de Pastas

- `app/` - Telas e navegação
  - `(auth)/` - Telas de autenticação (login, signup)
  - `(tabs)/` - Telas principais com navegação por tabs
- `components/` - Componentes reutilizáveis
- `contexts/` - Contextos React (autenticação, etc)
- `services/` - Serviços de API
- `constants/` - Constantes e configurações
- `utils/` - Utilitários

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
