/* ═══════════════════════════════════════════════════
   CropXAI – Plant Disease Detection Module
   Frontend logic: upload, preview, predict, display
═══════════════════════════════════════════════════ */

'use strict';

// ── State ─────────────────────────────────────────────────────────────────────
let ddSelectedFile = null;
let ddIsAnalyzing  = false;

// ── Allowed file types ────────────────────────────────────────────────────────
const DD_ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];
const DD_MAX_SIZE_MB   = 10;

// ── Crop list for selector ────────────────────────────────────────────────────
const DD_CROPS = [
    { value: 'rice',       label: '🌾 Rice' },
    { value: 'wheat',      label: '🌿 Wheat' },
    { value: 'tomato',     label: '🍅 Tomato' },
    { value: 'potato',     label: '🥔 Potato' },
    { value: 'maize',      label: '🌽 Maize' },
    { value: 'cotton',     label: '🌸 Cotton' },
    { value: 'groundnut',  label: '🥜 Groundnut' },
    { value: 'sugarcane',  label: '🎋 Sugarcane' }
];

// ── Severity config ───────────────────────────────────────────────────────────
const DD_SEVERITY = {
    high:   { label: 'High Risk',    color: '#e53e3e', bg: 'rgba(229,62,62,0.15)',   icon: '🔴' },
    medium: { label: 'Medium Risk',  color: '#ed8936', bg: 'rgba(237,137,54,0.15)',  icon: '🟡' },
    low:    { label: 'Low Risk',     color: '#48bb78', bg: 'rgba(72,187,120,0.15)',  icon: '🟢' },
    none:   { label: 'Healthy',      color: '#48bb78', bg: 'rgba(72,187,120,0.15)',  icon: '✅' }
};

// ── Init ──────────────────────────────────────────────────────────────────────
function initDiseaseDetection() {
    _bindDropZone();
    _bindFileInput();
    _bindDetectBtn();
    _bindResetBtn();
    _bindCropSelector();
    console.log('[DiseaseDetection] Module initialised');
}

// ── Bind drop zone ────────────────────────────────────────────────────────────
function _bindDropZone() {
    const zone = document.getElementById('ddDropZone');
    if (!zone) return;

    zone.addEventListener('dragover', (e) => {
        e.preventDefault();
        zone.classList.add('dd-drag-over');
    });
    zone.addEventListener('dragleave', () => zone.classList.remove('dd-drag-over'));
    zone.addEventListener('drop', (e) => {
        e.preventDefault();
        zone.classList.remove('dd-drag-over');
        const file = e.dataTransfer.files[0];
        if (file) _handleFileSelect(file);
    });
    zone.addEventListener('click', () => {
        document.getElementById('ddFileInput').click();
    });
}

// ── Bind file input ───────────────────────────────────────────────────────────
function _bindFileInput() {
    const input = document.getElementById('ddFileInput');
    if (!input) return;
    input.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) _handleFileSelect(file);
    });
}

// ── Handle file selection ─────────────────────────────────────────────────────
function _handleFileSelect(file) {
    // Validate type
    if (!DD_ALLOWED_TYPES.includes(file.type)) {
        _showDDError('❌ Invalid file type. Please upload a JPG, JPEG, or PNG image.');
        return;
    }
    // Validate size
    if (file.size > DD_MAX_SIZE_MB * 1024 * 1024) {
        _showDDError(`❌ File too large. Maximum size is ${DD_MAX_SIZE_MB}MB.`);
        return;
    }

    ddSelectedFile = file;
    _clearDDError();
    _showPreview(file);
}

// ── Show image preview ────────────────────────────────────────────────────────
function _showPreview(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        const previewImg = document.getElementById('ddPreviewImg');
        const previewWrap = document.getElementById('ddPreviewWrap');
        const dropZone = document.getElementById('ddDropZone');
        const detectBtn = document.getElementById('ddDetectBtn');
        const fileInfo = document.getElementById('ddFileInfo');

        if (previewImg) previewImg.src = e.target.result;
        if (previewWrap) previewWrap.style.display = 'block';
        if (dropZone) dropZone.style.display = 'none';
        if (detectBtn) detectBtn.disabled = false;
        if (fileInfo) {
            const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
            fileInfo.textContent = `${file.name} (${sizeMB} MB)`;
        }

        // Hide previous results
        const results = document.getElementById('ddResults');
        if (results) results.style.display = 'none';
    };
    reader.readAsDataURL(file);
}

// ── Bind detect button ────────────────────────────────────────────────────────
function _bindDetectBtn() {
    const btn = document.getElementById('ddDetectBtn');
    if (!btn) return;
    btn.addEventListener('click', _runDetection);
}

// ── Bind reset button ─────────────────────────────────────────────────────────
function _bindResetBtn() {
    const btn = document.getElementById('ddResetBtn');
    if (!btn) return;
    btn.addEventListener('click', _resetDD);
}

// ── Bind crop selector ────────────────────────────────────────────────────────
function _bindCropSelector() {
    const sel = document.getElementById('ddCropSelect');
    if (!sel) return;
    // Already populated in HTML, just ensure it works
}

// ── Run detection ─────────────────────────────────────────────────────────────
async function _runDetection() {
    if (!ddSelectedFile || ddIsAnalyzing) return;

    const cropKey = document.getElementById('ddCropSelect')?.value || '';
    if (!cropKey) {
        _showDDError('⚠️ Please select the crop type before detecting.');
        return;
    }

    ddIsAnalyzing = true;
    _clearDDError();
    _showLoading(true);

    try {
        let result;

        // Try backend API first
        try {
            result = await _callBackendAPI(ddSelectedFile, cropKey);
        } catch (apiErr) {
            console.warn('[DiseaseDetection] Backend unavailable, using client-side simulation:', apiErr.message);
            // Fallback: client-side simulation using diseaseDatabase
            result = await _simulateDetection(ddSelectedFile, cropKey);
        }

        _showLoading(false);
        _displayResults(result);
    } catch (err) {
        _showLoading(false);
        _showDDError('❌ Detection failed: ' + err.message);
    } finally {
        ddIsAnalyzing = false;
    }
}

// ── Call backend API ──────────────────────────────────────────────────────────
async function _callBackendAPI(file, cropKey) {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('crop', cropKey);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000); // 10s timeout

    try {
        const response = await fetch(' https://crop-98x2.onrender.com', {
            method: 'POST',
            body: formData,
            signal: controller.signal
        });
        clearTimeout(timeout);

        if (!response.ok) {
            const err = await response.json().catch(() => ({ error: 'Server error' }));
            throw new Error(err.error || `HTTP ${response.status}`);
        }

        return await response.json();
    } catch (err) {
        clearTimeout(timeout);
        throw err;
    }
}

// ── Client-side simulation (fallback) ────────────────────────────────────────
async function _simulateDetection(file, cropKey) {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 2200));

    // Use diseaseDatabase if available
    const db = (typeof diseaseDatabase !== 'undefined') ? diseaseDatabase : {};
    const cropDiseases = db[cropKey] || [];

    let disease, confidence;

    if (cropDiseases.length === 0) {
        // No diseases in DB for this crop — return healthy
        disease = (typeof healthyResult !== 'undefined') ? healthyResult : _defaultHealthy();
        confidence = 92 + Math.floor(Math.random() * 7);
    } else {
        // Randomly pick a disease or healthy (30% chance healthy)
        const pickHealthy = Math.random() < 0.30;
        if (pickHealthy) {
            disease = (typeof healthyResult !== 'undefined') ? healthyResult : _defaultHealthy();
            confidence = 88 + Math.floor(Math.random() * 10);
        } else {
            disease = cropDiseases[Math.floor(Math.random() * cropDiseases.length)];
            confidence = 72 + Math.floor(Math.random() * 24);
        }
    }

    return {
        success: true,
        simulated: true,
        crop: cropKey,
        disease: {
            id:          disease.id,
            name:        disease.name?.en || disease.name || 'Unknown',
            severity:    disease.severity || 'medium',
            confidence:  confidence,
            symptoms:    disease.symptoms?.en || disease.symptoms || '',
            causes:      disease.causes?.en   || disease.causes   || '',
            treatment:   disease.treatment?.en || disease.treatment || '',
            prevention:  disease.prevention?.en || disease.prevention || '',
            organic:     disease.organic?.en   || disease.organic   || ''
        }
    };
}

function _defaultHealthy() {
    return {
        id: 'healthy', name: { en: 'Healthy Plant' }, severity: 'none',
        symptoms:   { en: 'No disease symptoms detected. Plant appears healthy.' },
        causes:     { en: 'N/A' },
        treatment:  { en: 'Continue regular care: proper irrigation, balanced fertilization, and pest monitoring.' },
        prevention: { en: 'Maintain good agricultural practices to keep plants healthy.' },
        organic:    { en: 'Regular neem oil spray as preventive measure.' }
    };
}

// ── Show loading ──────────────────────────────────────────────────────────────
function _showLoading(show) {
    const loader = document.getElementById('ddLoader');
    const btn    = document.getElementById('ddDetectBtn');
    if (loader) loader.style.display = show ? 'flex' : 'none';
    if (btn) {
        btn.disabled = show;
        btn.querySelector('.dd-btn-text').style.display = show ? 'none' : 'inline';
        btn.querySelector('.dd-btn-spin').style.display = show ? 'inline-flex' : 'none';
    }
}

// ── Display results ───────────────────────────────────────────────────────────
function _displayResults(data) {
    const resultsEl = document.getElementById('ddResults');
    if (!resultsEl) return;

    const d = data.disease;
    const sev = DD_SEVERITY[d.severity] || DD_SEVERITY.medium;
    const isHealthy = d.severity === 'none' || d.id === 'healthy';

    // Format treatment steps as list
    const treatmentHTML = _formatSteps(d.treatment);
    const preventionHTML = _formatSteps(d.prevention);

    // Confidence bar color
    const confColor = d.confidence >= 85 ? '#48bb78'
                    : d.confidence >= 65 ? '#ed8936'
                    : '#e53e3e';

    resultsEl.innerHTML = `
        <div class="dd-result-card ${isHealthy ? 'dd-healthy' : ''}">

            <!-- Header -->
            <div class="dd-result-header">
                <div class="dd-result-icon">${isHealthy ? '✅' : '🔬'}</div>
                <div class="dd-result-title">
                    <h3>${d.name}</h3>
                    <span class="dd-severity-badge" style="background:${sev.bg};color:${sev.color};border-color:${sev.color}40">
                        ${sev.icon} ${sev.label}
                    </span>
                </div>
                ${data.simulated ? '<span class="dd-sim-badge">🧪 Demo Mode</span>' : ''}
            </div>

            <!-- Confidence -->
            <div class="dd-confidence-wrap">
                <div class="dd-confidence-label">
                    <span>AI Confidence</span>
                    <strong style="color:${confColor}">${d.confidence}%</strong>
                </div>
                <div class="dd-confidence-bar">
                    <div class="dd-confidence-fill" style="width:${d.confidence}%;background:${confColor}"></div>
                </div>
            </div>

            <!-- Symptoms -->
            ${d.symptoms && d.symptoms !== 'N/A' ? `
            <div class="dd-result-section">
                <div class="dd-section-header">
                    <span class="dd-section-icon">🔍</span>
                    <h4>Symptoms Detected</h4>
                </div>
                <p>${d.symptoms}</p>
            </div>` : ''}

            <!-- Causes -->
            ${d.causes && d.causes !== 'N/A' ? `
            <div class="dd-result-section">
                <div class="dd-section-header">
                    <span class="dd-section-icon">⚠️</span>
                    <h4>Causes</h4>
                </div>
                <p>${d.causes}</p>
            </div>` : ''}

            <!-- Treatment -->
            <div class="dd-result-section dd-treatment">
                <div class="dd-section-header">
                    <span class="dd-section-icon">💊</span>
                    <h4>${isHealthy ? 'Care Recommendations' : 'Treatment & Remedy'}</h4>
                </div>
                ${treatmentHTML}
            </div>

            <!-- Prevention -->
            <div class="dd-result-section">
                <div class="dd-section-header">
                    <span class="dd-section-icon">🛡️</span>
                    <h4>Prevention Tips</h4>
                </div>
                ${preventionHTML}
            </div>

            <!-- Organic -->
            ${d.organic ? `
            <div class="dd-result-section dd-organic">
                <div class="dd-section-header">
                    <span class="dd-section-icon">🌿</span>
                    <h4>Organic / Natural Remedies</h4>
                </div>
                <p>${d.organic}</p>
            </div>` : ''}

        </div>
    `;

    resultsEl.style.display = 'block';
    resultsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });

    // Animate confidence bar
    requestAnimationFrame(() => {
        const fill = resultsEl.querySelector('.dd-confidence-fill');
        if (fill) {
            fill.style.transition = 'width 1s ease';
        }
    });
}

// ── Format treatment/prevention as numbered list ──────────────────────────────
function _formatSteps(text) {
    if (!text) return '<p>—</p>';
    // If text has numbered steps (1. 2. 3.)
    if (/\d+\.\s/.test(text)) {
        const steps = text.split(/\n/).filter(s => s.trim());
        const items = steps.map(s => `<li>${s.replace(/^\d+\.\s*/, '')}</li>`).join('');
        return `<ol class="dd-steps">${items}</ol>`;
    }
    // Otherwise paragraph
    return `<p>${text}</p>`;
}

// ── Reset ─────────────────────────────────────────────────────────────────────
function _resetDD() {
    ddSelectedFile = null;
    ddIsAnalyzing  = false;

    const dropZone   = document.getElementById('ddDropZone');
    const previewWrap = document.getElementById('ddPreviewWrap');
    const results    = document.getElementById('ddResults');
    const detectBtn  = document.getElementById('ddDetectBtn');
    const fileInput  = document.getElementById('ddFileInput');
    const fileInfo   = document.getElementById('ddFileInfo');

    if (dropZone)    dropZone.style.display    = 'flex';
    if (previewWrap) previewWrap.style.display = 'none';
    if (results)     results.style.display     = 'none';
    if (detectBtn)   detectBtn.disabled        = true;
    if (fileInput)   fileInput.value           = '';
    if (fileInfo)    fileInfo.textContent      = '';

    _clearDDError();
}

// ── Error helpers ─────────────────────────────────────────────────────────────
function _showDDError(msg) {
    const el = document.getElementById('ddError');
    if (el) { el.textContent = msg; el.style.display = 'block'; }
}

function _clearDDError() {
    const el = document.getElementById('ddError');
    if (el) { el.textContent = ''; el.style.display = 'none'; }
}

// ── Expose init ───────────────────────────────────────────────────────────────
window.initDiseaseDetection = initDiseaseDetection;
