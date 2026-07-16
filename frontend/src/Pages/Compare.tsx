import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { compareCountries, getCountries, getIndicators } from "../api/econApi";

import ComparisonLineChart from "../Components/ComparisonLineChart";
import MetricCard from "../Components/MetricCard";

import type {
  Country,
  CountryComparisonResponse,
  Indicator,
} from "../types/economy";

import {
  buildComparisonStats,
  transformComparisonSeries,
} from "../utils/comparison";

import { formatEconomicValue } from "../utils/formatters";

const DEFAULT_COUNTRIES = ["LBN", "JOR", "EGY"];
const DEFAULT_INDICATOR = "NY.GDP.MKTP.KD.ZG";

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

export default function Compare() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [indicators, setIndicators] = useState<Indicator[]>([]);

  const [selectedCountries, setSelectedCountries] =
    useState<string[]>(DEFAULT_COUNTRIES);

  const [selectedIndicator, setSelectedIndicator] = useState(DEFAULT_INDICATOR);

  const [comparison, setComparison] =
    useState<CountryComparisonResponse | null>(null);

  const [isLoadingOptions, setIsLoadingOptions] = useState(true);
  const [isLoadingComparison, setIsLoadingComparison] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadOptions() {
      try {
        setIsLoadingOptions(true);

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
          setIsLoadingOptions(false);
        }
      }
    }

    void loadOptions();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadComparison() {
      if (selectedCountries.length === 0) {
        setComparison(null);
        return;
      }

      try {
        setIsLoadingComparison(true);
        setError(null);

        const result = await compareCountries(
          selectedCountries,
          selectedIndicator,
        );

        if (!cancelled) {
          setComparison(result);
        }
      } catch (requestError) {
        if (!cancelled) {
          setComparison(null);
          setError(getErrorMessage(requestError));
        }
      } finally {
        if (!cancelled) {
          setIsLoadingComparison(false);
        }
      }
    }

    void loadComparison();

    return () => {
      cancelled = true;
    };
  }, [selectedCountries, selectedIndicator]);

  const selectedIndicatorMeta = useMemo(
    () =>
      indicators.find((indicator) => indicator.code === selectedIndicator) ??
      null,
    [indicators, selectedIndicator],
  );

  const chartData = useMemo(() => {
    if (!comparison) {
      return [];
    }

    return transformComparisonSeries(comparison.series).filter(
      (point) => Number(point.year) >= 2000,
    );
  }, [comparison]);

  const stats = useMemo(() => {
    if (!comparison) {
      return [];
    }

    return buildComparisonStats(comparison.series);
  }, [comparison]);

  const bestLatest = useMemo(() => {
    const valid = stats.filter((item) => item.latestValue !== null);

    if (valid.length === 0) {
      return null;
    }

    return valid.reduce((best, item) =>
      Number(item.latestValue) > Number(best.latestValue) ? item : best,
    );
  }, [stats]);

  const weakestLatest = useMemo(() => {
    const valid = stats.filter((item) => item.latestValue !== null);

    if (valid.length === 0) {
      return null;
    }

    return valid.reduce((weakest, item) =>
      Number(item.latestValue) < Number(weakest.latestValue) ? item : weakest,
    );
  }, [stats]);

  function toggleCountry(countryCode: string) {
    setSelectedCountries((current) => {
      if (current.includes(countryCode)) {
        if (current.length === 1) {
          return current;
        }

        return current.filter((code) => code !== countryCode);
      }

      if (current.length >= 6) {
        return current;
      }

      return [...current, countryCode];
    });
  }

  const unit = comparison?.unit ?? selectedIndicatorMeta?.unit ?? "";

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-6 text-slate-100 sm:px-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex flex-col gap-4 border-b border-slate-900 pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-100">
              Cross-Country Data Comparison
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-slate-400">
              Compare MENA economies using real indicator series loaded through
              the Django API.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              to="/dashboard"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-500"
            >
              Lebanon dashboard
            </Link>

            <Link
              to="/"
              className="rounded-lg border border-slate-800 bg-slate-900 px-4 py-2 text-sm font-medium text-slate-200 transition-colors hover:border-slate-700"
            >
              Home
            </Link>
          </div>
        </header>

        <section className="grid gap-4 rounded-xl border border-slate-800 bg-slate-900 p-5 lg:grid-cols-3">
          <div className="space-y-2 lg:col-span-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Select countries
            </label>

            <div className="grid max-h-44 grid-cols-2 gap-2 overflow-y-auto rounded-lg border border-slate-800 bg-slate-950 p-3 sm:grid-cols-3 md:grid-cols-4">
              {countries.map((country) => {
                const isSelected = selectedCountries.includes(
                  country.iso3_code,
                );

                return (
                  <button
                    key={country.iso3_code}
                    type="button"
                    disabled={!isSelected && selectedCountries.length >= 6}
                    onClick={() => toggleCountry(country.iso3_code)}
                    className={`rounded-lg border px-3 py-2 text-left text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                      isSelected
                        ? "border-blue-500 bg-blue-950 text-blue-200"
                        : "border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                    }`}
                  >
                    <span className="block">{country.name}</span>

                    <span className="text-[10px] text-slate-500">
                      {country.iso3_code}
                    </span>
                  </button>
                );
              })}
            </div>

            <p className="text-xs text-slate-500">
              Select between 1 and 6 countries.
            </p>
          </div>

          <label className="space-y-2">
            <span className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Select indicator
            </span>

            <select
              value={selectedIndicator}
              disabled={isLoadingOptions}
              onChange={(event) => setSelectedIndicator(event.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-slate-200 outline-none transition-colors focus:border-blue-500 disabled:opacity-60"
            >
              {indicators.map((indicator) => (
                <option key={indicator.code} value={indicator.code}>
                  {indicator.name}
                </option>
              ))}
            </select>

            {selectedIndicatorMeta?.description && (
              <p className="text-xs leading-5 text-slate-500">
                {selectedIndicatorMeta.description}
              </p>
            )}
          </label>
        </section>

        {error && (
          <section className="rounded-xl border border-rose-900 bg-rose-950/40 p-5">
            <h2 className="font-semibold text-rose-300">
              Could not load comparison
            </h2>

            <p className="mt-2 text-sm text-rose-200/80">{error}</p>
          </section>
        )}

        {isLoadingComparison && (
          <section className="rounded-xl border border-slate-800 bg-slate-900 p-8 text-center">
            <p className="text-sm text-slate-400">Loading comparison data...</p>
          </section>
        )}

        {!isLoadingComparison && comparison && (
          <>
            <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <MetricCard
                label="Selected countries"
                value={String(comparison.series.length)}
                helper="Countries included in this comparison"
              />

              <MetricCard
                label="Indicator"
                value={comparison.indicator}
                helper={unit || "Unit not specified"}
              />

              <MetricCard
                label="Available years"
                value={String(chartData.length)}
                helper="Merged timeline from selected countries"
              />
            </section>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <section className="space-y-6 lg:col-span-2">
                <article className="rounded-xl border border-slate-800 bg-slate-900 p-5 sm:p-6">
                  <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-slate-100">
                        {comparison.indicator}
                      </h2>

                      <p className="mt-1 text-xs text-slate-500">
                        Country comparison from 2000 onward · Unit:{" "}
                        {unit || "not specified"}
                      </p>
                    </div>

                    <p className="text-xs text-slate-500">
                      {comparison.series.length} countries
                    </p>
                  </div>

                  <ComparisonLineChart
                    data={chartData}
                    series={comparison.series}
                    unit={unit}
                  />
                </article>

                <article className="rounded-xl border border-slate-800 bg-slate-900 p-6">
                  <h2 className="text-base font-semibold text-slate-100">
                    Summary table
                  </h2>

                  <div className="mt-4 overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-400">
                      <thead>
                        <tr className="border-b border-slate-800 text-xs uppercase text-slate-500">
                          <th className="py-3 pr-4">Country</th>
                          <th className="py-3 pr-4">Latest</th>
                          <th className="py-3 pr-4">Min</th>
                          <th className="py-3 pr-4">Max</th>
                          <th className="py-3 pr-4">Average</th>
                          <th className="py-3 pr-4">Obs.</th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-slate-800">
                        {stats.map((row) => (
                          <tr
                            key={row.iso3_code}
                            className="hover:bg-slate-950/70"
                          >
                            <td className="py-3 pr-4 font-medium text-slate-200">
                              <Link
                                to={`/countries/${row.iso3_code}`}
                                className="transition-colors hover:text-blue-300"
                              >
                                {row.country}
                              </Link>

                              <span className="ml-2 text-xs text-slate-500">
                                {row.iso3_code}
                              </span>
                            </td>

                            <td className="py-3 pr-4">
                              {formatEconomicValue(row.latestValue, unit)}
                              {row.latestYear && (
                                <span className="ml-1 text-xs text-slate-600">
                                  ({row.latestYear})
                                </span>
                              )}
                            </td>

                            <td className="py-3 pr-4">
                              {formatEconomicValue(row.minimum, unit)}
                            </td>

                            <td className="py-3 pr-4">
                              {formatEconomicValue(row.maximum, unit)}
                            </td>

                            <td className="py-3 pr-4">
                              {formatEconomicValue(row.average, unit)}
                            </td>

                            <td className="py-3 pr-4">
                              {row.observationCount}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </article>
              </section>

              <aside className="space-y-6">
                <article className="rounded-xl border border-slate-800 bg-slate-900 p-6">
                  <h2 className="text-base font-semibold text-slate-100">
                    Latest-value extremes
                  </h2>

                  <div className="mt-5 space-y-4">
                    <div className="rounded-lg border border-slate-800 bg-slate-950 p-4">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                        Highest latest value
                      </span>

                      <div className="mt-1 text-xl font-bold text-slate-100">
                        {bestLatest
                          ? formatEconomicValue(bestLatest.latestValue, unit)
                          : "—"}
                      </div>

                      <p className="mt-1 text-xs text-slate-400">
                        {bestLatest
                          ? `${bestLatest.country} in ${bestLatest.latestYear}`
                          : "Not enough data"}
                      </p>
                    </div>

                    <div className="rounded-lg border border-slate-800 bg-slate-950 p-4">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400">
                        Lowest latest value
                      </span>

                      <div className="mt-1 text-xl font-bold text-slate-100">
                        {weakestLatest
                          ? formatEconomicValue(weakestLatest.latestValue, unit)
                          : "—"}
                      </div>

                      <p className="mt-1 text-xs text-slate-400">
                        {weakestLatest
                          ? `${weakestLatest.country} in ${weakestLatest.latestYear}`
                          : "Not enough data"}
                      </p>
                    </div>
                  </div>
                </article>

                <article className="rounded-xl border border-slate-800 bg-slate-900 p-6">
                  <h2 className="text-base font-semibold text-slate-100">
                    Notes
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-slate-400">
                    Comparisons use available World Bank observations. Some
                    countries may have missing years depending on the selected
                    indicator.
                  </p>
                </article>
              </aside>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
