import { View, Text, ScrollView, Button } from 'react-native';

export default function Relatorio() {
  return (
    <ScrollView style={{ padding: 16 }}>

      {/* Cabeçalho */}
      <Text style={{ fontSize: 22, fontWeight: 'bold' }}>
        Relatório
      </Text>

      {/* Resumo geral */}
      <View style={{ marginTop: 16 }}>
        <Text>Resumo Geral</Text>
        <Text>[ Gráfico / Visão Geral ]</Text>
      </View>

      {/* Dados consolidados */}
      <View style={{ marginTop: 16 }}>
        <Text>Crises: 8</Text>
        <Text>Principal sintoma: Dor muscular</Text>
        <Text>Qualidade do sono: Regular</Text>
      </View>

      {/* Ação */}
      <View style={{ marginTop: 24 }}>
        <Button
          title="Gerar PDF"
          onPress={() => {
            console.log('Gerar PDF');
          }}
        />
      </View>

    </ScrollView>
  );
}
