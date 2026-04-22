// src/components/CallerPanel.jsx
// Caller Panel Component - Controls for ticket calling system
// Features: Next, Recall, Skip, Transfer buttons with voice integration

import React, { useState, useEffect } from "react";
import { PhoneOff, RotateCw, Volume2, VolumeX, SkipForward, ArrowRight, AlertCircle } from "lucide-react";
import {
  callTicket,
  recallTicket,
  skipTicket,
  transferTicket,
  stopSpeech,
  isSpeaking,
  playNotificationSound,
  playUrgentSound,
} from "../utils/voiceCaller";
import "../styles/CallerPanel.css";

/**
 * CallerPanel - Main component for managing ticket calling
 * 
 * Props:
 * - currentTicket: Current ticket being called
 * - stationName: Name of current station
 * - stations: List of all stations for transfer
 * - voiceSettings: Voice configuration (rate, pitch, volume)
 * - onTicketComplete: Callback when ticket is completed
 */
export default function CallerPanel({
  currentTicket,
  stationName = "Service Counter",
  stations = [],
  voiceSettings = {},
  onTicketComplete = null,
  onRecallTicket = null,
  onSkipTicket = null,
  onTransferTicket = null,
}) {
  const [isSpeakingNow, setIsSpeakingNow] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [transferTo, setTransferTo] = useState("");
  const [showTransferMenu, setShowTransferMenu] = useState(false);

  // Monitor speech status
  useEffect(() => {
    const interval = setInterval(() => {
      setIsSpeakingNow(isSpeaking());
    }, 100);
    return () => clearInterval(interval);
  }, []);

  // Voice configuration
  const voiceConfig = {
    rate: voiceSettings?.rate ?? 0.9,
    pitch: voiceSettings?.pitch ?? 1.0,
    volume: voiceSettings?.volume ?? 1.0,
  };

  /**
   * Call current ticket
   */
  const handleCallNext = () => {
    if (!currentTicket) {
      alert("No ticket to call");
      return;
    }

    playNotificationSound();

    if (voiceEnabled) {
      const ticketNum = currentTicket.fullTicketNumber || currentTicket.number;
      callTicket(ticketNum, stationName, voiceConfig, () => {
        setIsSpeakingNow(false);
      });
      setIsSpeakingNow(true);
    }
  };

  /**
   * Recall ticket (patient didn't come)
   */
  const handleRecall = () => {
    if (!currentTicket) {
      alert("No ticket to recall");
      return;
    }

    playUrgentSound();

    if (voiceEnabled) {
      const ticketNum = currentTicket.fullTicketNumber || currentTicket.number;
      recallTicket(ticketNum, voiceConfig, () => {
        setIsSpeakingNow(false);
      });
      setIsSpeakingNow(true);
    }

    if (onRecallTicket) {
      onRecallTicket(currentTicket.id);
    }
  };

  /**
   * Skip ticket
   */
  const handleSkip = () => {
    if (!currentTicket) {
      alert("No ticket to skip");
      return;
    }

    if (!window.confirm("Are you sure you want to skip this ticket?")) {
      return;
    }

    if (voiceEnabled) {
      const ticketNum = currentTicket.fullTicketNumber || currentTicket.number;
      skipTicket(ticketNum, voiceConfig, () => {
        setIsSpeakingNow(false);
      });
      setIsSpeakingNow(true);
    }

    if (onSkipTicket) {
      onSkipTicket(currentTicket.id);
    }
  };

  /**
   * Transfer ticket to another station
   */
  const handleTransfer = (toStationId) => {
    if (!currentTicket) {
      alert("No ticket to transfer");
      return;
    }

    const toStation = stations.find((s) => s.id === toStationId);
    if (!toStation) {
      alert("Invalid station");
      return;
    }

    if (voiceEnabled) {
      const ticketNum = currentTicket.fullTicketNumber || currentTicket.number;
      transferTicket(ticketNum, stationName, toStation.name, voiceConfig, () => {
        setIsSpeakingNow(false);
      });
      setIsSpeakingNow(true);
    }

    if (onTransferTicket) {
      onTransferTicket(currentTicket.id, toStationId);
    }

    setShowTransferMenu(false);
    setTransferTo("");
  };

  /**
   * Stop current speech
   */
  const handleStopSpeech = () => {
    stopSpeech();
    setIsSpeakingNow(false);
  };

  const ticketNum = currentTicket?.fullTicketNumber || currentTicket?.number || "N/A";

  return (
    <div className="caller-panel">
      {/* Header */}
      <div className="caller-header">
        <div className="caller-title">
          <h3 className="mb-0">🎤 Caller Control</h3>
          <p className="mb-0" style={{ fontSize: "0.85rem", color: "#666" }}>
            Current: <strong>{ticketNum}</strong> at <strong>{stationName}</strong>
          </p>
        </div>

        {/* Voice Status Indicator */}
        <div className="voice-status">
          {isSpeakingNow && (
            <span className="speaking-indicator">
              <span className="pulse-dot"></span>
              Speaking...
            </span>
          )}
        </div>
      </div>

      {/* Main Controls */}
      <div className="caller-controls">
        {/* Call Next Button - Primary Action */}
        <button
          className="btn-caller btn-call-next"
          onClick={handleCallNext}
          disabled={!currentTicket || isSpeakingNow}
          title="Call next ticket"
        >
          <PhoneOff size={24} />
          <span>Call Next</span>
        </button>

        {/* Voice Toggle */}
        <button
          className={`btn-caller btn-voice ${voiceEnabled ? "active" : ""}`}
          onClick={() => setVoiceEnabled(!voiceEnabled)}
          title={voiceEnabled ? "Disable voice" : "Enable voice"}
        >
          {voiceEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
          <span>Voice</span>
        </button>

        {/* Stop Speech Button */}
        {isSpeakingNow && (
          <button
            className="btn-caller btn-stop"
            onClick={handleStopSpeech}
            title="Stop speaking"
          >
            <span>Stop</span>
          </button>
        )}
      </div>

      {/* Secondary Controls */}
      <div className="caller-secondary">
        {/* Recall Button */}
        <button
          className="btn-caller-secondary btn-recall"
          onClick={handleRecall}
          disabled={!currentTicket}
          title="Recall - Patient didn't come"
        >
          <RotateCw size={18} />
          <span>Recall</span>
        </button>

        {/* Skip Button */}
        <button
          className="btn-caller-secondary btn-skip"
          onClick={handleSkip}
          disabled={!currentTicket}
          title="Skip this ticket"
        >
          <SkipForward size={18} />
          <span>Skip</span>
        </button>

        {/* Transfer Button */}
        <div className="transfer-container">
          <button
            className="btn-caller-secondary btn-transfer"
            onClick={() => setShowTransferMenu(!showTransferMenu)}
            disabled={!currentTicket}
            title="Transfer to another station"
          >
            <ArrowRight size={18} />
            <span>Transfer</span>
          </button>

          {/* Transfer Menu */}
          {showTransferMenu && (
            <div className="transfer-menu">
              <h5 className="px-3 pt-2 mb-2">Transfer to:</h5>
              <div className="transfer-options">
                {stations.map((station) => (
                  <button
                    key={station.id}
                    className="transfer-option"
                    onClick={() => handleTransfer(station.id)}
                  >
                    {station.icon && <span className="me-1">{station.icon}</span>}
                    {station.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Voice Settings Display */}
      <div className="caller-settings">
        <h6 className="mb-2" style={{ fontSize: "0.8rem", color: "#666", textTransform: "uppercase", letterSpacing: 1 }}>
          Voice Settings
        </h6>
        <div className="voice-settings-display">
          <div className="setting-item">
            <span className="label">Speed:</span>
            <span className="value">{(voiceConfig.rate * 100).toFixed(0)}%</span>
          </div>
          <div className="setting-item">
            <span className="label">Pitch:</span>
            <span className="value">{(voiceConfig.pitch * 100).toFixed(0)}%</span>
          </div>
          <div className="setting-item">
            <span className="label">Volume:</span>
            <span className="value">{(voiceConfig.volume * 100).toFixed(0)}%</span>
          </div>
        </div>
      </div>

      {/* Info Box */}
      {!currentTicket && (
        <div className="alert-info">
          <AlertCircle size={18} />
          <span>No ticket to call. Please call next ticket to begin.</span>
        </div>
      )}
    </div>
  );
}
