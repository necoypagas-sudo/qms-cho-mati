// src/components/stations/Station3_Interview.jsx
// STATION 3: Interview - Initial screening & health history taking

import React, { useState } from "react";
import "../styles/Station3.css";

const Station3_Interview = ({ currentPatient, onStationComplete, qmsHook = {} }) => {
  const [interview, setInterview] = useState({
    healthHistory: "",
    chiefComplaint: "",
    currentSymptoms: "",
    symptomDuration: "",
    medications: "",
    allergies: "",
    lastCheckup: "",
    notes: "",
  });

  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const steps = [
    { label: "Check In", completed: currentStep >= 0 },
    { label: "Health History", completed: currentStep >= 1 },
    { label: "Chief Complaint", completed: currentStep >= 2 },
    { label: "Current Symptoms", completed: currentStep >= 3 },
    { label: "Complete", completed: currentStep >= 4 },
  ];

  // Validate current step
  const validateStep = () => {
    const newErrors = {};

    if (currentStep === 1) {
      if (!interview.healthHistory.trim()) newErrors.healthHistory = "Health history is required";
    }

    if (currentStep === 2) {
      if (!interview.chiefComplaint.trim()) newErrors.chiefComplaint = "Chief complaint is required";
    }

    if (currentStep === 3) {
      if (!interview.currentSymptoms.trim()) newErrors.currentSymptoms = "Current symptoms are required";
      if (!interview.symptomDuration.trim()) newErrors.symptomDuration = "Symptom duration is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInterview(prev => ({
      ...prev,
      [name]: value,
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
      const stationData = {
        healthHistory: interview.healthHistory.trim(),
        chiefComplaint: interview.chiefComplaint.trim(),
        currentSymptoms: interview.currentSymptoms.trim(),
        symptomDuration: interview.symptomDuration.trim(),
        medications: interview.medications.trim(),
        allergies: interview.allergies.trim(),
        lastCheckup: interview.lastCheckup.trim(),
        notes: interview.notes.trim(),
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
    <div className="station-3-container">
      {/* Header */}
      <div className="station-header">
        <div className="station-title">
          <span className="station-number">📋 STATION 3</span>
          <h1>Interview</h1>
          <p>Initial Screening & Health History</p>
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
            <p className="step-instruction">Welcome to Interview Station</p>
            <div className="check-in-card">
              <p className="patient-name">{currentPatient?.fullName}</p>
              <p className="patient-age">Age: {currentPatient?.age} years</p>
              <p className="patient-gender">Gender: {currentPatient?.gender}</p>
              <p className="instruction-text">Please be ready to answer questions about your medical history.</p>
              <button className="btn btn-primary btn-lg" onClick={handleNextStep}>
                ✓ Begin Interview
              </button>
            </div>
          </div>
        )}

        {/* Step 1: Health History */}
        {currentStep === 1 && (
          <div className="step-content">
            <h2>Health History</h2>
            <p className="step-instruction">Tell us about any significant medical conditions, surgeries, or treatments</p>
            <div className="form-group">
              <label htmlFor="healthHistory">Past Medical History *</label>
              <textarea
                id="healthHistory"
                name="healthHistory"
                value={interview.healthHistory}
                onChange={handleChange}
                placeholder="e.g., Hypertension, Diabetes, Asthma, previous surgeries, etc."
                rows="5"
                className={errors.healthHistory ? "error" : ""}
              />
              {errors.healthHistory && (
                <span className="error-message">{errors.healthHistory}</span>
              )}
            </div>
            <div className="button-group">
              <button className="btn btn-secondary" onClick={() => setCurrentStep(0)}>← Back</button>
              <button className="btn btn-primary" onClick={handleNextStep}>Next →</button>
            </div>
          </div>
        )}

        {/* Step 2: Chief Complaint */}
        {currentStep === 2 && (
          <div className="step-content">
            <h2>Chief Complaint</h2>
            <p className="step-instruction">Why did you come to the clinic today?</p>
            <div className="form-group">
              <label htmlFor="chiefComplaint">Main Reason for Visit *</label>
              <input
                type="text"
                id="chiefComplaint"
                name="chiefComplaint"
                value={interview.chiefComplaint}
                onChange={handleChange}
                placeholder="e.g., Cough, Fever, Body pain, etc."
                className={errors.chiefComplaint ? "error" : ""}
              />
              {errors.chiefComplaint && (
                <span className="error-message">{errors.chiefComplaint}</span>
              )}
            </div>
            <div className="button-group">
              <button className="btn btn-secondary" onClick={() => setCurrentStep(1)}>← Back</button>
              <button className="btn btn-primary" onClick={handleNextStep}>Next →</button>
            </div>
          </div>
        )}

        {/* Step 3: Current Symptoms */}
        {currentStep === 3 && (
          <div className="step-content">
            <h2>Current Symptoms</h2>
            <p className="step-instruction">Describe your current symptoms in detail</p>
            <div className="form-group">
              <label htmlFor="currentSymptoms">Symptoms *</label>
              <textarea
                id="currentSymptoms"
                name="currentSymptoms"
                value={interview.currentSymptoms}
                onChange={handleChange}
                placeholder="Describe all symptoms you're experiencing..."
                rows="4"
                className={errors.currentSymptoms ? "error" : ""}
              />
              {errors.currentSymptoms && (
                <span className="error-message">{errors.currentSymptoms}</span>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="symptomDuration">Duration *</label>
              <input
                type="text"
                id="symptomDuration"
                name="symptomDuration"
                value={interview.symptomDuration}
                onChange={handleChange}
                placeholder="e.g., 3 days, 1 week, 2 weeks"
                className={errors.symptomDuration ? "error" : ""}
              />
              {errors.symptomDuration && (
                <span className="error-message">{errors.symptomDuration}</span>
              )}
            </div>
            <div className="button-group">
              <button className="btn btn-secondary" onClick={() => setCurrentStep(2)}>← Back</button>
              <button className="btn btn-primary" onClick={handleNextStep}>Next →</button>
            </div>
          </div>
        )}

        {/* Step 4: Complete */}
        {currentStep === 4 && (
          <div className="step-content">
            <h2>Complete Interview</h2>
            <p className="step-instruction">Additional medical information</p>
            <div className="form-group">
              <label htmlFor="medications">Current Medications</label>
              <textarea
                id="medications"
                name="medications"
                value={interview.medications}
                onChange={handleChange}
                placeholder="List any medications the patient is currently taking..."
                rows="3"
              />
            </div>
            <div className="form-group">
              <label htmlFor="allergies">Allergies</label>
              <input
                type="text"
                id="allergies"
                name="allergies"
                value={interview.allergies}
                onChange={handleChange}
                placeholder="Drug allergies, food allergies, etc."
              />
            </div>
            <div className="form-group">
              <label htmlFor="lastCheckup">Last Medical Checkup</label>
              <input
                type="text"
                id="lastCheckup"
                name="lastCheckup"
                value={interview.lastCheckup}
                onChange={handleChange}
                placeholder="When was the last checkup?"
              />
            </div>
            <div className="form-group">
              <label htmlFor="notes">Additional Notes</label>
              <textarea
                id="notes"
                name="notes"
                value={interview.notes}
                onChange={handleChange}
                placeholder="Any other relevant information..."
                rows="3"
              />
            </div>
            <div className="button-group">
              <button className="btn btn-secondary" onClick={() => setCurrentStep(3)}>← Back</button>
              <button
                className="btn btn-success btn-lg"
                onClick={handleComplete}
                disabled={isProcessing}
              >
                {isProcessing ? "Processing..." : "✅ Complete & Send to Station 4"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Station3_Interview;
