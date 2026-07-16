import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
  getDataSeries,
  getIndicators,
  getTrendAnalysis,
  getForecast,
} from "../api/econApi";

import EconomicLineChart from "../Components/EconomicLineChart";
import MetricCard from "../Components/MetricCard";
import ForecastPanel from "../Components/ForecastPanel";

import type {
  DataSeriesResponse,
  Indicator,
  TrendAnalysisResponse,
  VolatilityLevel,
  ForecastResponse,
  EconomicAssessment,
} from "../types/economy";

import { formatEconomicValue, formatSignedValue } from "../utils/formatters";

const COUNTRY_CODE = "LBN";
const DEFAULT_INDICATOR_CODE = "FP.CPI.TOTL.ZG";

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

    if (error.code === "ECONNABORTED") {
      return "The request timed out. Confirm that the Django server is running.";
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

export default function Dashboard() {
  const [indicators, setIndicators] = useState<Indicator[]>([]);
  const [selectedIndicatorCode, setSelectedIndicatorCode] = useState(
    DEFAULT_INDICATOR_CODE,
  );

  const [analysisWindow, setAnalysisWindow] = useState(10);

  const [series, setSeries] = useState<DataSeriesResponse | null>(null);

  const [trendResponse, setTrendResponse] =
    useState<TrendAnalysisResponse | null>(null);

  const [isLoadingIndicators, setIsLoadingIndicators] = useState(true);

  const [isLoadingDashboard, setIsLoadingDashboard] = useState(true);

  const [error, setError] = useState<string | null>(null);

  const [forecastResponse, setForecastResponse] =
    useState<ForecastResponse | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadIndicators() {
      try {
        setIsLoadingIndicators(true);

        const result = await getIndicators();

        if (!cancelled) {
          setIndicators(result);
        }
      } catch (requestError) {
        if (!cancelled) {
          setError(getErrorMessage(requestError));
        }
      } finally {
        if (!cancelled) {
          setIsLoadingIndicators(false);
        }
      }
    }

    void loadIndicators();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadDashboard() {
      try {
        setIsLoadingDashboard(true);
        setError(null);

        const [seriesResult, trendResult, forecastResult] = await Promise.all([
          getDataSeries(COUNTRY_CODE, selectedIndicatorCode),
          getTrendAnalysis(COUNTRY_CODE, selectedIndicatorCode, analysisWindow),
          getForecast(COUNTRY_CODE, selectedIndicatorCode, analysisWindow, 3),
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
          setIsLoadingDashboard(false);
        }
      }
    }

    void loadDashboard();

    return () => {
      cancelled = true;
    };
  }, [selectedIndicatorCode, analysisWindow]);

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
            <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-400">
              <span>MENA Region</span>
              <span>•</span>
              <span>Live World Bank Data</span>
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-slate-100">
              Lebanon Economic Dashboard
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-slate-400">
              Explore historical indicators and automated trend analysis using
              data stored by the EconLens Django API.
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
              to="/countries/LBN"
              className="rounded-lg border border-slate-800 bg-slate-900 px-4 py-2 text-sm font-medium text-slate-200 transition-colors hover:border-slate-700"
            >
              Lebanon profile
            </Link>

            <Link
              to="/"
              className="rounded-lg border border-slate-800 bg-slate-900 px-4 py-2 text-sm font-medium text-slate-200 transition-colors hover:border-slate-700"
            >
              Back home
            </Link>
          </div>
        </header>

        <section className="grid gap-4 rounded-xl border border-slate-800 bg-slate-900 p-5 md:grid-cols-2">
          <label className="space-y-2">
            <span className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Economic indicator
            </span>

            <select
              value={selectedIndicatorCode}
              disabled={isLoadingIndicators}
              onChange={(event) => setSelectedIndicatorCode(event.target.value)}
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

        {error && (
          <section className="rounded-xl border border-rose-900 bg-rose-950/40 p-5">
            <h2 className="font-semibold text-rose-300">
              Could not load dashboard
            </h2>

            <p className="mt-2 text-sm text-rose-200/80">{error}</p>
          </section>
        )}

        {isLoadingDashboard && (
          <section className="rounded-xl border border-slate-800 bg-slate-900 p-8 text-center">
            <p className="text-sm text-slate-400">
              Loading economic data and calculating trend analysis...
            </p>
          </section>
        )}

        {!isLoadingDashboard && analysis && series && (
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
                label="Period mean"
                value={formatEconomicValue(analysis.mean, unit)}
                helper={`${analysis.observation_count} observations analyzed`}
              />

              <MetricCard
                label="Volatility"
                value={analysis.volatility.level}
                helper={`Normalized ratio: ${analysis.volatility.ratio.toFixed(3)}`}
                status={analysis.volatility.level}
                statusClassName={getVolatilityClassName(
                  analysis.volatility.level,
                )}
              />
            </section>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <section className="space-y-6 lg:col-span-2">
                <article className="rounded-xl border border-slate-800 bg-slate-900 p-5 sm:p-6">
                  <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-slate-100">
                        {series.indicator}
                      </h2>

                      <p className="mt-1 text-xs text-slate-500">
                        Historical data from 2000 onward · Unit:{" "}
                        {series.unit || "not specified"}
                      </p>
                    </div>

                    <p className="text-xs text-slate-500">
                      {visibleSeries.length} available observations
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
                    Trend summary
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
                      <dt className="text-slate-500">Slope per year</dt>

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

                    <div className="flex items-center justify-between gap-3">
                      <dt className="text-slate-500">Standard deviation</dt>

                      <dd className="font-medium text-slate-200">
                        {formatEconomicValue(analysis.standard_deviation, unit)}
                      </dd>
                    </div>
                  </dl>

                  <p className="mt-5 border-t border-slate-800 pt-4 text-xs leading-5 text-slate-500">
                    These statistics describe historical movement. They are not
                    financial or economic advice.
                  </p>
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
