import Input from "@/components/ui/Input";
import TextArea from "@/components/ui/TextArea";
import { crisesService, SupportContact } from "@/services/crises-service";
import { supportService } from "@/services/support-service";
import { MaterialIcons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

interface CrisisFormData {
  intensidade_dor: number;
  contexto: string;
  duracao: string;
  sintomas_relatados: string;
  observacoes: string;
}

export default function CrisisFormScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const isEditing = !!id;
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditing);

  // Notification Modal State
  const [contacts, setContacts] = useState<SupportContact[]>([]);
  const [showNotifyModal, setShowNotifyModal] = useState(false);
  const [selectedContacts, setSelectedContacts] = useState<number[]>([]);
  const [notifying, setNotifying] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CrisisFormData>({
    defaultValues: {
      intensidade_dor: 4,
      contexto: "",
      duracao: "",
      sintomas_relatados: "",
      observacoes: "",
    },
  });

  const selectedIntensity = watch("intensidade_dor");

  useEffect(() => {
    if (isEditing) {
      const fetchCrisis = async () => {
        try {
          const data = await crisesService.getById(parseInt(id));
          setValue("intensidade_dor", data.intensidade_dor);
          setValue("contexto", data.contexto);
          setValue("duracao", data.duracao || "");
          setValue("sintomas_relatados", data.sintomas_relatados || "");
          setValue("observacoes", data.observacoes || "");
        } catch {
          Alert.alert("Erro", "Não foi possível carregar os dados da crise.");
          router.back();
        } finally {
          setInitialLoading(false);
        }
      };
      fetchCrisis();
    }

    // Fetch contacts for notification
    const fetchContacts = async () => {
      try {
        console.log("📋 [Crisis] Carregando contatos da rede de apoio...");
        const response = await supportService.list();
        setContacts(response.contatos);
        // Default to all selected
        setSelectedContacts(response.contatos.map((c) => c.id));
        console.log(
          `✅ [Crisis] ${response.contatos.length} contatos carregados`,
        );
      } catch (err) {
        console.error(
          "❌ [Crisis] Erro ao carregar contatos para notificação",
          err,
        );
      }
    };
    fetchContacts();
  }, [id, isEditing, router, setValue]);

  const toggleContact = (contactId: number) => {
    setSelectedContacts((prev) =>
      prev.includes(contactId)
        ? prev.filter((id) => id !== contactId)
        : [...prev, contactId],
    );
  };

  const toggleSelectAll = () => {
    if (selectedContacts.length === contacts.length) {
      setSelectedContacts([]);
    } else {
      setSelectedContacts(contacts.map((c) => c.id));
    }
  };

  const handleNotifySupport = async () => {
    if (selectedContacts.length === 0) {
      console.warn("⚠️ [Crisis] Nenhum contato selecionado");
      Alert.alert("Aviso", "Selecione pelo menos um contato para notificar.");
      return;
    }

    try {
      setNotifying(true);
      console.log(
        `📲 [Crisis] Notificando ${selectedContacts.length} contato(s)...`,
      );
      await supportService.notify(selectedContacts);
      console.log("✅ [Crisis] Rede de apoio notificada com sucesso");
      Toast.show({
        type: "success",
        text1: "Rede de Apoio notificada!",
        text2: "Seus contatos foram avisados sobre sua crise.",
      });
      setShowNotifyModal(false);
      router.replace("/(tabs)/home");
    } catch {
      console.error("❌ [Crisis] Erro ao notificar rede de apoio");
      Toast.show({
        type: "error",
        text1: "Erro na notificação",
        text2: "Não foi possível avisar sua rede de apoio.",
      });
    } finally {
      setNotifying(false);
    }
  };

  const onSubmit = async (data: CrisisFormData) => {
    try {
      setLoading(true);
      if (isEditing) {
        await crisesService.update(parseInt(id), data);
        console.log("✅ [Crisis] Crise atualizada com sucesso");
        Toast.show({
          type: "success",
          text1: "Sucesso",
          text2: "Crise atualizada com sucesso!",
        });
        router.replace("/history");
      } else {
        await crisesService.create(data);
        console.log("✅ [Crisis] Crise criada com sucesso");
        Toast.show({
          type: "success",
          text1: "Sucesso",
          text2: "Crise registrada com sucesso!",
        });

        if (contacts.length > 0) {
          console.log(
            `📋 [Crisis] ${contacts.length} contatos disponíveis para notificação`,
          );
          Alert.alert(
            "Notificar Rede de Apoio?",
            "Deseja avisar seus contatos de confiança sobre esta crise?",
            [
              {
                text: "Agora não",
                onPress: () => {
                  console.log("⏭️ [Crisis] Usuário optou por não notificar");
                  router.replace("/(tabs)/home");
                },
                style: "cancel",
              },
              {
                text: "Sim, selecionar contatos",
                onPress: () => {
                  console.log(
                    "📲 [Crisis] Abrindo modal de seleção de contatos",
                  );
                  setShowNotifyModal(true);
                },
              },
            ],
            { cancelable: false },
          );
        } else {
          console.log("⚠️ [Crisis] Nenhum contato cadastrado");
          router.replace("/(tabs)/home");
        }
      }
    } catch (err: any) {
      console.error("❌ [Crisis] Erro ao salvar crise:", err);
      Toast.show({
        type: "error",
        text1: "Erro",
        text2: err.message || "Erro ao salvar crise.",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderIntensitySelector = () => {
    return (
      <View style={styles.intensityContainer}>
        <Text style={styles.label}>Intensidade da Dor (0-10)</Text>
        <View style={styles.intensityGrid}>
          {[0, 2, 4, 6, 8, 10].map((num) => (
            <TouchableOpacity
              key={num}
              style={[
                styles.intensityCircle,
                selectedIntensity === num && styles.intensityCircleSelected,
              ]}
              onPress={() => setValue("intensidade_dor", num)}
            >
              <Text
                style={[
                  styles.intensityCircleText,
                  selectedIntensity === num &&
                    styles.intensityCircleTextSelected,
                ]}
              >
                {num}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.intensityLabel}>
          {selectedIntensity <= 2
            ? "Leve"
            : selectedIntensity <= 6
              ? "Moderada"
              : "Intensa"}
        </Text>
      </View>
    );
  };

  if (initialLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#7d1e60" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <Stack.Screen
          options={{
            title: isEditing ? "Editar Crise" : "Registrar Crise",
            headerShown: true,
          }}
        />

        <View style={styles.form}>
          {renderIntensitySelector()}

          <Input
            name="contexto"
            control={control}
            label="Contexto"
            placeholder="O que estava fazendo? Gatilhos?"
            error={errors.contexto?.message}
          />

          <Input
            name="duracao"
            control={control}
            label="Duração"
            placeholder="Ex: 2 horas, o dia todo"
          />

          <TextArea
            name="sintomas_relatados"
            control={control}
            label="Sintomas Relatados"
            placeholder="Além da dor, o que sentiu? (ex: fadiga, névoa mental)"
          />

          <TextArea
            name="observacoes"
            control={control}
            label="Observações Adicionais"
            placeholder="Algo mais que queira registrar?"
          />

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit(onSubmit)}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                <MaterialIcons name="save" size={24} color="white" />
                <Text style={styles.submitButtonText}>
                  {isEditing ? "Atualizar Registro" : "Salvar Registro"}
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Notification Selection Modal */}
      <Modal
        visible={showNotifyModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowNotifyModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Notificar Rede de Apoio</Text>
              <TouchableOpacity onPress={() => setShowNotifyModal(false)}>
                <MaterialIcons name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSubtitle}>
              Selecione quem você deseja avisar sobre esta crise:
            </Text>

            <TouchableOpacity
              style={styles.selectAllButton}
              onPress={toggleSelectAll}
            >
              <MaterialIcons
                name={
                  selectedContacts.length === contacts.length
                    ? "check-box"
                    : "check-box-outline-blank"
                }
                size={24}
                color="#7d1e60"
              />
              <Text style={styles.selectAllText}>Selecionar Todos</Text>
            </TouchableOpacity>

            <FlatList
              data={contacts}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.contactSelectItem}
                  onPress={() => toggleContact(item.id)}
                >
                  <MaterialIcons
                    name={
                      selectedContacts.includes(item.id)
                        ? "check-circle"
                        : "radio-button-unchecked"
                    }
                    size={24}
                    color={
                      selectedContacts.includes(item.id) ? "#7d1e60" : "#d1d5db"
                    }
                  />
                  <View style={styles.contactSelectInfo}>
                    <Text style={styles.contactSelectName}>{item.nome}</Text>
                    <Text style={styles.contactSelectRelation}>
                      {item.parentesco}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
              style={styles.contactList}
            />

            <TouchableOpacity
              style={[
                styles.notifySubmitButton,
                selectedContacts.length === 0 && styles.disabledButton,
              ]}
              onPress={handleNotifySupport}
              disabled={notifying || selectedContacts.length === 0}
            >
              {notifying ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.notifySubmitText}>
                  Notificar ({selectedContacts.length})
                </Text>
              )}
            </TouchableOpacity>
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fdf2f9",
  },
  form: {
    padding: 20,
    paddingBottom: 40,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#641c4d",
    marginBottom: 10,
  },
  intensityContainer: {
    marginBottom: 20,
  },
  intensityGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  intensityCircle: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: "#f9a8d4",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  intensityCircleSelected: {
    backgroundColor: "#7d1e60",
    borderColor: "#7d1e60",
  },
  intensityCircleText: {
    fontSize: 14,
    color: "#7d1e60",
  },
  intensityCircleTextSelected: {
    color: "white",
    fontWeight: "bold",
  },
  intensityLabel: {
    textAlign: "right",
    marginTop: 5,
    fontWeight: "bold",
    color: "#7d1e60",
  },
  submitButton: {
    backgroundColor: "#7d1e60",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    elevation: 3,
  },
  submitButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#641c4d",
  },
  modalSubtitle: {
    fontSize: 16,
    color: "#6b7280",
    marginBottom: 20,
  },
  selectAllButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
    marginBottom: 10,
  },
  selectAllText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#7d1e60",
    marginLeft: 12,
  },
  contactList: {
    marginBottom: 20,
  },
  contactSelectItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f9fafb",
  },
  contactSelectInfo: {
    marginLeft: 12,
  },
  contactSelectName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#374151",
  },
  contactSelectRelation: {
    fontSize: 14,
    color: "#6b7280",
  },
  notifySubmitButton: {
    backgroundColor: "#7d1e60",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#d1d5db",
  },
  notifySubmitText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
