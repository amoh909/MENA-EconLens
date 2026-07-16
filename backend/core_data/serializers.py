from rest_framework import serializers
from .models import Country, Indicator, DataPoint

class CountrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Country
        fields = ['id', 'name', 'iso2_code', 'iso3_code', 'region', 'income_level']

class IndicatorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Indicator
        fields = ['id', 'code', 'name', 'description', 'category', 'unit', 'interpretation_direction']

class DataPointSerializer(serializers.ModelSerializer):
    country = CountrySerializer(read_only=True)
    indicator = IndicatorSerializer(read_only=True)

    class Meta:
        model = DataPoint
        fields = ['id', 'country', 'indicator', 'year', 'value']