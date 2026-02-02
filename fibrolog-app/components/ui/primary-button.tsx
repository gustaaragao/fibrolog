import { Pressable, StyleSheet, Text, type PressableProps, type ViewStyle } from 'react-native';

export type BotaoPrimarioProps = PressableProps & {
  titulo: string;
  carregando?: boolean;
};

export function BotaoPrimario({ titulo, carregando, style, disabled, ...rest }: BotaoPrimarioProps) {
  const isDisabled = disabled || carregando;

  return (
    <Pressable
      style={({ pressed }): ViewStyle => ({
        ...styles.botao,
        ...(isDisabled ? styles.botaoDesabilitado : {}),
        ...(!isDisabled && pressed ? styles.botaoPressionado : {}),
        ...(style as ViewStyle),
      })}
      disabled={isDisabled}
      {...rest}>
      <Text style={styles.texto}>{carregando ? 'Carregando...' : titulo}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  botao: {
    marginTop: 24,
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: 'center',
  },
  botaoDesabilitado: {
    opacity: 0.5,
  },
  botaoPressionado: {
    opacity: 0.9,
  },
  texto: {
    fontSize: 16,
    fontWeight: '600',
  },
});
