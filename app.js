let currentLanguage = 'en';
let isLoggedIn = false;
let currentUser = null;
let users = JSON.parse(localStorage.getItem('cropxai_users')) || {
    'farmer': { password: 'demo123', name: 'Demo Farmer' }
};

// DOM Elements
const loginPage    = document.getElementById('loginPage');
const topNav       = document.getElementById('topNav');
const loginModal   = document.getElementById('loginModal'); // kept for compat
const infoModal    = document.getElementById('infoModal');
const profileModal = document.getElementById('profileModal');
const voiceModal   = document.getElementById('voiceModal');
const logoutBtn    = document.getElementById('logoutBtn');
const profileBtn   = document.getElementById('profileBtn');
const voiceBtn     = document.getElementById('voiceBtn');
const loginForm    = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const forgotPasswordForm = document.getElementById('forgotPasswordForm');
const mainContent  = document.getElementById('mainContent');
const languageSelector = document.getElementById('languageSelector');
const recommendBtn = document.getElementById('recommendBtn');
const resultsSection = document.getElementById('resultsSection');

// Auth Links
const createAccountLink = document.getElementById('createAccountLink');
const forgotPasswordLink = document.getElementById('forgotPasswordLink');
const backToLoginLink    = document.getElementById('backToLoginLink');
const backToLoginLink2   = document.getElementById('backToLoginLink2');

// Auto-detect buttons
const autoPhBtn = document.getElementById('autoPhBtn');
const autoNBtn  = document.getElementById('autoNBtn');
const autoPBtn  = document.getElementById('autoPBtn');
const autoKBtn  = document.getElementById('autoKBtn');

// Voice Assistant
const startVoiceBtn  = document.getElementById('startVoiceBtn');
const voiceStatus    = document.getElementById('voiceStatus');
const voiceTranscript = document.getElementById('voiceTranscript');
let recognition = null;

if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
}

// ── Show/hide login page vs app ───────────────────────────────────────────
function showLoginPage() {
    loginPage.style.display  = 'flex';
    topNav.style.display     = 'none';
    document.querySelector('.app-shell').style.display = 'none';
}
function showApp() {
    loginPage.style.display  = 'none';
    topNav.style.display     = 'flex';
    document.querySelector('.app-shell').style.display = 'block';
    mainContent.style.display = 'flex';
}

// Start on login page
showLoginPage();

// Sync language selector in nav with login page selector
const languageSelectorNav = document.getElementById('languageSelectorNav');
if (languageSelectorNav) {
    languageSelectorNav.addEventListener('change', (e) => {
        currentLanguage = e.target.value;
        languageSelector.value = currentLanguage;
        translatePage(currentLanguage);
    });
}

// Modal close buttons
document.querySelectorAll('.close').forEach(closeBtn => {
    closeBtn.addEventListener('click', function() {
        this.parentElement.parentElement.style.display = 'none';
        document.body.style.overflow = 'auto';
    });
});

window.addEventListener('click', (e) => {
    if (e.target === infoModal)    { infoModal.style.display    = 'none'; document.body.style.overflow = 'auto'; }
    if (e.target === profileModal) { profileModal.style.display = 'none'; document.body.style.overflow = 'auto'; }
    if (e.target === voiceModal)   { voiceModal.style.display   = 'none'; document.body.style.overflow = 'auto'; }
    if (e.target === diseaseModal) {
        diseaseModal.style.display = 'none';
        document.body.style.overflow = 'auto';
        if (typeof stopCamera === 'function') stopCamera();
    }
});

if (profileBtn) profileBtn.addEventListener('click', () => showProfile());
if (voiceBtn)   voiceBtn.addEventListener('click',   () => { voiceModal.style.display = 'block'; });

// Sidebar nav links
const navDisease = document.getElementById('navDisease');
const navVoice   = document.getElementById('navVoice');
const navProfile = document.getElementById('navProfile');
if (navDisease) navDisease.addEventListener('click', () => { diseaseModal.style.display = 'block'; document.body.style.overflow = 'hidden'; resetDiseaseModal(); });
if (navVoice)   navVoice.addEventListener('click',   () => { voiceModal.style.display = 'block'; });
if (navProfile) navProfile.addEventListener('click', () => showProfile());

// Auth form switching
createAccountLink.addEventListener('click',  (e) => { e.preventDefault(); showRegisterForm(); });
forgotPasswordLink.addEventListener('click', (e) => { e.preventDefault(); showForgotPasswordForm(); });
backToLoginLink.addEventListener('click',    (e) => { e.preventDefault(); showLoginForm(); });
backToLoginLink2.addEventListener('click',   (e) => { e.preventDefault(); showLoginForm(); });

function showLoginForm() {
    loginForm.style.display        = 'flex';
    registerForm.style.display     = 'none';
    forgotPasswordForm.style.display = 'none';
    document.getElementById('authTitle').textContent = translations[currentLanguage]?.loginTitle || 'Welcome Back';
    document.querySelector('.lp-card-sub').textContent = 'Sign in to your account to continue';
}
function showRegisterForm() {
    loginForm.style.display        = 'none';
    registerForm.style.display     = 'flex';
    forgotPasswordForm.style.display = 'none';
    document.getElementById('authTitle').textContent = translations[currentLanguage]?.createAccount || 'Create Account';
    document.querySelector('.lp-card-sub').textContent = 'Fill in the details below to get started';
}
function showForgotPasswordForm() {
    loginForm.style.display        = 'none';
    registerForm.style.display     = 'none';
    forgotPasswordForm.style.display = 'flex';
    document.getElementById('authTitle').textContent = translations[currentLanguage]?.forgotPassword || 'Reset Password';
    document.querySelector('.lp-card-sub').textContent = 'Enter your username to reset your password';
}

// Login Handler
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    if (users[username] && users[username].password === password) {
        currentUser = { username, ...users[username] };
        isLoggedIn  = true;
        showApp();
        document.getElementById('profileName').textContent = currentUser.name || username;
        document.getElementById('sidebar-username-text') && (document.getElementById('sidebar-username-text').textContent = currentUser.name || username);
        loginForm.reset();
    } else {
        alert('Invalid username or password!');
    }
});

// Register Handler
registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username        = document.getElementById('newUsername').value.trim();
    const password        = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    if (!username || !password || !confirmPassword) { alert('All fields are required.'); return; }
    if (users[username]) { alert('Username already exists!'); return; }
    if (password !== confirmPassword) { alert('Passwords do not match!'); return; }
    if (password.length < 6) { alert('Password must be at least 6 characters.'); return; }
    users[username] = { password, name: username };
    localStorage.setItem('cropxai_users', JSON.stringify(users));
    alert('Account created! Please login.');
    showLoginForm();
    registerForm.reset();
});

// Forgot Password Handler
forgotPasswordForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username           = document.getElementById('resetUsername').value.trim();
    const newPassword        = document.getElementById('resetNewPassword').value;
    const confirmNewPassword = document.getElementById('resetConfirmPassword').value;
    if (!username || !newPassword || !confirmNewPassword) { alert('All fields are required.'); return; }
    if (!users[username]) { alert('Username not found.'); return; }
    if (newPassword !== confirmNewPassword) { alert('Passwords do not match!'); return; }
    if (newPassword.length < 6) { alert('Password must be at least 6 characters.'); return; }
    users[username].password = newPassword;
    localStorage.setItem('cropxai_users', JSON.stringify(users));
    alert('Password reset! Please login.');
    showLoginForm();
    forgotPasswordForm.reset();
});

// Logout Handler
logoutBtn.addEventListener('click', () => {
    isLoggedIn  = false;
    currentUser = null;
    if (resultsSection) resultsSection.style.display = 'none';
    const placeholder = document.getElementById('resultsPlaceholder');
    if (placeholder) placeholder.style.display = 'block';
    loginForm.reset();
    showLoginForm();
    showLoginPage();
});

// Language Selector (login page)
languageSelector.addEventListener('change', (e) => {
    currentLanguage = e.target.value;
    if (languageSelectorNav) languageSelectorNav.value = currentLanguage;
    translatePage(currentLanguage);
    if (recognition) recognition.lang = currentLanguage === 'en' ? 'en-US' : currentLanguage === 'te' ? 'te-IN' : 'hi-IN';
});

// Profile Display
function showProfile() {
    if (!currentUser) return;
    const lang = currentLanguage;
    const labels = {
        en: { title: 'User Profile', name: 'Name', username: 'Username' },
        te: { title: 'వినియోగదారు ప్రొఫైల్', name: 'పేరు', username: 'వినియోగదారు పేరు' },
        hi: { title: 'उपयोगकर्ता प्रोफ़ाइल', name: 'नाम', username: 'उपयोगकर्ता नाम' }
    };
    const L = labels[lang] || labels.en;

    // Update modal title
    const titleEl = document.querySelector('#profileModal h2');
    if (titleEl) titleEl.textContent = L.title;

    document.getElementById('profileContent').innerHTML = `
        <div class="profile-item">
            <strong>${L.name}</strong>
            <span>${currentUser.name || currentUser.username}</span>
        </div>
        <div class="profile-item">
            <strong>${L.username}</strong>
            <span>${currentUser.username}</span>
        </div>
    `;
    profileModal.style.display = 'block';
}

// Voice Assistant
if (recognition) {
    recognition.lang = 'en-US';
    
    startVoiceBtn.addEventListener('click', () => {
        recognition.start();
        voiceStatus.textContent = currentLanguage === 'en' ? 'Listening...' : 
                                  currentLanguage === 'te' ? 'వింటోంది...' : 'सुन रहा है...';
    });
    
    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        voiceTranscript.textContent = transcript;
        processVoiceCommand(transcript);
    };
    
    recognition.onerror = (event) => {
        voiceStatus.textContent = 'Error: ' + event.error;
    };
    
    recognition.onend = () => {
        voiceStatus.textContent = translations[currentLanguage].voiceReady;
    };
} else {
    startVoiceBtn.addEventListener('click', () => {
        alert('Speech recognition not supported in this browser.');
    });
}

// ── Voice Assistant: Natural Language Intent Engine ──────────────────────
function processVoiceCommand(text) {
    const t = text.toLowerCase().trim();
    const lang = currentLanguage;

    // ── Speak response helper ─────────────────────────────────────────────
    function speak(msg) {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utt = new SpeechSynthesisUtterance(msg);
            utt.lang = lang === 'te' ? 'te-IN' : lang === 'hi' ? 'hi-IN' : 'en-IN';
            utt.rate = 0.9;
            window.speechSynthesis.speak(utt);
        }
    }

    // ── Show response in transcript ───────────────────────────────────────
    function respond(msg) {
        voiceTranscript.textContent = '🎤 "' + text + '"\n\n💬 ' + msg;
        speak(msg);
    }

    // ── Intent: Get crop recommendation ──────────────────────────────────
    if (/recommend|suggest|which crop|best crop|what crop|crop for|పంట సిఫార్సు|పంట చెప్పు|ఏ పంట|फसल बताओ|कौन सी फसल|सिफारिश/.test(t)) {
        respond(lang === 'te' ? 'పంట సిఫార్సు పొందుతోంది...' :
                lang === 'hi' ? 'फसल सिफारिश प्राप्त हो रही है...' :
                'Getting crop recommendation...');
        setTimeout(() => { recommendBtn.click(); voiceModal.style.display = 'none'; }, 1200);
        return;
    }

    // ── Intent: Open disease detection ───────────────────────────────────
    if (/disease|pest|infection|leaf|plant sick|వ్యాధి|ఆకు|రోగం|बीमारी|रोग|पत्ती/.test(t)) {
        respond(lang === 'te' ? 'వ్యాధి గుర్తింపు తెరుస్తోంది...' :
                lang === 'hi' ? 'रोग पहचान खुल रही है...' :
                'Opening disease detection...');
        setTimeout(() => { document.getElementById('diseaseDetectionBtn')?.click(); voiceModal.style.display = 'none'; }, 1000);
        return;
    }

    // ── Intent: Show profile ──────────────────────────────────────────────
    if (/profile|my account|my details|ప్రొఫైల్|నా వివరాలు|प्रोफाइल|मेरा खाता/.test(t)) {
        respond(lang === 'te' ? 'మీ ప్రొఫైల్ తెరుస్తోంది...' :
                lang === 'hi' ? 'आपकी प्रोफाइल खुल रही है...' :
                'Opening your profile...');
        setTimeout(() => { showProfile(); voiceModal.style.display = 'none'; }, 1000);
        return;
    }

    // ── Intent: Auto-detect soil parameters ──────────────────────────────
    if (/auto detect|auto fill|fill soil|detect soil|soil values|నేల విలువలు|ఆటో డిటెక్ట్|मिट्टी भरो|ऑटो डिटेक्ट/.test(t)) {
        const loc  = document.getElementById('location').value;
        const soil = document.getElementById('soilType').value;
        if (!loc || !soil) {
            const msg = lang === 'te' ? 'దయచేసి ముందు స్థానం మరియు నేల రకం ఎంచుకోండి.' :
                        lang === 'hi' ? 'कृपया पहले स्थान और मिट्टी का प्रकार चुनें।' :
                        'Please select location and soil type first.';
            respond(msg); return;
        }
        respond(lang === 'te' ? 'నేల పారామితులు ఆటో-ఫిల్ చేస్తోంది...' :
                lang === 'hi' ? 'मिट्टी के मान भरे जा रहे हैं...' :
                'Auto-filling soil parameters...');
        setTimeout(() => {
            autoPhBtn.click();
            setTimeout(() => autoNBtn.click(), 200);
            setTimeout(() => autoPBtn.click(), 400);
            setTimeout(() => autoKBtn.click(), 600);
            voiceModal.style.display = 'none';
        }, 1000);
        return;
    }

    // ── Intent: Set location by voice ────────────────────────────────────
    const stateNames = {
        'andhra pradesh': 'andhra-pradesh', 'andhra': 'andhra-pradesh',
        'telangana': 'telangana', 'hyderabad': 'telangana',
        'karnataka': 'karnataka', 'bengaluru': 'karnataka', 'bangalore': 'karnataka',
        'tamil nadu': 'tamil-nadu', 'chennai': 'tamil-nadu',
        'kerala': 'kerala', 'thiruvananthapuram': 'kerala',
        'maharashtra': 'maharashtra', 'mumbai': 'maharashtra', 'pune': 'maharashtra',
        'gujarat': 'gujarat', 'ahmedabad': 'gujarat',
        'rajasthan': 'rajasthan', 'jaipur': 'rajasthan',
        'punjab': 'punjab', 'chandigarh': 'chandigarh',
        'haryana': 'haryana',
        'uttar pradesh': 'uttar-pradesh', 'lucknow': 'uttar-pradesh',
        'madhya pradesh': 'madhya-pradesh', 'bhopal': 'madhya-pradesh',
        'west bengal': 'west-bengal', 'kolkata': 'west-bengal',
        'bihar': 'bihar', 'patna': 'bihar',
        'odisha': 'odisha', 'bhubaneswar': 'odisha',
        'assam': 'assam', 'guwahati': 'assam',
        'delhi': 'delhi', 'new delhi': 'delhi',
        'himachal': 'himachal-pradesh', 'himachal pradesh': 'himachal-pradesh',
        'uttarakhand': 'uttarakhand', 'dehradun': 'uttarakhand',
        'jharkhand': 'jharkhand', 'ranchi': 'jharkhand',
        'chhattisgarh': 'chhattisgarh', 'raipur': 'chhattisgarh',
        'goa': 'goa',
        'manipur': 'manipur', 'meghalaya': 'meghalaya',
        'nagaland': 'nagaland', 'tripura': 'tripura',
        'sikkim': 'sikkim', 'mizoram': 'mizoram',
        'arunachal': 'arunachal-pradesh', 'arunachal pradesh': 'arunachal-pradesh',
        'jammu': 'jammu-and-kashmir', 'kashmir': 'jammu-and-kashmir',
        'ladakh': 'ladakh',
        'puducherry': 'puducherry', 'pondicherry': 'puducherry',
    };
    for (const [name, key] of Object.entries(stateNames)) {
        if (t.includes(name)) {
            const opt = document.querySelector(`#location option[value="${key}"]`);
            if (opt) {
                document.getElementById('location').value = key;
                if (typeof WeatherService !== 'undefined') WeatherService.fetchForState(key);
                respond(lang === 'te' ? `స్థానం ${opt.textContent} కి సెట్ చేయబడింది.` :
                        lang === 'hi' ? `स्थान ${opt.textContent} सेट किया गया।` :
                        `Location set to ${opt.textContent}.`);
                setTimeout(() => { voiceModal.style.display = 'none'; }, 1500);
                return;
            }
        }
    }

    // ── Intent: Set season ────────────────────────────────────────────────
    if (/kharif|monsoon|rainy|ఖరీఫ్|వర్షాకాలం|खरीफ|मानसून/.test(t)) {
        document.getElementById('season').value = 'kharif';
        respond(lang === 'te' ? 'సీజన్ ఖరీఫ్ కి సెట్ చేయబడింది.' : lang === 'hi' ? 'मौसम खरीफ सेट किया गया।' : 'Season set to Kharif.');
        return;
    }
    if (/rabi|winter|శీతాకాలం|రబీ|रबी|सर्दी/.test(t)) {
        document.getElementById('season').value = 'rabi';
        respond(lang === 'te' ? 'సీజన్ రబీ కి సెట్ చేయబడింది.' : lang === 'hi' ? 'मौसम रबी सेट किया गया।' : 'Season set to Rabi.');
        return;
    }
    if (/zaid|summer|వేసవి|జాయిద్|जायद|गर्मी/.test(t)) {
        document.getElementById('season').value = 'zaid';
        respond(lang === 'te' ? 'సీజన్ జాయిద్ కి సెట్ చేయబడింది.' : lang === 'hi' ? 'मौसम जायद सेट किया गया।' : 'Season set to Zaid.');
        return;
    }

    // ── Intent: Set soil type ─────────────────────────────────────────────
    const soilMap = {
        'clay|నల్ల నేల|चिकनी मिट्टी': 'clay',
        'sandy|ఇసుక నేల|रेतीली मिट्टी': 'sandy',
        'loamy|లోమీ|दोमट मिट्टी': 'loamy',
        'black|నల్ల|काली मिट्टी': 'black',
        'red|ఎర్ర నేల|लाल मिट्टी': 'red',
        'alluvial|沖積|जलोढ़ मिट्टी': 'alluvial',
    };
    for (const [pattern, val] of Object.entries(soilMap)) {
        if (new RegExp(pattern).test(t)) {
            document.getElementById('soilType').value = val;
            respond(lang === 'te' ? `నేల రకం ${val} కి సెట్ చేయబడింది.` :
                    lang === 'hi' ? `मिट्टी का प्रकार ${val} सेट किया गया।` :
                    `Soil type set to ${val}.`);
            return;
        }
    }

    // ── Intent: What is the weather ───────────────────────────────────────
    if (/weather|temperature|rain|humidity|వాతావరణం|ఉష్ణోగ్రత|मौसम|तापमान/.test(t)) {
        const temp = document.getElementById('weatherTemp')?.textContent;
        const hum  = document.getElementById('weatherHumidity')?.textContent;
        const loc  = document.getElementById('weatherLocation')?.textContent;
        if (temp && temp !== '--°C') {
            respond(lang === 'te' ? `${loc} లో ప్రస్తుత ఉష్ణోగ్రత ${temp}, తేమ ${hum}.` :
                    lang === 'hi' ? `${loc} में वर्तमान तापमान ${temp}, आर्द्रता ${hum} है।` :
                    `Current weather in ${loc}: Temperature ${temp}, Humidity ${hum}.`);
        } else {
            respond(lang === 'te' ? 'వాతావరణ డేటా అందుబాటులో లేదు. దయచేసి స్థానాన్ని ఎంచుకోండి.' :
                    lang === 'hi' ? 'मौसम डेटा उपलब्ध नहीं। कृपया स्थान चुनें।' :
                    'Weather data not available. Please select a location first.');
        }
        return;
    }

    // ── Intent: Logout ────────────────────────────────────────────────────
    if (/logout|sign out|లాగ్ అవుట్|లాగ్ అవుట్|लॉगआउट/.test(t)) {
        respond(lang === 'te' ? 'లాగ్ అవుట్ అవుతోంది...' : lang === 'hi' ? 'लॉगआउट हो रहा है...' : 'Logging out...');
        setTimeout(() => { document.getElementById('logoutBtn')?.click(); voiceModal.style.display = 'none'; }, 1200);
        return;
    }

    // ── Intent: Help ──────────────────────────────────────────────────────
    if (/help|what can you do|commands|సహాయం|ఏమి చేయగలవు|मदद|क्या कर सकते/.test(t)) {
        const helpMsg = lang === 'te'
            ? 'మీరు చెప్పవచ్చు: పంట సిఫార్సు చేయండి, బీమా తెరవండి, వ్యాధి గుర్తించండి, స్థానం సెట్ చేయండి, సీజన్ సెట్ చేయండి, నేల రకం సెట్ చేయండి, వాతావరణం చెప్పండి, ప్రొఫైల్ చూపించండి.'
            : lang === 'hi'
            ? 'आप कह सकते हैं: फसल सिफारिश करें, बीमा खोलें, रोग पहचानें, स्थान सेट करें, मौसम बताएं, प्रोफाइल दिखाएं।'
            : 'You can say: recommend crop, open insurance, detect disease, set location to [state], set season to kharif/rabi/zaid, set soil type, what is the weather, show profile, auto detect soil, logout.';
        respond(helpMsg);
        return;
    }

    // ── Fallback: unknown intent ──────────────────────────────────────────
    const fallback = lang === 'te'
        ? `"${text}" అర్థం కాలేదు. "సహాయం" అని చెప్పండి అందుబాటులో ఉన్న ఆదేశాల జాబితా కోసం.`
        : lang === 'hi'
        ? `"${text}" समझ नहीं आया। उपलब्ध आदेशों के लिए "मदद" कहें।`
        : `I didn't understand "${text}". Say "help" to see available commands.`;
    respond(fallback);
}

// ── Back to Farm Details button ───────────────────────────────────────────
const backToFarmBtn = document.getElementById('backToFarmBtn');
if (backToFarmBtn) {
    backToFarmBtn.addEventListener('click', () => {
        document.getElementById('pageResults').style.display = 'none';
        document.getElementById('pageFarm').style.display    = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ── Weather: fetch on state selection ───────────────────────────────────
const locationSelect = document.getElementById('location');
if (locationSelect) {
    locationSelect.addEventListener('change', (e) => {
        const stateKey = e.target.value;
        if (stateKey && typeof WeatherService !== 'undefined') {
            WeatherService.fetchForState(stateKey);
        } else {
            const w = document.getElementById('weatherWidget');
            if (w) w.style.display = 'none';
        }
    });
}

// ── 📍 Detect Location Button ─────────────────────────────────────────────
const autoLocationBtn = document.getElementById('autoLocationBtn');
if (autoLocationBtn) {
    autoLocationBtn.addEventListener('click', async () => {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by this browser.');
            return;
        }

        // Show loading state on button
        const origText = autoLocationBtn.textContent;
        autoLocationBtn.textContent = '⏳...';
        autoLocationBtn.disabled = true;

        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                try {
                    const { latitude: lat, longitude: lon } = pos.coords;

                    // Reverse geocode using Nominatim
                    const params = new URLSearchParams({
                        lat, lon, format: 'json', zoom: 5,
                        'accept-language': 'en'
                    });
                    const res  = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?${params}`,
                        { headers: { 'User-Agent': 'CROPXAI/1.0' } }
                    );
                    const data = await res.json();
                    const rawState = data?.address?.state || '';

                    // Normalise to our state key format
                    const stateKey = rawState.toLowerCase()
                        .trim()
                        .replace(/\s+/g, '-')
                        .replace(/[^a-z-]/g, '');

                    // Alias map for common Nominatim variations
                    const aliases = {
                        'jammu-and-kashmir': 'jammu-and-kashmir',
                        'jammu-kashmir':     'jammu-and-kashmir',
                        'uttaranchal':       'uttarakhand',
                        'nct-of-delhi':      'delhi',
                        'national-capital-territory-of-delhi': 'delhi',
                        'andaman-and-nicobar-islands': 'andaman-and-nicobar',
                        'dadra-and-nagar-haveli-and-daman-and-diu': 'dadra-and-nagar-haveli',
                    };
                    const resolvedKey = aliases[stateKey] || stateKey;

                    // Try to select in dropdown
                    const opt = locationSelect.querySelector(`option[value="${resolvedKey}"]`);
                    if (opt) {
                        locationSelect.value = resolvedKey;
                        // Trigger weather fetch
                        if (typeof WeatherService !== 'undefined') {
                            WeatherService.fetchForState(resolvedKey);
                        }
                    } else {
                        // State not in dropdown — show detected name anyway
                        alert(`Detected: ${rawState || 'Unknown location'}. Please select your state manually.`);
                    }

                } catch (err) {
                    alert('Could not detect location: ' + err.message);
                } finally {
                    autoLocationBtn.textContent = origText;
                    autoLocationBtn.disabled = false;
                }
            },
            (err) => {
                autoLocationBtn.textContent = origText;
                autoLocationBtn.disabled = false;
                const msgs = {
                    1: 'Location access denied. Please allow location permission.',
                    2: 'Location unavailable.',
                    3: 'Location request timed out.'
                };
                alert(msgs[err.code] || 'Could not get location.');
            },
            { timeout: 10000, maximumAge: 60000, enableHighAccuracy: false }
        );
    });
}

// Auto-detect Soil Parameters
autoPhBtn.addEventListener('click', () => {
    const location = document.getElementById('location').value;
    const soilType = document.getElementById('soilType').value;
    
    if (!location || !soilType) {
        alert(translations[currentLanguage].location + ' and ' + translations[currentLanguage].soilType + ' required!');
        return;
    }
    
    // Get climate from location
    const climate = getClimateFromLocation(location);
    if (!climate) {
        alert('Unable to determine climate for selected location');
        return;
    }
    
    const params = autoDetectSoilParameters(climate, soilType);
    if (params) {
        document.getElementById('soilPh').value = params.ph.toFixed(1);
    }
});

autoNBtn.addEventListener('click', () => {
    const location = document.getElementById('location').value;
    const soilType = document.getElementById('soilType').value;
    
    if (!location || !soilType) {
        alert(translations[currentLanguage].location + ' and ' + translations[currentLanguage].soilType + ' required!');
        return;
    }
    
    // Get climate from location
    const climate = getClimateFromLocation(location);
    if (!climate) {
        alert('Unable to determine climate for selected location');
        return;
    }
    
    const params = autoDetectSoilParameters(climate, soilType);
    if (params) {
        document.getElementById('nitrogen').value = params.nitrogen.toFixed(1);
    }
});

autoPBtn.addEventListener('click', () => {
    const location = document.getElementById('location').value;
    const soilType = document.getElementById('soilType').value;
    
    if (!location || !soilType) {
        alert(translations[currentLanguage].location + ' and ' + translations[currentLanguage].soilType + ' required!');
        return;
    }
    
    // Get climate from location
    const climate = getClimateFromLocation(location);
    if (!climate) {
        alert('Unable to determine climate for selected location');
        return;
    }
    
    const params = autoDetectSoilParameters(climate, soilType);
    if (params) {
        document.getElementById('phosphorus').value = params.phosphorus.toFixed(1);
    }
});

autoKBtn.addEventListener('click', () => {
    const location = document.getElementById('location').value;
    const soilType = document.getElementById('soilType').value;
    
    if (!location || !soilType) {
        alert(translations[currentLanguage].location + ' and ' + translations[currentLanguage].soilType + ' required!');
        return;
    }
    
    // Get climate from location
    const climate = getClimateFromLocation(location);
    if (!climate) {
        alert('Unable to determine climate for selected location');
        return;
    }
    
    const params = autoDetectSoilParameters(climate, soilType);
    if (params) {
        document.getElementById('potassium').value = params.potassium.toFixed(1);
    }
});


// Info Buttons
document.getElementById('phInfoBtn').addEventListener('click', () => {
    const lang = currentLanguage;
    const L = {
        en: {
            range: 'pH Range', classification: 'Classification', crops: 'Suitable Crops',
            acidic: 'Strongly Acidic', slightAcidic: 'Slightly Acidic',
            neutral: 'Neutral', slightAlkaline: 'Slightly Alkaline',
            cropAcidic: 'Tea, Potato, Blueberry', cropSlightAcidic: 'Rice, Wheat, Maize',
            cropNeutral: 'Most crops thrive', cropAlkaline: 'Cotton, Sugarcane'
        },
        te: {
            range: 'pH పరిధి', classification: 'వర్గీకరణ', crops: 'అనువైన పంటలు',
            acidic: 'బలంగా ఆమ్లం', slightAcidic: 'కొద్దిగా ఆమ్లం',
            neutral: 'తటస్థ', slightAlkaline: 'కొద్దిగా క్షారం',
            cropAcidic: 'టీ, బంగాళాదుంప, బ్లూబెర్రీ', cropSlightAcidic: 'వరి, గోధుమ, మొక్కజొన్న',
            cropNeutral: 'చాలా పంటలు పెరుగుతాయి', cropAlkaline: 'పత్తి, చెరకు'
        },
        hi: {
            range: 'pH सीमा', classification: 'वर्गीकरण', crops: 'उपयुक्त फसलें',
            acidic: 'अत्यधिक अम्लीय', slightAcidic: 'थोड़ा अम्लीय',
            neutral: 'तटस्थ', slightAlkaline: 'थोड़ा क्षारीय',
            cropAcidic: 'चाय, आलू, ब्लूबेरी', cropSlightAcidic: 'चावल, गेहूं, मक्का',
            cropNeutral: 'अधिकांश फसलें', cropAlkaline: 'कपास, गन्ना'
        }
    }[lang] || {};

    const t = translations[lang];
    document.getElementById('infoContent').innerHTML = `
        <h3>${t.phInfoTitle}</h3>
        <p>${t.phInfoContent}</p>
        <table class="info-table">
            <tr><th>${L.range}</th><th>${L.classification}</th><th>${L.crops}</th></tr>
            <tr><td>3.5 – 5.5</td><td>${L.acidic}</td><td>${L.cropAcidic}</td></tr>
            <tr><td>5.5 – 6.5</td><td>${L.slightAcidic}</td><td>${L.cropSlightAcidic}</td></tr>
            <tr><td>6.5 – 7.5</td><td>${L.neutral}</td><td>${L.cropNeutral}</td></tr>
            <tr><td>7.5 – 8.5</td><td>${L.slightAlkaline}</td><td>${L.cropAlkaline}</td></tr>
        </table>
    `;
    infoModal.style.display = 'block';
});

document.getElementById('npkInfoBtn').addEventListener('click', () => {
    const lang = currentLanguage;
    const L = {
        en: {
            nutrient: 'Nutrient', function: 'Function', deficiency: 'Deficiency Signs',
            nFunc: 'Leaf growth, protein synthesis', nDef: 'Yellowing of older leaves',
            pFunc: 'Root development, flowering',   pDef: 'Purple/dark green leaves',
            kFunc: 'Disease resistance, water regulation', kDef: 'Brown leaf edges',
            optimal: 'Optimal Ranges', ranges: 'Low: 0-20% | Medium: 20-40% | High: 40-60% | Very High: 60%+'
        },
        te: {
            nutrient: 'పోషకం', function: 'పని', deficiency: 'లోపం సంకేతాలు',
            nFunc: 'ఆకు పెరుగుదల, ప్రోటీన్ సంశ్లేషణ', nDef: 'పాత ఆకులు పసుపు రంగుకు మారడం',
            pFunc: 'వేరు అభివృద్ధి, పుష్పించడం',    pDef: 'ఊదా/ముదురు ఆకుపచ్చ ఆకులు',
            kFunc: 'వ్యాధి నిరోధకత, నీటి నియంత్రణ', kDef: 'ఆకు అంచులు గోధుమ రంగు',
            optimal: 'అనుకూల పరిధులు', ranges: 'తక్కువ: 0-20% | మధ్యస్థ: 20-40% | అధిక: 40-60% | చాలా అధిక: 60%+'
        },
        hi: {
            nutrient: 'पोषक तत्व', function: 'कार्य', deficiency: 'कमी के संकेत',
            nFunc: 'पत्ती वृद्धि, प्रोटीन संश्लेषण', nDef: 'पुरानी पत्तियों का पीला पड़ना',
            pFunc: 'जड़ विकास, फूल आना',             pDef: 'बैंगनी/गहरी हरी पत्तियां',
            kFunc: 'रोग प्रतिरोध, जल नियंत्रण',     kDef: 'पत्ती के किनारे भूरे',
            optimal: 'इष्टतम सीमाएं', ranges: 'कम: 0-20% | मध्यम: 20-40% | उच्च: 40-60% | बहुत उच्च: 60%+'
        }
    }[lang] || {};

    const t = translations[lang];
    document.getElementById('infoContent').innerHTML = `
        <h3>${t.npkInfoTitle}</h3>
        <p>${t.npkInfoContent}</p>
        <table class="info-table">
            <tr><th>${L.nutrient}</th><th>${L.function}</th><th>${L.deficiency}</th></tr>
            <tr><td>Nitrogen (N)</td><td>${L.nFunc}</td><td>${L.nDef}</td></tr>
            <tr><td>Phosphorus (P)</td><td>${L.pFunc}</td><td>${L.pDef}</td></tr>
            <tr><td>Potassium (K)</td><td>${L.kFunc}</td><td>${L.kDef}</td></tr>
        </table>
        <p style="margin-top:14px;"><strong>${L.optimal}:</strong></p>
        <p>${L.ranges}</p>
    `;
    infoModal.style.display = 'block';
});

// Crop Recommendation with Explainable AI
// ── ML API endpoint (FastAPI + XGBoost) ──────────────────────────────────
const ML_API = 'http://localhost:8000';

async function getXGBoostRecommendation(inputs) {
    const body = {
        climate:    inputs.climate,
        season:     inputs.season,
        soil_type:  inputs.soilType,
        soil_ph:    inputs.soilPh,
        nitrogen:   inputs.nitrogen,
        phosphorus: inputs.phosphorus,
        potassium:  inputs.potassium,
        area:       inputs.area
    };
    const res = await fetch(`${ML_API}/predict`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(body)
    });
    if (!res.ok) throw new Error(`ML API error: ${res.status}`);
    return res.json();
}

recommendBtn.addEventListener('click', async () => {
    const location   = document.getElementById('location').value;
    const climateVal = document.getElementById('climate')
                        ? document.getElementById('climate').value
                        : null;
    // Climate is auto-set from state selection via weatherService
    // Fallback: derive from location if hidden input is empty
    const resolvedClimate = (climateVal && climateVal !== '')
        ? climateVal
        : getClimateFromLocation(location);

    const inputs = {
        climate:    resolvedClimate,
        area:       parseFloat(document.getElementById('area').value),
        season:     document.getElementById('season').value,
        soilType:   document.getElementById('soilType').value,
        soilPh:     parseFloat(document.getElementById('soilPh').value),
        nitrogen:   parseFloat(document.getElementById('nitrogen').value),
        phosphorus: parseFloat(document.getElementById('phosphorus').value),
        potassium:  parseFloat(document.getElementById('potassium').value)
    };

    if (!location || !inputs.season || !inputs.soilType ||
        isNaN(inputs.area) || isNaN(inputs.soilPh) ||
        isNaN(inputs.nitrogen) || isNaN(inputs.phosphorus) || isNaN(inputs.potassium)) {
        alert(translations[currentLanguage].inputTitle);
        return;
    }

    if (!inputs.climate) {
        alert(currentLanguage === 'en' ? 'Please select a state first so climate can be detected.' :
              currentLanguage === 'te' ? 'దయచేసి ముందు రాష్ట్రాన్ని ఎంచుకోండి.' :
              'कृपया पहले राज्य चुनें।');
        return;
    }

    // Show loading state
    recommendBtn.disabled = true;
    recommendBtn.textContent = '⏳ Analyzing...';

    try {
        // ── Try XGBoost FastAPI first ─────────────────────────────────
        let topRecommendations;
        let usingML = false;

        try {
            const mlResult = await getXGBoostRecommendation(inputs);
            usingML = true;

            topRecommendations = mlResult.top_3.map(r => {
                const cropKey = r.crop;
                const crop    = cropDatabase[cropKey];
                if (!crop) return null;
                const scores  = explainableAI.calculateFeatureScores(inputs, crop);
                return {
                    crop, cropKey, scores,
                    confidence: r.confidence,
                    explanation: explainableAI.generateExplanation(inputs, crop, scores, r.confidence, currentLanguage),
                    source: 'XGBoost'
                };
            }).filter(Boolean);

        } catch (mlErr) {
            // FastAPI not running — fall back to JS engine silently
            console.warn('ML API unavailable, using built-in engine:', mlErr.message);
            const results = explainableAI.analyzeAllCrops(inputs, cropDatabase);
            topRecommendations = results.slice(0, 3).map(r => ({
                crop: r.crop, cropKey: r.cropKey,
                scores: r.scores, confidence: r.confidence,
                explanation: explainableAI.generateExplanation(inputs, r.crop, r.scores, r.confidence, currentLanguage),
                source: 'builtin'
            }));
            usingML = false;
        }

        if (topRecommendations.length > 0) {
            displayMultipleRecommendations(topRecommendations, inputs, location, usingML);
            // Switch to results sub-page
            document.getElementById('pageFarm').style.display    = 'none';
            document.getElementById('pageResults').style.display = 'block';
            resultsSection.style.display = 'block';
            const placeholder = document.getElementById('resultsPlaceholder');
            if (placeholder) placeholder.style.display = 'none';
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

    } finally {
        recommendBtn.disabled = false;
        recommendBtn.textContent = translations[currentLanguage].getRecommendation || 'Get Crop Recommendation';
    }
});


function displayRecommendation(crop, inputs, explanation, location) {
    const resultsDiv = document.getElementById('recommendationResults');
    
    // Get soil analysis
    const soilAnalysis = getSoilAnalysis(inputs.nitrogen, inputs.phosphorus, inputs.potassium, currentLanguage);
    
    // Get location details
    const locationDetails = getLocationDetails(location, currentLanguage);
    const locationName = locationDetails ? locationDetails.name : location;
    
    // Create feature scores HTML
    let featureScoresHTML = '';
    for (const [feature, score] of Object.entries(explanation.featureScores)) {
        const featureName = translations[currentLanguage][feature] || feature;
        featureScoresHTML += `
            <div class="feature-score-item">
                <strong>${featureName}</strong>
                <div class="score-bar">
                    <div class="score-fill" style="width: ${score}%"></div>
                </div>
                <span>${score.toFixed(0)}%</span>
            </div>
        `;
    }
    
    // Create recommendations HTML
    let recommendationsHTML = '';
    if (explanation.recommendations.length > 0) {
        recommendationsHTML = '<ul style="margin-top: 10px;">';
        explanation.recommendations.forEach(rec => {
            recommendationsHTML += `<li>${rec}</li>`;
        });
        recommendationsHTML += '</ul>';
    }
    
    // Create irrigation schedule HTML
    let irrigationScheduleHTML = '';
    if (crop.irrigationSchedule && crop.irrigationSchedule[currentLanguage]) {
        irrigationScheduleHTML = `
            <div class="detail-section">
                <h4>📅 ${translations[currentLanguage].irrigationSchedule}</h4>
                <table class="info-table irrigation-table">
                    <thead>
                        <tr>
                            <th>${translations[currentLanguage].growthStage}</th>
                            <th>${translations[currentLanguage].days}</th>
                            <th>${translations[currentLanguage].frequency}</th>
                            <th>${translations[currentLanguage].waterDepth}</th>
                        </tr>
                    </thead>
                    <tbody>
        `;
        
        crop.irrigationSchedule[currentLanguage].forEach(schedule => {
            irrigationScheduleHTML += `
                <tr>
                    <td><strong>${schedule.stage}</strong></td>
                    <td>${schedule.days}</td>
                    <td>${schedule.frequency}</td>
                    <td>${schedule.depth}</td>
                </tr>
            `;
        });
        
        irrigationScheduleHTML += `
                    </tbody>
                </table>
            </div>
        `;
    }
    
    const html = `
        <div class="recommendation-card">
            <div class="crop-name">${crop.name[currentLanguage]}</div>
            
            <div class="detail-section">
                <h4>📍 ${translations[currentLanguage].location}</h4>
                <p><strong>${locationName}</strong></p>
                <p>${currentLanguage === 'en' ? 'Climate' : currentLanguage === 'te' ? 'వాతావరణం' : 'जलवायु'}: ${inputs.climate}</p>
            </div>
            
            <div class="ai-explanation-section">
                <h4>🤖 ${translations[currentLanguage].aiExplanation}</h4>
                <p>${explanation.summary}</p>
                
                <div style="margin-top: 15px;">
                    <strong>${translations[currentLanguage].confidenceScore}:</strong>
                    <div class="confidence-bar">
                        <div class="confidence-fill" style="width: ${explanation.confidence}%">
                            ${explanation.confidence}%
                        </div>
                    </div>
                </div>
                
                <div style="margin-top: 20px;">
                    <h4>${translations[currentLanguage].featureImportance}:</h4>
                    <div class="feature-scores">
                        ${featureScoresHTML}
                    </div>
                </div>
                
                ${recommendationsHTML}
            </div>
            
            <div class="detail-section">
                <h4>${translations[currentLanguage].explanation}</h4>
                <p>${crop.explanation[currentLanguage]}</p>
                <p><strong>${translations[currentLanguage].phRange}</strong> ${crop.phRange[0]} - ${crop.phRange[1]} 
                   (${translations[currentLanguage].optimal}: ${inputs.soilPh >= crop.phRange[0] && inputs.soilPh <= crop.phRange[1] ? '✓' : '✗'})</p>
            </div>
            
            <div class="detail-section">
                <h4>${currentLanguage === 'en' ? 'Soil Analysis' : currentLanguage === 'te' ? 'నేల విశ్లేషణ' : 'मिट्टी विश्लेषण'}</h4>
                <p><strong>N:</strong> ${soilAnalysis.nitrogen}</p>
                <p><strong>P:</strong> ${soilAnalysis.phosphorus}</p>
                <p><strong>K:</strong> ${soilAnalysis.potassium}</p>
            </div>
            
            <div class="detail-section">
                <h4>${translations[currentLanguage].irrigation}</h4>
                <p>${crop.irrigation[currentLanguage]}</p>
            </div>
            
            ${irrigationScheduleHTML}
            
            <div class="detail-section">
                <h4>${translations[currentLanguage].fertilizers}</h4>
                <p>${crop.fertilizers[currentLanguage]}</p>
            </div>
            
            <div class="detail-section">
                <h4>NPK ${currentLanguage === 'en' ? 'Requirements' : currentLanguage === 'te' ? 'అవసరాలు' : 'आवश्यकताएं'}</h4>
                <p><strong>N:</strong> ${crop.npk.n[0]}-${crop.npk.n[1]}% 
                   (${currentLanguage === 'en' ? 'Your' : currentLanguage === 'te' ? 'మీది' : 'आपका'}: ${inputs.nitrogen}%)</p>
                <p><strong>P:</strong> ${crop.npk.p[0]}-${crop.npk.p[1]}% 
                   (${currentLanguage === 'en' ? 'Your' : currentLanguage === 'te' ? 'మీది' : 'आपका'}: ${inputs.phosphorus}%)</p>
                <p><strong>K:</strong> ${crop.npk.k[0]}-${crop.npk.k[1]}% 
                   (${currentLanguage === 'en' ? 'Your' : currentLanguage === 'te' ? 'మీది' : 'आपका'}: ${inputs.potassium}%)</p>
            </div>
        </div>
    `;
    
    resultsDiv.innerHTML = html;
}

// Initialize
translatePage(currentLanguage);


// Display Multiple Recommendations
function displayMultipleRecommendations(recommendations, inputs, location, usingML = false) {
    const resultsDiv = document.getElementById('recommendationResults');
    const lang = currentLanguage;
    const locationDetails = getLocationDetails(location, lang);
    const locationName = locationDetails ? locationDetails.name : location;
    const soilAnalysis = getSoilAnalysis(inputs.nitrogen, inputs.phosphorus, inputs.potassium, lang);

    const modelBadge = ``;

    const L = {
        en: { title:'Top Crop Recommendations', compare:'Crop Comparison', clickHint:'Click a crop card to view full details', location:'Location', climate:'Climate', selectCrop:'Select a crop above to view detailed information', details:'Full Details', irrigation:'Irrigation', fertilizers:'Fertilizers', soilAnalysis:'Soil Analysis', npkReq:'NPK Requirements', aiExplanation:'AI Explanation', confidence:'Confidence', featureImportance:'Feature Importance', phRange:'pH Range', optimal:'Optimal', your:'Your', explanation:'Why This Crop?' },
        te: { title:'టాప్ పంట సిఫార్సులు', compare:'పంట పోలిక', clickHint:'పూర్తి వివరాల కోసం పంట కార్డ్ క్లిక్ చేయండి', location:'స్థానం', climate:'వాతావరణం', selectCrop:'వివరాల కోసం పైన పంటను ఎంచుకోండి', details:'పూర్తి వివరాలు', irrigation:'నీటిపారుదల', fertilizers:'ఎరువులు', soilAnalysis:'నేల విశ్లేషణ', npkReq:'NPK అవసరాలు', aiExplanation:'AI వివరణ', confidence:'విశ్వాసం', featureImportance:'ఫీచర్ ప్రాముఖ్యత', phRange:'pH పరిధి', optimal:'అనుకూల', your:'మీది', explanation:'ఈ పంట ఎందుకు?' },
        hi: { title:'शीर्ष फसल सिफारिशें', compare:'फसल तुलना', clickHint:'पूरी जानकारी के लिए फसल कार्ड पर क्लिक करें', location:'स्थान', climate:'जलवायु', selectCrop:'विवरण देखने के लिए ऊपर फसल चुनें', details:'पूरी जानकारी', irrigation:'सिंचाई', fertilizers:'उर्वरक', soilAnalysis:'मिट्टी विश्लेषण', npkReq:'NPK आवश्यकताएं', aiExplanation:'AI स्पष्टीकरण', confidence:'विश्वास', featureImportance:'फीचर महत्व', phRange:'pH सीमा', optimal:'इष्टतम', your:'आपका', explanation:'यह फसल क्यों?' }
    }[lang] || {};

    // ── Header ────────────────────────────────────────────────────────────
    let html = `
    <div class="rec-wrapper">
        <div class="rec-header">
            <div class="rec-header-left">
                <h2>${L.title} ${modelBadge}</h2>
                <div class="rec-meta">
                    <span>📍 ${locationName}</span>
                    <span>🌤️ ${inputs.climate}</span>
                    <span>🌱 ${inputs.season}</span>
                </div>
            </div>
            <button id="readRecommendationsBtn" class="btn-read-aloud">
                🔊 ${translations[lang].readAloud || 'Read Aloud'}
            </button>
        </div>

        <!-- ── Comparison Cards (shown first) ─────────────────────────── -->
        <div class="rec-compare-section">
            <h3 class="rec-section-title">📊 ${L.compare}</h3>
            <p class="rec-click-hint">👆 ${L.clickHint}</p>
            <div class="rec-cards-grid">`;

    recommendations.forEach((rec, i) => {
        const isBest = i === 0;
        const rankIcon = i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉';
        const confColor = rec.confidence >= 80 ? '#48bb78' : rec.confidence >= 60 ? '#ed8936' : '#e53e3e';
        html += `
            <div class="rec-card ${isBest ? 'rec-card-best' : ''}" onclick="showCropDetail(${i})" data-index="${i}">
                <div class="rec-card-rank">${rankIcon}</div>
                <div class="rec-card-name">${rec.crop.name[lang]}</div>
                <div class="rec-card-conf">
                    <div class="rec-conf-ring" style="--conf:${rec.confidence};--color:${confColor};">
                        <span>${rec.confidence}%</span>
                    </div>
                </div>
                <div class="rec-card-scores">
                    ${['climate','season','soilType','ph'].map(f => `
                        <div class="rec-mini-score">
                            <div class="rec-mini-bar" style="width:${rec.scores[f] || 0}%;background:${confColor}"></div>
                            <span>${(rec.scores[f]||0).toFixed(0)}%</span>
                        </div>`).join('')}
                </div>
                <div class="rec-card-labels">
                    <span>${lang==='en'?'Climate':lang==='te'?'వాతావరణం':'जलवायु'}</span>
                    <span>${lang==='en'?'Season':lang==='te'?'సీజన్':'मौसम'}</span>
                    <span>${lang==='en'?'Soil':lang==='te'?'నేల':'मिट्टी'}</span>
                    <span>pH</span>
                </div>
                <button class="rec-select-btn ${isBest ? 'rec-select-btn-best' : ''}">
                    ${lang==='en'?'View Details':lang==='te'?'వివరాలు చూడండి':'विवरण देखें'} →
                </button>
            </div>`;
    });

    html += `</div></div>

        <!-- ── Full Detail Panel (hidden until crop selected) ─────────── -->
        <div id="cropDetailPanel" class="crop-detail-panel">
            <div class="crop-detail-placeholder">
                <span class="detail-placeholder-icon">🌾</span>
                <p>${L.selectCrop}</p>
            </div>
        </div>
    </div>`;

    resultsDiv.innerHTML = html;

    // Store data for detail rendering
    resultsDiv._recData = { recommendations, inputs, soilAnalysis, lang, L };

    // Read aloud button
    setTimeout(() => {
        const readBtn = document.getElementById('readRecommendationsBtn');
        if (readBtn) readBtn.addEventListener('click', () => readRecommendationsAloud(recommendations, inputs, location));
    }, 100);

    // Auto-select best crop
    setTimeout(() => showCropDetail(0), 300);
}

// ── Show full detail for selected crop ────────────────────────────────────
function showCropDetail(index) {
    const resultsDiv = document.getElementById('recommendationResults');
    if (!resultsDiv._recData) return;
    const { recommendations, inputs, soilAnalysis, lang, L } = resultsDiv._recData;
    const rec = recommendations[index];
    if (!rec) return;

    // Highlight selected card
    document.querySelectorAll('.rec-card').forEach((c, i) => {
        c.classList.toggle('rec-card-active', i === index);
    });

    const { crop, confidence, explanation, scores } = rec;
    const confColor = confidence >= 80 ? '#48bb78' : confidence >= 60 ? '#ed8936' : '#e53e3e';

    // Feature scores HTML
    let featHTML = '';
    for (const [f, score] of Object.entries(scores)) {
        const name = translations[lang][f] || f;
        featHTML += `
            <div class="feat-item">
                <span class="feat-label">${name}</span>
                <div class="feat-bar-wrap">
                    <div class="feat-bar-fill" style="width:${score}%;background:${confColor}"></div>
                </div>
                <span class="feat-val">${score.toFixed(0)}%</span>
            </div>`;
    }

    // Irrigation schedule
    let irrHTML = '';
    if (crop.irrigationSchedule?.[lang]) {
        irrHTML = `<div class="detail-block">
            <h4>📅 ${translations[lang].irrigationSchedule || 'Irrigation Schedule'}</h4>
            <table class="irr-table">
                <thead><tr>
                    <th>${translations[lang].growthStage||'Stage'}</th>
                    <th>${translations[lang].days||'Days'}</th>
                    <th>${translations[lang].frequency||'Frequency'}</th>
                    <th>${translations[lang].waterDepth||'Depth'}</th>
                </tr></thead><tbody>
                ${crop.irrigationSchedule[lang].map(s => `
                    <tr><td><strong>${s.stage}</strong></td><td>${s.days}</td><td>${s.frequency}</td><td>${s.depth}</td></tr>
                `).join('')}
                </tbody>
            </table>
        </div>`;
    }

    const panel = document.getElementById('cropDetailPanel');
    panel.innerHTML = `
        <div class="crop-detail-card" style="--accent:${confColor}">
            <div class="crop-detail-hero">
                <div class="crop-detail-hero-left">
                    <div class="crop-detail-emoji">🌾</div>
                    <div>
                        <h2 class="crop-detail-name">${crop.name[lang]}</h2>
                        <p class="crop-detail-why">${crop.explanation?.[lang] || ''}</p>
                    </div>
                </div>
                <div class="crop-detail-conf-big" style="color:${confColor}">
                    <span class="conf-number">${confidence}%</span>
                    <span class="conf-label">${L.confidence}</span>
                </div>
            </div>

            <div class="detail-grid">
                <div class="detail-block">
                    <h4>🤖 ${L.aiExplanation}</h4>
                    <p>${explanation.summary}</p>
                    ${explanation.recommendations.length ? `<ul class="detail-recs">${explanation.recommendations.map(r=>`<li>${r}</li>`).join('')}</ul>` : ''}
                </div>

                <div class="detail-block">
                    <h4>📊 ${L.featureImportance}</h4>
                    <div class="feat-scores">${featHTML}</div>
                </div>

                <div class="detail-block">
                    <h4>🧪 ${L.soilAnalysis}</h4>
                    <div class="npk-grid">
                        <div class="npk-item npk-n"><span>N</span><p>${soilAnalysis.nitrogen}</p></div>
                        <div class="npk-item npk-p"><span>P</span><p>${soilAnalysis.phosphorus}</p></div>
                        <div class="npk-item npk-k"><span>K</span><p>${soilAnalysis.potassium}</p></div>
                    </div>
                </div>

                <div class="detail-block">
                    <h4>⚗️ ${L.npkReq}</h4>
                    ${['n','p','k'].map(n => {
                        const val = n==='n'?inputs.nitrogen:n==='p'?inputs.phosphorus:inputs.potassium;
                        const [lo,hi] = crop.npk[n];
                        const ok = val>=lo && val<=hi;
                        return `<div class="npk-req-row">
                            <span>${n.toUpperCase()}: ${lo}-${hi}%</span>
                            <span class="npk-yours ${ok?'npk-ok':'npk-warn'}">${L.your}: ${val}% ${ok?'✓':'⚠️'}</span>
                        </div>`;
                    }).join('')}
                    <div class="npk-req-row">
                        <span>${L.phRange}: ${crop.phRange[0]}-${crop.phRange[1]}</span>
                        <span class="npk-yours ${inputs.soilPh>=crop.phRange[0]&&inputs.soilPh<=crop.phRange[1]?'npk-ok':'npk-warn'}">${L.your}: ${inputs.soilPh} ${inputs.soilPh>=crop.phRange[0]&&inputs.soilPh<=crop.phRange[1]?'✓':'⚠️'}</span>
                    </div>
                </div>

                <div class="detail-block">
                    <h4>💧 ${L.irrigation}</h4>
                    <p>${crop.irrigation?.[lang] || ''}</p>
                </div>

                <div class="detail-block">
                    <h4>🌿 ${L.fertilizers}</h4>
                    <p>${crop.fertilizers?.[lang] || ''}</p>
                </div>
            </div>

            ${irrHTML}
        </div>`;

    panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function generateCropCard(rec, inputs, soilAnalysis, rankLabel, isBest) {
    const { crop, confidence, explanation, scores } = rec;
    
    let featureScoresHTML = '';
    for (const [feature, score] of Object.entries(scores)) {
        const featureName = translations[currentLanguage][feature] || feature;
        featureScoresHTML += `
            <div class="feature-score-item">
                <strong>${featureName}</strong>
                <div class="score-bar">
                    <div class="score-fill" style="width: ${score}%"></div>
                </div>
                <span>${score.toFixed(0)}%</span>
            </div>
        `;
    }
    
    let recommendationsHTML = '';
    if (explanation.recommendations.length > 0) {
        recommendationsHTML = '<ul style="margin-top: 10px;">';
        explanation.recommendations.forEach(rec => {
            recommendationsHTML += `<li>${rec}</li>`;
        });
        recommendationsHTML += '</ul>';
    }
    
    const cardClass = isBest ? 'recommendation-card best-recommendation' : 'recommendation-card alternative-recommendation';
    
    return `
        <div class="${cardClass}">
            <div class="rank-badge">${rankLabel}</div>
            <div class="crop-name">${crop.name[currentLanguage]}</div>
            
            <div class="ai-explanation-section">
                <h4>🤖 ${translations[currentLanguage].aiExplanation}</h4>
                <p>${explanation.summary}</p>
                
                <div style="margin-top: 15px;">
                    <strong>${translations[currentLanguage].confidenceScore}:</strong>
                    <div class="confidence-bar">
                        <div class="confidence-fill" style="width: ${confidence}%">
                            ${confidence}%
                        </div>
                    </div>
                </div>
                
                <div style="margin-top: 20px;">
                    <h4>${translations[currentLanguage].featureImportance}:</h4>
                    <div class="feature-scores">
                        ${featureScoresHTML}
                    </div>
                </div>
                
                ${recommendationsHTML}
            </div>
            
            <div class="detail-section">
                <h4>${translations[currentLanguage].explanation}</h4>
                <p>${crop.explanation[currentLanguage]}</p>
                <p><strong>${translations[currentLanguage].phRange}</strong> ${crop.phRange[0]} - ${crop.phRange[1]} 
                   (${translations[currentLanguage].optimal}: ${inputs.soilPh >= crop.phRange[0] && inputs.soilPh <= crop.phRange[1] ? '✓' : '✗'})</p>
            </div>
            
            ${isBest ? `
            <div class="detail-section">
                <h4>${currentLanguage === 'en' ? 'Soil Analysis' : currentLanguage === 'te' ? 'నేల విశ్లేషణ' : 'मिट्टी विश्लेषण'}</h4>
                <p><strong>N:</strong> ${soilAnalysis.nitrogen}</p>
                <p><strong>P:</strong> ${soilAnalysis.phosphorus}</p>
                <p><strong>K:</strong> ${soilAnalysis.potassium}</p>
            </div>
            
            <div class="detail-section">
                <h4>${translations[currentLanguage].irrigation}</h4>
                <p>${crop.irrigation[currentLanguage]}</p>
            </div>
            
            <div class="detail-section">
                <h4>${translations[currentLanguage].fertilizers}</h4>
                <p>${crop.fertilizers[currentLanguage]}</p>
            </div>
            ` : ''}
            
            <div class="detail-section">
                <h4>NPK ${currentLanguage === 'en' ? 'Requirements' : currentLanguage === 'te' ? 'అవసరాలు' : 'आवश्यकताएं'}</h4>
                <p><strong>N:</strong> ${crop.npk.n[0]}-${crop.npk.n[1]}% 
                   (${currentLanguage === 'en' ? 'Your' : currentLanguage === 'te' ? 'మీది' : 'आपका'}: ${inputs.nitrogen}%)</p>
                <p><strong>P:</strong> ${crop.npk.p[0]}-${crop.npk.p[1]}% 
                   (${currentLanguage === 'en' ? 'Your' : currentLanguage === 'te' ? 'మీది' : 'आपका'}: ${inputs.phosphorus}%)</p>
                <p><strong>K:</strong> ${crop.npk.k[0]}-${crop.npk.k[1]}% 
                   (${currentLanguage === 'en' ? 'Your' : currentLanguage === 'te' ? 'మీది' : 'आपका'}: ${inputs.potassium}%)</p>
            </div>
        </div>
    `;
}

function generateComparisonTable(recommendations, language) {
    const headers = {
        en: { crop: 'Crop', confidence: 'Confidence', climate: 'Climate Match', season: 'Season Match', soil: 'Soil Match', ph: 'pH Match' },
        te: { crop: 'పంట', confidence: 'విశ్వాసం', climate: 'వాతావరణం మ్యాచ్', season: 'సీజన్ మ్యాచ్', soil: 'నేల మ్యాచ్', ph: 'pH మ్యాచ్' },
        hi: { crop: 'फसल', confidence: 'विश्वास', climate: 'जलवायु मेल', season: 'मौसम मेल', soil: 'मिट्टी मेल', ph: 'pH मेल' }
    };
    
    const h = headers[language];
    
    let tableHTML = `
        <div class="comparison-section">
            <h3>${language === 'en' ? '📊 Comparison Table' : language === 'te' ? '📊 పోలిక పట్టిక' : '📊 तुलना तालिका'}</h3>
            <table class="comparison-table">
                <thead>
                    <tr>
                        <th>${h.crop}</th>
                        <th>${h.confidence}</th>
                        <th>${h.climate}</th>
                        <th>${h.season}</th>
                        <th>${h.soil}</th>
                        <th>${h.ph}</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    recommendations.forEach((rec, index) => {
        const rowClass = index === 0 ? 'best-row' : '';
        tableHTML += `
            <tr class="${rowClass}">
                <td><strong>${rec.crop.name[language]}</strong></td>
                <td><span class="confidence-badge">${rec.confidence}%</span></td>
                <td><span class="score-badge">${rec.scores.climate.toFixed(0)}%</span></td>
                <td><span class="score-badge">${rec.scores.season.toFixed(0)}%</span></td>
                <td><span class="score-badge">${rec.scores.soilType.toFixed(0)}%</span></td>
                <td><span class="score-badge">${rec.scores.ph.toFixed(0)}%</span></td>
            </tr>
        `;
    });
    
    tableHTML += `
                </tbody>
            </table>
        </div>
    `;
    
    return tableHTML;
}


// ── Disease Detection Feature ────────────────────────────────────────────
const diseaseModal       = document.getElementById('diseaseModal');
const diseaseDetectionBtn = document.getElementById('diseaseDetectionBtn');
const diseaseImageInput  = document.getElementById('diseaseImageInput');
const diseasePreviewImg  = document.getElementById('diseasePreviewImg');
const diseasePreviewSection = document.getElementById('diseasePreviewSection');
const diseaseDropZone    = document.getElementById('diseaseDropZone');
const analyzeImageBtn    = document.getElementById('analyzeImageBtn');
const analyzeAnotherBtn  = document.getElementById('analyzeAnotherBtn');
const removeImageBtn     = document.getElementById('removeImageBtn');

// Camera state
let cameraStream   = null;
let facingMode     = 'environment'; // rear camera by default

// Open modal
if (diseaseDetectionBtn) {
    diseaseDetectionBtn.addEventListener('click', () => {
        diseaseModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        resetDiseaseModal();
    });
}

// Close modal
window.addEventListener('click', (e) => {
    if (e.target === diseaseModal) {
        diseaseModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

function resetDiseaseModal() {
    stopCamera();
    document.getElementById('diseaseUploadSection').style.display = 'block';
    document.getElementById('diseaseAnalyzing').style.display     = 'none';
    document.getElementById('diseaseResults').style.display       = 'none';
    diseasePreviewSection.style.display = 'none';
    diseaseDropZone.style.display       = 'block';
    diseasePreviewImg.src = '';
    if (diseaseImageInput)  diseaseImageInput.value  = '';
    const sel = document.getElementById('diseaseCropSelect');
    if (sel) sel.value = '';
}

// Handle file selection
function handleImageFile(file) {
    if (!file || !file.type.startsWith('image/')) {
        alert('Please select a valid image file (JPG, PNG, WEBP).');
        return;
    }
    if (file.size > 10 * 1024 * 1024) {
        alert('Image too large. Please use an image under 10MB.');
        return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
        diseasePreviewImg.src = e.target.result;
        diseasePreviewSection.style.display = 'block';
        diseaseDropZone.style.display = 'none';
    };
    reader.readAsDataURL(file);
}

if (diseaseImageInput)  diseaseImageInput.addEventListener('change',  (e) => handleImageFile(e.target.files[0]));

//  Camera (getUserMedia) 
const openCameraBtn   = document.getElementById('openCameraBtn');
const cameraSection   = document.getElementById('cameraSection');
const cameraVideo     = document.getElementById('cameraStream');
const cameraCanvas    = document.getElementById('cameraCanvas');
const captureBtn      = document.getElementById('captureBtn');
const switchCameraBtn = document.getElementById('switchCameraBtn');
const closeCameraBtn  = document.getElementById('closeCameraBtn');

async function startCamera() {
    stopCamera();
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert('Camera not supported in this browser. Please use Chrome or Firefox.');
        return;
    }
    try {
        cameraStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode, width: { ideal: 1280 }, height: { ideal: 720 } },
            audio: false
        });
        cameraVideo.srcObject = cameraStream;
        diseaseDropZone.style.display       = 'none';
        diseasePreviewSection.style.display = 'none';
        cameraSection.style.display         = 'block';
    } catch (err) {
        const msg = err.name === 'NotAllowedError'
            ? 'Camera access denied. Please allow camera permission in your browser settings.'
            : err.name === 'NotFoundError'
            ? 'No camera found on this device.'
            : 'Camera error: ' + err.message;
        alert(msg);
    }
}

function stopCamera() {
    if (cameraStream) {
        cameraStream.getTracks().forEach(function(t) { t.stop(); });
        cameraStream = null;
    }
    if (cameraVideo) cameraVideo.srcObject = null;
    if (cameraSection) cameraSection.style.display = 'none';
}

if (openCameraBtn) openCameraBtn.addEventListener('click', startCamera);

if (captureBtn) {
    captureBtn.addEventListener('click', function() {
        if (!cameraVideo || !cameraStream) return;
        cameraCanvas.width  = cameraVideo.videoWidth  || 640;
        cameraCanvas.height = cameraVideo.videoHeight || 480;
        cameraCanvas.getContext('2d').drawImage(cameraVideo, 0, 0);
        diseasePreviewImg.src = cameraCanvas.toDataURL('image/jpeg', 0.92);
        diseasePreviewSection.style.display = 'block';
        stopCamera();
        diseaseDropZone.style.display = 'none';
    });
}

if (switchCameraBtn) {
    switchCameraBtn.addEventListener('click', function() {
        facingMode = facingMode === 'environment' ? 'user' : 'environment';
        startCamera();
    });
}

if (closeCameraBtn) {
    closeCameraBtn.addEventListener('click', function() {
        stopCamera();
        diseaseDropZone.style.display = 'block';
    });
}

// Drag & drop
if (diseaseDropZone) {
    diseaseDropZone.addEventListener('dragover',  (e) => { e.preventDefault(); diseaseDropZone.classList.add('drag-over'); });
    diseaseDropZone.addEventListener('dragleave', ()  => diseaseDropZone.classList.remove('drag-over'));
    diseaseDropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        diseaseDropZone.classList.remove('drag-over');
        handleImageFile(e.dataTransfer.files[0]);
    });
}

// Remove image
if (removeImageBtn) {
    removeImageBtn.addEventListener('click', () => {
        diseasePreviewSection.style.display = 'none';
        diseaseDropZone.style.display = 'block';
        diseasePreviewImg.src = '';
        if (diseaseImageInput)  diseaseImageInput.value  = '';
        if (diseaseCameraInput) diseaseCameraInput.value = '';
    });
}

// Analyze button
if (analyzeImageBtn) {
    analyzeImageBtn.addEventListener('click', () => {
        const cropKey = document.getElementById('diseaseCropSelect').value;
        if (!cropKey) {
            alert(currentLanguage === 'en' ? 'Please select a crop type first.' :
                  currentLanguage === 'te' ? 'దయచేసి ముందు పంట రకాన్ని ఎంచుకోండి.' :
                  'कृपया पहले फसल का प्रकार चुनें।');
            return;
        }
        if (!diseasePreviewImg.src || diseasePreviewImg.src === window.location.href) {
            alert('Please upload a leaf image first.');
            return;
        }
        runDiseaseAnalysis(cropKey);
    });
}

// Analyze another
if (analyzeAnotherBtn) {
    analyzeAnotherBtn.addEventListener('click', () => {
        stopCamera();
        resetDiseaseModal();
    });
}

// ── Core analysis function ────────────────────────────────────────────────
function runDiseaseAnalysis(cropKey) {
    document.getElementById('diseaseUploadSection').style.display = 'none';
    document.getElementById('diseaseAnalyzing').style.display     = 'block';
    document.getElementById('diseaseResults').style.display       = 'none';

    // Simulate ML analysis (2 seconds) then show result
    setTimeout(() => {
        const result = analyzeLeafImage(cropKey, diseasePreviewImg);
        document.getElementById('diseaseAnalyzing').style.display = 'none';
        document.getElementById('diseaseResults').style.display   = 'block';
        renderDiseaseResult(result);
    }, 2000);
}

// ── Image analysis: improved color + variance detection ──────────────────
function analyzeLeafImage(cropKey, imgEl) {
    const canvas = document.createElement('canvas');
    const ctx    = canvas.getContext('2d');
    canvas.width  = 150;
    canvas.height = 150;
    ctx.drawImage(imgEl, 0, 0, 150, 150);

    const data = ctx.getImageData(0, 0, 150, 150).data;

    let brown = 0, yellow = 0, orange = 0, white = 0, dark = 0,
        pureGreen = 0, total = 0;
    let rSum = 0, gSum = 0, bSum = 0;

    for (let i = 0; i < data.length; i += 4) {
        const r = data[i], g = data[i+1], b = data[i+2];
        total++;
        rSum += r; gSum += g; bSum += b;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const sat = max === 0 ? 0 : (max - min) / max;

        // Pure healthy green: green dominant, saturated
        if (g > r + 20 && g > b + 20 && g > 80 && sat > 0.2) pureGreen++;
        // Brown / rust (disease spots)
        else if (r > 100 && g > 50 && g < r - 20 && b < 80 && sat > 0.15) brown++;
        // Yellow (chlorosis / blight)
        else if (r > 160 && g > 140 && b < 100 && sat > 0.2) yellow++;
        // Orange (rust pustules)
        else if (r > 180 && g > 80 && g < 150 && b < 80) orange++;
        // White/gray patches (powdery mildew, fungal)
        else if (r > 180 && g > 180 && b > 180 && sat < 0.15) white++;
        // Very dark (necrosis)
        else if (max < 60) dark++;
    }

    const pG = pureGreen / total;
    const pB = brown     / total;
    const pY = yellow    / total;
    const pO = orange    / total;
    const pW = white     / total;
    const pD = dark      / total;

    // Disease signal = everything that is NOT healthy green
    const diseaseSignal = pB + pY + pO + pW + pD;

    const diseases = (typeof diseaseDatabase !== 'undefined')
        ? (diseaseDatabase[cropKey] || []) : [];

    let detected, confidence;

    // ── Decision: if disease signal is strong enough, pick a disease ────────
    if (diseaseSignal > 0.12 && diseases.length > 0) {
        // Map dominant symptom color → disease index
        const scores = diseases.map((d, idx) => {
            let score = 0;
            const id = d.id || '';
            // Brown spots → blast, blight, leaf spot, early blight
            if ((id.includes('blast') || id.includes('spot') || id.includes('blight') || id.includes('rot')))
                score += pB * 3 + pD * 2;
            // Yellow → blight, mosaic, curl virus
            if ((id.includes('blight') || id.includes('curl') || id.includes('mosaic') || id.includes('rust')))
                score += pY * 3 + pO * 2;
            // White/gray → powdery mildew, fungal
            if ((id.includes('mildew') || id.includes('blast') || id.includes('smut')))
                score += pW * 3;
            // Orange → rust
            if (id.includes('rust'))
                score += pO * 4;
            // Fallback: all diseases get base score from total disease signal
            score += diseaseSignal * 0.5;
            return { idx, score };
        });

        scores.sort((a, b) => b.score - a.score);
        detected   = diseases[scores[0].idx];
        confidence = Math.min(94, Math.round(55 + diseaseSignal * 180));

    } else if (pG > 0.35) {
        // Mostly green → healthy
        detected   = (typeof healthyResult !== 'undefined') ? healthyResult : diseases[0];
        confidence = Math.min(92, Math.round(70 + pG * 40));

    } else if (diseases.length > 0) {
        // Ambiguous image — still pick most likely disease rather than defaulting to healthy
        detected   = diseases[0];
        confidence = Math.min(75, Math.round(50 + diseaseSignal * 100));

    } else {
        detected   = (typeof healthyResult !== 'undefined') ? healthyResult : null;
        confidence = 60;
    }

    return { disease: detected, confidence, cropKey };
}

// ── Render result card ────────────────────────────────────────────────────
function renderDiseaseResult({ disease, confidence, cropKey }) {
    if (!disease) return;
    const lang = currentLanguage || 'en';
    const name = disease.name[lang] || disease.name.en;
    const isHealthy = disease.id === 'healthy';

    const severityText = {
        none:   { en: 'Healthy', te: 'ఆరోగ్యకరమైన', hi: 'स्वस्थ' },
        low:    { en: 'Low',     te: 'తక్కువ',       hi: 'कम'    },
        medium: { en: 'Medium',  te: 'మధ్యస్థ',      hi: 'मध्यम' },
        high:   { en: 'High',    te: 'అధిక',          hi: 'उच्च'  }
    };
    const sevLabel = severityText[disease.severity]?.[lang] || disease.severity;

    const labels = {
        en: { symptoms: '🔍 Symptoms', causes: '⚠️ Causes', treatment: '💊 Treatment', prevention: '🛡️ Prevention', organic: '🌿 Organic Treatment', confidence: 'Confidence' },
        te: { symptoms: '🔍 లక్షణాలు', causes: '⚠️ కారణాలు', treatment: '💊 చికిత్స', prevention: '🛡️ నివారణ', organic: '🌿 సేంద్రీయ చికిత్స', confidence: 'నమ్మకం' },
        hi: { symptoms: '🔍 लक्षण', causes: '⚠️ कारण', treatment: '💊 उपचार', prevention: '🛡️ रोकथाम', organic: '🌿 जैविक उपचार', confidence: 'विश्वास' }
    };
    const L = labels[lang] || labels.en;

    document.getElementById('diseaseResultContent').innerHTML = `
        <div class="disease-result-card">
            <div class="disease-result-header" style="background:${disease.color};">
                <h3>${isHealthy ? '✅' : '🦠'} ${name}</h3>
                <span class="severity-badge">${sevLabel}</span>
            </div>
            <div class="disease-result-body">
                <div class="disease-confidence">
                    <span>${L.confidence}:</span>
                    <div class="confidence-bar-small">
                        <div class="confidence-fill-small" style="width:${confidence}%;background:${disease.color};"></div>
                    </div>
                    <strong>${confidence}%</strong>
                </div>

                <div class="disease-info-section">
                    <h4>${L.symptoms}</h4>
                    <p>${disease.symptoms[lang] || disease.symptoms.en}</p>
                </div>
                ${!isHealthy ? `
                <div class="disease-info-section">
                    <h4>${L.causes}</h4>
                    <p>${disease.causes[lang] || disease.causes.en}</p>
                </div>
                <div class="disease-info-section">
                    <h4>${L.treatment}</h4>
                    <p>${disease.treatment[lang] || disease.treatment.en}</p>
                </div>
                <div class="disease-info-section">
                    <h4>${L.organic}</h4>
                    <p>${disease.organic[lang] || disease.organic.en}</p>
                </div>` : ''}
                <div class="disease-info-section">
                    <h4>${L.prevention}</h4>
                    <p>${disease.prevention[lang] || disease.prevention.en}</p>
                </div>
            </div>
        </div>`;
}


// Text-to-speech function
function speak(text) {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = currentLanguage === 'en' ? 'en-US' : 
                        currentLanguage === 'te' ? 'te-IN' : 'hi-IN';
        speechSynthesis.speak(utterance);
    }
}


// Text-to-Speech for Recommendations
let currentSpeech = null;

function readRecommendationsAloud(recommendations, inputs, location) {
    const readBtn = document.getElementById('readRecommendationsBtn');
    
    // If already speaking, stop it
    if (currentSpeech && speechSynthesis.speaking) {
        speechSynthesis.cancel();
        currentSpeech = null;
        if (readBtn) {
            readBtn.textContent = `🔊 ${translations[currentLanguage].readAloud}`;
            readBtn.classList.remove('reading');
        }
        return;
    }
    
    // Check if speech synthesis is supported
    if (!('speechSynthesis' in window)) {
        alert(currentLanguage === 'en' ? 'Text-to-speech is not supported in your browser' :
              currentLanguage === 'te' ? 'మీ బ్రౌజర్‌లో టెక్స్ట్-టు-స్పీచ్ మద్దతు లేదు' :
              'आपके ब्राउज़र में टेक्स्ट-टू-स्पीच समर्थित नहीं है');
        return;
    }
    
    // Update button to show "Stop Reading"
    if (readBtn) {
        readBtn.textContent = `⏹️ ${translations[currentLanguage].stopReading}`;
        readBtn.classList.add('reading');
    }
    
    // Get location details
    const locationDetails = getLocationDetails(location, currentLanguage);
    const locationName = locationDetails ? locationDetails.name : location;
    
    // Build the text to read
    let textToRead = '';
    
    // Introduction
    if (currentLanguage === 'en') {
        textToRead = `Top Crop Recommendations for ${locationName}. `;
    } else if (currentLanguage === 'te') {
        textToRead = `${locationName} kosam top panta sifarasulu. `;
    } else {
        textToRead = `${locationName} ke liye sheersh fasal sifarishein. `;
    }
    
    // Add each recommendation
    recommendations.forEach((rec, index) => {
        const crop = rec.crop;
        const confidence = rec.confidence;
        const explanation = rec.explanation;
        
        if (index === 0) {
            if (currentLanguage === 'en') {
                textToRead += `Best recommendation: ${crop.name[currentLanguage]}. `;
                textToRead += `Confidence score: ${confidence} percent. `;
                textToRead += `${explanation.summary} `;
            } else if (currentLanguage === 'te') {
                textToRead += `Uttama sifarasu: ${crop.name['en']}. `;
                textToRead += `Vishwasa score: ${confidence} shatam. `;
                // Use English explanation for better pronunciation
                textToRead += `${explanation.summary} `;
            } else {
                textToRead += `Sarvashreshth sifarish: ${crop.name['en']}. `;
                textToRead += `Vishwas score: ${confidence} pratishat. `;
                textToRead += `${explanation.summary} `;
            }
        } else {
            if (currentLanguage === 'en') {
                textToRead += `Alternative ${index + 1}: ${crop.name[currentLanguage]}. `;
                textToRead += `Confidence: ${confidence} percent. `;
            } else if (currentLanguage === 'te') {
                textToRead += `Pratyamnyam ${index + 1}: ${crop.name['en']}. `;
                textToRead += `Vishwasam: ${confidence} shatam. `;
            } else {
                textToRead += `Vikalp ${index + 1}: ${crop.name['en']}. `;
                textToRead += `Vishwas: ${confidence} pratishat. `;
            }
        }
    });
    
    // Create speech synthesis utterance
    const utterance = new SpeechSynthesisUtterance(textToRead);
    
    // Get available voices
    const voices = speechSynthesis.getVoices();
    let selectedVoice = null;
    
    // Try to find appropriate voice based on language
    if (currentLanguage === 'en') {
        utterance.lang = 'en-US';
        selectedVoice = voices.find(voice => voice.lang.startsWith('en'));
    } else if (currentLanguage === 'te') {
        // Try Telugu voice first
        utterance.lang = 'te-IN';
        selectedVoice = voices.find(voice => voice.lang.startsWith('te'));
        
        // Fallback to Hindi if Telugu not available
        if (!selectedVoice) {
            utterance.lang = 'hi-IN';
            selectedVoice = voices.find(voice => voice.lang.startsWith('hi'));
        }
        
        // Final fallback to English
        if (!selectedVoice) {
            utterance.lang = 'en-IN';
            selectedVoice = voices.find(voice => voice.lang.startsWith('en-IN') || voice.lang.startsWith('en'));
        }
    } else {
        // Hindi
        utterance.lang = 'hi-IN';
        selectedVoice = voices.find(voice => voice.lang.startsWith('hi'));
        
        // Fallback to English if Hindi not available
        if (!selectedVoice) {
            utterance.lang = 'en-IN';
            selectedVoice = voices.find(voice => voice.lang.startsWith('en-IN') || voice.lang.startsWith('en'));
        }
    }
    
    // Set the voice if found
    if (selectedVoice) {
        utterance.voice = selectedVoice;
    }
    
    // Set speech properties
    utterance.rate = 0.85; // Slower for better clarity in regional languages
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    
    // Handle speech end
    utterance.onend = () => {
        currentSpeech = null;
        if (readBtn) {
            readBtn.textContent = `🔊 ${translations[currentLanguage].readAloud}`;
            readBtn.classList.remove('reading');
        }
    };
    
    // Handle speech error
    utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        currentSpeech = null;
        if (readBtn) {
            readBtn.textContent = `🔊 ${translations[currentLanguage].readAloud}`;
            readBtn.classList.remove('reading');
        }
    };
    
    // Wait for voices to load if not already loaded
    if (voices.length === 0) {
        speechSynthesis.addEventListener('voiceschanged', () => {
            const newVoices = speechSynthesis.getVoices();
            if (currentLanguage === 'te') {
                const teluguVoice = newVoices.find(voice => voice.lang.startsWith('te'));
                if (teluguVoice) utterance.voice = teluguVoice;
            }
            currentSpeech = utterance;
            speechSynthesis.speak(utterance);
        }, { once: true });
    } else {
        // Start speaking immediately
        currentSpeech = utterance;
        speechSynthesis.speak(utterance);
    }
}

// Stop speech when language changes
languageSelector.addEventListener('change', () => {
    if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
        currentSpeech = null;
    }
});
