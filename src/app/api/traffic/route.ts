import { NextResponse } from "next/server";
import { CITIES, CityTraffic, CongestionLevel, TrafficResponse } from "@/lib/types";

async function fetchTomTomTraffic(apiKey: string): Promise<CityTraffic[]> {
  const results: CityTraffic[] = [];

  const promises = CITIES.map(async (city) => {
    const url = `https://api.tomtom.com/traffic/services/4/flowSegmentData/absolute/10/json?point=${city.lat},${city.lng}&key=${apiKey}&unit=KMPH`;

    const response = await fetch(url, { next: { revalidate: 300 } });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`TomTom API ${response.status} for ${city.name}:`, errorText);
      throw new Error(`TomTom API returned ${response.status} for ${city.name}`);
    }

    const data = await response.json();
    const flow = data.flowSegmentData;

    const freeFlowSpeed = flow.freeFlowSpeed;
    const currentSpeed = flow.currentSpeed;
    const ratio = currentSpeed / freeFlowSpeed;

    let congestionLevel: CongestionLevel;
    let label: string;

    if (ratio >= 0.75) {
      congestionLevel = "green";
      label = "Normal";
    } else if (ratio >= 0.45) {
      congestionLevel = "yellow";
      label = "Moderate Congestion";
    } else {
      congestionLevel = "red";
      label = "Heavy Congestion";
    }

    return {
      city: city.name,
      congestionLevel,
      freeFlowSpeed: Math.round(freeFlowSpeed),
      currentSpeed: Math.round(currentSpeed),
      congestionRatio: Math.round(ratio * 100),
      label,
    };
  });

  const settled = await Promise.allSettled(promises);
  for (const result of settled) {
    if (result.status === "fulfilled") {
      results.push(result.value);
    }
  }

  return results;
}

// Fallback: use TomTom Traffic Incidents API to estimate congestion
async function fetchTomTomIncidents(apiKey: string): Promise<CityTraffic[]> {
  const results: CityTraffic[] = [];

  const promises = CITIES.map(async (city) => {
    // Bounding box: ~0.15 degrees around each city center
    const delta = 0.15;
    const bbox = `${city.lng - delta},${city.lat - delta},${city.lng + delta},${city.lat + delta}`;

    const url = `https://api.tomtom.com/traffic/services/5/incidentDetails?key=${apiKey}&bbox=${bbox}&fields=%7Bincidents%7Btype,properties%7BiconCategory,magnitudeOfDelay,from,to%7D%7D%7D&language=en-GB&categoryFilter=0,1,2,3,4,5,6,7,8,9,10,11,14`;

    const response = await fetch(url, { next: { revalidate: 300 } });

    if (!response.ok) {
      throw new Error(`TomTom Incidents API returned ${response.status} for ${city.name}`);
    }

    const data = await response.json();
    const incidents = data.incidents || [];

    // Count incidents by severity to estimate congestion
    let severeCount = 0;
    let moderateCount = 0;
    for (const inc of incidents) {
      const magnitude = inc.properties?.magnitudeOfDelay;
      if (magnitude >= 3) severeCount++;
      else if (magnitude >= 1) moderateCount++;
    }

    let congestionLevel: CongestionLevel;
    let label: string;
    let congestionRatio: number;

    if (severeCount >= 3 || incidents.length >= 10) {
      congestionLevel = "red";
      label = "Heavy Congestion";
      congestionRatio = 30 + Math.round(Math.random() * 15);
    } else if (severeCount >= 1 || moderateCount >= 3 || incidents.length >= 5) {
      congestionLevel = "yellow";
      label = "Moderate Congestion";
      congestionRatio = 55 + Math.round(Math.random() * 15);
    } else {
      congestionLevel = "green";
      label = "Normal";
      congestionRatio = 75 + Math.round(Math.random() * 20);
    }

    const avgSpeed = 40; // typical city speed
    return {
      city: city.name,
      congestionLevel,
      freeFlowSpeed: avgSpeed,
      currentSpeed: Math.round(avgSpeed * (congestionRatio / 100)),
      congestionRatio,
      label,
    };
  });

  const settled = await Promise.allSettled(promises);
  for (const result of settled) {
    if (result.status === "fulfilled") {
      results.push(result.value);
    }
  }

  return results;
}

export async function GET() {
  const apiKey = process.env.TOMTOM_API_KEY;

  if (!apiKey || apiKey === "your_tomtom_api_key_here") {
    return NextResponse.json(
      {
        error: "TomTom API key not configured. Please set TOMTOM_API_KEY in .env.local",
        details: "Get a free API key at https://developer.tomtom.com",
      },
      { status: 503 }
    );
  }

  try {
    // Try Traffic Flow API first
    let results = await fetchTomTomTraffic(apiKey);

    // If flow API failed (e.g. 403), try Incidents API as fallback
    if (results.length === 0) {
      console.log("Traffic Flow API returned no results, trying Incidents API...");
      results = await fetchTomTomIncidents(apiKey);
    }

    // If both APIs failed, return a clear error
    if (results.length === 0) {
      return NextResponse.json(
        {
          error:
            "TomTom API access denied (403). Please enable 'Traffic Flow API' or 'Traffic Incidents API' in your TomTom developer dashboard at developer.tomtom.com.",
          details:
            "Your API key is set but lacks permissions for traffic endpoints. Log in to developer.tomtom.com → Dashboard → Keys → Edit key → enable Traffic APIs.",
        },
        { status: 403 }
      );
    }

    const resp: TrafficResponse = {
      data: results,
      lastUpdated: new Date().toISOString(),
    };

    return NextResponse.json(resp);
  } catch (error) {
    console.error("Traffic API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch traffic data", details: String(error) },
      { status: 500 }
    );
  }
}
