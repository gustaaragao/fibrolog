import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { PatientInsight } from "@/services/statistics-service";

interface InsightCardProps {
  insight: PatientInsight;
}

export function InsightCard({ insight }: InsightCardProps) {
  const { tipo, mensagem, icone } = insight;

  const getColors = () => {
    switch (tipo) {
      case "success":
        return { bg: "#ECFDF5", border: "#10B981", text: "#065F46" };
      case "warning":
        return { bg: "#FFFBEB", border: "#F59E0B", text: "#92400E" };
      case "danger":
        return { bg: "#FEF2F2", border: "#EF4444", text: "#991B1B" };
      case "info":
      default:
        return { bg: "#EFF6FF", border: "#3B82F6", text: "#1E40AF" };
    }
  };

  const colors = getColors();

  return (
    <View style={[styles.card, { backgroundColor: colors.bg, borderColor: colors.border }]}>
      <Text style={styles.icon}>{icone}</Text>
      <Text style={[styles.message, { color: colors.text }]}>{mensagem}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    marginVertical: 6,
    alignItems: "center",
    gap: 12,
  },
  icon: {
    fontSize: 24,
  },
  message: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 20,
  },
});
