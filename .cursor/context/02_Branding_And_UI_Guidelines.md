# NewTerra V1 - Branding and UI Guidelines

## Brand Identity

### Logo

- Primary logo: NewTerra wordmark with leaf icon
- Acceptable formats: SVG (preferred), PNG with transparent background
- Minimum size: 120px width to maintain legibility
- Clear space: Maintain padding equal to height of "N" around logo

### Color Palette

#### Primary Colors

- **Forest Green** `#1B512D` - Primary brand color, used for main elements
- **Sage** `#7FAD7F` - Secondary color, used for accents and highlights
- **Earth Brown** `#5E4B3E` - Tertiary color, used sparingly for contrast

#### Secondary Colors

- **Sky Blue** `#A4CBEA` - Used for interactive elements and links
- **Soft Yellow** `#F7EFB2` - Used for warnings and notifications
- **Coral** `#FF7F5E` - Used for errors and critical actions

#### Neutral Colors

- **Charcoal** `#333333` - Used for main text
- **Slate** `#666666` - Used for secondary text
- **Light Gray** `#CCCCCC` - Used for borders and dividers
- **Off-White** `#F8F8F5` - Used for backgrounds

### Typography

#### Headings

- Font: 'Montserrat', sans-serif
- Weights: Bold (700) for main headings, Semibold (600) for subheadings
- H1: 32px (2rem)
- H2: 24px (1.5rem)
- H3: 20px (1.25rem)
- H4: 18px (1.125rem)

#### Body Text

- Font: 'Open Sans', sans-serif
- Weights: Regular (400) for standard text, Bold (700) for emphasis
- Body: 16px (1rem)
- Small: 14px (0.875rem)
- X-Small: 12px (0.75rem)

## UI Components

### Buttons

#### Primary Button

- Background: Forest Green (`#1B512D`)
- Text: White
- Border: None
- Border Radius: 4px
- Hover: 10% darker shade of Forest Green
- Disabled: 50% opacity

#### Secondary Button

- Background: White
- Text: Forest Green (`#1B512D`)
- Border: 1px solid Forest Green
- Border Radius: 4px
- Hover: 10% Forest Green background with white text
- Disabled: 50% opacity

#### Text Button

- Background: Transparent
- Text: Forest Green (`#1B512D`)
- Border: None
- Hover: Underlined text
- Disabled: 50% opacity

### Form Elements

#### Input Fields

- Background: White
- Border: 1px solid Light Gray (`#CCCCCC`)
- Border Radius: 4px
- Focus: 2px solid Sage (`#7FAD7F`)
- Error: 2px solid Coral (`#FF7F5E`)
- Padding: 10px 12px
- Text: Charcoal (`#333333`)

#### Checkboxes & Radio Buttons

- Border: 1px solid Light Gray
- Selected: Filled with Forest Green
- Size: 18px × 18px

### Cards

- Background: White
- Border: 1px solid Light Gray (`#CCCCCC`)
- Border Radius: 8px
- Shadow: 0 2px 4px rgba(0, 0, 0, 0.1)
- Padding: 16px

## Layout Guidelines

### Grid System

- Base unit: 4px
- Spacing increments: Multiples of 4 (4px, 8px, 16px, 24px, 32px, etc.)
- Column layout: 12-column grid for desktop, 6-column for tablet, 4-column for mobile

### Responsive Breakpoints

- Mobile: 320px - 639px
- Tablet: 640px - 1023px
- Desktop: 1024px and above

### Page Structure

- Header height: 64px
- Footer height: 80px
- Content max-width: 1200px
- Default page padding: 24px (desktop), 16px (mobile)

## Component Usage Guidelines

### Modals & Dialogs

- Background overlay: 50% opacity black
- Max width: 600px
- Centered on screen
- Close button: Top right corner

### Forms

- Label position: Above input fields
- Error messages: Below input fields in Coral color
- Required fields: Marked with asterisk (\*)
- Form sections: Grouped logically with heading
- Submit buttons: Right-aligned at bottom of form

## Animation & Interaction

### Transitions

- Duration: 200-300ms
- Easing: Ease-in-out
- Use sparingly for meaningful interactions

### Loading States

- Use subtle animations
- Maintain brand colors
- Provide feedback for processes >500ms

## Accessibility Guidelines

- Maintain minimum contrast ratio of 4.5:1 for all text
- Provide text alternatives for non-text content
- Ensure keyboard navigability
- Support screen readers with proper ARIA attributes
- Design focus states that are clearly visible
