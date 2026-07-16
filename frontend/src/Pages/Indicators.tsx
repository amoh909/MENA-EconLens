import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import {
  compareCountries,
  getCountries,
  getDataSeries,
  getIndicators,
} from "../api/econApi";

import EconomicLineChart from "../Components/EconomicLineChart";
import MetricCard from "../Components/MetricCard";

import type {
  Country,
  CountryComparisonResponse,
  DataSeriesResponse,
  Indicator,
} from "../types/economy";

import { formatEconomicValue } from "../utils/formatters";

const DEFAULT_INDICATOR = "FP.CPI.TOTL.ZG";
const DEFAULT_COUNTRY = "LBN";

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

function getLatestValue(
  data: { year: number; value: number }[],
): { year: number; value: number } | null {
  if (data.length === 0) {
    return null;
  }

  const sorted = [...data].sort((a, b) => a.year - b.year);
  return sorted[sorted.length - 1];
}

export default function Indicators() {
  const [searchParams, setSearchParams] = useSearchParams();

  const indicatorFromUrl =
    searchParams.get("indicator") ?? DEFAULT_INDICATOR;

  const countryFromUrl =
    searchParams.get("country") ?? DEFAULT_COUNTRY;

  const [countries, setCountries] = useState<Country[]>([]);
  const [indicators, setIndicators] = useState<Indicator[]>([]);

  const [selectedIndicator, setSelectedIndicator] =
    useState(indicatorFromUrl);

  const [selectedCountry, setSelectedCountry] =
    useState(countryFromUrl.toUpperCase());

  const [comparison, setComparison] =
    useState<CountryComparisonResponse | null>(null);

  const [series, setSeries] =
    useState<DataSeriesResponse | null>(null);

  const [isLoadingOptions, setIsLoadingOptions] = useState(true);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setSelectedIndicator(indicatorFromUrl);
  }, [indicatorFromUrl]);

  useEffect(() => {
    setSelectedCountry(countryFromUrl.toUpperCase());
  }, [countryFromUrl]);

  useEffect(() => {
    let cancelled = false;

    async function loadOptions() {
      try {
        setIsLoadingOptions(true);
        setError(null);

        const [countriesResult, indicatorsResult] =
          await Promise.all([
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

    async function loadIndicatorData() {
      try {
        setIsLoadingData(true);
        setError(null);

        const countryCodes =
          countries.length > 0
            ? countries.map((country) => country.iso3_code)
            : ["LBN", "JOR", "EGY"];

        const [comparisonResult, seriesResult] =
          await Promise.all([
            compareCountries(countryCodes, selectedIndicator),
            getDataSeries(selectedCountry, selectedIndicator),
          ]);

        if (!cancelled) {
          setComparison(comparisonResult);
          setSeries(seriesResult);
        }
      } catch (requestError) {
        if (!cancelled) {
          setComparison(null);
          setSeries(null);
          setError(getErrorMessage(requestError));
        }
      } finally {
        if (!cancelled) {
          setIsLoadingData(false);
        }
      }
    }

    void loadIndicatorData();

    return () => {
      cancelled = true;
    };
  }, [countries, selectedCountry, selectedIndicator]);

  const selectedIndicatorMeta = useMemo(
    () =>
      indicators.find(
        (indicator) => indicator.code === selectedIndicator,
      ) ?? null,
    [indicators, selectedIndicator],
  );

  const selectedCountryMeta = useMemo(
    () =>
      countries.find(
        (country) => country.iso3_code === selectedCountry,
      ) ?? null,
    [countries, selectedCountry],
  );

  const latestRows = useMemo(() => {
    if (!comparison) {
      return [];
    }

    return comparison.series
      .map((countrySeries) => {
        const latest = getLatestValue(countrySeries.data);

        return {
          country: countrySeries.country,
          iso3Code: countrySeries.iso3_code,
          latestYear: latest?.year ?? null,
          latestValue: latest?.value ?? null,
          observationCount: countrySeries.data.length,
        };
      })
      .sort((a, b) => {
        if (a.latestValue === null && b.latestValue === null) {
          return a.country.localeCompare(b.country);
        }

        if (a.latestValue === null) {
          return 1;
        }

        if (b.latestValue === null) {
          return -1;
        }

        return b.latestValue - a.latestValue;
      });
  }, [comparison]);

  const visibleSeries = useMemo(() => {
    if (!series) {
      return [];
    }

    return series.data.filter((point) => point.year >= 2000);
  }, [series]);

  const countriesWithData = latestRows.filter(
    (row) => row.latestValue !== null,
  );

  const highestLatest = countriesWithData[0] ?? null;
  const lowestLatest =
    countriesWithData.length > 0
      ? countriesWithData[countriesWithData.length - 1]
      : null;

  const unit =
    comparison?.unit ??
    series?.unit ??
    selectedIndicatorMeta?.unit ??
    "";

  function updateSelectedIndicator(nextIndicator: string) {
    const nextParams = new URLSearchParams(searchParams);

    nextParams.set("indicator", nextIndicator);
    nextParams.set("country", selectedCountry);

    setSelectedIndicator(nextIndicator);
    setSearchParams(nextParams);
  }

  function updateSelectedCountry(nextCountry: string) {
    const nextParams = new URLSearchParams(searchParams);

    nextParams.set("indicator", selectedIndicator);
    nextParams.set("country", nextCountry);

    setSelectedCountry(nextCountry);
    setSearchParams(nextParams);
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-6 text-slate-100 sm:px-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex flex-col gap-4 border-b border-slate-900 pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">
              Global analytics
            </span>

            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-100">
              Economic Indicators Explorer
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-slate-400">
              Browse macroeconomic indicators, inspect latest regional
              values, and open country pages with the selected indicator
              preserved.
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
              to="/dashboard"
              className="rounded-lg border border-slate-800 bg-slate-900 px-4 py-2 text-sm font-medium text-slate-200 transition-colors hover:border-slate-700"
            >
              Dashboard
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
              Indicator
            </span>

            <select
              value={selectedIndicator}
              disabled={isLoadingOptions}
              onChange={(event) =>
                updateSelectedIndicator(event.target.value)
              }
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-slate-200 outline-none transition-colors focus:border-blue-500 disabled:opacity-60"
            >
              {indicators.map((indicator) => (
                <option
                  key={indicator.code}
                  value={indicator.code}
                >
                  {indicator.name}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2">
            <span className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Country timeline focus
            </span>

            <select
              value={selectedCountry}
              disabled={isLoadingOptions}
              onChange={(event) =>
                updateSelectedCountry(event.target.value)
              }
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-slate-200 outline-none transition-colors focus:border-blue-500 disabled:opacity-60"
            >
              {countries.map((country) => (
                <option
                  key={country.iso3_code}
                  value={country.iso3_code}
                >
                  {country.name}
                </option>
              ))}
            </select>
          </label>
        </section>

        {error && (
          <section className="rounded-xl border border-rose-900 bg-rose-950/40 p-5">
            <h2 className="font-semibold text-rose-300">
              Could not load indicators page
            </h2>

            <p className="mt-2 text-sm text-rose-200/80">
              {error}
            </p>
          </section>
        )}

        {selectedIndicatorMeta && (
          <section className="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <div className="flex flex-wrap items-center gap-3">
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

            <p className="mt-3 font-mono text-xs text-slate-500">
              {selectedIndicatorMeta.code}
            </p>
          </section>
        )}

        {!isLoadingData && comparison && (
          <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <MetricCard
              label="Countries tracked"
              value={String(comparison.series.length)}
              helper="Countries included in this indicator view"
            />

            <MetricCard
              label="Highest latest value"
              value={
                highestLatest
                  ? formatEconomicValue(highestLatest.latestValue, unit)
                  : "—"
              }
              helper={
                highestLatest
                  ? `${highestLatest.country} (${highestLatest.latestYear})`
                  : "No latest value available"
              }
            />

            <MetricCard
              label="Lowest latest value"
              value={
                lowestLatest
                  ? formatEconomicValue(lowestLatest.latestValue, unit)
                  : "—"
              }
              helper={
                lowestLatest
                  ? `${lowestLatest.country} (${lowestLatest.latestYear})`
                  : "No latest value available"
              }
            />
          </section>
        )}

        {isLoadingData && (
          <section className="rounded-xl border border-slate-800 bg-slate-900 p-8 text-center">
            <p className="text-sm text-slate-400">
              Loading indicator data...
            </p>
          </section>
        )}

        {!isLoadingData && comparison && (
          <section className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
              Regional latest values
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {latestRows.map((row) => (
                <Link
                  key={row.iso3Code}
                  to={`/countries/${row.iso3Code}?indicator=${encodeURIComponent(selectedIndicator)}`}
                  className="rounded-xl border border-slate-800 bg-slate-900 p-4 transition-colors hover:border-blue-800 hover:bg-slate-900/80"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="space-y-0.5">
                      <p className="text-sm font-semibold text-slate-200">
                        {row.country}
                      </p>

                      <p className="text-xs text-slate-500">
                        {row.iso3Code}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-lg font-bold text-slate-100">
                        {formatEconomicValue(row.latestValue, unit)}
                      </p>

                      <span className="text-[10px] font-medium uppercase tracking-wide text-slate-500">
                        {row.latestYear
                          ? `Latest ${row.latestYear}`
                          : "No data"}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {!isLoadingData && series && (
          <section className="rounded-xl border border-slate-800 bg-slate-900 p-5 sm:p-6">
            <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h3 className="text-base font-semibold text-slate-100">
                  Historical timeline focus
                </h3>

                <p className="mt-1 text-xs text-slate-400">
                  {selectedCountryMeta?.name ?? selectedCountry} ·{" "}
                  {series.indicator} · from 2000 onward
                </p>
              </div>

              <Link
                to={`/countries/${selectedCountry}?indicator=${encodeURIComponent(selectedIndicator)}`}
                className="text-sm font-medium text-blue-400 transition-colors hover:text-blue-300"
              >
                Open country profile
              </Link>
            </div>

            <EconomicLineChart
              data={visibleSeries}
              indicatorName={series.indicator}
              unit={series.unit}
            />
          </section>
        )}
      </div>
    </div>
  );
}