import React from "react";
import { Phone, Trash2, SkipForward, ChevronRight, ChevronLeft, Check } from "lucide-react";

export default function QueueTab({ services, queues, nowServing, callNext, markDone, nextStep, previousStep, clearQueue, settings }) {
  return (
    <div className="row g-4">
      {services.map((svc) => {
        const q = queues[svc.id] || [];
        const disabled = q.length === 0;
        const nowServingPatient = nowServing[svc.id];

        return (
          <div key={svc.id} className="col-lg-6">
            <div className="card shadow-sm h-100 border-0" style={{ borderLeft: `5px solid ${svc.color}`, borderRadius: "10px" }}>
              {/* Header */}
              <div className="card-header border-0" style={{ background: `linear-gradient(135deg, ${svc.color} 0%, ${svc.color}dd 100%)`, color: "#fff", borderTopLeftRadius: "9px", borderTopRightRadius: "9px", padding: "1.2rem" }}>
                <h5 className="mb-0 fw-bold d-flex align-items-center gap-2" style={{ fontSize: "1.1rem" }}>
                  <span style={{ fontSize: "1.5rem" }}>
                    {svc.name.includes("Consultation") && "👨‍⚕️"}
                    {svc.name.includes("Vaccination") && "💉"}
                    {svc.name.includes("Emergency") && "🚨"}
                    {svc.name.includes("Immunization") && "🛡️"}
                    {svc.name.includes("Prenatal") && "🤰"}
                    {svc.name.includes("Pediatrics") && "👶"}
                    {!svc.name.match(/(Consultation|Vaccination|Emergency|Immunization|Prenatal|Pediatrics)/) && "🏥"}
                  </span>
                  {svc.name}
                  <span className="badge bg-light text-dark ms-auto">{svc.code}</span>
                </h5>
              </div>

              {/* Body */}
              <div className="card-body">
                {/* Now Serving - Large Display */}
                <div className="mb-4 p-4 text-center" style={{ background: `${svc.color}08`, borderRadius: "10px", border: `2px solid ${svc.color}30` }}>
                  <small className="text-muted text-uppercase fw-bold d-block mb-3" style={{ letterSpacing: "1px", fontSize: "0.75rem" }}>Now Serving</small>
                  <div style={{ fontSize: "3.5rem", fontWeight: "900", color: svc.color, lineHeight: "1", marginBottom: "8px" }}>
                    {nowServingPatient?.fullTicketNumber || "—"}
                  </div>
                  {nowServingPatient && (
                    <small className="text-dark fw-600">
                      Patient: <strong>{nowServingPatient.patientName}</strong>
                    </small>
                  )}
                </div>

                {/* Workflow Steps - Improved Visualization */}
                {nowServingPatient?.steps && nowServingPatient.steps.length > 0 && (
                  <div className="mb-4">
                    <small className="text-muted text-uppercase fw-bold d-block mb-3" style={{ letterSpacing: "1px", fontSize: "0.75rem" }}>Service Workflow</small>
                    
                    {/* Horizontal Step Indicator */}
                    <div style={{ display: "flex", alignItems: "center", gap: "0", marginBottom: "12px" }}>
                      {nowServingPatient.steps.map((step, idx) => {
                        const isCompleted = idx < nowServingPatient.currentStep;
                        const isCurrent = idx === nowServingPatient.currentStep;
                        return (
                          <React.Fragment key={idx}>
                            {/* Step Badge */}
                            <div
                              style={{
                                flex: "1",
                                textAlign: "center",
                                position: "relative"
                              }}
                            >
                              <div
                                style={{
                                  width: "40px",
                                  height: "40px",
                                  borderRadius: "50%",
                                  margin: "0 auto 8px",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontWeight: "bold",
                                  fontSize: "1.1rem",
                                  background: isCompleted ? "#198754" : isCurrent ? svc.color : "#e9ecef",
                                  color: isCompleted || isCurrent ? "#fff" : "#999",
                                  boxShadow: isCurrent ? `0 0 0 3px ${svc.color}30` : "none",
                                  transition: "all 0.2s ease"
                                }}
                              >
                                {isCompleted ? <Check size={20} /> : idx + 1}
                              </div>
                              <small style={{ 
                                display: "block", 
                                fontSize: "0.75rem",
                                color: isCurrent ? svc.color : "#666",
                                fontWeight: isCurrent ? "600" : "400",
                                maxWidth: "80px",
                                margin: "0 auto",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap"
                              }}>
                                {step}
                              </small>
                            </div>

                            {/* Connector Line */}
                            {idx < nowServingPatient.steps.length - 1 && (
                              <div style={{
                                width: "0",
                                height: "2px",
                                background: isCompleted ? "#198754" : "#e9ecef",
                                transition: "background 0.2s ease"
                              }} />
                            )}
                          </React.Fragment>
                        );
                      })}
                    </div>

                    {/* Step Navigation Buttons */}
                    <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                      {nowServingPatient.currentStep > 0 && (
                        <button
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() => previousStep(svc.id)}
                          style={{ fontSize: "0.9rem", padding: "6px 12px", borderRadius: "6px" }}
                          title="Go to previous step"
                        >
                          <ChevronLeft size={16} className="me-1" style={{ display: "inline" }} />
                          Previous Step
                        </button>
                      )}
                      {nowServingPatient.currentStep < nowServingPatient.steps.length - 1 && (
                        <button
                          className="btn btn-sm"
                          onClick={() => nextStep(svc.id)}
                          style={{
                            background: svc.color,
                            color: "#fff",
                            fontSize: "0.9rem",
                            padding: "6px 12px",
                            borderRadius: "6px",
                            border: "none"
                          }}
                          title="Move to next step"
                        >
                          Next Step
                          <ChevronRight size={16} className="ms-1" style={{ display: "inline" }} />
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Queue List */}
                <div className="mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <small className="text-muted text-uppercase fw-bold" style={{ letterSpacing: "1px", fontSize: "0.75rem" }}>
                      Waiting Queue
                    </small>
                    <span className="badge bg-light text-dark">{q.length} patients</span>
                  </div>
                  {q.length === 0 ? (
                    <div className="alert alert-info mb-0 small" style={{ borderRadius: "6px" }}>
                      ✓ No patients waiting
                    </div>
                  ) : (
                    <div style={{ maxHeight: "150px", overflowY: "auto", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(70px, 1fr))", gap: "8px" }}>
                      {q.map((ticket, idx) => (
                        <div
                          key={ticket.id}
                          style={{
                            padding: "10px 8px",
                            background: idx === 0 ? svc.color : "#f8f9fa",
                            color: idx === 0 ? "#fff" : "#000",
                            borderRadius: "6px",
                            textAlign: "center",
                            fontWeight: "600",
                            fontSize: "0.9rem",
                            border: idx === 0 ? `2px solid ${svc.color}` : "1px solid #dee2e6",
                            boxShadow: idx === 0 ? `0 0 0 2px ${svc.color}20` : "none",
                            position: "relative"
                          }}
                        >
                          {idx === 0 && <span style={{ position: "absolute", top: "-8px", left: "50%", transform: "translateX(-50%)", background: svc.color, color: "white", padding: "2px 6px", fontSize: "0.7rem", borderRadius: "10px", fontWeight: "bold" }}>NEXT</span>}
                          <div>{ticket.fullTicketNumber}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="d-grid gap-2">
                  <button
                    className="btn fw-bold py-2"
                    style={{
                      background: svc.color,
                      color: "#fff",
                      border: "none",
                      borderRadius: "6px",
                      fontSize: "0.95rem",
                      opacity: disabled ? 0.5 : 1,
                      cursor: disabled ? "not-allowed" : "pointer"
                    }}
                    disabled={disabled}
                    onClick={() => callNext(svc.id)}
                    title={disabled ? "No patients in queue" : "Call the next patient"}
                  >
                    <SkipForward size={16} className="me-2" style={{ display: "inline" }} />
                    Call Next Patient
                  </button>

                  {nowServingPatient && (
                    <button
                      className="btn btn-outline-success btn-sm py-2"
                      onClick={() => markDone(svc.id)}
                      style={{ borderRadius: "6px", fontSize: "0.9rem", fontWeight: "500" }}
                      title="Mark current patient as done"
                    >
                      <Check size={16} className="me-1" style={{ display: "inline" }} />
                      Mark as Complete
                    </button>
                  )}

                  {q.length > 0 && (
                    <button
                      className="btn btn-outline-danger btn-sm py-2"
                      onClick={() => {
                        if (window.confirm(`Clear all ${q.length} patients in queue? This cannot be undone.`)) {
                          clearQueue(svc.id);
                        }
                      }}
                      style={{ borderRadius: "6px", fontSize: "0.9rem", fontWeight: "500" }}
                      title="Clear all patients in queue"
                    >
                      <Trash2 size={16} className="me-1" style={{ display: "inline" }} />
                      Clear Queue
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
                    </button>
                  )}

                  {q.length > 0 && (
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => {
                        if (window.confirm(`Clear all ${q.length} patients in queue?`)) {
                          clearQueue(svc.id);
                        }
                      }}
                    >
                      <Trash2 size={14} className="me-1" style={{ display: "inline" }} />
                      Clear Queue
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
