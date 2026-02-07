import { AuthProvider } from "@/contexts/auth-context";
import { LoadingScreen } from "@/src/components/LoadingScreen";
import { Carattere_400Regular, useFonts } from "@expo-google-fonts/carattere";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useState } from "react";
import Toast from "react-native-toast-message";
import "../global.css";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Carattere_400Regular,
  });

  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts, make any API calls you need to do here
        // We simulate a delay to show the brand loading screen
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setIsAppReady(true);
      }
    }

    prepare();
  }, []);

  useEffect(() => {
    if (fontsLoaded || fontError) {
      // Hide the native splash screen as soon as the fonts are loaded (or errored)
      // The JS LoadingScreen will then take over if isAppReady is still false
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  if (!isAppReady) {
    return <LoadingScreen />;
  }

  return (
    <AuthProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
        <Stack.Screen name="home" />
      </Stack>
      <Toast />
    </AuthProvider>
  );
}
