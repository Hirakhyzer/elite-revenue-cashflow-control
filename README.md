# Elite Revenue Forecast & Cashflow Control

A white, black, and `#f4af00` gold React finance-operations workspace for **Elite Era Development L.L.C.** It turns active project forecasts, receivables, renewal confidence, scope-change opportunities, and operating-cost assumptions into a six-month cash position.

## What it does

```text
Projects + invoices + renewals + scope changes
→ collection-risk and profitability analysis
→ conservative / expected / aggressive forecast
→ monthly cash position
→ finance action plan
```

## Features

- Six-month cash-flow forecast
- Conservative, expected, and aggressive revenue scenarios
- Invoice collection-risk scoring using days late, disputes, and client-health signal
- Late-payment simulator showing how a collection delay affects forecast timing
- Active-project profitability and expected-margin view
- Renewal and scope-change revenue included with probability/confidence assumptions
- Finance action plan for high-risk collections and low-margin or at-risk delivery
- TXT export and browser local storage
- Responsive Elite Era white, black, and gold UI
- Vitest specifications and GitHub Actions workflow

## Run locally

```bash
npm install
npm run dev
```

Open the local address shown in the terminal, commonly `http://localhost:5173`.

## Run checks

```bash
npm test
npm run build
```

## Production note

This is a functional browser prototype. A production implementation should use authenticated access, server-side permissions, an accounting ledger, invoice-provider sync, bank-feed reconciliation, approval workflows, audit logs, and integrations with Elite OS, Scope Guard, Delivery Intelligence, and Client Health Radar.

---

Made by **Hira Khyzer** for **Elite Era Development L.L.C.**
