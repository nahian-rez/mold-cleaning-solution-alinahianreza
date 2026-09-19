# Cocoa ROI Calculator

Build the Cocoa Dolce Mold Cleaning ROI Calculator web application based on this React component:

```tsx
import React, { useState } from 'react';
export default function MoldBottleneckCalculator() {
  const [scenario, setScenario] = useState('realistic');
  const [molds, setMolds] = useState(250);
  const [cyclesPerWeek, setCyclesPerWeek] = useState(2.3);
  const [hoursPerCycle, setHoursPerCycle] = useState(4);
  const [peoplePerCycle, setPeoplePerCycle] = useState(3);
  const [hourlyRate, setHourlyRate] = useState(28);
  const [equipmentCost, setEquipmentCost] = useState(5000);
  const [maintenanceCost, setMaintenanceCost] = useState(2000);
  const [operatorCost, setOperatorCost] = useState(14000);
  
  // Scenario presets
  const scenarios = {
    pessimistic: {
      molds: 200,
      cyclesPerWeek: 1.5,
      hoursPerCycle: 5,
      peoplePerCycle: 4,
      hourlyRate: 32,
      equipmentCost: 7000,
      maintenanceCost: 3000,
      operatorCost: 20000,
      label: 'Pessimistic (Higher costs, fewer cycles)'
    },
    realistic: {
      molds: 250,
      cyclesPerWeek: 2.3,
      hoursPerCycle: 4,
      peoplePerCycle: 3,
      hourlyRate: 28,
      equipmentCost: 5000,
      maintenanceCost: 2000,
      operatorCost: 14000,
      label: 'Realistic (Best estimate)'
    },
    optimistic: {
      molds: 300,
      cyclesPerWeek: 3.5,
      hoursPerCycle: 3.5,
      peoplePerCycle: 2,
      hourlyRate: 26,
      equipmentCost: 4500,
      maintenanceCost: 1500,
      operatorCost: 12000,
      label: 'Optimistic (Lower costs, more cycles)'
    }
  };

  const handleScenarioChange = (newScenario) => {
    setScenario(newScenario);
    const preset = scenarios[newScenario];
    setMolds(preset.molds);
    setCyclesPerWeek(preset.cyclesPerWeek);
    setHoursPerCycle(preset.hoursPerCycle);
    setPeoplePerCycle(preset.peoplePerCycle);
    setHourlyRate(preset.hourlyRate);
    setEquipmentCost(preset.equipmentCost);
    setMaintenanceCost(preset.maintenanceCost);
    setOperatorCost(preset.operatorCost);
  };

  // Calculations
  const cyclesPerYear = cyclesPerWeek * 52;
  const manualCostPerCycle = hoursPerCycle * peoplePerCycle * hourlyRate;
  const annualManualCost = cyclesPerYear * manualCostPerCycle;
  const annualSolutionCost = maintenanceCost + operatorCost;
  const annualSavings = annualManualCost - annualSolutionCost;
  const paybackMonths = annualSavings > 0 ? (equipmentCost / annualSavings) * 12 : 999;
  const threeYearROI = (annualSavings * 3) - equipmentCost;

  return (
    // ... UI matching the component with responsive cards, clean sliders with formatted values, scenario buttons, and clear metrics
  );
}
```

Ensure the app has a polished, chocolate/confectionery-inspired warm amber visual design, smooth interactive sliders, responsive layout, scenario switcher, metric breakdown cards (annual manual cost, ultrasonic cost, annual savings, payback period, and 3-year net ROI), and clean data visualization/comparison.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://mold-cleaning-solution-alinahianreza.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/31fac7d1-be8e-4dd3-a064-625dea8d8412).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
