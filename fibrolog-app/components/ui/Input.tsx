import React from 'react';
import { TextInput, Text, View, KeyboardTypeOptions } from 'react-native';
import { Controller, Control } from 'react-hook-form';

interface InputProps {
  name: string;
  control: Control<any>;
  label: string;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  error?: string;
}

export default function Input({
  name,
  control,
  label,
  placeholder,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  error
}: InputProps) {
  return (
    <View className="mb-4">
      <Text className="text-gray-700 font-medium mb-2 text-base">
        {label}
      </Text>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            className={`
              border-2 rounded-lg px-4 py-3 text-base
              ${error ? 'border-red-500' : 'border-gray-300'}
              ${error ? 'bg-red-50' : 'bg-white'}
              focus:border-purple-600
            `}
            placeholder={placeholder}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            secureTextEntry={secureTextEntry}
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize}
            placeholderTextColor="#9CA3AF"
          />
        )}
      />
      {error && (
        <Text className="text-red-500 text-sm mt-1">
          {error}
        </Text>
      )}
    </View>
  );
}