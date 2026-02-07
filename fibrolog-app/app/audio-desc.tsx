import { View, Text, StyleSheet } from 'react-native'; import { Stack } from 'expo-router';

export default function Screen() {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'audio-desc', headerShown: true }} />
      <Text style={styles.text}>Bem vindo a página audio-desc</Text>
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
