import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import Input from "@/components/ui/Input";
import { supportService } from "@/services/support-service";
import { SupportContact } from "@/services/crises-service";
import { MaterialIcons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

interface ContactFormData {
  nome: string;
  email: string;
  telefone: string;
  parentesco: string;
}

export default function SupportNetworkScreen() {
  const [contacts, setContacts] = useState<SupportContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [contactToDelete, setContactToDelete] = useState<number | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    defaultValues: {
      nome: "",
      email: "",
      telefone: "",
      parentesco: "",
    },
  });

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const response = await supportService.list();
      setContacts(response.contatos);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Erro",
        text2: "Não foi possível carregar os contatos.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const onSubmit = async (data: ContactFormData) => {
    try {
      setSubmitting(true);
      await supportService.create(data);
      Toast.show({
        type: "success",
        text1: "Sucesso",
        text2: "Contato adicionado com sucesso!",
      });
      setModalVisible(false);
      reset();
      fetchContacts();
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Erro",
        text2: "Não foi possível adicionar o contato.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (contactToDelete === null) return;
    try {
      await supportService.delete(contactToDelete);
      Toast.show({
        type: "success",
        text1: "Sucesso",
        text2: "Contato removido com sucesso!",
      });
      fetchContacts();
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Erro",
        text2: "Não foi possível remover o contato.",
      });
    } finally {
      setDeleteDialogVisible(false);
      setContactToDelete(null);
    }
  };

  const renderContactItem = ({ item }: { item: SupportContact }) => (
    <View style={styles.contactCard}>
      <View style={styles.contactInfo}>
        <Text style={styles.contactName}>{item.nome}</Text>
        <Text style={styles.contactPhone}>{item.telefone}</Text>
        <Text style={styles.contactEmail}>{item.email}</Text>
        {item.parentesco && (
          <Text style={styles.contactRelation}>{item.parentesco}</Text>
        )}
      </View>
      <TouchableOpacity
        onPress={() => {
          setContactToDelete(item.id);
          setDeleteDialogVisible(true);
        }}
        style={styles.deleteButton}
      >
        <MaterialIcons name="delete-outline" size={24} color="#dc2626" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Rede de Apoio", headerShown: true }} />

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#7d1e60" />
        </View>
      ) : (
        <FlatList
          data={contacts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderContactItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <MaterialIcons name="people-outline" size={64} color="#f9a8d4" />
              <Text style={styles.emptyText}>
                Nenhum contato na sua rede de apoio.
              </Text>
            </View>
          }
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      >
        <MaterialIcons name="add" size={30} color="white" />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Adicionar Contato</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <MaterialIcons name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <View style={styles.form}>
              <Input
                name="nome"
                control={control}
                label="Nome"
                placeholder="Ex: Maria Souza"
                error={errors.nome?.message}
                rules={{ required: "O nome é obrigatório" }}
              />

              <Input
                name="email"
                control={control}
                label="E-mail"
                placeholder="Ex: maria@email.com"
                error={errors.email?.message}
                rules={{ 
                  required: "O e-mail é obrigatório",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "E-mail inválido"
                  }
                }}
              />

              <Input
                name="telefone"
                control={control}
                label="Telefone / Contato"
                placeholder="Ex: (11) 98765-4321"
                error={errors.telefone?.message}
                rules={{ required: "O telefone é obrigatório" }}
              />

              <Input
                name="parentesco"
                control={control}
                label="Parentesco / Relação"
                placeholder="Ex: Mãe, Médico, Amigo"
                error={errors.parentesco?.message}
                rules={{ required: "O parentesco é obrigatório" }}
              />

              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSubmit(onSubmit)}
                disabled={submitting}
              >
                {submitting ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.saveButtonText}>Salvar Contato</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <ConfirmDialog
        visible={deleteDialogVisible}
        title="Remover Contato"
        message="Tem certeza que deseja remover este contato da sua rede de apoio?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialogVisible(false)}
      />
      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fdf2f9",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  contactCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#641c4d",
  },
  contactPhone: {
    fontSize: 14,
    color: "#7d1e60",
    marginTop: 2,
  },
  contactEmail: {
    fontSize: 13,
    color: "#7d1e60",
    opacity: 0.8,
  },
  contactRelation: {
    fontSize: 12,
    color: "#9d4d82",
    marginTop: 2,
    fontStyle: "italic",
  },
  deleteButton: {
    padding: 8,
  },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#7d1e60",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  emptyContainer: {
    marginTop: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: "#9d4d82",
    textAlign: "center",
  },
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
    minHeight: "60%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#641c4d",
  },
  form: {
    gap: 12,
  },
  saveButton: {
    backgroundColor: "#7d1e60",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 8,
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
