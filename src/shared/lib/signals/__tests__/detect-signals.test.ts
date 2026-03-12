import { describe, it, expect } from "vitest";
import { detectSignals } from "../detect-signals";

describe("detectSignals", () => {
  it("detects a simple match", () => {
    const result = detectSignals("no entendí nada");
    expect(result.not_understood).toBe(1);
  });

  it("detects multi-metric match", () => {
    const result = detectSignals("gracias, ahora sí entendí");
    expect(result.gratitude).toBe(1);
    expect(result.success_signal).toBe(1);
  });

  it("returns zeros when no match", () => {
    const result = detectSignals("hola, quiero aprender sobre finanzas");
    expect(result.simplify).toBe(0);
    expect(result.not_understood).toBe(0);
    expect(result.negative_signal).toBe(0);
    expect(result.success_signal).toBe(0);
    expect(result.gratitude).toBe(0);
    expect(result.error).toBe(0);
  });

  it("deduplicates within same metric (max 1 per metric)", () => {
    // "no entendí" and "no comprendo" both map to not_understood
    const result = detectSignals("no entendí, no comprendo nada");
    expect(result.not_understood).toBe(1);
  });

  it("handles diacritics and punctuation", () => {
    const result = detectSignals("¡Más fácil por favor!");
    expect(result.simplify).toBe(1);
  });

  it("respects word boundaries", () => {
    // "simple" should match in "explicalo simple" but also standalone
    const result = detectSignals("explicalo simple");
    expect(result.simplify).toBe(1);
  });

  it("detects negative signals (fear)", () => {
    const result = detectSignals("me da miedo equivocarme");
    expect(result.negative_signal).toBe(1);
  });

  it("detects negative signals (frustration)", () => {
    const result = detectSignals("no me sale el ejercicio");
    expect(result.negative_signal).toBe(1);
  });

  it("detects error signals", () => {
    const result = detectSignals("hubo un error en la respuesta");
    expect(result.error).toBe(1);
  });
});
