// src/components/HealthAnnouncementPanel.jsx
// Rotating health news/announcements panel for the TV display

import React, { useState, useEffect } from "react";
import { Megaphone, Lightbulb, ChevronRight } from "lucide-react";

export default function HealthAnnouncementPanel({ announcements, healthTips, settings }) {
  const [newsIdx, setNewsIdx] = useState(0);
  const [tipIdx, setTipIdx] = useState(0);
  const [visible, setVisible] = useState(true);

  const news = announcements[newsIdx];
  const primaryColor = settings?.organization?.color || "#e40914";

  // Rotate news every 7 seconds with fade
  useEffect(() => {
    const t = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setNewsIdx((i) => (i + 1) % announcements.length);
        setVisible(true);
      }, 400);
    }, settings?.displaySettings?.announcementInterval || 7000);
    return () => clearInterval(t);
  }, [announcements.length, settings?.displaySettings?.announcementInterval]);

  // Rotate tips every 5 seconds
  useEffect(() => {
    const t = setInterval(() => setTipIdx((i) => (i + 1) % healthTips.length), settings?.displaySettings?.tipInterval || 5000);
    return () => clearInterval(t);
  }, [healthTips.length, settings?.displaySettings?.tipInterval]);

  return (
    <div className="card shadow-sm h-100" style={{ border: "1px solid #dee2e6", overflow: "hidden" }}>
      {/* Header */}
      <div className="card-header d-flex align-items-center gap-2 py-2" style={{ background: primaryColor, borderBottom: "none" }}>
        <Megaphone size={18} color="#fff" />
        <span style={{ color: "#fff", fontWeight: 700, fontSize: "0.85rem", letterSpacing: 1 }}>
          HEALTH ANNOUNCEMENTS
        </span>
      </div>

      <div className="card-body d-flex flex-column p-3 gap-3">
        {/* Rotating Announcement */}
        <div
          style={{
            flex: 1,
            opacity: visible ? 1 : 0,
            transition: "opacity 0.4s ease",
          }}
        >
          {/* Tag */}
          <div
            className="d-inline-block mb-2 px-2 py-1"
            style={{
              background: news.color + "22",
              border: `1px solid ${news.color}55`,
              borderRadius: 4,
              color: news.color,
              fontSize: "0.7rem",
              fontWeight: 700,
              letterSpacing: 1,
            }}
          >
            {news.tag}
          </div>

          {/* Headline */}
          <h3
            style={{
              fontSize: "clamp(1rem, 2vw, 1.4rem)",
              fontWeight: 800,
              color: "#212529",
              lineHeight: 1.2,
              marginBottom: "0.5rem",
            }}
          >
            {news.headline}
          </h3>

          {/* Sub text */}
          <p style={{ color: "#6c757d", fontSize: "0.85rem", lineHeight: 1.6, margin: 0 }}>
            {news.sub}
          </p>
        </div>

        {/* Dot indicators */}
        <div className="d-flex gap-1 align-items-center">
          {announcements.map((_, i) => (
            <div
              key={i}
              onClick={() => setNewsIdx(i)}
              style={{
                width: i === newsIdx ? 18 : 6,
                height: 6,
                borderRadius: 3,
                background: i === newsIdx ? primaryColor : "#dee2e6",
                transition: "all 0.3s",
                cursor: "pointer",
                flexShrink: 0,
              }}
            />
          ))}
        </div>

        <hr className="my-1" />

        {/* Health Tip */}
        <div
          style={{
            background: "#f8f9fa",
            borderRadius: 8,
            padding: "0.65rem 0.85rem",
            borderLeft: `3px solid ${primaryColor}`,
          }}
        >
          <div
            className="d-flex align-items-center gap-1 mb-1"
            style={{ color: primaryColor, fontSize: "0.7rem", fontWeight: 700, letterSpacing: 1 }}
          >
            <Lightbulb size={13} />
            HEALTH TIP
          </div>
          <div style={{ color: "#495057", fontSize: "0.83rem", lineHeight: 1.5 }}>
            {healthTips[tipIdx]}
          </div>
        </div>
      </div>

      {/* Bottom news ticker */}
      <div
        style={{
          background: "#212529",
          color: "#fff",
          padding: "5px 0",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            background: primaryColor,
            color: "#fff",
            padding: "1px 10px",
            fontWeight: 700,
            fontSize: "0.72rem",
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          CHO MATI
        </div>
        <div style={{ overflow: "hidden", flex: 1, marginLeft: 8 }}>
          <div
            style={{
              whiteSpace: "nowrap",
              fontSize: "0.72rem",
              animation: "cho-ticker 30s linear infinite",
            }}
          >
            {announcements.map((n) => `   ●   ${n.tag}: ${n.headline} — ${n.sub}`).join("")}
          </div>
        </div>
        <style>{`
          @keyframes cho-ticker {
            0%   { transform: translateX(100%); }
            100% { transform: translateX(-200%); }
          }
        `}</style>
      </div>
    </div>
  );
}
