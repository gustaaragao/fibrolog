## Why

Pacientes com fibromialgia precisam registrar diariamente seus sintomas e regiões de dor para monitorar a evolução da condição e fornecer dados precisos para profissionais de saúde. Atualmente, a API não possui endpoints dedicados para o registro completo desses dados diários, incluindo intensidades e mapeamento corporal.

## What Changes

- Criação do endpoint `POST /registros-diarios` para submissão de sintomas e regiões de dor.
- Implementação de novas tabelas de banco de dados para armazenar os registros diários, sintomas associados e regiões corporais afetadas.
- Adição de lógica de validação para intensidades (0-10) e IDs de sintomas/regiões.
- Integração com o sistema de autenticação JWT existente para identificar o paciente.

## Capabilities

### New Capabilities
- `registro-diario-sintomas`: Permite que pacientes registrem diariamente sintomas, intensidades e regiões de dor mapeadas no corpo.

### Modified Capabilities
- (Nenhuma)

## Impact

- **API**: Novo router `registros_diarios.py` e novos schemas Pydantic.
- **Banco de Dados**: Novas tabelas `registros_diarios`, `registro_sintomas` e `registro_regioes_dor`.
- **Segurança**: Dependência do sistema de autenticação existente para extração do `paciente_id`.
