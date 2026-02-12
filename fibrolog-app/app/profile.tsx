import Button from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import Input from "@/components/ui/Input";
import { useAuth } from "@/contexts/auth-context";
import { Patient, patientService } from "@/services/patient-service";
import { MaterialIcons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { Stack, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Toast from "react-native-toast-message";
import * as z from "zod";

const profileSchema = z.object({
  nome: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("E-mail inválido"),
  celular: z.string().min(14, "Telefone inválido (mínimo 10 dígitos com DDD)"),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const formatPhone = (value: string) => {
  if (!value) return value;
  const phoneNumber = value.replace(/[^\d]/g, "");
  const phoneNumberLength = phoneNumber.length;
  if (phoneNumberLength < 3) return phoneNumber;
  if (phoneNumberLength < 7) {
    return `(${phoneNumber.slice(0, 2)}) ${phoneNumber.slice(2)}`;
  }
  if (phoneNumberLength < 11) {
    return `(${phoneNumber.slice(0, 2)}) ${phoneNumber.slice(2, 6)}-${phoneNumber.slice(6, 10)}`;
  }
  return `(${phoneNumber.slice(0, 2)}) ${phoneNumber.slice(2, 7)}-${phoneNumber.slice(7, 11)}`;
};

const formatDate = (dateString: string) => {
  if (!dateString) return "-";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR");
  } catch {
    return dateString;
  }
};

export default function ProfileScreen() {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const { signOut } = useAuth();
  const router = useRouter();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  const fetchPatient = async () => {
    setLoading(true);
    try {
      const data = await patientService.getMe();
      setPatient(data);
      reset({
        nome: data.nome,
        email: data.email,
        celular: formatPhone(data.celular),
      });
    } catch (error: any) {
      Alert.alert("Erro", "Não foi possível carregar os dados do perfil");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatient();
  }, []);

  const onSave = async (data: ProfileFormData) => {
    if (!patient) return;
    setSaving(true);
    try {
      // Clean phone number for backend (only digits)
      const cleanData = {
        ...data,
        celular: data.celular.replace(/[^\d]/g, ""),
      };
      const updated = await patientService.updatePatient(patient.id, cleanData);
      setPatient(updated);
      setIsEditing(false);
      Toast.show({
        type: "success",
        text1: "Sucesso",
        text2: "Perfil atualizado com sucesso",
      });
    } catch (error: any) {
      Alert.alert("Erro", error.message || "Erro ao atualizar perfil");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    setShowLogoutDialog(true);
  };

  const handleConfirmLogout = async () => {
    setShowLogoutDialog(false);
    try {
      await signOut();
      router.replace("/login");
    } catch (error) {
      console.error("Erro ao sair:", error);
      Alert.alert("Erro", "Não foi possível sair da conta");
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#D21F8F" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen
        options={{
          title: "Meu Perfil",
          headerShown: true,
          headerTintColor: "#ffffff",
          headerStyle: { backgroundColor: "#D21F8F" },
          headerRight: () => (
            <Text
              style={{
                fontFamily: "Carattere_400Regular",
                fontSize: 32,
                color: "white",
                marginRight: 15,
              }}
            >
              F
            </Text>
          ),
        }}
      />

      <View style={styles.content}>
        <View style={styles.header}>
          <View
            style={styles.avatar}
            accessibilityRole="image"
            accessibilityLabel="Avatar do usuário"
          >
            <MaterialIcons name="person" size={64} color="#D21F8F" />
          </View>
          <Text style={styles.profileName}>{patient?.nome}</Text>
          <Text style={styles.profileEmail}>{patient?.email}</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Informações Pessoais</Text>
            {!isEditing && (
              <TouchableOpacity
                onPress={() => setIsEditing(true)}
                accessibilityRole="button"
                accessibilityLabel="Editar informações pessoais"
              >
                <MaterialIcons name="edit" size={24} color="#D21F8F" />
              </TouchableOpacity>
            )}
          </View>

          {isEditing ? (
            <View style={styles.form}>
              <Input
                name="nome"
                control={control}
                label="Nome Completo"
                placeholder="Seu nome"
                error={errors.nome?.message}
              />

              <Input
                name="email"
                control={control}
                label="E-mail"
                placeholder="seu@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
                error={errors.email?.message}
              />

              <Controller
                control={control}
                name="celular"
                render={({ field: { onChange, value } }) => (
                  <Input
                    name="celular"
                    control={control}
                    label="Celular"
                    placeholder="(XX) 9XXXX-XXXX"
                    keyboardType="phone-pad"
                    value={value}
                    onChangeText={(text) => onChange(formatPhone(text))}
                    error={errors.celular?.message}
                  />
                )}
              />

              <View style={styles.buttonRow}>
                <Button
                  title="Cancelar"
                  variant="outline"
                  onPress={() => {
                    setIsEditing(false);
                    reset();
                  }}
                  style={{ flex: 1, marginRight: 10 }}
                />
                <Button
                  title="Salvar"
                  onPress={handleSubmit(onSave)}
                  loading={saving}
                  style={{ flex: 1 }}
                />
              </View>
            </View>
          ) : (
            <View style={styles.infoGrid}>
              <InfoItem
                label="Celular"
                value={formatPhone(patient?.celular || "")}
                icon="phone"
              />
              <InfoItem
                label="Data de Nascimento"
                value={formatDate(patient?.data_nascimento || "")}
                icon="cake"
              />
              <InfoItem
                label="Sexo"
                value={patient?.sexo || "-"}
                icon="person-outline"
              />
              <InfoItem
                label="Data do Diagnóstico"
                value={formatDate(patient?.data_diagnostico || "")}
                icon="assignment"
              />
            </View>
          )}
        </View>

        {/* Botão de Sair */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          accessibilityRole="button"
          accessibilityLabel="Sair da conta"
        >
          <MaterialIcons name="logout" size={24} color="#d32f2f" />
          <Text style={styles.logoutText}>Sair da Conta</Text>
        </TouchableOpacity>
      </View>

      <ConfirmDialog
        visible={showLogoutDialog}
        title="Sair da conta"
        message="Tem certeza que deseja sair?"
        confirmText="Sair"
        cancelText="Cancelar"
        confirmColor="#d32f2f"
        onConfirm={handleConfirmLogout}
        onCancel={() => setShowLogoutDialog(false)}
      />
    </ScrollView>
  );
}

function InfoItem({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: string;
}) {
  return (
    <View style={styles.infoItem}>
      <MaterialIcons
        name={icon as any}
        size={20}
        color="#7d1e60"
        style={styles.infoIcon}
      />
      <View>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
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
  content: {
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  profileName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#641c4d",
  },
  profileEmail: {
    fontSize: 14,
    color: "#7d1e60",
  },
  section: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#641c4d",
  },
  form: {
    width: "100%",
  },
  buttonRow: {
    flexDirection: "row",
    marginTop: 20,
  },
  infoGrid: {
    width: "100%",
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#fce7f5",
    paddingBottom: 10,
  },
  infoIcon: {
    marginRight: 15,
  },
  infoLabel: {
    fontSize: 12,
    color: "#7d1e60",
    textTransform: "uppercase",
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    color: "#641c4d",
    fontWeight: "600",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    marginTop: 30,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: "#d32f2f",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#d32f2f",
    marginLeft: 10,
  },
});
