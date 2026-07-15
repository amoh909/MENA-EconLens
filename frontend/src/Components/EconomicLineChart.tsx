import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { DataPoint } from "../types/economy";
import {
  formatAxisValue,
  formatEconomicValue,
} from "../utils/formatters";

interface EconomicLineChartProps {
  data: DataPoint[];
  indicatorName: string;
  unit: string;
}

export default function EconomicLineChart({
  data,
  indicatorName,
  unit,
}: EconomicLineChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex h-80 items-center justify-center rounded-lg border border-dashed border-slate-800 bg-slate-950">
        <p className="text-sm text-slate-500">
          No data is available for this indicator.
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
            formatter={(value) => [
              formatEconomicValue(Number(value), unit),
              indicatorName,
            ]}
          />

          <ReferenceLine
            y={0}
            stroke="#475569"
            strokeDasharray="4 4"
          />

          <Line
            type="monotone"
            dataKey="value"
            name={indicatorName}
            stroke="#60a5fa"
            strokeWidth={2.5}
            dot={false}
            activeDot={{
              r: 5,
              fill: "#60a5fa",
            }}
            connectNulls
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}