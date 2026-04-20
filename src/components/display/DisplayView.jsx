import React, { useState, useEffect } from "react";
import NowServing from "./NowServing";
import HealthAnnouncementPanel from "../HealthAnnouncementPanel";
import CampaignVideos from "../CampaignVideos";

export default function DisplayView({ services, queues, nowServing, announcements, healthTips, settings }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const fmt = (d) =>
    d.toLocaleTimeString("en-PH", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  const fmtD = (d) =>
    d.toLocaleDateString("en-PH", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  const primaryColor = settings?.organization?.color || "#e40914";

  return (
    <div className="d-flex flex-column" style={{ height: "calc(100vh - 62px)", background: "#f8f9fa", overflow: "hidden" }}>
      {/* Header */}
      <div
        className="d-flex justify-content-between align-items-center px-4 py-3 text-white"
        style={{ background: primaryColor, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
      >
        <div>
          <h4 className="mb-0 fw-bold">🏥 {settings?.organization?.name || "City Health Office"}</h4>
          <small>{settings?.organization?.location || "Mati, Davao Oriental"}</small>
        </div>
        <div className="text-end">
          <div className="fw-bold" style={{ fontSize: "1.8rem", lineHeight: "1" }}>
            {fmt(time)}
          </div>
          <small>{fmtD(time)}</small>
        </div>
      </div>

      {/* Main Content */}
      <div className="d-flex flex-fill overflow-hidden">
        {/* Left: Now Serving */}
        <div style={{ flex: "1", minWidth: "0", borderRight: `1px solid #dee2e6` }}>
          <NowServing services={services} queues={queues} nowServing={nowServing} settings={settings} />
        </div>

        {/* Right: Videos & Announcements */}
        <div style={{ flex: "1", minWidth: "0", padding: "16px", display: "flex", flexDirection: "column", overflow: "auto", gap: "16px" }}>
          {/* Campaign Videos - Show if available */}
          {settings?.videoSettings?.showVideos && settings?.campaignVideos?.some(v => v.uploaded) && (
            <div style={{ minHeight: "280px", flex: "0 0 auto" }}>
              <CampaignVideos 
                videos={settings?.campaignVideos || []} 
                settings={settings}
              />
            </div>
          )}

          {/* Announcements & Health Tips */}
          <div style={{ flex: "1", minHeight: "0", overflowY: "auto" }}>
            <HealthAnnouncementPanel 
              announcements={announcements || []} 
              healthTips={healthTips || []}
              settings={settings}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
