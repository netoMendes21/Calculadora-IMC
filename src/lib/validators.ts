import type { MeasurementField } from "./inputMask";

export function parseMeasurement(
  raw: string,
  field: MeasurementField,
): { value: number; error: null } | { value: null; error: string } {
  const example = field === "weight" ? "75,5 kg" : "1,75 m";
  const text = raw.trim();
  if (!text)
    return {
      value: null,
      error: `Informe ${field === "weight" ? "o peso" : "a altura"}.`,
    };
  // Match the entire input: never guess units or interpret grouping separators.
  if (!/^-?\d+(?:[.,]\d{1,2})?$/.test(text)) {
    return {
      value: null,
      error: `Use apenas números e até 2 casas decimais, sem milhar ou unidades. Exemplo: ${example}.`,
    };
  }
  const value = Number(text.replace(",", "."));
  const error =
    field === "weight" ? validateWeight(value) : validateHeight(value);
  return error ? { value: null, error } : { value, error: null };
}

export function validateWeight(weight: number): string | null {
  if (!Number.isFinite(weight))
    return "Peso inválido. Digite um número válido.";
  if (weight <= 0) return "O peso deve ser maior que zero.";
  if (weight < 2 || weight > 500)
    return "Informe um peso entre 2 e 500 kg, em quilogramas.";
  return null;
}

export function validateHeight(height: number): string | null {
  if (!Number.isFinite(height))
    return "Altura inválida. Digite um número válido.";
  if (height <= 0) return "A altura deve ser maior que zero.";
  if (height < 0.5 || height > 2.5)
    return "Informe a altura entre 0,50 e 2,50 m. Exemplo: 1,75 m (não 175).";
  return null;
}
