/**
 * CROPXAI Weather Service
 * Fetches live weather based on SELECTED STATE (no GPS required)
 * Uses Open-Meteo API (free, no API key, WMO-standard data)
 * Coordinates are state capitals / geographic centres of each Indian state/UT
 */

const WeatherService = (() => {

    const OPEN_METEO_URL = 'https://api.open-meteo.com/v1/forecast';

    // ── State → { lat, lon, capital, climate } ───────────────────────────────
    // Coordinates are state capital cities (IMD reference points)
    const STATE_DATA = {
        'andhra-pradesh':         { lat: 15.9129, lon: 79.7400, capital: 'Amaravati',       climate: 'tropical'    },
        'arunachal-pradesh':      { lat: 27.0844, lon: 93.6053, capital: 'Itanagar',         climate: 'tropical'    },
        'assam':                  { lat: 26.2006, lon: 92.9376, capital: 'Dispur',            climate: 'tropical'    },
        'bihar':                  { lat: 25.5941, lon: 85.1376, capital: 'Patna',             climate: 'subtropical' },
        'chhattisgarh':           { lat: 21.2787, lon: 81.8661, capital: 'Raipur',            climate: 'subtropical' },
        'goa':                    { lat: 15.2993, lon: 74.1240, capital: 'Panaji',            climate: 'tropical'    },
        'gujarat':                { lat: 23.2156, lon: 72.6369, capital: 'Gandhinagar',       climate: 'subtropical' },
        'haryana':                { lat: 30.7333, lon: 76.7794, capital: 'Chandigarh',        climate: 'temperate'   },
        'himachal-pradesh':       { lat: 31.1048, lon: 77.1734, capital: 'Shimla',            climate: 'temperate'   },
        'jharkhand':              { lat: 23.3441, lon: 85.3096, capital: 'Ranchi',            climate: 'subtropical' },
        'karnataka':              { lat: 12.9716, lon: 77.5946, capital: 'Bengaluru',         climate: 'tropical'    },
        'kerala':                 { lat: 8.5241,  lon: 76.9366, capital: 'Thiruvananthapuram',climate: 'tropical'    },
        'madhya-pradesh':         { lat: 23.2599, lon: 77.4126, capital: 'Bhopal',            climate: 'subtropical' },
        'maharashtra':            { lat: 19.0760, lon: 72.8777, capital: 'Mumbai',            climate: 'subtropical' },
        'manipur':                { lat: 24.8170, lon: 93.9368, capital: 'Imphal',            climate: 'tropical'    },
        'meghalaya':              { lat: 25.5788, lon: 91.8933, capital: 'Shillong',          climate: 'tropical'    },
        'mizoram':                { lat: 23.1645, lon: 92.9376, capital: 'Aizawl',            climate: 'tropical'    },
        'nagaland':               { lat: 25.6751, lon: 94.1086, capital: 'Kohima',            climate: 'tropical'    },
        'odisha':                 { lat: 20.2961, lon: 85.8245, capital: 'Bhubaneswar',       climate: 'tropical'    },
        'punjab':                 { lat: 30.9010, lon: 75.8573, capital: 'Chandigarh',        climate: 'temperate'   },
        'rajasthan':              { lat: 26.9124, lon: 75.7873, capital: 'Jaipur',            climate: 'arid'        },
        'sikkim':                 { lat: 27.3389, lon: 88.6065, capital: 'Gangtok',           climate: 'tropical'    },
        'tamil-nadu':             { lat: 13.0827, lon: 80.2707, capital: 'Chennai',           climate: 'tropical'    },
        'telangana':              { lat: 17.3850, lon: 78.4867, capital: 'Hyderabad',         climate: 'tropical'    },
        'tripura':                { lat: 23.9408, lon: 91.9882, capital: 'Agartala',          climate: 'tropical'    },
        'uttar-pradesh':          { lat: 26.8467, lon: 80.9462, capital: 'Lucknow',           climate: 'subtropical' },
        'uttarakhand':            { lat: 30.3165, lon: 78.0322, capital: 'Dehradun',          climate: 'temperate'   },
        'west-bengal':            { lat: 22.5726, lon: 88.3639, capital: 'Kolkata',           climate: 'tropical'    },
        // Union Territories
        'andaman-and-nicobar':    { lat: 11.7401, lon: 92.6586, capital: 'Port Blair',        climate: 'tropical'    },
        'chandigarh':             { lat: 30.7333, lon: 76.7794, capital: 'Chandigarh',        climate: 'temperate'   },
        'dadra-and-nagar-haveli': { lat: 20.1809, lon: 73.0169, capital: 'Silvassa',          climate: 'tropical'    },
        'daman-and-diu':          { lat: 20.4283, lon: 72.8397, capital: 'Daman',             climate: 'tropical'    },
        'delhi':                  { lat: 28.6139, lon: 77.2090, capital: 'New Delhi',         climate: 'temperate'   },
        'jammu-and-kashmir':      { lat: 34.0837, lon: 74.7973, capital: 'Srinagar',          climate: 'temperate'   },
        'ladakh':                 { lat: 34.1526, lon: 77.5771, capital: 'Leh',               climate: 'temperate'   },
        'lakshadweep':            { lat: 10.5667, lon: 72.6417, capital: 'Kavaratti',         climate: 'tropical'    },
        'puducherry':             { lat: 11.9416, lon: 79.8083, capital: 'Puducherry',        climate: 'tropical'    },
    };

    // ── WMO weather code → emoji ─────────────────────────────────────────────
    const WMO_ICONS = {
        0: '☀️', 1: '🌤️', 2: '⛅', 3: '☁️',
        45: '🌫️', 48: '🌫️',
        51: '🌦️', 53: '🌦️', 55: '🌧️',
        61: '🌧️', 63: '🌧️', 65: '🌧️',
        71: '🌨️', 73: '🌨️', 75: '❄️',
        80: '🌦️', 81: '🌧️', 82: '⛈️',
        95: '⛈️', 96: '⛈️', 99: '⛈️'
    };

    const WMO_DESC = {
        0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
        45: 'Foggy', 48: 'Icy fog',
        51: 'Light drizzle', 53: 'Drizzle', 55: 'Heavy drizzle',
        61: 'Light rain', 63: 'Rain', 65: 'Heavy rain',
        71: 'Light snow', 73: 'Snow', 75: 'Heavy snow',
        80: 'Rain showers', 81: 'Heavy showers', 82: 'Violent showers',
        95: 'Thunderstorm', 96: 'Thunderstorm + hail', 99: 'Heavy thunderstorm'
    };

    // ── Fetch weather for given coordinates ──────────────────────────────────
    async function fetchWeather(lat, lon) {
        const params = new URLSearchParams({
            latitude:      lat.toFixed(4),
            longitude:     lon.toFixed(4),
            current:       'temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m,weather_code',
            timezone:      'Asia/Kolkata',
            forecast_days: 1
        });
        const res = await fetch(`${OPEN_METEO_URL}?${params}`);
        if (!res.ok) throw new Error(`Weather API error ${res.status}`);
        return res.json();
    }

    // ── Update the weather widget UI ─────────────────────────────────────────
    function updateWidget(temp, humidity, rain, wind, weatherCode, capital, stateName, climate) {
        const lang = (typeof currentLanguage !== 'undefined') ? currentLanguage : 'en';

        const climateLabels = {
            tropical:    { en: 'Tropical',    te: 'ఉష్ణమండల',    hi: 'उष्णकटिबंधीय'   },
            subtropical: { en: 'Subtropical', te: 'ఉపఉష్ణమండల',  hi: 'उपोष्णकटिबंधीय' },
            temperate:   { en: 'Temperate',   te: 'సమశీతోష్ణ',    hi: 'समशीतोष्ण'       },
            arid:        { en: 'Arid',        te: 'శుష్క',         hi: 'शुष्क'           }
        };

        document.getElementById('weatherTemp').textContent         = `${temp}°C`;
        document.getElementById('weatherHumidity').textContent     = `${humidity}%`;
        document.getElementById('weatherRain').textContent         = `${rain} mm`;
        document.getElementById('weatherWind').textContent         = `${wind} km/h`;
        document.getElementById('weatherIcon').textContent         = WMO_ICONS[weatherCode] || '🌡️';
        document.getElementById('weatherIcon').title               = WMO_DESC[weatherCode] || '';
        document.getElementById('weatherLocation').textContent     = `${capital}, ${stateName}`;
        document.getElementById('detectedClimateLabel').textContent =
            climateLabels[climate]?.[lang] || climate;
    }

    // ── Main: fetch weather for selected state ───────────────────────────────
    async function fetchForState(stateKey) {
        const loadingEl = document.getElementById('weatherLoading');
        const widgetEl  = document.getElementById('weatherWidget');
        const errorEl   = document.getElementById('weatherError');
        if (!loadingEl) return;

        const stateInfo = STATE_DATA[stateKey];
        if (!stateInfo) {
            widgetEl.style.display  = 'none';
            loadingEl.style.display = 'none';
            return;
        }

        loadingEl.style.display = 'block';
        widgetEl.style.display  = 'none';
        errorEl.style.display   = 'none';

        try {
            const weatherData = await fetchWeather(stateInfo.lat, stateInfo.lon);
            const c           = weatherData.current;

            updateWidget(
                c.temperature_2m,
                c.relative_humidity_2m,
                c.precipitation,
                c.wind_speed_10m,
                c.weather_code,
                stateInfo.capital,
                stateKey.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
                stateInfo.climate
            );

            // Auto-fill climate (hidden input — derived from state)
            const climateInput = document.getElementById('climate');
            if (climateInput) climateInput.value = stateInfo.climate;

            loadingEl.style.display = 'none';
            widgetEl.style.display  = 'block';

            return { ...c, climate: stateInfo.climate, capital: stateInfo.capital };

        } catch (err) {
            console.error('Weather fetch error:', err);
            loadingEl.style.display = 'none';
            errorEl.textContent     = `⚠️ Could not fetch weather for this state: ${err.message}`;
            errorEl.style.display   = 'block';
            return null;
        }
    }

    return { fetchForState, STATE_DATA };
})();
