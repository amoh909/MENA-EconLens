export interface Country {
  id: number;
  name: string;
  iso2_code: string;
  iso3_code: string;
  region: string;
  income_level: string;
}

export interface Indicator {
  id: number;
  code: string;
  name: string;
  description: string;
  category: string;
  unit: string;
  interpretation_direction: InterpretationDirection;
}

export interface DataPoint {
  year: number;
  value: number;
}

export interface DataSeriesResponse {
  country: string;
  iso3_code: string;
  indicator: string;
  indicator_code: string;
  unit: string;
  data: DataPoint[];
}

export type TrendDirection = "increasing" | "decreasing" | "stable";

export type InterpretationDirection =
  | "higher_is_better"
  | "lower_is_better"
  | "context_dependent";

export type EconomicAssessment =
  | "favorable"
  | "unfavorable"
  | "neutral"
  | "context_dependent";

export type VolatilityLevel = "low" | "moderate" | "high";

export interface TrendAnalysis {
  observation_count: number;

  period: {
    start_year: number;
    end_year: number;
  };

  trend: TrendDirection;

  interpretation: {
  direction: InterpretationDirection;
  assessment: EconomicAssessment;
  label: string;
  description: string;
};

  volatility: {
    level: VolatilityLevel;
    ratio: number;
  };

  latest: {
    year: number;
    value: number;
  };

  first: {
    year: number;
    value: number;
  };

  mean: number;
  standard_deviation: number;

  minimum: {
    year: number;
    value: number;
  };

  maximum: {
    year: number;
    value: number;
  };

  change: {
    absolute: number;
    percentage: number | null;
  };

  linear_model: {
    slope_per_year: number;
    intercept: number;
    r_squared: number;
  };

  summary_en: string;
}

export interface TrendAnalysisResponse {
  country: {
    name: string;
    iso3_code: string;
  };

  indicator: {
    name: string;
    code: string;
    unit: string;
    category: string;
  };

  requested_window: number;
  analysis: TrendAnalysis;
}

export interface CountryComparisonSeries {
  country: string;
  iso3_code: string;
  data: DataPoint[];
}

export interface CountryComparisonResponse {
  indicator: string;
  indicator_code: string;
  unit: string;
  series: CountryComparisonSeries[];
}

export interface ComparisonChartPoint {
  year: number;
  [countryName: string]: number | string | null;
}

export interface CountryComparisonStats {
  country: string;
  iso3_code: string;
  latestYear: number | null;
  latestValue: number | null;
  minimum: number | null;
  maximum: number | null;
  average: number | null;
  observationCount: number;
}

export interface ForecastPoint {
  year: number;
  value: number;
}

export interface ForecastAnalysis {
  method: string;

  training_period: {
    start_year: number;
    end_year: number;
  };

  observation_count: number;

  model: {
    slope_per_year: number;
    intercept: number;
    r_squared: number;
  };

  forecast: ForecastPoint[];

  warning: string;
}

export interface ForecastResponse {
  country: {
    name: string;
    iso3_code: string;
  };

  indicator: {
    name: string;
    code: string;
    unit: string;
    category: string;
  };

  requested_window: number;
  requested_years: number;
  forecast: ForecastAnalysis;
}
