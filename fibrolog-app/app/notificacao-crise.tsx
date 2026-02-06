import { View, Text, Button, Alert } from 'react-native';

export default function NotificacaoCrise() {

  function confirmarEnvio() {
    Alert.alert(
      'Confirmar envio',
      'Deseja notificar sua rede de apoio sobre esta crise?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Enviar',
          onPress: enviarNotificacao,
        },
      ]
    );
  }

  function enviarNotificacao() {
    // Mock de envio da notificacao
    Alert.alert(
      'Notificação enviada',
      'Sua rede de apoio foi notificada com sucesso.'
    );
  }

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold' }}>
        Notificar Rede de Apoio
      </Text>

      <Text style={{ marginVertical: 16 }}>
        Ao confirmar, uma notificação será enviada para sua
        rede de apoio informando que você está passando por
        uma crise.
      </Text>

      <Button
        title="Enviar notificação"
        onPress={confirmarEnvio}
      />
    </View>
  );
}
