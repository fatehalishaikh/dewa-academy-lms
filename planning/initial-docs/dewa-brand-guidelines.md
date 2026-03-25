# DEWA — Brand & Design Guidelines
## For Prototype Website Generation (Light & Dark Theme)

---

## 1. Brand Overview

**Organization:** Dubai Electricity & Water Authority (DEWA)
**Industry:** Government utility — electricity and water services
**Audience:** Dubai residents, builders, partners, suppliers, students
**Tone:** Modern, trustworthy, sustainable, digitally forward, government-grade professionalism
**Language Support:** English (LTR) and Arabic (RTL) — design must accommodate both directions

---

## 2. Color System

### 2.1 Primary Brand Colors

| Token                  | Hex       | Usage                                        |
|------------------------|-----------|----------------------------------------------|
| `--color-primary`      | `#00B8A9` | Primary teal/green — CTAs, active states, links, accent highlights |
| `--color-primary-light`| `#3DD9C8` | Hover states, chart bars, icon fills, active tab indicators |
| `--color-primary-dark` | `#009688` | Pressed/focus states, darker accent contexts |

### 2.2 Secondary & Utility Colors

| Token                    | Hex       | Usage                                      |
|--------------------------|-----------|--------------------------------------------|
| `--color-secondary`      | `#1A73E8` | Informational links, secondary actions      |
| `--color-success`        | `#4CAF50` | Success states, active badges               |
| `--color-warning`        | `#FFC107` | Warnings, pending states                    |
| `--color-danger`         | `#E74C3C` | Emergency hotline icon, error states, alerts|
| `--color-info`           | `#29B6F6` | Info badges, water-related highlights       |

### 2.3 Dark Theme Palette (Primary Theme — matches DEWA Smart App)

| Token                        | Hex         | Usage                                     |
|------------------------------|-------------|-------------------------------------------|
| `--dark-bg-primary`          | `#0A0E13`   | Page/screen background                    |
| `--dark-bg-secondary`        | `#111820`   | Card backgrounds, content sections        |
| `--dark-bg-tertiary`         | `#1A2332`   | Elevated cards, modals, dropdowns         |
| `--dark-bg-input`            | `#1E2A38`   | Input fields, search bars                 |
| `--dark-border`              | `#1F2D3D`   | Card borders, dividers (subtle)           |
| `--dark-border-light`        | `#2A3A4A`   | Hover-state borders                       |
| `--dark-text-primary`        | `#FFFFFF`   | Headings, primary body text               |
| `--dark-text-secondary`      | `#8B9BB4`   | Descriptions, labels, secondary text      |
| `--dark-text-muted`          | `#5A6A7E`   | Placeholders, disabled text               |
| `--dark-surface-highlight`   | `#162029`   | Selected/active row, subtle highlights    |
| `--dark-nav-bg`              | `#0D1117`   | Bottom nav / top nav bar background       |
| `--dark-nav-active`          | `#00B8A9`   | Active nav icon/text                      |
| `--dark-nav-inactive`        | `#5A6A7E`   | Inactive nav icon/text                    |

### 2.4 Light Theme Palette

| Token                         | Hex         | Usage                                    |
|-------------------------------|-------------|------------------------------------------|
| `--light-bg-primary`          | `#F5F7FA`   | Page background                          |
| `--light-bg-secondary`        | `#FFFFFF`   | Card backgrounds, content sections       |
| `--light-bg-tertiary`         | `#F0F2F5`   | Elevated cards, section backgrounds      |
| `--light-bg-input`            | `#EAECF0`   | Input fields, search bars                |
| `--light-border`              | `#E0E4EA`   | Card borders, dividers                   |
| `--light-border-light`        | `#D0D5DD`   | Hover-state borders                      |
| `--light-text-primary`        | `#1A1D23`   | Headings, primary body text              |
| `--light-text-secondary`      | `#5F6B7A`   | Descriptions, labels                     |
| `--light-text-muted`          | `#9AA5B4`   | Placeholders, disabled text              |
| `--light-surface-highlight`   | `#EAF7F5`   | Selected/active row, teal tint           |
| `--light-nav-bg`              | `#FFFFFF`   | Navigation bar background                |
| `--light-nav-active`          | `#00B8A9`   | Active nav icon/text                     |
| `--light-nav-inactive`        | `#9AA5B4`   | Inactive nav icon/text                   |

### 2.5 Gradient Definitions

```css
/* Primary teal gradient — used for hero banners, prominent CTAs */
--gradient-primary: linear-gradient(135deg, #00B8A9 0%, #00D4AA 50%, #7BF5C6 100%);

/* Dark section gradient — used for Discover/promo cards */
--gradient-promo: linear-gradient(135deg, #00B8A9 0%, #56E39F 100%);

/* Donut chart ring gradient (bill display) */
--gradient-ring: conic-gradient(#C8C0E0 0deg, #D8D2EA 180deg, #E8E4F0 360deg);

/* Subtle background gradient for dark theme hero */
--gradient-dark-hero: linear-gradient(180deg, #0A0E13 0%, #111820 100%);
```

---

## 3. Typography

### 3.1 Font Stack

| Role         | Font Family                                 | Fallback                    |
|--------------|---------------------------------------------|-----------------------------|
| Headings     | `"Dubai"`, or `"Montserrat"`, `"Poppins"`  | `"Segoe UI"`, `sans-serif`  |
| Body         | `"Inter"`, `"Open Sans"`                    | `"Segoe UI"`, `sans-serif`  |
| Arabic       | `"Dubai"`, `"Noto Sans Arabic"`             | `"Segoe UI"`, `sans-serif`  |
| Monospace    | `"IBM Plex Mono"`                           | `monospace`                  |

> **Note for Claude Code:** Use Google Fonts CDN. Import `Montserrat:wght@400;500;600;700` and `Inter:wght@300;400;500;600`.

### 3.2 Type Scale

| Element               | Size    | Weight | Line-Height | Letter-Spacing |
|-----------------------|---------|--------|-------------|----------------|
| Hero Title            | 48px    | 700    | 1.15        | -0.02em        |
| Page Title (H1)       | 32px    | 700    | 1.25        | -0.01em        |
| Section Title (H2)    | 24px    | 600    | 1.3         | 0              |
| Card Title (H3)       | 18px    | 600    | 1.4         | 0              |
| Subtitle / Label      | 14px    | 500    | 1.5         | 0.01em         |
| Body                  | 16px    | 400    | 1.6         | 0              |
| Small / Caption       | 13px    | 400    | 1.5         | 0.01em         |
| Overline / Tag        | 11px    | 600    | 1.4         | 0.08em         |
| Bill Amount (Feature) | 40px    | 700    | 1.1         | -0.02em        |

---

## 4. Spacing & Layout

### 4.1 Spacing Scale (8px base)

| Token   | Value  | Usage                                    |
|---------|--------|------------------------------------------|
| `xs`    | 4px    | Inline icon gaps, tight groups            |
| `sm`    | 8px    | Inner card padding (compact), icon margins|
| `md`    | 16px   | Default card padding, stack gaps          |
| `lg`    | 24px   | Section padding, between cards            |
| `xl`    | 32px   | Page section margins                      |
| `2xl`   | 48px   | Hero section padding, major breaks        |
| `3xl`   | 64px   | Top-level page padding                    |

### 4.2 Grid System

| Breakpoint     | Width       | Columns | Gutter |
|----------------|-------------|---------|--------|
| Mobile         | < 768px     | 1       | 16px   |
| Tablet         | 768–1024px  | 2       | 24px   |
| Desktop        | 1025–1440px | 3–4     | 24px   |
| Wide           | > 1440px    | 4       | 32px   |

Max content width: **1280px** (centered).

### 4.3 Border Radius

| Element         | Radius  |
|-----------------|---------|
| Cards           | 16px    |
| Buttons         | 24px (pill) or 12px (standard) |
| Input Fields    | 12px    |
| Tags/Badges     | 8px     |
| Avatars/Icons   | 50% (circle) |
| Bottom Sheet    | 24px 24px 0 0 |

---

## 5. Component Library

### 5.1 Buttons

**Primary CTA (Teal, pill-shaped):**
```css
.btn-primary {
  background: var(--color-primary);
  color: #FFFFFF;
  font-weight: 600;
  font-size: 16px;
  padding: 14px 32px;
  border-radius: 24px;
  border: none;
  transition: all 0.2s ease;
}
.btn-primary:hover {
  background: var(--color-primary-light);
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(0, 184, 169, 0.3);
}
```

**Secondary / Outline Button:**
```css
.btn-secondary {
  background: transparent;
  color: var(--color-primary);
  border: 1.5px solid var(--color-primary);
  padding: 12px 24px;
  border-radius: 24px;
  font-weight: 500;
}
```

**Ghost / Text Button (used in cards like "Proceed", "Apply", "Pay Now"):**
```css
.btn-ghost {
  background: transparent;
  color: var(--dark-text-primary);
  border: 1.5px solid var(--dark-border-light);
  border-radius: 20px;
  padding: 8px 20px;
  font-size: 14px;
  font-weight: 500;
}
```

### 5.2 Cards

**Standard Service Card (dark theme):**
```css
.card {
  background: var(--dark-bg-secondary);
  border: 1px solid var(--dark-border);
  border-radius: 16px;
  padding: 20px;
  transition: border-color 0.2s ease;
}
.card:hover {
  border-color: var(--dark-border-light);
}
```

**Card with Icon + Title + Description + Action (as seen in Services page):**
- Left: 40×40px icon container (teal-tinted background or outlined)
- Center: Title (H3, 16px 600) + Description (14px 400, secondary text color)
- Right: Action button ("Proceed ↗", "Pay Now ↗", "Apply ↗")
- Divider: 1px border-bottom between items, color `var(--dark-border)`

### 5.3 Navigation

**Bottom Tab Bar (mobile — matches DEWA app):**
- 5 tabs: Dashboard, Services, Support, Happiness, Menu
- Active tab: teal icon + teal label
- Inactive tab: muted gray icon + muted label
- Background: `var(--dark-nav-bg)` with subtle top border
- Center tab (Support) is slightly elevated with accent styling

**Top Header Bar:**
- Logo (left), Search icon + Profile avatar (right)
- Background: transparent over hero, solid on scroll
- Height: 64px desktop, 56px mobile

**Desktop Sidebar Navigation (for website — not in app):**
- Role selector tabs: Consumer | Builder | Partner | Government | Supplier
- Active role: teal underline indicator
- Service categories as collapsible accordion sections

### 5.4 Bill Display (Dashboard Hero)

**Donut Chart Component:**
- Circular ring: light purple/lavender gradient `conic-gradient(#C8C0E0, #E8E4F0)`
- Center text: "Total Amount Due" (14px secondary) + "Đ 148.49" (40px bold white)
- "View Summary" link below amount (teal)
- Below ring: large teal pill "Pay Now" button
- Sub-links: "View Bill PDF" • "View Bills & Payments"

### 5.5 Consumption Charts

**Bar Chart Style:**
- Vertical bars, teal/cyan fill (`var(--color-primary-light)`)
- Background: transparent (dark card)
- X-axis: month abbreviations (Jan–Dec), 13px, muted text
- Y-axis: kWh or m³ labels, 13px, muted text
- Toggle controls: "Monthly / Daily" segmented pill, "m³ / IG" unit toggle
- Year selector: horizontal pill group (2022–2026), active year has teal fill

### 5.6 Support Section Components

**AI Chatbot Banner (Rammas):**
- Horizontal card with DubAI logo (left), Rammas branding + "Powered by ChatGPT" (center), mic icon (right)
- Subtle animated/illustrated avatar graphic
- Background: `var(--dark-bg-tertiary)` with slight teal border accent

**Support Channel List:**
- Icon (40px circle, teal or themed) + Title + Optional description + Chevron →
- Items: Smart Response, Live Video/Online Chat (Hayak), Sign Language Call (Ash'ir), Contact Us, FAQs

### 5.7 Form Inputs

```css
.input {
  background: var(--dark-bg-input);
  border: 1.5px solid var(--dark-border);
  border-radius: 12px;
  padding: 14px 16px;
  color: var(--dark-text-primary);
  font-size: 16px;
  transition: border-color 0.2s ease;
}
.input:focus {
  border-color: var(--color-primary);
  outline: none;
  box-shadow: 0 0 0 3px rgba(0, 184, 169, 0.15);
}
```

### 5.8 Tags & Badges

**Active Badge (green):**
```css
.badge-active {
  background: rgba(76, 175, 80, 0.15);
  color: #4CAF50;
  padding: 4px 12px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
}
```

**Account Number Display:**
- "Account 2032865025" with Active badge inline
- Font: monospace for account number, 16px, medium weight

---

## 6. Iconography

### 6.1 Style

- Line icons, 1.5–2px stroke weight
- 24×24px default size (can scale to 20px or 32px)
- Teal fill for active states, muted gray for inactive
- Icon library: Use **Lucide** or **Phosphor Icons** (match DEWA's clean line style)
- Circular icon containers: 40–48px, with subtle teal background `rgba(0, 184, 169, 0.1)`

### 6.2 Specific Icons Referenced in App

| Feature                    | Icon Type                     |
|----------------------------|-------------------------------|
| Request for Support        | Question mark circle (?)      |
| Customer Care Centre       | Phone (teal)                  |
| Emergency Hotline          | Phone (red/danger)            |
| Smart Response             | Robot/AI face                 |
| Live Chat (Hayak)          | Video call / headset          |
| Sign Language (Ash'ir)     | Accessibility / hands         |
| Contact Us                 | Envelope / mail               |
| FAQs                       | Info circle (i)               |
| Away Mode                  | Clock / timer                 |
| Consumption Assessment     | Lightning bolt / zap          |
| Water Alert                | Water drop                    |
| EasyPay                    | Credit card                   |
| Bill Payment               | Document list                 |
| Move-in / Activation       | House with arrow in           |
| Move-to / Transfer         | House with arrows             |
| Dashboard                  | Cloud / home                  |
| Services                   | Grid / apps                   |
| Support                    | Headset                       |
| Happiness                  | Smiley face                   |
| Menu                       | Hamburger / three lines       |
| Search                     | Magnifying glass              |
| Profile                    | User circle                   |

---

## 7. Shadows & Elevation

| Level     | Box-Shadow (Dark)                                         | Box-Shadow (Light)                                           |
|-----------|------------------------------------------------------------|--------------------------------------------------------------|
| Level 0   | none                                                       | none                                                          |
| Level 1   | `0 1px 3px rgba(0,0,0,0.3)`                               | `0 1px 3px rgba(0,0,0,0.08)`                                 |
| Level 2   | `0 4px 12px rgba(0,0,0,0.4)`                              | `0 4px 12px rgba(0,0,0,0.1)`                                 |
| Level 3   | `0 8px 24px rgba(0,0,0,0.5)`                              | `0 8px 24px rgba(0,0,0,0.12)`                                |
| Teal Glow | `0 4px 16px rgba(0,184,169,0.25)`                         | `0 4px 16px rgba(0,184,169,0.2)`                             |

---

## 8. Motion & Transitions

| Interaction          | Duration | Easing                    | Property              |
|----------------------|----------|---------------------------|-----------------------|
| Button hover         | 200ms    | `ease`                    | background, transform |
| Card hover           | 200ms    | `ease`                    | border-color, shadow  |
| Page transitions     | 300ms    | `ease-in-out`             | opacity, transform    |
| Tab switch           | 250ms    | `ease`                    | color, border-bottom  |
| Chart bar animation  | 600ms    | `cubic-bezier(.4,0,.2,1)` | height                |
| Modal entrance       | 300ms    | `cubic-bezier(.16,1,.3,1)` | opacity, transform   |
| Dropdown open        | 200ms    | `ease-out`                | opacity, max-height   |

---

## 9. Page Structure for Prototype Website

### 9.1 Recommended Page Hierarchy

```
Home (Dashboard)
├── Hero: Bill summary (donut chart) + Pay Now CTA
├── Consumption Overview: Electricity + Water charts
├── Quick Actions: Away Mode, Consumption Tool, Water Alert
├── DEWA Store: Promo carousel
└── Discover: Strategic initiatives banner

Services
├── Role Tabs: Consumer | Builder | Partner | Government | Supplier
├── Billing Services: EasyPay, Bill Payment, Tayseer
├── Supply Management: Move-in, Move-to, Move-out
├── Solar Community: Shams Dubai, D33 Policy
└── EV Green Charger

Support
├── Rammas AI Chat Banner
├── Request for Support / Customer Care / Emergency Hotline
├── Support Channels: Smart Response, Live Chat, Sign Language, Contact, FAQs
└── DEWA Locations map

About
├── Brand Story, Vision, Strategy
├── Board of Directors
├── Sustainability
└── News & Media
```

### 9.2 Header

- **Desktop:** Full-width, sticky. Logo left, nav links center, search + language toggle + sign-in right.
- **Mobile:** Logo left, search + profile right. Hamburger for nav.
- Background: solid `var(--dark-nav-bg)` or glass-morphism (`backdrop-filter: blur(12px)`)

### 9.3 Footer

- 4-column layout: Services, About, Support, Connect
- Social media icons row
- Government of Dubai logo + DEWA logo
- Copyright + Privacy Policy + Terms
- Language/accessibility toggles

---

## 10. Dark/Light Theme Toggle Implementation

```css
:root {
  /* Set dark as default (matches DEWA app) */
  --bg-primary: var(--dark-bg-primary);
  --bg-secondary: var(--dark-bg-secondary);
  --text-primary: var(--dark-text-primary);
  --text-secondary: var(--dark-text-secondary);
  /* ... map all tokens ... */
}

[data-theme="light"] {
  --bg-primary: var(--light-bg-primary);
  --bg-secondary: var(--light-bg-secondary);
  --text-primary: var(--light-text-primary);
  --text-secondary: var(--light-text-secondary);
  /* ... remap all tokens ... */
}
```

- Toggle: Sun/Moon icon button in header
- Persist preference in `localStorage`
- Respect `prefers-color-scheme` on first load
- Transition: `transition: background-color 0.3s ease, color 0.3s ease` on `body`

---

## 11. Accessibility Requirements

- WCAG 2.1 AA minimum contrast ratios (4.5:1 body text, 3:1 large text)
- All interactive elements keyboard-focusable with visible focus ring (teal glow)
- ARIA labels on icon-only buttons
- RTL support for Arabic: `dir="rtl"` on `<html>`, mirrored layouts
- Font scaling support: use `rem` units
- Skip-to-content link
- Sign language and video chat accessibility (as featured in app)

---

## 12. Key Visual References from DEWA Smart App

| Screen         | Key Design Patterns                                                 |
|----------------|---------------------------------------------------------------------|
| Dashboard      | Donut bill chart, account badge, Rammas AI bar, Pay Now CTA         |
| Electricity    | Monthly bar chart (teal), year pills, kWh axis, toggle controls     |
| Water          | Monthly bar chart (teal), m³/IG unit toggle, conversion note        |
| Dashboard (lower) | Away Mode toggle, Consumption Tool link, DEWA Store carousel, Discover promo card |
| Services       | Role tabs (icons), categorized service list with action buttons     |
| Support        | Rammas banner, tiered support options, channel list with icons      |

---

## 13. Image & Media Style

- **Photography:** Dubai skyline, solar panels, smart city imagery, clean energy
- **Illustrations:** Flat/semi-flat style, teal + green palette, sustainability themes
- **Hero images:** Full-bleed with dark overlay gradient for text legibility
- **Avatars:** Circular, 40–48px, with border ring

---

## 14. Sample CSS Variables Block (Copy-Paste Ready)

```css
:root {
  /* Brand */
  --color-primary: #00B8A9;
  --color-primary-light: #3DD9C8;
  --color-primary-dark: #009688;
  --color-secondary: #1A73E8;
  --color-success: #4CAF50;
  --color-warning: #FFC107;
  --color-danger: #E74C3C;

  /* Dark Theme (Default) */
  --bg-primary: #0A0E13;
  --bg-secondary: #111820;
  --bg-tertiary: #1A2332;
  --bg-input: #1E2A38;
  --border-default: #1F2D3D;
  --border-light: #2A3A4A;
  --text-primary: #FFFFFF;
  --text-secondary: #8B9BB4;
  --text-muted: #5A6A7E;
  --nav-bg: #0D1117;

  /* Spacing */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  --space-2xl: 48px;
  --space-3xl: 64px;

  /* Radius */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-pill: 24px;
  --radius-circle: 50%;

  /* Shadows */
  --shadow-sm: 0 1px 3px rgba(0,0,0,0.3);
  --shadow-md: 0 4px 12px rgba(0,0,0,0.4);
  --shadow-lg: 0 8px 24px rgba(0,0,0,0.5);
  --shadow-teal: 0 4px 16px rgba(0,184,169,0.25);

  /* Typography */
  --font-heading: 'Montserrat', 'Segoe UI', sans-serif;
  --font-body: 'Inter', 'Segoe UI', sans-serif;
  --font-mono: 'IBM Plex Mono', monospace;
}

[data-theme="light"] {
  --bg-primary: #F5F7FA;
  --bg-secondary: #FFFFFF;
  --bg-tertiary: #F0F2F5;
  --bg-input: #EAECF0;
  --border-default: #E0E4EA;
  --border-light: #D0D5DD;
  --text-primary: #1A1D23;
  --text-secondary: #5F6B7A;
  --text-muted: #9AA5B4;
  --nav-bg: #FFFFFF;
  --shadow-sm: 0 1px 3px rgba(0,0,0,0.08);
  --shadow-md: 0 4px 12px rgba(0,0,0,0.1);
  --shadow-lg: 0 8px 24px rgba(0,0,0,0.12);
  --shadow-teal: 0 4px 16px rgba(0,184,169,0.2);
}
```

---

*End of DEWA Brand & Design Guidelines — v1.0*
*Generated for prototype website development with Claude Code.*
