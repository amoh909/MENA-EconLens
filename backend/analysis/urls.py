from django.urls import path

from .views import trend_analysis


urlpatterns = [
    path("trend/", trend_analysis, name="trend-analysis"),
]