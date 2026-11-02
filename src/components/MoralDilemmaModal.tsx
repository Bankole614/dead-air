import React from 'react';
import { useGameStore } from '../state/store';
import { AlertTriangle, Shield, CheckCircle2 } from './icons';

export const MoralDilemmaModal: React.FC = () => {
  const { activeDilemma, resolveDilemma } = useGameStore();

  if (!activeDilemma) {
    return null;
  }

  const { title, urgentBrief, timestamp, optionA, optionB, resolvedChoice } = activeDilemma;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 select-none">
      <div className="w-full max-w-3xl bg-neutral-950 border-2 border-crt-amber shadow-[0_0_40px_rgba(245,158,11,0.25)] rounded flex flex-col overflow-hidden font-mono text-neutral-200">
        
        {/* Header Bar */}
        <div className="bg-amber-950/80 border-b border-crt-amber px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-crt-amber animate-pulse" />
            <span className="font-bold text-sm tracking-widest text-crt-amber glow-amber">
              {title}
            </span>
          </div>
          <div className="text-xs bg-amber-900/60 border border-amber-600 px-2 py-0.5 rounded text-amber-200 font-bold">
            TIME: {timestamp} // 1 UNIT AVAILABLE
          </div>
        </div>

        {/* Tactical Brief */}
        <div className="p-4 bg-neutral-900/80 border-b border-neutral-800 text-xs leading-relaxed text-neutral-300">
          <span className="text-crt-amber font-bold">[OPERATOR DIRECTIVE]:</span> {urgentBrief}
        </div>

        {/* Resolved feedback state */}
        {resolvedChoice ? (
          <div className="p-8 flex flex-col items-center justify-center text-center space-y-3 bg-neutral-900">
            <CheckCircle2 className="w-12 h-12 text-crt-green animate-bounce" />
            <div className="text-base font-bold text-crt-green tracking-wider">
              TACTICAL DIRECTIVE TRANSMITTED
            </div>
            <div className="text-xs text-neutral-400 max-w-md">
              Order logged with Sector Dispatch. Cruiser 108 is en route to{' '}
              <span className="text-crt-amber font-bold">
                {resolvedChoice === 'A' ? optionA.sector : optionB.sector}
              </span>
              . SITREP updates are streaming into the radio feed.
            </div>
          </div>
        ) : (
          /* Dual Options Grid */
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 bg-neutral-950">
            {/* OPTION ALPHA */}
            <div className="flex flex-col justify-between p-4 bg-neutral-900/90 border border-amber-900/70 hover:border-amber-600 rounded transition group">
              <div>
                <div className="flex items-center justify-between text-[11px] text-neutral-400 mb-1">
                  <span className="font-bold text-crt-amber">[OPTION ALPHA]</span>
                  <span className="bg-neutral-800 px-1.5 py-0.5 rounded text-[10px]">{optionA.sector}</span>
                </div>
                <h3 className="text-sm font-bold text-white group-hover:text-crt-amber transition mb-2">
                  {optionA.title}
                </h3>
                <p className="text-xs text-neutral-300 leading-relaxed mb-3">
                  {optionA.description}
                </p>

                <div className="p-2.5 bg-black/60 border border-neutral-800 rounded text-[11px] space-y-1 mb-4">
                  <div className="text-neutral-400">
                    <span className="text-crt-green font-bold">EXPECTED GAIN:</span> Rescue watchman & secure arson accelerant canister.
                  </div>
                  <div className="text-neutral-400">
                    <span className="text-red-400 font-bold">RISK / COST:</span> Suspect vehicle evades Route 9 roadblock.
                  </div>
                </div>
              </div>

              <button
                onClick={() => resolveDilemma('A')}
                className="w-full py-2.5 bg-neutral-800 hover:bg-crt-amber hover:text-black active:scale-95 text-neutral-100 font-bold text-xs rounded border border-amber-800/80 transition flex items-center justify-center gap-2 shadow-sm"
              >
                <Shield className="w-4 h-4" />
                DISPATCH 108 TO SAWMILL
              </button>
            </div>

            {/* OPTION BRAVO */}
            <div className="flex flex-col justify-between p-4 bg-neutral-900/90 border border-amber-900/70 hover:border-amber-600 rounded transition group">
              <div>
                <div className="flex items-center justify-between text-[11px] text-neutral-400 mb-1">
                  <span className="font-bold text-crt-amber">[OPTION BRAVO]</span>
                  <span className="bg-neutral-800 px-1.5 py-0.5 rounded text-[10px]">{optionB.sector}</span>
                </div>
                <h3 className="text-sm font-bold text-white group-hover:text-crt-amber transition mb-2">
                  {optionB.title}
                </h3>
                <p className="text-xs text-neutral-300 leading-relaxed mb-3">
                  {optionB.description}
                </p>

                <div className="p-2.5 bg-black/60 border border-neutral-800 rounded text-[11px] space-y-1 mb-4">
                  <div className="text-neutral-400">
                    <span className="text-crt-green font-bold">EXPECTED GAIN:</span> Box suspect vehicle; seize stolen sluice blueprints.
                  </div>
                  <div className="text-neutral-400">
                    <span className="text-red-400 font-bold">RISK / COST:</span> Mill Creek office structure fully collapses.
                  </div>
                </div>
              </div>

              <button
                onClick={() => resolveDilemma('B')}
                className="w-full py-2.5 bg-neutral-800 hover:bg-crt-amber hover:text-black active:scale-95 text-neutral-100 font-bold text-xs rounded border border-amber-800/80 transition flex items-center justify-center gap-2 shadow-sm"
              >
                <Shield className="w-4 h-4" />
                DISPATCH 108 TO ROUTE 9
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="px-4 py-2 bg-neutral-950 border-t border-neutral-800 flex items-center justify-between text-[10px] text-neutral-500">
          <span>OPERATOR NOTE: Units deployed cannot be recalled until incident completes.</span>
          <span>DISPATCH PROTOCOL 94.2</span>
        </div>
      </div>
    </div>
  );
};

