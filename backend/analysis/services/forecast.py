from __future__ import annotations

from math import isfinite
from statistics import fmean
from typing import Any


class ForecastError(ValueError):
    """Raised when a forecast cannot be generated."""


def _rounded(value: float | None, digits: int = 4) -> float | None:
    if value is None:
        return None

    return round(float(value), digits)


def _linear_regression(
    years: list[int],
    values: list[float],
) -> tuple[float, float, float]:
    x_mean = fmean(years)
    y_mean = fmean(values)

    denominator = sum((year - x_mean) ** 2 for year in years)

    if denominator == 0:
        return 0.0, y_mean, 0.0

    numerator = sum(
        (year - x_mean) * (value - y_mean)
        for year, value in zip(years, values)
    )

    slope = numerator / denominator
    intercept = y_mean - slope * x_mean

    predictions = [
        slope * year + intercept
        for year in years
    ]

    residual_sum = sum(
        (actual - predicted) ** 2
        for actual, predicted in zip(values, predictions)
    )

    total_sum = sum(
        (value - y_mean) ** 2
        for value in values
    )

    if total_sum == 0:
        r_squared = 1.0
    else:
        r_squared = max(0.0, 1 - residual_sum / total_sum)

    return slope, intercept, r_squared


def generate_forecast(
    points: list[dict[str, Any]],
    *,
    years_ahead: int = 3,
) -> dict[str, Any]:
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

        cleaned_points.append({
            "year": parsed_year,
            "value": parsed_value,
        })

    cleaned_points.sort(key=lambda item: item["year"])

    if len(cleaned_points) < 5:
        raise ForecastError(
            "At least five valid observations are required for forecasting."
        )

    if years_ahead < 1 or years_ahead > 10:
        raise ForecastError("years_ahead must be between 1 and 10.")

    years = [int(point["year"]) for point in cleaned_points]
    values = [float(point["value"]) for point in cleaned_points]

    slope, intercept, r_squared = _linear_regression(years, values)

    last_year = years[-1]
    future_years = list(
        range(last_year + 1, last_year + years_ahead + 1)
    )

    forecast_points = []

    for future_year in future_years:
        predicted_value = slope * future_year + intercept

        forecast_points.append({
            "year": future_year,
            "value": _rounded(predicted_value),
        })

    return {
        "method": "linear_regression",
        "training_period": {
            "start_year": years[0],
            "end_year": years[-1],
        },
        "observation_count": len(cleaned_points),
        "model": {
            "slope_per_year": _rounded(slope),
            "intercept": _rounded(intercept),
            "r_squared": _rounded(r_squared),
        },
        "forecast": forecast_points,
        "warning": (
            "This is a simple statistical projection based on historical "
            "values. It is not economic, investment, or financial advice."
        ),
    }