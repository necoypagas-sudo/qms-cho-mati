// src/components/stations/Station4_EncodingTriage.jsx
// STATION 4: Encoding & Triage - Data entry & triage categorization

import React, { useState } from "react";
import { TRIAGE_LEVELS } from "../../constants/stations";
import "../styles/Station4.css";

const Station4_EncodingTriage = ({ currentPatient, onStationComplete, qmsHook = {} }) => {
  const [triage, setTriage] = useState({
    triageLevel: "",
    triageReason: "",
    followUpRequired: false,
    followUpNotes: "",
    referralRequired: false,
    referralDetails: "",
    notes: "",
  });

  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const steps = [
    { label: "Check In", completed: currentStep >= 0 },
    { label: "Data Entry", completed: currentStep >= 1 },
    { label: "Triage Assessment", completed: currentStep >= 2 },
    { label: "Priority Assignment", completed: currentStep >= 3 },
    { label: "Complete", completed: currentStep >= 4 },
  ];

  // Validate current step
  const validateStep = () => {
    const newErrors = {};

    if (currentStep === 2) {
      if (!triage.triageLevel) newErrors.triageLevel = "Triage level is required";
      if (!triage.triageReason.trim()) newErrors.triageReason = "Reason for triage is required";
    }

    if (currentStep === 3) {
      if (triage.referralRequired && !triage.referralDetails.trim()) {
        newErrors.referralDetails = "Referral details are required";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setTriage(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle next step
  const handleNextStep = () => {
    if (validateStep()) {
      setCurrentStep(prev => prev + 1);
      setErrors({});
    }
  };

  // Handle complete
  const handleComplete = async () => {
    setIsProcessing(true);
    try {
      const selectedTriage = TRIAGE_LEVELS.find(t => t.id === parseInt(triage.triageLevel));
      
      const stationData = {
        triageLevel: selectedTriage?.label || "",
        triagePriority: selectedTriage?.priority || 0,
        triageReason: triage.triageReason.trim(),
        followUpRequired: triage.followUpRequired,
        followUpNotes: triage.followUpNotes.trim(),
        referralRequired: triage.referralRequired,
        referralDetails: triage.referralDetails.trim(),
        notes: triage.notes.trim(),
        completedAt: new Date(),
      };

      if (onStationComplete) {
        onStationComplete(stationData);
      }
    } catch (error) {
      console.error("Error completing station:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="station-4-container">
      {/* Header */}
      <div className="station-header">
        <div className="station-title">
          <span className="station-number">💻 STATION 4</span>
          <h1>Encoding & Triage</h1>
          <p>Data Entry & Triage Categorization</p>
        </div>
        {currentPatient && (
          <div className="patient-info-banner">
            <p><strong>{currentPatient.fullName}</strong> • Ticket: <strong>{currentPatient.ticketNumber}</strong></p>
          </div>
        )}
      </div>

      {/* Progress Steps */}
      <div className="progress-steps">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`step ${index === currentStep ? "active" : ""} ${step.completed ? "completed" : ""}`}
          >
            <div className="step-circle">{index + 1}</div>
            <div className="step-label">{step.label}</div>
          </div>
        ))}
      </div>

      {/* Form Content */}
      <div className="form-container">
        {/* Step 0: Check In */}
        {currentStep === 0 && (
          <div className="step-content">
            <h2>Check In</h2>
            <p className="step-instruction">Welcome to Encoding & Triage Station</p>
            <div className="check-in-card">
              <p className="patient-name">{currentPatient?.fullName}</p>
              <p className="patient-age">Age: {currentPatient?.age} years</p>
              <p className="patient-gender">Gender: {currentPatient?.gender}</p>
              <p className="instruction-text">Your information will now be categorized for priority assessment.</p>
              <button className="btn btn-primary btn-lg" onClick={handleNextStep}>
                ✓ Begin Data Entry
              </button>
            </div>
          </div>
        )}

        {/* Step 1: Data Entry */}
        {currentStep === 1 && (
          <div className="step-content">
            <h2>Data Entry</h2>
            <p className="step-instruction">Review and confirm patient information</p>
            <div className="data-review">
              <div className="data-item">
                <span className="label">Name:</span>
                <span className="value">{currentPatient?.fullName}</span>
              </div>
              <div className="data-item">
                <span className="label">Age:</span>
                <span className="value">{currentPatient?.age} years</span>
              </div>
              <div className="data-item">
                <span className="label">Gender:</span>
                <span className="value">{currentPatient?.gender}</span>
              </div>
              <div className="data-item">
                <span className="label">Contact:</span>
                <span className="value">{currentPatient?.contactNumber || "N/A"}</span>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="notes">Additional Data/Observations</label>
              <textarea
                id="notes"
                name="notes"
                value={triage.notes}
                onChange={handleChange}
                placeholder="Any additional observations to note..."
                rows="3"
              />
            </div>
            <div className="button-group">
              <button className="btn btn-secondary" onClick={() => setCurrentStep(0)}>← Back</button>
              <button className="btn btn-primary" onClick={handleNextStep}>Next →</button>
            </div>
          </div>
        )}

        {/* Step 2: Triage Assessment */}
        {currentStep === 2 && (
          <div className="step-content">
            <h2>Triage Assessment</h2>
            <p className="step-instruction">Categorize patient priority level</p>
            <div className="triage-options">
              {TRIAGE_LEVELS.map((level) => (
                <div key={level.id} className="triage-option">
                  <div className="radio-wrapper">
                    <input
                      type="radio"
                      id={`triage-${level.id}`}
                      name="triageLevel"
                      value={level.id}
                      checked={triage.triageLevel === String(level.id)}
                      onChange={handleChange}
                    />
                    <label htmlFor={`triage-${level.id}`}>
                      <div className="triage-header">
                        <span className="triage-label">{level.label}</span>
                        <span className="triage-wait">Wait: {level.wait}</span>
                      </div>
                      <p className="triage-desc">Priority level: {level.priority}</p>
                    </label>
                  </div>
                </div>
              ))}
            </div>
            {errors.triageLevel && (
              <span className="error-message">{errors.triageLevel}</span>
            )}
            <div className="form-group">
              <label htmlFor="triageReason">Reason for This Triage Level *</label>
              <textarea
                id="triageReason"
                name="triageReason"
                value={triage.triageReason}
                onChange={handleChange}
                placeholder="Explain why this triage level was selected..."
                rows="3"
                className={errors.triageReason ? "error" : ""}
              />
              {errors.triageReason && (
                <span className="error-message">{errors.triageReason}</span>
              )}
            </div>
            <div className="button-group">
              <button className="btn btn-secondary" onClick={() => setCurrentStep(1)}>← Back</button>
              <button className="btn btn-primary" onClick={handleNextStep}>Next →</button>
            </div>
          </div>
        )}

        {/* Step 3: Priority Assignment */}
        {currentStep === 3 && (
          <div className="step-content">
            <h2>Priority Assignment & Referral</h2>
            <p className="step-instruction">Additional priority and referral information</p>
            
            <div className="form-group checkbox">
              <label htmlFor="followUpRequired">
                <input
                  type="checkbox"
                  id="followUpRequired"
                  name="followUpRequired"
                  checked={triage.followUpRequired}
                  onChange={handleChange}
                />
                <span>Follow-up required after consultation</span>
              </label>
            </div>

            {triage.followUpRequired && (
              <div className="form-group">
                <label htmlFor="followUpNotes">Follow-up Notes</label>
                <textarea
                  id="followUpNotes"
                  name="followUpNotes"
                  value={triage.followUpNotes}
                  onChange={handleChange}
                  placeholder="Details about follow-up..."
                  rows="2"
                />
              </div>
            )}

            <div className="form-group checkbox">
              <label htmlFor="referralRequired">
                <input
                  type="checkbox"
                  id="referralRequired"
                  name="referralRequired"
                  checked={triage.referralRequired}
                  onChange={handleChange}
                />
                <span>Referral to another facility required</span>
              </label>
            </div>

            {triage.referralRequired && (
              <div className="form-group">
                <label htmlFor="referralDetails">Referral Details *</label>
                <textarea
                  id="referralDetails"
                  name="referralDetails"
                  value={triage.referralDetails}
                  onChange={handleChange}
                  placeholder="Which facility and reason for referral..."
                  rows="3"
                  className={errors.referralDetails ? "error" : ""}
                />
                {errors.referralDetails && (
                  <span className="error-message">{errors.referralDetails}</span>
                )}
              </div>
            )}

            <div className="button-group">
              <button className="btn btn-secondary" onClick={() => setCurrentStep(2)}>← Back</button>
              <button className="btn btn-primary" onClick={handleNextStep}>Next →</button>
            </div>
          </div>
        )}

        {/* Step 4: Complete */}
        {currentStep === 4 && (
          <div className="step-content">
            <h2>Triage Complete</h2>
            <p className="step-instruction">Review assignment summary</p>
            
            <div className="triage-summary">
              <div className="summary-item">
                <span className="label">Triage Level:</span>
                <span className="value" style={{
                  color: TRIAGE_LEVELS.find(t => t.id === parseInt(triage.triageLevel))?.color
                }}>
                  {TRIAGE_LEVELS.find(t => t.id === parseInt(triage.triageLevel))?.label || "N/A"}
                </span>
              </div>
              <div className="summary-item">
                <span className="label">Reason:</span>
                <span className="value">{triage.triageReason}</span>
              </div>
              {triage.followUpRequired && (
                <div className="summary-item">
                  <span className="label">Follow-up:</span>
                  <span className="value">Yes - {triage.followUpNotes}</span>
                </div>
              )}
              {triage.referralRequired && (
                <div className="summary-item">
                  <span className="label">Referral:</span>
                  <span className="value">Yes - {triage.referralDetails}</span>
                </div>
              )}
            </div>

            <div className="button-group">
              <button className="btn btn-secondary" onClick={() => setCurrentStep(3)}>← Back</button>
              <button
                className="btn btn-success btn-lg"
                onClick={handleComplete}
                disabled={isProcessing}
              >
                {isProcessing ? "Processing..." : "✅ Complete & Send to Station 5"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Station4_EncodingTriage;
