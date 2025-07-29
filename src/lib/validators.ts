export function validateWeight(weight: number): string | null {
  if (isNaN(weight)) return "Peso inválido. Digite um número válido.";

  if (weight < 2 || weight > 500) {
    return "Ops... O peso precisa ser maior que 2kg e menor que 500kg.";
  }
  return null;
}

export function validateHeight(height: number): string | null {
  if (isNaN(height)) return "Altura inválida. Digite um número válido.";

  if (height < 0.5 || height > 2.5) {
    return "Ops... A altura precisa ser maior que 50cm e menor que 2,5m.";
  }
  return null;
}

