# CROPXAI - Functional Requirements Documentation

## 1. USER AUTHENTICATION & MANAGEMENT

### 1.1 User Registration
- **FR-1.1.1**: System shall allow new farmers to create an account
- **FR-1.1.2**: Registration requires: username, email, password, confirmation password, and full name
- **FR-1.1.3**: System shall validate unique username
- **FR-1.1.4**: System shall validate password match with confirmation
- **FR-1.1.5**: User data shall be stored in browser localStorage

### 1.2 User Login
- **FR-1.2.1**: System shall authenticate users with username and password
- **FR-1.2.2**: System shall provide demo account (username: farmer, password: demo123)
- **FR-1.2.3**: System shall display error message for invalid credentials
- **FR-1.2.4**: System shall maintain login session

### 1.3 Password Recovery
- **FR-1.3.1**: System shall allow password reset using username and email
- **FR-1.3.2**: System shall validate username and email match
- **FR-1.3.3**: System shall update password upon successful verification

### 1.4 User Profile
- **FR-1.4.1**: System shall display user profile information (name, username, email)
- **FR-1.4.2**: System shall show profile avatar (👨‍🌾)
- **FR-1.4.3**: System shall allow user logout

---

## 2. MULTI-LANGUAGE SUPPORT

### 2.1 Language Selection
- **FR-2.1.1**: System shall support three languages: English, Telugu (తెలుగు), Hindi (हिंदी)
- **FR-2.1.2**: System shall provide language selector dropdown in header
- **FR-2.1.3**: System shall persist language selection across session

### 2.2 Dynamic Translation
- **FR-2.2.1**: System shall translate all UI text elements based on selected language
- **FR-2.2.2**: System shall translate dropdown options (locations, seasons, soil types, crop types)
- **FR-2.2.3**: System shall translate form labels, buttons, and messages
- **FR-2.2.4**: System shall translate error messages and alerts
- **FR-2.2.5**: System shall translate placeholder text in input fields

---

## 3. CROP RECOMMENDATION ENGINE

### 3.1 Input Parameters
- **FR-3.1.1**: System shall accept climate type (Tropical, Subtropical, Temperate, Arid)
- **FR-3.1.2**: System shall accept farm area in acres (minimum 0.1)
- **FR-3.1.3**: System shall accept season (Kharif/Monsoon, Rabi/Winter, Zaid/Summer)
- **FR-3.1.4**: System shall accept soil type (Clay, Sandy, Loamy, Black, Red, Alluvial)
- **FR-3.1.5**: System shall accept soil pH value (3.0 - 10.0)
- **FR-3.1.6**: System shall accept Nitrogen percentage (0-100%)
- **FR-3.1.7**: System shall accept Phosphorus percentage (0-100%)
- **FR-3.1.8**: System shall accept Potassium percentage (0-100%)

### 3.2 Auto-Detection Features
- **FR-3.2.1**: System shall auto-detect soil pH based on climate and soil type
- **FR-3.2.2**: System shall auto-detect Nitrogen (N) levels
- **FR-3.2.3**: System shall auto-detect Phosphorus (P) levels
- **FR-3.2.4**: System shall auto-detect Potassium (K) levels
- **FR-3.2.5**: Auto-detection requires climate and soil type to be selected first

### 3.3 AI-Powered Analysis
- **FR-3.3.1**: System shall analyze all crops in database against input parameters
- **FR-3.3.2**: System shall calculate compatibility scores for each crop
- **FR-3.3.3**: System shall use explainable AI to provide reasoning
- **FR-3.3.4**: System shall calculate confidence score (0-100%)
- **FR-3.3.5**: System shall rank crops by suitability

### 3.4 Recommendation Output
- **FR-3.4.1**: System shall display best recommended crop prominently
- **FR-3.4.2**: System shall show crop name in selected language
- **FR-3.4.3**: System shall display confidence score with visual progress bar
- **FR-3.4.4**: System shall provide AI explanation for recommendation
- **FR-3.4.5**: System shall show feature importance scores (climate, soil, pH, NPK)
- **FR-3.4.6**: System shall display optimal pH range and comparison with input
- **FR-3.4.7**: System shall show soil nutrient analysis (N, P, K levels)
- **FR-3.4.8**: System shall provide irrigation recommendations
- **FR-3.4.9**: System shall display detailed irrigation schedule by growth stage
- **FR-3.4.10**: System shall recommend fertilizers
- **FR-3.4.11**: System shall show NPK requirements and comparison with input
- **FR-3.4.12**: System shall provide cultivation tips and warnings

---

## 4. VOICE ASSISTANT

### 4.1 Voice Input
- **FR-4.1.1**: System shall support voice commands via microphone
- **FR-4.1.2**: System shall recognize voice in English, Telugu, and Hindi
- **FR-4.1.3**: System shall display voice transcription in real-time
- **FR-4.1.4**: System shall show listening status indicator

### 4.2 Voice Commands
- **FR-4.2.1**: System shall process "recommend crop" command
- **FR-4.2.2**: System shall process "show profile" command
- **FR-4.2.3**: System shall process "auto detect" command for soil parameters
- **FR-4.2.4**: System shall process "help" command to show available commands
- **FR-4.2.5**: System shall provide feedback for unrecognized commands

### 4.3 Text-to-Speech (Read Aloud)
- **FR-4.3.1**: System shall read crop recommendations aloud
- **FR-4.3.2**: System shall support speech in English, Telugu, and Hindi
- **FR-4.3.3**: System shall use appropriate voice for selected language
- **FR-4.3.4**: System shall read: location, best crop, confidence score, alternatives
- **FR-4.3.5**: System shall provide stop/pause control
- **FR-4.3.6**: System shall show visual indicator when reading (pulsing button)
- **FR-4.3.7**: System shall use romanized Telugu for better pronunciation

---

## 5. CROP INSURANCE (PMFBY)

### 5.1 Insurance Information
- **FR-5.1.1**: System shall display Pradhan Mantri Fasal Bima Yojana information
- **FR-5.1.2**: System shall show insurance benefits and coverage details
- **FR-5.1.3**: System shall explain premium rates and government subsidy
- **FR-5.1.4**: System shall provide scheme description in selected language

### 5.2 Insurance Application Form

#### 5.2.1 Personal Details
- **FR-5.2.1.1**: System shall collect farmer name
- **FR-5.2.1.2**: System shall collect phone number (10 digits)
- **FR-5.2.1.3**: System shall collect Aadhar number (12 digits with auto-formatting)
- **FR-5.2.1.4**: System shall validate Aadhar format (XXXX XXXX XXXX)
- **FR-5.2.1.5**: System shall provide real-time visual feedback (green/red border)

#### 5.2.2 Farm Details
- **FR-5.2.2.1**: System shall collect state/location from 15 Indian states
- **FR-5.2.2.2**: System shall collect farm area in acres
- **FR-5.2.2.3**: System shall collect crop to insure (8 major crops)
- **FR-5.2.2.4**: System shall collect season (Kharif, Rabi, Zaid)
- **FR-5.2.2.5**: System shall collect sum insured amount (minimum ₹10,000)

#### 5.2.3 Identity Proof Details
- **FR-5.2.3.1**: System shall collect ID proof type (Aadhar, PAN, Voter ID, Driving License, Passport)
- **FR-5.2.3.2**: System shall collect ID proof number
- **FR-5.2.3.3**: System shall collect father's/husband's name
- **FR-5.2.3.4**: System shall collect date of birth

#### 5.2.4 Bank Account Details
- **FR-5.2.4.1**: System shall collect bank name
- **FR-5.2.4.2**: System shall collect branch name
- **FR-5.2.4.3**: System shall collect account number (9-18 digits)
- **FR-5.2.4.4**: System shall collect IFSC code with validation (format: XXXX0XXXXXX)
- **FR-5.2.4.5**: System shall collect account holder name
- **FR-5.2.4.6**: System shall provide IFSC format example

#### 5.2.5 Land Ownership Details
- **FR-5.2.5.1**: System shall collect land ownership type (Owned, Leased, Sharecropper, Tenant)
- **FR-5.2.5.2**: System shall collect survey/khasra number
- **FR-5.2.5.3**: System shall collect village/town name
- **FR-5.2.5.4**: System shall collect district name
- **FR-5.2.5.5**: System shall collect total land area in acres
- **FR-5.2.5.6**: System shall collect irrigation type (Irrigated, Rainfed, Mixed)
- **FR-5.2.5.7**: System shall collect land document number

### 5.3 Premium Calculator
- **FR-5.3.1**: System shall calculate premium based on sum insured and crop type
- **FR-5.3.2**: System shall apply correct premium rates:
  - Kharif crops: 1.5%
  - Rabi crops: 2%
  - Commercial/Horticultural: 5%
- **FR-5.3.3**: System shall display premium in Indian Rupee format
- **FR-5.3.4**: System shall update premium in real-time when inputs change

### 5.4 Form Navigation & Usability
- **FR-5.4.1**: System shall provide scrollable modal for long form
- **FR-5.4.2**: System shall provide "Back to Top" button
- **FR-5.4.3**: System shall provide "View Benefits & Information" button
- **FR-5.4.4**: System shall provide "Scroll to Submit" button
- **FR-5.4.5**: System shall provide "Close" button
- **FR-5.4.6**: System shall show scroll-down indicator at form start
- **FR-5.4.7**: System shall hide scroll indicator after user scrolls
- **FR-5.4.8**: System shall highlight submit button when scrolled to

### 5.5 Form Submission
- **FR-5.5.1**: System shall validate all required fields before submission
- **FR-5.5.2**: System shall validate Aadhar number (exactly 12 digits)
- **FR-5.5.3**: System shall show error messages in selected language
- **FR-5.5.4**: System shall save application data to localStorage
- **FR-5.5.5**: System shall display success message with next steps
- **FR-5.5.6**: System shall announce success via voice in selected language
- **FR-5.5.7**: System shall reset form after successful submission

---

## 6. INFORMATION & HELP SYSTEM

### 6.1 Soil pH Information
- **FR-6.1.1**: System shall provide pH information modal
- **FR-6.1.2**: System shall explain pH scale and importance
- **FR-6.1.3**: System shall show pH ranges and classifications
- **FR-6.1.4**: System shall list suitable crops for each pH range

### 6.2 NPK Nutrients Information
- **FR-6.2.1**: System shall provide NPK information modal
- **FR-6.2.2**: System shall explain function of each nutrient
- **FR-6.2.3**: System shall describe deficiency signs
- **FR-6.2.4**: System shall show optimal nutrient ranges

---

## 7. DATA MANAGEMENT

### 7.1 Local Storage
- **FR-7.1.1**: System shall store user accounts in localStorage
- **FR-7.1.2**: System shall store insurance applications in localStorage
- **FR-7.1.3**: System shall persist login session
- **FR-7.1.4**: System shall maintain language preference

### 7.2 Crop Database
- **FR-7.2.1**: System shall maintain comprehensive crop database
- **FR-7.2.2**: Database shall include: Rice, Wheat, Maize, Cotton, Sugarcane, Groundnut, Chickpea, Soybean, and more
- **FR-7.2.3**: Each crop shall have: name (3 languages), climate requirements, soil preferences, pH range, NPK requirements, irrigation needs, fertilizer recommendations, irrigation schedule

### 7.3 Soil Database
- **FR-7.3.1**: System shall maintain soil parameter database
- **FR-7.3.2**: Database shall map climate and soil type to typical NPK values
- **FR-7.3.3**: Database shall provide pH ranges for soil types

---

## 8. USER INTERFACE REQUIREMENTS

### 8.1 Responsive Design
- **FR-8.1.1**: System shall be responsive for desktop, tablet, and mobile
- **FR-8.1.2**: System shall adapt layout for different screen sizes
- **FR-8.1.3**: System shall provide touch-friendly controls on mobile

### 8.2 Visual Feedback
- **FR-8.2.1**: System shall provide hover effects on buttons
- **FR-8.2.2**: System shall show loading/processing indicators
- **FR-8.2.3**: System shall use color coding (green=valid, red=invalid)
- **FR-8.2.4**: System shall provide smooth animations and transitions
- **FR-8.2.5**: System shall show progress bars for confidence scores

### 8.3 Accessibility
- **FR-8.3.1**: System shall support keyboard navigation
- **FR-8.3.2**: System shall provide voice input/output
- **FR-8.3.3**: System shall use clear, readable fonts
- **FR-8.3.4**: System shall provide sufficient color contrast
- **FR-8.3.5**: System shall support screen readers (basic)

### 8.4 Modal Management
- **FR-8.4.1**: System shall prevent body scroll when modal is open
- **FR-8.4.2**: System shall restore body scroll when modal closes
- **FR-8.4.3**: System shall allow modal close via X button, close button, or backdrop click
- **FR-8.4.4**: System shall support scrolling within modal content

---

## 9. VALIDATION & ERROR HANDLING

### 9.1 Input Validation
- **FR-9.1.1**: System shall validate required fields
- **FR-9.1.2**: System shall validate numeric ranges
- **FR-9.1.3**: System shall validate phone number format (10 digits)
- **FR-9.1.4**: System shall validate Aadhar format (12 digits)
- **FR-9.1.5**: System shall validate IFSC code format
- **FR-9.1.6**: System shall validate email format
- **FR-9.1.7**: System shall validate password match

### 9.2 Error Messages
- **FR-9.2.1**: System shall display clear error messages
- **FR-9.2.2**: System shall show errors in selected language
- **FR-9.2.3**: System shall focus invalid fields
- **FR-9.2.4**: System shall prevent form submission with invalid data

---

## 10. PERFORMANCE REQUIREMENTS

### 10.1 Response Time
- **FR-10.1.1**: Crop recommendation shall complete within 2 seconds
- **FR-10.1.2**: Language switching shall be instantaneous
- **FR-10.1.3**: Form validation shall provide immediate feedback
- **FR-10.1.4**: Auto-formatting shall occur in real-time

### 10.2 Browser Compatibility
- **FR-10.2.1**: System shall work on Chrome/Edge (Chromium)
- **FR-10.2.2**: System shall work on Firefox
- **FR-10.2.3**: System shall work on Safari
- **FR-10.2.4**: System shall work on mobile browsers

---

## SUMMARY STATISTICS

**Total Functional Requirements**: 150+

### By Category:
- User Authentication: 13 requirements
- Multi-Language: 5 requirements
- Crop Recommendation: 28 requirements
- Voice Assistant: 13 requirements
- Crop Insurance: 45 requirements
- Information System: 6 requirements
- Data Management: 8 requirements
- User Interface: 16 requirements
- Validation: 9 requirements
- Performance: 7 requirements

### Priority Breakdown:
- **Critical (P0)**: User Authentication, Crop Recommendation, Form Validation
- **High (P1)**: Multi-Language, Insurance Application, Voice Assistant
- **Medium (P2)**: Auto-Detection, Information Modals, Visual Feedback
- **Low (P3)**: Advanced Voice Commands, Additional Animations
