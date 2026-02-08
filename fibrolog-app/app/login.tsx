import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useAuth } from "@/contexts/auth-context";
import type { LoginFormData } from "@/src/validation/schemas";
import { loginSchema } from "@/src/validation/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Text,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

export default function LoginScreen() {
  const { signIn } = useAuth();
  const router = useRouter();
  const [carregando, setCarregando] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleLogin = async (data: LoginFormData) => {
    if (__DEV__) {
      console.log("🚀 Iniciando login com:", {
        email: data.email,
        password: "***",
      });
    }
    setCarregando(true);
    try {
      // Mapear campos do schema (inglês) para API (português)
      if (__DEV__) console.log("📤 Chamando signIn...");
      await signIn({ email: data.email, senha: data.password });
      if (__DEV__) console.log("✅ signIn completou, navegando para /home");
      router.replace("/home");
    } catch (error: any) {
      if (__DEV__) console.error("❌ Erro capturado:", error);

      // Determinar tipo de erro e mostrar mensagem apropriada
      let errorMessage = "Erro ao fazer login. Tente novamente";

      if (error?.response?.status === 401) {
        errorMessage = "Email ou senha incorretos";
      } else if (error?.message?.toLowerCase().includes("network")) {
        errorMessage = "Erro de conexão. Verifique sua internet";
      } else if (error?.message) {
        // Mostrar a mensagem de erro real da API
        errorMessage = error.message;
      }

      console.log("💬 Mostrando toast:", errorMessage);
      Toast.show({
        type: "error",
        text1: "Erro no Login",
        text2: errorMessage,
        position: "top",
        visibilityTime: 4000,
      });
    } finally {
      setCarregando(false);
    }
  };

  const handleGoToRegister = () => {
    router.push("/register");
  };

  return (
    <SafeAreaView className="flex-1 bg-pink-50">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View className="flex-1 justify-center px-10 pb-16">
          <View className="items-center mb-16">
            <Text
              className="text-7xl text-pink-800"
              style={{ fontFamily: "Carattere_400Regular" }}
            >
              FibroLog
            </Text>
            <Text className="text-xl text-pink-600 mt-2 font-medium">
              Entre na sua conta
            </Text>
          </View>

          <View className="space-y-6">
            <Input
              name="email"
              control={control}
              label="Email"
              placeholder="Digite seu email"
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email?.message}
            />

            <Input
              name="password"
              control={control}
              label="Senha"
              placeholder="Digite sua senha"
              secureTextEntry
              autoCapitalize="none"
              error={errors.password?.message}
            />

            <View className="mt-8 space-y-4">
              <Button
                title="Entrar"
                onPress={handleSubmit(handleLogin)}
                loading={carregando}
                size="lg"
              />

              <Button
                title="Não tem uma conta? Cadastre-se"
                onPress={handleGoToRegister}
                variant="text"
              />
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
