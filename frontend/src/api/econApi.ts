import { api } from "./client";

import type {
  DataSeriesResponse,
  Indicator,
  TrendAnalysisResponse,
} from "../types/economy";

export async function getIndicators(): Promise<Indicator[]> {
  const response = await api.get<Indicator[]>("/indicators/");
  return response.data;
}

export async function getDataSeries(
  countryCode: string,
  indicatorCode: string,
): Promise<DataSeriesResponse> {
  const response = await api.get<DataSeriesResponse>("/data/", {
    params: {
      country: countryCode,
      indicator: indicatorCode,
    },
  });

  return response.data;
}

export async function getTrendAnalysis(
  countryCode: string,
  indicatorCode: string,
  window: number,
): Promise<TrendAnalysisResponse> {
  const response = await api.get<TrendAnalysisResponse>("/analysis/trend/", {
    params: {
      country: countryCode,
      indicator: indicatorCode,
      window,
    },
  });

  return response.data;
}
