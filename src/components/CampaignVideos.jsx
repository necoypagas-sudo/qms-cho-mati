// src/components/CampaignVideos.jsx
// Campaign video carousel for Display View - shows DOH health awareness videos

import React, { useState, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { getVideo } from "../utils/indexedDB";

export default function CampaignVideos({ videos, settings }) {
  const [currentVideoIdx, setCurrentVideoIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(settings?.videoSettings?.autoplay ?? true);
  const [isMuted, setIsMuted] = useState(false);
  const [videoUrls, setVideoUrls] = useState({});

  // Filter only uploaded videos
  const uploadedVideos = videos?.filter(v => v.uploaded) || [];

  // Load video URLs from IndexedDB
  useEffect(() => {
    const loadVideoUrls = async () => {
      const urls = {};
      for (const video of uploadedVideos) {
        try {
          const videoData = await getVideo(video.id);
          if (videoData) {
            urls[video.id] = videoData;
          }
        } catch (error) {
          console.error(`Error loading video ${video.id}:`, error);
        }
      }
      setVideoUrls(urls);
    };

    if (uploadedVideos.length > 0) {
      loadVideoUrls();
    }
  }, [uploadedVideos]);

  // Move useEffect OUTSIDE conditional return to avoid React Hook rules violation
  useEffect(() => {
    if (!isPlaying || uploadedVideos.length === 0) return;

    const interval = setInterval(() => {
      setCurrentVideoIdx(prev => (prev + 1) % uploadedVideos.length);
    }, settings?.videoSettings?.videoInterval || 15000);

    return () => clearInterval(interval);
  }, [isPlaying, uploadedVideos.length, settings?.videoSettings?.videoInterval]);

  // Now we can have early returns after all hooks are called
  if (!settings?.videoSettings?.showVideos || uploadedVideos.length === 0) {
    return null;
  }

  const currentVideo = uploadedVideos[currentVideoIdx];
  const currentVideoUrl = videoUrls[currentVideo.id];

  return (
    <div className="card h-100" style={{ display: "flex", flexDirection: "column", background: "#1a1a1a", border: "2px solid #0d6efd" }}>
      {/* Video Container */}
      <div style={{ 
        position: "relative", 
        paddingBottom: "100%", 
        height: 0, 
        overflow: "hidden",
        background: "#000"
      }}>
        {currentVideoUrl ? (
          <video
            key={currentVideo.id}
            src={currentVideoUrl}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "contain",
            }}
            controls={false}
            autoPlay={isPlaying}
            muted={isMuted}
            loop
          />
        ) : (
          <div style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#000",
            color: "#999",
            fontSize: "14px"
          }}>
            Loading video...
          </div>
        )}

        {/* Overlay Controls */}
        <div style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          background: "linear-gradient(to top, rgba(0,0,0,0.9), transparent)",
          padding: "10px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          color: "white"
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "12px", fontWeight: "bold", marginBottom: "4px" }}>
              📹 Campaign Video {currentVideoIdx + 1} of {uploadedVideos.length}
            </div>
            <div style={{ fontSize: "11px", color: "#ddd" }}>
              {currentVideo.title}
            </div>
          </div>

          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              style={{
                background: "rgba(255,255,255,0.2)",
                border: "none",
                color: "white",
                padding: "6px 10px",
                borderRadius: "4px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "4px",
                fontSize: "12px"
              }}
            >
              {isPlaying ? <Pause size={14} /> : <Play size={14} />}
              {isPlaying ? "Pause" : "Play"}
            </button>

            <button
              onClick={() => setIsMuted(!isMuted)}
              style={{
                background: "rgba(255,255,255,0.2)",
                border: "none",
                color: "white",
                padding: "6px 10px",
                borderRadius: "4px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                fontSize: "12px"
              }}
            >
              {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
            </button>
          </div>
        </div>
      </div>

      {/* Video Indicators */}
      <div style={{
        padding: "8px",
        background: "#222",
        display: "flex",
        gap: "6px",
        justifyContent: "center",
        flexWrap: "wrap"
      }}>
        {uploadedVideos.map((video, idx) => (
          <button
            key={video.id}
            onClick={() => setCurrentVideoIdx(idx)}
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              border: "none",
              cursor: "pointer",
              background: idx === currentVideoIdx ? "#0d6efd" : "#555",
              transition: "all 0.3s ease"
            }}
            title={video.title}
          />
        ))}
      </div>
    </div>
  );
}
