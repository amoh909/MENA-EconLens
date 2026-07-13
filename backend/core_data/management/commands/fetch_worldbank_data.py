from django.core.management.base import BaseCommand
from core_data.models import Country, Indicator, DataPoint
from core_data.services.world_bank_client import fetch_indicator_data, WorldBankClientError



class Command(BaseCommand):
    help = "Fetch World Bank indicator data for seeded countries and indicators"

    def add_arguments(self, parser):
        parser.add_argument(
            "--country",
            type=str,
            help="Optional ISO3 country code, e.g. LBN",
        )
        parser.add_argument(
            "--indicator",
            type=str,
            help="Optional World Bank indicator code, e.g. FP.CPI.TOTL.ZG",
        )
        parser.add_argument(
            "--start-year",
            type=int,
            default=2000,
            help="Only store data from this year onward. Default: 2000",
        )

    def handle(self, *args, **options):
        country_filter = options["country"]
        indicator_filter = options["indicator"]
        start_year = options["start_year"]

        countries = Country.objects.all()
        indicators = Indicator.objects.all()

        if country_filter:
            countries = countries.filter(iso3_code=country_filter.upper())

        if indicator_filter:
            indicators = indicators.filter(code=indicator_filter)

        if not countries.exists():
            self.stdout.write(self.style.ERROR("No matching countries found."))
            return

        if not indicators.exists():
            self.stdout.write(self.style.ERROR("No matching indicators found."))
            return
        
        total_created = 0
        total_updated = 0
        total_skipped = 0

        for country in countries:
            for indicator in indicators:
                label = f"{country.iso3_code} - {indicator.code}"
                self.stdout.write(f"Fetching data for {label}...")

                try:
                    raw_response = fetch_indicator_data(country.iso3_code, indicator.code)
                except WorldBankClientError as e:
                    self.stdout.write(self.style.ERROR(f"Error fetching data for {label}: {e}"))
                    continue

                if isinstance(raw_response, list) and len(raw_response) > 0:
                    if isinstance(raw_response[0], dict) and "page" in raw_response[0]:
                        data_entries = raw_response[1] if len(raw_response) > 1 else []
                    else:
                        data_entries = raw_response
                else:
                    data_entries = []

                if not data_entries:
                    self.stdout.write(self.style.WARNING(f"No actual records returned for {label}"))
                    continue

                for datum in data_entries:
                    if not isinstance(datum, dict):
                        continue

                    year_str = datum.get("date") or datum.get("year")
                    value = datum.get("value")

                    if not year_str or value is None:
                        total_skipped += 1
                        continue

                    try:
                        year = int(year_str)
                    except ValueError:
                        total_skipped += 1
                        continue

                    if start_year and year < int(start_year):
                        total_skipped += 1
                        continue

                    obj, created = DataPoint.objects.update_or_create(
                        country = country,
                        indicator = indicator,
                        year = year,
                        defaults = {"value": value},
                    )

                    if created:
                        total_created += 1
                    else:
                        total_updated += 1

                self.stdout.write(self.style.SUCCESS(f"Finished {label}"))

        self.stdout.write(self.style.SUCCESS(f"Data fetching completed. Total Created: {total_created}, Total Updated: {total_updated}, Total Skipped: {total_skipped}"))

