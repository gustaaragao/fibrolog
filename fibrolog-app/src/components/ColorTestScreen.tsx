/**
 * ColorTestScreen - Test component for verifying color rendering across platforms
 * 
 * This component displays all theme colors to verify consistent rendering
 * on iOS, Android, and web platforms.
 * 
 * To use: Add this to your app temporarily to test colors on each platform.
 */

import React from 'react';
import { View, Text, ScrollView, Platform } from 'react-native';

interface ColorSwatchProps {
  name: string;
  color: string;
  textColor?: string;
}

const ColorSwatch: React.FC<ColorSwatchProps> = ({ name, color, textColor = '#000' }) => {
  return (
    <View className="m-1 p-2 rounded-lg border border-neutral-300" style={{ backgroundColor: color }}>
      <Text style={{ color: textColor }} className="text-xs font-medium">
        {name}
      </Text>
      <Text style={{ color: textColor }} className="text-xs opacity-80">
        {color}
      </Text>
    </View>
  );
};

export const ColorTestScreen: React.FC = () => {
  const pinkShades = [
    { name: 'pink-50', color: '#fdf2f9', textColor: '#641c4d' },
    { name: 'pink-100', color: '#fce7f5', textColor: '#641c4d' },
    { name: 'pink-200', color: '#facfe9', textColor: '#641c4d' },
    { name: 'pink-300', color: '#f7a9d7', textColor: '#641c4d' },
    { name: 'pink-400', color: '#f176bf', textColor: '#ffffff' },
    { name: 'pink-500', color: '#D330AA', textColor: '#ffffff' },
    { name: 'pink-600', color: '#b5228a', textColor: '#ffffff' },
    { name: 'pink-700', color: '#961f73', textColor: '#ffffff' },
    { name: 'pink-800', color: '#7d1e60', textColor: '#ffffff' },
    { name: 'pink-900', color: '#641c4d', textColor: '#ffffff' },
  ];

  const stateColors = [
    { name: 'success', color: '#22c55e', textColor: '#ffffff' },
    { name: 'warning', color: '#f59e0b', textColor: '#000000' },
    { name: 'error', color: '#ef4444', textColor: '#ffffff' },
  ];

  const neutralColors = [
    { name: 'neutral-100', color: '#f4f4f5', textColor: '#27272a' },
    { name: 'neutral-300', color: '#d4d4d8', textColor: '#27272a' },
    { name: 'neutral-500', color: '#71717a', textColor: '#ffffff' },
    { name: 'neutral-700', color: '#3f3f46', textColor: '#ffffff' },
    { name: 'neutral-900', color: '#18181b', textColor: '#ffffff' },
  ];

  return (
    <ScrollView className="flex-1 bg-white p-4">
      <View className="mb-6">
        <Text className="text-2xl font-bold text-neutral-900 mb-2">
          Color Test - {Platform.OS}
        </Text>
        <Text className="text-neutral-600">
          Testing pink theme colors on {Platform.OS} platform
        </Text>
      </View>

      {/* Pink Shades */}
      <View className="mb-6">
        <Text className="text-lg font-semibold text-neutral-900 mb-3">Pink Palette</Text>
        <View className="flex-row flex-wrap">
          {pinkShades.map((shade) => (
            <ColorSwatch
              key={shade.name}
              name={shade.name}
              color={shade.color}
              textColor={shade.textColor}
            />
          ))}
        </View>
      </View>

      {/* State Colors */}
      <View className="mb-6">
        <Text className="text-lg font-semibold text-neutral-900 mb-3">State Colors</Text>
        <View className="flex-row flex-wrap">
          {stateColors.map((color) => (
            <ColorSwatch
              key={color.name}
              name={color.name}
              color={color.color}
              textColor={color.textColor}
            />
          ))}
        </View>
      </View>

      {/* Neutral Colors */}
      <View className="mb-6">
        <Text className="text-lg font-semibold text-neutral-900 mb-3">Neutral Colors</Text>
        <View className="flex-row flex-wrap">
          {neutralColors.map((color) => (
            <ColorSwatch
              key={color.name}
              name={color.name}
              color={color.color}
              textColor={color.textColor}
            />
          ))}
        </View>
      </View>

      {/* Usage Examples */}
      <View className="mb-6">
        <Text className="text-lg font-semibold text-neutral-900 mb-3">Usage Examples</Text>
        
        {/* Primary Button */}
        <View className="bg-pink-500 p-4 rounded-lg mb-3">
          <Text className="text-white font-semibold text-center">Primary Button</Text>
        </View>

        {/* Secondary Button */}
        <View className="bg-pink-100 border border-pink-300 p-4 rounded-lg mb-3">
          <Text className="text-pink-700 font-semibold text-center">Secondary Button</Text>
        </View>

        {/* Input Field */}
        <View className="border border-pink-300 p-4 rounded-lg mb-3 bg-white">
          <Text className="text-neutral-700">Input field with pink border</Text>
        </View>

        {/* Success Message */}
        <View className="bg-success-50 border border-success-200 p-4 rounded-lg mb-3">
          <Text className="text-success-800">Success message example</Text>
        </View>

        {/* Error Message */}
        <View className="bg-error-50 border border-error-200 p-4 rounded-lg mb-3">
          <Text className="text-error-800">Error message example</Text>
        </View>
      </View>

      <View className="mb-8">
        <Text className="text-sm text-neutral-500 text-center">
          Platform: {Platform.OS} • {Platform.Version}
        </Text>
      </View>
    </ScrollView>
  );
};

export default ColorTestScreen;