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
import * as z from "zod";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  senha: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const { signIn } = useAuth();
  const router = useRouter();
  const [carregando, setCarregando] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      senha: "",
    },
  });

  const handleLogin = async (data: LoginFormValues) => {
    setCarregando(true);
    try {
      await signIn({ email: data.email, senha: data.senha });
      router.replace("/home");
    } catch (error) {
      console.error(error);
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
              name="senha"
              control={control}
              label="Senha"
              placeholder="Digite sua senha"
              secureTextEntry
              autoCapitalize="none"
              error={errors.senha?.message}
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
