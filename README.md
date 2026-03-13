# 🚛 Logistics OSINT Dashboard (Indonesia)

> **Real-time visibility into operational conditions affecting distribution across Indonesia.**

## 🌟 Overview

Logistics in Indonesia is complex. Between seasonal floods, heavy urban traffic, and sudden infrastructure changes, staying informed is critical for smooth operations. 

This dashboard is a specialized **Open Source Intelligence (OSINT)** tool designed for logistics managers and dispatchers. It provides an at-a-glance view of real-time conditions using data pulled directly from open-source APIs.

## 📸 Dashboard Screenshots

![Full Dashboard Overview](C:\Users\Daniswara Aditya P\.gemini\antigravity\brain\ee9055fa-ebdc-4209-bfc2-749c90b9b326\dashboard_weather_traffic_1773170078293.png)
*Real-time weather alerts and traffic conditions across major Indonesian hubs.*

![Logistics News Feed](C:\Users\Daniswara Aditya P\.gemini\antigravity\brain\ee9055fa-ebdc-4209-bfc2-749c90b9b326\dashboard_news_final_1773170106451.png)
*Filtered news feed focusing on infrastructure, transportation, and supply chain disruptions.*

## ✨ Key Features

- **🗺️ Interactive Map**: Powered by Leaflet.js with high-contrast regional markers for Jakarta, Surabaya, Bandung, Semarang, Medan, and Makassar.
- **🌤️ Weather Intelligence**: Real-time precipitation, temperature, and wind speed tracking with automated "Heavy Rain" and "Strong Wind" warning banners.
- **🚗 Traffic Flow**: Real-time congestion monitoring showing current vs. free-flow speeds in urban centers.
- **📰 Smart News Filtering**: A custom-filtered GDELT feed that excludes sports and entertainment to focus purely on logistics-impacting events.
- **🔄 Auto-Refresh**: Hands-free updates every 5 minutes to ensure operational data is never stale.

## 📊 Data Sources

This dashboard relies 100% on live, real-world data:
1. **[Open-Meteo](https://open-meteo.com/)**: High-resolution weather data (Free, No API Key required).
2. **[TomTom Traffic](https://developer.tomtom.com/)**: Real-time traffic flow and congestion data (Requires a free API Key).
3. **[GDELT Project](https://www.gdeltproject.org/)**: Global Database of Events, Language, and Tone for real-time news monitoring (Free, No API Key required).

## 🚀 Getting Started

### 1. Clone & Install
```bash
git clone https://github.com/Daniswara369/logistics-osint-dashboard.git
cd logistics-osint-dashboard
npm install
```

### 2. Configure API Keys
Copy the example environment file:
```bash
cp .env.example .env.local
```
Add your **TomTom API Key** to `.env.local`. Get a free key at [developer.tomtom.com](https://developer.tomtom.com).

### 3. Run Locally
```bash
npm run dev
```

## 📈 Future Improvements

- [ ] **Route Optimization**: Integration with OSRM or Google Maps for calculating best delivery routes based on live traffic.
- [ ] **Port Information**: Real-time vessel tracking and port congestion data for maritime hubs like Tanjung Priok.
- [ ] **Historical Analytics**: Local database storage to track conditions over time and identify peak disruption hours.
- [ ] **Mobile App**: PWA support for operational monitoring on the go.

## 🌐 Deployment

The best way to host this for free is on **Vercel** or **Netlify**. Simply connect your GitHub repository and add the `TOMTOM_API_KEY` to your environment settings.

## 📄 License

Open-source under the MIT License.
