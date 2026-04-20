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
│   └── admin/
│       ├── AdminView.jsx
│       ├── QueueTab.jsx
│       └── ServicesTab.jsx
├── config/
│   └── settings.js             # Default settings & config management
├── hooks/
│   └── useQMS.js               # Queue management logic
├── utils/
│   └── printTicket.js          # Ticket printing utility
├── App.js                      # Main app component
└── index.js                    # React DOM render
```

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
