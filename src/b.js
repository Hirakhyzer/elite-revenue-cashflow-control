export const invoices = [
  { id: "i-atlas", client: "Atlas Holdings", projectId: "atlas", amount: 8400, due: "2026-06-22", status: "Overdue", disputed: false, health: 48, note: "Integration milestone" },
  { id: "i-lumen", client: "Lumen Logistics", projectId: "lumen", amount: 6200, due: "2026-07-08", status: "Open", disputed: false, health: 79, note: "AI workflow milestone" },
  { id: "i-northstar", client: "Northstar Studio", projectId: "northstar", amount: 3400, due: "2026-07-04", status: "Open", disputed: false, health: 91, note: "Final delivery" },
  { id: "i-forge", client: "Forge Manufacturing", projectId: null, amount: 1900, due: "2026-06-12", status: "Overdue", disputed: true, health: 39, note: "Maintenance balance" },
];
export const renewals = [
  { id: "r-northstar", client: "Northstar Studio", amount: 12000, month: "2026-07", probability: 92 },
  { id: "r-verdant", client: "Verdant & Co.", amount: 9000, month: "2026-07", probability: 62 },
  { id: "r-atlas", client: "Atlas Holdings", amount: 18000, month: "2026-08", probability: 48 },
  { id: "r-lumen", client: "Lumen Logistics", amount: 15000, month: "2026-09", probability: 80 },
];
export const changes = [
  { id: "c-northstar", client: "Northstar Studio", title: "Executive insights dashboard", amount: 7200, month: "2026-07", confidence: 82 },
  { id: "c-atlas", client: "Atlas Holdings", title: "AI support assistant", amount: 12800, month: "2026-08", confidence: 58 },
  { id: "c-lumen", client: "Lumen Logistics", title: "Workflow automation expansion", amount: 8500, month: "2026-09", confidence: 70 },
];
