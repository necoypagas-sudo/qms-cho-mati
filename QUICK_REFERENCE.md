// QUICK_REFERENCE.md
# Patient Navigation System - Quick Reference Guide

## 🚀 Quick Start

### Import the Hook
```javascript
import { usePatientNavigationQMS } from "./hooks/usePatientNavigationQMS";

const qms = usePatientNavigationQMS();
```

### Import Constants
```javascript
import { STATIONS, ANCILLARY_SERVICES, getStationByStep } from "./constants/stations";
```

### Import Utilities
```javascript
import { determineAncillaryServices, handleABTCPrioritization, isABTCRequired } from "./utils/ancillaryServices";
import { formatTicketNumber, getStatusDisplay, formatWaitTime } from "./utils/patientFlowDisplay";
```

---

## 🔑 Main Hook Functions

### Register Patient
```javascript
const patient = qms.registerPatient({
  patientName: "Juan Dela Cruz",
  patientId: "CHO-2024-001",
  age: 45,
  gender: "M",
  contactNumber: "09173334456"
});
```

### Call Next Patient
```javascript
const patient = qms.callNextAtStep(2); // Step 2 = Vital Signs
```

### Complete a Step
```javascript
qms.completeStep(2, {
  bloodPressure: "120/80",
  temperature: 36.5,
  weight: 70,
  heartRate: 72
});
```

### Route to Ancillary Services
```javascript
qms.routeToAncillary(patientId, ["LAB", "PHAR", "XRAY"]);
```

### Handle ABTC Prioritization
```javascript
qms.handleABTCPrioritization(patientId);
```

### Get Patient Journey Summary
```javascript
const summary = qms.getPatientJourneySummary(patientId);
```

---

## 📊 Hook State

```javascript
qms.patients              // All patients array
qms.stepQueues           // Queues for each step (1-9)
qms.nowServingByStep     // Current patient at each step
qms.stats                // Analytics and statistics
```

---

## 🏥 The 9 Steps

| Step | Code | Name | Duration |
|:----:|:----:|:-----|:--------:|
| 1 | REG | Registration | 5-10 min |
| 2 | VST | Vital Signs | 5-10 min |
| 3 | TRG | Triage | 10-15 min |
| 4 | PCU | Primary Care Unit | 15-20 min |
| 5 | ENC1 | Encoding (Primary) | 10-15 min |
| 6 | OPD | Outpatient Dept | 5 min |
| 7 | CONS | Consultation | 20-30 min |
| 8 | ENC2 | Encoding (Ancillary) | 10-15 min |
| 9 | ANCL | Ancillary Services | Variable |

---

## 🔀 Ancillary Services

```javascript
const ANCILLARY_SERVICES = [
  { id: "LAB", name: "Laboratory", code: "LAB", icon: "🧪" },
  { id: "NIP", name: "National Immunization Program", code: "NIP", icon: "💉" },
  { id: "PHAR", name: "Pharmacy", code: "PHAR", icon: "💊" },
  { id: "XRAY", name: "X-ray Imaging", code: "XRAY", icon: "📸" },
  { id: "ECG", name: "Electrocardiogram", code: "ECG", icon: "❤️" },
  { id: "ABTC", name: "Animal Bite Treatment", code: "ABTC", icon: "🦟" },
];
```

---

## 📋 Patient Status Values

```javascript
PATIENT_STATUS.WAITING              // Waiting in queue
PATIENT_STATUS.IN_STATION           // Currently being served
PATIENT_STATUS.COMPLETED_STATION    // Completed this step
PATIENT_STATUS.ROUTED_TO_NEXT       // Moving to next step
PATIENT_STATUS.IN_ANCILLARY         // In ancillary services
PATIENT_STATUS.COMPLETED_JOURNEY    // All steps completed
```

---

## 💡 Common Patterns

### Pattern 1: Complete Step with Data
```javascript
const stepData = { /* step-specific data */ };
qms.completeStep(currentStep, stepData);
// System automatically:
// - Records timestamps
// - Calculates wait time
// - Updates stats
// - Moves to next step
```

### Pattern 2: Determine & Route to Ancillary
```javascript
const services = determineAncillaryServices(
  consultationData,
  ordersData
);
const routing = handleABTCPrioritization(services);
qms.routeToAncillary(patientId, routing.services);
```

### Pattern 3: Display Patient Info
```javascript
const { ticketDisplay, statusDisplay, progressBar } = formatPatientCard(patient);

return (
  <div>
    <h2>{ticketDisplay.code}{ticketDisplay.number}</h2>
    <p>{statusDisplay.text} {statusDisplay.icon}</p>
    <div>{progressBar}</div>
  </div>
);
```

### Pattern 4: Monitor Bottlenecks
```javascript
Object.entries(qms.stats.stepStats).forEach(([step, stats]) => {
  if (stats.bottleneck) {
    alert(`Bottleneck at ${stats.stationName}`);
  }
});
```

---

## 📊 Display Utilities

### Ticket Display
```javascript
const { code, number } = formatTicketNumber("REG001"); // { "REG", "001" }
```

### Status Display
```javascript
const display = getStatusDisplay(PATIENT_STATUS.IN_STATION);
// { text: "In Service", color: "#17a2b8", icon: "🔄", bg: "#d1ecf1" }
```

### Wait Time Formatting
```javascript
const formatted = formatWaitTime(300000); // "5m 0s"
const minutes = getWaitTimeInMinutes(300000); // 5
```

### Progress Display
```javascript
const percentage = getProgressPercentage(5); // 55.5%
const bar = createProgressBar(5);            // "█████░░░░"
const text = getProgressText([1,2,3,4,5]);   // "5 of 9 steps completed"
```

### Bottleneck Level
```javascript
const level = getBottleneckLevel(1800000); // 30 minutes
// { level: "warning", icon: "⚠️", color: "#ffc107", text: "Warning" }
```

---

## 🎯 ABTC Prioritization

### Detection (in Consultation Step)
```javascript
if (isABTCRequired(consultationData)) {
  patient.requiresABTC = true;
}
```

### Prioritization (before Step 9)
```javascript
const services = ["LAB", "PHAR", "ABTC"];
const { isABTCPriority, services: prioritized } = handleABTCPrioritization(services);
// Result: isABTCPriority = true, services = ["ABTC", "LAB", "PHAR"]
```

---

## 📈 Get Queue Information

### Get Patients at Step
```javascript
const patientsAtStep2 = qms.getPatientsAtStep(2);
```

### Get Step Wait Time
```javascript
const avgWait = qms.getStepWaitTime(2); // in minutes
```

### Get Queue Summary
```javascript
const summary = getQueueSummary(queue, nowServing);
// { total: 10, waiting: 9, serving: 1, isEmpty: false }
```

---

## 🔍 Getting Station Information

### Get by Step Number
```javascript
const station = getStationByStep(2);
// { step: 2, id: "VST", name: "Vital Signs Taking", ... }
```

### Get by Station ID
```javascript
const station = getStationById("VST");
```

### Get by Station Code
```javascript
const station = getStationByCode("REG");
```

### Get Next Step
```javascript
const nextStation = getNextStep(2); // Returns Step 3
```

### Get Previous Step
```javascript
const prevStation = getPreviousStep(2); // Returns Step 1
```

---

## 📝 Timeline Visualization

```javascript
const timeline = getStepTimeline(4, [1, 2, 3]);
// Returns array of step objects with status: "completed" | "current" | "passed" | "pending"

timeline.forEach(step => {
  console.log(`${step.icon} ${step.name} - ${step.status}`);
});
// 📝 Registration - completed
// 🌡️ Vital Signs Taking - completed
// 📋 Interview / Triage - completed
// 🏥 Primary Care Unit - current
// 💻 Encoding (Primary) - pending
// ...
```

---

## 🔗 File Locations

| Item | Location |
|------|----------|
| Hook | `src/hooks/usePatientNavigationQMS.js` |
| Constants | `src/constants/stations.js` |
| Ancillary Utils | `src/utils/ancillaryServices.js` |
| Display Utils | `src/utils/patientFlowDisplay.js` |
| Config | `src/config/settings.js` |
| Full Docs | `src/hooks/IMPLEMENTATION_GUIDE.md` |
| Flow Spec | `STATION_FLOW_IMPLEMENTATION.md` |

---

## 📞 Support

For issues or questions, refer to:
1. [IMPLEMENTATION_GUIDE.md](src/hooks/IMPLEMENTATION_GUIDE.md) - Comprehensive guide
2. [STATION_FLOW_IMPLEMENTATION.md](STATION_FLOW_IMPLEMENTATION.md) - Official specification
3. [README.md](README.md) - System overview
