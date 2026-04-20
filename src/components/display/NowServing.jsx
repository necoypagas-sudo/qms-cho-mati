import React from "react";
import { Users } from "lucide-react";

export default function NowServing({ services, queues, nowServing, settings }) {
  const primaryColor = settings?.organization?.color || "#e40914";

  return (
    <div className="d-flex flex-column h-100 p-4" style={{ background: "#f8f9fa" }}>
      {/* Header */}
      <div className="mb-4" style={{ paddingBottom: "1rem", borderBottom: `3px solid ${primaryColor}` }}>
        <div className="d-flex align-items-center gap-3 mb-2">
          <Users size={28} style={{ color: primaryColor }} />
          <h3 className="mb-0 fw-bold" style={{ color: primaryColor, fontSize: "1.8rem" }}>
            NOW SERVING
          </h3>
        </div>
        <small className="text-muted" style={{ fontSize: "0.95rem" }}>
          Please proceed to the station when your number is called
        </small>
      </div>

      {/* Service Grid */}
      <div className="row g-4 flex-fill" style={{ overflow: "auto", paddingRight: "8px" }}>
        {services.map((svc) => {
          const serving = nowServing[svc.id];
          const waitCount = (queues[svc.id] || []).length;
          
          return (
            <div key={svc.id} className="col-md-12 col-lg-6" style={{ minWidth: "0" }}>
              <style>{`
                @keyframes pulse-glow-${svc.id} {
                  0%, 100% { 
                    box-shadow: 0 0 0 0 ${svc.color}80;
                  }
                  50% { 
                    box-shadow: 0 0 0 15px ${svc.color}00;
                  }
                }
                @keyframes float-${svc.id} {
                  0%, 100% { transform: translateY(0px); }
                  50% { transform: translateY(-8px); }
                }
              `}</style>
              
              <div
                className="card h-100 shadow-lg"
                style={{
                  borderRadius: "12px",
                  border: `4px solid ${svc.color}`,
                  background: serving ? `linear-gradient(135deg, ${svc.color}10 0%, ${svc.color}05 100%)` : "#ffffff",
                  transition: "all 0.3s ease",
                  position: "relative",
                  overflow: "hidden"
                }}
              >
                {serving && (
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      width: "60px",
                      height: "60px",
                      background: `radial-gradient(circle, ${svc.color}30 0%, transparent 70%)`,
                      borderRadius: "0 12px 0 100%",
                    }}
                  />
                )}

                {/* Service Header */}
                <div className="card-header border-0" style={{ background: `linear-gradient(135deg, ${svc.color} 0%, ${svc.color}dd 100%)`, color: "#fff", padding: "1.2rem", borderTopLeftRadius: "8px", borderTopRightRadius: "8px" }}>
                  <div className="d-flex align-items-center justify-content-between">
                    <span className="fw-bold" style={{ fontSize: "1.1rem" }}>
                      <span style={{ fontSize: "1.5rem", marginRight: "0.5rem" }}>
                        {svc.name.includes("Consultation") && "👨‍⚕️"}
                        {svc.name.includes("Vaccination") && "💉"}
                        {svc.name.includes("Emergency") && "🚨"}
                        {svc.name.includes("Immunization") && "🛡️"}
                        {svc.name.includes("Prenatal") && "🤰"}
                        {svc.name.includes("Pediatrics") && "👶"}
                        {!svc.name.match(/(Consultation|Vaccination|Emergency|Immunization|Prenatal|Pediatrics)/) && "🏥"}
                      </span>
                      {svc.name}
                    </span>
                    <span className="badge bg-light text-dark" style={{ fontSize: "0.9rem", padding: "0.5rem 0.8rem" }}>
                      {svc.code}
                    </span>
                  </div>
                </div>

                {/* Service Body */}
                <div className="card-body d-flex flex-column align-items-center justify-content-center py-5" style={{ minHeight: "200px" }}>
                  {serving ? (
                    <>
                      {/* Animated Ticket Number */}
                      <div
                        style={{
                          animation: `pulse-glow-${svc.id} 2s infinite`,
                          borderRadius: "12px",
                          padding: "8px",
                          marginBottom: "1rem"
                        }}
                      >
                        <div
                          style={{
                            fontSize: "4.5rem",
                            fontWeight: "900",
                            lineHeight: "1",
                            color: svc.color,
                            textShadow: `0 2px 8px ${svc.color}40`
                          }}
                        >
                          {serving.fullTicketNumber}
                        </div>
                      </div>
                      
                      {/* Patient Info */}
                      <div className="text-center mb-3">
                        <div className="badge bg-light text-dark mb-2" style={{ padding: "0.75rem 1rem", fontSize: "0.95rem" }}>
                          <strong>Patient:</strong> {serving.patientName}
                        </div>
                      </div>
                      
                      {/* Status Badge */}
                      <div style={{ 
                        display: "inline-block", 
                        padding: "0.5rem 1.2rem", 
                        background: svc.color, 
                        color: "white",
                        borderRadius: "20px",
                        fontWeight: "600",
                        fontSize: "0.9rem",
                        animation: `pulse-glow-${svc.id} 2s infinite`
                      }}>
                        🔴 PLEASE PROCEED TO WINDOW
                      </div>
                    </>
                  ) : (
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: "3.5rem", color: "#ddd", marginBottom: "1rem" }}>
                        —
                      </div>
                      <small className="text-muted">No one being served</small>
                    </div>
                  )}
                </div>

                {/* Queue Count Footer */}
                <div className="card-footer bg-light border-top" style={{ padding: "1rem", borderBottomLeftRadius: "8px", borderBottomRightRadius: "8px" }}>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-muted fw-600">Waiting in Queue:</span>
                    <div style={{ 
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "50px",
                      height: "50px",
                      borderRadius: "50%",
                      background: svc.color,
                      color: "white",
                      fontWeight: "900",
                      fontSize: "1.5rem",
                      boxShadow: `0 2px 8px ${svc.color}40`
                    }}>
                      {waitCount}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
