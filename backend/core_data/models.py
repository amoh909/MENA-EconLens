from django.db import models

class Country(models.Model):
    name = models.CharField(max_length=255)
    iso2_code = models.CharField(max_length=2, unique=True)
    iso3_code = models.CharField(max_length=3, unique=True)
    region = models.CharField(max_length=100, blank=True)
    income_level = models.CharField(max_length=100, blank=True)

class Indicator(models.Model):
    code = models.CharField(max_length=100, unique=True)
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    category = models.CharField(max_length=100, blank=True)
    unit = models.CharField(max_length=100, blank=True)

class DataPoint(models.Model):
    country = models.ForeignKey(Country, on_delete=models.CASCADE)
    indicator = models.ForeignKey(Indicator, on_delete=models.CASCADE)
    year = models.IntegerField()
    value = models.FloatField(null=True, blank=True)

    class Meta:
        unique_together = ("country", "indicator", "year")

