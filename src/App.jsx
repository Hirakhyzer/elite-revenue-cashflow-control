import { useMemo, useState } from "react";
import { cloneInitialState } from "./data";
import { buildForecast } from "./forecast";
import { invoiceRisk, money, projectProfit } from "./logic";
import { Dashboard } from "./Dashboard";
import { Controls } from "./Controls";

const KEY="elite-revenue-cashflow-control";
export default function App(){
 const [state,setState]=useState(()=>{try{return JSON.parse(localStorage.getItem(KEY))||cloneInitialState()}catch{return cloneInitialState()}});
 const rows=useMemo(()=>buildForecast(state),[state]);
 const info=useMemo(()=>state.invoices.map(invoice=>({invoice,risk:invoiceRisk(invoice)})),[state.invoices]);
 const profits=useMemo(()=>state.projects.map(project=>({project,profit:projectProfit(project)})),[state.projects]);
 const high=info.filter(x=>x.risk.band==="High");
 const revenue=rows.reduce((s,r)=>s+r.revenue,0),costs=rows.reduce((s,r)=>s+r.costs,0),ending=rows.at(-1)?.closingCash||0;
 const change=(patch)=>setState(current=>{const next={...current,...patch};localStorage.setItem(KEY,JSON.stringify(next));return next});
 const exportReport=()=>{const text=`ELITE ERA DEVELOPMENT L.L.C — CASHFLOW REPORT\nScenario: ${state.scenario}\nForecast revenue: ${money(revenue)}\nForecast costs: ${money(costs)}\nClosing cash: ${money(ending)}\n\n${rows.map(r=>`${r.month}: ${money(r.revenue)} revenue | ${money(r.costs)} costs | ${money(r.closingCash)} closing`).join("\n")}`;const blob=new Blob([text],{type:"text/plain"}),url=URL.createObjectURL(blob),link=document.createElement("a");link.href=url;link.download="elite-cashflow-report.txt";link.click();URL.revokeObjectURL(url)};
 return <div className="shell"><aside><div className="brand"><b>E</b><div><small>Elite Era Development L.L.C</small><strong>Revenue Control</strong></div></div><nav><span className="active">◆ Command center</span><span>◷ Cash forecast</span><span>◫ Collections</span><span>↗ Profitability</span></nav><div className="side"><small>Opening cash</small><strong>{money(state.openingCash)}</strong><em>{state.scenario} scenario</em></div><footer>Made by Hira Khyzer</footer></aside><main><Dashboard state={state} rows={rows} revenue={revenue} costs={costs} ending={ending} high={high} setScenario={(scenario)=>change({scenario})} setDelay={(delayedInvoiceId,delayedDays)=>change({delayedInvoiceId,delayedDays})} onExport={exportReport}/><Controls info={info} profits={profits} high={high}/><footer className="footer">Elite Era Development L.L.C <b>#f4af00</b></footer></main></div>;
}
