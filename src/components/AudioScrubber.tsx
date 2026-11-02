import React, { useState, useEffect, useRef } from 'react';
import { useGameStore } from '../state/store';
import { sound } from '../engine/sound';
import { Volume2, Play, Pause, RotateCcw, Pin, Headphones } from './icons';

export const AudioScrubber: React.FC = () => {
  const {
    activeCallId,
    calls,
    addPinnedClue,
    inGameTimeSeconds,
  } = useGameStore();

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [filterType, setFilterType] = useState<'normal' | 'low_cut' | 'high_cut'>('normal');
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activeCall = activeCallId ? calls[activeCallId] : null;
  const latestEntry = activeCall?.history[activeCall.history.length - 1];

  const hours = Math.floor(inGameTimeSeconds / 3600);
  const minutes = Math.floor((inGameTimeSeconds % 3600) / 60);
  const timeFormatted = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;

  // Poll time from sound engine
  useEffect(() => {
    const timer = setInterval(() => {
      const cur = sound.getVoiceCurrentTime();
      const dur = sound.getVoiceDuration();
      setCurrentTime(cur);
      if (dur > 0) setDuration(dur);
      setIsPlaying(cur > 0 && cur < (dur || 100));
    }, 100);

    return () => clearInterval(timer);
  }, []);

  // Update sound engine on filter/speed changes
  const handleFilterChange = (filter: 'normal' | 'low_cut' | 'high_cut') => {
    setFilterType(filter);
    sound.setAudioFilter(filter);
    sound.playStaticBurst(0.12);
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    sound.setAudioSpeed(speed);
    sound.playTuningClick();
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      sound.stopVoice();
      setIsPlaying(false);
    } else if (latestEntry) {
      sound.playVoiceOrSpeak(latestEntry.text, latestEntry.speaker, latestEntry.voiceUrl, latestEntry.speakerName);
      setIsPlaying(true);
    }
  };

  const handleReplay = () => {
    if (latestEntry) {
      sound.stopVoice();
      sound.playVoiceOrSpeak(latestEntry.text, latestEntry.speaker, latestEntry.voiceUrl, latestEntry.speakerName);
      setIsPlaying(true);
    }
  };

  // Canvas animated CRT vector oscilloscope
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let phase = 0;

    const render = () => {
      ctx.fillStyle = '#061009';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Grid lines
      ctx.strokeStyle = '#0a2312';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 20) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 15) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Draw audio waveform
      ctx.lineWidth = 2;
      ctx.strokeStyle = filterType === 'low_cut' ? '#38bdf8' : filterType === 'high_cut' ? '#f59e0b' : '#34d399';
      ctx.shadowColor = filterType === 'low_cut' ? '#38bdf8' : filterType === 'high_cut' ? '#f59e0b' : '#34d399';
      ctx.shadowBlur = 6;

      ctx.beginPath();
      const midY = canvas.height / 2;
      const points = 60;
      for (let i = 0; i <= points; i++) {
        const x = (i / points) * canvas.width;
        let amp = isPlaying ? 18 : 2;
        if (filterType === 'low_cut') amp *= 0.7; // higher freq flutter
        const freqMult = filterType === 'low_cut' ? 3.5 : filterType === 'high_cut' ? 0.8 : 1.8;
        const wave = Math.sin((i * 0.2 * freqMult) + phase) * Math.cos((i * 0.1) - phase);
        const y = midY + (wave * amp);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      phase += isPlaying ? (0.15 * playbackSpeed) : 0.02;
      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, filterType, playbackSpeed]);

  const acousticClues = latestEntry?.backgroundClues || [];

  return (
    <div className="flex-1 flex flex-col bg-[#080d14] p-3 text-neutral-300 font-mono select-none overflow-hidden">
      {/* Oscilloscope Visualizer Box */}
      <div className="p-3 bg-neutral-950 border border-neutral-800 rounded-lg shadow-inner mb-3">
        <div className="flex items-center justify-between mb-2 text-xs">
          <div className="flex items-center gap-2 font-bold text-crt-amber glow-amber">
            <Headphones className="w-4 h-4 text-crt-amber" />
            <span>TEKTRONIX 1994 FORENSIC AUDIO OSCILLOSCOPE</span>
          </div>

          <div className="text-[10px] text-neutral-500 font-mono">
            MODE: {filterType.toUpperCase().replace('_', '-')}
          </div>
        </div>

        {/* Vector Green Screen Canvas */}
        <div className="relative border border-emerald-950 rounded overflow-hidden shadow-inner bg-[#061009]">
          <canvas
            ref={canvasRef}
            width={400}
            height={90}
            className="w-full h-24 block"
          />
          <div className="absolute top-1 left-2 text-[9px] text-emerald-600 font-mono tracking-widest pointer-events-none">
            BAND: {filterType === 'low_cut' ? 'HPF 1000Hz - 8kHz' : filterType === 'high_cut' ? 'LPF 40Hz - 400Hz' : 'FLAT 20Hz - 20kHz'}
          </div>
          <div className="absolute top-1 right-2 text-[9px] text-emerald-500 font-mono font-bold pointer-events-none">
            {isPlaying ? 'ACTIVE SWEEP' : 'IDLE NOISE'}
          </div>
        </div>

        {/* Scrubber Playhead Bar */}
        <div className="mt-2.5 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <button
              onClick={handlePlayPause}
              className="p-1.5 rounded bg-neutral-800 hover:bg-neutral-700 text-crt-amber transition"
              title="Play/Pause transmission line"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={handleReplay}
              className="p-1.5 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition"
              title="Restart from beginning"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex-1 px-2">
            <input
              type="range"
              min="0"
              max={duration || 10}
              step="0.1"
              value={currentTime}
              onChange={(e) => {
                const target = parseFloat(e.target.value);
                setCurrentTime(target);
                sound.seekVoice(target);
              }}
              className="w-full accent-amber-500 cursor-pointer h-1.5 bg-neutral-800 rounded-lg"
            />
          </div>

          <div className="text-[10px] text-neutral-400 font-mono shrink-0">
            {currentTime.toFixed(1)}s / {(duration || 0).toFixed(1)}s
          </div>
        </div>
      </div>

      {/* Forensic Frequency Filters & Speed */}
      <div className="p-3 bg-neutral-950/70 border border-neutral-800 rounded-lg space-y-3">
        {/* Filter selection buttons */}
        <div>
          <div className="text-[10px] text-neutral-400 font-bold mb-1.5">BANDPASS FILTER ANALYSIS:</div>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleFilterChange('normal')}
              className={`p-1.5 rounded text-xs font-bold border transition ${
                filterType === 'normal'
                  ? 'border-emerald-600 bg-emerald-950/40 text-emerald-300'
                  : 'border-neutral-800 bg-neutral-900/60 text-neutral-400 hover:text-white'
              }`}
            >
              FLAT (NORMAL)
            </button>
            <button
              onClick={() => handleFilterChange('low_cut')}
              className={`p-1.5 rounded text-xs font-bold border transition ${
                filterType === 'low_cut'
                  ? 'border-blue-500 bg-blue-950/40 text-blue-200'
                  : 'border-neutral-800 bg-neutral-900/60 text-neutral-400 hover:text-white'
              }`}
            >
              LOW-CUT (TREBLE)
            </button>
            <button
              onClick={() => handleFilterChange('high_cut')}
              className={`p-1.5 rounded text-xs font-bold border transition ${
                filterType === 'high_cut'
                  ? 'border-amber-600 bg-amber-950/40 text-amber-200'
                  : 'border-neutral-800 bg-neutral-900/60 text-neutral-400 hover:text-white'
              }`}
            >
              HIGH-CUT (BASS)
            </button>
          </div>
        </div>

        {/* Playback speed buttons */}
        <div className="flex items-center justify-between pt-1 border-t border-neutral-900">
          <span className="text-[10px] text-neutral-400 font-bold">SCRUB SPEED:</span>
          <div className="flex items-center gap-1.5">
            {[0.75, 1.0, 1.25].map((speed) => (
              <button
                key={speed}
                onClick={() => handleSpeedChange(speed)}
                className={`px-2 py-0.5 rounded text-[10px] font-mono border transition ${
                  playbackSpeed === speed
                    ? 'border-crt-amber bg-amber-950/40 text-crt-amber font-bold'
                    : 'border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-white'
                }`}
              >
                {speed}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Detected Acoustic Signatures */}
      <div className="mt-3 flex-1 bg-neutral-950/60 border border-neutral-800 rounded-lg p-3 flex flex-col min-h-0 overflow-hidden">
        <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-neutral-800 text-[11px] shrink-0">
          <span className="font-bold text-neutral-400 flex items-center gap-1.5">
            <Volume2 className="w-3.5 h-3.5 text-crt-amber" />
            <span>FORENSIC ACOUSTIC SPECTRUM DETECTIONS</span>
          </span>
          <span className="text-[10px] text-neutral-500">
            {acousticClues.length} CLUES IDENTIFIED
          </span>
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {acousticClues.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-neutral-600 p-4">
              <Headphones className="w-6 h-6 mb-1 opacity-40" />
              <div className="text-xs">NO UNUSUAL ACOUSTIC ANOMALIES IN ACTIVE FRAME</div>
              <div className="text-[10px] text-neutral-700 mt-1">
                Toggle between LOW-CUT and HIGH-CUT filters during calls to unmask faint background noises.
              </div>
            </div>
          ) : (
            acousticClues.map((clueTag) => {
              const formattedTag = clueTag.replace(/_/g, ' ').toUpperCase();
              return (
                <div
                  key={clueTag}
                  className="p-2.5 rounded border border-amber-900/50 bg-amber-950/20 text-xs font-mono flex items-center justify-between gap-2"
                >
                  <div>
                    <div className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                      <span>SPECTRAL MATCH DETECTED</span>
                    </div>
                    <div className="font-bold text-amber-200 mt-0.5">
                      ACOUSTIC ANOMALY: "{formattedTag}"
                    </div>
                  </div>

                  <button
                    onClick={() => addPinnedClue(`ACOUSTIC ANOMALY: ${formattedTag}`, 'Audio Oscilloscope', 'forensic_audio', timeFormatted)}
                    className="px-2.5 py-1 bg-crt-amber hover:bg-yellow-400 text-black font-bold rounded text-[10px] flex items-center gap-1 transition shrink-0"
                    title="Pin acoustic anomaly to evidence notebook"
                  >
                    <Pin className="w-2.5 h-2.5 fill-current" />
                    <span>PIN EVIDENCE</span>
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

