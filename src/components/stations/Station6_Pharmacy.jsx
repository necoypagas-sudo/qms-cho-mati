// src/components/stations/Station6_Pharmacy.jsx
// STATION 6: Pharmacy - Medicine dispensing & counseling

import React, { useState } from "react";
import "../styles/Station6.css";

const Station6_Pharmacy = ({ currentPatient, onStationComplete, qmsHook = {} }) => {
  const [pharmacy, setPharmacy] = useState({
    prescriptionReview: "",
    medicinesDispensed: "",
    pharmacistName: "",
    counselingProvided: false,
    counselingNotes: "",
    dosageInstructions: "",
    sideEffects: "",
    warningsAndPrecautions: "",
    followUpAppt: false,
    followUpDate: "",
    notes: "",
  });

  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [completed, setCompleted] = useState(false);

  const steps = [
    { label: "Check In", completed: currentStep >= 0 },
    { label: "Prescription Review", completed: currentStep >= 1 },
    { label: "Medicine Dispensing", completed: currentStep >= 2 },
    { label: "Counseling", completed: currentStep >= 3 },
    { label: "Complete", completed: currentStep >= 4 },
  ];

  // Validate current step
  const validateStep = () => {
    const newErrors = {};

    if (currentStep === 1) {
      if (!pharmacy.prescriptionReview.trim()) newErrors.prescriptionReview = "Prescription review is required";
      if (!pharmacy.pharmacistName.trim()) newErrors.pharmacistName = "Pharmacist name is required";
    }

    if (currentStep === 2) {
      if (!pharmacy.medicinesDispensed.trim()) newErrors.medicinesDispensed = "Dispensed medicines must be listed";
    }

    if (currentStep === 3) {
      if (pharmacy.counselingProvided && !pharmacy.counselingNotes.trim()) {
        newErrors.counselingNotes = "Counseling notes are required if provided";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPharmacy(prev => ({
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
        prescriptionReview: pharmacy.prescriptionReview.trim(),
        medicinesDispensed: pharmacy.medicinesDispensed.trim(),
        pharmacistName: pharmacy.pharmacistName.trim(),
        counselingProvided: pharmacy.counselingProvided,
        counselingNotes: pharmacy.counselingNotes.trim(),
        dosageInstructions: pharmacy.dosageInstructions.trim(),
        sideEffects: pharmacy.sideEffects.trim(),
        warningsAndPrecautions: pharmacy.warningsAndPrecautions.trim(),
        followUpAppt: pharmacy.followUpAppt,
        followUpDate: pharmacy.followUpDate,
        notes: pharmacy.notes.trim(),
        completedAt: new Date(),
      };

      if (onStationComplete) {
        onStationComplete(stationData);
        setCompleted(true);
      }
    } catch (error) {
      console.error("Error completing station:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (completed) {
    return (
      <div className="station-6-container">
        <div className="completion-screen">
          <div className="completion-card">
            <div className="completion-icon">✅</div>
            <h1>Journey Complete!</h1>
            <p className="patient-name">{currentPatient?.fullName}</p>
            <p className="ticket-number">Ticket: {currentPatient?.ticketNumber}</p>
            
            <div className="completion-message">
              <p>Thank you for visiting our clinic.</p>
              <p>Your journey through all 6 stations is complete.</p>
            </div>

            <div className="next-steps-info">
              <h3>Please Remember:</h3>
              <ul>
                <li>✓ Take all medicines as prescribed</li>
                <li>✓ Follow the dosage instructions carefully</li>
                <li>✓ Watch for any side effects</li>
                {pharmacy.followUpAppt && (
                  <li>✓ Return on: <strong>{pharmacy.followUpDate}</strong></li>
                )}
              </ul>
            </div>

            <p className="farewell">We wish you good health!</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="station-6-container">
      {/* Header */}
      <div className="station-header">
        <div className="station-title">
          <span className="station-number">💊 STATION 6</span>
          <h1>Pharmacy</h1>
          <p>Medicine Dispensing & Counseling (Final Station)</p>
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
            <p className="step-instruction">Welcome to the Pharmacy - Final Station</p>
            <div className="check-in-card">
              <p className="patient-name">{currentPatient?.fullName}</p>
              <p className="patient-age">Age: {currentPatient?.age} years</p>
              <p className="patient-gender">Gender: {currentPatient?.gender}</p>
              <p className="instruction-text">Your prescription will be reviewed and medicines will be dispensed here.</p>
              <button className="btn btn-primary btn-lg" onClick={handleNextStep}>
                ✓ Begin Pharmacy Service
              </button>
            </div>
          </div>
        )}

        {/* Step 1: Prescription Review */}
        {currentStep === 1 && (
          <div className="step-content">
            <h2>Prescription Review</h2>
            <p className="step-instruction">Record pharmacist information and prescription review</p>
            <div className="form-group">
              <label htmlFor="pharmacistName">Pharmacist Name *</label>
              <input
                type="text"
                id="pharmacistName"
                name="pharmacistName"
                value={pharmacy.pharmacistName}
                onChange={handleChange}
                placeholder="Pharmacist Name"
                className={errors.pharmacistName ? "error" : ""}
              />
              {errors.pharmacistName && (
                <span className="error-message">{errors.pharmacistName}</span>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="prescriptionReview">Prescription Review *</label>
              <textarea
                id="prescriptionReview"
                name="prescriptionReview"
                value={pharmacy.prescriptionReview}
                onChange={handleChange}
                placeholder="Review details - check for interactions, contraindications, etc..."
                rows="4"
                className={errors.prescriptionReview ? "error" : ""}
              />
              {errors.prescriptionReview && (
                <span className="error-message">{errors.prescriptionReview}</span>
              )}
            </div>
            <div className="button-group">
              <button className="btn btn-secondary" onClick={() => setCurrentStep(0)}>← Back</button>
              <button className="btn btn-primary" onClick={handleNextStep}>Next →</button>
            </div>
          </div>
        )}

        {/* Step 2: Medicine Dispensing */}
        {currentStep === 2 && (
          <div className="step-content">
            <h2>Medicine Dispensing</h2>
            <p className="step-instruction">Record medicines dispensed to the patient</p>
            <div className="form-group">
              <label htmlFor="medicinesDispensed">Medicines Dispensed *</label>
              <textarea
                id="medicinesDispensed"
                name="medicinesDispensed"
                value={pharmacy.medicinesDispensed}
                onChange={handleChange}
                placeholder="List all medicines dispensed with quantity and package details..."
                rows="5"
                className={errors.medicinesDispensed ? "error" : ""}
              />
              {errors.medicinesDispensed && (
                <span className="error-message">{errors.medicinesDispensed}</span>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="dosageInstructions">Dosage Instructions</label>
              <textarea
                id="dosageInstructions"
                name="dosageInstructions"
                value={pharmacy.dosageInstructions}
                onChange={handleChange}
                placeholder="How and when to take each medicine..."
                rows="3"
              />
            </div>
            <div className="button-group">
              <button className="btn btn-secondary" onClick={() => setCurrentStep(1)}>← Back</button>
              <button className="btn btn-primary" onClick={handleNextStep}>Next →</button>
            </div>
          </div>
        )}

        {/* Step 3: Counseling */}
        {currentStep === 3 && (
          <div className="step-content">
            <h2>Patient Counseling</h2>
            <p className="step-instruction">Provide counseling to the patient</p>
            
            <div className="form-group checkbox">
              <label htmlFor="counselingProvided">
                <input
                  type="checkbox"
                  id="counselingProvided"
                  name="counselingProvided"
                  checked={pharmacy.counselingProvided}
                  onChange={handleChange}
                />
                <span>Counseling provided to patient</span>
              </label>
            </div>

            {pharmacy.counselingProvided && (
              <div className="form-group">
                <label htmlFor="counselingNotes">Counseling Notes *</label>
                <textarea
                  id="counselingNotes"
                  name="counselingNotes"
                  value={pharmacy.counselingNotes}
                  onChange={handleChange}
                  placeholder="What counseling was provided..."
                  rows="3"
                  className={errors.counselingNotes ? "error" : ""}
                />
                {errors.counselingNotes && (
                  <span className="error-message">{errors.counselingNotes}</span>
                )}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="sideEffects">Possible Side Effects</label>
              <textarea
                id="sideEffects"
                name="sideEffects"
                value={pharmacy.sideEffects}
                onChange={handleChange}
                placeholder="Inform patient about possible side effects..."
                rows="3"
              />
            </div>

            <div className="form-group">
              <label htmlFor="warningsAndPrecautions">Warnings & Precautions</label>
              <textarea
                id="warningsAndPrecautions"
                name="warningsAndPrecautions"
                value={pharmacy.warningsAndPrecautions}
                onChange={handleChange}
                placeholder="Important warnings and precautions..."
                rows="3"
              />
            </div>

            <div className="form-group checkbox">
              <label htmlFor="followUpAppt">
                <input
                  type="checkbox"
                  id="followUpAppt"
                  name="followUpAppt"
                  checked={pharmacy.followUpAppt}
                  onChange={handleChange}
                />
                <span>Follow-up appointment scheduled</span>
              </label>
            </div>

            {pharmacy.followUpAppt && (
              <div className="form-group">
                <label htmlFor="followUpDate">Follow-up Date</label>
                <input
                  type="date"
                  id="followUpDate"
                  name="followUpDate"
                  value={pharmacy.followUpDate}
                  onChange={handleChange}
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
            <h2>Pharmacy Complete</h2>
            <p className="step-instruction">Final notes before completion</p>

            <div className="pharmacy-summary">
              <div className="summary-section">
                <h3>Pharmacist Information</h3>
                <div className="summary-item">
                  <span className="label">Pharmacist:</span>
                  <span className="value">{pharmacy.pharmacistName}</span>
                </div>
              </div>

              <div className="summary-section">
                <h3>Medicines Dispensed</h3>
                <div className="summary-item">
                  <span className="value" style={{whiteSpace: 'pre-wrap'}}>{pharmacy.medicinesDispensed}</span>
                </div>
              </div>

              <div className="summary-section">
                <h3>Dosage</h3>
                <div className="summary-item">
                  <span className="value" style={{whiteSpace: 'pre-wrap'}}>{pharmacy.dosageInstructions}</span>
                </div>
              </div>

              {pharmacy.counselingProvided && (
                <div className="summary-section">
                  <h3>Counseling Provided</h3>
                  <div className="summary-item">
                    <span className="value">{pharmacy.counselingNotes}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="notes">Additional Notes</label>
              <textarea
                id="notes"
                name="notes"
                value={pharmacy.notes}
                onChange={handleChange}
                placeholder="Any final notes..."
                rows="2"
              />
            </div>

            <div className="button-group">
              <button className="btn btn-secondary" onClick={() => setCurrentStep(3)}>← Back</button>
              <button
                className="btn btn-success btn-lg"
                onClick={handleComplete}
                disabled={isProcessing}
              >
                {isProcessing ? "Processing..." : "✅ Complete Patient Journey"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Station6_Pharmacy;
