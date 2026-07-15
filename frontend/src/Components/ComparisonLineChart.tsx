import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type {
  ComparisonChartPoint,
  CountryComparisonSeries,
} from "../types/economy";

import {
  formatAxisValue,
  formatEconomicValue,
} from "../utils/formatters";

interface ComparisonLineChartProps {
  data: ComparisonChartPoint[];
  series: CountryComparisonSeries[];
  unit: string;
}

const COLORS = [
  "#60a5fa",
  "#34d399",
  "#fbbf24",
  "#fb7185",
  "#a78bfa",
  "#22d3ee",
];

export default function ComparisonLineChart({
  data,
  series,
  unit,
}: ComparisonLineChartProps) {
  if (data.length === 0 || series.length === 0) {
    return (
      <div className="flex h-80 items-center justify-center rounded-lg border border-dashed border-slate-800 bg-slate-950">
        <p className="text-sm text-slate-500">
          No comparison data is available.
        </p>
      </div>
    );
  }

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 10,
            right: 20,
            bottom: 5,
            left: 5,
          }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#1e293b"
          />

          <XAxis
            dataKey="year"
            stroke="#64748b"
            tick={{
              fill: "#94a3b8",
              fontSize: 12,
            }}
            tickLine={false}
          />

          <YAxis
            stroke="#64748b"
            tick={{
              fill: "#94a3b8",
              fontSize: 12,
            }}
            tickFormatter={formatAxisValue}
            tickLine={false}
            width={75}
          />

          <Tooltip
            contentStyle={{
              background: "#0f172a",
              border: "1px solid #334155",
              borderRadius: "8px",
              color: "#e2e8f0",
            }}
            labelStyle={{
              color: "#94a3b8",
            }}
            labelFormatter={(year) => `Year: ${year}`}
            formatter={(value, name) => [
              formatEconomicValue(Number(value), unit),
              String(name),
            ]}
          />

          <Legend
            wrapperStyle={{
              color: "#cbd5e1",
              fontSize: 12,
            }}
          />

          <ReferenceLine
            y={0}
            stroke="#475569"
            strokeDasharray="4 4"
          />

          {series.map((countrySeries, index) => (
            <Line
              key={countrySeries.iso3_code}
              type="monotone"
              dataKey={countrySeries.country}
              stroke={COLORS[index % COLORS.length]}
              strokeWidth={2.5}
              dot={false}
              activeDot={{
                r: 5,
              }}
              connectNulls
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}