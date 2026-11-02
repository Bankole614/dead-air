import React, { useState } from 'react';
import { useGameStore } from '../state/store';
import { Shield, HeartPulse, UserCheck, Send, MapPin, Clock, Radio, Pin } from './icons';

export const DispatchPanel: React.FC = () => {
  const {
    activeUnits,
    inGameTimeSeconds,
    dispatchUnit,
    radioFeed,
    addPinnedClue,
  } = useGameStore();

  const [selectedUnitId, setSelectedUnitId] = useState<string>('P1');
  const [targetAddress, setTargetAddress] = useState<string>('');

  const handleManualDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetAddress.trim()) return;
    dispatchUnit(selectedUnitId, targetAddress.trim(), 1200); // 20 in-game minutes cooldown
    setTargetAddress('');
  };

  const getUnitIcon = (type: string) => {
    switch (type) {
      case 'police': return <Shield className="w-3.5 h-3.5 text-blue-400" />;
      case 'medical': return <HeartPulse className="w-3.5 h-3.5 text-emerald-400" />;
      case 'welfare': return <UserCheck className="w-3.5 h-3.5 text-amber-400" />;
      default: return <Shield className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="flex-1 h-full min-h-0 flex flex-col bg-crt-panel border-l border-neutral-800 font-mono text-neutral-300 overflow-hidden select-none">
      {/* Header Bar */}
      <div className="px-3 py-2 bg-neutral-900/80 border-b border-neutral-800 flex items-center justify-between text-xs shrink-0">
        <div className="flex items-center gap-2">
          <Shield className="w-3.5 h-3.5 text-crt-amber" />
          <span className="font-bold text-crt-amber tracking-wider glow-amber text-[11px]">
            TACTICAL FLEET & DISPATCH CAD
          </span>
        </div>
        <div className="text-[10px] text-neutral-500">
          DISPATCH PROTOCOL 94.2
        </div>
      </div>

      {/* Top Section: Active Units Fleet Status */}
      <div className="p-3 border-b border-neutral-800 shrink-0">
        <div className="text-[10px] text-neutral-500 font-bold mb-1.5 flex items-center justify-between">
          <span>ASSIGNED PATROL UNITS:</span>
          <span>{Object.values(activeUnits).filter(u => u.status === 'available').length} READY</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {Object.values(activeUnits).map((unit) => {
            const isAvailable = unit.status === 'available';
            const remainingSec = unit.busyUntil ? Math.max(0, Math.floor(unit.busyUntil - inGameTimeSeconds)) : 0;
            const remainingMin = Math.ceil(remainingSec / 60);

            return (
              <div
                key={unit.id}
                className={`p-2 rounded border text-xs flex flex-col justify-between transition ${
                  isAvailable
                    ? 'border-neutral-800 bg-neutral-900/70 hover:border-neutral-700'
                    : 'border-amber-900/50 bg-amber-950/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-neutral-200 truncate">
                    {getUnitIcon(unit.type)}
                    <span className="truncate">{unit.name}</span>
                  </div>
                </div>

                <div className="mt-1.5 text-[10px]">
                  {isAvailable ? (
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      ON PATROL
                    </span>
                  ) : (
                    <div className="truncate">
                      <div className="text-crt-amber font-bold flex items-center gap-1 truncate">
                        <MapPin className="w-2.5 h-2.5 shrink-0" />
                        <span className="truncate">{unit.assignedLocation}</span>
                      </div>
                      <div className="text-neutral-500 flex items-center gap-1 mt-0.5">
                        <Clock className="w-2.5 h-2.5 shrink-0" />
                        <span>~{remainingMin}m busy</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Manual Address Dispatch Form */}
        <form onSubmit={handleManualDispatch} className="mt-3 flex items-center gap-1.5">
          <select
            value={selectedUnitId}
            onChange={(e) => setSelectedUnitId(e.target.value)}
            className="bg-neutral-900 border border-neutral-700 text-neutral-200 rounded px-2 py-1.5 text-[11px] font-mono outline-none focus:border-crt-amber shrink-0"
          >
            {Object.values(activeUnits).map((u) => (
              <option key={u.id} value={u.id} disabled={u.status !== 'available'}>
                {u.name} {u.status !== 'available' ? '(BUSY)' : ''}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Incident address / location..."
            value={targetAddress}
            onChange={(e) => setTargetAddress(e.target.value)}
            className="flex-1 min-w-0 bg-neutral-900 border border-neutral-700 text-neutral-200 placeholder-neutral-600 rounded px-2.5 py-1.5 text-[11px] font-mono outline-none focus:border-crt-amber"
          />

          <button
            type="submit"
            disabled={!targetAddress.trim() || activeUnits[selectedUnitId]?.status !== 'available'}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:bg-neutral-800 disabled:text-neutral-600 text-white font-bold rounded text-[11px] flex items-center gap-1 transition shrink-0"
          >
            <Send className="w-3 h-3" />
            <span>DISPATCH</span>
          </button>
        </form>
      </div>

      {/* Bottom Section: Live Police Radio SITREP Feed */}
      <div className="flex-1 min-h-0 flex flex-col p-3 overflow-hidden bg-neutral-950/70">
        <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-neutral-800 text-[10px] text-neutral-400 font-bold shrink-0">
          <span className="flex items-center gap-1.5">
            <Radio className="w-3 h-3 text-crt-amber animate-pulse" />
            LIVE PATROL RADIO SITREPS ({radioFeed.length})
          </span>
          <span className="text-neutral-600 font-mono">154.80 MHz</span>
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {radioFeed.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-neutral-600 p-4">
              <Radio className="w-6 h-6 mb-1 opacity-30 animate-pulse" />
              <div className="text-[11px] font-mono">NO ACTIVE RADIO SITREPS</div>
              <div className="text-[10px] text-neutral-700 mt-1 max-w-xs">
                Transmissions from deployed patrol units, roadblocks, and tactical events will display here in real time.
              </div>
            </div>
          ) : (
            radioFeed.slice().reverse().map((trans) => (
              <div
                key={trans.id}
                className="p-2.5 bg-neutral-900/90 rounded border border-neutral-800 hover:border-amber-900/60 transition group text-xs"
              >
                <div className="flex items-center justify-between text-[10px] text-neutral-500 mb-1">
                  <div className="flex items-center gap-1.5 font-bold">
                    <span className="text-crt-amber glow-amber">[{trans.unitName}]</span>
                    <span>AT {trans.timestamp}</span>
                  </div>
                  <button
                    onClick={() => addPinnedClue(trans.text, trans.unitName, 'radio', trans.timestamp)}
                    className="opacity-0 group-hover:opacity-100 transition p-1 hover:bg-neutral-800 rounded text-neutral-400 hover:text-crt-amber flex items-center gap-1"
                    title="Pin radio transmission to Notebook Dossier"
                  >
                    <Pin className="w-3 h-3" />
                    <span className="text-[9px]">PIN</span>
                  </button>
                </div>
                <p className="text-[11px] text-neutral-200 leading-relaxed font-mono">
                  {trans.text}
                </p>
                {trans.location && (
                  <div className="text-[9px] text-neutral-500 flex items-center gap-1 mt-1">
                    <MapPin className="w-2.5 h-2.5" />
                    <span>LOC: {trans.location}</span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
