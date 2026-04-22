# QMS UI/UX IMPLEMENTATION GUIDE

## Overview

Complete implementation of UI/UX requirements for the Queuing Management System (QMS), including:
- **Patient Display View** - Split-screen layout optimized for 1080p and 4K TVs
- **Voice Caller System** - Web Speech API integration with automated announcements
- **Caller Controls** - Next, Recall, Skip, Transfer buttons
- **Marquee/Ticker** - Scrolling announcement banner
- **Voice Settings** - Admin control for voice speed, pitch, and volume

---

## 📺 Patient Display View (TV Display)

### Layout

Split-screen design optimized for large displays:

```
┌─ HEADER (CHO Info + Time + Date) ──────────────────────────────┐
│                                                                   │
├──────────────────────┬────────────────────────────────────────────┤
│                      │                                            │
│  VIDEO PLAYER        │  QUEUE LIST                               │
│  (Left 50%)         │  NOW SERVING                               │
│                      │  WAITING TICKETS                          │
│                      │  PRIORITY INDICATORS                      │
│                      ├────────────────────────────────────────────┤
│                      │  HEALTH ANNOUNCEMENTS                     │
│                      │  (Rotating)                                │
│                      ├────────────────────────────────────────────┤
│                      │  HEALTH TIPS & NOTICES                    │
│                      │                                            │
├──────────────────────┴────────────────────────────────────────────┤
│  MARQUEE/TICKER - Scrolling Announcements                         │
└─────────────────────────────────────────────────────────────────── ┘
```

### Responsive Breakpoints

- **4K (3840×2160)**: Large fonts, optimal spacing
- **1440p (2560×1440)**: Balanced layout
- **1080p (1920×1080)**: Compact but readable
- **Tablet (1024px)**: Vertical stack
- **Mobile (<640px)**: Single column

### Implementation

```jsx
import DisplayView from "./components/display/DisplayView";
import MarqueeTicker from "./components/MarqueeTicker";

function App() {
  return (
    <>
      <DisplayView 
        services={services}
        queues={queues}
        nowServing={nowServing}
        announcements={announcements}
        healthTips={healthTips}
        settings={settings}
      />
      
      <MarqueeTicker 
        text={settings.displaySettings.marqueeText}
        speed={settings.displaySettings.marqueeSpeed}
        backgroundColor={settings.displaySettings.marqueeBackgroundColor}
        textColor={settings.displaySettings.marqueeTextColor}
      />
    </>
  );
}
```

### Styling

Applied via `src/styles/DisplayView.css` with:
- CSS Grid/Flexbox for responsive layout
- Media queries for 1080p, 1440p, 4K optimization
- Accessibility features (reduced motion, high contrast)
- Dark mode support

---

## 🎤 Voice Caller System

### Web Speech API Integration

Uses native `window.speechSynthesis` for text-to-speech announcements.

### Voice Caller Utilities

Location: `src/utils/voiceCaller.js`

#### Basic Voice Functions

```javascript
import { 
  speak, 
  callTicket, 
  recallTicket, 
  skipTicket, 
  transferTicket,
  isSpeaking,
  stopSpeech,
  playNotificationSound,
  playUrgentSound
} from "../utils/voiceCaller";

// Basic text-to-speech
speak("Now serving ticket GC001 at Service Counter", {
  rate: 0.9,      // Speed (0.1-2.0)
  pitch: 1.0,     // Pitch (0.5-2.0)
  volume: 1.0     // Volume (0-1.0)
});

// Call specific ticket
callTicket("GC001", "Service Counter", voiceOptions, onComplete);

// Recall ticket
recallTicket("GC001", voiceOptions, onComplete);

// Skip ticket
skipTicket("GC001", voiceOptions, onComplete);

// Transfer ticket
transferTicket("GC001", "Service Counter", "Pharmacy", voiceOptions, onComplete);

// Check status
if (isSpeaking()) {
  console.log("Currently speaking...");
}

// Stop speech
stopSpeech();

// Play notification sounds
playNotificationSound();        // Single beep
playUrgentSound();             // Double beep
```

#### Voice Profiles

```javascript
import { VOICE_PROFILES, createVoiceProfile } from "../utils/voiceCaller";

// Use predefined profiles
const fastVoice = VOICE_PROFILES.FAST;        // 1.3x speed, normal pitch
const normalVoice = VOICE_PROFILES.NORMAL;    // 0.9x speed, normal pitch
const slowVoice = VOICE_PROFILES.SLOW;        // 0.6x speed, lower pitch

// Create custom profile
const myVoice = createVoiceProfile("MyVoice", 0.9, 1.2, 0.8);
```

#### Voice Announcement Queue

For sequential announcements:

```javascript
import { VoiceAnnouncementQueue } from "../utils/voiceCaller";

const queue = new VoiceAnnouncementQueue();

// Add announcements
queue.add("Welcome to City Health Office");
queue.add("Please proceed to your designated window");
queue.addTicketCall("GC001", "Service Counter");

// Play all sequentially
queue.play(() => {
  console.log("All announcements completed");
});

// Control queue
queue.clear();
const length = queue.length();
```

---

## 🎚️ Caller Panel Component

Provides operator controls for managing tickets.

Location: `src/components/CallerPanel.jsx`

### Features

- **Call Next**: Call current ticket with voice announcement
- **Voice Toggle**: Enable/disable voice announcements
- **Recall**: Announce ticket again (patient missed)
- **Skip**: Skip current ticket
- **Transfer**: Route ticket to another station
- **Real-time Status**: Displays speaking status and current settings

### Implementation

```jsx
import CallerPanel from "./components/CallerPanel";
import { STATIONS } from "./constants/stations";

function StationView() {
  const [currentTicket, setCurrentTicket] = useState(null);
  const stationName = "Service Counter";
  const voiceSettings = {
    rate: 0.9,
    pitch: 1.0,
    volume: 1.0
  };

  return (
    <CallerPanel
      currentTicket={currentTicket}
      stationName={stationName}
      stations={STATIONS}
      voiceSettings={voiceSettings}
      onTicketComplete={(ticketId) => {
        // Handle completion
        callNextTicket();
      }}
      onRecallTicket={(ticketId) => {
        // Handle recall
      }}
      onSkipTicket={(ticketId) => {
        // Handle skip
      }}
      onTransferTicket={(ticketId, toStationId) => {
        // Handle transfer
      }}
    />
  );
}
```

### Styling

Applied via `src/styles/CallerPanel.css`:
- Responsive buttons with hover states
- Color-coded actions (green for call, yellow for recall, orange for skip)
- Real-time speaking indicator with pulse animation
- Mobile-optimized button layout

---

## 📜 Marquee/Ticker Component

Scrolling announcement banner for bottom of display.

Location: `src/components/MarqueeTicker.jsx`

### Features

- Smooth horizontal scrolling animation
- Customizable speed, colors, and size
- Responsive to screen size
- Accessible with reduced motion support
- Multi-ticker support

### Implementation

```jsx
import MarqueeTicker, { MultiMarqueeTicker } from "./components/MarqueeTicker";

// Single marquee
<MarqueeTicker
  text="👨‍⚕️ Welcome to CHO | 🏥 Hours: 8AM-5PM | 📞 (087) 811 4331"
  speed={2}                       // 1-5 (slower to faster)
  backgroundColor="#dc3545"
  textColor="#ffffff"
  height="60px"
  fontSize="1.2rem"
/>

// Multiple tickers
<MultiMarqueeTicker
  tickers={[
    {
      text: "❤️ Health Tip: Drink 8 glasses of water daily",
      speed: 2,
      backgroundColor: "#198754",
      textColor: "#ffffff"
    },
    {
      text: "🚨 Alert: Rabies vaccination available every Tuesday",
      speed: 3,
      backgroundColor: "#ffc107",
      textColor: "#000000"
    }
  ]}
/>
```

### Styling

Applied via `src/styles/MarqueeTicker.css`:
- Smooth CSS animations
- Responsive font sizing with `clamp()`
- Fade effects at edges
- 4K optimization

---

## ⚙️ Voice Settings Component

Admin interface for voice configuration.

Location: `src/components/VoiceSettings.jsx`

### Features

- **Voice Configuration**:
  - Enable/disable announcements
  - Language selection (EN, FIL, ES, FR)
  - Speed control (0.1-2.0)
  - Pitch control (0.5-2.0)
  - Volume control (0-100%)

- **Marquee Settings**:
  - Custom text with emoji support
  - Speed adjustment
  - Background/text color pickers
  - Show/hide toggle

- **Preset Voices**:
  - Fast, Normal, Slow
  - High-pitched, Low-pitched

### Integration with SettingsPanel

```jsx
import SettingsPanel from "./components/SettingsPanel";
import { VoiceSettings } from "./components/VoiceSettings";

function App() {
  const [settings, setSettings] = useState(defaultSettings);
  
  // In your Settings Modal, add to tabs:
  {activeTab === "voice" && (
    <VoiceSettings 
      settings={settings}
      onChange={setSettings}
    />
  )}
}
```

---

## 📱 Responsive Design

### CSS Media Queries

**1080p Optimization** (1920×1080)
```css
@media (min-width: 1920px) and (max-height: 1080px) {
  /* Optimized spacing and fonts for 1080p TVs */
}
```

**1440p Optimization** (2560×1440)
```css
@media (min-width: 2560px) {
  /* Larger fonts and padding for 1440p displays */
}
```

**4K Optimization** (3840×2160)
```css
@media (min-width: 3840px) {
  /* Maximum text sizes and generous spacing for 4K */
}
```

**Tablet Mode** (<1024px)
```css
@media (max-width: 1024px) {
  /* Vertical stack layout for tablets */
}
```

**Mobile** (<640px)
```css
@media (max-width: 640px) {
  /* Single column, compact layout */
}
```

---

## 🔧 Configuration in Settings

### Voice Settings Schema

```javascript
{
  voiceSettings: {
    enabled: true,
    rate: 0.9,           // 0.1-2.0
    pitch: 1.0,          // 0.5-2.0
    volume: 1.0,         // 0-1.0
    language: "en-PH"    // Language code
  }
}
```

### Display Settings Schema

```javascript
{
  displaySettings: {
    marqueeText: "...",
    marqueeSpeed: 2,              // 1-5
    marqueeBackgroundColor: "#dc3545",
    marqueeTextColor: "#ffffff",
    showMarquee: true,
    announcementInterval: 7000,   // ms
    tipInterval: 5000             // ms
  }
}
```

---

## 🎯 Common Usage Examples

### Example 1: Complete Station Operator Flow

```jsx
import CallerPanel from "./components/CallerPanel";
import { useQMS } from "./hooks/useQMS";
import { callTicket, playNotificationSound } from "./utils/voiceCaller";

function StationOperator() {
  const { nowServing, callNext, callDone, queues } = useQMS(1); // Service 1
  const [currentTicket, setCurrentTicket] = useState(null);
  const voiceSettings = { rate: 0.9, pitch: 1.0, volume: 1.0 };

  const handleCallNext = () => {
    playNotificationSound();
    const ticket = callNext();
    setCurrentTicket(ticket);
    
    if (voiceSettings.enabled) {
      callTicket(
        ticket.fullTicketNumber,
        "Service Counter",
        voiceSettings
      );
    }
  };

  return (
    <div>
      <CallerPanel
        currentTicket={currentTicket}
        stationName="Service Counter"
        stations={[/* stations */]}
        voiceSettings={voiceSettings}
        onTicketComplete={handleCallNext}
      />
    </div>
  );
}
```

### Example 2: Display View with All Features

```jsx
import DisplayView from "./components/display/DisplayView";
import MarqueeTicker from "./components/MarqueeTicker";

function TVDisplay() {
  const settings = useSettings();

  return (
    <div>
      <DisplayView
        services={services}
        queues={queues}
        nowServing={nowServing}
        announcements={announcements}
        healthTips={healthTips}
        settings={settings}
      />

      <MarqueeTicker
        text={settings.displaySettings.marqueeText}
        speed={settings.displaySettings.marqueeSpeed}
        backgroundColor={settings.displaySettings.marqueeBackgroundColor}
        textColor={settings.displaySettings.marqueeTextColor}
        height="60px"
        fontSize="1.2rem"
      />
    </div>
  );
}
```

### Example 3: Test Voice Features

```javascript
import { 
  speak, 
  callTicket, 
  recallTicket, 
  VOICE_PROFILES 
} from "./utils/voiceCaller";

// Test basic speech
speak("Hello, this is a test announcement", VOICE_PROFILES.NORMAL);

// Test ticket calling
callTicket("GC001", "Registration Desk", VOICE_PROFILES.SLOW);

// Test recall
recallTicket("GC001", VOICE_PROFILES.FAST);
```

---

## 🎨 Styling & Customization

### CSS Variables

Define custom theme colors in your CSS:

```css
:root {
  --primary-color: #dc3545;
  --success-color: #198754;
  --warning-color: #ffc107;
  --info-color: #0dcaf0;
  --danger-color: #dc3545;
}
```

### Color Schemes

Update MarqueeTicker colors:

```jsx
// Medical alert
<MarqueeTicker
  backgroundColor="#dc3545"  // Red
  textColor="#ffffff"
  text="🚨 Alert: Dengue cases reported. Get tested now."
/>

// Positive news
<MarqueeTicker
  backgroundColor="#198754"  // Green
  textColor="#ffffff"
  text="✅ Good news: New vaccination center opened!"
/>

// Information
<MarqueeTicker
  backgroundColor="#0dcaf0"  // Blue
  textColor="#000000"
  text="ℹ️ CHO is now open on Saturdays 8AM-12NN"
/>
```

---

## 🐛 Troubleshooting

### Voice Not Working

1. Check browser support: `isSpeechSynthesisSupported()`
2. Verify audio permissions are granted
3. Check volume settings (not muted)
4. Test with: `speak("Test")`

### Display Not Responsive

1. Clear browser cache
2. Check media queries in `DisplayView.css`
3. Verify window size matches breakpoints
4. Test on different resolutions

### Marquee Not Scrolling

1. Ensure text is longer than container
2. Check CSS animation in browser DevTools
3. Verify `MarqueeTicker.css` is imported
4. Check `prefers-reduced-motion` setting

---

## 📚 File Structure

```
src/
├── components/
│   ├── CallerPanel.jsx             # Caller controls
│   ├── MarqueeTicker.jsx           # Scrolling ticker
│   ├── VoiceSettings.jsx           # Voice configuration
│   └── display/
│       └── DisplayView.jsx         # TV display view
├── styles/
│   ├── CallerPanel.css             # Caller styling
│   ├── MarqueeTicker.css           # Ticker styling
│   └── DisplayView.css             # Display responsive styles
└── utils/
    └── voiceCaller.js              # Voice API utilities
```

---

## 🎯 Next Steps

1. **Integrate with existing components** - Add CallerPanel to operator views
2. **Test on target hardware** - 1080p/4K displays
3. **Customize voice profiles** - Adjust for your preference
4. **Add more marquee messages** - Update settings with announcements
5. **Monitor performance** - Check CPU/GPU usage on large displays

