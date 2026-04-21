// src/hooks/useStationQMS.js
// QMS Hook for 6-Station Sequential Patient Flow

import { useState, useEffect } from "react";
import { STATIONS, getNextStation, PATIENT_STATUS } from "../constants/stations";

export function useStationQMS() {
  // Main patient registry - tracks ALL patients and their station journey
  const [patients, setPatients] = useState([]);
  
  // Station queues - waiting patients at each station
  const [stationQueues, setStationQueues] = useState({});
  
  // Now serving at each station
  const [nowServingByStation, setNowServingByStation] = useState({});
  
  // Statistics
  const [stats, setStats] = useState({
    totalRegistered: 0,
    totalCompleted: 0,
    averageJourneyTime: 0,
    stationStats: {},
  });

  // Initialize station queues
  useEffect(() => {
    const newQueues = {};
    const newNowServing = {};
    const newStationStats = {};
    
    STATIONS.forEach((station) => {
      newQueues[station.id] = [];
      newNowServing[station.id] = null;
      newStationStats[station.id] = {
        served: 0,
        totalWaitTime: 0,
        averageWaitTime: 0,
      };
    });
    
    setStationQueues(newQueues);
    setNowServingByStation(newNowServing);
    setStats(prev => ({
      ...prev,
      stationStats: newStationStats
    }));
  }, []);

  /**
   * STATION 1: Number Issuance
   * Register patient and create ticket
   */
  const registerPatient = (patientData) => {
    const ticketNumber = patients.length + 1;
    const station1 = STATIONS[0]; // Number Issuance
    
    const patient = {
      id: Math.random(),
      ticketNumber: `${station1.code}${String(ticketNumber).padStart(3, "0")}`,
      ...patientData,
      registeredAt: new Date(),
      status: PATIENT_STATUS.WAITING,
      currentStation: station1.id,
      currentStep: 0,
      completedStations: [],
      stationJourney: {
        // Track entry/exit times for each station
      },
      vitals: null,
      triageLevel: null,
      diagnosis: null,
      medicines: null,
    };

    setPatients(prev => [...prev, patient]);
    
    // Add to Station 1 queue
    setStationQueues(prev => ({
      ...prev,
      [station1.id]: [...(prev[station1.id] || []), patient],
    }));

    setStats(prev => ({
      ...prev,
      totalRegistered: prev.totalRegistered + 1,
    }));

    return patient;
  };

  /**
   * Call next patient at a specific station
   */
  const callNextAtStation = (stationId) => {
    const queue = stationQueues[stationId] || [];
    if (queue.length === 0) return null;

    const patient = queue[0];
    const enteredAt = new Date();

    // Record station entry time
    setPatients(prev => prev.map(p => {
      if (p.id === patient.id) {
        return {
          ...p,
          stationJourney: {
            ...p.stationJourney,
            [stationId]: {
              ...p.stationJourney[stationId],
              enteredAt,
            }
          },
          status: PATIENT_STATUS.IN_STATION,
        };
      }
      return p;
    }));

    // Update now serving
    setNowServingByStation(prev => ({
      ...prev,
      [stationId]: patient,
    }));

    // Remove from queue
    setStationQueues(prev => ({
      ...prev,
      [stationId]: prev[stationId].slice(1),
    }));

    return patient;
  };

  /**
   * Complete patient at current station and route to next
   */
  const completeStationAndAdvance = (stationId, stationData = null) => {
    const patient = nowServingByStation[stationId];
    if (!patient) return null;

    const completedAt = new Date();
    const enteredAt = patient.stationJourney[stationId]?.enteredAt || new Date();
    const waitTime = (completedAt - enteredAt) / 1000 / 60; // minutes

    // Get next station
    const nextStation = getNextStation(stationId);
    const isJourneyComplete = !nextStation;

    // Update patient record
    setPatients(prev => prev.map(p => {
      if (p.id === patient.id) {
        const updated = {
          ...p,
          stationJourney: {
            ...p.stationJourney,
            [stationId]: {
              ...p.stationJourney[stationId],
              enteredAt,
              completedAt,
              waitTime,
              stationData, // Store station-specific data (vitals, triage, etc.)
            }
          },
          completedStations: [...p.completedStations, stationId],
          status: isJourneyComplete ? PATIENT_STATUS.COMPLETED_JOURNEY : PATIENT_STATUS.ROUTED_TO_NEXT,
          currentStation: nextStation?.id || null,
        };
        return updated;
      }
      return p;
    }));

    // Update statistics
    setStats(prev => ({
      ...prev,
      totalCompleted: isJourneyComplete ? prev.totalCompleted + 1 : prev.totalCompleted,
      stationStats: {
        ...prev.stationStats,
        [stationId]: {
          served: (prev.stationStats[stationId]?.served || 0) + 1,
          totalWaitTime: (prev.stationStats[stationId]?.totalWaitTime || 0) + waitTime,
          averageWaitTime: ((prev.stationStats[stationId]?.totalWaitTime || 0) + waitTime) / ((prev.stationStats[stationId]?.served || 0) + 1),
        }
      }
    }));

    // Clear now serving at this station
    setNowServingByStation(prev => ({
      ...prev,
      [stationId]: null,
    }));

    // Route to next station if available
    if (nextStation && patient.id) {
      setStationQueues(prev => ({
        ...prev,
        [nextStation.id]: [...(prev[nextStation.id] || []), patient],
      }));
    }

    return isJourneyComplete ? "completed" : nextStation;
  };

  /**
   * Get patient by ID
   */
  const getPatient = (patientId) => {
    return patients.find(p => p.id === patientId);
  };

  /**
   * Get all patients at a specific station (completed and in progress)
   */
  const getStationPatients = (stationId) => {
    return patients.filter(p => 
      p.completedStations.includes(stationId) || p.currentStation === stationId
    );
  };

  /**
   * Get queue status for all stations
   */
  const getQueueStatus = () => {
    const status = {};
    STATIONS.forEach(station => {
      status[station.id] = {
        station: station.name,
        code: station.code,
        waiting: stationQueues[station.id]?.length || 0,
        nowServing: nowServingByStation[station.id] ? 1 : 0,
        averageWaitTime: stats.stationStats[station.id]?.averageWaitTime || 0,
      };
    });
    return status;
  };

  /**
   * Reset all data
   */
  const resetAll = () => {
    setPatients([]);
    const newQueues = {};
    STATIONS.forEach(station => {
      newQueues[station.id] = [];
    });
    setStationQueues(newQueues);
    setNowServingByStation({});
    setStats({
      totalRegistered: 0,
      totalCompleted: 0,
      averageJourneyTime: 0,
      stationStats: {},
    });
  };

  return {
    // Data
    patients,
    stationQueues,
    nowServingByStation,
    stats,
    
    // Actions
    registerPatient,
    callNextAtStation,
    completeStationAndAdvance,
    getPatient,
    getStationPatients,
    getQueueStatus,
    resetAll,
  };
}
