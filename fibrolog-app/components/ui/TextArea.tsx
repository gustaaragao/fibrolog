import React from 'react';
import { TextInput, Text, View } from 'react-native';
import { Controller, Control } from 'react-hook-form';

interface TextAreaProps {
  name: string;
  control: Control<any>;
  label: string;
  placeholder?: string;
  error?: string;
  numberOfLines?: number;
}

export default function TextArea({
  name,
  control,
  label,
  placeholder,
  error,
  numberOfLines = 4
}: TextAreaProps) {
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
            multiline={true}
            numberOfLines={numberOfLines}
            textAlignVertical="top"
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