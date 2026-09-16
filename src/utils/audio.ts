/**
 * Gentle acoustic/lo-fi ambient soundtrack synthesized with Web Audio API.
 * Romantic chord progression in D major with soft plucked notes.
 */

class RomanticAmbientEngine {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private timerId: number | null = null;
  private masterGain: GainNode | null = null;

  // Chord notes (frequencies in Hz)
  private chords = [
    // Dmaj9: D3, A3, C#4, E4, F#4
    [146.83, 220.00, 277.18, 329.63, 369.99],
    // F#m7: F#3, C#4, E4, A4
    [185.00, 277.18, 329.63, 440.00],
    // Gmaj7: G3, D4, F#4, B4
    [196.00, 293.66, 369.99, 493.88],
    // Aadd9: A3, E4, B4, C#5
    [220.00, 329.63, 493.88, 554.37],
  ];

  private currentChordIndex = 0;

  public init() {
    if (this.ctx) return;
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    this.ctx = new AudioCtx();

    const master = this.ctx.createGain();
    master.gain.setValueAtTime(0.18, this.ctx.currentTime);
    master.connect(this.ctx.destination);
    this.masterGain = master;
  }

  public play() {
    this.init();
    if (!this.ctx || !this.masterGain) return;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    this.isPlaying = true;
    this.scheduleChordSequence();
  }

  public stop() {
    this.isPlaying = false;
    if (this.timerId !== null) {
      window.clearTimeout(this.timerId);
      this.timerId = null;
    }
  }

  public toggle(): boolean {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.play();
      return true;
    }
  }

  public getStatus(): boolean {
    return this.isPlaying;
  }

  private playWarmPadNote(freq: number, duration: number, delaySec: number) {
    if (!this.ctx || !this.masterGain || !this.isPlaying) return;

    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const noteGain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime + delaySec);

    // Warm lowpass filter
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(480, this.ctx.currentTime + delaySec);
    filter.Q.setValueAtTime(1.5, this.ctx.currentTime + delaySec);

    const startTime = this.ctx.currentTime + delaySec;
    noteGain.gain.setValueAtTime(0.0001, startTime);
    noteGain.gain.linearRampToValueAtTime(0.07, startTime + 1.2);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(filter);
    filter.connect(noteGain);
    noteGain.connect(this.masterGain);

    osc.start(startTime);
    osc.stop(startTime + duration + 0.5);
  }

  private playPluckedTone(freq: number, delaySec: number) {
    if (!this.ctx || !this.masterGain || !this.isPlaying) return;

    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const noteGain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq * 2, this.ctx.currentTime + delaySec);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1800, this.ctx.currentTime + delaySec);
    filter.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + delaySec + 1.5);

    const startTime = this.ctx.currentTime + delaySec;
    noteGain.gain.setValueAtTime(0.09, startTime);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, startTime + 2.5);

    osc.connect(filter);
    filter.connect(noteGain);
    noteGain.connect(this.masterGain);

    osc.start(startTime);
    osc.stop(startTime + 3.0);
  }

  private scheduleChordSequence() {
    if (!this.isPlaying || !this.ctx) return;

    const chord = this.chords[this.currentChordIndex];
    const duration = 4.8; // seconds per chord

    // Play warm pad
    chord.forEach((note) => {
      this.playWarmPadNote(note, duration, 0);
    });

    // Gentle acoustic arpeggio
    chord.forEach((note, idx) => {
      this.playPluckedTone(note, 0.4 + idx * 0.7);
    });

    // Melodic high note
    const topNote = chord[chord.length - 1];
    this.playPluckedTone(topNote * 1.5, 2.6);

    this.currentChordIndex = (this.currentChordIndex + 1) % this.chords.length;

    this.timerId = window.setTimeout(() => {
      this.scheduleChordSequence();
    }, duration * 1000 - 300);
  }
}

export const romanticAudio = new RomanticAmbientEngine();
