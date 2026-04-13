# Design Guidelines — Sana-Inspired SaaS Marketing Site

> **Purpose:** Hand this file to Claude Code alongside your project scaffold. It contains every design decision needed to produce a marketing site with the same refined, editorial, Scandinavian-tech aesthetic found on sanalabs.com — built entirely with **shadcn/ui + Tailwind CSS + Next.js (App Router)**.

---

## 1. Design Philosophy

The Sana aesthetic is **quiet confidence**. It feels like a premium Nordic design magazine — restrained, spacious, and typographically precise — but never boring. Every element earns its place.

**Core principles:**

- **Ultra-generous whitespace.** Sections breathe. The default vertical rhythm between major sections is `py-24 md:py-32 lg:py-40`. Never crowd.
- **Monochrome-first, color-as-punctuation.** The palette is 95% grayscale. Color appears only to draw the eye to a single element per viewport (a CTA, a badge, an accent line).
- **Typography-led hierarchy.** Headlines do the heavy lifting — they are large, tight-tracked, and high-contrast. Supporting text is small, light, and stays out of the way.
- **Flat but layered.** No drop shadows on cards. Depth comes from subtle background tints, rounded containers, and occasional border separators — not elevation.
- **Slow, deliberate motion.** Animations are eased and unhurried (`duration-700`, `ease-out`). Nothing bounces. Nothing flashes.

---

## 2. Color System

### Tailwind `tailwind.config.ts` extension

```ts
colors: {
  // Core grayscale
  surface: {
    DEFAULT: '#FFFFFF',       // page background
    subtle: '#F7F7F8',        // section alternating bg (very light warm gray)
    muted: '#F0F0F2',         // card backgrounds, code blocks
    inset: '#E8E8EC',         // borders, dividers, tag backgrounds
  },
  ink: {
    DEFAULT: '#111111',       // primary text, headlines
    secondary: '#555555',     // body text
    tertiary: '#888888',      // captions, metadata, disabled
    inverse: '#FFFFFF',       // text on dark backgrounds
  },
  accent: {
    DEFAULT: '#111111',       // primary CTA (black pill button)
    hover: '#333333',         // CTA hover
    subtle: '#F0F0F2',        // secondary CTA bg
  },
  // Optional single brand accent — pick ONE warm or cool hue
  brand: {
    DEFAULT: '#4F46E5',       // use sparingly: active tab, progress bar
    light: '#EEF2FF',         // badge background tint
  },
}
```

### Usage rules

- Page background: always `surface` (`#FFFFFF`).
- Alternating sections: toggle between `surface` and `surface-subtle`.
- Cards/containers: `surface-muted` background, `surface-inset` 1px border, `rounded-2xl` or `rounded-3xl`.
- Body text: `ink-secondary`. Never pure black for paragraphs.
- Headlines: `ink` (pure near-black).
- CTAs: Black pill (`accent`) with white text. Secondary CTA is ghost/outline.
- The `brand` color should touch at most **2–3 elements per page** (e.g., an active nav indicator, a small badge, a progress bar).

---

## 3. Typography

### Font stack

| Role | Font | Fallback | Weight | Tailwind class |
|------|------|----------|--------|---------------|
| Headlines | **Inter** or **Söhne** (if licensed) | `font-sans` system stack | 500–600 | `font-medium` / `font-semibold` |
| Body | Same family | — | 400 | `font-normal` |
| Mono/Code | **JetBrains Mono** or **Geist Mono** | `font-mono` | 400 | `font-mono` |

> **Why Inter here?** Sana uses a refined grotesque. Inter is the closest freely available match. If you have Söhne or Roobert licensed, swap them in. The key is a geometric, clean sans-serif with sharp `a` and `g` forms. Avoid Roboto/Arial/Poppins.

### Scale

```css
/* Tailwind classes — apply directly */
.hero-headline     { @apply text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight leading-[1.05]; }
.section-headline  { @apply text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight leading-[1.1]; }
.card-title        { @apply text-xl md:text-2xl font-semibold tracking-tight leading-snug; }
.body-large        { @apply text-lg md:text-xl text-ink-secondary leading-relaxed; }
.body              { @apply text-base text-ink-secondary leading-relaxed; }
.caption           { @apply text-sm text-ink-tertiary leading-normal; }
.eyebrow           { @apply text-xs md:text-sm font-semibold uppercase tracking-widest text-ink-tertiary; }
```

### Rules

- Headlines: Always `tracking-tight` (Tailwind `-0.025em`). Never loose-tracked.
- Maximum body line length: `max-w-2xl` (~65 characters). Never full-width paragraphs.
- Eyebrow labels above sections: uppercase, letter-spaced, small, muted. Often wrapped in a rounded pill/badge.
- No text decoration on links in body copy — use color change on hover instead.

---

## 4. Layout & Spacing

### Grid

```
Container: max-w-7xl mx-auto px-6 md:px-8 lg:px-12
```

- Use CSS Grid (`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3`) for feature cards.
- Asymmetric 60/40 splits for text+image sections: `grid grid-cols-1 lg:grid-cols-5` → text in `col-span-3`, media in `col-span-2`.
- Bento grids for feature showcases: unequal card sizes using `row-span-2`, `col-span-2`.

### Vertical rhythm

| Element | Spacing |
|---------|---------|
| Between major sections | `py-24 md:py-32 lg:py-40` |
| Section headline to content | `mb-12 md:mb-16` |
| Between cards in a grid | `gap-4 md:gap-6` |
| Inside cards (padding) | `p-6 md:p-8 lg:p-10` |
| Eyebrow to headline | `mb-3 md:mb-4` |
| Headline to subtext | `mt-4 md:mt-6` |
| CTA group below text | `mt-8 md:mt-10` |

### Section pattern

Every major section follows this skeleton:

```tsx
<section className="py-24 md:py-32 lg:py-40 bg-surface">        {/* or bg-surface-subtle */}
  <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
    <div className="max-w-3xl">                                   {/* constrain text block */}
      <span className="eyebrow">Eyebrow label</span>
      <h2 className="section-headline mt-3">Section Title</h2>
      <p className="body-large mt-6">Supporting paragraph…</p>
    </div>
    <div className="mt-12 md:mt-16">
      {/* Grid / cards / media here */}
    </div>
  </div>
</section>
```

---

## 5. Components (shadcn/ui Customization)

### 5.1 Buttons

```tsx
// Primary CTA — black pill
<Button className="bg-ink text-ink-inverse rounded-full px-8 py-3 text-sm font-medium
  hover:bg-accent-hover transition-colors duration-300">
  Book an intro
</Button>

// Secondary CTA — ghost/outline pill
<Button variant="outline" className="rounded-full px-8 py-3 text-sm font-medium
  border-surface-inset text-ink hover:bg-surface-subtle transition-colors duration-300">
  Learn more
</Button>

// Text link CTA — with arrow
<Button variant="link" className="text-sm font-medium text-ink group">
  See all features <ArrowRight className="inline ml-1 h-4 w-4 transition-transform
    group-hover:translate-x-1" />
</Button>
```

**Rules:** CTAs are always `rounded-full` (pill shape). Primary is filled black. Never use colored/gradient CTAs. Arrow icons animate on hover with `translate-x-1`.

### 5.2 Cards

```tsx
<Card className="bg-surface-muted border border-surface-inset rounded-2xl overflow-hidden
  hover:border-ink/10 transition-colors duration-300">
  <div className="aspect-[4/3] bg-surface-subtle">
    {/* Image or illustration */}
  </div>
  <CardContent className="p-6 md:p-8">
    <h3 className="card-title">Feature title</h3>
    <p className="body mt-2">Feature description…</p>
  </CardContent>
</Card>
```

**Rules:**
- No box shadows. Depth from background color contrast only.
- `rounded-2xl` (16px) is the default card radius. Use `rounded-3xl` for hero cards.
- Image area inside card uses `aspect-[4/3]` or `aspect-video` with `object-cover`.
- Hover: subtle border darkening, no scale/lift.

### 5.3 Badges / Eyebrow pills

```tsx
<span className="inline-flex items-center rounded-full bg-surface-muted border
  border-surface-inset px-4 py-1.5 text-xs font-semibold uppercase tracking-widest
  text-ink-tertiary">
  Enterprise partnership
</span>
```

### 5.4 Logo ticker / Partner bar

```tsx
<div className="relative overflow-hidden border-y border-surface-inset py-8">
  <div className="flex animate-marquee items-center gap-12 md:gap-16">
    {logos.map(logo => (
      <img key={logo.name} src={logo.src} alt={logo.name}
        className="h-6 md:h-7 opacity-40 grayscale" />
    ))}
    {/* Duplicate set for seamless loop */}
  </div>
</div>
```

**Rules:** Logos are **grayscale**, **40% opacity**, ~28px tall. Infinite horizontal scroll with CSS animation. Bordered top and bottom with a hairline.

```css
@keyframes marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
.animate-marquee {
  animation: marquee 40s linear infinite;
}
```

### 5.5 Testimonial cards

```tsx
<blockquote className="rounded-2xl bg-surface-muted border border-surface-inset p-8 md:p-10">
  <p className="text-lg md:text-xl text-ink leading-relaxed">
    "Quote text here."
  </p>
  <footer className="mt-6 flex items-center gap-4">
    <img src={avatar} className="h-10 w-10 rounded-full object-cover" />
    <div>
      <p className="text-sm font-semibold text-ink">Name</p>
      <p className="text-sm text-ink-tertiary">Title at Company</p>
    </div>
  </footer>
</blockquote>
```

**Rules:** Quote text is larger than body. No quote marks as decorative glyphs. Avatar is small (40px), circular. Carousel of testimonials auto-plays slowly.

### 5.6 Comparison table (Status Quo vs Product)

```tsx
<div className="overflow-x-auto">
  <table className="w-full text-left text-sm">
    <thead>
      <tr className="border-b border-surface-inset">
        <th className="py-4 pr-6 font-semibold text-ink-tertiary w-1/4"></th>
        <th className="py-4 px-6 font-semibold text-ink-tertiary">Status quo</th>
        <th className="py-4 px-6 font-semibold text-ink rounded-t-xl bg-surface-muted">Your Product</th>
      </tr>
    </thead>
    <tbody>
      {rows.map(row => (
        <tr className="border-b border-surface-inset">
          <td className="py-4 pr-6 font-semibold text-ink">{row.label}</td>
          <td className="py-4 px-6 text-ink-secondary">{row.old}</td>
          <td className="py-4 px-6 text-ink bg-surface-muted">{row.new}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
```

The "your product" column has a tinted background to visually distinguish it.

### 5.7 FAQ (Accordion)

Use shadcn `<Accordion>` with these overrides:

```tsx
<Accordion type="single" collapsible className="divide-y divide-surface-inset">
  <AccordionItem value="q1" className="py-6">
    <AccordionTrigger className="text-left text-lg font-semibold text-ink
      hover:no-underline [&[data-state=open]>svg]:rotate-45">
      Question text?
    </AccordionTrigger>
    <AccordionContent className="text-ink-secondary pt-2 pr-12 leading-relaxed">
      Answer text…
    </AccordionContent>
  </AccordionItem>
</Accordion>
```

**Rules:** Trigger icon is a `+` that rotates 45° to become `×`. No background change on open. Clean dividers between items.

---

## 6. Navigation

### Header

```
┌─────────────────────────────────────────────────────────────┐
│  Logo        Nav Links (with dropdowns)        [CTA Button] │
└─────────────────────────────────────────────────────────────┘
```

- Fixed/sticky, `bg-surface/80 backdrop-blur-xl border-b border-surface-inset`.
- Height: `h-16 md:h-18`.
- Logo: simple wordmark, left-aligned.
- Nav links: `text-sm font-medium text-ink-secondary hover:text-ink`.
- Dropdown menus: shadcn `<NavigationMenu>` with `rounded-xl bg-surface border border-surface-inset shadow-lg shadow-black/5` (this is the one place a very subtle shadow is acceptable — for floating overlays only).
- CTA on far right: primary pill button.
- Mobile: hamburger → full-screen overlay or slide-in sheet.

### Footer

- Dark background variant: `bg-ink text-ink-inverse` with `text-ink-inverse/60` for secondary links.
- OR light variant matching the page: `bg-surface-subtle` with standard ink colors.
- Multi-column link grid. Small font. Subtle dividers. Copyright at bottom.

---

## 7. Imagery & Media

- **Product screenshots:** Displayed inside soft containers (`rounded-2xl overflow-hidden bg-surface-muted p-2 md:p-4`). Never floating raw.
- **Aspect ratios:** Hero images `aspect-video` or `aspect-[16/10]`. Card thumbnails `aspect-[4/3]`.
- **Treatment:** Slightly desaturated product UI. Real interface screenshots, not illustrations.
- **Video:** Autoplay, muted, looping for hero demos. Play button overlay for full-length videos.
- **Icons:** Line-style, 1.5px stroke, 24×24 base. Use Lucide icons (included with shadcn). Muted color (`text-ink-tertiary`) unless inside a feature highlight.

---

## 8. Animation & Motion

### Scroll-triggered entrance

Use `framer-motion` (or Tailwind + Intersection Observer):

```tsx
// Fade up on scroll — default for every section
const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] },
};
```

**Rules:**
- Entrance offset: `y: 24` (subtle, not dramatic).
- Duration: 600–800ms. Easing: custom ease-out (never `linear`, never `bounce`).
- Stagger children: `staggerChildren: 0.1` for card grids.
- **No scroll-jacking.** Normal scroll behavior at all times.
- Hero headline can use a clip/reveal animation (words appearing one at a time).

### Hover micro-interactions

- Cards: border color shift (`border-ink/10`). No lift.
- Buttons: background shade shift. Arrow icons: `translate-x-1`.
- Links: color transition `duration-200`.
- Images inside cards: subtle `scale-[1.02]` on parent hover, `duration-500`.

---

## 9. Responsive Strategy

| Breakpoint | Behavior |
|------------|----------|
| `< 640px` (mobile) | Single column. Hero text `text-4xl`. Stacked cards. Hamburger nav. Full-bleed sections. |
| `640–1024px` (tablet) | 2-column grids. Inline nav starts collapsing. |
| `> 1024px` (desktop) | Full layout. 3-column grids. Inline nav. Max-width container. |

- **Never** use horizontal scroll for content (only for the logo ticker).
- Cards stack vertically on mobile with `gap-4`.
- Reduce section padding: mobile `py-16`, tablet `py-24`, desktop `py-32+`.

---

## 10. Page Structure Template

A typical marketing page follows this section order:

```
1. [Nav]              — sticky header
2. [Hero]             — big headline + subtext + CTA + optional hero image/video
3. [Logo bar]         — partner logos, infinite scroll
4. [Overview]         — 1–2 sentence intro + feature grid (bento or 3-col cards)
5. [Feature deep-dive × 3–5] — alternating text-left/image-right, text-right/image-left
6. [Social proof]     — testimonial carousel or grid
7. [Comparison]       — "Status quo vs Us" table
8. [Integrations]     — logo grid of supported tools + security badges
9. [Partnership]      — enterprise support details, CTA
10. [Customer stories] — case study cards linking out
11. [CTA banner]      — full-width dark or tinted bg, headline + CTA
12. [FAQ]             — accordion
13. [Footer]          — multi-column links, copyright
```

---

## 11. shadcn/ui Config Overrides

In your `components.json` or theme layer:

```json
{
  "style": "default",
  "tailwind": {
    "baseColor": "zinc"
  },
  "cssVariables": true
}
```

Override CSS variables in `globals.css`:

```css
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 0 0% 7%;
    --muted: 240 5% 96%;
    --muted-foreground: 0 0% 45%;
    --border: 240 5% 90%;
    --input: 240 5% 90%;
    --ring: 0 0% 7%;
    --radius: 1rem;             /* 16px — rounded-2xl feel */
    --primary: 0 0% 7%;         /* near-black */
    --primary-foreground: 0 0% 100%;
    --secondary: 240 5% 96%;
    --secondary-foreground: 0 0% 7%;
    --accent: 240 5% 96%;
    --accent-foreground: 0 0% 7%;
    --card: 240 5% 97%;
    --card-foreground: 0 0% 7%;
  }
}
```

---

## 12. Do's and Don'ts

### DO

- Use generous padding — when in doubt, add more space.
- Keep headlines tight-tracked and large.
- Constrain body text width (`max-w-2xl`).
- Use grayscale partner logos at low opacity.
- Alternate section backgrounds (white → light gray → white).
- Make CTAs pill-shaped and always black (primary) or outlined (secondary).
- Use real product screenshots inside soft rounded containers.
- Add eyebrow labels above section headlines.
- Keep animations subtle and slow (600–800ms).

### DON'T

- Use colored gradients on buttons or backgrounds.
- Add box-shadows to cards (flat only — use border + bg contrast).
- Use more than one accent color per page.
- Make body text full-width across the container.
- Use icon-heavy feature grids (icons are supplementary, not primary).
- Use bouncy or fast animations.
- Add decorative illustrations or abstract shapes (photography and UI screenshots only).
- Use rounded corners smaller than 12px on cards — 16px (`rounded-2xl`) is the floor.
- Center-align long paragraphs. Left-align body text; only center short headlines + subtext.

---

## 13. Checklist Before Shipping

- [ ] All sections have eyebrow + headline + body text with proper hierarchy
- [ ] `tracking-tight` on every headline
- [ ] Body text never exceeds `max-w-2xl`
- [ ] Cards are `rounded-2xl` with no shadows
- [ ] CTAs are pill-shaped (`rounded-full`)
- [ ] Logo bar is grayscale, low opacity, auto-scrolling
- [ ] Section spacing is `py-24` minimum on desktop
- [ ] Scroll animations are `duration-700` with ease-out
- [ ] Mobile layout is single-column with proper stacking
- [ ] Nav is sticky with backdrop blur
- [ ] No more than 2–3 elements use the brand accent color
- [ ] Footer has multi-column layout with muted text
- [ ] Comparison table has highlighted "product" column
- [ ] FAQ uses accordion with `+` / `×` toggle icon
