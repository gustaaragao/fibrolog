import React, { useState } from 'react';
import { TouchableOpacity, Text, View, Platform } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Controller, Control } from 'react-hook-form';

interface DatePickerProps {
  name: string;
  control: Control<any>;
  label: string;
  placeholder?: string;
  error?: string;
  maximumDate?: Date;
  minimumDate?: Date;
}

export default function DatePicker({
  name,
  control,
  label,
  placeholder = "Selecione uma data",
  error,
  maximumDate,
  minimumDate
}: DatePickerProps) {
  const [showPicker, setShowPicker] = useState(false);

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <View className="mb-4">
      <Text className="text-gray-700 font-medium mb-2 text-base">
        {label}
      </Text>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value } }) => (
          <>
            <TouchableOpacity
              className={`
                border-2 rounded-lg px-4 py-3
                ${error ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'}
                focus:border-pink-600
              `}
              onPress={() => setShowPicker(true)}
            >
              <Text 
                className={`text-base ${
                  value ? 'text-gray-900' : 'text-gray-400'
                }`}
              >
                {value ? formatDate(new Date(value)) : placeholder}
              </Text>
            </TouchableOpacity>

            {showPicker && (
              <DateTimePicker
                value={value ? new Date(value) : new Date()}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                maximumDate={maximumDate}
                minimumDate={minimumDate}
                onChange={(event: DateTimePickerEvent, selectedDate?: Date) => {
                  setShowPicker(Platform.OS === 'ios');
                  if (selectedDate) {
                    onChange(selectedDate);
                  }
                }}
              />
            )}
          </>
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