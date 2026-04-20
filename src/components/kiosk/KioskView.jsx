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
    <div className="container-fluid py-4" style={{ background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)", minHeight: "90vh" }}>
      <div className="row justify-content-center">
        <div className="col-lg-10">
          {/* Header */}
          <div className="text-center mb-5">
            <h1 className="display-5 fw-bold mb-2" style={{ color: primaryColor }}>
              Welcome! 🏥
            </h1>
            <p className="lead text-muted">
              Select a service to receive your queue number
            </p>
          </div>

          {/* Service Grid */}
          <div className="row g-3 mb-4">
            {services.map((service) => (
              <div key={service.id} className="col-md-6 col-lg-4">
                <div
                  className="card shadow-sm h-100 cursor-pointer"
                  onClick={() => setSelectedSvc(service)}
                  style={{
                    border: `3px solid ${service.color}`,
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-8px)";
                    e.currentTarget.style.boxShadow = `0 10px 30px ${service.color}44`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 0.125rem 0.25rem rgba(0,0,0,0.075)";
                  }}
                >
                  <div
                    className="card-body text-center py-4"
                    style={{ background: `${service.color}08` }}
                  >
                    {/* Service Icon */}
                    <div className="mb-3">
                      <span style={{ fontSize: "48px" }}>
                        {service.name.includes("Consultation") && "👨‍⚕️"}
                        {service.name.includes("Vaccination") && "💉"}
                        {service.name.includes("Emergency") && "🚨"}
                        {service.name.includes("Immunization") && "🛡️"}
                        {service.name.includes("Prenatal") && "🤰"}
                        {service.name.includes("Pediatrics") && "👶"}
                      </span>
                    </div>

                    {/* Service Name */}
                    <h5 className="card-title fw-bold mb-3" style={{ color: service.color }}>
                      {service.name}
                    </h5>

                    {/* Service Code */}
                    <div className="mb-3">
                      <span className="badge" style={{ background: service.color }}>
                        {service.code}
                      </span>
                    </div>

                    {/* Queue Stats */}
                    <div className="row g-2 text-center">
                      <div className="col-6">
                        <small className="text-muted d-block">Waiting</small>
                        <strong style={{ color: service.color, fontSize: "1.3rem" }}>
                          {(queues[service.id] || []).length}
                        </strong>
                      </div>
                      <div className="col-6">
                        <small className="text-muted d-block">Now Serving</small>
                        <strong style={{ color: service.color, fontSize: "1.3rem" }}>
                          {nowServing[service.id]?.fullTicketNumber || "—"}
                        </strong>
                      </div>
                    </div>

                    {/* Call to Action */}
                    <button
                      className="btn btn-sm mt-3 w-100"
                      style={{ background: service.color, color: "#fff" }}
                      onClick={() => setSelectedSvc(service)}
                    >
                      Get Number →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Info Box */}
          <div className="alert alert-info text-center">
            <strong>💡 Tip:</strong> Click on any service card to receive your queue number. Please keep your ticket!
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
