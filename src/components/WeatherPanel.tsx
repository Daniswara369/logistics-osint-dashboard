"use client";

import { WeatherResponse } from "@/lib/types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface Props {
  data: WeatherResponse | null;
  loading: boolean;
  error: string | null;
}

export default function WeatherPanel({ data, loading, error }: Props) {
  if (loading) {
    return (
      <div className="p-6">
        <h2 className="text-lg font-semibold mb-4 text-slate-200">🌤 Weather Conditions</h2>
        <div className="flex items-center justify-center h-48">
          <div className="flex flex-col items-center gap-3">
            <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
            <span className="text-slate-400 text-sm">Loading weather data...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <h2 className="text-lg font-semibold mb-4 text-slate-200">🌤 Weather Conditions</h2>
        <div className="flex items-center justify-center h-48">
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-center max-w-sm">
            <p className="text-red-400 font-medium">⚠️ Error</p>
            <p className="text-red-300/70 text-sm mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const chartData = data.data.map((w) => ({
    name: w.city.slice(0, 3).toUpperCase(),
    temp: w.temperature,
    rain: w.rainProbability,
    wind: w.windSpeed,
  }));

  const warnings = data.data.filter((w) => w.warning);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-200">🌤 Weather Conditions</h2>
        {warnings.length > 0 && (
          <span className="px-2.5 py-1 bg-red-500/20 border border-red-500/30 rounded-full text-xs text-red-400 font-medium animate-pulse">
            {warnings.length} Warning{warnings.length > 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* Warnings */}
      {warnings.length > 0 && (
        <div className="mb-4 space-y-2">
          {warnings.map((w) => (
            <div
              key={w.city}
              className="flex items-center gap-2 px-3 py-2 bg-red-500/10 border border-red-500/20 rounded-lg"
            >
              <span className="text-red-400 text-sm">⚠️</span>
              <span className="text-red-300 text-sm">
                <strong>{w.city}:</strong> {w.warningMessage}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* City Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
        {data.data.map((w) => (
          <div
            key={w.city}
            className={`p-3 rounded-xl border transition-all ${
              w.warning
                ? "bg-red-500/5 border-red-500/30"
                : "bg-slate-800/40 border-slate-700/30"
            }`}
          >
            <p className="text-sm font-semibold text-slate-300 mb-2">{w.city}</p>
            <div className="space-y-1 text-xs text-slate-400">
              <div className="flex justify-between">
                <span>🌡 Temp</span>
                <span className="text-slate-200 font-medium">{w.temperature}°C</span>
              </div>
              <div className="flex justify-between">
                <span>🌧 Rain</span>
                <span
                  className={`font-medium ${
                    w.rainProbability > 60 ? "text-red-400" : "text-slate-200"
                  }`}
                >
                  {w.rainProbability}%
                </span>
              </div>
              <div className="flex justify-between">
                <span>💨 Wind</span>
                <span
                  className={`font-medium ${
                    w.windSpeed > 40 ? "text-red-400" : "text-slate-200"
                  }`}
                >
                  {w.windSpeed} km/h
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Temperature Chart */}
      <div className="mt-2">
        <p className="text-xs text-slate-500 uppercase tracking-wider mb-3">Temperature Comparison (°C)</p>
        <ResponsiveContainer width="100%" height={140}>
          <BarChart data={chartData} barCategoryGap="20%">
            <XAxis
              dataKey="name"
              tick={{ fill: "#94a3b8", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#94a3b8", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={30}
            />
            <Tooltip
              contentStyle={{
                background: "#1e293b",
                border: "1px solid #334155",
                borderRadius: "8px",
                fontSize: "12px",
              }}
              labelStyle={{ color: "#e2e8f0" }}
              itemStyle={{ color: "#67e8f9" }}
            />
            <Bar dataKey="temp" radius={[4, 4, 0, 0]} name="Temp (°C)">
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.temp > 33 ? "#f87171" : entry.temp > 30 ? "#fbbf24" : "#22d3ee"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
