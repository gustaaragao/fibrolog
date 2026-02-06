import { View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';

export default function Crise() {
  return (
    <View style={{ padding: 16 }}>

      <Text style={{ fontSize: 22, fontWeight: 'bold' }}>
        Crise!
      </Text>

      <View style={{ marginTop: 32 }}>

        <Pressable
          onPress={() => router.push('/notificacao-crise')}
          style={{ marginBottom: 24 }}
        >
          <Text>📞 Notificar</Text>
        </Pressable>

        <Pressable
          onPress={() => router.push('/registrar-crise')}
        >
          <Text>📝 Registrar</Text>
        </Pressable>

      </View>
    </View>
  );
}
