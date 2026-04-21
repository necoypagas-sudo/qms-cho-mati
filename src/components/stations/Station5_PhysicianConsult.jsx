// src/components/stations/Station5_PhysicianConsult.jsx
// STATION 5: Physician Consultation - Doctor examination & diagnosis

import React, { useState } from "react";
import "../styles/Station5.css";

const Station5_PhysicianConsult = ({ currentPatient, onStationComplete, qmsHook = {} }) => {
  const [consultation, setConsultation] = useState({
    physicianName: "",
    examination: "",
    diagnosis: "",
    recommendation: "",
    treatmentPlan: "",
    medicines: "",
    followUp: false,
    followUpDetails: "",
    notes: "",
  });

  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const steps = [
    { label: "Check In", completed: currentStep >= 0 },
    { label: "Doctor Exam", completed: currentStep >= 1 },
    { label: "Diagnosis", completed: currentStep >= 2 },
    { label: "Treatment Plan", completed: currentStep >= 3 },
    { label: "Complete", completed: currentStep >= 4 },
  ];

  // Validate current step
  const validateStep = () => {
    const newErrors = {};

    if (currentStep === 1) {
      if (!consultation.physicianName.trim()) newErrors.physicianName = "Physician name is required";
      if (!consultation.examination.trim()) newErrors.examination = "Examination findings are required";
    }

    if (currentStep === 2) {
      if (!consultation.diagnosis.trim()) newErrors.diagnosis = "Diagnosis is required";
    }

    if (currentStep === 3) {
      if (!consultation.treatmentPlan.trim()) newErrors.treatmentPlan = "Treatment plan is required";
      if (!consultation.medicines.trim()) newErrors.medicines = "Medicine prescription is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setConsultation(prev => ({
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
      const stationData = {
        physicianName: consultation.physicianName.trim(),
        examination: consultation.examination.trim(),
        diagnosis: consultation.diagnosis.trim(),
        recommendation: consultation.recommendation.trim(),
        treatmentPlan: consultation.treatmentPlan.trim(),
        medicines: consultation.medicines.trim(),
        followUp: consultation.followUp,
        followUpDetails: consultation.followUpDetails.trim(),
        notes: consultation.notes.trim(),
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
    <div className="station-5-container">
      {/* Header */}
      <div className="station-header">
        <div className="station-title">
          <span className="station-number">👨‍⚕️ STATION 5</span>
          <h1>Physician Consultation</h1>
          <p>Doctor Examination & Diagnosis</p>
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
            <p className="step-instruction">Welcome to Physician Consultation</p>
            <div className="check-in-card">
              <p className="patient-name">{currentPatient?.fullName}</p>
              <p className="patient-age">Age: {currentPatient?.age} years</p>
              <p className="patient-gender">Gender: {currentPatient?.gender}</p>
              <p className="instruction-text">The physician is ready to conduct your examination.</p>
              <button className="btn btn-primary btn-lg" onClick={handleNextStep}>
                ✓ Begin Examination
              </button>
            </div>
          </div>
        )}

        {/* Step 1: Doctor Exam */}
        {currentStep === 1 && (
          <div className="step-content">
            <h2>Doctor Examination</h2>
            <p className="step-instruction">Record physician information and examination findings</p>
            <div className="form-group">
              <label htmlFor="physicianName">Physician Name *</label>
              <input
                type="text"
                id="physicianName"
                name="physicianName"
                value={consultation.physicianName}
                onChange={handleChange}
                placeholder="Dr. Juan Dela Cruz"
                className={errors.physicianName ? "error" : ""}
              />
              {errors.physicianName && (
                <span className="error-message">{errors.physicianName}</span>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="examination">Examination Findings *</label>
              <textarea
                id="examination"
                name="examination"
                value={consultation.examination}
                onChange={handleChange}
                placeholder="Record detailed physical examination findings..."
                rows="5"
                className={errors.examination ? "error" : ""}
              />
              {errors.examination && (
                <span className="error-message">{errors.examination}</span>
              )}
            </div>
            <div className="button-group">
              <button className="btn btn-secondary" onClick={() => setCurrentStep(0)}>← Back</button>
              <button className="btn btn-primary" onClick={handleNextStep}>Next →</button>
            </div>
          </div>
        )}

        {/* Step 2: Diagnosis */}
        {currentStep === 2 && (
          <div className="step-content">
            <h2>Diagnosis</h2>
            <p className="step-instruction">Record the medical diagnosis</p>
            <div className="form-group">
              <label htmlFor="diagnosis">Diagnosis *</label>
              <textarea
                id="diagnosis"
                name="diagnosis"
                value={consultation.diagnosis}
                onChange={handleChange}
                placeholder="Enter the diagnosis based on examination..."
                rows="4"
                className={errors.diagnosis ? "error" : ""}
              />
              {errors.diagnosis && (
                <span className="error-message">{errors.diagnosis}</span>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="recommendation">Recommendation</label>
              <textarea
                id="recommendation"
                name="recommendation"
                value={consultation.recommendation}
                onChange={handleChange}
                placeholder="Any additional recommendations..."
                rows="3"
              />
            </div>
            <div className="button-group">
              <button className="btn btn-secondary" onClick={() => setCurrentStep(1)}>← Back</button>
              <button className="btn btn-primary" onClick={handleNextStep}>Next →</button>
            </div>
          </div>
        )}

        {/* Step 3: Treatment Plan */}
        {currentStep === 3 && (
          <div className="step-content">
            <h2>Treatment Plan</h2>
            <p className="step-instruction">Prescribe treatment and medications</p>
            <div className="form-group">
              <label htmlFor="treatmentPlan">Treatment Plan *</label>
              <textarea
                id="treatmentPlan"
                name="treatmentPlan"
                value={consultation.treatmentPlan}
                onChange={handleChange}
                placeholder="Describe the treatment plan..."
                rows="4"
                className={errors.treatmentPlan ? "error" : ""}
              />
              {errors.treatmentPlan && (
                <span className="error-message">{errors.treatmentPlan}</span>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="medicines">Medicines/Prescription *</label>
              <textarea
                id="medicines"
                name="medicines"
                value={consultation.medicines}
                onChange={handleChange}
                placeholder="List medicines with dosage and instructions..."
                rows="4"
                className={errors.medicines ? "error" : ""}
              />
              {errors.medicines && (
                <span className="error-message">{errors.medicines}</span>
              )}
            </div>
            <div className="form-group checkbox">
              <label htmlFor="followUp">
                <input
                  type="checkbox"
                  id="followUp"
                  name="followUp"
                  checked={consultation.followUp}
                  onChange={handleChange}
                />
                <span>Follow-up consultation required</span>
              </label>
            </div>

            {consultation.followUp && (
              <div className="form-group">
                <label htmlFor="followUpDetails">Follow-up Details</label>
                <input
                  type="text"
                  id="followUpDetails"
                  name="followUpDetails"
                  value={consultation.followUpDetails}
                  onChange={handleChange}
                  placeholder="e.g., Return in 1 week, After 3 days, etc."
                />
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
            <h2>Consultation Complete</h2>
            <p className="step-instruction">Review summary before sending to pharmacy</p>
            
            <div className="consultation-summary">
              <div className="summary-section">
                <h3>Physician Information</h3>
                <div className="summary-item">
                  <span className="label">Physician:</span>
                  <span className="value">{consultation.physicianName}</span>
                </div>
              </div>

              <div className="summary-section">
                <h3>Clinical Findings</h3>
                <div className="summary-item">
                  <span className="label">Examination:</span>
                  <span className="value">{consultation.examination}</span>
                </div>
                <div className="summary-item">
                  <span className="label">Diagnosis:</span>
                  <span className="value">{consultation.diagnosis}</span>
                </div>
              </div>

              <div className="summary-section">
                <h3>Treatment</h3>
                <div className="summary-item">
                  <span className="label">Plan:</span>
                  <span className="value">{consultation.treatmentPlan}</span>
                </div>
                <div className="summary-item">
                  <span className="label">Prescription:</span>
                  <span className="value">{consultation.medicines}</span>
                </div>
              </div>

              {consultation.followUp && (
                <div className="summary-section">
                  <h3>Follow-up</h3>
                  <div className="summary-item">
                    <span className="label">Required:</span>
                    <span className="value">{consultation.followUpDetails}</span>
                  </div>
                </div>
              )}

              <div className="additional-notes">
                <label htmlFor="notes">Additional Notes</label>
                <textarea
                  id="notes"
                  name="notes"
                  value={consultation.notes}
                  onChange={handleChange}
                  placeholder="Any final notes..."
                  rows="2"
                />
              </div>
            </div>

            <div className="button-group">
              <button className="btn btn-secondary" onClick={() => setCurrentStep(3)}>← Back</button>
              <button
                className="btn btn-success btn-lg"
                onClick={handleComplete}
                disabled={isProcessing}
              >
                {isProcessing ? "Processing..." : "✅ Complete & Send to Pharmacy"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Station5_PhysicianConsult;
