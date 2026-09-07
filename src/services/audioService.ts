// Web Audio API Synthesizer for P5X-style punchy SFX & Dark Urban School Ambient

class AudioManager {
  private ctx: AudioContext | null = null;
  private bgmGain: GainNode | null = null;
  private isBgmPlaying: boolean = false;
  private bgmInterval: number | null = null;
  private isMuted: boolean = false;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.bgmGain) {
      this.bgmGain.gain.setValueAtTime(this.isMuted ? 0 : 0.15, this.ctx?.currentTime || 0);
    }
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  // Play UI Click / Selection
  public playClick() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(480, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.06);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.06);
    } catch {
      // Audio context might be restricted before user gesture
    }
  }

  // Attack Slash sound
  public playSlash() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      // White noise buffer for slash whoosh
      const bufferSize = this.ctx.sampleRate * 0.12;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1400, t);
      filter.frequency.exponentialRampToValueAtTime(300, t + 0.12);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.3, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.12);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      noise.start(t);
    } catch {
      // Ignored
    }
  }

  // Weakness Hit / Critical Strike (Heavy Punchy Impact)
  public playCritical() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;

      // Heavy sub drop
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, t);
      osc.frequency.exponentialRampToValueAtTime(40, t + 0.3);

      oscGain.gain.setValueAtTime(0.4, t);
      oscGain.gain.exponentialRampToValueAtTime(0.01, t + 0.35);

      osc.connect(oscGain);
      oscGain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.35);

      // Glass snap
      const snap = this.ctx.createOscillator();
      const snapGain = this.ctx.createGain();
      snap.type = 'triangle';
      snap.frequency.setValueAtTime(1200, t);
      snap.frequency.exponentialRampToValueAtTime(2400, t + 0.1);
      snapGain.gain.setValueAtTime(0.3, t);
      snapGain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);

      snap.connect(snapGain);
      snapGain.connect(this.ctx.destination);
      snap.start(t);
      snap.stop(t + 0.15);
    } catch {
      // Ignored
    }
  }

  // "ONE MORE!" Stinger
  public playOneMore() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;

      // Fanfare chord: D4 -> G4 -> C5
      const freqs = [293.66, 392.00, 523.25];
      freqs.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, t + idx * 0.08);

        gain.gain.setValueAtTime(0, t);
        gain.gain.setValueAtTime(0.2, t + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.01, t + idx * 0.08 + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(t + idx * 0.08);
        osc.stop(t + idx * 0.08 + 0.4);
      });
    } catch {
      // Ignored
    }
  }

  // ALL-OUT ATTACK / Serangan Total Smash Finish
  public playAllOutAttack() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;

      // Rapid comic cuts
      for (let i = 0; i < 4; i++) {
        setTimeout(() => this.playSlash(), i * 110);
      }

      // Massive finisher explosion
      setTimeout(() => {
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.exponentialRampToValueAtTime(30, now + 0.6);

        gain.gain.setValueAtTime(0.5, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.65);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.65);
      }, 500);
    } catch {
      // Ignored
    }
  }

  // All-Out Attack Glass Shatter Effect
  public playAllOutShatter() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      // High-pitched crystal shatter bursts
      [1200, 1800, 2400, 3200].forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t + idx * 0.03);
        osc.frequency.exponentialRampToValueAtTime(300, t + idx * 0.03 + 0.25);
        gain.gain.setValueAtTime(0.3, t + idx * 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.03 + 0.25);
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(t + idx * 0.03);
        osc.stop(t + idx * 0.03 + 0.26);
      });
    } catch {
      // Ignored
    }
  }

  // All-Out Attack Victory Pose Fanfare (Jazz Brass style stinger)
  public playAllOutFinisherFanfare() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      // Persona 5 style brass flourish: Bb4 -> C5 -> Eb5 -> F5 -> Bb5!
      const notes = [466.16, 523.25, 622.25, 698.46, 932.33];
      notes.forEach((freq, i) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, t + i * 0.1);
        gain.gain.setValueAtTime(0, t + i * 0.1);
        gain.gain.linearRampToValueAtTime(i === notes.length - 1 ? 0.35 : 0.2, t + i * 0.1 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.1 + (i === notes.length - 1 ? 0.9 : 0.25));
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(t + i * 0.1);
        osc.stop(t + i * 0.1 + (i === notes.length - 1 ? 0.95 : 0.28));
      });
    } catch {
      // Ignored
    }
  }

  // Spirit Shift SFX (Persona Switch: Whoosh + Resonant Soul Resonance)
  public playSpiritShift() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;

      // Swift aerodynamic blade whoosh
      const bufferSize = this.ctx.sampleRate * 0.18;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(2800, t);
      filter.frequency.exponentialRampToValueAtTime(400, t + 0.18);
      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.35, t);
      noiseGain.gain.exponentialRampToValueAtTime(0.01, t + 0.18);
      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);
      noise.start(t);

      // Resonant harmonic chime chords (G4, D5, G5)
      [392.00, 587.33, 783.99].forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t + 0.05 + idx * 0.03);
        gain.gain.setValueAtTime(0, t);
        gain.gain.setValueAtTime(0.25, t + 0.05 + idx * 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05 + idx * 0.03 + 0.5);
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(t + 0.05 + idx * 0.03);
        osc.stop(t + 0.05 + idx * 0.03 + 0.55);
      });
    } catch {
      // Ignored
    }
  }

  // Spirit Awakening Cinematic SFX (Sub bass rumble, seal snap, celestial chord bloom)
  public playAwakenSound(rarity: 'SSR' | 'SR' | 'R' = 'R') {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;

      // Heavy sub bass impact
      const sub = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      sub.type = 'sawtooth';
      sub.frequency.setValueAtTime(140, t);
      sub.frequency.exponentialRampToValueAtTime(32, t + 0.7);
      subGain.gain.setValueAtTime(0.45, t);
      subGain.gain.exponentialRampToValueAtTime(0.005, t + 0.75);
      sub.connect(subGain);
      subGain.connect(this.ctx.destination);
      sub.start(t);
      sub.stop(t + 0.75);

      // Seal shatter sparkle
      [800, 1600, 2400, 3200].forEach((f, i) => {
        const osc = this.ctx!.createOscillator();
        const g = this.ctx!.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, t + 0.1 + i * 0.04);
        g.gain.setValueAtTime(0.2, t + 0.1 + i * 0.04);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.1 + i * 0.04 + 0.3);
        osc.connect(g);
        g.connect(this.ctx!.destination);
        osc.start(t + 0.1 + i * 0.04);
        osc.stop(t + 0.1 + i * 0.04 + 0.35);
      });

      // Triumphant SSR Fanfare
      if (rarity === 'SSR') {
        const chord = [523.25, 659.25, 783.99, 1046.50]; // C Major high octave
        chord.forEach((note, idx) => {
          const osc = this.ctx!.createOscillator();
          const gain = this.ctx!.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(note, t + 0.35 + idx * 0.06);
          gain.gain.setValueAtTime(0, t);
          gain.gain.linearRampToValueAtTime(0.3, t + 0.35 + idx * 0.06 + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35 + idx * 0.06 + 0.85);
          osc.connect(gain);
          gain.connect(this.ctx!.destination);
          osc.start(t + 0.35 + idx * 0.06);
          osc.stop(t + 0.35 + idx * 0.06 + 0.9);
        });
      }
    } catch {
      // Ignored
    }
  }

  // Elemental Magic SFX
  public playMagic(element: string) {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;

      if (element === 'Agni') {
        // Fire burst & roaring flame
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(450, t);
        osc.frequency.exponentialRampToValueAtTime(70, t + 0.45);
        gain.gain.setValueAtTime(0.35, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.5);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.5);
      } else if (element === 'Tirta') {
        // Ice crystal shatter & frost shimmer
        [520, 780, 1040, 1560].forEach((f, i) => {
          const osc = this.ctx!.createOscillator();
          const gain = this.ctx!.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(f, t + i * 0.04);
          gain.gain.setValueAtTime(0.25, t + i * 0.04);
          gain.gain.exponentialRampToValueAtTime(0.01, t + i * 0.04 + 0.35);
          osc.connect(gain);
          gain.connect(this.ctx!.destination);
          osc.start(t + i * 0.04);
          osc.stop(t + i * 0.04 + 0.38);
        });
      } else if (element === 'Vidyut') {
        // Heavy Electric thunder crackle
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(950, t);
        osc.frequency.setValueAtTime(180, t + 0.06);
        osc.frequency.setValueAtTime(1200, t + 0.12);
        osc.frequency.setValueAtTime(90, t + 0.2);
        gain.gain.setValueAtTime(0.35, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.4);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.4);
      } else if (element === 'Bayu') {
        // Howling wind razor cyclone
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(200, t);
        osc.frequency.linearRampToValueAtTime(800, t + 0.18);
        osc.frequency.exponentialRampToValueAtTime(120, t + 0.45);
        gain.gain.setValueAtTime(0.3, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.45);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.45);
      } else if (element === 'Nur') {
        // Sacred Divine Celestial chime & resonance
        [440, 660, 880, 1320].forEach((f, i) => {
          const osc = this.ctx!.createOscillator();
          const gain = this.ctx!.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(f, t + i * 0.03);
          gain.gain.setValueAtTime(0.2, t + i * 0.03);
          gain.gain.exponentialRampToValueAtTime(0.005, t + i * 0.03 + 0.55);
          osc.connect(gain);
          gain.connect(this.ctx!.destination);
          osc.start(t + i * 0.03);
          osc.stop(t + i * 0.03 + 0.6);
        });
      } else if (element === 'Ghaib') {
        // Terrifying sub darkness rumble
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(90, t);
        osc.frequency.exponentialRampToValueAtTime(28, t + 0.5);
        gain.gain.setValueAtTime(0.45, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.55);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.55);
      } else if (element === 'Peluru') {
        // High caliber gunshot / talisman projectile snap
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(1400, t);
        osc.frequency.exponentialRampToValueAtTime(80, t + 0.12);
        gain.gain.setValueAtTime(0.4, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.15);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.15);
      } else {
        // Default slash
        this.playSlash();
      }
    } catch {
      // Ignored
    }
  }

  // Ambient P5X-style funky dark horror beat
  public startBgm() {
    if (this.isBgmPlaying) return;
    this.isBgmPlaying = true;
    this.initCtx();
    if (!this.ctx) return;

    this.bgmGain = this.ctx.createGain();
    this.bgmGain.gain.setValueAtTime(this.isMuted ? 0 : 0.12, this.ctx.currentTime);
    this.bgmGain.connect(this.ctx.destination);

    // Bassline notes pattern in D minor (D2, F2, G2, Ab2, A2, C3)
    const bassScale = [73.42, 87.31, 98.00, 103.83, 110.00, 130.81];
    let step = 0;

    const tick = () => {
      if (!this.isBgmPlaying || !this.ctx || !this.bgmGain) return;
      const t = this.ctx.currentTime;
      const noteIdx = [0, 0, 1, 2, 0, 3, 2, 5][step % 8];
      const freq = bassScale[noteIdx];

      // Bass synth
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.18, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.22);

      osc.connect(gain);
      gain.connect(this.bgmGain);
      osc.start(t);
      osc.stop(t + 0.25);

      // Hi-hat pulse on every other step
      if (step % 2 === 1) {
        const hhBuffer = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.03, this.ctx.sampleRate);
        const data = hhBuffer.getChannelData(0);
        for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
        const hhSource = this.ctx.createBufferSource();
        hhSource.buffer = hhBuffer;
        const hhFilter = this.ctx.createBiquadFilter();
        hhFilter.type = 'highpass';
        hhFilter.frequency.setValueAtTime(6000, t);
        const hhGain = this.ctx.createGain();
        hhGain.gain.setValueAtTime(0.06, t);
        hhGain.gain.exponentialRampToValueAtTime(0.001, t + 0.03);
        hhSource.connect(hhFilter);
        hhFilter.connect(hhGain);
        hhGain.connect(this.bgmGain);
        hhSource.start(t);
      }

      step++;
    };

    this.bgmInterval = window.setInterval(tick, 280);
  }

  public stopBgm() {
    this.isBgmPlaying = false;
    if (this.bgmInterval) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
  }

  public isPlayingBgm(): boolean {
    return this.isBgmPlaying;
  }
}

export const audioService = new AudioManager();
