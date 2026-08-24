/**
 * Procedural Web Audio API Sound Synthesizer for Stackverse
 * 100% lightweight, 0ms latency, zero external mp3 files.
 * High-reliability audio engine with linear gain envelopes and Safari audio-bus unlock.
 */

class SoundSynthesizer {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this.unlocked = false;
  }

  // Get or create active AudioContext and ensure it is in running state
  getContext() {
    if (!this.enabled || typeof window === "undefined") return null;

    try {
      if (!this.ctx) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) {
          this.ctx = new AudioContextClass();
        }
      }

      if (this.ctx && this.ctx.state === "suspended") {
        this.ctx.resume().catch((e) => console.warn("[SoundFX] AudioContext resume error:", e));
      }

      // Safari Audio Hardware Unlocker: play 1-sample silent buffer once
      if (this.ctx && !this.unlocked && this.ctx.state === "running") {
        try {
          const buffer = this.ctx.createBuffer(1, 1, 22050);
          const source = this.ctx.createBufferSource();
          source.buffer = buffer;
          source.connect(this.ctx.destination);
          source.start(0);
          this.unlocked = true;
        } catch {
          // Ignore
        }
      }

      return this.ctx;
    } catch (err) {
      console.warn("[SoundFX] AudioContext creation error:", err);
      return null;
    }
  }

  // Helper to create a single oscillator tone with volume envelope
  playTone(frequency, type = "sine", duration = 0.15, volume = 0.4, freqEnd = null) {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(frequency, now);
      if (freqEnd !== null) {
        osc.frequency.linearRampToValueAtTime(freqEnd, now + duration);
      }

      // Envelope: instant attack, smooth linear decay
      gain.gain.setValueAtTime(volume, now);
      gain.gain.linearRampToValueAtTime(0.0001, now + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + duration);
    } catch (err) {
      console.error("[SoundFX] Error playing tone:", err);
    }
  }

  // Push sound: Punchy tactile mechanical drop thud
  playPush() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;

      // 1. Low Thud Body (180Hz -> 45Hz drop)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(180, now);
      osc1.frequency.linearRampToValueAtTime(45, now + 0.14);
      gain1.gain.setValueAtTime(0.6, now);
      gain1.gain.linearRampToValueAtTime(0.001, now + 0.15);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.15);

      // 2. High Mechanical Click (800Hz -> 200Hz)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = "triangle";
      osc2.frequency.setValueAtTime(800, now);
      osc2.frequency.linearRampToValueAtTime(200, now + 0.04);
      gain2.gain.setValueAtTime(0.35, now);
      gain2.gain.linearRampToValueAtTime(0.001, now + 0.04);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now);
      osc2.stop(now + 0.04);
    } catch (e) {
      console.warn("[SoundFX] Push error:", e);
    }
  }

  // Pop sound: Crisp upward pneumatic whoosh & crystal harmonic release
  playPop() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;

      // 1. Upward Sweep (180Hz -> 650Hz)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(180, now);
      osc1.frequency.linearRampToValueAtTime(650, now + 0.12);
      gain1.gain.setValueAtTime(0.5, now);
      gain1.gain.linearRampToValueAtTime(0.001, now + 0.14);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.14);

      // 2. Crystal Ping (1200Hz)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = "triangle";
      osc2.frequency.setValueAtTime(1200, now);
      osc2.frequency.linearRampToValueAtTime(400, now + 0.08);
      gain2.gain.setValueAtTime(0.3, now);
      gain2.gain.linearRampToValueAtTime(0.001, now + 0.09);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now);
      osc2.stop(now + 0.09);
    } catch (e) {
      console.warn("[SoundFX] Pop error:", e);
    }
  }

  // Peek sound: High-tech holographic laser energy scan ping
  playPeek() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(580, now);
      osc.frequency.linearRampToValueAtTime(1160, now + 0.12);

      gain.gain.setValueAtTime(0.45, now);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.16);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.16);
    } catch (e) {
      console.warn("[SoundFX] Peek error:", e);
    }
  }

  // Clear sound: Cyber energy vortex purge
  playClear() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(360, now);
      osc.frequency.linearRampToValueAtTime(50, now + 0.28);

      gain.gain.setValueAtTime(0.5, now);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.3);
    } catch (e) {
      console.warn("[SoundFX] Clear error:", e);
    }
  }

  // Warning sound: Deep cybernetic error buzz
  playWarning() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(130, now);
      osc.frequency.setValueAtTime(85, now + 0.07);

      gain.gain.setValueAtTime(0.4, now);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.18);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.18);
    } catch (e) {
      console.warn("[SoundFX] Warning error:", e);
    }
  }

  // Tree Step sound: Musical melodic chime for traversal nodes
  playTreeStep(index = 0) {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const PENTATONIC = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25];
      const freq = PENTATONIC[Math.abs(index) % PENTATONIC.length];

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.22);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.22);
    } catch (e) {
      console.warn("[SoundFX] TreeStep error:", e);
    }
  }

  // Tree Found sound: Harmonious major chord fanfare
  playTreeFound() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const CHORD = [523.25, 659.25, 783.99, 1046.50];

      CHORD.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const start = now + i * 0.04;

        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.3, start);
        gain.gain.linearRampToValueAtTime(0.001, start + 0.24);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(start);
        osc.stop(start + 0.24);
      });
    } catch (e) {
      console.warn("[SoundFX] TreeFound error:", e);
    }
  }

  // Level Up: Epic Grand Fanfare
  playLevelUp() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;

      // 1. Sub-bass celebration impact
      const subOsc = ctx.createOscillator();
      const subGain = ctx.createGain();
      subOsc.type = "sine";
      subOsc.frequency.setValueAtTime(90, now);
      subOsc.frequency.linearRampToValueAtTime(35, now + 0.35);
      subGain.gain.setValueAtTime(0.45, now);
      subGain.gain.linearRampToValueAtTime(0.001, now + 0.4);
      subOsc.connect(subGain);
      subGain.connect(ctx.destination);
      subOsc.start(now);
      subOsc.stop(now + 0.4);

      // 2. Ascending Grand Arpeggio Chords
      const notes = [
        { freq: 523.25, time: 0.00 },
        { freq: 659.25, time: 0.07 },
        { freq: 783.99, time: 0.14 },
        { freq: 1046.50, time: 0.21 },
        { freq: 1318.51, time: 0.30 },
        { freq: 1567.98, time: 0.40 },
      ];

      notes.forEach(({ freq, time }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const start = now + time;
        const duration = time >= 0.3 ? 0.6 : 0.25;

        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.3, start);
        gain.gain.linearRampToValueAtTime(0.001, start + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(start);
        osc.stop(start + duration);
      });
    } catch (e) {
      console.warn("[SoundFX] LevelUp error:", e);
    }
  }
}

export const soundFX = new SoundSynthesizer();

// Global unlock on any user gesture across Safari, Chrome, Firefox, Brave
if (typeof window !== "undefined") {
  const unlockAudio = () => {
    soundFX.getContext();
  };

  ["pointerdown", "mousedown", "mouseup", "touchstart", "touchend", "click", "keydown"].forEach((evt) => {
    window.addEventListener(evt, unlockAudio, { passive: true });
  });

  // Expose on window for easy developer testing in DevTools
  window.soundFX = soundFX;
  window.testSound = (type = "push") => {
    const ctx = soundFX.getContext();
    console.log(`[SoundFX Test] Triggering "${type}". AudioContext state:`, ctx?.state);
    if (type === "push") soundFX.playPush();
    else if (type === "pop") soundFX.playPop();
    else if (type === "peek") soundFX.playPeek();
    else if (type === "clear") soundFX.playClear();
    else if (type === "warning") soundFX.playWarning();
    else if (type === "tree") soundFX.playTreeFound();
    else if (type === "levelup") soundFX.playLevelUp();
    else soundFX.playPush();
  };
}
