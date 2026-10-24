# DESIGN.md — Rental Agreement Red-Flag Reader

Light, quiet, premium. Heavy type does the talking; colour is reserved for meaning (risk), not decoration.

## 1. Principles

1. **Type carries the personality.** Bold, tightly tracked headings. Everything else stays calm.
2. **Colour means something.** Indigo is the only brand colour. Red, amber and green appear only to show risk.
3. **The quote is the hero.** The exact clause from the user's agreement is the most visible element on every flag card.
4. **One radius family, one shadow family.** No gradients, no glass effects, no decorative illustrations.
5. **Hindi is first-class.** Every text style must still look right when the language toggle is set to Hindi.

---

## 2. Colour tokens

### Neutrals (cool paper)
| Token              | Hex       | Use                                         |
| ------------------ | --------- | ------------------------------------------- |
| `--bg`             | `#F6F7F9` | Page background                             |
| `--surface`        | `#FFFFFF` | Cards, inputs                               |
| `--surface-subtle` | `#EEF0F4` | Toggle track, hover fills, code-like blocks |
| `--border`         | `#E4E7EC` | Default 1px borders                         |
| `--border-strong`  | `#CBD0DA` | Input hover, dividers that need weight      |

### Text
| Token               | Hex       | Use                                     |
| ------------------- | --------- | --------------------------------------- |
| `--text`            | `#101828` | Headings, body                          |
| `--text-muted`      | `#5A6475` | Helper text, captions                   |
| `--text-faint`      | `#8A93A3` | Placeholders (never for essential info) |
| `--text-on-primary` | `#FFFFFF` | Text on primary and secondary buttons   |

### Brand
| Token               | Hex       | Use                                              |
| ------------------- | --------- | ------------------------------------------------ |
| `--primary`         | `#2F3E9E` | Primary button, links, focus ring, active toggle |
| `--primary-hover`   | `#24317D` | Primary hover                                    |
| `--primary-pressed` | `#1B2660` | Primary active                                   |
| `--primary-subtle`  | `#E9ECF8` | Tinted backgrounds, selected states              |
| `--secondary`       | `#1D2939` | Secondary button (ink), header strip if used     |
| `--secondary-hover` | `#101828` | Secondary hover                                  |

### Risk (semantic, only for risk)
| Level  | Text / icon | Background | Border    |
| ------ | ----------- | ---------- | --------- |
| High   | `#B42318`   | `#FEF3F2`  | `#FECDCA` |
| Medium | `#B54708`   | `#FFFAEB`  | `#FEDF89` |
| Low    | `#067647`   | `#ECFDF3`  | `#ABEFC6` |

CSS names: `--risk-high`, `--risk-high-bg`, `--risk-high-border`, and the same for `medium` and `low`.

### Quote highlight
| Token              | Hex       | Use                                    |
| ------------------ | --------- | -------------------------------------- |
| `--highlight-bg`   | `#FFF3BF` | Background behind the quoted clause    |
| `--highlight-line` | `#F2C94C` | 2px left bar or underline on the quote |

---

## 3. Typography

### Families
- **Headings:** `Manrope`, weights 700 and 800
- **Body and UI:** `Inter`, weights 400, 500, 600, 700
- **Hindi fallback (both):** `Noto Sans Devanagari`. Manrope and Inter have no Devanagari glyphs, so this is required for the Hindi toggle.

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Manrope:wght@700;800&family=Noto+Sans+Devanagari:wght@400;500;600;700&display=swap" rel="stylesheet">
```

```css
--font-heading: "Manrope", "Noto Sans Devanagari", system-ui, sans-serif;
--font-body: "Inter", "Noto Sans Devanagari", system-ui, sans-serif;
```

### Scale (ratio about 1.25)
| Style      | Size            | Line height | Weight | Letter spacing | Font    |
| ---------- | --------------- | ----------- | ------ | -------------- | ------- |
| Display    | 44px / 2.75rem  | 1.1         | 800    | -0.03em        | Heading |
| H1         | 32px / 2rem     | 1.2         | 800    | -0.02em        | Heading |
| H2         | 24px / 1.5rem   | 1.3         | 800    | -0.02em        | Heading |
| H3         | 20px / 1.25rem  | 1.35        | 700    | -0.01em        | Heading |
| Body large | 18px / 1.125rem | 1.6         | 500    | 0              | Body    |
| Body       | 16px / 1rem     | 1.6         | 500    | 0              | Body    |
| Small      | 14px / 0.875rem | 1.5         | 500    | 0              | Body    |
| Caption    | 12px / 0.75rem  | 1.4         | 600    | 0.01em         | Body    |
| Button     | 16px / 1rem     | 1           | 700    | 0              | Body    |

Rules:
- Body weight is 500, not 400. It reads sturdier on white and fits the bold theme.
- Use sentence case everywhere. No ALL-CAPS labels.
- Keep line length under 75 characters for explanations (`max-width: 68ch`).
- Hindi text: `:lang(hi) { line-height: 1.75; letter-spacing: 0; }`. Devanagari needs more vertical room and must not be tracked negatively.

---

## 4. Spacing (4px base)

| Token        | Value |
| ------------ | ----- |
| `--space-1`  | 4px   |
| `--space-2`  | 8px   |
| `--space-3`  | 12px  |
| `--space-4`  | 16px  |
| `--space-5`  | 20px  |
| `--space-6`  | 24px  |
| `--space-8`  | 32px  |
| `--space-10` | 40px  |
| `--space-12` | 48px  |
| `--space-16` | 64px  |
| `--space-20` | 80px  |

Usage:
- Page padding: 16px on mobile, 24px on tablet, 32px on desktop
- Gap between cards: 16px
- Card inner padding: 24px (20px on mobile)
- Gap between sections: 48px (32px on mobile)
- Gap between label and field: 8px

---

## 5. Radius, borders, shadows

| Token           | Value | Use                              |
| --------------- | ----- | -------------------------------- |
| `--radius-sm`   | 8px   | Badges, small chips, quote block |
| `--radius-md`   | 12px  | Buttons, inputs, toggle          |
| `--radius-lg`   | 16px  | Cards                            |
| `--radius-xl`   | 24px  | Main input panel                 |
| `--radius-pill` | 999px | Risk badge, language toggle      |

Borders: `1px solid var(--border)`.

Shadows (cool-tinted, low opacity):
```css
--shadow-sm: 0 1px 2px rgba(16, 24, 40, 0.06);
--shadow-md: 0 4px 12px -2px rgba(16, 24, 40, 0.08);
--shadow-lg: 0 16px 40px -12px rgba(16, 24, 40, 0.14);
```
Cards use `--shadow-sm` plus a border. Only the main input panel uses `--shadow-md`. `--shadow-lg` is for modals, if any.

---

## 6. Layout

- Single centred column. `--container: 880px`, with `--reading: 68ch` for text inside cards.
- Left-aligned text everywhere. Never justified, never centred except the empty-state message.
- Breakpoints: `sm 640px`, `md 768px`, `lg 1024px`. Build mobile first.

```
┌──────────────────────────────────────┐
│ Title (Display)                      │
│ One-line description (Body large)    │
│                                      │
│ ┌──────────────────────────────────┐ │
│ │ Textarea                         │ │
│ │                                  │ │
│ │ [EN | हिं]   [Load sample] [Analyze]│
│ └──────────────────────────────────┘ │
│                                      │
│ Overall risk badge + summary         │
│ ┌─ Flag card ──────────────────────┐ │
│ │ Category                         │ │
│ │ ▌ "exact quote" (highlighted)    │ │
│ │ Why it's risky                   │ │
│ │ What to ask the owner            │ │
│ └──────────────────────────────────┘ │
│ Missing from your agreement (list)   │
│ Footer disclaimer                    │
└──────────────────────────────────────┘
```

---

## 7. Components

### Buttons
- Height 48px, padding `0 24px`, radius `--radius-md`, font Button style.
- **Primary** (Analyze): bg `--primary`, text white, hover `--primary-hover`, pressed `--primary-pressed`.
- **Secondary** (Load sample): bg `--surface`, text `--text`, `1px solid --border-strong`, hover bg `--surface-subtle`.
- **Disabled:** 45% opacity, `cursor: not-allowed`. While loading, show a spinner and the label "Analyzing".

### Textarea
- bg `--surface`, border `--border`, radius `--radius-md`, padding 16px, min-height 280px, Body style, vertical resize only.
- Hover: border `--border-strong`. Focus: border `--primary` plus focus ring.
- Placeholder colour `--text-faint`: "Paste your rental agreement here".
- Character counter under the field in Caption style. Turn `--risk-high` text at 15,000 characters.

### Language toggle
- Pill track `--surface-subtle`, 4px padding. Two segments, "English" and "हिन्दी".
- Active segment: bg `--surface`, text `--text`, weight 700, `--shadow-sm`. Inactive: text `--text-muted`.

### Risk badge
- Pill, padding `6px 14px`, Caption style at weight 700, 1px border.
- Colours from the Risk table. Text reads "High risk", "Medium risk", "Low risk". Add a 8px filled dot in the risk colour before the text so the meaning does not depend on colour alone.

### Flag card
- bg `--surface`, border `--border`, radius `--radius-lg`, padding 24px, `--shadow-sm`.
- 4px left border in the risk colour of the overall result (or per-flag risk if you add it).
- Order: category (H3) → quote → "Why it's risky" → "What to ask the owner".
- Section labels ("Why it's risky", "What to ask the owner") use Small style at weight 700, colour `--text-muted`. Not uppercase.

### Quote block
- bg `--highlight-bg`, `border-left: 3px solid var(--highlight-line)`, radius `--radius-sm`, padding `12px 16px`, Body style, weight 500.
- Wrap in quotation marks only if the clause is a fragment. Never alter the text.

### Notices
- **Dropped-flags note:** Small style, `--text-muted`, with an info icon. Text: "2 items were removed because they could not be matched to your agreement."
- **Error:** bg `--risk-high-bg`, border `--risk-high-border`, text `--risk-high`, radius `--radius-md`, padding 16px.
- **Footer disclaimer:** Small style, `--text-muted`. Text: "Not legal advice. Your document is never stored."

### Focus ring
```css
:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}
```

---

## 8. Motion

- Default: `150ms ease-out` on colour, border and shadow changes for buttons and inputs.
- Results appear with one fade-in of 200ms. No staggered animations, no hover lift on cards.
- Loading: a simple spinner inside the button, 700ms linear loop.
- Respect reduced motion:
```css
@media (prefers-reduced-motion: reduce) {
  * { animation: none !important; transition: none !important; }
}
```

---

## 9. Voice and copy

- Plain verbs, sentence case, no filler.
- Buttons: "Analyze agreement", "Load sample". Keep the same verb through the flow: after "Analyze agreement" the loading label is "Analyzing", not "Processing".
- Errors say what happened and how to fix it: "The analysis failed. Check your connection and try again." No apologies, no jokes.
- Empty state: "Paste an agreement to see which clauses could cost you money."

---

## 10. Accessibility floor

- Body text contrast at least 4.5:1 on its background. `--text-faint` is for placeholders only.
- Risk is always shown with text as well as colour.
- All interactive elements have a visible focus ring and a minimum 44px touch target on mobile.
- Set `<html lang>` to `en` or `hi` when the toggle changes so the Hindi typography rules apply.

---

## 11. Copy-paste CSS tokens

```css
:root {
  /* neutrals */
  --bg: #F6F7F9;
  --surface: #FFFFFF;
  --surface-subtle: #EEF0F4;
  --border: #E4E7EC;
  --border-strong: #CBD0DA;

  /* text */
  --text: #101828;
  --text-muted: #5A6475;
  --text-faint: #8A93A3;
  --text-on-primary: #FFFFFF;

  /* brand */
  --primary: #2F3E9E;
  --primary-hover: #24317D;
  --primary-pressed: #1B2660;
  --primary-subtle: #E9ECF8;
  --secondary: #1D2939;
  --secondary-hover: #101828;

  /* risk */
  --risk-high: #B42318;   --risk-high-bg: #FEF3F2;   --risk-high-border: #FECDCA;
  --risk-medium: #B54708; --risk-medium-bg: #FFFAEB; --risk-medium-border: #FEDF89;
  --risk-low: #067647;    --risk-low-bg: #ECFDF3;    --risk-low-border: #ABEFC6;

  /* quote */
  --highlight-bg: #FFF3BF;
  --highlight-line: #F2C94C;

  /* type */
  --font-heading: "Manrope", "Noto Sans Devanagari", system-ui, sans-serif;
  --font-body: "Inter", "Noto Sans Devanagari", system-ui, sans-serif;

  /* spacing */
  --space-1: 4px;  --space-2: 8px;  --space-3: 12px; --space-4: 16px;
  --space-5: 20px; --space-6: 24px; --space-8: 32px; --space-10: 40px;
  --space-12: 48px; --space-16: 64px; --space-20: 80px;

  /* radius */
  --radius-sm: 8px; --radius-md: 12px; --radius-lg: 16px; --radius-xl: 24px; --radius-pill: 999px;

  /* shadow */
  --shadow-sm: 0 1px 2px rgba(16, 24, 40, 0.06);
  --shadow-md: 0 4px 12px -2px rgba(16, 24, 40, 0.08);
  --shadow-lg: 0 16px 40px -12px rgba(16, 24, 40, 0.14);

  /* layout */
  --container: 880px;
  --reading: 68ch;
}

body { background: var(--bg); color: var(--text); font-family: var(--font-body); font-weight: 500; line-height: 1.6; }
h1, h2, h3 { font-family: var(--font-heading); }
:lang(hi) { line-height: 1.75; letter-spacing: 0; }
```

---

## 12. Rules for the AI IDE

- Use only the tokens above. Do not invent new colours, fonts or radii.
- No UI library, no Tailwind, no gradients, no emoji icons. Use plain CSS and inline SVG icons.
- No ALL-CAPS labels and no hover lift animations.
- Keep indigo for actions and focus only. Red, amber and green are for risk only.