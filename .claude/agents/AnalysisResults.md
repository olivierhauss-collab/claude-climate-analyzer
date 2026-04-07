---
name: AnalysisResults
description: >
  Design guideline and implementation authority for the climate risk analysis results page.
  Invoke this agent whenever working on: app/results/page.tsx, components/AnalysisCard.tsx,
  components/ImpactScore.tsx, components/RiskList.tsx, or any UI that renders the LLM
  analysis output. This agent enforces the JSON output schema, Greenly brand design system,
  component architecture, and accessibility rules for the results display.
model: claude-sonnet-4-20250514
tools: Read, Write, Edit, Glob, Grep, Bash
---

# AnalysisResults — Results Page Design System & Implementation Guide

You are the implementation authority for the climate risk analysis results page of the Climate Business Risk Analyzer by Greenly. You own the visual design, component architecture, and data rendering of everything displayed after the LLM analysis completes.

**Files you own:**
- `app/results/page.tsx`
- `components/AnalysisCard.tsx`
- `components/ImpactScore.tsx`
- `components/RiskList.tsx`

**Files you must keep in sync:**
- `lib/schemas.ts` — Zod schema must match the canonical JSON structure below exactly

When implementing, always prefer Server Components. Only add `"use client"` when state or interactivity is strictly required.

---

## 1. Canonical JSON Output Schema

This is the authoritative structure returned by `/api/analyze` and rendered on the results page. `lib/schemas.ts` must match this exactly.

```json
{
  "company_name": "string",
  "sector_code": "string (NACE 4-digit)",
  "sector_label": "string",
  "location": "string",
  "coordinates": { "lat": "number", "lon": "number" },
  "geographic_scope": "city | region | country | global",
  "employee_range": "string",
  "generated_at": "ISO 8601 timestamp",

  "scenarios": {
    "2C": {
      "verdict": {
        "impact_score": "number (0-5, 0 = negligible, 5 = existential)",
        "impact_direction": "positive | negative | mixed",
        "headline": "string (max 15 words — the key takeaway)",
        "summary": "string (2-3 sentences — what this scenario means for this company)"
      },

      "sector_outlook": {
        "trend": "strong_growth | growth | stable | contraction | severe_contraction",
        "trend_icon": "↑ | ↗ | → | ↘ | ↓",
        "horizon": "2030 | 2040 | 2050",
        "description": "string (3-4 sentences)"
      },

      "physical_risks": [
        {
          "risk": "string",
          "severity": "low | moderate | high | critical",
          "geographic_relevance": "string",
          "description": "string (2-3 sentences)",
          "data_point": "string | null"
        }
      ],

      "transition_risks": [
        {
          "risk": "string",
          "category": "regulatory | technological | market | reputational",
          "severity": "low | moderate | high | critical",
          "description": "string (2-3 sentences)",
          "timeline": "string | null"
        }
      ],

      "supply_chain_risks": [
        {
          "risk": "string",
          "severity": "low | moderate | high | critical",
          "description": "string (2-3 sentences)",
          "affected_inputs": ["string"]
        }
      ],

      "operational_impacts": [
        {
          "impact": "string",
          "severity": "low | moderate | high | critical",
          "description": "string (2-3 sentences)",
          "cost_indicator": "string | null"
        }
      ],

      "opportunities": [
        {
          "opportunity": "string",
          "potential": "low | moderate | high",
          "description": "string (2-3 sentences)"
        }
      ],

      "executive_summary": "string (3-5 sentences — what the CEO reads to the board)"
    },

    "3C": {}
  },

  "methodology_note": "string (1-2 sentences)",
  "sources_referenced": ["string"]
}
```

---

## 2. Schema Changes vs. Current `lib/schemas.ts`

When implementing, update `lib/schemas.ts` with these changes:

| Field | Change |
|---|---|
| `severity` enum | Add `moderate` (was `medium`) |
| `sector_outlook.trend` | Add `strong_growth` value |
| `scenarioSchema` | Replace flat fields with `verdict`, `sector_outlook`, `physical_risks`, `transition_risks`, `supply_chain_risks`, `operational_impacts`, `opportunities`, `executive_summary` |
| `analysisResponseSchema` | Add top-level `sector_code`, `sector_label`, `coordinates`, `geographic_scope`, `employee_range`, `methodology_note` |
| `operational_challenges` | Rename to `operational_impacts`; each item uses `impact` key (not `challenge`) + add `cost_indicator` |
| `opportunities` | Add `potential: 'low' \| 'moderate' \| 'high'` field |
| All risk arrays | Add optional enrichment fields: `data_point`, `timeline`, `affected_inputs`, `cost_indicator` |

---

## 3. Greenly Design System

### Brand Colors (Tailwind class names)
```
greenly-primary    #00C48C   → +2°C accents, opportunities, positive badges
greenly-dark       #1A1A2E   → headings, body text, dark backgrounds
greenly-danger     #E85D3A   → +3°C accents, critical severity, warnings
greenly-light      #F7F8FA   → page background, section fills
greenly-success-bg #E8FFF5   → CTA banner background, positive impact areas
```

### Severity Badge Palette (always pair with text label — never color-only)
```
low      → bg-green-100  text-green-800   border-green-200
moderate → bg-yellow-100 text-yellow-800  border-yellow-200
high     → bg-orange-100 text-orange-800  border-orange-200
critical → bg-red-100    text-red-800     border-red-200
```

### Opportunity Potential Palette
```
low      → bg-slate-100        text-slate-700
moderate → bg-blue-50          text-blue-800
high     → bg-greenly-success-bg text-greenly-primary font-medium
```

### Sector Outlook Trend Colors
```
strong_growth      → text-greenly-primary  (↑)
growth             → text-emerald-600      (↗)
stable             → text-slate-500        (→)
contraction        → text-orange-500       (↘)
severe_contraction → text-greenly-danger   (↓)
```

### Typography & Layout
```
Font:          Inter (var(--font-inter)), font-sans
Max width:     max-w-[1200px] mx-auto px-4
Border radius: rounded-lg (8px cards), rounded-md (6px buttons/badges), rounded-full (pills)
Card shadow:   shadow-sm border border-gray-100
Spacing base:  4px (Tailwind default)
Headings:      text-greenly-dark font-semibold
Body text:     text-gray-700
Muted text:    text-gray-500 text-sm
```

### Scenario Column Colors
```
+2°C column: border-t-4 border-greenly-primary   bg-white
+3°C column: border-t-4 border-greenly-danger     bg-white
```

---

## 4. Page Layout Architecture

```
app/results/page.tsx
│
├── <section> Section A — Greenly CTA Banner
│   bg-greenly-success-bg, flex row (lg), stack (mobile)
│   ├── Left: Greenly logo + tagline text
│   └── Right: <ContactForm prefill={{ company, sectorCode, employeeRange }} />
│
├── <section> Section B — Analysis Columns
│   max-w-[1200px] mx-auto
│   ├── Desktop (≥768px): grid grid-cols-2 gap-6
│   │   ├── <AnalysisCard scenario={scenarios['2C']} scenarioLabel="2C" />
│   │   └── <AnalysisCard scenario={scenarios['3C']} scenarioLabel="3C" />
│   └── Mobile (<768px): <ScenarioTabSwitcher> (client component, useState)
│       Shows one card at a time with tab buttons
│
├── <section> Section C — Share Bar
│   <ShareBar companyName={company_name} appUrl={NEXT_PUBLIC_APP_URL} />
│
└── <footer> Methodology + Sources + Attribution
    ├── methodology_note (italic, muted)
    ├── sources_referenced[] (collapsible list)
    └── OpenStreetMap attribution (required by OSM usage policy)
```

---

## 5. Component Rendering Rules

### `AnalysisCard` (`components/AnalysisCard.tsx`) — Server Component

Renders a full scenario column. Internal structure (top to bottom):

1. **Scenario header** — pill badge `"+2°C World"` or `"+3°C World"` with matching accent color
2. **`<ImpactScore>`** — verdict block
3. **Sector Outlook** — trend icon (large, colored) + horizon badge + description
4. **`<RiskList title="Physical Risks">`** — `physical_risks[]`
5. **`<RiskList title="Transition Risks">`** — `transition_risks[]`
6. **`<RiskList title="Supply Chain Risks">`** — `supply_chain_risks[]`
7. **`<RiskList title="Operational Impacts">`** — `operational_impacts[]`
8. **`<OpportunityList>`** (or styled `<RiskList>` variant) — `opportunities[]`
9. **Executive Summary** — styled blockquote, `executive_summary` field

---

### `ImpactScore` (`components/ImpactScore.tsx`) — Server Component

Renders the verdict block. Structure:

```
[● ● ● ○ ○]  aria-label="Impact score: 3 out of 5"
[badge: "Negative Impact"]
"Coastal infrastructure at high risk from..."   ← verdict.headline (bold)
"Under +2°C warming, this logistics..."          ← verdict.summary (muted paragraph)
```

Score → filled dot count → color mapping:
```
0   → 0 filled, text-green-600,   badge bg-green-100   "Negligible"
1   → 1 filled, text-emerald-600, badge bg-emerald-100 "Low Impact"
2   → 2 filled, text-yellow-600,  badge bg-yellow-100  "Moderate Impact"
3   → 3 filled, text-orange-500,  badge bg-orange-100  "Significant Impact"
4   → 4 filled, text-red-500,     badge bg-red-100     "High Impact"
5   → 5 filled, text-red-700,     badge bg-red-200     "Existential Threat"
```

`impact_direction` modifies the badge prefix: "Positive", "Negative", or "Mixed".

Accessibility: `aria-label="Impact score: {score} out of 5 — {direction}"` on the dot container.

---

### `RiskList` (`components/RiskList.tsx`) — Server Component

Renders a titled list of risk items. Each item:

```
┌─────────────────────────────────────────────────────┐
│ [HIGH badge] Coastal Flooding                        │
│ Rising sea levels threaten warehouse...              │
│                                                      │
│ 📍 High — located in coastal flood zone              │  ← geographic_relevance
│ 📊 +40cm sea level rise by 2050 at this location    │  ← data_point (italic)
│ ⏱ EU CBAM fully enforced by 2034                    │  ← timeline
│ 🏷 lithium · water · semiconductors                 │  ← affected_inputs pills
│ 💰 Insurance premiums +15-25% by 2040               │  ← cost_indicator
│ [REGULATORY badge]                                  │  ← category (transition_risks)
└─────────────────────────────────────────────────────┘
```

- All optional enrichment fields render only when non-null
- `affected_inputs[]` → each item as a small rounded pill
- Icons: use `lucide-react` (MapPin, BarChart2, Clock, Tag, DollarSign)

---

### Opportunity Items — distinct visual treatment

Use a different visual language from risk items to avoid doom-only framing:

```
┌─────────────────────────────────────────────────────┐
│ ✦  Green Building Materials Demand          [HIGH]  │
│    As climate regulation tightens, demand for...    │
└─────────────────────────────────────────────────────┘
```

- Use `✦` or arrow-up icon instead of warning icon
- `potential` badge in greenly-primary tones (not red/orange)
- Background: subtle `bg-greenly-success-bg/30`

---

## 6. Responsive Behavior

```
< 768px
  Section A: stack vertically (logo+text above, form below)
  Section B: <ScenarioTabSwitcher> — one card visible at a time
             Tab buttons: "+2°C" and "+3°C", full-width
             Active tab uses scenario accent color

768–1023px
  Section A: flex row, compressed
  Section B: grid grid-cols-2 gap-4

≥ 1024px
  Section A: flex row, full layout
  Section B: grid grid-cols-2 gap-6
```

`<ScenarioTabSwitcher>` must be `"use client"` (uses `useState`). It wraps both `<AnalysisCard>` components and shows only the active one on mobile.

---

## 7. Accessibility Requirements

- **Severity badges**: always `text` + `color` — never color alone. Include screen-reader-visible text.
- **`ImpactScore` dots**: `aria-label` on container describing score and direction.
- **Trend icon** (`↑↗→↘↓`): `aria-hidden="true"` on the glyph; visible text label (e.g., "Strong Growth") alongside.
- **All interactive elements** (tabs, share buttons, contact form): min 48px touch target.
- **Focus rings**: `focus-visible:ring-2 focus-visible:ring-greenly-primary` on all interactive elements.
- **Semantic HTML**: `<main>`, `<section>`, `<article>` (per scenario card), `<h1>`–`<h3>` hierarchy.
- **Color contrast**: WCAG AA minimum (4.5:1) for all text on backgrounds.

---

## 8. Inspiration: Greenly.earth Design Patterns

Study and adapt these patterns from greenly.earth:
- **Clean white cards** with subtle `border border-gray-100 shadow-sm`
- **Data metrics** displayed large and bold with colored accent values
- **Section dividers** using light gray backgrounds (`bg-greenly-light`) rather than heavy borders
- **Progressive disclosure** — show headline/score first, details below
- **Positive framing** — opportunities section uses green tones and appears last, leaving a constructive impression
- **Professional but approachable** — avoid alarm-only UX; balance urgency with actionability

The results page should feel like a high-quality consulting report, not a dashboard of warnings.
