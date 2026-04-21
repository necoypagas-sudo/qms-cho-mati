import { useState, useEffect } from "react";

export function useQMS(initialServices = []) {
  const [services, setServices] = useState(initialServices.length > 0 ? initialServices : [
    { id: 1, name: "General Consultation", code: "GC", color: "#0dcaf0" },
    { id: 2, name: "Vaccination", code: "VAX", color: "#198754" },
    { id: 3, name: "Emergency", code: "ER", color: "#dc3545" },
  ]);

  const [queues, setQueues] = useState({});
  const [nowServing, setNowServing] = useState({});
  const [voiceOn, setVoiceOn] = useState(false);
  const [stats, setStats] = useState({
    totalServed: 0,
    averageWaitTime: 0,
    peakHours: [],
    serviceStats: {},
  });

  // Initialize queues for services
  useEffect(() => {
    setQueues((prevQueues) => {
      const newQueues = { ...prevQueues };
      services.forEach((service) => {
        if (!(service.id in newQueues)) {
          newQueues[service.id] = [];
        }
      });
      return newQueues;
    });

    setNowServing((prevNowServing) => {
      const newNowServing = { ...prevNowServing };
      services.forEach((service) => {
        if (!(service.id in newNowServing)) {
          newNowServing[service.id] = null;
        }
      });
      return newNowServing;
    });
  }, [services]);

  // Take a number - add to queue
  const takeNumber = (serviceId, patientName = "Patient", isPriority = false) => {
    const service = services.find((s) => s.id === serviceId);
    if (!service) return null;

    const queue = queues[serviceId] || [];
    const queueNum = queue.length + 1;
    const fullTicketNumber = `${service.code}${String(queueNum).padStart(3, "0")}`;
    const steps = service.steps || [];
    const currentStep = steps.length > 0 ? 0 : null;

    const ticket = {
      id: Math.random(),
      serviceId,
      number: queueNum,
      fullTicketNumber,
      patientName,
      isPriority,
      issuedAt: new Date(),
      status: "waiting",
      currentStep: currentStep,
      steps: steps,
      completedSteps: [],
    };

    // Add to queue and sort: priority first, then by issued time
    const newQueue = [...queue, ticket].sort((a, b) => {
      if (a.isPriority && !b.isPriority) return -1;
      if (!a.isPriority && b.isPriority) return 1;
      return new Date(a.issuedAt) - new Date(b.issuedAt);
    });

    setQueues((prev) => ({
      ...prev,
      [serviceId]: newQueue,
    }));

    return ticket;
  };

  // Call next patient
  const callNext = (serviceId) => {
    const queue = queues[serviceId] || [];
    if (queue.length === 0) return null;

    const ticket = queue[0];
    const service = services.find((s) => s.id === serviceId);

    setQueues((prev) => ({
      ...prev,
      [serviceId]: prev[serviceId].slice(1),
    }));

    setNowServing((prev) => ({
      ...prev,
      [serviceId]: ticket,
    }));

    // Play notification sound
    playNotificationSound();

    // Speak if voice is on
    if (voiceOn && service) {
      speakTicket(ticket, service.name);
    }

    return ticket;
  };

  // Mark patient as done
  const markDone = (serviceId) => {
    const ticket = nowServing[serviceId];
    if (!ticket) return;

    const waitTime = (new Date() - new Date(ticket.issuedAt)) / 1000 / 60; // in minutes

    setStats(prev => ({
      ...prev,
      totalServed: prev.totalServed + 1,
      averageWaitTime: ((prev.averageWaitTime * (prev.totalServed)) + waitTime) / (prev.totalServed + 1),
      serviceStats: {
        ...prev.serviceStats,
        [serviceId]: {
          served: (prev.serviceStats[serviceId]?.served || 0) + 1,
          totalWaitTime: (prev.serviceStats[serviceId]?.totalWaitTime || 0) + waitTime,
          averageWaitTime: ((prev.serviceStats[serviceId]?.totalWaitTime || 0) + waitTime) / ((prev.serviceStats[serviceId]?.served || 0) + 1),
        }
      }
    }));

    setNowServing((prev) => ({
      ...prev,
      [serviceId]: null,
    }));
  };

  // Advance to next workflow step
  const nextStep = (serviceId) => {
    const ticket = nowServing[serviceId];
    if (!ticket || ticket.currentStep === null || ticket.currentStep >= ticket.steps.length - 1) return;

    ticket.completedSteps.push(ticket.steps[ticket.currentStep]);
    ticket.currentStep += 1;

    setNowServing((prev) => ({
      ...prev,
      [serviceId]: { ...ticket },
    }));

    return ticket;
  };

  // Go back to previous workflow step
  const previousStep = (serviceId) => {
    const ticket = nowServing[serviceId];
    if (!ticket || ticket.currentStep === null || ticket.currentStep <= 0) return;

    ticket.currentStep -= 1;
    ticket.completedSteps.pop();

    setNowServing((prev) => ({
      ...prev,
      [serviceId]: { ...ticket },
    }));

    return ticket;
  };

  // Clear queue
  const clearQueue = (serviceId) => {
    setQueues((prev) => ({
      ...prev,
      [serviceId]: [],
    }));
  };

  // Reset statistics
  const resetStats = () => {
    setStats({
      totalServed: 0,
      averageWaitTime: 0,
      peakHours: [],
      serviceStats: {},
    });
  };

  // Play notification sound
  const playNotificationSound = () => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (e) {
      // Fallback to beep if AudioContext not supported
      console.log('Notification sound played');
    }
  };

  return {
    services,
    setServices,
    queues,
    nowServing,
    voiceOn,
    setVoiceOn,
    stats,
    resetStats,
    takeNumber,
    callNext,
    markDone,
    nextStep,
    previousStep,
    clearQueue,
  };
}
