import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { MetricTrend } from "@/services/statistics-service";

interface MetricCardProps {
  label: string;
  data: MetricTrend;
  prefix?: string;
  suffix?: string;
  formatValue?: (val: number) => string;
}

export function MetricCard({
  label,
  data,
  prefix = "",
  suffix = "",
  formatValue = (val) => val.toString(),
}: MetricCardProps) {
  const { valor, variacao_percentual, tendencia } = data;

  const getTrendColor = () => {
    if (tendencia === "neutro") return "#666";
    
    // Para dor, baixar é bom (verde)
    if (label.toLowerCase().includes("dor")) {
        return tendencia === "baixa" ? "#10B981" : "#EF4444";
    }
    
    // Para dias registrados, subir é bom (verde)
    if (label.toLowerCase().includes("dias")) {
        return tendencia === "alta" ? "#10B981" : "#EF4444";
    }

    // Default: alta = verde, baixa = vermelho
    return tendencia === "alta" ? "#10B981" : "#EF4444";
  };

  const getTrendIcon = () => {
    switch (tendencia) {
      case "alta":
        return "trending-up";
      case "baixa":
        return "trending-down";
      case "neutro":
      default:
        return "trending-flat";
    }
  };

  const trendColor = getTrendColor();

  return (
    <View style={styles.card}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.valueContainer}>
        <Text style={styles.value}>
          {prefix}{formatValue(valor)}{suffix}
        </Text>
        
        {variacao_percentual !== null && (
          <View style={[styles.trendBadge, { backgroundColor: trendColor + "20" }]}>
            <MaterialIcons name={getTrendIcon()} size={16} color={trendColor} />
            <Text style={[styles.trendText, { color: trendColor }]}>
              {variacao_percentual > 0 ? "+" : ""}{variacao_percentual}%
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    flex: 1,
    minWidth: "45%",
  },
  label: {
    fontSize: 12,
    color: "#7d1e60",
    marginBottom: 8,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  valueContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 8,
  },
  value: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#D330AA",
  },
  trendBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 12,
    gap: 2,
  },
  trendText: {
    fontSize: 12,
    fontWeight: "bold",
  },
});
