import React, { useState, useEffect } from "react";
import { HEALTH_NEWS } from "../../constants/news";
import { TIPS } from "../../constants/tips";

export default function AnnouncementPanel({ services, queues }) {
  const [newsIdx, setNewsIdx] = useState(0);
  const [tipIdx, setTipIdx] = useState(0);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const t = setInterval(() => { setFade(true); setTimeout(() => { setNewsIdx(i => (i+1)%HEALTH_NEWS.length); setFade(false); }, 400); }, 7000);
    return () => clearInterval(t);
  }, []);
  useEffect(() => {
    const t = setInterval(() => setTipIdx(i => (i+1)%TIPS.length), 5000);
    return () => clearInterval(t);
  }, []);

  const news = HEALTH_NEWS[newsIdx];
  return (
    <div style={{ width:320, background:"#07111e", borderLeft:"1px solid #1e293b", display:"flex", flexDirection:"column" }}>
      <div style={{ flex:1, padding:"16px" }}>
        <div style={{ background:"#ff3b3b", color:"#fff", padding:"4px 10px", borderRadius:6, fontSize:11, fontWeight:900, letterSpacing:2, marginBottom:12, display:"inline-block" }}>📢 HEALTH ANNOUNCEMENT</div>
        <div style={{ opacity: fade ? 0 : 1, transition:"opacity 0.4s" }}>
          <div style={{ background:"#ff3b3b22", border:"1px solid #ff3b3b44", borderRadius:6, padding:"3px 10px", fontSize:11, fontWeight:800, color:"#ff6b6b", letterSpacing:2, display:"inline-block", marginBottom:10 }}>{news.tag}</div>
          <h3 style={{ color:"#f0fdf4", fontSize:20, fontWeight:900, lineHeight:1.2, margin:"0 0 10px" }}>{news.headline}</h3>
          <p style={{ color:"#94a3b8", fontSize:13, lineHeight:1.65 }}>{news.sub}</p>
        </div>
        <div style={{ display:"flex", gap:5, marginTop:14 }}>
          {HEALTH_NEWS.map((_,i) => <div key={i} style={{ width:i===newsIdx?18:6, height:5, borderRadius:3, background:i===newsIdx?"#00C9A7":"#1e293b", transition:"all 0.4s" }} />)}
        </div>
      </div>
      <div style={{ background:"#0d2438", borderTop:"1px solid #1e3a52", padding:"12px 16px" }}>
        <div style={{ color:"#4FC3F7", fontSize:11, fontWeight:800, letterSpacing:2, marginBottom:5 }}>💡 HEALTH TIP</div>
        <div style={{ color:"#94a3b8", fontSize:13, lineHeight:1.5, minHeight:40 }}>{TIPS[tipIdx]}</div>
      </div>
      <div style={{ background:"#06101a", padding:"12px 16px", borderTop:"1px solid #1e293b" }}>
        <div style={{ color:"#475569", fontSize:11, fontWeight:800, letterSpacing:2, marginBottom:8 }}>📊 QUEUE SUMMARY</div>
        {services.map(svc => (
          <div key={svc.id} style={{ display:"flex", justifyContent:"space-between", marginBottom:5, alignItems:"center" }}>
            <span style={{ color:"#64748b", fontSize:12 }}>{svc.icon} {svc.label}</span>
            <span style={{ color:svc.color, fontSize:12, fontWeight:700, background:svc.color+"22", padding:"1px 9px", borderRadius:8 }}>{(queues[svc.id]||[]).length}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
