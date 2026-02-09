import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registrationSchema, RegistrationFormData } from '../validation/schemas';
import { useAuth } from '../contexts/AuthContext';

interface RegisterScreenProps {
  navigation?: any; // Will be properly typed when navigation is set up
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [registrationError, setRegistrationError] = React.useState<string | null>(null);
  const [registrationSuccess, setRegistrationSuccess] = React.useState(false);
  const { register } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    mode: 'onBlur',
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: RegistrationFormData) => {
    setIsLoading(true);
    setRegistrationError(null);
    setRegistrationSuccess(false);
    
    try {
      await register(data.name, data.email, data.password);
      setRegistrationSuccess(true);
      // Brief success feedback before navigation (handled by AuthContext)
      setTimeout(() => {
        // Navigation will happen automatically via AuthContext
      }, 1000);
    } catch (error) {
      let errorMessage = 'Erro inesperado. Tente novamente.';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      setRegistrationError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    try {
      if (navigation) {
        navigation.navigate('Login');
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
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.formContainer}>
            <Text style={styles.title}>FibroLog</Text>
            <Text style={styles.subtitle}>Criar nova conta</Text>

            {/* Registration Error Message */}
            {registrationError && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorMessage}>{registrationError}</Text>
              </View>
            )}

            {/* Registration Success Message */}
            {registrationSuccess && (
              <View style={styles.successContainer}>
                <Text style={styles.successMessage}>
                  Conta criada com sucesso! Redirecionando...
                </Text>
              </View>
            )}

            {/* Name Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Nome completo</Text>
              <Controller
                control={control}
                name="name"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[styles.input, errors.name && styles.inputError]}
                    value={value}
                    onChangeText={(text) => {
                      onChange(text);
                      setRegistrationError(null);
                    }}
                    onBlur={onBlur}
                    placeholder="Digite seu nome completo"
                    placeholderTextColor="#999"
                    autoCapitalize="words"
                    autoCorrect={false}
                    editable={!isLoading}
                  />
                )}
              />
              {errors.name && (
                <Text style={styles.errorText}>{errors.name.message}</Text>
              )}
            </View>

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
                      setRegistrationError(null);
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
                      setRegistrationError(null);
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

            {/* Confirm Password Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Confirmar senha</Text>
              <Controller
                control={control}
                name="confirmPassword"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[styles.input, errors.confirmPassword && styles.inputError]}
                    value={value}
                    onChangeText={(text) => {
                      onChange(text);
                      setRegistrationError(null);
                    }}
                    onBlur={onBlur}
                    placeholder="Confirme sua senha"
                    placeholderTextColor="#999"
                    secureTextEntry
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={!isLoading}
                  />
                )}
              />
              {errors.confirmPassword && (
                <Text style={styles.errorText}>{errors.confirmPassword.message}</Text>
              )}
            </View>

            {/* Register Button */}
            <TouchableOpacity
              style={[
                styles.registerButton,
                (!isValid || isLoading) && styles.registerButtonDisabled,
              ]}
              onPress={handleSubmit(onSubmit)}
              disabled={!isValid || isLoading}
            >
              <Text style={styles.registerButtonText}>
                {isLoading ? 'Criando conta...' : 'Criar conta'}
              </Text>
            </TouchableOpacity>

            {/* Back to Login Button */}
            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleBackToLogin}
              disabled={isLoading}
            >
              <Text style={styles.loginButtonText}>
                Já tem uma conta? Fazer login
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
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
  scrollContainer: {
    flexGrow: 1,
    minHeight: '100%',
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 50,
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
  successContainer: {
    backgroundColor: '#f0fdf4', // success-50
    borderColor: '#bbf7d0', // success-200
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 24,
  },
  successMessage: {
    color: '#15803d', // success-700
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
  registerButton: {
    backgroundColor: '#D330AA', // pink-500
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  registerButtonDisabled: {
    backgroundColor: '#f7a9d7', // pink-300 for disabled state
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loginButton: {
    marginTop: 24,
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#b5228a', // pink-600
    fontSize: 16,
    fontWeight: '500',
  },
});

export default RegisterScreen;