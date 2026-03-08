export function standardDeviation(values: number[]): number {
  if (values.length === 0) return 0;
  const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
  const squaredDiffs = values.map((v) => (v - mean) ** 2);
  return Math.sqrt(squaredDiffs.reduce((sum, v) => sum + v, 0) / values.length);
}

export function formatNumber(num: number, decimals: number = 1): string {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
}

export function formatNumbersInText(text: string): string {
  return text.replace(/-?\d+(?:\.\d+)?/g, (match) => {
    const value = Number(match);
    if (!Number.isFinite(value) || Math.abs(value) < 1000) return match;
    const decimalIndex = match.indexOf(".");
    const decimals = decimalIndex >= 0 ? match.length - decimalIndex - 1 : 0;
    return formatNumber(value, decimals);
  });
}

export function formatOrdinal(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}
