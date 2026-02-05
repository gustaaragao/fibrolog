# Rollback Procedures and Migration Documentation
## FibroLog Purple Theme Implementation

### Overview
This document provides comprehensive procedures for rolling back the purple theme implementation and guidance for future theme migrations. All changes are designed to be non-destructive and reversible.

---

## Emergency Rollback Procedures

### Immediate Rollback (< 15 minutes)

#### Step 1: Revert Tailwind Configuration
```bash
# Navigate to project root
cd /home/gustavo/ufs/fibrolog/fibrolog-app

# Create backup of current tailwind.config.js
cp tailwind.config.js tailwind.config.js.purple-backup

# Restore original configuration
git checkout HEAD~N tailwind.config.js
# OR restore from backup if available
```

**Original Tailwind Config** (if manual restoration needed):
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

#### Step 2: Revert Core Theme Files
```bash
# Remove theme constants (if causing issues)
rm -f src/constants/theme.ts

# Revert babel configuration if needed
git checkout HEAD~N babel.config.js

# Clear metro cache
npx expo start --clear
```

#### Step 3: Emergency Screen Fixes
Create emergency CSS overrides to restore basic functionality:

```typescript
// emergency-styles.ts
export const emergencyStyles = {
  container: { backgroundColor: '#fff' },
  title: { color: '#000' },
  button: { backgroundColor: '#007AFF' },
  input: { borderColor: '#ccc' },
};
```

### Complete Rollback (< 2 hours)

#### Phase 1: File Reversion
```bash
# Create rollback branch
git checkout -b rollback-purple-theme

# Identify changed files
git diff --name-only [commit-before-purple]..HEAD

# Revert specific files systematically
git checkout [commit-before-purple] -- app/login.tsx
git checkout [commit-before-purple] -- app/home.tsx
git checkout [commit-before-purple] -- app/(tabs)/_layout.tsx
git checkout [commit-before-purple] -- src/screens/LoginScreen.tsx
git checkout [commit-before-purple] -- src/screens/HomeScreen.tsx

# Commit rollback changes
git commit -m "Rollback: Revert purple theme implementation"
```

#### Phase 2: Component Restoration
For each component, restore original styling:

**LoginScreen Rollback**:
```typescript
// Restore original blue theme
const styles = StyleSheet.create({
  container: { backgroundColor: "#E6F4FE" },
  titulo: { color: "#0066CC" },
  subtitulo: { color: "#666" },
  input: { borderColor: "#ddd" },
  botao: { backgroundColor: "#0066CC" },
});
```

**HomeScreen Rollback**:
```typescript
// Restore original styling  
const styles = StyleSheet.create({
  container: { backgroundColor: "#fff" },
  titulo: { color: "#0066CC" },
  usuario: { color: "#666" },
  botao: { backgroundColor: "#dc3545" },
});
```

#### Phase 3: Remove Purple Dependencies
```bash
# Remove purple-specific files
rm -rf src/constants/theme.ts
rm -rf docs/purple-theme-guide.md
rm -rf docs/style-guide.md
rm -rf docs/accessibility-compliance.md
rm -rf src/tests/

# Clean up package dependencies if any were added
npm audit fix
```

#### Phase 4: Verification
```bash
# Test build process
npm run lint
npx expo start --clear

# Verify screens load correctly
# Check login, registration, home screens
# Confirm navigation works
# Test form functionality
```

---

## Gradual Rollback Procedures

### Partial Rollback Options

#### Option 1: Keep Infrastructure, Revert Styling
```bash
# Keep tailwind config and theme constants
# Revert only screen component styling
git checkout [commit] -- src/screens/
git checkout [commit] -- app/

# Allows easy re-application later
```

#### Option 2: Keep New Components, Revert Colors
```typescript
// Keep RegisterScreen, revert to blue theme
const styles = StyleSheet.create({
  container: { backgroundColor: "#E6F4FE" }, // Blue instead of purple
  title: { color: "#0066CC" },             // Blue instead of purple
  // ... convert purple colors to blue
});
```

#### Option 3: Feature Flag Approach
```typescript
// Add theme toggle capability
const USE_PURPLE_THEME = false; // Set to false for rollback

const getThemeColor = (purpleColor: string, fallbackColor: string) => {
  return USE_PURPLE_THEME ? purpleColor : fallbackColor;
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: getThemeColor('#faf5ff', '#E6F4FE'),
  },
});
```

---

## Migration Documentation

### Pre-Migration Checklist

#### Environment Preparation
- [ ] Create full git backup: `git tag pre-purple-theme-$(date +%Y%m%d)`
- [ ] Document current color scheme values
- [ ] Take screenshots of all current screens
- [ ] Verify build processes work correctly
- [ ] Test on all target platforms (iOS, Android, Web)

#### Team Preparation
- [ ] Review purple theme design specifications
- [ ] Assign team members to component updates
- [ ] Set up testing procedures and checklist
- [ ] Establish rollback decision criteria
- [ ] Schedule deployment windows

### Migration Process

#### Phase 1: Infrastructure Setup (Day 1)
1. **Theme System Implementation**
   ```bash
   # Add theme constants
   cp backup/theme.ts src/constants/theme.ts
   
   # Update Tailwind config
   # Configure NativeWind
   # Test compilation
   ```

2. **Testing Infrastructure**
   ```bash
   # Add color test component
   # Set up accessibility testing
   # Configure cross-platform testing
   ```

#### Phase 2: Core Components (Days 2-3)
1. **Authentication Screens**
   - Update LoginScreen styling
   - Implement RegisterScreen with purple theme
   - Test authentication flow

2. **Navigation Components**  
   - Update AppNavigator theming
   - Apply tab bar purple colors
   - Test navigation transitions

#### Phase 3: Supporting Components (Days 4-5)
1. **UI Components**
   - Update LoadingScreen
   - Theme ErrorBoundary
   - Apply form component styling

2. **Layout Components**
   - Update HomeScreen
   - Apply purple backgrounds
   - Test component interactions

#### Phase 4: Testing and Validation (Day 6)
1. **Cross-Platform Testing**
2. **Accessibility Validation**  
3. **Performance Testing**
4. **User Acceptance Testing**

#### Phase 5: Documentation and Deployment (Day 7)
1. **Documentation Updates**
2. **Style Guide Creation**
3. **Team Training**
4. **Production Deployment**

### Post-Migration Procedures

#### Immediate Post-Deploy (First 24 hours)
- [ ] Monitor error reporting systems
- [ ] Check user feedback channels
- [ ] Verify analytics show normal usage patterns
- [ ] Test critical user flows (login, registration)
- [ ] Monitor performance metrics

#### Short-term Monitoring (First week)
- [ ] Daily checks of error rates
- [ ] User feedback analysis
- [ ] Performance impact assessment
- [ ] Cross-platform compatibility verification
- [ ] Team feedback collection

#### Long-term Assessment (First month)
- [ ] User satisfaction surveys
- [ ] Accessibility compliance verification
- [ ] Performance impact analysis
- [ ] Team productivity assessment
- [ ] Maintenance burden evaluation

---

## Risk Mitigation Strategies

### Technical Risks

#### Risk: Build Process Failures
**Mitigation**: 
- Test build process thoroughly before deployment
- Have rollback scripts ready
- Use feature flags for gradual rollout

**Rollback Trigger**: Build failures on any platform
```bash
# Emergency build fix
npx expo install --fix
npm run lint
npx expo start --clear
```

#### Risk: Performance Degradation
**Mitigation**:
- Benchmark performance before/after
- Monitor bundle size increases
- Test on lower-end devices

**Rollback Trigger**: >10% performance decrease
```bash
# Performance rollback
git checkout [performant-commit]
npm run build
# Deploy previous version
```

#### Risk: Cross-Platform Inconsistencies
**Mitigation**:
- Test on all platforms before deployment
- Use platform-specific testing procedures
- Have platform-specific rollback plans

**Rollback Trigger**: Major visual inconsistencies
```bash
# Platform-specific fixes
# iOS rollback: Revert iOS-specific styles
# Android rollback: Revert Material Design elements
# Web rollback: Revert CSS-specific styling
```

### User Experience Risks

#### Risk: User Confusion
**Mitigation**:
- Gradual rollout to subset of users
- Provide user guidance/onboarding
- Monitor support channels

**Rollback Trigger**: >20% increase in support tickets
```bash
# User experience rollback
# Restore familiar blue theme
# Keep functional improvements
```

#### Risk: Accessibility Issues
**Mitigation**:
- Comprehensive accessibility testing
- Screen reader testing
- Color blindness simulation

**Rollback Trigger**: Any accessibility compliance failure
```bash
# Accessibility-focused rollback
# Restore high-contrast combinations
# Revert problematic color schemes
```

---

## Testing Procedures for Rollback

### Rollback Validation Checklist

#### Functional Testing
- [ ] User can log in successfully  
- [ ] User can register new account
- [ ] Navigation between screens works
- [ ] Form validation functions correctly
- [ ] Error messages display properly
- [ ] Loading states appear correctly

#### Visual Testing
- [ ] All text is readable (contrast check)
- [ ] Buttons are clearly visible
- [ ] Form inputs are distinguishable
- [ ] Navigation elements are clear
- [ ] No visual artifacts or glitches

#### Cross-Platform Testing
- [ ] iOS: App launches and functions normally
- [ ] Android: Material Design elements work
- [ ] Web: Browser compatibility maintained
- [ ] Responsive design functions correctly

#### Performance Testing  
- [ ] App launch time within normal range
- [ ] Screen transitions are smooth
- [ ] No memory leaks detected
- [ ] Bundle size within acceptable limits

---

## Communication Procedures

### Internal Communication

#### Pre-Rollback Notification
```markdown
# Rollback Decision Template
**Date**: [Current Date]
**Reason**: [Brief explanation of rollback reason]
**Timeline**: [Expected completion time]
**Impact**: [User-facing impact description]
**Team Actions**: [What each team member should do]
```

#### During Rollback Updates
```markdown
# Rollback Progress Update
**Status**: [In Progress/Completed/Blocked]
**Completed Steps**: [List of completed steps]
**Current Step**: [What's happening now]
**ETA**: [Expected completion time]
**Issues**: [Any problems encountered]
```

### External Communication

#### User Communication (if necessary)
```markdown
# User Notification Template
"We are temporarily reverting recent visual changes to improve stability. 
All functionality remains available. Thank you for your patience."
```

#### Stakeholder Communication
```markdown
# Stakeholder Update Template
**Summary**: Theme rollback initiated due to [reason]
**User Impact**: [Minimal/None - all functionality preserved]  
**Timeline**: [Expected completion]
**Next Steps**: [Plan for addressing issues]
```

---

## Future Migration Best Practices

### Lessons Learned Integration

#### Technical Improvements
1. **Feature Flags**: Implement runtime theme switching capability
2. **A/B Testing**: Gradual rollout with user feedback collection
3. **Automated Testing**: CI/CD integration for visual regression testing
4. **Performance Monitoring**: Real-time performance impact tracking

#### Process Improvements
1. **Staged Rollout**: Deploy to internal team first, then gradual user rollout
2. **User Feedback**: Integrated feedback collection mechanism
3. **Quick Rollback**: One-click rollback capability
4. **Documentation**: Living documentation updated with each migration

### Future Theme Migration Template

```bash
# Future migration checklist
1. [ ] Create migration branch
2. [ ] Document current state
3. [ ] Implement with feature flags
4. [ ] Test with internal team
5. [ ] A/B test with small user group
6. [ ] Collect feedback and iterate
7. [ ] Full deployment or rollback decision
8. [ ] Update documentation
```

---

## File Inventory for Rollback

### Created Files (can be safely removed)
```bash
src/constants/theme.ts
docs/purple-theme-guide.md
docs/style-guide.md  
docs/accessibility-compliance.md
docs/component-documentation.md
src/tests/error-scenarios.md
src/tests/cross-platform-testing.md
src/tests/accessibility-compliance.md
src/tests/authentication-flow-testing.md
src/tests/component-functionality-verification.md
src/tests/user-acceptance-testing.md
src/tests/performance-testing.md
```

### Modified Files (need restoration)
```bash
tailwind.config.js
babel.config.js
app/login.tsx
app/home.tsx
app/(tabs)/_layout.tsx
src/screens/LoginScreen.tsx
src/screens/RegisterScreen.tsx (if keeping, just revert colors)
src/screens/HomeScreen.tsx
src/components/LoadingScreen.tsx
src/components/ErrorBoundary.tsx
```

### Git Commands for Full Rollback
```bash
# Create rollback branch
git checkout -b emergency-rollback-purple-theme

# Remove all purple theme files
git rm docs/purple-theme-guide.md docs/style-guide.md docs/accessibility-compliance.md
git rm -rf src/tests/

# Restore original files
git checkout [pre-purple-commit] -- tailwind.config.js babel.config.js
git checkout [pre-purple-commit] -- app/ src/screens/ src/components/

# Commit rollback
git commit -m "Emergency rollback: Remove purple theme implementation"

# Deploy rollback
git push origin emergency-rollback-purple-theme
```

This comprehensive rollback and migration documentation ensures that the purple theme implementation can be safely reversed if needed and provides a roadmap for future theme migrations with reduced risk and improved processes.