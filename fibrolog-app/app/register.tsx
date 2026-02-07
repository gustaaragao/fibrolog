import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

export default function RegisterScreen() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [sexo, setSexo] = useState("");
  const [dataDiagnostico, setDataDiagnostico] = useState("");
  const [carregando, setCarregando] = useState(false);
  const { signUp } = useAuth();
  const router = useRouter();

  // Função para formatar data enquanto digita (DD/MM/AAAA)
  const formatarData = (texto: string) => {
    // Remove tudo que não é número
    const numeros = texto.replace(/\D/g, "");
    
    // Aplica a máscara
    if (numeros.length <= 2) {
      return numeros;
    } else if (numeros.length <= 4) {
      return `${numeros.slice(0, 2)}/${numeros.slice(2)}`;
    } else {
      return `${numeros.slice(0, 2)}/${numeros.slice(2, 4)}/${numeros.slice(4, 8)}`;
    }
  };

  // Converter DD/MM/AAAA para ISO
  const converterParaISO = (dataFormatada: string): string => {
    const [dia, mes, ano] = dataFormatada.split("/");
    return new Date(`${ano}-${mes}-${dia}`).toISOString();
  };

  const handleRegister = async () => {
    if (!nome || !email || !senha || !confirmarSenha || !dataNascimento || !sexo || !dataDiagnostico) {
      Toast.show({
        type: "error",
        text1: "Erro",
        text2: "Por favor, preencha todos os campos",
      });
      return;
    }

    if (dataNascimento.length !== 10 || dataDiagnostico.length !== 10) {
      Toast.show({
        type: "error",
        text1: "Erro",
        text2: "As datas devem estar no formato DD/MM/AAAA",
      });
      return;
    }

    if (senha !== confirmarSenha) {
      Toast.show({
        type: "error",
        text1: "Erro",
        text2: "As senhas não coincidem",
      });
      return;
    }

    if (senha.length < 6) {
      Toast.show({
        type: "error",
        text1: "Erro",
        text2: "A senha deve ter pelo menos 6 caracteres",
      });
      return;
    }

    setCarregando(true);
    try {
      await signUp({ 
        nome, 
        email, 
        senha,
        data_nascimento: converterParaISO(dataNascimento),
        sexo,
        data_diagnostico: converterParaISO(dataDiagnostico)
      });
      
      Toast.show({
        type: "success",
        text1: "Sucesso!",
        text2: "Cadastro realizado com sucesso",
      });
      
      // Redirecionar após pequeno delay para mostrar o toast
      setTimeout(() => {
        router.replace("/home");
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
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Text style={styles.titulo}>Criar Conta</Text>
          <Text style={styles.subtitulo}>Cadastre-se no FibroLog</Text>

          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Nome completo</Text>
              <TextInput
                style={styles.input}
                placeholder="Nome completo"
                placeholderTextColor="#999"
                value={nome}
                onChangeText={setNome}
                autoCapitalize="words"
                editable={!carregando}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!carregando}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Data de nascimento</Text>
              <TextInput
                style={styles.input}
                placeholder="DD/MM/AAAA"
                placeholderTextColor="#999"
                value={dataNascimento}
                onChangeText={(texto) => setDataNascimento(formatarData(texto))}
                keyboardType="numeric"
                maxLength={10}
                editable={!carregando}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Sexo</Text>
              <View style={styles.radioGroup}>
                <TouchableOpacity
                  style={styles.radioButton}
                  onPress={() => setSexo("M")}
                  disabled={carregando}
                >
                  <View style={styles.radioCircle}>
                    {sexo === "M" && <View style={styles.radioChecked} />}
                  </View>
                  <Text style={styles.radioLabel}>Masculino</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.radioButton}
                  onPress={() => setSexo("F")}
                  disabled={carregando}
                >
                  <View style={styles.radioCircle}>
                    {sexo === "F" && <View style={styles.radioChecked} />}
                  </View>
                  <Text style={styles.radioLabel}>Feminino</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.radioButton}
                  onPress={() => setSexo("O")}
                  disabled={carregando}
                >
                  <View style={styles.radioCircle}>
                    {sexo === "O" && <View style={styles.radioChecked} />}
                  </View>
                  <Text style={styles.radioLabel}>Outro</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Data do diagnóstico</Text>
              <TextInput
                style={styles.input}
                placeholder="DD/MM/AAAA"
                placeholderTextColor="#999"
                value={dataDiagnostico}
                onChangeText={(texto) => setDataDiagnostico(formatarData(texto))}
                keyboardType="numeric"
                maxLength={10}
                editable={!carregando}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Senha</Text>
              <TextInput
                style={styles.input}
                placeholder="Senha"
                placeholderTextColor="#999"
                value={senha}
                onChangeText={setSenha}
                secureTextEntry
                editable={!carregando}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Confirmar senha</Text>
              <TextInput
                style={styles.input}
                placeholder="Confirmar senha"
                placeholderTextColor="#999"
                value={confirmarSenha}
                onChangeText={setConfirmarSenha}
                secureTextEntry
                editable={!carregando}
              />
            </View>

            <TouchableOpacity
              style={[styles.botao, carregando && styles.botaoDesabilitado]}
              onPress={handleRegister}
              disabled={carregando}
            >
              {carregando ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.textoBotao}>Cadastrar</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.botaoVoltar}
              onPress={() => router.back()}
              disabled={carregando}
            >
              <Text style={styles.textoVoltar}>
                Já tem uma conta? Faça login
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  // Container e layout
  container: {
    flex: 1,
    backgroundColor: "#fdf2f9", // pink-50
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  formContainer: {
    width: "100%",
    maxWidth: 400,
    paddingBottom: 50,
  },
  // Texto
  titulo: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#7d1e60", // pink-800
    marginBottom: 8,
  },
  subtitulo: {
    fontSize: 16,
    color: "#b5228a", // pink-600
    marginBottom: 48,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#7d1e60", // pink-800
    marginBottom: 8,
  },
  // Inputs
  inputContainer: {
    marginBottom: 24,
  },
  input: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#facfe9", // pink-200
    color: "#7d1e60", // pink-800
  },
  // Radio buttons
  radioGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  radioButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#facfe9", // pink-200
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#D330AA", // pink-500
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  radioChecked: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#D330AA", // pink-500
  },
  radioLabel: {
    fontSize: 14,
    color: "#7d1e60", // pink-800
    fontWeight: "500",
  },
  // Botões
  botao: {
    backgroundColor: "#D330AA", // pink-500
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  botaoDesabilitado: {
    backgroundColor: "#f7a9d7", // pink-300
  },
  textoBotao: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  botaoVoltar: {
    marginTop: 24,
    alignItems: "center",
  },
  textoVoltar: {
    color: "#b5228a", // pink-600
    fontSize: 16,
    fontWeight: "500",
  },
});
