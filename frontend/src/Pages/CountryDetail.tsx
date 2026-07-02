import { Link } from "react-router-dom";

export default function CountryDetail() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 space-y-6">
      
      {/* Page Header Navigation */}
      <header className="flex justify-between items-center border-b border-slate-900 pb-5">
        <div>
          <span className="text-xs font-semibold text-blue-400 tracking-wider uppercase">Regional Profiling</span>
          <h1 className="text-2xl font-bold tracking-tight">Country Profile Study</h1>
        </div>
        <Link
          to="/"
          className="px-4 py-2 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-lg text-sm transition-colors"
        >
          &larr; Home
        </Link>
      </header>

      {/* Country Identity Block */}
      <section className="bg-slate-900 border border-slate-800 p-6 rounded-xl grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        <div className="md:col-span-2 space-y-2">
          <div className="flex items-center gap-3">
            <h2 className="text-3xl font-bold tracking-tight text-slate-100">Republic of Lebanon</h2>
            <span className="text-xs bg-blue-950 text-blue-400 border border-blue-900 px-2.5 py-0.5 rounded-full font-medium">
              MENA
            </span>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed">
            Positioned at the crossroads of the Mediterranean Basin and the Arabian hinterland, Lebanon presents a historically service-oriented economy undergoing significant structural adjustments and institutional reforms.
          </p>
        </div>
        
        {/* Quick Metadata Matrix */}
        <div className="bg-slate-950 p-4 rounded-lg border border-slate-850 space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-slate-500">Capital:</span> <span className="font-medium text-slate-300">Beirut</span></div>
          <div className="flex justify-between"><span className="text-slate-500">Currency:</span> <span className="font-medium text-slate-300">Lebanese Pound (LBP)</span></div>
          <div className="flex justify-between"><span className="text-slate-500">Population:</span> <span className="font-medium text-slate-300">~5.4 Million</span></div>
        </div>
      </section>

      {/* Detailed Analysis Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Structural Economic Narrative */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-4">
          <h3 className="text-base font-semibold">Macro-Structural Outlook</h3>
          <div className="text-sm text-slate-400 space-y-3 leading-relaxed">
            <p>
              The domestic landscape is highly defined by fiscal and commercial re-indexing. Modern resource allocations are leaning heavily toward developing decentralized service paradigms, rebuilding balance sheets, and balancing severe trade deficits.
            </p>
            <p>
              International tracking bodies highlight a critical need for structural transparency to encourage foreign direct investment (FDI) inflows, stabilizer index tracking, and formalizing private-public development partnerships across the coming cycles.
            </p>
          </div>
        </div>

        {/* Right: Key Annual Metrics Matrix */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-4">
          <h3 className="text-base font-semibold">Historical Baseline Checklist</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-400">
              <thead>
                <tr className="border-b border-slate-800 text-slate-500 font-bold uppercase">
                  <th className="pb-2">Year</th>
                  <th className="pb-2">GDP Cap ($)</th>
                  <th className="pb-2 text-right">Stability Index</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850">
                {[
                  { year: "2026 (Proj)", gdp: "$3,950", status: "Re-indexing", color: "text-amber-400" },
                  { year: "2025", gdp: "$4,120", status: "Compressed", color: "text-rose-400" },
                  { year: "2024", gdp: "$4,300", status: "Compressed", color: "text-rose-400" },
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-850/30 transition-colors">
                    <td className="py-2.5 font-medium text-slate-200">{row.year}</td>
                    <td className="py-2.5">{row.gdp}</td>
                    <td className={`py-2.5 text-right font-medium ${row.color}`}>{row.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}