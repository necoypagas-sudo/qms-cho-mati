import React, { useState } from "react";
import { Heart, Syringe, AlertCircle } from "lucide-react";
import PhoneModal from "./PhoneModal";
import TicketModal from "./TicketModal";
import { printTicket } from "../../utils/printTicket";

export default function KioskView({ services, queues, nowServing, takeNumber, settings }) {
  const [selectedSvc, setSelectedSvc] = useState(null);
  const [ticket, setTicket] = useState(null);
  const [showPrint, setShowPrint] = useState(false);
  const [patientName, setPatientName] = useState("");

  const handleTakeNumber = (serviceId, name = "Patient", priority = false) => {
    const t = takeNumber(serviceId, name, priority);
    if (t) {
      setTicket(t);
      
      // Auto-print if enabled
      if (settings?.ticketSettings?.autoprint) {
        setTimeout(() => {
          printTicket({
            fullTicketNumber: t.fullTicketNumber,
            patientName: name,
            visitPurpose: services.find(s => s.id === serviceId)?.name || "Service",
            stationName: "Triage Desk",
            issuedAt: t.issuedAt,
            isPriority: priority,
            organizationName: settings.organization.name,
            organizationLocation: settings.organization.location,
          });
        }, 500);
      }
    }
    setSelectedSvc(null);
  };

  const primaryColor = settings?.organization?.color || "#e40914";

  return (
    <div className="container-fluid py-5" style={{ background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)", minHeight: "90vh" }}>
      <div className="row justify-content-center">
        <div className="col-lg-11">
          {/* Header */}
          <div className="text-center mb-6" style={{ paddingBottom: "2rem" }}>
            <h1 className="display-4 fw-bold mb-2" style={{ color: primaryColor, letterSpacing: "-1px" }}>
              🏥 Welcome to {settings?.organization?.name}
            </h1>
            <p className="lead text-dark" style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}>
              {settings?.organization?.location}
            </p>
            <p className="text-muted" style={{ fontSize: "1rem" }}>
              Select a service to receive your queue number
            </p>
          </div>

          {/* Service Grid */}
          <div className="row g-4 mb-5">
            {services.map((service) => {
              const queueLength = (queues[service.id] || []).length;
              const nowServingNumber = nowServing[service.id]?.fullTicketNumber;
              
              return (
                <div key={service.id} className="col-md-6 col-lg-4">
                  <div
                    className="card shadow-sm h-100 cursor-pointer position-relative"
                    onClick={() => setSelectedSvc(service)}
                    style={{
                      border: `4px solid ${service.color}`,
                      borderRadius: "12px",
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      cursor: "pointer",
                      overflow: "hidden"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-12px)";
                      e.currentTarget.style.boxShadow = `0 15px 40px ${service.color}40`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
                    }}
                  >
                    {/* Service Header Bar */}
                    <div
                      className="p-3"
                      style={{ background: service.color, color: "white", textAlign: "center" }}
                    >
                      <small className="fw-bold" style={{ letterSpacing: "1px" }}>
                        {service.code}
                      </small>
                    </div>

                    <div
                      className="card-body text-center py-5"
                      style={{ background: `${service.color}06` }}
                    >
                      {/* Service Icon */}
                      <div className="mb-3">
                        <span style={{ fontSize: "56px", display: "block" }}>
                          {service.name.includes("Consultation") && "👨‍⚕️"}
                          {service.name.includes("Vaccination") && "💉"}
                          {service.name.includes("Emergency") && "🚨"}
                          {service.name.includes("Immunization") && "🛡️"}
                          {service.name.includes("Prenatal") && "🤰"}
                          {service.name.includes("Pediatrics") && "👶"}
                          {!service.name.match(/(Consultation|Vaccination|Emergency|Immunization|Prenatal|Pediatrics)/) && "🏥"}
                        </span>
                      </div>

                      {/* Service Name */}
                      <h5 className="card-title fw-bold mb-4" style={{ color: service.color, fontSize: "1.2rem" }}>
                        {service.name}
                      </h5>

                      {/* Queue Stats - Two column layout */}
                      <div className="row g-3 mb-4">
                        <div className="col-6">
                          <div style={{ padding: "12px", background: "white", borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                            <small className="text-muted d-block fw-600" style={{ fontSize: "0.85rem", marginBottom: "4px" }}>
                              Now Serving
                            </small>
                            <div style={{ color: service.color, fontSize: "1.8rem", fontWeight: "900", lineHeight: "1" }}>
                              {nowServingNumber || "—"}
                            </div>
                          </div>
                        </div>
                        <div className="col-6">
                          <div style={{ padding: "12px", background: "white", borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                            <small className="text-muted d-block fw-600" style={{ fontSize: "0.85rem", marginBottom: "4px" }}>
                              In Queue
                            </small>
                            <div style={{ color: service.color, fontSize: "1.8rem", fontWeight: "900", lineHeight: "1" }}>
                              {queueLength}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* CTA Button */}
                      <button
                        className="btn w-100 fw-bold py-2 mt-2"
                        style={{ 
                          background: service.color, 
                          color: "white",
                          fontSize: "1rem",
                          border: "none",
                          borderRadius: "8px",
                          transition: "all 0.2s ease",
                          boxShadow: `0 4px 12px ${service.color}30`
                        }}
                        onClick={() => setSelectedSvc(service)}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "translateY(-2px)";
                          e.currentTarget.style.boxShadow = `0 6px 16px ${service.color}40`;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "translateY(0)";
                          e.currentTarget.style.boxShadow = `0 4px 12px ${service.color}30`;
                        }}
                      >
                        Get Your Number →
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Info Box with Tips */}
          <div className="row">
            <div className="col-lg-8 mx-auto">
              <div className="alert alert-info mb-0" style={{ borderRadius: "8px", border: "2px solid #0dcaf0", background: "#e7f3ff", padding: "1.5rem" }}>
                <div className="d-flex gap-3">
                  <span style={{ fontSize: "1.8rem" }}>💡</span>
                  <div>
                    <strong style={{ fontSize: "1.1rem", color: "#004085" }}>Important Information:</strong>
                    <ul className="mb-0 mt-2 ps-0" style={{ color: "#004085", fontSize: "0.95rem" }}>
                      <li>✓ Click on any service card to receive your queue number</li>
                      <li>✓ Keep your ticket safe and listen for your number</li>
                      <li>✓ Do not leave the waiting area</li>
                      <li>✓ Approximate wait time: 5-15 minutes per patient</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Service Selection Modal */}
      {selectedSvc && (
        <PhoneModal
          svc={selectedSvc}
          queueCount={(queues[selectedSvc.id] || []).length}
          nowServing={nowServing[selectedSvc.id]}
          onConfirm={(phone) => handleTakeNumber(selectedSvc.id, phone || "Patient", false)}
          onCancel={() => setSelectedSvc(null)}
          settings={settings}
        />
      )}

      {/* Ticket Display Modal */}
      {ticket && (
        <TicketModal
          ticket={ticket}
          service={services.find(s => s.id === ticket.serviceId)}
          onClose={() => setTicket(null)}
          onPrint={() => {
            printTicket({
              fullTicketNumber: ticket.fullTicketNumber,
              patientName: ticket.patientName,
              visitPurpose: services.find(s => s.id === ticket.serviceId)?.name,
              stationName: "Triage Desk",
              issuedAt: ticket.issuedAt,
              isPriority: ticket.isPriority,
              organizationName: settings.organization.name,
              organizationLocation: settings.organization.location,
            });
          }}
          settings={settings}
        />
      )}
    </div>
  );
}
