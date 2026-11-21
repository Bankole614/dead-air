import React from 'react';
import { useGameStore } from '../state/store';
import { PhoneCall, PhoneForwarded } from './icons';

export const CallQueue: React.FC = () => {
  const {
    callQueue,
    calls,
    activeCallId,
    answerCall,
    holdCall,
    resumeCall,
    getActiveCase,
  } = useGameStore();

  const currentCase = getActiveCase();
  const activeCallDef = activeCallId ? currentCase.calls[activeCallId] : null;
  const incomingCallId = callQueue[0] || null;
  const incomingCallDef = incomingCallId ? currentCase.calls[incomingCallId] : null;

  const onHoldCallIds = Object.keys(calls).filter(
    (id) => calls[id].status === 'on_hold'
  );
  const heldCallId = onHoldCallIds[0] || null;
  const heldCall = heldCallId ? calls[heldCallId] : null;
  const heldCallDef = heldCallId ? currentCase.calls[heldCallId] : null;

  return (
    <div className="bg-crt-panel border-b border-crt-panel-border px-4 py-2 select-none">
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        {/* Left: Active & Held Status Pills */}
        <div className="flex items-center gap-4 flex-wrap">
          {/* LINE 1: ACTIVE */}
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${activeCallId ? 'bg-emerald-400 animate-pulse' : 'bg-neutral-600'}`} />
            <span className="text-neutral-500 font-bold text-[11px]">LINE 1:</span>
            {activeCallDef ? (
              <span className="text-neutral-200 font-bold">{activeCallDef.callerNameDisplay}</span>
            ) : (
              <span className="text-neutral-500">IDLE</span>
            )}
            {activeCallId && (
              <button
                onClick={() => holdCall(activeCallId)}
                className="ml-1 px-2 py-0.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded text-[10px] flex items-center gap-1 transition"
                title="Place active caller on hold"
              >
                <PhoneForwarded className="w-2.5 h-2.5" />
                <span>HOLD</span>
              </button>
            )}
          </div>

          {/* LINE 3: ON HOLD (Only shown if a call is actually on hold) */}
          {heldCallId && heldCall && (
            <div className="flex items-center gap-2 pl-3 border-l border-neutral-800">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-amber-400 font-bold text-[11px]">
                ON HOLD ({Math.round(heldCall.agitationLevel)}%):
              </span>
              <span className="text-amber-200 text-[11px]">{heldCallDef?.callerNameDisplay || heldCallId}</span>
              <button
                onClick={() => resumeCall(heldCallId)}
                className="px-2 py-0.5 bg-amber-600 hover:bg-amber-500 text-black font-bold rounded text-[10px] transition"
              >
                RESUME
              </button>
            </div>
          )}
        </div>

        {/* Right: Incoming Ringing Call Alert */}
        {incomingCallId && incomingCallDef ? (
          <div className="flex items-center gap-2.5 bg-red-950/50 border border-red-800/80 px-3 py-1 rounded animate-pulse">
            <PhoneCall className="w-3.5 h-3.5 text-red-400 animate-bounce" />
            <span className="text-[11px] text-red-200 font-bold">
              RINGING: {incomingCallDef.callerNameDisplay}
            </span>
            <button
              onClick={() => answerCall(incomingCallId)}
              className="px-2.5 py-0.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded text-[11px] shadow transition active:scale-95"
            >
              ANSWER [SPACE]
            </button>
          </div>
        ) : (
          <div className="text-[11px] text-neutral-600 hidden sm:block">
            TRUNK LINES STANDBY
          </div>
        )}
      </div>
    </div>
  );
};
