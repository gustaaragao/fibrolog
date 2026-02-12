import React, { useEffect, useState, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Modal,
  Alert,
  Platform,
  RefreshControl,
} from "react-native";
import { Stack } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { Reminder, ReminderType, reminderService } from "@/services/reminder-service";
import { notificationService } from "@/services/notification-service";
import { ReminderItem } from "@/components/ui/ReminderItem";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";

export default function LembretesScreen() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  // Form state
  const [newTitle, setNewTitle] = useState("");
  const [newType, setNewType] = useState<ReminderType>("geral");
  const [newTime, setNewTime] = useState(new Date());
  const [newDosage, setNewDosage] = useState("");
  const [newInterval, setNewInterval] = useState("8");
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  const [hasPermission, setHasPermission] = useState(false);

  const loadReminders = useCallback(async () => {
    const data = await reminderService.getReminders();
    setReminders(data);
  }, []);

  const handleSync = useCallback(async () => {
    setRefreshing(true);
    try {
      const updated = await reminderService.syncLocalRemindersWithServer();
      setReminders(updated);
    } catch (error) {
      console.error("Erro ao sincronizar:", error);
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    async function init() {
      const permission = await notificationService.requestPermissions();
      setHasPermission(permission);
      
      // Tenta sincronizar com o servidor no boot
      await handleSync();
      
      if (permission) {
        await reminderService.syncNotifications();
      }
    }
    init();
  }, [handleSync]);

  const handleAddReminder = async () => {
    if (!newTitle.trim()) {
      const msg = "Por favor, informe um título para o lembrete.";
      Platform.OS === "web" ? alert(msg) : Alert.alert("Erro", msg);
      return;
    }

    if (newType === "medicamento" && !newDosage.trim()) {
        const msg = "Informe a dosagem do medicamento.";
        Platform.OS === "web" ? alert(msg) : Alert.alert("Erro", msg);
        return;
    }

    if (!hasPermission) {
      const permission = await notificationService.requestPermissions();
      setHasPermission(permission);
    }

    const metadata = {
        dosagem: newType === "medicamento" ? newDosage : undefined,
        intervalo: newType === "medicamento" ? parseInt(newInterval) : undefined,
        dataExame: newType === "exame" ? newTime.toISOString() : undefined,
    };

    await reminderService.addReminder(
      newTitle,
      newType,
      newTime.getHours(),
      newTime.getMinutes(),
      metadata
    );
    
    setModalVisible(false);
    resetForm();
    await loadReminders();
  };

  const resetForm = () => {
    setNewTitle("");
    setNewType("geral");
    setNewTime(new Date());
    setNewDosage("");
    setNewInterval("8");
  };

  const handleToggle = async (id: string) => {
    const updated = await reminderService.toggleReminder(id);
    setReminders([...updated]);
  };

  const handleDelete = async (id: string) => {
    if (Platform.OS === "web") {
        if (confirm("Tem certeza que deseja remover este lembrete?")) {
            const updated = await reminderService.deleteReminder(id);
            setReminders([...updated]);
        }
        return;
    }

    Alert.alert(
      "Remover Lembrete",
      "Tem certeza que deseja remover este lembrete?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Remover",
          style: "destructive",
          onPress: async () => {
            const updated = await reminderService.deleteReminder(id);
            setReminders([...updated]);
          },
        },
      ]
    );
  };

  const onTimeChange = (_event: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate || newTime;
    setShowTimePicker(Platform.OS === "ios");
    setShowDatePicker(Platform.OS === "ios");
    if (currentDate && !isNaN(currentDate.getTime())) {
        setNewTime(currentDate);
    }
  };

  const formatTime = (date: Date) => {
    if (!date || isNaN(date.getTime())) return "00:00";
    return `${date.getHours().toString().padStart(2, "0")}:${date
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
  };

  const handleWebTimeChange = (value: string) => {
    if (!value) return;
    try {
        const [hours, minutes] = value.split(":").map(Number);
        const d = new Date();
        d.setHours(hours, minutes, 0, 0);
        if (!isNaN(d.getTime())) {
            setNewTime(d);
        }
    } catch (e) {
        console.error("Erro ao converter hora web:", e);
    }
  };

  const handleWebDateTimeChange = (value: string) => {
    if (!value) return;
    try {
        const d = new Date(value);
        if (!isNaN(d.getTime())) {
            setNewTime(d);
        }
    } catch (e) {
        console.error("Erro ao converter data/hora web:", e);
    }
  };

  const formatDate = (date: Date) => {
    if (!date || isNaN(date.getTime())) return "00/00/0000";
    return date.toLocaleDateString("pt-BR");
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Lembretes",
          headerShown: true,
          headerStyle: { backgroundColor: "#D330AA" },
          headerTintColor: "#ffffff",
          headerTitleStyle: { fontWeight: "bold" },
          headerRight: () => (
            <TouchableOpacity onPress={handleSync} style={{ marginRight: 16 }}>
              <MaterialIcons name="sync" size={24} color="white" />
            </TouchableOpacity>
          )
        }}
      />

      <View style={styles.header}>
        <Text style={styles.subtitle}>
          Gerencie seus avisos de saúde em um só lugar.
        </Text>
        {!hasPermission && (
          <TouchableOpacity 
            style={styles.permissionWarning}
            onPress={async () => {
               const p = await notificationService.requestPermissions();
               setHasPermission(p);
            }}
          >
            <MaterialIcons name="notifications-off" size={20} color="#991B1B" />
            <Text style={styles.permissionWarningText}>
              Permissões desativadas. Toque para ativar notificações.
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={reminders}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleSync} tintColor="#D330AA" />
        }
        renderItem={({ item }) => (
          <ReminderItem
            reminder={item}
            onToggle={handleToggle}
            onDelete={handleDelete}
          />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialIcons name="alarm-add" size={64} color="#ccc" />
            <Text style={styles.emptyText}>Nenhum lembrete configurado.</Text>
          </View>
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      >
        <MaterialIcons name="add" size={32} color="white" />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Novo Lembrete</Text>

            <Select
              label="Tipo de Lembrete"
              value={newType}
              onValueChange={(val) => setNewType(val as ReminderType)}
              options={[
                { label: "Geral", value: "geral" },
                { label: "Medicamento", value: "medicamento" },
                { label: "Exame", value: "exame" },
              ]}
            />

            <Input
              label={newType === "medicamento" ? "Nome do Remédio" : newType === "exame" ? "Nome do Exame" : "Título"}
              placeholder="Ex: Dipirona, Sangue, Caminhada..."
              value={newTitle}
              onChangeText={setNewTitle}
            />

            {newType === "medicamento" && (
              <View style={styles.row}>
                <View style={{ flex: 1 }}>
                  <Input
                    label="Dosagem"
                    placeholder="Ex: 500mg"
                    value={newDosage}
                    onChangeText={setNewDosage}
                  />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Select
                    label="Repetir a cada"
                    value={newInterval}
                    onValueChange={setNewInterval}
                    options={[
                      { label: "4 horas", value: "4" },
                      { label: "6 horas", value: "6" },
                      { label: "8 horas", value: "8" },
                      { label: "12 horas", value: "12" },
                      { label: "24 horas", value: "24" },
                    ]}
                  />
                </View>
              </View>
            )}

            <Text style={styles.inputLabel}>{newType === "exame" ? "Data e Hora" : "Horário Inicial"}</Text>
            
            {Platform.OS === "web" ? (
              <input
                type={newType === "exame" ? "datetime-local" : "time"}
                value={newType === "exame" ? (newTime && !isNaN(newTime.getTime()) ? newTime.toISOString().slice(0, 16) : "") : formatTime(newTime)}
                onChange={(e) => {
                    if (newType === "exame") handleWebDateTimeChange(e.target.value);
                    else handleWebTimeChange(e.target.value);
                }}
                style={styles.webInput}
              />
            ) : (
              <View style={styles.row}>
                {newType === "exame" && (
                    <TouchableOpacity
                        style={[styles.timeSelector, { flex: 1 }]}
                        onPress={() => setShowDatePicker(true)}
                    >
                        <MaterialIcons name="event" size={24} color="#D330AA" />
                        <Text style={styles.timeSelectorText}>{formatDate(newTime)}</Text>
                    </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={[styles.timeSelector, { flex: 1, marginLeft: newType === "exame" ? 12 : 0 }]}
                  onPress={() => setShowTimePicker(true)}
                >
                  <MaterialIcons name="access-time" size={24} color="#D330AA" />
                  <Text style={styles.timeSelectorText}>{formatTime(newTime)}</Text>
                </TouchableOpacity>

                {showDatePicker && (
                  <DateTimePicker
                    value={newTime && !isNaN(newTime.getTime()) ? newTime : new Date()}
                    mode="date"
                    onChange={onTimeChange}
                  />
                )}
                {showTimePicker && (
                  <DateTimePicker
                    value={newTime && !isNaN(newTime.getTime()) ? newTime : new Date()}
                    mode="time"
                    is24Hour={true}
                    onChange={onTimeChange}
                  />
                )}
              </View>
            )}

            <View style={styles.modalActions}>
              <Button
                title="Cancelar"
                variant="outline"
                onPress={() => {
                    setModalVisible(false);
                    resetForm();
                }}
                style={{ flex: 1 }}
              />
              <Button
                title="Salvar"
                onPress={handleAddReminder}
                style={{ flex: 1 }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fdf2f9",
  },
  header: {
    padding: 20,
  },
  subtitle: {
    fontSize: 14,
    color: "#7d1e60",
    marginBottom: 10,
  },
  permissionWarning: {
    flexDirection: "row",
    backgroundColor: "#FEF2F2",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderColor: "#FCA5A5",
  },
  permissionWarningText: {
    fontSize: 12,
    color: "#991B1B",
    flex: 1,
  },
  listContent: {
    padding: 20,
    paddingBottom: 100,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 60,
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
    marginTop: 16,
  },
  fab: {
    position: "absolute",
    bottom: 30,
    right: 30,
    backgroundColor: "#D330AA",
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#641c4d",
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#641c4d",
    marginBottom: 8,
    marginTop: 16,
  },
  timeSelector: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    padding: 12,
    borderRadius: 12,
    gap: 12,
  },
  timeSelectorText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#641c4d",
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 32,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  webInput: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    fontSize: 16,
    width: "100%",
  }
});

