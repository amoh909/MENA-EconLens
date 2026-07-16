from django.db import models

class Country(models.Model):
    name = models.CharField(max_length=255)
    iso2_code = models.CharField(max_length=2, unique=True)
    iso3_code = models.CharField(max_length=3, unique=True)
    region = models.CharField(max_length=100, default="MENA")
    income_level = models.CharField(max_length=100, blank=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return f"{self.name} ({self.iso3_code})"
    
class Indicator(models.Model):
    class InterpretationDirection(models.TextChoices):
        HIGHER_IS_BETTER = "higher_is_better", "Higher is usually better"
        LOWER_IS_BETTER = "lower_is_better", "Lower is usually better"
        CONTEXT_DEPENDENT = "context_dependent", "Context dependent"

    code = models.CharField(max_length=100, unique=True)
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    category = models.CharField(max_length=100, blank=True)
    unit = models.CharField(max_length=100, blank=True)
    interpretation_direction = models.CharField(
        max_length=32,
        choices=InterpretationDirection.choices,
        default=InterpretationDirection.CONTEXT_DEPENDENT,
    )

    class Meta:
        ordering = ['category', 'name']

    def __str__(self):
        return f"{self.name} ({self.code})"

class DataPoint(models.Model):
    country = models.ForeignKey(Country, on_delete=models.CASCADE, related_name='data_points')
    indicator = models.ForeignKey(Indicator, on_delete=models.CASCADE, related_name='data_points')
    year = models.IntegerField()
    value = models.FloatField(null=True, blank=True)

    class Meta:
        unique_together = ("country", "indicator", "year")
        ordering = ['country', 'indicator', 'year']

    def __str__(self):
        return f"{self.country.iso3_code} - {self.indicator.code} - ({self.year}): {self.value}"

