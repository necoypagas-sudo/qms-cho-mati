// EXAMPLE: src/AppWithStationFlow.jsx
// This shows how to integrate the new 6-station flow into your App
// This is a REFERENCE FILE - adapt to your existing App.js

import React, { useState } from "react";
import { useStationQMS } from "./hooks/useStationQMS";
import StationManager from "./components/stations/StationManager";
import "./styles.css";

/**
 * AppWithStationFlow - Example integration of 6-station sequential flow
 * 
 * To use this:
 * 1. Copy the useStationQMS hook into your existing App.js
 * 2. Import StationManager component
 * 3. Add the station-based flow UI alongside existing components
 */
function AppWithStationFlow() {
  const qmsHook = useStationQMS();
  const [view, setView] = useState("intro"); // "intro", "station_flow", "legacy"

  return (
    <div className="app-container">
      {/* Navigation */}
      <nav className="app-nav">
        <h1>CHO Mati - Queue Management System</h1>
        <div className="nav-buttons">
          <button
            className={`nav-btn ${view === "intro" ? "active" : ""}`}
            onClick={() => setView("intro")}
          >
            Home
          </button>
          <button
            className={`nav-btn ${view === "station_flow" ? "active" : ""}`}
            onClick={() => setView("station_flow")}
          >
            🆕 New Station Flow
          </button>
          <button
            className={`nav-btn ${view === "legacy" ? "active" : ""}`}
            onClick={() => setView("legacy")}
          >
            📋 Legacy Services (Old)
          </button>
        </div>
      </nav>

      {/* Views */}
      <main className="app-content">
        {view === "intro" && (
          <div className="intro-view">
            <div className="welcome-card">
              <h2>Welcome to CHO Mati QMS</h2>
              <p>Patient Flow Redesign: Sequential 6-Station Model</p>
              
              <div className="features">
                <h3>✨ New Features:</h3>
                <ul>
                  <li>🔢 Station 1: Number Issuance - Patient registration</li>
                  <li>🌡️ Station 2: Vital Signs - BP, temperature, height, weight</li>
                  <li>📋 Station 3: Interview - Health history screening</li>
                  <li>💻 Station 4: Encoding & Triage - Data entry & categorization</li>
                  <li>👨‍⚕️ Station 5: Physician Consultation - Doctor examination</li>
                  <li>💊 Station 6: Pharmacy - Medicine dispensing</li>
                </ul>
              </div>

              <div className="cta-buttons">
                <button
                  className="btn-large btn-primary"
                  onClick={() => setView("station_flow")}
                >
                  👉 Start New Station Flow
                </button>
              </div>

              <div className="comparison">
                <h3>📊 Model Comparison</h3>
                <table>
                  <thead>
                    <tr>
                      <th>Aspect</th>
                      <th>Legacy Model</th>
                      <th>New Station Model</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Patient Flow</td>
                      <td>Selects one service</td>
                      <td>Goes through all 6 stations</td>
                    </tr>
                    <tr>
                      <td>Queue Type</td>
                      <td>Service-based (parallel)</td>
                      <td>Station-based (sequential)</td>
                    </tr>
                    <tr>
                      <td>Patient Tracking</td>
                      <td>Within service only</td>
                      <td>Full journey tracking</td>
                    </tr>
                    <tr>
                      <td>Vital Signs</td>
                      <td>Optional in steps</td>
                      <td>Dedicated Station 2</td>
                    </tr>
                    <tr>
                      <td>Triage</td>
                      <td>Emergency only</td>
                      <td>Universal Station 4</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {view === "station_flow" && (
          <StationManager qmsHook={qmsHook} />
        )}

        {view === "legacy" && (
          <div className="legacy-view">
            <p>Your existing legacy components would go here...</p>
            {/* <YourExistingApp /> */}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <p>CHO Mati QMS v2.0 - Station-Based Patient Flow</p>
        <p>Implemented: April 2026 | Status: Station 1 Complete</p>
      </footer>
    </div>
  );
}

export default AppWithStationFlow;


/* ============================================
   MINIMAL INTEGRATION (Just for Station 1)
   ============================================ */

/**
 * If you only want Station 1 in your existing App.js:
 * 
 * import { useStationQMS } from "./hooks/useStationQMS";
 * import Station1_NumberIssuance from "./components/stations/Station1_NumberIssuance";
 * 
 * function App() {
 *   const qmsHook = useStationQMS();
 * 
 *   return (
 *     <div className="app">
 *       <Station1_NumberIssuance
 *         onPatientRegistered={(patientData) => {
 *           return qmsHook.registerPatient(patientData);
 *         }}
 *       />
 *     </div>
 *   );
 * }
 */
