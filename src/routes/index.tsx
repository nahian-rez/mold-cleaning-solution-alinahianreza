import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowDownRight,
  Banknote,
  Check,
  Clock3,
  Gauge,
  Package,
  RotateCcw,
  Sparkles,
  TrendingUp,
  Truck,
  Users,
  Waves,
  Wrench,
} from "lucide-react";
import { useMemo, useState, type ComponentType, type CSSProperties } from "react";

type ScenarioKey = "pessimistic" | "realistic" | "optimistic";

const BASE_EQUIPMENT_COST = 7170;
const EQUIPMENT_MODEL = "SharperTek XP1500-21G";
const PRICE_BASIS_NOTE =
  "Price basis: SharperTek XP1500-21G, 21-gallon professional-economy ultrasonic cleaner; equipment-only price: $7,170.00.";

type Inputs = {
  molds: number;
  cyclesPerWeek: number;
  hoursPerCycle: number;
  peoplePerCycle: number;
  hourlyRate: number;
  operatorCost: number;
  baseEquipmentCost: number;
  salesTax: number;
  freight: number;
  installation: number;
  accessories: number;
  maintenanceCost: number;
};

const costDefaults = {
  baseEquipmentCost: BASE_EQUIPMENT_COST,
  salesTax: 0,
  freight: 0,
  installation: 0,
  accessories: 0,
  maintenanceCost: 0,
};

const scenarios: Record<ScenarioKey, Inputs & { label: string; detail: string }> = {
  pessimistic: {
    molds: 250,
    cyclesPerWeek: 2.3,
    hoursPerCycle: 4,
    peoplePerCycle: 3,
    hourlyRate: 27.2,
    operatorCost: 20000,
    ...costDefaults,
    label: "Pessimistic",
    detail: "Higher labor & support",
  },
  realistic: {
    molds: 250,
    cyclesPerWeek: 2.3,
    hoursPerCycle: 4,
    peoplePerCycle: 3,
    hourlyRate: 22.94,
    operatorCost: 14000,
    ...costDefaults,
    label: "Realistic",
    detail: "Best estimate",
  },
  optimistic: {
    molds: 250,
    cyclesPerWeek: 2.3,
    hoursPerCycle: 4,
    peoplePerCycle: 3,
    hourlyRate: 22.94,
    operatorCost: 12000,
    ...costDefaults,
    label: "Optimistic",
    detail: "Lower support load",
  },
};

const inputDefinitions: Array<{
  key: keyof Inputs;
  label: string;
  hint: string;
  min: number;
  max: number;
  step: number;
  digits: number;
  prefix?: string;
  suffix?: string;
  icon: ComponentType<{ className?: string }>;
}> = [
  { key: "molds", label: "Molds in circulation", hint: "In rotation", min: 50, max: 500, step: 10, digits: 0, icon: Gauge },
  { key: "cyclesPerWeek", label: "Production cycles", hint: "Per week", min: 0.5, max: 7, step: 0.1, digits: 1, suffix: "×", icon: RotateCcw },
  { key: "hoursPerCycle", label: "Hours per manual cycle", hint: "Per cycle", min: 1, max: 8, step: 0.5, digits: 1, suffix: " hrs", icon: Clock3 },
  { key: "peoplePerCycle", label: "People per manual cycle", hint: "Per cycle", min: 1, max: 8, step: 1, digits: 0, icon: Users },
  { key: "hourlyRate", label: "Hourly loaded labor rate", hint: "Per person", min: 15, max: 60, step: 0.01, digits: 2, prefix: "$", suffix: "/hr", icon: Banknote },
  { key: "operatorCost", label: "Annual operator cost", hint: "Labor allocation", min: 0, max: 40000, step: 500, digits: 0, prefix: "$", icon: Users },
];

const costFields: Array<{
  key: keyof Inputs;
  label: string;
  hint: string;
  icon: ComponentType<{ className?: string }>;
}> = [
  { key: "baseEquipmentCost", label: "Base Equipment Cost", hint: `${EQUIPMENT_MODEL} · equipment only`, icon: Waves },
  { key: "salesTax", label: "Sales Tax", hint: "One-time", icon: Banknote },
  { key: "freight", label: "Freight / Shipping", hint: "One-time", icon: Truck },
  { key: "installation", label: "Installation / Setup", hint: "One-time", icon: Wrench },
  { key: "accessories", label: "Accessories / Racks", hint: "One-time", icon: Package },
  { key: "maintenanceCost", label: "Annual Maintenance", hint: "Recurring, per year", icon: Gauge },
];

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const currencyExact = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Mold Cleaning ROI Calculator | Cocoa Dolce" },
      { name: "description", content: "Compare manual and ultrasonic mold-cleaning costs, savings, payback, and three-year ROI for Cocoa Dolce." },
      { property: "og:title", content: "Mold Cleaning ROI Calculator | Cocoa Dolce" },
      { property: "og:description", content: "Model the annual savings and payback of ultrasonic mold cleaning." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MoldBottleneckCalculator,
});

function MoldBottleneckCalculator() {
  const [scenario, setScenario] = useState<ScenarioKey>("realistic");
  const [inputs, setInputs] = useState<Inputs>(scenarios.realistic);

  const results = useMemo(() => {
    const cyclesPerYear = inputs.cyclesPerWeek * 52;
    const manualCostPerCycle = inputs.hoursPerCycle * inputs.peoplePerCycle * inputs.hourlyRate;
    const annualManualCost = cyclesPerYear * manualCostPerCycle;
    const annualSolutionCost = inputs.maintenanceCost + inputs.operatorCost;
    const annualSavings = annualManualCost - annualSolutionCost;
    const totalInitialInvestment =
      inputs.baseEquipmentCost + inputs.salesTax + inputs.freight + inputs.installation + inputs.accessories;
    const paybackMonths = annualSavings > 0 ? (totalInitialInvestment / annualSavings) * 12 : null;
    const threeYearROI = annualSavings * 3 - totalInitialInvestment;
    return {
      cyclesPerYear,
      annualManualCost,
      annualSolutionCost,
      annualSavings,
      totalInitialInvestment,
      paybackMonths,
      threeYearROI,
    };
  }, [inputs]);

  const maxCost = Math.max(results.annualManualCost, results.annualSolutionCost, 1);
  const savingsPositive = results.annualSavings >= 0;

  function selectScenario(key: ScenarioKey) {
    setScenario(key);
    setInputs(scenarios[key]);
  }

  function updateInput(key: keyof Inputs, value: number) {
    setInputs((current) => ({ ...current, [key]: value }));
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-cocoa text-cocoa-foreground">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-5 py-4 sm:px-8 lg:px-12">
          <div className="flex items-center gap-3">
            <div className="grid size-9 place-items-center rounded-md border border-cocoa-foreground/20 bg-cocoa-foreground/10">
              <Sparkles className="size-4 text-amber" aria-hidden="true" />
            </div>
            <div>
              <p className="font-display text-lg leading-none">Cocoa Dolce</p>
              <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-cocoa-foreground/60">Operations Lab</p>
            </div>
          </div>
          <div className="hidden items-center gap-2 text-xs text-cocoa-foreground/60 sm:flex">
            <span className="size-1.5 rounded-full bg-success" />
            Live cost model
          </div>
        </div>
      </header>

      <section className="border-b border-border bg-surface-warm">
        <div className="mx-auto max-w-[1440px] px-5 py-8 sm:px-8 sm:py-10 lg:px-12">
          <div className="max-w-3xl">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-primary">Capital planning · Mold room</p>
            <h1 className="font-display text-4xl leading-[1.05] sm:text-5xl lg:text-6xl">Mold cleaning ROI calculator</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
              Model the labor savings and payback of moving from manual cleaning to an ultrasonic process with the {EQUIPMENT_MODEL}.
            </p>
          </div>

          <div className="mt-7 grid gap-2 sm:grid-cols-3" role="group" aria-label="Scenario presets">
            {(Object.keys(scenarios) as ScenarioKey[]).map((key) => {
              const item = scenarios[key];
              const active = scenario === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => selectScenario(key)}
                  aria-pressed={active}
                  className={`flex min-h-16 items-center justify-between rounded-md border px-4 py-3 text-left transition-colors ${
                    active
                      ? "border-primary bg-primary text-primary-foreground shadow-sm"
                      : "border-border bg-background text-foreground hover:border-primary/40 hover:bg-accent"
                  }`}
                >
                  <span>
                    <span className="block text-sm font-bold">{item.label}</span>
                    <span className={`mt-0.5 block text-xs ${active ? "text-primary-foreground/70" : "text-muted-foreground"}`}>{item.detail}</span>
                  </span>
                  {active && <Check className="size-4 shrink-0" aria-hidden="true" />}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-[1440px] gap-8 px-5 py-8 sm:px-8 lg:grid-cols-[minmax(0,0.88fr)_minmax(480px,1.12fr)] lg:px-12 lg:py-10">
        <section aria-labelledby="assumptions-title">
          <div className="mb-5 flex items-end justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">Your assumptions</p>
              <h2 id="assumptions-title" className="mt-1 font-display text-2xl">Tune the operation</h2>
            </div>
            <button
              type="button"
              onClick={() => selectScenario("realistic")}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground transition-colors hover:text-primary"
            >
              <RotateCcw className="size-3.5" aria-hidden="true" /> Reset
            </button>
          </div>

          <div className="divide-y divide-border border-y border-border">
            {inputDefinitions.map((definition) => {
              const Icon = definition.icon;
              const value = inputs[definition.key];
              const progress = ((value - definition.min) / (definition.max - definition.min)) * 100;
              return (
                <div key={definition.key} className="py-4 sm:py-5">
                  <div className="mb-3 flex items-center justify-between gap-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="grid size-8 shrink-0 place-items-center rounded-md bg-accent text-primary">
                        <Icon className="size-4" aria-hidden="true" />
                      </span>
                      <span>
                        <label htmlFor={definition.key} className="block text-sm font-bold">{definition.label}</label>
                        <span className="block text-xs text-muted-foreground">{definition.hint}</span>
                      </span>
                    </div>
                    <output htmlFor={definition.key} className="shrink-0 font-mono text-sm font-bold tabular-nums text-primary">
                      {definition.prefix}{value.toLocaleString("en-US", { maximumFractionDigits: definition.digits })}{definition.suffix}
                    </output>
                  </div>
                  <input
                    id={definition.key}
                    type="range"
                    min={definition.min}
                    max={definition.max}
                    step={definition.step}
                    value={value}
                    onChange={(event) => updateInput(definition.key, Number(event.target.value))}
                    aria-label={definition.label}
                    className="cost-slider w-full"
                    style={{ "--range-progress": `${progress}%` } as CSSProperties}
                  />
                </div>
              );
            })}
          </div>

          <div className="mt-8">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">Investment costs</p>
            <h3 className="mt-1 font-display text-2xl">Equipment &amp; one-time costs</h3>
            <p className="mt-2 text-xs text-muted-foreground">Enter your own figures. All add-on costs start at $0.00.</p>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {costFields.map((field) => {
                const Icon = field.icon;
                return (
                  <div key={field.key} className="rounded-md border border-border bg-card p-4">
                    <div className="flex items-center gap-2">
                      <span className="grid size-7 shrink-0 place-items-center rounded-sm bg-accent text-primary">
                        <Icon className="size-3.5" aria-hidden="true" />
                      </span>
                      <label htmlFor={field.key} className="text-sm font-bold">{field.label}</label>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{field.hint}</p>
                    <div className="mt-3 flex items-center gap-2 rounded-sm border border-border bg-background px-3 py-2 focus-within:border-primary">
                      <span className="font-mono text-sm text-muted-foreground">$</span>
                      <input
                        id={field.key}
                        type="number"
                        min={0}
                        step="0.01"
                        inputMode="decimal"
                        value={inputs[field.key]}
                        onChange={(event) => updateInput(field.key, Number(event.target.value) || 0)}
                        className="w-full bg-transparent font-mono text-sm font-bold tabular-nums text-foreground outline-none"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section aria-labelledby="results-title" className="lg:sticky lg:top-6 lg:self-start">
          <div className="mb-5">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">Business case</p>
            <h2 id="results-title" className="mt-1 font-display text-2xl">Projected return</h2>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <MetricCard label="Base Equipment Cost" value={currencyExact.format(inputs.baseEquipmentCost)} icon={Waves} tone="solution" />
            <MetricCard label="Total Initial Investment" value={currencyExact.format(results.totalInitialInvestment)} icon={Package} tone="neutral" />
            <MetricCard label="Annual Manual Cost" value={currency.format(results.annualManualCost)} icon={Users} tone="manual" />
            <MetricCard label="Annual Ultrasonic Cost" value={currency.format(results.annualSolutionCost)} icon={Waves} tone="solution" />
            <MetricCard
              label="Annual Savings"
              value={currency.format(results.annualSavings)}
              icon={ArrowDownRight}
              tone={savingsPositive ? "savings" : "manual"}
              featured
            />
            <MetricCard
              label="Payback Period"
              value={results.paybackMonths ? `${results.paybackMonths.toFixed(1)} months` : "No payback"}
              icon={Clock3}
              tone="neutral"
            />
            <MetricCard
              label="3-Year ROI"
              value={currency.format(results.threeYearROI)}
              icon={TrendingUp}
              tone={results.threeYearROI >= 0 ? "savings" : "manual"}
              wide
            />
          </div>

          <div className="mt-5 rounded-md border border-border bg-card p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-display text-xl">Annual cost comparison</h3>
                <p className="mt-1 text-xs text-muted-foreground">Current {scenarios[scenario].label.toLowerCase()} scenario</p>
              </div>
              <span className={`rounded-sm px-2 py-1 text-xs font-bold ${savingsPositive ? "bg-success-soft text-success" : "bg-manual-soft text-manual"}`}>
                {savingsPositive ? `${Math.round((results.annualSavings / Math.max(results.annualManualCost, 1)) * 100)}% lower` : "Higher cost"}
              </span>
            </div>

            <div className="mt-7 space-y-6">
              <CostBar label="Manual cleaning" value={results.annualManualCost} max={maxCost} color="bg-manual" />
              <CostBar label="Ultrasonic cleaning" value={results.annualSolutionCost} max={maxCost} color="bg-solution" />
            </div>

            <div className={`mt-7 flex items-center justify-between gap-4 border-t pt-5 ${savingsPositive ? "border-success/25" : "border-manual/25"}`}>
              <div className="flex items-center gap-2 text-sm font-bold">
                <span className={`size-2.5 rounded-full ${savingsPositive ? "bg-success" : "bg-manual"}`} />
                Annual savings
              </div>
              <span className={`font-display text-2xl ${savingsPositive ? "text-success" : "text-manual"}`}>{currency.format(results.annualSavings)}</span>
            </div>
          </div>

          <div className="mt-4 flex items-start gap-3 rounded-md bg-cocoa px-5 py-4 text-cocoa-foreground">
            <Sparkles className="mt-0.5 size-4 shrink-0 text-amber" aria-hidden="true" />
            <p className="text-sm leading-6 text-cocoa-foreground/75">
              At <strong className="text-cocoa-foreground">{Math.round(results.cyclesPerYear)} cycles per year</strong>, the model includes recurring maintenance and operator labor. Payback and ROI use the Total Initial Investment.
            </p>
          </div>

          <div className="mt-4 rounded-md border border-border bg-surface-warm px-5 py-4">
            <p className="text-sm font-bold">Assumptions</p>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">{PRICE_BASIS_NOTE}</p>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              This equipment-only price excludes sales tax, freight/shipping, installation/setup, and accessories/racks. It is not an installed or turnkey price. Enter those costs above to see the fully loaded Total Initial Investment.
            </p>
          </div>
        </section>
      </div>

      <footer className="border-t border-border px-5 py-6 text-center text-xs text-muted-foreground">
        <p>{PRICE_BASIS_NOTE}</p>
        <p className="mt-1">Cocoa Dolce · Planning estimate only · Validate inputs before capital approval</p>
      </footer>
    </main>
  );
}

function MetricCard({
  label,
  value,
  icon: Icon,
  tone,
  featured = false,
  wide = false,
}: {
  label: string;
  value: string;
  icon: ComponentType<{ className?: string }>;
  tone: "manual" | "solution" | "savings" | "neutral";
  featured?: boolean;
  wide?: boolean;
}) {
  const tones = {
    manual: "text-manual bg-manual-soft",
    solution: "text-solution bg-solution-soft",
    savings: "text-success bg-success-soft",
    neutral: "text-primary bg-accent",
  };
  return (
    <article className={`${wide ? "col-span-2" : ""} ${featured ? "border-success/30 bg-success-soft/40" : "bg-card"} min-w-0 rounded-md border border-border p-4 sm:p-5`}>
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-bold text-muted-foreground">{label}</p>
        <span className={`grid size-7 shrink-0 place-items-center rounded-sm ${tones[tone]}`}><Icon className="size-3.5" aria-hidden="true" /></span>
      </div>
      <p className={`mt-4 break-words font-display text-[clamp(1.35rem,3vw,2rem)] leading-none ${tone === "savings" ? "text-success" : tone === "manual" ? "text-manual" : tone === "solution" ? "text-solution" : "text-foreground"}`}>{value}</p>
    </article>
  );
}

function CostBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const width = Math.max((value / max) * 100, value > 0 ? 4 : 0);
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3 text-sm">
        <span className="font-bold">{label}</span>
        <span className="font-mono font-bold tabular-nums">{currency.format(value)}</span>
      </div>
      <div className="h-3 overflow-hidden rounded-sm bg-muted" aria-hidden="true">
        <div className={`h-full rounded-sm ${color} motion-safe:transition-[width] motion-safe:duration-500`} style={{ width: `${width}%` }} />
      </div>
    </div>
  );
}
