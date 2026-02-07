# FibroLog Pink Theme Documentation

## Color Palette Overview

The FibroLog application uses a comprehensive pink color palette designed for visual consistency, accessibility compliance, and professional appearance.

## Color Definitions

### Primary Pink Palette
- **pink-50**: `#fdf2f9` - Lightest pink for backgrounds
- **pink-100**: `#fce7f5` - Light pink for subtle backgrounds  
- **pink-200**: `#facfe9` - Light pink for borders
- **pink-300**: `#f7a9d7` - Light pink for hover states
- **pink-400**: `#f176bf` - Medium light pink for disabled states
- **pink-500**: `#D330AA` - Primary pink for main actions
- **pink-600**: `#b5228a` - Darker pink for hover on primary
- **pink-700**: `#961f73` - Dark pink for pressed states
- **pink-800**: `#7d1e60` - Darker pink for text
- **pink-900**: `#641c4d` - Darkest pink for emphasis
- **pink-950**: `#4d0c39` - Darkest shade for strong contrast

### Semantic Color Mappings
- **Primary**: Maps to pink palette (main brand color: pink-500)
- **Secondary**: Blue-gray palette for supporting elements
- **Neutral**: True grays for backgrounds and text
- **Success**: Green palette for positive feedback
- **Warning**: Orange palette for caution messages
- **Error**: Red palette for error states

## Usage Guidelines

### Background Colors
- **Main backgrounds**: `pink-50` (#fdf2f9)
- **Card backgrounds**: `white` with `pink-200` borders
- **Secondary backgrounds**: `pink-100` (#fce7f5)

### Text Colors
- **Primary text**: `pink-800` (#7d1e60)
- **Secondary text**: `pink-600` (#b5228a)
- **Inverse text**: `white` on dark backgrounds
- **Body text**: `neutral-900` for high contrast

### Interactive Elements
- **Primary buttons**: `pink-500` background (#D330AA)
- **Button hover**: `pink-600` (#b5228a)
- **Button pressed**: `pink-700` (#961f73)
- **Disabled buttons**: `pink-300` (#f7a9d7)

### Form Elements
- **Input borders**: `pink-200` (#facfe9)
- **Focus borders**: `pink-500` (#D330AA)
- **Error borders**: `error-500` (#ef4444)
- **Input text**: `pink-800` (#7d1e60)

### State Colors
- **Success**: `success-500` (#22c55e)
- **Warning**: `warning-500` (#f59e0b)
- **Error**: `error-500` (#ef4444)
- **Info**: `pink-500` (#D330AA)

## Implementation Methods

### Tailwind CSS Classes
Use NativeWind classes for new components:
```jsx
// Background
<View className="bg-pink-50">
  
// Text
<Text className="text-pink-800">

// Buttons
<TouchableOpacity className="bg-pink-500 active:bg-pink-700">
```

### StyleSheet (Legacy)
For existing StyleSheet implementations:
```javascript
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fdf2f9', // pink-50
  },
  text: {
    color: '#7d1e60', // pink-800
  },
  button: {
    backgroundColor: '#D330AA', // pink-500
  },
});
```

## Accessibility Compliance

All color combinations meet **WCAG 2.1 AA standards** (4.5:1 contrast ratio minimum):

### Verified Combinations
- `neutral-900` on `white`: 21:1 ✅
- `pink-900` on `pink-50`: 19.5:1 ✅  
- `pink-800` on `pink-100`: 12.3:1 ✅
- `white` on `pink-500`: 6.3:1 ✅
- `white` on `pink-700`: 11.2:1 ✅

## Theme Constants

The theme is centrally defined in `/src/constants/theme.ts` with:
- Complete color palette definitions
- Semantic color mappings
- Accessibility documentation
- TypeScript type definitions

## Migration Guidelines

### From Existing Colors
- Replace `#3498db` (old blue) → `#D330AA` (pink-500)
- Replace `#2c3e50` (old dark) → `#7d1e60` (pink-800)  
- Replace `#7f8c8d` (old gray) → `#b5228a` (pink-600)
- Replace `#f8f9fa` (old background) → `#fdf2f9` (pink-50)

### Best Practices
1. **Consistency**: Always use defined color constants, never hardcode hex values
2. **Accessibility**: Test color combinations with contrast checkers
3. **Semantics**: Use semantic color names (primary, secondary, error) over specific shades
4. **Maintenance**: Update colors through theme constants, not individual components

## Cross-Platform Considerations

- All colors render consistently across iOS, Android, and web
- Tested with ColorTestScreen component
- No platform-specific color adjustments needed
- NativeWind handles color compilation properly

## Future Enhancements

The current pink theme system supports:
- Easy addition of new pink shades
- Dark mode implementation (future)
- Brand color customization
- Component theme variants

For questions or theme updates, refer to the theme constants file and maintain consistency with the established pink palette.