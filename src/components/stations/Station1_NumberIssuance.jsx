// src/components/stations/Station1_NumberIssuance.jsx
// STATION 1: Number Issuance - Patient Registration & Ticket Issuance

import React, { useState } from "react";
import "./Station1.css";

const Station1_NumberIssuance = ({ onPatientRegistered, isProcessing = false }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    age: "",
    gender: "",
    contactNumber: "",
    address: "",
    isPriority: false,
    priorityReason: "",
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [lastTicket, setLastTicket] = useState(null);

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.age || formData.age < 1 || formData.age > 150) newErrors.age = "Valid age required";
    if (!formData.gender) newErrors.gender = "Gender is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    // Create patient data object
    const patientData = {
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      fullName: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
      age: parseInt(formData.age),
      gender: formData.gender,
      contactNumber: formData.contactNumber.trim(),
      address: formData.address.trim(),
      isPriority: formData.isPriority,
      priorityReason: formData.priorityReason.trim(),
    };

    // Callback to parent (App or Station Manager)
    if (onPatientRegistered) {
      const registeredPatient = onPatientRegistered(patientData);
      setLastTicket(registeredPatient);
      setSubmitted(true);
      
      // Clear form for next patient after 3 seconds
      setTimeout(() => {
        setFormData({
          firstName: "",
          lastName: "",
          age: "",
          gender: "",
          contactNumber: "",
          address: "",
          isPriority: false,
          priorityReason: "",
        });
        setSubmitted(false);
      }, 3000);
    }
  };

  return (
    <div className="station-1-container">
      {/* Header */}
      <div className="station-header">
        <div className="station-title">
          <span className="station-number">🔢 STATION 1</span>
          <h1>Number Issuance</h1>
          <p>Patient Registration & Ticket Issuance</p>
        </div>
      </div>

      {/* Success Message */}
      {submitted && lastTicket && (
        <div className="success-card">
          <div className="ticket-display">
            <h2>✅ Registration Successful!</h2>
            <div className="ticket-number">
              <span className="label">Your Ticket Number:</span>
              <span className="number">{lastTicket.ticketNumber}</span>
            </div>
            <div className="patient-info">
              <p><strong>Name:</strong> {lastTicket.fullName}</p>
              <p><strong>Age:</strong> {lastTicket.age} years old</p>
              <p><strong>Gender:</strong> {lastTicket.gender}</p>
            </div>
            <div className="next-steps">
              <p className="step-label">📍 Please proceed to:</p>
              <p className="next-station"><strong>STATION 2: Vital Signs</strong></p>
              <p className="instruction">Follow the direction signs in the clinic</p>
            </div>
          </div>
        </div>
      )}

      {/* Registration Form */}
      {!submitted && (
        <form onSubmit={handleSubmit} className="registration-form">
          {/* Personal Information */}
          <fieldset>
            <legend>📋 Personal Information</legend>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">First Name *</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Juan"
                  disabled={isProcessing}
                  className={errors.firstName ? "error" : ""}
                />
                {errors.firstName && <span className="error-message">{errors.firstName}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="lastName">Last Name *</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Dela Cruz"
                  disabled={isProcessing}
                  className={errors.lastName ? "error" : ""}
                />
                {errors.lastName && <span className="error-message">{errors.lastName}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="age">Age *</label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="25"
                  min="1"
                  max="150"
                  disabled={isProcessing}
                  className={errors.age ? "error" : ""}
                />
                {errors.age && <span className="error-message">{errors.age}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="gender">Gender *</label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  disabled={isProcessing}
                  className={errors.gender ? "error" : ""}
                >
                  <option value="">-- Select Gender --</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                {errors.gender && <span className="error-message">{errors.gender}</span>}
              </div>
            </div>
          </fieldset>

          {/* Contact Information */}
          <fieldset>
            <legend>📱 Contact Information</legend>
            
            <div className="form-group">
              <label htmlFor="contactNumber">Contact Number</label>
              <input
                type="tel"
                id="contactNumber"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                placeholder="09123456789"
                disabled={isProcessing}
              />
            </div>

            <div className="form-group">
              <label htmlFor="address">Address</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Brgy. Central, City of Mati"
                disabled={isProcessing}
              />
            </div>
          </fieldset>

          {/* Priority */}
          <fieldset>
            <legend>⚠️ Priority Status</legend>
            
            <div className="form-group checkbox">
              <label htmlFor="isPriority">
                <input
                  type="checkbox"
                  id="isPriority"
                  name="isPriority"
                  checked={formData.isPriority}
                  onChange={handleChange}
                  disabled={isProcessing}
                />
                <span>This is a priority patient</span>
              </label>
              <p className="help-text">
                Check if patient is pregnant, senior, PWD, or nursing mother
              </p>
            </div>

            {formData.isPriority && (
              <div className="form-group">
                <label htmlFor="priorityReason">Priority Reason</label>
                <input
                  type="text"
                  id="priorityReason"
                  name="priorityReason"
                  value={formData.priorityReason}
                  onChange={handleChange}
                  placeholder="e.g., Senior Citizen, Pregnant, PWD"
                  disabled={isProcessing}
                />
              </div>
            )}
          </fieldset>

          {/* Buttons */}
          <div className="form-actions">
            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : "✅ Issue Ticket"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Station1_NumberIssuance;
