import { StyleSheet, View, Text, Pressable } from 'react-native';

import { useAuth } from '@/contexts/auth-context';

export default function LogoutScreen() {
  const { signOut } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.texto}>Sair da conta</Text>
      <Pressable style={styles.botao} onPress={signOut}>
        <Text style={styles.botaoTexto}>Encerrar sessao</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  texto: {
    fontSize: 18,
    marginBottom: 16,
  },
  botao: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 999,
  },
  botaoTexto: {
    fontSize: 16,
    fontWeight: '600',
  },
});
