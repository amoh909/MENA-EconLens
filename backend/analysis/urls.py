from django.urls import path

from .views import forecast_analysis, trend_analysis


urlpatterns = [
    path("trend/", trend_analysis, name="trend-analysis"),
    path("forecast/", forecast_analysis, name="forecast-analysis"),
]