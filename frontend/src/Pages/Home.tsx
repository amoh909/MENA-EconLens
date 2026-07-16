import { Link } from "react-router-dom";

const features = [
  {
    title: "Country profiles",
    description:
      "Open dynamic MENA country pages with historical charts, trend summaries, and simple forecasts.",
  },
  {
    title: "Regional comparison",
    description:
      "Compare multiple countries on the same macroeconomic indicator using real World Bank time-series data.",
  },
  {
    title: "Indicator explorer",
    description:
      "Browse indicators, inspect regional latest values, and jump into country-specific analysis.",
  },
  {
    title: "Economic interpretation",
    description:
      "Separate statistical movement from economic meaning, so increasing inflation is not treated as automatically good.",
  },
];

const workflow = [
  "Choose a country or indicator",
  "Explore historical movement",
  "Compare regional economies",
  "Review trends and projections",
];

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 px-4 py-6 text-slate-100 sm:px-6">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-7xl flex-col">
        <header className="flex items-center justify-between border-b border-slate-900 pb-5">
          <Link
            to="/"
            className="text-sm font-bold tracking-tight text-slate-100"
          >
            MENA EconLens
          </Link>

          <nav className="hidden items-center gap-2 text-sm sm:flex">
            <Link
              to="/countries"
              className="rounded-lg px-3 py-2 text-slate-300 transition-colors hover:bg-slate-900 hover:text-slate-100"
            >
              Countries
            </Link>

            <Link
              to="/compare"
              className="rounded-lg px-3 py-2 text-slate-300 transition-colors hover:bg-slate-900 hover:text-slate-100"
            >
              Compare
            </Link>

            <Link
              to="/indicators"
              className="rounded-lg px-3 py-2 text-slate-300 transition-colors hover:bg-slate-900 hover:text-slate-100"
            >
              Indicators
            </Link>
          </nav>
        </header>

        <main className="flex flex-1 flex-col justify-center py-12">
          <section className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <div className="mb-4 inline-flex rounded-full border border-blue-900 bg-blue-950/60 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-300">
                Regional economic data · Trends · Forecasts
              </div>

              <h1 className="max-w-4xl text-4xl font-black tracking-tight text-slate-100 sm:text-5xl lg:text-6xl">
                Economic intelligence for the MENA region.
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-8 text-slate-400 sm:text-lg">
                Explore macroeconomic indicators, compare countries, and
                generate automated trend summaries and simple forecasts from
                World Bank time-series data.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/countries"
                  className="rounded-xl bg-blue-600 px-5 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-blue-950/50 transition-colors hover:bg-blue-500"
                >
                  Explore countries
                </Link>

                <Link
                  to="/compare"
                  className="rounded-xl border border-slate-800 bg-slate-900 px-5 py-3 text-center text-sm font-semibold text-slate-100 transition-colors hover:border-slate-700"
                >
                  Compare economies
                </Link>

                <Link
                  to="/dashboard"
                  className="rounded-xl border border-slate-800 bg-slate-950 px-5 py-3 text-center text-sm font-semibold text-slate-300 transition-colors hover:border-slate-700 hover:text-slate-100"
                >
                  View Lebanon demo
                </Link>
              </div>
            </div>

            <aside className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl shadow-slate-950">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Platform snapshot
                  </p>
                  <h2 className="mt-1 text-xl font-bold text-slate-100">
                    Regional analytics snapshot
                  </h2>
                </div>

                <span className="rounded-full bg-emerald-950 px-3 py-1 text-xs font-semibold text-emerald-300">
                  Live
                </span>
              </div>

              <dl className="mt-6 grid grid-cols-2 gap-4">
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                  <dt className="text-xs uppercase tracking-wider text-slate-500">
                    Countries
                  </dt>
                  <dd className="mt-2 text-2xl font-bold text-slate-100">14</dd>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                  <dt className="text-xs uppercase tracking-wider text-slate-500">
                    Indicators
                  </dt>
                  <dd className="mt-2 text-2xl font-bold text-slate-100">10</dd>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                  <dt className="text-xs uppercase tracking-wider text-slate-500">
                    Analysis
                  </dt>
                  <dd className="mt-2 text-sm font-semibold text-slate-100">
                    Trends
                  </dd>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                  <dt className="text-xs uppercase tracking-wider text-slate-500">
                    Forecasts
                  </dt>
                  <dd className="mt-2 text-sm font-semibold text-slate-100">
                    3 years
                  </dd>
                </div>
              </dl>
            </aside>
          </section>

          <section className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <article
                key={feature.title}
                className="rounded-xl border border-slate-800 bg-slate-900 p-5"
              >
                <h3 className="text-sm font-bold text-slate-100">
                  {feature.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  {feature.description}
                </p>
              </article>
            ))}
          </section>

          <section className="mt-6 rounded-xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              How it works
            </p>

            <div className="mt-4 grid gap-3 md:grid-cols-4">
              {workflow.map((step, index) => (
                <div
                  key={step}
                  className="rounded-lg border border-slate-800 bg-slate-950 p-4"
                >
                  <span className="text-xs font-semibold text-blue-400">
                    Step {index + 1}
                  </span>

                  <p className="mt-2 text-sm font-medium text-slate-200">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
