import React from "react";
import { HEALTH_NEWS } from "../../constants/news";

export default function NewsTicker() {
  return (
    <div style={{ background:"#00C9A7", color:"#000", padding:"7px 0", overflow:"hidden", display:"flex", alignItems:"center", flexShrink:0 }}>
      <div style={{ background:"#007a62", color:"#fff", padding:"2px 14px", fontWeight:900, fontSize:13, whiteSpace:"nowrap", flexShrink:0 }}>🏥 CHO MATI</div>
      <div style={{ overflow:"hidden", flex:1 }}>
        <div style={{ whiteSpace:"nowrap", fontWeight:700, fontSize:13, animation:"ticker 35s linear infinite" }}>
          {HEALTH_NEWS.map(n => `   ●   ${n.tag}: ${n.headline} — ${n.sub}`).join("")}
        </div>
      </div>
      <style>{`@keyframes ticker { 0%{transform:translateX(100%)} 100%{transform:translateX(-100%)} }`}</style>
    </div>
  );
}
