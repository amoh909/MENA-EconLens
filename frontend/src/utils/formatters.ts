export function formatEconomicValue(
  value: number | null | undefined,
  unit: string,
): string {
  if (value === null || value === undefined) {
    return "—";
  }

  const normalizedUnit = unit.toLowerCase();

  if (
    normalizedUnit.includes("current us$") ||
    normalizedUnit.includes("current usd")
  ) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      notation: "compact",
      maximumFractionDigits: 2,
    }).format(value);
  }

  if (normalizedUnit.includes("people")) {
    return new Intl.NumberFormat("en-US", {
      notation: "compact",
      maximumFractionDigits: 2,
    }).format(value);
  }

  const formattedNumber = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
  }).format(value);

  if (normalizedUnit.includes("%")) {
    return `${formattedNumber}%`;
  }

  if (normalizedUnit === "years") {
    return `${formattedNumber} years`;
  }

  return unit
    ? `${formattedNumber} ${unit}`
    : formattedNumber;
}

export function formatSignedValue(
  value: number | null | undefined,
  unit: string,
): string {
  if (value === null || value === undefined) {
    return "—";
  }

  const sign = value > 0 ? "+" : "";

  return `${sign}${formatEconomicValue(value, unit)}`;
}

export function formatAxisValue(value: number): string {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}