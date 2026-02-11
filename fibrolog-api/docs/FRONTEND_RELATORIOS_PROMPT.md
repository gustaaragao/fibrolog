# Prompt para Implementação de Relatórios PDF no Frontend (Expo React Native)

## Contexto

Preciso implementar uma tela de relatórios no meu app Expo React Native que consome a API do FibroLog. A API já está pronta e retorna PDFs com dados de monitoramento de fibromialgia.

## URL da API

**Endpoint:** `GET /relatorios/pdf`

**Base URL:** `http://localhost:8000` (desenvolvimento)

## Autenticação

A API usa JWT Bearer tokens. Todas as requisições devem incluir o header:
```
Authorization: Bearer {token}
```

## Parâmetros da Requisição

| Parâmetro | Tipo | Obrigatório | Descrição | Exemplo |
|-----------|------|-------------|-----------|---------|
| `data_inicio` | DateTime (ISO 8601) | ✅ Sim | Data/hora de início do período | `2026-01-12T00:00:00` |
| `data_fim` | DateTime (ISO 8601) | ✅ Sim | Data/hora de fim do período | `2026-02-11T23:59:59` |

## Resposta da API

**Content-Type:** `application/pdf`

**Headers:**
```
Content-Disposition: attachment; filename="relatorio_maria-silva-santos_20260211.pdf"
```

O corpo da resposta é o arquivo PDF binário.

## Exemplo de Requisição com Fetch

```javascript
const response = await fetch(
  `${API_URL}/relatorios/pdf?data_inicio=${startDate.toISOString()}&data_fim=${endDate.toISOString()}`,
  {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    }
  }
);

if (response.ok) {
  const blob = await response.blob();
  // Processar PDF...
}
```

## Funcionalidades Requeridas

### 1. **Seleção de Período**
- Dois date pickers (data início e data fim)
- Validação: data_fim >= data_inicio
- Sugestões de períodos rápidos:
  - Últimos 7 dias
  - Últimos 15 dias
  - Últimos 30 dias
  - Últimos 60 dias

### 2. **Pré-visualização do PDF**
- Exibir o PDF gerado dentro do app
- Navegação entre páginas (o relatório tem múltiplas páginas)
- Zoom in/out
- Loading state durante geração do PDF

**Bibliotecas recomendadas:**
- `react-native-pdf` ou
- `expo-document-picker` + visualizador nativo

### 3. **Botão de Compartilhar via WhatsApp**
- Salvar PDF temporariamente no dispositivo
- Abrir WhatsApp com o arquivo anexado
- Permitir que usuário escolha para quem enviar

**Bibliotecas recomendadas:**
- `expo-sharing` para compartilhamento nativo
- `react-native-share` (se não estiver usando Expo Go)

### 4. **Botão de Download/Salvar**
- Salvar PDF na pasta de Downloads do dispositivo
- Feedback visual de sucesso/erro
- Permissões de armazenamento (Android)

**Bibliotecas recomendadas:**
- `expo-file-system` para manipulação de arquivos
- `expo-sharing` para salvar no dispositivo

### 5. **Estados da UI**

#### Loading
- Exibir spinner/skeleton enquanto PDF é gerado
- Mensagem: "Gerando relatório..."

#### Erro
- Tratar erros de rede
- Tratar período sem dados (PDF vazio)
- Mensagens amigáveis em português

#### Sucesso
- Exibir pré-visualização
- Mostrar nome do arquivo
- Mostrar período do relatório

## Layout Sugerido

```
┌─────────────────────────────────────┐
│  ← Voltar      Relatórios           │
├─────────────────────────────────────┤
│                                     │
│  📅 Período do Relatório            │
│                                     │
│  De: [12/01/2026] 📅               │
│  Até: [11/02/2026] 📅               │
│                                     │
│  Períodos rápidos:                 │
│  [7d] [15d] [30d] [60d]            │
│                                     │
│  [Gerar Relatório] 📊              │
│                                     │
├─────────────────────────────────────┤
│                                     │
│  📄 Pré-visualização                │
│                                     │
│  ┌───────────────────────────────┐ │
│  │                               │ │
│  │      [Conteúdo do PDF]       │ │
│  │                               │ │
│  └───────────────────────────────┘ │
│                                     │
│  Página 1 de 2                     │
│                                     │
│  [📤 Compartilhar] [💾 Baixar]     │
│                                     │
└─────────────────────────────────────┘
```

## Dados de Teste

Para testar, use estas credenciais (banco já populado):
- **Email:** `teste@gmail.com`
- **Senha:** `Senha@123`
- **Período com dados:** Últimos 60 dias (12/12/2025 até 11/02/2026)

Este usuário tem:
- 60 registros diários de sintomas
- 15 registros de crises
- Dados variados de dor, fadiga, sono e emoções

## Considerações Importantes

### Permissões (Android)
```xml
<!-- android/app/src/main/AndroidManifest.xml -->
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
```

### Tamanho do Arquivo
- PDFs típicos: 200KB - 1MB
- Otimizar para conexões lentas
- Implementar timeout (30-60 segundos)

### UX/UI
- Tema rosa/magenta (PRIMARY_COLOR: #D21F8F)
- Feedback tátil nos botões
- Confirmação visual de download concluído
- Permitir regenerar relatório com novo período

### Tratamento de Erros Específicos

| Código HTTP | Cenário | Ação |
|-------------|---------|------|
| 401 | Token expirado | Redirecionar para login |
| 404 | Endpoint não encontrado | Verificar configuração da API |
| 500 | Erro no servidor | "Erro ao gerar relatório. Tente novamente." |
| Network Error | Sem internet | "Verifique sua conexão com a internet" |

## Exemplo de Implementação Básica

```jsx
import React, { useState } from 'react';
import { View, Button, Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import Pdf from 'react-native-pdf';

export function ReportScreen() {
  const [pdfPath, setPdfPath] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateReport = async (startDate, endDate) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_URL}/relatorios/pdf?data_inicio=${startDate.toISOString()}&data_fim=${endDate.toISOString()}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        }
      );

      if (!response.ok) throw new Error('Erro ao gerar relatório');

      const blob = await response.blob();
      const filename = `relatorio_${Date.now()}.pdf`;
      const localUri = `${FileSystem.documentDirectory}${filename}`;
      
      // Salvar arquivo localmente
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = async () => {
        const base64data = reader.result.split(',')[1];
        await FileSystem.writeAsStringAsync(localUri, base64data, {
          encoding: FileSystem.EncodingType.Base64,
        });
        setPdfPath(localUri);
      };
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível gerar o relatório');
    } finally {
      setLoading(false);
    }
  };

  const shareViaWhatsApp = async () => {
    if (!pdfPath) return;
    
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(pdfPath, {
        mimeType: 'application/pdf',
        dialogTitle: 'Compartilhar relatório',
      });
    }
  };

  const downloadPdf = async () => {
    if (!pdfPath) return;
    
    // Implementation here...
    Alert.alert('Sucesso', 'Relatório salvo nos Downloads');
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Date pickers */}
      {/* Generate button */}
      
      {pdfPath && (
        <>
          <Pdf
            source={{ uri: pdfPath }}
            style={{ flex: 1 }}
          />
          <View style={{ flexDirection: 'row' }}>
            <Button title="Compartilhar" onPress={shareViaWhatsApp} />
            <Button title="Baixar" onPress={downloadPdf} />
          </View>
        </>
      )}
    </View>
  );
}
```

## Pacotes Necessários

```bash
npx expo install expo-file-system expo-sharing
npm install react-native-pdf
# ou
npm install @react-pdf/renderer
```

## Resultado Esperado

Ao final, o usuário deve conseguir:
1. ✅ Selecionar um período (com sugestões rápidas)
2. ✅ Gerar o relatório (com loading)
3. ✅ Ver pré-visualização do PDF no app
4. ✅ Compartilhar o PDF via WhatsApp (ou outros apps)
5. ✅ Baixar o PDF para o dispositivo
6. ✅ Regenerar com novo período quando desejar

---

**Por favor, implemente esta funcionalidade seguindo as diretrizes acima. Use a biblioteca que achar mais adequada para seu projeto (com ou sem Expo Go). Priorize a experiência do usuário com feedbacks visuais claros e tratamento robusto de erros.**
