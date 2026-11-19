/**
 * @file audioService.js
 * Procedural 8-bit retro sound generator using the browser's native Web Audio API.
 *
 * Benefits:
 * - 0 external audio files to download (zero latency, zero network requests).
 * - Zero copyright issues.
 * - Handles browser autoplay restrictions (resumes suspended AudioContext).
 */

class AudioService {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
  }

  /**
   * Lazily initializes and resumes the AudioContext on user interaction.
   * @private
   */
  _getContext() {
    if (typeof window === 'undefined') return null;

    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }

    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    return this.ctx;
  }

  /** Set mute status */
  setMuted(muted) {
    this.isMuted = Boolean(muted);
  }

  /**
   * Plant Placement: Cheerful high-pitched bouncy pop.
   */
  playPlant() {
    if (this.isMuted) return;
    const ctx = this._getContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    const now = ctx.currentTime;

    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(780, now + 0.12);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.13);
  }

  /**
   * Zombie Placement: Goofy low-pitched crunchy chomp/groan.
   */
  playZombie() {
    if (this.isMuted) return;
    const ctx = this._getContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    const now = ctx.currentTime;

    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.18);

    gain.gain.setValueAtTime(0.22, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.19);
  }

  /**
   * Victory: Joyous 4-note retro arpeggio (C5 -> E5 -> G5 -> C6).
   */
  playWin() {
    if (this.isMuted) return;
    const ctx = this._getContext();
    if (!ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    const startTime = ctx.currentTime;

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'square';
      const noteStart = startTime + idx * 0.1;
      const noteDuration = idx === notes.length - 1 ? 0.35 : 0.08;

      osc.frequency.setValueAtTime(freq, noteStart);

      gain.gain.setValueAtTime(0.18, noteStart);
      gain.gain.exponentialRampToValueAtTime(0.01, noteStart + noteDuration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(noteStart);
      osc.stop(noteStart + noteDuration);
    });
  }

  /**
   * Draw / Stalemate: Two short flat comedic buzzes.
   */
  playDraw() {
    if (this.isMuted) return;
    const ctx = this._getContext();
    if (!ctx) return;

    const tones = [220, 160];
    const startTime = ctx.currentTime;

    tones.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      const toneStart = startTime + idx * 0.16;

      osc.frequency.setValueAtTime(freq, toneStart);

      gain.gain.setValueAtTime(0.2, toneStart);
      gain.gain.exponentialRampToValueAtTime(0.01, toneStart + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(toneStart);
      osc.stop(toneStart + 0.13);
    });
  }

  /**
   * Undo: Reverse pitch drop rewind chirp.
   */
  playUndo() {
    if (this.isMuted) return;
    const ctx = this._getContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    const now = ctx.currentTime;

    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(150, now + 0.1);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.11);
  }
}

export const audioService = new AudioService();
