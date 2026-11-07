import { describe, it, expect } from "vitest";
import { analyze, computeScore, generateCV, scoreLabel } from "@/lib/analyzer";

describe("analyzer rules", () => {
  it("weights skills 70%, experience 20%, education 10%", () => {
    expect(computeScore(1, 0, 0)).toBe(70);
    expect(computeScore(0, 1, 0)).toBe(20);
    expect(computeScore(0, 0, 1)).toBe(10);
  });

  it("uses the agreed score labels", () => {
    expect(scoreLabel(80)).toBe("Excelente compatibilidade");
    expect(scoreLabel(79)).toBe("Boa compatibilidade");
    expect(scoreLabel(60)).toBe("Boa compatibilidade");
    expect(scoreLabel(59)).toBe("Compatibilidade moderada");
    expect(scoreLabel(40)).toBe("Compatibilidade moderada");
    expect(scoreLabel(39)).toBe("Compatibilidade reduzida");
  });

  it("ignores accents and case when matching", () => {
    const a = analyze("Requisitos: ANÁLISE DE DADOS e Power BI", "Experiência em analise de dados");
    expect(a.found).toContain("Análise de dados");
    expect(a.missing).toContain("Power BI");
  });

  it("never adds missing keywords to the optimized CV skills", () => {
    const job = "Analista\nRequisitos: Excel, SQL, Power BI";
    const cv = "Ana\nana@x.pt\nCompetências: Excel";
    const out = generateCV(cv, job, analyze(job, cv));
    expect(out.skills).toContain("Excel");
    expect(out.skills).not.toContain("SQL");
    expect(out.skills).not.toContain("Power BI");
  });
});
