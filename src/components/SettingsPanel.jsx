// src/components/SettingsPanel.jsx
// Settings management component - allows users to edit QMS configuration

import React, { useState } from "react";
import { Settings, Save, Upload, Trash2, Film } from "lucide-react";
import { storeVideo, deleteVideo } from "../utils/indexedDB";

export default function SettingsPanel({ settings, onSave, onClose }) {
  const [formData, setFormData] = useState(settings);
  const [activeTab, setActiveTab] = useState("organization");

  // Disable body scroll when modal is open
  React.useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const handleOrgChange = (field, value) => {
    setFormData({
      ...formData,
      organization: { ...formData.organization, [field]: value }
    });
  };

  const handleDisplayChange = (field, value) => {
    setFormData({
      ...formData,
      displaySettings: { ...formData.displaySettings, [field]: value }
    });
  };

  const handleVideoChange = (field, value) => {
    setFormData({
      ...formData,
      videoSettings: { ...formData.videoSettings, [field]: value }
    });
  };

  const handleTicketChange = (field, value) => {
    setFormData({
      ...formData,
      ticketSettings: { ...formData.ticketSettings, [field]: value }
    });
  };

  const handleServiceChange = (index, field, value) => {
    const newServices = [...formData.services];
    newServices[index] = { ...newServices[index], [field]: value };
    setFormData({ ...formData, services: newServices });
  };

  const handleWorkflowStepChange = (serviceIdx, stepIdx, value) => {
    const newServices = [...formData.services];
    if (!newServices[serviceIdx].steps) {
      newServices[serviceIdx].steps = [];
    }
    newServices[serviceIdx].steps[stepIdx] = value;
    setFormData({ ...formData, services: newServices });
  };

  const addWorkflowStep = (serviceIdx) => {
    const newServices = [...formData.services];
    if (!newServices[serviceIdx].steps) {
      newServices[serviceIdx].steps = [];
    }
    newServices[serviceIdx].steps.push("New Step");
    setFormData({ ...formData, services: newServices });
  };

  const removeWorkflowStep = (serviceIdx, stepIdx) => {
    const newServices = [...formData.services];
    newServices[serviceIdx].steps = newServices[serviceIdx].steps.filter((_, i) => i !== stepIdx);
    setFormData({ ...formData, services: newServices });
  };

  const addService = () => {
    setFormData({
      ...formData,
      services: [
        ...formData.services,
        { id: Math.max(...formData.services.map(s => s.id), 0) + 1, name: "New Service", code: "NEW", color: "#0dcaf0" }
      ]
    });
  };

  const removeService = (index) => {
    setFormData({
      ...formData,
      services: formData.services.filter((_, i) => i !== index)
    });
  };

  const handleVideoUpload = (index, e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const videoId = formData.campaignVideos[index].id;
          // Store video in IndexedDB instead of localStorage
          await storeVideo(videoId, reader.result);
          
          // Update form data with metadata only (no URL)
          const newVideos = [...formData.campaignVideos];
          newVideos[index] = {
            ...newVideos[index],
            title: file.name,
            uploaded: true,
            duration: 0,
            // Do NOT store reader.result (large base64 data)
          };
          setFormData({ ...formData, campaignVideos: newVideos });
        } catch (error) {
          console.error("Error uploading video:", error);
          alert("Error uploading video. Please try again.");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const addVideo = () => {
    setFormData({
      ...formData,
      campaignVideos: [
        ...formData.campaignVideos,
        { id: Math.max(...formData.campaignVideos.map(v => v.id), 0) + 1, title: "New Campaign Video", url: "", duration: 0, uploaded: false }
      ]
    });
  };

  const removeVideo = (index) => {
    const videoId = formData.campaignVideos[index].id;
    // Also delete from IndexedDB
    deleteVideo(videoId).catch(err => console.error("Error deleting video from IndexedDB:", err));
    
    setFormData({
      ...formData,
      campaignVideos: formData.campaignVideos.filter((_, i) => i !== index)
    });
  };

  return (
    <div style={{ 
      background: "rgba(0,0,0,0.85)",
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
      <div className="modal-dialog modal-lg" style={{ 
        maxWidth: "850px", 
        zIndex: 10000,
        pointerEvents: "auto",
        margin: "auto",
        animation: "fadeInScale 0.3s ease"
      }}>
        <div className="modal-content shadow-lg" style={{ maxHeight: "90vh", display: "flex", flexDirection: "column", background: "#ffffff", borderRadius: "12px", border: "none" }}>
          {/* Header */}
          <div className="modal-header bg-gradient text-white border-0" style={{ flex: "0 0 auto", background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)", padding: "1.5rem" }}>
            <h5 className="modal-title d-flex gap-3 align-items-center" style={{ fontSize: "1.2rem", fontWeight: "600" }}>
              <Settings size={24} style={{ color: "#00d4ff" }} />
              <span>QMS Settings</span>
            </h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose} style={{ opacity: 0.8 }}></button>
          </div>

          {/* Tabs */}
          <div className="nav nav-tabs border-bottom" role="tablist" style={{ background: "#f8f9fa", flex: "0 0 auto", padding: "0.75rem" }}>
            {["organization", "services", "workflow", "display", "videos", "ticket"].map(tab => (
              <button
                key={tab}
                className={`nav-link fw-500 ${activeTab === tab ? "active" : ""}`}
                onClick={() => setActiveTab(tab)}
                style={{ 
                  textTransform: "capitalize", 
                  fontSize: "13px",
                  fontWeight: "500",
                  padding: "0.75rem 1rem",
                  border: "none",
                  color: activeTab === tab ? "#0d6efd" : "#666",
                  borderBottom: activeTab === tab ? "3px solid #0d6efd" : "none",
                  transition: "all 0.2s ease"
                }}
              >
                {tab === "videos" && <Film size={14} className="me-2" style={{ display: "inline" }} />}
                {tab}
              </button>
            ))}
          </div>

          {/* Body */}
          <div className="modal-body" style={{ flex: "1 1 auto", overflowY: "auto", padding: "20px", minHeight: 0, background: "white" }}>
            {/* Organization Settings */}
            {activeTab === "organization" && (
              <div style={{ display: "grid", gap: "15px" }}>
                <div>
                  <label className="form-label fw-semibold" style={{ marginBottom: "6px", fontSize: "13px" }}>
                    Organization Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.organization.name}
                    onChange={(e) => handleOrgChange("name", e.target.value)}
                    style={{ fontSize: "14px" }}
                  />
                </div>
                <div>
                  <label className="form-label fw-semibold" style={{ marginBottom: "6px", fontSize: "13px" }}>
                    Location
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.organization.location}
                    onChange={(e) => handleOrgChange("location", e.target.value)}
                    style={{ fontSize: "14px" }}
                  />
                </div>
                <div>
                  <label className="form-label fw-semibold" style={{ marginBottom: "6px", fontSize: "13px" }}>
                    Address
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.organization.address}
                    onChange={(e) => handleOrgChange("address", e.target.value)}
                    style={{ fontSize: "14px" }}
                  />
                </div>
                <div>
                  <label className="form-label fw-semibold" style={{ marginBottom: "6px", fontSize: "13px" }}>
                    Phone
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.organization.phone}
                    onChange={(e) => handleOrgChange("phone", e.target.value)}
                    style={{ fontSize: "14px" }}
                  />
                </div>
                <div>
                  <label className="form-label fw-semibold" style={{ marginBottom: "6px", fontSize: "13px" }}>
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    value={formData.organization.email}
                    onChange={(e) => handleOrgChange("email", e.target.value)}
                    style={{ fontSize: "14px" }}
                  />
                </div>
                <div>
                  <label className="form-label fw-semibold" style={{ marginBottom: "6px", fontSize: "13px" }}>
                    Primary Color
                  </label>
                  <div className="d-flex gap-2 align-items-center">
                    <input
                      type="color"
                      className="form-control"
                      style={{ width: "80px", height: "40px" }}
                      value={formData.organization.color}
                      onChange={(e) => handleOrgChange("color", e.target.value)}
                    />
                    <code style={{ fontSize: "12px" }}>{formData.organization.color}</code>
                  </div>
                </div>
              </div>
            )}

            {/* Services Settings */}
            {activeTab === "services" && (
              <div>
                <div className="mb-3">
                  <button className="btn btn-success btn-sm" onClick={addService}>
                    + Add Service
                  </button>
                </div>
                {formData.services.map((service, idx) => (
                  <div key={idx} className="card mb-2 p-3" style={{ borderLeft: `4px solid ${service.color}` }}>
                    <div className="row g-2">
                      <div className="col-md-4">
                        <label className="form-label" style={{ fontSize: "12px", marginBottom: "4px" }}>
                          Name
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          value={service.name}
                          onChange={(e) => handleServiceChange(idx, "name", e.target.value)}
                        />
                      </div>
                      <div className="col-md-2">
                        <label className="form-label" style={{ fontSize: "12px", marginBottom: "4px" }}>
                          Code
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          value={service.code}
                          onChange={(e) => handleServiceChange(idx, "code", e.target.value)}
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label" style={{ fontSize: "12px", marginBottom: "4px" }}>
                          Color
                        </label>
                        <input
                          type="color"
                          className="form-control form-control-sm"
                          style={{ height: "32px" }}
                          value={service.color}
                          onChange={(e) => handleServiceChange(idx, "color", e.target.value)}
                        />
                      </div>
                      <div className="col-md-2 d-flex align-items-end">
                        <button
                          className="btn btn-danger btn-sm w-100"
                          onClick={() => removeService(idx)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Workflow Steps Configuration */}
            {activeTab === "workflow" && (
              <div>
                <p style={{ fontSize: "13px", color: "#666", marginBottom: "15px" }}>
                  Configure service workflow steps. Each service has a series of steps patients go through.
                </p>
                {formData.services.map((service, svcIdx) => (
                  <div key={svcIdx} className="card mb-3 p-3" style={{ borderLeft: `4px solid ${service.color}`, background: "#f8f9fa" }}>
                    <h6 style={{ color: service.color, fontWeight: "bold", marginBottom: "12px" }}>
                      {service.name} ({service.code})
                    </h6>
                    
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "12px" }}>
                      {(service.steps || []).map((step, stepIdx) => (
                        <div key={stepIdx} className="input-group input-group-sm">
                          <span className="input-group-text bg-light" style={{ fontSize: "11px", fontWeight: "bold" }}>
                            Step {stepIdx + 1}
                          </span>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            value={step}
                            onChange={(e) => handleWorkflowStepChange(svcIdx, stepIdx, e.target.value)}
                            placeholder="Step name"
                          />
                          <button
                            className="btn btn-outline-danger btn-sm"
                            type="button"
                            onClick={() => removeWorkflowStep(svcIdx, stepIdx)}
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>

                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => addWorkflowStep(svcIdx)}
                      style={{ alignSelf: "flex-start" }}
                    >
                      + Add Step
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Display Settings */}
            {activeTab === "display" && (
              <div style={{ display: "grid", gap: "18px" }}>
                <div style={{ background: "#f8f9fa", padding: "14px", borderRadius: "8px", borderLeft: "4px solid #0d6efd" }}>
                  <h6 className="fw-bold mb-3" style={{ fontSize: "0.95rem", color: "#0d6efd" }}>📺 Display Configuration</h6>
                  
                  <div style={{ display: "grid", gap: "15px" }}>
                    <div>
                      <label className="form-label fw-semibold" style={{ marginBottom: "6px", fontSize: "13px" }}>
                        Display Font Size
                      </label>
                      <input
                        type="range"
                        className="form-range"
                        min="80"
                        max="150"
                        value={formData.displaySettings.fontSize || 100}
                        onChange={(e) => handleDisplayChange("fontSize", parseInt(e.target.value))}
                      />
                      <small className="text-muted">{formData.displaySettings.fontSize || 100}% - Adjust size for better visibility</small>
                    </div>

                    <div>
                      <label className="form-label fw-semibold" style={{ marginBottom: "6px", fontSize: "13px" }}>
                        Announcement Interval (milliseconds)
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        value={formData.displaySettings.announcementInterval}
                        onChange={(e) => handleDisplayChange("announcementInterval", parseInt(e.target.value))}
                        step="1000"
                        style={{ fontSize: "14px" }}
                      />
                      <small className="text-muted">How long each announcement displays (min: 3000ms)</small>
                    </div>

                    <div>
                      <label className="form-label fw-semibold" style={{ marginBottom: "6px", fontSize: "13px" }}>
                        Health Tips Interval (milliseconds)
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        value={formData.displaySettings.tipInterval}
                        onChange={(e) => handleDisplayChange("tipInterval", parseInt(e.target.value))}
                        step="1000"
                        style={{ fontSize: "14px" }}
                      />
                      <small className="text-muted">How long each health tip displays (min: 3000ms)</small>
                    </div>

                    <div>
                      <label className="form-label fw-semibold" style={{ marginBottom: "6px", fontSize: "13px" }}>
                        Estimated Wait Time Per Patient (minutes)
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        value={formData.displaySettings.waitTimePerPatient || 5}
                        onChange={(e) => handleDisplayChange("waitTimePerPatient", parseInt(e.target.value))}
                        min="1"
                        max="60"
                        style={{ fontSize: "14px" }}
                      />
                      <small className="text-muted">Used to calculate and display estimated wait times</small>
                    </div>

                    <div>
                      <label className="form-label fw-semibold" style={{ marginBottom: "6px", fontSize: "13px" }}>
                        Screen Brightness
                      </label>
                      <input
                        type="range"
                        className="form-range"
                        min="0"
                        max="100"
                        value={formData.displaySettings.screenBrightness}
                        onChange={(e) => handleDisplayChange("screenBrightness", parseInt(e.target.value))}
                      />
                      <div className="text-end"><small>{formData.displaySettings.screenBrightness}%</small></div>
                    </div>

                    <div>
                      <label className="form-label fw-semibold" style={{ marginBottom: "6px", fontSize: "13px" }}>
                        Animation Speed
                      </label>
                      <select
                        className="form-select"
                        value={formData.displaySettings.animationSpeed || "normal"}
                        onChange={(e) => handleDisplayChange("animationSpeed", e.target.value)}
                        style={{ fontSize: "14px" }}
                      >
                        <option value="slow">Slow (Better for elderly)</option>
                        <option value="normal">Normal</option>
                        <option value="fast">Fast</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div style={{ background: "#f8f9fa", padding: "14px", borderRadius: "8px", borderLeft: "4px solid #198754" }}>
                  <h6 className="fw-bold mb-3" style={{ fontSize: "0.95rem", color: "#198754" }}>🔊 Audio & Notifications</h6>
                  
                  <div style={{ display: "grid", gap: "12px" }}>
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="enableSound"
                        checked={formData.displaySettings.enableSound}
                        onChange={(e) => handleDisplayChange("enableSound", e.target.checked)}
                      />
                      <label className="form-check-label" htmlFor="enableSound">
                        Enable Sound Notifications
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="showTips"
                        checked={formData.displaySettings.showHealthTips}
                        onChange={(e) => handleDisplayChange("showHealthTips", e.target.checked)}
                      />
                      <label className="form-check-label" htmlFor="showTips">
                        Show Health Tips
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="showAnn"
                        checked={formData.displaySettings.showAnnouncements}
                        onChange={(e) => handleDisplayChange("showAnnouncements", e.target.checked)}
                      />
                      <label className="form-check-label" htmlFor="showAnn">
                        Show Announcements
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="darkMode"
                        checked={formData.displaySettings.darkMode}
                        onChange={(e) => handleDisplayChange("darkMode", e.target.checked)}
                      />
                      <label className="form-check-label" htmlFor="darkMode">
                        Dark Mode (for indoor displays)
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Campaign Videos Settings */}
            {activeTab === "videos" && (
              <div>
                <div className="mb-3">
                  <button className="btn btn-primary btn-sm" onClick={addVideo}>
                    <Upload size={14} className="me-1" style={{ display: "inline" }} />
                    Add Video
                  </button>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold" style={{ fontSize: "13px" }}>
                    Video Display Settings
                  </label>
                  <div className="row">
                    <div className="col-md-6">
                      <label className="form-label" style={{ fontSize: "12px", marginBottom: "4px" }}>
                        Video Interval (ms)
                      </label>
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        value={formData.videoSettings.videoInterval}
                        onChange={(e) => handleVideoChange("videoInterval", parseInt(e.target.value))}
                      />
                      <small className="text-muted">Duration for each video</small>
                    </div>
                    <div className="col-md-6">
                      <div className="form-check mt-4">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="autoplayVideos"
                          checked={formData.videoSettings.autoplay}
                          onChange={(e) => handleVideoChange("autoplay", e.target.checked)}
                        />
                        <label className="form-check-label" htmlFor="autoplayVideos">
                          Autoplay Videos
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="showVideos"
                          checked={formData.videoSettings.showVideos}
                          onChange={(e) => handleVideoChange("showVideos", e.target.checked)}
                        />
                        <label className="form-check-label" htmlFor="showVideos">
                          Show Campaign Videos
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <hr style={{ margin: "15px 0" }} />

                {formData.campaignVideos.map((video, idx) => (
                  <div key={idx} className="card mb-2 p-3" style={{ background: "#f8f9fa", borderLeft: "3px solid #0d6efd" }}>
                    <div className="mb-2">
                      <label className="form-label" style={{ fontSize: "12px", marginBottom: "4px" }}>
                        Video Title
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        value={video.title}
                        onChange={(e) => {
                          const newVideos = [...formData.campaignVideos];
                          newVideos[idx].title = e.target.value;
                          setFormData({ ...formData, campaignVideos: newVideos });
                        }}
                        placeholder="Enter video title"
                      />
                    </div>
                    <div className="mb-2">
                      <label className="form-label" style={{ fontSize: "12px", marginBottom: "4px" }}>
                        {video.uploaded ? "✓ Video Uploaded" : "Upload Video File"}
                      </label>
                      <div className="input-group input-group-sm">
                        <input
                          type="file"
                          className="form-control"
                          accept="video/*"
                          onChange={(e) => handleVideoUpload(idx, e)}
                          id={`video-upload-${idx}`}
                          style={{ display: "none" }}
                        />
                        <button
                          className="btn btn-outline-secondary"
                          type="button"
                          onClick={() => document.getElementById(`video-upload-${idx}`).click()}
                        >
                          <Upload size={14} className="me-1" style={{ display: "inline" }} />
                          Choose File
                        </button>
                        {video.uploaded && (
                          <span className="input-group-text" style={{ fontSize: "12px" }}>
                            {video.title}
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => removeVideo(idx)}
                    >
                      <Trash2 size={14} className="me-1" style={{ display: "inline" }} />
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Ticket Settings */}
            {activeTab === "ticket" && (
              <div style={{ display: "grid", gap: "15px" }}>
                <div>
                  <label className="form-label fw-semibold" style={{ marginBottom: "6px", fontSize: "13px" }}>
                    Paper Size
                  </label>
                  <select
                    className="form-select"
                    value={formData.ticketSettings.paperSize}
                    onChange={(e) => handleTicketChange("paperSize", e.target.value)}
                    style={{ fontSize: "14px" }}
                  >
                    <option value="58mm">58mm (Thermal)</option>
                    <option value="80mm">80mm</option>
                    <option value="A4">A4</option>
                  </select>
                </div>
                <div>
                  <label className="form-label fw-semibold" style={{ marginBottom: "6px", fontSize: "13px" }}>
                    Font
                  </label>
                  <select
                    className="form-select"
                    value={formData.ticketSettings.printFont}
                    onChange={(e) => handleTicketChange("printFont", e.target.value)}
                    style={{ fontSize: "14px" }}
                  >
                    <option value="Courier New">Courier New</option>
                    <option value="Monospace">Monospace</option>
                    <option value="Arial">Arial</option>
                  </select>
                </div>
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="autoprint"
                    checked={formData.ticketSettings.autoprint}
                    onChange={(e) => handleTicketChange("autoprint", e.target.checked)}
                  />
                  <label className="form-check-label" htmlFor="autoprint">
                    Auto-print after issue
                  </label>
                </div>
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="priority"
                    checked={formData.ticketSettings.showPriority}
                    onChange={(e) => handleTicketChange("showPriority", e.target.checked)}
                  />
                  <label className="form-check-label" htmlFor="priority">
                    Show Priority Badge
                  </label>
                </div>
              </div>
            )}
          </div>
          {/* Footer */}
          <div className="modal-footer bg-light border-top" style={{ flex: "0 0 auto", background: "white" }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              style={{ fontSize: "14px" }}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-success"
              onClick={() => onSave(formData)}
              style={{ fontSize: "14px" }}
            >
              <Save size={16} className="me-1" style={{ display: "inline" }} />
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

