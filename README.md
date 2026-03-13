# 🚛 Logistics OSINT Dashboard (Indonesia)

> **Real-time visibility into operational conditions affecting distribution across the Indonesian archipelago.**

🔗 **Live Demo:** [logistics-osint-dashboard.vercel.app](https://logistics-osint-dashboard.vercel.app/)

---

## 📸 Dashboard Preview

<img width="1914" height="838" alt="image" src="https://github.com/user-attachments/assets/5ab5b835-5f98-4020-b2a3-51ecd7dbaa33" />

<img width="1918" height="874" alt="image" src="https://github.com/user-attachments/assets/fac74d77-3201-40d7-b806-3c275c9d3cdd" />

<img width="1912" height="867" alt="image" src="https://github.com/user-attachments/assets/869e2262-6bb1-45b3-abfd-30cb4678cd38" />


---

## 🎯 Project Purpose

In a country as geographically diverse and dynamic as Indonesia, logistics operations face constant challenges—from seasonal tropical storms and city-wide flooding to unpredictable urban congestion and infrastructure shifts. 

The **Logistics OSINT Dashboard** was built to solve a specific problem: **Information Fragmentation.** Usually, a dispatcher has to check multiple websites for weather, traffic, and news. This tool aggregates that operational intelligence into a single, high-contrast command center. 

**Our Goal:** To provide immediate, actionable situational awareness for land and sea distribution hubs, helping teams make proactive decisions before a truck or vessel is even dispatched.

---

## ✨ Key Features

- **🗺️ Interactive Map**: Powered by Leaflet.js with high-contrast regional markers for major hubs like Jakarta, Surabaya, Bandung, Semarang, Medan, and Makassar.
- **🌤️ Weather Intelligence**: Real-time precipitation, temperature, and wind speed tracking with automated "Heavy Rain" and "Strong Wind" warning banners.
- **🚗 Traffic Flow**: Live congestion monitoring showing current vs. free-flow speeds in urban centers via TomTom.
- **📰 Smart News Filtering**: A custom-filtered GDELT feed that removes noise (sports, entertainment) and focuses purely on logistics-impacting events like strikes, floods, and road damage.
- **🔄 Auto-Refresh**: Hands-free updates every 5 minutes—perfect for a wall-mounted monitoring station.

---

## 📊 Data Sources

This dashboard relies on 100% real-world, open-source data:
1. **[Open-Meteo](https://open-meteo.com/)**: High-resolution weather data (Free).
2. **[TomTom Traffic](https://developer.tomtom.com/)**: Real-time traffic flow and congestion data.
3. **[GDELT Project](https://www.gdeltproject.org/)**: Global Database of Events, Language, and Tone for real-time news monitoring.

---

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

---

## 📈 Future Roadmap

- [ ] **Route Optimization**: Calculating best delivery routes based on live traffic data.
- [ ] **Port Congestion**: Real-time vessel tracking for maritime hubs like Tanjung Priok.
- [ ] **Historical Performance**: Tracking disruption patterns to optimize scheduling.
- [ ] **Mobile Operations**: PWA support for field teams.
