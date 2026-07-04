import { ClothingSizeRow, ShoeInputMode, SizeCategory, clothingSizeTables, shoeSizeTables } from "../../data/sizeTables";

export interface ShoeConversionResult {
  eu: number;
  us: number;
  uk: number;
  jp: number;
  suggestedRange: string;
  note: string;
}

export interface ClothingMeasurementInput {
  category: SizeCategory;
  chest: number;
  waist: number;
  hip?: number;
  height?: number;
  weight?: number;
}

export interface ClothingRecommendation {
  size: string;
  explanation: string;
  warning?: string;
  matchedRow: ClothingSizeRow;
}

function rowValue(row: { cm: number; eu: number; us: number; uk: number }, mode: ShoeInputMode): number {
  if (mode === "jp" || mode === "cm") return row.cm;
  return row[mode];
}

export function convertShoeSize(category: SizeCategory, mode: ShoeInputMode, value: number): ShoeConversionResult | undefined {
  if (!Number.isFinite(value) || value <= 0) return undefined;
  const table = shoeSizeTables[category];
  const sorted = [...table].sort((a, b) => rowValue(a, mode) - rowValue(b, mode));
  const exact = sorted.find((row) => rowValue(row, mode) === value);
  if (exact) {
    return {
      eu: exact.eu,
      us: exact.us,
      uk: exact.uk,
      jp: exact.cm,
      suggestedRange: `EU ${exact.eu}`,
      note: "Nilai masuk tepat ke tabel konversi umum."
    };
  }

  const upper = sorted.find((row) => rowValue(row, mode) > value);
  const lower = [...sorted].reverse().find((row) => rowValue(row, mode) < value);
  const chosen = upper ?? lower ?? sorted[0];
  const range = lower && upper ? `EU ${lower.eu}-${upper.eu}` : `sekitar EU ${chosen.eu}`;

  return {
    eu: chosen.eu,
    us: chosen.us,
    uk: chosen.uk,
    jp: chosen.cm,
    suggestedRange: range,
    note: lower && upper ? "Nilai berada di antara dua ukuran. Pertimbangkan model sepatu dan lebar kaki." : "Nilai berada di luar rentang tabel, hasil dibulatkan ke ukuran terdekat."
  };
}

function fitsRange(value: number | undefined, range: [number, number] | undefined): boolean {
  if (value === undefined || !range) return true;
  return value <= range[1];
}

function nearUpper(value: number | undefined, range: [number, number] | undefined): boolean {
  if (value === undefined || !range) return false;
  return value >= range[1] - 2 && value <= range[1];
}

export function recommendClothingSize(input: ClothingMeasurementInput): ClothingRecommendation | undefined {
  if (!Number.isFinite(input.chest) || !Number.isFinite(input.waist) || input.chest <= 0 || input.waist <= 0) {
    return undefined;
  }

  const table = clothingSizeTables[input.category];
  const row =
    table.find(
      (item) =>
        fitsRange(input.chest, item.chest) &&
        fitsRange(input.waist, item.waist) &&
        fitsRange(input.hip, item.hip) &&
        fitsRange(input.height, item.height) &&
        fitsRange(input.weight, item.weight)
    ) ?? table[table.length - 1];

  const warning =
    row === table[table.length - 1] &&
    (input.chest > row.chest[1] || input.waist > row.waist[1] || (input.hip && row.hip && input.hip > row.hip[1]))
      ? "Pengukuran berada di atas rentang tabel umum. Cek size chart resmi brand atau pertimbangkan ukuran khusus."
      : nearUpper(input.chest, row.chest) || nearUpper(input.waist, row.waist) || nearUpper(input.hip, row.hip)
        ? "Ukuran mendekati batas atas. Bila suka lebih longgar, pertimbangkan naik satu ukuran."
        : undefined;

  return {
    size: row.size,
    matchedRow: row,
    warning,
    explanation: `Rekomendasi dipilih dari ukuran terkecil yang masih memuat lingkar dada dan pinggang. Rentang ${row.size}: dada ${row.chest[0]}-${row.chest[1]} cm, pinggang ${row.waist[0]}-${row.waist[1]} cm.`
  };
}
