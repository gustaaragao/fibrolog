import { View, Text, StyleSheet, ScrollView } from 'react-native';

type Sugestao = {
  id: number;
  titulo: string;
  descricao: string;
  motivo: string;
};

const sugestoesMock: Sugestao[] = [
  {
    id: 1,
    titulo: 'Alongamento Leve',
    descricao:
      'Realize alongamentos suaves por 5 a 10 minutos para aliviar a rigidez muscular.',
    motivo: 'Sugerido devido a relatos frequentes de dor muscular.',
  },
  {
    id: 2,
    titulo: 'Respiração Guiada',
    descricao:
      'Pratique respiração profunda para ajudar no controle do estresse e ansiedade.',
    motivo: 'Sugerido com base em níveis elevados de estresse registrados.',
  },
  {
    id: 3,
    titulo: 'Hidratação Regular',
    descricao:
      'Manter-se hidratado pode ajudar a reduzir fadiga e melhorar o bem-estar.',
    motivo: 'Sugerido devido a episódios frequentes de fadiga.',
  },
];

export default function Autocuidado() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Sugestões de Autocuidado</Text>

      {sugestoesMock.map((item) => (
        <View key={item.id} style={styles.card}>
          <Text style={styles.cardTitle}>{item.titulo}</Text>
          <Text style={styles.cardText}>{item.descricao}</Text>
          <Text style={styles.cardReason}>{item.motivo}</Text>
        </View>
      ))}
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
});
