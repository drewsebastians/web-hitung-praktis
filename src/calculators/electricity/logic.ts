import { electricityTariffConfig } from "../../data/electricityTariffs";
import { roundTo } from "../../utils/format";

export interface ApplianceInput {
  id: string;
  name: string;
  watt: number;
  units: number;
  hoursPerDay: number;
  daysPerMonth: number;
}

export interface ApplianceResult extends ApplianceInput {
  kwhPerDay: number;
  kwhPerMonth: number;
  costPerDay: number;
  costPerMonth: number;
  costPerYear: number;
}

export interface ElectricityResult {
  tariffPerKwh: number;
  items: ApplianceResult[];
  totalKwhPerDay: number;
  totalKwhPerMonth: number;
  totalCostPerDay: number;
  totalCostPerMonth: number;
  totalCostPerYear: number;
}

export function getTariffValue(tariffId: string, customTariff: number): number {
  if (tariffId === "custom") return customTariff;
  return electricityTariffConfig.tariffs.find((tariff) => tariff.id === tariffId)?.tariffPerKwh ?? customTariff;
}

export function calculateAppliance(input: ApplianceInput, tariffPerKwh: number): ApplianceResult {
  const kwhPerDay = (input.watt / 1000) * input.units * input.hoursPerDay;
  const kwhPerMonth = kwhPerDay * input.daysPerMonth;
  return {
    ...input,
    kwhPerDay: roundTo(kwhPerDay, 3),
    kwhPerMonth: roundTo(kwhPerMonth, 3),
    costPerDay: roundTo(kwhPerDay * tariffPerKwh, 0),
    costPerMonth: roundTo(kwhPerMonth * tariffPerKwh, 0),
    costPerYear: roundTo(kwhPerMonth * tariffPerKwh * 12, 0)
  };
}

export function calculateElectricity(inputs: ApplianceInput[], tariffPerKwh: number): ElectricityResult {
  const items = inputs.map((input) => calculateAppliance(input, tariffPerKwh));
  const total = items.reduce(
    (acc, item) => ({
      kwhPerDay: acc.kwhPerDay + item.kwhPerDay,
      kwhPerMonth: acc.kwhPerMonth + item.kwhPerMonth,
      costPerDay: acc.costPerDay + item.costPerDay,
      costPerMonth: acc.costPerMonth + item.costPerMonth,
      costPerYear: acc.costPerYear + item.costPerYear
    }),
    { kwhPerDay: 0, kwhPerMonth: 0, costPerDay: 0, costPerMonth: 0, costPerYear: 0 }
  );

  return {
    tariffPerKwh,
    items,
    totalKwhPerDay: roundTo(total.kwhPerDay, 3),
    totalKwhPerMonth: roundTo(total.kwhPerMonth, 3),
    totalCostPerDay: roundTo(total.costPerDay, 0),
    totalCostPerMonth: roundTo(total.costPerMonth, 0),
    totalCostPerYear: roundTo(total.costPerYear, 0)
  };
}
