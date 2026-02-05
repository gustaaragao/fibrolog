import React from 'react';
import { View, ScrollView } from 'react-native';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userRegistrationSchema, UserRegistrationData } from '../../lib/validation/userRegistration';
import Input from '../ui/Input';
import TextArea from '../ui/TextArea';
import DatePicker from '../ui/DatePicker';
import Select from '../ui/Select';
import Button from '../ui/Button';

interface UserRegistrationFormProps {
  onSubmit: (data: UserRegistrationData) => Promise<void>;
  loading?: boolean;
}

const genderOptions = [
  { label: 'Masculino', value: 'Masculino' },
  { label: 'Feminino', value: 'Feminino' },
  { label: 'Outro', value: 'Outro' },
  { label: 'Prefiro não informar', value: 'Prefiro não informar' },
];

export default function UserRegistrationForm({ onSubmit, loading = false }: UserRegistrationFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UserRegistrationData>({
    resolver: zodResolver(userRegistrationSchema),
    defaultValues: {
      nome: '',
      email: '',
      password: '',
      sexo: undefined,
      medicacoes: '',
    },
  });

  const handleFormSubmit = async (data: UserRegistrationData) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  return (
    <ScrollView className="flex-1">
      <View className="p-4">
        {/* Nome field */}
        <Input
          name="nome"
          control={control}
          label="Nome completo"
          placeholder="Digite seu nome completo"
          error={errors.nome?.message}
          autoCapitalize="words"
        />

        {/* Email field */}
        <Input
          name="email"
          control={control}
          label="Email"
          placeholder="exemplo@email.com"
          keyboardType="email-address"
          autoCapitalize="none"
          error={errors.email?.message}
        />

        {/* Password field */}
        <Input
          name="password"
          control={control}
          label="Senha"
          placeholder="Digite uma senha segura"
          secureTextEntry={true}
          autoCapitalize="none"
          error={errors.password?.message}
        />

        {/* Data de nascimento field */}
        <DatePicker
          name="data_nascimento"
          control={control}
          label="Data de nascimento"
          placeholder="Selecione sua data de nascimento"
          maximumDate={new Date()}
          error={errors.data_nascimento?.message}
        />

        {/* Sexo field */}
        <Select
          name="sexo"
          control={control}
          label="Sexo"
          placeholder="Selecione seu sexo"
          options={genderOptions}
          error={errors.sexo?.message}
        />

        {/* Data de diagnóstico field */}
        <DatePicker
          name="data_diagnostico"
          control={control}
          label="Data do diagnóstico"
          placeholder="Selecione a data do diagnóstico"
          maximumDate={new Date()}
          error={errors.data_diagnostico?.message}
        />

        {/* Medicações field */}
        <TextArea
          name="medicacoes"
          control={control}
          label="Medicações"
          placeholder="Liste suas medicações atuais, dosagens e frequência"
          numberOfLines={4}
          error={errors.medicacoes?.message}
        />

        {/* Submit button */}
        <View className="mt-6">
          <Button
            title="Cadastrar"
            onPress={handleSubmit(handleFormSubmit)}
            loading={isSubmitting || loading}
            disabled={isSubmitting || loading}
            variant="primary"
            size="lg"
            className="w-full"
          />
        </View>
      </View>
    </ScrollView>
  );
}