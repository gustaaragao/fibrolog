import { useState } from 'react';
import { StyleSheet, View, Text, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

import { useAuth } from '@/contexts/auth-context';
import { CampoTexto } from '@/components/ui/text-input';
import { BotaoPrimario } from '@/components/ui/primary-button';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [erroEmail, setErroEmail] = useState<string | null>(null);
  const [erroSenha, setErroSenha] = useState<string | null>(null);

  const { signIn } = useAuth();
  const router = useRouter();

  const camposPreenchidos = email.trim().length > 0 && senha.trim().length > 0;
  const podeEnviar = camposPreenchidos && !carregando;

  async function handleLogin() {
    if (!camposPreenchidos) {
      setErroEmail(email.trim().length === 0 ? 'Informe seu email' : null);
      setErroSenha(senha.trim().length === 0 ? 'Informe sua senha' : null);
      return;
    }

    setErroEmail(null);
    setErroSenha(null);

    setErro(null);
    setCarregando(true);

    try {
      await signIn({ email, senha });
    } catch (erroLogin) {
      const mensagem =
        erroLogin instanceof Error && erroLogin.message
          ? erroLogin.message
          : 'Nao foi possivel realizar o login. Tente novamente.';
      setErro(mensagem);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.content}>
        <Text style={styles.titulo}>Entrar no FibroLog</Text>

        {erro && <Text style={styles.erro}>{erro}</Text>}

        <CampoTexto
          label="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          placeholder="seuemail@exemplo.com"
          returnKeyType="next"
          mensagemErro={erroEmail}
        />

        <CampoTexto
          label="Senha"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
          placeholder="Digite sua senha"
          returnKeyType="done"
          mensagemErro={erroSenha}
        />

        <BotaoPrimario
          titulo={carregando ? 'Entrando...' : 'Entrar'}
          carregando={carregando}
          onPress={handleLogin}
          disabled={!podeEnviar}
        />

        <TouchableOpacity 
          style={styles.linkCadastro}
          onPress={() => router.push('/(auth)/signup')}
          disabled={carregando}>
          <Text style={styles.textoLink}>
            Não tem conta? <Text style={styles.textoLinkDestaque}>Cadastre-se</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  titulo: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 24,
  },
  erro: {
    color: 'red',
    marginBottom: 16,
    fontSize: 14,
  },
  linkCadastro: {
    marginTop: 24,
    alignItems: 'center',
  },
  textoLink: {
    fontSize: 14,
    color: '#666',
  },
  textoLinkDestaque: {
    color: '#007AFF',
    fontWeight: '600',
  },
});
