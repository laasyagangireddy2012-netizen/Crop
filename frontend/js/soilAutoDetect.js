/* ═══════════════════════════════════════════════════════════
   CropXAI – Soil Nutrient Auto-Detection Module
   Automatically fills pH, N, P, K when soil type + climate
   are selected. Supports manual override, loading animation,
   status text, and highlight on auto-filled values.
═══════════════════════════════════════════════════════════ */

'use strict';

// ── State ─────────────────────────────────────────────────────────────────────
const SoilAutoDetect = {
    _autoFilled: { ph: false, nitrogen: false, phosphorus: false, potassium: false },
    _detecting: false
};

// ── DOM helpers ───────────────────────────────────────────────────────────────
function _sad_el(id) { return document.getElementById(id); }

// ── Status banner ─────────────────────────────────────────────────────────────
function _setSoilStatus(state, message) {
    const banner = _sad_el('soilAutoStatusBanner');
    if (!banner) return;

    banner.className = 'soil-auto-banner';

    switch (state) {
        case 'detecting':
            banner.classList.add('soil-banner-detecting');
            banner.innerHTML = `<span class="soil-banner-spin">⏳</span> <span>${message || 'Analyzing soil conditions...'}</span>`;
            banner.style.display = 'flex';
            break;
        case 'success':
            banner.classList.add('soil-banner-success');
            banner.innerHTML = `<span>✅</span> <span>${message || 'Soil nutrients detected successfully'}</span>`;
            banner.style.display = 'flex';
            // Auto-hide after 4 seconds
            setTimeout(() => {
                banner.classList.add('soil-banner-fade');
                setTimeout(() => { banner.style.display = 'none'; banner.classList.remove('soil-banner-fade'); }, 400);
            }, 4000);
            break;
        case 'error':
            banner.classList.add('soil-banner-error');
            banner.innerHTML = `<span>⚠️</span> <span>${message || 'Could not detect soil nutrients — defaults applied'}</span>`;
            banner.style.display = 'flex';
            setTimeout(() => {
                banner.classList.add('soil-banner-fade');
                setTimeout(() => { banner.style.display = 'none'; banner.classList.remove('soil-banner-fade'); }, 400);
            }, 4000);
            break;
        default:
            banner.style.display = 'none';
    }

    console.log('[SoilAutoDetect] Status →', state, '|', message);
}

// ── Flash a field green to indicate auto-fill ─────────────────────────────────
function _flashAutoFilled(inputEl) {
    if (!inputEl) return;
    inputEl.classList.remove('soil-auto-highlight');
    // Force reflow so animation restarts
    void inputEl.offsetWidth;
    inputEl.classList.add('soil-auto-highlight');
    setTimeout(() => inputEl.classList.remove('soil-auto-highlight'), 2200);
}

// ── Set a single field value with animation ───────────────────────────────────
function _setFieldValue(fieldId, value, isAutoFill) {
    const el = _sad_el(fieldId);
    if (!el) return;

    // Don't overwrite if user manually changed this field
    if (isAutoFill && el.dataset.userModified === 'true') {
        console.log('[SoilAutoDetect] Skipping', fieldId, '— user has manually set it');
        return;
    }

    el.value = value;

    if (isAutoFill) {
        _flashAutoFilled(el);
        SoilAutoDetect._autoFilled[fieldId] = true;
        // Mark as auto-filled (not user-modified)
        delete el.dataset.userModified;
    }
}

// ── Core: run auto-detection for all four fields ──────────────────────────────
function runSoilAutoDetect(options = {}) {
    const { silent = false, forceOverride = false } = options;

    const climate  = (_sad_el('climate')  || {}).value || '';
    const soilType = (_sad_el('soilType') || {}).value || '';

    console.log('[SoilAutoDetect] Triggered. climate =', climate, '| soilType =', soilType);

    // Need both values to proceed
    if (!climate || !soilType) {
        console.log('[SoilAutoDetect] Skipping — climate or soilType not selected yet');
        return;
    }

    if (SoilAutoDetect._detecting) {
        console.log('[SoilAutoDetect] Already detecting, skipping duplicate call');
        return;
    }

    SoilAutoDetect._detecting = true;

    if (!silent) {
        _setSoilStatus('detecting', 'Analyzing soil conditions...');
    }

    // Simulate a brief async analysis (gives the UI time to show the loader)
    setTimeout(() => {
        SoilAutoDetect._detecting = false;

        let params = null;

        // Use the existing autoDetectSoilParameters from soilData.js
        if (typeof autoDetectSoilParameters === 'function') {
            params = autoDetectSoilParameters(climate, soilType);
            console.log('[SoilAutoDetect] autoDetectSoilParameters result:', params);
        } else {
            console.warn('[SoilAutoDetect] autoDetectSoilParameters not found — using built-in fallback');
        }

        // Built-in fallback table if soilData.js is unavailable
        if (!params) {
            params = _getFallbackParams(climate, soilType);
            console.log('[SoilAutoDetect] Using fallback params:', params);
        }

        if (!params) {
            console.error('[SoilAutoDetect] No params available for climate:', climate, 'soilType:', soilType);
            if (!silent) _setSoilStatus('error', 'Could not detect soil nutrients — please enter manually');
            return;
        }

        // Apply values (respect user overrides unless forceOverride)
        const phEl  = _sad_el('soilPh');
        const nEl   = _sad_el('nitrogen');
        const pEl   = _sad_el('phosphorus');
        const kEl   = _sad_el('potassium');

        const shouldFillPh = forceOverride || !phEl  || phEl.dataset.userModified  !== 'true';
        const shouldFillN  = forceOverride || !nEl   || nEl.dataset.userModified   !== 'true';
        const shouldFillP  = forceOverride || !pEl   || pEl.dataset.userModified   !== 'true';
        const shouldFillK  = forceOverride || !kEl   || kEl.dataset.userModified   !== 'true';

        if (shouldFillPh) _setFieldValue('soilPh',     params.ph.toFixed(1),         true);
        if (shouldFillN)  _setFieldValue('nitrogen',   params.nitrogen.toFixed(1),   true);
        if (shouldFillP)  _setFieldValue('phosphorus', params.phosphorus.toFixed(1), true);
        if (shouldFillK)  _setFieldValue('potassium',  params.potassium.toFixed(1),  true);

        if (!silent) {
            const filledCount = [shouldFillPh, shouldFillN, shouldFillP, shouldFillK].filter(Boolean).length;
            if (filledCount > 0) {
                _setSoilStatus('success', `Soil nutrients detected successfully (${soilType} + ${climate})`);
            } else {
                _setSoilStatus('success', 'Values already set — auto-detect skipped for manually entered fields');
            }
        }

        console.log('[SoilAutoDetect] Done. pH:', params.ph, 'N:', params.nitrogen, 'P:', params.phosphorus, 'K:', params.potassium);

    }, 600); // 600ms delay for loading animation visibility
}

// ── Fallback nutrient table (used if soilData.js is not loaded) ───────────────
function _getFallbackParams(climate, soilType) {
    const table = {
        tropical: {
            clay:     { ph: 6.5, nitrogen: 50, phosphorus: 40, potassium: 45 },
            sandy:    { ph: 6.0, nitrogen: 27, phosphorus: 22, potassium: 30 },
            loamy:    { ph: 6.8, nitrogen: 60, phosphorus: 50, potassium: 55 },
            black:    { ph: 7.5, nitrogen: 55, phosphorus: 45, potassium: 50 },
            red:      { ph: 6.2, nitrogen: 40, phosphorus: 35, potassium: 40 },
            alluvial: { ph: 7.0, nitrogen: 65, phosphorus: 55, potassium: 60 }
        },
        subtropical: {
            clay:     { ph: 6.5, nitrogen: 55, phosphorus: 45, potassium: 50 },
            sandy:    { ph: 6.0, nitrogen: 32, phosphorus: 27, potassium: 35 },
            loamy:    { ph: 6.8, nitrogen: 65, phosphorus: 55, potassium: 60 },
            black:    { ph: 7.5, nitrogen: 60, phosphorus: 50, potassium: 55 },
            red:      { ph: 6.2, nitrogen: 45, phosphorus: 40, potassium: 45 },
            alluvial: { ph: 7.0, nitrogen: 70, phosphorus: 60, potassium: 65 }
        },
        temperate: {
            clay:     { ph: 6.5, nitrogen: 60, phosphorus: 50, potassium: 55 },
            sandy:    { ph: 6.0, nitrogen: 37, phosphorus: 32, potassium: 40 },
            loamy:    { ph: 6.8, nitrogen: 70, phosphorus: 60, potassium: 65 },
            black:    { ph: 7.5, nitrogen: 65, phosphorus: 55, potassium: 60 },
            red:      { ph: 6.2, nitrogen: 50, phosphorus: 45, potassium: 50 },
            alluvial: { ph: 7.0, nitrogen: 75, phosphorus: 65, potassium: 70 }
        },
        arid: {
            clay:     { ph: 6.5, nitrogen: 45, phosphorus: 35, potassium: 40 },
            sandy:    { ph: 6.0, nitrogen: 22, phosphorus: 17, potassium: 25 },
            loamy:    { ph: 6.8, nitrogen: 50, phosphorus: 40, potassium: 45 },
            black:    { ph: 7.5, nitrogen: 50, phosphorus: 40, potassium: 45 },
            red:      { ph: 6.2, nitrogen: 35, phosphorus: 30, potassium: 35 },
            alluvial: { ph: 7.0, nitrogen: 55, phosphorus: 45, potassium: 50 }
        }
    };

    return (table[climate] && table[climate][soilType]) ? table[climate][soilType] : null;
}

// ── Mark a field as user-modified when they type/change it ───────────────────
function _bindUserOverrideTracking() {
    const fields = ['soilPh', 'nitrogen', 'phosphorus', 'potassium'];
    fields.forEach(id => {
        const el = _sad_el(id);
        if (!el) return;
        el.addEventListener('input', () => {
            // Only flag as user-modified if the value wasn't just set by auto-detect
            if (!el.classList.contains('soil-auto-highlight')) {
                el.dataset.userModified = 'true';
                console.log('[SoilAutoDetect] Field', id, 'marked as user-modified');
            }
        });
        el.addEventListener('change', () => {
            if (!el.classList.contains('soil-auto-highlight')) {
                el.dataset.userModified = 'true';
            }
        });
    });
}

// ── Upgrade the individual "Auto" buttons to fill ALL fields at once ──────────
function _upgradeAutoButtons() {
    const allAutoIds = ['autoPhBtn', 'autoNBtn', 'autoPBtn', 'autoKBtn'];

    allAutoIds.forEach(btnId => {
        const btn = _sad_el(btnId);
        if (!btn) return;

        // Replace click handler — fill all fields, not just one
        btn.replaceWith(btn.cloneNode(true)); // remove old listeners
        const freshBtn = _sad_el(btnId);
        if (!freshBtn) return;

        freshBtn.addEventListener('click', () => {
            const climate  = (_sad_el('climate')  || {}).value || '';
            const soilType = (_sad_el('soilType') || {}).value || '';

            if (!climate || !soilType) {
                alert('Please select both Climate and Soil Type first.');
                return;
            }

            console.log('[SoilAutoDetect] Manual Auto button clicked:', btnId);

            // Force override user-modified flags for this explicit click
            const fields = ['soilPh', 'nitrogen', 'phosphorus', 'potassium'];
            fields.forEach(id => {
                const el = _sad_el(id);
                if (el) delete el.dataset.userModified;
            });

            runSoilAutoDetect({ forceOverride: true });
        });
    });

    console.log('[SoilAutoDetect] Auto buttons upgraded');
}

// ── Listen for soil type and climate changes to trigger auto-detect ───────────
function _bindDropdownListeners() {
    const soilTypeEl = _sad_el('soilType');
    const climateEl  = _sad_el('climate');

    if (soilTypeEl) {
        soilTypeEl.addEventListener('change', () => {
            console.log('[SoilAutoDetect] soilType changed to:', soilTypeEl.value);
            // Small delay so climate can also be set if both change quickly
            setTimeout(() => runSoilAutoDetect(), 150);
        });
    }

    if (climateEl) {
        climateEl.addEventListener('change', () => {
            console.log('[SoilAutoDetect] climate changed to:', climateEl.value);
            setTimeout(() => runSoilAutoDetect(), 150);
        });
    }

    console.log('[SoilAutoDetect] Dropdown listeners bound');
}

// ── Also trigger auto-detect when climate is auto-set by location module ──────
// Patch window.autoDetectClimate to also run soil detection after climate is set
(function _patchClimateForSoil() {
    const _origAutoDetectClimate = window.autoDetectClimate;

    window.autoDetectClimate = function(city, state, locationLabel) {
        let result;
        if (typeof _origAutoDetectClimate === 'function') {
            result = _origAutoDetectClimate(city, state, locationLabel);
        }

        // After climate is auto-set, trigger soil detection (with slight delay
        // to let the climate dropdown value update first)
        setTimeout(() => {
            console.log('[SoilAutoDetect] Climate auto-set → triggering soil detection');
            runSoilAutoDetect({ silent: false });
        }, 700);

        return result;
    };

    console.log('[SoilAutoDetect] Patched autoDetectClimate for soil detection');
})();

// ── Inject the status banner HTML into the form ───────────────────────────────
function _injectStatusBanner() {
    // Insert banner before the soilPh form-group
    const phGroup = (_sad_el('soilPh') || {}).closest
        ? _sad_el('soilPh').closest('.form-group')
        : null;

    if (!phGroup) {
        console.warn('[SoilAutoDetect] Could not find soilPh form-group to inject banner');
        return;
    }

    // Don't inject twice
    if (_sad_el('soilAutoStatusBanner')) return;

    const banner = document.createElement('div');
    banner.id = 'soilAutoStatusBanner';
    banner.className = 'soil-auto-banner';
    banner.style.display = 'none';
    phGroup.parentNode.insertBefore(banner, phGroup);

    console.log('[SoilAutoDetect] Status banner injected');
}

// ── Public API ────────────────────────────────────────────────────────────────
window.SoilAutoDetect = SoilAutoDetect;

// Expose a public trigger for voice assistant / external callers
window.triggerSoilAutoDetect = function(forceOverride) {
    runSoilAutoDetect({ forceOverride: !!forceOverride });
};

// ── Initialise ────────────────────────────────────────────────────────────────
function initSoilAutoDetect() {
    console.log('[SoilAutoDetect] Initialising...');

    _injectStatusBanner();
    _bindUserOverrideTracking();
    _bindDropdownListeners();
    _upgradeAutoButtons();

    // If both dropdowns already have values on load (e.g. restored from session),
    // run auto-detect silently
    const climate  = (_sad_el('climate')  || {}).value || '';
    const soilType = (_sad_el('soilType') || {}).value || '';
    if (climate && soilType) {
        console.log('[SoilAutoDetect] Both dropdowns pre-filled on load — running silent auto-detect');
        runSoilAutoDetect({ silent: true });
    }

    console.log('[SoilAutoDetect] Ready');
}

// ── Boot ──────────────────────────────────────────────────────────────────────
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSoilAutoDetect);
} else {
    initSoilAutoDetect();
}
