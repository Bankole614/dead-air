import React, { useState } from 'react';
import { useGameStore } from '../state/store';
import { Shield, HeartPulse, UserCheck, Send, MapPin, Clock } from './icons';

export const DispatchPanel: React.FC = () => {
  const {
    activeUnits,
    inGameTimeSeconds,
    dispatchUnit,
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
    <div className="bg-crt-panel border-t border-crt-panel-border p-3 font-mono">
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        {/* Units Grid */}
        <div className="flex-1 w-full grid grid-cols-2 sm:grid-cols-4 gap-2">
          {Object.values(activeUnits).map((unit) => {
            const isAvailable = unit.status === 'available';
            const remainingSec = unit.busyUntil ? Math.max(0, Math.floor(unit.busyUntil - inGameTimeSeconds)) : 0;
            const remainingMin = Math.ceil(remainingSec / 60);

            return (
              <div
                key={unit.id}
                className={`p-2 rounded border text-xs flex flex-col justify-between ${
                  isAvailable
                    ? 'border-neutral-800 bg-neutral-900/60'
                    : 'border-amber-900/40 bg-amber-950/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-neutral-200">
                    {getUnitIcon(unit.type)}
                    <span>{unit.name}</span>
                  </div>
                </div>

                <div className="mt-2 text-[10px]">
                  {isAvailable ? (
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      ON PATROL / READY
                    </span>
                  ) : (
                    <div>
                      <div className="text-crt-amber font-bold flex items-center gap-1 truncate">
                        <MapPin className="w-2.5 h-2.5" />
                        {unit.assignedLocation}
                      </div>
                      <div className="text-neutral-500 flex items-center gap-1 mt-0.5">
                        <Clock className="w-2.5 h-2.5" />
                        BUSY: ~{remainingMin}m remaining
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Manual Address Dispatch Form */}
        <form onSubmit={handleManualDispatch} className="flex items-center gap-2 w-full lg:w-auto">
          <select
            value={selectedUnitId}
            onChange={(e) => setSelectedUnitId(e.target.value)}
            className="bg-neutral-900 border border-neutral-700 text-neutral-300 rounded px-2.5 py-1.5 text-xs font-mono outline-none"
          >
            {Object.values(activeUnits).map((u) => (
              <option key={u.id} value={u.id} disabled={u.status !== 'available'}>
                {u.name} {u.status !== 'available' ? '(BUSY)' : ''}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Address (e.g. 114 Elm St)"
            value={targetAddress}
            onChange={(e) => setTargetAddress(e.target.value)}
            className="bg-neutral-900 border border-neutral-700 text-neutral-200 placeholder-neutral-600 rounded px-2.5 py-1.5 text-xs font-mono outline-none w-44 focus:border-crt-amber"
          />

          <button
            type="submit"
            disabled={!targetAddress.trim() || activeUnits[selectedUnitId]?.status !== 'available'}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:bg-neutral-800 disabled:text-neutral-600 text-white font-bold rounded text-xs flex items-center gap-1.5 transition whitespace-nowrap"
          >
            <Send className="w-3 h-3" />
            DISPATCH
          </button>
        </form>
      </div>
    </div>
  );
};
