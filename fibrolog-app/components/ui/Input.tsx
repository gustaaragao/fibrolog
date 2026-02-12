import React from "react";
import { Control, Controller } from "react-hook-form";
import { KeyboardTypeOptions, Text, TextInput, View } from "react-native";

interface InputProps {
  name?: string;
  control?: Control<any>;
  label: string;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  error?: string;
  value?: string;
  onChangeText?: (text: string) => void;
}

export default function Input({
  name,
  control,
  label,
  placeholder,
  secureTextEntry = false,
  keyboardType = "default",
  autoCapitalize = "sentences",
  error,
  value,
  onChangeText,
}: InputProps) {
  const renderTextInput = (fieldValue?: string, fieldOnChange?: (text: string) => void, onBlur?: () => void) => (
    <TextInput
      className={[
        "border-2 rounded-lg px-4 py-3 text-base",
        error ? "border-red-500 bg-red-50" : "border-pink-200 bg-white",
        "focus:border-pink-500",
      ].join(" ")}
      placeholder={placeholder}
      onBlur={onBlur}
      onChangeText={onChangeText || fieldOnChange}
      value={value !== undefined ? value : fieldValue}
      secureTextEntry={secureTextEntry}
      keyboardType={keyboardType}
      autoCapitalize={autoCapitalize}
      placeholderTextColor="#9CA3AF"
    />
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
          render={({ field: { onChange, onBlur, value: fieldValue } }) => 
            renderTextInput(fieldValue, onChange, onBlur)
          }
        />
      ) : (
        renderTextInput()
      )}
      {error && <Text className="text-red-500 text-sm mt-1">{error}</Text>}
    </View>
  );
}
