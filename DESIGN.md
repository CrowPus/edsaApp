# Design System — EDSA National Customer Platform

## Product & feel
The EDSA (Electricity Distribution and Supply Authority of Sierra Leone) national digital customer platform. It is designed to be a highly trustworthy, precise, and highly accessible utility application for managing electricity prepay, outages, and account status. The personality is official, transparent, and resilient. The layout balances high data density (meter readings, tokens) with very clear primary actions (Buy Token), sitting on stark white canvases for maximum contrast under varying field conditions.

## Principles
- **Trust through clarity:** Financial transactions (tokens) must be unambiguous.
- **Utility before decoration:** No unnecessary gradients or shadows; elements look like what they do.
- **Contrast for legibility:** Strong dark ink on crisp white to remain usable outdoors or on low-end screens.
- **Resilience:** Skeletons and robust empty/error states are baked into every view.

## Colour
Roles based on the official brand constraints:
- **bg**: `#FFFFFF` (Crisp white base)
- **surface**: `#F8FAFC` (Slate 50, subtle separation)
- **surface-raised**: `#FFFFFF` (Cards, modals with subtle shadow)
- **border**: `#E2E8F0` (Slate 200)
- **fg**: `#0B2545` (Deep navy ink for main text)
- **fg-muted**: `#475569` (Slate 600 for secondary text)
- **primary**: `#133E87` (Utility blue for main actions)
- **primary-fg**: `#FFFFFF` (Text on primary)
- **accent**: `#F59E0B` (Electrical energy gold/amber for warnings, highlighted statuses)
- **success**: `#059669` (Emerald 600 for grid normal, successful tokens)
- **success-bg**: `#ECFDF5` (Emerald 50)
- **danger**: `#DC2626` (Red 600 for errors, critical outages)
- **danger-bg**: `#FEF2F2` (Red 50)
- **warning**: `#D97706` (Amber 600)
- **warning-bg**: `#FFFBEB` (Amber 50)
- **focus-ring**: `#3B82F6` (Blue 500)

*(Note: EDSA logo must have a pure white container `#FFFFFF` to keep blue letters and emblem sharp.)*

## Typography
- **Families:**
  - `sans`: System UI (Inter, San Francisco, Roboto) — high legibility.
  - `mono`: System Mono (SF Mono, Menlo, Consolas) — used strictly for meter numbers, STS tokens, and transaction IDs.
- **Scale:**
  - `xs` (12px / 16px): Meta text, timestamps, labels
  - `sm` (14px / 20px): Secondary body, small buttons
  - `base` (16px / 24px): Primary body, main inputs, button labels
  - `lg` (18px / 28px): Subheadings, card titles
  - `xl` (20px / 28px): Modal headers, screen titles
  - `2xl` (24px / 32px) / `3xl` (30px / 36px): Primary display figures (kWh balances, currency amounts)
- **Tabular figures:** Monospace font or `tabular-nums` used for all token numbers and balances.

## Spacing & layout
- **Scale:** 4px (1), 8px (2), 12px (3), 16px (4), 24px (6), 32px (8), 48px (12).
- **Max Content Width:** Mobile scales full-width; desktop caps at 1024px with centered alignment and generous side margins.
- **Section Rhythm:** 24px between sibling components on mobile, 32px on desktop.

## Radius & elevation
- **Radius:** 
  - Buttons, inputs, small tags: `8px` (`rounded-lg`)
  - Cards, modals, large surfaces: `16px` (`rounded-2xl`)
  - Full-pill for status badges: `9999px` (`rounded-full`)
- **Elevation:** 
  - `shadow-sm` (`0 1px 2px 0 rgb(0 0 0 / 0.05)`) for inputs and headers.
  - `shadow-md` (`0 4px 6px -1px rgb(0 0 0 / 0.1)`) for raised cards.
  - `shadow-xl` for modal dialogs.
  - Borders (`1px solid #E2E8F0`) used more prominently than shadows to define structure.

## Components
- **Buttons:** 
  - Primary: `#133E87` bg, `#FFFFFF` text, `rounded-lg`, `font-bold`.
  - Secondary/Outline: `#FFFFFF` bg, `#133E87` text, `border border-blue-800`.
  - Ghost: Transparent bg, `#475569` text (for dismiss, cancel).
- **Inputs:** `border-slate-200`, `rounded-lg`, `px-4 py-3`, `#0B2545` text, focus state with ring.
- **Cards:** `#FFFFFF` bg, `rounded-2xl`, `border-slate-200`, 16px padding.
- **Badges/Chips:** Soft backgrounds (`bg-blue-50`, `bg-emerald-50`) with strong foreground (`text-blue-900`, `text-emerald-900`).
- **STS Token Display:** Distinctive visual treatment. Monospace font, chunked numbers (e.g. `1234 5678 9012 3456`), high contrast background (e.g. faint amber or slate-50).

## States
- **Empty:** Clear illustrations (or distinct icons), grey text, prominent call-to-action button.
- **Loading:** Skeleton loaders mirroring the layout (no jumping content).
- **Error:** Red backgrounds or borders, explicit recovery action (Retry).
- **Success:** Emerald green checkmarks, explicit confirmation of the transaction/action.

## Motion
- **Web/App transitions:** Standard React Navigation / Expo Router transitions.
- **Micro-interactions:** Fast opacity changes (`active:opacity-80`) on buttons and list items. 
- **Duration:** 150ms for color/opacity transitions.

## Accessibility
- **Contrast:** AA targets met (e.g. white text on `#133E87`, `#0B2545` text on white/slate-50).
- **Target sizes:** 44px min-height for all touch targets.
- **Non-color cues:** Icons paired with text for statuses (Zap for active, AlertTriangle for issues).

## Implementation
Tokens defined in `tailwind.config.js` under `colors.edsa`. Consumed via NativeWind class names. Monospaced elements handled via `font-mono`.
