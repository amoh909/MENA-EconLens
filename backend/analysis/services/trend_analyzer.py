from __future__ import annotations

from statistics import fmean, pstdev
from math import isfinite
from typing import Any

class InsufficientDataError(Exception):
    """Exception raised when there is insufficient data for analysis."""
    
def _rounded(value: float | None, digits: int = 4) -> float | None:
    if value is None:
        return None

    return round(float(value), digits)

def _linear_regression(years: list[int], values: list[float]) -> tuple[float, float, float]:
    """
    Calculate a simple least-squares linear regression
    
    Returns:
        slope, intercept, r_squared
    """

    x_mean = fmean(years)
    y_mean = fmean(values)

    denominator = sum((x - x_mean) ** 2 for x in years)

    if denominator == 0:
        return 0.0, y_mean, 0.0
    
    numerator = sum((x - x_mean) * (y - y_mean) for x, y in zip(years, values))

    slope = numerator / denominator
    intercept = y_mean - slope * x_mean

    predicted_values = [slope * x + intercept for x in years]

    residual_sum = sum((y - y_pred) ** 2 for y, y_pred in zip(values, predicted_values))

    total_sum = sum((y - y_mean) ** 2 for y in values)

    if total_sum == 0:
        r_squared = 1.0 
    else: 
        r_squared = max(0.0, 1 - (residual_sum / total_sum))

    return slope, intercept, r_squared

def _classify_trend(slope: float, values: list[float]) -> str:
    """
    Normalize the slope against the average absolute value

    This prevents a slope of 1 from having the same meaning for an indicator centered around 3 and an indicator centered around 3000000.
    """

    average_magnitude = fmean(abs(value) for value in values)
    scale = max(average_magnitude, 1e-9)

    normalized_slope = slope / scale

    if normalized_slope > 0.015:
        return "increasing"
    
    if normalized_slope < -0.015:
        return "decreasing"
    
    return "stable"

def _classify_volatility(values: list[float]) -> tuple[str, float]:
    standard_deviation = pstdev(values)
    average_magnitude = fmean(abs(value) for value in values)
    scale = max(average_magnitude, 1e-9)

    volatility = standard_deviation / scale

    if volatility < 0.1:
        level = "low"
    elif volatility < 0.3:
        level = "moderate"
    else: 
        level = "high"

    return level, volatility

def _build_summary(*, country_name: str, indicator_name: str, unit: str, trend: str, volatility: str, start_year: int, end_year: int, latest_value: float, absolute_change: float, r_squared: float,) -> str:
    trend_phrases = {
    "increasing": "an overall increasing trend",
    "decreasing": "an overall decreasing trend",
    "stable": "a relatively stable overall trend",
    }
    
    if r_squared >= 0.65:
        fit_sentence = "The linear regression model fits the data well, indicating a strong correlation between time and the indicator's values."
    elif r_squared >= 0.3:
        fit_sentence = "The linear regression model shows a moderate fit to the data, suggesting some correlation between time and the indicator's values."
    else:
        fit_sentence = "The linear regression model does not fit the data well, indicating a weak correlation between time and the indicator's values."

    unit_suffix = f" {unit}" if unit else ""

    return (
        f"Between {start_year} and {end_year}, {indicator_name} in "
        f"{country_name} showed {trend_phrases[trend]} with "
        f"{volatility} volatility. The latest recorded value was "
        f"{latest_value:.2f}{unit_suffix}, representing an absolute "
        f"change of {absolute_change:.2f}{unit_suffix} across the selected period. "
        f"{fit_sentence}"
    )

def analyze_trend(points: list[dict[str, Any]], *, country_name: str, indicator_name: str, unit: str = "",) -> dict[str, Any]:
    """
    Analyze an economic item series.

    Expected point format:
        {"year": 2020, "value": 12.4}
    """
    cleaned_points: list[dict[str, float | int]] = []

    for point in points:
        year = point.get("year")
        value = point.get("value")

        if year is None or value is None:
            continue

        try:
            parsed_year = int(year)
            parsed_value = float(value)
        except (TypeError, ValueError):
            continue

        if not isfinite(parsed_value):
            continue

        cleaned_points.append({"year": parsed_year, "value": parsed_value})

    cleaned_points.sort(key=lambda p: p["year"])

    if len(cleaned_points) < 3:
        raise InsufficientDataError("Insufficient data points for analysis.")
    
    years = [int(point["year"]) for point in cleaned_points]
    values = [float(point["value"]) for point in cleaned_points]

    mean_value = fmean(values)
    standard_deviation = pstdev(values)

    minimum_index = min(range(len(values)), key=values.__getitem__)
    maximum_index = max(range(len(values)), key=values.__getitem__)

    first_value = values[0]
    latest_value = values[-1]

    absolute_change = latest_value - first_value

    if abs(first_value) > 1e-9:
        percentage_change = absolute_change / abs(first_value) * 100
    else:
        percentage_change = None

    slope, intercept, r_squared = _linear_regression(years, values)
    trend = _classify_trend(slope, values)
    volatility, volatility_ratio = _classify_volatility(values)

    summary = _build_summary(
        country_name=country_name,
        indicator_name=indicator_name,
        unit=unit,
        trend=trend,
        volatility=volatility,
        start_year=years[0],
        end_year=years[-1],
        latest_value=latest_value,
        absolute_change=absolute_change,
        r_squared=r_squared,
    )

    return {
        "observation_count": len(cleaned_points),
        "period": {
            "start_year": years[0],
            "end_year": years[-1],
        },
        "trend": trend,
        "volatility": {
            "level": volatility,
            "ratio": _rounded(volatility_ratio),
        },
        "latest": {
            "year": years[-1],
            "value": _rounded(latest_value),
        },
        "first": {
            "year": years[0],
            "value": _rounded(first_value),
        },
        "mean": _rounded(mean_value),
        "standard_deviation": _rounded(standard_deviation),
        "minimum": {
            "year": years[minimum_index],
            "value": _rounded(values[minimum_index]),
        },
        "maximum": {
            "year": years[maximum_index],
            "value": _rounded(values[maximum_index]),
        },
        "change": {
            "absolute": _rounded(absolute_change),
            "percentage": _rounded(percentage_change),
        },
        "linear_model": {
            "slope_per_year": _rounded(slope),
            "intercept": _rounded(intercept),
            "r_squared": _rounded(r_squared),
        },
        "summary_en": summary,
    }