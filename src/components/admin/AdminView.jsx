import React, { useState } from "react";
import QueueTab from "./QueueTab";
import ServicesTab from "./ServicesTab";
import { Zap, Wrench } from "lucide-react";

export default function AdminView({ services, setServices, queues, nowServing, callNext, markDone, nextStep, previousStep, clearQueue, settings }) {
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
        </div>
      </div>
    </div>
  );
}
