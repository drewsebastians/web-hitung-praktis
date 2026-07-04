import { describe, expect, it } from "vitest";
import { calculateAc } from "./ac/logic";
import { calculateElectricity } from "./electricity/logic";
import { calculatePaint, defaultPaintInput } from "./paint/logic";
import { convertShoeSize, recommendClothingSize } from "./sizes/logic";
import { calculateDiscountImpact, calculateHpp, calculateMargin, calculateTargetSellingPrice } from "./umkm/logic";

describe("calculator formulas", () => {
  it("calculates electricity usage and cost", () => {
    const result = calculateElectricity(
      [{ id: "fan", name: "Kipas", watt: 100, units: 1, hoursPerDay: 10, daysPerMonth: 30 }],
      1000
    );

    expect(result.totalKwhPerMonth).toBe(30);
    expect(result.totalCostPerMonth).toBe(30000);
  });

  it("calculates HPP, margin, target price, and promo impact", () => {
    const hpp = calculateHpp({
      rawMaterials: 250000,
      packaging: 50000,
      labor: 75000,
      overhead: 40000,
      otherCosts: 0,
      unitsProduced: 50
    });

    expect(hpp.totalCost).toBe(415000);
    expect(hpp.hppPerUnit).toBe(8300);
    expect(calculateTargetSellingPrice(10000, 20)).toBe(12500);
    expect(calculateDiscountImpact(100000, 10, 5)).toBe(85500);

    const margin = calculateMargin({
      hppPerUnit: 8300,
      sellingPrice: 15000,
      adminFee: 750,
      discount: 0,
      subsidizedShipping: 0,
      packingCost: 500
    });

    expect(margin.grossProfit).toBe(5450);
    expect(margin.marginPercent).toBeGreaterThan(35);
  });

  it("calculates paint requirement", () => {
    const result = calculatePaint(defaultPaintInput);

    expect(result.grossWallArea).toBe(42);
    expect(result.netWallArea).toBe(39);
    expect(result.finalLiters).toBeCloseTo(7.8);
    expect(result.recommendedCans).toBe(4);
  });

  it("recommends AC capacity", () => {
    const result = calculateAc({
      length: 3,
      width: 4,
      height: 2.8,
      people: 2,
      sunlight: "normal",
      roomType: "kamar tidur",
      topFloor: false,
      heatDevices: "rendah"
    });

    expect(result.area).toBe(12);
    expect(result.estimatedBtu).toBe(6600);
    expect(result.recommendedPk).toBe("3/4 PK");
  });

  it("converts shoe and clothing sizes", () => {
    const shoe = convertShoeSize("pria", "cm", 26);
    expect(shoe?.eu).toBe(42);

    const clothing = recommendClothingSize({ category: "pria", chest: 96, waist: 82 });
    expect(clothing?.size).toBe("M");
  });
});
