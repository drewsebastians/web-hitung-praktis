export interface ElectricityTariff {
  id: string;
  label: string;
  tariffPerKwh: number;
  note: string;
}

export const electricityTariffConfig = {
  lastUpdated: "2026-07-04",
  sourceNote:
    "Nilai default disiapkan sebagai asumsi tarif PLN nonsubsidi yang umum digunakan. Tarif listrik dapat berubah melalui pengumuman resmi PLN/ESDM; pengguna dapat memilih tarif custom bila perlu.",
  tariffs: [
    { id: "r1-900", label: "900 VA", tariffPerKwh: 1352, note: "R-1/TR 900 VA nonsubsidi" },
    { id: "r1-1300", label: "1.300 VA", tariffPerKwh: 1444.7, note: "R-1/TR 1.300 VA" },
    { id: "r1-2200", label: "2.200 VA", tariffPerKwh: 1444.7, note: "R-1/TR 2.200 VA" },
    { id: "r2-3500-5500", label: "3.500-5.500 VA", tariffPerKwh: 1699.53, note: "R-2/TR 3.500-5.500 VA" },
    { id: "r3-6600-up", label: "6.600 VA ke atas", tariffPerKwh: 1699.53, note: "R-3/TR 6.600 VA ke atas" }
  ] satisfies ElectricityTariff[]
};

export const appliancePresets = [
  { label: "AC 1/2 PK", watt: 400, hoursPerDay: 8 },
  { label: "AC 1 PK", watt: 800, hoursPerDay: 8 },
  { label: "Kulkas", watt: 120, hoursPerDay: 24 },
  { label: "Rice cooker", watt: 300, hoursPerDay: 3 },
  { label: "Mesin cuci", watt: 350, hoursPerDay: 1 },
  { label: "Pompa air", watt: 250, hoursPerDay: 1 },
  { label: "TV", watt: 80, hoursPerDay: 5 },
  { label: "Laptop", watt: 65, hoursPerDay: 6 },
  { label: "Charger HP", watt: 15, hoursPerDay: 3 },
  { label: "Kipas angin", watt: 45, hoursPerDay: 8 },
  { label: "Lampu LED", watt: 10, hoursPerDay: 8 }
];
