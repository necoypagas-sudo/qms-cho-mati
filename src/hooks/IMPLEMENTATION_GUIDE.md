// src/hooks/usePatientNavigationQMS.implementation.md
# Patient Navigation System QMS - Implementation Guide

## Overview
This implementation provides a complete 9-step sequential patient navigation system for the Mati CHO (City Health Office) with state management, timestamp tracking, and ancillary services routing.

## Architecture

### Core Components

#### 1. **Constants** (`src/constants/stations.js`)
Defines the 9-step workflow and ancillary services:
- STATIONS: 9-step sequential flow (REG → VST → TRG → PCU → ENC1 → OPD → CONS → ENC2 → ANCL)
- ANCILLARY_SERVICES: 6 branching services (LAB, NIP, PHAR, XRAY, ECG, ABTC)
- PATIENT_STATUS: Patient state tracking
- Helper functions: getStationByStep(), getNextStep(), getAncillaryServiceById(), etc.

#### 2. **State Management Hook** (`src/hooks/usePatientNavigationQMS.js`)
Main React hook managing the entire patient journey:
- `patients[]`: Registry of all patients
- `stepQueues{}`: Queues for each step (1-9)
- `nowServingByStep{}`: Currently serving patient at each step
- `stats{}`: Analytics and bottleneck detection

#### 3. **Utilities** (`src/utils/ancillaryServices.js`)
Helper functions for ancillary services routing:
- `determineAncillaryServices()`: Decide which services based on orders
- `handleABTCPrioritization()`: Prioritize ABTC when needed
- `isABTCRequired()`: Check if ABTC is needed
- `calculateAncillaryProgress()`: Track completion progress

#### 4. **Configuration** (`src/config/settings.js`)
Global settings including:
- `patientFlow`: 9-step configuration
- `ancillaryServices`: Service definitions
- `bottleneckThresholdMinutes`: 30 minutes (for bottleneck detection)

## Data Structure

### Patient Object
```javascript
{
  id: number,                           // Unique identifier
  ticketNumber: "REG001",               // Formatted ticket
  patientName: string,
  patientId: string,                    // Medical record number
  registeredAt: Date,
  status: PATIENT_STATUS,               // Current status
  currentStep: 1-9,                     // Current step in journey
  completedSteps: [1, 2, 3],           // Steps already completed
  stepJourney: {
    1: { timestamp_in, timestamp_out, waitTime },
    2: { timestamp_in, timestamp_out, waitTime },
    // ... for each step
  },
  
  // Step-specific data
  vitals: { bp, temp, weight, hr },     // Step 2
  triageData: { severity, complaint },  // Step 3
  assessment: {},                       // Step 4
  primaryEncoding: {},                  // Step 5
  consultation: { diagnosis, orders },  // Step 7
  ancillaryOrders: {},                  // Step 8
  
  // Ancillary routing
  routedToAncillary: false,
  ancillaryServices: ["LAB", "PHAR"],  // Step 9
  requiresABTC: false,
  completedAt: Date,                    // When journey completed
}
```

### Statistics Object
```javascript
{
  totalRegistered: number,
  totalCompleted: number,
  averageJourneyTime: number,           // in milliseconds
  stepStats: {
    1: { 
      stationName: "Registration",
      stationCode: "REG",
      served: number,
      totalWaitTime: number,
      averageWaitTime: number,
      maxWaitTime: number,
      bottleneck: boolean              // true if > 30 min
    },
    // ... for each step
  }
}
```

## Usage Examples

### 1. Register a Patient
```javascript
const { registerPatient, callNextAtStep, completeStep } = usePatientNavigationQMS();

// Register new patient
const patient = registerPatient({
  patientName: "Juan Dela Cruz",
  patientId: "CHO-2024-001",
  age: 45,
  gender: "M",
  contactNumber: "09173334456"
});

console.log(patient.ticketNumber); // "REG001"
```

### 2. Call Next Patient at Step
```javascript
// Call next patient at Step 2 (Vital Signs)
const nextPatient = callNextAtStep(2);
// System records entry timestamp automatically
```

### 3. Complete a Step with Data
```javascript
// Complete Step 2 with vital signs data
const vitalsData = {
  bloodPressure: "120/80",
  temperature: 36.5,
  weight: 70,
  heartRate: 72
};

completeStep(2, vitalsData);
// System:
// - Records exit timestamp
// - Calculates wait time
// - Updates statistics
// - Routes patient to Step 3
// - Detects bottlenecks if avg wait > 30 min
```

### 4. Handle Consultation with ABTC Check
```javascript
// Complete Step 7 (Consultation)
const consultationData = {
  diagnosis: "Animal bite - dog bite on left arm",
  orders: ["Anti-rabies vaccine", "Antibiotic"],
  requiresABTC: true  // Trigger ABTC flag
};

completeStep(7, consultationData);
// System flags patient for ABTC prioritization
```

### 5. Route to Ancillary Services
```javascript
import { determineAncillaryServices, handleABTCPrioritization } from "../utils/ancillaryServices";

// After Step 8 (Encoding Ancillary), determine services
const consultationData = { /* from Step 7 */ };
const ordersData = {
  labTests: ["CBC", "Urinalysis"],
  medications: ["Amoxicillin"],
  imagingStudies: ["XRAY"],
  antiRabiesRequired: true
};

let services = determineAncillaryServices(consultationData, ordersData);
// Result: ["LAB", "PHAR", "XRAY", "ABTC"]

// Handle ABTC prioritization
const routing = handleABTCPrioritization(services);
if (routing.isABTCPriority) {
  // ABTC is first in queue
  routeToAncillary(patient.id, routing.services);
}
```

### 6. Get Wait Times
```javascript
const { stats, getStepWaitTime } = usePatientNavigationQMS();

// Get average wait time for Step 2 (in minutes)
const waitMinutes = getStepWaitTime(2);
console.log(`Average wait at Vital Signs: ${waitMinutes} minutes`);

// Check for bottlenecks
Object.keys(stats.stepStats).forEach(step => {
  const stepStat = stats.stepStats[step];
  if (stepStat.bottleneck) {
    console.log(`⚠️ Bottleneck at Step ${step}: ${stepStat.averageWaitTime / 60000} min avg`);
  }
});
```

### 7. Get Patient Journey Summary
```javascript
const { getPatientJourneySummary } = usePatientNavigationQMS();

const summary = getPatientJourneySummary(patient.id);
console.log(summary);
// Output:
// {
//   ticketNumber: "REG001",
//   currentStep: 4,
//   currentStationName: "Primary Care Unit",
//   completedSteps: [
//     { step: 1, name: "Registration", ... },
//     { step: 2, name: "Vital Signs Taking", ... },
//     { step: 3, name: "Interview / Triage", ... }
//   ],
//   totalJourneyTime: 1200000,  // ms
//   status: "in_station"
// }
```

## Integration with React Components

### Example: StationOperatorView.jsx
```javascript
import { usePatientNavigationQMS } from "../hooks/usePatientNavigationQMS";
import { getStationByStep } from "../constants/stations";

function StationOperatorView({ currentStep }) {
  const qms = usePatientNavigationQMS();
  const station = getStationByStep(currentStep);
  
  const handleCallNext = () => {
    const patient = qms.callNextAtStep(currentStep);
    // Update UI with patient info
  };
  
  const handleComplete = (stepData) => {
    qms.completeStep(currentStep, stepData);
    // Automatically routes to next step
  };
  
  return (
    <div>
      <h2>{station.name} ({station.code})</h2>
      <div>Queue: {qms.stepQueues[currentStep].length} waiting</div>
      <div>Now Serving: {qms.nowServingByStep[currentStep]?.ticketNumber}</div>
    </div>
  );
}
```

## Timestamp Tracking

Every patient maintains detailed timestamps for bottleneck analysis:

```
Step 1 (REG):     entered 8:00:00 → exited 8:05:30 (wait: 5.5 min)
Step 2 (VST):     entered 8:05:30 → exited 8:12:15 (wait: 6.75 min)
Step 3 (TRG):     entered 8:12:15 → exited 8:22:45 (wait: 10.5 min) ⚠️
Step 4 (PCU):     entered 8:22:45 → exited 8:38:20 (wait: 15.58 min)
...
Total Journey:    8:00:00 - 10:45:30 (2h 45m 30s)
```

Bottlenecks (avg wait > 30 min) are flagged in `stats.stepStats[step].bottleneck`

## ABTC (Animal Bite Treatment Center) Prioritization

### Detection
ABTC is flagged when:
- Doctor marks `requiresABTC = true` in consultation
- Diagnosis mentions "animal bite" or "rabies"
- Chief complaint mentions "bite" or "rabies"

### Prioritization
1. During Step 7 consultation, ABTC flag is set
2. At Step 9, ABTC is moved to front of ancillary services queue
3. Patient routed to ABTC first, then other services

```javascript
// Example flow
patient.consultation = { requiresABTC: true };
completeStep(7, patient.consultation);
// System calls handleABTCPrioritization()
// Result: ["ABTC", "LAB", "PHAR"] instead of ["LAB", "PHAR", "ABTC"]
```

## Key Features Implemented

✅ **9-Step Sequential Flow**: REG → VST → TRG → PCU → ENC1 → OPD → CONS → ENC2 → ANCL
✅ **Timestamp Tracking**: Entry/exit times for each step
✅ **Wait Time Analytics**: Average, max, and bottleneck detection
✅ **Ancillary Services Routing**: Dynamic selection of LAB, NIP, PHAR, XRAY, ECG, ABTC
✅ **ABTC Prioritization**: Automatic flagging and queue prioritization
✅ **State Persistence**: Full patient journey history
✅ **Bottleneck Detection**: Alerts when avg wait > 30 minutes

## Future Enhancements

- [ ] Database persistence (IndexedDB / Server)
- [ ] Role-based access control (Admin, Operator, Supervisor)
- [ ] Real-time notifications when bottleneck detected
- [ ] Patient reassignment between stations
- [ ] Multi-language support
- [ ] Mobile operator interface
- [ ] Analytics dashboard with charts
