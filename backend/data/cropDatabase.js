const cropDatabase = {
    rice: {
        name: { en: "Rice", te: "వరి", hi: "चावल" },
        climate: ["tropical", "subtropical"],
        season: ["kharif"],
        soilType: ["clay", "loamy", "alluvial"],
        phRange: [5.5, 7.0],
        npk: { n: [80, 120], p: [40, 60], k: [40, 60] },
        irrigation: {
            en: "Flood irrigation or drip irrigation. Requires 1200-1500mm water annually.",
            te: "వరద నీటిపారుదల లేదా డ్రిప్ నీటిపారుదల. సంవత్సరానికి 1200-1500mm నీరు అవసరం.",
            hi: "बाढ़ सिंचाई या ड्रिप सिंचाई। सालाना 1200-1500mm पानी की आवश्यकता।"
        },
        irrigationSchedule: {
            en: [
                { stage: "Land Preparation", days: "0-7", frequency: "Continuous flooding", depth: "5-7 cm" },
                { stage: "Transplanting", days: "7-10", frequency: "Daily", depth: "2-3 cm" },
                { stage: "Tillering", days: "10-40", frequency: "Every 2-3 days", depth: "5 cm" },
                { stage: "Panicle Initiation", days: "40-60", frequency: "Every 2 days", depth: "5-7 cm" },
                { stage: "Flowering", days: "60-90", frequency: "Every 2 days", depth: "5 cm" },
                { stage: "Grain Filling", days: "90-110", frequency: "Every 3-4 days", depth: "3-5 cm" },
                { stage: "Maturity", days: "110-120", frequency: "Stop 10 days before harvest", depth: "0 cm" }
            ],
            te: [
                { stage: "భూమి తయారీ", days: "0-7", frequency: "నిరంతర వరదలు", depth: "5-7 సెం.మీ" },
                { stage: "నాటడం", days: "7-10", frequency: "ప్రతిరోజు", depth: "2-3 సెం.మీ" },
                { stage: "టిల్లరింగ్", days: "10-40", frequency: "ప్రతి 2-3 రోజులు", depth: "5 సెం.మీ" },
                { stage: "పానికల్ ఇనిషియేషన్", days: "40-60", frequency: "ప్రతి 2 రోజులు", depth: "5-7 సెం.మీ" },
                { stage: "పుష్పించడం", days: "60-90", frequency: "ప్రతి 2 రోజులు", depth: "5 సెం.మీ" },
                { stage: "ధాన్యం నింపడం", days: "90-110", frequency: "ప్రతి 3-4 రోజులు", depth: "3-5 సెం.మీ" },
                { stage: "పరిపక్వత", days: "110-120", frequency: "కోత 10 రోజుల ముందు ఆపండి", depth: "0 సెం.మీ" }
            ],
            hi: [
                { stage: "भूमि तैयारी", days: "0-7", frequency: "निरंतर बाढ़", depth: "5-7 सेमी" },
                { stage: "रोपाई", days: "7-10", frequency: "दैनिक", depth: "2-3 सेमी" },
                { stage: "कल्ले फूटना", days: "10-40", frequency: "हर 2-3 दिन", depth: "5 सेमी" },
                { stage: "बाली आरंभ", days: "40-60", frequency: "हर 2 दिन", depth: "5-7 सेमी" },
                { stage: "फूल आना", days: "60-90", frequency: "हर 2 दिन", depth: "5 सेमी" },
                { stage: "दाना भरना", days: "90-110", frequency: "हर 3-4 दिन", depth: "3-5 सेमी" },
                { stage: "परिपक्वता", days: "110-120", frequency: "कटाई से 10 दिन पहले बंद करें", depth: "0 सेमी" }
            ]
        },
        fertilizers: {
            en: "Urea (N), Single Super Phosphate (P), Muriate of Potash (K). Apply in split doses.",
            te: "యూరియా (N), సింగిల్ సూపర్ ఫాస్ఫేట్ (P), మ్యూరియేట్ ఆఫ్ పొటాష్ (K). విభజిత మోతాదులలో వర్తించండి.",
            hi: "यूरिया (N), सिंगल सुपर फॉस्फेट (P), म्यूरेट ऑफ पोटाश (K)। विभाजित खुराक में लागू करें।"
        },
        explanation: {
            en: "Ideal for your climate and soil. High market demand with good yield potential.",
            te: "మీ వాతావరణం మరియు నేలకు అనువైనది. మంచి దిగుబడి సామర్థ్యంతో అధిక మార్కెట్ డిమాండ్.",
            hi: "आपकी जलवायु और मिट्टी के लिए आदर्श। अच्छी उपज क्षमता के साथ उच्च बाजार मांग।"
        }
    },
    wheat: {
        name: { en: "Wheat", te: "గోధుమ", hi: "गेहूं" },
        climate: ["temperate", "subtropical"],
        season: ["rabi"],
        soilType: ["loamy", "clay", "alluvial"],
        phRange: [6.0, 7.5],
        npk: { n: [100, 150], p: [50, 80], k: [40, 60] },
        irrigation: {
            en: "Sprinkler or furrow irrigation. Requires 4-6 irrigations during growing season.",
            te: "స్ప్రింక్లర్ లేదా ఫర్రో నీటిపారుదల. పెరుగుదల కాలంలో 4-6 నీటిపారుదలలు అవసరం.",
            hi: "स्प्रिंकलर या फरो सिंचाई। बढ़ते मौसम के दौरान 4-6 सिंचाई की आवश्यकता।"
        },
        irrigationSchedule: {
            en: [
                { stage: "Crown Root Initiation", days: "20-25", frequency: "First irrigation", depth: "5-6 cm" },
                { stage: "Tillering", days: "40-45", frequency: "Second irrigation", depth: "5-6 cm" },
                { stage: "Jointing", days: "60-65", frequency: "Third irrigation", depth: "6-7 cm" },
                { stage: "Flowering", days: "80-85", frequency: "Fourth irrigation", depth: "6-7 cm" },
                { stage: "Milk Stage", days: "100-105", frequency: "Fifth irrigation", depth: "5-6 cm" },
                { stage: "Dough Stage", days: "115-120", frequency: "Sixth irrigation (if needed)", depth: "4-5 cm" }
            ],
            te: [
                { stage: "క్రౌన్ రూట్ ఇనిషియేషన్", days: "20-25", frequency: "మొదటి నీటిపారుదల", depth: "5-6 సెం.మీ" },
                { stage: "టిల్లరింగ్", days: "40-45", frequency: "రెండవ నీటిపారుదల", depth: "5-6 సెం.మీ" },
                { stage: "జాయింటింగ్", days: "60-65", frequency: "మూడవ నీటిపారుదల", depth: "6-7 సెం.మీ" },
                { stage: "పుష్పించడం", days: "80-85", frequency: "నాల్గవ నీటిపారుదల", depth: "6-7 సెం.మీ" },
                { stage: "మిల్క్ స్టేజ్", days: "100-105", frequency: "ఐదవ నీటిపారుదల", depth: "5-6 సెం.మీ" },
                { stage: "డౌ స్టేజ్", days: "115-120", frequency: "ఆరవ నీటిపారుదల (అవసరమైతే)", depth: "4-5 సెం.మీ" }
            ],
            hi: [
                { stage: "क्राउन रूट आरंभ", days: "20-25", frequency: "पहली सिंचाई", depth: "5-6 सेमी" },
                { stage: "कल्ले फूटना", days: "40-45", frequency: "दूसरी सिंचाई", depth: "5-6 सेमी" },
                { stage: "गांठ बनना", days: "60-65", frequency: "तीसरी सिंचाई", depth: "6-7 सेमी" },
                { stage: "फूल आना", days: "80-85", frequency: "चौथी सिंचाई", depth: "6-7 सेमी" },
                { stage: "दूध अवस्था", days: "100-105", frequency: "पांचवीं सिंचाई", depth: "5-6 सेमी" },
                { stage: "आटा अवस्था", days: "115-120", frequency: "छठी सिंचाई (यदि आवश्यक हो)", depth: "4-5 सेमी" }
            ]
        },
        fertilizers: {
            en: "NPK 12:32:16 at sowing, Urea top dressing at tillering and flowering stages.",
            te: "విత్తనం వేసేటప్పుడు NPK 12:32:16, టిల్లరింగ్ మరియు పుష్పించే దశలలో యూరియా టాప్ డ్రెస్సింగ్.",
            hi: "बुवाई के समय NPK 12:32:16, कल्ले और फूल आने के चरणों में यूरिया टॉप ड्रेसिंग।"
        }
,
        explanation: {
            en: "Perfect for winter season with excellent nutritional value and market stability.",
            te: "అద్భుతమైన పోషక విలువ మరియు మార్కెట్ స్థిరత్వంతో శీతాకాలానికి సరైనది.",
            hi: "उत्कृष्ट पोषण मूल्य और बाजार स्थिरता के साथ सर्दियों के मौसम के लिए एकदम सही।"
        }
    },
    cotton: {
        name: { en: "Cotton", te: "పత్తి", hi: "कपास" },
        climate: ["tropical", "subtropical"],
        season: ["kharif"],
        soilType: ["black", "alluvial", "loamy"],
        phRange: [6.0, 8.0],
        npk: { n: [100, 150], p: [50, 75], k: [50, 75] },
        irrigation: {
            en: "Drip irrigation recommended. Requires 700-1300mm water during growing period.",
            te: "డ్రిప్ నీటిపారుదల సిఫార్సు చేయబడింది. పెరుగుదల కాలంలో 700-1300mm నీరు అవసరం.",
            hi: "ड्रिप सिंचाई की सिफारिश की जाती है। बढ़ते समय 700-1300mm पानी की आवश्यकता।"
        },
        irrigationSchedule: {
            en: [
                { stage: "Sowing to Germination", days: "0-10", frequency: "Light irrigation every 2-3 days", depth: "2-3 cm" },
                { stage: "Vegetative Growth", days: "10-60", frequency: "Every 7-10 days", depth: "4-5 cm" },
                { stage: "Flowering", days: "60-90", frequency: "Every 5-7 days", depth: "5-6 cm" },
                { stage: "Boll Formation", days: "90-120", frequency: "Every 7-10 days", depth: "5-6 cm" },
                { stage: "Boll Development", days: "120-150", frequency: "Every 10-12 days", depth: "4-5 cm" },
                { stage: "Maturity", days: "150-180", frequency: "Stop 15 days before harvest", depth: "0 cm" }
            ],
            te: [
                { stage: "విత్తనం నుండి మొలకెత్తడం", days: "0-10", frequency: "ప్రతి 2-3 రోజులకు తేలికపాటి నీటిపారుదల", depth: "2-3 సెం.మీ" },
                { stage: "వృక్షసంబంధ పెరుగుదల", days: "10-60", frequency: "ప్రతి 7-10 రోజులు", depth: "4-5 సెం.మీ" },
                { stage: "పుష్పించడం", days: "60-90", frequency: "ప్రతి 5-7 రోజులు", depth: "5-6 సెం.మీ" },
                { stage: "బోల్ ఏర్పాటు", days: "90-120", frequency: "ప్రతి 7-10 రోజులు", depth: "5-6 సెం.మీ" },
                { stage: "బోల్ అభివృద్ధి", days: "120-150", frequency: "ప్రతి 10-12 రోజులు", depth: "4-5 సెం.మీ" },
                { stage: "పరిపక్వత", days: "150-180", frequency: "కోత 15 రోజుల ముందు ఆపండి", depth: "0 సెం.మీ" }
            ],
            hi: [
                { stage: "बुवाई से अंकुरण", days: "0-10", frequency: "हर 2-3 दिन हल्की सिंचाई", depth: "2-3 सेमी" },
                { stage: "वानस्पतिक वृद्धि", days: "10-60", frequency: "हर 7-10 दिन", depth: "4-5 सेमी" },
                { stage: "फूल आना", days: "60-90", frequency: "हर 5-7 दिन", depth: "5-6 सेमी" },
                { stage: "गांठ बनना", days: "90-120", frequency: "हर 7-10 दिन", depth: "5-6 सेमी" },
                { stage: "गांठ विकास", days: "120-150", frequency: "हर 10-12 दिन", depth: "4-5 सेमी" },
                { stage: "परिपक्वता", days: "150-180", frequency: "कटाई से 15 दिन पहले बंद करें", depth: "0 सेमी" }
            ]
        },
        fertilizers: {
            en: "Complex fertilizers NPK 19:19:19, Zinc sulfate, and organic manure.",
            te: "కాంప్లెక్స్ ఎరువులు NPK 19:19:19, జింక్ సల్ఫేట్, మరియు సేంద్రీయ ఎరువు.",
            hi: "जटिल उर्वरक NPK 19:19:19, जिंक सल्फेट, और जैविक खाद।"
        },
        explanation: {
            en: "High-value cash crop suitable for black soil with good export potential.",
            te: "మంచి ఎగుమతి సామర్థ్యంతో నల్ల నేలకు అనువైన అధిక-విలువ నగదు పంట.",
            hi: "अच्छी निर्यात क्षमता के साथ काली मिट्टी के लिए उपयुक्त उच्च मूल्य नकदी फसल।"
        }
    },
    maize: {
        name: { en: "Maize", te: "మొక్కజొన్న", hi: "मक्का" },
        climate: ["tropical", "subtropical", "temperate"],
        season: ["kharif", "rabi"],
        soilType: ["loamy", "sandy", "alluvial"],
        phRange: [5.5, 7.5],
        npk: { n: [120, 150], p: [60, 80], k: [40, 60] },
        irrigation: {
            en: "Furrow or sprinkler irrigation. Critical at tasseling and grain filling stages.",
            te: "ఫర్రో లేదా స్ప్రింక్లర్ నీటిపారుదల. టాసెలింగ్ మరియు ధాన్యం నింపే దశలలో కీలకం.",
            hi: "फरो या स्प्रिंकलर सिंचाई। टैसलिंग और अनाज भरने के चरणों में महत्वपूर्ण।"
        },
        irrigationSchedule: {
            en: [
                { stage: "Sowing", days: "0-5", frequency: "Immediately after sowing", depth: "4-5 cm" },
                { stage: "Knee High", days: "20-25", frequency: "First irrigation", depth: "5-6 cm" },
                { stage: "Tasseling", days: "45-50", frequency: "Critical irrigation", depth: "6-7 cm" },
                { stage: "Silking", days: "55-60", frequency: "Critical irrigation", depth: "6-7 cm" },
                { stage: "Grain Filling", days: "70-80", frequency: "Every 7-10 days", depth: "5-6 cm" },
                { stage: "Maturity", days: "90-100", frequency: "Stop 10 days before harvest", depth: "0 cm" }
            ],
            te: [
                { stage: "విత్తనం", days: "0-5", frequency: "విత్తిన వెంటనే", depth: "4-5 సెం.మీ" },
                { stage: "మోకాలి ఎత్తు", days: "20-25", frequency: "మొదటి నీటిపారుదల", depth: "5-6 సెం.మీ" },
                { stage: "టాసెలింగ్", days: "45-50", frequency: "కీలకమైన నీటిపారుదల", depth: "6-7 సెం.మీ" },
                { stage: "సిల్కింగ్", days: "55-60", frequency: "కీలకమైన నీటిపారుదల", depth: "6-7 సెం.మీ" },
                { stage: "ధాన్యం నింపడం", days: "70-80", frequency: "ప్రతి 7-10 రోజులు", depth: "5-6 సెం.మీ" },
                { stage: "పరిపక్వత", days: "90-100", frequency: "కోత 10 రోజుల ముందు ఆపండి", depth: "0 సెం.మీ" }
            ],
            hi: [
                { stage: "बुवाई", days: "0-5", frequency: "बुवाई के तुरंत बाद", depth: "4-5 सेमी" },
                { stage: "घुटने की ऊंचाई", days: "20-25", frequency: "पहली सिंचाई", depth: "5-6 सेमी" },
                { stage: "टैसलिंग", days: "45-50", frequency: "महत्वपूर्ण सिंचाई", depth: "6-7 सेमी" },
                { stage: "सिल्किंग", days: "55-60", frequency: "महत्वपूर्ण सिंचाई", depth: "6-7 सेमी" },
                { stage: "दाना भरना", days: "70-80", frequency: "हर 7-10 दिन", depth: "5-6 सेमी" },
                { stage: "परिपक्वता", days: "90-100", frequency: "कटाई से 10 दिन पहले बंद करें", depth: "0 सेमी" }
            ]
        },
        fertilizers: {
            en: "Basal dose of DAP and MOP, followed by Urea in 2-3 split applications.",
            te: "DAP మరియు MOP యొక్క బేసల్ డోస్, తర్వాత 2-3 విభజిత అప్లికేషన్లలో యూరియా.",
            hi: "DAP और MOP की बेसल खुराक, इसके बाद 2-3 विभाजित अनुप्रयोगों में यूरिया।"
        },
        explanation: {
            en: "Versatile crop with multiple uses - food, feed, and industrial applications.",
            te: "బహుళ ఉపయోగాలతో బహుముఖ పంట - ఆహారం, మేత మరియు పారిశ్రామిక అనువర్తనాలు.",
            hi: "कई उपयोगों के साथ बहुमुखी फसल - भोजन, चारा और औद्योगिक अनुप्रयोग।"
        }
    }
,
    sugarcane: {
        name: { en: "Sugarcane", te: "చెరకు", hi: "गन्ना" },
        climate: ["tropical", "subtropical"],
        season: ["kharif"],
        soilType: ["loamy", "clay", "alluvial"],
        phRange: [6.0, 7.5],
        npk: { n: [200, 300], p: [80, 120], k: [100, 150] },
        irrigation: {
            en: "Drip or furrow irrigation. Heavy water requirement - 2000-2500mm annually.",
            te: "డ్రిప్ లేదా ఫర్రో నీటిపారుదల. భారీ నీటి అవసరం - సంవత్సరానికి 2000-2500mm.",
            hi: "ड्रिप या फरो सिंचाई। भारी पानी की आवश्यकता - सालाना 2000-2500mm।"
        },
        irrigationSchedule: {
            en: [
                { stage: "Planting", days: "0-30", frequency: "Every 3-4 days", depth: "6-8 cm" },
                { stage: "Tillering", days: "30-120", frequency: "Every 7-10 days", depth: "7-8 cm" },
                { stage: "Grand Growth", days: "120-270", frequency: "Every 10-15 days", depth: "8-10 cm" },
                { stage: "Maturity", days: "270-365", frequency: "Every 15-20 days", depth: "6-7 cm" },
                { stage: "Pre-Harvest", days: "345-365", frequency: "Stop 15 days before harvest", depth: "0 cm" }
            ],
            te: [
                { stage: "నాటడం", days: "0-30", frequency: "ప్రతి 3-4 రోజులు", depth: "6-8 సెం.మీ" },
                { stage: "టిల్లరింగ్", days: "30-120", frequency: "ప్రతి 7-10 రోజులు", depth: "7-8 సెం.మీ" },
                { stage: "గ్రాండ్ గ్రోత్", days: "120-270", frequency: "ప్రతి 10-15 రోజులు", depth: "8-10 సెం.మీ" },
                { stage: "పరిపక్వత", days: "270-365", frequency: "ప్రతి 15-20 రోజులు", depth: "6-7 సెం.మీ" },
                { stage: "కోత ముందు", days: "345-365", frequency: "కోత 15 రోజుల ముందు ఆపండి", depth: "0 సెం.మీ" }
            ],
            hi: [
                { stage: "रोपण", days: "0-30", frequency: "हर 3-4 दिन", depth: "6-8 सेमी" },
                { stage: "कल्ले फूटना", days: "30-120", frequency: "हर 7-10 दिन", depth: "7-8 सेमी" },
                { stage: "भव्य वृद्धि", days: "120-270", frequency: "हर 10-15 दिन", depth: "8-10 सेमी" },
                { stage: "परिपक्वता", days: "270-365", frequency: "हर 15-20 दिन", depth: "6-7 सेमी" },
                { stage: "कटाई पूर्व", days: "345-365", frequency: "कटाई से 15 दिन पहले बंद करें", depth: "0 सेमी" }
            ]
        },
        fertilizers: {
            en: "High NPK requirement. Apply FYM, Urea, SSP, and MOP in multiple doses.",
            te: "అధిక NPK అవసరం. FYM, యూరియా, SSP, మరియు MOP బహుళ మోతాదులలో వర్తించండి.",
            hi: "उच्च NPK आवश्यकता। FYM, यूरिया, SSP, और MOP को कई खुराक में लागू करें।"
        },
        explanation: {
            en: "Long-duration cash crop with assured market and good returns.",
            te: "హామీ మార్కెట్ మరియు మంచి రాబడులతో దీర్ఘకాలిక నగదు పంట.",
            hi: "सुनिश्चित बाजार और अच्छे रिटर्न के साथ लंबी अवधि की नकदी फसल।"
        }
    },
    groundnut: {
        name: { en: "Groundnut", te: "వేరుశెనగ", hi: "मूंगफली" },
        climate: ["tropical", "subtropical"],
        season: ["kharif", "rabi"],
        soilType: ["sandy", "loamy", "red"],
        phRange: [6.0, 7.0],
        npk: { n: [20, 40], p: [40, 60], k: [40, 60] },
        irrigation: {
            en: "Moderate water requirement. Drip irrigation at flowering and pod development.",
            te: "మితమైన నీటి అవసరం. పుష్పించే మరియు పాడ్ అభివృద్ధి వద్ద డ్రిప్ నీటిపారుదల.",
            hi: "मध्यम पानी की आवश्यकता। फूल आने और फली विकास के समय ड्रिप सिंचाई।"
        },
        irrigationSchedule: {
            en: [
                { stage: "Sowing", days: "0-10", frequency: "Light irrigation after sowing", depth: "3-4 cm" },
                { stage: "Vegetative", days: "10-30", frequency: "Every 7-10 days", depth: "4-5 cm" },
                { stage: "Flowering", days: "30-50", frequency: "Every 5-7 days (critical)", depth: "5-6 cm" },
                { stage: "Pegging", days: "50-70", frequency: "Every 5-7 days (critical)", depth: "5-6 cm" },
                { stage: "Pod Development", days: "70-100", frequency: "Every 7-10 days", depth: "4-5 cm" },
                { stage: "Maturity", days: "100-120", frequency: "Stop 10 days before harvest", depth: "0 cm" }
            ],
            te: [
                { stage: "విత్తనం", days: "0-10", frequency: "విత్తిన తర్వాత తేలికపాటి నీటిపారుదల", depth: "3-4 సెం.మీ" },
                { stage: "వృక్షసంబంధ", days: "10-30", frequency: "ప్రతి 7-10 రోజులు", depth: "4-5 సెం.మీ" },
                { stage: "పుష్పించడం", days: "30-50", frequency: "ప్రతి 5-7 రోజులు (కీలకం)", depth: "5-6 సెం.మీ" },
                { stage: "పెగ్గింగ్", days: "50-70", frequency: "ప్రతి 5-7 రోజులు (కీలకం)", depth: "5-6 సెం.మీ" },
                { stage: "పాడ్ అభివృద్ధి", days: "70-100", frequency: "ప్రతి 7-10 రోజులు", depth: "4-5 సెం.మీ" },
                { stage: "పరిపక్వత", days: "100-120", frequency: "కోత 10 రోజుల ముందు ఆపండి", depth: "0 సెం.మీ" }
            ],
            hi: [
                { stage: "बुवाई", days: "0-10", frequency: "बुवाई के बाद हल्की सिंचाई", depth: "3-4 सेमी" },
                { stage: "वानस्पतिक", days: "10-30", frequency: "हर 7-10 दिन", depth: "4-5 सेमी" },
                { stage: "फूल आना", days: "30-50", frequency: "हर 5-7 दिन (महत्वपूर्ण)", depth: "5-6 सेमी" },
                { stage: "पेगिंग", days: "50-70", frequency: "हर 5-7 दिन (महत्वपूर्ण)", depth: "5-6 सेमी" },
                { stage: "फली विकास", days: "70-100", frequency: "हर 7-10 दिन", depth: "4-5 सेमी" },
                { stage: "परिपक्वता", days: "100-120", frequency: "कटाई से 10 दिन पहले बंद करें", depth: "0 सेमी" }
            ]
        },
        fertilizers: {
            en: "Gypsum application essential. Phosphorus-rich fertilizers and organic matter.",
            te: "జిప్సం అప్లికేషన్ అవసరం. ఫాస్ఫరస్-సమృద్ధ ఎరువులు మరియు సేంద్రీయ పదార్థం.",
            hi: "जिप्सम का उपयोग आवश्यक। फास्फोरस युक्त उर्वरक और जैविक पदार्थ।"
        },
        explanation: {
            en: "Oilseed crop with nitrogen-fixing ability, improves soil health.",
            te: "నత్రజని-స్థిరీకరణ సామర్థ్యంతో నూనె గింజల పంట, నేల ఆరోగ్యాన్ని మెరుగుపరుస్తుంది.",
            hi: "नाइट्रोजन-फिक्सिंग क्षमता के साथ तिलहन फसल, मिट्टी के स्वास्थ्य में सुधार करती है।"
        }
    },
    tomato: {
        name: { en: "Tomato", te: "టమాటో", hi: "टमाटर" },
        climate: ["temperate", "subtropical"],
        season: ["rabi", "zaid"],
        soilType: ["loamy", "sandy", "red"],
        phRange: [6.0, 7.0],
        npk: { n: [100, 150], p: [50, 75], k: [50, 75] },
        irrigation: {
            en: "Drip irrigation highly recommended. Regular light irrigation required.",
            te: "డ్రిప్ నీటిపారుదల అత్యంత సిఫార్సు చేయబడింది. క్రమం తప్పకుండా తేలికపాటి నీటిపారుదల అవసరం.",
            hi: "ड्रिप सिंचाई अत्यधिक अनुशंसित। नियमित हल्की सिंचाई आवश्यक।"
        },
        irrigationSchedule: {
            en: [
                { stage: "Transplanting", days: "0-10", frequency: "Daily light irrigation", depth: "2-3 cm" },
                { stage: "Vegetative", days: "10-30", frequency: "Every 3-4 days", depth: "3-4 cm" },
                { stage: "Flowering", days: "30-50", frequency: "Every 2-3 days", depth: "4-5 cm" },
                { stage: "Fruit Setting", days: "50-70", frequency: "Every 2-3 days (critical)", depth: "4-5 cm" },
                { stage: "Fruit Development", days: "70-100", frequency: "Every 3-4 days", depth: "4-5 cm" },
                { stage: "Ripening", days: "100-120", frequency: "Reduce frequency", depth: "3-4 cm" }
            ],
            te: [
                { stage: "నాటడం", days: "0-10", frequency: "ప్రతిరోజు తేలికపాటి నీటిపారుదల", depth: "2-3 సెం.మీ" },
                { stage: "వృక్షసంబంధ", days: "10-30", frequency: "ప్రతి 3-4 రోజులు", depth: "3-4 సెం.మీ" },
                { stage: "పుష్పించడం", days: "30-50", frequency: "ప్రతి 2-3 రోజులు", depth: "4-5 సెం.మీ" },
                { stage: "పండు అమరడం", days: "50-70", frequency: "ప్రతి 2-3 రోజులు (కీలకం)", depth: "4-5 సెం.మీ" },
                { stage: "పండు అభివృద్ధి", days: "70-100", frequency: "ప్రతి 3-4 రోజులు", depth: "4-5 సెం.మీ" },
                { stage: "పండడం", days: "100-120", frequency: "ఫ్రీక్వెన్సీ తగ్గించండి", depth: "3-4 సెం.మీ" }
            ],
            hi: [
                { stage: "रोपाई", days: "0-10", frequency: "दैनिक हल्की सिंचाई", depth: "2-3 सेमी" },
                { stage: "वानस्पतिक", days: "10-30", frequency: "हर 3-4 दिन", depth: "3-4 सेमी" },
                { stage: "फूल आना", days: "30-50", frequency: "हर 2-3 दिन", depth: "4-5 सेमी" },
                { stage: "फल लगना", days: "50-70", frequency: "हर 2-3 दिन (महत्वपूर्ण)", depth: "4-5 सेमी" },
                { stage: "फल विकास", days: "70-100", frequency: "हर 3-4 दिन", depth: "4-5 सेमी" },
                { stage: "पकना", days: "100-120", frequency: "आवृत्ति कम करें", depth: "3-4 सेमी" }
            ]
        }
,
        fertilizers: {
            en: "Balanced NPK with micronutrients. Calcium for preventing blossom end rot.",
            te: "సూక్ష్మ పోషకాలతో సమతుల్య NPK. బ్లోసమ్ ఎండ్ రాట్ నివారించడానికి కాల్షియం.",
            hi: "सूक्ष्म पोषक तत्वों के साथ संतुलित NPK। ब्लॉसम एंड रॉट को रोकने के लिए कैल्शियम।"
        },
        explanation: {
            en: "High-value vegetable crop with year-round market demand.",
            te: "సంవత్సరం పొడవునా మార్కెట్ డిమాండ్‌తో అధిక-విలువ కూరగాయల పంట.",
            hi: "साल भर बाजार की मांग के साथ उच्च मूल्य सब्जी फसल।"
        }
    },
    potato: {
        name: { en: "Potato", te: "బంగాళాదుంప", hi: "आलू" },
        climate: ["temperate", "subtropical"],
        season: ["rabi"],
        soilType: ["loamy", "sandy"],
        phRange: [5.5, 6.5],
        npk: { n: [120, 180], p: [80, 120], k: [100, 150] },
        irrigation: {
            en: "Sprinkler or drip irrigation. Critical during tuber formation stage.",
            te: "స్ప్రింక్లర్ లేదా డ్రిప్ నీటిపారుదల. గడ్డ ఏర్పడే దశలో కీలకం.",
            hi: "स्प्रिंकलर या ड्रिप सिंचाई। कंद निर्माण चरण के दौरान महत्वपूर्ण।"
        },
        irrigationSchedule: {
            en: [
                { stage: "Planting", days: "0-10", frequency: "Light irrigation after planting", depth: "3-4 cm" },
                { stage: "Vegetative", days: "10-30", frequency: "Every 5-7 days", depth: "4-5 cm" },
                { stage: "Tuber Initiation", days: "30-50", frequency: "Every 4-5 days (critical)", depth: "5-6 cm" },
                { stage: "Tuber Bulking", days: "50-80", frequency: "Every 5-7 days (critical)", depth: "5-6 cm" },
                { stage: "Maturity", days: "80-100", frequency: "Every 7-10 days", depth: "4-5 cm" },
                { stage: "Pre-Harvest", days: "90-100", frequency: "Stop 10 days before harvest", depth: "0 cm" }
            ],
            te: [
                { stage: "నాటడం", days: "0-10", frequency: "నాటిన తర్వాత తేలికపాటి నీటిపారుదల", depth: "3-4 సెం.మీ" },
                { stage: "వృక్షసంబంధ", days: "10-30", frequency: "ప్రతి 5-7 రోజులు", depth: "4-5 సెం.మీ" },
                { stage: "గడ్డ ఆరంభం", days: "30-50", frequency: "ప్రతి 4-5 రోజులు (కీలకం)", depth: "5-6 సెం.మీ" },
                { stage: "గడ్డ పెరుగుదల", days: "50-80", frequency: "ప్రతి 5-7 రోజులు (కీలకం)", depth: "5-6 సెం.మీ" },
                { stage: "పరిపక్వత", days: "80-100", frequency: "ప్రతి 7-10 రోజులు", depth: "4-5 సెం.మీ" },
                { stage: "కోత ముందు", days: "90-100", frequency: "కోత 10 రోజుల ముందు ఆపండి", depth: "0 సెం.మీ" }
            ],
            hi: [
                { stage: "रोपण", days: "0-10", frequency: "रोपण के बाद हल्की सिंचाई", depth: "3-4 सेमी" },
                { stage: "वानस्पतिक", days: "10-30", frequency: "हर 5-7 दिन", depth: "4-5 सेमी" },
                { stage: "कंद आरंभ", days: "30-50", frequency: "हर 4-5 दिन (महत्वपूर्ण)", depth: "5-6 सेमी" },
                { stage: "कंद वृद्धि", days: "50-80", frequency: "हर 5-7 दिन (महत्वपूर्ण)", depth: "5-6 सेमी" },
                { stage: "परिपक्वता", days: "80-100", frequency: "हर 7-10 दिन", depth: "4-5 सेमी" },
                { stage: "कटाई पूर्व", days: "90-100", frequency: "कटाई से 10 दिन पहले बंद करें", depth: "0 सेमी" }
            ]
        },
        fertilizers: {
            en: "High potassium requirement. Apply FYM, NPK complex, and foliar sprays.",
            te: "అధిక పొటాషియం అవసరం. FYM, NPK కాంప్లెక్స్, మరియు ఫోలియర్ స్ప్రేలు వర్తించండి.",
            hi: "उच्च पोटेशियम आवश्यकता। FYM, NPK कॉम्प्लेक्स, और पर्णीय स्प्रे लागू करें।"
        },
        explanation: {
            en: "Staple crop with excellent storage and consistent market demand.",
            te: "అద్భుతమైన నిల్వ మరియు స్థిరమైన మార్కెట్ డిమాండ్‌తో ప్రధాన పంట.",
            hi: "उत्कृष्ट भंडारण और सुसंगत बाजार मांग के साथ मुख्य फसल।"
        }
    }
};

function recommendCrop(inputs) {
    const { climate, season, soilType, soilPh, nitrogen, phosphorus, potassium } = inputs;
    
    let bestMatch = null;
    let bestScore = 0;

    for (const [cropKey, crop] of Object.entries(cropDatabase)) {
        let score = 0;

        if (crop.climate.includes(climate)) score += 30;
        if (crop.season.includes(season)) score += 25;
        if (crop.soilType.includes(soilType)) score += 25;
        
        if (soilPh >= crop.phRange[0] && soilPh <= crop.phRange[1]) {
            score += 10;
        } else {
            const phDiff = Math.min(
                Math.abs(soilPh - crop.phRange[0]),
                Math.abs(soilPh - crop.phRange[1])
            );
            score += Math.max(0, 10 - phDiff * 2);
        }

        const nMatch = nitrogen >= crop.npk.n[0] && nitrogen <= crop.npk.n[1];
        const pMatch = phosphorus >= crop.npk.p[0] && phosphorus <= crop.npk.p[1];
        const kMatch = potassium >= crop.npk.k[0] && potassium <= crop.npk.k[1];
        
        if (nMatch) score += 3;
        if (pMatch) score += 3;
        if (kMatch) score += 4;

        if (score > bestScore) {
            bestScore = score;
            bestMatch = crop;
        }
    }

    return bestMatch;
}
