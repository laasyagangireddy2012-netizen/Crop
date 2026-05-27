// Recommendation Model
const mongoose = require('mongoose');

const recommendationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    inputs: {
        climate: {
            type: String,
            required: true,
            enum: ['tropical', 'subtropical', 'temperate', 'arid']
        },
        area: {
            type: Number,
            required: true
        },
        season: {
            type: String,
            required: true,
            enum: ['kharif', 'rabi', 'zaid']
        },
        soilType: {
            type: String,
            required: true,
            enum: ['clay', 'sandy', 'loamy', 'black', 'red', 'alluvial']
        },
        soilPh: {
            type: Number,
            required: true,
            min: 3,
            max: 10
        },
        nitrogen: {
            type: Number,
            required: true,
            min: 0,
            max: 100
        },
        phosphorus: {
            type: Number,
            required: true,
            min: 0,
            max: 100
        },
        potassium: {
            type: Number,
            required: true,
            min: 0,
            max: 100
        }
    },
    recommendation: {
        cropName: {
            type: String,
            required: true
        },
        confidence: {
            type: Number,
            required: true
        },
        featureScores: {
            type: Map,
            of: Number
        },
        explanation: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Index for faster queries
recommendationSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Recommendation', recommendationSchema);
