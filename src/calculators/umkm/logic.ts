import { roundTo } from "../../utils/format";

export interface HppInput {
  rawMaterials: number;
  packaging: number;
  labor: number;
  overhead: number;
  otherCosts: number;
  unitsProduced: number;
}

export interface HppResult {
  totalCost: number;
  hppPerUnit: number;
}

export interface MarginInput {
  hppPerUnit: number;
  sellingPrice: number;
  adminFee: number;
  discount: number;
  subsidizedShipping: number;
  packingCost: number;
}

export interface MarginResult {
  netSellingPrice: number;
  totalUnitCost: number;
  grossProfit: number;
  marginPercent: number;
  markupPercent: number;
  warning?: string;
}

export function calculateHpp(input: HppInput): HppResult {
  const totalCost =
    Math.max(input.rawMaterials, 0) +
    Math.max(input.packaging, 0) +
    Math.max(input.labor, 0) +
    Math.max(input.overhead, 0) +
    Math.max(input.otherCosts, 0);
  const unitsProduced = Math.max(input.unitsProduced, 0);
  const hppPerUnit = unitsProduced > 0 ? totalCost / unitsProduced : 0;
  return {
    totalCost: roundTo(totalCost, 0),
    hppPerUnit: roundTo(hppPerUnit, 0)
  };
}

export function calculateMargin(input: MarginInput): MarginResult {
  const hppPerUnit = Math.max(input.hppPerUnit, 0);
  const sellingPrice = Math.max(input.sellingPrice, 0);
  const adminFee = Math.max(input.adminFee, 0);
  const discount = Math.max(input.discount, 0);
  const subsidizedShipping = Math.max(input.subsidizedShipping, 0);
  const packingCost = Math.max(input.packingCost, 0);
  const netSellingPrice = Math.max(sellingPrice - discount - adminFee, 0);
  const totalUnitCost = hppPerUnit + subsidizedShipping + packingCost;
  const grossProfit = netSellingPrice - totalUnitCost;
  const marginPercent = netSellingPrice > 0 ? (grossProfit / netSellingPrice) * 100 : 0;
  const markupPercent = hppPerUnit > 0 ? (grossProfit / hppPerUnit) * 100 : 0;
  const warning =
    grossProfit < 0
      ? "Margin negatif. Harga jual bersih belum menutup biaya."
      : marginPercent < 10
        ? "Margin terlihat tipis. Cek lagi biaya tersembunyi seperti retur, komisi, dan penyusutan."
        : undefined;

  return {
    netSellingPrice: roundTo(netSellingPrice, 0),
    totalUnitCost: roundTo(totalUnitCost, 0),
    grossProfit: roundTo(grossProfit, 0),
    marginPercent: roundTo(marginPercent, 2),
    markupPercent: roundTo(markupPercent, 2),
    warning
  };
}

export function calculateTargetSellingPrice(totalUnitCost: number, targetMarginPercent: number): number {
  const safeCost = Math.max(totalUnitCost, 0);
  const safeMargin = Math.max(targetMarginPercent, 0);
  if (safeMargin >= 100 || safeCost <= 0) return 0;
  return roundTo(safeCost / (1 - safeMargin / 100), 0);
}

export function calculateDiscountImpact(sellingPrice: number, discountPercent: number, adminPercent: number): number {
  const safePrice = Math.max(sellingPrice, 0);
  const safeDiscount = Math.min(Math.max(discountPercent, 0), 100);
  const safeAdmin = Math.min(Math.max(adminPercent, 0), 100);
  const afterDiscount = safePrice * (1 - safeDiscount / 100);
  const afterAdmin = afterDiscount * (1 - safeAdmin / 100);
  return roundTo(afterAdmin, 0);
}
