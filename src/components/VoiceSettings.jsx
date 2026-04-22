// src/components/VoiceSettings.jsx
// Voice Settings Component - Configure voice parameters
// Used within SettingsPanel for voice control configuration

import React from "react";
import { Volume2, Zap } from "lucide-react";

/**
 * VoiceSettings Component
 * Allows configuration of:
 * - Voice Speed (rate)
 * - Voice Pitch
 * - Volume
 * - Marquee text
 */
export function VoiceSettings({ settings, onChange }) {
  const voiceSettings = settings?.voiceSettings || {
    enabled: true,
    rate: 0.9,
    pitch: 1.0,
    volume: 1.0,
    language: "en-PH",
  };

  const displaySettings = settings?.displaySettings || {};

  const handleVoiceChange = (field, value) => {
    onChange({
      ...settings,
      voiceSettings: {
        ...voiceSettings,
        [field]: value,
      },
    });
  };

  const handleMarqueeChange = (field, value) => {
    onChange({
      ...settings,
      displaySettings: {
        ...displaySettings,
        [field]: value,
      },
    });
  };

  return (
    <div style={{ display: "grid", gap: "20px" }}>
      {/* Voice Settings Section */}
      <div style={{ background: "#f8f9fa", padding: "16px", borderRadius: "8px" }}>
        <h6 className="d-flex align-items-center gap-2 mb-3" style={{ fontSize: "0.95rem", fontWeight: "600", textTransform: "uppercase", color: "#212529" }}>
          <Volume2 size={18} style={{ color: "#0dcaf0" }} />
          Voice Configuration
        </h6>

        <div style={{ display: "grid", gap: "16px" }}>
          {/* Enable/Disable Voice */}
          <div className="d-flex align-items-center justify-content-between">
            <label className="form-label mb-0" style={{ fontSize: "13px" }}>
              Enable Voice Announcements
            </label>
            <input
              type="checkbox"
              className="form-check-input"
              checked={voiceSettings.enabled}
              onChange={(e) => handleVoiceChange("enabled", e.target.checked)}
              style={{ width: "24px", height: "24px", cursor: "pointer" }}
            />
          </div>

          {/* Language Selection */}
          <div>
            <label className="form-label fw-semibold" style={{ marginBottom: "6px", fontSize: "13px" }}>
              Language
            </label>
            <select
              className="form-select"
              value={voiceSettings.language}
              onChange={(e) => handleVoiceChange("language", e.target.value)}
              style={{ fontSize: "13px" }}
            >
              <option value="en-PH">English (Philippines)</option>
              <option value="en-US">English (US)</option>
              <option value="fil-PH">Filipino (Tagalog)</option>
              <option value="es-ES">Spanish</option>
              <option value="fr-FR">French</option>
            </select>
          </div>

          {/* Voice Speed / Rate */}
          <div>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <label className="form-label fw-semibold" style={{ marginBottom: "0", fontSize: "13px" }}>
                Voice Speed
              </label>
              <span style={{ fontSize: "0.85rem", color: "#666", fontWeight: "600" }}>
                {(voiceSettings.rate * 100).toFixed(0)}%
              </span>
            </div>
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <span style={{ fontSize: "0.75rem", color: "#999" }}>Slow</span>
              <input
                type="range"
                className="form-range"
                min="0.1"
                max="2"
                step="0.1"
                value={voiceSettings.rate}
                onChange={(e) => handleVoiceChange("rate", parseFloat(e.target.value))}
                style={{ flex: 1 }}
              />
              <span style={{ fontSize: "0.75rem", color: "#999" }}>Fast</span>
            </div>
            <small style={{ color: "#999" }}>0.1 (slowest) to 2.0 (fastest). Default: 0.9</small>
          </div>

          {/* Voice Pitch */}
          <div>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <label className="form-label fw-semibold" style={{ marginBottom: "0", fontSize: "13px" }}>
                Voice Pitch
              </label>
              <span style={{ fontSize: "0.85rem", color: "#666", fontWeight: "600" }}>
                {(voiceSettings.pitch * 100).toFixed(0)}%
              </span>
            </div>
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <span style={{ fontSize: "0.75rem", color: "#999" }}>Low</span>
              <input
                type="range"
                className="form-range"
                min="0.5"
                max="2"
                step="0.1"
                value={voiceSettings.pitch}
                onChange={(e) => handleVoiceChange("pitch", parseFloat(e.target.value))}
                style={{ flex: 1 }}
              />
              <span style={{ fontSize: "0.75rem", color: "#999" }}>High</span>
            </div>
            <small style={{ color: "#999" }}>0.5 (lowest) to 2.0 (highest). Default: 1.0</small>
          </div>

          {/* Volume */}
          <div>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <label className="form-label fw-semibold" style={{ marginBottom: "0", fontSize: "13px" }}>
                Volume
              </label>
              <span style={{ fontSize: "0.85rem", color: "#666", fontWeight: "600" }}>
                {(voiceSettings.volume * 100).toFixed(0)}%
              </span>
            </div>
            <input
              type="range"
              className="form-range"
              min="0"
              max="1"
              step="0.1"
              value={voiceSettings.volume}
              onChange={(e) => handleVoiceChange("volume", parseFloat(e.target.value))}
            />
            <small style={{ color: "#999" }}>0.0 (mute) to 1.0 (maximum). Default: 1.0</small>
          </div>
        </div>
      </div>

      {/* Marquee Settings Section */}
      <div style={{ background: "#f8f9fa", padding: "16px", borderRadius: "8px" }}>
        <h6 className="d-flex align-items-center gap-2 mb-3" style={{ fontSize: "0.95rem", fontWeight: "600", textTransform: "uppercase", color: "#212529" }}>
          <Zap size={18} style={{ color: "#ffc107" }} />
          Marquee / Ticker Settings
        </h6>

        <div style={{ display: "grid", gap: "16px" }}>
          {/* Marquee Text */}
          <div>
            <label className="form-label fw-semibold" style={{ marginBottom: "6px", fontSize: "13px" }}>
              Marquee Text
            </label>
            <textarea
              className="form-control"
              value={displaySettings.marqueeText || "👨‍⚕️ Welcome to City Health Office | 🏥 Hours: Mon-Fri 8AM-5PM | 📞 Call: (087) 811 4331"}
              onChange={(e) => handleMarqueeChange("marqueeText", e.target.value)}
              rows={3}
              placeholder="Enter marquee text..."
              style={{ fontSize: "13px", fontFamily: "monospace" }}
            />
            <small style={{ color: "#999" }}>
              Add emojis or special characters. Use | to separate messages.
            </small>
          </div>

          {/* Marquee Speed */}
          <div>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <label className="form-label fw-semibold" style={{ marginBottom: "0", fontSize: "13px" }}>
                Marquee Speed
              </label>
              <span style={{ fontSize: "0.85rem", color: "#666", fontWeight: "600" }}>
                {displaySettings.marqueeSpeed || 2}
              </span>
            </div>
            <input
              type="range"
              className="form-range"
              min="1"
              max="5"
              step="1"
              value={displaySettings.marqueeSpeed || 2}
              onChange={(e) => handleMarqueeChange("marqueeSpeed", parseInt(e.target.value))}
            />
            <small style={{ color: "#999" }}>1 (slowest) to 5 (fastest). Default: 2</small>
          </div>

          {/* Marquee Background Color */}
          <div>
            <label className="form-label fw-semibold" style={{ marginBottom: "6px", fontSize: "13px" }}>
              Background Color
            </label>
            <div className="d-flex gap-2 align-items-center">
              <input
                type="color"
                className="form-control"
                value={displaySettings.marqueeBackgroundColor || "#dc3545"}
                onChange={(e) => handleMarqueeChange("marqueeBackgroundColor", e.target.value)}
                style={{ width: "60px", height: "40px", cursor: "pointer" }}
              />
              <input
                type="text"
                className="form-control"
                value={displaySettings.marqueeBackgroundColor || "#dc3545"}
                onChange={(e) => handleMarqueeChange("marqueeBackgroundColor", e.target.value)}
                style={{ fontSize: "13px" }}
              />
            </div>
          </div>

          {/* Marquee Text Color */}
          <div>
            <label className="form-label fw-semibold" style={{ marginBottom: "6px", fontSize: "13px" }}>
              Text Color
            </label>
            <div className="d-flex gap-2 align-items-center">
              <input
                type="color"
                className="form-control"
                value={displaySettings.marqueeTextColor || "#ffffff"}
                onChange={(e) => handleMarqueeChange("marqueeTextColor", e.target.value)}
                style={{ width: "60px", height: "40px", cursor: "pointer" }}
              />
              <input
                type="text"
                className="form-control"
                value={displaySettings.marqueeTextColor || "#ffffff"}
                onChange={(e) => handleMarqueeChange("marqueeTextColor", e.target.value)}
                style={{ fontSize: "13px" }}
              />
            </div>
          </div>

          {/* Show Marquee */}
          <div className="d-flex align-items-center justify-content-between">
            <label className="form-label mb-0" style={{ fontSize: "13px" }}>
              Show Marquee
            </label>
            <input
              type="checkbox"
              className="form-check-input"
              checked={displaySettings.showMarquee !== false}
              onChange={(e) => handleMarqueeChange("showMarquee", e.target.checked)}
              style={{ width: "24px", height: "24px", cursor: "pointer" }}
            />
          </div>
        </div>
      </div>

      {/* Preset Voices */}
      <div style={{ background: "#f8f9fa", padding: "16px", borderRadius: "8px" }}>
        <h6 className="mb-3" style={{ fontSize: "0.95rem", fontWeight: "600", textTransform: "uppercase", color: "#212529" }}>
          Preset Voices
        </h6>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))", gap: "8px" }}>
          {[
            { name: "Fast", rate: 1.3, pitch: 1.0 },
            { name: "Normal", rate: 0.9, pitch: 1.0 },
            { name: "Slow", rate: 0.6, pitch: 0.9 },
            { name: "High", rate: 0.9, pitch: 1.5 },
            { name: "Low", rate: 0.9, pitch: 0.7 },
          ].map((preset) => (
            <button
              key={preset.name}
              className="btn btn-outline-primary"
              onClick={() => {
                handleVoiceChange("rate", preset.rate);
                handleVoiceChange("pitch", preset.pitch);
              }}
              style={{ fontSize: "12px", padding: "6px 8px" }}
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
