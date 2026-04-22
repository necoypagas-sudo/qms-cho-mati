// src/config/settings.js
// Global QMS Settings - Editable Configuration
// Note: Videos are NOT stored in localStorage due to size limits.
// Use IndexedDB for video storage via utils/indexedDB.js

export const DEFAULT_SETTINGS = {
  organization: {
    name: "CITY HEALTH OFFICE",
    location: "Mati, Davao Oriental",
    address: "Quezon St., Brgy. Central, City of Mati",
    phone: "(087) 811 4331",
    email: "cho.mati@gmail.com",
    color: "#e40914",
  },
  
  // 9-STEP PATIENT NAVIGATION FLOW (Mati PCF-Central)
  // Official Patient Navigation System Flow
  // See constants/stations.js for full implementation
  patientFlow: {
    enabled: true,
    flowName: "9-Step Sequential Patient Journey",
    description: "Official Patient Navigation System Flow for CHO Mati",
    steps: [
      {
        step: 1,
        code: "REG",
        name: "Registration",
        icon: "📝",
        inputRequirements: ["Patient ID", "New Record"],
      },
      {
        step: 2,
        code: "VST",
        name: "Vital Signs Taking",
        icon: "🌡️",
        inputRequirements: ["BP", "Temp", "Weight", "HR"],
      },
      {
        step: 3,
        code: "TRG",
        name: "Interview / Triage",
        icon: "📋",
        inputRequirements: ["Severity Level", "Chief Complaint"],
      },
      {
        step: 4,
        code: "PCU",
        name: "Primary Care Unit",
        icon: "🏥",
        inputRequirements: ["Assessment Data"],
      },
      {
        step: 5,
        code: "ENC1",
        name: "Encoding (Primary)",
        icon: "💻",
        inputRequirements: ["EMR Data"],
      },
      {
        step: 6,
        code: "OPD",
        name: "Outpatient Department",
        icon: "🚪",
        inputRequirements: ["Queue Assignment"],
      },
      {
        step: 7,
        code: "CONS",
        name: "Consultation",
        icon: "👨‍⚕️",
        inputRequirements: ["Doctor's Notes", "Orders"],
      },
      {
        step: 8,
        code: "ENC2",
        name: "Encoding (Ancillary)",
        icon: "💊",
        inputRequirements: ["Order Data"],
      },
      {
        step: 9,
        code: "ANCL",
        name: "Ancillary Services",
        icon: "⚕️",
        inputRequirements: ["Service Selection"],
      },
    ],
    ancillaryServices: [
      { code: "LAB", name: "Laboratory", icon: "🧪" },
      { code: "NIP", name: "National Immunization Program", icon: "💉" },
      { code: "PHAR", name: "Pharmacy", icon: "💊" },
      { code: "XRAY", name: "X-ray Imaging", icon: "📸" },
      { code: "ECG", name: "Electrocardiogram", icon: "❤️" },
      { code: "ABTC", name: "Animal Bite Treatment Center", icon: "🦟" },
    ],
    bottleneckThresholdMinutes: 30,
    trackTimestamps: true,
  },
  
  // Service workflows - Legacy support (kept for backward compatibility)
  // Edit steps here as needed for your clinic
  // Best practice: Keep 2-3 visible steps per service for clarity
  // Triage should only be used for emergency services
  services: [
    { id: 1, name: "General Consultation", code: "GC", color: "#0dcaf0", steps: ["Registration", "Consultation", "Completion"] },
    { id: 2, name: "Vaccination", code: "VAX", color: "#198754", steps: ["Registration", "Vaccination", "Observation"] },
    { id: 3, name: "Emergency", code: "ER", color: "#dc3545", steps: ["Triage", "Assessment", "Treatment"] },
    { id: 4, name: "Immunization", code: "IMM", color: "#fd7e14", steps: ["Registration", "Immunization", "Observation"] },
    { id: 5, name: "Prenatal Check", code: "PC", color: "#6f42c1", steps: ["Registration", "Assessment", "Completion"] },
    { id: 6, name: "Pediatrics", code: "PED", color: "#20c997", steps: ["Registration", "Consultation", "Completion"] },
  ],
  
  ticketSettings: {
    paperSize: "58mm",
    printFont: "Courier New",
    autoprint: true,
    showPriority: true,
  },
  
  displaySettings: {
    announcementInterval: 7000,
    tipInterval: 5000,
    screenBrightness: 100,
    showHealthTips: true,
    showAnnouncements: true,
  },
  
  announcements: [
    { headline: "FREE DENGUE RAPID TEST", sub: "Available every Tuesday & Thursday, 8AM–12NN. No appointment needed.", tag: "SERVICE ALERT", color: "#dc3545" },
    { headline: "MALARIA PREVENTION DRIVE", sub: "Distribution of mosquito nets for barangay households. Bring valid ID.", tag: "COMMUNITY HEALTH", color: "#198754" },
    { headline: "RABIES AWARENESS MONTH", sub: "Free anti-rabies vaccination for dogs & cats. Bring your pet to the CHO compound.", tag: "ANIMAL BITE UNIT", color: "#fd7e14" },
    { headline: "MATERNAL HEALTH UPDATE", sub: "Prenatal check-up is FREE every Monday. Register at Window 5.", tag: "MATERNAL CARE", color: "#6f42c1" },
    { headline: "TUBERCULOSIS SCREENING", sub: "Free sputum test and chest X-ray referrals available. No waiting list.", tag: "TB DOTS", color: "#0d6efd" },
    { headline: "HEALTH REMINDER", sub: "Wash hands frequently. Stay hydrated. Wear a mask if you feel unwell.", tag: "WELLNESS TIP", color: "#20c997" },
    { headline: "PHILHEALTH ASSISTANCE", sub: "CHO now assists in PhilHealth registration. Bring 1 valid ID and 1x1 photo.", tag: "ADMIN", color: "#0dcaf0" },
  ],
  
  healthTips: [
    "💧 Drink at least 8 glasses of water daily.",
    "🤧 Cover your mouth and nose when coughing or sneezing.",
    "🧼 Regular handwashing prevents 80% of infections.",
    "🌿 Eat more fruits and vegetables every day.",
    "😴 Get 7–8 hours of sleep for a healthy immune system.",
    "🚶 30 minutes of daily walking lowers blood pressure.",
    "🩺 Schedule your annual physical examination today.",
    "🦟 Eliminate stagnant water to prevent dengue mosquito breeding.",
  ],

  campaignVideos: [
    { id: 1, title: "DOH Health Awareness", url: "", duration: 0, uploaded: false },
  ],

  videoSettings: {
    videoInterval: 15000, // How long each video displays (ms)
    autoplay: true,
    showVideos: true,
  },
};

// Load settings from localStorage or use defaults
export const loadSettings = () => {
  const saved = localStorage.getItem("cho_qms_settings");
  return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
};

// Save settings to localStorage (EXCLUDES video data to prevent quota exceeded)
export const saveSettings = (settings) => {
  // Create a copy without the large video URL data
  const settingsToSave = {
    organization: settings.organization,
    services: settings.services,
    ticketSettings: settings.ticketSettings,
    displaySettings: settings.displaySettings,
    announcements: settings.announcements,
    healthTips: settings.healthTips,
    // campaignVideos is NOT saved here - only metadata
    campaignVideos: (settings.campaignVideos || []).map(v => ({
      id: v.id,
      title: v.title,
      uploaded: v.uploaded,
      duration: v.duration,
      // Do NOT include v.url - it's a large base64 string
    })),
    videoSettings: settings.videoSettings,
  };
  
  try {
    localStorage.setItem("cho_qms_settings", JSON.stringify(settingsToSave));
  } catch (e) {
    if (e.name === "QuotaExceededError") {
      console.error("LocalStorage quota exceeded. Clearing old data and retrying...");
      // Try removing announcements and health tips which are not essential
      const minimalSettings = {
        organization: settings.organization,
        services: settings.services,
        ticketSettings: settings.ticketSettings,
        displaySettings: settings.displaySettings,
        announcements: [],
        healthTips: [],
        campaignVideos: settingsToSave.campaignVideos,
        videoSettings: settings.videoSettings,
      };
      localStorage.setItem("cho_qms_settings", JSON.stringify(minimalSettings));
    } else {
      throw e;
    }
  }
};

// Reset to defaults
export const resetSettings = () => {
  localStorage.removeItem("cho_qms_settings");
  return DEFAULT_SETTINGS;
};
