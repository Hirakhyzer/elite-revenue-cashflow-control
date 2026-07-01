import { TODAY } from "./data";

export const money = (n) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(Number(n) || 0);
export const pct = (n) => `${Math.round(Number(n) || 0)}%`;
export const monthLabel = (m) => new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric" }).format(new Date(`${m}-01T12:00:00`));
export const dateLabel = (d) => new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(new Date(`${d}T12:00:00`));
const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

export function invoiceRisk(invoice, today = TODAY) {
  const daysLate = Math.max(0, Math.round((new Date(`${today}T12:00:00`) - new Date(`${invoice.due}T12:00:00`)) / 86400000));
  const score = Math.round(clamp(daysLate * 1.5 + (invoice.disputed ? 25 : 0) + (100 - invoice.health) * .38 + (invoice.status === "Overdue" ? 12 : 0), 0, 100));
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
