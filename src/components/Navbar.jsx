import React from "react";
import { Settings, Volume2, VolumeX } from "lucide-react";

export default function Navbar({ view, setView, voiceOn, setVoiceOn, onSettingsClick, organizationName }) {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark border-bottom border-secondary shadow-sm" style={{ borderBottom: "2px solid #495057" }}>
      <div className="container-fluid">
        {/* Brand */}
        <span className="navbar-brand" style={{ fontSize: "1.5rem", fontWeight: "900", letterSpacing: "1px" }}>
          🏥 CHO QMS
        </span>
        <span className="text-muted ms-2" style={{ fontSize: "0.85rem" }}>
          {organizationName || "City Health Office"}
        </span>

        {/* Toggler */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Nav Items */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <div className="navbar-nav ms-auto d-flex gap-2 align-items-center">
            {/* View Buttons */}
            {[
              { id: "kiosk", label: "🎫 Kiosk", title: "Patient Kiosk - Issue Tickets" },
              { id: "display", label: "📺 Display", title: "Patient Display Screen" },
              { id: "admin", label: "⚙️ Admin", title: "Administration Panel" },
            ].map(({ id, label, title }) => (
              <button
                key={id}
                className={`btn btn-sm ${view === id ? "btn-success" : "btn-outline-secondary"}`}
                onClick={() => setView(id)}
                title={title}
                style={{ whiteSpace: "nowrap" }}
              >
                {label}
              </button>
            ))}

            <div className="vr mx-2" style={{ height: "20px" }}></div>

            {/* Voice Toggle - Only in Display */}
            {view === "display" && (
              <button
                className={`btn btn-sm ${voiceOn ? "btn-warning" : "btn-outline-secondary"}`}
                onClick={() => setVoiceOn(!voiceOn)}
                title={voiceOn ? "Voice is ON" : "Voice is OFF"}
              >
                {voiceOn ? <Volume2 size={16} /> : <VolumeX size={16} />}
                <span className="ms-1">{voiceOn ? "Voice ON" : "Voice OFF"}</span>
              </button>
            )}

            {/* Settings Button */}
            <button
              className="btn btn-sm btn-outline-info"
              onClick={onSettingsClick}
              title="Open Settings"
            >
              <Settings size={16} />
              <span className="ms-1">Settings</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
