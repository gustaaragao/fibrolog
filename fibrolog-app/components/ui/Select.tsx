import React from 'react';
import { Text, View, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Controller, Control } from 'react-hook-form';

interface SelectProps {
  name: string;
  control: Control<any>;
  label: string;
  placeholder?: string;
  error?: string;
  options: { label: string; value: string }[];
}

export default function Select({
  name,
  control,
  label,
  placeholder = "Selecione uma opção",
  error,
  options
}: SelectProps) {
  return (
    <View className="mb-4">
      <Text className="text-gray-700 font-medium mb-2 text-base">
        {label}
      </Text>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value } }) => (
          <View 
            className={`
              border-2 rounded-lg
              ${error ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'}
              ${Platform.OS === 'ios' ? 'h-12' : 'h-12'}
            `}
          >
            <Picker
              selectedValue={value}
              onValueChange={onChange}
              style={{
                height: Platform.OS === 'ios' ? 180 : 50,
                color: value ? '#111827' : '#9CA3AF'
              }}
            >
              <Picker.Item 
                label={placeholder} 
                value="" 
                color="#9CA3AF"
                enabled={false}
              />
              {options.map((option) => (
                <Picker.Item
                  key={option.value}
                  label={option.label}
                  value={option.value}
                  color="#111827"
                />
              ))}
            </Picker>
          </View>
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