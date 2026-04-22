// src/components/MarqueeTicker.jsx
// Marquee/Ticker Component for scrolling announcements
// Displays scrolling text at bottom of TV display with animation

import React, { useState, useEffect } from "react";
import "../styles/MarqueeTicker.css";

/**
 * MarqueeTicker - Scrolling announcement ticker
 * 
 * Props:
 * - text: Text to display
 * - speed: Animation speed (1-5, default 2)
 * - backgroundColor: Background color
 * - textColor: Text color
 * - height: Height of ticker (default "60px")
 * - fontSize: Font size (default "1.2rem")
 */
export default function MarqueeTicker({
  text = "👨‍⚕️ Welcome to City Health Office | 🏥 Hours: Mon-Fri 8AM-5PM | 📞 Call: (087) 811 4331",
  speed = 2,
  backgroundColor = "#dc3545",
  textColor = "#fff",
  height = "60px",
  fontSize = "1.2rem",
}) {
  const [displayText, setDisplayText] = useState(text);

  // Update display text when prop changes
  useEffect(() => {
    setDisplayText(text);
  }, [text]);

  // Duration calculation based on speed (1-5)
  // Speed 1 = 30s, Speed 5 = 6s
  const duration = Math.max(6, 30 - speed * 5);

  return (
    <div className="marquee-container" style={{ 
      backgroundColor, 
      height, 
      overflow: "hidden",
      display: "flex",
      alignItems: "center",
      position: "relative",
      boxShadow: "0 -2px 8px rgba(0,0,0,0.2)"
    }}>
      <style>{`
        @keyframes marquee-scroll {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        
        .marquee-text {
          animation: marquee-scroll ${duration}s linear infinite;
          white-space: nowrap;
          padding: 0 20px;
          display: inline-block;
        }
        
        /* Fade effect at edges */
        .marquee-container::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 50px;
          background: linear-gradient(to right, ${backgroundColor}, transparent);
          z-index: 10;
          pointer-events: none;
        }
        
        .marquee-container::after {
          content: '';
          position: absolute;
          right: 0;
          top: 0;
          bottom: 0;
          width: 50px;
          background: linear-gradient(to left, ${backgroundColor}, transparent);
          z-index: 10;
          pointer-events: none;
        }
      `}</style>

      <div 
        className="marquee-text"
        style={{
          color: textColor,
          fontSize,
          fontWeight: 600,
          letterSpacing: "0.5px",
        }}
      >
        {displayText} &nbsp;&nbsp;•&nbsp;&nbsp; {displayText}
      </div>
    </div>
  );
}

/**
 * MultiMarqueeTicker - Multiple tickers stacked
 * Useful for multiple announcements
 */
export function MultiMarqueeTicker({ tickers = [] }) {
  return (
    <div className="multi-marquee">
      {tickers.map((ticker, idx) => (
        <MarqueeTicker
          key={idx}
          text={ticker.text}
          speed={ticker.speed || 2}
          backgroundColor={ticker.backgroundColor || "#dc3545"}
          textColor={ticker.textColor || "#fff"}
          height={ticker.height || "50px"}
          fontSize={ticker.fontSize || "1rem"}
        />
      ))}
    </div>
  );
}
