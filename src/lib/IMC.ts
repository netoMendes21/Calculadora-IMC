export const categories = [
  {
    label: "Abaixo do peso",
    max: 18.5,
    range: "Menor que 18,5",
    tone: "red-light",
  },
  {
    label: "Peso adequado",
    max: 25,
    range: "De 18,5 a menos de 25",
    tone: "green",
  },
  { label: "Sobrepeso", max: 30, range: "De 25 a menos de 30", tone: "amber" },
  {
    label: "Obesidade grau I",
    max: 35,
    range: "De 30 a menos de 35",
    tone: "red-light",
  },
  {
    label: "Obesidade grau II",
    max: 40,
    range: "De 35 a menos de 40",
    tone: "red",
  },
  {
    label: "Obesidade grau III",
    max: Infinity,
    range: "40 ou mais",
    tone: "red-dark",
  },
] as const;

export function classifyIMC(imc: number) {
  return categories.find((category) => imc < category.max) ?? categories[5];
}

export function getPresentationTone(imc: number) {
  if (imc < 16) return "red-dark";
  if (imc < 17) return "red";
  return classifyIMC(imc).tone;
}

export function getUnderweightNotice(imc: number) {
  if (!Number.isFinite(imc) || imc <= 0 || imc >= 18.5) return null;
  return {
    title:
      imc < 16
        ? "Atenção: peso muito abaixo da faixa adequada"
        : imc < 17
          ? "Atenção: peso bastante abaixo da faixa adequada"
          : "Atenção: você está abaixo do peso",
    message:
      "Procure um profissional de saúde para avaliar seu peso e orientar os cuidados necessários.",
  };
}

export default function calculateIMC(weight: number, height: number) {
  return weight / (height * height);
}

export function IMCResult(imc: number) {
  return classifyIMC(imc).label;
}

export function referenceWeight(height: number) {
  return { min: 18.5 * height * height, max: 25 * height * height };
}

// Interface criterion, not a clinical cutoff. Always compare the unrounded BMI.
export const proximityThreshold = 0.5;

export function getBoundaryNotice(imc: number) {
  if (!Number.isFinite(imc) || imc <= 0) return null;
  for (let index = 0; index < categories.length - 1; index++) {
    const boundary = categories[index].max;
    if (Math.abs(imc - boundary) <= proximityThreshold) {
      const direction = imc < boundary ? "higher" : "lower";
      return {
        boundary,
        atBoundary: imc === boundary,
        direction,
        nextCategory:
          categories[direction === "higher" ? index + 1 : index].label,
      };
    }
  }
  return null;
}

export type Calculation = {
  weight: number;
  height: number;
  IMC: number;
  category: string;
};
