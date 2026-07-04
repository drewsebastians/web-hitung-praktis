export const idNumberFormatter = new Intl.NumberFormat("id-ID", {
  maximumFractionDigits: 2
});

export function formatNumber(value: number, maximumFractionDigits = 2, minimumFractionDigits = 0): string {
  if (!Number.isFinite(value)) return "-";
  return new Intl.NumberFormat("id-ID", {
    minimumFractionDigits,
    maximumFractionDigits
  }).format(value);
}

export function formatRupiah(value: number): string {
  if (!Number.isFinite(value)) return "Rp -";
  return `Rp ${formatNumber(Math.round(value), 0)}`;
}

export function formatPercent(value: number, maximumFractionDigits = 1): string {
  if (!Number.isFinite(value)) return "-";
  return `${formatNumber(value, maximumFractionDigits)}%`;
}

export function formatKwh(value: number): string {
  if (!Number.isFinite(value)) return "-";
  return `${formatNumber(value, value >= 10 ? 1 : 2)} kWh`;
}

export function parseNumericInput(value: string | number, fallback = 0): number {
  if (typeof value === "number") return Number.isFinite(value) ? value : fallback;
  const normalized = value.replace(/\./g, "").replace(",", ".");
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function roundTo(value: number, digits = 2): number {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

export function ceilTo(value: number, increment = 1): number {
  if (!Number.isFinite(value) || increment <= 0) return 0;
  return Math.ceil(value / increment) * increment;
}
