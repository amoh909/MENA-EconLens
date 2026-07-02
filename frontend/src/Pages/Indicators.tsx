import { Link } from "react-router-dom";

export default function Indicators() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 space-y-6">
      
      {/* Page Navigation Header */}
      <header className="flex justify-between items-center border-b border-slate-900 pb-5">
        <div>
          <span className="text-xs font-semibold text-blue-400 tracking-wider uppercase">Global Analytics</span>
          <h1 className="text-2xl font-bold tracking-tight">Economic Indicators Explorer</h1>
        </div>
        <Link
          to="/"
          className="px-4 py-2 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-lg text-sm transition-colors"
        >
          &larr; Home
        </Link>
      </header>

      {/* 1 & 2. Indicator Name & Detailed Description */}
      <section className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-2">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-slate-100">Consumer Price Index (CPI) Inflation</h2>
          <span className="px-2 py-0.5 bg-amber-950 text-amber-400 border border-amber-900 rounded text-xs font-medium">
            Macroeconomic Core
          </span>
        </div>
        <p className="text-sm text-slate-400 leading-relaxed max-w-4xl">
          CPI measures the average change over time in the prices paid by urban consumers for a market basket of consumer goods and services. It serves as a primary metric for evaluating purchasing power variance and macro-inflationary pressures across regional economies.
        </p>
      </section>

      {/* 3. Countries with Latest Values Matrix */}
      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Regional Standings (Latest Values)</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { country: "Lebanon", value: "37.4%", baseline: "YoY Change", status: "Critical" },
            { country: "Jordan", value: "2.1%", baseline: "YoY Change", status: "Stable" },
            { country: "Egypt", value: "29.8%", baseline: "YoY Change", status: "High" },
          ].map((item, idx) => (
            <div key={idx} className="p-4 bg-slate-900 border border-slate-850 rounded-xl flex justify-between items-center">
              <div className="space-y-0.5">
                <p className="text-sm font-semibold text-slate-200">{item.country}</p>
                <p className="text-xs text-slate-500">{item.baseline}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-slate-100">{item.value}</p>
                <span className={`text-[10px] font-medium uppercase tracking-wide ${
                  item.status === 'Stable' ? 'text-emerald-400' : 'text-rose-400'
                }`}>{item.status}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Chart Filtered by Selected Country */}
      <section className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-base font-semibold">Historical Timeline Focus</h3>
            <p className="text-xs text-slate-400">Isolate specific country historical sequences</p>
          </div>
          
          {/* Interactive filter switcher placeholder */}
          <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-850 text-xs">
            <button className="px-3 py-1.5 bg-slate-800 text-slate-100 rounded-md font-medium">Lebanon</button>
            <button className="px-3 py-1.5 text-slate-400 hover:text-slate-200 font-medium">Jordan</button>
            <button className="px-3 py-1.5 text-slate-400 hover:text-slate-200 font-medium">Egypt</button>
          </div>
        </div>

        {/* Visual Chart Placeholder Box */}
        <div className="h-60 w-full bg-slate-950 border border-dashed border-slate-850 rounded-lg flex flex-col items-center justify-center text-slate-500">
          <svg className="w-8 h-8 mb-2 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <p className="text-sm font-medium">[ Historical Distribution Plot ]</p>
          <p className="text-xs text-slate-600 mt-0.5">Isolating timeline data points indexed up to 2026</p>
        </div>
      </section>

    </div>
  );
}