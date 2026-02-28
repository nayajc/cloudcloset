# CloudCloset Branding Guidelines

## Brand Name
- Full name: **CloudCloset**
- "Cloud" is always styled in **bold blue** (`#000DFF`, `font-extrabold`)
- "Closet" is always styled in **black** (`font-bold`)
- Developer: **C.Threads**

## Logo
- File: `public/logo.png`
- The logo image must **never** have a visible border/outline
- Border-radius: `rounded-2xl` with subtle shadow (`shadow-sm`)

## Theme Color
- Primary: `#0ea5e9` (sky-500, used for gradients, PWA theme)
- Brand accent: `#000DFF` (used for "Cloud" text only)

## Reusable Component
All UI instances of the CloudCloset brand name should use:
```tsx
import { BrandLogo } from '@/components/ui/BrandLogo'

// Sizes: 'sm' (navbar), 'md' (cards), 'lg' (auth pages)
// showIcon: true to include the logo image
<BrandLogo size="sm" showIcon />
```

## Usage Locations
| Location | Size | Icon |
|---|---|---|
| Navbar header | `sm` | ✅ |
| Login page | `lg` | ✅ |
| Update password page | `lg` | ✅ |
| Contact page | `md` | ❌ |
| Onboarding page | `lg` | ✅ |
