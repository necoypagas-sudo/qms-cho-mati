// src/constants/stations.js
// 6-Station Sequential Patient Flow for CHO Mati

export const STATIONS = [
  {
    id: 1,
    name: "Number Issuance",
    code: "REG",
    color: "#0dcaf0",
    icon: "🔢",
    description: "Patient registration & ticket issuance",
    steps: ["Registration", "Ticket Print", "Queue Assignment"],
  },
  {
    id: 2,
    name: "Vital Signs",
    code: "VS",
    color: "#198754",
    icon: "🌡️",
    description: "Blood pressure, temperature, height, weight",
    steps: ["Check In", "BP Reading", "Temperature", "Height/Weight", "Complete"],
  },
  {
    id: 3,
    name: "Interview",
    code: "INT",
    color: "#ffc107",
    icon: "📋",
    description: "Initial screening & history taking",
    steps: ["Check In", "Health History", "Chief Complaint", "Current Symptoms", "Complete"],
  },
  {
    id: 4,
    name: "Encoding & Triage",
    code: "ENC",
    color: "#fd7e14",
    icon: "💻",
    description: "Data entry & triage categorization",
    steps: ["Check In", "Data Entry", "Triage Assessment", "Priority Assignment", "Complete"],
  },
  {
    id: 5,
    name: "Physician Consultation",
    code: "CONS",
    color: "#dc3545",
    icon: "👨‍⚕️",
    description: "Doctor examination & diagnosis",
    steps: ["Check In", "Doctor Exam", "Diagnosis", "Treatment Plan", "Complete"],
  },
  {
    id: 6,
    name: "Pharmacy",
    code: "PHARM",
    color: "#20c997",
    icon: "💊",
    description: "Medicine dispensing & counseling",
    steps: ["Check In", "Prescription Review", "Medicine Dispensing", "Counseling", "Complete"],
  },
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
};

export const getStationById = (stationId) => {
  return STATIONS.find((s) => s.id === stationId);
};

export const getStationByCode = (code) => {
  return STATIONS.find((s) => s.code === code);
};

export const getNextStation = (currentStationId) => {
  const currentIndex = STATIONS.findIndex((s) => s.id === currentStationId);
  return currentIndex < STATIONS.length - 1 ? STATIONS[currentIndex + 1] : null;
};

export const getPreviousStation = (currentStationId) => {
  const currentIndex = STATIONS.findIndex((s) => s.id === currentStationId);
  return currentIndex > 0 ? STATIONS[currentIndex - 1] : null;
};
