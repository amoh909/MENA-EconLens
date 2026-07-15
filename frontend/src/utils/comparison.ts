import type {
  ComparisonChartPoint,
  CountryComparisonSeries,
  CountryComparisonStats,
} from "../types/economy";

export function transformComparisonSeries(
  series: CountryComparisonSeries[],
): ComparisonChartPoint[] {
  const yearMap: Record<number, ComparisonChartPoint> = {};

  for (const countrySeries of series) {
    for (const point of countrySeries.data) {
      if (!yearMap[point.year]) {
        yearMap[point.year] = {
          year: point.year,
        };
      }

      yearMap[point.year][countrySeries.country] = point.value;
    }
  }

  return Object.values(yearMap).sort(
    (a, b) => Number(a.year) - Number(b.year),
  );
}

export function buildComparisonStats(
  series: CountryComparisonSeries[],
): CountryComparisonStats[] {
  return series.map((countrySeries) => {
    const validPoints = countrySeries.data
      .filter((point) => point.value !== null && point.value !== undefined)
      .sort((a, b) => a.year - b.year);

    if (validPoints.length === 0) {
      return {
        country: countrySeries.country,
        iso3_code: countrySeries.iso3_code,
        latestYear: null,
        latestValue: null,
        minimum: null,
        maximum: null,
        average: null,
        observationCount: 0,
      };
    }

    const values = validPoints.map((point) => point.value);
    const latest = validPoints[validPoints.length - 1];

    const average =
      values.reduce((sum, value) => sum + value, 0) / values.length;

    return {
      country: countrySeries.country,
      iso3_code: countrySeries.iso3_code,
      latestYear: latest.year,
      latestValue: latest.value,
      minimum: Math.min(...values),
      maximum: Math.max(...values),
      average,
      observationCount: validPoints.length,
    };
  });
}