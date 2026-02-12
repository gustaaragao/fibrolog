import { useAuth } from "@/contexts/auth-context";
import { MaterialIcons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function HomeScreen() {
  const { usuario } = useAuth();
  const router = useRouter();

  const menuItems = [
    { name: "Registrar Sintoma", icon: "edit", route: "/symptoms" },
    { name: "Registrar Crise", icon: "warning", route: "/crisis" },
    { name: "Lembrete", icon: "notifications", route: "/reminder" },
    { name: "Histórico", icon: "history", route: "/history" },
    { name: "Rede de Apoio", icon: "group", route: "/support" },
    { name: "Gerar Relatório", icon: "description", route: "/relatorio" },
  ];

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Menu Principal",
          headerShown: true,
          headerBackVisible: false,
          headerStyle: {
            backgroundColor: "#D330AA",
          },
          headerTintColor: "#ffffff",
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 20,
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
                size={48}
                color="#D330AA"
              />
            </View>
            <Text style={styles.cardText}>{item.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3d9ed", // pink-200
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#641c4d",
    marginBottom: 5,
  },
  subText: {
    fontSize: 16,
    color: "#7d1e60",
  },
  grid: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  card: {
    width: "45%",
    aspectRatio: 1,
    backgroundColor: "white",
    borderRadius: 20,
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4.65,
    elevation: 6,
  },
  iconContainer: {
    marginBottom: 15,
  },
  cardText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#7d1e60",
    textAlign: "center",
    paddingHorizontal: 5,
  },
});
