// Recommendation Routes
const express = require('express');
const router = express.Router();
const {ExplainableAI} = require('../services/explainableAI');
const cropDatabase = require('../data/cropDatabase');
const Recommendation = require('../models/Recommendation');

const aiEngine = new ExplainableAI();

// @route   POST /api/recommendations
// @desc    Get crop recommendation
// @access  Public
router.post('/', async (req, res) => {
    try {
        const { inputs, language = 'en', userId } = req.body;

        // Validate inputs
        const requiredFields = ['climate', 'area', 'season', 'soilType', 'soilPh', 'nitrogen', 'phosphorus', 'potassium'];
        const missingFields = requiredFields.filter(field => inputs[field] === undefined);
        
        if (missingFields.length > 0) {
            return res.status(400).json({ 
                success: false,
                message: `Missing required fields: ${missingFields.join(', ')}` 
            });
        }

        // Get AI analysis
        const results = aiEngine.analyzeAllCrops(inputs, cropDatabase);
        const bestMatch = results[0];

        if (!bestMatch) {
            return res.status(404).json({ 
                success: false,
                message: 'No suitable crop found for given conditions' 
            });
        }

        // Generate explanation
        const explanation = aiEngine.generateExplanation(
            inputs,
            bestMatch.crop,
            bestMatch.scores,
            bestMatch.confidence,
            language
        );

        // Prepare response data
        const responseData = {
            crop: {
                id: bestMatch.cropKey,
                name: bestMatch.crop.name[language] || bestMatch.crop.name.en,
                climate: bestMatch.crop.climate,
                season: bestMatch.crop.season,
                soilType: bestMatch.crop.soilType,
                phRange: bestMatch.crop.phRange,
                npk: bestMatch.crop.npk,
                irrigation: bestMatch.crop.irrigation[language] || bestMatch.crop.irrigation.en,
                irrigationSchedule: bestMatch.crop.irrigationSchedule[language] || bestMatch.crop.irrigationSchedule.en,
                fertilizers: bestMatch.crop.fertilizers[language] || bestMatch.crop.fertilizers.en,
                explanation: bestMatch.crop.explanation[language] || bestMatch.crop.explanation.en
            },
            aiAnalysis: {
                confidence: bestMatch.confidence,
                featureScores: Object.fromEntries(bestMatch.scores),
                explanation: explanation.summary,
                recommendations: explanation.recommendations
            },
            alternativeCrops: results.slice(1, 4).map(result => ({
                id: result.cropKey,
                name: result.crop.name[language] || result.crop.name.en,
                confidence: result.confidence
            }))
        };

        // Save recommendation to database if userId provided
        if (userId) {
            try {
                await Recommendation.create({
                    userId,
                    inputs,
                    recommendation: {
                        cropName: bestMatch.cropKey,
                        confidence: bestMatch.confidence,
                        featureScores: bestMatch.scores,
                        explanation: explanation.summary
                    }
                });
            } catch (dbError) {
                console.error('Error saving recommendation:', dbError);
                // Continue even if save fails
            }
        }

        res.json({
            success: true,
            data: responseData
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Error generating recommendation',
            error: error.message 
        });
    }
});

// @route   GET /api/recommendations/history/:userId
// @desc    Get user's recommendation history
// @access  Private
router.get('/history/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const { limit = 10, page = 1 } = req.query;

        const recommendations = await Recommendation.find({ userId })
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit));

        const total = await Recommendation.countDocuments({ userId });

        res.json({
            success: true,
            data: {
                recommendations,
                pagination: {
                    total,
                    page: parseInt(page),
                    pages: Math.ceil(total / parseInt(limit))
                }
            }
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Error fetching recommendation history',
            error: error.message 
        });
    }
});

module.exports = router;
