import React from 'react';
import { Text, View, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Controller, Control } from 'react-hook-form';

interface SelectProps {
  name?: string;
  control?: Control<any>;
  label: string;
  placeholder?: string;
  error?: string;
  options: { label: string; value: string }[];
  value?: string;
  onValueChange?: (value: string) => void;
}

export default function Select({
  name,
  control,
  label,
  placeholder = "Selecione uma opção",
  error,
  options,
  value,
  onValueChange
}: SelectProps) {
  const renderPicker = (fieldValue?: string, fieldOnChange?: (val: string) => void) => (
    <View 
      className={`
        border-2 rounded-lg
        ${error ? 'border-red-500 bg-red-50' : 'border-pink-200 bg-white'}
        ${Platform.OS === 'ios' ? 'h-12' : 'h-12'}
      `}
    >
      <Picker
        selectedValue={value !== undefined ? value : fieldValue}
        onValueChange={onValueChange || fieldOnChange}
        style={{
          height: Platform.OS === 'ios' ? 180 : 50,
          color: (value || fieldValue) ? '#111827' : '#9CA3AF'
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
  );

  return (
    <View className="mb-4">
      <Text className="text-pink-800 font-semibold mb-2 text-base">
        {label}
      </Text>
      {control && name ? (
        <Controller
          control={control}
          name={name}
          render={({ field: { onChange, value: fieldValue } }) => 
            renderPicker(fieldValue, onChange)
          }
        />
      ) : (
        renderPicker()
      )}
      {error && (
        <Text className="text-red-500 text-sm mt-1">
          {error}
        </Text>
      )}
    </View>
  );
}