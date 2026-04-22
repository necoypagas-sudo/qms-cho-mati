# CHO QMS - Queue Management System

## 🏥 About
CHO QMS is a modern, functional, and user-friendly Queue Management System for City Health Offices. It includes:

- **🎫 Kiosk View** - Patient service window where customers can take queue numbers
- **📺 Display View** - Large screen display showing now serving information and health announcements
- **⚙️ Admin Panel** - Management interface for queue control and service configuration
- **⚙️ Settings** - Editable system configuration including organization details, services, display settings, and more

## Features

✅ **Ticket Printing** - Thermal printer compatible tickets (58mm)  
✅ **Health Announcements** - Rotating health news and tips for display screen  
✅ **Voice Announcement** - Text-to-speech queue number announcements  
✅ **Service Management** - Add, edit, delete services  
✅ **Queue Management** - Call next, mark done, clear queue  
✅ **Priority Queue** - Priority tickets for seniors/PWD/pregnant patients  
✅ **Statistics Dashboard** - Track served patients and average wait times  
✅ **Estimated Wait Times** - Show expected wait time on kiosk  
✅ **Notification Sounds** - Audio alerts when calling next patient  
✅ **Customizable Settings** - Edit organization info, colors, display intervals, etc.  
✅ **Responsive Design** - Works on desktop, tablet, and large displays  
✅ **Modern UI** - Bootstrap 5 + Lucide React icons  

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm start
```

The app will open at **http://localhost:3000**

## Views

### 🎫 Kiosk View
- Display available services
- Show current queue numbers and wait times
- Issue new tickets with patient information
- Auto-print or manual print options

### 📺 Display View
- Show "Now Serving" information for each service
- Rotate health announcements
- Display health tips
- Real-time clock and date

### ⚙️ Admin Panel

**Queue Management Tab:**
- View queues for each service
- Call next patient
- Mark patient as done
- Clear queue

**Services Management Tab:**
- Add new services
- Edit service details (name, code, color)
- Delete services

## ⚙️ Settings

Click the **Settings** button in the top navigation to customize:

- **Organization Settings**
  - Organization name, location, address
  - Contact information
  - Primary color theme

- **Services**
  - Create/edit/delete services
  - Customize service codes and colors

- **Display Settings**
  - Announcement rotation interval
  - Health tip rotation interval
  - Screen brightness
  - Toggle announcements and tips

- **Ticket Settings**
  - Paper size (58mm, 80mm, A4)
  - Print font selection
  - Auto-print on issue
  - Show priority badge

## 🎨 Customization

All settings are saved to browser's localStorage, so changes persist between sessions.

### Organization Branding
Edit in Settings → Organization:
- Name
- Location
- Primary color (all UI elements follow this color)

### Services
Edit in Settings → Services or Admin → Services Management:
- Service name
- Queue code (e.g., "GC", "VAX", "ER")
- Color coding

## 📱 Responsive Design

- **Kiosk (3-4 columns)** - Large cards for easy touch interaction
- **Display (Side-by-side)** - Now Serving left, Announcements right
- **Admin (Grid)** - Responsive card layout

## 🔧 Build for Production

```bash
npm run build
```

Creates optimized production build in `build/` folder.

## 📋 File Structure

```
src/
├── components/
│   ├── Navbar.jsx              # Top navigation with view switcher
│   ├── SettingsPanel.jsx       # Settings modal
│   ├── HealthAnnouncementPanel.jsx
│   ├── kiosk/
│   │   ├── KioskView.jsx
│   │   ├── PhoneModal.jsx
│   │   └── TicketModal.jsx
│   ├── display/
│   │   ├── DisplayView.jsx
│   │   └── NowServing.jsx
│   ├── stations/               # 9-Step Patient Flow Components
│   │   ├── Station1_NumberIssuance.jsx
│   │   ├── Station2_VitalSigns.jsx
│   │   ├── Station3_Interview.jsx
│   │   ├── Station4_EncodingTriage.jsx
│   │   ├── Station5_PhysicianConsult.jsx
│   │   ├── Station6_Pharmacy.jsx
│   │   └── StationManager.jsx
│   └── admin/
│       ├── AdminView.jsx
│       ├── QueueTab.jsx
│       └── ServicesTab.jsx
├── config/
│   └── settings.js             # Default settings & 9-step flow config
├── hooks/
│   ├── useQMS.js               # Legacy queue management logic
│   └── usePatientNavigationQMS.js  # 9-Step patient navigation (NEW)
├── constants/
│   └── stations.js             # 9-Step flow definitions
├── utils/
│   ├── printTicket.js          # Ticket printing utility
│   ├── ancillaryServices.js    # Ancillary routing logic (NEW)
│   └── patientFlowDisplay.js   # UI formatting utilities (NEW)
├── App.js                      # Main app component
└── index.js                    # React DOM render
```

---

## 🏥 Patient Navigation System (9-Step Flow) - NEW

**Official Patient Navigation System Flow for CHO Mati**

This system implements a complete 9-step sequential patient journey with state tracking, timestamp logging, and ancillary services routing.

### 📊 9-Step Sequential Flow

| Step | Code | Station Name | Description | Time Est. |
|:----:|:----:|:---|:---|:---:|
| **1** | REG | Registration | Patient registration & record creation | 5-10 min |
| **2** | VST | Vital Signs Taking | BP, temperature, weight, heart rate | 5-10 min |
| **3** | TRG | Interview / Triage | Severity assessment & chief complaint | 10-15 min |
| **4** | PCU | Primary Care Unit | Initial assessment & preliminary diagnosis | 15-20 min |
| **5** | ENC1 | Encoding (Primary) | EMR data entry & documentation | 10-15 min |
| **6** | OPD | Outpatient Department | Queue placement & routing decision | 5 min |
| **7** | CONS | Consultation | Doctor exam, diagnosis & treatment orders | 20-30 min |
| **8** | ENC2 | Encoding (Ancillary) | Order entry (labs, meds, imaging) | 10-15 min |
| **9** | ANCL | Ancillary Services | Dynamic routing to specialized services | Variable |

### 🔀 Ancillary Services Branching (Step 9)

Patients can be routed to one or multiple ancillary services:
- **LAB** - Laboratory tests
- **NIP** - National Immunization Program
- **PHAR** - Pharmacy (medication dispensing)
- **XRAY** - X-ray Imaging
- **ECG** - Electrocardiogram
- **ABTC** - Animal Bite Treatment Center (Anti-Rabies)

### ⚕️ ABTC Prioritization

When a patient is flagged for ABTC (Animal Bite Treatment Center):
1. Doctor marks "requires ABTC" during Step 7 (Consultation)
2. System automatically prioritizes ABTC in Step 9 routing
3. Patient goes to ABTC first, then other ancillary services

### 📋 Data Tracked per Patient

```javascript
{
  ticketNumber: "REG001",
  status: "in_station",
  currentStep: 4,
  completedSteps: [1, 2, 3],
  
  // Timestamp tracking for bottleneck analysis
  stepJourney: {
    1: { timestamp_in, timestamp_out, waitTime },
    2: { timestamp_in, timestamp_out, waitTime },
    // ... for each completed step
  },
  
  // Step-specific data
  vitals: { bp, temp, weight, hr },
  triageData: { severity, complaint },
  assessment: { ... },
  consultation: { diagnosis, orders },
  
  // Ancillary routing
  ancillaryServices: ["LAB", "PHAR"],
  requiresABTC: false,
}
```

### 📈 Features

✅ **Sequential Flow** - Patients progress through 9 steps in order
✅ **Timestamp Tracking** - Entry/exit times for bottleneck detection
✅ **Wait Time Analytics** - Average, max, and bottleneck alerts (>30 min)
✅ **Dynamic Routing** - Ancillary services determined by doctor's orders
✅ **ABTC Prioritization** - Automatic flagging and queue prioritization
✅ **Progress Tracking** - Full patient journey history and completion stats
✅ **State Persistence** - Complete patient records maintained
✅ **Bottleneck Detection** - Alerts when steps exceed 30-minute average

### 🚀 Usage

#### 1. Register Patient (Step 1)
```javascript
import { usePatientNavigationQMS } from "./hooks/usePatientNavigationQMS";

const { registerPatient } = usePatientNavigationQMS();

const patient = registerPatient({
  patientName: "Juan Dela Cruz",
  patientId: "CHO-2024-001",
  age: 45,
  gender: "M"
});

console.log(patient.ticketNumber); // "REG001"
```

#### 2. Call Next at Station
```javascript
const { callNextAtStep } = usePatientNavigationQMS();

// Call next patient at Step 2 (Vital Signs)
const patient = callNextAtStep(2);
// System automatically records entry time
```

#### 3. Complete Step with Data
```javascript
const { completeStep } = usePatientNavigationQMS();

// Complete Step 2 with vitals data
completeStep(2, {
  bloodPressure: "120/80",
  temperature: 36.5,
  weight: 70,
  heartRate: 72
});

// System automatically:
// - Records exit time
// - Calculates wait time
// - Updates statistics
// - Routes to Step 3
// - Detects bottlenecks
```

#### 4. Route to Ancillary Services
```javascript
import { determineAncillaryServices, handleABTCPrioritization } from "./utils/ancillaryServices";

// Determine services based on doctor's orders
const services = determineAncillaryServices(
  { diagnosis: "Hypertension" },
  { labTests: ["CBC"], medications: ["Amlodipine"], antiRabiesRequired: true }
);
// Result: ["LAB", "PHAR", "ABTC"]

// Handle ABTC prioritization
const { isABTCPriority, services: prioritized } = handleABTCPrioritization(services);
// Result: ["ABTC", "LAB", "PHAR"]
```

### 📊 Analytics & Monitoring

View bottleneck areas and average wait times:
```javascript
const { stats } = usePatientNavigationQMS();

// Check for bottlenecks
stats.stepStats.forEach((step, stats) => {
  if (stats.bottleneck) {
    console.log(`⚠️ Bottleneck at Step ${step}: ${stats.averageWaitTime / 60000} min avg`);
  }
});

// Total statistics
console.log(`Total Registered: ${stats.totalRegistered}`);
console.log(`Total Completed: ${stats.totalCompleted}`);
console.log(`Average Journey Time: ${stats.averageJourneyTime / 60000} min`);
```

### 📚 Documentation

For detailed implementation guide, see:
- [IMPLEMENTATION_GUIDE.md](src/hooks/IMPLEMENTATION_GUIDE.md) - Complete API documentation
- [STATION_FLOW_IMPLEMENTATION.md](STATION_FLOW_IMPLEMENTATION.md) - Official flow specification

### 📁 Related Files

- **Constants:** [src/constants/stations.js](src/constants/stations.js)
- **Hook:** [src/hooks/usePatientNavigationQMS.js](src/hooks/usePatientNavigationQMS.js)
- **Utilities:** 
  - [src/utils/ancillaryServices.js](src/utils/ancillaryServices.js)
  - [src/utils/patientFlowDisplay.js](src/utils/patientFlowDisplay.js)
- **Config:** [src/config/settings.js](src/config/settings.js) (patientFlow section)

## 🎯 Default Services

- General Consultation
- Vaccination
- Emergency
- Immunization
- Prenatal Check
- Pediatrics

You can customize these in Settings or Admin panel.

## 💾 Data Persistence

- **Settings**: Saved to localStorage as `cho_qms_settings`
- **Queue Data**: Stored in React state (not persisted between page reloads)

To persist queue data, you can connect to a backend database.

## 🚀 Technology Stack

- **React 18** - UI framework
- **Bootstrap 5** - CSS framework
- **Lucide React** - Icon library
- **LocalStorage** - Settings persistence

## 📝 License

This project is for City Health Office use.

---

**Need Help?** Check the in-app hints and settings for more information.
