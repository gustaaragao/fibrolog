import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { recomendarAutocuidado, Sintoma } from '../src/services/recomendadorAutocuidado';
import { useEffect, useState } from 'react';



export default function Autocuidado() {

  const [sintomasDoUsuario, setSintomasDoUsuario] = useState<Sintoma[]>([]);

  useEffect(() => {
    // MOCK simulando backend enquanto n esta recebendo dados da api
    const sintomasMock: Sintoma[] = ['ansiedade', 'insonia', 'dor_muscular'];

    setSintomasDoUsuario(sintomasMock);
  }, []);
  const sugestoesFiltradas = recomendarAutocuidado(sintomasDoUsuario);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Sugestões de Autocuidado</Text>

{sugestoesFiltradas.length === 0 ? (
  <Text style={styles.emptyText}>
    Nenhuma sugestão disponível ainda.
    {"\n"}
    Registre seus sintomas para receber recomendações personalizadas.
  </Text>
) : (
  sugestoesFiltradas.map((item) => (
    <View key={item.id} style={styles.card}>
      <Text style={styles.cardTitle}>{item.titulo}</Text>
      <Text style={styles.cardText}>{item.descricao}</Text>
      <Text style={styles.cardReason}>{item.motivo}</Text>
    </View>
  ))
)}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#f3e8ff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  cardText: {
    fontSize: 14,
    marginBottom: 6,
  },
  cardReason: {
    fontSize: 12,
    fontStyle: 'italic',
    color: '#6b7280',
  },
  emptyText: {
    marginTop: 40,
    textAlign: 'center',
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  }
});
