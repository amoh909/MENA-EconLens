import { api } from "./client";

import type {
  Country,
  CountryComparisonResponse,
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

export async function getCountries(): Promise<Country[]> {
  const response = await api.get<Country[]>("/countries/");
  return response.data;
}

export async function compareCountries(
  countryCodes: string[],
  indicatorCode: string,
): Promise<CountryComparisonResponse> {
  const response = await api.get<CountryComparisonResponse>(
    "/compare/countries/",
    {
      params: {
        countries: countryCodes.join(","),
        indicator: indicatorCode,
      },
    },
  );

  return response.data;
}

export async function getCountry(countryCode: string): Promise<Country> {
  const response = await api.get<Country>(`/countries/${countryCode}/`);

  return response.data;
}
