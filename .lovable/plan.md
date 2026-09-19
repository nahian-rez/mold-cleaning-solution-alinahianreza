# Plan: Add "90-Day Implementation Roadmap" banner + footer link

Isolated, additive change to `src/routes/index.tsx` only. No existing component, slider, calculation, scenario, state, or style is touched.

## 1. New banner section (insert between the hero subtitle and the scenario tabs)

Insert a new block inside the existing hero `<section>` (the `border-b border-border bg-surface-warm` one), placed **after** the `max-w-3xl` title/subtitle `<div>` (ends line 212) and **before** the `mt-7 grid gap-2 sm:grid-cols-3` scenario-tabs `<div>` (starts line 214).

The banner is a bordered callout box with a distinct warm background (`bg-cocoa` / amber border, matching the existing chocolate palette) containing:

- Small uppercase label: **"FULL PROPOSAL & SOURCES"** (styled like the existing `text-xs font-bold uppercase tracking-[0.16em]` eyebrow labels, using `text-amber`).
- Heading: **"90-Day Implementation Roadmap"** (`font-display`, sized ~2xl).
- One supporting line: "See the complete rollout plan, risks, success metrics, and every cited source behind these numbers." (`text-sm`, using cocoa-foreground/75 on the cocoa bg variant).
- A clearly clickable button/link labeled **"View Roadmap & Sources →"** that opens `https://ultrasoniccleanerchoclathonroadmap.netlify.app/` in a **new tab** (`target="_blank"` + `rel="noopener noreferrer"`), styled as a small pill/link using the amber/primary accent tone.

The callout uses only existing design tokens (`bg-cocoa`, `text-cocoa-foreground`, `text-amber`, `border-amber`, `bg-amber`, `text-primary`) — no new CSS, no new classes added to `src/styles.css`.

## 2. Footer secondary link (insert into the existing footer)

In the existing `<footer>` (line 408–411), add a small link **next to** the existing `Cocoa Dolce · Planning estimate only...` line. It is a plain text link labeled **"View Roadmap & Sources →"** pointing to `https://ultrasoniccleanerchoclathonroadmap.netlify.app/`, opening in a new tab, styled to match the footer's existing `text-xs text-muted-foreground` tone. No change to the existing `PRICE_BASIS_NOTE` line or the existing planning-estimate line.

## 3. Verification (after the edit)

- Build stays clean (check `/tmp/observability/build-errors.log`).
- Playwright desktop + mobile: confirm the banner renders between subtitle and scenario tabs, the link opens the right URL, all three scenario tabs still switch the inputs/outputs, sliders still adjust, and Projected return cards still recalculate exactly as before.
- No dollar figures, slider values, scenario data, or calculation logic touched.

## What is NOT changed

- No existing component, function, state variable, constant, scenario preset, slider definition, cost field, `results` calculation, `MetricCard`, `CostBar`, or `src/styles.css` token is modified, renamed, or removed.
- The banner/footer link is purely presentational markup with hardcoded content — no new props, state, or imports beyond the existing `Sparkles` icon (already imported) for optional decoration.
