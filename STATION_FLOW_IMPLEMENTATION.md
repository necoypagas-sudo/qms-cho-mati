# QMS Station-Based Flow Implementation Guide

## Overview

The CHO Mati QMS has been redesigned to implement a **6-Station Sequential Patient Flow** model. This document explains the new architecture and how to integrate it into your existing application.

---

## 🏗️ New Architecture

### Previous Model (Parallel Services)
```
Patient chooses → [Service Queue]
                 ├─ GC (General Consultation)
                 ├─ VAX (Vaccination)
                 ├─ ER (Emergency)
                 └─ etc.
```

### New Model (Sequential Stations)
```
Patient Registration (Station 1)
    ↓
Vital Signs (Station 2)
    ↓
Interview (Station 3)
    ↓
Encoding & Triage (Station 4)
    ↓
Physician Consultation (Station 5)
    ↓
Pharmacy (Station 6)
```

---

## 📁 New Files Created

### Constants
- **`src/constants/stations.js`** - Defines all 6 stations, triage levels, and helper functions

### Hooks
- **`src/hooks/useStationQMS.js`** - React hook for managing station-based patient flow

### Components
- **`src/components/stations/Station1_NumberIssuance.jsx`** - Registration & ticket issuance (Station 1)
- **`src/components/stations/StationManager.jsx`** - Main orchestrator component

### Styles
- **`src/components/stations/Station1.css`** - Station 1 styling
- **`src/components/styles/StationManager.css`** - StationManager styling

---

## 🚀 Quick Start Integration

### Step 1: Import the Hook

```javascript
// In your main App.js or Station Manager
import { useStationQMS } from "./hooks/useStationQMS";
import StationManager from "./components/stations/StationManager";

function App() {
  const qmsHook = useStationQMS();
  
  return <StationManager qmsHook={qmsHook} />;
}
```

### Step 2: Test Registration (Station 1)

The `StationManager` component provides:
- **Station 1 Registration Form** - Patient fills in details
- **Ticket Generation** - Automatic ticket numbering (REG001, REG002, etc.)
- **Queue Status Footer** - Shows waiting patients at each station in real-time

---

## 📊 Data Flow

### Patient Journey Object

Each patient has this structure:

```javascript
{
  id: Math.random(),                    // Unique patient ID
  ticketNumber: "REG001",                // Ticket number
  fullName: "Juan Dela Cruz",
  age: 30,
  gender: "Male",
  contactNumber: "09123456789",
  address: "Brgy. Central",
  isPriority: false,
  priorityReason: "",
  
  // Journey Tracking
  registeredAt: Date,                    // When registered
  status: "in_station",                  // Current status
  currentStation: 2,                     // At Station 2 (Vital Signs)
  completedStations: [1],                // Completed Station 1
  
  // Station Journey Details
  stationJourney: {
    1: {
      enteredAt: Date,
      completedAt: Date,
      waitTime: 5,                       // minutes
      stationData: { /* registration data */ }
    },
    2: {
      enteredAt: Date,
      completedAt: null,                // Still in progress
      waitTime: 3,
      stationData: { /* vital signs data */ }
    }
  },
  
  // Clinical Data (filled at each station)
  vitals: null,                          // From Station 2
  triageLevel: null,                     // From Station 4
  diagnosis: null,                       // From Station 5
  medicines: null,                       // From Station 6
}
```

---

## 🔧 Hook API Reference

### `useStationQMS()`

Returns an object with:

#### State Properties
```javascript
const {
  patients,              // Array of all registered patients
  stationQueues,         // {stationId: [patients...]}
  nowServingByStation,   // {stationId: patient}
  stats,                 // {totalRegistered, totalCompleted, stationStats}
  
  // Functions (see below)
  registerPatient,
  callNextAtStation,
  completeStationAndAdvance,
  getPatient,
  getStationPatients,
  getQueueStatus,
  resetAll,
} = useStationQMS();
```

#### Key Functions

**`registerPatient(patientData)`**
- Called when patient completes Station 1 registration
- Returns: registered patient object with ticket number
- Automatically adds patient to Station 2 queue

```javascript
const patient = registerPatient({
  firstName: "Juan",
  lastName: "Dela Cruz",
  age: 30,
  gender: "Male",
  contactNumber: "09123456789",
  address: "Brgy. Central",
  isPriority: false,
  priorityReason: "",
});
// Returns: { ticketNumber: "REG001", fullName: "Juan Dela Cruz", ... }
```

**`callNextAtStation(stationId)`**
- Call next patient at a specific station
- Returns: patient object with station entry time recorded

```javascript
const patient = callNextAtStation(2); // Call next at Vital Signs
```

**`completeStationAndAdvance(stationId, stationData)`**
- Mark patient done at current station
- Automatically route to next station
- Track wait time and station-specific data

```javascript
const nextStation = completeStationAndAdvance(2, {
  systolicBP: 120,
  diastolicBP: 80,
  temperature: 37.2,
  height: 170,
  weight: 70,
});
// Returns: next station object, or "completed" if journey done
```

**`getQueueStatus()`**
- Get real-time queue status for all stations

```javascript
const status = getQueueStatus();
// Returns: {
//   1: { station: "Number Issuance", waiting: 0, nowServing: 1, ... },
//   2: { station: "Vital Signs", waiting: 3, nowServing: 1, ... },
//   ...
// }
```

---

## 🎨 Component Usage

### Station 1: Number Issuance

```javascript
import Station1_NumberIssuance from "./components/stations/Station1_NumberIssuance";

<Station1_NumberIssuance
  onPatientRegistered={(patientData) => {
    // Handle registration - usually calls registerPatient() from hook
    const patient = qmsHook.registerPatient(patientData);
    return patient;
  }}
  isProcessing={false}
/>
```

---

## 📋 Next Steps to Implement

The following stations need to be created following the same pattern as Station 1:

### Station 2: Vital Signs 🌡️
- Capture: BP (systolic/diastolic), Temperature, Height, Weight
- Auto-advance to Station 3 when complete
- Save data to patient.vitals

### Station 3: Interview 📋
- Capture: Health history, Chief complaint, Current symptoms
- Auto-advance to Station 4
- Save data to patient interview object

### Station 4: Encoding & Triage 💻
- Encode all captured data
- Triage categorization (Routine/Urgent/Emergency)
- Auto-advance to Station 5
- Save triage level to patient.triageLevel

### Station 5: Physician Consultation 👨‍⚕️
- Doctor examination
- Diagnosis and treatment plan
- Auto-advance to Station 6
- Save diagnosis to patient.diagnosis

### Station 6: Pharmacy 💊
- Prescription review
- Medicine dispensing
- Patient counseling
- Mark journey as complete

---

## 📺 Admin/Display Views

### Admin Panel Features Needed
- View all station queues
- Call next patient at any station
- Mark patient as done and advance to next station
- View patient details during consultation
- Generate reports per station

### Display Screen Features Needed
- Show current patient ticket at each station
- Show queue length for each station
- Animation/transitions for ticket calls
- Health announcements between updates

---

## 🔄 Patient Flow Example

### Scenario: Juan Arrives at CHO

1. **Station 1 (08:00)** - Juan registers at kiosk
   - Enters details: Name, Age, Gender, Contact
   - Gets ticket: **REG001**
   - Automatically queued for Station 2
   
2. **Station 2 (08:05)** - Vital Signs
   - Wait time: 5 minutes
   - Nurse calls REG001
   - Records: BP 120/80, Temp 37.2°C, Height 170cm, Weight 70kg
   - Advances to Station 3
   
3. **Station 3 (08:10)** - Interview
   - Wait time: 2 minutes
   - Clerk interviews patient
   - Records: Complains of cough for 2 days, headache
   - Advances to Station 4
   
4. **Station 4 (08:15)** - Encoding & Triage
   - Wait time: 1 minute
   - Data entry operator encodes info
   - Triaged as: **URGENT** (respiratory symptoms)
   - Advances to Station 5
   
5. **Station 5 (08:18)** - Physician Consultation
   - Wait time: 8 minutes (higher priority)
   - Doctor examines patient
   - Diagnosis: **Acute Bronchitis**
   - Treatment: Antibiotics + Cough syrup
   - Advances to Station 6
   
6. **Station 6 (08:45)** - Pharmacy
   - Wait time: 10 minutes
   - Pharmacist dispenses medicines
   - Provides counseling
   - **Journey Complete** 🎉
   
**Total Time: 45 minutes**

---

## 🧪 Testing Checklist

- [ ] Station 1 registration form works
- [ ] Ticket numbers generate correctly (REG001, REG002, etc.)
- [ ] Patient appears in Station 2 queue after registration
- [ ] Queue status footer updates in real-time
- [ ] Patient data is saved correctly
- [ ] Wait times are calculated accurately
- [ ] Stations can be navigated (admin panel)

---

## 📞 Support & Customization

### Modify Station Steps
Edit `src/constants/stations.js`:
```javascript
export const STATIONS = [
  {
    id: 1,
    name: "Number Issuance",
    steps: ["Registration", "Ticket Print", "Queue Assignment"], // Modify here
    // ...
  },
];
```

### Add Custom Station Data
In `completeStationAndAdvance()`:
```javascript
completeStationAndAdvance(2, {
  customField1: "value",
  customField2: "value",
});
```

### Change Ticket Format
In `registerPatient()` function:
```javascript
ticketNumber: `${station1.code}${String(ticketNumber).padStart(3, "0")}`,
// Change to: `${ticketNumber}` for simple numbers
```

---

**Created:** April 21, 2026  
**Status:** Station 1 Implemented, Stations 2-6 Ready for Development
