// src/components/stations/StationManager.jsx
// Station Manager - Main component for managing 6-station patient flow

import React, { useState } from "react";
import { STATIONS } from "../../constants/stations";
import Station1_NumberIssuance from "./Station1_NumberIssuance";
import "../styles/StationManager.css";

/**
 * StationManager - Orchestrates the 6-station sequential flow
 * 
 * Usage:
 * <StationManager qmsHook={useStationQMS} />
 */
const StationManager = ({ qmsHook }) => {
  const [activeView, setActiveView] = useState("station1"); // "station1", "admin", "display"
  const [isProcessing, setIsProcessing] = useState(false);

  // Handle patient registration from Station 1
  const handlePatientRegistered = (patientData) => {
    setIsProcessing(true);
    
    try {
      // Call the registration function from the hook
      if (qmsHook && qmsHook.registerPatient) {
        const patient = qmsHook.registerPatient(patientData);
        console.log("Patient registered:", patient);
        return patient;
      }
    } catch (error) {
      console.error("Error registering patient:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="station-manager">
      {/* Station Selection Tabs (for admin testing) */}
      <div className="view-tabs">
        <button
          className={`tab ${activeView === "station1" ? "active" : ""}`}
          onClick={() => setActiveView("station1")}
        >
          🔢 Station 1: Registration
        </button>
        <button
          className={`tab ${activeView === "admin" ? "active" : ""}`}
          onClick={() => setActiveView("admin")}
          disabled
        >
          ⚙️ Admin Panel (Coming Soon)
        </button>
        <button
          className={`tab ${activeView === "display" ? "active" : ""}`}
          onClick={() => setActiveView("display")}
          disabled
        >
          📺 Display (Coming Soon)
        </button>
      </div>

      {/* Active View */}
      <div className="view-content">
        {activeView === "station1" && (
          <Station1_NumberIssuance
            onPatientRegistered={handlePatientRegistered}
            isProcessing={isProcessing}
          />
        )}
        
        {activeView === "admin" && (
          <div className="placeholder">
            <h2>Admin Panel - Station Management</h2>
            <p>Coming Soon...</p>
          </div>
        )}
        
        {activeView === "display" && (
          <div className="placeholder">
            <h2>Patient Display - Queue Status</h2>
            <p>Coming Soon...</p>
          </div>
        )}
      </div>

      {/* Queue Status Footer */}
      {qmsHook && (
        <div className="queue-status-footer">
          <div className="status-grid">
            {STATIONS.map(station => {
              const queue = qmsHook.stationQueues?.[station.id] || [];
              const nowServing = qmsHook.nowServingByStation?.[station.id];
              return (
                <div key={station.id} className="status-card" style={{ borderColor: station.color }}>
                  <div className="station-badge">{station.icon}</div>
                  <div className="station-code">{station.code}</div>
                  <div className="queue-count">{queue.length} waiting</div>
                  <div className="serving-status">
                    {nowServing ? "🔴 Serving" : "🟢 Ready"}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default StationManager;
