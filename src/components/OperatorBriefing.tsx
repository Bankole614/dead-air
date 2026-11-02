import React from 'react';
import { Shield, Headphones, Pin, CheckCircle2, FastForward, Radio, X } from './icons';

interface OperatorBriefingProps {
  onClose: () => void;
}

export const OperatorBriefing: React.FC<OperatorBriefingProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 font-mono select-none">
      <div className="max-w-2xl w-full bg-crt-panel border-2 border-crt-amber rounded-lg shadow-2xl p-6 text-neutral-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3 mb-4">
          <div className="flex items-center gap-3">
            <Radio className="w-6 h-6 text-crt-amber glow-amber" />
            <div>
              <h2 className="text-base font-bold text-crt-amber glow-amber tracking-wider">
                OPERATOR 7 // SHIFT BRIEFING & RULES OF ENGAGEMENT
              </h2>
              <div className="text-[11px] text-neutral-400">
                REGIONAL CRISIS & EMERGENCY HELPLINE // 10:00 PM TO 11:00 PM
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-neutral-400 hover:text-white transition rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto space-y-4 text-xs leading-relaxed pr-1">
          {/* Premise */}
          <div className="p-3 bg-neutral-900 rounded border border-neutral-800">
            <div className="font-bold text-crt-amber mb-1">THE SITUATION:</div>
            <p className="text-neutral-300">
              You are covering the night shift at desk 7. You cannot see outside. You cannot leave this room.
              You only have your headset, your telephone lines, and your unit dispatch radio.
              Someone calling tonight is lying to you—and one caller is orchestrating a crime in real time.
            </p>
          </div>

          {/* Core Directives */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 bg-black/40 rounded border border-neutral-800 space-y-1">
              <div className="font-bold text-emerald-400 flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5" />
                1. ANSWER & QUESTION
              </div>
              <p className="text-neutral-400 text-[11px]">
                When <span className="text-red-400 font-bold">LINE 02 RINGS</span>, press <span className="text-white font-bold">[ANSWER]</span> or hit <span className="text-crt-amber font-bold">SPACE</span>. Ask clarifying questions to test caller credibility.
              </p>
            </div>

            <div className="p-3 bg-black/40 rounded border border-neutral-800 space-y-1">
              <div className="font-bold text-crt-amber flex items-center gap-1.5">
                <Headphones className="w-3.5 h-3.5" />
                2. LISTEN TO BACKGROUND CLUES
              </div>
              <p className="text-neutral-400 text-[11px]">
                Background acoustics appear in brackets: <span className="text-crt-amber">[engine ticking]</span>, <span className="text-crt-amber">[cat hiss]</span>, <span className="text-crt-amber">[wind]</span>. Callers can lie, but ambient sounds don't.
              </p>
            </div>

            <div className="p-3 bg-black/40 rounded border border-neutral-800 space-y-1">
              <div className="font-bold text-yellow-400 flex items-center gap-1.5">
                <Pin className="w-3.5 h-3.5" />
                3. PIN CLUES TO CATCH LIES
              </div>
              <p className="text-neutral-400 text-[11px]">
                Click the <span className="text-crt-amber font-bold">📌 PIN</span> icon next to any transcript statement to save it. Pinning conflicting statements unlocks <span className="text-amber-300 font-bold">[CHALLENGE]</span> responses to break callers' stories!
              </p>
            </div>

            <div className="p-3 bg-black/40 rounded border border-neutral-800 space-y-1">
              <div className="font-bold text-blue-400 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5" />
                4. DISPATCH WITH CAUTION
              </div>
              <p className="text-neutral-400 text-[11px]">
                You have limited units: 2 Police, 1 Medic, 1 Welfare. Once dispatched, they are locked on location for 20 minutes. Don't waste them on decoys.
              </p>
            </div>
          </div>

          {/* Fast Forward Tip */}
          <div className="p-3 bg-amber-950/20 border border-amber-900/40 rounded flex items-start gap-2.5">
            <FastForward className="w-4 h-4 text-crt-amber shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-crt-amber">NEVER WAIT IDLY:</span>{' '}
              <span className="text-neutral-300">
                After a call finishes, review your notebook pins or immediately press{' '}
                <span className="text-white font-bold">[⏩ FAST-FORWARD TO NEXT CALL]</span> to jump directly to the next incoming emergency transmission.
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-neutral-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-crt-amber hover:bg-yellow-400 text-black font-bold rounded text-xs flex items-center gap-2 transition active:scale-95 shadow-md"
          >
            <CheckCircle2 className="w-4 h-4" />
            UNDERSTOOD // PROCEED TO OPERATOR CONSOLE
          </button>
        </div>
      </div>
    </div>
  );
};

