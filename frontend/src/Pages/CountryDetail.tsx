import { Link } from 'react-router-dom';

export default function CountryDetail() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white p-6">
      <header className="text-center max-w-2xl mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
          Global Indicators & Analytics
        </h1>
        <p className="text-slate-400 text-lg">
          Explore economic metrics, analyze country details, and compare data side-by-side.
        </p>
      </header>

      <main className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-4xl w-full">
        <Link 
          to="/dashboard" 
          className="p-6 bg-slate-800 rounded-xl border border-slate-700 hover:border-blue-500 transition-colors group"
        >
          <h2 className="text-xl font-bold mb-2 group-hover:text-blue-400">Dashboard &rarr;</h2>
          <p className="text-slate-400 text-sm">View high-level overview metrics and core statistics.</p>
        </Link>

        <Link 
          to="/indicators" 
          className="p-6 bg-slate-800 rounded-xl border border-slate-700 hover:border-emerald-500 transition-colors group"
        >
          <h2 className="text-xl font-bold mb-2 group-hover:text-emerald-400">Indicators &rarr;</h2>
          <p className="text-slate-400 text-sm">Browse specific economic indicators and data matrices.</p>
        </Link>

        <Link 
          to="/compare" 
          className="p-6 bg-slate-800 rounded-xl border border-slate-700 hover:border-purple-500 transition-colors group sm:col-span-2"
        >
          <h2 className="text-xl font-bold mb-2 group-hover:text-purple-400">Compare Tools &rarr;</h2>
          <p className="text-slate-400 text-sm">Cross-examine developments between multiple countries simultaneously.</p>
        </Link>
      </main>
    </div>
  );
}