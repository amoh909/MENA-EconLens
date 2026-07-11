from django.contrib import admin
from .models import Country, Indicator, DataPoint

@admin.register(Country)
class CountryAdmin(admin.ModelAdmin):
    list_display = ('name', 'iso2_code', 'iso3_code', 'region', 'income_level')
    search_fields = ('name', 'iso2_code', 'iso3_code')
    list_filter = ('region', 'income_level')

@admin.register(Indicator)
class IndicatorAdmin(admin.ModelAdmin):
    list_display = ('name', 'code', 'category', 'description')
    search_fields = ('name', 'code', 'category', 'description')
    list_filter = ('category',)

@admin.register(DataPoint)
class DataPointAdmin(admin.ModelAdmin):
    list_display = ('country', 'indicator', 'year', 'value')
    search_fields = ('country__name', 'country__iso3_code', 'indicator__name', 'indicator__code')
    list_filter = ('year', 'country', 'indicator')
