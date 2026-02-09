import { useAuth } from "@/contexts/auth-context";
import { MaterialIcons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function HomeScreen() {
  const { usuario, signOut } = useAuth();
  const router = useRouter();

  const handleLogoutPress = async () => {
    try {
      await signOut();
      router.replace("/login");
    } catch {
      // Erro no logout
    }
  };

  const menuItems = [
    { name: "Registrar Sintoma", icon: "edit", route: "/symptoms" },
    { name: "Registrar Crise", icon: "warning", route: "/crisis" },
    { name: "Lembrete", icon: "notifications", route: "/reminder" },
    { name: "Histórico", icon: "history", route: "/history" },
    { name: "Áudio Descrição", icon: "mic", route: "/audio-desc" },
    { name: "Gerar PDF", icon: "picture-as-pdf", route: "/pdf" },
    { name: "Informações", icon: "info", route: "/info" },
    { name: "Rede de Apoio", icon: "group", route: "/support" },
  ];

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen
        options={{
          title: "FibroLog",
          headerRight: () => (
            <TouchableOpacity
              onPress={handleLogoutPress}
              style={{ marginRight: 15 }}
            >
              <MaterialIcons name="logout" size={24} color="#ffffff" />
            </TouchableOpacity>
          ),
          headerShown: true,
          headerBackVisible: false, // Prevent going back to login if stack allows
        }}
      />

      <View style={styles.header}>
        <Text style={styles.welcomeText}>
          Olá, {usuario?.email?.split("@")[0] || "Usuário"}
        </Text>
        <Text style={styles.subText}>Como você está se sentindo hoje?</Text>
      </View>

      <View style={styles.grid}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.card}
            onPress={() => router.push(item.route as any)}
          >
            <View style={styles.iconContainer}>
              <MaterialIcons
                name={item.icon as any}
                size={32}
                color="#7d1e60"
              />
            </View>
            <Text style={styles.cardText}>{item.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fdf2f9", // pink-50
  },
  header: {
    padding: 20,
    marginBottom: 10,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#641c4d", // pink-900
  },
  subText: {
    fontSize: 16,
    color: "#7d1e60", // pink-800
    marginTop: 5,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    padding: 10,
  },
  card: {
    width: "48%",
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  iconContainer: {
    marginBottom: 10,
    backgroundColor: "#fce7f5", // pink-100
    padding: 10,
    borderRadius: 50,
  },
  cardText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#641c4d", // pink-900
    textAlign: "center",
  },
});
