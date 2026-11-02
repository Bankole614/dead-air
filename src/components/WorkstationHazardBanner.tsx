import React from 'react';
import { useGameStore } from '../state/store';
import { Zap, AlertTriangle } from './icons';

export const WorkstationHazardBanner: React.FC = () => {
  const { hazardState, resetCircuitBreaker } = useGameStore();

  if (!hazardState || !hazardState.active) {
    return null;
  }

  const percentRemaining = Math.max(0, Math.min(100, (hazardState.timeRemaining / hazardState.maxTime) * 100));

  return (
    <div className="w-full bg-red-950/90 border-y-2 border-red-600 px-4 py-2 text-red-200 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-[0_0_20px_rgba(220,38,38,0.5)] animate-pulse z-40 relative select-none">
      {/* Left info */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded bg-red-900 border border-red-550 flex items-center justify-center shrink-0 text-red-300">
          <Zap className="w-5 h-5 text-red-400 animate-bounce" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-xs tracking-wider text-red-100 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-yellow-400" />
              {hazardState.title}
            </span>
            <span className="bg-red-800 text-red-100 text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
              {Math.ceil(hazardState.timeRemaining)}S REMAINING
            </span>
          </div>
          <div className="text-[11px] text-red-300/90 font-mono mt-0.5">
            {hazardState.description}
          </div>
        </div>
      </div>

      {/* Progress countdown & Action Button */}
      <div className="flex items-center gap-3 w-full sm:w-auto">
        <div className="hidden md:flex flex-col w-32">
          <div className="text-[9px] font-mono text-red-300 text-right mb-0.5">BUS OVERLOAD COUNTDOWN</div>
          <div className="w-full bg-black/60 h-2 rounded border border-red-800/80 overflow-hidden">
            <div
              className="bg-gradient-to-r from-yellow-500 to-red-500 h-full transition-all duration-200"
              style={{ width: `${percentRemaining}%` }}
            />
          </div>
        </div>

        <button
          onClick={resetCircuitBreaker}
          className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-red-650 via-amber-700 to-red-650 hover:from-amber-600 hover:to-red-600 active:scale-95 text-white font-mono font-bold text-xs rounded border border-red-400 shadow-[0_0_15px_rgba(239,68,68,0.8)] flex items-center justify-center gap-2 transition"
          title="Press R on keyboard to reset breaker"
        >
          <Zap className="w-4 h-4 text-yellow-300 animate-spin" />
          <span>RESET CIRCUIT BREAKER [R]</span>
        </button>
      </div>
    </div>
  );
};

