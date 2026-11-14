/**
 * Web Audio API synthesizer for Clock Ticks, Alarms, and Timers
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private alarmOscillators: { osc1: OscillatorNode; osc2?: OscillatorNode; gain: GainNode }[] = [];
  private alarmInterval: number | null = null;
  private isAlarmPlaying = false;
  private customAudio: HTMLAudioElement | null = null;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  // Play mechanical clock tick sound
  playTick(volume = 0.2) {
    try {
      const ctx = this.initCtx();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1400, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.025);

      gain.gain.setValueAtTime(volume * 0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.025);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.03);
    } catch {
      // Audio autoplay policy fallback
    }
  }

  // Play a single test beep or preview
  playTone(frequency: number, duration: number, type: OscillatorType = 'sine', volume = 0.5) {
    try {
      const ctx = this.initCtx();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);

      gain.gain.setValueAtTime(volume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + duration);
    } catch {}
  }

  // Play Alarm loop
  startAlarm(sound: 'beep' | 'chime' | 'echo' | 'siren' | 'custom', customAudioUrl?: string, volume = 0.8) {
    if (this.isAlarmPlaying) return;
    this.isAlarmPlaying = true;

    if (sound === 'custom' && customAudioUrl) {
      try {
        this.customAudio = new Audio(customAudioUrl);
        this.customAudio.loop = true;
        this.customAudio.volume = volume;
        this.customAudio.play().catch(() => {
          // If custom playback fails, fallback to synthesizer chime
          this.startSynthesizedAlarm('chime', volume);
        });
        return;
      } catch {
        this.startSynthesizedAlarm('chime', volume);
        return;
      }
    }

    this.startSynthesizedAlarm(sound, volume);
  }

  private startSynthesizedAlarm(sound: 'beep' | 'chime' | 'echo' | 'siren' | 'custom', volume: number) {
    const playCycle = () => {
      const ctx = this.initCtx();
      if (!ctx || !this.isAlarmPlaying) return;

      if (sound === 'beep') {
        // Classic digital alarm 3-beep pattern
        [0, 0.15, 0.3].forEach((offset) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'square';
          osc.frequency.setValueAtTime(880, ctx.currentTime + offset);
          gain.gain.setValueAtTime(volume * 0.4, ctx.currentTime + offset);
          gain.gain.setValueAtTime(0, ctx.currentTime + offset + 0.08);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + offset);
          osc.stop(ctx.currentTime + offset + 0.09);
        });
      } else if (sound === 'chime') {
        // Gentle harmonious chime chords
        [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.1);
          gain.gain.setValueAtTime(volume * 0.35, ctx.currentTime + idx * 0.1);
          gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.1 + 1.2);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + idx * 0.1);
          osc.stop(ctx.currentTime + idx * 0.1 + 1.3);
        });
      } else if (sound === 'echo') {
        // Ambient pulsing pulse
        const freqs = [440, 554.37, 659.25];
        freqs.forEach((f, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(f, ctx.currentTime);
          gain.gain.setValueAtTime(volume * 0.25, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + i * 0.05);
          osc.stop(ctx.currentTime + 1.6);
        });
      } else if (sound === 'siren') {
        // Two-tone alternating siren
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(600, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(900, ctx.currentTime + 0.35);
        osc.frequency.linearRampToValueAtTime(600, ctx.currentTime + 0.7);

        gain.gain.setValueAtTime(volume * 0.25, ctx.currentTime);
        gain.gain.setValueAtTime(0, ctx.currentTime + 0.75);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.76);
      }
    };

    playCycle();
    this.alarmInterval = window.setInterval(playCycle, sound === 'chime' ? 1800 : 1000);
  }

  // Stop Alarm
  stopAlarm() {
    this.isAlarmPlaying = false;
    if (this.alarmInterval !== null) {
      clearInterval(this.alarmInterval);
      this.alarmInterval = null;
    }
    if (this.customAudio) {
      try {
        this.customAudio.pause();
        this.customAudio.currentTime = 0;
      } catch {}
      this.customAudio = null;
    }
  }

  // Timer complete sound
  playTimerDone(volume = 0.8) {
    const ctx = this.initCtx();
    if (!ctx) return;

    // Victory fanfare chords
    const notes = [440, 554.37, 659.25, 880];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.12);
      gain.gain.setValueAtTime(volume * 0.4, ctx.currentTime + idx * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.12 + 0.9);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + idx * 0.12);
      osc.stop(ctx.currentTime + idx * 0.12 + 1.0);
    });
  }

  // White noise / sleep sounds for bedside mode
  createSleepNoise(type: 'rain' | 'crickets' | 'pink') {
    const ctx = this.initCtx();
    if (!ctx) return null;

    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      // Pink noise algorithm
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.06;
      b6 = white * 0.115926;
    }

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = buffer;
    noiseSource.loop = true;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.08, ctx.currentTime);

    noiseSource.connect(gain);
    gain.connect(ctx.destination);
    noiseSource.start();

    return {
      stop: () => {
        try {
          noiseSource.stop();
          noiseSource.disconnect();
        } catch {}
      },
    };
  }
}

export const soundEngine = new SoundEngine();
