import { TODAY } from "./data";

export const money = (n) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(Number(n) || 0);
export const pct = (n) => `${Math.round(Number(n) || 0)}%`;
export const monthLabel = (m) => new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric" }).format(new Date(`${m}-01T12:00:00`));
export const dateLabel = (d) => new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(new Date(`${d}T12:00:00`));
const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

export function invoiceRisk(invoice, today = TODAY) {
  const daysLate = Math.max(0, Math.round((new Date(`${today}T12:00:00`) - new Date(`${invoice.due}T12:00:00`)) / 86400000));
  const health = clamp(Number(invoice.health) || 0, 0, 100);
  const score = Math.round(clamp(daysLate * 1.5 + (invoice.disputed ? 25 : 0) + (100 - health) * .38 + (invoice.status === "Overdue" ? 12 : 0), 0, 100));
  return { daysLate, score, band: score >= 65 ? "High" : score >= 32 ? "Medium" : "Low", confidence: clamp(100 - score, 5, 98) };
}

export function projectProfit(project) {
  const forecastRevenue = Object.values(project.forecast).reduce((sum, value) => sum + value, 0);
  const totalRevenue = project.recognized + forecastRevenue;
  const expectedProfit = project.contract - project.estimatedCost;
  const margin = project.contract ? expectedProfit / project.contract * 100 : 0;
  const risk = Math.min(100, Math.round((project.status === "At risk" ? 20 : 3) + Math.max(0, 35 - margin)));
  return { forecastRevenue, totalRevenue, expectedProfit, margin, risk };
}

export function liquidityDiagnostics(forecast, { minimumCash = 0, reserveMonths = 2 } = {}) {
  if (!Array.isArray(forecast) || !forecast.length) {
    return { minimumClosingCash: 0, minimumCashMonth: null, firstBreachMonth: null, runwayMonths: 0, averageMonthlyCosts: 0, reserveTarget: 0, reserveCoverage: 0, riskBand: "Unknown" };
  }
  const minimum = forecast.reduce((worst, row) => row.closingCash < worst.closingCash ? row : worst, forecast[0]);
  const firstBreach = forecast.find((row) => row.closingCash < minimumCash) || null;
  const averageMonthlyCosts = forecast.reduce((sum, row) => sum + Math.max(0, Number(row.costs) || 0), 0) / forecast.length;
  const reserveTarget = averageMonthlyCosts * Math.max(0, reserveMonths);
  const endingCash = forecast.at(-1).closingCash;
  const reserveCoverage = reserveTarget > 0 ? endingCash / reserveTarget : Infinity;
  const runwayMonths = averageMonthlyCosts > 0 ? Math.max(0, endingCash / averageMonthlyCosts) : Infinity;
  const riskBand = firstBreach ? "Critical" : reserveCoverage < .75 ? "High" : reserveCoverage < 1.25 ? "Watch" : "Healthy";
  return {
    minimumClosingCash: minimum.closingCash,
    minimumCashMonth: minimum.month,
    firstBreachMonth: firstBreach?.month || null,
    runwayMonths,
    averageMonthlyCosts,
    reserveTarget,
    reserveCoverage,
    riskBand,
  };
}
