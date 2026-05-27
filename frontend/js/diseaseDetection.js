/**
 * CROPXAI Disease Detection Engine
 * Symptom-based questionnaire + scoring system
 * Replaces unreliable color-heuristic approach
 */

// Override the runDiseaseAnalysis function from app.js
window.runDiseaseAnalysis = function(cropKey) {
    document.getElementById('diseaseUploadSection').style.display = 'none';
    document.getElementById('diseaseAnalyzing').style.display     = 'none';
    document.getElementById('diseaseResults').style.display       = 'block';
    showSymptomQuestionnaire(cropKey);
};

function showSymptomQuestionnaire(cropKey) {
    const lang = (typeof currentLanguage !== 'undefined') ? currentLanguage : 'en';

    const questions = {
        en: [
            { id: 'q1', text: 'What color are the spots/lesions on the leaf?', options: [
                { val: 'brown',  label: '🟤 Brown / Dark brown spots' },
                { val: 'yellow', label: '🟡 Yellow / Pale yellow patches' },
                { val: 'orange', label: '🟠 Orange / Rust-colored pustules' },
                { val: 'white',  label: '⬜ White / Gray powdery coating' },
                { val: 'black',  label: '⬛ Black / Dark rotting patches' },
                { val: 'none',   label: '🟢 No spots — leaf looks healthy' }
            ]},
            { id: 'q2', text: 'What is the shape of the affected area?', options: [
                { val: 'circular',  label: '⭕ Circular / Round spots with rings' },
                { val: 'angular',   label: '🔷 Angular / Irregular water-soaked patches' },
                { val: 'elongated', label: '📏 Long / Elongated cigar-shaped lesions' },
                { val: 'powdery',   label: '💨 Powdery coating on leaf surface' },
                { val: 'wilting',   label: '🥀 Leaf curling upward / Wilting' },
                { val: 'none',      label: '✅ No visible damage' }
            ]},
            { id: 'q3', text: 'Where are the symptoms most visible?', options: [
                { val: 'tips',      label: '🔝 Leaf tips and edges' },
                { val: 'center',    label: '🎯 Center / Middle of leaf' },
                { val: 'whole',     label: '🍃 Entire leaf surface' },
                { val: 'veins',     label: '🌿 Along leaf veins' },
                { val: 'underside', label: '🔄 Underside of leaf' },
                { val: 'none',      label: '✅ No symptoms visible' }
            ]},
            { id: 'q4', text: 'Are there any additional signs?', options: [
                { val: 'mold',   label: '🍄 Visible mold / fungal growth' },
                { val: 'sticky', label: '🐛 Sticky residue / insects present' },
                { val: 'smell',  label: '👃 Foul / sour smell from plant' },
                { val: 'rings',  label: '🎯 Concentric rings inside spots' },
                { val: 'halo',   label: '🌟 Yellow halo around spots' },
                { val: 'none',   label: '✅ None of the above' }
            ]}
        ],
        te: [
            { id: 'q1', text: 'ఆకుపై మచ్చలు/గాయాల రంగు ఏమిటి?', options: [
                { val: 'brown',  label: '🟤 గోధుమ / ముదురు గోధుమ మచ్చలు' },
                { val: 'yellow', label: '🟡 పసుపు / లేత పసుపు మచ్చలు' },
                { val: 'orange', label