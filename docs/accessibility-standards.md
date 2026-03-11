# Accessibility Standards

## Overview

This project enforces **basic accessibility by default** and provides a **configurable path to WCAG AA compliance**.

---

## Default (Always Enforced)

### Semantic HTML

- Use semantic elements: `<main>`, `<nav>`, `<header>`, `<footer>`, `<section>`, `<article>`
- MUI components handle most semantics automatically

### Images

- All `<img>` elements must have `alt` text
- Decorative images: `alt=""`

### Interactive Elements

- All buttons must be keyboard accessible (MUI default)
- Icon-only buttons need `aria-label`:
  ```tsx
  <IconButton aria-label="Delete item" onClick={onDelete}>
    <DeleteIcon />
  </IconButton>
  ```
- Links must have descriptive text (not "click here")

### Forms

- All inputs must have associated labels (MUI `TextField` handles this)
- Error messages must be programmatically associated with inputs

### Focus Management

- Visible focus indicators (MUI default)
- Logical tab order
- Focus trapping in modals/dialogs (MUI `Dialog` handles this)

### Color

- Don't rely on color alone to convey information
- Ensure text is readable against backgrounds

---

## WCAG AA Compliance (Configurable)

Enable WCAG AA compliance when the project requires it. Checklist:

### Perceivable

- [ ] Color contrast ratio ≥ 4.5:1 for normal text, 3:1 for large text
- [ ] Text resizable up to 200% without loss of content
- [ ] All non-text content has text alternatives
- [ ] No content flashes more than 3 times per second

### Operable

- [ ] All functionality available via keyboard
- [ ] No keyboard traps
- [ ] Skip navigation links for repetitive content
- [ ] Page titles are descriptive and unique
- [ ] Focus order is meaningful
- [ ] Touch targets ≥ 44x44px

### Understandable

- [ ] Language of page specified (`lang` attribute)
- [ ] Consistent navigation across pages
- [ ] Form validation errors clearly identified and described
- [ ] Labels and instructions provided for user input

### Robust

- [ ] Valid HTML
- [ ] ARIA used correctly (roles, states, properties)
- [ ] Name, role, value available for all UI components

## Testing Accessibility

### Automated

- Use `eslint-plugin-jsx-a11y` (included in ESLint config)
- Consider adding `@axe-core/react` for runtime checks in development

### Manual

- Keyboard-only navigation testing
- Screen reader testing (VoiceOver on Mac, NVDA on Windows)
- Color contrast checker tools
