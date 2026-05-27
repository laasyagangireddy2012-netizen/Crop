/* ═══════════════════════════════════════════════════════════
   CropXAI – Automatic Location Detection Module
   Uses: navigator.geolocation + Nominatim reverse geocoding
   (OpenStreetMap – free, no API key required)
═══════════════════════════════════════════════════════════ */

'use strict';

// ── Public state ──────────────────────────────────────────────────────────────
window.CropLocation = {
    city:    null,
    state:   null,
    country: null,
    lat:     null,
    lon:     null,
    raw:     null   // full Nominatim address object
};

// ── Status codes ──────────────────────────────────────────────────────────────
const LOC_STATUS = {
    IDLE:       'idle',
    DETECTING:  'detecting',
    SUCCESS:    'success',
    DENIED:     'denied',
    ERROR:      'error'
};

let _currentStatus = LOC_STATUS.IDLE;

// ── DOM helpers ───────────────────────────────────────────────────────────────
function _el(id) { return document.getElementById(id); }

function _setLocationField(value) {
    const input = _el('location');
    if (!input) return;
    input.value = value;
    // Flash green border (reuse app.js flashField if available, else inline)
    if (typeof flashField === 'function') {
        flashField(input);
    } else {
        input.style.transition = 'box-shadow 0.2s, border-color 0.2s';
        input.style.borderColor = '#48bb78';
        input.style.boxShadow   = '0 0 0 3px rgba(72,187,120,0.35)';
        setTimeout(() => { input.style.borderColor = ''; input.style.boxShadow = ''; }, 2000);
    }
}

// ── Update the location status badge in the UI ────────────────────────────────
function _setLocStatus(status, message) {
    _currentStatus = status;
    const badge  = _el('locStatusBadge');
    const icon   = _el('locStatusIcon');
    const text   = _el('locStatusText');
    const detect = _el('detectLocBtn');
    const manual = _el('manualLocWrap');

    if (!badge) return;

    // Remove all state classes
    badge.className = 'loc-status-badge';

    switch (status) {
        case LOC_STATUS.DETECTING:
            badge.classList.add('loc-detecting');
            if (icon) icon.textContent = '⏳';
            if (text) text.textContent = message || 'Detecting location...';
            if (detect) { detect.disabled = true; detect.textContent = '⏳ Detecting...'; }
            break;

        case LOC_STATUS.SUCCESS:
            badge.classList.add('loc-success');
            if (icon) icon.textContent = '📍';
            if (text) text.textContent = message || 'Location detected';
            if (detect) { detect.disabled = false; detect.textContent = '🔄 Re-detect'; }
            if (manual) manual.style.display = 'none';
            break;

        case LOC_STATUS.DENIED:
            badge.classList.add('loc-denied');
            if (icon) icon.textContent = '🚫';
            if (text) text.textContent = message || 'Location access denied';
            if (detect) { detect.disabled = false; detect.textContent = '📍 Try Again'; }
            if (manual) manual.style.display = 'flex';
            break;

        case LOC_STATUS.ERROR:
            badge.classList.add('loc-error');
            if (icon) icon.textContent = '⚠️';
            if (text) text.textContent = message || 'Unable to fetch location';
            if (detect) { detect.disabled = false; detect.textContent = '🔄 Retry'; }
            if (manual) manual.style.display = 'flex';
            break;

        default: // IDLE
            badge.classList.add('loc-idle');
            if (icon) icon.textContent = '📍';
            if (text) text.textContent = message || 'Location not set';
            if (detect) { detect.disabled = false; detect.textContent = '📍 Detect My Location'; }
    }

    console.log('[Location] Status →', status, '|', message);
}

// ── Also update the topbar location chip ─────────────────────────────────────
function _updateTopbarLocation(label) {
    const chip = _el('topbarLocation');
    const wrap = _el('topbarLocationChip');
    if (chip) chip.textContent = '📍 ' + label;
    if (wrap) wrap.style.display = 'flex';
    // Update weather section location display
    const wLoc = _el('weatherLocation');
    if (wLoc) wLoc.textContent = label;
}

// ── Reverse geocode lat/lon → city, state ─────────────────────────────────────
async function _reverseGeocode(lat, lon) {
    console.log('[Location] Reverse geocoding:', lat, lon);

    // Nominatim (OpenStreetMap) – free, no key needed
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1`;

    const response = await fetch(url, {
        headers: { 'Accept-Language': 'en', 'User-Agent': 'CropXAI/1.0' }
    });

    if (!response.ok) throw new Error('Geocoding API error: ' + response.status);

    const data = await response.json();
    console.log('[Location] Nominatim response:', data);

    const addr = data.address || {};

    // Extract best city-level name (priority order)
    const city =
        addr.city         ||
        addr.town         ||
        addr.village      ||
        addr.county       ||
        addr.district     ||
        addr.suburb       ||
        addr.municipality ||
        'Unknown';

    const state   = addr.state   || addr.region || '';
    const country = addr.country || '';

    return { city, state, country, raw: addr, display: data.display_name };
}

// ── Core: request geolocation and fill the form ───────────────────────────────
function detectLocation(options = {}) {
    const { silent = false, onSuccess = null, onError = null } = options;

    console.log('[Location] Starting detection. silent =', silent);

    if (!navigator.geolocation) {
        const msg = 'Geolocation is not supported by this browser.';
        console.warn('[Location]', msg);
        _setLocStatus(LOC_STATUS.ERROR, msg);
        if (onError) onError(msg);
        return;
    }

    _setLocStatus(LOC_STATUS.DETECTING, 'Detecting your location...');

    navigator.geolocation.getCurrentPosition(
        // ── SUCCESS ──────────────────────────────────────────────────────
        async (position) => {
            const { latitude: lat, longitude: lon, accuracy } = position.coords;
            console.log('[Location] GPS coords:', lat, lon, '| accuracy:', accuracy, 'm');

            window.CropLocation.lat = lat;
            window.CropLocation.lon = lon;

            try {
                _setLocStatus(LOC_STATUS.DETECTING, 'Fetching city name...');
                const geo = await _reverseGeocode(lat, lon);

                window.CropLocation.city    = geo.city;
                window.CropLocation.state   = geo.state;
                window.CropLocation.country = geo.country;
                window.CropLocation.raw     = geo.raw;

                const label = geo.state
                    ? `${geo.city}, ${geo.state}`
                    : geo.city;

                console.log('[Location] Resolved:', label);

                // Fill the form field
                _setLocationField(label);

                // Update UI
                _setLocStatus(LOC_STATUS.SUCCESS, '📍 ' + label);
                _updateTopbarLocation(label);

                // Store in session for persistence
                sessionStorage.setItem('cropxai_location', JSON.stringify({
                    city: geo.city, state: geo.state, country: geo.country,
                    lat, lon, label
                }));

                if (onSuccess) onSuccess({ lat, lon, ...geo, label });

            } catch (err) {
                console.error('[Location] Reverse geocode failed:', err);
                // Fallback: show raw coords
                const fallback = `${lat.toFixed(3)}°N, ${lon.toFixed(3)}°E`;
                _setLocationField(fallback);
                _setLocStatus(LOC_STATUS.ERROR, 'City lookup failed — coords used');
                if (onError) onError(err.message);
            }
        },

        // ── ERROR ─────────────────────────────────────────────────────────
        (err) => {
            console.error('[Location] Geolocation error:', err.code, err.message);

            let msg;
            switch (err.code) {
                case err.PERMISSION_DENIED:
                    msg = 'Location access denied. Please allow location or enter manually.';
                    _setLocStatus(LOC_STATUS.DENIED, msg);
                    break;
                case err.POSITION_UNAVAILABLE:
                    msg = 'Location unavailable. Check GPS/network.';
                    _setLocStatus(LOC_STATUS.ERROR, msg);
                    break;
                case err.TIMEOUT:
                    msg = 'Location request timed out. Try again.';
                    _setLocStatus(LOC_STATUS.ERROR, msg);
                    break;
                default:
                    msg = 'Unable to fetch location.';
                    _setLocStatus(LOC_STATUS.ERROR, msg);
            }

            if (!silent) {
                // Show manual input fallback
                const manual = _el('manualLocWrap');
                if (manual) manual.style.display = 'flex';
            }

            if (onError) onError(msg);
        },

        // ── OPTIONS ───────────────────────────────────────────────────────
        {
            enableHighAccuracy: true,
            timeout:            12000,   // 12 s
            maximumAge:         300000   // cache 5 min
        }
    );
}

// ── Restore location from session (page reload) ───────────────────────────────
function restoreLocation() {
    const stored = sessionStorage.getItem('cropxai_location');
    if (!stored) return false;
    try {
        const loc = JSON.parse(stored);
        window.CropLocation.city    = loc.city;
        window.CropLocation.state   = loc.state;
        window.CropLocation.country = loc.country;
        window.CropLocation.lat     = loc.lat;
        window.CropLocation.lon     = loc.lon;

        _setLocationField(loc.label);
        _setLocStatus(LOC_STATUS.SUCCESS, '📍 ' + loc.label + ' (restored)');
        _updateTopbarLocation(loc.label);
        console.log('[Location] Restored from session:', loc.label);
        return true;
    } catch (e) {
        return false;
    }
}

// ── Auto-detect on page load ──────────────────────────────────────────────────
function initLocationDetection() {
    console.log('[Location] Initialising...');

    // Wire the detect button
    const btn = _el('detectLocBtn');
    if (btn) {
        btn.addEventListener('click', () => {
            console.log('[Location] Manual detect triggered');
            detectLocation();
        });
    }

    // Wire the manual input — update CropLocation when user types
    const input = _el('location');
    if (input) {
        input.addEventListener('input', () => {
            const val = input.value.trim();
            if (val.length > 1) {
                window.CropLocation.city = val;
                _setLocStatus(LOC_STATUS.SUCCESS, '📍 ' + val + ' (manual)');
                _updateTopbarLocation(val);
            }
        });
    }

    // Try to restore from session first (avoids re-requesting permission on reload)
    if (restoreLocation()) return;

    // Auto-detect silently on load
    detectLocation({ silent: true });
}

// ── Voice command hook: "use my location" / "detect my location" ──────────────
window.voiceDetectLocation = function() {
    console.log('[Location] Voice-triggered detection');
    detectLocation({
        onSuccess: (loc) => {
            if (typeof voiceLog === 'function') {
                voiceLog('✅ Location detected: ' + loc.label);
            }
            if (typeof setVoiceStatus === 'function') {
                setVoiceStatus('📍 ' + loc.label, '#2b6cb0');
            }
        },
        onError: (msg) => {
            if (typeof voiceLog === 'function') voiceLog('⚠️ ' + msg);
            if (typeof setVoiceStatus === 'function') setVoiceStatus('⚠️ ' + msg, '#c53030');
        }
    });
};

// ── Kick off when DOM is ready ────────────────────────────────────────────────
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLocationDetection);
} else {
    initLocationDetection();
}


/* ═══════════════════════════════════════════════════════════
   CropXAI – Climate Auto-Detection from Location
   Hooks into the location module; no external dependencies
═══════════════════════════════════════════════════════════ */

// ── Climate mapping: city keywords → climate value ────────────────────────────
// Keys are lowercase substrings matched against city OR state names.
// More specific entries should come first (city before state).
const CLIMATE_CITY_MAP = {
    // ── Arid / Semi-Arid ──────────────────────────────────────────────────────
    'rajasthan':    'arid',
    'jodhpur':      'arid',
    'bikaner':      'arid',
    'jaisalmer':    'arid',
    'barmer':       'arid',
    'churu':        'arid',
    'nagaur':       'arid',
    'kutch':        'arid',
    'bhuj':         'arid',
    'leh':          'arid',
    'ladakh':       'arid',

    // ── Tropical Humid ────────────────────────────────────────────────────────
    'kerala':       'tropical',
    'thiruvananthapuram': 'tropical',
    'kochi':        'tropical',
    'kozhikode':    'tropical',
    'thrissur':     'tropical',
    'kannur':       'tropical',
    'kollam':       'tropical',
    'goa':          'tropical',
    'panaji':       'tropical',
    'margao':       'tropical',
    'andaman':      'tropical',
    'nicobar':      'tropical',
    'lakshadweep':  'tropical',
    'assam':        'tropical',
    'guwahati':     'tropical',
    'dibrugarh':    'tropical',
    'silchar':      'tropical',
    'meghalaya':    'tropical',
    'shillong':     'tropical',
    'manipur':      'tropical',
    'imphal':       'tropical',
    'mizoram':      'tropical',
    'aizawl':       'tropical',
    'nagaland':     'tropical',
    'kohima':       'tropical',
    'tripura':      'tropical',
    'agartala':     'tropical',
    'arunachal':    'tropical',
    'itanagar':     'tropical',
    'sikkim':       'tropical',
    'gangtok':      'tropical',

    // ── Subtropical ───────────────────────────────────────────────────────────
    'hyderabad':    'subtropical',
    'telangana':    'subtropical',
    'warangal':     'subtropical',
    'karimnagar':   'subtropical',
    'nizamabad':    'subtropical',
    'khammam':      'subtropical',
    'nalgonda':     'subtropical',
    'andhra':       'subtropical',
    'visakhapatnam':'subtropical',
    'vijayawada':   'subtropical',
    'guntur':       'subtropical',
    'tirupati':     'subtropical',
    'kurnool':      'subtropical',
    'nellore':      'subtropical',
    'rajahmundry':  'subtropical',
    'ongole':       'subtropical',
    'kadapa':       'subtropical',
    'anantapur':    'subtropical',
    'chittoor':     'subtropical',
    'karnataka':    'subtropical',
    'bangalore':    'subtropical',
    'bengaluru':    'subtropical',
    'mysore':       'subtropical',
    'hubli':        'subtropical',
    'mangalore':    'subtropical',
    'belgaum':      'subtropical',
    'davangere':    'subtropical',
    'shimoga':      'subtropical',
    'tumkur':       'subtropical',
    'maharashtra':  'subtropical',
    'mumbai':       'subtropical',
    'pune':         'subtropical',
    'nagpur':       'subtropical',
    'nashik':       'subtropical',
    'aurangabad':   'subtropical',
    'solapur':      'subtropical',
    'kolhapur':     'subtropical',
    'amravati':     'subtropical',
    'tamil':        'subtropical',
    'chennai':      'subtropical',
    'coimbatore':   'subtropical',
    'madurai':      'subtropical',
    'trichy':       'subtropical',
    'tiruchirappalli': 'subtropical',
    'salem':        'subtropical',
    'tirunelveli':  'subtropical',
    'vellore':      'subtropical',
    'erode':        'subtropical',
    'gujarat':      'subtropical',
    'ahmedabad':    'subtropical',
    'surat':        'subtropical',
    'vadodara':     'subtropical',
    'rajkot':       'subtropical',
    'bhavnagar':    'subtropical',
    'madhya':       'subtropical',
    'bhopal':       'subtropical',
    'indore':       'subtropical',
    'jabalpur':     'subtropical',
    'gwalior':      'subtropical',
    'ujjain':       'subtropical',
    'chhattisgarh': 'subtropical',
    'raipur':       'subtropical',
    'bilaspur':     'subtropical',
    'odisha':       'subtropical',
    'bhubaneswar':  'subtropical',
    'cuttack':      'subtropical',
    'rourkela':     'subtropical',
    'west bengal':  'subtropical',
    'kolkata':      'subtropical',
    'howrah':       'subtropical',
    'durgapur':     'subtropical',
    'asansol':      'subtropical',
    'siliguri':     'subtropical',
    'jharkhand':    'subtropical',
    'ranchi':       'subtropical',
    'jamshedpur':   'subtropical',
    'dhanbad':      'subtropical',
    'bihar':        'subtropical',
    'patna':        'subtropical',
    'gaya':         'subtropical',
    'muzaffarpur':  'subtropical',
    'uttar pradesh':'subtropical',
    'lucknow':      'subtropical',
    'kanpur':       'subtropical',
    'agra':         'subtropical',
    'varanasi':     'subtropical',
    'allahabad':    'subtropical',
    'prayagraj':    'subtropical',
    'meerut':       'subtropical',
    'bareilly':     'subtropical',
    'delhi':        'subtropical',
    'noida':        'subtropical',
    'gurgaon':      'subtropical',
    'gurugram':     'subtropical',
    'faridabad':    'subtropical',
    'ghaziabad':    'subtropical',
    'haryana':      'subtropical',
    'punjab':       'subtropical',
    'chandigarh':   'subtropical',
    'amritsar':     'subtropical',
    'ludhiana':     'subtropical',
    'jalandhar':    'subtropical',

    // ── Temperate ─────────────────────────────────────────────────────────────
    'himachal':     'temperate',
    'shimla':       'temperate',
    'dharamsala':   'temperate',
    'manali':       'temperate',
    'kullu':        'temperate',
    'mandi':        'temperate',
    'solan':        'temperate',
    'uttarakhand':  'temperate',
    'dehradun':     'temperate',
    'haridwar':     'temperate',
    'mussoorie':    'temperate',
    'nainital':     'temperate',
    'rishikesh':    'temperate',
    'jammu':        'temperate',
    'kashmir':      'temperate',
    'srinagar':     'temperate',
    'kargil':       'temperate',
    'ooty':         'temperate',
    'kodaikanal':   'temperate',
    'munnar':       'temperate',
    'coorg':        'temperate',
    'darjeeling':   'temperate',
    'kalimpong':    'temperate'
};

// Climate display labels and icons
const CLIMATE_META = {
    tropical:    { label: 'Tropical',    icon: '🌴' },
    subtropical: { label: 'Subtropical', icon: '🌤️' },
    temperate:   { label: 'Temperate',   icon: '🍃' },
    arid:        { label: 'Arid',        icon: '🏜️' }
};

// ── Core: resolve climate from city + state strings ───────────────────────────
function resolveClimateFromLocation(city, state) {
    const haystack = [
        (city  || '').toLowerCase(),
        (state || '').toLowerCase()
    ];

    // Try each haystack string against every map key
    for (const text of haystack) {
        for (const [keyword, climate] of Object.entries(CLIMATE_CITY_MAP)) {
            if (text.includes(keyword)) {
                console.log('[ClimateAuto] Matched "' + keyword + '" in "' + text + '" → ' + climate);
                return climate;
            }
        }
    }

    // Fallback: subtropical covers most of peninsular India
    console.log('[ClimateAuto] No match for city="' + city + '" state="' + state + '" — defaulting to subtropical');
    return 'subtropical';
}

// ── Apply climate to the dropdown with animation ──────────────────────────────
function applyAutoClimate(climateValue, locationLabel, isManualOverride) {
    const select = document.getElementById('climate');
    const badge  = document.getElementById('climDetectBadge');
    const icon   = document.getElementById('climDetectIcon');
    const text   = document.getElementById('climDetectText');
    const clear  = document.getElementById('climDetectClear');

    if (!select) return;

    // Don't overwrite if user has already manually chosen something different
    // (unless this is a fresh auto-detect, not a restore)
    if (!isManualOverride && select.dataset.userModified === 'true') {
        console.log('[ClimateAuto] Skipping auto-fill — user has manually set climate');
        return;
    }

    const meta = CLIMATE_META[climateValue] || { label: climateValue, icon: '🌤️' };

    // Show loading state briefly
    _setClimateLoading(true);

    setTimeout(() => {
        _setClimateLoading(false);

        // Set the dropdown value
        select.value = climateValue;
        delete select.dataset.userModified;

        // Flash the select green
        select.style.transition = 'box-shadow 0.25s, border-color 0.25s';
        select.style.borderColor = '#48bb78';
        select.style.boxShadow   = '0 0 0 3px rgba(72,187,120,0.35)';
        select.classList.add('clim-auto-filled');
        setTimeout(() => {
            select.style.borderColor = '';
            select.style.boxShadow   = '';
        }, 2000);

        // Show the badge
        if (badge) {
            if (icon) icon.textContent = meta.icon;
            if (text) text.textContent = meta.label + ' — detected from ' + (locationLabel || 'your location');
            badge.style.display = 'flex';
            badge.classList.remove('clim-badge-hide');
            badge.classList.add('clim-badge-show');
        }

        // Wire the clear button (dismiss badge + allow manual re-select)
        if (clear) {
            clear.onclick = () => {
                badge.classList.add('clim-badge-hide');
                setTimeout(() => { badge.style.display = 'none'; }, 300);
            };
        }

        console.log('[ClimateAuto] Applied:', climateValue, 'for', locationLabel);
    }, 420); // slight delay so the loading indicator is visible
}

// ── Loading indicator on the climate select ───────────────────────────────────
function _setClimateLoading(loading) {
    const select = document.getElementById('climate');
    const badge  = document.getElementById('climDetectBadge');
    const icon   = document.getElementById('climDetectIcon');
    const text   = document.getElementById('climDetectText');

    if (!select) return;

    if (loading) {
        select.classList.add('clim-loading');
        if (badge) {
            badge.style.display = 'flex';
            if (icon) icon.textContent = '⏳';
            if (text) text.textContent = 'Detecting climate...';
            badge.classList.remove('clim-badge-hide');
            badge.classList.add('clim-badge-show');
        }
    } else {
        select.classList.remove('clim-loading');
    }
}

// ── Mark dropdown as user-modified when they change it manually ───────────────
(function _bindClimateManualOverride() {
    function _bind() {
        const select = document.getElementById('climate');
        if (!select) return;
        select.addEventListener('change', () => {
            // Only flag as user-modified if the change wasn't triggered by our code
            if (!select.classList.contains('clim-auto-filled')) {
                select.dataset.userModified = 'true';
                // Hide the auto-detect badge since user overrode it
                const badge = document.getElementById('climDetectBadge');
                if (badge) {
                    badge.classList.add('clim-badge-hide');
                    setTimeout(() => { badge.style.display = 'none'; }, 300);
                }
            }
            select.classList.remove('clim-auto-filled');
        });
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', _bind);
    } else {
        _bind();
    }
})();

// ── Public hook: called after location resolves ───────────────────────────────
window.autoDetectClimate = function(city, state, locationLabel) {
    const climate = resolveClimateFromLocation(city, state);
    applyAutoClimate(climate, locationLabel, false);
    return climate;
};

// ── Patch detectLocation's onSuccess to also trigger climate ─────────────────
// We wrap the existing detectLocation so existing callers are unaffected.
(function _patchLocationForClimate() {
    const _origDetect = detectLocation;

    window.detectLocation = function(options = {}) {
        const _origOnSuccess = options.onSuccess;

        options.onSuccess = function(loc) {
            // Auto-detect climate from the resolved location
            window.autoDetectClimate(loc.city, loc.state, loc.label);

            // Also update voice assistant log if open
            const climate = resolveClimateFromLocation(loc.city, loc.state);
            const meta    = CLIMATE_META[climate] || { label: climate };
            if (typeof _logTranscript === 'function') {
                _logTranscript('🌤️ Climate auto-set to: ' + meta.label);
            }

            if (_origOnSuccess) _origOnSuccess(loc);
        };

        _origDetect(options);
    };

    // Also patch restoreLocation to re-apply climate on page reload
    const _origRestore = restoreLocation;
    window.restoreLocation = function() {
        const result = _origRestore();
        if (result) {
            const loc = window.CropLocation;
            if (loc.city || loc.state) {
                window.autoDetectClimate(loc.city, loc.state, loc.city + (loc.state ? ', ' + loc.state : ''));
            }
        }
        return result;
    };
})();

// ── Voice assistant hook: "set climate to X" already handled in voiceAssistant.js
// But when voice triggers location detection, climate will auto-follow via the patch above.
