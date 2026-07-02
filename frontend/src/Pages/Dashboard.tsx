import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 space-y-6">
      
      {/* 1. Country Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-900 pb-5 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-blue-400 font-semibold tracking-wider uppercase mb-1">
            <span>MENA Region</span> &bull; <span>Core Overview</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Lebanon Economic Dashboard</h1>
        </div>
        <Link
          to="/"
          className="px-4 py-2 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-lg text-sm transition-colors"
        >
          &larr; Back to Home
        </Link>
      </header>

      {/* 2. Key Indicators Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: "GDP Growth Rate", value: "-0.2%", status: "Negative", color: "text-rose-400" },
          { title: "Inflation Rate (CPI)", value: "37.4%", status: "High Risk", color: "text-amber-400" },
          { title: "Unemployment Rate", value: "29.6%", status: "Stable", color: "text-slate-400" },
          { title: "Trade Balance", value: "-$1.2B", status: "Deficit", color: "text-rose-400" },
        ].map((card, idx) => (
          <div key={idx} className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-2">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{card.title}</p>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold">{card.value}</span>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full bg-slate-950 ${card.color}`}>
                {card.status}
              </span>
            </div>
          </div>
        ))}
      </section>

      {/* Layout Grid for Main Chart, Forecast & Summaries */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 3. Main Chart Placeholder & Trend Summary */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Chart Box */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Macroeconomic Trend Analysis</h2>
              <span className="text-xs text-slate-500">Historical Data (2015 - 2026)</span>
            </div>
            {/* Visual Placeholder Box for Chart Library (Recharts / Chart.js) */}
            <div className="h-64 w-full bg-slate-950 border border-dashed border-slate-800 rounded-lg flex flex-col items-center justify-center text-slate-500">
              <svg className="w-8 h-8 mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 12l3-3 3 3 4-4M8 21h8a2 2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <p className="text-sm font-medium">[ Interactive Timeseries Line / Bar Chart ]</p>
              <p className="text-xs text-slate-600 mt-1">Ready for integration with your Recharts implementation</p>
            </div>
          </div>

          {/* 4. Trend Summary */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-3">
            <h2 className="text-lg font-semibold">Trend Summary</h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Recent multi-sector analysis reveals sustained fiscal compression across central metrics. 
              While the structural adjustments stabilize baseline operational margins, macroeconomic indices 
              remain susceptible to fluctuating trade flows and regional systemic dependencies.
            </p>
          </div>
        </div>

        {/* Right Sidebar: Forecast Panel & Related Indicators */}
        <div className="space-y-6">
          
          {/* 5. Forecast Panel */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-4">
            <h2 className="text-lg font-semibold">Forecast Panel</h2>
            <p className="text-xs text-slate-500">Projected trends for Q3 & Q4 based on baseline algorithms.</p>
            
            <div className="space-y-3 pt-2">
              {[
                { metric: "GDP Expansion Spec", trajectory: "+0.4%", indicator: "bg-emerald-500" },
                { metric: "Fiscal Variance Rate", trajectory: "-1.1%", indicator: "bg-rose-500" },
                { metric: "Debt Service Multiplier", trajectory: "Stable", indicator: "bg-slate-500" },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-slate-950 rounded-lg border border-slate-900">
                  <span className="text-sm font-medium text-slate-300">{item.metric}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-200">{item.trajectory}</span>
                    <span className={`w-2 h-2 rounded-full ${item.indicator}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 6. Related Indicators Links */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-3">
            <h2 className="text-lg font-semibold">Related Indicators</h2>
            <div className="flex flex-col gap-2">
              {[
                { name: "Foreign Direct Investment (FDI)", path: "/indicators" },
                { name: "Central Bank Reserves Index", path: "/indicators" },
                { name: "Consumer Confidence Multiplier", path: "/indicators" },
              ].map((link, idx) => (
                <Link
                  key={idx}
                  to={link.path}
                  className="text-sm text-blue-400 hover:text-blue-300 hover:underline flex items-center justify-between group"
                >
                  <span>{link.name}</span>
                  <span className="transform translate-x-0 group-hover:translate-x-1 transition-transform">&rarr;</span>
                </Link>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}