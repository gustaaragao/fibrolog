import { forwardRef } from 'react';
import { StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';

export type CampoTextoProps = TextInputProps & {
  label: string;
  mensagemErro?: string | null;
};

export const CampoTexto = forwardRef<TextInput, CampoTextoProps>(
  ({ label, mensagemErro, style, ...rest }, ref) => {
    return (
      <View style={styles.container}>
        <Text style={styles.label}>{label}</Text>
        <TextInput ref={ref} style={[styles.input, style]} {...rest} />
        {mensagemErro ? <Text style={styles.mensagemErro}>{mensagemErro}</Text> : null}
      </View>
    );
  },
);

CampoTexto.displayName = 'CampoTexto';

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  mensagemErro: {
    marginTop: 4,
    color: 'red',
    fontSize: 12,
  },
});
