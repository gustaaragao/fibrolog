# Component Documentation - Pink Theme Implementation

## Overview
This document provides updated component documentation reflecting the new pink theme implementation. All components have been migrated to use the consistent pink color palette while maintaining their core functionality.

## Authentication Components

### LoginScreen (`src/screens/LoginScreen.tsx`)
**Purpose**: User authentication interface with pink branding

**Theme Updates**:
- Background: pink-50 (#fdf2f9) 
- Title: pink-800 (#7d1e60)
- Subtitle: pink-600 (#b5228a)
- Input borders: pink-200 (#facfe9)
- Primary button: pink-500 (#D330AA)
- Disabled state: pink-300 (#f7a9d7)

**Usage**:
```typescript
import LoginScreen from '@/screens/LoginScreen';

// Used by navigation system
<Stack.Screen name="Login" component={LoginScreen} />
```

### RegisterScreen (`src/screens/RegisterScreen.tsx`)  
**Purpose**: User registration interface with modern pink styling

**Theme Updates**:
- Uses NativeWind classes for pink theming
- Error states: error-50, error-200, error-700
- Success states: success-50, success-200, success-700
- Form styling: pink-200 borders, pink-500 focus
- Text: pink-800 for labels, pink-600 for secondary

**Usage**:
```typescript
import { RegisterScreen } from '@/screens/RegisterScreen';

// Props interface
interface RegisterScreenProps {
  navigation?: any;
}
```

## Navigation Components

### AppNavigator (`src/navigation/AppNavigator.tsx`)
**Purpose**: Main navigation stack with pink theming

**Theme Updates**:
- Header styling supports pink theme
- Stack navigation includes RegisterScreen
- Proper TypeScript navigation typing

**Usage**:
```typescript
import AppNavigator from '@/navigation/AppNavigator';

// Root navigation component
<AppNavigator />
```

### TabLayout (`app/(tabs)/_layout.tsx`)
**Purpose**: Tab navigation with pink color scheme

**Theme Updates**:
- Active tint: pink-500 (#D330AA)
- Inactive tint: pink-600 (#b5228a)  
- Tab bar background: pink-50 (#fdf2f9)
- Border color: pink-200 (#facfe9)

## UI Components

### LoadingScreen (`src/components/LoadingScreen.tsx`)
**Purpose**: Loading state indicator with pink branding

**Theme Implementation**:
```typescript
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fdf2f9', // pink-50
  },
  loadingText: {
    color: '#b5228a', // pink-600
  },
});

// ActivityIndicator color
<ActivityIndicator size="large" color="#D330AA" />
```

### ErrorBoundary (`src/components/ErrorBoundary.tsx`)
**Purpose**: Error boundary with pink themed error display

**Theme Implementation**:
```typescript
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fdf2f9', // pink-50
  },
  title: {
    color: '#7d1e60', // pink-800
  },
  message: {
    color: '#b5228a', // pink-600
  },
  button: {
    backgroundColor: '#D330AA', // pink-500
  },
});
```

### Button Components (`components/ui/Button.tsx`)
**Purpose**: Reusable button component with pink variants

**Theme Variants**:
- **Primary**: pink-500 background, white text
- **Secondary**: pink-100 background, pink-800 text
- **Outline**: transparent background, pink-500 border
- **Disabled**: pink-300 background, reduced opacity

**Usage**:
```typescript
import { Button } from '@/components/ui/Button';

<Button variant="primary" onPress={handleSubmit}>
  Submit
</Button>
```

## Form Components

### Input Fields
**Theme Styling**:
- Default border: pink-200 (#facfe9)
- Focus border: pink-500 (#D330AA)
- Error border: error-400 (#f87171)
- Background: white (#ffffff)
- Text color: pink-800 (#7d1e60)

### Form Labels
**Theme Styling**:
- Primary labels: pink-800 (#7d1e60)
- Secondary labels: pink-600 (#b5228a)
- Error labels: error-700 (#b91c1c)

### Validation Messages
**Theme Styling**:
- Error messages: error-700 on error-50 background
- Success messages: success-700 on success-50 background

## Layout Components

### HomeScreen (`app/home.tsx`)
**Purpose**: Main application screen with pink theming and dashboard navigation

**Theme Updates**:
- Background: pink-50 (#fdf2f9)
- Header: Native stack header with pink-800 (#7d1e60) title and logout icon
- Welcome text: pink-900 (#4c1d95)
- Menu cards: white background, pink-900 text, pink-800 icons
- Icon container: pink-100 (#fce7f5) background

**Features**:
- Logout functionality in header with confirmation modal
- Grid layout for quick access to core features:
  - Registrar Sintoma
  - Registrar Crise
  - Lembrete
  - Histórico
  - Áudio Descrição
  - Gerar PDF
  - Informações
  - Rede de Apoio

### Mocked Screens (`app/*.tsx`)
**Purpose**: Placeholder screens for future feature implementation

**Files**:
- `symptoms.tsx`, `crisis.tsx`, `reminder.tsx`, `history.tsx`
- `audio-desc.tsx`, `pdf.tsx`, `info.tsx`, `support.tsx`

**Theme Implementation**:
- Background: pink-50 (#fdf2f9)
- Text: pink-800 (#7d1e60)
- Header: Enabled with title matching the feature

## Context Components  

### AuthProvider (`src/contexts/AuthProvider.tsx`)
**Purpose**: Authentication state management (no visual changes)

**Notes**: 
- No theme changes required (logic only)
- Maintains all existing functionality
- Pink theme applied at screen level

### AuthContext (`src/contexts/AuthContext.tsx`)
**Purpose**: Authentication context interface (no visual changes)

**Notes**:
- Interface unchanged
- Theme styling handled by consuming components

## Theme System Components

### Theme Constants (`src/constants/theme.ts`)
**Purpose**: Centralized color definitions and accessibility documentation

**Exports**:
```typescript
export const Colors = {
  pink: { /* 50-950 shades */ },
  primary: { /* semantic pink mapping */ },
  secondary: { /* blue-gray palette */ },
  neutral: { /* gray palette */ },
  success: { /* green palette */ },
  warning: { /* orange palette */ },
  error: { /* red palette */ },
};

export const ThemeColors = {
  background: { /* semantic backgrounds */ },
  text: { /* semantic text colors */ },
  border: { /* semantic borders */ },
  interactive: { /* semantic interactive */ },
  status: { /* semantic status */ },
};
```

## NativeWind Integration

### Tailwind Configuration (`tailwind.config.js`)
**Pink Color Extensions**:
```javascript
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pink: {
          50: '#fdf2f9',
          // ... full palette
        },
        primary: {
          // Maps to pink
        },
        // ... semantic mappings
      },
    },
  },
};
```

### Babel Configuration (`babel.config.js`)
**NativeWind Plugin**:
```javascript
module.exports = {
  presets: ['babel-preset-expo'],
  plugins: ['nativewind/babel'],
};
```

## Best Practices

### Color Usage Guidelines
1. **Primary Actions**: Use pink-500 (#D330AA)
2. **Text Hierarchy**: pink-800 for primary, pink-600 for secondary
3. **Backgrounds**: pink-50 for main, white for cards
4. **Interactive States**: pink-600 hover, pink-700 pressed
5. **Error States**: error palette (red tones)
6. **Success States**: success palette (green tones)

### Accessibility Requirements
- **Minimum contrast**: 4.5:1 for normal text
- **Large text contrast**: 3:1 for 18pt+ or 14pt+ bold
- **Focus indicators**: High contrast pink borders
- **Color independence**: Don't rely on color alone

### Migration Guidelines
1. **StyleSheet Migration**: Replace hardcoded colors with theme constants
2. **NativeWind Usage**: Use semantic class names (pink-500 vs #D330AA)  
3. **Consistency**: Follow established patterns for new components
4. **Testing**: Verify WCAG compliance for new color combinations

## Component Checklist

### ✅ Pink Theme Implementation Complete
- [x] LoginScreen - StyleSheet with pink colors
- [x] RegisterScreen - NativeWind classes
- [x] HomeScreen - StyleSheet with pink colors  
- [x] LoadingScreen - Pink activity indicator
- [x] ErrorBoundary - Pink error display
- [x] Navigation - Pink tab bar theming
- [x] Form Components - Pink focus/error states
- [x] Button Components - Pink variants

### 🔧 Maintenance Requirements
1. **New Components**: Must follow pink theme guidelines
2. **Color Updates**: Update through theme constants file
3. **Accessibility**: Test contrast ratios for new combinations
4. **Documentation**: Update this file when adding themed components

## Troubleshooting

### Common Issues
1. **Colors not updating**: Check NativeWind compilation
2. **Inconsistent styling**: Verify theme constant usage
3. **Accessibility failures**: Use contrast checker tools
4. **Platform differences**: Test on iOS/Android/web

### Debug Tools
- WebAIM Contrast Checker for accessibility
- React Native Debugger for style inspection
- Expo Dev Tools for real-time testing

This documentation serves as the definitive guide for maintaining and extending the pink theme implementation across all FibroLog components.