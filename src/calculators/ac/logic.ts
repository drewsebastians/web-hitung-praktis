import { acConfig } from "../../data/acConfig";
import { roundTo } from "../../utils/format";

export type SunlightLevel = keyof typeof acConfig.sunlightFactors;
export type RoomType = keyof typeof acConfig.roomTypeFactors;
export type HeatDeviceLevel = keyof typeof acConfig.heatDeviceFactors;

export interface AcInput {
  length: number;
  width: number;
  height: number;
  people: number;
  sunlight: SunlightLevel;
  roomType: RoomType;
  topFloor: boolean;
  heatDevices: HeatDeviceLevel;
}

export interface AcResult {
  area: number;
  estimatedBtu: number;
  recommendedPk: string;
  recommendedBtu: number;
  lowerAlternative?: string;
  higherAlternative?: string;
  explanation: string[];
}

export function calculateAc(input: AcInput): AcResult {
  const length = Math.max(input.length, 0);
  const width = Math.max(input.width, 0);
  const height = Math.max(input.height, 0);
  const people = Math.max(input.people, 0);
  const area = length * width;
  const heightFactor = height > 3 ? 1 + Math.min((height - 3) * 0.08, 0.2) : 1;
  const peopleExtra = Math.max(people - 2, 0) * acConfig.extraPersonBtu;
  let btu =
    area *
      acConfig.baseBtuPerM2 *
      acConfig.sunlightFactors[input.sunlight] *
      acConfig.roomTypeFactors[input.roomType] *
      acConfig.heatDeviceFactors[input.heatDevices] *
      heightFactor +
    peopleExtra;
  if (input.topFloor) btu *= acConfig.topFloorFactor;

  const estimatedBtu = roundTo(btu, 0);
  const recommended = acConfig.pkTable.find((row) => row.btu >= estimatedBtu) ?? acConfig.pkTable[acConfig.pkTable.length - 1];
  const index = acConfig.pkTable.findIndex((row) => row.pk === recommended.pk);
  const lower = index > 0 ? acConfig.pkTable[index - 1] : undefined;
  const higher = index < acConfig.pkTable.length - 1 ? acConfig.pkTable[index + 1] : undefined;
  const nearLower = lower && estimatedBtu - lower.btu < 700;
  const nearHigher = higher && recommended.btu - estimatedBtu < 900;

  return {
    area: roundTo(area, 2),
    estimatedBtu,
    recommendedPk: recommended.pk,
    recommendedBtu: recommended.btu,
    lowerAlternative: nearLower ? lower.pk : undefined,
    higherAlternative: nearHigher ? higher.pk : undefined,
    explanation: [
      `Dasar perhitungan memakai sekitar ${acConfig.baseBtuPerM2} BTU per m2.`,
      input.sunlight === "tinggi" ? "Paparan matahari tinggi menaikkan kebutuhan pendinginan." : "Paparan matahari dipakai sebagai faktor penyesuaian.",
      input.topFloor ? "Ruangan lantai atas atau langsung di bawah atap diberi tambahan kapasitas." : "Tidak ada tambahan khusus untuk atap langsung.",
      people > 2 ? "Jumlah orang lebih dari dua menambah beban panas ruangan." : "Jumlah orang masih dalam asumsi ruangan standar."
    ]
  };
}
