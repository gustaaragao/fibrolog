# DIRETRIZES DE USO: PYDANTIC

Este documento resume como a biblioteca Pydantic deve ser utilizada no projeto FibroLog, garantindo consistência e boas práticas.

## 1. Propósito do Pydantic no Projeto

O Pydantic é utilizado para duas finalidades principais:

1.  **Validação de Dados (Schemas)**: Para validar os dados que entram e saem da API. Isso garante que a API receba os dados no formato esperado e que as respostas sigam uma estrutura predefinida.
2.  **Configurações da Aplicação**: Para gerenciar as configurações do ambiente (variáveis de ambiente) de forma segura e tipada.

## 2. Validação de Dados com Schemas

-   **Localização**: Todos os schemas Pydantic devem ser definidos no arquivo `fibrolog_api/schemas.py`.
-   **Herança**: Todos os schemas devem herdar de `pydantic.BaseModel`.

### 2.1. Tipos de Schemas

Crie schemas específicos para diferentes operações, seguindo o padrão DTO (Data Transfer Object):

-   **Schema de Criação (`...Create`)**: Usado para os dados de entrada ao criar um novo recurso.
    ```python
    from pydantic import BaseModel, EmailStr

    class PacienteCreate(BaseModel):
        nome: str
        email: EmailStr
        password: str
    ```

-   **Schema de Atualização (`...Update`)**: Usado para os dados de entrada ao atualizar um recurso existente. Geralmente, os campos são opcionais.
    ```python
    from typing import Optional

    class PacienteUpdate(BaseModel):
        nome: Optional[str] = None
        email: Optional[EmailStr] = None
    ```

-   **Schema de Resposta Pública (`...Public`)**: Usado para os dados de saída retornados pela API. Este schema **nunca** deve incluir dados sensíveis como senhas.
    ```python
    class PacientePublic(BaseModel):
        id: int
        nome: str
        email: EmailStr

        class Config:
            from_attributes = True # Permite mapear diretamente de um modelo SQLAlchemy
    ```

-   **Schema Interno (`...DB` ou apenas o nome do modelo)**: Pode ser usado para representar dados lidos diretamente do banco de dados, incluindo campos privados.

### 2.2. Validação Avançada

-   **Tipos Especiais**: Use os tipos do Pydantic sempre que possível para validação automática (ex: `EmailStr`, `HttpUrl`).
-   **Validadores Customizados**: Para regras de negócio complexas (ex: força da senha), use o decorador `@validator` (Pydantic v1) ou `@field_validator` (Pydantic v2).

## 3. Gerenciamento de Configurações

-   **Localização**: As configurações da aplicação são gerenciadas no arquivo `fibrolog_api/settings.py`.
-   **Implementação**: Crie uma classe que herda de `pydantic_settings.BaseSettings`. O Pydantic carregará automaticamente as variáveis de ambiente correspondentes.

-   **Exemplo**:
    ```python
    from pydantic_settings import BaseSettings

    class Settings(BaseSettings):
        DATABASE_URL: str
        SECRET_KEY: str
        ALGORITHM: str = 'HS256'
        ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

        class Config:
            env_file = '.env' # Especifica o arquivo de onde ler as variáveis

    # Instancie as configurações para uso na aplicação
    settings = Settings()
    ```

Ao seguir estas diretrizes, garantimos que o uso do Pydantic no projeto seja padronizado, seguro e fácil de manter.
