# Component Documentation - Purple Theme Implementation

## Overview
This document provides updated component documentation reflecting the new purple theme implementation. All components have been migrated to use the consistent purple color palette while maintaining their core functionality.

## Authentication Components

### LoginScreen (`src/screens/LoginScreen.tsx`)
**Purpose**: User authentication interface with purple branding

**Theme Updates**:
- Background: purple-50 (#faf5ff) 
- Title: purple-800 (#6b21a8)
- Subtitle: purple-600 (#9333ea)
- Input borders: purple-200 (#e9d5ff)
- Primary button: purple-500 (#a855f7)
- Disabled state: purple-300 (#d8b4fe)

**Usage**:
```typescript
import LoginScreen from '@/screens/LoginScreen';

// Used by navigation system
<Stack.Screen name="Login" component={LoginScreen} />
```

### RegisterScreen (`src/screens/RegisterScreen.tsx`)  
**Purpose**: User registration interface with modern purple styling

**Theme Updates**:
- Uses NativeWind classes for purple theming
- Error states: error-50, error-200, error-700
- Success states: success-50, success-200, success-700
- Form styling: purple-200 borders, purple-500 focus
- Text: purple-800 for labels, purple-600 for secondary

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
**Purpose**: Main navigation stack with purple theming

**Theme Updates**:
- Header styling supports purple theme
- Stack navigation includes RegisterScreen
- Proper TypeScript navigation typing

**Usage**:
```typescript
import AppNavigator from '@/navigation/AppNavigator';

// Root navigation component
<AppNavigator />
```

### TabLayout (`app/(tabs)/_layout.tsx`)
**Purpose**: Tab navigation with purple color scheme

**Theme Updates**:
- Active tint: purple-500 (#a855f7)
- Inactive tint: purple-600 (#9333ea)  
- Tab bar background: purple-50 (#faf5ff)
- Border color: purple-200 (#e9d5ff)

## UI Components

### LoadingScreen (`src/components/LoadingScreen.tsx`)
**Purpose**: Loading state indicator with purple branding

**Theme Implementation**:
```typescript
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#faf5ff', // purple-50
  },
  loadingText: {
    color: '#9333ea', // purple-600
  },
});

// ActivityIndicator color
<ActivityIndicator size="large" color="#a855f7" />
```

### ErrorBoundary (`src/components/ErrorBoundary.tsx`)
**Purpose**: Error boundary with purple themed error display

**Theme Implementation**:
```typescript
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#faf5ff', // purple-50
  },
  title: {
    color: '#6b21a8', // purple-800
  },
  message: {
    color: '#9333ea', // purple-600
  },
  button: {
    backgroundColor: '#a855f7', // purple-500
  },
});
```

### Button Components (`components/ui/Button.tsx`)
**Purpose**: Reusable button component with purple variants

**Theme Variants**:
- **Primary**: purple-500 background, white text
- **Secondary**: purple-100 background, purple-800 text
- **Outline**: transparent background, purple-500 border
- **Disabled**: purple-300 background, reduced opacity

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
- Default border: purple-200 (#e9d5ff)
- Focus border: purple-500 (#a855f7)
- Error border: error-400 (#f87171)
- Background: white (#ffffff)
- Text color: purple-800 (#6b21a8)

### Form Labels
**Theme Styling**:
- Primary labels: purple-800 (#6b21a8)
- Secondary labels: purple-600 (#9333ea)
- Error labels: error-700 (#b91c1c)

### Validation Messages
**Theme Styling**:
- Error messages: error-700 on error-50 background
- Success messages: success-700 on success-50 background

## Layout Components

### HomeScreen (`src/screens/HomeScreen.tsx`)
**Purpose**: Main application screen with purple theming

**Theme Updates**:
- Background: purple-50 (#faf5ff)
- Header border: purple-200 (#e9d5ff)
- Title: purple-800 (#6b21a8)
- User info: purple-600 (#9333ea)
- Logout button: error-500 (#ef4444)

## Context Components  

### AuthProvider (`src/contexts/AuthProvider.tsx`)
**Purpose**: Authentication state management (no visual changes)

**Notes**: 
- No theme changes required (logic only)
- Maintains all existing functionality
- Purple theme applied at screen level

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
  purple: { /* 50-950 shades */ },
  primary: { /* semantic purple mapping */ },
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
**Purple Color Extensions**:
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
        purple: {
          50: '#faf5ff',
          // ... full palette
        },
        primary: {
          // Maps to purple
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
1. **Primary Actions**: Use purple-500 (#a855f7)
2. **Text Hierarchy**: purple-800 for primary, purple-600 for secondary
3. **Backgrounds**: purple-50 for main, white for cards
4. **Interactive States**: purple-600 hover, purple-700 pressed
5. **Error States**: error palette (red tones)
6. **Success States**: success palette (green tones)

### Accessibility Requirements
- **Minimum contrast**: 4.5:1 for normal text
- **Large text contrast**: 3:1 for 18pt+ or 14pt+ bold
- **Focus indicators**: High contrast purple borders
- **Color independence**: Don't rely on color alone

### Migration Guidelines
1. **StyleSheet Migration**: Replace hardcoded colors with theme constants
2. **NativeWind Usage**: Use semantic class names (purple-500 vs #a855f7)  
3. **Consistency**: Follow established patterns for new components
4. **Testing**: Verify WCAG compliance for new color combinations

## Component Checklist

### ✅ Purple Theme Implementation Complete
- [x] LoginScreen - StyleSheet with purple colors
- [x] RegisterScreen - NativeWind classes
- [x] HomeScreen - StyleSheet with purple colors  
- [x] LoadingScreen - Purple activity indicator
- [x] ErrorBoundary - Purple error display
- [x] Navigation - Purple tab bar theming
- [x] Form Components - Purple focus/error states
- [x] Button Components - Purple variants

### 🔧 Maintenance Requirements
1. **New Components**: Must follow purple theme guidelines
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

This documentation serves as the definitive guide for maintaining and extending the purple theme implementation across all FibroLog components.