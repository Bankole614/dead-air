import React from 'react';
import { useGameStore } from '../state/store';
import { CASE_LIST } from '../content/cases';
import { BADGE_CATALOG } from '../content/badges';
import { ShieldAlert, CheckCircle, RotateCcw, ArrowRight, FolderArchive, Award } from './icons';

interface EndingReportProps {
  onOpenCaseSelector: () => void;
  onOpenBadges?: () => void;
}

export const EndingReport: React.FC<EndingReportProps> = ({ onOpenCaseSelector, onOpenBadges }) => {
  const {
    activeCaseId,
    notebook,
    verdictScore,
    unlockedBadges,
    resetGame,
    selectCase,
    getActiveCase,
  } = useGameStore();

  const currentCase = getActiveCase();
  const totalPins = notebook.pins.length;

  const currentIdx = CASE_LIST.findIndex(c => c.id === activeCaseId);
  const nextCase = currentIdx >= 0 && currentIdx < CASE_LIST.length - 1 ? CASE_LIST[currentIdx + 1] : null;

  const grade = verdictScore?.grade || 'A';
  const gradeColor = grade === 'S'
    ? 'text-yellow-400 glow-amber'
    : grade === 'A'
    ? 'text-emerald-400'
    : grade === 'B'
    ? 'text-blue-400'
    : 'text-red-400';

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 font-mono select-none">
      <div className="max-w-2xl w-full bg-crt-panel border-2 border-crt-amber rounded-lg shadow-2xl p-6 text-neutral-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3 mb-4">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-8 h-8 text-crt-amber glow-amber" />
            <div>
              <h2 className="text-lg font-bold text-crt-amber glow-amber tracking-wider">
                INCIDENT RESOLVED // CASE 0{currentCase.number}: {currentCase.title}
              </h2>
              <div className="text-xs text-neutral-400">
                {currentCase.incidentCode} // OFFICIAL DISPATCH AFTER-ACTION REPORT
              </div>
            </div>
          </div>

          <div className="text-center px-4 py-2 bg-neutral-900 border border-neutral-700 rounded shadow-inner">
            <div className="text-[10px] text-neutral-500 font-bold">OPERATOR GRADE</div>
            <div className={`text-3xl font-extrabold ${gradeColor}`}>
              GRADE {grade}
            </div>
          </div>
        </div>

        <div className="space-y-4 text-xs leading-relaxed">
          {/* Verdict Score Breakdown */}
          {verdictScore && (
            <div className="p-3 bg-neutral-900/80 rounded border border-neutral-800 space-y-2">
              <div className="font-bold text-xs text-crt-amber flex items-center justify-between">
                <span>INVESTIGATION CLASSIFICATION SCORE: {verdictScore.totalScore}/100</span>
                <span className="text-neutral-400 font-normal">TIME: {verdictScore.submittedAt}</span>
              </div>
              <p className="text-[11px] text-neutral-300 italic">
                "{verdictScore.feedback}"
              </p>
              <div className="grid grid-cols-3 gap-2 pt-1 text-[10px] border-t border-neutral-800 font-mono">
                <div className={verdictScore.culpritCorrect ? 'text-emerald-400' : 'text-red-400'}>
                  CULPRIT: {verdictScore.culpritCorrect ? '✓ IDENTIFIED (+40)' : '✗ MISSED (+0)'}
                </div>
                <div className={verdictScore.targetCorrect ? 'text-emerald-400' : 'text-red-400'}>
                  TARGET: {verdictScore.targetCorrect ? '✓ IDENTIFIED (+40)' : '✗ MISSED (+0)'}
                </div>
                <div className={verdictScore.evidenceCorrect ? 'text-emerald-400' : 'text-amber-400'}>
                  EVIDENCE: {verdictScore.evidenceCorrect ? '✓ CORROBORATED (+20)' : '⚠ WEAK PIN (+0)'}
                </div>
              </div>
            </div>
          )}

          {/* Key Findings from Answer Key */}
          <div className="bg-black/50 p-4 rounded border border-neutral-800 space-y-3">
            <div className="font-bold text-neutral-200 text-sm flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>THE UNCOVERED TRUTH:</span>
            </div>

            <p className="text-neutral-300">
              {currentCase.answerKey.truth}
            </p>

            <div className="pt-2 border-t border-neutral-800/80 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="text-neutral-500 font-bold">PRIMARY CULPRIT:</span>{' '}
                <span className="text-red-400 font-bold">{currentCase.answerKey.culprit}</span>
              </div>
              <div>
                <span className="text-neutral-500 font-bold">CRITICAL CONTRADICTION:</span>{' '}
                <span className="text-crt-amber font-bold">{currentCase.answerKey.fatalContradiction}</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-neutral-900 rounded border border-neutral-800 text-center">
              <div className="text-[10px] text-neutral-500">CLUES LOGGED</div>
              <div className="text-xl font-bold text-crt-amber">{totalPins}</div>
            </div>
            <div className="p-3 bg-neutral-900 rounded border border-neutral-800 text-center">
              <div className="text-[10px] text-neutral-500">DISPATCH RATING</div>
              <div className={`text-xl font-bold ${gradeColor}`}>{grade === 'S' ? 'PERFECT' : grade === 'A' ? 'COMMENDED' : grade === 'B' ? 'PASS' : 'SUBPAR'}</div>
            </div>
            <div className="p-3 bg-neutral-900 rounded border border-neutral-800 text-center col-span-2 sm:col-span-1">
              <div className="text-[10px] text-neutral-500">HONORS EARNED</div>
              <div className="text-xl font-bold text-crt-amber">{unlockedBadges?.length || 0} / {BADGE_CATALOG.length}</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-wrap justify-between items-center gap-3 border-t border-neutral-800 pt-3">
          <div className="flex items-center gap-2">
            <button
              onClick={resetGame}
              className="px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded text-xs flex items-center gap-1.5 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              REPLAY CASE
            </button>

            {onOpenBadges && (
              <button
                onClick={onOpenBadges}
                className="px-3 py-2 bg-amber-950/40 border border-amber-900/60 hover:bg-amber-900/50 text-crt-amber font-bold rounded text-xs flex items-center gap-1.5 transition"
              >
                <Award className="w-3.5 h-3.5 text-crt-amber" />
                <span>MEDALS ({unlockedBadges?.length || 0})</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenCaseSelector}
              className="px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-crt-amber font-bold rounded text-xs flex items-center gap-1.5 transition"
            >
              <FolderArchive className="w-3.5 h-3.5" />
              CASE ARCHIVES
            </button>

            {nextCase && (
              <button
                onClick={() => selectCase(nextCase.id)}
                className="px-4 py-2 bg-crt-amber hover:bg-yellow-400 text-black font-bold rounded text-xs flex items-center gap-1.5 transition active:scale-95 shadow-md"
              >
                <span>NEXT: CASE 0{nextCase.number}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
