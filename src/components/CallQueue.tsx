import React, { useState } from 'react';
import { useGameStore } from '../state/store';
import { PhoneCall, PhoneForwarded, AlertTriangle, Radio } from './icons';

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

  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  const currentCase = getActiveCase();
  const activeCall = activeCallId ? calls[activeCallId] : null;
  const activeCallDef = activeCallId ? currentCase.calls[activeCallId] : null;

  // Calls currently placed on hold
  const onHoldCallIds = Object.keys(calls).filter(
    (id) => calls[id].status === 'on_hold'
  );

  return (
    <div className="bg-crt-panel border-b border-crt-panel-border p-2.5 sm:p-3 select-none">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[11px] font-bold text-neutral-400 tracking-wider flex items-center gap-1.5">
          <Radio className="w-3.5 h-3.5 text-crt-amber" />
          TELEPHONY TRUNK / LINES MONITOR
        </span>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-neutral-500 font-mono hidden sm:inline">
            CHANNELS: 3 | CARRIER: SECURE INTERNAL
          </span>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-[10px] text-neutral-400 hover:text-white px-2 py-0.5 rounded bg-neutral-800 transition"
          >
            {isCollapsed ? '▲ EXPAND TRUNKS' : '▼ COMPACT'}
          </button>
        </div>
      </div>

      {isCollapsed ? (
        <div className="flex items-center justify-between text-xs font-mono py-1 px-2.5 bg-neutral-900/80 rounded border border-neutral-800 text-neutral-300">
          <div className="flex items-center gap-4 flex-wrap text-[11px]">
            <span className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${activeCallId ? 'bg-emerald-400 animate-pulse' : 'bg-neutral-600'}`} />
              <span className="font-bold text-neutral-400">L1:</span> {activeCallDef ? activeCallDef.callerNameDisplay : 'STANDBY'}
            </span>
            <span className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${callQueue.length > 0 ? 'bg-red-500 animate-ping' : 'bg-neutral-600'}`} />
              <span className="font-bold text-neutral-400">L2:</span> {callQueue.length > 0 ? `${callQueue.length} RINGING` : 'IDLE'}
            </span>
            <span className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${onHoldCallIds.length > 0 ? 'bg-amber-400 animate-pulse' : 'bg-neutral-600'}`} />
              <span className="font-bold text-neutral-400">L3:</span> {onHoldCallIds.length > 0 ? `${onHoldCallIds.length} ON HOLD` : 'IDLE'}
            </span>
          </div>

          {callQueue.length > 0 && !activeCallId && (
            <button
              onClick={() => answerCall(callQueue[0])}
              className="px-2.5 py-1 bg-red-600 hover:bg-red-500 text-white font-bold rounded text-[11px] animate-pulse transition"
            >
              PICK UP [SPACE]
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        {/* LINE 1 / ACTIVE LINE */}
        <div className={`p-2.5 rounded border transition-all ${
          activeCallId 
            ? 'border-emerald-900 bg-emerald-950/20 shadow-sm shadow-emerald-950'
            : 'border-neutral-800 bg-neutral-900/50'
        }`}>
          <div className="flex items-center justify-between text-[11px] mb-1">
            <span className="font-bold text-neutral-400">LINE 01 // OPERATOR</span>
            {activeCallId ? (
              <span className="text-emerald-400 font-bold flex items-center gap-1 animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                ACTIVE
              </span>
            ) : (
              <span className="text-neutral-500">STANDBY</span>
            )}
          </div>

          {activeCall && activeCallDef ? (
            <div>
              <div className="font-mono font-bold text-neutral-200 text-xs truncate">
                {activeCallDef.callerNameDisplay}
              </div>
              <div className="text-[10px] text-neutral-400 font-mono flex items-center justify-between mt-1">
                <span>PRIORITY: <span className="uppercase text-crt-amber">{activeCallDef.priority}</span></span>
                <button
                  onClick={() => {
                    if (activeCallId) holdCall(activeCallId);
                  }}
                  className="px-2 py-0.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded text-[10px] flex items-center gap-1 transition"
                >
                  <PhoneForwarded className="w-2.5 h-2.5" />
                  HOLD
                </button>
              </div>
            </div>
          ) : (
            <div className="text-[11px] text-neutral-500 italic py-1">
              No live connection. Awaiting transmission...
            </div>
          )}
        </div>

        {/* LINE 02 // INCOMING RINGING CALLS */}
        <div className={`p-2.5 rounded border transition-all ${
          callQueue.length > 0
            ? 'border-red-900/80 bg-red-950/20 animate-pulse shadow-sm shadow-red-950'
            : 'border-neutral-800 bg-neutral-900/50'
        }`}>
          <div className="flex items-center justify-between text-[11px] mb-1">
            <span className="font-bold text-neutral-400">LINE 02 // INCOMING</span>
            {callQueue.length > 0 ? (
              <span className="text-red-400 font-bold flex items-center gap-1">
                <PhoneCall className="w-3 h-3 animate-bounce" />
                RINGING ({callQueue.length})
              </span>
            ) : (
              <span className="text-neutral-500">IDLE</span>
            )}
          </div>

          {callQueue.length > 0 ? (
            <div>
              {callQueue.slice(0, 1).map((queuedId) => {
                const callDef = currentCase.calls[queuedId];
                if (!callDef) return null;
                return (
                  <div key={queuedId}>
                    <div className="font-mono font-bold text-red-200 text-xs truncate">
                      {callDef.callerNameDisplay}
                    </div>
                    <div className="flex items-center justify-between mt-1.5">
                      <span className="text-[10px] text-red-400 font-mono">
                        PRIORITY: {callDef.priority.toUpperCase()}
                      </span>
                      <button
                        onClick={() => answerCall(queuedId)}
                        className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white font-bold rounded text-[11px] shadow flex items-center gap-1.5 transition active:scale-95"
                      >
                        <PhoneCall className="w-3 h-3" />
                        ANSWER
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-[11px] text-neutral-500 italic py-1">
              Circuit quiet. Ready for queue dispatch.
            </div>
          )}
        </div>

        {/* LINE 03 // ON HOLD WITH AGITATION MONITOR */}
        <div className={`p-2.5 rounded border transition-all ${
          onHoldCallIds.length > 0
            ? 'border-amber-900/80 bg-amber-950/20'
            : 'border-neutral-800 bg-neutral-900/50'
        }`}>
          <div className="flex items-center justify-between text-[11px] mb-1">
            <span className="font-bold text-neutral-400">LINE 03 // ON HOLD</span>
            {onHoldCallIds.length > 0 ? (
              <span className="text-amber-400 font-bold flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                HELD ({onHoldCallIds.length})
              </span>
            ) : (
              <span className="text-neutral-500">EMPTY</span>
            )}
          </div>

          {onHoldCallIds.length > 0 ? (
            <div>
              {onHoldCallIds.slice(0, 1).map((heldId) => {
                const call = calls[heldId];
                const callDef = currentCase.calls[heldId];
                const agitation = Math.round(call.agitationLevel);
                return (
                  <div key={heldId}>
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-amber-200 text-xs truncate">
                        {callDef?.callerNameDisplay || heldId}
                      </span>
                      <button
                        onClick={() => resumeCall(heldId)}
                        className="px-2 py-0.5 bg-amber-600 hover:bg-amber-500 text-black font-bold rounded text-[10px] transition"
                      >
                        RESUME
                      </button>
                    </div>
                    {/* Agitation Progress Bar */}
                    <div className="mt-1.5">
                      <div className="flex items-center justify-between text-[9px] text-neutral-400 mb-0.5">
                        <span>CALLER AGITATION:</span>
                        <span className={agitation > 60 ? 'text-red-400 font-bold' : 'text-amber-400'}>
                          {agitation}%
                        </span>
                      </div>
                      <div className="w-full bg-neutral-800 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${
                            agitation > 75 ? 'bg-red-500 animate-pulse' : agitation > 40 ? 'bg-amber-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${agitation}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-[11px] text-neutral-500 italic py-1">
              No callers currently on hold.
            </div>
          )}
        </div>
      </div>
      )}
    </div>
  );
};
