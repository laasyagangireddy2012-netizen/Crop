// Crop Routes
const express = require('express');
const router = express.Router();
const cropDatabase = require('../data/cropDatabase');

// @route   GET /api/crops
// @desc    Get all crops
// @access  Public
router.get('/', (req, res) => {
    try {
        const { language = 'en' } = req.query;
        
        const crops = Object.entries(cropDatabase).map(([key, crop]) => ({
            id: key,
            name: crop.name[language] || crop.name.en,
            climate: crop.climate,
            season: crop.season,
            soilType: crop.soilType,
            phRange: crop.phRange
        }));

        res.json({
            success: true,
            count: crops.length,
            data: crops
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Error fetching crops',
            error: error.message 
        });
    }
});

// @route   GET /api/crops/:cropId
// @desc    Get single crop details
// @access  Public
router.get('/:cropId', (req, res) => {
    try {
        const { cropId } = req.params;
        const { language = 'en' } = req.query;

        const crop = cropDatabase[cropId];
        if (!crop) {
            return res.status(404).json({ 
                success: false,
                message: 'Crop not found' 
            });
        }

        res.json({
            success: true,
            data: {
                id: cropId,
                name: crop.name[language] || crop.name.en,
                climate: crop.climate,
                season: crop.season,
                soilType: crop.soilType,
                phRange: crop.phRange,
                npk: crop.npk,
                irrigation: crop.irrigation[language] || crop.irrigation.en,
                irrigationSchedule: crop.irrigationSchedule[language] || crop.irrigationSchedule.en,
                fertilizers: crop.fertilizers[language] || crop.fertilizers.en,
                explanation: crop.explanation[language] || crop.explanation.en
            }
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Error fetching crop details',
            error: error.message 
        });
    }
});

// @route   GET /api/crops/:cropId/irrigation-schedule
// @desc    Get irrigation schedule for a crop
// @access  Public
router.get('/:cropId/irrigation-schedule', (req, res) => {
    try {
        const { cropId } = req.params;
        const { language = 'en' } = req.query;

        const crop = cropDatabase[cropId];
        if (!crop) {
            return res.status(404).json({ 
                success: false,
                message: 'Crop not found' 
            });
        }

        if (!crop.irrigationSchedule) {
            return res.status(404).json({ 
                success: false,
                message: 'Irrigation schedule not available for this crop' 
            });
        }

        res.json({
            success: true,
            data: {
                cropName: crop.name[language] || crop.name.en,
                schedule: crop.irrigationSchedule[language] || crop.irrigationSchedule.en
            }
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Error fetching irrigation schedule',
            error: error.message 
        });
    }
});

module.exports = router;
