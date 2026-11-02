import React, { useState, useEffect, useRef } from 'react';
import { useGameStore } from '../state/store';
import { DialogueOption } from '../types/game';
import { sound } from '../engine/sound';
import { Pin, Headphones, Lock, CheckCircle2, Radio, FastForward, Volume2 } from './icons';

export const LiveTranscript: React.FC = () => {
  const {
    activeCallId,
    calls,
    notebook,
    settings,
    typewriterActive,
    selectDialogueOption,
    addPinnedClue,
    finishTypewriter,
    fastForwardToNextCall,
    getActiveCase,
  } = useGameStore();

  const currentCase = getActiveCase();
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeCall = activeCallId ? calls[activeCallId] : null;
  const activeCallDef = activeCallId ? currentCase.calls[activeCallId] : null;

  // Typewriter text state for the latest line
  const [typedChars, setTypedChars] = useState<number>(0);
  const [selectedText, setSelectedText] = useState<string>('');
  const [isOptionsCollapsed, setIsOptionsCollapsed] = useState<boolean>(false);

  const latestHistory = activeCall?.history[activeCall.history.length - 1];
  const currentNode = activeCallDef && activeCall ? activeCallDef.nodes[activeCall.currentNodeId] : null;

  // Reset collapse state when dialogue node changes
  useEffect(() => {
    setIsOptionsCollapsed(false);
  }, [currentNode?.id]);

  // Typewriter effect
  useEffect(() => {
    if (!latestHistory || !typewriterActive) {
      if (latestHistory) setTypedChars(latestHistory.text.length);
      return;
    }

    setTypedChars(0);
    const fullLength = latestHistory.text.length;
    let current = 0;

    const speedMs = settings.textSpeed === 'fast' ? 12 : 28;

    const interval = setInterval(() => {
      current++;
      setTypedChars(current);
      if (current % 2 === 0) {
        sound.playKeypress();
      }

      if (current >= fullLength) {
        clearInterval(interval);
        finishTypewriter();
      }
    }, speedMs);

    return () => clearInterval(interval);
  }, [latestHistory?.nodeId, typewriterActive, settings.textSpeed]);

  // Auto scroll to bottom whenever history, typewriter, or response options change
  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
    // Ensure scroll position remains pinned at the bottom after options panel expands/renders
    const timer = setTimeout(scrollToBottom, 60);
    return () => clearTimeout(timer);
  }, [activeCall?.history.length, typedChars, typewriterActive, isOptionsCollapsed, currentNode?.id]);

  // Listen to text selection in the transcript
  const handleMouseUp = () => {
    const sel = window.getSelection();
    if (sel && sel.toString().trim().length > 3) {
      setSelectedText(sel.toString().trim());
    } else {
      setSelectedText('');
    }
  };

  const handlePinSelection = () => {
    if (!selectedText || !activeCall || !latestHistory) return;
    addPinnedClue(
      selectedText,
      latestHistory.speakerName || 'Speaker',
      activeCall.callDefId,
      latestHistory.timestamp
    );
    setSelectedText('');
  };

  // Helper to check if a dialogue option is unlocked
  const isOptionUnlocked = (opt: DialogueOption): boolean => {
    if (!opt.requiresPin || opt.requiresPin.length === 0) return true;

    // Check if pins match the required keywords or phrases
    const pinsText = notebook.pins.map(p => p.text.toLowerCase()).join(' ');
    return opt.requiresPin.every(keyword => {
      const lowerReq = keyword.toLowerCase();
      // Direct exact match
      if (pinsText.includes(lowerReq)) return true;
      // Multi-word phrase matching (e.g. "transmitter" and "off-air" in same/different pins)
      const words = lowerReq.split(/[\s,]+/).filter(w => w.length > 2);
      return words.length > 0 && words.every(w => pinsText.includes(w));
    });
  };

  if (!activeCall || !activeCallDef) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-neutral-500 bg-[#0a0d12] select-none">
        <Radio className="w-12 h-12 text-neutral-700 mb-3 animate-pulse" />
        <div className="text-sm font-mono tracking-widest text-neutral-400">NO AUDIO STREAM CONNECTED</div>
        <div className="text-xs text-neutral-600 max-w-sm mt-1 mb-5">
          The dispatch circuit is idle. Pick up an incoming call on Line 02, or press below to advance the clock to the next transmission.
        </div>
        <button
          onClick={fastForwardToNextCall}
          className="px-5 py-2.5 bg-crt-amber hover:bg-yellow-400 text-black font-bold rounded text-xs flex items-center gap-2 shadow-lg transition active:scale-95 animate-bounce"
        >
          <FastForward className="w-4 h-4 fill-current" />
          <span>ADVANCE TO NEXT INCOMING CALL [SPACE]</span>
        </button>
      </div>
    );
  }

  const isCallFinished = activeCall.status === 'completed';

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-[#0a0d12] border-r border-crt-panel-border overflow-hidden select-text">
      {/* Transcript Header */}
      <div className="px-4 py-2 border-b border-neutral-800 bg-neutral-900/60 flex items-center justify-between text-xs select-none shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
          <span className="font-bold text-neutral-300 font-mono">
            {activeCallDef.callerNameDisplay}
          </span>
          <span className="text-neutral-500 text-[10px] hidden sm:inline">
            // ID: {activeCallDef.callerId} // TIME: {activeCall.startTime}
          </span>
        </div>

        {/* Selected text pin shortcut */}
        {selectedText && (
          <button
            onClick={handlePinSelection}
            className="px-2.5 py-1 bg-crt-amber text-black font-bold rounded text-[11px] flex items-center gap-1 shadow-md hover:bg-yellow-400 transition animate-bounce"
          >
            <Pin className="w-3 h-3 fill-current" />
            PIN HIGHLIGHT TO NOTEBOOK
          </button>
        )}
      </div>

      {/* Transcript Scrolling Log - Fits height to content, expands up to max-h */}
      <div
        ref={scrollRef}
        onMouseUp={handleMouseUp}
        className="p-4 sm:p-5 overflow-y-auto space-y-3 font-mono text-sm sm:text-base leading-relaxed max-h-[48vh] shrink-0"
      >
        {activeCall.history.map((entry, index) => {
          const isLatest = index === activeCall.history.length - 1;
          const displayText = isLatest && typewriterActive
            ? entry.text.slice(0, typedChars)
            : entry.text;

          const isOperator = entry.speaker === 'operator';
          const isSystem = entry.speaker === 'system';
          const isRadio = entry.speaker === 'radio';

          return (
            <div
              key={entry.nodeId + index}
              className={`p-3 rounded border transition-all ${
                isOperator
                  ? 'border-blue-900/40 bg-blue-950/20 text-blue-200'
                  : isSystem
                  ? 'border-neutral-800 bg-black/60 text-neutral-400 text-xs italic'
                  : isRadio
                  ? 'border-yellow-600/70 bg-yellow-950/25 text-yellow-100 shadow-md border-l-4 border-l-yellow-400'
                  : isLatest && !typewriterActive
                  ? 'border-crt-amber/80 bg-neutral-900/70 text-neutral-100 shadow-md border-l-4 border-l-crt-amber'
                  : 'border-crt-panel-border bg-neutral-900/40 text-neutral-200'
              }`}
            >
              <div className="flex items-center justify-between text-[11px] text-neutral-500 mb-1 select-none">
                <span className={`font-bold flex items-center gap-1.5 ${
                  isOperator ? 'text-blue-400' : isSystem ? 'text-neutral-400' : isRadio ? 'text-yellow-400 glow-amber' : 'text-crt-amber glow-amber'
                }`}>
                  {isRadio && <Radio className="w-3.5 h-3.5 animate-pulse text-yellow-400" />}
                  <span>{entry.speakerName?.toUpperCase() || entry.speaker.toUpperCase()}</span>
                  {!isSystem && (
                    <button
                      onClick={() => sound.playVoiceOrSpeak(entry.text, entry.speaker, entry.voiceUrl, entry.speakerName)}
                      title="Replay spoken voice line"
                      className="inline-flex items-center hover:scale-110 transition p-0.5"
                    >
                      <Volume2 className={`w-3.5 h-3.5 ${entry.voiceUrl ? 'text-emerald-400' : 'text-neutral-400 hover:text-crt-amber'}`} />
                    </button>
                  )}
                </span>
                <div className="flex items-center gap-2">
                  <span>{entry.timestamp}</span>
                  {!isSystem && (
                    <button
                      onClick={() => addPinnedClue(entry.text, entry.speakerName || 'Caller', activeCall.callDefId, entry.timestamp)}
                      title="Pin entire line to notebook"
                      className="p-1 hover:text-crt-amber text-neutral-500 rounded transition"
                    >
                      <Pin className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* Text content */}
              <div className="whitespace-pre-wrap">
                {displayText}
                {isLatest && typewriterActive && (
                  <span className="inline-block w-2 h-4 bg-crt-amber ml-1 animate-blink"></span>
                )}
              </div>

              {/* Audio & background clues tags */}
              {entry.backgroundClues && entry.backgroundClues.length > 0 && (
                <div className="mt-2 pt-1 border-t border-neutral-800/60 flex flex-wrap items-center gap-1.5 select-none">
                  <Headphones className="w-3 h-3 text-crt-amber" />
                  <span className="text-[10px] text-neutral-400 font-mono">BACKGROUND ACOUSTICS:</span>
                  {entry.backgroundClues.map((tag) => (
                    <span
                      key={tag}
                      className="px-1.5 py-0.5 rounded text-[10px] bg-neutral-800/80 text-crt-amber border border-amber-900/40"
                    >
                      {tag.replace(/_/g, ' ')}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {isCallFinished && (
          <div className="p-4 bg-neutral-900/90 border border-emerald-900/60 rounded-lg space-y-3 shadow-lg select-none">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
              <CheckCircle2 className="w-4 h-4" />
              <span>CALL DISCONNECTED // LOG COMMITTED TO DATABASE</span>
            </div>

            <div className="text-xs text-neutral-300 space-y-1">
              <p className="text-neutral-400">
                You have concluded this transmission. Before the next call arrives:
              </p>
              <ul className="list-disc list-inside text-neutral-400 text-[11px] space-y-0.5">
                <li>Review any <span className="text-crt-amber font-bold">pinned clues</span> in your notebook on the right.</li>
                <li>Assign pins to <span className="text-crt-amber font-bold">Person of Interest cards</span> or the <span className="text-crt-amber font-bold">Timeline</span>.</li>
                <li>Or advance immediately to the next emergency transmission below.</li>
              </ul>
            </div>

            <div className="pt-2 border-t border-neutral-800 flex flex-wrap items-center justify-between gap-3">
              <div className="text-[11px] text-neutral-500 font-mono">
                TELEPHONY TRUNK READY
              </div>
              <button
                onClick={fastForwardToNextCall}
                className="px-4 py-2 bg-crt-amber hover:bg-yellow-400 text-black font-bold rounded text-xs flex items-center gap-2 shadow-md transition active:scale-95 animate-pulse"
              >
                <FastForward className="w-3.5 h-3.5 fill-current" />
                <span>FAST-FORWARD TO NEXT CALL [SPACE]</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Response Options Panel - Sits immediately below transcript with no gap */}
      {currentNode?.options && currentNode.options.length > 0 && !typewriterActive && (
        <div
          className={`p-3.5 sm:p-4 border-t border-crt-panel-border bg-[#0d1117] select-none flex flex-col ${
            isOptionsCollapsed ? 'max-h-12' : 'max-h-[50vh]'
          } transition-all duration-200 shadow-2xl z-10`}
        >
          <div className="text-xs sm:text-sm font-bold text-crt-amber mb-2.5 flex items-center justify-between shrink-0 font-mono tracking-wider">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-crt-amber animate-pulse"></span>
              <span>OPERATOR DISPATCH / DIALOGUE RESPONSE:</span>
            </div>

            <div className="flex items-center gap-2 font-mono">
              {settings.assistMode && (
                <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" /> ASSIST ACTIVE
                </span>
              )}
              <button
                onClick={() => setIsOptionsCollapsed(!isOptionsCollapsed)}
                className="text-xs text-neutral-400 hover:text-white px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 transition"
                title="Toggle choices panel to view full transcript behind it"
              >
                {isOptionsCollapsed ? '▲ EXPAND CHOICES' : '▼ MINIMIZE'}
              </button>
            </div>
          </div>

          {!isOptionsCollapsed && (
            <div className="space-y-2.5 overflow-y-auto pr-1.5 flex-1 min-h-0">
              {currentNode.options.map((option) => {
                const unlocked = isOptionUnlocked(option);

                return (
                  <button
                    key={option.id}
                    disabled={!unlocked}
                    onClick={() => selectDialogueOption(option)}
                    className={`w-full text-left p-3.5 sm:p-4 rounded-md text-sm sm:text-base font-mono transition-all flex items-start gap-3 border shadow-sm ${
                      unlocked
                        ? option.label.includes('[CHALLENGE]')
                          ? 'border-amber-600/80 bg-amber-950/40 hover:bg-amber-900/60 text-amber-200 hover:border-amber-500'
                          : option.label.includes('[DISPATCH]')
                          ? 'border-blue-700/70 bg-blue-950/40 hover:bg-blue-900/50 text-blue-200 hover:border-blue-500'
                          : 'border-neutral-700/80 bg-neutral-800/70 hover:bg-neutral-700/80 text-neutral-200 hover:text-white hover:border-neutral-500'
                        : 'border-neutral-900 bg-black/50 text-neutral-600 cursor-not-allowed'
                    }`}
                  >
                    <span className={`font-bold mt-0.5 text-base sm:text-lg leading-none ${unlocked ? 'text-crt-amber' : 'text-neutral-700'}`}>&gt;</span>
                    <div className="flex-1 min-w-0">
                      <div className="leading-snug font-medium text-sm sm:text-base">{option.label}</div>
                      {!unlocked && option.requiresPin && (
                        <div className="text-xs text-red-400/90 mt-1.5 flex items-center gap-1.5 font-sans bg-red-950/30 p-1.5 rounded border border-red-900/30">
                          <Lock className="w-3 h-3 shrink-0 text-red-400" />
                          <span>Requires investigation evidence: pin clues regarding <strong>{option.requiresPin.join(' + ')}</strong> to notebook</span>
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
