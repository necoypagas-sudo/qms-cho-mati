// src/components/stations/StationOperatorView.jsx
// Display a specific station with queue and current patient management

import React, { useState, useEffect } from "react";
import Station1_NumberIssuance from "./Station1_NumberIssuance";
import Station2_VitalSigns from "./Station2_VitalSigns";
import Station3_Interview from "./Station3_Interview";
import Station4_EncodingTriage from "./Station4_EncodingTriage";
import Station5_PhysicianConsult from "./Station5_PhysicianConsult";
import Station6_Pharmacy from "./Station6_Pharmacy";
import { STATIONS } from "../../constants/stations";
import "../styles/StationOperatorView.css";

const StationOperatorView = ({ stationId, qmsHook }) => {
  const [selectedStationId, setSelectedStationId] = useState(stationId || 1);
  const [currentPatient, setCurrentPatient] = useState(null);
  const [showQueueList, setShowQueueList] = useState(false);

  useEffect(() => {
    const station = STATIONS.find(s => s.id === parseInt(selectedStationId));
    const queue = qmsHook?.stationQueues?.[selectedStationId] || [];
    const nowServing = qmsHook?.nowServingByStation?.[selectedStationId];
    
    setCurrentPatient(nowServing || null);
  }, [selectedStationId, qmsHook?.stationQueues, qmsHook?.nowServingByStation]);

  const handleCallNext = () => {
    if (qmsHook?.callNextAtStation) {
      const patient = qmsHook.callNextAtStation(selectedStationId);
      setCurrentPatient(patient);
    }
  };

  const handleStationComplete = (stationData) => {
    if (qmsHook?.completeStationAndAdvance && currentPatient) {
      const result = qmsHook.completeStationAndAdvance(selectedStationId, stationData);
      console.log(`Station ${selectedStationId} completed. Next station:`, result);
      
      // Clear current patient and show next in queue
      setCurrentPatient(null);
      setTimeout(() => {
        setShowQueueList(false);
      }, 500);
    }
  };

  const station = STATIONS.find(s => s.id === parseInt(selectedStationId));
  const queue = qmsHook?.stationQueues?.[selectedStationId] || [];
  const stats = qmsHook?.stats?.stationStats?.[selectedStationId] || {};

  // Station component map
  const StationComponents = {
    1: Station1_NumberIssuance,
    2: Station2_VitalSigns,
    3: Station3_Interview,
    4: Station4_EncodingTriage,
    5: Station5_PhysicianConsult,
    6: Station6_Pharmacy,
  };

  const CurrentStationComponent = StationComponents[selectedStationId];

  return (
    <div className="station-operator-view">
      {/* Station Selector Tabs */}
      <div className="station-selector">
        <div className="tabs-container">
          {STATIONS.map(s => {
            const stationQueue = qmsHook?.stationQueues?.[s.id] || [];
            const isActive = parseInt(selectedStationId) === s.id;
            return (
              <button
                key={s.id}
                className={`station-tab ${isActive ? "active" : ""}`}
                onClick={() => setSelectedStationId(s.id)}
                style={{
                  borderBottomColor: isActive ? s.color : "transparent",
                  color: isActive ? s.color : "#666"
                }}
              >
                <span className="icon">{s.icon}</span>
                <span className="name">{s.code}</span>
                <span className="queue-badge">{stationQueue.length}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="station-main-content">
        {/* Operator Panel */}
        <div className="operator-panel">
          <div className="operator-info">
            <h2>{station?.name}</h2>
            <p>{station?.description}</p>
          </div>

          <div className="queue-stats">
            <div className="stat-item">
              <span className="label">Waiting in Queue:</span>
              <span className="value" style={{color: station?.color}}>{queue.length}</span>
            </div>
            <div className="stat-item">
              <span className="label">Total Served:</span>
              <span className="value">{stats.served || 0}</span>
            </div>
            <div className="stat-item">
              <span className="label">Avg Wait Time:</span>
              <span className="value">{(stats.averageWaitTime || 0).toFixed(1)} min</span>
            </div>
          </div>

          {!currentPatient ? (
            <div className="no-patient-section">
              <p className="message">No patient being served</p>
              {queue.length > 0 ? (
                <button className="btn btn-primary btn-lg" onClick={handleCallNext}>
                  📞 Call Next Patient
                </button>
              ) : (
                <p className="no-queue">No patients in queue</p>
              )}
            </div>
          ) : (
            <div className="current-patient-info">
              <h3>Currently Serving:</h3>
              <div className="patient-card">
                <p className="patient-name">{currentPatient.fullName}</p>
                <p className="ticket-number">Ticket: {currentPatient.ticketNumber}</p>
                <p className="patient-details">Age: {currentPatient.age} | Gender: {currentPatient.gender}</p>
              </div>
            </div>
          )}

          {queue.length > 0 && (
            <div className="queue-preview">
              <button 
                className="btn btn-secondary"
                onClick={() => setShowQueueList(!showQueueList)}
              >
                📋 {showQueueList ? "Hide" : "Show"} Queue List ({queue.length})
              </button>
              {showQueueList && (
                <div className="queue-list">
                  {queue.map((patient, index) => (
                    <div key={patient.id} className="queue-item">
                      <span className="position">#{index + 1}</span>
                      <span className="ticket">{patient.ticketNumber}</span>
                      <span className="name">{patient.fullName}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Station Component Display */}
        <div className="station-component-wrapper">
          {currentPatient && CurrentStationComponent ? (
            selectedStationId === 1 ? (
              <Station1_NumberIssuance
                onPatientRegistered={handleStationComplete}
                isProcessing={false}
              />
            ) : (
              <CurrentStationComponent
                currentPatient={currentPatient}
                onStationComplete={handleStationComplete}
                qmsHook={qmsHook}
              />
            )
          ) : selectedStationId !== 1 ? (
            <div className="no-patient-placeholder">
              <div className="placeholder-content">
                <p className="icon">⏸️</p>
                <p className="message">No patient is currently being served</p>
                <p className="instruction">Use "Call Next Patient" to get started</p>
              </div>
            </div>
          ) : (
            <Station1_NumberIssuance
              onPatientRegistered={handleStationComplete}
              isProcessing={false}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default StationOperatorView;
