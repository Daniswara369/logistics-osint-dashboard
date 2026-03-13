"use client";

import { TrafficResponse, CongestionLevel } from "@/lib/types";

interface Props {
  data: TrafficResponse | null;
  loading: boolean;
  error: string | null;
}

const LEVEL_CONFIG: Record<CongestionLevel, { bg: string; border: string; text: string; dot: string; label: string }> = {
  green: {
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    text: "text-emerald-400",
    dot: "bg-emerald-400",
    label: "Normal",
  },
  yellow: {
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    text: "text-amber-400",
    dot: "bg-amber-400",
    label: "Moderate",
  },
  red: {
    bg: "bg-red-500/10",
    border: "border-red-500/30",
    text: "text-red-400",
    dot: "bg-red-400",
    label: "Heavy",
  },
};

export default function TrafficPanel({ data, loading, error }: Props) {
  if (loading) {
    return (
      <div className="p-6">
        <h2 className="text-lg font-semibold mb-4 text-slate-200">🚗 Traffic Conditions</h2>
        <div className="flex items-center justify-center h-48">
          <div className="flex flex-col items-center gap-3">
            <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
            <span className="text-slate-400 text-sm">Loading traffic data...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <h2 className="text-lg font-semibold mb-4 text-slate-200">🚗 Traffic Conditions</h2>
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

  const heavyCongestion = data.data.filter((t) => t.congestionLevel === "red").length;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-200">🚗 Traffic Conditions</h2>
        {heavyCongestion > 0 && (
          <span className="px-2.5 py-1 bg-red-500/20 border border-red-500/30 rounded-full text-xs text-red-400 font-medium animate-pulse">
            {heavyCongestion} Congested
          </span>
        )}
      </div>

      {/* Traffic Legend */}
      <div className="flex items-center gap-4 mb-4 text-xs text-slate-400">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          Normal
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
          Moderate
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
          Heavy
        </div>
      </div>

      {/* City Traffic Cards */}
      <div className="space-y-3">
        {data.data.map((t) => {
          const config = LEVEL_CONFIG[t.congestionLevel];
          return (
            <div
              key={t.city}
              className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${config.bg} ${config.border}`}
            >
              <div className="flex items-center gap-3">
                <span className={`w-3 h-3 rounded-full ${config.dot} shadow-lg`} />
                <div>
                  <p className="text-sm font-semibold text-slate-200">{t.city}</p>
                  <p className={`text-xs font-medium ${config.text}`}>{t.label}</p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-sm text-slate-300">
                  {t.currentSpeed} <span className="text-slate-500">/ {t.freeFlowSpeed} km/h</span>
                </p>
                <div className="mt-1 w-24 h-1.5 bg-slate-700/50 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      t.congestionLevel === "green"
                        ? "bg-emerald-400"
                        : t.congestionLevel === "yellow"
                        ? "bg-amber-400"
                        : "bg-red-400"
                    }`}
                    style={{ width: `${t.congestionRatio}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
