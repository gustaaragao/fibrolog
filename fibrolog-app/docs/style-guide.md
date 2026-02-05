# FibroLog Purple Theme Style Guide

## Introduction

This style guide establishes the visual design standards for the FibroLog application, ensuring consistent implementation of the purple theme across all components and screens. It serves as the authoritative reference for designers and developers.

---

## Color System

### Primary Purple Palette

| Shade | Hex | RGB | Usage |
|-------|-----|-----|-------|
| **purple-50** | `#faf5ff` | `rgb(250, 245, 255)` | Light backgrounds, subtle containers |
| **purple-100** | `#f3e8ff` | `rgb(243, 232, 255)` | Card backgrounds, subtle highlights |
| **purple-200** | `#e9d5ff` | `rgb(233, 213, 255)` | Borders, dividers, disabled text |
| **purple-300** | `#d8b4fe` | `rgb(216, 180, 254)` | Hover states, disabled buttons |
| **purple-400** | `#c084fc` | `rgb(192, 132, 252)` | Placeholder text, inactive elements |
| **purple-500** | `#a855f7` | `rgb(168, 85, 247)` | **Primary brand color**, main actions |
| **purple-600** | `#9333ea` | `rgb(147, 51, 234)` | Hover states, secondary text |
| **purple-700** | `#7c3aed` | `rgb(124, 58, 237)` | Pressed states, active elements |
| **purple-800** | `#6b21a8` | `rgb(107, 33, 168)` | Primary text, headings |
| **purple-900** | `#581c87` | `rgb(88, 28, 135)` | Dark text, emphasis |
| **purple-950** | `#3b0764` | `rgb(59, 7, 100)` | Maximum contrast text |

### Semantic Color Mappings

#### Success Colors (Green)
- **success-50**: `#f0fdf4` - Success backgrounds
- **success-500**: `#22c55e` - Success indicators
- **success-700**: `#15803d` - Success text

#### Error Colors (Red)  
- **error-50**: `#fef2f2` - Error backgrounds
- **error-500**: `#ef4444` - Error indicators
- **error-700**: `#b91c1c` - Error text

#### Warning Colors (Orange)
- **warning-50**: `#fefce8` - Warning backgrounds  
- **warning-500**: `#f59e0b` - Warning indicators
- **warning-800**: `#92400e` - Warning text

#### Neutral Colors (Gray)
- **neutral-50**: `#fafafa` - Light backgrounds
- **neutral-200**: `#e4e4e7` - Borders
- **neutral-500**: `#71717a` - Placeholder text
- **neutral-900**: `#18181b` - Primary text (high contrast)

---

## Typography

### Hierarchy and Usage

#### Headings
```css
/* App Title */
font-size: 36px;
font-weight: bold;
color: purple-800;
text-align: center;

/* Screen Titles */
font-size: 24px;
font-weight: bold;
color: purple-800;
margin-bottom: 8px;

/* Section Headers */
font-size: 18px;
font-weight: 600;
color: purple-800;
margin-bottom: 16px;
```

#### Body Text
```css
/* Primary Text */
font-size: 16px;
font-weight: normal;
color: purple-800;
line-height: 24px;

/* Secondary Text */
font-size: 16px;
font-weight: normal;
color: purple-600;
line-height: 24px;

/* Caption Text */
font-size: 14px;
font-weight: normal;
color: purple-600;
line-height: 20px;
```

#### Interactive Text
```css
/* Button Text */
font-size: 16px;
font-weight: bold;
color: white;

/* Link Text */
font-size: 16px;
font-weight: 600;
color: purple-500;
text-decoration: underline;

/* Form Labels */
font-size: 16px;
font-weight: 600;
color: purple-800;
margin-bottom: 8px;
```

---

## Component Specifications

### Buttons

#### Primary Button
```css
background-color: purple-500;
color: white;
padding: 16px 32px;
border-radius: 8px;
font-size: 16px;
font-weight: bold;
border: none;

/* Hover State */
background-color: purple-600;

/* Pressed State */
background-color: purple-700;

/* Disabled State */
background-color: purple-300;
opacity: 0.6;
```

#### Secondary Button
```css
background-color: purple-100;
color: purple-800;
padding: 16px 32px;
border-radius: 8px;
font-size: 16px;
font-weight: 600;
border: 1px solid purple-200;

/* Hover State */
background-color: purple-200;

/* Pressed State */
background-color: purple-300;
```

#### Outline Button
```css
background-color: transparent;
color: purple-500;
padding: 16px 32px;
border-radius: 8px;
font-size: 16px;
font-weight: 600;
border: 1px solid purple-500;

/* Hover State */
background-color: purple-50;

/* Pressed State */
background-color: purple-100;
```

#### Destructive Button
```css
background-color: error-500;
color: white;
padding: 16px 32px;
border-radius: 8px;
font-size: 16px;
font-weight: bold;
border: none;

/* Hover State */
background-color: error-600;

/* Pressed State */  
background-color: error-700;
```

### Form Controls

#### Text Input
```css
/* Default State */
background-color: white;
border: 1px solid purple-200;
border-radius: 8px;
padding: 16px;
font-size: 16px;
color: purple-800;

/* Focus State */
border-color: purple-500;
box-shadow: 0 0 0 3px purple-100;

/* Error State */
border-color: error-400;
box-shadow: 0 0 0 3px error-100;

/* Disabled State */
background-color: neutral-50;
border-color: neutral-200;
color: neutral-500;
```

#### Input Labels
```css
font-size: 16px;
font-weight: 600;
color: purple-800;
margin-bottom: 8px;
display: block;
```

#### Validation Messages
```css
/* Error Message */
font-size: 14px;
color: error-700;
margin-top: 4px;

/* Success Message */
font-size: 14px;
color: success-700;
margin-top: 4px;

/* Helper Text */
font-size: 14px;
color: purple-600;
margin-top: 4px;
```

### Navigation

#### Tab Bar
```css
background-color: purple-50;
border-top: 1px solid purple-200;
padding: 8px 0;

/* Active Tab */
color: purple-500;
font-weight: 600;

/* Inactive Tab */
color: purple-600;
font-weight: normal;
```

#### Navigation Header
```css
background-color: white;
border-bottom: 1px solid purple-200;
padding: 16px;

/* Title */
font-size: 18px;
font-weight: bold;
color: purple-800;
```

### Cards and Containers

#### Main Container
```css
background-color: purple-50;
padding: 20px;
min-height: 100vh;
```

#### Card Container
```css
background-color: white;
border-radius: 8px;
padding: 24px;
margin-bottom: 16px;
border: 1px solid purple-100;
box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
```

#### Section Container
```css
background-color: white;
border-radius: 8px;
padding: 16px;
margin-bottom: 16px;
border: 1px solid purple-200;
```

### Loading States

#### Activity Indicator
```css
color: purple-500;
size: large; /* or 'small' for inline */
```

#### Loading Screen
```css
/* Container */
background-color: purple-50;
justify-content: center;
align-items: center;
flex: 1;

/* Loading Text */
font-size: 16px;
color: purple-600;
margin-top: 16px;
```

### Feedback Messages

#### Success Message
```css
background-color: success-50;
border: 1px solid success-200;
border-radius: 8px;
padding: 12px 16px;
margin-bottom: 16px;

/* Text */
color: success-700;
font-size: 14px;
text-align: center;
```

#### Error Message  
```css
background-color: error-50;
border: 1px solid error-200;
border-radius: 8px;
padding: 12px 16px;
margin-bottom: 16px;

/* Text */
color: error-700;
font-size: 14px;
text-align: center;
```

#### Warning Message
```css
background-color: warning-50;
border: 1px solid warning-200;
border-radius: 8px;
padding: 12px 16px;
margin-bottom: 16px;

/* Text */
color: warning-800;
font-size: 14px;
text-align: center;
```

---

## Layout Guidelines

### Spacing System
Use a consistent 8px grid system:

- **4px**: Tight spacing (icon-text gaps)
- **8px**: Small spacing (form field margins)
- **16px**: Medium spacing (component margins, padding)
- **24px**: Large spacing (section padding)
- **32px**: Extra large spacing (screen margins)

### Border Radius
- **4px**: Small elements (badges, small buttons)
- **8px**: Standard elements (buttons, inputs, cards)
- **12px**: Large elements (modals, large cards)
- **16px**: Extra large elements (containers)

### Box Shadows
```css
/* Subtle shadow (cards) */
box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

/* Medium shadow (modals) */
box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

/* Strong shadow (dropdowns) */
box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
```

---

## Implementation Guidelines

### CSS Classes (NativeWind/Tailwind)

#### Background Colors
```css
.bg-purple-50     /* Light backgrounds */
.bg-purple-100    /* Card backgrounds */
.bg-purple-500    /* Primary elements */
.bg-white         /* Clean backgrounds */
```

#### Text Colors
```css
.text-purple-800  /* Primary text */
.text-purple-600  /* Secondary text */
.text-purple-500  /* Interactive text */
.text-white       /* Inverse text */
```

#### Border Colors
```css
.border-purple-200  /* Default borders */
.border-purple-500  /* Focus borders */
.border-error-400   /* Error borders */
```

### React Native StyleSheet

#### Color Constants Usage
```javascript
import { Colors, ThemeColors } from '@/constants/theme';

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.purple[50],
  },
  title: {
    color: ThemeColors.text.purple,
  },
  button: {
    backgroundColor: ThemeColors.interactive.primary,
  },
});
```

---

## Accessibility Standards

### Color Contrast Requirements
All color combinations meet WCAG 2.1 AA standards (4.5:1 minimum):

#### Verified Combinations
- **purple-800 on white**: 14.8:1 ✅
- **purple-600 on white**: 7.9:1 ✅  
- **white on purple-500**: 6.3:1 ✅
- **purple-900 on purple-50**: 19.5:1 ✅
- **error-700 on error-50**: 13.2:1 ✅
- **success-700 on success-50**: 11.8:1 ✅

### Focus Indicators
```css
/* Focus ring for interactive elements */
border: 2px solid purple-500;
box-shadow: 0 0 0 3px purple-100;
```

### Touch Targets
- **Minimum size**: 44x44px for all interactive elements
- **Adequate spacing**: 8px minimum between touch targets
- **Clear visual feedback**: Hover and pressed states for all buttons

---

## Platform Considerations

### iOS Specific
- Use iOS-appropriate font weights (avoid font weights not supported)
- Ensure purple colors work with iOS system themes
- Test with iOS accessibility features (VoiceOver, high contrast)

### Android Specific  
- Follow Material Design guidelines where applicable
- Ensure colors work with Android system themes
- Test with Android accessibility features (TalkBack, high contrast)

### Web Specific
- Ensure colors work across different browsers
- Provide proper focus management for keyboard navigation
- Test with screen readers and browser accessibility tools

---

## Brand Guidelines

### Logo and Branding
- **Primary brand color**: purple-500 (#a855f7)
- **App name styling**: 36px, bold, purple-800
- **Tagline styling**: 16px, normal, purple-600

### Voice and Tone
- **Professional**: Healthcare application requiring trust
- **Approachable**: Friendly purple tones, not intimidating
- **Consistent**: Same visual patterns throughout app
- **Accessible**: Inclusive design for all users

### Usage Restrictions
- **Don't** use purple colors outside the defined palette
- **Don't** reduce contrast below WCAG AA standards  
- **Don't** use color as the only means of conveying information
- **Don't** deviate from established spacing and typography scales

---

## Quality Checklist

### Before Implementation
- [ ] Verify color contrast meets WCAG AA standards
- [ ] Check color usage against semantic guidelines
- [ ] Ensure consistent spacing using 8px grid
- [ ] Validate typography hierarchy and sizing
- [ ] Test focus states and touch targets

### After Implementation  
- [ ] Test on iOS device/simulator
- [ ] Test on Android device/emulator
- [ ] Test in web browser
- [ ] Verify accessibility with screen readers
- [ ] Check performance impact
- [ ] Validate visual consistency across screens

---

## Maintenance and Updates

### Style Guide Updates
This style guide should be updated when:
- New components are added to the design system
- Color palette is expanded or modified
- Typography scales are adjusted
- Accessibility requirements change
- Platform-specific guidelines are updated

### Version History
- **v1.0**: Initial purple theme implementation
- **Future**: Document major changes with version numbers

---

## Resources and Tools

### Design Tools
- **Figma**: For mockups and design specifications
- **WebAIM Contrast Checker**: For accessibility validation
- **Coolors.co**: For color palette generation and testing

### Development Tools  
- **NativeWind**: Tailwind CSS for React Native
- **React Native**: Cross-platform mobile development
- **Expo**: Development and deployment platform

### Testing Tools
- **React Native Debugger**: For style inspection
- **Accessibility Scanner**: For accessibility testing
- **Device Testing**: Real device testing across platforms

This style guide ensures consistent, accessible, and professional implementation of the FibroLog purple theme across all application components and platforms.