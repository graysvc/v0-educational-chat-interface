import { describe, it, expect } from "vitest";
import { normalize } from "../normalize";

describe("normalize", () => {
  it("converts to lowercase", () => {
    expect(normalize("HOLA MUNDO")).toBe("hola mundo");
  });

  it("strips diacritics (tildes)", () => {
    expect(normalize("más fácil")).toBe("mas facil");
    expect(normalize("no entendí")).toBe("no entendi");
    expect(normalize("clarísimo")).toBe("clarisimo");
  });

  it("strips punctuation", () => {
    expect(normalize("¡no entiendo!")).toBe("no entiendo");
    expect(normalize("¿qué?")).toBe("que");
    expect(normalize("hola, mundo.")).toBe("hola mundo");
  });

  it("collapses multiple spaces", () => {
    expect(normalize("hola   mundo")).toBe("hola mundo");
    expect(normalize("  hola  ")).toBe("hola");
  });

  it("handles combined transformations", () => {
    expect(normalize("  ¡No Entendí BIEN!  ")).toBe("no entendi bien");
    expect(normalize("¿Más  fácil?")).toBe("mas facil");
  });
});
