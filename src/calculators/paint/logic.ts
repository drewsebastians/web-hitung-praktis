import { paintConfig } from "../../data/paintConfig";
import { ceilTo, roundTo } from "../../utils/format";

export interface PaintInput {
  mode: "room" | "area";
  length: number;
  width: number;
  height: number;
  directWallArea: number;
  doors: number;
  windows: number;
  doorArea: number;
  windowArea: number;
  coats: number;
  coverage: number;
  wastePercent: number;
  canSize: number;
  pricePerCan: number;
}

export interface PaintResult {
  grossWallArea: number;
  openingArea: number;
  netWallArea: number;
  baseLiters: number;
  finalLiters: number;
  recommendedCans: number;
  totalCanLiters: number;
  estimatedCost?: number;
}

export function calculatePaint(input: PaintInput): PaintResult {
  const length = Math.max(input.length, 0);
  const width = Math.max(input.width, 0);
  const height = Math.max(input.height, 0);
  const directWallArea = Math.max(input.directWallArea, 0);
  const doors = Math.max(input.doors, 0);
  const windows = Math.max(input.windows, 0);
  const doorArea = Math.max(input.doorArea, 0);
  const windowArea = Math.max(input.windowArea, 0);
  const coats = Math.max(input.coats, 0);
  const coverage = Math.max(input.coverage, 0);
  const wastePercent = Math.max(input.wastePercent, 0);
  const canSize = Math.max(input.canSize, 0);
  const pricePerCan = Math.max(input.pricePerCan, 0);
  const grossWallArea =
    input.mode === "area" ? directWallArea : 2 * (length + width) * height;
  const openingArea = doors * doorArea + windows * windowArea;
  const netWallArea = Math.max(grossWallArea - openingArea, 0);
  const baseLiters = coverage > 0 ? (netWallArea * coats) / coverage : 0;
  const finalLiters = baseLiters * (1 + wastePercent / 100);
  const recommendedCans = canSize > 0 ? Math.ceil(finalLiters / canSize) : 0;
  const totalCanLiters = recommendedCans * canSize;
  return {
    grossWallArea: roundTo(grossWallArea, 2),
    openingArea: roundTo(openingArea, 2),
    netWallArea: roundTo(netWallArea, 2),
    baseLiters: roundTo(baseLiters, 2),
    finalLiters: roundTo(finalLiters, 2),
    recommendedCans,
    totalCanLiters: roundTo(ceilTo(totalCanLiters, 0.1), 1),
    estimatedCost: pricePerCan > 0 ? roundTo(recommendedCans * pricePerCan, 0) : undefined
  };
}

export const defaultPaintInput: PaintInput = {
  mode: "room",
  length: 3,
  width: 4,
  height: 3,
  directWallArea: 36,
  doors: 1,
  windows: 1,
  doorArea: paintConfig.defaultDoorAreaM2,
  windowArea: paintConfig.defaultWindowAreaM2,
  coats: paintConfig.defaultCoats,
  coverage: paintConfig.defaultCoverageM2PerLiter,
  wastePercent: paintConfig.defaultWastePercent,
  canSize: 2.5,
  pricePerCan: 0
};
