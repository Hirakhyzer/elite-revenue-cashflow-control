import { MONTHS } from "./data";
import { invoiceRisk } from "./logic";

const factors = (name) => name === "conservative" ? [.72, .70, .45] : name === "aggressive" ? [.97, .97, .90] : [.88, .86, .70];
const monthOf = (d) => d.slice(0, 7);
const addDays = (d, n) => { const x = new Date(`${d}T12:00:00`); x.setDate(x.getDate() + n); return x.toISOString().slice(0, 10); };

export function buildForecast(state) {
  const [collection, renewalFactor, changeFactor] = factors(state.scenario);
  let cash = state.openingCash;
  return MONTHS.map((month) => {
    const project = state.projects.reduce((sum, item) => sum + (item.forecast[month] || 0), 0);
    const invoice = state.invoices.reduce((sum, item) => {
      const due = item.id === state.delayedInvoiceId ? addDays(item.due, Number(state.delayedDays || 0)) : item.due;
      return sum + (monthOf(due) === month ? item.amount * collection * (invoiceRisk(item).confidence / 100) : 0);
    }, 0);
    const renewal = state.renewals.filter((item) => item.month === month).reduce((sum, item) => sum + item.amount * item.probability / 100 * renewalFactor, 0);
    const change = state.changes.filter((item) => item.month === month).reduce((sum, item) => sum + item.amount * item.confidence / 100 * changeFactor, 0);
    const revenue = project + invoice + renewal + change;
    const costs = state.costs[month] || 0;
    cash += revenue - costs;
    return { month, project, invoice, renewal, change, revenue, costs, closingCash: cash };
  });
}
