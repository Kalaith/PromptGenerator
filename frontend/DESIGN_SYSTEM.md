# Anime Prompt Generator - Design System

## Overview
This design system establishes a cohesive, anime-inspired visual language for the Anime Prompt Generator application. The theme combines modern web design principles with vibrant, anime-aesthetic colors and typography.

## Color Palette

### Primary Colors
- **Sakura Pink**: `#FF69B4` - Primary accent color
- **Deep Violet**: `#6A0DAD` - Secondary accent color  
- **Ocean Blue**: `#4169E1` - Action/navigation color
- **Mystic Purple**: `#9370DB` - Supporting accent

### Neutral Colors
- **Pure White**: `#FFFFFF` - Light mode background
- **Paper White**: `#FEFEFE` - Light mode surface
- **Soft Gray**: `#F8F9FA` - Light mode secondary background
- **Text Dark**: `#2D3748` - Primary text (light mode)
- **Text Medium**: `#4A5568` - Secondary text (light mode)

### Dark Mode Colors  
- **Deep Navy**: `#1A1B23` - Dark mode background
- **Dark Surface**: `#2D3748` - Dark mode surface
- **Light Text**: `#F7FAFC` - Primary text (dark mode)
- **Medium Text**: `#E2E8F0` - Secondary text (dark mode)

### Status Colors
- **Success Green**: `#48BB78` - Success states
- **Warning Orange**: `#ED8936` - Warning states  
- **Error Red**: `#F56565` - Error states
- **Info Blue**: `#4299E1` - Info states

## Typography

### Font Stack
- **Primary**: "Inter", "Segoe UI", system-ui, sans-serif
- **Heading**: "Poppins", "Inter", sans-serif (for visual hierarchy)
- **Code**: "JetBrains Mono", "Fira Code", monospace

### Scale
- **xs**: 0.75rem (12px)
- **sm**: 0.875rem (14px)
- **base**: 1rem (16px)
- **lg**: 1.125rem (18px)
- **xl**: 1.25rem (20px)
- **2xl**: 1.5rem (24px)
- **3xl**: 1.875rem (30px)
- **4xl**: 2.25rem (36px)

### Weights
- **light**: 300
- **normal**: 400
- **medium**: 500
- **semibold**: 600
- **bold**: 700

## Spacing Scale
Based on 4px base unit:
- **1**: 0.25rem (4px)
- **2**: 0.5rem (8px)  
- **3**: 0.75rem (12px)
- **4**: 1rem (16px)
- **5**: 1.25rem (20px)
- **6**: 1.5rem (24px)
- **8**: 2rem (32px)
- **10**: 2.5rem (40px)
- **12**: 3rem (48px)
- **16**: 4rem (64px)

## Border Radius
- **sm**: 0.375rem (6px)
- **DEFAULT**: 0.5rem (8px)
- **md**: 0.75rem (12px)
- **lg**: 1rem (16px)
- **xl**: 1.5rem (24px)
- **full**: 9999px

## Shadows
- **sm**: `0 1px 2px 0 rgba(0, 0, 0, 0.05)`
- **DEFAULT**: `0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)`
- **md**: `0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)`
- **lg**: `0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)`
- **xl**: `0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)`
- **glow**: `0 0 20px rgba(255, 105, 180, 0.3)`

## Gradients

### Primary Gradients
- **sakura**: `linear-gradient(135deg, #FF69B4 0%, #FF1493 100%)`
- **ocean**: `linear-gradient(135deg, #4169E1 0%, #1E3A8A 100%)`
- **sunset**: `linear-gradient(135deg, #FF69B4 0%, #9370DB 50%, #4169E1 100%)`
- **mystic**: `linear-gradient(135deg, #9370DB 0%, #6A0DAD 100%)`

### Background Gradients
- **light**: `linear-gradient(135deg, #FFFFFF 0%, #F8F9FA 100%)`
- **dark**: `linear-gradient(135deg, #1A1B23 0%, #2D3748 100%)`

## Component Styles

### Buttons
- **Primary**: Sakura gradient, white text, rounded-lg, shadow-md, hover glow effect
- **Secondary**: White background, sakura border, sakura text, hover sakura background
- **Outline**: Transparent background, border, hover filled
- **Ghost**: Transparent background, colored text, hover subtle background

### Cards
- **Background**: Surface color with subtle border
- **Shadow**: Default shadow, hover shadow-lg transition
- **Border**: Subtle border with rounded corners
- **Hover**: Slight scale and glow effect

### Forms
- **Input**: Clean borders, focus sakura accent, placeholder styling
- **Select**: Custom dropdown arrow, consistent styling
- **Label**: Medium weight, proper spacing
- **Validation**: Clear error/success states

### Navigation
- **Header**: Gradient background with glassmorphism effect
- **Links**: Active state highlighting, smooth transitions
- **Breadcrumbs**: Subtle with proper hierarchy

## Animation Guidelines

### Durations
- **fast**: 150ms - Micro-interactions
- **normal**: 250ms - Standard transitions  
- **slow**: 400ms - Complex transitions

### Easing
- **ease-in**: `cubic-bezier(0.4, 0, 1, 1)` - Entrance animations
- **ease-out**: `cubic-bezier(0, 0, 0.2, 1)` - Exit animations
- **ease-in-out**: `cubic-bezier(0.4, 0, 0.2, 1)` - Standard transitions

### Effects
- **hover-lift**: Subtle scale and shadow increase
- **glow-pulse**: Gentle glow animation for accents
- **slide-in**: Smooth entrance animations
- **fade**: Opacity transitions

## Accessibility

### Focus States
- High contrast focus rings
- Minimum 3:1 contrast ratio
- Keyboard navigation support

### Color Contrast
- AA compliance for all text
- Alternative indicators for color-blind users
- Dark mode optimized contrast

### Motion
- Reduced motion preferences respected
- Optional animation controls
- Performance optimized transitions

## Usage Guidelines

### Do's
- Use consistent spacing from the scale
- Maintain color hierarchy
- Apply animations purposefully
- Keep accessibility in mind
- Use semantic color names

### Don'ts
- Mix font families arbitrarily
- Use too many accent colors
- Ignore dark mode considerations
- Overcomplicate animations
- Skip focus states

## Implementation Notes

### Tailwind Integration
- Custom theme configuration maps to these values
- CSS custom properties for runtime theme switching
- Component-specific utilities for common patterns

### Performance
- Animations use transform and opacity when possible
- Critical CSS inlined for above-the-fold content
- Lazy loading for non-critical assets

### Browser Support
- Modern browsers (ES6+)
- Progressive enhancement approach
- Fallbacks for older browsers where necessary

## Future Considerations

### Theming
- Multiple preset themes (different anime styles)
- User customizable accent colors
- Seasonal theme variations

### Components
- Expanding component library
- Animation presets
- Interactive feedback systems

This design system should be reviewed and updated as the application evolves, ensuring consistency and quality across all user interfaces.