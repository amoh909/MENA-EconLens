from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from core_data.models import Country, DataPoint, Indicator
from .services.forecast import ForecastError, generate_forecast
from .services.trend_analyzer import (
    InsufficientDataError,
    analyze_trend,
)

@api_view(["GET"])
def trend_analysis(request):
    country_code = request.query_params.get("country")
    indicator_code = request.query_params.get("indicator")
    window_raw = request.query_params.get("window", "10")

    if not country_code or not indicator_code:
        return Response(
            {"detail": "Both 'country' and 'indicator' query parameters are required."},
            status=status.HTTP_400_BAD_REQUEST,
        )
    
    try:
        window = int(window_raw)
    except ValueError:
        return Response(
            {"detail": "The 'window' query parameter must be an integer."},
            status=status.HTTP_400_BAD_REQUEST,
        )
    
    if window < 3 or window > 50:
        return Response(
            {"detail": "The 'window' query parameter must be between 3 and 50."},
            status=status.HTTP_400_BAD_REQUEST,
        )
    
    try: 
        country = Country.objects.get(iso3_code=country_code.upper())
    except Country.DoesNotExist:
        return Response(
            {"detail": f"Country with code '{country_code}' not found."},
            status=status.HTTP_404_NOT_FOUND,
        )

    try:
        indicator = Indicator.objects.get(code=indicator_code)
    except Indicator.DoesNotExist:
        return Response(
            {"detail": "Indicator not found."},
            status=status.HTTP_404_NOT_FOUND,
        )

    all_points = list(
        DataPoint.objects.filter(
            country=country,
            indicator=indicator,
            value__isnull=False,
        )
        .order_by("year")
        .values("year", "value")
    )

    selected_points = all_points[-window:]

    try:
        result = analyze_trend(
        selected_points,
        country_name=country.name,
        indicator_name=indicator.name,
        unit=indicator.unit,
        interpretation_direction=indicator.interpretation_direction,
)
    except InsufficientDataError as exc:
        return Response(
            {
                "detail": str(exc),
                "available_observations": len(selected_points),
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    return Response({
        "country": {
            "name": country.name,
            "iso3_code": country.iso3_code,
        },
        "indicator": {
            "name": indicator.name,
            "code": indicator.code,
            "unit": indicator.unit,
            "category": indicator.category,
        },
        "requested_window": window,
        "analysis": result,
    })
    
@api_view(["GET"])
def forecast_analysis(request):
    country_code = request.query_params.get("country")
    indicator_code = request.query_params.get("indicator")
    window_raw = request.query_params.get("window", "10")
    years_raw = request.query_params.get("years", "3")

    if not country_code or not indicator_code:
        return Response(
            {"detail": "Both 'country' and 'indicator' query parameters are required."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    try:
        window = int(window_raw)
    except ValueError:
        return Response(
            {"detail": "The 'window' query parameter must be an integer."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    try:
        years_ahead = int(years_raw)
    except ValueError:
        return Response(
            {"detail": "The 'years' query parameter must be an integer."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if window < 5 or window > 50:
        return Response(
            {"detail": "The 'window' query parameter must be between 5 and 50."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if years_ahead < 1 or years_ahead > 10:
        return Response(
            {"detail": "The 'years' query parameter must be between 1 and 10."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    try:
        country = Country.objects.get(iso3_code=country_code.upper())
    except Country.DoesNotExist:
        return Response(
            {"detail": f"Country with code '{country_code}' not found."},
            status=status.HTTP_404_NOT_FOUND,
        )

    try:
        indicator = Indicator.objects.get(code=indicator_code)
    except Indicator.DoesNotExist:
        return Response(
            {"detail": "Indicator not found."},
            status=status.HTTP_404_NOT_FOUND,
        )

    all_points = list(
        DataPoint.objects.filter(
            country=country,
            indicator=indicator,
            value__isnull=False,
        )
        .order_by("year")
        .values("year", "value")
    )

    selected_points = all_points[-window:]

    try:
        result = generate_forecast(
            selected_points,
            years_ahead=years_ahead,
        )
    except ForecastError as exc:
        return Response(
            {
                "detail": str(exc),
                "available_observations": len(selected_points),
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    return Response({
        "country": {
            "name": country.name,
            "iso3_code": country.iso3_code,
        },
        "indicator": {
            "name": indicator.name,
            "code": indicator.code,
            "unit": indicator.unit,
            "category": indicator.category,
        },
        "requested_window": window,
        "requested_years": years_ahead,
        "forecast": result,
    })