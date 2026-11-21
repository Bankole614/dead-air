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
    setConsoleMode,
    getActiveCase,
  } = useGameStore();

  const currentCase = getActiveCase();
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeCall = activeCallId ? calls[activeCallId] : null;
  const activeCallDef = activeCallId ? currentCase.calls[activeCallId] : null;

  const [typedChars, setTypedChars] = useState<number>(0);
  const [selectedText, setSelectedText] = useState<string>('');
  const [isOptionsCollapsed, setIsOptionsCollapsed] = useState<boolean>(false);

  const latestHistory = activeCall?.history[activeCall.history.length - 1];
  const currentNode = activeCallDef && activeCall ? activeCallDef.nodes[activeCall.currentNodeId] : null;

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

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
    const timer = setTimeout(scrollToBottom, 60);
    return () => clearTimeout(timer);
  }, [activeCall?.history.length, typedChars, typewriterActive, isOptionsCollapsed, currentNode?.id]);

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
      latestHistory.timestamp,
      latestHistory.ambientSourceId
    );
    setSelectedText('');
  };

  const isOptionUnlocked = (opt: DialogueOption): boolean => {
    if (!opt.requiresPin || opt.requiresPin.length === 0) return true;

    const pinsText = notebook.pins.map(p => p.text.toLowerCase()).join(' ');
    return opt.requiresPin.every(keyword => {
      const lowerReq = keyword.toLowerCase();
      if (pinsText.includes(lowerReq)) return true;
      const words = lowerReq.split(/[\s,]+/).filter(w => w.length > 2);
      return words.length > 0 && words.every(w => pinsText.includes(w));
    });
  };

  if (!activeCall || !activeCallDef) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-neutral-500 bg-[#0a0d12] select-none">
        <Radio className="w-10 h-10 text-neutral-700 mb-3 animate-pulse" />
        <div className="text-sm font-mono tracking-widest text-neutral-300">SWITCHBOARD READY</div>
        <div className="text-xs text-neutral-500 max-w-sm mt-1 mb-5">
          Answer the incoming call or advance to the next emergency transmission.
        </div>
        <button
          onClick={fastForwardToNextCall}
          className="px-5 py-2.5 bg-crt-amber hover:bg-yellow-400 text-black font-bold rounded text-xs flex items-center gap-2 shadow-lg transition active:scale-95"
        >
          <FastForward className="w-4 h-4 fill-current" />
          <span>START NEXT CALL [SPACE]</span>
        </button>
      </div>
    );
  }

  const isCallFinished = activeCall.status === 'completed';

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-[#0a0d12] overflow-hidden select-text">
      {/* Floating Highlight Pin Button (Only appears when user highlights text) */}
      {selectedText && (
        <div className="px-4 py-1.5 bg-amber-950/60 border-b border-crt-amber flex items-center justify-between text-xs select-none shrink-0">
          <span className="text-amber-200 truncate mr-3">Selected: "{selectedText}"</span>
          <button
            onClick={handlePinSelection}
            className="px-3 py-1 bg-crt-amber text-black font-bold rounded text-[11px] flex items-center gap-1 shadow hover:bg-yellow-400 transition shrink-0"
          >
            <Pin className="w-3 h-3 fill-current" />
            PIN SELECTION
          </button>
        </div>
      )}

      {/* Main Conversation Log */}
      <div
        ref={scrollRef}
        onMouseUp={handleMouseUp}
        className="p-4 sm:p-6 overflow-y-auto space-y-3 font-mono text-sm sm:text-base leading-relaxed flex-1 min-h-[200px] max-w-5xl w-full mx-auto"
      >
        {activeCall.history.map((entry, index) => {
          const isLatest = index === activeCall.history.length - 1;
          const displayText = isLatest && typewriterActive
            ? entry.text.slice(0, typedChars)
            : entry.text;

          const isOperator = entry.speaker === 'operator';
          const isSystem = entry.speaker === 'system';
          const isRadio = entry.speaker === 'radio';
          const isLinePinned = notebook.pins.some(
            (p) => p.text.toLowerCase() === entry.text.trim().toLowerCase()
          );

          if (isSystem) {
            return (
              <div
                key={entry.nodeId + index}
                className="py-2 px-3 rounded bg-neutral-900/50 border border-neutral-800/80 text-neutral-400 text-xs text-center select-none"
              >
                {entry.text}
              </div>
            );
          }

          return (
            <div
              key={entry.nodeId + index}
              className={`p-3.5 rounded-lg border transition-all ${
                isOperator
                  ? 'border-blue-900/40 bg-blue-950/15 text-blue-100 ml-4 sm:ml-10'
                  : isRadio
                  ? 'border-yellow-600/70 bg-yellow-950/25 text-yellow-100 border-l-4 border-l-yellow-400'
                  : isLatest && !typewriterActive
                  ? 'border-crt-amber/80 bg-neutral-900/80 text-neutral-100 shadow-md border-l-4 border-l-crt-amber mr-4 sm:mr-10'
                  : 'border-neutral-800 bg-neutral-900/40 text-neutral-200 mr-4 sm:mr-10'
              }`}
            >
              <div className="flex items-center justify-between text-xs text-neutral-500 mb-1.5 select-none">
                <span className={`font-bold flex items-center gap-2 ${
                  isOperator ? 'text-blue-400' : isRadio ? 'text-yellow-400' : 'text-crt-amber'
                }`}>
                  {isRadio && <Radio className="w-3.5 h-3.5 animate-pulse text-yellow-400" />}
                  <span>{entry.speakerName?.toUpperCase() || entry.speaker.toUpperCase()}</span>
                  <span className="text-neutral-600 font-normal">{entry.timestamp}</span>
                  <button
                    onClick={() => sound.playVoiceOrSpeak(entry.text, entry.speaker, entry.voiceUrl, entry.speakerName)}
                    title="Replay audio"
                    className="inline-flex items-center text-neutral-500 hover:text-crt-amber transition p-0.5"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </span>

                {!isOperator && (
                  <button
                    onClick={() => addPinnedClue(entry.text, entry.speakerName || 'Caller', activeCall.callDefId, entry.timestamp, entry.ambientSourceId)}
                    className={`px-2 py-0.5 rounded text-[11px] font-bold flex items-center gap-1 transition ${
                      isLinePinned
                        ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-700/70'
                        : 'bg-neutral-800/80 hover:bg-crt-amber hover:text-black text-neutral-300'
                    }`}
                  >
                    <Pin className="w-3 h-3" />
                    <span>{isLinePinned ? '✓ PINNED' : 'PIN CLUE'}</span>
                  </button>
                )}
              </div>

              {/* Spoken Text */}
              <div className="whitespace-pre-wrap">
                {displayText}
                {isLatest && typewriterActive && (
                  <span className="inline-block w-2 h-4 bg-crt-amber ml-1 animate-blink"></span>
                )}
              </div>

              {/* Clickable Background Acoustics */}
              {entry.backgroundClues && entry.backgroundClues.length > 0 && (
                <div className="mt-2.5 pt-2 border-t border-neutral-800/60 flex flex-wrap items-center gap-1.5 select-none">
                  <Headphones className="w-3.5 h-3.5 text-crt-amber" />
                  <span className="text-[11px] text-neutral-400">SOUNDS HEARD:</span>
                  {entry.backgroundClues.map((tag) => {
                    const formattedClue = `ACOUSTIC CLUE: ${tag.replace(/_/g, ' ').toUpperCase()}`;
                    const isTagPinned = notebook.pins.some(
                      (p) => p.text.toLowerCase() === formattedClue.toLowerCase()
                    );
                    return (
                      <button
                        key={tag}
                        onClick={() =>
                          addPinnedClue(
                            formattedClue,
                            entry.speakerName || 'Acoustic Sensor',
                            activeCall.callDefId,
                            entry.timestamp,
                            entry.ambientSourceId || tag,
                            'firsthand'
                          )
                        }
                        className={`px-2 py-0.5 rounded text-[11px] border transition flex items-center gap-1 ${
                          isTagPinned
                            ? 'bg-emerald-950/70 text-emerald-300 border-emerald-700 font-bold'
                            : 'bg-neutral-800/80 text-crt-amber border-amber-900/40 hover:border-crt-amber'
                        }`}
                      >
                        <Pin className="w-2.5 h-2.5" />
                        <span>{tag.replace(/_/g, ' ')} {isTagPinned ? '✓' : ''}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {isCallFinished && (
          <div className="p-4 bg-neutral-900/90 border border-emerald-900/60 rounded-lg flex flex-wrap items-center justify-between gap-3 shadow-lg select-none">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
              <CheckCircle2 className="w-4 h-4" />
              <span>CALL ENDED — Review your clues in [F3] or continue to the next call.</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setConsoleMode('evidence')}
                className="px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-crt-amber border border-amber-800/60 font-bold rounded text-xs flex items-center gap-1.5 transition"
              >
                <Headphones className="w-3.5 h-3.5" />
                <span>REVIEW EVIDENCE [F3]</span>
              </button>
              <button
                onClick={fastForwardToNextCall}
                className="px-4 py-2 bg-crt-amber hover:bg-yellow-400 text-black font-bold rounded text-xs flex items-center gap-1.5 shadow-md transition active:scale-95"
              >
                <FastForward className="w-3.5 h-3.5 fill-current" />
                <span>NEXT CALL [SPACE]</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Dialogue Response Panel */}
      {currentNode?.options && currentNode.options.length > 0 && !typewriterActive && (
        <div
          className={`p-3.5 sm:p-4 border-t border-crt-panel-border bg-[#0d1117] select-none flex flex-col shrink-0 ${
            isOptionsCollapsed ? 'max-h-11' : 'max-h-[36vh]'
          } transition-all duration-200`}
        >
          <div className="max-w-5xl w-full mx-auto flex flex-col flex-1 min-h-0">
            <div className="text-xs font-bold text-crt-amber mb-2 flex items-center justify-between shrink-0">
              <span>CHOOSE YOUR RESPONSE:</span>
              <button
                onClick={() => setIsOptionsCollapsed(!isOptionsCollapsed)}
                className="text-[11px] text-neutral-400 hover:text-white px-2 py-0.5 rounded bg-neutral-800 transition"
              >
                {isOptionsCollapsed ? '▲ SHOW RESPONSES' : '▼ HIDE'}
              </button>
            </div>

            {!isOptionsCollapsed && (
              <div className="space-y-2 overflow-y-auto pr-1 flex-1 min-h-0">
                {currentNode.options.map((option) => {
                  const unlocked = isOptionUnlocked(option);

                  return (
                    <button
                      key={option.id}
                      disabled={!unlocked}
                      onClick={() => selectDialogueOption(option)}
                      className={`w-full text-left p-3 rounded-md text-sm font-mono transition-all flex items-start gap-2.5 border ${
                        unlocked
                          ? option.label.includes('[CHALLENGE') || option.label.includes('⚠️')
                            ? 'border-amber-600/80 bg-amber-950/40 hover:bg-amber-900/60 text-amber-200'
                            : 'border-neutral-700/80 bg-neutral-800/70 hover:bg-neutral-700/80 text-neutral-200 hover:text-white'
                          : 'border-neutral-900 bg-black/50 text-neutral-600 cursor-not-allowed'
                      }`}
                    >
                      <span className={`font-bold leading-snug ${unlocked ? 'text-crt-amber' : 'text-neutral-700'}`}>&gt;</span>
                      <div className="flex-1 min-w-0">
                        <div className="leading-snug">{option.label}</div>
                        {!unlocked && option.requiresPin && (
                          <div className="text-xs text-red-400/90 mt-1 flex items-center gap-1.5">
                            <Lock className="w-3 h-3 shrink-0" />
                            <span>Pin clues containing <strong>{option.requiresPin.join(' + ')}</strong> to unlock</span>
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
