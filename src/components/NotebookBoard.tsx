import React, { useState } from 'react';
import { useGameStore } from '../state/store';
import { Pin, Trash2, Clock, User, FileText } from './icons';

const TIMELINE_SLOTS = [
  '22:00 - 22:15',
  '22:15 - 22:30',
  '22:30 - 22:45',
  '22:45 - 23:00',
];

export const NotebookBoard: React.FC = () => {
  const {
    notebook,
    characters,
    removePinnedClue,
    updateFreeNotes,
    assignPinToTimeline,
    assignPinToCharacter,
    updateCharacterNotes,
  } = useGameStore();

  const [activeTab, setActiveTab] = useState<'pins' | 'timeline' | 'characters' | 'notes'>('pins');
  const [selectedCharacter, setSelectedCharacter] = useState<string>('C1');

  return (
    <div className="flex-1 flex flex-col bg-crt-panel overflow-hidden select-none">
      {/* Tab Navigation */}
      <div className="flex items-center border-b border-crt-panel-border bg-neutral-900/60 px-2 pt-2 text-xs font-mono">
        <button
          onClick={() => setActiveTab('pins')}
          className={`flex items-center gap-1.5 px-3 py-1.5 border-b-2 font-bold transition-all ${
            activeTab === 'pins'
              ? 'border-crt-amber text-crt-amber bg-neutral-800/40'
              : 'border-transparent text-neutral-400 hover:text-white'
          }`}
        >
          <Pin className="w-3.5 h-3.5" />
          EVIDENCE PINS ({notebook.pins.length})
        </button>

        <button
          onClick={() => setActiveTab('timeline')}
          className={`flex items-center gap-1.5 px-3 py-1.5 border-b-2 font-bold transition-all ${
            activeTab === 'timeline'
              ? 'border-crt-amber text-crt-amber bg-neutral-800/40'
              : 'border-transparent text-neutral-400 hover:text-white'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          TIMELINE BOARD
        </button>

        <button
          onClick={() => setActiveTab('characters')}
          className={`flex items-center gap-1.5 px-3 py-1.5 border-b-2 font-bold transition-all ${
            activeTab === 'characters'
              ? 'border-crt-amber text-crt-amber bg-neutral-800/40'
              : 'border-transparent text-neutral-400 hover:text-white'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          PERSONS OF INTEREST
        </button>

        <button
          onClick={() => setActiveTab('notes')}
          className={`flex items-center gap-1.5 px-3 py-1.5 border-b-2 font-bold transition-all ${
            activeTab === 'notes'
              ? 'border-crt-amber text-crt-amber bg-neutral-800/40'
              : 'border-transparent text-neutral-400 hover:text-white'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          SCRATCHPAD
        </button>
      </div>

      {/* TAB CONTENT: PINS */}
      {activeTab === 'pins' && (
        <div className="flex-1 p-3 overflow-y-auto space-y-2.5">
          {notebook.pins.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-neutral-500">
              <Pin className="w-8 h-8 text-neutral-700 mb-2" />
              <div className="text-xs font-mono font-bold text-neutral-400">NO EVIDENCE PINNED YET</div>
              <div className="text-[11px] text-neutral-600 max-w-xs mt-1">
                While calls are active, click the pin icon next to any transcript line or highlight text to collect clues and unlock dialogue challenges.
              </div>
            </div>
          ) : (
            notebook.pins.map((pin) => (
              <div
                key={pin.id}
                className="p-3 bg-neutral-900/90 rounded border border-neutral-800 hover:border-amber-900/60 transition group shadow-sm"
              >
                <div className="flex items-center justify-between text-[10px] text-neutral-500 mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-crt-amber glow-amber">[{pin.sourceSpeaker}]</span>
                    <span>AT {pin.timestamp}</span>
                  </div>
                  <button
                    onClick={() => removePinnedClue(pin.id)}
                    title="Remove pin"
                    className="opacity-0 group-hover:opacity-100 p-0.5 text-neutral-500 hover:text-red-400 transition"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>

                <div className="text-xs text-neutral-200 font-mono italic whitespace-pre-wrap select-text">
                  "{pin.text}"
                </div>

                {/* Organization Controls (Assign to Person or Timeline) */}
                <div className="mt-2 pt-2 border-t border-neutral-800/70 flex flex-wrap items-center gap-2 text-[10px]">
                  <span className="text-neutral-500">ASSIGN TO:</span>

                  <select
                    value={pin.characterId || ''}
                    onChange={(e) => assignPinToCharacter(pin.id, e.target.value)}
                    className="bg-neutral-800 text-neutral-300 rounded px-1.5 py-0.5 border border-neutral-700 text-[10px] font-mono outline-none"
                  >
                    <option value="">(No Subject)</option>
                    {Object.values(characters).map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.code}: {c.knownName}
                      </option>
                    ))}
                  </select>

                  <select
                    value={pin.timelineSlot || ''}
                    onChange={(e) => assignPinToTimeline(pin.id, e.target.value)}
                    className="bg-neutral-800 text-neutral-300 rounded px-1.5 py-0.5 border border-neutral-700 text-[10px] font-mono outline-none"
                  >
                    <option value="">(No Timeline)</option>
                    {TIMELINE_SLOTS.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB CONTENT: TIMELINE */}
      {activeTab === 'timeline' && (
        <div className="flex-1 p-3 overflow-y-auto space-y-3 font-mono">
          <div className="text-[11px] text-neutral-400 mb-2">
            CROSS-REFERENCE CALL STATEMENTS ACROSS THE FIRST HOUR (22:00 - 23:00):
          </div>

          {TIMELINE_SLOTS.map((slot) => {
            const slotPins = notebook.pins.filter((p) => p.timelineSlot === slot);

            return (
              <div key={slot} className="bg-neutral-900/60 rounded border border-neutral-800 p-2.5">
                <div className="flex items-center justify-between text-xs font-bold text-crt-amber border-b border-neutral-800 pb-1 mb-2">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>TIME BLOCK: {slot}</span>
                  </div>
                  <span className="text-[10px] text-neutral-500">{slotPins.length} pinned item(s)</span>
                </div>

                {slotPins.length === 0 ? (
                  <div className="text-[11px] text-neutral-600 italic py-1">
                    No pinned statements mapped to this time block.
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    {slotPins.map((p) => (
                      <div key={p.id} className="text-xs bg-black/40 p-2 rounded border border-neutral-800/80">
                        <div className="text-[10px] text-crt-amber font-bold">{p.sourceSpeaker} ({p.timestamp}):</div>
                        <div className="text-neutral-300 italic">"{p.text}"</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* TAB CONTENT: CHARACTERS */}
      {activeTab === 'characters' && (
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Character List */}
          <div className="w-full md:w-48 border-r border-neutral-800 p-2 space-y-1 overflow-y-auto font-mono text-xs">
            {Object.values(characters).map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCharacter(c.id)}
                className={`w-full text-left p-2 rounded transition ${
                  selectedCharacter === c.id
                    ? 'bg-neutral-800 text-crt-amber font-bold border border-amber-900/50'
                    : 'text-neutral-400 hover:bg-neutral-900 hover:text-white'
                }`}
              >
                <div className="font-bold">{c.code}</div>
                <div className="text-[10px] text-neutral-400 truncate">{c.knownName}</div>
              </button>
            ))}
          </div>

          {/* Selected Character Dossier */}
          {characters[selectedCharacter] && (
            <div className="flex-1 p-4 overflow-y-auto font-mono space-y-3">
              {(() => {
                const char = characters[selectedCharacter];
                const charPins = notebook.pins.filter((p) => p.characterId === char.id);

                return (
                  <>
                    <div className="border-b border-neutral-800 pb-2">
                      <div className="text-base font-bold text-crt-amber glow-amber">
                        {char.code} // {char.knownName}
                      </div>
                      <div className="text-xs text-neutral-400 mt-0.5">
                        ROLE: {char.role}
                      </div>
                      <div className="text-xs text-neutral-400">
                        LOCATION: {char.claimedLocation}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs font-bold text-neutral-300 mb-1">DOSSIER NOTES:</div>
                      <textarea
                        value={char.notes}
                        onChange={(e) => updateCharacterNotes(char.id, e.target.value)}
                        placeholder="Write observations about this subject's motives or contradictions..."
                        className="w-full h-24 bg-black/50 border border-neutral-800 rounded p-2 text-xs text-neutral-200 resize-none font-mono focus:border-crt-amber outline-none"
                      />
                    </div>

                    <div>
                      <div className="text-xs font-bold text-neutral-300 mb-1">
                        PINNED EVIDENCE RELATED TO THIS SUBJECT ({charPins.length}):
                      </div>
                      {charPins.length === 0 ? (
                        <div className="text-xs text-neutral-600 italic">
                          No evidence pinned to this profile yet.
                        </div>
                      ) : (
                        <div className="space-y-1.5">
                          {charPins.map((p) => (
                            <div key={p.id} className="p-2 bg-neutral-900 rounded border border-neutral-800 text-xs text-neutral-300">
                              <span className="text-neutral-500 font-bold">[{p.timestamp}]</span> "{p.text}"
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </>
                );
              })()}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: SCRATCHPAD */}
      {activeTab === 'notes' && (
        <div className="flex-1 p-3 flex flex-col font-mono">
          <div className="text-[11px] text-neutral-400 mb-1">OPERATOR FREE-FORM SHIFT LOG:</div>
          <textarea
            value={notebook.freeNotes}
            onChange={(e) => updateFreeNotes(e.target.value)}
            placeholder="Type confidential operator notes, suspect vehicle details, timestamp cross-checks..."
            className="flex-1 bg-black/60 border border-neutral-800 rounded p-3 text-xs text-crt-amber resize-none font-mono focus:border-crt-amber outline-none leading-relaxed"
          />
        </div>
      )}
    </div>
  );
};
