// ===== City Data =====
export interface City {
  name: string;
  lat: number;
  lng: number;
}

export const CITIES: City[] = [
  { name: "Jakarta", lat: -6.2088, lng: 106.8456 },
  { name: "Surabaya", lat: -7.2575, lng: 112.7521 },
  { name: "Bandung", lat: -6.9175, lng: 107.6191 },
  { name: "Semarang", lat: -6.9666, lng: 110.4196 },
  { name: "Medan", lat: 3.5952, lng: 98.6722 },
  { name: "Makassar", lat: -5.1477, lng: 119.4327 },
];

// ===== Weather =====
export interface CityWeather {
  city: string;
  temperature: number;
  rainProbability: number;
  windSpeed: number;
  weatherCode: number;
  warning: boolean;
  warningMessage?: string;
}

export interface WeatherResponse {
  data: CityWeather[];
  lastUpdated: string;
}

// ===== Traffic =====
export type CongestionLevel = "green" | "yellow" | "red";

export interface CityTraffic {
  city: string;
  congestionLevel: CongestionLevel;
  freeFlowSpeed: number;
  currentSpeed: number;
  congestionRatio: number;
  label: string;
}

export interface TrafficResponse {
  data: CityTraffic[];
  lastUpdated: string;
}

// ===== News =====
export interface NewsArticle {
  title: string;
  source: string;
  url: string;
  date: string;
  language: string;
  domain: string;
}

export interface NewsResponse {
  data: NewsArticle[];
  lastUpdated: string;
}
