import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import KioskView from "./components/kiosk/KioskView";
import DisplayView from "./components/display/DisplayView";
import AdminView from "./components/admin/AdminView";
import SettingsPanel from "./components/SettingsPanel";
import { useQMS } from "./hooks/useQMS";
import { loadSettings, saveSettings } from "./config/settings";
import "bootstrap/dist/css/bootstrap.min.css";

export default function App() {
  const [view, setView] = useState("kiosk");
  const [settings, setSettings] = useState(loadSettings());
  const [showSettings, setShowSettings] = useState(false);
  const { services, setServices, queues, nowServing, voiceOn, setVoiceOn, takeNumber, callNext, markDone, nextStep, previousStep, clearQueue } = useQMS(settings.services);

  // Update services when settings change
  useEffect(() => {
    setServices(settings.services);
  }, [settings.services, setServices]);

  const handleSettingsSave = (newSettings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
    setShowSettings(false);
  };

  const handleSettingsOpen = () => {
    setShowSettings(true);
  };

  return (
    <div style={{ fontFamily: "'Segoe UI','Helvetica Neue',sans-serif", minHeight: "100vh", background: "#f8f9fa" }}>
      <Navbar 
        view={view} 
        setView={setView} 
        voiceOn={voiceOn} 
        setVoiceOn={setVoiceOn} 
        onSettingsClick={handleSettingsOpen}
        organizationName={settings.organization.name}
      />
      
      {view === "kiosk" && (
        <KioskView 
          services={services} 
          queues={queues} 
          nowServing={nowServing} 
          takeNumber={takeNumber}
          settings={settings}
        />
      )}
      
      {view === "display" && (
        <DisplayView 
          services={services} 
          queues={queues} 
          nowServing={nowServing}
          announcements={settings.announcements}
          healthTips={settings.healthTips}
          settings={settings}
        />
      )}
      
      {view === "admin" && (
        <AdminView 
          services={services} 
          setServices={setServices}
          queues={queues} 
          nowServing={nowServing} 
          callNext={callNext}
          markDone={markDone}
          nextStep={nextStep}
          previousStep={previousStep}
          clearQueue={clearQueue}
          settings={settings}
        />
      )}

      {showSettings && (
        <SettingsPanel
          settings={settings}
          onSave={handleSettingsSave}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}
