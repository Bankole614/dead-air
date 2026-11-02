import React from 'react';
import { useGameStore } from '../state/store';
import { CASE_LIST } from '../content/cases';
import { FileText, CheckCircle, X, ArrowRight } from './icons';

interface CaseSelectModalProps {
  onClose: () => void;
}

export const CaseSelectModal: React.FC<CaseSelectModalProps> = ({ onClose }) => {
  const {
    activeCaseId,
    completedCaseIds,
    selectCase,
  } = useGameStore();

  const handleSelectCase = (caseId: string) => {
    if (caseId === activeCaseId) {
      onClose();
      return;
    }
    selectCase(caseId);
    onClose();
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'STANDARD': return 'text-emerald-400 border-emerald-900/60 bg-emerald-950/20';
      case 'HARD': return 'text-amber-400 border-amber-900/60 bg-amber-950/20';
      case 'CRITICAL': return 'text-red-400 border-red-900/60 bg-red-950/20';
      default: return 'text-neutral-400 border-neutral-800';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 font-mono select-none">
      <div className="max-w-3xl w-full bg-crt-panel border-2 border-crt-amber rounded-lg shadow-2xl p-6 text-neutral-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3 mb-4">
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-crt-amber glow-amber" />
            <div>
              <h2 className="text-base font-bold text-crt-amber glow-amber tracking-wider">
                SHIFT ARCHIVES // CASE DOSSIER SELECTOR
              </h2>
              <div className="text-[11px] text-neutral-400">
                REGIONAL CRISIS DISPATCH HISTORICAL INCIDENTS (1994)
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-neutral-400 hover:text-white transition rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Case List */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {CASE_LIST.map((c) => {
            const isActive = c.id === activeCaseId;
            const isCompleted = completedCaseIds.includes(c.id);

            return (
              <div
                key={c.id}
                onClick={() => handleSelectCase(c.id)}
                className={`p-4 rounded-lg border transition-all cursor-pointer group ${
                  isActive
                    ? 'border-crt-amber bg-amber-950/30 shadow-md shadow-amber-950/40'
                    : 'border-neutral-800 bg-neutral-900/70 hover:border-neutral-600 hover:bg-neutral-800/60'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-bold text-neutral-500 font-mono">
                      CASE 0{c.number}
                    </span>
                    <h3 className="font-bold text-sm text-neutral-100 group-hover:text-crt-amber transition">
                      {c.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getDifficultyColor(c.difficulty)}`}>
                      {c.difficulty}
                    </span>

                    {isActive && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-black animate-pulse">
                        CURRENT ACTIVE
                      </span>
                    )}

                    {isCompleted && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-800 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        SOLVED
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-xs text-neutral-400 mb-3 leading-relaxed">
                  {c.synopsis}
                </p>

                <div className="flex items-center justify-between text-[11px] text-neutral-500 border-t border-neutral-800/80 pt-2">
                  <div className="flex items-center gap-3">
                    <span>DATE: <strong className="text-neutral-300">{c.date}</strong></span>
                    <span>CODE: <strong className="text-neutral-300">{c.incidentCode}</strong></span>
                  </div>

                  <div className="flex items-center gap-1 text-crt-amber font-bold group-hover:translate-x-1 transition">
                    <span>{isActive ? 'CONTINUE SHIFT' : 'LOAD CASE'}</span>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-neutral-800 flex justify-between items-center text-xs text-neutral-500">
          <span>PROGRESS: {completedCaseIds.length} of {CASE_LIST.length} Cases Solved</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded text-xs font-bold transition"
          >
            RESUME CURRENT SHIFT
          </button>
        </div>
      </div>
    </div>
  );
};
