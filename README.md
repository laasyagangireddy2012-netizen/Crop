# CROPXAI - AI-Powered Crop Recommendation System

## Overview
CROPXAI is an advanced web-based crop recommendation system that uses Explainable AI to help farmers make informed decisions about crop selection based on their specific farm conditions.

## Features

### 1. User Authentication System
- **Login**: Secure user login with username and password
- **Registration**: Create new farmer accounts with email verification
- **Forgot Password**: Reset password using username and email
- **User Profile**: View and manage user information
- **Default Demo Account**: 
  - Username: `farmer`
  - Password: `demo123`

### 2. Multi-Language Support
Complete translation support for:
- **English** (en)
- **Telugu** (తెలుగు) (te)
- **Hindi** (हिंदी) (hi)

All UI elements, messages, and recommendations are fully translated.

### 3. Voice Assistant
- Voice command recognition for hands-free operation
- Supports English, Telugu, and Hindi voice commands
- **Available Commands:**
  - "Recommend crop" / "Suggest crop" - Get AI recommendation
  - "Show profile" / "Open profile" - View user profile
  - "Auto detect" / "Fill values" - Auto-fill soil parameters
  - "Help" - Show available commands
- Real-time voice transcription display
- Multi-language voice recognition (en-US, te-IN, hi-IN)
- Natural language processing for flexible commands

### 4. Smart Input System
**Manual Input:**
- Climate selection (Tropical, Subtropical, Temperate, Arid)
- Farm area in acres
- Season (Kharif, Rabi, Zaid)
- Soil type (Clay, Sandy, Loamy, Black, Red, Alluvial)
- Soil pH value (3-10 scale)
- NPK percentages (Nitrogen, Phosphorus, Potassium)

**Auto-Detect Feature:**
- Automatically suggests optimal pH values based on soil type and climate
- Auto-fills NPK percentages using agricultural datasets
- Based on real agricultural research data for Indian soil types

### 5. Agricultural Information System
**Soil pH Information:**
- pH classification table (Acidic to Alkaline)
- Suitable crops for each pH range
- Optimal pH ranges for different crops

**NPK Nutrients Information:**
- Detailed nutrient functions
- Deficiency signs and symptoms
- Optimal percentage ranges
- Fertilizer recommendations

### 6. Explainable AI Crop Recommendation
**Feature Importance Analysis:**
- Climate match score (30% weight)
- Season compatibility (25% weight)
- Soil type suitability (25% weight)
- pH compatibility (10% weight)
- NPK nutrient levels (10% combined weight)

**AI Explanation Includes:**
- Confidence score (0-100%)
- Visual feature importance bars
- Detailed score breakdown for each parameter
- Specific recommendations for improvement
- Why this crop was selected

### 7. Comprehensive Crop Database
Supports 8 major crops:
1. **Rice** (వరి / चावल)
2. **Wheat** (గోధుమ / गेहूं)
3. **Cotton** (పత్తి / कपास)
4. **Maize** (మొక్కజొన్న / मक्का)
5. **Sugarcane** (చెరకు / गन्ना)
6. **Groundnut** (వేరుశెనగ / मूंगफली)
7. **Tomato** (టమాటో / टमाटर)
8. **Potato** (బంగాళాదుంప / आलू)

### 8. Detailed Recommendations
For each recommended crop:
- **Irrigation methods**: Specific water requirements and techniques
- **Irrigation Schedule**: Complete stage-wise irrigation calendar
  - Growth stages (Sowing, Vegetative, Flowering, Maturity, etc.)
  - Days after planting
  - Irrigation frequency
  - Water depth requirements
  - Critical irrigation periods highlighted
- **Fertilizer recommendations**: NPK ratios and application methods
- **Soil analysis**: Current nutrient status and suggestions
- **pH compatibility**: Optimal range vs. your soil
- **NPK requirements**: Crop needs vs. your soil levels
- **Explanation**: Why this crop suits your conditions

### 9. Irrigation Scheduling System
Detailed stage-wise irrigation schedules for all 8 crops:
- **Rice**: 7 stages from land preparation to maturity (120 days)
- **Wheat**: 6 stages from crown root to dough stage (120 days)
- **Cotton**: 6 stages from sowing to maturity (180 days)
- **Maize**: 6 stages from sowing to maturity (100 days)
- **Sugarcane**: 5 stages from planting to harvest (365 days)
- **Groundnut**: 6 stages from sowing to maturity (120 days)
- **Tomato**: 6 stages from transplanting to ripening (120 days)
- **Potato**: 6 stages from planting to harvest (100 days)

Each schedule includes:
- Growth stage name
- Days after planting
- Irrigation frequency
- Water depth per irrigation
- Critical periods marked

## Technical Implementation

### Data Sources
- Agricultural datasets based on Indian Council of Agricultural Research (ICAR) standards
- Soil nutrient ranges from state agricultural universities
- Climate-specific crop recommendations from agricultural extension services

### AI Algorithm
- Multi-factor weighted scoring system
- Feature importance calculation
- Confidence score generation
- Explainable recommendations with transparency

### Browser Compatibility
- Modern browsers (Chrome, Firefox, Edge, Safari)
- Speech recognition requires Chrome/Edge for best results
- Responsive design for mobile and desktop

## How to Use

1. **Open** `index.html` in a web browser
2. **Select Language** from the dropdown (English/Telugu/Hindi)
3. **Login** with credentials or create a new account
4. **Enter Farm Details**:
   - Select climate and soil type first
   - Use "Auto Detect" buttons to fill pH and NPK values
   - Or manually enter all values
5. **Click** "Get Crop Recommendation"
6. **Review** the AI-powered recommendation with explanations
7. **Use Voice Assistant** (optional) for hands-free operation

## File Structure
```
├── index.html                    # Main HTML structure
├── styles.css                    # Complete styling with irrigation table styles
├── app.js                        # Main application logic with enhanced voice assistant
├── translations.js               # Multi-language translations (EN/TE/HI)
├── cropData.js                   # Crop database with irrigation schedules
├── soilData.js                   # Agricultural soil datasets
├── explainableAI.js              # AI recommendation engine
├── README.md                     # Main documentation
└── VOICE_ASSISTANT_GUIDE.md      # Detailed voice assistant guide
```

## Local Storage
User accounts are stored in browser's localStorage for persistence across sessions.

## Future Enhancements
- Weather API integration
- Market price predictions
- Pest and disease identification
- Crop rotation suggestions
- Yield estimation calculator
- Voice feedback/responses
- Offline voice recognition
- SMS/WhatsApp notifications for irrigation reminders

## Voice Assistant
See **VOICE_ASSISTANT_GUIDE.md** for detailed information on:
- Supported voice commands in all languages
- Tips for best voice recognition
- Troubleshooting guide
- Privacy and security information

## Credits
Developed for farmers to make data-driven agricultural decisions using AI technology.

**Key Features:**
- Explainable AI for transparent recommendations
- Multi-language support for accessibility
- Voice assistant for hands-free operation
- Detailed irrigation scheduling
- Agricultural dataset integration
- User-friendly interface
