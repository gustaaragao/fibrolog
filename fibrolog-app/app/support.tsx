import { View, Text, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';

export default function Screen() {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Rede de Apoio', headerShown: true }} />
      <Text style={styles.text}>Bem-vindo à página de Rede de Apoio</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fdf2f9',
  },
  text: {
    fontSize: 20,
    color: '#7d1e60',
  },
});
