"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { WeatherResponse, TrafficResponse, NewsResponse } from "@/lib/types";
import WeatherPanel from "@/components/WeatherPanel";
import TrafficPanel from "@/components/TrafficPanel";
import NewsPanel from "@/components/NewsPanel";

// Leaflet must be loaded client-side only
const IndonesiaMap = dynamic(() => import("@/components/IndonesiaMap"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full bg-slate-900/50 rounded-2xl">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
        <span className="text-slate-400 text-sm">Loading map...</span>
      </div>
    </div>
  ),
});

const REFRESH_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

export default function Dashboard() {
  const [weather, setWeather] = useState<WeatherResponse | null>(null);
  const [traffic, setTraffic] = useState<TrafficResponse | null>(null);
  const [news, setNews] = useState<NewsResponse | null>(null);

  const [weatherError, setWeatherError] = useState<string | null>(null);
  const [trafficError, setTrafficError] = useState<string | null>(null);
  const [newsError, setNewsError] = useState<string | null>(null);

  const [weatherLoading, setWeatherLoading] = useState(true);
  const [trafficLoading, setTrafficLoading] = useState(true);
  const [newsLoading, setNewsLoading] = useState(true);

  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  async function fetchWeather() {
    setWeatherLoading(true);
    setWeatherError(null);
    try {
      const res = await fetch("/api/weather");
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || `HTTP ${res.status}`);
      }
      const data: WeatherResponse = await res.json();
      setWeather(data);
    } catch (e) {
      setWeatherError(e instanceof Error ? e.message : "Failed to fetch weather");
    } finally {
      setWeatherLoading(false);
    }
  }

  async function fetchTraffic() {
    setTrafficLoading(true);
    setTrafficError(null);
    try {
      const res = await fetch("/api/traffic");
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || `HTTP ${res.status}`);
      }
      const data: TrafficResponse = await res.json();
      setTraffic(data);
    } catch (e) {
      setTrafficError(e instanceof Error ? e.message : "Failed to fetch traffic");
    } finally {
      setTrafficLoading(false);
    }
  }

  async function fetchNews() {
    setNewsLoading(true);
    setNewsError(null);
    try {
      const res = await fetch("/api/news");
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || `HTTP ${res.status}`);
      }
      const data: NewsResponse = await res.json();
      setNews(data);
    } catch (e) {
      setNewsError(e instanceof Error ? e.message : "Failed to fetch news");
    } finally {
      setNewsLoading(false);
    }
  }

  function fetchAll() {
    fetchWeather();
    fetchTraffic();
    fetchNews();
    setLastRefresh(new Date());
  }

  useEffect(() => {
    fetchAll();
    const interval = setInterval(fetchAll, REFRESH_INTERVAL_MS);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/25">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Indonesia Logistics Monitor
              </h1>
              <p className="text-xs text-slate-500">Real-time operational conditions</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {lastRefresh && (
              <span className="text-xs text-slate-500 hidden sm:block">
                Last updated: {lastRefresh.toLocaleTimeString("id-ID")}
              </span>
            )}
            <button
              onClick={fetchAll}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/50 hover:bg-slate-700/60 transition-colors text-sm text-slate-300 hover:text-white"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-emerald-400 font-medium">LIVE</span>
            </div>
          </div>
        </div>
      </header>

      {/* Dashboard Grid */}
      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Map Panel */}
          <div className="lg:col-span-2 h-[420px] rounded-2xl overflow-hidden border border-slate-800/60 bg-slate-900/40 backdrop-blur-sm shadow-xl">
            <IndonesiaMap weather={weather} traffic={traffic} />
          </div>

          {/* Weather Panel */}
          <div className="rounded-2xl border border-slate-800/60 bg-slate-900/40 backdrop-blur-sm shadow-xl overflow-hidden">
            <WeatherPanel data={weather} loading={weatherLoading} error={weatherError} />
          </div>

          {/* Traffic Panel */}
          <div className="rounded-2xl border border-slate-800/60 bg-slate-900/40 backdrop-blur-sm shadow-xl overflow-hidden">
            <TrafficPanel data={traffic} loading={trafficLoading} error={trafficError} />
          </div>

          {/* News Panel */}
          <div className="lg:col-span-2 rounded-2xl border border-slate-800/60 bg-slate-900/40 backdrop-blur-sm shadow-xl overflow-hidden">
            <NewsPanel data={news} loading={newsLoading} error={newsError} />
          </div>
        </div>
      </main>
    </div>
  );
}
