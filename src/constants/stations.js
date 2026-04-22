// src/constants/stations.js
// 9-Step Sequential Patient Flow (Mati PCF-Central)
// This implements the official Patient Navigation System Flow

// MAIN 9-STEP STATIONS
export const STATIONS = [
  {
    step: 1,
    id: "REG",
    name: "Registration",
    code: "REG",
    color: "#0dcaf0",
    icon: "📝",
    description: "Patient registration & new record creation",
    inputRequirements: ["Patient ID", "New Record"],
    timeEstimate: "5-10 minutes",
  },
  {
    step: 2,
    id: "VST",
    name: "Vital Signs Taking",
    code: "VST",
    color: "#198754",
    icon: "🌡️",
    description: "Blood pressure, temperature, weight, heart rate",
    inputRequirements: ["BP", "Temp", "Weight", "HR"],
    timeEstimate: "5-10 minutes",
  },
  {
    step: 3,
    id: "TRG",
    name: "Interview / Triage",
    code: "TRG",
    color: "#ffc107",
    icon: "📋",
    description: "Initial screening & severity assessment",
    inputRequirements: ["Severity Level", "Chief Complaint"],
    timeEstimate: "10-15 minutes",
  },
  {
    step: 4,
    id: "PCU",
    name: "Primary Care Unit",
    code: "PCU",
    color: "#6f42c1",
    icon: "🏥",
    description: "Initial assessment & preliminary diagnosis",
    inputRequirements: ["Assessment Data"],
    timeEstimate: "15-20 minutes",
  },
  {
    step: 5,
    id: "ENC1",
    name: "Encoding (Primary)",
    code: "ENC1",
    color: "#fd7e14",
    icon: "💻",
    description: "EMR data entry & documentation",
    inputRequirements: ["EMR Data"],
    timeEstimate: "10-15 minutes",
  },
  {
    step: 6,
    id: "OPD",
    name: "Outpatient Department",
    code: "OPD",
    color: "#17a2b8",
    icon: "🚪",
    description: "Queue placement & routing decision",
    inputRequirements: ["Queue Assignment"],
    timeEstimate: "5 minutes",
  },
  {
    step: 7,
    id: "CONS",
    name: "Consultation",
    code: "CONS",
    color: "#dc3545",
    icon: "👨‍⚕️",
    description: "Doctor's examination, diagnosis & orders",
    inputRequirements: ["Doctor's Notes", "Orders"],
    timeEstimate: "20-30 minutes",
  },
  {
    step: 8,
    id: "ENC2",
    name: "Encoding (Ancillary)",
    code: "ENC2",
    color: "#20c997",
    icon: "💊",
    description: "Order entry for labs, meds & ancillary services",
    inputRequirements: ["Order Data"],
    timeEstimate: "10-15 minutes",
  },
  {
    step: 9,
    id: "ANCL",
    name: "Ancillary Services",
    code: "ANCL",
    color: "#6c757d",
    icon: "⚕️",
    description: "Dynamic routing to specialized services",
    inputRequirements: ["Service Selection"],
    timeEstimate: "Variable",
  },
];

// ANCILLARY SERVICES (Step 9 Branching)
export const ANCILLARY_SERVICES = [
  { id: "LAB", name: "Laboratory", code: "LAB", color: "#0dcaf0", icon: "🧪" },
  { id: "NIP", name: "National Immunization Program", code: "NIP", color: "#198754", icon: "💉" },
  { id: "PHAR", name: "Pharmacy", code: "PHAR", color: "#20c997", icon: "💊" },
  { id: "XRAY", name: "X-ray Imaging", code: "XRAY", color: "#6f42c1", icon: "📸" },
  { id: "ECG", name: "Electrocardiogram", code: "ECG", color: "#fd7e14", icon: "❤️" },
  { id: "ABTC", name: "Animal Bite Treatment Center (Anti-Rabies)", code: "ABTC", color: "#dc3545", icon: "🦟" },
];

// Triage Priority Levels (used in Station 4)
export const TRIAGE_LEVELS = [
  { id: 1, label: "Routine", color: "#20c997", priority: 3, wait: "1-2 hours" },
  { id: 2, label: "Urgent", color: "#ffc107", priority: 2, wait: "15-30 min" },
  { id: 3, label: "Emergency", color: "#dc3545", priority: 1, wait: "Immediate" },
];

// Patient Status Throughout Journey
export const PATIENT_STATUS = {
  WAITING: "waiting",
  IN_STATION: "in_station",
  COMPLETED_STATION: "completed_station",
  ROUTED_TO_NEXT: "routed_to_next",
  COMPLETED_JOURNEY: "completed_journey",
  IN_ANCILLARY: "in_ancillary",
};

// Severity Levels for Triage (Step 3)
export const SEVERITY_LEVELS = [
  { id: 1, label: "Routine", color: "#20c997", priority: 3, wait: "1-2 hours" },
  { id: 2, label: "Urgent", color: "#ffc107", priority: 2, wait: "15-30 min" },
  { id: 3, label: "Emergency", color: "#dc3545", priority: 1, wait: "Immediate" },
];

// Helper Functions
export const getStationByStep = (step) => {
  return STATIONS.find((s) => s.step === step);
};

export const getStationById = (stationId) => {
  return STATIONS.find((s) => s.id === stationId);
};

export const getStationByCode = (code) => {
  return STATIONS.find((s) => s.code === code);
};

export const getNextStep = (currentStep) => {
  if (currentStep >= 9) return null;
  return getStationByStep(currentStep + 1);
};

export const getPreviousStep = (currentStep) => {
  if (currentStep <= 1) return null;
  return getStationByStep(currentStep - 1);
};

export const getAncillaryServiceById = (serviceId) => {
  return ANCILLARY_SERVICES.find((s) => s.id === serviceId);
};
