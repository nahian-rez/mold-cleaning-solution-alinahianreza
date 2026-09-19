# Cocoa Dolce ROI Calculator — Verified Numbers Update

## Goal
Update the existing calculator (src/routes/index.tsx) with the verified scenario numbers and labels the user supplied. Keep the brown/amber chocolate palette, layout, and calculation engine as-is — they already match the requested formulas.

## Changes (all in src/routes/index.tsx)

### 1. Scenario preset values
Replace the `scenarios` object values:

| Field | Realistic | Pessimistic | Optimistic |
|---|---|---|---|
| molds | 250 | 250 | 250 |
| cyclesPerWeek | 2.3 | 2.3 | 2.3 |
| hoursPerCycle | 4 | 4 | 4 |
| peoplePerCycle | 3 | 3 | 3 |
| hourlyRate | 22.94 | 27.20 | 22.94 |
| equipmentCost | 10580 | 23804 | 7930 |
| maintenanceCost | 1000 | 2163 | 500 |
| operatorCost | 14000 | 20000 | 12000 |

### 2. Slider labels (match the user's wording)
Update `inputDefinitions` labels/hints:
- Molds per cycle → "Molds in circulation" (hint: "In rotation")
- Cleaning cycles → "Production cycles" (hint: "Per week")
- Manual cleaning time → "Hours per manual cycle" (hint: "Per cycle")
- Team members → "People per manual cycle" (hint: "Per cycle")
- Loaded hourly rate → "Hourly loaded labor rate" (hint: "Per person")
- Equipment investment → "Equipment cost" (hint: "Capital, one-time")
- Annual maintenance → "Annual maintenance/solution cost" (hint: "Supplies & service")
- Annual operator cost → keep label, hint "Labor allocation"

### 3. Hourly-rate slider precision
The hourly rate now uses cents (22.94, 27.20). Update its `inputDefinitions` entry:
- `step: 0.01`, `min: 15`, `max: 60` (keep range)
- In the value output, allow 2 fraction digits for this field (use `maximumFractionDigits: 2` for the hourly-rate row, keep `1` for others).

### 4. Result card titles
Update the metric card labels to match the requested capitalization:
- "Annual Manual Cost", "Annual Ultrasonic Cost", "Annual Savings", "Payback Period", "3-Year ROI".

### 5. Calculation engine — no change
Current formulas already match the user's spec:
- Annual manual cost = cyclesPerWeek × 52 × hours × people × hourlyRate
- Annual ultrasonic cost = maintenance + operator
- Annual savings = manual − ultrasonic
- Payback months = equipment / annualSavings × 12
- 3-year ROI = annualSavings × 3 − equipment

## Verification (after approval, via Playwright)
- Load the page on desktop (1280×1800) and mobile (390×844) viewports.
- Click each of the three scenario buttons and confirm the five metric cards and the cost-comparison bars update to the correct computed values.
- Spot-check math, e.g. realistic: 2.3×52×4×3×22.94 = 32,953.7 manual cost; ultrasonic = 1000+14000 = 15,000; savings = 17,953.7; payback = 10580/17953.7×12 ≈ 7.1 months; 3-yr ROI = 17953.7×3 − 10580 = 48,281.
- Confirm no build errors in /tmp/observability/build-errors.log.
