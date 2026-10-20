export type MeasurementField = "weight" | "height";

const decimalPlaces = { weight: 1, height: 2 } as const;

// Fixed decimal places: 755 -> 75,5 kg; 175 -> 1,75 m.
export function maskMeasurement(raw: string, field: MeasurementField) {
  const digits = raw.replace(/\D/g, "");
  if (!digits) return "";
  const scale = decimalPlaces[field];
  const padded = (digits.replace(/^0+/, "") || "0").padStart(scale + 1, "0");
  return `${padded.slice(0, -scale)},${padded.slice(-scale)}`;
}

export function normalizeMeasurementPaste(
  raw: string,
  field: MeasurementField,
) {
  const pasted = raw.trim();
  if (!/^\d+(?:[.,]\d+)?$/.test(pasted)) return null;

  const [integer, fraction] = pasted.split(/[.,]/);
  const scale = decimalPlaces[field];
  if (fraction === undefined) return integer;
  if (fraction.length > scale) return null;
  return `${integer},${fraction.padEnd(scale, "0")}`;
}

export function maskCursor(value: string, digitsToRight: number) {
  let position = value.length;
  let remaining = digitsToRight;
  while (position > 0 && remaining > 0) {
    position--;
    if (/\d/.test(value[position])) remaining--;
  }
  return position;
}
