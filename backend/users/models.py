from django.db import models
from core_data.models import Country, Indicator 

class FavoriteDashboard(models.Model):
    title = models.CharField(max_length=255)
    countries = models.ManyToManyField(Country)
    indicators = models.ManyToManyField(Indicator)
    created_at = models.DateTimeField(auto_now_add=True)
