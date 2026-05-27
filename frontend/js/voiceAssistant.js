/* ═══════════════════════════════════════════════════════════
   CropXAI – Voice Assistant Module
   Self-contained: no conflicts with Disease Detection or app.js
   Exposes: window.openVoiceAssistant(), window.initVoiceAssistant()
═══════════════════════════════════════════════════════════ */

'use strict';

// ── State ─────────────────────────────────────────────────────────────────────
let va_recognition  = null;
let va_active       = false;   // mic is open
let va_shouldRestart = false;  // auto-restart flag

// ── Keyword maps ──────────────────────────────────────────────────────────────
const VA_SOIL_MAP = {
    'black soil': 'black', 'black cotton soil': 'black', 'regur': 'black', 'black': 'black',
    'red soil': 'red', 'red laterite': 'red', 'red loam': 'red', 'red': 'red',
    'sandy soil': 'sandy', 'sand soil': 'sandy', 'sandy loam': 'sandy', 'sandy': 'sandy', 'sand': 'sandy',
    'clay soil': 'clay', 'clayey soil': 'clay', 'heavy clay': 'clay', 'clay': 'clay',
    'loamy soil': 'loamy', 'loam soil': 'loamy', 'loam': 'loamy', 'loamy': 'loamy',
    'alluvial soil': 'alluvial', 'alluvium': 'alluvial', 'alluvial': 'alluvial',
    'river soil': 'alluvial', 'delta soil': 'alluvial'
};

const VA_CLIMATE_MAP = {
    'tropical': 'tropical', 'tropics': 'tropical',
    'subtropical': 'subtropical', 'sub tropical': 'subtropical', 'sub-tropical': 'subtropical',
    'temperate': 'temperate',
    'arid': 'arid', 'dry': 'arid', 'desert': 'arid'
};

const VA_SEASON_MAP = {
    'kharif': 'kharif', 'monsoon': 'kharif', 'rainy season': 'kharif',
    'rabi': 'rabi', 'winter': 'rabi', 'winter season': 'rabi',
    'zaid': 'zaid', 'summer': 'zaid', 'summer season': 'zaid'
};

const VA_SECTION_MAP = {
    'dashboard': 'dashboard', 'home': 'dashboard',
    'crop prediction': 'crop-prediction', 'crop': 'crop-prediction', 'prediction': 'crop-prediction',
    'soil analysis': 'soil-analysis', 'soil': 'soil-analysis',
    'weather': 'weather',
    'disease detection': 'disease-detection', 'disease': 'disease-detection', 'detect disease': 'disease-detection'
};

const VA_LOCATIONS = [
    'hyderabad','warangal','nizamabad','karimnagar','khammam','nalgonda','adilabad',
    'mahbubnagar','medak','rangareddy','visakhapatnam','vijayawada','guntur','tirupati',
    'kurnool','kadapa','anantapur','nellore','rajahmundry','eluru','ongole','srikakulam',
    'vizianagaram','chittoor','mumbai','pune','nagpur','nashik','aurangabad','solapur',
    'delhi','noida','gurgaon','faridabad','ghaziabad','bangalore','mysore','hubli',
    'mangalore','belgaum','davangere','chennai','coimbatore','madurai','trichy','salem',
    'tirunelveli','kolkata','howrah','durgapur','asansol','siliguri','ahmedabad','surat',
    'vadodara','rajkot','bhavnagar','jaipur','jodhpur','udaipur','kota','ajmer','bikaner',
    'lucknow','kanpur','agra','varanasi','allahabad','meerut','bareilly','patna','gaya',
    'muzaffarpur','bhagalpur','bhopal','indore','jabalpur','gwalior','ujjain','chandigarh',
    'amritsar','ludhiana','jalandhar','bhubaneswar','cuttack','rourkela','ranchi',
    'jamshedpur','dhanbad','guwahati','dibrugarh','thiruvananthapuram','kochi','kozhikode',
    'thrissur','dehradun','haridwar','shimla','dharamsala','srinagar','jammu','raipur',
    'bilaspur','panaji','margao'
];

// ── Init ──────────────────────────────────────────────────────────────────────
function initVoiceAssistant() {
    _setupRecognition();
    _bindModalClose();
    _bindStartStop();
    console.log('[VoiceAssistant] Module initialised');
}

// ── Open modal ────────────────────────────────────────────────────────────────
function openVoiceAssistant() {
    const modal = document.getElementById('vaModal');
    if (modal) {
        modal.style.display = 'flex';
        // Clear transcript on open
        const ts = document.getElementById('vaTranscript');
        if (ts) ts.innerHTML = '';
        _setStatus('ready');
    }
}

// ── Close modal ───────────────────────────────────────────────────────────────
function closeVoiceAssistant() {
    const modal = document.getElementById('vaModal');
    if (modal) modal.style.display = 'none';
    _stopListening();
}

// ── Setup Web Speech API ──────────────────────────────────────────────────────
function _setupRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
        console.warn('[VoiceAssistant] Speech Recognition not supported in this browser.');
        // Show unsupported message in modal when opened
        const startBtn = document.getElementById('vaStartBtn');
        if (startBtn) {
            startBtn.addEventListener('click', () => {
                _setStatus('unsupported');
                _logTranscript('⚠️ Speech recognition is not supported in this browser. Please use Chrome or Edge.', 'error');
            });
        }
        return;
    }

    va_recognition = new SpeechRecognition();
    va_recognition.continuous      = true;
    va_recognition.interimResults  = true;
    va_recognition.maxAlternatives = 3;
    va_recognition.lang            = 'en-IN';

    va_recognition.onstart = () => {
        va_active = true;
        _setStatus('listening');
        _updateMicBtn(true);
        console.log('[VoiceAssistant] Listening started');
    };

    va_recognition.onresult = (event) => {
        let interim = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
            const result = event.results[i];
            if (result.isFinal) {
                const text = result[0].transcript.trim();
                console.log('[VoiceAssistant] Final:', text, '| conf:', result[0].confidence?.toFixed(2));
                _processCommand(text);
            } else {
                interim = result[0].transcript;
            }
        }
        if (interim) {
            _setStatus('interim', interim);
        }
    };

    va_recognition.onerror = (event) => {
        console.error('[VoiceAssistant] Error:', event.error);
        if (event.error === 'no-speech') {
            _setStatus('no-speech');
            return;
        }
        if (event.error === 'aborted') return;
        if (event.error === 'not-allowed') {
            _setStatus('denied');
            _logTranscript('🚫 Microphone access denied. Please allow microphone in browser settings.', 'error');
            va_shouldRestart = false;
            va_active = false;
            _updateMicBtn(false);
            return;
        }
        _setStatus('error', event.error);
        _logTranscript('⚠️ Error: ' + event.error, 'error');
    };

    va_recognition.onend = () => {
        va_active = false;
        console.log('[VoiceAssistant] Recognition ended. shouldRestart =', va_shouldRestart);
        if (va_shouldRestart) {
            setTimeout(() => {
                if (va_shouldRestart) {
                    try { va_recognition.start(); }
                    catch(e) { console.warn('[VoiceAssistant] Restart error:', e.message); }
                }
            }, 300);
        } else {
            _setStatus('ready');
            _updateMicBtn(false);
        }
    };
}

// ── Bind start/stop buttons ───────────────────────────────────────────────────
function _bindStartStop() {
    const startBtn = document.getElementById('vaStartBtn');
    const stopBtn  = document.getElementById('vaStopBtn');

    if (startBtn) {
        startBtn.addEventListener('click', _startListening);
    }
    if (stopBtn) {
        stopBtn.addEventListener('click', _stopListening);
    }
}

function _startListening() {
    if (!va_recognition) {
        _setStatus('unsupported');
        _logTranscript('⚠️ Speech recognition not supported. Use Chrome or Edge.', 'error');
        return;
    }
    if (va_active) return;
    va_shouldRestart = true;
    try {
        va_recognition.start();
    } catch(e) {
        console.warn('[VoiceAssistant] Start error:', e.message);
    }
}

function _stopListening() {
    va_shouldRestart = false;
    va_active = false;
    if (va_recognition) {
        try { va_recognition.stop(); } catch(e) {}
    }
    _setStatus('ready');
    _updateMicBtn(false);
}

// ── Bind modal close ──────────────────────────────────────────────────────────
function _bindModalClose() {
    // Close button inside modal
    const closeBtn = document.getElementById('vaModalClose');
    if (closeBtn) closeBtn.addEventListener('click', closeVoiceAssistant);

    // Click outside modal backdrop
    const modal = document.getElementById('vaModal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeVoiceAssistant();
        });
    }

    // Escape key closes modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const modal = document.getElementById('vaModal');
            if (modal && modal.style.display !== 'none') closeVoiceAssistant();
        }
    });
}

// ── Update mic button state ───────────────────────────────────────────────────
function _updateMicBtn(listening) {
    const startBtn     = document.getElementById('vaStartBtn');
    const stopBtn      = document.getElementById('vaStopBtn');
    const micRing      = document.getElementById('vaMicRing');
    const topbarVoice  = document.getElementById('topbarVoiceBtn');

    if (startBtn)    startBtn.style.display = listening ? 'none' : 'flex';
    if (stopBtn)     stopBtn.style.display  = listening ? 'flex' : 'none';
    if (micRing)     micRing.classList.toggle('va-mic-active', listening);
    if (topbarVoice) topbarVoice.classList.toggle('va-topbar-active', listening);
}

// ── Status messages ───────────────────────────────────────────────────────────
const VA_STATUS_CONFIG = {
    ready:       { icon: '🎤', text: 'Ready to listen — press the mic button',  cls: '' },
    listening:   { icon: '🔴', text: 'Listening... speak your command',          cls: 'va-status-listening' },
    processing:  { icon: '⚙️', text: 'Processing command...',                    cls: 'va-status-processing' },
    success:     { icon: '✅', text: 'Command executed successfully',             cls: 'va-status-success' },
    'no-speech': { icon: '🔇', text: 'No speech detected — still listening...',  cls: 'va-status-warn' },
    denied:      { icon: '🚫', text: 'Microphone access denied',                 cls: 'va-status-error' },
    error:       { icon: '⚠️', text: 'Recognition error — try again',            cls: 'va-status-error' },
    unsupported: { icon: '⚠️', text: 'Speech recognition not supported',         cls: 'va-status-error' },
    notunderstood:{ icon: '❓', text: 'Command not understood — try again',       cls: 'va-status-warn' }
};

function _setStatus(key, extra) {
    const el = document.getElementById('vaStatus');
    if (!el) return;
    const cfg = VA_STATUS_CONFIG[key] || VA_STATUS_CONFIG.ready;

    // Remove all state classes
    el.className = 'va-status-bar';
    if (cfg.cls) el.classList.add(cfg.cls);

    const text = (key === 'interim' && extra)
        ? `🎙️ "${extra}"`
        : cfg.text + (extra && key !== 'interim' ? ': ' + extra : '');

    el.innerHTML = `<span class="va-status-icon">${cfg.icon}</span><span class="va-status-text">${text}</span>`;
}

// ── Transcript log ────────────────────────────────────────────────────────────
function _logTranscript(msg, type) {
    const ts = document.getElementById('vaTranscript');
    if (!ts) return;
    const line = document.createElement('div');
    line.className = 'va-log-line' + (type ? ' va-log-' + type : '');
    line.textContent = msg;
    ts.appendChild(line);
    ts.scrollTop = ts.scrollHeight;
}

// ── Helper: set dropdown ──────────────────────────────────────────────────────
function _setDropdown(id, value) {
    const el = document.getElementById(id);
    if (!el) return false;
    const exists = Array.from(el.options).some(o => o.value === value);
    if (!exists) return false;
    el.value = value;
    _flashField(el);
    return true;
}

// ── Helper: set input ─────────────────────────────────────────────────────────
function _setInput(id, value) {
    const el = document.getElementById(id);
    if (!el) return false;
    el.value = value;
    _flashField(el);
    return true;
}

// ── Helper: flash field green ─────────────────────────────────────────────────
function _flashField(el) {
    el.style.transition  = 'box-shadow 0.2s, border-color 0.2s';
    el.style.borderColor = '#48bb78';
    el.style.boxShadow   = '0 0 0 3px rgba(72,187,120,0.35)';
    setTimeout(() => { el.style.borderColor = ''; el.style.boxShadow = ''; }, 1800);
}

// ── Helper: capitalise ────────────────────────────────────────────────────────
function _capitalise(str) {
    return str.replace(/\b\w/g, c => c.toUpperCase());
}

// ── Core command processor ────────────────────────────────────────────────────
function _processCommand(raw) {
    const text = raw.toLowerCase().trim();
    console.log('[VoiceAssistant] Processing:', text);

    _setStatus('processing');
    _logTranscript('🎤 "' + raw + '"');

    // ── 1. NAVIGATION ─────────────────────────────────────────────────────────
    const navPatterns = [
        /(?:go to|open|show|navigate to|switch to)\s+(.+)/,
        /(?:take me to)\s+(.+)/
    ];
    for (const pat of navPatterns) {
        const m = text.match(pat);
        if (m) {
            const target = m[1].trim().replace(/[.,!?]$/, '');
            for (const [keyword, sectionId] of Object.entries(VA_SECTION_MAP)) {
                if (target.includes(keyword) || keyword.includes(target)) {
                    const linkEl = document.querySelector(`[data-section="${sectionId}"]`);
                    if (typeof switchSection === 'function') {
                        switchSection(sectionId, linkEl);
                        _setStatus('success');
                        _logTranscript('✅ Navigated to: ' + sectionId.replace('-', ' '));
                        return;
                    }
                }
            }
        }
    }
    // Direct section name scan
    for (const [keyword, sectionId] of Object.entries(VA_SECTION_MAP)) {
        if (text.includes(keyword)) {
            const linkEl = document.querySelector(`[data-section="${sectionId}"]`);
            if (typeof switchSection === 'function') {
                switchSection(sectionId, linkEl);
                _setStatus('success');
                _logTranscript('✅ Navigated to: ' + sectionId.replace('-', ' '));
                return;
            }
        }
    }

    // ── 2. SOIL TYPE ──────────────────────────────────────────────────────────
    const soilPatterns = [
        /(?:select|choose|set|use|pick|change to|soil (?:type )?(?:is|to)?)\s+(.+?)\s*(?:soil)?$/,
        /(.+?)\s+soil\b/,
        /soil\s+(?:type\s+)?(?:is|to|=)\s+(.+)/
    ];
    let soilMatched = false;
    for (const pat of soilPatterns) {
        const m = text.match(pat);
        if (m) {
            const candidate = m[1].trim();
            let soilVal = VA_SOIL_MAP[candidate] || VA_SOIL_MAP[candidate + ' soil'];
            if (!soilVal) {
                soilVal = Object.entries(VA_SOIL_MAP).find(([k]) => k.includes(candidate) || candidate.includes(k))?.[1];
            }
            if (soilVal && _setDropdown('soilType', soilVal)) {
                _setStatus('success');
                _logTranscript('✅ Soil type set to: ' + soilVal);
                soilMatched = true;
                break;
            }
        }
    }
    if (!soilMatched) {
        for (const [keyword, val] of Object.entries(VA_SOIL_MAP)) {
            if (text.includes(keyword) && _setDropdown('soilType', val)) {
                _setStatus('success');
                _logTranscript('✅ Soil type set to: ' + val);
                soilMatched = true;
                break;
            }
        }
    }
    if (soilMatched) return;

    // ── 3. LOCATION ───────────────────────────────────────────────────────────
    if (/use\s+my\s+(current\s+)?location|detect\s+(my\s+)?location|auto\s+location|find\s+my\s+location|where\s+am\s+i|current\s+location/.test(text)) {
        _logTranscript('📍 Detecting GPS location...');
        _setStatus('processing');
        if (typeof window.voiceDetectLocation === 'function') {
            window.voiceDetectLocation();
            _setStatus('success');
            _logTranscript('✅ GPS location detection started');
        } else {
            const btn = document.getElementById('detectLocBtn');
            if (btn) { btn.click(); _setStatus('success'); _logTranscript('✅ Location detection triggered'); }
        }
        return;
    }

    const locPatterns = [
        /(?:set\s+)?location\s+(?:to|is|=)\s+(.+)/,
        /my\s+location\s+(?:is|=)\s+(.+)/,
        /(?:i\s+am\s+(?:in|from)|from|in\s+city)\s+(.+)/
    ];
    for (const pat of locPatterns) {
        const m = text.match(pat);
        if (m) {
            const place = m[1].trim().replace(/[.,!?]$/, '');
            _setInput('location', _capitalise(place));
            _setStatus('success');
            _logTranscript('✅ Location set to: ' + _capitalise(place));
            return;
        }
    }
    for (const city of VA_LOCATIONS) {
        if (text.includes(city)) {
            _setInput('location', _capitalise(city));
            _setStatus('success');
            _logTranscript('✅ Location set to: ' + _capitalise(city));
            return;
        }
    }

    // ── 4. CLIMATE ────────────────────────────────────────────────────────────
    const climatePatterns = [
        /(?:set\s+)?climate\s+(?:to|is|=)\s+(.+)/,
        /(?:choose|select|pick)\s+(.+?)\s+climate/,
        /climate\s+(.+)/
    ];
    for (const pat of climatePatterns) {
        const m = text.match(pat);
        if (m) {
            const candidate = m[1].trim();
            const val = VA_CLIMATE_MAP[candidate]
                || Object.entries(VA_CLIMATE_MAP).find(([k]) => candidate.includes(k) || k.includes(candidate))?.[1];
            if (val && _setDropdown('climate', val)) {
                _setStatus('success');
                _logTranscript('✅ Climate set to: ' + val);
                return;
            }
        }
    }
    for (const [keyword, val] of Object.entries(VA_CLIMATE_MAP)) {
        if (text.includes(keyword) && _setDropdown('climate', val)) {
            _setStatus('success');
            _logTranscript('✅ Climate set to: ' + val);
            return;
        }
    }

    // ── 5. SEASON ─────────────────────────────────────────────────────────────
    const seasonPatterns = [
        /(?:set\s+)?season\s+(?:to|is|=)\s+(.+)/,
        /(?:choose|select|pick)\s+(.+?)\s+season/
    ];
    for (const pat of seasonPatterns) {
        const m = text.match(pat);
        if (m) {
            const candidate = m[1].trim();
            const val = VA_SEASON_MAP[candidate]
                || Object.entries(VA_SEASON_MAP).find(([k]) => candidate.includes(k) || k.includes(candidate))?.[1];
            if (val && _setDropdown('season', val)) {
                _setStatus('success');
                _logTranscript('✅ Season set to: ' + val);
                return;
            }
        }
    }
    for (const [keyword, val] of Object.entries(VA_SEASON_MAP)) {
        if (text.includes(keyword) && _setDropdown('season', val)) {
            _setStatus('success');
            _logTranscript('✅ Season set to: ' + val);
            return;
        }
    }

    // ── 6. AREA ───────────────────────────────────────────────────────────────
    const areaMatch = text.match(/(?:set\s+)?area\s+(?:to|is|=)?\s*([\d.]+)|(?:farm\s+is|my\s+farm)\s+([\d.]+)\s*acres?|([\d.]+)\s*acres?/);
    if (areaMatch) {
        const acres = areaMatch[1] || areaMatch[2] || areaMatch[3];
        _setInput('area', parseFloat(acres));
        _setStatus('success');
        _logTranscript('✅ Area set to: ' + acres + ' acres');
        return;
    }

    // ── 7. GET RECOMMENDATION ─────────────────────────────────────────────────
    if (/recommend|suggest|get crop|which crop|best crop/.test(text)) {
        _logTranscript('🌾 Getting crop recommendation...');
        _setStatus('processing');
        setTimeout(() => {
            const btn = document.getElementById('recommendBtn');
            if (btn) {
                btn.click();
                _setStatus('success');
                _logTranscript('✅ Crop recommendation triggered');
                closeVoiceAssistant();
            }
        }, 600);
        return;
    }

    // ── 8. AUTO-DETECT SOIL PARAMS ────────────────────────────────────────────
    if (/auto\s*detect|auto\s*fill|fill\s*values|detect\s*values/.test(text)) {
        _logTranscript('🔍 Auto-detecting soil parameters...');
        _setStatus('processing');
        setTimeout(() => {
            ['autoPhBtn','autoNBtn','autoPBtn','autoKBtn'].forEach((id, i) => {
                setTimeout(() => {
                    const btn = document.getElementById(id);
                    if (btn) btn.click();
                }, i * 200);
            });
            _setStatus('success');
            _logTranscript('✅ Soil parameters auto-detected');
        }, 400);
        return;
    }

    // ── 9. PROFILE ────────────────────────────────────────────────────────────
    if (/profile|account|my\s+info/.test(text)) {
        _logTranscript('👤 Opening profile...');
        setTimeout(() => {
            if (typeof showProfile === 'function') showProfile();
            _setStatus('success');
            _logTranscript('✅ Profile opened');
        }, 400);
        return;
    }

    // ── 10. CLOSE / STOP ──────────────────────────────────────────────────────
    if (/close|stop|exit|cancel|quit/.test(text)) {
        _logTranscript('👋 Closing voice assistant...');
        setTimeout(closeVoiceAssistant, 600);
        return;
    }

    // ── 11. HELP ──────────────────────────────────────────────────────────────
    if (/help|what can|commands/.test(text)) {
        _setStatus('ready');
        _logTranscript('💬 Commands: "go to crop prediction", "set location to Hyderabad", "select black soil", "set climate to tropical", "set season to kharif", "set area to 5 acres", "get recommendation", "auto detect", "show profile"');
        return;
    }

    // ── Not understood ────────────────────────────────────────────────────────
    _setStatus('notunderstood');
    _logTranscript('❓ Not understood. Say "help" for a list of commands.');
}

// ── Expose public API ─────────────────────────────────────────────────────────
window.initVoiceAssistant  = initVoiceAssistant;
window.openVoiceAssistant  = openVoiceAssistant;
window.closeVoiceAssistant = closeVoiceAssistant;
