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

    const queueNum = (queues[serviceId]?.length || 0) + 1;
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

    setQueues((prev) => ({
      ...prev,
      [serviceId]: [...(prev[serviceId] || []), ticket],
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

    // Speak if voice is on
    if (voiceOn && service) {
      speakTicket(ticket, service.name);
    }

    return ticket;
  };

  // Mark patient as done
  const markDone = (serviceId) => {
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

  // Speak ticket number (if voice enabled)
  const speakTicket = (ticket, serviceName) => {
    if (!("speechSynthesis" in window)) return;

    const utterance = new SpeechSynthesisUtterance(
      `${serviceName}. Ticket number ${ticket.fullTicketNumber}. Please proceed to the counter.`
    );
    utterance.rate = 0.9;
    speechSynthesis.speak(utterance);
  };

  return {
    services,
    setServices,
    queues,
    nowServing,
    voiceOn,
    setVoiceOn,
    takeNumber,
    callNext,
    markDone,
    nextStep,
    previousStep,
    clearQueue,
  };
}
