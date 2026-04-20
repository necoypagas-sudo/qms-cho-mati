import React from "react";
import { Users } from "lucide-react";

export default function NowServing({ services, queues, nowServing, settings }) {
  const primaryColor = settings?.organization?.color || "#e40914";

  return (
    <div className="d-flex flex-column h-100 p-3">
      {/* Header */}
      <div className="d-flex align-items-center gap-2 mb-3">
        <Users size={20} style={{ color: primaryColor }} />
        <h5 className="mb-0 fw-bold">NOW SERVING</h5>
      </div>

      {/* Service Grid */}
      <div className="row g-3 flex-fill" style={{ overflow: "auto" }}>
        {services.map((svc) => (
          <div key={svc.id} className="col-md-12 col-lg-6" style={{ minWidth: "0" }}>
            <div
              className="card h-100 shadow-sm"
              style={{
                border: `3px solid ${svc.color}`,
                background: nowServing[svc.id] ? `${svc.color}10` : "#fff",
                transition: "all 0.3s ease",
                position: "relative",
              }}
            >
              {/* Service Header */}
              <div className="card-header" style={{ background: svc.color, color: "#fff" }}>
                <span className="fw-bold">
                  {svc.name.includes("Consultation") && "👨‍⚕️"}
                  {svc.name.includes("Vaccination") && "💉"}
                  {svc.name.includes("Emergency") && "🚨"}
                  {svc.name.includes("Immunization") && "🛡️"}
                  {svc.name.includes("Prenatal") && "🤰"}
                  {svc.name.includes("Pediatrics") && "👶"}
                  {" "}{svc.name} <small>({svc.code})</small>
                </span>
              </div>

              {/* Service Body */}
              <div className="card-body d-flex flex-column align-items-center justify-content-center py-4">
                {nowServing[svc.id] ? (
                  <>
                    {/* Pulse animation for active service */}
                    <style>{`
                      @keyframes pulse-${svc.id} {
                        0%, 100% { box-shadow: 0 0 0 0 rgba(${parseInt(svc.color.slice(1,3), 16)}, ${parseInt(svc.color.slice(3,5), 16)}, ${parseInt(svc.color.slice(5,7), 16)}, 0.7); }
                        50% { box-shadow: 0 0 0 10px rgba(${parseInt(svc.color.slice(1,3), 16)}, ${parseInt(svc.color.slice(3,5), 16)}, ${parseInt(svc.color.slice(5,7), 16)}, 0); }
                      }
                    `}</style>
                    <div
                      style={{
                        animation: `pulse-${svc.id} 2s infinite`,
                        borderRadius: "50%",
                        padding: "4px",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "56px",
                          fontWeight: "900",
                          lineHeight: "1",
                          color: svc.color,
                        }}
                      >
                        {nowServing[svc.id].fullTicketNumber}
                      </div>
                    </div>
                    <small className="text-muted mt-2">Currently Serving</small>
                  </>
                ) : (
                  <div style={{ fontSize: "48px", color: "#ccc" }}>—</div>
                )}
              </div>

              {/* Queue Count */}
              <div className="card-footer bg-light border-top">
                <div className="d-flex justify-content-between align-items-center">
                  <span className="text-muted">Waiting:</span>
                  <strong style={{ color: svc.color, fontSize: "1.3rem" }}>
                    {(queues[svc.id] || []).length}
                  </strong>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
