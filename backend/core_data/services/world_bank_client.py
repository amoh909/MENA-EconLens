import requests

WORLD_BANK_BASE_URL = "https://api.worldbank.org/v2"

class WorldBankClientError(Exception):
    """Raised when the World Bank API request fails or returns unexpected data."""

def fetch_indicator_data(country_code: str, indicator_code: str) -> list[dict]:
    """
    Fetch time-series indicator data for a country from the World Bank API.

    Returns:
        [
            {"year": 2023, "value": 12.5},
            {"year": 2022, "value": 10.1},
            ...
        ]
    """
    url = f"{WORLD_BANK_BASE_URL}/country/{country_code}/indicator/{indicator_code}"

    params = {
        "format": "json",
        "per_page": 20000, 
    }

    try:
        response = requests.get(url, params=params, timeout = 25)
        response.raise_for_status()
    except requests.RequestException as e:
        raise WorldBankClientError(f"Failed to fetch {country_code} - {indicator_code}: {e}") from e

    try:
        payload = response.json()
    except ValueError as e:
        raise WorldBankClientError(f"Invalid JSON response for {country_code} - {indicator_code}") from e  

    if not isinstance(payload, list) or len(payload) < 2:
        return []

    rows = payload[1] or []
    results = []

    for row in rows:
        year = row.get("date")
        value = row.get("value")

        if year is None:
            continue

        try:
            parsed_year = int(year)
        except ValueError:
            continue

        results.append({"year": parsed_year, "value": value})

    return results


    