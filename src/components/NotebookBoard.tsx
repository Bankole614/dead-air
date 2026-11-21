import React, { useState } from 'react';
import { useGameStore } from '../state/store';
import { ProvenanceType } from '../types/game';
import { Pin, Trash2, User, Headphones, AlertTriangle, ShieldAlert } from './icons';
import { AudioScrubber } from './AudioScrubber';

const PROVENANCE_CYCLE: ProvenanceType[] = ['firsthand', 'hearsay_echo', 'interpretation'];

const PROVENANCE_BADGE: Record<ProvenanceType, { label: string; style: string }> = {
  firsthand: {
    label: '👁️ FIRSTHAND OBSERVATION ↻',
    style: 'border-emerald-700 bg-emerald-950/50 text-emerald-300',
  },
  hearsay_echo: {
    label: '📻 HEARSAY / RADIO ECHO ↻',
    style: 'border-red-700 bg-red-950/50 text-red-300',
  },
  interpretation: {
    label: '❓ CALLER ASSUMPTION ↻',
    style: 'border-amber-700 bg-amber-950/50 text-amber-300',
  },
};

export const NotebookBoard: React.FC = () => {
  const {
    notebook,
    characters,
    workingTheory,
    removePinnedClue,
    updateFreeNotes,
    assignPinProvenance,
    updateCharacterNotes,
    setWorkingTheorySuspect,
    toggleChallengeCounterPin,
    getActiveCase,
  } = useGameStore();

  const currentCase = getActiveCase();
  const [activeTab, setActiveTab] = useState<'evidence' | 'suspects' | 'audio'>('evidence');
  const [selectedCharacter, setSelectedCharacter] = useState<string>(Object.keys(characters)[0] || 'C1');
  const activeCharId = characters[selectedCharacter] ? selectedCharacter : (Object.keys(characters)[0] || '');

  // Automatic Echo Chamber detection across pinned clues
  const ambientCounts: Record<string, number> = {};
  notebook.pins.forEach((p) => {
    if (p.ambientSourceId) {
      ambientCounts[p.ambientSourceId] = (ambientCounts[p.ambientSourceId] || 0) + 1;
    }
  });
  const sharedCarrier = Object.keys(ambientCounts).find((k) => ambientCounts[k] >= 2);

  const cycleProvenance = (pinId: string, current?: ProvenanceType) => {
    const idx = current ? PROVENANCE_CYCLE.indexOf(current) : -1;
    const next = PROVENANCE_CYCLE[(idx + 1) % PROVENANCE_CYCLE.length];
    assignPinProvenance(pinId, next);
  };

  return (
    <div className="flex-1 flex flex-col bg-crt-panel overflow-hidden select-none">
      {/* Clean 3-Tab Navigation */}
      <div className="flex items-center border-b border-crt-panel-border bg-neutral-900/60 px-4 pt-2 text-xs font-mono gap-2">
        <button
          onClick={() => setActiveTab('evidence')}
          className={`flex items-center gap-2 px-4 py-2 border-b-2 font-bold transition-all ${
            activeTab === 'evidence'
              ? 'border-crt-amber text-crt-amber bg-neutral-800/40'
              : 'border-transparent text-neutral-400 hover:text-white'
          }`}
        >
          <Pin className="w-3.5 h-3.5" />
          <span>1. EVIDENCE BOARD ({notebook.pins.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('audio')}
          className={`flex items-center gap-2 px-4 py-2 border-b-2 font-bold transition-all ${
            activeTab === 'audio'
              ? 'border-crt-amber text-crt-amber bg-neutral-800/40'
              : 'border-transparent text-neutral-400 hover:text-white'
          }`}
        >
          <Headphones className="w-3.5 h-3.5" />
          <span>2. A/B AUDIO COMPARATOR</span>
        </button>

        <button
          onClick={() => setActiveTab('suspects')}
          className={`flex items-center gap-2 px-4 py-2 border-b-2 font-bold transition-all ${
            activeTab === 'suspects'
              ? 'border-crt-amber text-crt-amber bg-neutral-800/40'
              : 'border-transparent text-neutral-400 hover:text-white'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>3. SUSPECT DOSSIERS &amp; NOTES</span>
        </button>
      </div>

      {/* TAB 1: UNIFIED EVIDENCE BOARD & THEORY CHALLENGE */}
      {activeTab === 'evidence' && (
        <div className="flex-1 p-4 overflow-y-auto space-y-3 max-w-5xl w-full mx-auto font-mono">
          {/* Compact Working Hypothesis Bar */}
          {currentCase.deduction && (
            <div className="p-3 bg-neutral-900/80 border border-neutral-800 rounded-lg flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-crt-amber shrink-0" />
                <span className="font-bold text-neutral-300">WORKING THEORY TO TEST:</span>
              </div>
              <select
                value={workingTheory?.suspectId || ''}
                onChange={(e) => setWorkingTheorySuspect(e.target.value)}
                className="flex-1 min-w-[220px] bg-neutral-950 border border-neutral-700 rounded px-2.5 py-1.5 text-xs text-crt-amber outline-none"
              >
                <option value="">-- Select initial suspect to test for confirmation bias --</option>
                {currentCase.deduction.suspectChoices.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
              {workingTheory?.counterPinIds && workingTheory.counterPinIds.length > 0 && (
                <span className="px-2.5 py-1 rounded bg-emerald-950/70 border border-emerald-700 text-emerald-300 text-[11px] font-bold">
                  ✓ THEORY CHALLENGED ({workingTheory.counterPinIds.length})
                </span>
              )}
            </div>
          )}

          {/* Automatic Circular Reporting Alert (Only appears when 2+ pins share a broadcast source) */}
          {sharedCarrier && (
            <div className="p-3 rounded-lg bg-red-950/40 border border-red-700/80 text-xs text-red-200 flex items-center gap-2.5">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
              <div>
                <strong>ECHO CHAMBER DETECTED:</strong> Multiple pinned statements share background broadcast{' '}
                <span className="underline">{sharedCarrier.replace(/_/g, ' ')}</span>. Click their source badge below to mark them as{' '}
                <strong>📻 Hearsay / Radio Echo</strong>.
              </div>
            </div>
          )}

          {/* Pinned Clues List */}
          {notebook.pins.length === 0 ? (
            <div className="h-60 flex flex-col items-center justify-center text-center p-6 text-neutral-500 border border-dashed border-neutral-800 rounded-lg">
              <Pin className="w-7 h-7 text-neutral-700 mb-2" />
              <div className="text-xs font-bold text-neutral-400">NO CLUES PINNED YET</div>
              <div className="text-[11px] text-neutral-600 max-w-xs mt-1">
                Click <strong>[PIN CLUE]</strong> on any caller line or background sound during a call to save it here.
              </div>
            </div>
          ) : (
            <div className="space-y-2.5">
              {notebook.pins.map((pin) => {
                const prov = pin.provenance || 'firsthand';
                const isCounter = workingTheory?.counterPinIds.includes(pin.id);

                return (
                  <div
                    key={pin.id}
                    className="p-3.5 bg-neutral-900/90 rounded-lg border border-neutral-800 hover:border-neutral-700 transition flex flex-col gap-2"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-crt-amber">[{pin.sourceSpeaker}]</span>
                        <span className="text-neutral-500">{pin.timestamp}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Single Click-to-Cycle Provenance Button */}
                        <button
                          onClick={() => cycleProvenance(pin.id, pin.provenance)}
                          title="Click to cycle source reliability: Firsthand -> Hearsay Echo -> Caller Assumption"
                          className={`px-2.5 py-0.5 rounded border text-[10px] font-bold transition ${PROVENANCE_BADGE[prov].style}`}
                        >
                          {PROVENANCE_BADGE[prov].label}
                        </button>

                        {/* 1-Click Disproves Theory Toggle */}
                        <button
                          onClick={() => toggleChallengeCounterPin(pin.id)}
                          title="Mark if this clue contradicts your initial suspect theory"
                          className={`px-2.5 py-0.5 rounded border text-[10px] font-bold transition ${
                            isCounter
                              ? 'border-emerald-500 bg-emerald-500 text-black'
                              : 'border-neutral-700 bg-neutral-800 text-neutral-400 hover:text-white'
                          }`}
                        >
                          {isCounter ? '✓ CONTRADICTS BIAS' : 'CHALLENGE BIAS'}
                        </button>

                        <button
                          onClick={() => removePinnedClue(pin.id)}
                          title="Delete pin"
                          className="p-1 text-neutral-500 hover:text-red-400 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="text-xs sm:text-sm text-neutral-200 italic">
                      "{pin.text}"
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: A/B AUDIO COMPARATOR */}
      {activeTab === 'audio' && <AudioScrubber />}

      {/* TAB 3: SUSPECT DOSSIERS & SHIFT NOTES COMBINED */}
      {activeTab === 'suspects' && (
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden font-mono">
          {/* Left: Character Selector & Dossier */}
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden border-b lg:border-b-0 lg:border-r border-neutral-800">
            <div className="w-full md:w-52 border-b md:border-b-0 md:border-r border-neutral-800 p-2.5 space-y-1.5 overflow-y-auto text-xs">
              <div className="text-[10px] text-neutral-500 font-bold px-1 mb-1">PERSONS OF INTEREST</div>
              {Object.values(characters).map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCharacter(c.id)}
                  className={`w-full text-left p-2.5 rounded transition ${
                    activeCharId === c.id
                      ? 'bg-neutral-800 text-crt-amber font-bold border border-amber-900/50'
                      : 'text-neutral-400 hover:bg-neutral-900 hover:text-white'
                  }`}
                >
                  <div className="font-bold">{c.knownName}</div>
                  <div className="text-[10px] text-neutral-500 truncate">{c.role}</div>
                </button>
              ))}
            </div>

            {characters[activeCharId] && (
              <div className="flex-1 p-4 overflow-y-auto space-y-3">
                {(() => {
                  const char = characters[activeCharId];
                  return (
                    <>
                      {/* Supervisor Briefing Memo (if present) */}
                      {currentCase.supervisorBiasBrief && (
                        <div className="p-3 rounded border border-amber-800/60 bg-amber-950/20 text-xs space-y-1">
                          <div className="text-[10px] font-bold text-amber-400">
                            SUPERVISOR MEMO // {currentCase.supervisorBiasBrief.supervisorName}
                          </div>
                          <div className="text-neutral-300 italic">
                            "{currentCase.supervisorBiasBrief.memoText}"
                          </div>
                        </div>
                      )}

                      <div className="border-b border-neutral-800 pb-2">
                        <div className="text-base font-bold text-crt-amber">
                          {char.knownName}
                        </div>
                        <div className="text-xs text-neutral-400 mt-0.5">
                          ROLE: {char.role} // CLAIMED LOCATION: {char.claimedLocation}
                        </div>
                      </div>

                      <div>
                        <div className="text-xs font-bold text-neutral-400 mb-1">SUBJECT DOSSIER NOTES:</div>
                        <textarea
                          value={char.notes}
                          onChange={(e) => updateCharacterNotes(char.id, e.target.value)}
                          className="w-full h-36 bg-black/50 border border-neutral-800 rounded p-2.5 text-xs text-neutral-200 resize-none focus:border-crt-amber outline-none leading-relaxed"
                        />
                      </div>
                    </>
                  );
                })()}
              </div>
            )}
          </div>

          {/* Right: Freeform Shift Scratchpad */}
          <div className="w-full lg:w-80 p-4 flex flex-col bg-neutral-950/50">
            <div className="text-xs font-bold text-neutral-400 mb-1.5">OPERATOR SHIFT SCRATCHPAD:</div>
            <textarea
              value={notebook.freeNotes}
              onChange={(e) => updateFreeNotes(e.target.value)}
              placeholder="Jot down addresses, entrances, or timestamps here..."
              className="flex-1 min-h-[160px] bg-black/60 border border-neutral-800 rounded p-3 text-xs text-crt-amber resize-none focus:border-crt-amber outline-none leading-relaxed"
            />
          </div>
        </div>
      )}
    </div>
  );
};
