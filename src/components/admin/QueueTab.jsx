import React from "react";
import { Phone, Trash2, SkipForward, ChevronRight, ChevronLeft, Check } from "lucide-react";

export default function QueueTab({ services, queues, nowServing, callNext, markDone, nextStep, previousStep, clearQueue, settings }) {
  return (
    <div className="row g-4">
      {services.map((svc) => {
        const q = queues[svc.id] || [];
        const disabled = q.length === 0;

        return (
          <div key={svc.id} className="col-lg-6">
            <div className="card shadow-sm h-100" style={{ border: `3px solid ${svc.color}` }}>
              {/* Header */}
              <div className="card-header" style={{ background: svc.color, color: "#fff" }}>
                <h5 className="mb-0 fw-bold">
                  {svc.name.includes("Consultation") && "👨‍⚕️"}
                  {svc.name.includes("Vaccination") && "💉"}
                  {svc.name.includes("Emergency") && "🚨"}
                  {svc.name.includes("Immunization") && "🛡️"}
                  {svc.name.includes("Prenatal") && "🤰"}
                  {svc.name.includes("Pediatrics") && "👶"}
                  {" "}{svc.name}
                </h5>
              </div>

              {/* Body */}
              <div className="card-body">
                {/* Now Serving */}
                <div className="mb-4 p-3" style={{ background: `${svc.color}10`, borderRadius: "8px", border: `2px dashed ${svc.color}` }}>
                  <small className="text-muted text-uppercase fw-bold d-block mb-2">Now Serving</small>
                  <div style={{ fontSize: "2.5rem", fontWeight: "900", color: svc.color, lineHeight: "1" }}>
                    {nowServing[svc.id]?.fullTicketNumber || "—"}
                  </div>
                  {nowServing[svc.id] && (
                    <>
                      <small className="text-muted">Patient: {nowServing[svc.id]?.patientName}</small>
                      
                      {/* Workflow Steps */}
                      {nowServing[svc.id]?.steps && nowServing[svc.id].steps.length > 0 && (
                        <div style={{ marginTop: "12px" }}>
                          <small className="text-muted text-uppercase fw-bold d-block mb-8px">Service Steps</small>
                          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "10px" }}>
                            {nowServing[svc.id].steps.map((step, idx) => {
                              const isCompleted = idx < nowServing[svc.id].currentStep;
                              const isCurrent = idx === nowServing[svc.id].currentStep;
                              return (
                                <span
                                  key={idx}
                                  className="badge"
                                  style={{
                                    background: isCompleted ? "#198754" : isCurrent ? svc.color : "#e9ecef",
                                    color: isCompleted || isCurrent ? "#fff" : "#666",
                                    padding: "6px 10px",
                                    fontSize: "11px",
                                    fontWeight: "600",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "4px"
                                  }}
                                >
                                  {isCompleted && <Check size={12} />}
                                  {step}
                                </span>
                              );
                            })}
                          </div>

                          {/* Step Navigation */}
                          <div style={{ display: "flex", gap: "8px" }}>
                            {nowServing[svc.id].currentStep > 0 && (
                              <button
                                className="btn btn-sm btn-outline-secondary"
                                onClick={() => previousStep(svc.id)}
                                style={{ fontSize: "12px", padding: "4px 8px" }}
                              >
                                <ChevronLeft size={14} className="me-1" style={{ display: "inline" }} />
                                Prev
                              </button>
                            )}
                            {nowServing[svc.id].currentStep < nowServing[svc.id].steps.length - 1 && (
                              <button
                                className="btn btn-sm"
                                onClick={() => nextStep(svc.id)}
                                style={{
                                  background: svc.color,
                                  color: "#fff",
                                  fontSize: "12px",
                                  padding: "4px 8px"
                                }}
                              >
                                Next
                                <ChevronRight size={14} className="ms-1" style={{ display: "inline" }} />
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Queue List */}
                <div className="mb-4">
                  <small className="text-muted text-uppercase fw-bold d-block mb-2">
                    Queue ({q.length})
                  </small>
                  {q.length === 0 ? (
                    <div className="alert alert-info mb-0 small">No patients waiting</div>
                  ) : (
                    <div className="d-flex flex-wrap gap-2">
                      {q.map((ticket, idx) => (
                        <span
                          key={ticket.id}
                          className="badge"
                          style={{
                            background: idx === 0 ? svc.color : "#e9ecef",
                            color: idx === 0 ? "#fff" : "#000",
                            padding: "0.5rem 0.75rem",
                            fontSize: "0.9rem",
                            fontWeight: "600",
                          }}
                        >
                          {idx + 1}. {ticket.fullTicketNumber}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="d-grid gap-2">
                  <button
                    className="btn fw-bold"
                    style={{
                      background: svc.color,
                      color: "#fff",
                      padding: "0.75rem",
                    }}
                    disabled={disabled}
                    onClick={() => callNext(svc.id)}
                  >
                    <SkipForward size={16} className="me-2" style={{ display: "inline" }} />
                    Call Next ({q.length})
                  </button>

                  {nowServing[svc.id] && (
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => markDone(svc.id)}
                    >
                      <Phone size={14} className="me-1" style={{ display: "inline" }} />
                      Mark as Done
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
