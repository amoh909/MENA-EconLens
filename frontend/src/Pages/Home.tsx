import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-slate-100 p-6">
      {/* Hero Section */}
      <div className="text-center max-w-xl mb-12 space-y-4">
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
          MENA EconLens
        </h1>
        <p className="text-slate-400 text-base leading-relaxed">
          Explore economic indicators, compare countries, and understand regional economic trends.
        </p>
      </div>

      {/* Navigation Actions */}
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md justify-center">
        <Link
          to="/dashboard"
          className="px-5 py-3 text-center bg-blue-600 hover:bg-blue-500 font-medium text-sm rounded-lg shadow-lg shadow-blue-950/50 transition-colors"
        >
          Explore Lebanon
        </Link>
        <Link
          to="/compare"
          className="px-5 py-3 text-center bg-slate-900 border border-slate-800 hover:border-slate-700 font-medium text-sm rounded-lg transition-colors"
        >
          Compare Countries
        </Link>
        <Link
          to="/indicators"
          className="px-5 py-3 text-center bg-slate-900 border border-slate-800 hover:border-slate-700 font-medium text-sm rounded-lg transition-colors"
        >
          View Indicators
        </Link>
      </div>
    </div>
  );
}