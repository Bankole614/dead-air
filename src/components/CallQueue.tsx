import React from 'react';
import { useGameStore } from '../state/store';
import { PhoneCall, PhoneForwarded, CheckCircle2 } from './icons';

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
  const activeCall = activeCallId ? calls[activeCallId] : null;
  const activeCallDef = activeCallId ? currentCase.calls[activeCallId] : null;
  const incomingCallId = callQueue[0] || null;
  const incomingCallDef = incomingCallId ? currentCase.calls[incomingCallId] : null;

  // All calls currently placed on hold
  const onHoldCallIds = Object.keys(calls).filter(
    (id) => calls[id].status === 'on_hold'
  );

  // Completed calls that the player can click to review transcript or pin/unpin sounds
  const completedCallIds = Object.keys(calls).filter(
    (id) => calls[id].status === 'completed' && id !== activeCallId
  );

  return (
    <div className="bg-crt-panel border-b border-crt-panel-border px-3 sm:px-4 py-2 select-none">
      <div className="flex flex-wrap items-center justify-between gap-2.5 text-xs font-mono">
        {/* Left: Active Line, Held Calls & Past Calls Switcher */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* LINE 1: ACTIVE */}
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${activeCallId ? 'bg-emerald-400 animate-pulse' : 'bg-neutral-600'}`} />
            <span className="text-neutral-500 font-bold text-[11px]">ACTIVE:</span>
            {activeCallDef ? (
              <span className="text-neutral-200 font-bold text-[11px] sm:text-xs">
                {activeCallDef.callerNameDisplay}
                {activeCall?.status === 'completed' && (
                  <span className="ml-1.5 text-[10px] text-emerald-400 font-normal">(ENDED)</span>
                )}
              </span>
            ) : (
              <span className="text-neutral-500 text-[11px]">IDLE</span>
            )}
            {activeCallId && activeCall?.status === 'active' && (
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

          {/* ON HOLD CALLS (Click any held call to switch back to it immediately!) */}
          {onHoldCallIds.map((heldId) => {
            const heldCall = calls[heldId];
            const heldDef = currentCase.calls[heldId];
            return (
              <div
                key={heldId}
                className="flex items-center gap-2 pl-2.5 border-l border-neutral-800"
              >
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span className="text-amber-400 font-bold text-[11px]">
                  HOLD ({Math.round(heldCall.agitationLevel)}%):
                </span>
                <span className="text-amber-200 text-[11px] truncate max-w-[150px]">
                  {heldDef?.callerNameDisplay || heldId}
                </span>
                <button
                  onClick={() => resumeCall(heldId)}
                  className="px-2 py-0.5 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded text-[10px] transition shadow-sm"
                  title="Switch back to this held call (places your current call on hold)"
                >
                  SWITCH BACK
                </button>
              </div>
            );
          })}

          {/* COMPLETED CALLS ARCHIVE PILLS (Click to revisit any past call transcript!) */}
          {completedCallIds.length > 0 && (
            <div className="flex items-center gap-1.5 pl-2.5 border-l border-neutral-800 flex-wrap">
              <span className="text-[10px] text-neutral-500 font-bold">PAST LOGS:</span>
              {completedCallIds.map((compId) => {
                const compDef = currentCase.calls[compId];
                const shortName = compDef?.callerNameDisplay.split('//')[0]?.trim() || compId;
                return (
                  <button
                    key={compId}
                    onClick={() => resumeCall(compId)}
                    className="px-2 py-0.5 rounded bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-crt-amber text-neutral-400 hover:text-crt-amber text-[10px] flex items-center gap-1 transition"
                    title="Re-open this completed call log to review transcript or pin/unpin sounds"
                  >
                    <CheckCircle2 className="w-2.5 h-2.5 text-emerald-500" />
                    <span>{shortName}</span>
                  </button>
                );
              })}
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
              title={activeCallId ? 'Places your current call on hold and answers this incoming call' : 'Answer incoming call'}
            >
              {activeCallId && activeCall?.status === 'active' ? 'HOLD & ANSWER' : 'ANSWER [SPACE]'}
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
