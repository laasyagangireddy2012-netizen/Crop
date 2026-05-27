const translations = {
    en: {
        tagline: "AI-Powered Crop Recommendations",
        login: "Login",
        loginTitle: "Welcome Back",
        loginSubtitle: "Sign in to your account to continue",
        resetHint: "Enter your username and set a new password.",
        footerText: "© 2026 CROPXAI · Empowering Farmers with AI",
        username: "Username",
        password: "Password",
        loginBtn: "Login",
        welcome: "Dashboard",
        logout: "⏻ Logout",
        profile: "Profile",
        inputTitle: "Farm Details",
        location: "📍 Location",
        area: "📐 Area (acres)",
        season: "🗓️ Season",
        soilType: "🪨 Soil Type",
        soilPh: "⚗️ Soil pH",
        nitrogen: "🌿 Nitrogen (N) %",
        phosphorus: "🔴 Phosphorus (P) %",
        potassium: "🟡 Potassium (K) %",
        autoDetect: "Auto",
        detectLocation: "📍",
        autoDetectClimate: "Auto",
        climate: "Climate Type",
        liveWeather: "Live Weather",
        detectedClimate: "Detected Climate:",
        fetchingWeather: "Fetching live weather...",
        getRecommendation: "Get Crop Recommendation",
        backToFarm: "Back to Farm Details",
        recommendationTitle: "Recommended Crop",
        phInfoTitle: "Soil pH Information",
        phInfoContent: "Soil pH measures acidity/alkalinity on a scale of 0-14. Most crops prefer pH 6.0-7.5.",
        npkInfoTitle: "NPK Nutrients Information",
        npkInfoContent: "N (Nitrogen): Promotes leaf growth. P (Phosphorus): Supports root and flower development. K (Potassium): Enhances overall plant health.",
        irrigation: "Recommended Irrigation:",
        fertilizers: "Recommended Fertilizers:",
        explanation: "Why This Crop?",
        phRange: "pH Range:",
        optimal: "Optimal",
        forgotPassword: "Forgot Password?",
        createAccount: "Create New Account",
        backToLogin: "Back to Login",
        registerBtn: "Register",
        resetBtn: "Reset Password",
        email: "Email",
        confirmPassword: "Confirm Password",
        fullName: "Full Name",
        newPassword: "New Password",
        profileTitle: "User Profile",
        voiceAssistant: "Voice Assistant",
        voiceReady: "Ready to listen...",
        startListening: "Start Listening",
        diseaseDetection: "Disease Detection",
        diseaseDetectionTitle: "Plant Disease Detection",
        diseaseSubtitle: "Upload a photo of a plant leaf to identify diseases",
        uploadLeafPhoto: "Upload or drag a leaf photo here",
        uploadHint: "Supports JPG, PNG, WEBP • Max 10MB",
        choosePhoto: "📷 Choose Photo",
        takePhoto: "📸 Take Photo",
        selectCropType: "Select Crop Type:",
        analyzeDisease: "🔍 Analyze for Disease",
        analyzingImage: "Analyzing leaf image...",
        analyzeAnother: "🔄 Analyze Another",
        cameraHint: "Point camera at the diseased leaf and tap Capture",
        detectLocation: "📍 Detect",
        autoDetectClimate: "🌤️ Auto Detect",
        liveWeather: "Live Weather",
        detectedClimate: "Detected Climate:",
        fetchingWeather: "Fetching live weather data...",
        climate: "Climate Type:",
        aiExplanation: "AI Explanation",
        featureImportance: "Feature Importance",
        confidenceScore: "Confidence Score",
        irrigationSchedule: "Irrigation Schedule",
        growthStage: "Growth Stage",
        days: "Days",
        frequency: "Frequency",
        waterDepth: "Water Depth",
        topRecommendations: "Top Crop Recommendations",
        bestRecommendation: "BEST RECOMMENDATION",
        alternative: "Alternative",
        comparisonTable: "Comparison Table",
        insurance: "Insurance",
        applyNowHeader: "Apply Now",
        insuranceTitle: "Pradhan Mantri Fasal Bima Yojana",
        insuranceSubtitle: "Crop Insurance Scheme",
        insuranceAbout: "About PMFBY",
        insuranceDescription: "Pradhan Mantri Fasal Bima Yojana provides comprehensive insurance coverage against crop loss due to natural calamities, pests, and diseases. Get financial support to recover from crop failures.",
        insuranceBenefits: "Key Benefits:",
        benefit1: "✓ Low premium rates (1.5-5% of sum insured)",
        benefit2: "✓ Coverage for all stages of crop cycle",
        benefit3: "✓ Protection against natural disasters",
        benefit4: "✓ Quick claim settlement",
        benefit5: "✓ Government subsidy on premium",
        insuranceApply: "Apply for Crop Insurance",
        farmerName: "Farmer Name",
        farmerPhone: "Phone Number",
        farmerAadhar: "Aadhar Number",
        aadharHelp: "12 digits (e.g., 1234 5678 9012)",
        farmerBank: "Bank Account Number",
        cropType: "Crop to Insure",
        sumInsured: "Sum Insured (₹)",
        sumInsuredHelp: "Based on crop value and area",
        premiumEstimate: "Premium Estimate:",
        premiumAmount: "Premium Amount:",
        premiumNote: "*Actual premium may vary based on crop and location",
        submitInsurance: "Submit Application",
        scrollToSubmit: "Scroll to Submit Button",
        scrollDownHint: "⬇️ Scroll down to fill the form and submit ⬇️",
        insuranceSuccessTitle: "Application Submitted Successfully!",
        insuranceSuccessMsg: "Your crop insurance application has been submitted. You will receive a confirmation SMS and email with your application reference number within 24 hours.",
        insuranceNextSteps: "Next Steps: 1. Keep your documents ready (Land records, Aadhar, Bank details) 2. Visit nearest agriculture office for verification 3. Premium will be deducted from your bank account",
        close: "Close",
        closeModal: "Close",
        applyNow: "📝 Apply Now - Fill Application Form",
        applyInstruction: "Click the button below to fill the application form and claim insurance from the government",
        formInstruction: "Please fill all the required information below to claim insurance from the government",
        backToTop: "Back to Top",
        viewBenefits: "View Benefits & Information",
        readAloud: "🔊 Read Aloud",
        stopReading: "⏹️ Stop Reading",
        identityProof: "📋 Identity Proof Details",
        idProofType: "ID Proof Type",
        idProofNumber: "ID Proof Number",
        fatherName: "Father's/Husband's Name",
        dateOfBirth: "Date of Birth",
        bankDetails: "🏦 Bank Account Details",
        bankName: "Bank Name",
        branchName: "Branch Name",
        accountNumber: "Account Number",
        ifscCode: "IFSC Code",
        ifscHelp: "Example: SBIN0001234",
        accountHolderName: "Account Holder Name",
        accountHolderHelp: "Name as per bank records",
        landOwnership: "🌾 Land Ownership Details",
        landOwnershipType: "Land Ownership Type",
        surveyNumber: "Survey/Khasra Number",
        village: "Village/Town",
        district: "District",
        landArea: "Total Land Area (acres)",
        irrigationType: "Irrigation Type",
        landDocumentNumber: "Land Document Number",
        landDocumentHelp: "Patta/Title Deed/7/12 Extract Number",
        
        // Dropdown Options
        selectLocation: "Select Location",
        selectSeason: "Select Season",
        selectSoilType: "Select Soil Type",
        selectCrop: "Select Crop",
        selectIdProof: "Select ID Proof",
        selectOwnership: "Select Ownership Type",
        selectIrrigation: "Select Irrigation Type",
        
        // Location Options
        andhraPradesh: "Andhra Pradesh",
        telangana: "Telangana",
        karnataka: "Karnataka",
        tamilNadu: "Tamil Nadu",
        kerala: "Kerala",
        maharashtra: "Maharashtra",
        gujarat: "Gujarat",
        rajasthan: "Rajasthan",
        punjab: "Punjab",
        haryana: "Haryana",
        uttarPradesh: "Uttar Pradesh",
        madhyaPradesh: "Madhya Pradesh",
        bihar: "Bihar",
        westBengal: "West Bengal",
        odisha: "Odisha",
        
        // Season Options
        kharif: "Kharif (Monsoon)",
        rabi: "Rabi (Winter)",
        zaid: "Zaid (Summer)",
        
        // Soil Type Options
        clay: "Clay",
        sandy: "Sandy",
        loamy: "Loamy",
        black: "Black",
        red: "Red",
        alluvial: "Alluvial",
        
        // Crop Options
        riceOption: "Rice",
        wheatOption: "Wheat",
        maizeOption: "Maize",
        cottonOption: "Cotton",
        sugarcanOption: "Sugarcane",
        groundnutOption: "Groundnut",
        soybeanOption: "Soybean",
        chickpeaOption: "Chickpea",
        
        // ID Proof Options
        aadharCard: "Aadhar Card",
        panCard: "PAN Card",
        voterIdCard: "Voter ID Card",
        drivingLicense: "Driving License",
        
        // Land Ownership Options
        owned: "Owned",
        leased: "Leased",
        sharecropper: "Sharecropper",
        tenant: "Tenant",
        
        // Irrigation Options
        irrigated: "Irrigated",
        rainfed: "Rainfed",
        partiallyIrrigated: "Partially Irrigated"
    },
    te: {
        tagline: "AI ఆధారిత పంట సిఫార్సులు",
        login: "లాగిన్",
        loginTitle: "స్వాగతం",
        loginSubtitle: "మీ ఖాతాలోకి సైన్ ఇన్ చేయండి",
        resetHint: "మీ వినియోగదారు పేరు నమోదు చేసి కొత్త పాస్‌వర్డ్ సెట్ చేయండి.",
        footerText: "© 2026 CROPXAI · రైతులను AI తో శక్తివంతం చేయడం",
        username: "వినియోగదారు పేరు",
        password: "పాస్‌వర్డ్",
        loginBtn: "లాగిన్",
        welcome: "డాష్‌బోర్డ్",
        logout: "⏻ లాగ్అవుట్",
        profile: "ప్రొఫైల్",
        inputTitle: "వ్యవసాయ వివరాలు",
        location: "📍 స్థానం",
        area: "📐 విస్తీర్ణం (ఎకరాలు)",
        season: "🗓️ సీజన్",
        soilType: "🪨 నేల రకం",
        soilPh: "⚗️ నేల pH",
        nitrogen: "🌿 నత్రజని (N) %",
        phosphorus: "🔴 భాస్వరం (P) %",
        potassium: "🟡 పొటాషియం (K) %",
        autoDetect: "ఆటో",
        detectLocation: "📍",
        autoDetectClimate: "ఆటో",
        climate: "వాతావరణ రకం",
        liveWeather: "లైవ్ వాతావరణం",
        detectedClimate: "గుర్తించిన వాతావరణం:",
        fetchingWeather: "వాతావరణ డేటా తీసుకుంటోంది...",
        getRecommendation: "పంట సిఫార్సు పొందండి",
        backToFarm: "వ్యవసాయ వివరాలకు తిరిగి వెళ్ళండి",
        recommendationTitle: "సిఫార్సు చేయబడిన పంట",
        phInfoTitle: "నేల pH సమాచారం",
        phInfoContent: "నేల pH 0-14 స్కేల్‌లో ఆమ్లత్వం/క్షారత్వాన్ని కొలుస్తుంది.",
        npkInfoTitle: "NPK పోషకాల సమాచారం",
        npkInfoContent: "N: ఆకు పెరుగుదల. P: వేరు అభివృద్ధి. K: మొక్క ఆరోగ్యం.",
        irrigation: "సిఫార్సు చేయబడిన నీటిపారుదల:",
        fertilizers: "సిఫార్సు చేయబడిన ఎరువులు:",
        explanation: "ఈ పంట ఎందుకు?",
        phRange: "pH పరిధి:",
        optimal: "అనుకూలమైన",
        forgotPassword: "పాస్‌వర్డ్ మర్చిపోయారా?",
        createAccount: "కొత్త ఖాతా సృష్టించండి",
        backToLogin: "లాగిన్‌కు తిరిగి వెళ్ళండి",
        registerBtn: "నమోదు చేయండి",
        resetBtn: "పాస్‌వర్డ్ రీసెట్ చేయండి",
        email: "ఇమెయిల్",
        confirmPassword: "పాస్‌వర్డ్ నిర్ధారించండి",
        fullName: "పూర్తి పేరు",
        newPassword: "కొత్త పాస్‌వర్డ్",
        profileTitle: "వినియోగదారు ప్రొఫైల్",
        voiceAssistant: "వాయిస్ అసిస్టెంట్",
        voiceReady: "వినడానికి సిద్ధంగా ఉంది...",
        startListening: "వినడం ప్రారంభించండి",
        diseaseDetection: "వ్యాధి గుర్తింపు",
        diseaseDetectionTitle: "మొక్కల వ్యాధి గుర్తింపు",
        diseaseSubtitle: "వ్యాధులను గుర్తించడానికి మొక్క ఆకు ఫోటో అప్‌లోడ్ చేయండి",
        uploadLeafPhoto: "ఇక్కడ ఆకు ఫోటో అప్‌లోడ్ చేయండి లేదా లాగండి",
        uploadHint: "JPG, PNG, WEBP మద్దతు • గరిష్టం 10MB",
        choosePhoto: "📷 ఫోటో ఎంచుకోండి",
        takePhoto: "📸 ఫోటో తీయండి",
        selectCropType: "పంట రకం ఎంచుకోండి:",
        analyzeDisease: "🔍 వ్యాధి కోసం విశ్లేషించండి",
        analyzingImage: "ఆకు చిత్రాన్ని విశ్లేషిస్తోంది...",
        analyzeAnother: "🔄 మరొకటి విశ్లేషించండి",
        cameraHint: "కెమెరాను వ్యాధి సోకిన ఆకు వైపు చూపించి క్యాప్చర్ నొక్కండి",
        detectLocation: "📍 గుర్తించు",
        autoDetectClimate: "🌤️ ఆటో డిటెక్ట్",
        liveWeather: "లైవ్ వాతావరణం",
        detectedClimate: "గుర్తించిన వాతావరణం:",
        fetchingWeather: "లైవ్ వాతావరణ డేటా తీసుకుంటోంది...",
        climate: "వాతావరణ రకం:",
        aiExplanation: "AI వివరణ",
        featureImportance: "ఫీచర్ ప్రాముఖ్యత",
        confidenceScore: "విశ్వాస స్కోర్",
        irrigationSchedule: "నీటిపారుదల షెడ్యూల్",
        growthStage: "పెరుగుదల దశ",
        days: "రోజులు",
        frequency: "ఫ్రీక్వెన్సీ",
        waterDepth: "నీటి లోతు",
        topRecommendations: "టాప్ పంట సిఫార్సులు",
        bestRecommendation: "ఉత్తమ సిఫార్సు",
        alternative: "ప్రత్యామ్నాయం",
        comparisonTable: "పోలిక పట్టిక",
        insurance: "బీమా",
        applyNowHeader: "ఇప్పుడు దరఖాస్తు చేయండి",
        insuranceTitle: "ప్రధాన మంత్రి ఫసల్ బీమా యోజన",
        insuranceSubtitle: "పంట బీమా పథకం",
        insuranceAbout: "PMFBY గురించి",
        insuranceDescription: "ప్రధాన మంత్రి ఫసల్ బీమా యోజన ప్రకృతి వైపరీత్యాలు, తెగుళ్లు మరియు వ్యాధుల వల్ల పంట నష్టానికి వ్యతిరేకంగా సమగ్ర బీమా కవరేజీని అందిస్తుంది. పంట వైఫల్యాల నుండి కోలుకోవడానికి ఆర్థిక మద్దతు పొందండి.",
        insuranceBenefits: "ముఖ్య ప్రయోజనాలు:",
        benefit1: "✓ తక్కువ ప్రీమియం రేట్లు (బీమా మొత్తంలో 1.5-5%)",
        benefit2: "✓ పంట చక్రం యొక్క అన్ని దశలకు కవరేజ్",
        benefit3: "✓ ప్రకృతి వైపరీత్యాల నుండి రక్షణ",
        benefit4: "✓ త్వరిత క్లెయిమ్ సెటిల్మెంట్",
        benefit5: "✓ ప్రీమియంపై ప్రభుత్వ సబ్సిడీ",
        insuranceApply: "పంట బీమా కోసం దరఖాస్తు చేయండి",
        farmerName: "రైతు పేరు",
        farmerPhone: "ఫోన్ నంబర్",
        farmerAadhar: "ఆధార్ నంబర్",
        aadharHelp: "12 అంకెలు (ఉదా., 1234 5678 9012)",
        farmerBank: "బ్యాంక్ ఖాతా నంబర్",
        cropType: "బీమా చేయవలసిన పంట",
        sumInsured: "బీమా మొత్తం (₹)",
        sumInsuredHelp: "పంట విలువ మరియు విస్తీర్ణం ఆధారంగా",
        premiumEstimate: "ప్రీమియం అంచనా:",
        premiumAmount: "ప్రీమియం మొత్తం:",
        premiumNote: "*పంట మరియు స్థానం ఆధారంగా వాస్తవ ప్రీమియం మారవచ్చు",
        submitInsurance: "దరఖాస్తు సమర్పించండి",
        scrollToSubmit: "సమర్పించు బటన్‌కు స్క్రోల్ చేయండి",
        scrollDownHint: "⬇️ ఫారమ్ పూరించడానికి మరియు సమర్పించడానికి క్రిందికి స్క్రోల్ చేయండి ⬇️",
        insuranceSuccessTitle: "దరఖాస్తు విజయవంతంగా సమర్పించబడింది!",
        insuranceSuccessMsg: "మీ పంట బీమా దరఖాస్తు సమర్పించబడింది. మీరు 24 గంటల్లో మీ దరఖాస్తు రిఫరెన్స్ నంబర్‌తో నిర్ధారణ SMS మరియు ఇమెయిల్ అందుకుంటారు.",
        insuranceNextSteps: "తదుపరి దశలు: 1. మీ పత్రాలను సిద్ధంగా ఉంచండి (భూ రికార్డులు, ఆధార్, బ్యాంక్ వివరాలు) 2. ధృవీకరణ కోసం సమీప వ్యవసాయ కార్యాలయాన్ని సందర్శించండి 3. మీ బ్యాంక్ ఖాతా నుండి ప్రీమియం తీసివేయబడుతుంది",
        close: "మూసివేయండి",
        closeModal: "మూసివేయండి",
        applyNow: "📝 ఇప్పుడు దరఖాస్తు చేయండి - దరఖాస్తు ఫారమ్ పూరించండి",
        applyInstruction: "ప్రభుత్వం నుండి బీమా క్లెయిమ్ చేయడానికి దరఖాస్తు ఫారమ్ పూరించడానికి దిగువ బటన్‌ను క్లిక్ చేయండి",
        formInstruction: "ప్రభుత్వం నుండి బీమా క్లెయిమ్ చేయడానికి దయచేసి దిగువ అవసరమైన అన్ని సమాచారాన్ని పూరించండి",
        backToTop: "పైకి తిరిగి వెళ్ళండి",
        viewBenefits: "ప్రయోజనాలు & సమాచారం చూడండి",
        readAloud: "🔊 బిగ్గరగా చదవండి",
        stopReading: "⏹️ చదవడం ఆపండి",
        identityProof: "📋 గుర్తింపు రుజువు వివరాలు",
        idProofType: "ID రుజువు రకం",
        idProofNumber: "ID రుజువు నంబర్",
        fatherName: "తండ్రి/భర్త పేరు",
        dateOfBirth: "పుట్టిన తేదీ",
        bankDetails: "🏦 బ్యాంక్ ఖాతా వివరాలు",
        bankName: "బ్యాంక్ పేరు",
        branchName: "శాఖ పేరు",
        accountNumber: "ఖాతా నంబర్",
        ifscCode: "IFSC కోడ్",
        ifscHelp: "ఉదాహరణ: SBIN0001234",
        accountHolderName: "ఖాతాదారు పేరు",
        accountHolderHelp: "బ్యాంక్ రికార్డుల ప్రకారం పేరు",
        landOwnership: "🌾 భూ యాజమాన్య వివరాలు",
        landOwnershipType: "భూ యాజమాన్య రకం",
        surveyNumber: "సర్వే/ఖస్రా నంబర్",
        village: "గ్రామం/పట్టణం",
        district: "జిల్లా",
        landArea: "మొత్తం భూ విస్తీర్ణం (ఎకరాలు)",
        irrigationType: "నీటిపారుదల రకం",
        landDocumentNumber: "భూ పత్రం నంబర్",
        landDocumentHelp: "పట్టా/టైటిల్ డీడ్/7/12 సారాంశ నంబర్",
        
        // Dropdown Options
        selectLocation: "స్థానం ఎంచుకోండి",
        selectSeason: "సీజన్ ఎంచుకోండి",
        selectSoilType: "నేల రకం ఎంచుకోండి",
        selectCrop: "పంట ఎంచుకోండి",
        selectIdProof: "ID రుజువు ఎంచుకోండి",
        selectOwnership: "యాజమాన్య రకం ఎంచుకోండి",
        selectIrrigation: "నీటిపారుదల రకం ఎంచుకోండి",
        
        // Location Options
        andhraPradesh: "ఆంధ్ర ప్రదేశ్",
        telangana: "తెలంగాణ",
        karnataka: "కర్ణాటక",
        tamilNadu: "తమిళనాడు",
        kerala: "కేరళ",
        maharashtra: "మహారాష్ట్ర",
        gujarat: "గుజరాత్",
        rajasthan: "రాజస్థాన్",
        punjab: "పంజాబ్",
        haryana: "హర్యానా",
        uttarPradesh: "ఉత్తర ప్రదేశ్",
        madhyaPradesh: "మధ్య ప్రదేశ్",
        bihar: "బీహార్",
        westBengal: "పశ్చిమ బెంగాల్",
        odisha: "ఒడిశా",
        
        // Season Options
        kharif: "ఖరీఫ్ (వర్షాకాలం)",
        rabi: "రబీ (శీతాకాలం)",
        zaid: "జైద్ (వేసవి)",
        
        // Soil Type Options
        clay: "బంకమట్టి",
        sandy: "ఇసుక మట్టి",
        loamy: "లోమీ మట్టి",
        black: "నల్ల మట్టి",
        red: "ఎరుపు మట్టి",
        alluvial: "ఒండ్రు మట్టి",
        
        // Crop Options
        riceOption: "వరి",
        wheatOption: "గోధుమ",
        maizeOption: "మొక్కజొన్న",
        cottonOption: "పత్తి",
        sugarcanOption: "చెరకు",
        groundnutOption: "వేరుశెనగ",
        soybeanOption: "సోయాబీన్",
        chickpeaOption: "శనగలు",
        
        // ID Proof Options
        aadharCard: "ఆధార్ కార్డ్",
        panCard: "పాన్ కార్డ్",
        voterIdCard: "ఓటరు ID కార్డ్",
        drivingLicense: "డ్రైవింగ్ లైసెన్స్",
        
        // Land Ownership Options
        owned: "స్వంతం",
        leased: "లీజుకు తీసుకున్నది",
        sharecropper: "భాగస్వామ్య రైతు",
        tenant: "అద్దెదారు",
        
        // Irrigation Options
        irrigated: "నీటిపారుదల",
        rainfed: "వర్షాధార",
        partiallyIrrigated: "పాక్షిక నీటిపారుదల"
    },
    hi: {
        tagline: "AI-संचालित फसल सिफारिशें",
        login: "लॉगिन",
        loginTitle: "स्वागत है",
        loginSubtitle: "अपने खाते में साइन इन करें",
        resetHint: "अपना उपयोगकर्ता नाम दर्ज करें और नया पासवर्ड सेट करें।",
        footerText: "© 2026 CROPXAI · किसानों को AI से सशक्त बनाना",
        username: "उपयोगकर्ता नाम",
        password: "पासवर्ड",
        loginBtn: "लॉगिन",
        welcome: "डैशबोर्ड",
        logout: "⏻ लॉगआउट",
        profile: "प्रोफ़ाइल",
        inputTitle: "खेत का विवरण",
        location: "📍 स्थान",
        area: "📐 क्षेत्रफल (एकड़)",
        season: "🗓️ मौसम",
        soilType: "🪨 मिट्टी का प्रकार",
        soilPh: "⚗️ मिट्टी pH",
        nitrogen: "🌿 नाइट्रोजन (N) %",
        phosphorus: "🔴 फास्फोरस (P) %",
        potassium: "🟡 पोटेशियम (K) %",
        autoDetect: "ऑटो",
        detectLocation: "📍",
        autoDetectClimate: "ऑटो",
        climate: "जलवायु प्रकार",
        liveWeather: "लाइव मौसम",
        detectedClimate: "पहचाना गया जलवायु:",
        fetchingWeather: "मौसम डेटा प्राप्त हो रहा है...",
        getRecommendation: "फसल सिफारिश प्राप्त करें",
        backToFarm: "खेत विवरण पर वापस जाएं",
        recommendationTitle: "अनुशंसित फसल",
        phInfoTitle: "मिट्टी pH जानकारी",
        phInfoContent: "मिट्टी pH 0-14 के पैमाने पर अम्लता/क्षारीयता को मापता है।",
        npkInfoTitle: "NPK पोषक तत्व जानकारी",
        npkInfoContent: "N: पत्ती वृद्धि। P: जड़ विकास। K: पौधे का स्वास्थ्य।",
        irrigation: "अनुशंसित सिंचाई:",
        fertilizers: "अनुशंसित उर्वरक:",
        explanation: "यह फसल क्यों?",
        phRange: "pH सीमा:",
        optimal: "इष्टतम",
        forgotPassword: "पासवर्ड भूल गए?",
        createAccount: "नया खाता बनाएं",
        backToLogin: "लॉगिन पर वापस जाएं",
        registerBtn: "पंजीकरण करें",
        resetBtn: "पासवर्ड रीसेट करें",
        email: "ईमेल",
        confirmPassword: "पासवर्ड की पुष्टि करें",
        fullName: "पूरा नाम",
        newPassword: "नया पासवर्ड",
        profileTitle: "उपयोगकर्ता प्रोफ़ाइल",
        voiceAssistant: "वॉयस असिस्टेंट",
        voiceReady: "सुनने के लिए तैयार...",
        startListening: "सुनना शुरू करें",
        diseaseDetection: "रोग पहचान",
        diseaseDetectionTitle: "पौधे की बीमारी पहचान",
        diseaseSubtitle: "बीमारियों की पहचान के लिए पत्ती की फोटो अपलोड करें",
        uploadLeafPhoto: "यहां पत्ती की फोटो अपलोड करें या खींचें",
        uploadHint: "JPG, PNG, WEBP समर्थित • अधिकतम 10MB",
        choosePhoto: "📷 फोटो चुनें",
        takePhoto: "📸 फोटो लें",
        selectCropType: "फसल का प्रकार चुनें:",
        analyzeDisease: "🔍 बीमारी के लिए विश्लेषण करें",
        analyzingImage: "पत्ती की छवि का विश्लेषण हो रहा है...",
        analyzeAnother: "🔄 दूसरा विश्लेषण करें",
        cameraHint: "कैमरे को रोगग्रस्त पत्ती की ओर करें और Capture दबाएं",
        detectLocation: "📍 पहचानें",
        autoDetectClimate: "🌤️ ऑटो डिटेक्ट",
        liveWeather: "लाइव मौसम",
        detectedClimate: "पहचाना गया जलवायु:",
        fetchingWeather: "लाइव मौसम डेटा प्राप्त हो रहा है...",
        climate: "जलवायु प्रकार:",
        aiExplanation: "AI स्पष्टीकरण",
        featureImportance: "फीचर महत्व",
        confidenceScore: "विश्वास स्कोर",
        irrigationSchedule: "सिंचाई अनुसूची",
        growthStage: "वृद्धि चरण",
        days: "दिन",
        frequency: "आवृत्ति",
        waterDepth: "पानी की गहराई",
        topRecommendations: "शीर्ष फसल सिफारिशें",
        bestRecommendation: "सर्वश्रेष्ठ सिफारिश",
        alternative: "विकल्प",
        comparisonTable: "तुलना तालिका",
        insurance: "बीमा",
        applyNowHeader: "अभी आवेदन करें",
        insuranceTitle: "प्रधान मंत्री फसल बीमा योजना",
        insuranceSubtitle: "फसल बीमा योजना",
        insuranceAbout: "PMFBY के बारे में",
        insuranceDescription: "प्रधान मंत्री फसल बीमा योजना प्राकृतिक आपदाओं, कीटों और बीमारियों के कारण फसल नुकसान के खिलाफ व्यापक बीमा कवरेज प्रदान करती है। फसल विफलता से उबरने के लिए वित्तीय सहायता प्राप्त करें।",
        insuranceBenefits: "मुख्य लाभ:",
        benefit1: "✓ कम प्रीमियम दरें (बीमित राशि का 1.5-5%)",
        benefit2: "✓ फसल चक्र के सभी चरणों के लिए कवरेज",
        benefit3: "✓ प्राकृतिक आपदाओं से सुरक्षा",
        benefit4: "✓ त्वरित दावा निपटान",
        benefit5: "✓ प्रीमियम पर सरकारी सब्सिडी",
        insuranceApply: "फसल बीमा के लिए आवेदन करें",
        farmerName: "किसान का नाम",
        farmerPhone: "फोन नंबर",
        farmerAadhar: "आधार नंबर",
        aadharHelp: "12 अंक (उदा., 1234 5678 9012)",
        farmerBank: "बैंक खाता संख्या",
        cropType: "बीमा करने के लिए फसल",
        sumInsured: "बीमित राशि (₹)",
        sumInsuredHelp: "फसल मूल्य और क्षेत्र के आधार पर",
        premiumEstimate: "प्रीमियम अनुमान:",
        premiumAmount: "प्रीमियम राशि:",
        premiumNote: "*वास्तविक प्रीमियम फसल और स्थान के आधार पर भिन्न हो सकता है",
        submitInsurance: "आवेदन जमा करें",
        scrollToSubmit: "सबमिट बटन पर स्क्रॉल करें",
        scrollDownHint: "⬇️ फॉर्म भरने और जमा करने के लिए नीचे स्क्रॉल करें ⬇️",
        insuranceSuccessTitle: "आवेदन सफलतापूर्वक जमा किया गया!",
        insuranceSuccessMsg: "आपका फसल बीमा आवेदन जमा कर दिया गया है। आपको 24 घंटों के भीतर अपने आवेदन संदर्भ संख्या के साथ एक पुष्टिकरण SMS और ईमेल प्राप्त होगा।",
        insuranceNextSteps: "अगले कदम: 1. अपने दस्तावेज तैयार रखें (भूमि रिकॉर्ड, आधार, बैंक विवरण) 2. सत्यापन के लिए निकटतम कृषि कार्यालय जाएं 3. प्रीमियम आपके बैंक खाते से काटा जाएगा",
        close: "बंद करें",
        closeModal: "बंद करें",
        applyNow: "📝 अभी आवेदन करें - आवेदन फॉर्म भरें",
        applyInstruction: "सरकार से बीमा का दावा करने के लिए आवेदन फॉर्म भरने के लिए नीचे दिए गए बटन पर क्लिक करें",
        formInstruction: "सरकार से बीमा का दावा करने के लिए कृपया नीचे सभी आवश्यक जानकारी भरें",
        backToTop: "शीर्ष पर वापस जाएं",
        viewBenefits: "लाभ और जानकारी देखें",
        readAloud: "🔊 जोर से पढ़ें",
        stopReading: "⏹️ पढ़ना बंद करें",
        identityProof: "📋 पहचान प्रमाण विवरण",
        idProofType: "ID प्रमाण प्रकार",
        idProofNumber: "ID प्रमाण संख्या",
        fatherName: "पिता/पति का नाम",
        dateOfBirth: "जन्म तिथि",
        bankDetails: "🏦 बैंक खाता विवरण",
        bankName: "बैंक का नाम",
        branchName: "शाखा का नाम",
        accountNumber: "खाता संख्या",
        ifscCode: "IFSC कोड",
        ifscHelp: "उदाहरण: SBIN0001234",
        accountHolderName: "खाताधारक का नाम",
        accountHolderHelp: "बैंक रिकॉर्ड के अनुसार नाम",
        landOwnership: "🌾 भूमि स्वामित्व विवरण",
        landOwnershipType: "भूमि स्वामित्व प्रकार",
        surveyNumber: "सर्वे/खसरा संख्या",
        village: "गांव/शहर",
        district: "जिला",
        landArea: "कुल भूमि क्षेत्र (एकड़)",
        irrigationType: "सिंचाई प्रकार",
        landDocumentNumber: "भूमि दस्तावेज़ संख्या",
        landDocumentHelp: "पट्टा/टाइटल डीड/7/12 अर्क संख्या",
        
        // Dropdown Options
        selectLocation: "स्थान चुनें",
        selectSeason: "मौसम चुनें",
        selectSoilType: "मिट्टी का प्रकार चुनें",
        selectCrop: "फसल चुनें",
        selectIdProof: "ID प्रमाण चुनें",
        selectOwnership: "स्वामित्व प्रकार चुनें",
        selectIrrigation: "सिंचाई प्रकार चुनें",
        
        // Location Options
        andhraPradesh: "आंध्र प्रदेश",
        telangana: "तेलंगाना",
        karnataka: "कर्नाटक",
        tamilNadu: "तमिलनाडु",
        kerala: "केरल",
        maharashtra: "महाराष्ट्र",
        gujarat: "गुजरात",
        rajasthan: "राजस्थान",
        punjab: "पंजाब",
        haryana: "हरियाणा",
        uttarPradesh: "उत्तर प्रदेश",
        madhyaPradesh: "मध्य प्रदेश",
        bihar: "बिहार",
        westBengal: "पश्चिम बंगाल",
        odisha: "ओडिशा",
        
        // Season Options
        kharif: "खरीफ (मानसून)",
        rabi: "रबी (सर्दी)",
        zaid: "जायद (गर्मी)",
        
        // Soil Type Options
        clay: "चिकनी मिट्टी",
        sandy: "रेतीली मिट्टी",
        loamy: "दोमट मिट्टी",
        black: "काली मिट्टी",
        red: "लाल मिट्टी",
        alluvial: "जलोढ़ मिट्टी",
        
        // Crop Options
        riceOption: "चावल",
        wheatOption: "गेहूं",
        maizeOption: "मक्का",
        cottonOption: "कपास",
        sugarcanOption: "गन्ना",
        groundnutOption: "मूंगफली",
        soybeanOption: "सोयाबीन",
        chickpeaOption: "चना",
        
        // ID Proof Options
        aadharCard: "आधार कार्ड",
        panCard: "पैन कार्ड",
        voterIdCard: "वोटर ID कार्ड",
        drivingLicense: "ड्राइविंग लाइसेंस",
        
        // Land Ownership Options
        owned: "स्वामित्व",
        leased: "पट्टे पर",
        sharecropper: "बटाईदार",
        tenant: "किरायेदार",
        
        // Irrigation Options
        irrigated: "सिंचित",
        rainfed: "वर्षा आधारित",
        partiallyIrrigated: "आंशिक रूप से सिंचित"
    }
};

// Dropdown options mapping
const dropdownOptions = {
    location: [
        { value: '', key: 'selectLocation' },
        { value: 'andhra-pradesh', key: 'andhraPradesh' },
        { value: 'telangana', key: 'telangana' },
        { value: 'karnataka', key: 'karnataka' },
        { value: 'tamil-nadu', key: 'tamilNadu' },
        { value: 'kerala', key: 'kerala' },
        { value: 'maharashtra', key: 'maharashtra' },
        { value: 'gujarat', key: 'gujarat' },
        { value: 'rajasthan', key: 'rajasthan' },
        { value: 'punjab', key: 'punjab' },
        { value: 'haryana', key: 'haryana' },
        { value: 'uttar-pradesh', key: 'uttarPradesh' },
        { value: 'madhya-pradesh', key: 'madhyaPradesh' },
        { value: 'bihar', key: 'bihar' },
        { value: 'west-bengal', key: 'westBengal' },
        { value: 'odisha', key: 'odisha' }
    ],
    season: [
        { value: '', key: 'selectSeason' },
        { value: 'kharif', key: 'kharif' },
        { value: 'rabi', key: 'rabi' },
        { value: 'zaid', key: 'zaid' }
    ],
    soilType: [
        { value: '', key: 'selectSoilType' },
        { value: 'clay', key: 'clay' },
        { value: 'sandy', key: 'sandy' },
        { value: 'loamy', key: 'loamy' },
        { value: 'black', key: 'black' },
        { value: 'red', key: 'red' },
        { value: 'alluvial', key: 'alluvial' }
    ],
    insCrop: [
        { value: '', key: 'selectCrop' },
        { value: 'rice', key: 'riceOption' },
        { value: 'wheat', key: 'wheatOption' },
        { value: 'maize', key: 'maizeOption' },
        { value: 'cotton', key: 'cottonOption' },
        { value: 'sugarcane', key: 'sugarcanOption' },
        { value: 'groundnut', key: 'groundnutOption' },
        { value: 'soybean', key: 'soybeanOption' },
        { value: 'chickpea', key: 'chickpeaOption' }
    ],
    insIdProofType: [
        { value: '', key: 'selectIdProof' },
        { value: 'aadhar', key: 'aadharCard' },
        { value: 'pan', key: 'panCard' },
        { value: 'voter-id', key: 'voterIdCard' },
        { value: 'driving-license', key: 'drivingLicense' }
    ],
    insLandOwnershipType: [
        { value: '', key: 'selectOwnership' },
        { value: 'owned', key: 'owned' },
        { value: 'leased', key: 'leased' },
        { value: 'sharecropper', key: 'sharecropper' },
        { value: 'tenant', key: 'tenant' }
    ],
    insIrrigationType: [
        { value: '', key: 'selectIrrigation' },
        { value: 'irrigated', key: 'irrigated' },
        { value: 'rainfed', key: 'rainfed' },
        { value: 'partially-irrigated', key: 'partiallyIrrigated' }
    ]
};

function updateDropdownOptions(lang) {
    // Update all dropdowns with translated options
    Object.keys(dropdownOptions).forEach(dropdownId => {
        const selectElement = document.getElementById(dropdownId);
        if (selectElement) {
            // Store current selected value
            const currentValue = selectElement.value;
            
            // Clear existing options
            selectElement.innerHTML = '';
            
            // Add translated options
            dropdownOptions[dropdownId].forEach(option => {
                const optionElement = document.createElement('option');
                optionElement.value = option.value;
                optionElement.textContent = translations[lang][option.key] || option.key;
                selectElement.appendChild(optionElement);
            });
            
            // Restore selected value
            selectElement.value = currentValue;
        }
    });
}

function translatePage(lang) {
    const t = translations[lang];
    if (!t) return;

    // 1. All data-translate elements
    document.querySelectorAll('[data-translate]').forEach(el => {
        const key = el.getAttribute('data-translate');
        if (t[key]) el.textContent = t[key];
    });

    // 2. Placeholders
    document.querySelectorAll('[data-translate-placeholder]').forEach(el => {
        const key = el.getAttribute('data-translate-placeholder');
        if (t[key]) el.placeholder = t[key];
    });

    // 3. Auto buttons
    document.querySelectorAll('.auto-btn').forEach(btn => {
        const key = btn.getAttribute('data-translate') || 'autoDetect';
        if (t[key]) btn.textContent = t[key];
    });

    // 4. Sidebar nav link labels
    const sidebarMap = { navFarm:'inputTitle', navDisease:'diseaseDetection', navVoice:'voiceAssistant', navProfile:'profile' };
    Object.entries(sidebarMap).forEach(([id, key]) => {
        const el = document.getElementById(id);
        if (el && t[key]) { const sp = el.querySelector('span:last-child'); if (sp) sp.textContent = t[key]; }
    });

    // 5. Page title in topbar
    const pt = document.querySelector('.page-title');
    if (pt && t.inputTitle) pt.textContent = t.inputTitle;

    // 6. Recommend button text
    const rb = document.getElementById('recommendBtn');
    if (rb && t.getRecommendation) {
        const sp = rb.querySelector('span:last-child');
        if (sp) sp.textContent = t.getRecommendation;
    }

    // 7. Logout button
    const lb = document.getElementById('logoutBtn');
    if (lb && t.logout) lb.textContent = t.logout;

    // 8. Sidebar role text
    const sr = document.querySelector('.sidebar-role');
    if (sr && t.welcome) sr.textContent = t.welcome;

    // 9. Disease modal title
    const dm = document.querySelector('.disease-modal h2');
    if (dm && t.diseaseDetectionTitle) dm.textContent = t.diseaseDetectionTitle;

    // 10. Voice modal title
    const vm = document.querySelector('.voice-modal h2');
    if (vm && t.voiceAssistant) vm.textContent = t.voiceAssistant;

    // 11. Profile modal title + re-render content if open
    const pm = document.querySelector('#profileModal h2');
    if (pm && t.profileTitle) pm.textContent = t.profileTitle;
    if (profileModal && profileModal.style.display === 'block' && typeof showProfile === 'function') {
        showProfile();
    }

    // 12. Brand tagline
    const bt = document.querySelector('.brand-tag');
    if (bt && t.tagline) bt.textContent = t.tagline;

    // 13. Weather widget live label
    const wh = document.querySelector('.weather-widget-header span:first-child');
    if (wh && t.liveWeather) wh.innerHTML = ' ' + t.liveWeather;

    // 14. Detected climate label
    const cl = document.querySelector('.weather-climate-tag span:first-child');
    if (cl && t.detectedClimate) cl.textContent = t.detectedClimate;

    // 15. Update dropdown options
    updateDropdownOptions(lang);

    // 16. Login page — update authTitle based on which form is visible
    const authTitle = document.getElementById('authTitle');
    if (authTitle) {
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        const forgotForm = document.getElementById('forgotPasswordForm');
        if (loginForm && loginForm.style.display !== 'none') {
            authTitle.textContent = t.loginTitle || 'Welcome Back';
        } else if (registerForm && registerForm.style.display !== 'none') {
            authTitle.textContent = t.createAccount || 'Create Account';
        } else if (forgotForm && forgotForm.style.display !== 'none') {
            authTitle.textContent = t.forgotPassword || 'Reset Password';
        }
    }
}
