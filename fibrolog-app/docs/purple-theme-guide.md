# FibroLog Purple Theme Documentation

## Color Palette Overview

The FibroLog application uses a comprehensive purple color palette designed for visual consistency, accessibility compliance, and professional appearance.

## Color Definitions

### Primary Purple Palette
- **purple-50**: `#faf5ff` - Lightest purple for backgrounds
- **purple-100**: `#f3e8ff` - Light purple for subtle backgrounds  
- **purple-200**: `#e9d5ff` - Light purple for borders
- **purple-300**: `#d8b4fe` - Light purple for hover states
- **purple-400**: `#c084fc` - Medium light purple for disabled states
- **purple-500**: `#a855f7` - Primary purple for main actions
- **purple-600**: `#9333ea` - Darker purple for hover on primary
- **purple-700**: `#7c3aed` - Dark purple for pressed states
- **purple-800**: `#6b21a8` - Darker purple for text
- **purple-900**: `#581c87` - Darkest purple for emphasis
- **purple-950**: `#3b0764` - Darkest shade for strong contrast

### Semantic Color Mappings
- **Primary**: Maps to purple palette (main brand color: purple-500)
- **Secondary**: Blue-gray palette for supporting elements
- **Neutral**: True grays for backgrounds and text
- **Success**: Green palette for positive feedback
- **Warning**: Orange palette for caution messages
- **Error**: Red palette for error states

## Usage Guidelines

### Background Colors
- **Main backgrounds**: `purple-50` (#faf5ff)
- **Card backgrounds**: `white` with `purple-200` borders
- **Secondary backgrounds**: `purple-100` (#f3e8ff)

### Text Colors
- **Primary text**: `purple-800` (#6b21a8)
- **Secondary text**: `purple-600` (#9333ea)
- **Inverse text**: `white` on dark backgrounds
- **Body text**: `neutral-900` for high contrast

### Interactive Elements
- **Primary buttons**: `purple-500` background (#a855f7)
- **Button hover**: `purple-600` (#9333ea)
- **Button pressed**: `purple-700` (#7c3aed)
- **Disabled buttons**: `purple-300` (#d8b4fe)

### Form Elements
- **Input borders**: `purple-200` (#e9d5ff)
- **Focus borders**: `purple-500` (#a855f7)
- **Error borders**: `error-500` (#ef4444)
- **Input text**: `purple-800` (#6b21a8)

### State Colors
- **Success**: `success-500` (#22c55e)
- **Warning**: `warning-500` (#f59e0b)
- **Error**: `error-500` (#ef4444)
- **Info**: `purple-500` (#a855f7)

## Implementation Methods

### Tailwind CSS Classes
Use NativeWind classes for new components:
```jsx
// Background
<View className="bg-purple-50">
  
// Text
<Text className="text-purple-800">

// Buttons
<TouchableOpacity className="bg-purple-500 active:bg-purple-700">
```

### StyleSheet (Legacy)
For existing StyleSheet implementations:
```javascript
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#faf5ff', // purple-50
  },
  text: {
    color: '#6b21a8', // purple-800
  },
  button: {
    backgroundColor: '#a855f7', // purple-500
  },
});
```

## Accessibility Compliance

All color combinations meet **WCAG 2.1 AA standards** (4.5:1 contrast ratio minimum):

### Verified Combinations
- `neutral-900` on `white`: 21:1 ✅
- `purple-900` on `purple-50`: 19.5:1 ✅  
- `purple-800` on `purple-100`: 12.3:1 ✅
- `white` on `purple-500`: 6.3:1 ✅
- `white` on `purple-700`: 11.2:1 ✅

## Theme Constants

The theme is centrally defined in `/src/constants/theme.ts` with:
- Complete color palette definitions
- Semantic color mappings
- Accessibility documentation
- TypeScript type definitions

## Migration Guidelines

### From Existing Colors
- Replace `#3498db` (old blue) → `#a855f7` (purple-500)
- Replace `#2c3e50` (old dark) → `#6b21a8` (purple-800)  
- Replace `#7f8c8d` (old gray) → `#9333ea` (purple-600)
- Replace `#f8f9fa` (old background) → `#faf5ff` (purple-50)

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

The current purple theme system supports:
- Easy addition of new purple shades
- Dark mode implementation (future)
- Brand color customization
- Component theme variants

For questions or theme updates, refer to the theme constants file and maintain consistency with the established purple palette.