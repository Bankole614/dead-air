import React, { useState, useEffect, useRef } from 'react';
import { useGameStore } from '../state/store';
import { sound } from '../engine/sound';
import { Volume2, Pin, Headphones, AlertTriangle, CheckCircle2 } from './icons';

interface TapeSample {
  id: string;
  label: string;
  speaker: string;
  text: string;
  timestamp: string;
  callId: string;
  backgroundClues: string[];
  ambientSourceId?: string;
  forensicReveal?: string;
}

export const AudioScrubber: React.FC = () => {
  const {
    calls,
    radioFeed,
    notebook,
    recordABComparisonDiscovery,
    getActiveCase,
  } = useGameStore();

  const currentCase = getActiveCase();
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Build library of recorded audio tapes from calls + radio transmissions
  const allTapes: TapeSample[] = [];
  Object.values(calls).forEach((call) => {
    const cDef = currentCase.calls[call.callDefId];
    call.history.forEach((h, idx) => {
      if (h.speaker === 'caller' || h.speaker === 'radio') {
        allTapes.push({
          id: `${call.callDefId}_${h.nodeId}_${idx}`,
          label: `[${h.timestamp}] ${h.speakerName || cDef?.callerNameDisplay || 'Caller'}: "${h.text.slice(0, 52)}..."`,
          speaker: h.speakerName || 'Caller',
          text: h.text,
          timestamp: h.timestamp,
          callId: call.callDefId,
          backgroundClues: h.backgroundClues || [],
          ambientSourceId: h.ambientSourceId,
          forensicReveal: h.forensicReveal,
        });
      }
    });
  });

  radioFeed.forEach((rf, idx) => {
    allTapes.push({
      id: `rf_${rf.id}_${idx}`,
      label: `[${rf.timestamp}] RADIO (${rf.unitName}): "${rf.text.slice(0, 52)}..."`,
      speaker: rf.unitName,
      text: rf.text,
      timestamp: rf.timestamp,
      callId: 'radio_scanner',
      backgroundClues: rf.clues || ['radio_carrier_tone'],
      ambientSourceId: rf.ambientSourceId,
    });
  });

  const [deckAId, setDeckAId] = useState<string>(allTapes[0]?.id || '');
  const [deckBId, setDeckBId] = useState<string>(allTapes[1]?.id || allTapes[0]?.id || '');

  useEffect(() => {
    if (!deckAId && allTapes.length > 0) setDeckAId(allTapes[0].id);
    if ((!deckBId || deckBId === deckAId) && allTapes.length > 1) setDeckBId(allTapes[1].id);
  }, [allTapes.length]);

  const deckA = allTapes.find((t) => t.id === deckAId) || allTapes[0] || null;
  const deckB = allTapes.find((t) => t.id === deckBId) || allTapes[1] || allTapes[0] || null;

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const playSample = (sample: TapeSample | null) => {
    if (!sample) return;
    sound.stopVoice();
    setIsPlaying(true);
    sound.playVoiceOrSpeak(sample.text, 'caller', undefined, sample.speaker, () => {
      setIsPlaying(false);
    });
  };

  // Dual-Trace CRT vector oscilloscope
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

      ctx.strokeStyle = '#0a2312';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 24) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      const midY = canvas.height / 2;
      const points = 70;

      // Trace A (Emerald Green)
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#34d399';
      ctx.beginPath();
      for (let i = 0; i <= points; i++) {
        const x = (i / points) * canvas.width;
        const amp = isPlaying ? 15 : 5;
        const wave = Math.sin((i * 0.35) + phase) * Math.cos((i * 0.12) - phase);
        const y = midY - 10 + (wave * amp);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Trace B (Amber Gold or Red if shared broadcast)
      if (deckB) {
        const sharedSource = deckA && deckB && deckA.ambientSourceId && deckA.ambientSourceId === deckB.ambientSourceId;
        ctx.lineWidth = 2;
        ctx.strokeStyle = sharedSource ? '#ef4444' : '#f59e0b';
        ctx.beginPath();
        for (let i = 0; i <= points; i++) {
          const x = (i / points) * canvas.width;
          const amp = isPlaying ? 14 : 5;
          const offset = sharedSource ? 0 : 1.7;
          const wave = Math.sin((i * 0.35) + phase + offset) * Math.cos((i * 0.12) - phase - offset);
          const y = midY + 12 + (wave * amp);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      phase += isPlaying ? 0.14 : 0.03;
      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, deckA?.id, deckB?.id]);

  // Compute A/B Cross-Correlation Insights
  const computeABAnalysis = () => {
    if (!deckA || !deckB || deckA.id === deckB.id) return null;

    const sharedAmbientId = deckA.ambientSourceId && deckA.ambientSourceId === deckB.ambientSourceId
      ? deckA.ambientSourceId
      : undefined;
    const sharedClues = deckA.backgroundClues.filter((c) => deckB.backgroundClues.includes(c));
    const hasForensicReveal = deckA.forensicReveal || deckB.forensicReveal;

    if (sharedAmbientId) {
      return {
        type: 'source_contamination' as const,
        title: 'SHARED BROADCAST SOURCE DETECTED (CIRCULAR REPORTING)',
        description: `Both [${deckA.speaker}] and [${deckB.speaker}] carry the exact same background signal (${sharedAmbientId.replace(/_/g, ' ')}). These witnesses are NOT independent—they are repeating the same broadcast.`,
        pinText: `A/B FORENSIC PROOF: ${deckA.speaker} and ${deckB.speaker} share background broadcast [${sharedAmbientId}]. Testimony is circular hearsay.`,
        ambientSourceId: sharedAmbientId,
      };
    }

    if (hasForensicReveal) {
      const revealText = [deckA.forensicReveal, deckB.forensicReveal].filter(Boolean).join(' // ');
      return {
        type: 'acoustic_contradiction' as const,
        title: 'ACOUSTIC DISCREPANCY EXPOSED',
        description: revealText,
        pinText: `A/B FORENSIC PROOF: Comparing [${deckA.speaker}] vs [${deckB.speaker}] reveals: ${revealText}`,
        ambientSourceId: deckA.ambientSourceId || deckB.ambientSourceId,
      };
    }

    if (sharedClues.length > 0) {
      return {
        type: 'shared_environment' as const,
        title: 'MATCHING BACKGROUND SOUND',
        description: `Both recordings contain the same background sound: ${sharedClues.map(c => c.replace(/_/g, ' ')).join(', ')}.`,
        pinText: `A/B ACOUSTIC MATCH: ${deckA.speaker} and ${deckB.speaker} both share background sound [${sharedClues.join(', ')}].`,
        ambientSourceId: sharedClues[0],
      };
    }

    return {
      type: 'independent' as const,
      title: 'INDEPENDENT RECORDINGS (NO SHARED BROADCAST)',
      description: `No shared radio bleed or background broadcast detected between [${deckA.speaker}] and [${deckB.speaker}].`,
      pinText: `A/B VERIFICATION: [${deckA.speaker}] and [${deckB.speaker}] show independent acoustic backgrounds.`,
    };
  };

  const abAnalysis = computeABAnalysis();

  return (
    <div className="flex-1 p-4 overflow-y-auto font-mono max-w-5xl w-full mx-auto space-y-4">
      {/* Compact Dual-Trace Oscilloscope Screen */}
      <div className="p-3 bg-neutral-950 border border-neutral-800 rounded-lg">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="font-bold text-crt-amber flex items-center gap-2">
            <Headphones className="w-4 h-4" />
            <span>DUAL-TAPE A/B AUDIO COMPARATOR</span>
          </span>
          <span className="text-[11px] text-neutral-500">
            Select two recordings below to compare background sounds &amp; broadcast bleed
          </span>
        </div>

        <div className="relative border border-emerald-950 rounded overflow-hidden bg-[#061009]">
          <canvas ref={canvasRef} width={500} height={76} className="w-full h-20 block" />
          <div className="absolute top-1.5 left-2.5 text-[10px] text-emerald-400 flex items-center gap-4">
            <span>● TAPE A: {deckA ? deckA.speaker.toUpperCase() : 'NONE'}</span>
            {deckB && <span className="text-amber-400">● TAPE B: {deckB.speaker.toUpperCase()}</span>}
          </div>
        </div>
      </div>

      {allTapes.length < 2 ? (
        <div className="p-8 text-center border border-dashed border-neutral-800 rounded-lg text-neutral-500 text-xs">
          Answer at least two calls on <strong>[F1] Switchboard</strong> to compare their recordings side-by-side.
        </div>
      ) : (
        <>
          {/* Tape A & Tape B Selectors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* TAPE A */}
            <div className="p-3 rounded-lg border border-emerald-900/60 bg-neutral-900/60 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-emerald-400">● TAPE A</span>
                {deckA && (
                  <button
                    onClick={() => playSample(deckA)}
                    className="px-2.5 py-1 rounded bg-emerald-950 hover:bg-emerald-900 text-emerald-200 text-[11px] flex items-center gap-1"
                  >
                    <Volume2 className="w-3.5 h-3.5" /> PLAY TAPE A
                  </button>
                )}
              </div>
              <select
                value={deckAId}
                onChange={(e) => setDeckAId(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-700 rounded p-2 text-xs text-neutral-200 outline-none"
              >
                {allTapes.map((t) => (
                  <option key={t.id} value={t.id}>{t.label}</option>
                ))}
              </select>
              {deckA && (
                <div className="text-xs text-neutral-300 italic bg-black/40 p-2.5 rounded">
                  "{deckA.text}"
                </div>
              )}
            </div>

            {/* TAPE B */}
            <div className="p-3 rounded-lg border border-amber-900/60 bg-neutral-900/60 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-amber-400">● TAPE B</span>
                {deckB && (
                  <button
                    onClick={() => playSample(deckB)}
                    className="px-2.5 py-1 rounded bg-amber-950 hover:bg-amber-900 text-amber-200 text-[11px] flex items-center gap-1"
                  >
                    <Volume2 className="w-3.5 h-3.5" /> PLAY TAPE B
                  </button>
                )}
              </div>
              <select
                value={deckBId}
                onChange={(e) => setDeckBId(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-700 rounded p-2 text-xs text-neutral-200 outline-none"
              >
                {allTapes.map((t) => (
                  <option key={t.id} value={t.id}>{t.label}</option>
                ))}
              </select>
              {deckB && (
                <div className="text-xs text-neutral-300 italic bg-black/40 p-2.5 rounded">
                  "{deckB.text}"
                </div>
              )}
            </div>
          </div>

          {/* A/B Comparison Result Box */}
          {abAnalysis && (
            <div
              className={`p-4 rounded-lg border text-xs space-y-2.5 ${
                abAnalysis.type === 'source_contamination'
                  ? 'border-red-600/80 bg-red-950/30 text-red-100'
                  : abAnalysis.type === 'acoustic_contradiction'
                  ? 'border-crt-amber bg-amber-950/30 text-amber-100'
                  : 'border-emerald-800/70 bg-emerald-950/20 text-emerald-100'
              }`}
            >
              <div className="font-bold text-sm flex items-center gap-2">
                {abAnalysis.type === 'source_contamination' ? (
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-crt-amber shrink-0" />
                )}
                <span>{abAnalysis.title}</span>
              </div>

              <p className="text-xs leading-relaxed opacity-90">
                {abAnalysis.description}
              </p>

              <div className="pt-1 flex justify-end">
                {(() => {
                  const isABPinned = notebook.pins.some(
                    (p) => p.text.toLowerCase() === abAnalysis.pinText.toLowerCase()
                  );
                  return (
                    <button
                      onClick={() => recordABComparisonDiscovery(abAnalysis.pinText, abAnalysis.ambientSourceId)}
                      className={`px-3.5 py-2 font-bold rounded text-xs flex items-center gap-1.5 shadow transition ${
                        isABPinned
                          ? 'bg-emerald-600 text-black'
                          : 'bg-crt-amber hover:bg-yellow-400 text-black'
                      }`}
                    >
                      <Pin className="w-3.5 h-3.5 fill-current" />
                      <span>{isABPinned ? '✓ FINDING PINNED TO BOARD' : 'PIN THIS FINDING TO EVIDENCE BOARD'}</span>
                    </button>
                  );
                })()}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
