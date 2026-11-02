// Dead Air Audio Engine
// Combines Web Audio API procedural synthesis with audio cues for zero-external-dependency fallback

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private ambientGain: GainNode | null = null;
  private isAmbientPlaying: boolean = false;
  private ringInterval: number | null = null;
  private currentVoiceAudio: HTMLAudioElement | null = null;
  public currentFilterType: 'normal' | 'low_cut' | 'high_cut' = 'normal';
  public currentPlaybackRate: number = 1.0;

  constructor() {
    // AudioContext will be initialized on first user interaction
  }

  public setAudioFilter(filter: 'normal' | 'low_cut' | 'high_cut') {
    this.currentFilterType = filter;
  }

  public setAudioSpeed(speed: number) {
    this.currentPlaybackRate = speed;
    if (this.currentVoiceAudio) {
      this.currentVoiceAudio.playbackRate = speed;
    }
  }

  public seekVoice(seconds: number) {
    if (this.currentVoiceAudio && isFinite(seconds)) {
      this.currentVoiceAudio.currentTime = Math.max(0, Math.min(this.currentVoiceAudio.duration || 100, seconds));
    }
  }

  public getVoiceCurrentTime(): number {
    return this.currentVoiceAudio ? this.currentVoiceAudio.currentTime : 0;
  }

  public getVoiceDuration(): number {
    return this.currentVoiceAudio && isFinite(this.currentVoiceAudio.duration) ? this.currentVoiceAudio.duration : 0;
  }

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.ambientGain) {
      this.ambientGain.gain.value = muted ? 0 : 0.05;
    }
    if (muted) {
      this.stopVoice();
    }
  }

  public getMuted() {
    return this.isMuted;
  }

  public stopVoice() {
    if (this.currentVoiceAudio) {
      this.currentVoiceAudio.pause();
      this.currentVoiceAudio.currentTime = 0;
      this.currentVoiceAudio = null;
    }
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }

  // Play voice acting line through audio file or synthesized telephone speech
  public playVoice(url: string) {
    this.playVoiceOrSpeak('', 'caller', url);
  }

  // Dynamic speech synthesis fallback with character pitch and cadence
  public speakText(
    text: string,
    speaker: 'caller' | 'operator' | 'system' | 'radio',
    speakerName?: string,
    onEnd?: () => void
  ) {
    if (this.isMuted || typeof window === 'undefined' || !window.speechSynthesis) {
      onEnd?.();
      return;
    }

    try {
      window.speechSynthesis.cancel();

      // Clean text of parenthetical stage directions like (Mask drops, shouting...), bracket tags, and quotes
      const clean = text
        .replace(/\([^\)]*\)/g, '')
        .replace(/\[[^\]]*\]/g, '')
        .replace(/⚠️/g, '')
        .replace(/^["'>\s]+|["'\s]+$/g, '')
        .trim();

      if (!clean) {
        onEnd?.();
        return;
      }

      const utterance = new SpeechSynthesisUtterance(clean);
      const voices = window.speechSynthesis.getVoices();

      if (speaker === 'operator') {
        // Operator 7: Calm, steady police dispatch voice
        utterance.pitch = 0.98;
        utterance.rate = 1.05;
        const operatorVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('David') || v.name.includes('Guy') || v.name.includes('Male') || v.name.includes('Natural')));
        if (operatorVoice) utterance.voice = operatorVoice;
      } else {
        // Caller character voices
        const name = (speakerName || '').toLowerCase();
        if (name.includes('gable') || name.includes('martha') || name.includes('clara') || name.includes('ruth') || name.includes('mara')) {
          utterance.pitch = 1.15;
          utterance.rate = 0.93;
          const femaleVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Zira') || v.name.includes('Jenny') || v.name.includes('Female') || v.name.includes('Samantha')));
          if (femaleVoice) utterance.voice = femaleVoice;
        } else if (name.includes('static') || name.includes('subject 3')) {
          utterance.pitch = 0.72;
          utterance.rate = 0.88;
        } else if (name.includes('ross') || name.includes('elias')) {
          utterance.pitch = 1.08;
          utterance.rate = 1.14;
        } else if (name.includes('vance') || name.includes('valle') || name.includes('trooper') || name.includes('officer')) {
          utterance.pitch = 0.82;
          utterance.rate = 0.96;
        } else {
          utterance.pitch = 0.92;
          utterance.rate = 1.0;
        }
      }

      let ended = false;
      let safetyTimer: number | null = null;
      const finish = () => {
        if (!ended) {
          ended = true;
          if (safetyTimer) clearTimeout(safetyTimer);
          onEnd?.();
        }
      };

      utterance.onend = finish;
      utterance.onerror = finish;
      utterance.rate = Math.max(0.5, Math.min(2.0, utterance.rate * this.currentPlaybackRate));

      // Safety timeout in case browser drops speech onend event
      const maxDuration = Math.min(Math.max(1200, clean.length * 60), 4500);
      safetyTimer = window.setTimeout(finish, maxDuration);

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis failed:', e);
      onEnd?.();
    }
  }

  // Universal voice player: plays pre-recorded .mp3 file if present; falls back to speech synthesis
  public playVoiceOrSpeak(
    text: string,
    speaker: 'caller' | 'operator' | 'system' | 'radio',
    voiceUrl?: string,
    speakerName?: string,
    onEnd?: () => void
  ) {
    if (this.isMuted) {
      onEnd?.();
      return;
    }
    this.initCtx();
    this.stopVoice();

    // 1. If a pre-recorded high-fidelity voice file exists, try playing it
    if (voiceUrl) {
      try {
        const audio = new Audio(voiceUrl);
        this.currentVoiceAudio = audio;
        audio.volume = 0.95;
        audio.playbackRate = this.currentPlaybackRate;

        let finished = false;
        const triggerEnd = () => {
          if (!finished) {
            finished = true;
            this.currentVoiceAudio = null;
            onEnd?.();
          }
        };

        audio.onended = triggerEnd;

        audio.onerror = () => {
          console.warn('Voice file load failed, falling back to synthesis for:', voiceUrl);
          this.currentVoiceAudio = null;
          this.speakText(text, speaker, speakerName, onEnd);
        };

        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch((e) => {
            console.warn('Voice playback blocked, falling back to speech synthesis:', e);
            this.speakText(text, speaker, speakerName, onEnd);
          });
        }
        return;
      } catch (e) {
        console.warn('Failed to load voice file:', e);
      }
    }

    // 2. Fallback to browser speech synthesis for any line without an mp3 file
    if (text) {
      this.speakText(text, speaker, speakerName, onEnd);
    } else {
      onEnd?.();
    }
  }

  // Radio rotary tuning detent click
  public playTuningClick() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.02);
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.02);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.025);
    } catch (e) {}
  }

  // Radio carrier lock squelch chirp (Motorola roger tone)
  public playRadioChirp() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.setValueAtTime(1240, now + 0.04);

      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.13);
    } catch (e) {}
  }

  // Atmospheric HVAC and room hum
  public startAmbientHum() {
    if (this.isMuted || this.isAmbientPlaying) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      this.ambientGain = this.ctx.createGain();

      // Deep 60Hz hum + 120Hz harmonic (typical fluorescent / electrical equipment)
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(60, now);

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(118, now); // slight beat frequency

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(160, now);

      this.ambientGain.gain.setValueAtTime(0.04, now);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(this.ambientGain);
      this.ambientGain.connect(this.ctx.destination);

      osc1.start();
      osc2.start();
      this.isAmbientPlaying = true;
    } catch (e) {
      console.warn('AudioContext failed to start ambient hum:', e);
    }
  }

  // Typewriter or terminal mechanical keyclick
  public playKeypress() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      // Sharp micro-click
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1200 + Math.random() * 300, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.015);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1500, now);

      gain.gain.setValueAtTime(0.025, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.015);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.02);
    } catch (e) {
      // Audio error silenced
    }
  }

  // Phone Ringing (US Dual Tone Multi Frequency cadence 440Hz + 480Hz)
  public startPhoneRing() {
    if (this.ringInterval) return;
    this.initCtx();
    if (!this.ctx) return;

    const playOneRing = () => {
      if (!this.ctx || this.isMuted) return;
      const now = this.ctx.currentTime;
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(440, now);
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(480, now);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.setValueAtTime(0.08, now + 1.6);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 1.85);
      osc2.stop(now + 1.85);
    };

    playOneRing();
    this.ringInterval = window.setInterval(playOneRing, 3500);
  }

  public stopPhoneRing() {
    if (this.ringInterval) {
      clearInterval(this.ringInterval);
      this.ringInterval = null;
    }
  }

  // Static burst
  public playStaticBurst(durationSeconds = 0.35) {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const bufferSize = this.ctx.sampleRate * durationSeconds;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1100, this.ctx.currentTime);
      filter.Q.setValueAtTime(2.0, this.ctx.currentTime);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + durationSeconds);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start();
    } catch (e) {
      // Audio error
    }
  }

  // Receiver pickup / line connect click
  public playLineClick() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(350, now);
      osc.frequency.exponentialRampToValueAtTime(60, now + 0.08);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.09);
    } catch (e) {
      // Audio error
    }
  }

  // Call disconnect / hangup tone
  public playHangupTone() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(425, now);

      gain.gain.setValueAtTime(0.07, now);
      gain.gain.setValueAtTime(0.07, now + 0.3);
      gain.gain.setValueAtTime(0, now + 0.31);
      gain.gain.setValueAtTime(0.07, now + 0.6);
      gain.gain.setValueAtTime(0, now + 0.9);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 1.0);
    } catch (e) {
      // Audio error
    }
  }

  // Pin / evidence locked note sound
  public playPinSound() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(1760, now + 0.12);

      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.16);
    } catch (e) {
      // Audio error
    }
  }

  // Circuit breaker trip / electrical surge buzz
  public playBreakerTrip() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(60, now);
      osc.frequency.setValueAtTime(120, now + 0.15);

      gain.gain.setValueAtTime(0.09, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.4);

      this.playStaticBurst(0.25);
    } catch (e) {
      // Audio error
    }
  }

  // Heavy mechanical breaker switch / clunk reset
  public playBreakerReset() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = 'square';
      osc1.frequency.setValueAtTime(130, now);
      osc1.frequency.exponentialRampToValueAtTime(35, now + 0.09);

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(260, now);
      osc2.frequency.exponentialRampToValueAtTime(55, now + 0.12);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.15);
      osc2.stop(now + 0.15);
    } catch (e) {
      // Audio error
    }
  }

  // Dispatch alarm sound
  public playDispatchAlarm() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(650, now);
      osc.frequency.setValueAtTime(780, now + 0.1);
      osc.frequency.setValueAtTime(650, now + 0.2);

      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.36);
    } catch (e) {
      // Audio error
    }
  }
}

export const sound = new SoundEngine();
