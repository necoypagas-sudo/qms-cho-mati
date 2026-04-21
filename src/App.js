import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import StationManager from "./components/stations/StationManager";
import SettingsPanel from "./components/SettingsPanel";
import { useStationQMS } from "./hooks/useStationQMS";
import { loadSettings, saveSettings } from "./config/settings";
import "bootstrap/dist/css/bootstrap.min.css";

export default function App() {
  const [view, setView] = useState("kiosk");
  const [settings, setSettings] = useState(loadSettings());
  const [showSettings, setShowSettings] = useState(false);
  // Use the new station-based QMS hook
  const qmsHook = useStationQMS();
  const { voiceOn, setVoiceOn, stats } = qmsHook;

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
      
      {/* Use the StationManager which implements the 6-station sequential flow */}
      {(view === "kiosk" || view === "display" || view === "admin") && (
        <StationManager qmsHook={qmsHook} />
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
