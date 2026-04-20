import React, { useState } from "react";
import { Edit2, Trash2, Plus } from "lucide-react";

const SERVICE_ICONS = ["👨‍⚕️", "💉", "🚨", "🛡️", "🤰", "👶", "🩺", "🏥", "📋"];
const SERVICE_COLORS = ["#0dcaf0", "#198754", "#dc3545", "#fd7e14", "#6f42c1", "#0d6efd", "#20c997", "#00C9A7", "#FF6B6B"];

export default function ServicesTab({ services, setServices, settings }) {
  const [editSvc, setEditSvc] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newSvc, setNewSvc] = useState({ name: "", code: "", color: "#0dcaf0" });

  const handleAddService = () => {
    if (!newSvc.name.trim()) {
      alert("Service name is required");
      return;
    }
    if (!newSvc.code.trim()) {
      alert("Service code is required");
      return;
    }

    const newService = {
      id: Math.max(...services.map((s) => s.id), 0) + 1,
      ...newSvc,
    };

    setServices([...services, newService]);
    setNewSvc({ name: "", code: "", color: "#0dcaf0" });
    setShowAdd(false);
  };

  const handleUpdateService = () => {
    setServices(services.map((s) => (s.id === editSvc.id ? editSvc : s)));
    setEditSvc(null);
  };

  const handleDeleteService = (id) => {
    if (window.confirm("Delete this service? This action cannot be undone.")) {
      setServices(services.filter((s) => s.id !== id));
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold mb-0">Services ({services.length})</h4>
        <button className="btn btn-success" onClick={() => setShowAdd(true)}>
          <Plus size={16} className="me-1" style={{ display: "inline" }} />
          Add Service
        </button>
      </div>

      {/* Add New Service Form */}
      {showAdd && (
        <div className="card mb-4 border-success shadow-sm">
          <div className="card-header bg-success text-white fw-bold">
            Add New Service
          </div>
          <div className="card-body">
            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <label className="form-label fw-bold">Service Name *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Laboratory Services"
                  value={newSvc.name}
                  onChange={(e) => setNewSvc({ ...newSvc, name: e.target.value })}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-bold">Code *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. LAB"
                  value={newSvc.code}
                  onChange={(e) => setNewSvc({ ...newSvc, code: e.target.value.toUpperCase() })}
                  maxLength={4}
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label fw-bold">Color</label>
              <div className="d-flex flex-wrap gap-2">
                {SERVICE_COLORS.map((c) => (
                  <button
                    key={c}
                    className="rounded-circle"
                    style={{
                      width: "40px",
                      height: "40px",
                      background: c,
                      border: newSvc.color === c ? "4px solid #000" : "2px solid transparent",
                      cursor: "pointer",
                    }}
                    onClick={() => setNewSvc({ ...newSvc, color: c })}
                    title={c}
                  />
                ))}
              </div>
            </div>

            <div className="d-flex gap-2">
              <button className="btn btn-secondary" onClick={() => setShowAdd(false)}>
                Cancel
              </button>
              <button className="btn btn-success" onClick={handleAddService}>
                Add Service
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Services Grid */}
      <div className="row g-3">
        {services.map((svc) =>
          editSvc?.id === svc.id ? (
            <div key={svc.id} className="col-lg-6">
              <div className="card shadow-sm" style={{ border: `3px solid ${editSvc.color}` }}>
                <div className="card-body">
                  <h6 className="fw-bold mb-3">Edit Service</h6>

                  <div className="mb-3">
                    <label className="form-label small fw-bold">Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editSvc.name}
                      onChange={(e) => setEditSvc({ ...editSvc, name: e.target.value })}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-bold">Code</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editSvc.code}
                      onChange={(e) => setEditSvc({ ...editSvc, code: e.target.value.toUpperCase() })}
                      maxLength={4}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-bold">Color</label>
                    <div className="d-flex flex-wrap gap-2">
                      {SERVICE_COLORS.map((c) => (
                        <button
                          key={c}
                          className="rounded-circle"
                          style={{
                            width: "32px",
                            height: "32px",
                            background: c,
                            border: editSvc.color === c ? "3px solid #000" : "2px solid transparent",
                            cursor: "pointer",
                          }}
                          onClick={() => setEditSvc({ ...editSvc, color: c })}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="d-flex gap-2">
                    <button className="btn btn-sm btn-secondary" onClick={() => setEditSvc(null)}>
                      Cancel
                    </button>
                    <button className="btn btn-sm btn-primary" onClick={handleUpdateService}>
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div key={svc.id} className="col-lg-6">
              <div className="card shadow-sm" style={{ border: `3px solid ${svc.color}` }}>
                <div className="card-header" style={{ background: svc.color, color: "#fff" }}>
                  <h5 className="mb-0 fw-bold">{svc.name}</h5>
                </div>
                <div className="card-body">
                  <div className="row mb-3">
                    <div className="col-6">
                      <small className="text-muted d-block">Code</small>
                      <strong>{svc.code}</strong>
                    </div>
                    <div className="col-6">
                      <small className="text-muted d-block">Color</small>
                      <div
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "4px",
                          background: svc.color,
                        }}
                      />
                    </div>
                  </div>

                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-sm btn-outline-primary flex-grow-1"
                      onClick={() => setEditSvc({ ...svc })}
                    >
                      <Edit2 size={14} className="me-1" style={{ display: "inline" }} />
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDeleteService(svc.id)}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
