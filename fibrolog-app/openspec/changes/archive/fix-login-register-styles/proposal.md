## Why

The recent refactoring of the login and registration screens successfully implemented the functional requirements but did not fully achieve the visual design proposed in `HOME.png`. Specifically, the styling for containers, typography, and buttons needs refinement to strictly follow the branded purple theme and modern layout.

## What Changes

- Update `app/login.tsx` layout to match the vertical spacing and brand positioning in `HOME.png`.
- Update `app/register.tsx` layout to ensure consistency with the login screen and the provided design.
- Refine `components/ui/Input.tsx` styling (border colors, focus states, labels) to match the brand palette.
- Refine `components/ui/Button.tsx` to ensure the primary and text variants align with the design's visual weight and colors.
- Ensure the `Carattere` font is applied consistently and correctly to all brand elements.

## Capabilities

### New Capabilities
- `branding-refinement`: Final visual polish of the application's entry points (login and register) to ensure 100% alignment with brand design.

### Modified Capabilities
<!-- No main specs exist yet, but we are effectively modifying the ones from the previous change -->

## Impact

- **`app/login.tsx`**: UI adjustments.
- **`app/register.tsx`**: UI adjustments.
- **`components/ui/Input.tsx`**: Styling updates.
- **`components/ui/Button.tsx`**: Styling updates.
- **`src/constants/theme.ts`**: Potential verification/update of brand colors.
