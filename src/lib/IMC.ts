export default function calculateIMC(weight: number, height: number) {
  const imc = weight / (height * height);
  return imc;
}

export function IMCResult(imc: number) {
  if (imc < 17) return "Muito abaixo do peso";
  if (imc < 18.5) return "Abaixo do peso";
  if (imc < 24.9) return "Peso normal";
  if (imc < 29.9) return "Sobrepeso";
  if (imc < 34.9) return "Obesidade grau 1";
  if (imc < 39.9) return "Obesidade grau 2";
  return "Obesidade grau 3";
}
