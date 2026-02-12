# Scripts de Mock de Dados

## mock_data.py

Script para popular o banco de dados com dados de teste para geração de relatórios.

### O que o script cria:

- **1 Usuário de teste**
  - Email: `teste@gmail.com`
  - Senha: `Senha@123`
  - Nome: Maria Silva Santos

- **3 Medicações** (Pregabalina, Amitriptilina, Duloxetina)

- **60 Registros Diários** (últimos 60 dias)
  - Sintomas de dor (todos os dias)
  - Fadiga (80% dos dias)
  - Sono (90% dos dias)
  - Estado emocional (70% dos dias)
  - 2-5 regiões de dor por dia

- **15 Registros de Crises** distribuídos nos últimos 60 dias

### Como usar:

```bash
# Ativar ambiente virtual (se ainda não estiver ativo)
source .venv/bin/activate

# Executar o script
python scripts/mock_data.py
```

### Resultado esperado:

```
🚀 Iniciando população do banco de dados...

✓ Usuário criado: Maria Silva Santos (teste@gmail.com)
✓ 3 medicações criadas
✓ 60 registros diários criados
✓ 15 registros de crises criados

✅ Dados mockados com sucesso!

📋 Resumo:
   Email: teste@gmail.com
   Senha: Senha@123
   Registros: 60 dias de sintomas + 15 crises

💡 Use estes dados para gerar relatórios completos!
```

### Testando o relatório:

Após executar o script, você pode:

1. Fazer login com as credenciais acima
2. Chamar o endpoint `/relatorios/pdf` com um intervalo de datas
3. Gerar relatórios ricos com gráficos, tabelas e histórico de crises

**Exemplo de chamada:**

```bash
# 1. Obter token
curl -X POST "http://localhost:8000/auth/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=teste@gmail.com&password=Senha@123"

# 2. Gerar relatório PDF (últimos 30 dias)
curl -X GET "http://localhost:8000/relatorios/pdf?data_inicio=2026-01-12T00:00:00&data_fim=2026-02-11T23:59:59" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  --output relatorio.pdf
```

### Notas:

- Se o usuário `teste@gmail.com` já existir, o script não cria duplicatas
- Os dados são gerados com aleatoriedade para simular variações realísticas
- As intensidades de dor seguem uma distribuição gaussiana (maioria entre 4-7)
- Crises têm sempre intensidade alta (7-10)
