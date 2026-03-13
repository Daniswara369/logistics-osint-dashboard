import { NextResponse } from "next/server";
import { NewsArticle, NewsResponse } from "@/lib/types";

// Words that indicate irrelevant articles (sports, entertainment, etc.)
const EXCLUDE_PATTERNS = [
  /\b(liga|league|sepak\s?bola|football|soccer|gol\b|stadion)/i,
  /\b(pemain|striker|pelatih|klub|turnamen|piala|coach)/i,
  /\b(nottingham|arsenal|liverpool|manchester|barcelona|madrid|chelsea)/i,
  /\b(pssi|fifa|var\s|wasit|pertandingan|playoff)/i,
  /\b(film|drama|sinetron|konser|selebrit|artis|idol|k-pop|gosip)/i,
  /\b(zodiak|horoscope|ramalan|zodiac|astrolog)/i,
  /\b(resep|masak|kuliner|recipe|beauty|skincare|fashion)/i,
];

function isRelevantArticle(title: string): boolean {
  const lower = title.toLowerCase();

  // Reject if title matches any exclusion pattern
  for (const pattern of EXCLUDE_PATTERNS) {
    if (pattern.test(lower)) return false;
  }

  // Accept if title contains any logistics/infrastructure/disaster-relevant term
  const relevantTerms = [
    "logist", "distribu", "supply", "cargo", "freight", "shipping",
    "truck", "warehouse", "gudang", "pelabuhan", "dermaga", "kontainer",
    "container", "pengiriman", "ekspedisi", "kirim",
    "banjir", "flood", "longsor", "landslide",
    "jalan", "road", "tol", "highway", "jalur",
    "kemacetan", "macet", "congestion", "traffic",
    "mudik", "arus", "infrastruktur", "infrastructure",
    "transportasi", "transport", "angkutan",
    "bbm", "fuel", "solar", "energi", "bensin",
    "pangan", "food", "beras", "sembako",
    "protes", "protest", "demo", "mogok", "strike",
    "gempa", "earthquake", "tsunami", "erupsi", "vulkan",
    "cuaca", "weather", "hujan", "rain", "badai", "storm", "angin",
    "kecelakaan", "accident", "tabrakan", "laka",
    "jembatan", "bridge", "rel", "kereta", "train", "railway", "kai",
    "bandara", "airport", "penerbangan", "flight",
    "pelayaran", "kapal", "ferry", "port",
    "pasokan", "stok", "harga", "tarif",
    "evakuasi", "darurat", "emergency", "bencana", "disaster",
  ];

  return relevantTerms.some((term) => lower.includes(term));
}

export async function GET() {
  try {
    // GDELT query: use simple English logistics keywords + Indonesia source filter
    const query = encodeURIComponent(
      "(logistics OR infrastructure OR flood OR landslide OR highway OR cargo OR freight OR transportation OR disaster OR earthquake) sourcecountry:Indonesia"
    );

    const url = `https://api.gdeltproject.org/api/v2/doc/doc?query=${query}&mode=ArtList&maxrecords=50&format=json&sort=DateDesc`;

    const response = await fetch(url, { next: { revalidate: 300 } });

    if (!response.ok) {
      throw new Error(`GDELT API returned ${response.status}`);
    }

    const text = await response.text();

    if (!text || text.trim().length === 0) {
      return NextResponse.json({
        data: [],
        lastUpdated: new Date().toISOString(),
      } as NewsResponse);
    }

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      throw new Error("GDELT returned non-JSON response");
    }

    const allArticles: NewsArticle[] = (data.articles || []).map(
      (article: {
        title?: string;
        source?: string;
        url?: string;
        seendate?: string;
        language?: string;
        domain?: string;
      }) => ({
        title: article.title || "Untitled",
        source: article.source || article.domain || "Unknown",
        url: article.url || "#",
        date: article.seendate || "",
        language: article.language || "English",
        domain: article.domain || "",
      })
    );

    // Post-filter: remove irrelevant articles and deduplicate
    const seen = new Set<string>();
    const filtered = allArticles.filter((article) => {
      const normalizedTitle = article.title.toLowerCase().trim();
      if (seen.has(normalizedTitle)) return false;
      seen.add(normalizedTitle);
      return isRelevantArticle(article.title);
    });

    const resp: NewsResponse = {
      data: filtered.slice(0, 20),
      lastUpdated: new Date().toISOString(),
    };

    return NextResponse.json(resp);
  } catch (error) {
    console.error("News API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch news data", details: String(error) },
      { status: 500 }
    );
  }
}
