// Soil Data Routes
const express = require('express');
const router = express.Router();
const soilDataset = require('../data/soilDataset');

// @route   POST /api/soil/auto-detect
// @desc    Auto-detect soil parameters based on climate and soil type
// @access  Public
router.post('/auto-detect', (req, res) => {
    try {
        const { climate, soilType } = req.body;

        if (!climate || !soilType) {
            return res.status(400).json({ 
                success: false,
                message: 'Climate and soil type are required' 
            });
        }

        const phData = soilDataset.phBysoilType[soilType];
        const npkData = soilDataset.npkByContext[climate]?.[soilType];

        if (!phData || !npkData) {
            return res.status(404).json({ 
                success: false,
                message: 'No data available for this combination' 
            });
        }

        res.json({
            success: true,
            data: {
                ph: phData.typical,
                nitrogen: (npkData.n[0] + npkData.n[1]) / 2,
                phosphorus: (npkData.p[0] + npkData.p[1]) / 2,
                potassium: (npkData.k[0] + npkData.k[1]) / 2,
                ranges: {
                    ph: phData.range,
                    nitrogen: npkData.n,
                    phosphorus: npkData.p,
                    potassium: npkData.k
                }
            }
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Error auto-detecting soil parameters',
            error: error.message 
        });
    }
});

// @route   POST /api/soil/analysis
// @desc    Get soil nutrient analysis
// @access  Public
router.post('/analysis', (req, res) => {
    try {
        const { nitrogen, phosphorus, potassium, language = 'en' } = req.body;

        if (nitrogen === undefined || phosphorus === undefined || potassium === undefined) {
            return res.status(400).json({ 
                success: false,
                message: 'NPK values are required' 
            });
        }

        const getNutrientLevel = (value) => {
            if (value < 20) return 'low';
            if (value < 40) return 'medium';
            if (value < 60) return 'high';
            return 'veryHigh';
        };

        const info = soilDataset.nutrientInfo[language] || soilDataset.nutrientInfo.en;

        res.json({
            success: true,
            data: {
                nitrogen: {
                    value: nitrogen,
                    level: getNutrientLevel(nitrogen),
                    analysis: info.nitrogen[getNutrientLevel(nitrogen)]
                },
                phosphorus: {
                    value: phosphorus,
                    level: getNutrientLevel(phosphorus),
                    analysis: info.phosphorus[getNutrientLevel(phosphorus)]
                },
                potassium: {
                    value: potassium,
                    level: getNutrientLevel(potassium),
                    analysis: info.potassium[getNutrientLevel(potassium)]
                }
            }
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Error analyzing soil',
            error: error.message 
        });
    }
});

// @route   GET /api/soil/ph-info
// @desc    Get pH information
// @access  Public
router.get('/ph-info', (req, res) => {
    try {
        res.json({
            success: true,
            data: {
                ranges: [
                    { range: '3.5-5.5', classification: 'Strongly Acidic', crops: 'Tea, Potato, Blueberry' },
                    { range: '5.5-6.5', classification: 'Slightly Acidic', crops: 'Rice, Wheat, Maize' },
                    { range: '6.5-7.5', classification: 'Neutral', crops: 'Most crops thrive' },
                    { range: '7.5-8.5', classification: 'Slightly Alkaline', crops: 'Cotton, Sugarcane' }
                ],
                bysoilType: soilDataset.phBysoilType
            }
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Error fetching pH info',
            error: error.message 
        });
    }
});

module.exports = router;
