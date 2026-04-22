// src/hooks/usePatientNavigationQMS.js
// Patient Navigation QMS Hook - 9-Step Sequential State Machine
// Implements the official Patient Navigation System Flow (Mati PCF-Central)

import { useState, useEffect } from "react";
import { STATIONS, ANCILLARY_SERVICES, PATIENT_STATUS, getStationByStep, getNextStep } from "../constants/stations";

export function usePatientNavigationQMS() {
  // Main patient registry - tracks ALL patients through 9-step journey
  const [patients, setPatients] = useState([]);

  // Station queues - waiting patients at each step
  const [stepQueues, setStepQueues] = useState({});

  // Currently serving at each step
  const [nowServingByStep, setNowServingByStep] = useState({});

  // Statistics for bottleneck detection
  const [stats, setStats] = useState({
    totalRegistered: 0,
    totalCompleted: 0,
    averageJourneyTime: 0,
    stepStats: {},
  });

  // Initialize step queues on mount
  useEffect(() => {
    const newQueues = {};
    const newNowServing = {};
    const newStepStats = {};

    STATIONS.forEach((station) => {
      newQueues[station.step] = [];
      newNowServing[station.step] = null;
      newStepStats[station.step] = {
        stationName: station.name,
        stationCode: station.code,
        served: 0,
        totalWaitTime: 0, // in milliseconds
        averageWaitTime: 0,
        maxWaitTime: 0,
        bottleneck: false,
      };
    });

    setStepQueues(newQueues);
    setNowServingByStep(newNowServing);
    setStats((prev) => ({
      ...prev,
      stepStats: newStepStats,
    }));
  }, []);

  /**
   * STEP 1: Registration (REG)
   * Register patient and create ticket
   */
  const registerPatient = (patientData) => {
    const ticketNumber = patients.length + 1;
    const station1 = getStationByStep(1); // REG

    const patient = {
      id: Math.random(),
      ticketNumber: `${station1.code}${String(ticketNumber).padStart(3, "0")}`,
      ...patientData,
      registeredAt: new Date(),
      status: PATIENT_STATUS.WAITING,
      currentStep: 1,
      completedSteps: [],
      stepJourney: {}, // Track timestamps for each step
      vitals: null, // Step 2 data
      triageData: null, // Step 3 data
      assessment: null, // Step 4 data
      primaryEncoding: null, // Step 5 data
      consultation: null, // Step 7 data
      ancillaryOrders: null, // Step 8 data
      routedToAncillary: false,
      ancillaryServices: [], // Step 9 assigned services
      requiresABTC: false, // Flag for Animal Bite Treatment Center
    };

    setPatients((prev) => [...prev, patient]);

    // Add to Step 1 queue
    setStepQueues((prev) => ({
      ...prev,
      [1]: [...(prev[1] || []), patient],
    }));

    setStats((prev) => ({
      ...prev,
      totalRegistered: prev.totalRegistered + 1,
    }));

    return patient;
  };

  /**
   * Call next patient at a specific step
   */
  const callNextAtStep = (step) => {
    const queue = stepQueues[step] || [];
    if (queue.length === 0) return null;

    const patient = queue[0];
    const station = getStationByStep(step);
    const enteredAt = new Date();

    // Record entry time
    setPatients((prev) =>
      prev.map((p) =>
        p.id === patient.id
          ? {
              ...p,
              status: PATIENT_STATUS.IN_STATION,
              stepJourney: {
                ...p.stepJourney,
                [step]: {
                  ...(p.stepJourney[step] || {}),
                  timestamp_in: enteredAt,
                },
              },
            }
          : p
      )
    );

    setNowServingByStep((prev) => ({
      ...prev,
      [step]: { ...patient, enteredAt },
    }));

    return patient;
  };

  /**
   * Complete current step and move to next
   * Records timestamp_out and calculates wait time
   */
  const completeStep = (step, stepData = {}) => {
    const patient = nowServingByStep[step];
    if (!patient) return null;

    const completedAt = new Date();
    const enteredAt = patient.stepJourney?.[step]?.timestamp_in || patient.enteredAt;
    const waitTime = completedAt - enteredAt; // in milliseconds

    // Store step data based on which step completed
    let updatedPatient = { ...patient };
    switch (step) {
      case 2: // VST - Vital Signs
        updatedPatient.vitals = stepData;
        break;
      case 3: // TRG - Triage
        updatedPatient.triageData = stepData;
        break;
      case 4: // PCU - Primary Care Unit
        updatedPatient.assessment = stepData;
        break;
      case 5: // ENC1 - Encoding Primary
        updatedPatient.primaryEncoding = stepData;
        break;
      case 7: // CONS - Consultation
        updatedPatient.consultation = stepData;
        // Check if patient requires ABTC
        if (stepData.requiresABTC) {
          updatedPatient.requiresABTC = true;
        }
        break;
      case 8: // ENC2 - Encoding Ancillary
        updatedPatient.ancillaryOrders = stepData;
        break;
      default:
        break;
    }

    // Update patient record
    setPatients((prev) =>
      prev.map((p) =>
        p.id === patient.id
          ? {
              ...p,
              ...updatedPatient,
              completedSteps: [...(p.completedSteps || []), step],
              stepJourney: {
                ...p.stepJourney,
                [step]: {
                  ...p.stepJourney[step],
                  timestamp_out: completedAt,
                  waitTime,
                },
              },
            }
          : p
      )
    );

    // Update statistics
    updateStepStats(step, waitTime);

    // Remove from current queue and advance to next step
    setStepQueues((prev) => ({
      ...prev,
      [step]: prev[step].slice(1),
    }));

    setNowServingByStep((prev) => ({
      ...prev,
      [step]: null,
    }));

    // Route to next step (or ancillary if step 9)
    const nextStep = getNextStep(step);
    if (nextStep && step < 9) {
      routeToNextStep(patient.id, nextStep.step);
    } else if (step === 9) {
      // Patient completed all steps or ancillary services
      finalizePatient(patient.id);
    }

    return updatedPatient;
  };

  /**
   * Route patient to next step in the journey
   */
  const routeToNextStep = (patientId, nextStep) => {
    setPatients((prev) =>
      prev.map((p) =>
        p.id === patientId
          ? {
              ...p,
              currentStep: nextStep,
              status: PATIENT_STATUS.ROUTED_TO_NEXT,
            }
          : p
      )
    );

    // Add to next step's queue
    const patient = patients.find((p) => p.id === patientId);
    if (patient) {
      setStepQueues((prev) => ({
        ...prev,
        [nextStep]: [...(prev[nextStep] || []), { ...patient, currentStep: nextStep }],
      }));
    }
  };

  /**
   * Route patient to ancillary services (Step 9)
   * If ABTC is required, prioritize it in the queue
   */
  const routeToAncillary = (patientId, ancillaryServiceIds) => {
    setPatients((prev) =>
      prev.map((p) =>
        p.id === patientId
          ? {
              ...p,
              currentStep: 9,
              ancillaryServices: ancillaryServiceIds,
              routedToAncillary: true,
              status: PATIENT_STATUS.IN_ANCILLARY,
            }
          : p
      )
    );
  };

  /**
   * Check if patient requires ABTC and prioritize routing
   * Called after CONS step (Step 7)
   */
  const handleABTCPrioritization = (patientId) => {
    const patient = patients.find((p) => p.id === patientId);
    if (patient && patient.requiresABTC) {
      // Prioritize ABTC in Step 9
      const ancillaryServices = ["ABTC"];
      routeToAncillary(patientId, ancillaryServices);
    }
  };

  /**
   * Finalize patient journey - mark as completed
   */
  const finalizePatient = (patientId) => {
    const patient = patients.find((p) => p.id === patientId);
    if (!patient) return;

    const journeyTime = new Date() - patient.registeredAt; // in milliseconds

    setPatients((prev) =>
      prev.map((p) =>
        p.id === patientId
          ? {
              ...p,
              status: PATIENT_STATUS.COMPLETED_JOURNEY,
              completedAt: new Date(),
            }
          : p
      )
    );

    setStats((prev) => ({
      ...prev,
      totalCompleted: prev.totalCompleted + 1,
      averageJourneyTime:
        (prev.averageJourneyTime * (prev.totalCompleted)) + journeyTime / (prev.totalCompleted + 1),
    }));
  };

  /**
   * Update statistics for a specific step
   * Detects bottlenecks (steps with high average wait time)
   */
  const updateStepStats = (step, waitTime) => {
    setStats((prev) => {
      const currentStats = prev.stepStats[step] || {};
      const newServed = currentStats.served + 1;
      const newTotalWaitTime = currentStats.totalWaitTime + waitTime;
      const newAverageWaitTime = newTotalWaitTime / newServed;
      const newMaxWaitTime = Math.max(currentStats.maxWaitTime, waitTime);

      // Consider step a bottleneck if avg wait time > 30 minutes
      const isBottleneck = newAverageWaitTime > 30 * 60 * 1000;

      return {
        ...prev,
        stepStats: {
          ...prev.stepStats,
          [step]: {
            ...currentStats,
            served: newServed,
            totalWaitTime: newTotalWaitTime,
            averageWaitTime: newAverageWaitTime,
            maxWaitTime: newMaxWaitTime,
            bottleneck: isBottleneck,
          },
        },
      };
    });
  };

  /**
   * Get wait time for a specific step (in minutes)
   */
  const getStepWaitTime = (step) => {
    const stats = stats.stepStats?.[step];
    if (!stats) return 0;
    return Math.round(stats.averageWaitTime / 1000 / 60); // Convert to minutes
  };

  /**
   * Get all patients currently at a specific step
   */
  const getPatientsAtStep = (step) => {
    const inQueue = stepQueues[step] || [];
    const serving = nowServingByStep[step];
    return serving ? [serving, ...inQueue] : inQueue;
  };

  /**
   * Get patient's journey summary
   */
  const getPatientJourneySummary = (patientId) => {
    const patient = patients.find((p) => p.id === patientId);
    if (!patient) return null;

    const completedStepSummary = STATIONS.filter((s) =>
      patient.completedSteps.includes(s.step)
    ).map((s) => ({
      step: s.step,
      name: s.name,
      code: s.code,
      timestamps: patient.stepJourney[s.step],
    }));

    return {
      ticketNumber: patient.ticketNumber,
      currentStep: patient.currentStep,
      currentStationName: getStationByStep(patient.currentStep)?.name,
      completedSteps: completedStepSummary,
      totalJourneyTime: patient.completedAt ? patient.completedAt - patient.registeredAt : new Date() - patient.registeredAt,
      status: patient.status,
    };
  };

  return {
    // State
    patients,
    stepQueues,
    nowServingByStep,
    stats,

    // Step 1: Registration
    registerPatient,

    // Step Management
    callNextAtStep,
    completeStep,
    routeToNextStep,

    // Ancillary Services
    routeToAncillary,
    handleABTCPrioritization,

    // Utilities
    getStepWaitTime,
    getPatientsAtStep,
    getPatientJourneySummary,
  };
}
