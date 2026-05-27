// Location to Climate Mapping for Indian States
const locationClimateMap = {
    'andhra-pradesh': {
        climate: 'tropical',
        name: { en: 'Andhra Pradesh', te: 'ఆంధ్ర ప్రదేశ్', hi: 'आंध्र प्रदेश' },
        majorCrops: ['rice', 'cotton', 'sugarcane', 'groundnut'],
        rainfall: '900-1200mm',
        temperature: '25-35°C'
    },
    'telangana': {
        climate: 'tropical',
        name: { en: 'Telangana', te: 'తెలంగాణ', hi: 'तेलंगाना' },
        majorCrops: ['rice', 'cotton', 'maize', 'groundnut'],
        rainfall: '800-1100mm',
        temperature: '24-34°C'
    },
    'karnataka': {
        climate: 'tropical',
        name: { en: 'Karnataka', te: 'కర్ణాటక', hi: 'कर्नाटक' },
        majorCrops: ['rice', 'cotton', 'sugarcane', 'maize'],
        rainfall: '600-2000mm',
        temperature: '20-35°C'
    },
    'tamil-nadu': {
        climate: 'tropical',
        name: { en: 'Tamil Nadu', te: 'తమిళనాడు', hi: 'तमिलनाडु' },
        majorCrops: ['rice', 'cotton', 'sugarcane', 'groundnut'],
        rainfall: '800-1400mm',
        temperature: '25-37°C'
    },
    'maharashtra': {
        climate: 'subtropical',
        name: { en: 'Maharashtra', te: 'మహారాష్ట్ర', hi: 'महाराष्ट्र' },
        majorCrops: ['cotton', 'sugarcane', 'wheat', 'rice'],
        rainfall: '400-3000mm',
        temperature: '20-35°C'
    },
    'punjab': {
        climate: 'subtropical',
        name: { en: 'Punjab', te: 'పంజాబ్', hi: 'पंजाब' },
        majorCrops: ['wheat', 'rice', 'maize', 'cotton'],
        rainfall: '400-700mm',
        temperature: '5-40°C'
    },
    'haryana': {
        climate: 'subtropical',
        name: { en: 'Haryana', te: 'హర్యానా', hi: 'हरियाणा' },
        majorCrops: ['wheat', 'rice', 'cotton', 'sugarcane'],
        rainfall: '400-700mm',
        temperature: '5-40°C'
    },
    'uttar-pradesh': {
        climate: 'subtropical',
        name: { en: 'Uttar Pradesh', te: 'ఉత్తర ప్రదేశ్', hi: 'उत्तर प्रदेश' },
        majorCrops: ['wheat', 'rice', 'sugarcane', 'potato'],
        rainfall: '600-1200mm',
        temperature: '5-40°C'
    },
    'madhya-pradesh': {
        climate: 'subtropical',
        name: { en: 'Madhya Pradesh', te: 'మధ్య ప్రదేశ్', hi: 'मध्य प्रदेश' },
        majorCrops: ['wheat', 'rice', 'cotton', 'maize'],
        rainfall: '800-1600mm',
        temperature: '10-42°C'
    },
    'rajasthan': {
        climate: 'arid',
        name: { en: 'Rajasthan', te: 'రాజస్థాన్', hi: 'राजस्थान' },
        majorCrops: ['wheat', 'cotton', 'maize', 'groundnut'],
        rainfall: '100-600mm',
        temperature: '5-45°C'
    },
    'gujarat': {
        climate: 'arid',
        name: { en: 'Gujarat', te: 'గుజరాత్', hi: 'गुजरात' },
        majorCrops: ['cotton', 'groundnut', 'wheat', 'rice'],
        rainfall: '400-1500mm',
        temperature: '15-40°C'
    },
    'west-bengal': {
        climate: 'tropical',
        name: { en: 'West Bengal', te: 'పశ్చిమ బెంగాల్', hi: 'पश्चिम बंगाल' },
        majorCrops: ['rice', 'wheat', 'maize', 'potato'],
        rainfall: '1500-2500mm',
        temperature: '15-35°C'
    },
    'bihar': {
        climate: 'subtropical',
        name: { en: 'Bihar', te: 'బీహార్', hi: 'बिहार' },
        majorCrops: ['rice', 'wheat', 'maize', 'sugarcane'],
        rainfall: '1000-1400mm',
        temperature: '10-40°C'
    },
    'odisha': {
        climate: 'tropical',
        name: { en: 'Odisha', te: 'ఒడిశా', hi: 'ओडिशा' },
        majorCrops: ['rice', 'wheat', 'cotton', 'groundnut'],
        rainfall: '1200-1600mm',
        temperature: '20-35°C'
    },
    'kerala': {
        climate: 'tropical',
        name: { en: 'Kerala', te: 'కేరళ', hi: 'केरल' },
        majorCrops: ['rice', 'coconut', 'rubber', 'spices'],
        rainfall: '2000-3000mm',
        temperature: '25-32°C'
    }
};

// Function to get climate from location
function getClimateFromLocation(location) {
    return locationClimateMap[location]?.climate || null;
}

// Function to get location details
function getLocationDetails(location, language = 'en') {
    const locationData = locationClimateMap[location];
    if (!locationData) return null;
    
    return {
        name: locationData.name[language] || locationData.name.en,
        climate: locationData.climate,
        majorCrops: locationData.majorCrops,
        rainfall: locationData.rainfall,
        temperature: locationData.temperature
    };
}
