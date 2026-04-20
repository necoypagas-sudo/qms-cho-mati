import React, { useState } from "react";
import { X } from "lucide-react";

export default function PhoneModal({ svc, queueCount, nowServing, onConfirm, onCancel, settings }) {
  const [phone, setPhone] = useState("");
  const [isPriority, setIsPriority] = useState(false);

  return (
    <div className="modal-backdrop fade show d-flex align-items-center justify-content-center" style={{ background: "rgba(0,0,0,0.7)" }}>
      <div className="modal-dialog" style={{ maxWidth: "420px" }}>
        <div className="modal-content shadow-lg">
          {/* Header */}
          <div className="modal-header bg-light border-0">
            <button type="button" className="btn-close" onClick={onCancel}></button>
          </div>

          {/* Body */}
          <div className="modal-body text-center px-5 py-4">
            {/* Service Icon */}
            <div style={{ fontSize: "64px", marginBottom: "16px" }}>
              {svc.name.includes("Consultation") && "👨‍⚕️"}
              {svc.name.includes("Vaccination") && "💉"}
              {svc.name.includes("Emergency") && "🚨"}
              {svc.name.includes("Immunization") && "🛡️"}
              {svc.name.includes("Prenatal") && "🤰"}
              {svc.name.includes("Pediatrics") && "👶"}
            </div>

            {/* Service Name */}
            <h4 className="fw-bold mb-2" style={{ color: svc.color }}>
              {svc.name}
            </h4>

            {/* Queue Info */}
            <div className="alert alert-info small mb-4">
              <strong>Currently Serving:</strong> {nowServing?.fullTicketNumber || "—"} <br />
              <strong>Waiting:</strong> {queueCount} patients
            </div>

            {/* Phone Input */}
            <div className="mb-3">
              <label className="form-label fw-bold small text-uppercase text-muted">
                📱 Phone Number (Optional)
              </label>
              <input
                type="tel"
                className="form-control form-control-lg text-center"
                placeholder="09XXXXXXXXX"
                value={phone}
                maxLength={11}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                style={{ letterSpacing: "2px", fontSize: "1.1rem" }}
              />
              <small className="text-muted d-block mt-1">
                Optional — Receive SMS when your number is called
              </small>
            </div>

            {/* Priority Checkbox (if enabled) */}
            {settings?.ticketSettings?.showPriority && (
              <div className="form-check mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="priority"
                  checked={isPriority}
                  onChange={(e) => setIsPriority(e.target.checked)}
                />
                <label className="form-check-label" htmlFor="priority">
                  ★ Senior/PWD/Pregnant (Priority)
                </label>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="modal-footer bg-light border-top">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-lg fw-bold"
              style={{ background: svc.color, color: "#fff" }}
              onClick={() => onConfirm(phone)}
            >
              Get Queue Number ✓
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
