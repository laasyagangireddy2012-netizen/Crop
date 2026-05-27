# CROPXAI - Architecture Diagrams

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                             │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    FRONTEND LAYER                         │  │
│  │                                                            │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐ │  │
│  │  │  HTML5   │  │   CSS3   │  │JavaScript│  │  Voice   │ │  │
│  │  │ Structure│  │  Styling │  │   Logic  │  │Assistant │ │  │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘ │  │
│  │                                                            │  │
│  │  • index.html                                             │  │
│  │  • styles.css                                             │  │
│  │  • app.js, translations.js, api.js                       │  │
│  │  • voiceAssistant.js                                      │  │
│  └──────────────────────────────────────────────────────────┘  │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            │ HTTP/HTTPS
                            │ REST API
                            │
┌───────────────────────────▼─────────────────────────────────────┐
│                      BACKEND SERVER                              │
│                    (Node.js + Express)                           │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    API LAYER                              │  │
│  │                                                            │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐ │  │
│  │  │   Auth   │  │  Crops   │  │   Soil   │  │  Recom.  │ │  │
│  │  │  Routes  │  │  Routes  │  │  Routes  │  │  Routes  │ │  │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘ │  │
│  └──────────────────────────────────────────────────────────┘  │
│                            │                                     │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                  BUSINESS LOGIC LAYER                     │  │
│  │                                                            │  │
│  │  ┌──────────────────┐  ┌──────────────────┐             │  │
│  │  │  Explainable AI  │  │  Data Processing │             │  │
│  │  │     Engine       │  │     Services     │             │  │
│  │  └──────────────────┘  └──────────────────┘             │  │
│  └──────────────────────────────────────────────────────────┘  │
│                            │                                     │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    DATA LAYER                             │  │
│  │                                                            │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐ │  │
│  │  │   User   │  │   Recom. │  │   Crop   │  │   Soil   │ │  │
│  │  │  Model   │  │  Model   │  │   Data   │  │   Data   │ │  │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘ │  │
│  └──────────────────────────────────────────────────────────┘  │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            │
┌───────────────────────────▼─────────────────────────────────────┐
│                      DATABASE LAYER                              │
│                        (MongoDB)                                 │
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │    Users     │  │Recommendations│  │   Sessions   │          │
│  │  Collection  │  │  Collection   │  │  Collection  │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Request-Response Flow

```
┌──────────┐
│  USER    │
└────┬─────┘
     │
     │ 1. Fills form & clicks "Get Recommendation"
     ▼
┌─────────────────┐
│   FRONTEND      │
│   (Browser)     │
│                 │
│  • Validate     │
│  • Prepare data │
│  • Add token    │
└────┬────────────┘
     │
     │ 2. POST /api/recommendations
     │    { inputs: {...}, language: "en" }
     ▼
┌─────────────────┐
│   BACKEND       │
│   (Server)      │
│                 │
│  • Verify token │
│  • Validate     │
└────┬────────────┘
     │
     │ 3. Process request
     ▼
┌─────────────────┐
│  AI ENGINE      │
│                 │
│  • Analyze      │
│  • Calculate    │
│  • Score        │
└────┬────────────┘
     │
     │ 4. Query data
     ▼
┌─────────────────┐
│  CROP DATABASE  │
│                 │
│  • Match crops  │
│  • Get details  │
└────┬────────────┘
     │
     │ 5. Generate explanation
     ▼
┌─────────────────┐
│  BACKEND        │
│                 │
│  • Format       │
│  • Save to DB   │
└────┬────────────┘
     │
     │ 6. Return JSON response
     │    { success: true, data: {...} }
     ▼
┌─────────────────┐
│   FRONTEND      │
│                 │
│  • Parse JSON   │
│  • Update UI    │
│  • Display      │
└────┬────────────┘
     │
     │ 7. Show results
     ▼
┌──────────┐
│  USER    │
│  Sees    │
│  Result  │
└──────────┘
```

---

## 📁 File Structure Diagram

```
CROPXAI/
│
├── 📂 backend/                    ← SERVER-SIDE CODE
│   │
│   ├── 📄 server.js              ← Main entry point
│   ├── 📄 package.json           ← Dependencies
│   ├── 📄 .env.example           ← Config template
│   │
│   ├── 📂 config/
│   │   └── 📄 database.js        ← DB connection
│   │
│   ├── 📂 models/                ← Database schemas
│   │   ├── 📄 User.js
│   │   └── 📄 Recommendation.js
│   │
│   ├── 📂 routes/                ← API endpoints
│   │   ├── 📄 auth.js           ← /api/auth/*
│   │   ├── 📄 crops.js          ← /api/crops/*
│   │   ├── 📄 soil.js           ← /api/soil/*
│   │   └── 📄 recommendations.js ← /api/recommendations/*
│   │
│   ├── 📂 services/              ← Business logic
│   │   └── 📄 explainableAI.js  ← AI engine
│   │
│   └── 📂 data/                  ← Static data
│       ├── 📄 cropDatabase.js   ← Crop info
│       └── 📄 soilDataset.js    ← Soil data
│
├── 📂 frontend/                   ← CLIENT-SIDE CODE
│   │
│   ├── 📄 index.html             ← Main page
│   │
│   ├── 📂 css/
│   │   └── 📄 styles.css         ← All styling
│   │
│   ├── 📂 js/
│   │   ├── 📄 app.js             ← Main logic
│   │   ├── 📄 translations.js    ← Languages
│   │   ├── 📄 api.js             ← API calls
│   │   └── 📄 voiceAssistant.js  ← Voice commands
│   │
│   └── 📂 assets/
│       └── 📂 images/
│
└── 📂 docs/                       ← DOCUMENTATION
    ├── 📄 README.md
    ├── 📄 API_DOCUMENTATION.md
    ├── 📄 PROJECT_STRUCTURE.md
    └── 📄 ARCHITECTURE_DIAGRAM.md
```

---

## 🔐 Authentication Flow

```
┌──────────┐
│  USER    │
└────┬─────┘
     │
     │ 1. Enter username & password
     ▼
┌─────────────────┐
│   FRONTEND      │
│                 │
│  POST /api/auth/login
│  {
│    username: "farmer",
│    password: "demo123"
│  }
└────┬────────────┘
     │
     │ 2. Send credentials
     ▼
┌─────────────────┐
│   BACKEND       │
│   Auth Route    │
│                 │
│  • Find user    │
│  • Compare hash │
└────┬────────────┘
     │
     │ 3. Query database
     ▼
┌─────────────────┐
│   MONGODB       │
│                 │
│  • User found   │
│  • Return data  │
└────┬────────────┘
     │
     │ 4. User data
     ▼
┌─────────────────┐
│   BACKEND       │
│                 │
│  • Generate JWT │
│  • Sign token   │
└────┬────────────┘
     │
     │ 5. Return token
     │    {
     │      success: true,
     │      token: "eyJhbG...",
     │      user: {...}
     │    }
     ▼
┌─────────────────┐
│   FRONTEND      │
│                 │
│  • Store token  │
│  • Save user    │
│  • Redirect     │
└────┬────────────┘
     │
     │ 6. Show dashboard
     ▼
┌──────────┐
│  USER    │
│  Logged  │
│  In      │
└──────────┘
```

---

## 🎤 Voice Assistant Flow

```
┌──────────┐
│  USER    │
│  Speaks  │
└────┬─────┘
     │
     │ "Recommend a crop"
     ▼
┌─────────────────┐
│  Web Speech API │
│  (Browser)      │
│                 │
│  • Capture      │
│  • Transcribe   │
└────┬────────────┘
     │
     │ Text: "recommend a crop"
     ▼
┌─────────────────┐
│  Voice Module   │
│  (Frontend)     │
│                 │
│  • Parse text   │
│  • Match command│
└────┬────────────┘
     │
     │ Command: "RECOMMEND"
     ▼
┌─────────────────┐
│  App Logic      │
│  (Frontend)     │
│                 │
│  • Trigger      │
│  • Execute      │
└────┬────────────┘
     │
     │ Call recommendBtn.click()
     ▼
┌─────────────────┐
│  API Request    │
│                 │
│  POST /api/recommendations
└────┬────────────┘
     │
     │ ... (normal flow)
     ▼
┌──────────┐
│  USER    │
│  Sees    │
│  Result  │
└──────────┘
```

---

## 💾 Data Storage Layers

```
┌─────────────────────────────────────────┐
│         CLIENT STORAGE                   │
│         (Browser)                        │
│                                          │
│  ┌────────────┐  ┌────────────┐        │
│  │ LocalStorage│  │ SessionStorage│      │
│  │            │  │            │        │
│  │ • Token    │  │ • Temp data│        │
│  │ • User     │  │ • Form data│        │
│  └────────────┘  └────────────┘        │
└─────────────────────────────────────────┘
                    │
                    │ API Calls
                    ▼
┌─────────────────────────────────────────┐
│         SERVER STORAGE                   │
│         (Backend)                        │
│                                          │
│  ┌────────────┐  ┌────────────┐        │
│  │  In-Memory │  │   Cache    │        │
│  │            │  │            │        │
│  │ • Sessions │  │ • Temp data│        │
│  │ • Tokens   │  │ • Results  │        │
│  └────────────┘  └────────────┘        │
└─────────────────────────────────────────┘
                    │
                    │ Database Queries
                    ▼
┌─────────────────────────────────────────┐
│       PERSISTENT STORAGE                 │
│         (MongoDB)                        │
│                                          │
│  ┌────────────┐  ┌────────────┐        │
│  │   Users    │  │Recommendations│      │
│  │ Collection │  │  Collection │        │
│  │            │  │            │        │
│  │ • Profiles │  │ • History  │        │
│  │ • Auth     │  │ • Results  │        │
│  └────────────┘  └────────────┘        │
└─────────────────────────────────────────┘
```

---

**CROPXAI - Clear Architecture, Better Understanding** 📐✨
