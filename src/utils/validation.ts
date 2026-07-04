export function isPositive(value: number): boolean {
  return Number.isFinite(value) && value > 0;
}

export function isZeroOrPositive(value: number): boolean {
  return Number.isFinite(value) && value >= 0;
}

export function friendlyNumberError(label: string, value: number, allowZero = false): string | undefined {
  const valid = allowZero ? isZeroOrPositive(value) : isPositive(value);
  return valid ? undefined : `${label} perlu diisi dengan angka yang masuk akal.`;
}

export function clamp(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min;
  return Math.min(Math.max(value, min), max);
}
