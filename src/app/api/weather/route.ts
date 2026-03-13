import { NextResponse } from "next/server";
import { CITIES, CityWeather, WeatherResponse } from "@/lib/types";

export async function GET() {
  try {
    const latitudes = CITIES.map((c) => c.lat).join(",");
    const longitudes = CITIES.map((c) => c.lng).join(",");

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitudes}&longitude=${longitudes}&current=temperature_2m,weather_code,wind_speed_10m,precipitation&hourly=precipitation_probability&timezone=Asia/Jakarta&forecast_days=1`;

    const response = await fetch(url, { next: { revalidate: 300 } });

    if (!response.ok) {
      throw new Error(`Open-Meteo API returned ${response.status}`);
    }

    const rawData = await response.json();

    // Open-Meteo returns an array when multiple coords are passed
    const results: CityWeather[] = CITIES.map((city, index) => {
      const cityData = Array.isArray(rawData) ? rawData[index] : rawData;
      const current = cityData.current;
      const hourly = cityData.hourly;

      // Get max precipitation probability for the day
      const maxRainProb = hourly?.precipitation_probability
        ? Math.max(...hourly.precipitation_probability.filter((v: number | null) => v !== null))
        : 0;

      const temperature = current.temperature_2m;
      const windSpeed = current.wind_speed_10m;
      const precipitation = current.precipitation;
      const weatherCode = current.weather_code;

      // Determine warning
      const heavyRain = maxRainProb > 60 || precipitation > 5;
      const highWind = windSpeed > 40;
      const warning = heavyRain || highWind;

      let warningMessage: string | undefined;
      if (heavyRain && highWind) {
        warningMessage = "Heavy rain & high wind warning";
      } else if (heavyRain) {
        warningMessage = "Heavy rain warning";
      } else if (highWind) {
        warningMessage = "High wind warning";
      }

      return {
        city: city.name,
        temperature: Math.round(temperature * 10) / 10,
        rainProbability: maxRainProb,
        windSpeed: Math.round(windSpeed * 10) / 10,
        weatherCode,
        warning,
        warningMessage,
      };
    });

    const resp: WeatherResponse = {
      data: results,
      lastUpdated: new Date().toISOString(),
    };

    return NextResponse.json(resp);
  } catch (error) {
    console.error("Weather API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch weather data", details: String(error) },
      { status: 500 }
    );
  }
}
