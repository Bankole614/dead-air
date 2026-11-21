import React, { useState } from 'react';
import { useGameStore } from '../state/store';
import { ConfidenceLevel } from '../types/game';
import { ShieldAlert, User, MapPin, Pin, ArrowRight, CheckCircle2 } from './icons';

const CONFIDENCE_OPTIONS: Array<{ level: ConfidenceLevel; title: string; subtitle: string }> = [
  {
    level: 50,
    title: '50% // TENTATIVE WORKING HYPOTHESIS',
    subtitle: 'Evidence is partial or ambiguous. Protects against overconfidence penalties if theory is wrong (+10 epistemic humility).',
  },
  {
    level: 75,
    title: '75% // PROBABLE CAUSE ESTABLISHED',
    subtitle: 'Standard dispatch confidence backed by corroborated witness or timeline pins.',
  },
  {
    level: 95,
    title: '95% // CODE-3 CERTAINTY (BEYOND DOUBT)',
    subtitle: 'Verified via independent firsthand sources or A/B audio forensics (+5 calibration bonus if right; -15 penalty if wrong).',
  },
];

export const IncidentFilingModal: React.FC = () => {
  const {
    notebook,
    getActiveCase,
    submitVerdict,
  } = useGameStore();

  const currentCase = getActiveCase();
  const deduction = currentCase.deduction;

  // Form states
  const [selectedSuspect, setSelectedSuspect] = useState<string>(
    deduction?.suspectChoices[0]?.id || ''
  );
  const [selectedTarget, setSelectedTarget] = useState<string>(
    deduction?.targetChoices[0]?.id || ''
  );
  const [selectedPinIds, setSelectedPinIds] = useState<string[]>([]);
  const [confidenceLevel, setConfidenceLevel] = useState<ConfidenceLevel>(75);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const togglePin = (pinId: string) => {
    if (selectedPinIds.includes(pinId)) {
      setSelectedPinIds(selectedPinIds.filter(id => id !== pinId));
    } else {
      if (selectedPinIds.length >= 2) {
        setSelectedPinIds([selectedPinIds[1], pinId]);
      } else {
        setSelectedPinIds([...selectedPinIds, pinId]);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSuspect || !selectedTarget) {
      setErrorMsg('Please complete all sections of the classification docket.');
      return;
    }

    submitVerdict(selectedSuspect, selectedTarget, selectedPinIds, confidenceLevel);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 font-mono select-none overflow-y-auto">
      <div className="max-w-3xl w-full bg-[#0c1017] border-2 border-crt-amber rounded-lg shadow-2xl p-6 text-neutral-200 my-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3 mb-5">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-8 h-8 text-crt-amber glow-amber shrink-0" />
            <div>
              <h2 className="text-base font-bold text-crt-amber glow-amber tracking-wider">
                FORM 911-B // INCIDENT CLASSIFICATION & CONFIDENCE DOCKET
              </h2>
              <div className="text-xs text-neutral-400">
                CASE 0{currentCase.number}: {currentCase.title} // SUBMIT DEDUCTION FOR VERIFICATION
              </div>
            </div>
          </div>
          <div className="text-right hidden sm:block">
            <span className="text-[11px] px-2.5 py-1 rounded bg-amber-950/40 text-crt-amber border border-amber-900/40 font-bold">
              VERDICT REQUIRED
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 text-xs">
          {/* Section 1: Primary Culprit / Cause */}
          <div className="bg-neutral-900/70 p-4 rounded border border-neutral-800 space-y-2">
            <div className="flex items-center gap-2 font-bold text-neutral-200 text-xs">
              <User className="w-4 h-4 text-crt-amber" />
              <span>STEP 1: IDENTIFY RESPONSIBLE PARTY OR TRUE CAUSE</span>
            </div>
            <p className="text-[11px] text-neutral-400">
              Distinguish what can actually be established from confirmation bias, primed suspects, and witness panic:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
              {deduction?.suspectChoices.map((suspect) => (
                <label
                  key={suspect.id}
                  className={`p-3 rounded border cursor-pointer flex items-start gap-2.5 transition ${
                    selectedSuspect === suspect.id
                      ? 'border-crt-amber bg-amber-950/30 text-amber-100 shadow'
                      : 'border-neutral-800 bg-black/40 text-neutral-400 hover:text-white hover:border-neutral-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="suspect"
                    value={suspect.id}
                    checked={selectedSuspect === suspect.id}
                    onChange={(e) => setSelectedSuspect(e.target.value)}
                    className="mt-0.5 accent-amber-500 cursor-pointer"
                  />
                  <span className="leading-snug text-xs font-mono">{suspect.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Section 2: Target / True Event Reconstruction */}
          <div className="bg-neutral-900/70 p-4 rounded border border-neutral-800 space-y-2">
            <div className="flex items-center gap-2 font-bold text-neutral-200 text-xs">
              <MapPin className="w-4 h-4 text-crt-amber" />
              <span>STEP 2: IDENTIFY THE TRUE INCIDENT / TARGET</span>
            </div>
            <p className="text-[11px] text-neutral-400">
              What actually occurred once hearsay echoes and false diversions are stripped away?
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
              {deduction?.targetChoices.map((target) => (
                <label
                  key={target.id}
                  className={`p-3 rounded border cursor-pointer flex items-start gap-2.5 transition ${
                    selectedTarget === target.id
                      ? 'border-crt-amber bg-amber-950/30 text-amber-100 shadow'
                      : 'border-neutral-800 bg-black/40 text-neutral-400 hover:text-white hover:border-neutral-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="target"
                    value={target.id}
                    checked={selectedTarget === target.id}
                    onChange={(e) => setSelectedTarget(e.target.value)}
                    className="mt-0.5 accent-amber-500 cursor-pointer"
                  />
                  <span className="leading-snug text-xs font-mono">{target.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Section 3: Evidence Pins Selection */}
          <div className="bg-neutral-900/70 p-4 rounded border border-neutral-800 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-neutral-200 text-xs">
                <Pin className="w-4 h-4 text-crt-amber" />
                <span>STEP 3: ATTACH KEY CORROBORATING EVIDENCE ({selectedPinIds.length}/2 SELECTED)</span>
              </div>
              <span className="text-[10px] text-neutral-500">SELECT 1–2 CRITICAL CLUES</span>
            </div>

            {notebook.pins.length === 0 ? (
              <div className="p-3 bg-black/50 border border-neutral-800 rounded text-neutral-500 text-center italic text-xs">
                No clues were pinned to the notebook during transmissions. (Investigation penalty applied)
              </div>
            ) : (
              <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
                {notebook.pins.map((pin) => {
                  const isSelected = selectedPinIds.includes(pin.id);
                  return (
                    <div
                      key={pin.id}
                      onClick={() => togglePin(pin.id)}
                      className={`p-2 rounded border cursor-pointer flex items-start gap-2 transition text-xs font-mono ${
                        isSelected
                          ? 'border-crt-amber bg-amber-950/40 text-crt-amber font-semibold'
                          : 'border-neutral-800 bg-black/40 text-neutral-300 hover:border-neutral-700'
                      }`}
                    >
                      <span className={`w-3.5 h-3.5 rounded flex items-center justify-center shrink-0 border ${
                        isSelected ? 'border-crt-amber bg-crt-amber text-black' : 'border-neutral-700'
                      }`}>
                        {isSelected && '✓'}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="truncate text-[11px] text-neutral-400">
                          [{pin.sourceSpeaker}] @ {pin.timestamp} {pin.provenance ? `// ${pin.provenance.toUpperCase()}` : ''}
                        </div>
                        <div className="text-xs">{pin.text}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Section 4: Epistemic Confidence Calibration */}
          <div className="bg-neutral-900/70 p-4 rounded border border-neutral-800 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-neutral-200 text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>STEP 4: RECORD EPISTEMIC CONFIDENCE CALIBRATION</span>
              </div>
              <span className="text-[10px] text-crt-amber font-bold">CERTAINTY: {confidenceLevel}%</span>
            </div>
            <p className="text-[11px] text-neutral-400">
              Distinguish what you know from what you merely suspect. High confidence on an unverified theory carries an overconfidence penalty:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
              {CONFIDENCE_OPTIONS.map((opt) => (
                <button
                  type="button"
                  key={opt.level}
                  onClick={() => setConfidenceLevel(opt.level)}
                  className={`p-2.5 rounded border text-left transition ${
                    confidenceLevel === opt.level
                      ? 'border-emerald-500 bg-emerald-950/40 text-emerald-100 shadow'
                      : 'border-neutral-800 bg-black/40 text-neutral-400 hover:text-white'
                  }`}
                >
                  <div className="font-bold text-[11px] text-crt-amber">{opt.title}</div>
                  <div className="text-[10px] text-neutral-400 mt-1 leading-snug">{opt.subtitle}</div>
                </button>
              ))}
            </div>
          </div>

          {errorMsg && (
            <div className="text-xs text-red-400 bg-red-950/40 p-2.5 rounded border border-red-900/50">
              {errorMsg}
            </div>
          )}

          {/* Submit Button */}
          <div className="border-t border-neutral-800 pt-4 flex items-center justify-between">
            <div className="text-[11px] text-neutral-500">
              OFFICIAL POLICE LOG CLASSIFICATION // SUBMIT TO COUNTY SHERIFF
            </div>
            <button
              type="submit"
              className="px-6 py-2.5 bg-crt-amber hover:bg-yellow-400 text-black font-bold rounded text-xs flex items-center gap-2 shadow-lg transition active:scale-95"
            >
              <span>CONFIRM & SUBMIT CASE VERDICT ({confidenceLevel}% CONFIDENCE)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
