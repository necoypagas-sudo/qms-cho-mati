// src/config/settings.js
// Global QMS Settings - Editable Configuration

export const DEFAULT_SETTINGS = {
  organization: {
    name: "CITY HEALTH OFFICE",
    location: "Mati, Davao Oriental",
    address: "Quezon St., Brgy. Central, City of Mati",
    phone: "(087) 811 4331",
    email: "cho.mati@gmail.com",
    color: "#e40914",
  },
  
  services: [
    { id: 1, name: "General Consultation", code: "GC", color: "#0dcaf0", steps: ["Triage", "Consultation", "EMR Encoding"] },
    { id: 2, name: "Vaccination", code: "VAX", color: "#198754", steps: ["Screening", "Vaccination", "Monitoring"] },
    { id: 3, name: "Emergency", code: "ER", color: "#dc3545", steps: ["Triage", "Assessment", "Treatment"] },
    { id: 4, name: "Immunization", code: "IMM", color: "#fd7e14", steps: ["Screening", "Immunization", "Observation"] },
    { id: 5, name: "Prenatal Check", code: "PC", color: "#6f42c1", steps: ["Registration", "Vitals", "Consultation", "Labs"] },
    { id: 6, name: "Pediatrics", code: "PED", color: "#20c997", steps: ["Screening", "Consultation", "Follow-up"] },
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

// Save settings to localStorage
export const saveSettings = (settings) => {
  localStorage.setItem("cho_qms_settings", JSON.stringify(settings));
};

// Reset to defaults
export const resetSettings = () => {
  localStorage.removeItem("cho_qms_settings");
  return DEFAULT_SETTINGS;
};
