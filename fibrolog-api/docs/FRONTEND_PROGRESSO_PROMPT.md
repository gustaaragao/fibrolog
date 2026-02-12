# Frontend Progress Screen Implementation Prompt

Use este prompt com uma IA de desenvolvimento no seu projeto frontend para implementar a tela de Progresso.

---

**Prompt:**

"Implemente uma tela de Progresso no frontend usando React e Material UI (ou a biblioteca UI escolhida no projeto). A tela deve:

1. **Buscar Dados**: Chamar o endpoint `GET /estatisticas/progresso` para obter as estatísticas de progresso do paciente autenticado.

2. **Seção Superior - Última Semana**:
   - Exibir três cards com as métricas principais:
     * **Média de dor**: Mostrar o valor atual com uma casa decimal
     * **Dias registrados**: Mostrar quantidade de dias com registros no mês
     * **Crises este mês**: Mostrar quantidade de crises registradas
   - Cada card deve mostrar:
     * Valor principal em destaque
     * Variação percentual (se disponível) com ícone de seta para cima/baixo
     * Cor da variação: verde para melhorias, vermelho para pioras, cinza para neutro
   - Use o campo `tendencia` para determinar a direção: 'alta' 🔺, 'baixa' 🔻, 'neutro' ➡️

3. **Gráfico de Barras - Nível de dor por dia**:
   - Criar um gráfico de barras mostrando os últimos 7 dias
   - Eixo X: Dias da semana (Seg, Ter, Qua, Qui, Sex, Sáb, Dom)
   - Eixo Y: Intensidade da dor (0-10)
   - Usar dados do array `grafico_dor_semanal`:
     * Campo `dia`: Label do eixo X
     * Campo `intensidade_dor`: Altura da barra (pode ser `null` se não houver registro)
   - Dias sem registro podem ser mostrados com barra tracejada ou transparente
   - Usar cores do roxo ao rosa conforme o design da aplicação

4. **Seção de Insights**:
   - Exibir os insights retornados pela API em cards informativos
   - Cada insight tem:
     * `tipo`: Determina a cor do card ('success' = verde, 'warning' = amarelo, 'info' = azul, 'danger' = vermelho)
     * `mensagem`: Texto a ser exibido
     * `icone`: Emoji ou ícone a ser mostrado ao lado da mensagem
   - Usar ícones visuais e cores para destacar insights positivos e alertas

5. **Ponto de Atualização**:
   - Adicionar botão "Atualizar" para recarregar os dados
   - Mostrar indicador de loading durante o carregamento
   - Tratar caso de erro na API com mensagem amigável

6. **Responsividade**:
   - Layout deve ser responsivo para mobile e desktop
   - Cards devem empilhar verticalmente em telas pequenas
   - Gráfico deve ser adaptável ao tamanho da tela

7. **Estilo**:
   - Seguir o design system da aplicação (gradiente roxo/rosa do FibroLog)
   - Usar tipografia e espaçamentos consistentes
   - Garantir acessibilidade (contraste, labels ARIA, etc.)

---

**API Reference:**

### Endpoint: `GET /estatisticas/progresso`

**Headers:**
```
Authorization: Bearer {token}
```

**Response Schema:**
```json
{
  "media_dor_semana": {
    "valor": 4.3,
    "variacao_percentual": -12.0,
    "tendencia": "baixa"
  },
  "dias_registrados_mes": {
    "valor": 29,
    "variacao_percentual": 15.0,
    "tendencia": "alta"
  },
  "crises_mes": {
    "valor": 3,
    "variacao_percentual": -33.0,
    "tendencia": "baixa"
  },
  "grafico_dor_semanal": [
    {
      "dia": "Seg",
      "data": "2026-02-05",
      "intensidade_dor": 6.0
    },
    {
      "dia": "Ter",
      "data": "2026-02-06",
      "intensidade_dor": 4.5
    },
    {
      "dia": "Qua",
      "data": "2026-02-07",
      "intensidade_dor": 7.0
    },
    {
      "dia": "Qui",
      "data": "2026-02-08",
      "intensidade_dor": 5.5
    },
    {
      "dia": "Sex",
      "data": "2026-02-09",
      "intensidade_dor": 3.0
    },
    {
      "dia": "Sáb",
      "data": "2026-02-10",
      "intensidade_dor": 6.5
    },
    {
      "dia": "Dom",
      "data": "2026-02-11",
      "intensidade_dor": null
    }
  ],
  "insights": [
    {
      "tipo": "success",
      "mensagem": "Seus níveis de dor diminuíram 12% em relação à semana passada",
      "icone": "📉"
    },
    {
      "tipo": "success",
      "mensagem": "Você registrou 29 dias este mês! Continue assim!",
      "icone": "📝"
    },
    {
      "tipo": "success",
      "mensagem": "Suas crises diminuíram 33% em relação ao mês passado",
      "icone": "✨"
    }
  ]
}
```

**Campos de Métricas:**
- `valor`: Número (float para média de dor, int para contagens)
- `variacao_percentual`: Número ou `null` (percentual de variação em relação ao período anterior)
- `tendencia`: String - 'alta', 'baixa' ou 'neutro'

**Campos do Gráfico:**
- `dia`: String - Abreviação do dia da semana
- `data`: String - Data no formato ISO (YYYY-MM-DD)
- `intensidade_dor`: Number ou `null` - Intensidade média da dor no dia (0-10)

**Campos de Insights:**
- `tipo`: String - 'success', 'warning', 'info' ou 'danger'
- `mensagem`: String - Texto do insight
- `icone`: String - Emoji ou nome do ícone

---

**Bibliotecas Recomendadas:**

Para o gráfico de barras, considere usar:
- **Recharts**: Biblioteca simples e responsiva para React
- **Chart.js com react-chartjs-2**: Solução popular e flexível
- **Victory**: Biblioteca focada em acessibilidade
- **Material-UI Charts**: Se já estiver usando Material-UI

**Exemplo de integração com Recharts:**

```jsx
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

<ResponsiveContainer width="100%" height={300}>
  <BarChart data={progressData.grafico_dor_semanal}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="dia" />
    <YAxis domain={[0, 10]} />
    <Tooltip />
    <Bar dataKey="intensidade_dor" fill="#8B5CF6" />
  </BarChart>
</ResponsiveContainer>
```

---

**Tratamento de Erros:**

- **401 Unauthorized**: Redirecionar para login
- **404/500**: Exibir mensagem de erro amigável
- **Timeout**: Implementar retry ou mensagem de "Tente novamente"

**Estados da Tela:**

1. **Loading**: Mostrar skeleton/spinner enquanto carrega dados
2. **Success**: Exibir dados conforme especificado
3. **Empty**: Caso não haja dados suficientes, mostrar mensagem incentivando registros
4. **Error**: Exibir mensagem de erro com opção de recarregar

---

**Detalhes de Implementação:**

### Interpretação das Tendências:

```javascript
const getTrendIcon = (tendencia) => {
  switch (tendencia) {
    case 'alta': return '🔺';
    case 'baixa': return '🔻';
    case 'neutro': return '➡️';
    default: return '➡️';
  }
};

const getTrendColor = (metrica, tendencia) => {
  // Para dor e crises, baixa é positivo (verde)
  // Para dias registrados, alta é positivo (verde)
  if (metrica === 'dor' || metrica === 'crises') {
    return tendencia === 'baixa' ? 'success' : tendencia === 'alta' ? 'error' : 'default';
  } else if (metrica === 'registros') {
    return tendencia === 'alta' ? 'success' : tendencia === 'baixa' ? 'error' : 'default';
  }
  return 'default';
};
```

### Formatação de Valores:

```javascript
const formatPercentual = (valor) => {
  if (valor === null || valor === undefined) return '';
  const sinal = valor > 0 ? '+' : '';
  return `${sinal}${valor.toFixed(0)}%`;
};

const formatDor = (valor) => {
  return valor.toFixed(1);
};
```

---

**Acessibilidade:**

- Usar `role="region"` e `aria-label` para seções principais
- Adicionar `aria-live="polite"` para insights dinâmicos
- Garantir contraste de cores (mínimo 4.5:1)
- Texto alternativo para gráficos
- Navegação por teclado funcional

"
