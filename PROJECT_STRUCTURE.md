# CROPXAI - Project Structure Documentation

## 📁 Complete Directory Structure

```
CROPXAI/
│
├── backend/                          # Backend Server (Node.js + Express)
│   ├── config/                       # Configuration files
│   │   └── database.js              # MongoDB connection config
│   │
│   ├── data/                         # Data files
│   │   ├── cropDatabase.js          # Crop information database
│   │   └── soilDataset.js           # Soil parameters dataset
│   │
│   ├── models/                       # Database models (Mongoose)
│   │   ├── User.js                  # User model
│   │   └── Recommendation.js        # Recommendation history model
│   │
│   ├── routes/                       # API routes
│   │   ├── auth.js                  # Authentication routes
│   │   ├── crops.js                 # Crop data routes
│   │   ├── soil.js                  # Soil analysis routes
│   │   └── recommendations.js       # Recommendation routes
│   │
│   ├── services/                     # Business logic services
│   │   └── explainableAI.js         # AI recommendation engine
│   │
│   ├── .env.example                  # Environment variables template
│   ├── package.json                  # Backend dependencies
│   └── server.js                     # Main server file
│
├── frontend/                         # Frontend (HTML + CSS + JavaScript)
│   ├── css/                          # Stylesheets
│   │   └── styles.css               # Main stylesheet
│   │
│   ├── js/                           # JavaScript files
│   │   ├── app.js                   # Main application logic
│   │   ├── translations.js          # Multi-language translations
│   │   ├── api.js                   # API communication layer
│   │   └── voiceAssistant.js        # Voice assistant module
│   │
│   ├── assets/                       # Static assets
│   │   └── images/                  # Images and icons
│   │
│   └── index.html                    # Main HTML file
│
├── docs/                             # Documentation
│   ├── README.md                     # Main documentation
│   ├── API_DOCUMENTATION.md          # API endpoints documentation
│   ├── VOICE_ASSISTANT_GUIDE.md      # Voice assistant guide
│   ├── FEATURES_SUMMARY.md           # Features summary
│   └── QUICK_REFERENCE.md            # Quick reference card
│
└── PROJECT_STRUCTURE.md              # This file
```

---

## 🔧 Backend Structure

### Purpose
The backend serves as the API server, handling:
- User authentication and authorization
- Database operations
- AI-powered crop recommendations
- Soil data analysis
- Irrigation schedule management

### Technology Stack
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (with Mongoose ODM)
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** bcryptjs

### Key Components

#### 1. **server.js**
Main entry point for the backend server
- Initializes Express app
- Sets up middleware (CORS, body-parser)
- Connects routes
- Starts HTTP server

#### 2. **config/database.js**
Database configuration
- MongoDB connection setup
- Connection error handling
- Database initialization

#### 3. **models/**
Database schemas and models
- **User.js:** User authentication and profile data
- **Recommendation.js:** Recommendation history storage

#### 4. **routes/**
API endpoint definitions
- **auth.js:** `/api/auth/*` - Login, register, password reset
- **crops.js:** `/api/crops/*` - Crop data retrieval
- **soil.js:** `/api/soil/*` - Soil analysis and auto-detection
- **recommendations.js:** `/api/recommendations/*` - AI recommendations

#### 5. **services/explainableAI.js**
AI recommendation engine
- Feature importance calculation
- Confidence score generation
- Explainable recommendations
- Multi-crop analysis

#### 6. **data/**
Static data files
- **cropDatabase.js:** Complete crop information
- **soilDataset.js:** Soil parameters and NPK data

---

## 🎨 Frontend Structure

### Purpose
The frontend provides the user interface for:
- User authentication
- Farm data input
- Voice assistant interaction
- Viewing crop recommendations
- Irrigation schedule display

### Technology Stack
- **HTML5:** Structure and semantics
- **CSS3:** Styling and animations
- **Vanilla JavaScript:** Application logic
- **Web Speech API:** Voice recognition
- **LocalStorage API:** Client-side data persistence

### Key Components

#### 1. **index.html**
Main HTML structure
- Page layout
- Modal dialogs
- Form inputs
- Results display

#### 2. **css/styles.css**
Complete styling
- Responsive design
- Gradient backgrounds
- Modal styles
- Table formatting
- Animation effects

#### 3. **js/app.js**
Main application logic
- User authentication
- Form handling
- API communication
- UI updates
- Event listeners

#### 4. **js/translations.js**
Multi-language support
- English translations
- Telugu translations
- Hindi translations
- Dynamic language switching

#### 5. **js/api.js** (New)
API communication layer
- HTTP request handling
- Error handling
- Response parsing
- Token management

#### 6. **js/voiceAssistant.js** (New)
Voice assistant module
- Speech recognition
- Command processing
- Multi-language support
- Voice feedback

---

## 🔄 Data Flow

### 1. User Registration/Login Flow
```
Frontend (index.html)
    ↓ User enters credentials
Frontend (app.js)
    ↓ POST /api/auth/login
Backend (routes/auth.js)
    ↓ Validate credentials
Backend (models/User.js)
    ↓ Check database
MongoDB
    ↓ Return user data
Backend
    ↓ Generate JWT token
Frontend
    ↓ Store token
    ↓ Update UI
User Dashboard
```

### 2. Crop Recommendation Flow
```
Frontend (index.html)
    ↓ User fills form
Frontend (app.js)
    ↓ POST /api/recommendations
Backend (routes/recommendations.js)
    ↓ Validate inputs
Backend (services/explainableAI.js)
    ↓ Analyze with AI
Backend (data/cropDatabase.js)
    ↓ Match crops
Backend
    ↓ Generate explanation
    ↓ Save to database
MongoDB
    ↓ Return recommendation
Frontend
    ↓ Display results
    ↓ Show irrigation schedule
User sees recommendation
```

### 3. Auto-Detect Flow
```
Frontend (app.js)
    ↓ User selects climate & soil
    ↓ POST /api/soil/auto-detect
Backend (routes/soil.js)
    ↓ Query dataset
Backend (data/soilDataset.js)
    ↓ Calculate values
Backend
    ↓ Return pH, N, P, K
Frontend
    ↓ Fill form fields
User sees auto-filled values
```

### 4. Voice Command Flow
```
Frontend (voiceAssistant.js)
    ↓ User speaks command
Web Speech API
    ↓ Transcribe speech
Frontend (voiceAssistant.js)
    ↓ Process command
    ↓ Execute action
Frontend (app.js)
    ↓ Trigger corresponding function
    ↓ (e.g., recommend, profile, auto-fill)
User sees result
```

---

## 🌐 API Endpoints

### Authentication Endpoints
```
POST   /api/auth/register          Register new user
POST   /api/auth/login             Login user
POST   /api/auth/reset-password    Reset password
```

### Crop Endpoints
```
GET    /api/crops                  Get all crops
GET    /api/crops/:cropId          Get single crop details
GET    /api/crops/:cropId/irrigation-schedule  Get irrigation schedule
```

### Soil Endpoints
```
POST   /api/soil/auto-detect       Auto-detect soil parameters
POST   /api/soil/analysis          Analyze soil nutrients
GET    /api/soil/ph-info           Get pH information
```

### Recommendation Endpoints
```
POST   /api/recommendations        Get crop recommendation
GET    /api/recommendations/history/:userId  Get user history
```

### Health Check
```
GET    /api/health                 Server health status
```

---

## 🚀 Setup Instructions

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   ```bash
   copy .env.example .env
   ```

4. **Configure environment variables:**
   Edit `.env` file with your settings

5. **Start MongoDB:**
   ```bash
   mongod
   ```

6. **Start backend server:**
   ```bash
   npm start
   ```
   Or for development:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. **Option 1: Serve via Backend**
   - Backend automatically serves frontend files
   - Access at `http://localhost:3000`

2. **Option 2: Standalone Development**
   - Use any static file server
   - Example with Python:
     ```bash
     cd frontend
     python -m http.server 8000
     ```
   - Access at `http://localhost:8000`

---

## 🔐 Security Features

### Backend Security
- Password hashing with bcrypt
- JWT token authentication
- CORS configuration
- Input validation
- SQL injection prevention (NoSQL)
- Rate limiting (configurable)

### Frontend Security
- XSS prevention
- CSRF token support
- Secure token storage
- Input sanitization
- HTTPS enforcement (production)

---

## 📊 Database Schema

### User Collection
```javascript
{
  _id: ObjectId,
  username: String (unique),
  email: String (unique),
  password: String (hashed),
  name: String,
  role: String (farmer/admin),
  farmDetails: {
    area: Number,
    location: String,
    soilType: String,
    climate: String
  },
  createdAt: Date,
  lastLogin: Date
}
```

### Recommendation Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  inputs: {
    climate: String,
    area: Number,
    season: String,
    soilType: String,
    soilPh: Number,
    nitrogen: Number,
    phosphorus: Number,
    potassium: Number
  },
  recommendation: {
    cropName: String,
    confidence: Number,
    featureScores: Map,
    explanation: String
  },
  createdAt: Date
}
```

---

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test
```

### API Testing
Use tools like:
- Postman
- Insomnia
- cURL
- Thunder Client (VS Code)

### Frontend Testing
- Manual testing in browser
- Browser DevTools
- Lighthouse audit
- Cross-browser testing

---

## 📦 Deployment

### Backend Deployment
**Recommended Platforms:**
- Heroku
- AWS EC2
- DigitalOcean
- Railway
- Render

**Steps:**
1. Set environment variables
2. Configure MongoDB Atlas
3. Build and deploy
4. Set up SSL certificate

### Frontend Deployment
**Recommended Platforms:**
- Netlify
- Vercel
- GitHub Pages
- AWS S3 + CloudFront

**Steps:**
1. Update API endpoints
2. Build production version
3. Deploy static files
4. Configure CDN

---

## 🔧 Development Tools

### Recommended VS Code Extensions
- ESLint
- Prettier
- REST Client
- MongoDB for VS Code
- Live Server
- GitLens

### Useful npm Scripts
```json
{
  "start": "node server.js",
  "dev": "nodemon server.js",
  "test": "jest",
  "lint": "eslint .",
  "format": "prettier --write ."
}
```

---

## 📝 Code Organization Best Practices

### Backend
- Keep routes thin, logic in services
- Use middleware for common operations
- Implement proper error handling
- Add input validation
- Write unit tests
- Document API endpoints

### Frontend
- Separate concerns (HTML/CSS/JS)
- Use modular JavaScript
- Implement error boundaries
- Add loading states
- Optimize performance
- Ensure accessibility

---

## 🤝 Contributing

### Code Style
- Use consistent indentation (2 spaces)
- Follow naming conventions
- Add comments for complex logic
- Write meaningful commit messages

### Pull Request Process
1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request
6. Address review comments

---

## 📞 Support

For issues or questions:
1. Check documentation
2. Review API documentation
3. Check GitHub issues
4. Contact development team

---

**CROPXAI - Organized, Scalable, Production-Ready** 🌾🚀
