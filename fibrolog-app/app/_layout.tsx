import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { AuthProvider, useAuth } from '@/contexts/auth-context';

export const unstable_settings = {
  anchor: '(auth)',
};

function RootNavigation() {
  const { usuario, carregandoSessao } = useAuth();

  if (carregandoSessao) {
    return null;
  }

  const usuarioAutenticado = !!usuario;

  return (
    <Stack>
      {!usuarioAutenticado && <Stack.Screen name="(auth)" options={{ headerShown: false }} />}
      {usuarioAutenticado && <Stack.Screen name="(tabs)" options={{ headerShown: false }} />}
    </Stack>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <RootNavigation />
      </AuthProvider>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
