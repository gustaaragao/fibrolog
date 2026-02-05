## Why

O projeto Expo atual contém arquivos desnecessários da configuração padrão e não possui sistema de autenticação. É necessário criar uma interface de login funcional que se integre com a API FastAPI existente (localhost:8000/auth) para permitir acesso autenticado ao sistema.

## What Changes

- Limpar arquivos desnecessários gerados pelo Expo (manter apenas estrutura essencial)
- Criar tela de login com campos de email e senha
- Implementar autenticação JWT com integração à API FastAPI
- Estabelecer navegação entre tela de login e home screen
- Configurar validação de formulário seguindo schemas do backend (PacienteSchema)
- Implementar gerenciamento de estado para token de autenticação

## Capabilities

### New Capabilities
- `user-authentication`: Sistema de autenticação com login/logout, validação de credenciais e gerenciamento de token JWT
- `app-navigation`: Navegação condicional entre telas baseada no estado de autenticação
- `form-validation`: Validação de formulários seguindo regras do backend (email válido, senha forte)
- `api-integration`: Integração com API FastAPI para autenticação e comunicação

### Modified Capabilities
<!-- Nenhuma capability existente sendo modificada -->

## Impact

- **Estrutura do projeto**: Remoção de arquivos padrão do Expo, reorganização da estrutura de pastas
- **Dependências**: Adição de bibliotecas para navegação (React Navigation), gerenciamento de estado, e requisições HTTP
- **API Integration**: Comunicação com endpoint localhost:8000/auth seguindo contratos Token e TokenData
- **User Experience**: Fluxo de autenticação obrigatório antes de acessar funcionalidades do app
- **Security**: Implementação de armazenamento seguro de tokens e validação de sessão