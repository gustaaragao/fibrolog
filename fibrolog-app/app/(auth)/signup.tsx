import { useState } from 'react';
import { StyleSheet, View, Text, KeyboardAvoidingView, Platform } from 'react-native';

import { useAuth } from '@/contexts/auth-context';
import { CampoTexto } from '@/components/ui/text-input';
import { BotaoPrimario } from '@/components/ui/primary-button';

export default function SignupScreen() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmacaoSenha, setConfirmacaoSenha] = useState('');
  const [erro, setErro] = useState<string | null>(null);
  const [erroConfirmacao, setErroConfirmacao] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  const { signUp } = useAuth();

  const camposPreenchidos =
    nome.trim().length > 0 &&
    email.trim().length > 0 &&
    senha.trim().length > 0 &&
    confirmacaoSenha.trim().length > 0;

  const senhasConferem = senha === confirmacaoSenha;

  const podeEnviar = camposPreenchidos && senhasConferem && !carregando;

  async function handleSignup() {
    setErro(null);

    if (!senhasConferem) {
      setErroConfirmacao('As senhas nao coincidem');
      return;
    }

    setErroConfirmacao(null);
    setCarregando(true);

    try {
      await signUp({ nome, email, senha });
    } catch (erroCadastro) {
      const mensagem =
        erroCadastro instanceof Error && erroCadastro.message
          ? erroCadastro.message
          : 'Nao foi possivel criar a conta. Verifique os dados informados.';
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
        <Text style={styles.titulo}>Criar conta</Text>

        {erro && <Text style={styles.erro}>{erro}</Text>}

        <CampoTexto
          label="Nome"
          value={nome}
          onChangeText={setNome}
          placeholder="Seu nome completo"
          returnKeyType="next"
        />

        <CampoTexto
          label="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          placeholder="seuemail@exemplo.com"
          returnKeyType="next"
        />

        <CampoTexto
          label="Senha"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
          placeholder="Crie uma senha"
          returnKeyType="next"
        />

        <CampoTexto
          label="Confirmar senha"
          value={confirmacaoSenha}
          onChangeText={setConfirmacaoSenha}
          secureTextEntry
          placeholder="Repita a senha"
          returnKeyType="done"
          mensagemErro={erroConfirmacao}
        />

        <BotaoPrimario
          titulo={carregando ? 'Criando conta...' : 'Criar conta'}
          carregando={carregando}
          onPress={handleSignup}
          disabled={!podeEnviar}
        />
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
});
