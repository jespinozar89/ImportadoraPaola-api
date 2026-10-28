export interface ParsedChileanRut {
  rut: number;
  dv: string;
  formatted: string;
}

export function parseChileanRut(value: unknown): ParsedChileanRut | null {
  if (typeof value !== 'string') return null;

  const normalized = value.replace(/[.\s-]/g, '').toUpperCase();
  if (!/^\d{7,8}[0-9K]$/.test(normalized)) return null;

  const rutDigits = normalized.slice(0, -1);
  const dv = normalized.slice(-1);
  let sum = 0;
  let multiplier = 2;

  for (let index = rutDigits.length - 1; index >= 0; index--) {
    sum += Number(rutDigits[index]) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }

  const remainder = 11 - (sum % 11);
  const expectedVerifier = remainder === 11
    ? '0'
    : remainder === 10
      ? 'K'
      : String(remainder);

  if (dv !== expectedVerifier) return null;

  return {
    rut: Number(rutDigits),
    dv,
    formatted: `${rutDigits}-${dv}`
  };
}
