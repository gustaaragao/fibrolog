import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useAuth } from "@/contexts/auth-context";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Toast from "react-native-toast-message";
import * as z from "zod";

const registrationSchema = z
  .object({
    nome: z.string().min(1, "Nome é obrigatório"),
    email: z.string().email("Email inválido"),
    dataNascimento: z.string().length(10, "Formato DD/MM/AAAA"),
    sexo: z.enum(["M", "F", "O"]),
    dataDiagnostico: z.string().length(10, "Formato DD/MM/AAAA"),
    senha: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
    confirmarSenha: z.string().min(6, "Confirme sua senha"),
  })
  .refine((data) => data.senha === data.confirmarSenha, {
    message: "As senhas não coincidem",
    path: ["confirmarSenha"],
  });

type RegistrationFormValues = z.infer<typeof registrationSchema>;

export default function RegisterScreen() {
  const { signUp } = useAuth();
  const router = useRouter();
  const [carregando, setCarregando] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      nome: "",
      email: "",
      dataNascimento: "",
      sexo: "F",
      dataDiagnostico: "",
      senha: "",
      confirmarSenha: "",
    },
  });

  const sexoValue = watch("sexo");

  const formatarData = (texto: string) => {
    const numeros = texto.replace(/\D/g, "");
    if (numeros.length <= 2) return numeros;
    if (numeros.length <= 4)
      return `${numeros.slice(0, 2)}/${numeros.slice(2)}`;
    return `${numeros.slice(0, 2)}/${numeros.slice(2, 4)}/${numeros.slice(4, 8)}`;
  };

  const converterParaISO = (dataFormatada: string): string => {
    const [dia, mes, ano] = dataFormatada.split("/");
    return new Date(`${ano}-${mes}-${dia}`).toISOString();
  };

  const handleRegister = async (data: RegistrationFormValues) => {
    setCarregando(true);
    try {
      await signUp({
        nome: data.nome,
        email: data.email,
        senha: data.senha,
        data_nascimento: converterParaISO(data.dataNascimento),
        sexo: data.sexo,
        data_diagnostico: converterParaISO(data.dataDiagnostico),
      });

      Toast.show({
        type: "success",
        text1: "Sucesso!",
        text2: "Cadastro realizado com sucesso",
      });

      setTimeout(() => {
        router.replace("/(tabs)/home");
      }, 1000);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Erro",
        text2: "Falha ao criar conta. Tente novamente.",
      });
    } finally {
      setCarregando(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-pink-50">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          className="px-10 py-16"
        >
          <View className="items-center mb-10">
            <Text
              className="text-7xl text-pink-800"
              style={{ fontFamily: "Carattere_400Regular" }}
            >
              FibroLog
            </Text>
            <Text className="text-xl text-pink-600 mt-2 font-medium">
              Crie sua nova conta
            </Text>
          </View>

          <View className="space-y-4">
            <Input
              name="nome"
              control={control}
              label="Nome completo"
              placeholder="Digite seu nome completo"
              autoCapitalize="words"
              error={errors.nome?.message}
            />

            <Input
              name="email"
              control={control}
              label="Email"
              placeholder="Digite seu email"
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email?.message}
            />

            <Controller
              control={control}
              name="dataNascimento"
              render={({ field: { onChange, value } }) => (
                <Input
                  name="dataNascimento"
                  control={control}
                  label="Data de nascimento"
                  placeholder="DD/MM/AAAA"
                  keyboardType="numeric"
                  value={value}
                  onChangeText={(text) => onChange(formatarData(text))}
                  error={errors.dataNascimento?.message}
                />
              )}
            />

            <View className="mb-4">
              <Text className="text-pink-800 font-semibold mb-3 text-base">
                Sexo
              </Text>
              <View className="flex-row space-x-3">
                {["M", "F", "O"].map((option) => (
                  <TouchableOpacity
                    key={option}
                    onPress={() => setValue("sexo", option as any)}
                    className={`flex-1 flex-row items-center justify-center p-4 rounded-xl border-2 ${
                      sexoValue === option
                        ? "bg-white border-pink-500"
                        : "bg-white border-pink-200"
                    }`}
                  >
                    <View
                      className={`w-5 h-5 rounded-full border-2 border-pink-500 items-center justify-center mr-2`}
                    >
                      {sexoValue === option && (
                        <View className="w-2.5 h-2.5 rounded-full bg-pink-500" />
                      )}
                    </View>
                    <Text className="text-pink-800 font-medium">
                      {option === "M"
                        ? "Masc"
                        : option === "F"
                          ? "Fem"
                          : "Outro"}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              {errors.sexo && (
                <Text className="text-red-500 text-sm mt-1">
                  {errors.sexo.message}
                </Text>
              )}
            </View>

            <Controller
              control={control}
              name="dataDiagnostico"
              render={({ field: { onChange, value } }) => (
                <Input
                  name="dataDiagnostico"
                  control={control}
                  label="Data do diagnóstico"
                  placeholder="DD/MM/AAAA"
                  keyboardType="numeric"
                  value={value}
                  onChangeText={(text) => onChange(formatarData(text))}
                  error={errors.dataDiagnostico?.message}
                />
              )}
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

            <Input
              name="confirmarSenha"
              control={control}
              label="Confirmar senha"
              placeholder="Confirme sua senha"
              secureTextEntry
              autoCapitalize="none"
              error={errors.confirmarSenha?.message}
            />

            <View className="mt-8 space-y-4">
              <Button
                title="Criar conta"
                onPress={handleSubmit(handleRegister)}
                loading={carregando}
                size="lg"
              />

              <Button
                title="Já tem uma conta? Fazer login"
                onPress={() => router.back()}
                variant="text"
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
