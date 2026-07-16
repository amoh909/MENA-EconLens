from django.test import SimpleTestCase, TestCase
from analysis.services.forecast import ForecastError, generate_forecast

from core_data.models import Country, DataPoint, Indicator
from analysis.services.trend_analyzer import (
    InsufficientDataError,
    analyze_trend,
)


class TrendAnalyzerTests(SimpleTestCase):
    def test_detects_increasing_trend(self):
        points = [
            {"year": 2020, "value": 100},
            {"year": 2021, "value": 110},
            {"year": 2022, "value": 120},
            {"year": 2023, "value": 130},
        ]

        result = analyze_trend(
            points,
            country_name="Example",
            indicator_name="Example Indicator",
            unit="%",
        )

        self.assertEqual(result["trend"], "increasing")
        self.assertEqual(result["latest"]["value"], 130.0)
        self.assertGreater(result["linear_model"]["slope_per_year"], 0)

    def test_detects_decreasing_trend(self):
        points = [
            {"year": 2020, "value": 100},
            {"year": 2021, "value": 90},
            {"year": 2022, "value": 80},
            {"year": 2023, "value": 70},
        ]

        result = analyze_trend(
            points,
            country_name="Example",
            indicator_name="Example Indicator",
        )

        self.assertEqual(result["trend"], "decreasing")
        self.assertLess(result["linear_model"]["slope_per_year"], 0)

    def test_rejects_insufficient_data(self):
        with self.assertRaises(InsufficientDataError):
            analyze_trend(
                [{"year": 2023, "value": 10}],
                country_name="Example",
                indicator_name="Example Indicator",
            )


class TrendAnalysisApiTests(TestCase):
    def setUp(self):
        self.country = Country.objects.create(
            name="Lebanon",
            iso2_code="LB",
            iso3_code="LBN",
            region="MENA",
        )

        self.indicator = Indicator.objects.create(
            code="TEST.INDICATOR",
            name="Test Indicator",
            category="Testing",
            unit="%",
        )

        for index, year in enumerate(range(2015, 2025)):
            DataPoint.objects.create(
                country=self.country,
                indicator=self.indicator,
                year=year,
                value=10 + index,
            )

    def test_trend_endpoint_returns_analysis(self):
        response = self.client.get(
            "/api/analysis/trend/",
            {
                "country": "LBN",
                "indicator": "TEST.INDICATOR",
                "window": 10,
            },
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            response.json()["analysis"]["trend"],
            "increasing",
        )

    def test_trend_endpoint_requires_parameters(self):
        response = self.client.get("/api/analysis/trend/")

        self.assertEqual(response.status_code, 400)
        
    def test_forecast_endpoint_returns_forecast(self):
        response = self.client.get(
            "/api/analysis/forecast/",
            {
                "country": "LBN",
                "indicator": "TEST.INDICATOR",
                "window": 10,
                "years": 3,
            },
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            response.json()["forecast"]["method"],
            "linear_regression",
        )
        self.assertEqual(
            len(response.json()["forecast"]["forecast"]),
            3,
        )
        
class ForecastServiceTests(SimpleTestCase):
    def test_generates_linear_forecast(self):
        points = [
            {"year": 2020, "value": 100},
            {"year": 2021, "value": 110},
            {"year": 2022, "value": 120},
            {"year": 2023, "value": 130},
            {"year": 2024, "value": 140},
        ]

        result = generate_forecast(points, years_ahead=3)

        self.assertEqual(result["method"], "linear_regression")
        self.assertEqual(len(result["forecast"]), 3)
        self.assertEqual(result["forecast"][0]["year"], 2025)
        self.assertGreater(result["forecast"][0]["value"], 140)

    def test_rejects_insufficient_forecast_data(self):
        with self.assertRaises(ForecastError):
            generate_forecast(
                [
                    {"year": 2023, "value": 10},
                    {"year": 2024, "value": 11},
                ],
                years_ahead=3,
            )