# CropXAI — Complete Technology Stack Documentation

> **Project:** CropXAI – AI-Powered Smart Farming Dashboard  
> **Version:** 1.0.0  
> **Document Type:** Technical Stack Reference & Viva Guide  

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Frontend Technologies](#2-frontend-technologies)
3. [Backend Technologies](#3-backend-technologies)
4. [AI / ML Technologies](#4-ai--ml-technologies)
5. [Browser APIs Used](#5-browser-apis-used)
6. [Database & Storage](#6-database--storage)
7. [External APIs & Services](#7-external-apis--services)
8. [Project Architecture Overview](#8-project-architecture-overview)
9. [Module Breakdown](#9-module-breakdown)
10. [Key Design Decisions](#10-key-design-decisions)

---

## 1. Project Overview

CropXAI is a full-stack, AI-powered smart farming web application that helps Indian farmers make data-driven crop decisions. It combines a rule-based Explainable AI engine, real-time geolocation, voice control, and plant disease detection into a single responsive dashboard.

| Property | Value |
|---|---|
| Application Type | Full-Stack Web Application |
| Primary Language | JavaScript (Frontend + Backend) |
| AI Approach | Rule-Based Explainable AI (XAI) |
| Target Users | Indian farmers across all states |
| Supported Languages | English, Telugu (తెలుగు), Hindi (हिंदी) |
| Supported Crops | Rice, Wheat, Cotton, Maize, Sugarcane, Groundnut, Tomato, Potato |

---

## 2. Frontend Technologies

### 2.1 Core Languages

| Technology | Version | Role |
|---|---|---|
| HTML5 | Standard | Page structure, semantic markup, accessibility attributes |
| CSS3 | Standard | Styling, animations, responsive layout, glassmorphism effects |
| JavaScript (ES6+) | Vanilla | All frontend logic — no React, Vue, or Angular |

### 2.2 CSS Features Used

| Feature | Where Used |
|---|---|
| CSS Custom Properties (variables) | Global theme tokens — `--accent`, `--bg-card`, `--radius`, etc. |
| CSS Grid | Stats grid, crop ranking cards, form layouts, soil analysis cards |
| CSS Flexbox | Sidebar nav, topbar, card headers, button rows |
| CSS Animations (`@keyframes`) | Mic pulse rings, leaf sway, scan rings, badge entrance/exit, shimmer |
| `backdrop-filter: blur()` | Topbar glassmorphism, modal overlays |
| `clamp()` | Responsive font sizes on the login welcome title |
| CSS `transition` | All hover states, dropdown fills, confidence bars |
| Media Queries | Breakpoints at 1200px, 900px, 600px for full responsiveness |

### 2.3 Fonts

| Font | Weights | Usage |
|---|---|---|
| Inter (Google Fonts) | 300, 400, 500, 600, 700 | Body text, labels, UI elements |
| Poppins (Google Fonts) | 600, 700, 800 | Headings, brand name, crop names |

### 2.4 Frontend File Structure

```
frontend/
├── index.html              — Main dashboard (single-page app)
├── login.html              — Authentication page
├── assets/
│   └── farmer-bg.jpg.jpeg  — Login background image
├── css/
│   ├── styles.css          — Main dashboard styles (~3000 lines)
│   └── login.css           — Login page styles
└── js/
    ├── app.js              — Core dashboard logic, crop recommendation display
    ├── location.js         — Geolocation + climate auto-detection module
    ├── voiceAssistant.js   — Speech Recognition voice command module
    ├── diseaseDetection.js — Plant disease detection UI module
    ├── translations.js     — Multilingual string support (en/te/hi)
    └── login.js            — Authentication logic
```

---

## 3. Backend Technologies

### 3.1 Runtime & Framework

| Technology | Version | Role |
|---|---|---|
| Node.js | ≥ 18.x | JavaScript runtime for the server |
| Express.js | ^4.18.2 | HTTP server framework, routing, middleware |

### 3.2 Backend Dependencies (from `package.json`)

| Package | Version | Purpose |
|---|---|---|
| `express` | ^4.18.2 | Web server and REST API framework |
| `mongoose` | ^7.5.0 | MongoDB ODM — schema definition, validation, queries |
| `bcryptjs` | ^2.4.3 | Password hashing with salt rounds (10 rounds) |
| `jsonwebtoken` | ^9.0.2 | JWT generation and verification for auth sessions |
| `multer` | ^1.4.5-lts.1 | Multipart file upload handling (disease image uploads) |
| `cors` | ^2.8.5 | Cross-Origin Resource Sharing headers |
| `body-parser` | ^1.20.2 | JSON and URL-encoded request body parsing |
| `dotenv` | ^16.3.1 | Environment variable loading from `.env` file |
| `nodemon` | ^3.0.1 | Dev-only: auto-restart server on file changes |
| `jest` | ^29.6.4 | Dev-only: unit testing framework |

### 3.3 REST API Endpoints

The backend exposes a RESTful API under the `/api` prefix:

#### Authentication — `/api/auth`

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register new farmer account |
| POST | `/api/auth/login` | Login and receive JWT token |
| POST | `/api/auth/reset-password` | Reset password by username + email |

#### Crop Data — `/api/crops`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/crops` | List all crops (supports `?language=en/te/hi`) |
| GET | `/api/crops/:cropId` | Full details for a single crop |
| GET | `/api/crops/:cropId/irrigation-schedule` | Irrigation schedule for a crop |

#### Recommendations — `/api/recommendations`

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/recommendations` | Run XAI engine, return ranked crop recommendations |
| GET | `/api/recommendations/history/:userId` | Paginated recommendation history for a user |

#### Soil Analysis — `/api/soil`

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/soil/auto-detect` | Auto-detect NPK + pH from climate and soil type |
| POST | `/api/soil/analysis` | Analyse NPK values and return nutrient level descriptions |
| GET | `/api/soil/ph-info` | pH range reference table |

#### Disease Detection — `/api/disease`

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/disease/predict` | Upload leaf image + crop type, receive disease diagnosis |

#### Health Check

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Server status and timestamp |

### 3.4 Security Implementation

| Mechanism | Implementation |
|---|---|
| Password Storage | `bcryptjs` with 10 salt rounds — passwords never stored in plain text |
| Session Tokens | JWT (JSON Web Tokens) with 7-day expiry via `jsonwebtoken` |
| File Upload Safety | `multer` validates MIME type and extension; 10 MB size limit enforced |
| Temp File Cleanup | Uploaded disease images deleted from disk immediately after prediction |
| Environment Secrets | All secrets (JWT key, MongoDB URI) loaded from `.env` via `dotenv` |

---

## 4. AI / ML Technologies

### 4.1 Crop Recommendation — Explainable AI (XAI) Engine

CropXAI does **not** use a black-box ML model for crop recommendation. Instead it implements a transparent, rule-based **Weighted Feature Scoring** algorithm — making every decision fully explainable to the farmer.

**Location:** `explainableAI.js` (frontend) and `backend/services/explainableAI.js` (backend mirror)

#### Algorithm: Weighted Feature Scoring

Each crop in the database is scored against the farmer's inputs using seven features:

| Feature | Weight | Scoring Logic |
|---|---|---|
| Climate | **30%** | Binary: 100 if crop's climate list includes input, else 0 |
| Season | **25%** | Binary: 100 if crop's season list includes input, else 0 |
| Soil Type | **25%** | Binary: 100 if crop's soilType list includes input, else 0 |
| Soil pH | **10%** | 100 if within range; decreases by 20 per unit outside range |
| Nitrogen (N) | **3%** | 100 if within NPK range; penalised proportionally outside |
| Phosphorus (P) | **3%** | Same as Nitrogen |
| Potassium (K) | **4%** | Same as Nitrogen |
| **Total** | **100%** | Weighted sum = Confidence Score (0–100%) |

**Confidence Score Formula:**
```
confidence = Σ (feature_score × feature_weight)
           = (climate×0.30) + (season×0.25) + (soilType×0.25)
           + (ph×0.10) + (N×0.03) + (P×0.03) + (K×0.04)
```

All 8 crops are scored and sorted descending. The full ranked list is displayed to the farmer with suitability tags (High ≥75%, Medium ≥50%, Low <50%).

#### Why Explainable AI?

Traditional ML models (Random Forest, Neural Networks) give a prediction without explaining why. CropXAI's XAI approach:
- Shows per-feature scores as progress bars
- Generates natural-language explanations in English, Telugu, and Hindi
- Provides actionable recommendations when a score is low (e.g., "Adjust soil pH")
- Builds farmer trust by making the reasoning transparent

### 4.2 Plant Disease Detection

**Location:** `frontend/js/diseaseDetection.js`, `backend/routes/disease.js`

| Aspect | Detail |
|---|---|
| Current Mode | Rule-based simulation (demo mode) |
| Input | Leaf image (JPG/PNG, max 10 MB) + crop type selection |
| Disease Database | 8 crops × 1–3 diseases each = 20+ disease profiles |
| Output | Disease name, severity (High/Medium/Low/None), confidence %, symptoms, causes, treatment steps, prevention tips, organic remedies |
| Fallback | 30% probability of "Healthy Plant" result |
| Production Path | `analyzeImage()` function in `disease.js` is designed to be swapped with a real TensorFlow.js or Python ML microservice call |

**Disease coverage per crop:**

| Crop | Diseases Covered |
|---|---|
| Rice | Rice Blast, Bacterial Leaf Blight, Brown Spot |
| Wheat | Leaf Rust, Powdery Mildew |
| Tomato | Early Blight, Late Blight, Leaf Curl Virus |
| Potato | Late Blight, Early Blight |
| Maize | Common Rust, Northern Leaf Blight |
| Cotton | Boll Rot, Bacterial Blight |
| Groundnut | Early Leaf Spot |
| Sugarcane | Red Rot |

### 4.3 Climate Auto-Detection from Location

**Location:** `frontend/js/location.js` (climate module section)

A keyword-matching lookup table maps 100+ Indian city and state names to one of four climate categories (Tropical, Subtropical, Temperate, Arid). When GPS resolves a location, the climate dropdown auto-fills without any user input.

---

## 5. Browser APIs Used

All browser APIs are used directly — no wrapper libraries required.

### 5.1 Web Speech API — Speech Recognition

**Location:** `frontend/js/voiceAssistant.js`

| Property | Value |
|---|---|
| API | `window.SpeechRecognition` / `window.webkitSpeechRecognition` |
| Mode | Continuous recognition with interim results |
| Language | `en-IN` (Indian English) |
| Max Alternatives | 3 per result |
| Browser Support | Chrome, Edge (not Firefox) |

**Voice commands supported:**

| Category | Example Commands |
|---|---|
| Navigation | "Go to crop prediction", "Open disease detection", "Show soil analysis" |
| Location | "Set location to Hyderabad", "Detect my location" |
| Soil & Climate | "Select black soil", "Set climate to tropical", "Set season to kharif" |
| Inputs | "Set area to 5 acres" |
| Actions | "Get recommendation", "Auto detect values", "Show profile" |
| Control | "Close", "Stop", "Help" |

### 5.2 Web Speech API — Speech Synthesis (Text-to-Speech)

**Location:** `frontend/js/app.js` (`_ttsSpeak`, `_ttsStop`, `_ttsBindButtons`)

| Property | Value |
|---|---|
| API | `window.SpeechSynthesis` + `SpeechSynthesisUtterance` |
| Speech Rate | 0.88 (slightly slower for clarity) |
| Language Codes | `en-US`, `hi-IN`, `te-IN` based on selected app language |
| Voice Selection | Best-match algorithm: exact lang → prefix match → any English → first available |
| Chrome Bug Fix | 150ms delay after `cancel()` before `speak()` to prevent silent drop |
| Long Text Fix | `setInterval` keep-alive (pause+resume every 10s) prevents Chrome cutoff |

**Content read aloud:** Best crop name, suitability %, expected yield, water requirement, growing season, estimated profit, irrigation recommendation, fertilizer recommendation, additional soil tips, top-5 ranked alternatives.

### 5.3 Geolocation API

**Location:** `frontend/js/location.js`

| Property | Value |
|---|---|
| API | `navigator.geolocation.getCurrentPosition()` |
| Accuracy | High accuracy mode enabled |
| Timeout | 12 seconds |
| Cache | 5-minute position cache (`maximumAge: 300000`) |
| Reverse Geocoding | Nominatim (OpenStreetMap) — free, no API key required |
| Session Persistence | Location stored in `sessionStorage` to avoid re-requesting on reload |

### 5.4 Web Storage APIs

| API | Usage |
|---|---|
| `localStorage` | Persists registered user accounts across browser sessions; remembers "Remember Me" username |
| `sessionStorage` | Stores active login session (`cropxai_user`) and last detected location (`cropxai_location`) |

### 5.5 File API & Drag-and-Drop

**Location:** `frontend/js/diseaseDetection.js`

| API | Usage |
|---|---|
| `FileReader` | Reads uploaded leaf image as Data URL for preview |
| `DataTransfer` | Handles drag-and-drop file uploads onto the drop zone |
| `FormData` | Packages image + crop type for multipart POST to `/api/disease/predict` |
| `fetch()` | Async HTTP requests to backend API with 10-second timeout via `AbortController` |

### 5.6 Other Browser APIs

| API | Usage |
|---|---|
| `IntersectionObserver` | Animates stat counters on the login page when they scroll into view |
| `MutationObserver` | Watches `#ddLoader` display changes to animate disease detection step indicators; watches `#recommendationResults` to auto-show results card |
| `requestAnimationFrame` | Triggers CSS bar animations after DOM paint for smooth transitions |

---

## 6. Database & Storage

### 6.1 MongoDB (Backend Persistent Storage)

| Property | Value |
|---|---|
| Database | MongoDB |
| ODM | Mongoose ^7.5.0 |
| Default URI | `mongodb://localhost:27017/cropxai` |
| Connection | Async with error handling and `process.exit(1)` on failure |

**Collections / Mongoose Models:**

#### `users` collection — `backend/models/User.js`

| Field | Type | Constraints |
|---|---|---|
| `username` | String | Required, unique, 3–30 chars |
| `email` | String | Required, unique, regex validated, lowercase |
| `password` | String | Required, min 6 chars, bcrypt hashed pre-save, `select: false` |
| `name` | String | Required |
| `role` | String | Enum: `farmer` / `admin`, default `farmer` |
| `farmDetails` | Object | Optional: area, location, soilType, climate |
| `createdAt` | Date | Auto-set on creation |
| `lastLogin` | Date | Updated on each successful login |

#### `recommendations` collection — `backend/models/Recommendation.js`

| Field | Type | Description |
|---|---|---|
| `userId` | ObjectId | Reference to `users` collection |
| `inputs` | Object | All 8 farm parameters (climate, area, season, soilType, pH, N, P, K) |
| `recommendation.cropName` | String | Best crop key (e.g., `rice`) |
| `recommendation.confidence` | Number | XAI confidence score 0–100 |
| `recommendation.featureScores` | Map | Per-feature scores |
| `recommendation.explanation` | String | Natural language summary |
| `createdAt` | Date | Auto-set; indexed with userId for fast history queries |

### 6.2 Browser localStorage (Frontend Client Storage)

| Key | Content | Persistence |
|---|---|---|
| `cropxai_users` | JSON object of all registered users `{ username: { password, name } }` | Until manually cleared |
| `cropxai_remember` | Last "Remember Me" username string | Until manually cleared |

### 6.3 Browser sessionStorage (Frontend Session Storage)

| Key | Content | Persistence |
|---|---|---|
| `cropxai_user` | JSON object of logged-in user `{ username, name }` | Browser tab session only |
| `cropxai_location` | JSON object `{ city, state, country, lat, lon, label }` | Browser tab session only |

### 6.4 Static JSON Data Files (In-Memory at Runtime)

| File | Content |
|---|---|
| `cropData.js` | Full crop database — 8 crops with all agronomic data |
| `diseaseDatabase.js` | Disease profiles for all 8 crops |
| `soilData.js` | NPK ranges and pH values by soil type and climate |
| `backend/data/cropDatabase.js` | Backend mirror of crop data |
| `backend/data/soilDataset.js` | Backend mirror of soil data |

---

## 7. External APIs & Services

| Service | Provider | Usage | Cost |
|---|---|---|---|
| Nominatim Reverse Geocoding | OpenStreetMap | Converts GPS coordinates (lat/lon) to city and state name | Free, no API key |
| Google Fonts | Google | Loads Inter and Poppins font families | Free CDN |
| Web Speech API | Browser (Chrome/Edge) | Speech recognition and synthesis | Free, built-in |
| Geolocation API | Browser | GPS coordinates | Free, built-in |

---

## 8. Project Architecture Overview

### 8.1 System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER (Farmer)                            │
│              Browser: Chrome / Edge / Mobile                    │
└──────────────────────────┬──────────────────────────────────────┘
                           │ HTTP / HTTPS
┌──────────────────────────▼──────────────────────────────────────┐
│                    FRONTEND (Static Files)                      │
│                                                                 │
│  login.html ──► index.html (Single-Page Dashboard)             │
│                                                                 │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────────────┐   │
│  │  app.js     │  │ location.js  │  │  voiceAssistant.js  │   │
│  │ (XAI Engine │  │ (GPS + Nomi- │  │  (SpeechRecognition │   │
│  │  + TTS)     │  │  natim + CLI-│  │   + SpeechSynthesis)│   │
│  └─────────────┘  │  mate Auto)  │  └─────────────────────┘   │
│                   └──────────────┘                             │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  diseaseDetection.js  (Image upload + API call + UI)     │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  Data: cropData.js │ diseaseDatabase.js │ soilData.js          │
└──────────────────────────┬──────────────────────────────────────┘
                           │ REST API calls (fetch)
                           │ POST /api/disease/predict
                           │ POST /api/recommendations
                           │ POST /api/soil/auto-detect
┌──────────────────────────▼──────────────────────────────────────┐
│                  BACKEND (Node.js + Express)                    │
│                                                                 │
│  server.js (Express app, port 3000)                            │
│                                                                 │
│  Routes:                                                        │
│  /api/auth          ──► auth.js    (JWT + bcrypt)              │
│  /api/crops         ──► crops.js   (crop data queries)         │
│  /api/soil          ──► soil.js    (NPK auto-detect)           │
│  /api/recommendations ► recommendations.js (XAI engine)        │
│  /api/disease       ──► disease.js (multer + prediction)       │
│                                                                 │
│  Services:                                                      │
│  explainableAI.js   (Weighted Feature Scoring algorithm)       │
└──────────────────────────┬──────────────────────────────────────┘
                           │ Mongoose ODM
┌──────────────────────────▼──────────────────────────────────────┐
│                    DATABASE (MongoDB)                           │
│                                                                 │
│  Collections:  users  │  recommendations                       │
└─────────────────────────────────────────────────────────────────┘
```

### 8.2 Frontend Data Flow — Crop Recommendation

```
User fills form (location, climate, soil, NPK, pH, area, season)
        │
        ▼
recommendBtn.click()  [app.js]
        │
        ▼
explainableAI.analyzeAllCrops(inputs, cropDatabase)
        │  Scores all 8 crops using weighted feature algorithm
        │  Returns array sorted by confidence (highest first)
        ▼
displayAllRecommendations(results, inputs)
        │
        ├──► Best Crop Hero Card (score ring, quick stats, feature bars)
        │
        └──► All Crops Ranked List (8 cards with progress bars)
                │
                └──► Read Aloud button → SpeechSynthesis API
```

### 8.3 Frontend Data Flow — Disease Detection

```
User selects crop type + uploads leaf image
        │
        ▼
_handleFileSelect()  [diseaseDetection.js]
        │  Validates type (JPG/PNG) and size (≤10MB)
        │  Shows image preview
        ▼
ddDetectBtn.click() → _runDetection()
        │
        ├──► Try: POST /api/disease/predict (FormData: image + crop)
        │         Backend: multer saves file → analyzeImage() → delete file
        │         Returns: disease name, severity, confidence, treatment
        │
        └──► Fallback (if backend unavailable):
              _simulateDetection() using local diseaseDatabase.js
        │
        ▼
_displayResults()  — renders result card with confidence bar
```

### 8.4 Frontend Data Flow — Location & Climate

```
Page load → initLocationDetection()  [location.js]
        │
        ├──► Check sessionStorage for cached location
        │         If found: restore fields, skip GPS
        │
        └──► navigator.geolocation.getCurrentPosition()
                  │
                  ▼
             Nominatim API (OpenStreetMap)
             GET https://nominatim.openstreetmap.org/reverse?lat=&lon=
                  │
                  ▼
             Resolve city + state name
                  │
                  ├──► Fill location input field
                  ├──► Update topbar location chip
                  ├──► Save to sessionStorage
                  │
                  └──► autoDetectClimate(city, state)
                            │  Keyword match against 100+ city/state map
                            ▼
                       Auto-fill climate dropdown
                       Show "Climate detected" badge
```

---

## 9. Module Breakdown

### 9.1 Frontend Modules

| Module | File | Responsibility |
|---|---|---|
| Dashboard Core | `app.js` | Form handling, XAI display, soil auto-detect, TTS, profile modal |
| Location Detection | `location.js` | GPS, reverse geocoding, climate auto-fill, session restore |
| Voice Assistant | `voiceAssistant.js` | Speech recognition, command parsing, navigation, form fill |
| Disease Detection | `diseaseDetection.js` | Image upload, preview, API call, fallback simulation, results |
| Translations | `translations.js` | String lookup for English / Telugu / Hindi |
| Login Logic | `login.js` | Auth forms, password strength, tab switching, toast notifications |

### 9.2 Backend Modules

| Module | File | Responsibility |
|---|---|---|
| Server Entry | `server.js` | Express setup, middleware, route mounting, static file serving |
| Auth Routes | `routes/auth.js` | Register, login, password reset with JWT + bcrypt |
| Crop Routes | `routes/crops.js` | Crop data queries with language support |
| Soil Routes | `routes/soil.js` | NPK auto-detect, soil analysis, pH reference |
| Recommendation Routes | `routes/recommendations.js` | XAI engine invocation, history storage |
| Disease Routes | `routes/disease.js` | Multer upload, prediction engine, cleanup |
| XAI Service | `services/explainableAI.js` | Weighted scoring, confidence calculation, explanation generation |
| Database Config | `config/database.js` | Mongoose connection with error handling |
| User Model | `models/User.js` | Schema, bcrypt pre-save hook, password compare method |
| Recommendation Model | `models/Recommendation.js` | Schema with compound index on userId + createdAt |

---

## 10. Key Design Decisions

### 10.1 Why Vanilla JavaScript (No Framework)?

The frontend uses zero JavaScript frameworks (no React, Vue, Angular). This was a deliberate choice to:
- Keep the project lightweight and fast-loading
- Avoid build tooling complexity (no webpack, no npm build step for frontend)
- Demonstrate core JavaScript proficiency
- Allow the app to run directly from the filesystem or any static host

### 10.2 Why Explainable AI Instead of a Black-Box Model?

A traditional ML model (Random Forest, Neural Network) would require:
- A large labelled training dataset
- Python runtime or model serialisation
- Opaque predictions farmers cannot understand

The XAI weighted scoring approach:
- Runs entirely in the browser with zero latency
- Produces fully transparent, per-feature explanations
- Generates natural-language recommendations in 3 languages
- Can be extended to a real ML model by replacing `analyzeAllCrops()` without changing the UI

### 10.3 Why Dual-Mode (Frontend-Only + Backend)?

The app works in two modes:
- **Frontend-only mode:** All logic runs in the browser using `localStorage` for auth and static JS data files for crop/disease data. No server required.
- **Full-stack mode:** The Node.js/Express backend adds MongoDB persistence, JWT auth, and a proper REST API.

This dual-mode design means the app can be demonstrated without any server setup, while the backend is ready for production deployment.

### 10.4 Why Nominatim for Geocoding?

Nominatim (OpenStreetMap) was chosen over Google Maps API because:
- Completely free with no API key required
- No usage limits for reasonable traffic
- Returns detailed Indian address components (city, district, state)
- Respects user privacy — no tracking

---

## Summary Table

| Layer | Technology | Version / Standard |
|---|---|---|
| Frontend Language | HTML5, CSS3, JavaScript ES6+ | Web Standards |
| Fonts | Google Fonts (Inter, Poppins) | CDN |
| Backend Runtime | Node.js | ≥ 18.x |
| Backend Framework | Express.js | ^4.18.2 |
| Database | MongoDB | 6.x+ |
| ODM | Mongoose | ^7.5.0 |
| Auth | JWT + bcryptjs | ^9.0.2 / ^2.4.3 |
| File Upload | Multer | ^1.4.5-lts.1 |
| AI Engine | Custom Weighted XAI | Rule-based |
| Speech Recognition | Web Speech API | Browser built-in |
| Speech Synthesis | SpeechSynthesis API | Browser built-in |
| Geolocation | Geolocation API | Browser built-in |
| Reverse Geocoding | Nominatim / OpenStreetMap | Free REST API |
| Client Storage | localStorage + sessionStorage | Browser built-in |
| Dev Tools | Nodemon, Jest | ^3.0.1 / ^29.6.4 |

---

*Document generated from source code analysis of the CropXAI project.*  
*All technology versions verified from `backend/package.json` and source files.*
