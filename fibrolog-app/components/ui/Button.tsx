import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = ''
}: ButtonProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return disabled || loading
          ? 'bg-purple-300'
          : 'bg-purple-600 active:bg-purple-700';
      case 'secondary':
        return disabled || loading
          ? 'bg-gray-300'
          : 'bg-gray-600 active:bg-gray-700';
      case 'outline':
        return disabled || loading
          ? 'bg-transparent border-2 border-purple-300'
          : 'bg-transparent border-2 border-purple-600 active:bg-purple-50';
      default:
        return 'bg-purple-600 active:bg-purple-700';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-2 rounded-md';
      case 'md':
        return 'px-4 py-3 rounded-lg';
      case 'lg':
        return 'px-6 py-4 rounded-lg';
      default:
        return 'px-4 py-3 rounded-lg';
    }
  };

  const getTextStyles = () => {
    const baseStyles = 'font-semibold text-center';
    const sizeStyles = size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-lg' : 'text-base';
    
    if (variant === 'outline') {
      const colorStyles = disabled || loading ? 'text-purple-300' : 'text-purple-600';
      return `${baseStyles} ${sizeStyles} ${colorStyles}`;
    } else {
      const colorStyles = disabled || loading ? 'text-white' : 'text-white';
      return `${baseStyles} ${sizeStyles} ${colorStyles}`;
    }
  };

  return (
    <TouchableOpacity
      className={`
        ${getVariantStyles()}
        ${getSizeStyles()}
        ${disabled || loading ? 'opacity-70' : ''}
        ${className}
      `.trim()}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={disabled || loading ? 1 : 0.7}
    >
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={variant === 'outline' ? '#9333ea' : '#ffffff'} 
        />
      ) : (
        <Text className={getTextStyles()}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}