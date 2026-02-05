import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function HomeScreen() {
  const { usuario, signOut } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.replace("/login");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titulo}>Bem-vindo ao FibroLog</Text>
        {usuario && (
          <Text style={styles.usuario}>Usuário: {usuario.email}</Text>
        )}
      </View>

      <View style={styles.content}>
        <Text style={styles.mensagem}>
          Sistema de monitoramento da fibromialgia
        </Text>
      </View>

      <TouchableOpacity style={styles.botao} onPress={handleLogout}>
        <Text style={styles.textoBotao}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#faf5ff", // purple-50
    padding: 20,
  },
  header: {
    paddingTop: 40,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e9d5ff", // purple-200
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#6b21a8", // purple-800
    marginBottom: 8,
  },
  usuario: {
    fontSize: 16,
    color: "#9333ea", // purple-600
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  mensagem: {
    fontSize: 18,
    color: "#9333ea", // purple-600
    textAlign: "center",
  },
  botao: {
    backgroundColor: "#ef4444", // error-500
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  textoBotao: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
