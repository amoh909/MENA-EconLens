from django.urls import path

from .views import (
    CountryListView,
    CountryDetailView,
    IndicatorListView,
    IndicatorDetailView,
    data_series,
    compare_countries,
    database_stats,
)

urlpatterns = [
    path("countries/", CountryListView.as_view(), name="country-list"),
    path("countries/<str:iso3_code>/", CountryDetailView.as_view(), name="country-detail"),

    path("indicators/", IndicatorListView.as_view(), name="indicator-list"),
    path("indicators/<str:code>/", IndicatorDetailView.as_view(), name="indicator-detail"),

    path("data/", data_series, name="data-series"),
    path("compare/countries/", compare_countries, name="compare-countries"),
    path("stats/", database_stats, name="database-stats"),
]