import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useAuth } from "@/contexts/auth-context";
import {
  DashboardStatistics,
  statisticsService,
} from "@/services/statistics-service";
import { MaterialIcons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function UsuarioScreen() {
  const { usuario, signOut } = useAuth();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [statistics, setStatistics] = useState<DashboardStatistics | null>(
    null
  );
  const [loadingStats, setLoadingStats] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchStatistics() {
      try {
        const stats = await statisticsService.getDashboard();
        setStatistics(stats);
      } catch (error) {
        console.error("Erro ao carregar estatísticas:", error);
      } finally {
        setLoadingStats(false);
      }
    }

    fetchStatistics();
  }, []);

  const handleLogoutPress = () => {
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

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen
        options={{
          title: "Perfil",
          headerShown: true,
          headerStyle: {
            backgroundColor: "#D330AA",
          },
          headerTintColor: "#ffffff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
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
        {/* Card do usuário */}
        <View style={styles.userCard}>
          <View style={styles.avatar}>
            <MaterialIcons name="person" size={48} color="white" />
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>
              {usuario?.email?.split("@")[0] || "Usuário"}
            </Text>
            <Text style={styles.userEmail}>{usuario?.email || ""}</Text>
          </View>
        </View>

        {/* Informações Pessoais */}
        <Text style={styles.sectionTitle}>Informações Pessoais</Text>
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <MaterialIcons name="email" size={24} color="#D330AA" />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>
                {usuario?.email || "Não informado"}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <MaterialIcons name="phone" size={24} color="#D330AA" />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Telefone</Text>
              <Text style={styles.infoValue}>Não informado</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <MaterialIcons name="cake" size={24} color="#D330AA" />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Data de Nascimento</Text>
              <Text style={styles.infoValue}>Não informado</Text>
            </View>
          </View>
        </View>

        {/* Estatísticas */}
        <Text style={styles.sectionTitle}>Estatísticas</Text>
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            {loadingStats ? (
              <ActivityIndicator size="small" color="#641c4d" />
            ) : (
              <Text style={styles.statNumber}>
                {statistics?.total_registros ?? 0}
              </Text>
            )}
            <Text style={styles.statLabel}>Registros</Text>
          </View>
          <View style={styles.statItem}>
            {loadingStats ? (
              <ActivityIndicator size="small" color="#d32f2f" />
            ) : (
              <Text style={[styles.statNumber, { color: "#d32f2f" }]}>
                {statistics?.total_crises ?? 0}
              </Text>
            )}
            <Text style={styles.statLabel}>Crises</Text>
          </View>
          <View style={styles.statItem}>
            {loadingStats ? (
              <ActivityIndicator size="small" color="#4caf50" />
            ) : (
              <Text style={[styles.statNumber, { color: "#4caf50" }]}>
                {statistics?.dias_ativos ?? 0}
              </Text>
            )}
            <Text style={styles.statLabel}>Dias ativos</Text>
          </View>
        </View>

        {/* Configurações */}
        <Text style={styles.sectionTitle}>Configurações</Text>
        <View style={styles.configCard}>
          <TouchableOpacity style={styles.configButton}>
            <MaterialIcons name="settings" size={24} color="#7d1e60" />
            <Text style={styles.configText}>Configurações gerais</Text>
            <MaterialIcons name="chevron-right" size={24} color="#999" />
          </TouchableOpacity>
        </View>

        {/* Botão de Sair */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogoutPress}
        >
          <MaterialIcons name="logout" size={24} color="#d32f2f" />
          <Text style={styles.logoutText}>Sair</Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3d9ed",
  },
  content: {
    padding: 20,
  },
  userCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#D330AA",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#D330AA",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: "#999",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#D330AA",
    marginTop: 10,
    marginBottom: 15,
  },
  infoCard: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  infoTextContainer: {
    marginLeft: 15,
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: "#999",
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    color: "#641c4d",
  },
  statsCard: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    justifyContent: "space-around",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#641c4d",
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: "#999",
  },
  configCard: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  configButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  configText: {
    flex: 1,
    fontSize: 16,
    color: "#641c4d",
    marginLeft: 15,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    marginTop: 10,
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
