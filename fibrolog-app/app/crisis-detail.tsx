import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { crisesService, Crisis } from "@/services/crises-service";
import { MaterialIcons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

export default function CrisisDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [crisis, setCrisis] = useState<Crisis | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const router = useRouter();

  const fetchCrisis = useCallback(async () => {
    try {
      setLoading(true);
      const data = await crisesService.getById(parseInt(id));
      setCrisis(data);
    } catch (_error) {
      Toast.show({
        type: "error",
        text1: "Erro",
        text2: "Não foi possível carregar os detalhes da crise.",
      });
      router.back();
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    fetchCrisis();
  }, [fetchCrisis]);

  const handleDeleteClick = () => {
    // Validar se o ID é válido
    const crisisId = parseInt(id);
    if (!id || isNaN(crisisId)) {
      Toast.show({
        type: "error",
        text1: "Erro",
        text2: `ID inválido: "${id}"`,
      });
      return;
    }
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    setShowDeleteDialog(false);
    const crisisId = parseInt(id);

    try {
      await crisesService.delete(crisisId);
      Toast.show({
        type: "success",
        text1: "Sucesso",
        text2: "Registro excluído com sucesso.",
      });
      router.replace("/history");
    } catch (error: any) {
      const errorMessage =
        error?.message || "Não foi possível excluir o registro.";
      Toast.show({
        type: "error",
        text1: "Erro ao excluir",
        text2: errorMessage,
      });
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#7d1e60" />
      </View>
    );
  }

  if (!crisis) return null;

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen
        options={{ title: "Detalhes da Crise", headerShown: true }}
      />

      <View style={styles.card}>
        <View style={styles.header}>
          <View style={styles.intensityContainer}>
            <Text style={styles.intensityValue}>{crisis.intensidade_dor}</Text>
            <Text style={styles.intensityLabel}>Dor</Text>
          </View>
          <View style={styles.dateContainer}>
            <Text style={styles.dateText}>
              {new Date(crisis.data_hora).toLocaleDateString("pt-BR")}
            </Text>
            <Text style={styles.timeText}>
              {new Date(crisis.data_hora).toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contexto</Text>
          <Text style={styles.sectionContent}>{crisis.contexto}</Text>
        </View>

        {crisis.duracao && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Duração</Text>
            <Text style={styles.sectionContent}>{crisis.duracao}</Text>
          </View>
        )}

        {crisis.sintomas_relatados && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sintomas Relatados</Text>
            <Text style={styles.sectionContent}>
              {crisis.sintomas_relatados}
            </Text>
          </View>
        )}

        {crisis.observacoes && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Observações</Text>
            <Text style={styles.sectionContent}>{crisis.observacoes}</Text>
          </View>
        )}
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={() => router.push(`/crisis-form?id=${crisis.id}`)}
        >
          <MaterialIcons name="edit" size={24} color="white" />
          <Text style={styles.actionButtonText}>Editar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={handleDeleteClick}
        >
          <MaterialIcons name="delete" size={24} color="white" />
          <Text style={styles.actionButtonText}>Excluir</Text>
        </TouchableOpacity>
      </View>

      <ConfirmDialog
        visible={showDeleteDialog}
        title="Confirmar Exclusão"
        message={`Deseja realmente excluir o registro de crise?`}
        confirmText="Excluir"
        cancelText="Cancelar"
        confirmColor="#dc2626"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setShowDeleteDialog(false)}
      />

      <Toast />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fdf2f9",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fdf2f9",
  },
  card: {
    backgroundColor: "white",
    margin: 15,
    borderRadius: 15,
    padding: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
    borderBottomWidth: 1,
    borderBottomColor: "#fce7f5",
    paddingBottom: 15,
  },
  intensityContainer: {
    alignItems: "center",
    backgroundColor: "#fce7f5",
    padding: 10,
    borderRadius: 12,
    minWidth: 60,
  },
  intensityValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#7d1e60",
  },
  intensityLabel: {
    fontSize: 12,
    color: "#7d1e60",
    textTransform: "uppercase",
  },
  dateContainer: {
    alignItems: "flex-end",
  },
  dateText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#641c4d",
  },
  timeText: {
    fontSize: 14,
    color: "#7d1e60",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#7d1e60",
    textTransform: "uppercase",
    marginBottom: 5,
    letterSpacing: 1,
  },
  sectionContent: {
    fontSize: 16,
    color: "#333",
    lineHeight: 22,
  },
  actions: {
    flexDirection: "row",
    padding: 15,
    justifyContent: "space-between",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    borderRadius: 10,
    flex: 0.48,
    elevation: 2,
  },
  editButton: {
    backgroundColor: "#7d1e60",
  },
  deleteButton: {
    backgroundColor: "#c62828",
  },
  actionButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 10,
  },
});
