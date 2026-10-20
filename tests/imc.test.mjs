import test from "node:test";
import assert from "node:assert/strict";
import { formatNumber } from "../src/lib/utils.ts";
import calculateIMC, {
  categories,
  classifyIMC,
  referenceWeight,
  getBoundaryNotice,
  getPresentationTone,
  getUnderweightNotice,
} from "../src/lib/IMC.ts";

test("cores de baixo peso respeitam limites sem arredondar e verde é exclusivo do peso adequado", () => {
  for (const [imc, tone] of [
    [15.999, "red-dark"],
    [16, "red"],
    [16.999, "red"],
    [17, "red-light"],
    [18.499, "red-light"],
    [18.5, "green"],
    [24.999, "green"],
    [25, "amber"],
    [29.999, "amber"],
    [30, "red-light"],
    [35, "red"],
    [40, "red-dark"],
  ]) {
    assert.equal(getPresentationTone(imc), tone);
  }
});

test("todo baixo peso recebe alerta próprio, inclusive longe de outra faixa", () => {
  assert.match(getUnderweightNotice(15.99).title, /muito abaixo/);
  assert.match(getUnderweightNotice(16).title, /bastante abaixo/);
  assert.ok(getUnderweightNotice(17.5));
  assert.ok(getUnderweightNotice(18.49));
  for (const value of [18.5, 25, 40, 0, -1, NaN, Infinity])
    assert.equal(getUnderweightNotice(value), null);
});

test("aviso de proximidade cobre ambos os lados de todos os limites", () => {
  for (let i = 0; i < categories.length - 1; i++) {
    const boundary = categories[i].max;
    for (const offset of [-0.5, -0.01, 0, 0.01, 0.5]) {
      const notice = getBoundaryNotice(boundary + offset);
      assert.ok(notice);
      assert.equal(notice.boundary, boundary);
      assert.equal(notice.direction, offset < 0 ? "higher" : "lower");
      assert.equal(
        notice.nextCategory,
        categories[offset < 0 ? i + 1 : i].label,
      );
      assert.equal(notice.atBoundary, offset === 0);
    }
    assert.equal(getBoundaryNotice(boundary - 0.50001), null);
    assert.equal(getBoundaryNotice(boundary + 0.50001), null);
  }
});

test("aviso não arredonda o IMC nem aparece longe dos limites", () => {
  assert.equal(getBoundaryNotice(24.999).direction, "higher");
  assert.equal(getBoundaryNotice(25).direction, "lower");
  for (const value of [23, 27, 32, 37, 45, 0, -1, NaN, Infinity]) {
    assert.equal(getBoundaryNotice(value), null);
  }
});
import {
  parseMeasurement,
  validateHeight,
  validateWeight,
} from "../src/lib/validators.ts";

test("fórmula mantém precisão e classifica antes de arredondar", () => {
  assert.equal(calculateIMC(75.5, 1.75), 75.5 / 1.75 ** 2);
  assert.equal(calculateIMC(100, 2), 25);
  assert.equal((24.999).toFixed(2), "25.00");
  assert.equal(classifyIMC(24.999).label, "Peso adequado");
});

test("formatação brasileira mantém as casas decimais exigidas", () => {
  assert.equal(formatNumber(75.5, 1), "75,5");
  assert.equal(formatNumber(1.75), "1,75");
  assert.equal(formatNumber(25), "25,00");
  assert.equal(formatNumber(24.999), "25,00");
  assert.equal(formatNumber(13.4375, 1), "13,4");
});

test("todos os limites são contínuos, inclusivos no início e exclusivos no fim", () => {
  for (let i = 0; i < categories.length - 1; i++) {
    const edge = categories[i].max;
    assert.equal(classifyIMC(edge - 0.000001).label, categories[i].label);
    assert.equal(classifyIMC(edge).label, categories[i + 1].label);
    assert.equal(classifyIMC(edge + 0.000001).label, categories[i + 1].label);
  }
});

test("ponto e vírgula são normalizados sem interpretação parcial", () => {
  for (const raw of ["75,5", "75.5", " 75,50 "]) {
    assert.equal(parseMeasurement(raw, "weight").value, 75.5);
  }
  for (const raw of ["1,75", "1.75"])
    assert.equal(parseMeasurement(raw, "height").value, 1.75);
  for (const raw of [
    "",
    " ",
    "0",
    "-1",
    "NaN",
    "Infinity",
    "1e2",
    "75kg",
    "75 5",
    "1.750",
    "1,750",
    "1,2.3",
    "75,",
    "1.234,56",
  ]) {
    assert.ok(parseMeasurement(raw, "weight").error, raw);
  }
  assert.match(parseMeasurement("175", "height").error, /1,75/);
  for (const value of [NaN, Infinity, -Infinity, 0, -1]) {
    assert.ok(validateWeight(value));
    assert.ok(validateHeight(value));
  }
});

test("limites de entrada existentes são preservados nas novas unidades", () => {
  assert.equal(validateWeight(2), null);
  assert.equal(validateWeight(500), null);
  assert.equal(validateHeight(0.5), null);
  assert.equal(validateHeight(2.5), null);
  assert.ok(validateWeight(500.01));
  assert.ok(validateHeight(2.51));
});

test("faixa e diferenças usam 18,5 e 25 sem arredondamento intermediário", () => {
  assert.deepEqual(referenceWeight(2), { min: 74, max: 100 });
  const range = referenceWeight(1.75);
  assert.equal(range.min, 56.65625);
  assert.equal(range.max, 76.5625);
  assert.equal((range.min - 50).toFixed(1), "6.7");
  assert.equal((90 - range.max).toFixed(1), "13.4");
  assert.equal(classifyIMC(calculateIMC(74, 2)).label, "Peso adequado");
  assert.equal(classifyIMC(calculateIMC(100, 2)).label, "Sobrepeso");
});
