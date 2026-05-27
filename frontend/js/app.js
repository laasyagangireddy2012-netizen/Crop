/* ═══════════════════════════════════════════════════
   CropXAI – Main Dashboard Logic
═══════════════════════════════════════════════════ */

'use strict';

let currentLanguage = 'en';
let isLoggedIn = false;
let currentUser = null;
let users = JSON.parse(localStorage.getItem('cropxai_users')) || {
    'farmer': { password: 'demo123', name: 'Demo Farmer', email: 'farmer@demo.com' }
};

// Load session user from login page
(function loadSession() {
    const stored = sessionStorage.getItem('cropxai_user');
    if (stored) {
        try {
            currentUser = JSON.parse(stored);
            isLoggedIn = true;
        } catch(e) { /* ignore */ }
    }
})();

// DOM Elements
const loginModal    = document.getElementById('loginModal');
const infoModal     = document.getElementById('infoModal');
const profileModal  = document.getElementById('profileModal');
const profileBtn    = document.getElementById('navProfileBtn');
const loginForm     = document.getElementById('loginForm');
const registerForm  = document.getElementById('registerForm');
const forgotPasswordForm = document.getElementById('forgotPasswordForm');
const recommendBtn  = document.getElementById('recommendBtn');
const resultsSection = document.getElementById('resultsCard') || document.getElementById('resultsSection');

// Auto-detect buttons
const autoPhBtn = document.getElementById('autoPhBtn');
const autoNBtn  = document.getElementById('autoNBtn');
const autoPBtn  = document.getElementById('autoPBtn');
const autoKBtn  = document.getElementById('autoKBtn');

// Auth Links
const createAccountLink  = document.getElementById('createAccountLink');
const forgotPasswordLink = document.getElementById('forgotPasswordLink');
const backToLoginLink    = document.getElementById('backToLoginLink');
const backToLoginLink2   = document.getElementById('backToLoginLink2');

// ── Modal Controls ────────────────────────────────────────────────────────────
if (profileBtn) profileBtn.addEventListener('click', () => { showProfile(); });

window.addEventListener('click', (e) => {
    if (e.target === loginModal)   loginModal.style.display   = 'none';
    if (e.target === infoModal)    infoModal.style.display    = 'none';
    if (e.target === profileModal) profileModal.style.display = 'none';
});

document.querySelectorAll('.close').forEach(closeBtn => {
    closeBtn.addEventListener('click', function() {
        this.closest('.modal').style.display = 'none';
    });
});

// ── Auth Form Switching ───────────────────────────────────────────────────────
if (createAccountLink) createAccountLink.addEventListener('click', (e) => {
    e.preventDefault();
    showRegisterForm();
});

if (forgotPasswordLink) forgotPasswordLink.addEventListener('click', (e) => {
    e.preventDefault();
    showForgotPasswordForm();
});

if (backToLoginLink) backToLoginLink.addEventListener('click', (e) => {
    e.preventDefault();
    showLoginForm();
});

if (backToLoginLink2) backToLoginLink2.addEventListener('click', (e) => {
    e.preventDefault();
    showLoginForm();
});

function showLoginForm() {
    if (loginForm)         loginForm.style.display         = 'flex';
    if (registerForm)      registerForm.style.display      = 'none';
    if (forgotPasswordForm) forgotPasswordForm.style.display = 'none';
}

function showRegisterForm() {
    if (loginForm)         loginForm.style.display         = 'none';
    if (registerForm)      registerForm.style.display      = 'flex';
    if (forgotPasswordForm) forgotPasswordForm.style.display = 'none';
}

function showForgotPasswordForm() {
    if (loginForm)         loginForm.style.display         = 'none';
    if (registerForm)      registerForm.style.display      = 'none';
    if (forgotPasswordForm) forgotPasswordForm.style.display = 'flex';
}

// ── Login Handler ─────────────────────────────────────────────────────────────
if (loginForm) loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (users[username] && users[username].password === password) {
        currentUser = { username, ...users[username] };
        isLoggedIn = true;
        loginModal.style.display = 'none';
        loginForm.reset();
    } else {
        alert('Login failed! Invalid credentials.');
    }
});

// ── Register Handler ──────────────────────────────────────────────────────────
if (registerForm) registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('newUsername').value;
    const email    = document.getElementById('newEmail').value;
    const password = document.getElementById('newPassword').value;
    const confirm  = document.getElementById('confirmPassword').value;
    const name     = document.getElementById('farmerName').value;

    if (users[username]) { alert('Username already exists!'); return; }
    if (password !== confirm) { alert('Passwords do not match!'); return; }

    users[username] = { password, name, email };
    localStorage.setItem('cropxai_users', JSON.stringify(users));
    alert('Account created successfully! Please login.');
    showLoginForm();
    registerForm.reset();
});

// ── Forgot Password Handler ───────────────────────────────────────────────────
if (forgotPasswordForm) forgotPasswordForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username    = document.getElementById('resetUsername').value;
    const email       = document.getElementById('resetEmail').value;
    const newPassword = document.getElementById('resetNewPassword').value;

    if (users[username] && users[username].email === email) {
        users[username].password = newPassword;
        localStorage.setItem('cropxai_users', JSON.stringify(users));
        alert('Password reset successfully! Please login.');
        showLoginForm();
        forgotPasswordForm.reset();
    } else {
        alert('Invalid username or email!');
    }
});

// ── Profile Display ───────────────────────────────────────────────────────────
function showProfile() {
    if (!currentUser) return;

    const content = `
        <div class="profile-item">
            <strong>Full Name</strong>
            <div>${currentUser.name || '—'}</div>
        </div>
        <div class="profile-item">
            <strong>Username</strong>
            <div>${currentUser.username || '—'}</div>
        </div>
    `;

    document.getElementById('profileContent').innerHTML = content;
    profileModal.style.display = 'block';
}

// ── Auto-detect Soil Parameters ───────────────────────────────────────────────
// Individual Auto buttons are upgraded by soilAutoDetect.js to fill ALL fields
// at once with animation. The handlers below are kept as a safe fallback in
// case soilAutoDetect.js hasn't loaded yet.
function _legacyAutoFill(fieldId) {
    const climate  = document.getElementById('climate').value;
    const soilType = document.getElementById('soilType').value;
    if (!climate || !soilType) { alert('Please select Climate and Soil Type first.'); return; }
    // Prefer the new module if available
    if (typeof window.triggerSoilAutoDetect === 'function') {
        window.triggerSoilAutoDetect(true);
        return;
    }
    // Fallback: fill just the requested field
    const params = (typeof autoDetectSoilParameters === 'function')
        ? autoDetectSoilParameters(climate, soilType)
        : null;
    if (!params) return;
    const map = { soilPh: 'ph', nitrogen: 'nitrogen', phosphorus: 'phosphorus', potassium: 'potassium' };
    const key = map[fieldId];
    if (key && params[key] !== undefined) {
        document.getElementById(fieldId).value = params[key].toFixed(1);
    }
}

if (autoPhBtn) autoPhBtn.addEventListener('click', () => _legacyAutoFill('soilPh'));
if (autoNBtn)  autoNBtn.addEventListener('click',  () => _legacyAutoFill('nitrogen'));
if (autoPBtn)  autoPBtn.addEventListener('click',  () => _legacyAutoFill('phosphorus'));
if (autoKBtn)  autoKBtn.addEventListener('click',  () => _legacyAutoFill('potassium'));

// ── Info Buttons ──────────────────────────────────────────────────────────────
document.getElementById('phInfoBtn').addEventListener('click', () => {
    const content = `
        <h3>Soil pH Information</h3>
        <p>Soil pH measures acidity/alkalinity on a scale of 0-14. Most crops prefer pH 6.0-7.5.</p>
        <table class="info-table">
            <tr><th>pH Range</th><th>Classification</th><th>Suitable Crops</th></tr>
            <tr><td>3.5 - 5.5</td><td>Strongly Acidic</td><td>Tea, Potato, Blueberry</td></tr>
            <tr><td>5.5 - 6.5</td><td>Slightly Acidic</td><td>Rice, Wheat, Maize</td></tr>
            <tr><td>6.5 - 7.5</td><td>Neutral</td><td>Most crops thrive</td></tr>
            <tr><td>7.5 - 8.5</td><td>Slightly Alkaline</td><td>Cotton, Sugarcane</td></tr>
        </table>
    `;
    document.getElementById('infoContent').innerHTML = content;
    infoModal.style.display = 'block';
});

document.getElementById('npkInfoBtn').addEventListener('click', () => {
    const content = `
        <h3>NPK Nutrients Information</h3>
        <p>N (Nitrogen): Promotes leaf growth. P (Phosphorus): Supports root and flower development. K (Potassium): Enhances overall plant health.</p>
        <table class="info-table">
            <tr><th>Nutrient</th><th>Function</th><th>Deficiency Signs</th></tr>
            <tr><td>Nitrogen (N)</td><td>Leaf growth, protein synthesis</td><td>Yellowing of older leaves</td></tr>
            <tr><td>Phosphorus (P)</td><td>Root development, flowering</td><td>Purple/dark green leaves</td></tr>
            <tr><td>Potassium (K)</td><td>Disease resistance, water regulation</td><td>Brown leaf edges</td></tr>
        </table>
        <p style="margin-top:15px"><strong>Optimal Ranges:</strong> Low: 0-20% | Medium: 20-40% | High: 40-60% | Very High: 60%+</p>
    `;
    document.getElementById('infoContent').innerHTML = content;
    infoModal.style.display = 'block';
});

// ── Crop Recommendation ───────────────────────────────────────────────────────

// Static enrichment data (yield, water, season label, profit) keyed by cropKey
const CROP_ENRICH = {
    rice:      { icon:'🌾', yieldRange:'3–6 t/acre', water:'High (1200–1500 mm)', season:'Kharif (Jun–Nov)', profit:'₹40,000–₹80,000/acre' },
    wheat:     { icon:'🌿', yieldRange:'2–4 t/acre', water:'Medium (450–650 mm)', season:'Rabi (Nov–Apr)',   profit:'₹35,000–₹60,000/acre' },
    cotton:    { icon:'🌸', yieldRange:'1–2 t/acre', water:'Medium (700–1300 mm)',season:'Kharif (Jun–Nov)', profit:'₹50,000–₹90,000/acre' },
    maize:     { icon:'🌽', yieldRange:'2–4 t/acre', water:'Medium (500–800 mm)', season:'Kharif/Rabi',      profit:'₹30,000–₹55,000/acre' },
    sugarcane: { icon:'🎋', yieldRange:'30–50 t/acre',water:'Very High (2000–2500 mm)',season:'Annual',      profit:'₹80,000–₹1,50,000/acre'},
    groundnut: { icon:'🥜', yieldRange:'1–2 t/acre', water:'Low–Medium (500–700 mm)',season:'Kharif/Rabi',   profit:'₹40,000–₹70,000/acre' },
    tomato:    { icon:'🍅', yieldRange:'8–15 t/acre', water:'Medium (400–600 mm)', season:'Rabi/Zaid',       profit:'₹60,000–₹1,20,000/acre'},
    potato:    { icon:'🥔', yieldRange:'8–12 t/acre', water:'Medium (500–700 mm)', season:'Rabi (Oct–Mar)',  profit:'₹50,000–₹90,000/acre' }
};

recommendBtn.addEventListener('click', () => {
    const inputs = {
        climate:    document.getElementById('climate').value,
        area:       parseFloat(document.getElementById('area').value),
        season:     document.getElementById('season').value,
        soilType:   document.getElementById('soilType').value,
        soilPh:     parseFloat(document.getElementById('soilPh').value),
        nitrogen:   parseFloat(document.getElementById('nitrogen').value),
        phosphorus: parseFloat(document.getElementById('phosphorus').value),
        potassium:  parseFloat(document.getElementById('potassium').value)
    };

    if (!inputs.climate || !inputs.season || !inputs.soilType ||
        isNaN(inputs.area) || isNaN(inputs.soilPh) ||
        isNaN(inputs.nitrogen) || isNaN(inputs.phosphorus) || isNaN(inputs.potassium)) {
        alert('Please fill in all farm details before getting a recommendation.');
        return;
    }

    const results = explainableAI.analyzeAllCrops(inputs, cropDatabase);
    displayAllRecommendations(results, inputs);

    if (resultsSection) {
        resultsSection.style.display = 'block';
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
});

// ── Display ALL ranked recommendations ───────────────────────────────────────
function displayAllRecommendations(results, inputs) {
    const container = document.getElementById('recommendationResults');
    if (!container) return;

    // Stop any ongoing speech when new results are rendered
    if (_ttsActive) _ttsStop();

    const best = results[0];
    const bestExplanation = explainableAI.generateExplanation(
        inputs, best.crop, best.scores, best.confidence, currentLanguage
    );

    let html = '';

    // ── BEST CROP HERO CARD ───────────────────────────────────────────────────
    const bestEnrich = CROP_ENRICH[best.cropKey] || { icon:'🌱', yieldRange:'—', water:'—', season:'—', profit:'—' };
    const bestSoilAnalysis = getSoilAnalysis(inputs.nitrogen, inputs.phosphorus, inputs.potassium, currentLanguage);

    let bestFeatureHTML = '';
    const featureLabels = { climate:'Climate', season:'Season', soilType:'Soil Type', ph:'Soil pH', nitrogen:'Nitrogen', phosphorus:'Phosphorus', potassium:'Potassium' };
    for (const [feat, score] of Object.entries(best.scores)) {
        const barColor = score >= 80 ? '#48bb78' : score >= 50 ? '#f6ad55' : '#fc8181';
        bestFeatureHTML += `
            <div class="cr-feat-item">
                <span class="cr-feat-label">${featureLabels[feat] || feat}</span>
                <div class="cr-feat-bar"><div class="cr-feat-fill" style="width:${score}%;background:${barColor}"></div></div>
                <span class="cr-feat-pct" style="color:${barColor}">${Math.round(score)}%</span>
            </div>`;
    }

    let bestRecsHTML = '';
    if (bestExplanation.recommendations.length > 0) {
        bestRecsHTML = '<ul class="cr-recs-list">' +
            bestExplanation.recommendations.map(r => `<li>${r}</li>`).join('') + '</ul>';
    }

    let irrigScheduleHTML = '';
    if (best.crop.irrigationSchedule && best.crop.irrigationSchedule[currentLanguage]) {
        irrigScheduleHTML = `
        <div class="cr-section">
            <div class="cr-section-title">📅 Irrigation Schedule</div>
            <table class="cr-irrig-table">
                <thead><tr><th>Stage</th><th>Days</th><th>Frequency</th><th>Depth</th></tr></thead>
                <tbody>
                ${best.crop.irrigationSchedule[currentLanguage].map(s => `
                    <tr><td><strong>${s.stage}</strong></td><td>${s.days}</td><td>${s.frequency}</td><td>${s.depth}</td></tr>
                `).join('')}
                </tbody>
            </table>
        </div>`;
    }

    html += `
    <div class="cr-best-wrap" id="crBestCard">
        <div class="cr-best-badge">🏆 Best Recommended Crop</div>
        <div class="cr-best-header">
            <div class="cr-best-icon">${bestEnrich.icon}</div>
            <div class="cr-best-info">
                <h2 class="cr-best-name">${best.crop.name[currentLanguage]}</h2>
                <p class="cr-best-why">${bestExplanation.summary}</p>
                <p class="cr-best-expl">${best.crop.explanation[currentLanguage]}</p>
            </div>
            <div class="cr-best-score-wrap">
                <svg class="cr-score-ring" viewBox="0 0 80 80">
                    <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(72,187,120,0.15)" stroke-width="8"/>
                    <circle cx="40" cy="40" r="34" fill="none" stroke="#48bb78" stroke-width="8"
                        stroke-dasharray="${Math.round(2*Math.PI*34*best.confidence/100)} 999"
                        stroke-linecap="round" transform="rotate(-90 40 40)"/>
                </svg>
                <div class="cr-score-inner">
                    <span class="cr-score-num">${best.confidence}%</span>
                    <span class="cr-score-lbl">Match</span>
                </div>
            </div>
        </div>

        <div class="cr-quick-stats">
            <div class="cr-qs-item"><span class="cr-qs-icon">📦</span><span class="cr-qs-val">${bestEnrich.yieldRange}</span><span class="cr-qs-lbl">Expected Yield</span></div>
            <div class="cr-qs-item"><span class="cr-qs-icon">💧</span><span class="cr-qs-val">${bestEnrich.water}</span><span class="cr-qs-lbl">Water Req.</span></div>
            <div class="cr-qs-item"><span class="cr-qs-icon">🗓️</span><span class="cr-qs-val">${bestEnrich.season}</span><span class="cr-qs-lbl">Growing Season</span></div>
            <div class="cr-qs-item"><span class="cr-qs-icon">💰</span><span class="cr-qs-val">${bestEnrich.profit}</span><span class="cr-qs-lbl">Est. Profit</span></div>
        </div>

        <div class="cr-details-grid">
            <div class="cr-section">
                <div class="cr-section-title">📊 Suitability Breakdown</div>
                <div class="cr-feat-grid">${bestFeatureHTML}</div>
            </div>
            <div class="cr-section">
                <div class="cr-section-title">🌱 Soil Analysis</div>
                <div class="cr-soil-row"><span>Nitrogen (N)</span><span>${bestSoilAnalysis.nitrogen}</span></div>
                <div class="cr-soil-row"><span>Phosphorus (P)</span><span>${bestSoilAnalysis.phosphorus}</span></div>
                <div class="cr-soil-row"><span>Potassium (K)</span><span>${bestSoilAnalysis.potassium}</span></div>
                <div class="cr-soil-row"><span>pH Range</span><span>${best.crop.phRange[0]}–${best.crop.phRange[1]} (yours: ${inputs.soilPh})</span></div>
            </div>
            <div class="cr-section">
                <div class="cr-section-title">💧 Irrigation</div>
                <p class="cr-section-text">${best.crop.irrigation[currentLanguage]}</p>
            </div>
            <div class="cr-section">
                <div class="cr-section-title">🧪 Fertilizers</div>
                <p class="cr-section-text">${best.crop.fertilizers[currentLanguage]}</p>
                ${bestRecsHTML}
            </div>
        </div>
        ${irrigScheduleHTML}
    </div>`;

    // ── ALL CROPS RANKED ──────────────────────────────────────────────────────
    html += `
    <div class="cr-all-wrap">
        <div class="cr-all-header">
            <h3>📋 All Suitable Crops — Ranked by Suitability</h3>
            <span class="cr-all-count">${results.length} crops analysed</span>
        </div>
        <div class="cr-rank-list">`;

    results.forEach((r, idx) => {
        const enrich = CROP_ENRICH[r.cropKey] || { icon:'🌱', yieldRange:'—', water:'—', season:'—', profit:'—' };
        const barColor = r.confidence >= 75 ? '#48bb78' : r.confidence >= 50 ? '#f6ad55' : '#fc8181';
        const rankClass = idx === 0 ? 'cr-rank-best' : idx === 1 ? 'cr-rank-2nd' : idx === 2 ? 'cr-rank-3rd' : '';
        const rankLabel = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx+1}`;

        // Suitability tag
        const suitTag = r.confidence >= 75 ? '<span class="cr-suit-tag cr-suit-high">High</span>'
                      : r.confidence >= 50 ? '<span class="cr-suit-tag cr-suit-med">Medium</span>'
                      : '<span class="cr-suit-tag cr-suit-low">Low</span>';

        html += `
        <div class="cr-rank-card ${rankClass}" style="animation-delay:${idx*0.06}s">
            <div class="cr-rank-num">${rankLabel}</div>
            <div class="cr-rank-icon">${enrich.icon}</div>
            <div class="cr-rank-body">
                <div class="cr-rank-top">
                    <span class="cr-rank-name">${r.crop.name[currentLanguage]}</span>
                    ${suitTag}
                </div>
                <div class="cr-rank-bar-wrap">
                    <div class="cr-rank-bar">
                        <div class="cr-rank-fill" style="width:${r.confidence}%;background:${barColor}"></div>
                    </div>
                    <span class="cr-rank-pct" style="color:${barColor}">${r.confidence}%</span>
                </div>
                <div class="cr-rank-meta">
                    <span>📦 ${enrich.yieldRange}</span>
                    <span>💧 ${enrich.water}</span>
                    <span>💰 ${enrich.profit}</span>
                </div>
            </div>
        </div>`;
    });

    html += `</div></div>`;

    container.innerHTML = html;

    // Animate rank bars + bind TTS buttons after paint
    requestAnimationFrame(() => {
        container.querySelectorAll('.cr-rank-fill').forEach(el => {
            el.style.transition = 'width 0.9s cubic-bezier(0.4,0,0.2,1)';
        });
        container.querySelectorAll('.cr-feat-fill').forEach(el => {
            el.style.transition = 'width 0.7s cubic-bezier(0.4,0,0.2,1)';
        });

        // Bind Read Aloud buttons (must happen after innerHTML so buttons exist)
        _ttsBindButtons(results, inputs, bestExplanation);
    });
}

// ── Text-to-Speech (Read Aloud) ───────────────────────────────────────────────
// Stores the last results/inputs so buttons can re-bind after re-render
let _ttsLastResults  = null;
let _ttsLastInputs   = null;
let _ttsLastExpl     = null;
let _ttsUtterance    = null;
let _ttsPaused       = false;
let _ttsActive       = false;

// Chrome SpeechSynthesis bug: synthesis stops after ~15s unless we ping it
let _ttsKeepAlive    = null;

function _ttsStartKeepAlive() {
    _ttsStopKeepAlive();
    _ttsKeepAlive = setInterval(() => {
        if (window.speechSynthesis && _ttsActive && !_ttsPaused) {
            // Chrome workaround: pause+resume every 10s to prevent cutoff
            window.speechSynthesis.pause();
            window.speechSynthesis.resume();
        }
    }, 10000);
}

function _ttsStopKeepAlive() {
    if (_ttsKeepAlive) { clearInterval(_ttsKeepAlive); _ttsKeepAlive = null; }
}

function _ttsStop() {
    _ttsStopKeepAlive();
    _ttsActive = false;
    _ttsPaused = false;
    if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
    }
    _ttsUpdateBtns('idle');
    console.log('[TTS] Stopped');
}

function _ttsUpdateBtns(state) {
    // state: 'idle' | 'speaking' | 'paused' | 'finished'
    const btnStart  = document.getElementById('btnReadAloud');
    const btnPause  = document.getElementById('btnReadPause');
    const btnStop   = document.getElementById('btnReadStop');
    const statusEl  = document.getElementById('ttsStatusBadge');

    const speaking = (state === 'speaking' || state === 'paused');

    if (btnStart) {
        btnStart.style.display = speaking ? 'none' : 'inline-flex';
        btnStart.classList.remove('tts-btn-reading');
    }    if (btnPause) {
        btnPause.style.display = speaking ? 'inline-flex' : 'none';
        if (state === 'paused') {
            btnPause.innerHTML = '▶ <span>Resume</span>';
            btnPause.classList.add('tts-btn-paused');
        } else {
            btnPause.innerHTML = '⏸ <span>Pause</span>';
            btnPause.classList.remove('tts-btn-paused');
        }
    }
    if (btnStop) {
        btnStop.style.display = speaking ? 'inline-flex' : 'none';
    }

    // Status badge
    if (statusEl) {
        const map = {
            idle:     { text: '',                  cls: '' },
            speaking: { text: '🔊 Reading...',     cls: 'tts-status-reading' },
            paused:   { text: '⏸ Paused',          cls: 'tts-status-paused' },
            finished: { text: '✅ Finished reading', cls: 'tts-status-done' }
        };
        const cfg = map[state] || map.idle;
        statusEl.textContent  = cfg.text;
        statusEl.className    = 'tts-status-badge' + (cfg.cls ? ' ' + cfg.cls : '');
        statusEl.style.display = cfg.text ? 'inline-flex' : 'none';
    }
}

function _ttsBindButtons(results, inputs, bestExpl) {
    // Cache for re-binding after re-renders
    _ttsLastResults = results;
    _ttsLastInputs  = inputs;
    _ttsLastExpl    = bestExpl;

    const btnStart = document.getElementById('btnReadAloud');
    const btnPause = document.getElementById('btnReadPause');
    const btnStop  = document.getElementById('btnReadStop');

    if (!btnStart) {
        console.warn('[TTS] btnReadAloud not found in DOM');
        return;
    }

    // Remove old listeners by replacing with clones
    const newStart = btnStart.cloneNode(true);
    const newPause = btnPause ? btnPause.cloneNode(true) : null;
    const newStop  = btnStop  ? btnStop.cloneNode(true)  : null;

    btnStart.parentNode.replaceChild(newStart, btnStart);
    if (btnPause && newPause) btnPause.parentNode.replaceChild(newPause, btnPause);
    if (btnStop  && newStop)  btnStop.parentNode.replaceChild(newStop,  btnStop);

    newStart.addEventListener('click', () => {
        console.log('[TTS] Read Aloud clicked');
        _ttsSpeak(results, inputs, bestExpl);
    });

    if (newPause) {
        newPause.addEventListener('click', () => {
            if (!window.speechSynthesis) return;
            if (_ttsPaused) {
                window.speechSynthesis.resume();
                _ttsPaused = false;
                _ttsActive = true;
                _ttsUpdateBtns('speaking');
                _ttsStartKeepAlive();
                console.log('[TTS] Resumed');
            } else {
                window.speechSynthesis.pause();
                _ttsPaused = true;
                _ttsActive = false;
                _ttsStopKeepAlive();
                _ttsUpdateBtns('paused');
                console.log('[TTS] Paused');
            }
        });
    }

    if (newStop) {
        newStop.addEventListener('click', () => {
            _ttsStop();
        });
    }

    console.log('[TTS] Buttons bound successfully');
}

function _ttsGetBestVoice(langCode) {
    const voices = window.speechSynthesis.getVoices();
    console.log('[TTS] Available voices:', voices.map(v => v.lang + ' – ' + v.name));

    // Priority: exact match → language prefix match → any English → first available
    const exact   = voices.find(v => v.lang === langCode);
    if (exact) return exact;

    const prefix  = voices.find(v => v.lang.startsWith(langCode.split('-')[0]));
    if (prefix) return prefix;

    const english = voices.find(v => v.lang.startsWith('en'));
    if (english) return english;

    return voices[0] || null;
}

function _ttsSpeak(results, inputs, bestExpl) {
    if (!window.speechSynthesis) {
        console.error('[TTS] SpeechSynthesis not supported');
        alert('Text-to-speech is not supported in this browser. Please use Chrome or Edge.');
        return;
    }

    console.log('[TTS] Starting speech synthesis...');

    // Cancel any ongoing speech first, then wait one tick before speaking
    // (Chrome bug: cancel() + immediate speak() silently drops the utterance)
    window.speechSynthesis.cancel();
    _ttsActive = false;
    _ttsPaused = false;
    _ttsStopKeepAlive();

    const best   = results[0];
    const enrich = CROP_ENRICH[best.cropKey] || {};
    const lang   = (typeof currentLanguage !== 'undefined' ? currentLanguage : null) || 'en';

    const langCode = lang === 'hi' ? 'hi-IN' : lang === 'te' ? 'te-IN' : 'en-US';

    // Build farmer-friendly script
    const cropName = best.crop.name ? (best.crop.name.en || best.crop.name) : 'Unknown';
    const lines = [
        'CropXAI Crop Recommendation Results.',
        `Best Recommended Crop: ${cropName}.`,
        `Suitability Score: ${best.confidence} percent.`,
        bestExpl.summary || '',
        best.crop.explanation ? (best.crop.explanation.en || '') : '',
        `Expected Yield: ${enrich.yieldRange || 'not available'}.`,
        `Water Requirement: ${enrich.water || 'not available'}.`,
        `Growing Season: ${enrich.season || 'not available'}.`,
        `Estimated Profit: ${(enrich.profit || 'not available').replace(/₹/g, 'Rupees ')}.`,
        `Irrigation recommendation: ${best.crop.irrigation ? (best.crop.irrigation.en || '') : ''}.`,
        `Fertilizer recommendation: ${best.crop.fertilizers ? (best.crop.fertilizers.en || '') : ''}.`,
    ].filter(Boolean);

    if (bestExpl.recommendations && bestExpl.recommendations.length > 0) {
        lines.push('Additional recommendations: ' + bestExpl.recommendations.join('. ') + '.');
    }

    const others = results.slice(1, 5);
    if (others.length > 0) {
        lines.push('Other suitable crops in order: ' +
            others.map((r, i) => {
                const n = r.crop.name ? (r.crop.name.en || r.crop.name) : 'Unknown';
                return `${i + 2}. ${n} at ${r.confidence} percent`;
            }).join(', ') + '.');
    }

    const script = lines.join(' ');
    console.log('[TTS] Script length:', script.length, 'chars');
    console.log('[TTS] Script preview:', script.substring(0, 120) + '...');

    // Delay speak() by 150ms after cancel() — fixes Chrome silent-drop bug
    setTimeout(() => {
        _ttsUtterance = new SpeechSynthesisUtterance(script);
        _ttsUtterance.rate  = 0.88;
        _ttsUtterance.pitch = 1.0;
        _ttsUtterance.volume = 1.0;

        // Wait for voices to load (they may be async on first call)
        const applyVoice = () => {
            const voice = _ttsGetBestVoice(langCode);
            if (voice) {
                _ttsUtterance.voice = voice;
                _ttsUtterance.lang  = voice.lang;
                console.log('[TTS] Using voice:', voice.name, '|', voice.lang);
            } else {
                _ttsUtterance.lang = langCode;
                console.log('[TTS] No voice found, using lang code:', langCode);
            }
        };

        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
            applyVoice();
        } else {
            // Voices not loaded yet — wait for the event
            window.speechSynthesis.onvoiceschanged = () => {
                applyVoice();
                window.speechSynthesis.onvoiceschanged = null;
            };
        }

        _ttsUtterance.onstart = () => {
            _ttsActive = true;
            _ttsPaused = false;
            _ttsUpdateBtns('speaking');
            _ttsStartKeepAlive();
            console.log('[TTS] Speech started');
        };

        _ttsUtterance.onend = () => {
            _ttsActive = false;
            _ttsPaused = false;
            _ttsStopKeepAlive();
            _ttsUpdateBtns('finished');
            console.log('[TTS] Speech finished');
            // Reset to idle after 3s
            setTimeout(() => _ttsUpdateBtns('idle'), 3000);
        };

        _ttsUtterance.onerror = (e) => {
            _ttsActive = false;
            _ttsPaused = false;
            _ttsStopKeepAlive();
            _ttsUpdateBtns('idle');
            console.error('[TTS] Speech error:', e.error, e);
        };

        _ttsUtterance.onpause = () => {
            console.log('[TTS] Speech paused (browser event)');
        };

        _ttsUtterance.onresume = () => {
            console.log('[TTS] Speech resumed (browser event)');
        };

        console.log('[TTS] Calling speechSynthesis.speak()...');
        window.speechSynthesis.speak(_ttsUtterance);

        // Verify it actually queued (Chrome sometimes silently fails)
        setTimeout(() => {
            if (window.speechSynthesis.pending || window.speechSynthesis.speaking) {
                console.log('[TTS] Confirmed: synthesis is active');
            } else {
                console.warn('[TTS] Warning: synthesis not active after speak() — may need user gesture');
            }
        }, 300);

    }, 150);
}

// ── Legacy single-crop display (kept for backward compatibility) ──────────────
function displayRecommendation(crop, inputs, explanation) {
    // Wrap in the new multi-crop format with just one result
    const fakeResults = [{ cropKey: Object.keys(cropDatabase).find(k => cropDatabase[k] === crop) || 'rice', crop, scores: explanation.featureScores, confidence: explanation.confidence }];
    displayAllRecommendations(fakeResults, inputs);
}
