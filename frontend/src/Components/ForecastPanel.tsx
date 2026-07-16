import type { ForecastResponse } from "../types/economy";

import { formatEconomicValue } from "../utils/formatters";

interface ForecastPanelProps {
  forecastResponse: ForecastResponse;
}

export default function ForecastPanel({
  forecastResponse,
}: ForecastPanelProps) {
  const unit = forecastResponse.indicator.unit;
  const forecast = forecastResponse.forecast;

  return (
    <article className="rounded-xl border border-slate-800 bg-slate-900 p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-100">
            Simple forecast
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Linear regression over {forecast.training_period.start_year}–
            {forecast.training_period.end_year}
          </p>
        </div>

        <span className="rounded-full border border-blue-900 bg-blue-950 px-2.5 py-1 text-xs font-medium text-blue-300">
          {forecastResponse.requested_years} years
        </span>
      </div>

      <div className="mt-5 grid gap-3">
        {forecast.forecast.map((point) => (
          <div
            key={point.year}
            className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950 p-3"
          >
            <span className="text-sm font-medium text-slate-300">
              {point.year}
            </span>

            <span className="text-sm font-bold text-slate-100">
              {formatEconomicValue(point.value, unit)}
            </span>
          </div>
        ))}
      </div>

      <dl className="mt-5 space-y-3 border-t border-slate-800 pt-4 text-sm">
        <div className="flex items-center justify-between gap-3">
          <dt className="text-slate-500">R²</dt>

          <dd className="font-medium text-slate-200">
            {forecast.model.r_squared.toFixed(4)}
          </dd>
        </div>

        <div className="flex items-center justify-between gap-3">
          <dt className="text-slate-500">Slope/year</dt>

          <dd className="font-medium text-slate-200">
            {forecast.model.slope_per_year.toFixed(4)}
          </dd>
        </div>

        <div className="flex items-center justify-between gap-3">
          <dt className="text-slate-500">Observations</dt>

          <dd className="font-medium text-slate-200">
            {forecast.observation_count}
          </dd>
        </div>
      </dl>

      <p className="mt-5 rounded-lg border border-amber-900/60 bg-amber-950/30 p-3 text-xs leading-5 text-amber-200/80">
        {forecast.warning}
      </p>
    </article>
  );
}
