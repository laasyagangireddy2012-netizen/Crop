# CROPXAI API Documentation

## Base URL
```
Development: http://localhost:3000/api
Production: https://your-domain.com/api
```

## Authentication
Most endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## 📋 Table of Contents
1. [Authentication Endpoints](#authentication-endpoints)
2. [Crop Endpoints](#crop-endpoints)
3. [Soil Endpoints](#soil-endpoints)
4. [Recommendation Endpoints](#recommendation-endpoints)
5. [Error Responses](#error-responses)

---

## Authentication Endpoints

### 1. Register User
Create a new user account.

**Endpoint:** `POST /api/auth/register`

**Request Body:**
```json
{
  "username": "farmer123",
  "email": "farmer@example.com",
  "password": "securePassword123",
  "name": "John Farmer"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "username": "farmer123",
      "email": "farmer@example.com",
      "name": "John Farmer"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "User already exists with this email or username"
}
```

---

### 2. Login User
Authenticate and receive JWT token.

**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "username": "farmer123",
  "password": "securePassword123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "username": "farmer123",
      "email": "farmer@example.com",
      "name": "John Farmer"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

---

### 3. Reset Password
Reset user password.

**Endpoint:** `POST /api/auth/reset-password`

**Request Body:**
```json
{
  "username": "farmer123",
  "email": "farmer@example.com",
  "newPassword": "newSecurePassword456"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "User not found with provided credentials"
}
```

---

## Crop Endpoints

### 1. Get All Crops
Retrieve list of all available crops.

**Endpoint:** `GET /api/crops?language=en`

**Query Parameters:**
- `language` (optional): Language code (en, te, hi). Default: en

**Success Response (200):**
```json
{
  "success": true,
  "count": 8,
  "data": [
    {
      "id": "rice",
      "name": "Rice",
      "climate": ["tropical", "subtropical"],
      "season": ["kharif"],
      "soilType": ["clay", "loamy", "alluvial"],
      "phRange": [5.5, 7.0]
    },
    {
      "id": "wheat",
      "name": "Wheat",
      "climate": ["temperate", "subtropical"],
      "season": ["rabi"],
      "soilType": ["loamy", "clay", "alluvial"],
      "phRange": [6.0, 7.5]
    }
    // ... more crops
  ]
}
```

---

### 2. Get Single Crop Details
Retrieve detailed information about a specific crop.

**Endpoint:** `GET /api/crops/:cropId?language=en`

**Path Parameters:**
- `cropId`: Crop identifier (rice, wheat, cotton, etc.)

**Query Parameters:**
- `language` (optional): Language code (en, te, hi). Default: en

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "rice",
    "name": "Rice",
    "climate": ["tropical", "subtropical"],
    "season": ["kharif"],
    "soilType": ["clay", "loamy", "alluvial"],
    "phRange": [5.5, 7.0],
    "npk": {
      "n": [80, 120],
      "p": [40, 60],
      "k": [40, 60]
    },
    "irrigation": "Flood irrigation or drip irrigation. Requires 1200-1500mm water annually.",
    "irrigationSchedule": [
      {
        "stage": "Land Preparation",
        "days": "0-7",
        "frequency": "Continuous flooding",
        "depth": "5-7 cm"
      }
      // ... more stages
    ],
    "fertilizers": "Urea (N), Single Super Phosphate (P), Muriate of Potash (K). Apply in split doses.",
    "explanation": "Ideal for your climate and soil. High market demand with good yield potential."
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Crop not found"
}
```

---

### 3. Get Irrigation Schedule
Retrieve irrigation schedule for a specific crop.

**Endpoint:** `GET /api/crops/:cropId/irrigation-schedule?language=en`

**Path Parameters:**
- `cropId`: Crop identifier

**Query Parameters:**
- `language` (optional): Language code. Default: en

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "cropName": "Rice",
    "schedule": [
      {
        "stage": "Land Preparation",
        "days": "0-7",
        "frequency": "Continuous flooding",
        "depth": "5-7 cm"
      },
      {
        "stage": "Transplanting",
        "days": "7-10",
        "frequency": "Daily",
        "depth": "2-3 cm"
      }
      // ... more stages
    ]
  }
}
```

---

## Soil Endpoints

### 1. Auto-Detect Soil Parameters
Automatically detect soil parameters based on climate and soil type.

**Endpoint:** `POST /api/soil/auto-detect`

**Request Body:**
```json
{
  "climate": "tropical",
  "soilType": "loamy"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "ph": 6.8,
    "nitrogen": 60.0,
    "phosphorus": 50.0,
    "potassium": 55.0,
    "ranges": {
      "ph": [6.5, 7.5],
      "nitrogen": [50, 70],
      "phosphorus": [40, 60],
      "potassium": [45, 65]
    }
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Climate and soil type are required"
}
```

---

### 2. Analyze Soil Nutrients
Get detailed analysis of soil nutrient levels.

**Endpoint:** `POST /api/soil/analysis`

**Request Body:**
```json
{
  "nitrogen": 55.0,
  "phosphorus": 45.0,
  "potassium": 50.0,
  "language": "en"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "nitrogen": {
      "value": 55.0,
      "level": "high",
      "analysis": "Good nitrogen levels. Suitable for most crops."
    },
    "phosphorus": {
      "value": 45.0,
      "level": "high",
      "analysis": "Good phosphorus levels. Supports root development."
    },
    "potassium": {
      "value": 50.0,
      "level": "high",
      "analysis": "Good potassium for disease resistance."
    }
  }
}
```

---

### 3. Get pH Information
Retrieve pH classification and recommendations.

**Endpoint:** `GET /api/soil/ph-info`

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "ranges": [
      {
        "range": "3.5-5.5",
        "classification": "Strongly Acidic",
        "crops": "Tea, Potato, Blueberry"
      },
      {
        "range": "5.5-6.5",
        "classification": "Slightly Acidic",
        "crops": "Rice, Wheat, Maize"
      }
      // ... more ranges
    ],
    "bysoilType": {
      "clay": { "typical": 6.5, "range": [6.0, 7.5] },
      "sandy": { "typical": 6.0, "range": [5.5, 6.8] }
      // ... more soil types
    }
  }
}
```

---

## Recommendation Endpoints

### 1. Get Crop Recommendation
Get AI-powered crop recommendation based on farm parameters.

**Endpoint:** `POST /api/recommendations`

**Request Body:**
```json
{
  "inputs": {
    "climate": "tropical",
    "area": 5.0,
    "season": "kharif",
    "soilType": "loamy",
    "soilPh": 6.8,
    "nitrogen": 60.0,
    "phosphorus": 50.0,
    "potassium": 55.0
  },
  "language": "en",
  "userId": "507f1f77bcf86cd799439011"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "crop": {
      "id": "rice",
      "name": "Rice",
      "climate": ["tropical", "subtropical"],
      "season": ["kharif"],
      "soilType": ["clay", "loamy", "alluvial"],
      "phRange": [5.5, 7.0],
      "npk": {
        "n": [80, 120],
        "p": [40, 60],
        "k": [40, 60]
      },
      "irrigation": "Flood irrigation or drip irrigation...",
      "irrigationSchedule": [
        // ... schedule array
      ],
      "fertilizers": "Urea (N), Single Super Phosphate (P)...",
      "explanation": "Ideal for your climate and soil..."
    },
    "aiAnalysis": {
      "confidence": 85,
      "featureScores": {
        "climate": 100,
        "season": 100,
        "soilType": 100,
        "ph": 90,
        "nitrogen": 70,
        "phosphorus": 75,
        "potassium": 80
      },
      "explanation": "Excellent match! This crop is highly suitable for your conditions.",
      "recommendations": [
        "Consider adjusting soil pH to optimal range"
      ]
    },
    "alternativeCrops": [
      {
        "id": "maize",
        "name": "Maize",
        "confidence": 78
      },
      {
        "id": "sugarcane",
        "name": "Sugarcane",
        "confidence": 72
      }
    ]
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Missing required fields: climate, soilPh"
}
```

---

### 2. Get Recommendation History
Retrieve user's past recommendations.

**Endpoint:** `GET /api/recommendations/history/:userId?limit=10&page=1`

**Path Parameters:**
- `userId`: User ID

**Query Parameters:**
- `limit` (optional): Number of results per page. Default: 10
- `page` (optional): Page number. Default: 1

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "recommendations": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "userId": "507f1f77bcf86cd799439012",
        "inputs": {
          "climate": "tropical",
          "area": 5.0,
          "season": "kharif",
          "soilType": "loamy",
          "soilPh": 6.8,
          "nitrogen": 60.0,
          "phosphorus": 50.0,
          "potassium": 55.0
        },
        "recommendation": {
          "cropName": "rice",
          "confidence": 85,
          "featureScores": {},
          "explanation": "Excellent match..."
        },
        "createdAt": "2024-01-15T10:30:00.000Z"
      }
      // ... more recommendations
    ],
    "pagination": {
      "total": 25,
      "page": 1,
      "pages": 3
    }
  }
}
```

---

## Error Responses

### Standard Error Format
All error responses follow this format:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message (development only)"
}
```

### HTTP Status Codes

| Code | Meaning | Description |
|------|---------|-------------|
| 200 | OK | Request successful |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid request parameters |
| 401 | Unauthorized | Authentication required or failed |
| 404 | Not Found | Resource not found |
| 500 | Internal Server Error | Server error occurred |

---

## Rate Limiting

API requests are rate-limited to prevent abuse:
- **Window:** 15 minutes
- **Max Requests:** 100 per window
- **Headers:**
  - `X-RateLimit-Limit`: Maximum requests allowed
  - `X-RateLimit-Remaining`: Remaining requests
  - `X-RateLimit-Reset`: Time when limit resets

**Rate Limit Exceeded Response (429):**
```json
{
  "success": false,
  "message": "Too many requests, please try again later"
}
```

---

## Example Usage

### Using cURL

**Register User:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "farmer123",
    "email": "farmer@example.com",
    "password": "securePassword123",
    "name": "John Farmer"
  }'
```

**Get Crop Recommendation:**
```bash
curl -X POST http://localhost:3000/api/recommendations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "inputs": {
      "climate": "tropical",
      "area": 5.0,
      "season": "kharif",
      "soilType": "loamy",
      "soilPh": 6.8,
      "nitrogen": 60.0,
      "phosphorus": 50.0,
      "potassium": 55.0
    },
    "language": "en"
  }'
```

### Using JavaScript (Fetch API)

```javascript
// Register User
const registerUser = async () => {
  const response = await fetch('http://localhost:3000/api/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username: 'farmer123',
      email: 'farmer@example.com',
      password: 'securePassword123',
      name: 'John Farmer'
    })
  });
  
  const data = await response.json();
  return data;
};

// Get Recommendation
const getRecommendation = async (token, inputs) => {
  const response = await fetch('http://localhost:3000/api/recommendations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      inputs,
      language: 'en'
    })
  });
  
  const data = await response.json();
  return data;
};
```

---

## Postman Collection

Import this collection into Postman for easy API testing:

```json
{
  "info": {
    "name": "CROPXAI API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Authentication",
      "item": [
        {
          "name": "Register",
          "request": {
            "method": "POST",
            "url": "{{baseUrl}}/api/auth/register",
            "body": {
              "mode": "raw",
              "raw": "{\n  \"username\": \"farmer123\",\n  \"email\": \"farmer@example.com\",\n  \"password\": \"securePassword123\",\n  \"name\": \"John Farmer\"\n}"
            }
          }
        }
      ]
    }
  ],
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:3000"
    }
  ]
}
```

---

**CROPXAI API - Complete, Documented, Ready to Use** 🚀
