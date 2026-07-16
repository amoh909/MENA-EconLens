import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import { getCountries, getIndicators } from "../api/econApi";

import type { Country, Indicator } from "../types/economy";

const DEFAULT_INDICATOR = "FP.CPI.TOTL.ZG";

function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const backendMessage = error.response?.data?.detail;

    if (typeof backendMessage === "string") {
      return backendMessage;
    }

    if (!error.response) {
      return "Could not connect to the Django API. Confirm that it is running on port 8000.";
    }

    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "An unexpected error occurred.";
}

export default function Countries() {
  const [searchParams, setSearchParams] = useSearchParams();

  const indicatorFromUrl = searchParams.get("indicator") ?? DEFAULT_INDICATOR;

  const queryFromUrl = searchParams.get("q") ?? "";

  const [countries, setCountries] = useState<Country[]>([]);
  const [indicators, setIndicators] = useState<Indicator[]>([]);

  const [selectedIndicator, setSelectedIndicator] = useState(indicatorFromUrl);

  const [query, setQuery] = useState(queryFromUrl);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setSelectedIndicator(indicatorFromUrl);
  }, [indicatorFromUrl]);

  useEffect(() => {
    setQuery(queryFromUrl);
  }, [queryFromUrl]);

  useEffect(() => {
    let cancelled = false;

    async function loadPageData() {
      try {
        setIsLoading(true);
        setError(null);

        const [countriesResult, indicatorsResult] = await Promise.all([
          getCountries(),
          getIndicators(),
        ]);

        if (!cancelled) {
          setCountries(countriesResult);
          setIndicators(indicatorsResult);
        }
      } catch (requestError) {
        if (!cancelled) {
          setError(getErrorMessage(requestError));
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadPageData();

    return () => {
      cancelled = true;
    };
  }, []);

  const selectedIndicatorMeta = useMemo(
    () =>
      indicators.find((indicator) => indicator.code === selectedIndicator) ??
      null,
    [indicators, selectedIndicator],
  );

  const filteredCountries = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return countries;
    }

    return countries.filter((country) => {
      return (
        country.name.toLowerCase().includes(normalizedQuery) ||
        country.iso2_code.toLowerCase().includes(normalizedQuery) ||
        country.iso3_code.toLowerCase().includes(normalizedQuery)
      );
    });
  }, [countries, query]);

  function updateIndicator(nextIndicator: string) {
    const nextParams = new URLSearchParams(searchParams);

    nextParams.set("indicator", nextIndicator);

    if (query.trim()) {
      nextParams.set("q", query.trim());
    } else {
      nextParams.delete("q");
    }

    setSelectedIndicator(nextIndicator);
    setSearchParams(nextParams);
  }

  function updateQuery(nextQuery: string) {
    const nextParams = new URLSearchParams(searchParams);

    nextParams.set("indicator", selectedIndicator);

    if (nextQuery.trim()) {
      nextParams.set("q", nextQuery.trim());
    } else {
      nextParams.delete("q");
    }

    setQuery(nextQuery);
    setSearchParams(nextParams);
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-6 text-slate-100 sm:px-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex flex-col gap-4 border-b border-slate-900 pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">
              Country explorer
            </span>

            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-100">
              Explore MENA countries
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
              Browse all available countries, choose an indicator context, and
              open a country profile with that indicator already selected.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              to="/compare"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-500"
            >
              Compare countries
            </Link>

            <Link
              to="/indicators"
              className="rounded-lg border border-slate-800 bg-slate-900 px-4 py-2 text-sm font-medium text-slate-200 transition-colors hover:border-slate-700"
            >
              Indicators
            </Link>

            <Link
              to="/"
              className="rounded-lg border border-slate-800 bg-slate-900 px-4 py-2 text-sm font-medium text-slate-200 transition-colors hover:border-slate-700"
            >
              Home
            </Link>
          </div>
        </header>

        <section className="grid gap-4 rounded-xl border border-slate-800 bg-slate-900 p-5 md:grid-cols-2">
          <label className="space-y-2">
            <span className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Search countries
            </span>

            <input
              value={query}
              onChange={(event) => updateQuery(event.target.value)}
              placeholder="Search Lebanon, Jordan, EGY..."
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-slate-200 outline-none transition-colors placeholder:text-slate-600 focus:border-blue-500"
            />
          </label>

          <label className="space-y-2">
            <span className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Default indicator when opening profiles
            </span>

            <select
              value={selectedIndicator}
              disabled={isLoading}
              onChange={(event) => updateIndicator(event.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-slate-200 outline-none transition-colors focus:border-blue-500 disabled:opacity-60"
            >
              {indicators.map((indicator) => (
                <option key={indicator.code} value={indicator.code}>
                  {indicator.name}
                </option>
              ))}
            </select>
          </label>
        </section>

        {selectedIndicatorMeta && (
          <section className="rounded-xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Selected context
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-3">
              <h2 className="text-xl font-bold text-slate-100">
                {selectedIndicatorMeta.name}
              </h2>

              {selectedIndicatorMeta.category && (
                <span className="rounded border border-blue-900 bg-blue-950 px-2 py-0.5 text-xs font-medium text-blue-300">
                  {selectedIndicatorMeta.category}
                </span>
              )}

              {selectedIndicatorMeta.unit && (
                <span className="rounded border border-slate-700 bg-slate-950 px-2 py-0.5 text-xs font-medium text-slate-400">
                  {selectedIndicatorMeta.unit}
                </span>
              )}
            </div>

            <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-400">
              {selectedIndicatorMeta.description ||
                "No description is available for this indicator."}
            </p>
          </section>
        )}

        {error && (
          <section className="rounded-xl border border-rose-900 bg-rose-950/40 p-5">
            <h2 className="font-semibold text-rose-300">
              Could not load countries
            </h2>

            <p className="mt-2 text-sm text-rose-200/80">{error}</p>
          </section>
        )}

        {isLoading && (
          <section className="rounded-xl border border-slate-800 bg-slate-900 p-8 text-center">
            <p className="text-sm text-slate-400">Loading countries...</p>
          </section>
        )}

        {!isLoading && (
          <section className="space-y-3">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-100">
                  Countries
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Showing {filteredCountries.length} of {countries.length}{" "}
                  countries.
                </p>
              </div>

              <Link
                to={`/compare`}
                className="text-sm font-medium text-blue-400 transition-colors hover:text-blue-300"
              >
                Open comparison tool
              </Link>
            </div>

            {filteredCountries.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-800 bg-slate-900 p-8 text-center">
                <p className="text-sm text-slate-400">
                  No countries match your search.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredCountries.map((country) => (
                  <Link
                    key={country.iso3_code}
                    to={`/countries/${country.iso3_code}?indicator=${encodeURIComponent(selectedIndicator)}`}
                    className="group rounded-xl border border-slate-800 bg-slate-900 p-5 transition-colors hover:border-blue-800 hover:bg-slate-900/80"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-bold text-slate-100 transition-colors group-hover:text-blue-300">
                          {country.name}
                        </h3>

                        <p className="mt-1 text-xs text-slate-500">
                          {country.iso2_code} · {country.iso3_code}
                        </p>
                      </div>

                      <span className="rounded-full border border-slate-700 bg-slate-950 px-2.5 py-1 text-xs font-medium text-slate-400">
                        {country.region || "MENA"}
                      </span>
                    </div>


                    <p className="mt-5 text-xs font-medium text-blue-400">
                      View country profile →
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
