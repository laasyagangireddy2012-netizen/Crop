// Agricultural dataset for soil parameters based on Indian soil types and climate zones
const soilDataset = {
    // pH values by soil type (based on agricultural research)
    phBysoilType: {
        clay: { typical: 6.5, range: [6.0, 7.5] },
        sandy: { typical: 6.0, range: [5.5, 6.8] },
        loamy: { typical: 6.8, range: [6.5, 7.5] },
        black: { typical: 7.5, range: [7.0, 8.5] },
        red: { typical: 6.2, range: [5.5, 7.0] },
        alluvial: { typical: 7.0, range: [6.5, 7.8] }
    },

    // NPK values by soil type and climate (percentage ranges)
    npkByContext: {
        tropical: {
            clay: { n: [40, 60], p: [30, 50], k: [35, 55] },
            sandy: { n: [20, 35], p: [15, 30], k: [20, 40] },
            loamy: { n: [50, 70], p: [40, 60], k: [45, 65] },
            black: { n: [45, 65], p: [35, 55], k: [40, 60] },
            red: { n: [30, 50], p: [25, 45], k: [30, 50] },
            alluvial: { n: [55, 75], p: [45, 65], k: [50, 70] }
        },
        subtropical: {
            clay: { n: [45, 65], p: [35, 55], k: [40, 60] },
            sandy: { n: [25, 40], p: [20, 35], k: [25, 45] },
            loamy: { n: [55, 75], p: [45, 65], k: [50, 70] },
            black: { n: [50, 70], p: [40, 60], k: [45, 65] },
            red: { n: [35, 55], p: [30, 50], k: [35, 55] },
            alluvial: { n: [60, 80], p: [50, 70], k: [55, 75] }
        },
        temperate: {
            clay: { n: [50, 70], p: [40, 60], k: [45, 65] },
            sandy: { n: [30, 45], p: [25, 40], k: [30, 50] },
            loamy: { n: [60, 80], p: [50, 70], k: [55, 75] },
            black: { n: [55, 75], p: [45, 65], k: [50, 70] },
            red: { n: [40, 60], p: [35, 55], k: [40, 60] },
            alluvial: { n: [65, 85], p: [55, 75], k: [60, 80] }
        },
        arid: {
            clay: { n: [35, 55], p: [25, 45], k: [30, 50] },
            sandy: { n: [15, 30], p: [10, 25], k: [15, 35] },
            loamy: { n: [40, 60], p: [30, 50], k: [35, 55] },
            black: { n: [40, 60], p: [30, 50], k: [35, 55] },
            red: { n: [25, 45], p: [20, 40], k: [25, 45] },
            alluvial: { n: [45, 65], p: [35, 55], k: [40, 60] }
        }
    },

    // Soil nutrient descriptions
    nutrientInfo: {
        en: {
            nitrogen: {
                low: "Low nitrogen levels. Consider adding urea or organic compost.",
                medium: "Moderate nitrogen levels. Maintain with balanced fertilization.",
                high: "Good nitrogen levels. Suitable for most crops.",
                veryHigh: "Very high nitrogen. May need to balance with other nutrients."
            },
            phosphorus: {
                low: "Low phosphorus. Add single super phosphate or DAP.",
                medium: "Adequate phosphorus for most crops.",
                high: "Good phosphorus levels. Supports root development.",
                veryHigh: "Excellent phosphorus content."
            },
            potassium: {
                low: "Low potassium. Apply muriate of potash.",
                medium: "Moderate potassium levels.",
                high: "Good potassium for disease resistance.",
                veryHigh: "Excellent potassium content."
            }
        }
,
        te: {
            nitrogen: {
                low: "తక్కువ నత్రజని స్థాయిలు. యూరియా లేదా సేంద్రీయ కంపోస్ట్ జోడించడాన్ని పరిగణించండి.",
                medium: "మితమైన నత్రజని స్థాయిలు. సమతుల్య ఎరువుతో నిర్వహించండి.",
                high: "మంచి నత్రజని స్థాయిలు. చాలా పంటలకు అనువైనది.",
                veryHigh: "చాలా అధిక నత్రజని. ఇతర పోషకాలతో సమతుల్యం చేయాల్సి ఉండవచ్చు."
            },
            phosphorus: {
                low: "తక్కువ భాస్వరం. సింగిల్ సూపర్ ఫాస్ఫేట్ లేదా DAP జోడించండి.",
                medium: "చాలా పంటలకు తగినంత భాస్వరం.",
                high: "మంచి భాస్వరం స్థాయిలు. వేరు అభివృద్ధికి మద్దతు ఇస్తుంది.",
                veryHigh: "అద్భుతమైన భాస్వరం కంటెంట్."
            },
            potassium: {
                low: "తక్కువ పొటాషియం. మ్యూరియేట్ ఆఫ్ పొటాష్ వర్తించండి.",
                medium: "మితమైన పొటాషియం స్థాయిలు.",
                high: "వ్యాధి నిరోధకత కోసం మంచి పొటాషియం.",
                veryHigh: "అద్భుతమైన పొటాషియం కంటెంట్."
            }
        },
        hi: {
            nitrogen: {
                low: "कम नाइट्रोजन स्तर। यूरिया या जैविक खाद जोड़ने पर विचार करें।",
                medium: "मध्यम नाइट्रोजन स्तर। संतुलित उर्वरक के साथ बनाए रखें।",
                high: "अच्छा नाइट्रोजन स्तर। अधिकांश फसलों के लिए उपयुक्त।",
                veryHigh: "बहुत उच्च नाइट्रोजन। अन्य पोषक तत्वों के साथ संतुलन की आवश्यकता हो सकती है।"
            },
            phosphorus: {
                low: "कम फास्फोरस। सिंगल सुपर फॉस्फेट या DAP जोड़ें।",
                medium: "अधिकांश फसलों के लिए पर्याप्त फास्फोरस।",
                high: "अच्छा फास्फोरस स्तर। जड़ विकास का समर्थन करता है।",
                veryHigh: "उत्कृष्ट फास्फोरस सामग्री।"
            },
            potassium: {
                low: "कम पोटेशियम। म्यूरेट ऑफ पोटाश लागू करें।",
                medium: "मध्यम पोटेशियम स्तर।",
                high: "रोग प्रतिरोध के लिए अच्छा पोटेशियम।",
                veryHigh: "उत्कृष्ट पोटेशियम सामग्री।"
            }
        }
    }
};

function autoDetectSoilParameters(climate, soilType) {
    const phData = soilDataset.phBysoilType[soilType];
    const npkData = soilDataset.npkByContext[climate]?.[soilType];

    if (!phData || !npkData) {
        return null;
    }

    return {
        ph: phData.typical,
        nitrogen: (npkData.n[0] + npkData.n[1]) / 2,
        phosphorus: (npkData.p[0] + npkData.p[1]) / 2,
        potassium: (npkData.k[0] + npkData.k[1]) / 2
    };
}

function getNutrientLevel(value) {
    if (value < 20) return 'low';
    if (value < 40) return 'medium';
    if (value < 60) return 'high';
    return 'veryHigh';
}

function getSoilAnalysis(nitrogen, phosphorus, potassium, language = 'en') {
    const info = soilDataset.nutrientInfo[language];
    return {
        nitrogen: info.nitrogen[getNutrientLevel(nitrogen)],
        phosphorus: info.phosphorus[getNutrientLevel(phosphorus)],
        potassium: info.potassium[getNutrientLevel(potassium)]
    };
}
