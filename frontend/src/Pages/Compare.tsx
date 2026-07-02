import { Link } from "react-router-dom";

export default function Compare() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 space-y-6">
      
      {/* Page Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-900 pb-5 gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Cross-Country Data Comparison</h1>
          <p className="text-sm text-slate-400">Analyze multiple economic factors over customizable timelines side-by-side.</p>
        </div>
        <Link
          to="/"
          className="px-4 py-2 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-lg text-sm transition-colors whitespace-nowrap"
        >
          &larr; Home
        </Link>
      </header>

      {/* INPUTS PANEL */}
      <section className="bg-slate-900 border border-slate-800 p-5 rounded-xl grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Input 1: Select Countries */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Select Countries</label>
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg flex flex-wrap gap-2 text-sm text-slate-400 min-h-[44px] items-center">
            <span className="px-2 py-0.5 bg-blue-950 text-blue-400 border border-blue-900 rounded-md text-xs font-medium">Lebanon</span>
            <span className="px-2 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-900 rounded-md text-xs font-medium">Jordan</span>
            <span className="text-slate-600 text-xs cursor-pointer hover:text-slate-400">+ Add Country...</span>
          </div>
        </div>

        {/* Input 2: Select Indicator */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Select Indicator</label>
          <select className="w-full p-3 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-300 focus:outline-none focus:border-slate-700 cursor-pointer appearance-none">
            <option>Real GDP Growth Rate (%)</option>
            <option>Consumer Price Index (Inflation)</option>
            <option>Unemployment Rate (Total)</option>
            <option>Foreign Direct Investment Inflows</option>
          </select>
        </div>

        {/* Input 3: Select Year Range */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Select Year Range</label>
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-between text-sm text-slate-300">
            <span>2015</span>
            <div className="w-1/2 h-1 bg-slate-800 rounded-full relative">
              <div className="absolute left-2 right-4 top-0 h-full bg-blue-500 rounded-full" />
              <div className="absolute left-2 -top-1.5 w-4 h-4 bg-slate-100 rounded-full shadow border border-slate-400 cursor-pointer" />
              <div className="absolute right-4 -top-1.5 w-4 h-4 bg-slate-100 rounded-full shadow border border-slate-400 cursor-pointer" />
            </div>
            <span>2026</span>
          </div>
        </div>
      </section>

      {/* OUTPUTS PANEL */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left/Main Column: Multi-Line Chart & Summary Table */}
        <div className="lg:col-span-2 space-y-6">
          {/* Multi-Line Chart Area */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-base font-semibold">Comparative Timeline</h2>
              <div className="flex gap-4 text-xs">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Lebanon</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Jordan</span>
              </div>
            </div>
            
            <div className="h-64 w-full bg-slate-950 border border-dashed border-slate-800 rounded-lg flex flex-col items-center justify-center text-slate-500">
              <svg className="w-8 h-8 mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v16h16M4 16l4-4 4 4 8-8" />
              </svg>
              <p className="text-sm font-medium">[ Interactive Multi-Line Comparative Chart ]</p>
            </div>
          </div>

          {/* Summary Data Table */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-3">
            <h2 className="text-base font-semibold">Data Matrix Aggregates</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-400">
                <thead>
                  <tr className="border-b border-slate-800 text-xs uppercase text-slate-500">
                    <th className="py-3 px-2">Country</th>
                    <th className="py-3 px-2">Min Value</th>
                    <th className="py-3 px-2">Max Value</th>
                    <th className="py-3 px-2">Mean Variance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850">
                  <tr className="border-b border-slate-850/50 hover:bg-slate-850/20 transition-colors">
                    <td className="py-3 px-2 font-medium text-slate-200">Lebanon</td>
                    <td className="py-3 px-2">-1.2%</td>
                    <td className="py-3 px-2">+1.8%</td>
                    <td className="py-3 px-2">&plusmn;0.4%</td>
                  </tr>
                  <tr className="hover:bg-slate-850/20 transition-colors">
                    <td className="py-3 px-2 font-medium text-slate-200">Jordan</td>
                    <td className="py-3 px-2">+1.5%</td>
                    <td className="py-3 px-2">+3.2%</td>
                    <td className="py-3 px-2">&plusmn;0.2%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Sidebar: Analytical Highs and Lows */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-5 h-fit">
          <h2 className="text-base font-semibold">Extreme Matrix Ranges</h2>
          
          <div className="space-y-4">
            {/* Peak Value Card */}
            <div className="p-4 bg-slate-950 border border-slate-850 rounded-lg space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400">Optimal Boundary Peak</span>
              <div className="text-xl font-bold text-slate-100">+3.2%</div>
              <p className="text-xs text-slate-400">Recorded by <span className="text-slate-200 font-medium">Jordan</span> during standard window baseline tracking.</p>
            </div>

            {/* Nadir Value Card */}
            <div className="p-4 bg-slate-950 border border-slate-850 rounded-lg space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-rose-400">Critical Compression Nadir</span>
              <div className="text-xl font-bold text-slate-100">-1.2%</div>
              <p className="text-xs text-slate-400">Observed in <span className="text-slate-200 font-medium">Lebanon</span> structural adjustments timeline.</p>
            </div>

            {/* Latest Realized Metric */}
            <div className="p-4 bg-slate-950 border border-slate-850 rounded-lg space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-blue-400">Latest Sync Index</span>
              <div className="text-xl font-bold text-slate-100">Evaluated</div>
              <p className="text-xs text-slate-400">Both profiles maintain standardized macro updates aligned with current 2026 data loops.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}