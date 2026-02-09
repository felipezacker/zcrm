# Design Tokens Changelog

All notable changes to the ZCRM Design Tokens will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-02-09

### 🎉 Initial Release

First stable release of the ZCRM Design System tokens.

### Added

#### Colors
- **Neutral palette** (50-900) based on Slate
- **Primary palette** (50-900) based on Sky blue
- **Semantic colors**: success, error, warning, info
- **Surface colors**: background, surface, surface-hover
- **Foreground colors**: primary, secondary, tertiary

#### Typography
- **Font families**: Inter (sans), Space Grotesk (display), Cinzel (serif)
- **Font sizes**: xs (12px) to 4xl (36px)
- **Font weights**: normal, medium, semibold, bold
- **Line heights**: tight, normal, relaxed

#### Spacing
- Scale: xs (4px), sm (8px), md (16px), lg (24px), xl (32px), 2xl (48px), 3xl (64px)

#### Borders
- **Radius**: none, sm, md, lg, xl, full
- **Width**: thin (1px), normal (2px), thick (4px)

#### Shadows
- Levels: none, sm, md, lg

#### Component Tokens
- Button (primary, destructive)
- Input (background, border, focus states)
- Card (background, border, shadow)
- Modal (background, overlay, shadow)

### Dark Mode Support
- Full dark mode via `[data-theme="dark"]` or `prefers-color-scheme: dark`
- All semantic tokens automatically switch between light and dark variants

### Export Formats
- `tokens.css` - CSS Custom Properties
- `tokens.json` - JSON for JavaScript/mobile consumption
- `tokens.tailwind.js` - Tailwind CSS v4 compatible
- `tokens.yaml` - YAML source format

---

## [Unreleased]

### Planned
- Additional component tokens (Table, Dropdown, Tabs)
- Animation/transition tokens
- Responsive breakpoint tokens
- Container width tokens

---

## Migration Guide

### From Hardcoded Values

```diff
- <button className="bg-blue-500 hover:bg-blue-600 text-white">
+ <button className="bg-primary hover:bg-primary-hover text-foreground">
```

### CSS Variable Usage

```css
.my-component {
  background: var(--color-background);
  color: var(--color-foreground);
  border: 1px solid var(--color-divider);
  border-radius: var(--border-radius-md);
  padding: var(--space-md);
}
```

---

## Files

| File | Format | Usage |
|------|--------|-------|
| `tokens.css` | CSS | Import in HTML/Next.js |
| `tokens.json` | JSON | JavaScript/TypeScript, Mobile (React Native) |
| `tokens.tailwind.js` | JS | Tailwind config `theme.extend` |
| `tokens.yaml` | YAML | Source of truth, editing |

---

## Contributors

- **Uma** (UX-Design-Expert) - Initial token extraction and design system audit
- **Dev Team** - Component refactoring and integration
