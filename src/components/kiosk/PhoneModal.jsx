import React, { useState } from "react";

export default function PhoneModal({ svc, queueCount, nowServing, onConfirm, onCancel, settings }) {
  const [phone, setPhone] = useState("");
  const [isPriority, setIsPriority] = useState(false);

  return (
    <div style={{ 
      background: "rgba(0,0,0,0.7)",
      zIndex: 9999,
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
      <div className="modal-dialog" style={{ maxWidth: "480px", zIndex: 10000, pointerEvents: "auto" }}>
        <div className="modal-content shadow-2xl" style={{ borderRadius: "16px", border: "none", overflow: "hidden", background: "#fff" }}>
          {/* Colored Header with Service Info */}
          <div 
            className="d-flex align-items-center justify-content-between p-4 text-white"
            style={{ background: svc.color }}
          >
            <div className="d-flex align-items-center gap-3">
              <div style={{ fontSize: "48px" }}>
                {svc.name.includes("Consultation") && "👨‍⚕️"}
                {svc.name.includes("Vaccination") && "💉"}
                {svc.name.includes("Emergency") && "🚨"}
                {svc.name.includes("Immunization") && "🛡️"}
                {svc.name.includes("Prenatal") && "🤰"}
                {svc.name.includes("Pediatrics") && "👶"}
              </div>
              <div>
                <h5 className="mb-0 fw-bold" style={{ fontSize: "1.3rem" }}>
                  {svc.name}
                </h5>
                <small style={{ opacity: 0.9 }}>Service Code: {svc.code}</small>
              </div>
            </div>
            <button 
              type="button" 
              className="btn-close btn-close-white"
              onClick={onCancel}
              style={{ opacity: 1 }}
            ></button>
          </div>

          {/* Body */}
          <div className="modal-body p-4" style={{ background: "#f8f9fa" }}>
            {/* Queue Status */}
            <div className="row g-3 mb-4">
              <div className="col-6">
                <div className="p-3" style={{ background: "#fff", borderRadius: "8px", border: `2px solid ${svc.color}20` }}>
                  <small className="text-muted fw-bold d-block" style={{ fontSize: "0.8rem" }}>Now Serving</small>
                  <h4 className="mb-0 fw-bold" style={{ color: svc.color, fontSize: "1.5rem" }}>
                    {nowServing?.fullTicketNumber || "—"}
                  </h4>
                </div>
              </div>
              <div className="col-6">
                <div className="p-3" style={{ background: "#fff", borderRadius: "8px", border: `2px solid ${svc.color}20` }}>
                  <small className="text-muted fw-bold d-block" style={{ fontSize: "0.8rem" }}>In Queue</small>
                  <h4 className="mb-0 fw-bold" style={{ color: svc.color, fontSize: "1.5rem" }}>
                    {queueCount}
                  </h4>
                </div>
              </div>
            </div>

            {/* Phone Input */}
            <div className="mb-4">
              <label className="form-label fw-bold" style={{ fontSize: "0.95rem", color: "#333" }}>
                📱 Phone Number (Optional)
              </label>
              <input
                type="tel"
                className="form-control form-control-lg"
                placeholder="09XXXXXXXXX"
                value={phone}
                maxLength={11}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                style={{ 
                  letterSpacing: "2px", 
                  fontSize: "1.1rem",
                  borderColor: svc.color,
                  borderWidth: "2px"
                }}
              />
              <small className="text-muted d-block mt-2">
                💬 Optional — Receive SMS notification when your number is called
              </small>
            </div>

            {/* Priority Checkbox (if enabled) */}
            {settings?.ticketSettings?.showPriority && (
              <div className="p-3 mb-4" style={{ background: "#fff3cd", borderRadius: "8px", border: "1px solid #ffc107" }}>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="priority"
                    checked={isPriority}
                    onChange={(e) => setIsPriority(e.target.checked)}
                    style={{ width: "1.25rem", height: "1.25rem", cursor: "pointer" }}
                  />
                  <label className="form-check-label fw-bold ms-2" htmlFor="priority" style={{ cursor: "pointer", fontSize: "0.95rem" }}>
                    ⭐ Senior/PWD/Pregnant (Priority)
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="modal-footer p-3" style={{ background: "#fff", borderTop: "1px solid #e9ecef", gap: "8px" }}>
            <button
              type="button"
              className="btn btn-light fw-bold"
              onClick={onCancel}
              style={{ minWidth: "110px", fontSize: "1rem" }}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-lg fw-bold"
              style={{ 
                background: svc.color, 
                color: "#fff",
                border: "none",
                minWidth: "180px",
                fontSize: "1.05rem",
                boxShadow: `0 4px 12px ${svc.color}40`
              }}
              onClick={() => onConfirm(phone, isPriority)}
            >
              Get Queue Number ✓
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
