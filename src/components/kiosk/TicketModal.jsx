import React from "react";

export default function TicketModal({ ticket, service, onClose, onPrint, settings }) {
  const { fullTicketNumber, patientName, issuedAt, isPriority } = ticket;

  return (
    <div style={{ 
      background: "rgba(0,0,0,0.7)",
      zIndex: 10001,
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      pointerEvents: "auto"
    }}>
      <div className="modal-dialog" style={{ maxWidth: "520px", zIndex: 10002, pointerEvents: "auto" }}>
        <div className="modal-content shadow-2xl" style={{ borderRadius: "16px", border: "none", overflow: "hidden", background: "#fff" }}>
          {/* Header with Service Color */}
          <div 
            className="text-white p-4"
            style={{ background: service?.color || "#e40914" }}
          >
            <div className="d-flex align-items-center gap-3">
              <div style={{ fontSize: "48px" }}>
                {service?.name?.includes("Consultation") && "👨‍⚕️"}
                {service?.name?.includes("Vaccination") && "💉"}
                {service?.name?.includes("Emergency") && "🚨"}
                {service?.name?.includes("Immunization") && "🛡️"}
                {service?.name?.includes("Prenatal") && "🤰"}
                {service?.name?.includes("Pediatrics") && "👶"}
              </div>
              <div>
                <h5 className="mb-0 fw-bold" style={{ fontSize: "1.2rem" }}>
                  {isPriority ? "⭐ " : ""}Queue Ticket Issued
                </h5>
                <small style={{ opacity: 0.9 }}>Service: {service?.name}</small>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="modal-body p-4" style={{ background: "#f8f9fa" }}>
            {/* Ticket Number - Large Display */}
            <div className="text-center mb-4">
              <small className="text-muted text-uppercase fw-bold d-block" style={{ letterSpacing: "2px", marginBottom: "12px" }}>
                Your Queue Number
              </small>
              <div 
                style={{
                  fontSize: "80px",
                  fontWeight: "900",
                  lineHeight: "1",
                  color: service?.color || "#e40914",
                  marginBottom: "8px",
                  textShadow: `0 2px 8px ${service?.color}30`,
                  padding: "20px 0"
                }}
              >
                {fullTicketNumber}
              </div>
            </div>

            {/* Divider */}
            <hr className="my-3" />

            {/* Ticket Details */}
            <div className="row g-3 mb-4">
              <div className="col-6">
                <div style={{ background: "#fff", padding: "16px", borderRadius: "8px", border: `2px solid ${service?.color}20` }}>
                  <small className="text-muted fw-bold d-block">Issued Time</small>
                  <div className="fw-bold mt-1">
                    {new Date(issuedAt).toLocaleTimeString("en-PH", { hour: "2-digit", minute: "2-digit", hour12: true })}
                  </div>
                </div>
              </div>
              <div className="col-6">
                <div style={{ background: "#fff", padding: "16px", borderRadius: "8px", border: `2px solid ${service?.color}20` }}>
                  <small className="text-muted fw-bold d-block">Service Code</small>
                  <div className="fw-bold mt-1" style={{ color: service?.color, fontSize: "1.1rem" }}>
                    {service?.code}
                  </div>
                </div>
              </div>
            </div>

            {/* Patient Name if provided */}
            {patientName && patientName !== "Patient" && (
              <div className="p-3 mb-3" style={{ background: "#fff", borderRadius: "8px", textAlign: "center", border: `1px solid #e9ecef` }}>
                <small className="text-muted fw-bold">Patient Name</small>
                <div className="fw-bold mt-1">{patientName}</div>
              </div>
            )}

            {/* Success Alert */}
            <div className="alert alert-success mb-3 d-flex align-items-center justify-content-center gap-2" style={{ border: "none", background: "#d4edda" }}>
              <span style={{ fontSize: "1.5rem" }}>✅</span>
              <strong>Ticket successfully issued!</strong>
            </div>

            {/* Important Instructions */}
            <div className="p-3 mb-3" style={{ background: "#fffbea", borderRadius: "8px", border: "1px solid #ffe66d" }}>
              <strong style={{ fontSize: "0.95rem", color: "#856404" }}>📋 Instructions:</strong>
              <ul className="mb-0 mt-2 ps-3" style={{ fontSize: "0.9rem", color: "#856404" }}>
                <li>Keep this ticket in a safe place</li>
                <li>Wait for your number to be called</li>
                <li>Do not leave the waiting area</li>
                <li>Check the display screens for updates</li>
              </ul>
            </div>
          </div>

          {/* Footer */}
          <div className="modal-footer p-3" style={{ background: "#fff", borderTop: "1px solid #e9ecef", gap: "8px" }}>
            <button
              type="button"
              className="btn btn-light fw-bold"
              onClick={onClose}
              style={{ minWidth: "110px" }}
            >
              Close
            </button>
            {settings?.ticketSettings?.autoprint === false && (
              <button
                type="button"
                className="btn fw-bold"
                onClick={onPrint}
                style={{ 
                  background: service?.color || "#e40914", 
                  color: "#fff",
                  border: "none",
                  minWidth: "140px"
                }}
              >
                🖨️ Print Ticket
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
