import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

export default function Index() {
  const { usuario, carregandoSessao } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log("🏠 Index: Estado da autenticação:", {
      carregandoSessao,
      temUsuario: !!usuario,
      usuario: usuario?.email,
    });

    if (!carregandoSessao) {
      if (usuario) {
        console.log("➡️ Index: Redirecionando para /home");
        router.replace("/home");
      } else {
        console.log("➡️ Index: Redirecionando para /login");
        router.replace("/login");
      }
    }
  }, [usuario, carregandoSessao, router]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#D330AA" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fdf2f9", // pink-50
  },
});
