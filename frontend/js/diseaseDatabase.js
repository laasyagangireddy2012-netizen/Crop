// CROPXAI Plant Disease Database
// Covers major diseases for 8 crops
const diseaseDatabase = {
  rice: [
    {
      id: 'rice_blast', name: { en: 'Rice Blast', te: 'వరి బ్లాస్ట్', hi: 'धान का ब्लास्ट' },
      severity: 'high', color: '#e53e3e',
      symptoms: { en: 'Diamond-shaped lesions with gray centers and brown borders on leaves. White to gray patches on neck.', te: 'ఆకులపై బూడిద కేంద్రాలు మరియు గోధుమ అంచులతో వజ్రాకార గాయాలు.', hi: 'पत्तियों पर हीरे के आकार के धब्बे, भूरे किनारे।' },
      causes: { en: 'Fungus Magnaporthe oryzae. Spreads in humid, warm conditions (24-28°C).', te: 'మాగ్నాపోర్తే ఒరైజే శిలీంధ్రం. తేమ, వెచ్చని పరిస్థితులలో వ్యాపిస్తుంది.', hi: 'मैग्नापोर्थे ओरिजे कवक। आर्द्र, गर्म परिस्थितियों में फैलता है।' },
      treatment: { en: '1. Spray Tricyclazole (0.1%) or Carbendazim\n2. Apply Propiconazole fungicide\n3. Remove infected plants immediately', te: '1. ట్రైసైక్లాజోల్ (0.1%) లేదా కార్బెండాజిమ్ స్ప్రే చేయండి\n2. సోకిన మొక్కలను వెంటనే తొలగించండి', hi: '1. ट्राइसाइक्लाजोल (0.1%) या कार्बेंडाजिम स्प्रे करें\n2. संक्रमित पौधों को तुरंत हटाएं' },
      prevention: { en: 'Use resistant varieties. Avoid excess nitrogen. Maintain proper spacing. Use certified seeds.', te: 'నిరోధక రకాలు ఉపయోగించండి. అధిక నత్రజని నివారించండి.', hi: 'प्रतिरोधी किस्में उपयोग करें। अधिक नाइट्रोजन से बचें।' },
      organic: { en: 'Neem oil spray (3%). Trichoderma viride application.', te: 'వేప నూనె స్ప్రే (3%). ట్రైకోడెర్మా విరిడే అప్లికేషన్.', hi: 'नीम तेल स्प्रे (3%)। ट्राइकोडर्मा विराइड का उपयोग।' }
    },
    {
      id: 'rice_blight', name: { en: 'Bacterial Leaf Blight', te: 'బ్యాక్టీరియల్ లీఫ్ బ్లైట్', hi: 'बैक्टीरियल लीफ ब्लाइट' },
      severity: 'high', color: '#e53e3e',
      symptoms: { en: 'Water-soaked lesions on leaf tips turning yellow to white. Leaves wilt and dry.', te: 'ఆకు చివర్లపై నీటిలో నానిన గాయాలు పసుపు నుండి తెల్లగా మారతాయి.', hi: 'पत्ती की नोक पर पानी से भीगे धब्बे जो पीले से सफेद हो जाते हैं।' },
      causes: { en: 'Xanthomonas oryzae bacteria. Spreads through water, wind, and infected seeds.', te: 'జాంతోమోనాస్ ఒరైజే బ్యాక్టీరియా. నీరు, గాలి ద్వారా వ్యాపిస్తుంది.', hi: 'जैंथोमोनस ओरिजे बैक्टीरिया। पानी और हवा से फैलता है।' },
      treatment: { en: '1. Apply Copper oxychloride (0.3%)\n2. Use Streptocycline (500ppm)\n3. Drain fields and reduce irrigation', te: '1. కాపర్ ఆక్సీక్లోరైడ్ (0.3%) వర్తించండి\n2. నీటిపారుదల తగ్గించండి', hi: '1. कॉपर ऑक्सीक्लोराइड (0.3%) लगाएं\n2. सिंचाई कम करें' },
      prevention: { en: 'Use disease-free seeds. Avoid excess nitrogen. Maintain field hygiene.', te: 'వ్యాధి-రహిత విత్తనాలు ఉపయోగించండి.', hi: 'रोग-मुक्त बीज उपयोग करें।' },
      organic: { en: 'Garlic extract spray. Copper sulfate solution (0.2%).', te: 'వెల్లుల్లి సారం స్ప్రే. కాపర్ సల్ఫేట్ ద్రావణం.', hi: 'लहसुन का अर्क स्प्रे। कॉपर सल्फेट घोल।' }
    },
    {
      id: 'rice_brown_spot', name: { en: 'Brown Spot', te: 'బ్రౌన్ స్పాట్', hi: 'भूरा धब्बा' },
      severity: 'medium', color: '#ed8936',
      symptoms: { en: 'Circular to oval brown spots with yellow halo on leaves. Spots may coalesce.', te: 'ఆకులపై పసుపు వలయంతో గోలాకార నుండి అండాకార గోధుమ మచ్చలు.', hi: 'पत्तियों पर पीले घेरे के साथ गोल से अंडाकार भूरे धब्बे।' },
      causes: { en: 'Fungus Bipolaris oryzae. Occurs in nutrient-deficient soils.', te: 'బైపోలారిస్ ఒరైజే శిలీంధ్రం. పోషక-లోపం నేలలలో సంభవిస్తుంది.', hi: 'बाइपोलारिस ओरिजे कवक। पोषक तत्वों की कमी वाली मिट्टी में होता है।' },
      treatment: { en: '1. Spray Mancozeb (0.25%) or Iprodione\n2. Apply balanced NPK fertilizer\n3. Improve soil health', te: '1. మాంకోజెబ్ (0.25%) స్ప్రే చేయండి\n2. సమతుల్య NPK ఎరువు వర్తించండి', hi: '1. मैंकोजेब (0.25%) स्प्रे करें\n2. संतुलित NPK उर्वरक लगाएं' },
      prevention: { en: 'Maintain soil fertility. Use potassium-rich fertilizers. Avoid water stress.', te: 'నేల సారాన్ని నిర్వహించండి. పొటాషియం-సమృద్ధ ఎరువులు ఉపయోగించండి.', hi: 'मिट्टी की उर्वरता बनाए रखें।' },
      organic: { en: 'Compost application. Neem cake as soil amendment.', te: 'కంపోస్ట్ అప్లికేషన్. నేల సవరణగా వేప కేక్.', hi: 'खाद का उपयोग। नीम केक मिट्टी संशोधन।' }
    }
  ],
  wheat: [
    {
      id: 'wheat_rust', name: { en: 'Leaf Rust', te: 'లీఫ్ రస్ట్', hi: 'पत्ती का रतुआ' },
      severity: 'high', color: '#e53e3e',
      symptoms: { en: 'Orange-red pustules on upper leaf surface. Leaves turn yellow and dry.', te: 'ఆకు పై భాగంపై నారింజ-ఎరుపు పస్ట్యూల్స్. ఆకులు పసుపు రంగుకు మారతాయి.', hi: 'पत्ती की ऊपरी सतह पर नारंगी-लाल पुस्ट्यूल। पत्तियां पीली पड़ जाती हैं।' },
      causes: { en: 'Fungus Puccinia triticina. Spreads through wind-borne spores in cool, moist weather.', te: 'పుచ్చినియా ట్రిటిసినా శిలీంధ్రం. చల్లని, తేమ వాతావరణంలో వ్యాపిస్తుంది.', hi: 'पुक्सिनिया ट्रिटिसिना कवक। ठंडे, नम मौसम में फैलता है।' },
      treatment: { en: '1. Spray Propiconazole (0.1%) or Tebuconazole\n2. Apply Mancozeb at early stage\n3. Remove infected crop debris', te: '1. ప్రోపికోనజోల్ (0.1%) స్ప్రే చేయండి\n2. సోకిన పంట అవశేషాలు తొలగించండి', hi: '1. प्रोपिकोनाजोल (0.1%) स्प्रे करें\n2. संक्रमित फसल अवशेष हटाएं' },
      prevention: { en: 'Use rust-resistant varieties. Early sowing. Avoid dense planting.', te: 'రస్ట్-నిరోధక రకాలు ఉపయోగించండి. ముందుగా విత్తండి.', hi: 'रतुआ-प्रतिरोधी किस्में उपयोग करें।' },
      organic: { en: 'Sulfur dust application. Baking soda spray (1%).', te: 'సల్ఫర్ డస్ట్ అప్లికేషన్. బేకింగ్ సోడా స్ప్రే (1%).', hi: 'सल्फर धूल का उपयोग। बेकिंग सोडा स्प्रे (1%)।' }
    },
    {
      id: 'wheat_powdery_mildew', name: { en: 'Powdery Mildew', te: 'పౌడరీ మిల్డ్యూ', hi: 'चूर्णिल आसिता' },
      severity: 'medium', color: '#ed8936',
      symptoms: { en: 'White powdery coating on leaves and stems. Leaves turn yellow and wither.', te: 'ఆకులు మరియు కాండాలపై తెల్లని పొడి పూత. ఆకులు పసుపు రంగుకు మారి వాడిపోతాయి.', hi: 'पत्तियों और तनों पर सफेद पाउडर जैसी परत।' },
      causes: { en: 'Fungus Blumeria graminis. Favored by cool, humid conditions and dense canopy.', te: 'బ్లుమేరియా గ్రామినిస్ శిలీంధ్రం. చల్లని, తేమ పరిస్థితులలో అనుకూలంగా ఉంటుంది.', hi: 'ब्लूमेरिया ग्रामिनिस कवक।' },
      treatment: { en: '1. Spray Triadimefon (0.1%) or Hexaconazole\n2. Apply Sulfur-based fungicide\n3. Improve air circulation', te: '1. ట్రయాడిమెఫాన్ (0.1%) స్ప్రే చేయండి\n2. గాలి ప్రసరణ మెరుగుపరచండి', hi: '1. ट्रायडिमेफोन (0.1%) स्प्रे करें\n2. वायु संचार सुधारें' },
      prevention: { en: 'Use resistant varieties. Avoid excess nitrogen. Proper plant spacing.', te: 'నిరోధక రకాలు ఉపయోగించండి. సరైన మొక్కల అంతరం.', hi: 'प्रतिरोधी किस्में उपयोग करें।' },
      organic: { en: 'Neem oil spray (2%). Potassium bicarbonate solution.', te: 'వేప నూనె స్ప్రే (2%). పొటాషియం బైకార్బోనేట్ ద్రావణం.', hi: 'नीम तेल स्प्रे (2%)।' }
    }
  ],
  tomato: [
    {
      id: 'tomato_early_blight', name: { en: 'Early Blight', te: 'ఎర్లీ బ్లైట్', hi: 'अगेती झुलसा' },
      severity: 'medium', color: '#ed8936',
      symptoms: { en: 'Dark brown spots with concentric rings (target-board pattern) on older leaves. Yellow halo around spots.', te: 'పాత ఆకులపై సాంద్రీకృత వలయాలతో (లక్ష్య-బోర్డు నమూనా) ముదురు గోధుమ మచ్చలు.', hi: 'पुरानी पत्तियों पर केंद्रित छल्लों के साथ गहरे भूरे धब्बे।' },
      causes: { en: 'Fungus Alternaria solani. Favored by warm, humid weather and plant stress.', te: 'ఆల్టర్నేరియా సోలాని శిలీంధ్రం. వెచ్చని, తేమ వాతావరణంలో అనుకూలంగా ఉంటుంది.', hi: 'अल्टरनेरिया सोलानी कवक।' },
      treatment: { en: '1. Spray Mancozeb (0.25%) or Chlorothalonil\n2. Remove infected leaves\n3. Apply Copper-based fungicide', te: '1. మాంకోజెబ్ (0.25%) స్ప్రే చేయండి\n2. సోకిన ఆకులు తొలగించండి', hi: '1. मैंकोजेब (0.25%) स्प्रे करें\n2. संक्रमित पत्तियां हटाएं' },
      prevention: { en: 'Crop rotation. Avoid overhead irrigation. Stake plants for air circulation.', te: 'పంట మార్పిడి. పైన నుండి నీటిపారుదల నివారించండి.', hi: 'फसल चक्र। ऊपर से सिंचाई से बचें।' },
      organic: { en: 'Baking soda spray (1 tsp/litre). Compost tea spray.', te: 'బేకింగ్ సోడా స్ప్రే. కంపోస్ట్ టీ స్ప్రే.', hi: 'बेकिंग सोडा स्प्रे। खाद चाय स्प्रे।' }
    },
    {
      id: 'tomato_late_blight', name: { en: 'Late Blight', te: 'లేట్ బ్లైట్', hi: 'पछेती झुलसा' },
      severity: 'high', color: '#e53e3e',
      symptoms: { en: 'Water-soaked dark green to brown lesions on leaves. White mold on underside. Fruit rots rapidly.', te: 'ఆకులపై నీటిలో నానిన ముదురు ఆకుపచ్చ నుండి గోధుమ గాయాలు. కింది వైపు తెల్లని అచ్చు.', hi: 'पत्तियों पर पानी से भीगे गहरे हरे से भूरे घाव।' },
      causes: { en: 'Oomycete Phytophthora infestans. Spreads rapidly in cool, wet conditions.', te: 'ఫైటోఫ్తోరా ఇన్ఫెస్టాన్స్. చల్లని, తడి పరిస్థితులలో వేగంగా వ్యాపిస్తుంది.', hi: 'फाइटोफ्थोरा इन्फेस्टान्स। ठंडे, गीले मौसम में तेजी से फैलता है।' },
      treatment: { en: '1. Spray Metalaxyl + Mancozeb immediately\n2. Remove and destroy infected plants\n3. Apply Cymoxanil fungicide', te: '1. మెటాలాక్సిల్ + మాంకోజెబ్ వెంటనే స్ప్రే చేయండి\n2. సోకిన మొక్కలను నాశనం చేయండి', hi: '1. मेटालैक्सिल + मैंकोजेब तुरंत स्प्रे करें\n2. संक्रमित पौधों को नष्ट करें' },
      prevention: { en: 'Use resistant varieties. Avoid wet foliage. Improve drainage. Crop rotation.', te: 'నిరోధక రకాలు ఉపయోగించండి. తడి ఆకులు నివారించండి.', hi: 'प्रतिरोधी किस्में उपयोग करें।' },
      organic: { en: 'Copper sulfate spray (0.2%). Remove infected debris immediately.', te: 'కాపర్ సల్ఫేట్ స్ప్రే (0.2%). సోకిన అవశేషాలు వెంటనే తొలగించండి.', hi: 'कॉपर सल्फेट स्प्रे (0.2%)।' }
    },
    {
      id: 'tomato_leaf_curl', name: { en: 'Tomato Leaf Curl Virus', te: 'టమాటో లీఫ్ కర్ల్ వైరస్', hi: 'टमाटर पत्ती मोड़ वायरस' },
      severity: 'high', color: '#e53e3e',
      symptoms: { en: 'Leaves curl upward and inward. Yellowing, stunted growth, reduced fruit set.', te: 'ఆకులు పైకి మరియు లోపలికి చుట్టుకుంటాయి. పసుపు రంగు, మstunted పెరుగుదల.', hi: 'पत्तियां ऊपर और अंदर की ओर मुड़ जाती हैं।' },
      causes: { en: 'Tomato Yellow Leaf Curl Virus (TYLCV) transmitted by whitefly Bemisia tabaci.', te: 'తెల్ల ఈగ బెమిసియా టాబాసి ద్వారా వ్యాపించే TYLCV వైరస్.', hi: 'सफेद मक्खी द्वारा फैलने वाला TYLCV वायरस।' },
      treatment: { en: '1. Control whitefly with Imidacloprid (0.3ml/L)\n2. Remove infected plants\n3. Use yellow sticky traps', te: '1. ఇమిడాక్లోప్రిడ్ (0.3ml/L) తో తెల్ల ఈగను నియంత్రించండి\n2. సోకిన మొక్కలు తొలగించండి', hi: '1. इमिडाक्लोप्रिड से सफेद मक्खी नियंत्रित करें\n2. संक्रमित पौधे हटाएं' },
      prevention: { en: 'Use virus-resistant varieties. Install insect-proof nets. Control whitefly population.', te: 'వైరస్-నిరోధక రకాలు ఉపయోగించండి. కీటక-నిరోధక వలలు ఏర్పాటు చేయండి.', hi: 'वायरस-प्रतिरोधी किस्में उपयोग करें।' },
      organic: { en: 'Neem oil spray to control whitefly. Reflective mulch to repel insects.', te: 'తెల్ల ఈగను నియంత్రించడానికి వేప నూనె స్ప్రే.', hi: 'सफेद मक्खी नियंत्रण के लिए नीम तेल स्प्रे।' }
    }
  ],
  potato: [
    {
      id: 'potato_late_blight', name: { en: 'Late Blight', te: 'లేట్ బ్లైట్', hi: 'पछेती झुलसा' },
      severity: 'high', color: '#e53e3e',
      symptoms: { en: 'Dark water-soaked lesions on leaves. White cottony growth on underside. Tubers rot.', te: 'ఆకులపై ముదురు నీటిలో నానిన గాయాలు. కింది వైపు తెల్లని పత్తి వంటి పెరుగుదల.', hi: 'पत्तियों पर गहरे पानी से भीगे घाव।' },
      causes: { en: 'Phytophthora infestans. Cool, wet weather (10-20°C) with high humidity.', te: 'ఫైటోఫ్తోరా ఇన్ఫెస్టాన్స్. చల్లని, తడి వాతావరణం.', hi: 'फाइटोफ्थोरा इन्फेस्टान्स।' },
      treatment: { en: '1. Spray Metalaxyl + Mancozeb\n2. Destroy infected tubers\n3. Apply Cymoxanil', te: '1. మెటాలాక్సిల్ + మాంకోజెబ్ స్ప్రే చేయండి\n2. సోకిన గడ్డలు నాశనం చేయండి', hi: '1. मेटालैक्सिल + मैंकोजेब स्प्रे करें' },
      prevention: { en: 'Use certified disease-free seed tubers. Proper drainage. Crop rotation.', te: 'ధృవీకరించిన వ్యాధి-రహిత విత్తన గడ్డలు ఉపయోగించండి.', hi: 'प्रमाणित रोग-मुक्त बीज कंद उपयोग करें।' },
      organic: { en: 'Copper-based sprays. Remove infected plant material promptly.', te: 'రాగి-ఆధారిత స్ప్రేలు. సోకిన మొక్కల పదార్థాన్ని వెంటనే తొలగించండి.', hi: 'तांबा आधारित स्प्रे।' }
    },
    {
      id: 'potato_early_blight', name: { en: 'Early Blight', te: 'ఎర్లీ బ్లైట్', hi: 'अगेती झुलसा' },
      severity: 'medium', color: '#ed8936',
      symptoms: { en: 'Brown spots with concentric rings on older leaves. Yellowing around spots.', te: 'పాత ఆకులపై సాంద్రీకృత వలయాలతో గోధుమ మచ్చలు.', hi: 'पुरानी पत्तियों पर केंद्रित छल्लों के साथ भूरे धब्बे।' },
      causes: { en: 'Alternaria solani fungus. Warm temperatures and high humidity.', te: 'ఆల్టర్నేరియా సోలాని శిలీంధ్రం.', hi: 'अल्टरनेरिया सोलानी कवक।' },
      treatment: { en: '1. Spray Mancozeb (0.25%)\n2. Apply Chlorothalonil\n3. Remove infected leaves', te: '1. మాంకోజెబ్ (0.25%) స్ప్రే చేయండి', hi: '1. मैंकोजेब (0.25%) स्प्रे करें' },
      prevention: { en: 'Crop rotation. Avoid overhead irrigation. Use healthy seed tubers.', te: 'పంట మార్పిడి. ఆరోగ్యకరమైన విత్తన గడ్డలు ఉపయోగించండి.', hi: 'फसल चक्र। स्वस्थ बीज कंद उपयोग करें।' },
      organic: { en: 'Neem oil spray. Compost to improve soil health.', te: 'వేప నూనె స్ప్రే. నేల ఆరోగ్యాన్ని మెరుగుపరచడానికి కంపోస్ట్.', hi: 'नीम तेल स्प्रे।' }
    }
  ],
  maize: [
    {
      id: 'maize_rust', name: { en: 'Common Rust', te: 'కామన్ రస్ట్', hi: 'सामान्य रतुआ' },
      severity: 'medium', color: '#ed8936',
      symptoms: { en: 'Brick-red to brown pustules on both leaf surfaces. Leaves turn yellow and die.', te: 'ఆకు రెండు వైపులా ఇటుక-ఎరుపు నుండి గోధుమ పస్ట్యూల్స్.', hi: 'पत्ती की दोनों सतहों पर ईंट-लाल से भूरे पुस्ट्यूल।' },
      causes: { en: 'Puccinia sorghi fungus. Cool temperatures (16-23°C) with high humidity.', te: 'పుచ్చినియా సోర్ఘి శిలీంధ్రం.', hi: 'पुक्सिनिया सोर्घी कवक।' },
      treatment: { en: '1. Spray Mancozeb or Propiconazole\n2. Apply fungicide at early stage', te: '1. మాంకోజెబ్ లేదా ప్రోపికోనజోల్ స్ప్రే చేయండి', hi: '1. मैंकोजेब या प्रोपिकोनाजोल स्प्रे करें' },
      prevention: { en: 'Use resistant hybrids. Early planting. Avoid dense planting.', te: 'నిరోధక హైబ్రిడ్లు ఉపయోగించండి.', hi: 'प्रतिरोधी संकर उपयोग करें।' },
      organic: { en: 'Sulfur-based fungicide. Neem oil spray.', te: 'సల్ఫర్-ఆధారిత శిలీంధ్రనాశిని.', hi: 'सल्फर आधारित कवकनाशी।' }
    },
    {
      id: 'maize_leaf_blight', name: { en: 'Northern Leaf Blight', te: 'నార్తర్న్ లీఫ్ బ్లైట్', hi: 'उत्तरी पत्ती झुलसा' },
      severity: 'high', color: '#e53e3e',
      symptoms: { en: 'Long, cigar-shaped gray-green lesions on leaves. Lesions turn tan with dark borders.', te: 'ఆకులపై పొడవైన, సిగార్-ఆకారపు బూడిద-ఆకుపచ్చ గాయాలు.', hi: 'पत्तियों पर लंबे, सिगार के आकार के भूरे-हरे घाव।' },
      causes: { en: 'Exserohilum turcicum fungus. Cool, moist weather favors disease.', te: 'ఎక్సెరోహిలమ్ టర్సికమ్ శిలీంధ్రం.', hi: 'एक्सेरोहिलम टर्सिकम कवक।' },
      treatment: { en: '1. Spray Propiconazole or Azoxystrobin\n2. Remove infected leaves', te: '1. ప్రోపికోనజోల్ లేదా అజాక్సీస్ట్రోబిన్ స్ప్రే చేయండి', hi: '1. प्रोपिकोनाजोल या एजोक्सीस्ट्रोबिन स्प्रे करें' },
      prevention: { en: 'Use resistant varieties. Crop rotation. Destroy crop residues.', te: 'నిరోధక రకాలు ఉపయోగించండి. పంట అవశేషాలు నాశనం చేయండి.', hi: 'प्रतिरोधी किस्में उपयोग करें।' },
      organic: { en: 'Trichoderma application. Neem-based spray.', te: 'ట్రైకోడెర్మా అప్లికేషన్.', hi: 'ट्राइकोडर्मा का उपयोग।' }
    }
  ],
  cotton: [
    {
      id: 'cotton_boll_rot', name: { en: 'Boll Rot', te: 'బోల్ రాట్', hi: 'टिंडा सड़न' },
      severity: 'high', color: '#e53e3e',
      symptoms: { en: 'Bolls turn brown and rot. Pink or white fungal growth inside bolls. Fiber quality reduced.', te: 'బోల్లు గోధుమ రంగుకు మారి కుళ్ళిపోతాయి. బోల్ల లోపల గులాబీ లేదా తెల్లని శిలీంధ్ర పెరుగుదల.', hi: 'टिंडे भूरे पड़ जाते हैं और सड़ जाते हैं।' },
      causes: { en: 'Multiple fungi (Fusarium, Colletotrichum). High humidity and insect damage.', te: 'బహుళ శిలీంధ్రాలు. అధిక తేమ మరియు కీటక నష్టం.', hi: 'कई कवक। उच्च आर्द्रता और कीट क्षति।' },
      treatment: { en: '1. Spray Copper oxychloride\n2. Control bollworm insects\n3. Improve drainage', te: '1. కాపర్ ఆక్సీక్లోరైడ్ స్ప్రే చేయండి\n2. బోల్వర్మ్ కీటకాలను నియంత్రించండి', hi: '1. कॉपर ऑक्सीक्लोराइड स्प्रे करें' },
      prevention: { en: 'Control insect pests. Avoid excess irrigation. Proper plant spacing.', te: 'కీటక తెగుళ్ళను నియంత్రించండి. అధిక నీటిపారుదల నివారించండి.', hi: 'कीट नियंत्रण। अधिक सिंचाई से बचें।' },
      organic: { en: 'Neem oil spray. Pheromone traps for bollworm.', te: 'వేప నూనె స్ప్రే. బోల్వర్మ్ కోసం ఫెరోమోన్ ట్రాప్లు.', hi: 'नीम तेल स्प्रे।' }
    },
    {
      id: 'cotton_leaf_spot', name: { en: 'Bacterial Blight', te: 'బ్యాక్టీరియల్ బ్లైట్', hi: 'बैक्टीरियल ब्लाइट' },
      severity: 'medium', color: '#ed8936',
      symptoms: { en: 'Angular water-soaked spots on leaves turning brown. Stem cankers. Boll shedding.', te: 'ఆకులపై కోణీయ నీటిలో నానిన మచ్చలు గోధుమ రంగుకు మారతాయి.', hi: 'पत्तियों पर कोणीय पानी से भीगे धब्बे।' },
      causes: { en: 'Xanthomonas citri pv. malvacearum bacteria. Spreads through rain and wind.', te: 'జాంతోమోనాస్ సిట్రి బ్యాక్టీరియా. వర్షం మరియు గాలి ద్వారా వ్యాపిస్తుంది.', hi: 'जैंथोमोनस सिट्री बैक्टीरिया।' },
      treatment: { en: '1. Spray Copper oxychloride (0.3%)\n2. Apply Streptocycline\n3. Remove infected plant parts', te: '1. కాపర్ ఆక్సీక్లోరైడ్ (0.3%) స్ప్రే చేయండి', hi: '1. कॉपर ऑक्सीक्लोराइड (0.3%) स्प्रे करें' },
      prevention: { en: 'Use resistant varieties. Treat seeds before sowing. Avoid working in wet fields.', te: 'నిరోధక రకాలు ఉపయోగించండి. విత్తే ముందు విత్తనాలు చికిత్స చేయండి.', hi: 'प्रतिरोधी किस्में उपयोग करें।' },
      organic: { en: 'Copper sulfate seed treatment. Garlic extract spray.', te: 'కాపర్ సల్ఫేట్ విత్తన చికిత్స.', hi: 'कॉपर सल्फेट बीज उपचार।' }
    }
  ],
  groundnut: [
    {
      id: 'groundnut_leaf_spot', name: { en: 'Early Leaf Spot', te: 'ఎర్లీ లీఫ్ స్పాట్', hi: 'अगेती पत्ती धब्बा' },
      severity: 'medium', color: '#ed8936',
      symptoms: { en: 'Circular dark brown spots with yellow halo on upper leaf surface. Premature defoliation.', te: 'ఆకు పై భాగంపై పసుపు వలయంతో గోలాకార ముదురు గోధుమ మచ్చలు.', hi: 'पत्ती की ऊपरी सतह पर पीले घेरे के साथ गोल गहरे भूरे धब्बे।' },
      causes: { en: 'Cercospora arachidicola fungus. Warm, humid conditions favor disease.', te: 'సెర్కోస్పోరా అరాచిడికోలా శిలీంధ్రం.', hi: 'सर्कोस्पोरा अरेचिडिकोला कवक।' },
      treatment: { en: '1. Spray Mancozeb (0.25%) or Chlorothalonil\n2. Apply Carbendazim\n3. Remove infected leaves', te: '1. మాంకోజెబ్ (0.25%) స్ప్రే చేయండి', hi: '1. मैंकोजेब (0.25%) स्प्रे करें' },
      prevention: { en: 'Crop rotation. Use resistant varieties. Proper plant spacing.', te: 'పంట మార్పిడి. నిరోధక రకాలు ఉపయోగించండి.', hi: 'फसल चक्र। प्रतिरोधी किस्में उपयोग करें।' },
      organic: { en: 'Neem oil spray. Trichoderma soil application.', te: 'వేప నూనె స్ప్రే.', hi: 'नीम तेल स्प्रे।' }
    }
  ],
  sugarcane: [
    {
      id: 'sugarcane_red_rot', name: { en: 'Red Rot', te: 'రెడ్ రాట్', hi: 'लाल सड़न' },
      severity: 'high', color: '#e53e3e',
      symptoms: { en: 'Reddening of internal stalk tissue with white patches. Sour smell. Leaves wilt and dry.', te: 'తెల్లని మచ్చలతో అంతర్గత కాండం కణజాలం ఎర్రబడటం. పుల్లని వాసన.', hi: 'सफेद धब्बों के साथ आंतरिक तने के ऊतकों का लाल होना।' },
      causes: { en: 'Colletotrichum falcatum fungus. Spreads through infected setts and waterlogging.', te: 'కొలెటోట్రికమ్ ఫాల్కాటమ్ శిలీంధ్రం.', hi: 'कोलेटोट्रिकम फाल्केटम कवक।' },
      treatment: { en: '1. Treat setts with Carbendazim (0.1%)\n2. Remove infected clumps\n3. Improve drainage', te: '1. కార్బెండాజిమ్ (0.1%) తో సెట్లు చికిత్స చేయండి\n2. సోకిన గుంపులు తొలగించండి', hi: '1. कार्बेंडाजिम (0.1%) से सेट उपचार करें' },
      prevention: { en: 'Use disease-free setts. Avoid waterlogging. Use resistant varieties.', te: 'వ్యాధి-రహిత సెట్లు ఉపయోగించండి. నీటి నిలకడ నివారించండి.', hi: 'रोग-मुक्त सेट उपयोग करें।' },
      organic: { en: 'Hot water treatment of setts (52°C for 30 min). Trichoderma application.', te: 'సెట్ల వేడి నీటి చికిత్స (52°C 30 నిమిషాలు).', hi: 'सेट का गर्म पानी उपचार (52°C 30 मिनट)।' }
    }
  ]
};

// ── Healthy plant entry ──────────────────────────────────────────────────────
const healthyResult = {
  id: 'healthy',
  name: { en: 'Healthy Plant', te: 'ఆరోగ్యకరమైన మొక్క', hi: 'स्वस्थ पौधा' },
  severity: 'none', color: '#48bb78',
  symptoms: { en: 'No disease symptoms detected. Plant appears healthy.', te: 'వ్యాధి లక్షణాలు కనుగొనబడలేదు. మొక్క ఆరోగ్యంగా కనిపిస్తోంది.', hi: 'कोई रोग लक्षण नहीं मिले। पौधा स्वस्थ दिखता है।' },
  causes: { en: 'N/A', te: 'వర్తించదు', hi: 'लागू नहीं' },
  treatment: { en: 'Continue regular care: proper irrigation, balanced fertilization, and pest monitoring.', te: 'సాధారణ సంరక్షణ కొనసాగించండి: సరైన నీటిపారుదల, సమతుల్య ఎరువు.', hi: 'नियमित देखभाल जारी रखें।' },
  prevention: { en: 'Maintain good agricultural practices to keep plants healthy.', te: 'మొక్కలను ఆరోగ్యంగా ఉంచడానికి మంచి వ్యవసాయ పద్ధతులు నిర్వహించండి.', hi: 'पौधों को स्वस्थ रखने के लिए अच्छी कृषि पद्धतियां बनाए रखें।' },
  organic: { en: 'Regular neem oil spray as preventive measure.', te: 'నివారణ చర్యగా సాధారణ వేప నూనె స్ప్రే.', hi: 'निवारक उपाय के रूप में नियमित नीम तेल स्प्रे।' }
};
