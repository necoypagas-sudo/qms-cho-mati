// src/utils/voiceCaller.js
// Web Speech API Integration for Voice Calling System
// Provides automated voice announcements with controls (Next, Recall, Skip, Transfer)

/**
 * Voice Configuration
 */
export const VOICE_CONFIG = {
  language: "en-PH",
  defaultRate: 0.9,      // 0.1 (slowest) to 1.0 (normal) to 2.0 (fastest)
  defaultPitch: 1.0,     // 0.5 (lowest) to 1.0 (normal) to 2.0 (highest)
  defaultVolume: 1.0,    // 0.0 to 1.0
};

/**
 * Check if Web Speech API is supported
 */
export const isSpeechSynthesisSupported = () => {
  return !!window.speechSynthesis;
};

/**
 * Get available voices for synthesis
 */
export const getAvailableVoices = () => {
  if (!isSpeechSynthesisSupported()) return [];
  return window.speechSynthesis.getVoices();
};

/**
 * Speak text with customizable options
 * @param {string} text - Text to speak
 * @param {Object} options - { rate, pitch, volume, language }
 * @param {Function} onComplete - Callback when speech ends
 */
export const speak = (text, options = {}, onComplete = null) => {
  if (!isSpeechSynthesisSupported()) {
    console.warn("Speech Synthesis not supported");
    return null;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const config = {
    rate: options.rate ?? VOICE_CONFIG.defaultRate,
    pitch: options.pitch ?? VOICE_CONFIG.defaultPitch,
    volume: options.volume ?? VOICE_CONFIG.defaultVolume,
    language: options.language ?? VOICE_CONFIG.language,
  };

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = config.rate;
  utterance.pitch = config.pitch;
  utterance.volume = config.volume;
  utterance.lang = config.language;

  // Add completion callback
  if (onComplete) {
    utterance.onend = onComplete;
    utterance.onerror = (error) => {
      console.error("Speech synthesis error:", error);
      onComplete();
    };
  }

  // Optional: Use specific voice if available
  if (options.voice) {
    const voices = getAvailableVoices();
    const selectedVoice = voices.find(v => v.name === options.voice);
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
  }

  window.speechSynthesis.speak(utterance);
  return utterance;
};

/**
 * Call a specific ticket number
 * @param {string} ticketNumber - Ticket number to call (e.g., "GC001")
 * @param {string} stationName - Station/service name
 * @param {Object} options - Voice options
 */
export const callTicket = (ticketNumber, stationName = "", options = {}, onComplete = null) => {
  const message = `Now serving ticket number ${ticketNumber}${stationName ? ` at ${stationName}` : ""}. Please proceed to the designated window.`;
  return speak(message, options, onComplete);
};

/**
 * Announce a reminder/recall
 * @param {string} ticketNumber - Ticket to recall
 */
export const recallTicket = (ticketNumber, options = {}, onComplete = null) => {
  const message = `Ticket number ${ticketNumber}, please proceed immediately. This is a recall announcement.`;
  return speak(message, options, onComplete);
};

/**
 * Announce that a ticket is being skipped
 */
export const skipTicket = (ticketNumber, options = {}, onComplete = null) => {
  const message = `Ticket number ${ticketNumber} is being skipped. Please visit the information desk for assistance.`;
  return speak(message, options, onComplete);
};

/**
 * Announce ticket transfer to another station
 */
export const transferTicket = (ticketNumber, fromStation, toStation, options = {}, onComplete = null) => {
  const message = `Ticket number ${ticketNumber} is being transferred from ${fromStation} to ${toStation}. Please proceed to ${toStation}.`;
  return speak(message, options, onComplete);
};

/**
 * Stop current speech
 */
export const stopSpeech = () => {
  if (isSpeechSynthesisSupported()) {
    window.speechSynthesis.cancel();
  }
};

/**
 * Pause speech
 */
export const pauseSpeech = () => {
  if (isSpeechSynthesisSupported() && window.speechSynthesis.speaking) {
    window.speechSynthesis.pause();
  }
};

/**
 * Resume paused speech
 */
export const resumeSpeech = () => {
  if (isSpeechSynthesisSupported() && window.speechSynthesis.paused) {
    window.speechSynthesis.resume();
  }
};

/**
 * Check if currently speaking
 */
export const isSpeaking = () => {
  return isSpeechSynthesisSupported() && window.speechSynthesis.speaking;
};

/**
 * Check if speech is paused
 */
export const isPaused = () => {
  return isSpeechSynthesisSupported() && window.speechSynthesis.paused;
};

/**
 * Generate full ticket announcement with station information
 * @param {Object} ticket - Ticket object
 * @param {Object} service - Service/Station object
 * @param {Object} options - Voice options
 */
export const announceTicket = (ticket, service = null, options = {}, onComplete = null) => {
  let stationName = service?.name || "Service Counter";
  
  const message = 
    `Now serving ticket number ${ticket.fullTicketNumber || ticket.number}. ` +
    `Please proceed to ${stationName}. ` +
    `Thank you for your patience.`;

  return speak(message, options, onComplete);
};

/**
 * Multi-language support - format message
 */
export const formatAnnouncementMessage = (ticket, service, language = "en") => {
  const messages = {
    en: {
      prefix: "Now serving ticket number",
      station: "at",
      thank: "Thank you for your patience.",
      proceed: "Please proceed",
    },
    fil: {
      prefix: "Ngayon ay nagsisilbi ang tiket numero",
      station: "sa",
      thank: "Salamat sa inyong pasensya.",
      proceed: "Mangyaring magpatuloy",
    },
  };

  const msg = messages[language] || messages.en;
  const ticketNum = ticket.fullTicketNumber || ticket.number;
  const stationName = service?.name || "Service Counter";

  return `${msg.prefix} ${ticketNum} ${msg.station} ${stationName}. ${msg.proceed}. ${msg.thank}`;
};

/**
 * Play notification sound (for when a ticket is ready)
 */
export const playNotificationSound = () => {
  // Create a simple beep sound using Web Audio API
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.frequency.value = 800; // Frequency in Hz
  oscillator.type = "sine";

  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.5);
};

/**
 * Play double beep for priority/urgent tickets
 */
export const playUrgentSound = () => {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  
  // First beep
  const osc1 = audioContext.createOscillator();
  const gain1 = audioContext.createGain();
  osc1.connect(gain1);
  gain1.connect(audioContext.destination);
  osc1.frequency.value = 1000;
  osc1.type = "sine";
  gain1.gain.setValueAtTime(0.3, audioContext.currentTime);
  gain1.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
  osc1.start(audioContext.currentTime);
  osc1.stop(audioContext.currentTime + 0.3);

  // Second beep
  const osc2 = audioContext.createOscillator();
  const gain2 = audioContext.createGain();
  osc2.connect(gain2);
  gain2.connect(audioContext.destination);
  osc2.frequency.value = 1200;
  osc2.type = "sine";
  gain2.gain.setValueAtTime(0.3, audioContext.currentTime + 0.4);
  gain2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.7);
  osc2.start(audioContext.currentTime + 0.4);
  osc2.stop(audioContext.currentTime + 0.7);
};

/**
 * Create voice profile for different user preferences
 */
export const createVoiceProfile = (name = "Default", rate = 0.9, pitch = 1.0, volume = 1.0) => {
  return {
    name,
    rate: Math.max(0.1, Math.min(2.0, rate)),     // Clamp between 0.1 and 2.0
    pitch: Math.max(0.5, Math.min(2.0, pitch)),   // Clamp between 0.5 and 2.0
    volume: Math.max(0, Math.min(1.0, volume)),   // Clamp between 0 and 1.0
  };
};

/**
 * Predefined voice profiles
 */
export const VOICE_PROFILES = {
  FAST: createVoiceProfile("Fast", 1.3, 1.0, 1.0),
  NORMAL: createVoiceProfile("Normal", 0.9, 1.0, 1.0),
  SLOW: createVoiceProfile("Slow", 0.6, 0.9, 1.0),
  HIGH_PITCHED: createVoiceProfile("High Pitched", 0.9, 1.5, 1.0),
  LOW_PITCHED: createVoiceProfile("Low Pitched", 0.9, 0.7, 1.0),
};

/**
 * Voice Announcement Queue Manager
 * Queues multiple announcements to be spoken sequentially
 */
export class VoiceAnnouncementQueue {
  constructor() {
    this.queue = [];
    this.isPlaying = false;
    this.onQueueComplete = null;
  }

  /**
   * Add announcement to queue
   */
  add(text, options = {}) {
    this.queue.push({ text, options });
  }

  /**
   * Add ticket call to queue
   */
  addTicketCall(ticketNumber, stationName = "", options = {}) {
    const message = `Now serving ticket number ${ticketNumber}${stationName ? ` at ${stationName}` : ""}. Please proceed to the designated window.`;
    this.add(message, options);
  }

  /**
   * Play queue sequentially
   */
  async play(onQueueComplete = null) {
    if (this.isPlaying || this.queue.length === 0) return;
    
    this.isPlaying = true;
    this.onQueueComplete = onQueueComplete;

    for (const announcement of this.queue) {
      await this._playAnnouncement(announcement.text, announcement.options);
    }

    this.isPlaying = false;
    if (this.onQueueComplete) {
      this.onQueueComplete();
    }
  }

  /**
   * Internal: Play single announcement and wait for completion
   */
  _playAnnouncement(text, options) {
    return new Promise((resolve) => {
      speak(text, options, resolve);
    });
  }

  /**
   * Clear queue
   */
  clear() {
    this.queue = [];
    stopSpeech();
  }

  /**
   * Get queue length
   */
  length() {
    return this.queue.length;
  }
}
