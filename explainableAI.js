// Explainable AI module for crop recommendation
class ExplainableAI {
    constructor() {
        this.featureWeights = {
            climate: 0.30,
            season: 0.25,
            soilType: 0.25,
            ph: 0.10,
            nitrogen: 0.03,
            phosphorus: 0.03,
            potassium: 0.04
        };
    }

    calculateFeatureScores(inputs, crop) {
        const scores = {};
        
        // Climate match
        scores.climate = crop.climate.includes(inputs.climate) ? 100 : 0;
        
        // Season match
        scores.season = crop.season.includes(inputs.season) ? 100 : 0;
        
        // Soil type match
        scores.soilType = crop.soilType.includes(inputs.soilType) ? 100 : 0;
        
        // pH compatibility (0-100 scale)
        if (inputs.soilPh >= crop.phRange[0] && inputs.soilPh <= crop.phRange[1]) {
            scores.ph = 100;
        } else {
            const phDiff = Math.min(
                Math.abs(inputs.soilPh - crop.phRange[0]),
                Math.abs(inputs.soilPh - crop.phRange[1])
            );
            scores.ph = Math.max(0, 100 - (phDiff * 20));
        }
        
        // NPK compatibility
        scores.nitrogen = this.calculateNutrientScore(inputs.nitrogen, crop.npk.n);
        scores.phosphorus = this.calculateNutrientScore(inputs.phosphorus, crop.npk.p);
        scores.potassium = this.calculateNutrientScore(inputs.potassium, crop.npk.k);
        
        return scores;
    }

    calculateNutrientScore(value, range) {
        if (value >= range[0] && value <= range[1]) {
            return 100;
        } else if (value < range[0]) {
            const diff = range[0] - value;
            return Math.max(0, 100 - (diff * 2));
        } else {
            const diff = value - range[1];
            return Math.max(0, 100 - (diff * 1.5));
        }
    }

    calculateConfidence(scores) {
        let totalScore = 0;
        for (const [feature, score] of Object.entries(scores)) {
            totalScore += score * this.featureWeights[feature];
        }
        return Math.round(totalScore);
    }

    generateExplanation(inputs, crop, scores, confidence, language = 'en') {
        const explanations = {
            en: {
                high: "Excellent match! This crop is highly suitable for your conditions.",
                medium: "Good match. This crop should perform well with proper care.",
                low: "Moderate match. Consider soil amendments for better results."
            },
            te: {
                high: "అద్భుతమైన మ్యాచ్! ఈ పంట మీ పరిస్థితులకు చాలా అనువైనది.",
                medium: "మంచి మ్యాచ్. సరైన సంరక్షణతో ఈ పంట బాగా పనిచేస్తుంది.",
                low: "మితమైన మ్యాచ్. మెరుగైన ఫలితాల కోసం నేల సవరణలను పరిగణించండి."
            },
            hi: {
                high: "उत्कृष्ट मेल! यह फसल आपकी स्थितियों के लिए अत्यधिक उपयुक्त है।",
                medium: "अच्छा मेल। उचित देखभाल के साथ यह फसल अच्छा प्रदर्शन करेगी।",
                low: "मध्यम मेल। बेहतर परिणामों के लिए मिट्टी संशोधन पर विचार करें।"
            }
        };

        let level = 'low';
        if (confidence >= 80) level = 'high';
        else if (confidence >= 60) level = 'medium';

        return {
            summary: explanations[language][level],
            confidence: confidence,
            featureScores: scores,
            recommendations: this.generateRecommendations(scores, inputs, crop, language)
        };
    }


    generateRecommendations(scores, inputs, crop, language) {
        const recommendations = [];
        
        const messages = {
            en: {
                ph: "Consider adjusting soil pH to optimal range",
                nitrogen: "Nitrogen levels need adjustment",
                phosphorus: "Phosphorus supplementation recommended",
                potassium: "Potassium levels should be improved"
            },
            te: {
                ph: "నేల pH ను అనుకూల పరిధికి సర్దుబాటు చేయడాన్ని పరిగణించండి",
                nitrogen: "నత్రజని స్థాయిలకు సర్దుబాటు అవసరం",
                phosphorus: "భాస్వరం అనుబంధం సిఫార్సు చేయబడింది",
                potassium: "పొటాషియం స్థాయిలను మెరుగుపరచాలి"
            },
            hi: {
                ph: "मिट्टी pH को इष्टतम सीमा में समायोजित करने पर विचार करें",
                nitrogen: "नाइट्रोजन स्तर को समायोजन की आवश्यकता है",
                phosphorus: "फास्फोरस पूरकता की सिफारिश की जाती है",
                potassium: "पोटेशियम स्तर में सुधार किया जाना चाहिए"
            }
        };

        if (scores.ph < 80) recommendations.push(messages[language].ph);
        if (scores.nitrogen < 70) recommendations.push(messages[language].nitrogen);
        if (scores.phosphorus < 70) recommendations.push(messages[language].phosphorus);
        if (scores.potassium < 70) recommendations.push(messages[language].potassium);

        return recommendations;
    }

    analyzeAllCrops(inputs, cropDatabase) {
        const results = [];
        
        for (const [cropKey, crop] of Object.entries(cropDatabase)) {
            const scores = this.calculateFeatureScores(inputs, crop);
            const confidence = this.calculateConfidence(scores);
            
            results.push({
                cropKey,
                crop,
                scores,
                confidence
            });
        }
        
        // Sort by confidence
        results.sort((a, b) => b.confidence - a.confidence);
        
        return results;
    }
}

const explainableAI = new ExplainableAI();
