import test from "node:test";
import assert from "node:assert/strict";
import {
  maskMeasurement,
  maskCursor,
  normalizeMeasurementPaste,
} from "../src/lib/inputMask.ts";

test("colagem preserva o valor decimal declarado e completa as casas", () => {
  assert.equal(normalizeMeasurementPaste("1.7", "height"), "1,70");
  assert.equal(normalizeMeasurementPaste("1,75", "height"), "1,75");
  assert.equal(normalizeMeasurementPaste(" 100.0 ", "weight"), "100,0");
  assert.equal(normalizeMeasurementPaste("1000", "weight"), "1000");
  assert.equal(normalizeMeasurementPaste("0", "height"), "0");
});

test("colagem rejeita unidades, milhar, negativos e precisão ambígua", () => {
  for (const raw of [
    "",
    " ",
    "1.750",
    "1,750",
    "1.234,56",
    "1 750",
    "1,75 m",
    "-1",
    "1e2",
    "NaN",
    "1.",
  ]) {
    assert.equal(normalizeMeasurementPaste(raw, "height"), null, raw);
  }
  assert.equal(normalizeMeasurementPaste("75.55", "weight"), null);
});

test("máscaras inserem vírgula com casas fixas sem adivinhar unidades", () => {
  for (const [input, output] of [
    ["7", "0,7"],
    ["75", "7,5"],
    ["755", "75,5"],
    ["1000", "100,0"],
    ["75,5", "75,5"],
    ["75.5", "75,5"],
    ["", ""],
    ["0", "0,0"],
  ]) {
    assert.equal(maskMeasurement(input, "weight"), output);
  }
  for (const [input, output] of [
    ["1", "0,01"],
    ["17", "0,17"],
    ["175", "1,75"],
    ["200", "2,00"],
    ["1.75", "1,75"],
    ["", ""],
  ]) {
    assert.equal(maskMeasurement(input, "height"), output);
  }
});

test("cursor preserva a posição relativa aos algarismos ao editar", () => {
  assert.equal(maskCursor("75,5", 0), 4);
  assert.equal(maskCursor("75,5", 1), 3);
  assert.equal(maskCursor("75,5", 2), 1);
  assert.equal(maskCursor("1,75", 3), 0);
  assert.equal(maskCursor("", 0), 0);
});
