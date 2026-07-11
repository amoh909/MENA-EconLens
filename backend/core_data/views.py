from rest_framework.generics import ListAPIView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from .models import Country, DataPoint, Indicator
from .serializers import CountrySerializer, IndicatorSerializer

class CountryListView(ListAPIView):
    queryset = Country.objects.all()
    serializer_class = CountrySerializer

class CountryDetailView(ListAPIView):
    queryset = Country.objects.all()
    serializer_class = CountrySerializer
    lookup_field = 'iso3_code'

class IndicatorListView(ListAPIView):
    queryset = Indicator.objects.all()
    serializer_class = IndicatorSerializer

class IndicatorDetailView(ListAPIView):
    queryset = Indicator.objects.all()
    serializer_class = IndicatorSerializer
    lookup_field = 'code'

@api_view(['GET'])
def data_series(request):
    country_code = request.query_params.get('country')
    indicator_code = request.query_params.get('indicator')

    if not country_code or not indicator_code:
        return Response({"detail": "Both 'country' and 'indicator' query parameters are required."}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        country = Country.objects.get(iso3_code=country_code.upper())
        indicator = Indicator.objects.get(code=indicator_code)
    except (Country.DoesNotExist, Indicator.DoesNotExist):
        return Response({"detail": "Country or Indicator not found."}, status=status.HTTP_404_NOT_FOUND)
    
    points = DataPoint.objects.filter(country=country, indicator=indicator, value__isnull=False).order_by('year')

    return Response({
        "country": country.name,
        "iso3_code": country.iso3_code,
        "indicator": indicator.name,
        "indicator_code": indicator.code,
        "unit": indicator.unit,
        "data": [
            {"year": point.year, "value": point.value}
            for point in points
        ],
    })

@api_view(['GET'])
def compare_countries(request):
    countries_param = request.query_params.get('countries')
    indicator_code = request.query_params.get('indicator')

    if not countries_param or not indicator_code:
        return Response({
            "detail": "Both 'countries' and 'indicator' query parameters are required."
        }, status=status.HTTP_400_BAD_REQUEST)
    
    country_codes = [code.strip().upper() for code in countries_param.split(',') if code.strip()]

    try:
        indicator = Indicator.objects.get(code=indicator_code)
    except Indicator.DoesNotExist:
        return Response({"detail": "Indicator not found."}, status=status.HTTP_404_NOT_FOUND)
    
    series = []

    for code in country_codes:
        try:
            country = Country.objects.get(iso3_code=code)
        except Country.DoesNotExist:
            continue

        points = DataPoint.objects.filter(country=country, indicator=indicator, value__isnull=False).order_by('year')

        series.append({
            "country": country.name,
            "iso3_code": country.iso3_code,
            "data": [
                {"year": point.year, "value": point.value}
                for point in points
            ],
        })

    return Response({
        "indicator": indicator.name,
        "indicator_code": indicator.code,
        "unit": indicator.unit,
        "series": series,
    })

@api_view(['GET'])
def database_stats(request):
    return Response({
        "total_countries": Country.objects.count(),
        "total_indicators": Indicator.objects.count(),
        "total_data_points": DataPoint.objects.count(),
    })