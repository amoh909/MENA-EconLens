import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";

import {
  getCountry,
  getDataSeries,
  getIndicators,
  getTrendAnalysis,
  getForecast,
} from "../api/econApi";

import EconomicLineChart from "../Components/EconomicLineChart";
import MetricCard from "../Components/MetricCard";
import ForecastPanel from "../Components/ForecastPanel";

import type {
  Country,
  DataSeriesResponse,
  Indicator,
  TrendAnalysisResponse,
  VolatilityLevel,
  ForecastResponse,
  EconomicAssessment,
} from "../types/economy";

import { formatEconomicValue, formatSignedValue } from "../utils/formatters";

const DEFAULT_INDICATOR_CODE = "NY.GDP.MKTP.KD.ZG";

function getAssessmentClassName(assessment: EconomicAssessment): string {
  switch (assessment) {
    case "favorable":
      return "text-emerald-400";

    case "unfavorable":
      return "text-rose-400";

    case "context_dependent":
      return "text-amber-400";

    default:
      return "text-slate-300";
  }
}

function getVolatilityClassName(volatility: VolatilityLevel): string {
  switch (volatility) {
    case "high":
      return "text-rose-400";
    case "moderate":
      return "text-amber-400";
    default:
      return "text-emerald-400";
  }
}

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

export default function CountryDetail() {
  const { iso3Code } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const countryCode = (iso3Code ?? "LBN").toUpperCase();

  const indicatorFromUrl =
    searchParams.get("indicator") ?? DEFAULT_INDICATOR_CODE;

  const [country, setCountry] = useState<Country | null>(null);
  const [indicators, setIndicators] = useState<Indicator[]>([]);

  const [selectedIndicatorCode, setSelectedIndicatorCode] =
    useState(indicatorFromUrl);

  const [analysisWindow, setAnalysisWindow] = useState(10);

  const [series, setSeries] = useState<DataSeriesResponse | null>(null);

  const [trendResponse, setTrendResponse] =
    useState<TrendAnalysisResponse | null>(null);

  const [isLoadingMeta, setIsLoadingMeta] = useState(true);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [forecastResponse, setForecastResponse] =
    useState<ForecastResponse | null>(null);

  useEffect(() => {
    setSelectedIndicatorCode(indicatorFromUrl);
  }, [indicatorFromUrl]);

  useEffect(() => {
    let cancelled = false;

    async function loadMeta() {
      try {
        setIsLoadingMeta(true);
        setError(null);

        const [countryResult, indicatorsResult] = await Promise.all([
          getCountry(countryCode),
          getIndicators(),
        ]);

        if (!cancelled) {
          setCountry(countryResult);
          setIndicators(indicatorsResult);
        }
      } catch (requestError) {
        if (!cancelled) {
          setCountry(null);
          setError(getErrorMessage(requestError));
        }
      } finally {
        if (!cancelled) {
          setIsLoadingMeta(false);
        }
      }
    }

    void loadMeta();

    return () => {
      cancelled = true;
    };
  }, [countryCode]);

  useEffect(() => {
    let cancelled = false;

    async function loadCountryData() {
      try {
        setIsLoadingData(true);
        setError(null);

        const [seriesResult, trendResult, forecastResult] = await Promise.all([
          getDataSeries(countryCode, selectedIndicatorCode),
          getTrendAnalysis(countryCode, selectedIndicatorCode, analysisWindow),
          getForecast(countryCode, selectedIndicatorCode, analysisWindow, 3),
        ]);

        if (!cancelled) {
          setSeries(seriesResult);
          setTrendResponse(trendResult);
          setForecastResponse(forecastResult);
        }
      } catch (requestError) {
        if (!cancelled) {
          setSeries(null);
          setTrendResponse(null);
          setForecastResponse(null);
          setError(getErrorMessage(requestError));
        }
      } finally {
        if (!cancelled) {
          setIsLoadingData(false);
        }
      }
    }

    void loadCountryData();

    return () => {
      cancelled = true;
    };
  }, [countryCode, selectedIndicatorCode, analysisWindow]);

  const selectedIndicator = useMemo(
    () =>
      indicators.find(
        (indicator) => indicator.code === selectedIndicatorCode,
      ) ?? null,
    [indicators, selectedIndicatorCode],
  );

  const visibleSeries = useMemo(() => {
    if (!series) {
      return [];
    }

    return series.data.filter((point) => point.year >= 2000);
  }, [series]);

  const analysis = trendResponse?.analysis;

  const unit = trendResponse?.indicator.unit ?? selectedIndicator?.unit ?? "";

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-6 text-slate-100 sm:px-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex flex-col gap-4 border-b border-slate-900 pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">
              Country profile
            </span>

            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-100">
              {country?.name ?? countryCode}
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-slate-400">
              Explore country-specific macroeconomic indicators, trend
              diagnostics, and historical World Bank data.
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
              to={`/countries?indicator=${encodeURIComponent(selectedIndicatorCode)}`}
              className="rounded-lg border border-slate-800 bg-slate-900 px-4 py-2 text-sm font-medium text-slate-200 transition-colors hover:border-slate-700"
            >
              Countries
            </Link>
          </div>
        </header>

        {error && (
          <section className="rounded-xl border border-rose-900 bg-rose-950/40 p-5">
            <h2 className="font-semibold text-rose-300">
              Could not load country page
            </h2>

            <p className="mt-2 text-sm text-rose-200/80">{error}</p>
          </section>
        )}

        <section className="grid gap-4 md:grid-cols-3">
          <article className="rounded-xl border border-slate-800 bg-slate-900 p-5 md:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Country
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-3">
              <h2 className="text-2xl font-bold text-slate-100">
                {country?.name ?? "Loading..."}
              </h2>

              {country && (
                <span className="rounded-full border border-blue-900 bg-blue-950 px-2.5 py-1 text-xs font-medium text-blue-300">
                  {country.iso3_code}
                </span>
              )}

              {country?.region && (
                <span className="rounded-full border border-slate-700 bg-slate-950 px-2.5 py-1 text-xs font-medium text-slate-400">
                  {country.region}
                </span>
              )}
            </div>

            <p className="mt-3 text-sm leading-6 text-slate-400">
              This page uses the same EconLens data pipeline as the dashboard,
              but allows country-specific exploration through the dynamic route{" "}
              <span className="font-mono text-slate-300">
                /countries/{countryCode}
              </span>
              .
            </p>
          </article>

          <article className="rounded-xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Metadata
            </p>

            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-slate-500">ISO2</dt>
                <dd className="font-medium text-slate-200">
                  {country?.iso2_code ?? "—"}
                </dd>
              </div>

              <div className="flex justify-between gap-4">
                <dt className="text-slate-500">ISO3</dt>
                <dd className="font-medium text-slate-200">
                  {country?.iso3_code ?? "—"}
                </dd>
              </div>

              <div className="flex justify-between gap-4">
                <dt className="text-slate-500">Income level</dt>
                <dd className="font-medium text-slate-200">
                  {country?.income_level || "Not specified"}
                </dd>
              </div>
            </dl>
          </article>
        </section>

        <section className="grid gap-4 rounded-xl border border-slate-800 bg-slate-900 p-5 md:grid-cols-2">
          <label className="space-y-2">
            <span className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Economic indicator
            </span>

            <select
              value={selectedIndicatorCode}
              disabled={isLoadingMeta}
              onChange={(event) => {
                const nextIndicator = event.target.value;
                const nextParams = new URLSearchParams(searchParams);

                nextParams.set("indicator", nextIndicator);

                setSelectedIndicatorCode(nextIndicator);
                setSearchParams(nextParams);
              }}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-slate-200 outline-none transition-colors focus:border-blue-500 disabled:opacity-60"
            >
              {indicators.map((indicator) => (
                <option key={indicator.code} value={indicator.code}>
                  {indicator.name}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2">
            <span className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Trend-analysis window
            </span>

            <select
              value={analysisWindow}
              onChange={(event) =>
                setAnalysisWindow(Number(event.target.value))
              }
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-slate-200 outline-none transition-colors focus:border-blue-500"
            >
              <option value={5}>Latest 5 observations</option>
              <option value={10}>Latest 10 observations</option>
              <option value={15}>Latest 15 observations</option>
              <option value={20}>Latest 20 observations</option>
            </select>
          </label>
        </section>

        {isLoadingData && (
          <section className="rounded-xl border border-slate-800 bg-slate-900 p-8 text-center">
            <p className="text-sm text-slate-400">
              Loading country indicator data...
            </p>
          </section>
        )}

        {!isLoadingData && analysis && series && (
          <>
            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <MetricCard
                label="Latest value"
                value={formatEconomicValue(analysis.latest.value, unit)}
                helper={`Recorded in ${analysis.latest.year}`}
                status={analysis.interpretation.label}
                statusClassName={getAssessmentClassName(
                  analysis.interpretation.assessment,
                )}
              />

              <MetricCard
                label="Period change"
                value={formatSignedValue(analysis.change.absolute, unit)}
                helper={
                  analysis.change.percentage === null
                    ? `${analysis.period.start_year}–${analysis.period.end_year}`
                    : `${analysis.change.percentage > 0 ? "+" : ""}${analysis.change.percentage.toFixed(2)}% relative change`
                }
              />

              <MetricCard
                label="Mean"
                value={formatEconomicValue(analysis.mean, unit)}
                helper={`${analysis.observation_count} observations analyzed`}
              />

              <MetricCard
                label="Volatility"
                value={analysis.volatility.level}
                helper={`Ratio: ${analysis.volatility.ratio.toFixed(3)}`}
                status={analysis.volatility.level}
                statusClassName={getVolatilityClassName(
                  analysis.volatility.level,
                )}
              />
            </section>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <section className="space-y-6 lg:col-span-2">
                <article className="rounded-xl border border-slate-800 bg-slate-900 p-5 sm:p-6">
                  <div className="mb-5">
                    <h2 className="text-lg font-semibold text-slate-100">
                      {series.indicator}
                    </h2>

                    <p className="mt-1 text-xs text-slate-500">
                      Historical data from 2000 onward · Unit:{" "}
                      {series.unit || "not specified"}
                    </p>
                  </div>

                  <EconomicLineChart
                    data={visibleSeries}
                    indicatorName={series.indicator}
                    unit={series.unit}
                  />
                </article>

                <article className="rounded-xl border border-slate-800 bg-slate-900 p-6">
                  <h2 className="text-lg font-semibold text-slate-100">
                    Country trend summary
                  </h2>

                  <p className="mt-3 text-sm leading-7 text-slate-400">
                    {analysis.summary_en}
                  </p>
                </article>
              </section>

              <aside className="space-y-6">
                <article className="rounded-xl border border-slate-800 bg-slate-900 p-6">
                  <h2 className="text-lg font-semibold text-slate-100">
                    Observed range
                  </h2>

                  <dl className="mt-5 space-y-4">
                    <div className="rounded-lg border border-slate-800 bg-slate-950 p-4">
                      <dt className="text-xs uppercase tracking-wider text-slate-500">
                        Minimum
                      </dt>
                      <dd className="mt-1 text-lg font-bold text-slate-100">
                        {formatEconomicValue(analysis.minimum.value, unit)}
                      </dd>
                      <p className="mt-1 text-xs text-slate-500">
                        Recorded in {analysis.minimum.year}
                      </p>
                    </div>

                    <div className="rounded-lg border border-slate-800 bg-slate-950 p-4">
                      <dt className="text-xs uppercase tracking-wider text-slate-500">
                        Maximum
                      </dt>
                      <dd className="mt-1 text-lg font-bold text-slate-100">
                        {formatEconomicValue(analysis.maximum.value, unit)}
                      </dd>
                      <p className="mt-1 text-xs text-slate-500">
                        Recorded in {analysis.maximum.year}
                      </p>
                    </div>
                  </dl>
                </article>

                <article className="rounded-xl border border-slate-800 bg-slate-900 p-6">
                  <h2 className="text-lg font-semibold text-slate-100">
                    Model diagnostics
                  </h2>

                  <dl className="mt-5 space-y-3 text-sm">
                    <div className="flex items-center justify-between gap-3">
                      <dt className="text-slate-500">Slope/year</dt>
                      <dd className="font-medium text-slate-200">
                        {analysis.linear_model.slope_per_year.toFixed(4)}
                      </dd>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <dt className="text-slate-500">R²</dt>
                      <dd className="font-medium text-slate-200">
                        {analysis.linear_model.r_squared.toFixed(4)}
                      </dd>
                    </div>
                  </dl>
                </article>
                {forecastResponse && (
                  <ForecastPanel forecastResponse={forecastResponse} />
                )}
              </aside>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
