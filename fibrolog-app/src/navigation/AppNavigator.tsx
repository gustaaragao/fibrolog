import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { LoginScreen } from '../screens/LoginScreen';
import { RegisterScreen } from '../screens/RegisterScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { LoadingScreen } from '../components/LoadingScreen';

// Define the navigation parameter types
export type RootStackParamList = {
  Loading: undefined;
  Login: undefined;
  Register: undefined;
  Home: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

interface AppNavigatorProps {
  isAuthenticated: boolean;
  isLoading: boolean;
}

export const AppNavigator: React.FC<AppNavigatorProps> = ({ isAuthenticated, isLoading }) => {
  return (
    <Stack.Navigator 
      screenOptions={{ 
        headerShown: false,
        // Disable gestures to prevent going back between auth states
        gestureEnabled: false,
      }}
      // Reset navigation state when auth changes to prevent back navigation
      key={isLoading ? 'loading' : isAuthenticated ? 'authenticated' : 'unauthenticated'}
    >
      {isLoading ? (
        // Loading state while checking authentication
        <Stack.Screen name="Loading" component={LoadingScreen} />
      ) : isAuthenticated ? (
        // Authenticated stack
        <Stack.Screen name="Home" component={HomeScreen} />
      ) : (
        // Unauthenticated stack  
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};