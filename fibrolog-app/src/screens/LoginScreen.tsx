import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginFormData } from '../validation/schemas';
import { useAuth } from '../contexts/AuthContext';

interface LoginScreenProps {
  navigation?: any; // Will be properly typed when navigation is set up
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [loginError, setLoginError] = React.useState<string | null>(null);
  const { login } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur', // Validate on blur for better UX
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setLoginError(null);
    
    try {
      await login(data.email, data.password);
      // Success - navigation will be handled by the navigation setup
    } catch (error) {
      let errorMessage = 'Erro inesperado. Tente novamente.';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      setLoginError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoToRegister = () => {
    try {
      if (navigation) {
        navigation.navigate('Register');
      }
    } catch (error) {
      console.error('Navigation error:', error);
      // Fallback: Could show an error message or retry
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <View style={styles.formContainer}>
          <Text style={styles.title}>FibroLog</Text>
          <Text style={styles.subtitle}>Entre na sua conta</Text>

          {/* Login Error Message */}
          {loginError && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorMessage}>{loginError}</Text>
            </View>
          )}

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[styles.input, errors.email && styles.inputError]}
                  value={value}
                  onChangeText={(text) => {
                    onChange(text);
                    setLoginError(null); // Clear login error when user types
                  }}
                  onBlur={onBlur}
                  placeholder="Digite seu email"
                  placeholderTextColor="#999"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!isLoading}
                />
              )}
            />
            {errors.email && (
              <Text style={styles.errorText}>{errors.email.message}</Text>
            )}
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Senha</Text>
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[styles.input, errors.password && styles.inputError]}
                  value={value}
                  onChangeText={(text) => {
                    onChange(text);
                    setLoginError(null); // Clear login error when user types
                  }}
                  onBlur={onBlur}
                  placeholder="Digite sua senha"
                  placeholderTextColor="#999"
                  secureTextEntry
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!isLoading}
                />
              )}
            />
            {errors.password && (
              <Text style={styles.errorText}>{errors.password.message}</Text>
            )}
          </View>

          {/* Login Button */}
          <TouchableOpacity
            style={[
              styles.loginButton,
              (!isValid || isLoading) && styles.loginButtonDisabled,
            ]}
            onPress={handleSubmit(onSubmit)}
            disabled={!isValid || isLoading}
          >
            <Text style={styles.loginButtonText}>
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Text>
          </TouchableOpacity>

          {/* Register Button */}
          <TouchableOpacity
            style={styles.registerButton}
            onPress={handleGoToRegister}
            disabled={isLoading}
          >
            <Text style={styles.registerButtonText}>
              Não tem uma conta? Cadastre-se
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fdf2f9', // pink-50
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingBottom: 50,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#7d1e60', // pink-800
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#b5228a', // pink-600
    marginBottom: 48,
  },
  errorContainer: {
    backgroundColor: '#fef2f2', // error-50
    borderColor: '#fca5a5', // error-200
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 24,
  },
  errorMessage: {
    color: '#dc2626', // error-600
    fontSize: 14,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7d1e60', // pink-800
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#facfe9', // pink-200
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#7d1e60', // pink-800
  },
  inputError: {
    borderColor: '#ef4444', // error-500
  },
  errorText: {
    color: '#ef4444', // error-500
    fontSize: 14,
    marginTop: 4,
  },
  loginButton: {
    backgroundColor: '#D330AA', // pink-500
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  loginButtonDisabled: {
    backgroundColor: '#f7a9d7', // pink-300 for disabled state
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  registerButton: {
    marginTop: 24,
    alignItems: 'center',
  },
  registerButtonText: {
    color: '#b5228a', // pink-600
    fontSize: 16,
    fontWeight: '500',
  },
});