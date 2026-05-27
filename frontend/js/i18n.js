/* ═══════════════════════════════════════════════════════════
   CropXAI – i18n (Internationalisation) Engine
   Supports: English, Telugu, Hindi, Tamil, Kannada
   Usage:
     data-i18n="key"           → sets textContent
     data-i18n-placeholder="key" → sets placeholder
     data-i18n-title="key"    → sets title attribute
     data-i18n-html="key"     → sets innerHTML (use sparingly)
   Language stored in localStorage key: cropxai_lang
═══════════════════════════════════════════════════════════ */

'use strict';

// ── Supported languages ───────────────────────────────────────────────────────
const I18N_LANGUAGES = {
    en: { label: 'English',  flag: '🇬🇧', bcp47: 'en-IN' },
    te: { label: 'తెలుగు',   flag: '🇮🇳', bcp47: 'te-IN' },
    hi: { label: 'हिंदी',    flag: '🇮🇳', bcp47: 'hi-IN' },
    ta: { label: 'தமிழ்',    flag: '🇮🇳', bcp47: 'ta-IN' },
    kn: { label: 'ಕನ್ನಡ',    flag: '🇮🇳', bcp47: 'kn-IN' }
};

const I18N_STORAGE_KEY = 'cropxai_lang';
const I18N_DEFAULT     = 'en';

// ── Active language ───────────────────────────────────────────────────────────
let _currentLang = localStorage.getItem(I18N_STORAGE_KEY) || I18N_DEFAULT;

// ── Public API ────────────────────────────────────────────────────────────────
window.i18n = {

    // Get current language code
    get lang() { return _currentLang; },

    // Translate a key, fallback to English, then the key itself
    t(key, lang) {
        const l = lang || _currentLang;
        const dict = (typeof translations !== 'undefined') ? translations : {};
        return (dict[l] && dict[l][key] !== undefined)
            ? dict[l][key]
            : (dict[I18N_DEFAULT] && dict[I18N_DEFAULT][key] !== undefined)
                ? dict[I18N_DEFAULT][key]
                : key;
    },

    // Switch language and re-apply to DOM
    setLang(code) {
        if (!I18N_LANGUAGES[code]) {
            console.warn('[i18n] Unknown language code:', code);
            return;
        }
        _currentLang = code;
        localStorage.setItem(I18N_STORAGE_KEY, code);

        // Sync with app.js currentLanguage global if it exists
        if (typeof window !== 'undefined') {
            window.currentLanguage = code;
        }

        // Update html lang attribute
        document.documentElement.lang = I18N_LANGUAGES[code].bcp47.split('-')[0];

        // Apply translations to DOM
        this.applyAll();

        // Update language selector UI
        _updateSelectorUI(code);

        // Update voice assistant language
        _updateVoiceLang(code);

        // Dispatch event so other modules can react
        document.dispatchEvent(new CustomEvent('cropxai:langchange', { detail: { lang: code } }));

        console.log('[i18n] Language set to:', code, I18N_LANGUAGES[code].label);
    },

    // Apply translations to the entire document
    applyAll(root) {
        const scope = root || document;

        // data-i18n → textContent
        scope.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            const val = this.t(key);
            if (val !== key) el.textContent = val;
        });

        // data-i18n-html → innerHTML
        scope.querySelectorAll('[data-i18n-html]').forEach(el => {
            const key = el.getAttribute('data-i18n-html');
            const val = this.t(key);
            if (val !== key) el.innerHTML = val;
        });

        // data-i18n-placeholder → placeholder attribute
        scope.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            const val = this.t(key);
            if (val !== key) el.placeholder = val;
        });

        // data-i18n-title → title attribute
        scope.querySelectorAll('[data-i18n-title]').forEach(el => {
            const key = el.getAttribute('data-i18n-title');
            const val = this.t(key);
            if (val !== key) el.title = val;
        });

        // data-i18n-aria → aria-label attribute
        scope.querySelectorAll('[data-i18n-aria]').forEach(el => {
            const key = el.getAttribute('data-i18n-aria');
            const val = this.t(key);
            if (val !== key) el.setAttribute('aria-label', val);
        });
    },

    // Get BCP-47 language tag for speech synthesis
    getBcp47() {
        return (I18N_LANGUAGES[_currentLang] || I18N_LANGUAGES[I18N_DEFAULT]).bcp47;
    },

    // Get all supported languages
    getLanguages() { return I18N_LANGUAGES; }
};

// ── Update voice assistant recognition language ───────────────────────────────
function _updateVoiceLang(code) {
    const bcp47 = (I18N_LANGUAGES[code] || I18N_LANGUAGES[I18N_DEFAULT]).bcp47;

    // Update Web Speech API recognition language if active
    if (window.va_recognition) {
        try {
            window.va_recognition.lang = bcp47;
            console.log('[i18n] Voice recognition language set to:', bcp47);
        } catch(e) { /* recognition may be running */ }
    }

    // Store for voiceAssistant.js to pick up on next start
    window._i18n_bcp47 = bcp47;
}

// ── Update the language selector dropdown UI ──────────────────────────────────
function _updateSelectorUI(code) {
    const sel = document.getElementById('langSelector');
    if (sel) sel.value = code;

    // Update flag display
    const flagEl = document.getElementById('langSelectorFlag');
    if (flagEl) flagEl.textContent = (I18N_LANGUAGES[code] || {}).flag || '🌐';
}

// ── Build and inject the language selector into the sidebar ───────────────────
function _injectLangSelector() {
    // Don't inject twice
    if (document.getElementById('langSelectorWrap')) return;

    const nav = document.querySelector('.sidebar-nav');
    if (!nav) return;

    const wrap = document.createElement('div');
    wrap.id = 'langSelectorWrap';
    wrap.className = 'lang-selector-wrap';
    wrap.innerHTML = `
        <div class="lang-selector-inner">
            <span class="lang-globe-icon" id="langSelectorFlag">🌐</span>
            <select id="langSelector" class="lang-selector-select" aria-label="Select language">
                ${Object.entries(I18N_LANGUAGES).map(([code, meta]) =>
                    `<option value="${code}">${meta.flag} ${meta.label}</option>`
                ).join('')}
            </select>
            <span class="lang-selector-arrow">▾</span>
        </div>
    `;

    // Insert before the first nav-section-label (MAIN MENU)
    const firstLabel = nav.querySelector('.nav-section-label');
    if (firstLabel) {
        nav.insertBefore(wrap, firstLabel);
    } else {
        nav.appendChild(wrap);
    }

    // Wire change event
    const sel = document.getElementById('langSelector');
    if (sel) {
        sel.value = _currentLang;
        sel.addEventListener('change', (e) => {
            window.i18n.setLang(e.target.value);
        });
    }

    // Set initial flag
    _updateSelectorUI(_currentLang);
}

// ── Init on DOM ready ─────────────────────────────────────────────────────────
function _initI18n() {
    // Sync global currentLanguage
    window.currentLanguage = _currentLang;

    // Inject selector into sidebar (index.html only)
    if (document.querySelector('.sidebar-nav')) {
        _injectLangSelector();
    }

    // Apply translations immediately
    window.i18n.applyAll();

    // Set html lang
    document.documentElement.lang = (I18N_LANGUAGES[_currentLang] || I18N_LANGUAGES[I18N_DEFAULT]).bcp47.split('-')[0];

    // Set voice lang
    _updateVoiceLang(_currentLang);

    console.log('[i18n] Initialised. Language:', _currentLang);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', _initI18n);
} else {
    _initI18n();
}
