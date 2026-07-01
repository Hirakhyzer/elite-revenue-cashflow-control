import { describe, expect, it } from "vitest";
import { cloneInitialState } from "./data";
import { buildForecast } from "./forecast";
import { invoiceRisk, projectProfit } from "./logic";

describe("revenue control logic", () => {
  it("scores an overdue disputed invoice as higher risk", () => {
    const state = cloneInitialState();
    const risk = invoiceRisk(state.invoices.find((item) => item.id === "i-forge"));
    expect(risk.score).toBeGreaterThan(60);
    expect(risk.band).toBe("High");
  });
  it("builds a six month cash forecast", () => {
    const state = cloneInitialState();
    const rows = buildForecast(state);
    expect(rows).toHaveLength(6);
    expect(rows[0].revenue).toBeGreaterThan(0);
  });
  it("changes forecast when scenario changes", () => {
    const state = cloneInitialState();
    const conservative = buildForecast({ ...state, scenario: "conservative" });
    const aggressive = buildForecast({ ...state, scenario: "aggressive" });
    expect(aggressive[0].revenue).toBeGreaterThan(conservative[0].revenue);
  });
  it("calculates project margin", () => {
    const state = cloneInitialState();
    const result = projectProfit(state.projects[0]);
    expect(result.margin).toBeGreaterThan(0);
    expect(result.expectedProfit).toBeGreaterThan(0);
  });
});
