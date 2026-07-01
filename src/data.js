import { projects } from "./projects";
import { invoices, renewals, changes } from "./b";

export const TODAY = "2026-06-30";
export const MONTHS = ["2026-07", "2026-08", "2026-09", "2026-10", "2026-11", "2026-12"];
export const scenarioNames = ["conservative", "expected", "aggressive"];
export const initialState = {
  openingCash: 26500,
  scenario: "expected",
  delayedInvoiceId: "",
  delayedDays: 0,
  projects,
  invoices,
  renewals,
  changes,
  costs: { "2026-07": 22400, "2026-08": 22600, "2026-09": 22900, "2026-10": 23200, "2026-11": 23600, "2026-12": 24100 },
  actions: [
    { id: "a1", title: "Resolve Atlas overdue invoice", owner: "Finance + Amina", due: "2026-07-02", status: "Open", type: "Collections" },
    { id: "a2", title: "Confirm Verdant renewal value review", owner: "Omar", due: "2026-07-03", status: "Open", type: "Renewal" },
  ],
  savedReports: [],
};
export function cloneInitialState() { return JSON.parse(JSON.stringify(initialState)); }
