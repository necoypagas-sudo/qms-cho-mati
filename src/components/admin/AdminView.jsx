import React, { useState } from "react";
import QueueTab from "./QueueTab";
import ServicesTab from "./ServicesTab";
import { Zap, Wrench, BarChart3 } from "lucide-react";

export default function AdminView({ services, setServices, queues, nowServing, callNext, markDone, nextStep, previousStep, clearQueue, stats, resetStats, settings }) {
  const [tab, setTab] = useState("queue");

  return (
    <div className="container-fluid py-4" style={{ background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)", minHeight: "90vh" }}>
      <div className="row justify-content-center">
        <div className="col-lg-11">
          {/* Header */}
          <h2 className="mb-4 fw-bold">Administration Panel</h2>

          {/* Tabs */}
          <div className="nav nav-tabs mb-4 border-bottom" role="tablist">
            <button
              className={`nav-link ${tab === "queue" ? "active" : ""}`}
              onClick={() => setTab("queue")}
              style={{ fontSize: "1rem", fontWeight: "500" }}
            >
              <Zap size={18} className="me-2" style={{ display: "inline" }} />
              Queue Management
            </button>
            <button
              className={`nav-link ${tab === "services" ? "active" : ""}`}
              onClick={() => setTab("services")}
              style={{ fontSize: "1rem", fontWeight: "500" }}
            >
              <Wrench size={18} className="me-2" style={{ display: "inline" }} />
              Services Management
            </button>
            <button
              className={`nav-link ${tab === "stats" ? "active" : ""}`}
              onClick={() => setTab("stats")}
              style={{ fontSize: "1rem", fontWeight: "500" }}
            >
              <BarChart3 size={18} className="me-2" style={{ display: "inline" }} />
              Statistics
            </button>
          </div>

          {/* Tab Content */}
          {tab === "queue" && (
            <QueueTab 
              services={services} 
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

          {tab === "services" && (
            <ServicesTab 
              services={services} 
              setServices={setServices}
              settings={settings}
            />
          )}

          {tab === "stats" && (
            <div className="row">
              <div className="col-12 mb-3">
                <button 
                  className="btn btn-outline-danger"
                  onClick={() => {
                    if (window.confirm('Are you sure you want to reset all statistics? This action cannot be undone.')) {
                      resetStats();
                    }
                  }}
                >
                  Reset Statistics
                </button>
              </div>
              <div className="col-md-6">
                <div className="card">
                  <div className="card-header">
                    <h5 className="card-title mb-0">Overall Statistics</h5>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-6">
                        <div className="text-center">
                          <h3 className="text-primary">{stats.totalServed}</h3>
                          <p className="text-muted mb-0">Total Served</p>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="text-center">
                          <h3 className="text-success">{stats.averageWaitTime.toFixed(1)}m</h3>
                          <p className="text-muted mb-0">Avg Wait Time</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="card">
                  <div className="card-header">
                    <h5 className="card-title mb-0">Service Statistics</h5>
                  </div>
                  <div className="card-body">
                    {services.map(service => {
                      const serviceStat = stats.serviceStats[service.id] || { served: 0, averageWaitTime: 0 };
                      return (
                        <div key={service.id} className="d-flex justify-content-between align-items-center mb-2">
                          <span style={{ color: service.color, fontWeight: 'bold' }}>{service.name}</span>
                          <span>{serviceStat.served} served ({serviceStat.averageWaitTime.toFixed(1)}m avg)</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
