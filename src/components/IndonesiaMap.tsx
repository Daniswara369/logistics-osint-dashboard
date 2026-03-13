"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { CITIES, WeatherResponse, TrafficResponse } from "@/lib/types";
import "leaflet/dist/leaflet.css";

// Fix default marker icon issue with webpack
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

function createColoredIcon(color: string) {
  const hue =
    color === "green" ? "120" : color === "yellow" ? "50" : color === "red" ? "0" : "200";

  return L.divIcon({
    className: "custom-marker",
    html: `
      <div style="
        width: 28px;
        height: 28px;
        border-radius: 50% 50% 50% 0;
        background: hsl(${hue}, 80%, 50%);
        transform: rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.4);
        position: relative;
      ">
        <div style="
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: white;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        "></div>
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28],
  });
}

interface Props {
  weather: WeatherResponse | null;
  traffic: TrafficResponse | null;
}

export default function IndonesiaMap({ weather, traffic }: Props) {
  function getMarkerColor(cityName: string): string {
    const cityWeather = weather?.data.find((w) => w.city === cityName);
    const cityTraffic = traffic?.data.find((t) => t.city === cityName);

    if (cityWeather?.warning) return "red";
    if (cityTraffic?.congestionLevel === "red") return "red";
    if (cityTraffic?.congestionLevel === "yellow") return "yellow";
    return "green";
  }

  function getPopupContent(cityName: string) {
    const cityWeather = weather?.data.find((w) => w.city === cityName);
    const cityTraffic = traffic?.data.find((t) => t.city === cityName);

    return (
      <div className="min-w-[200px]">
        <h3 className="font-bold text-base mb-2 text-slate-800">{cityName}</h3>
        {cityWeather ? (
          <div className="mb-2 text-sm">
            <p className="text-slate-600 font-medium mb-1">🌤 Weather</p>
            <p>🌡 {cityWeather.temperature}°C</p>
            <p>🌧 Rain: {cityWeather.rainProbability}%</p>
            <p>💨 Wind: {cityWeather.windSpeed} km/h</p>
            {cityWeather.warning && (
              <p className="text-red-600 font-semibold mt-1">⚠️ {cityWeather.warningMessage}</p>
            )}
          </div>
        ) : (
          <p className="text-slate-400 text-sm mb-2">Weather data unavailable</p>
        )}
        {cityTraffic ? (
          <div className="text-sm">
            <p className="text-slate-600 font-medium mb-1">🚗 Traffic</p>
            <p>
              Status:{" "}
              <span
                className={`font-semibold ${
                  cityTraffic.congestionLevel === "green"
                    ? "text-green-600"
                    : cityTraffic.congestionLevel === "yellow"
                    ? "text-yellow-600"
                    : "text-red-600"
                }`}
              >
                {cityTraffic.label}
              </span>
            </p>
            <p>Speed: {cityTraffic.currentSpeed} / {cityTraffic.freeFlowSpeed} km/h</p>
          </div>
        ) : (
          <p className="text-slate-400 text-sm">Traffic data unavailable</p>
        )}
      </div>
    );
  }

  return (
    <MapContainer
      center={[-2.5, 118]}
      zoom={5}
      style={{ height: "100%", width: "100%" }}
      zoomControl={true}
      className="z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      {CITIES.map((city) => (
        <Marker
          key={city.name}
          position={[city.lat, city.lng]}
          icon={createColoredIcon(getMarkerColor(city.name))}
        >
          <Popup>{getPopupContent(city.name)}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
