# 🥗 NutriMate — Smart Calorie Tracker

A **production-quality, mobile-first calorie tracking web app** built with React, designed for hostel life and optimized for offline use. Track meals, scan barcodes, monitor nutrition, and stay on top of your fitness goals — all without an internet connection.

![NutriMate Banner](https://img.shields.io/badge/NutriMate-Calorie%20Tracker-FF9933?style=for-the-badge&logo=react)

---

## ✨ Features

- 🍽️ **Food Logging** — Search 130+ Indian foods or use multiple API sources
- 📷 **Barcode Scanner** — Scan packaged products via camera using Open Food Facts
- 📊 **Analytics Dashboard** — Weekly calorie charts, macro pie charts, weight trends
- 🏠 **Hostel Meal Presets** — Pre-configured weekly meals, one-tap logging
- 💧 **Water Tracker** — Track daily water intake with visual glass indicators
- ⚖️ **Weight Tracker** — Log weight over time with trend charts
- 🌙 **Dark Mode** — Toggle between light and dark themes
- 📴 **Offline First** — All data stored in localStorage, works without internet
- 🧮 **Smart Calculations** — Harris-Benedict BMR, TDEE, and macro distribution
- 🔄 **Auto-cleanup** — Old logs automatically deleted after 30 days

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| Frontend | React 19 (Vite 6) |
| Styling | Tailwind CSS v4 |
| Routing | React Router v7 |
| State | React Context API |
| Charts | Recharts |
| Scanner | html5-qrcode |
| Storage | localStorage (no backend) |
| Mobile | Capacitor (for APK build) |

---

## 🍛 API Integrations

| API | Usage | Auth |
|-----|-------|------|
| **USDA FoodData Central** | Fruits, vegetables, raw ingredients | Free API key |
| **CalorieNinja** | Natural language queries ("2 rotis with dal") | Free API key |
| **Open Food Facts** | Packaged products + barcode lookup | No key needed |
| **ICMR-NIN** | Indian food composition database | Open access |

---

## 📸 Screenshots

> Add your screenshots here

| Dashboard | Log Food | Presets | Analytics |
|-----------|----------|---------|-----------|
| ![](screenshots/dashboard.png) | ![](screenshots/logfood.png) | ![](screenshots/presets.png) | ![](screenshots/analytics.png) |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm

### Install & Run

```bash
# Clone the repository
git clone https://github.com/yourusername/nutrimate.git
cd nutrimate

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Production Build

```bash
npm run build
npm run preview
```

---

## 📱 Build Android APK with Capacitor

```bash
# Install Capacitor
npm install @capacitor/core @capacitor/cli
npx cap init NutriMate com.nutrimate.app

# Add Android platform
npm install @capacitor/android
npx cap add android

# Build web assets
npm run build

# Sync and open in Android Studio
npx cap sync
npx cap open android
```

Then build the APK from Android Studio: **Build → Build Bundle(s) / APK(s) → Build APK(s)**

---

## 📁 Folder Structure

```
src/
├── components/        # Reusable UI components
│   ├── Navbar.jsx          # Bottom navigation bar
│   ├── FoodCard.jsx        # Food search result card
│   ├── MacroProgress.jsx   # Animated progress bar
│   ├── MealCard.jsx        # Expandable meal section
│   ├── Loader.jsx          # Skeleton loader
│   ├── BarcodeScanner.jsx  # Camera barcode reader
│   ├── WaterTracker.jsx    # Water intake widget
│   └── ThemeToggle.jsx     # Dark/light mode toggle
│
├── pages/             # Route pages
│   ├── Dashboard.jsx       # Daily overview
│   ├── LogFood.jsx         # Food search & logging
│   ├── Presets.jsx         # Weekly meal presets
│   ├── Scan.jsx            # Barcode scanner
│   ├── Profile.jsx         # User profile & settings
│   ├── Analytics.jsx       # Charts & insights
│   ├── WeightTracker.jsx   # Weight logging
│   └── Onboarding.jsx      # First-time setup
│
├── services/          # API integration
│   ├── foodSearchService.js  # Cascading search logic
│   ├── apiUSDA.js
│   ├── apiCalorieNinja.js
│   ├── apiOpenFoodFacts.js
│   └── apiICMR.js
│
├── data/
│   └── indianFoods.json     # 130+ Indian food items
│
├── utils/
│   ├── storage.js           # localStorage helpers
│   ├── cacheManager.js      # API result caching
│   ├── nutritionCalculator.js # BMR/TDEE calculator
│   └── macroCalculator.js   # Macro distribution
│
├── context/
│   └── AppContext.jsx       # Global state management
│
├── hooks/
│   ├── useOffline.js        # Online/offline detection
│   └── useTheme.js          # Dark mode hook
│
└── App.jsx                  # Router & app shell
```

---

## 🗄️ localStorage Keys

| Key | Description | Auto-delete |
|-----|-------------|-------------|
| `user_profile` | Onboarding data | No |
| `daily_logs` | Food log entries | After 30 days |
| `food_cache` | Cached API results | After 30 days |
| `barcode_cache` | Scanned product data | Never |
| `meal_presets` | Weekly hostel presets | No |
| `water_log` | Daily water intake | No |
| `weight_history` | Weight entries | Never |
| `theme` | Dark/Light preference | No |

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [USDA FoodData Central](https://fdc.nal.usda.gov/) for nutrition data
- [Open Food Facts](https://openfoodfacts.org/) for product barcode database
- [CalorieNinja](https://calorieninjas.com/) for natural language food search
- [ICMR-NIN](https://www.nin.res.in/) for Indian food composition data
