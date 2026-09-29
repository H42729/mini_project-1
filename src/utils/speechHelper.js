// Speech Synthesis & Voice Recognition Helper for Naam Uzhavar

class AudioController {
  constructor() {
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.currentUtterance = null;
    this.onStateChange = null;
    this.activeId = null;
  }

  speak(text, lang = 'ta', id = 'general', onEndCallback = null) {
    if (!this.synth) {
      if (onEndCallback) onEndCallback();
      return;
    }

    if (this.synth.speaking && this.activeId === id) {
      this.stop();
      return;
    }

    this.stop();

    try {
      const utterance = new SpeechSynthesisUtterance(text);
      this.currentUtterance = utterance;
      this.activeId = id;

      utterance.lang = lang === 'ta' ? 'ta-IN' : 'en-IN';
      utterance.rate = 0.95;
      utterance.pitch = 1.0;

      utterance.onstart = () => {
        if (this.onStateChange) this.onStateChange({ speaking: true, id });
      };

      utterance.onend = () => {
        this.activeId = null;
        if (this.onStateChange) this.onStateChange({ speaking: false, id: null });
        if (onEndCallback) onEndCallback();
      };

      utterance.onerror = () => {
        this.activeId = null;
        if (this.onStateChange) this.onStateChange({ speaking: false, id: null });
        if (onEndCallback) onEndCallback();
      };

      this.synth.speak(utterance);
    } catch (e) {
      this.activeId = null;
      if (this.onStateChange) this.onStateChange({ speaking: false, id: null });
      if (onEndCallback) onEndCallback();
    }
  }

  stop() {
    if (this.synth) {
      this.synth.cancel();
    }
    const previousId = this.activeId;
    this.activeId = null;
    if (this.onStateChange) this.onStateChange({ speaking: false, id: null });
    return previousId;
  }

  isSpeaking(id) {
    return this.synth && this.synth.speaking && this.activeId === id;
  }
}

export const speechController = new AudioController();
