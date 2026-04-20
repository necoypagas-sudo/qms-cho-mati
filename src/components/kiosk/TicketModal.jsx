import React from "react";
import { Printer, CheckCircle } from "lucide-react";

export default function TicketModal({ ticket, service, onClose, onPrint, settings }) {
  const { fullTicketNumber, patientName, issuedAt, isPriority } = ticket;

  return (
    <div className="modal-backdrop fade show d-flex align-items-center justify-content-center" style={{ 
      background: "rgba(0,0,0,0.65)",
      backdropFilter: "blur(4px)",
      zIndex: 9999,
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      pointerEvents: "auto"
    }}>
      <div className="modal-dialog" style={{ maxWidth: "500px", zIndex: 10000, pointerEvents: "auto", animation: "fadeInScale 0.3s ease" }}>
        <div className="modal-content shadow-lg" style={{ borderRadius: "12px", border: "none", overflow: "hidden" }}
          {/* Header with accent */}
          <div 
            className="modal-header text-white border-0 py-4"
            style={{ background: service?.color || "#e40914" }}
          >
            <h5 className="modal-title fw-bold">
              {isPriority && "⭐ "}Queue Ticket Issued
            </h5>
          </div>

          {/* Body */}
          <div className="modal-body text-center px-4 py-5">
            {/* Service Icon */}
            <div style={{ fontSize: "56px", marginBottom: "12px" }}>
              {service?.name?.includes("Consultation") && "👨‍⚕️"}
              {service?.name?.includes("Vaccination") && "💉"}
              {service?.name?.includes("Emergency") && "🚨"}
              {service?.name?.includes("Immunization") && "🛡️"}
              {service?.name?.includes("Prenatal") && "🤰"}
              {service?.name?.includes("Pediatrics") && "👶"}
            </div>

            {/* Ticket Number - Large Display */}
            <div style={{ marginBottom: "16px" }}>
              <small className="text-muted text-uppercase fw-bold d-block" style={{ letterSpacing: "1px", marginBottom: "8px" }}>
                Your Queue Number
              </small>
              <div 
                style={{
                  fontSize: "72px",
                  fontWeight: "900",
                  lineHeight: "1",
                  color: service?.color || "#e40914",
                  marginBottom: "8px",
                }}
              >
                {fullTicketNumber}
              </div>
            </div>

            {/* Service & Time Info */}
            <div className="alert alert-light mb-3">
              <strong>{service?.name}</strong> <br />
              <small className="text-muted">
                Issued: {new Date(issuedAt).toLocaleTimeString("en-PH", { hour: "2-digit", minute: "2-digit" })}
              </small>
              {patientName && patientName !== "Patient" && (
                <><br /><small className="text-muted">Name: {patientName}</small></>
              )}
            </div>

            {/* Success Message */}
            <div className="alert alert-success mb-3 d-flex align-items-center justify-content-center gap-2">
              <CheckCircle size={18} />
              <span>Ticket successfully issued!</span>
            </div>

            {/* Important Notes */}
            <div className="alert alert-warning small">
              <strong>⚠️ Important:</strong>
              <ul className="mb-0 mt-2 text-start">
                <li>Please keep this ticket safe</li>
                <li>Listen for your number to be called</li>
                <li>Do not leave the waiting area</li>
              </ul>
            </div>
          </div>

          {/* Footer */}
          <div className="modal-footer bg-light border-top">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={onClose}
            >
              Close
            </button>
            {settings?.ticketSettings?.autoprint === false && (
              <button
                type="button"
                className="btn btn-primary"
                onClick={onPrint}
              >
                <Printer size={16} className="me-1" style={{ display: "inline" }} />
                Print Ticket
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
