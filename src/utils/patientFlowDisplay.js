// src/utils/patientFlowDisplay.js
// Display and UI formatting utilities for Patient Navigation Flow

import { STATIONS, getStationByStep, PATIENT_STATUS } from "../constants/stations";

/**
 * Get display color for a step/station
 * @param {number} step - Step number (1-9)
 * @returns {string} - Color hex code
 */
export const getStepColor = (step) => {
  const station = getStationByStep(step);
  return station ? station.color : "#6c757d";
};

/**
 * Get display icon for a step/station
 * @param {number} step - Step number (1-9)
 * @returns {string} - Icon emoji
 */
export const getStepIcon = (step) => {
  const station = getStationByStep(step);
  return station ? station.icon : "🔄";
};

/**
 * Format ticket number for display
 * @param {string} ticketNumber - Ticket number like "REG001"
 * @returns {Object} - { code, number } for UI display
 */
export const formatTicketNumber = (ticketNumber) => {
  if (!ticketNumber) return { code: "", number: "" };
  const code = ticketNumber.slice(0, -3);
  const number = ticketNumber.slice(-3);
  return { code, number };
};

/**
 * Get patient status display text and color
 * @param {string} status - Patient status from PATIENT_STATUS
 * @returns {Object} - { text, color, icon }
 */
export const getStatusDisplay = (status) => {
  const statusMap = {
    [PATIENT_STATUS.WAITING]: {
      text: "Waiting",
      color: "#ffc107",
      icon: "⏳",
      bg: "#fff3cd"
    },
    [PATIENT_STATUS.IN_STATION]: {
      text: "In Service",
      color: "#17a2b8",
      icon: "🔄",
      bg: "#d1ecf1"
    },
    [PATIENT_STATUS.COMPLETED_STATION]: {
      text: "Station Complete",
      color: "#198754",
      icon: "✓",
      bg: "#d1e7dd"
    },
    [PATIENT_STATUS.ROUTED_TO_NEXT]: {
      text: "Routing",
      color: "#0dcaf0",
      icon: "→",
      bg: "#cff4fc"
    },
    [PATIENT_STATUS.IN_ANCILLARY]: {
      text: "Ancillary",
      color: "#fd7e14",
      icon: "⚕️",
      bg: "#ffe5d1"
    },
    [PATIENT_STATUS.COMPLETED_JOURNEY]: {
      text: "Completed",
      color: "#6f42c1",
      icon: "✓✓",
      bg: "#e2d5f1"
    },
  };

  return statusMap[status] || {
    text: "Unknown",
    color: "#6c757d",
    icon: "?",
    bg: "#e2e3e5"
  };
};

/**
 * Format wait time in milliseconds to human-readable string
 * @param {number} waitTimeMs - Wait time in milliseconds
 * @returns {string} - Formatted time like "5 min 30 sec" or "1 hr 20 min"
 */
export const formatWaitTime = (waitTimeMs) => {
  if (!waitTimeMs || waitTimeMs < 0) return "0 sec";

  const seconds = Math.floor(waitTimeMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  const remainingSeconds = seconds % 60;

  if (hours > 0) {
    return `${hours}h ${remainingMinutes}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`;
  } else {
    return `${seconds}s`;
  }
};

/**
 * Format duration for display (journey time, etc.)
 * @param {number} durationMs - Duration in milliseconds
 * @returns {string} - Formatted duration
 */
export const formatDuration = (durationMs) => {
  return formatWaitTime(durationMs);
};

/**
 * Get step progress as percentage
 * @param {number} currentStep - Current step (1-9)
 * @returns {number} - Percentage (0-100)
 */
export const getProgressPercentage = (currentStep) => {
  const step = Math.max(1, Math.min(9, currentStep));
  return Math.round((step / 9) * 100);
};

/**
 * Get completed steps progress bar text
 * @param {Array} completedSteps - Array of completed step numbers
 * @returns {string} - Progress text like "3 of 9 steps completed"
 */
export const getProgressText = (completedSteps = []) => {
  const completed = completedSteps.length;
  return `${completed} of 9 steps completed`;
};

/**
 * Create a visual progress bar
 * @param {number} currentStep - Current step number
 * @returns {string} - Progress bar string like "████░░░░░" (visual representation)
 */
export const createProgressBar = (currentStep) => {
  const filled = Math.round((currentStep / 9) * 10);
  const empty = 10 - filled;
  return "█".repeat(filled) + "░".repeat(empty);
};

/**
 * Get step timeline visualization
 * @param {number} currentStep - Current step
 * @param {Array} completedSteps - Completed steps
 * @returns {Array} - Array of step display objects
 */
export const getStepTimeline = (currentStep, completedSteps = []) => {
  return STATIONS.map((station) => ({
    step: station.step,
    name: station.name,
    code: station.code,
    icon: station.icon,
    color: station.color,
    status:
      completedSteps.includes(station.step)
        ? "completed"
        : station.step === currentStep
        ? "current"
        : station.step < currentStep
        ? "passed"
        : "pending",
  }));
};

/**
 * Calculate average wait time in minutes
 * @param {number} waitTimeMs - Wait time in milliseconds
 * @returns {number} - Wait time in minutes (rounded to 1 decimal)
 */
export const getWaitTimeInMinutes = (waitTimeMs) => {
  return Math.round((waitTimeMs / 1000 / 60) * 10) / 10;
};

/**
 * Get bottleneck severity level
 * @param {number} averageWaitTimeMs - Average wait time in milliseconds
 * @returns {Object} - { level: "normal"|"warning"|"critical", icon, color }
 */
export const getBottleneckLevel = (averageWaitTimeMs) => {
  const minutesWait = averageWaitTimeMs / 1000 / 60;

  if (minutesWait <= 15) {
    return {
      level: "normal",
      icon: "✓",
      color: "#198754",
      text: "Normal"
    };
  } else if (minutesWait <= 30) {
    return {
      level: "warning",
      icon: "⚠️",
      color: "#ffc107",
      text: "Warning"
    };
  } else {
    return {
      level: "critical",
      icon: "🚨",
      color: "#dc3545",
      text: "Critical"
    };
  }
};

/**
 * Format patient info for display card
 * @param {Object} patient - Patient object
 * @returns {Object} - Formatted display object
 */
export const formatPatientCard = (patient) => {
  const statusDisplay = getStatusDisplay(patient.status);
  const ticketDisplay = formatTicketNumber(patient.ticketNumber);
  const currentStation = getStationByStep(patient.currentStep);
  const progressBar = createProgressBar(patient.currentStep);

  return {
    ticketNumber: patient.ticketNumber,
    ticketDisplay,
    patientName: patient.patientName || "Unknown",
    patientId: patient.patientId || "N/A",
    status: patient.status,
    statusDisplay,
    currentStep: patient.currentStep,
    currentStationName: currentStation?.name || "Unknown",
    currentStationIcon: currentStation?.icon || "?",
    progressPercentage: getProgressPercentage(patient.currentStep),
    progressBar,
    completedSteps: patient.completedSteps?.length || 0,
    registeredAt: patient.registeredAt,
  };
};

/**
 * Get queue status summary
 * @param {Array} queue - Queue array
 * @param {Object} nowServing - Current patient
 * @returns {Object} - Queue summary
 */
export const getQueueSummary = (queue = [], nowServing = null) => {
  const total = (queue?.length || 0) + (nowServing ? 1 : 0);
  const waiting = queue?.length || 0;

  return {
    total,
    waiting,
    serving: nowServing ? 1 : 0,
    isEmpty: total === 0,
  };
};

/**
 * Format timestamp to readable date/time
 * @param {Date|string} timestamp - Timestamp
 * @param {boolean} includeTime - Include time portion
 * @returns {string} - Formatted date/time
 */
export const formatTimestamp = (timestamp, includeTime = true) => {
  if (!timestamp) return "N/A";

  const date = new Date(timestamp);
  const dateStr = date.toLocaleDateString("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });

  if (includeTime) {
    const timeStr = date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });
    return `${dateStr} ${timeStr}`;
  }

  return dateStr;
};

/**
 * Get list of stations still to visit
 * @param {number} currentStep - Current step
 * @returns {Array} - Array of upcoming stations
 */
export const getUpcomingStations = (currentStep) => {
  return STATIONS.filter((s) => s.step > currentStep);
};

/**
 * Get list of completed stations
 * @param {Array} completedSteps - Array of completed step numbers
 * @returns {Array} - Array of completed stations
 */
export const getCompletedStations = (completedSteps = []) => {
  return STATIONS.filter((s) => completedSteps.includes(s.step));
};
