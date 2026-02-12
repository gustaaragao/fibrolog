import React from "react";
import { StyleSheet, Text, TouchableOpacity, View, Switch } from "react-native";
import { MaterialIcons, FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import { Reminder } from "@/services/reminder-service";

interface ReminderItemProps {
  reminder: Reminder;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function ReminderItem({ reminder, onToggle, onDelete }: ReminderItemProps) {
  const formatTime = (h: number, m: number) => {
    const safeH = h ?? 0;
    const safeM = m ?? 0;
    return `${safeH.toString().padStart(2, "0")}:${safeM.toString().padStart(2, "0")}`;
  };

  const formatDate = (isoString: string) => {
    if (!isoString) return "Data não definida";
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString("pt-BR");
    } catch {
      return "Data inválida";
    }
  };

  const getTypeIcon = () => {
    switch (reminder.tipo) {
      case "medicamento":
        return <FontAwesome5 name="pills" size={20} color={reminder.ativo ? "#D330AA" : "#999"} />;
      case "exame":
        return <MaterialCommunityIcons name="clipboard-pulse" size={24} color={reminder.ativo ? "#D330AA" : "#999"} />;
      default:
        return <MaterialIcons name="notifications-none" size={24} color={reminder.ativo ? "#D330AA" : "#999"} />;
    }
  };

  return (
    <View style={[styles.container, !reminder.ativo && styles.inactiveContainer]}>
      <View style={styles.iconWrapper}>
        {getTypeIcon()}
      </View>
      
      <View style={styles.info}>
        <View style={styles.timeRow}>
          <Text style={[styles.time, !reminder.ativo && styles.inactiveText]}>
            {formatTime(reminder.hora, reminder.minuto)}
          </Text>
          <MaterialCommunityIcons 
            name={reminder.synced ? "cloud-check-outline" : "cloud-sync-outline"} 
            size={16} 
            color={reminder.synced ? "#10B981" : "#F59E0B"} 
          />
          {reminder.tipo === "exame" && reminder.dataExame && (
            <Text style={styles.dateBadge}>{formatDate(reminder.dataExame)}</Text>
          )}
          {reminder.tipo === "medicamento" && reminder.intervalo && (
            <Text style={styles.intervalBadge}>A cada {reminder.intervalo}h</Text>
          )}
        </View>
        
        <Text style={[styles.title, !reminder.ativo && styles.inactiveText]} numberOfLines={1}>
          {reminder.titulo}
          {reminder.tipo === "medicamento" && reminder.dosagem ? ` - ${reminder.dosagem}` : ""}
        </Text>
      </View>

      <View style={styles.actions}>
        <Switch
          value={reminder.ativo}
          onValueChange={() => onToggle(reminder.id)}
          trackColor={{ false: "#767577", true: "#D330AA80" }}
          thumbColor={reminder.ativo ? "#D330AA" : "#f4f3f4"}
        />
        <TouchableOpacity
          onPress={() => onDelete(reminder.id)}
          style={styles.deleteButton}
        >
          <MaterialIcons name="delete-outline" size={24} color="#EF4444" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "white",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  inactiveContainer: {
    opacity: 0.6,
    backgroundColor: "#f9f9f9",
  },
  iconWrapper: {
    width: 40,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  time: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#641c4d",
  },
  dateBadge: {
    backgroundColor: "#EFF6FF",
    color: "#1E40AF",
    fontSize: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    fontWeight: "bold",
  },
  intervalBadge: {
    backgroundColor: "#FDF2F9",
    color: "#D330AA",
    fontSize: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    fontWeight: "bold",
  },
  title: {
    fontSize: 14,
    color: "#7d1e60",
    marginTop: 2,
  },
  inactiveText: {
    color: "#999",
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginLeft: 8,
  },
  deleteButton: {
    padding: 4,
  },
});
