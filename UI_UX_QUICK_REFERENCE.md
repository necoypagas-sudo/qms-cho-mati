# QMS UI/UX - QUICK REFERENCE

## 🎤 Voice Features

### Import Voice Utilities
```javascript
import {
  speak,
  callTicket,
  recallTicket,
  skipTicket,
  transferTicket,
  playNotificationSound,
  playUrgentSound,
  isSpeaking,
  stopSpeech,
  VOICE_PROFILES,
  VoiceAnnouncementQueue
} from "../utils/voiceCaller";
```

### Quick Voice Examples
```javascript
// Announce ticket
callTicket("GC001", "Service Counter", { rate: 0.9, pitch: 1.0 });

// Use preset voice
speak("Please proceed now", VOICE_PROFILES.FAST);

// Play notification
playNotificationSound();

// Check if speaking
if (isSpeaking()) { /* ... */ }

// Queue announcements
const queue = new VoiceAnnouncementQueue();
queue.add("Welcome");
queue.addTicketCall("GC001");
queue.play();
```

---

## 🎚️ CallerPanel Component

### Import & Use
```javascript
import CallerPanel from "./components/CallerPanel";

<CallerPanel
  currentTicket={ticket}
  stationName="Service Counter"
  stations={STATIONS}
  voiceSettings={{ rate: 0.9, pitch: 1.0, volume: 1.0 }}
  onTicketComplete={handleComplete}
  onRecallTicket={handleRecall}
  onSkipTicket={handleSkip}
  onTransferTicket={handleTransfer}
/>
```

### Features
- ✅ Call Next button (primary green)
- ✅ Voice toggle (on/off)
- ✅ Stop speech button (red)
- ✅ Recall button (yellow)
- ✅ Skip button (orange)
- ✅ Transfer menu (blue)
- ✅ Real-time speaking indicator

---

## 📜 Marquee/Ticker Component

### Single Ticker
```javascript
import MarqueeTicker from "./components/MarqueeTicker";

<MarqueeTicker
  text="👨‍⚕️ Welcome | 🏥 Hours: 8AM-5PM | 📞 (087) 811 4331"
  speed={2}
  backgroundColor="#dc3545"
  textColor="#ffffff"
  height="60px"
  fontSize="1.2rem"
/>
```

### Multiple Tickers
```javascript
import { MultiMarqueeTicker } from "./components/MarqueeTicker";

<MultiMarqueeTicker
  tickers={[
    { text: "Health Tip: Drink water", speed: 2, backgroundColor: "#198754" },
    { text: "Alert: Vaccinations available", speed: 3, backgroundColor: "#ffc107" }
  ]}
/>
```

### Speed Values
- 1 = Slowest (30 seconds per loop)
- 2 = Default (20 seconds per loop)
- 5 = Fastest (6 seconds per loop)

---

## 📺 DisplayView Component

### Layout Sections
```
┌─ Header (CHO Name + Time) ─┐
├──────────────┬─────────────┤
│ Left 50%     │ Right 50%   │
│ VIDEO PLAYER │ QUEUE LIST  │
│              │ ANNOUNCE.   │
│              │ HEALTH TIPS │
├──────────────┴─────────────┤
│ MARQUEE (at bottom)         │
└─────────────────────────────┘
```

### Responsive Sizes
- **4K** (3840×2160): Large, generous spacing
- **1440p** (2560×1440): Balanced
- **1080p** (1920×1080): Compact, readable
- **Tablet** (<1024px): Vertical stack
- **Mobile** (<640px): Single column

### CSS Classes
- `.display-view-container` - Main container
- `.display-header` - Top header
- `.display-main` - Split screen area
- `.display-left` - Video section
- `.display-right` - Queue/announcements
- `.queue-item` - Individual ticket
- `.queue-item.now-serving` - Highlighted ticket

---

## ⚙️ Voice Settings Component

### Integration
```javascript
import { VoiceSettings } from "./components/VoiceSettings";

{activeTab === "voice" && (
  <VoiceSettings 
    settings={settings}
    onChange={setSettings}
  />
)}
```

### Settings Structure
```javascript
settings.voiceSettings = {
  enabled: true,
  rate: 0.9,           // 0.1-2.0
  pitch: 1.0,          // 0.5-2.0
  volume: 1.0,         // 0-1.0
  language: "en-PH"    // Language code
}

settings.displaySettings = {
  marqueeText: "...",
  marqueeSpeed: 2,              // 1-5
  marqueeBackgroundColor: "#dc3545",
  marqueeTextColor: "#ffffff",
  showMarquee: true
}
```

---

## 🎨 Styling

### CSS Files
- `src/styles/CallerPanel.css` - Caller controls styling
- `src/styles/MarqueeTicker.css` - Ticker animations
- `src/styles/DisplayView.css` - Display layout & responsive

### Breakpoints
```css
/* 4K (3840x2160) */
@media (min-width: 3840px) { /* ... */ }

/* 1440p (2560x1440) */
@media (min-width: 2560px) { /* ... */ }

/* 1080p (1920x1080) */
@media (min-width: 1920px) and (max-height: 1080px) { /* ... */ }

/* Tablet */
@media (max-width: 1024px) { /* ... */ }

/* Mobile */
@media (max-width: 640px) { /* ... */ }
```

### Color Reference
| Action | Color | Hex |
|--------|-------|-----|
| Call Next | Green | #198754 |
| Recall | Yellow | #ffc107 |
| Skip | Orange | #fd7e14 |
| Transfer | Blue | #0dcaf0 |
| Error | Red | #dc3545 |

---

## 🔊 Notification Sounds

### Play Notification
```javascript
import { playNotificationSound, playUrgentSound } from "../utils/voiceCaller";

// Single beep (for normal tickets)
playNotificationSound();

// Double beep (for priority/urgent)
playUrgentSound();
```

### Sound Frequencies
- Single: 800 Hz, 0.5 second fade
- Double: 1000 Hz → 1200 Hz, 0.3 second each

---

## 🌍 Multi-Language Support

### Supported Languages
```javascript
const LANGUAGES = {
  "en-PH": "English (Philippines)",
  "en-US": "English (US)",
  "fil-PH": "Filipino (Tagalog)",
  "es-ES": "Spanish",
  "fr-FR": "French"
}
```

### Usage
```javascript
speak("Now serving ticket number GC001", {
  language: "en-PH"  // or any supported language
});
```

---

## 📊 Common Patterns

### Pattern 1: Call Ticket Flow
```javascript
const handleCallNext = () => {
  playNotificationSound();
  
  if (voiceEnabled) {
    callTicket(ticket.fullTicketNumber, stationName, voiceConfig);
  }
  
  updateUI(ticket);
};
```

### Pattern 2: Display Queue
```javascript
<div className="queue-list-items">
  {queue.map(ticket => (
    <div className="queue-item" key={ticket.id}>
      <div className="queue-ticket-number">
        {ticket.fullTicketNumber}
      </div>
      <div className="queue-ticket-info">
        <div>{ticket.patientName}</div>
        <div className="queue-ticket-wait">Wait: ~5 min</div>
      </div>
    </div>
  ))}
</div>
```

### Pattern 3: Marquee in DisplayView
```javascript
<div className="marquee-section">
  <MarqueeTicker
    text={settings.displaySettings.marqueeText}
    speed={settings.displaySettings.marqueeSpeed}
    backgroundColor={settings.displaySettings.marqueeBackgroundColor}
    textColor={settings.displaySettings.marqueeTextColor}
  />
</div>
```

---

## 🚀 Performance Tips

1. **Throttle Voice Calls**: Limit simultaneous speech synthesis
2. **Use Voice Profiles**: Pre-defined settings are optimized
3. **CSS Animation**: Marquee uses GPU acceleration
4. **Lazy Load Videos**: Only load visible videos
5. **Responsive Images**: Use different sizes for breakpoints

---

## 🐛 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Voice not working | Check `isSpeechSynthesisSupported()`, verify audio permissions |
| Text overlapping | Check media queries, test responsive size |
| Marquee not scrolling | Verify CSS animation in DevTools, check text length |
| Performance lag | Reduce animation count, use CSS over JavaScript |
| Mobile display cut off | Check viewport meta tag, test with viewport=device-width |

---

## 📚 Documentation Links

- Full Guide: [UI_UX_IMPLEMENTATION.md](UI_UX_IMPLEMENTATION.md)
- Voice API: [voiceCaller.js](src/utils/voiceCaller.js)
- CallerPanel: [CallerPanel.jsx](src/components/CallerPanel.jsx)
- Ticker: [MarqueeTicker.jsx](src/components/MarqueeTicker.jsx)
- Display Styles: [DisplayView.css](src/styles/DisplayView.css)

---

## 📞 Support

For issues or questions:
1. Check browser console for errors
2. Verify all imports are correct
3. Test individual components in isolation
4. Check documentation in code comments
5. Review UI_UX_IMPLEMENTATION.md examples
