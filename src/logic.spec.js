import { describe, expect, it } from "vitest";
import { cloneInitialState } from "./data";
import { buildForecast } from "./forecast";
import { invoiceRisk, liquidityDiagnostics, projectProfit } from "./logic";

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
  it("reports the first cash-floor breach and reserve coverage", () => {
    const rows = [
      { month: "2026-01", closingCash: 12000, costs: 10000 },
      { month: "2026-02", closingCash: 4000, costs: 10000 },
      { month: "2026-03", closingCash: -2000, costs: 10000 },
    ];
    const result = liquidityDiagnostics(rows, { minimumCash: 5000, reserveMonths: 2 });
    expect(result.firstBreachMonth).toBe("2026-02");
    expect(result.minimumCashMonth).toBe("2026-03");
    expect(result.reserveTarget).toBe(20000);
    expect(result.riskBand).toBe("Critical");
  });
  it("moves a delayed invoice out of its original collection month", () => {
    const state = cloneInitialState();
    const invoice = state.invoices[0];
    const baseline = buildForecast(state);
    const delayed = buildForecast({ ...state, delayedInvoiceId: invoice.id, delayedDays: 45 });
    const originalMonth = invoice.due.slice(0, 7);
    const baselineRow = baseline.find((row) => row.month === originalMonth);
    const delayedRow = delayed.find((row) => row.month === originalMonth);
    if (baselineRow && delayedRow) expect(delayedRow.invoice).toBeLessThan(baselineRow.invoice);
  });
});
