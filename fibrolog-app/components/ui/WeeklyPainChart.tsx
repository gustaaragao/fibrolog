import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { BarChart } from "react-native-chart-kit";
import { WeeklyPainData } from "@/services/statistics-service";

interface WeeklyPainChartProps {
  data: WeeklyPainData[];
}

export function WeeklyPainChart({ data }: WeeklyPainChartProps) {
  const screenWidth = Dimensions.get("window").width - 40; // Padding horizontal

  const chartData = {
    labels: data.map((d) => d.dia),
    datasets: [
      {
        data: data.map((d) => d.intensidade_dor || 0),
      },
    ],
  };

  const chartConfig = {
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    color: (opacity = 1) => `rgba(211, 48, 170, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(100, 28, 77, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.6,
    useShadowColorFromDataset: false,
    decimalPlaces: 1,
    propsForLabels: {
      fontSize: 10,
      fontWeight: "600"
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Intensidade da Dor (Últimos 7 dias)</Text>
      <BarChart
        data={chartData}
        width={screenWidth}
        height={220}
        yAxisLabel=""
        yAxisSuffix=""
        chartConfig={chartConfig}
        verticalLabelRotation={0}
        fromZero
        segments={5}
        style={styles.chart}
        showValuesOnTopOfBars
      />
      {data.some(d => d.intensidade_dor === null) && (
          <Text style={styles.hint}>* Dias sem registro mostrados como 0</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    marginVertical: 10,
    width: "100%",
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#641c4d",
    marginBottom: 16,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
    marginLeft: -10, // Ajuste para alinhar labels
  },
  hint: {
    fontSize: 10,
    color: "#999",
    fontStyle: "italic",
    marginTop: 8,
    textAlign: "right"
  }
});
