import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { SelfCareTip } from "@/constants/self-care";

interface SelfCareCardProps {
  tip: SelfCareTip;
}

export function SelfCareCard({ tip }: SelfCareCardProps) {
  const { titulo, descricao, icone } = tip;

  return (
    <View style={styles.card}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>{icone}</Text>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{titulo}</Text>
        <Text style={styles.description}>{descricao}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "white",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: "#D330AA",
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FDF2F9",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  icon: {
    fontSize: 24,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#641c4d",
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: "#7d1e60",
    lineHeight: 20,
  },
});
