import { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View, ActivityIndicator, Alert } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BotaoPrimario } from '@/components/ui/primary-button';
import { useAuth } from '@/contexts/auth-context';
import { api } from '@/services/api';

export default function HomeScreen() {
  const { usuario } = useAuth();
  const [carregando, setCarregando] = useState(false);
  const [dadosPaciente, setDadosPaciente] = useState<any>(null);

  useEffect(() => {
    carregarDadosPaciente();
  }, []);

  async function carregarDadosPaciente() {
    setCarregando(true);
    try {
      const response: any = await api.get('/api/pacientes/me');
      setDadosPaciente(response.data);
    } catch (error: any) {
      const mensagem = error.response?.data?.detail || error.message || 'Erro ao carregar dados';
      console.error('Erro ao carregar dados do paciente:', error);
      Alert.alert('Erro', mensagem);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ThemedText type="title" style={styles.titulo}>
          FibroLog
        </ThemedText>
        
        <View style={styles.secao}>
          <ThemedText type="subtitle">Bem-vindo(a)!</ThemedText>
          <ThemedText style={styles.texto}>
            {usuario?.nome || 'Usuário'}
          </ThemedText>
          <ThemedText style={styles.textoSecundario}>
            {usuario?.email || 'email@exemplo.com'}
          </ThemedText>
        </View>

        {carregando && (
          <View style={styles.secao}>
            <ActivityIndicator size="large" />
            <ThemedText style={styles.textoSecundario}>Carregando dados...</ThemedText>
          </View>
        )}

        {!carregando && dadosPaciente && (
          <View style={styles.secao}>
            <ThemedText type="subtitle">Seus Dados</ThemedText>
            <View style={styles.dadosContainer}>
              <ThemedText style={styles.dadosLabel}>ID:</ThemedText>
              <ThemedText style={styles.dadosValor}>{dadosPaciente.id}</ThemedText>
              
              <ThemedText style={styles.dadosLabel}>Nome:</ThemedText>
              <ThemedText style={styles.dadosValor}>{dadosPaciente.nome}</ThemedText>
              
              <ThemedText style={styles.dadosLabel}>Email:</ThemedText>
              <ThemedText style={styles.dadosValor}>{dadosPaciente.email}</ThemedText>
              
              <ThemedText style={styles.dadosLabel}>Data de Nascimento:</ThemedText>
              <ThemedText style={styles.dadosValor}>
                {dadosPaciente.data_nascimento || 'Não informado'}
              </ThemedText>
            </View>
          </View>
        )}

        <View style={styles.secao}>
          <BotaoPrimario
            titulo="Recarregar Dados"
            onPress={carregarDadosPaciente}
            disabled={carregando}
          />
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    gap: 24,
  },
  titulo: {
    textAlign: 'center',
    marginBottom: 8,
  },
  secao: {
    gap: 12,
  },
  texto: {
    fontSize: 16,
  },
  textoSecundario: {
    fontSize: 14,
    opacity: 0.7,
  },
  dadosContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    padding: 16,
    borderRadius: 8,
    gap: 8,
  },
  dadosLabel: {
    fontSize: 12,
    fontWeight: '600',
    opacity: 0.7,
    marginTop: 8,
  },
  dadosValor: {
    fontSize: 16,
  },
  dadosTexto: {
    fontSize: 12,
    fontFamily: 'monospace',
  },
});
