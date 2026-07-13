from django.core.management.base import BaseCommand
from core_data.models import Country, Indicator

COUNTRIES = [
    {"name": "Lebanon", "iso3_code": "LBN", "iso2_code": "LB"},
    {"name": "Jordan", "iso3_code": "JOR", "iso2_code": "JO"},
    {"name": "Egypt", "iso3_code": "EGY", "iso2_code": "EG"},
    {"name": "Saudi Arabia", "iso3_code": "SAU", "iso2_code": "SA"},
    {"name": "United Arab Emirates", "iso3_code": "ARE", "iso2_code": "AE"},
    {"name": "Qatar", "iso3_code": "QAT", "iso2_code": "QA"},
    {"name": "Kuwait", "iso3_code": "KWT", "iso2_code": "KW"},
    {"name": "Bahrain", "iso3_code": "BHR", "iso2_code": "BH"},
    {"name": "Oman", "iso3_code": "OMN", "iso2_code": "OM"},
    {"name": "Iraq", "iso3_code": "IRQ", "iso2_code": "IQ"},
    {"name": "Morocco", "iso3_code": "MAR", "iso2_code": "MA"},
    {"name": "Tunisia", "iso3_code": "TUN", "iso2_code": "TN"},
    {"name": "Algeria", "iso3_code": "DZA", "iso2_code": "DZ"},
    {"name": "Palestine", "iso3_code": "PSE", "iso2_code": "PS"},
]

INDICATORS = [
    {
        "code": "NY.GDP.MKTP.KD.ZG",
        "name": "GDP growth",
        "category": "Growth",
        "unit": "% annual",
        "description": "Annual percentage growth rate of GDP at market prices based on constant local currency.",
    },
    {
        "code": "NY.GDP.MKTP.CD",
        "name": "GDP current US$",
        "category": "Growth",
        "unit": "current US$",
        "description": "GDP at purchaser's prices in current US dollars.",
    },
    {
        "code": "FP.CPI.TOTL.ZG",
        "name": "Inflation",
        "category": "Prices",
        "unit": "% annual",
        "description": "Inflation as measured by the consumer price index.",
    },
    {
        "code": "SL.UEM.TOTL.ZS",
        "name": "Unemployment",
        "category": "Labor",
        "unit": "% of labor force",
        "description": "Share of the labor force that is without work but available for and seeking employment.",
    },
    {
        "code": "SP.POP.TOTL",
        "name": "Population",
        "category": "Demographics",
        "unit": "people",
        "description": "Total population.",
    },
    {
        "code": "BX.KLT.DINV.WD.GD.ZS",
        "name": "Foreign direct investment",
        "category": "Investment",
        "unit": "% of GDP",
        "description": "Net inflows of investment to acquire a lasting management interest.",
    },
    {
        "code": "NE.EXP.GNFS.ZS",
        "name": "Exports of goods and services",
        "category": "Trade",
        "unit": "% of GDP",
        "description": "Exports of goods and services as a percentage of GDP.",
    },
    {
        "code": "NE.IMP.GNFS.ZS",
        "name": "Imports of goods and services",
        "category": "Trade",
        "unit": "% of GDP",
        "description": "Imports of goods and services as a percentage of GDP.",
    },
    {
        "code": "SP.DYN.LE00.IN",
        "name": "Life expectancy",
        "category": "Development",
        "unit": "years",
        "description": "Life expectancy at birth.",
    },
    {
        "code": "SE.TER.ENRR",
        "name": "School enrollment, tertiary",
        "category": "Education",
        "unit": "% gross",
        "description": "Gross tertiary school enrollment ratio.",
    },
]

class Command(BaseCommand):
    help = "Seed Initial MENA Countries and Economic Indicators"

    def handle(self, *args, **kwargs):
        for country in COUNTRIES:
            Country.objects.get_or_create(
                iso3_code=country["iso3_code"],
                defaults={**country, "region": "MENA"},
            )

        for indicator in INDICATORS:
            Indicator.objects.get_or_create(
                code=indicator["code"],
                defaults=indicator,
            )

        self.stdout.write(self.style.SUCCESS("Successfully seeded initial MENA countries and economic indicators."))
    