// src/utils/ancillaryServices.js
// Ancillary Services Routing Logic
// Implements dynamic routing and ABTC prioritization for Step 9

import { ANCILLARY_SERVICES } from "../constants/stations";

/**
 * Determines which ancillary services a patient should be routed to
 * based on the consultation notes and orders
 *
 * @param {Object} consultationData - Data from Step 7 (CONS)
 * @param {Object} ordersData - Data from Step 8 (ENC2)
 * @returns {Array} - Array of ancillary service IDs to route to
 */
export const determineAncillaryServices = (consultationData = {}, ordersData = {}) => {
  const services = [];

  // LAB - Laboratory tests
  if (ordersData.labTests && ordersData.labTests.length > 0) {
    services.push("LAB");
  }

  // NIP - National Immunization Program
  if (ordersData.immunizationRequired || consultationData.needsImmunization) {
    services.push("NIP");
  }

  // PHAR - Pharmacy
  if (ordersData.medications && ordersData.medications.length > 0) {
    services.push("PHAR");
  }

  // XRAY - X-ray Imaging
  if (ordersData.imagingStudies && ordersData.imagingStudies.includes("XRAY")) {
    services.push("XRAY");
  }

  // ECG - Electrocardiogram
  if (ordersData.imagingStudies && ordersData.imagingStudies.includes("ECG")) {
    services.push("ECG");
  }

  // ABTC - Animal Bite Treatment Center
  if (ordersData.antiRabiesRequired || consultationData.animalBiteCase) {
    services.push("ABTC");
  }

  return services;
};

/**
 * Handles ABTC (Animal Bite Treatment Center) prioritization
 * If ABTC is in the services list, it should be prioritized in Step 9 routing
 *
 * @param {Array} ancillaryServices - Array of service IDs
 * @returns {Object} - Contains isABTCPriority flag and reordered services
 */
export const handleABTCPrioritization = (ancillaryServices = []) => {
  const hasABTC = ancillaryServices.includes("ABTC");

  if (hasABTC) {
    // Reorder with ABTC first
    const reordered = ["ABTC", ...ancillaryServices.filter((s) => s !== "ABTC")];
    return {
      isABTCPriority: true,
      priorityFlag: true,
      services: reordered,
    };
  }

  return {
    isABTCPriority: false,
    priorityFlag: false,
    services: ancillaryServices,
  };
};

/**
 * Get service queue information
 * Used for displaying which ancillary services still need to be completed
 *
 * @param {Array} ancillaryServices - Array of service IDs to complete
 * @returns {Array} - Array of service objects with queue info
 */
export const getAncillaryServiceQueue = (ancillaryServices = []) => {
  return ancillaryServices
    .map((serviceId) => ANCILLARY_SERVICES.find((s) => s.id === serviceId))
    .filter((service) => service !== undefined);
};

/**
 * Check if patient needs ABTC based on consultation data
 * This is called during Step 7 (CONS) to flag for potential ABTC routing
 *
 * @param {Object} consultationData - Doctor's notes and observations
 * @returns {boolean} - True if ABTC is needed
 */
export const isABTCRequired = (consultationData = {}) => {
  return (
    consultationData.animalBiteCase === true ||
    consultationData.animalBiteCase === "yes" ||
    (consultationData.diagnosis && consultationData.diagnosis.toLowerCase().includes("animal bite")) ||
    (consultationData.chiefComplaint && consultationData.chiefComplaint.toLowerCase().includes("bite")) ||
    (consultationData.chiefComplaint && consultationData.chiefComplaint.toLowerCase().includes("rabies"))
  );
};

/**
 * Calculate completion progress for ancillary services
 *
 * @param {Array} totalServices - Total ancillary services required
 * @param {Array} completedServices - Services already completed
 * @returns {Object} - Progress info (completed, remaining, percentage)
 */
export const calculateAncillaryProgress = (totalServices = [], completedServices = []) => {
  const completed = completedServices.length;
  const total = totalServices.length;
  const remaining = total - completed;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return {
    completed,
    remaining,
    total,
    percentage,
    allComplete: remaining === 0,
  };
};

/**
 * Get the display information for a single ancillary service
 *
 * @param {string} serviceId - Service ID (e.g., "LAB", "PHAR")
 * @returns {Object} - Service details with display properties
 */
export const getServiceDisplay = (serviceId) => {
  const service = ANCILLARY_SERVICES.find((s) => s.id === serviceId);
  if (!service) return null;

  return {
    id: service.id,
    name: service.name,
    code: service.code,
    color: service.color,
    icon: service.icon,
    displayName: `${service.icon} ${service.name}`,
  };
};

/**
 * Format ancillary services for display/reporting
 *
 * @param {Array} serviceIds - Array of service IDs
 * @returns {string} - Formatted string for display (e.g., "LAB, PHAR, XRAY")
 */
export const formatAncillaryServices = (serviceIds = []) => {
  return serviceIds
    .map((id) => {
      const service = ANCILLARY_SERVICES.find((s) => s.id === id);
      return service ? service.code : id;
    })
    .join(", ");
};
