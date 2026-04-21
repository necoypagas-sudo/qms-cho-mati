// src/components/stations/StationManager.jsx
// Station Manager - Main component for managing 6-station patient flow

import React, { useState } from "react";
import { STATIONS } from "../../constants/stations";
import StationOperatorView from "./StationOperatorView";
import "../styles/StationManager.css";

/**
 * StationManager - Orchestrates the 6-station sequential flow
 * 
 * Usage:
 * <StationManager qmsHook={useStationQMS} />
 */
const StationManager = ({ qmsHook }) => {
  const [activeView, setActiveView] = useState("operator"); // "operator", "admin", "display"
  const [selectedStationId, setSelectedStationId] = useState(1);

  return (
    <div className="station-manager">
      {/* Main View Tabs */}
      <div className="view-tabs">
        <button
          className={`tab ${activeView === "operator" ? "active" : ""}`}
          onClick={() => setActiveView("operator")}
        >
          👤 Operator View
        </button>
        <button
          className={`tab ${activeView === "admin" ? "active" : ""}`}
          onClick={() => setActiveView("admin")}
        >
          ⚙️ Admin Dashboard
        </button>
        <button
          className={`tab ${activeView === "display" ? "active" : ""}`}
          onClick={() => setActiveView("display")}
        >
          📺 Public Display
        </button>
      </div>

      {/* Active View */}
      <div className="view-content">
        {/* Operator View - Individual Station Interface */}
        {activeView === "operator" && (
          <div className="operator-section">
            <StationOperatorView stationId={selectedStationId} qmsHook={qmsHook} />
          </div>
        )}
        
        {/* Admin Dashboard - Overall Queue Management */}
        {activeView === "admin" && (
          <div className="admin-section">
            <div className="admin-header">
              <h1>🖥️ Admin Dashboard</h1>
              <p>Real-time queue management and statistics</p>
            </div>

            {/* Overall Statistics */}
            <div className="admin-stats">
              <div className="stat-card">
                <div className="stat-icon">📊</div>
                <div className="stat-content">
                  <div className="stat-label">Total Registered</div>
                  <div className="stat-value">{qmsHook?.stats?.totalRegistered || 0}</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">✅</div>
                <div className="stat-content">
                  <div className="stat-label">Completed</div>
                  <div className="stat-value">{qmsHook?.stats?.totalCompleted || 0}</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">⏳</div>
                <div className="stat-content">
                  <div className="stat-label">In Progress</div>
                  <div className="stat-value">
                    {Object.values(qmsHook?.stationQueues || {}).reduce((a, b) => a + b.length, 0) +
                      Object.keys(qmsHook?.nowServingByStation || {}).filter(k => qmsHook.nowServingByStation[k]).length}
                  </div>
                </div>
              </div>
            </div>

            {/* Station Queues Grid */}
            <div className="stations-grid">
              {STATIONS.map(station => {
                const queue = qmsHook?.stationQueues?.[station.id] || [];
                const nowServing = qmsHook?.nowServingByStation?.[station.id];
                const stats = qmsHook?.stats?.stationStats?.[station.id] || {};

                return (
                  <div key={station.id} className="station-queue-card" style={{ borderColor: station.color }}>
                    <div className="card-header" style={{ backgroundColor: station.color }}>
                      <span className="icon">{station.icon}</span>
                      <div className="header-text">
                        <h3>{station.code}</h3>
                        <p>{station.name}</p>
                      </div>
                    </div>

                    <div className="card-body">
                      <div className="queue-info">
                        <div className="info-item">
                          <span className="label">Queue:</span>
                          <span className="value">{queue.length} waiting</span>
                        </div>
                        <div className="info-item">
                          <span className="label">Status:</span>
                          <span className={`status ${nowServing ? "serving" : "ready"}`}>
                            {nowServing ? `🔴 Serving: ${nowServing.fullName}` : "🟢 Ready"}
                          </span>
                        </div>
                        <div className="info-item">
                          <span className="label">Total Served:</span>
                          <span className="value">{stats.served || 0}</span>
                        </div>
                        <div className="info-item">
                          <span className="label">Avg Wait:</span>
                          <span className="value">{(stats.averageWaitTime || 0).toFixed(1)} min</span>
                        </div>
                      </div>

                      {/* Queue Preview */}
                      {queue.length > 0 && (
                        <div className="queue-preview-list">
                          <div className="preview-header">Next in Queue:</div>
                          {queue.slice(0, 3).map((patient, idx) => (
                            <div key={patient.id} className="preview-item">
                              <span className="position">#{idx + 1}</span>
                              <span className="ticket">{patient.ticketNumber}</span>
                              <span className="name">{patient.fullName}</span>
                            </div>
                          ))}
                          {queue.length > 3 && (
                            <div className="preview-more">+{queue.length - 3} more</div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
        {/* Public Display View */}
        {activeView === "display" && (
          <div className="display-section">
            <div className="display-header">
              <h1>📺 Now Serving</h1>
            </div>

            <div className="display-grid">
              {STATIONS.map(station => {
                const nowServing = qmsHook?.nowServingByStation?.[station.id];
                const queue = qmsHook?.stationQueues?.[station.id] || [];

                return (
                  <div key={station.id} className="display-card" style={{ backgroundColor: station.color }}>
                    <div className="display-station">
                      <span className="icon">{station.icon}</span>
                      <div className="station-info">
                        <p className="code">{station.code}</p>
                        <p className="name">{station.name}</p>
                      </div>
                    </div>

                    <div className="now-serving">
                      {nowServing ? (
                        <>
                          <p className="label">NOW SERVING:</p>
                          <p className="ticket-number">{nowServing.ticketNumber}</p>
                          <p className="patient-name">{nowServing.fullName}</p>
                        </>
                      ) : (
                        <>
                          <p className="label">READY</p>
                          <p className="next-ticket">Next: {queue[0]?.ticketNumber || "---"}</p>
                        </>
                      )}
                    </div>

                    <div className="queue-status">
                      <p>Waiting: <strong>{queue.length}</strong></p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StationManager;
