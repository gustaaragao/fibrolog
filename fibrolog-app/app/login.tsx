import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Text,
  View,
} from "react-native";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Toast from "react-native-toast-message";
import { loginSchema } from "@/validation/schemas";
import type { LoginFormData } from "@/validation/schemas";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

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
    setCarregando(true);
    try {
      await signIn({ email: data.email, senha: data.password });
      router.replace("/home");
    } catch (error: any) {
      console.error(error);
      
      // Determinar tipo de erro e mostrar mensagem apropriada
      const errorMessage = error?.response?.status === 401
        ? "Email ou senha incorretos"
        : error?.message?.includes("Network")
        ? "Erro de conexão. Verifique sua internet"
        : "Erro ao fazer login. Tente novamente";
      
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
              style={{ fontFamily: 'Carattere_400Regular' }}
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
