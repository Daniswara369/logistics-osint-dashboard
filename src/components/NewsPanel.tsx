"use client";

import { NewsResponse } from "@/lib/types";

interface Props {
  data: NewsResponse | null;
  loading: boolean;
  error: string | null;
}

const HIGHLIGHT_KEYWORDS = [
  "logistics",
  "transport",
  "road",
  "flood",
  "protest",
  "strike",
  "highway",
  "congestion",
  "accident",
  "disruption",
  "delay",
  "blockade",
];

function highlightKeywords(text: string): React.ReactNode {
  const regex = new RegExp(`(${HIGHLIGHT_KEYWORDS.join("|")})`, "gi");
  const parts = text.split(regex);

  return parts.map((part, i) => {
    if (HIGHLIGHT_KEYWORDS.some((k) => k.toLowerCase() === part.toLowerCase())) {
      return (
        <span key={i} className="bg-cyan-500/20 text-cyan-300 px-1 rounded">
          {part}
        </span>
      );
    }
    return part;
  });
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  try {
    // GDELT dates are in format "YYYYMMDDTHHmmssZ" or similar
    const cleaned = dateStr.replace(/(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z/, "$1-$2-$3T$4:$5:$6Z");
    const date = new Date(cleaned);
    if (isNaN(date.getTime())) return dateStr;
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export default function NewsPanel({ data, loading, error }: Props) {
  if (loading) {
    return (
      <div className="p-6">
        <h2 className="text-lg font-semibold mb-4 text-slate-200">📰 News Affecting Logistics</h2>
        <div className="flex items-center justify-center h-48">
          <div className="flex flex-col items-center gap-3">
            <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
            <span className="text-slate-400 text-sm">Loading news...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <h2 className="text-lg font-semibold mb-4 text-slate-200">📰 News Affecting Logistics</h2>
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

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-200">📰 News Affecting Logistics</h2>
        <span className="text-xs text-slate-500">{data.data.length} articles found</span>
      </div>

      {data.data.length === 0 ? (
        <div className="flex items-center justify-center h-32">
          <p className="text-slate-500 text-sm">No recent logistics-related news found for Indonesia.</p>
        </div>
      ) : (
        <div className="max-h-[360px] overflow-y-auto pr-2 space-y-3 scrollbar-thin scrollbar-track-slate-800 scrollbar-thumb-slate-600">
          {data.data.map((article, index) => (
            <a
              key={index}
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 rounded-xl bg-slate-800/30 border border-slate-700/30 hover:bg-slate-800/60 hover:border-cyan-500/30 transition-all group"
            >
              <h3 className="text-sm font-medium text-slate-200 group-hover:text-cyan-300 transition-colors leading-snug mb-2">
                {highlightKeywords(article.title)}
              </h3>
              <div className="flex items-center gap-3 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                  {article.source || article.domain}
                </span>
                {article.date && (
                  <span className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {formatDate(article.date)}
                  </span>
                )}
                <span className="text-cyan-500/50 ml-auto group-hover:text-cyan-400 transition-colors">
                  ↗ Open
                </span>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
