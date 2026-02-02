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
    backgroundColor: "#fff",
    padding: 20,
  },
  header: {
    paddingTop: 40,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0066CC",
    marginBottom: 8,
  },
  usuario: {
    fontSize: 16,
    color: "#666",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  mensagem: {
    fontSize: 18,
    color: "#666",
    textAlign: "center",
  },
  botao: {
    backgroundColor: "#dc3545",
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
