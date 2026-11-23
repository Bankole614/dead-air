import React, { useState } from 'react';
import { Shield, Headphones, Pin, CheckCircle2, Radio, X, AlertTriangle } from './icons';

interface OperatorBriefingProps {
  onClose: () => void;
}

export const OperatorBriefing: React.FC<OperatorBriefingProps> = ({ onClose }) => {
  const [tab, setTab] = useState<'loop' | 'psychology' | 'modes'>('loop');

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 font-mono select-none">
      <div className="max-w-3xl w-full bg-crt-panel border-2 border-crt-amber rounded-lg shadow-2xl p-4 sm:p-6 text-neutral-200 flex flex-col max-h-[90dvh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3 mb-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <Radio className="w-5 h-5 text-crt-amber glow-amber shrink-0" />
            <div>
              <h2 className="text-sm sm:text-base font-bold text-crt-amber glow-amber tracking-wider">
                OPERATOR 7 // FIELD MANUAL &amp; RULES OF ENGAGEMENT
              </h2>
              <div className="text-[11px] text-neutral-400">
                1994 COUNTY EMERGENCY SWITCHBOARD OPERATING PROCEDURES
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

        {/* Manual Tabs */}
        <div className="flex items-center gap-1.5 border-b border-neutral-800 pb-2 mb-3 text-xs shrink-0 overflow-x-auto">
          <button
            onClick={() => setTab('loop')}
            className={`px-3 py-1.5 rounded font-bold transition whitespace-nowrap ${
              tab === 'loop'
                ? 'bg-crt-amber text-black'
                : 'bg-neutral-900 text-neutral-400 hover:text-white'
            }`}
          >
            1. HOW TO PLAY (4 STEPS)
          </button>
          <button
            onClick={() => setTab('psychology')}
            className={`px-3 py-1.5 rounded font-bold transition whitespace-nowrap ${
              tab === 'psychology'
                ? 'bg-crt-amber text-black'
                : 'bg-neutral-900 text-neutral-400 hover:text-white'
            }`}
          >
            2. PSYCHOLOGICAL TRAPS
          </button>
          <button
            onClick={() => setTab('modes')}
            className={`px-3 py-1.5 rounded font-bold transition whitespace-nowrap ${
              tab === 'modes'
                ? 'bg-crt-amber text-black'
                : 'bg-neutral-900 text-neutral-400 hover:text-white'
            }`}
          >
            3. GAME MODES &amp; CONTROLS
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto space-y-3 text-xs leading-relaxed pr-1 min-h-0">
          {tab === 'loop' && (
            <>
              <div className="p-3 bg-neutral-900/90 rounded border border-neutral-800">
                <span className="font-bold text-crt-amber">YOUR ROLE:</span> You are the night-shift 911 operator. You cannot see the crime scenes—you must reconstruct the truth from caller testimonies, background acoustics, and radio frequencies, then file <strong>Form 911-B</strong> at the end of the shift.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-black/40 rounded border border-neutral-800 space-y-1">
                  <div className="font-bold text-emerald-400 flex items-center gap-1.5">
                    <Radio className="w-3.5 h-3.5" />
                    STEP 1: ANSWER &amp; QUESTION [F1]
                  </div>
                  <p className="text-neutral-400 text-[11px]">
                    Answer incoming 911 calls on <strong>[F1] Switchboard</strong>. Ask neutral clarifying questions—avoid leading questions that plant ideas in nervous witnesses!
                  </p>
                </div>

                <div className="p-3 bg-black/40 rounded border border-neutral-800 space-y-1">
                  <div className="font-bold text-yellow-400 flex items-center gap-1.5">
                    <Pin className="w-3.5 h-3.5" />
                    STEP 2: PIN CLUES &amp; SOUNDS
                  </div>
                  <p className="text-neutral-400 text-[11px]">
                    Click <strong>[PIN CLUE]</strong> on suspicious statements or click any <strong>SOUNDS HEARD</strong> chip beneath a line. Pinning key evidence unlocks <strong>[CHALLENGE]</strong> confrontations.
                  </p>
                </div>

                <div className="p-3 bg-black/40 rounded border border-neutral-800 space-y-1">
                  <div className="font-bold text-crt-amber flex items-center gap-1.5">
                    <Headphones className="w-3.5 h-3.5" />
                    STEP 3: COMPARE TAPES [F3] &amp; RADIO [F4]
                  </div>
                  <p className="text-neutral-400 text-[11px]">
                    In <strong>[F3] Evidence → A/B Audio Comparator</strong>, load two recordings side-by-side to expose shared TV/radio broadcasts or missing background clocks.
                  </p>
                </div>

                <div className="p-3 bg-black/40 rounded border border-neutral-800 space-y-1">
                  <div className="font-bold text-blue-400 flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5" />
                    STEP 4: DISPATCH [F2] &amp; FILE VERDICT
                  </div>
                  <p className="text-neutral-400 text-[11px]">
                    Send patrol or fire units on <strong>[F2] Map &amp; Dispatch</strong> to get field SITREPs. Once all calls finish, submit your final deduction and confidence level (`50%` / `75%` / `95%`).
                  </p>
                </div>
              </div>
            </>
          )}

          {tab === 'psychology' && (
            <div className="space-y-2.5">
              <div className="p-3 bg-black/40 rounded border border-neutral-800">
                <div className="font-bold text-crt-amber mb-0.5">1. CONFIRMATION BIAS &amp; PHONEMIC MISHEARING</div>
                <p className="text-neutral-400 text-[11px]">
                  Frightened witnesses (and operators primed by a Supervisor Memo) hear what they expect to hear—like mishearing a muffled shout of <em>"Get down! Get down!"</em> as <em>"Get Don out!"</em> Use the <strong>A/B Comparator</strong> and <strong>Challenge Bias</strong> toggle in `[F3]` to test your initial theory.
                </p>
              </div>

              <div className="p-3 bg-black/40 rounded border border-neutral-800">
                <div className="font-bold text-red-400 mb-0.5 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>2. CIRCULAR REPORTING &amp; FALSE CONFIDENCE</span>
                </div>
                <p className="text-neutral-400 text-[11px]">
                  When three witnesses swear they heard "two explosions," check their timestamps against `[F4] Radio Scanner`. Callers with a police scanner or TV in the background often repeat a single unverified broadcast with 100% confidence. Click a clue's badge in `[F3]` to cycle it from <strong>👁️ Firsthand</strong> to <strong>📻 Hearsay Echo</strong>.
                </p>
              </div>

              <div className="p-3 bg-black/40 rounded border border-neutral-800">
                <div className="font-bold text-emerald-400 mb-0.5">3. SELECTIVE LISTENING &amp; CONFIDENCE CALIBRATION</div>
                <p className="text-neutral-400 text-[11px]">
                  Sometimes the biggest clue is a sound that <em>should</em> be there but isn't (like a loud defective grandfather clock that is completely silent during a homeowner's alibi call). When filing Form 911-B, calibrate your certainty (`50% Tentative` vs `95% Certain`)—reckless overconfidence on a wrong theory carries a `-15` penalty!
                </p>
              </div>
            </div>
          )}

          {tab === 'modes' && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div className="p-3 bg-black/40 rounded border border-neutral-800">
                  <div className="font-bold text-emerald-400 mb-1">STORY / GUIDED</div>
                  <p className="text-[11px] text-neutral-400">
                    No power surge timers, no caller hold agitation, and helpful tags on dialogue options.
                  </p>
                </div>
                <div className="p-3 bg-black/40 rounded border border-neutral-800">
                  <div className="font-bold text-crt-amber mb-1">STANDARD DISPATCH</div>
                  <p className="text-[11px] text-neutral-400">
                    Balanced shift pacing, power surge breaker events, and standard clue-gated challenges.
                  </p>
                </div>
                <div className="p-3 bg-black/40 rounded border border-neutral-800">
                  <div className="font-bold text-red-400 mb-1">HARDCORE / BLIND</div>
                  <p className="text-[11px] text-neutral-400">
                    Hides `[LEADING]` and `[CHALLENGE]` tags on dialogue choices and hides locked options until you pin the proof.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-neutral-900/80 rounded border border-neutral-800 space-y-1.5">
                <div className="font-bold text-neutral-200">KEYBOARD SHORTCUTS:</div>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-neutral-400">
                  <div><strong className="text-crt-amber">[F1] or [1]:</strong> Switchboard &amp; Live Call</div>
                  <div><strong className="text-crt-amber">[F2] or [2]:</strong> Vector Map &amp; Unit Dispatch</div>
                  <div><strong className="text-crt-amber">[F3] or [3]:</strong> Evidence &amp; A/B Audio Lab</div>
                  <div><strong className="text-crt-amber">[F4] or [4]:</strong> Rotary Radio Scanner</div>
                  <div><strong className="text-crt-amber">[SPACE]:</strong> Answer Call / Skip Typewriter</div>
                  <div><strong className="text-crt-amber">[P] / [R]:</strong> Pause Clock / Reset Breaker</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-neutral-800 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-crt-amber hover:bg-yellow-400 text-black font-bold rounded text-xs flex items-center gap-2 transition active:scale-95 shadow-md"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>CLOSE MANUAL</span>
          </button>
        </div>
      </div>
    </div>
  );
};
