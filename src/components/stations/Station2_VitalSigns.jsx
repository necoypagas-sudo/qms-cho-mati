// src/components/stations/Station2_VitalSigns.jsx
// STATION 2: Vital Signs - Blood pressure, temperature, height, weight measurement

import React, { useState } from "react";
import "../styles/Station2.css";

const Station2_VitalSigns = ({ currentPatient, onStationComplete, qmsHook = {} }) => {
  const [vitals, setVitals] = useState({
    bloodPressureSystolic: "",
    bloodPressureDiastolic: "",
    temperature: "",
    height: "",
    weight: "",
    notes: "",
  });

  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const steps = [
    { label: "Check In", completed: currentStep >= 0 },
    { label: "BP Reading", completed: currentStep >= 1 },
    { label: "Temperature", completed: currentStep >= 2 },
    { label: "Height/Weight", completed: currentStep >= 3 },
    { label: "Complete", completed: currentStep >= 4 },
  ];

  // Validate current step
  const validateStep = () => {
    const newErrors = {};

    if (currentStep === 1) {
      if (!vitals.bloodPressureSystolic) newErrors.bloodPressureSystolic = "Systolic BP is required";
      if (!vitals.bloodPressureDiastolic) newErrors.bloodPressureDiastolic = "Diastolic BP is required";
      if (vitals.bloodPressureSystolic && vitals.bloodPressureDiastolic) {
        const sys = parseInt(vitals.bloodPressureSystolic);
        const dia = parseInt(vitals.bloodPressureDiastolic);
        if (sys < 60 || sys > 200) newErrors.bloodPressureSystolic = "Invalid systolic reading";
        if (dia < 30 || dia > 150) newErrors.bloodPressureDiastolic = "Invalid diastolic reading";
      }
    }

    if (currentStep === 2) {
      if (!vitals.temperature) newErrors.temperature = "Temperature is required";
      if (vitals.temperature && (vitals.temperature < 35 || vitals.temperature > 42)) {
        newErrors.temperature = "Invalid temperature reading";
      }
    }

    if (currentStep === 3) {
      if (!vitals.height) newErrors.height = "Height is required";
      if (!vitals.weight) newErrors.weight = "Weight is required";
      if (vitals.height && (vitals.height < 50 || vitals.height > 250)) {
        newErrors.height = "Invalid height";
      }
      if (vitals.weight && (vitals.weight < 10 || vitals.weight > 500)) {
        newErrors.weight = "Invalid weight";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setVitals(prev => ({
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
    if (validateStep()) {
      setIsProcessing(true);
      try {
        // Calculate BMI
        const heightInMeters = parseInt(vitals.height) / 100;
        const weight = parseInt(vitals.weight);
        const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(2);

        const stationData = {
          bloodPressure: `${vitals.bloodPressureSystolic}/${vitals.bloodPressureDiastolic}`,
          temperature: parseFloat(vitals.temperature),
          height: parseInt(vitals.height),
          weight: parseInt(vitals.weight),
          bmi: parseFloat(bmi),
          notes: vitals.notes,
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
    }
  };

  return (
    <div className="station-2-container">
      {/* Header */}
      <div className="station-header">
        <div className="station-title">
          <span className="station-number">🌡️ STATION 2</span>
          <h1>Vital Signs</h1>
          <p>Blood Pressure, Temperature, Height & Weight</p>
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
            <p className="step-instruction">Welcome to Vital Signs Station</p>
            <div className="check-in-card">
              <p className="patient-name">{currentPatient?.fullName}</p>
              <p className="patient-age">Age: {currentPatient?.age} years</p>
              <p className="patient-gender">Gender: {currentPatient?.gender}</p>
              <button className="btn btn-primary btn-lg" onClick={handleNextStep}>
                ✓ Begin Vital Signs Check
              </button>
            </div>
          </div>
        )}

        {/* Step 1: BP Reading */}
        {currentStep === 1 && (
          <div className="step-content">
            <h2>Blood Pressure Reading</h2>
            <p className="step-instruction">Please have the patient sit comfortably for 2-3 minutes before measuring</p>
            <div className="form-group">
              <div className="form-row">
                <div className="form-item">
                  <label htmlFor="bloodPressureSystolic">Systolic (mmHg) *</label>
                  <input
                    type="number"
                    id="bloodPressureSystolic"
                    name="bloodPressureSystolic"
                    value={vitals.bloodPressureSystolic}
                    onChange={handleChange}
                    placeholder="120"
                    min="60"
                    max="200"
                    className={errors.bloodPressureSystolic ? "error" : ""}
                  />
                  {errors.bloodPressureSystolic && (
                    <span className="error-message">{errors.bloodPressureSystolic}</span>
                  )}
                </div>
                <div className="separator">/</div>
                <div className="form-item">
                  <label htmlFor="bloodPressureDiastolic">Diastolic (mmHg) *</label>
                  <input
                    type="number"
                    id="bloodPressureDiastolic"
                    name="bloodPressureDiastolic"
                    value={vitals.bloodPressureDiastolic}
                    onChange={handleChange}
                    placeholder="80"
                    min="30"
                    max="150"
                    className={errors.bloodPressureDiastolic ? "error" : ""}
                  />
                  {errors.bloodPressureDiastolic && (
                    <span className="error-message">{errors.bloodPressureDiastolic}</span>
                  )}
                </div>
              </div>
            </div>
            <div className="button-group">
              <button className="btn btn-secondary" onClick={() => setCurrentStep(0)}>← Back</button>
              <button className="btn btn-primary" onClick={handleNextStep}>Next →</button>
            </div>
          </div>
        )}

        {/* Step 2: Temperature */}
        {currentStep === 2 && (
          <div className="step-content">
            <h2>Temperature Reading</h2>
            <p className="step-instruction">Measure using thermometer (°C)</p>
            <div className="form-group">
              <label htmlFor="temperature">Temperature (°C) *</label>
              <input
                type="number"
                id="temperature"
                name="temperature"
                value={vitals.temperature}
                onChange={handleChange}
                placeholder="37.0"
                min="35"
                max="42"
                step="0.1"
                className={errors.temperature ? "error" : ""}
              />
              {errors.temperature && (
                <span className="error-message">{errors.temperature}</span>
              )}
              <div className="reference-normal">Normal: 36.5 - 37.5°C</div>
            </div>
            <div className="button-group">
              <button className="btn btn-secondary" onClick={() => setCurrentStep(1)}>← Back</button>
              <button className="btn btn-primary" onClick={handleNextStep}>Next →</button>
            </div>
          </div>
        )}

        {/* Step 3: Height & Weight */}
        {currentStep === 3 && (
          <div className="step-content">
            <h2>Height & Weight</h2>
            <p className="step-instruction">Measurements in cm and kg</p>
            <div className="form-group">
              <div className="form-row">
                <div className="form-item">
                  <label htmlFor="height">Height (cm) *</label>
                  <input
                    type="number"
                    id="height"
                    name="height"
                    value={vitals.height}
                    onChange={handleChange}
                    placeholder="170"
                    min="50"
                    max="250"
                    className={errors.height ? "error" : ""}
                  />
                  {errors.height && (
                    <span className="error-message">{errors.height}</span>
                  )}
                </div>
                <div className="form-item">
                  <label htmlFor="weight">Weight (kg) *</label>
                  <input
                    type="number"
                    id="weight"
                    name="weight"
                    value={vitals.weight}
                    onChange={handleChange}
                    placeholder="70"
                    min="10"
                    max="500"
                    step="0.5"
                    className={errors.weight ? "error" : ""}
                  />
                  {errors.weight && (
                    <span className="error-message">{errors.weight}</span>
                  )}
                </div>
              </div>
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
            <h2>Complete Vital Signs</h2>
            <p className="step-instruction">Additional notes (optional)</p>
            <div className="form-group">
              <label htmlFor="notes">Notes</label>
              <textarea
                id="notes"
                name="notes"
                value={vitals.notes}
                onChange={handleChange}
                placeholder="Any additional observations..."
                rows="4"
              />
            </div>
            <div className="vitals-summary">
              <h3>Vitals Summary</h3>
              <div className="summary-row">
                <span>Blood Pressure:</span>
                <strong>{vitals.bloodPressureSystolic}/{vitals.bloodPressureDiastolic} mmHg</strong>
              </div>
              <div className="summary-row">
                <span>Temperature:</span>
                <strong>{vitals.temperature}°C</strong>
              </div>
              <div className="summary-row">
                <span>Height:</span>
                <strong>{vitals.height} cm</strong>
              </div>
              <div className="summary-row">
                <span>Weight:</span>
                <strong>{vitals.weight} kg</strong>
              </div>
              <div className="summary-row">
                <span>BMI:</span>
                <strong>{((vitals.weight / ((vitals.height / 100) ** 2)).toFixed(2))}</strong>
              </div>
            </div>
            <div className="button-group">
              <button className="btn btn-secondary" onClick={() => setCurrentStep(3)}>← Back</button>
              <button
                className="btn btn-success btn-lg"
                onClick={handleComplete}
                disabled={isProcessing}
              >
                {isProcessing ? "Processing..." : "✅ Complete & Send to Station 3"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Station2_VitalSigns;
