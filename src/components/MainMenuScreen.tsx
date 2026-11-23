import React, { useState, useEffect } from 'react';
import { useGameStore } from '../state/store';
import { CASE_LIST } from '../content/cases';
import { BADGE_CATALOG } from '../content/badges';
import { GameMode } from '../types/game';
import { Radio, Play, FolderArchive, Award, HelpCircle, Settings, CheckCircle, ArrowRight, Shield, Headphones, Monitor } from './icons';

interface MainMenuScreenProps {
  onOpenManual: () => void;
  onOpenBadges: () => void;
  onOpenSettings: () => void;
}

const MODE_OPTIONS: Array<{
  id: GameMode;
  title: string;
  tag: string;
  desc: string;
  bullets: string[];
}> = [
  {
    id: 'story',
    title: 'STORY / GUIDED',
    tag: 'RELAXED',
    desc: 'Focus purely on the mystery narrative and audio investigation without time stress.',
    bullets: [
      'No circuit-breaker power surge timers',
      'Callers on hold never lose patience',
      'Dialogue choices highlight leading vs. neutral questions',
    ],
  },
  {
    id: 'standard',
    title: 'STANDARD DISPATCH',
    tag: 'RECOMMENDED',
    desc: 'The intended 1994 Operator 7 experience balancing deduction and switchboard triage.',
    bullets: [
      'Standard shift clock & unit dispatch cooldowns',
      'Full A/B audio comparator & provenance tools',
      'Unlocks [CHALLENGE] confrontations when clues are pinned',
    ],
  },
  {
    id: 'hardcore',
    title: 'HARDCORE / BLIND WIRE',
    tag: 'VETERAN',
    desc: 'No UI hand-holding. Read between the lines and catch psychological traps on your own.',
    bullets: [
      'Hides [LEADING], [NEUTRAL], and [CHALLENGE] tags on dialogue options',
      'Locked confrontation options stay hidden until you pin the right proof',
      'Faster caller hold agitation & active power surges',
    ],
  },
];

export const MainMenuScreen: React.FC<MainMenuScreenProps> = ({
  onOpenManual,
  onOpenBadges,
  onOpenSettings,
}) => {
  const {
    activeCaseId,
    completedCaseIds,
    unlockedBadges,
    calls,
    notebook,
    inGameTimeSeconds,
    shiftCompleted,
    settings,
    startNewShift,
    resumeShift,
    updateSettings,
    getActiveCase,
  } = useGameStore();

  const [view, setView] = useState<'home' | 'setup'>('home');
  const [selectedCaseId, setSelectedCaseId] = useState<string>(activeCaseId || 'case_1');
  const [selectedMode, setSelectedMode] = useState<GameMode>(settings.gameMode || 'standard');
  const [installPromptEvent, setInstallPromptEvent] = useState<any>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPromptEvent(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallPWA = async () => {
    if (!installPromptEvent) return;
    installPromptEvent.prompt();
    await installPromptEvent.userChoice;
    setInstallPromptEvent(null);
  };

  const currentCase = getActiveCase();
  const hasActiveProgress =
    !shiftCompleted && (Object.keys(calls).length > 0 || notebook.pins.length > 0);

  const hours = Math.floor(inGameTimeSeconds / 3600);
  const minutes = Math.floor((inGameTimeSeconds % 3600) / 60);
  const timeFormatted = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;

  const handleModeSelect = (mode: GameMode) => {
    setSelectedMode(mode);
    updateSettings({ gameMode: mode });
  };

  const getDifficultyStyle = (diff: string) => {
    switch (diff) {
      case 'STANDARD':
        return 'text-emerald-400 border-emerald-800/70 bg-emerald-950/30';
      case 'HARD':
        return 'text-amber-400 border-amber-800/70 bg-amber-950/30';
      case 'CRITICAL':
        return 'text-red-400 border-red-800/70 bg-red-950/30';
      default:
        return 'text-neutral-400 border-neutral-800';
    }
  };

  return (
    <div className="flex-1 min-h-0 overflow-y-auto bg-[#070a0f] text-neutral-200 font-mono select-none flex flex-col justify-between p-4 sm:p-6 md:p-8">
      {/* Top Terminal Telemetry Strip */}
      <div className="max-w-5xl w-full mx-auto flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-neutral-800/80 text-[11px] text-neutral-500">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-neutral-400 font-bold">BLACKWOOD COUNTY 911 SWITCHBOARD</span>
          <span className="hidden sm:inline">// TERMINAL 07 // ROM v1994.11</span>
        </div>
        <div className="flex items-center gap-4">
          <span>
            CASES SOLVED: <strong className="text-crt-amber">{completedCaseIds.length}/{CASE_LIST.length}</strong>
          </span>
          <span>
            MEDALS: <strong className="text-crt-amber">{unlockedBadges?.length || 0}/{BADGE_CATALOG.length}</strong>
          </span>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="max-w-5xl w-full mx-auto my-auto py-6">
        {view === 'home' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Left Column: Game Identity & Brief */}
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-amber-950/40 border border-amber-800/60 text-crt-amber text-xs font-bold">
                <Radio className="w-3.5 h-3.5 animate-pulse" />
                <span>1994 NIGHT SHIFT AUDIO DEDUCTION THRILLER</span>
              </div>

              <h1 className="text-4xl sm:text-6xl font-black tracking-wider text-crt-amber glow-amber">
                DEAD AIR
              </h1>

              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed max-w-xl">
                You are <strong>Operator 7</strong> working the late shift at an aging rural 911 switchboard.
                You cannot see outside your console. You only have incoming phone lines, background acoustics,
                a dual-tape A/B oscilloscope, and a rotary police scanner—while human panic, confirmation bias,
                and deliberate decoys distort the truth.
              </p>

              {/* Quick Mode Selector on Home Screen */}
              <div className="pt-2 space-y-2 max-w-xl">
                <div className="text-[11px] font-bold text-neutral-400 flex items-center justify-between">
                  <span>ACTIVE INVESTIGATION MODE:</span>
                  <span className="text-crt-amber uppercase">{selectedMode} MODE</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {MODE_OPTIONS.map((m) => {
                    const active = selectedMode === m.id;
                    return (
                      <button
                        key={m.id}
                        onClick={() => handleModeSelect(m.id)}
                        className={`p-2.5 rounded-lg border text-left transition flex flex-col justify-between ${
                          active
                            ? 'border-crt-amber bg-amber-950/40 text-amber-100 shadow-md'
                            : 'border-neutral-800 bg-neutral-900/60 text-neutral-400 hover:text-white hover:border-neutral-700'
                        }`}
                      >
                        <div className="text-[10px] font-bold text-crt-amber">{m.tag}</div>
                        <div className="text-xs font-bold mt-0.5 leading-snug whitespace-normal break-words">
                          {m.title}
                        </div>
                      </button>
                    );
                  })}
                </div>
                <div className="text-[11px] text-neutral-400 bg-neutral-900/60 border border-neutral-800/80 rounded p-2.5">
                  {MODE_OPTIONS.find((m) => m.id === selectedMode)?.desc}
                </div>
              </div>
            </div>

            {/* Right Column: Main Menu Actions */}
            <div className="lg:col-span-5 bg-crt-panel border-2 border-neutral-800 rounded-xl p-5 space-y-3 shadow-2xl">
              <div className="text-xs font-bold text-neutral-400 border-b border-neutral-800 pb-2 mb-1 flex items-center justify-between">
                <span>OPERATOR COMMAND MENU</span>
                <span className="text-[10px] text-emerald-400">● ONLINE</span>
              </div>

              {/* Resume Active Shift Button (if session in progress) */}
              {hasActiveProgress && (
                <button
                  onClick={resumeShift}
                  className="w-full p-3.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-black font-bold text-xs sm:text-sm flex items-center justify-between shadow-lg transition active:scale-95"
                >
                  <div className="flex items-center gap-2.5 text-left">
                    <Play className="w-4 h-4 fill-current shrink-0" />
                    <div>
                      <div>RESUME ACTIVE SHIFT</div>
                      <div className="text-[10px] font-normal opacity-85">
                        Case {String(currentCase.number).padStart(2, '0')}: {currentCase.title} ({timeFormatted})
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </button>
              )}

              {/* Start New Shift / Choose Case & Mode */}
              <button
                onClick={() => setView('setup')}
                className="w-full p-3.5 rounded-lg bg-crt-amber hover:bg-yellow-400 text-black font-bold text-xs sm:text-sm flex items-center justify-between shadow-lg transition active:scale-95"
              >
                <div className="flex items-center gap-2.5 text-left">
                  <FolderArchive className="w-4 h-4 shrink-0" />
                  <div>
                    <div>{hasActiveProgress ? 'SELECT CASE & GAME MODE' : 'START SHIFT // SELECT CASE'}</div>
                    <div className="text-[10px] font-normal opacity-80">
                      10 Incident Dossiers Available • Choose Mode &amp; Difficulty
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </button>

              {/* Quick Start Current Case */}
              {!hasActiveProgress && (
                <button
                  onClick={() => startNewShift(currentCase.id, selectedMode)}
                  className="w-full p-3 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 hover:border-crt-amber text-neutral-200 font-bold text-xs flex items-center justify-between transition"
                >
                  <span className="flex items-center gap-2">
                    <Play className="w-3.5 h-3.5 text-crt-amber" />
                    <span>QUICK START: CASE {String(currentCase.number).padStart(2, '0')} ({currentCase.title})</span>
                  </span>
                  <span className="text-[10px] text-crt-amber uppercase">{selectedMode}</span>
                </button>
              )}

              {/* How to Play / Operator Manual */}
              <button
                onClick={onOpenManual}
                className="w-full p-3 rounded-lg bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-800 text-neutral-200 hover:text-crt-amber font-bold text-xs flex items-center justify-between transition"
              >
                <span className="flex items-center gap-2.5">
                  <HelpCircle className="w-4 h-4 text-crt-amber" />
                  <span>HOW TO PLAY &amp; FIELD MANUAL</span>
                </span>
                <span className="text-[10px] text-neutral-500">RULES</span>
              </button>

              {/* Service Medals */}
              <button
                onClick={onOpenBadges}
                className="w-full p-3 rounded-lg bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-800 text-neutral-200 hover:text-crt-amber font-bold text-xs flex items-center justify-between transition"
              >
                <span className="flex items-center gap-2.5">
                  <Award className="w-4 h-4 text-crt-amber" />
                  <span>SERVICE COMMENDATIONS &amp; MEDALS</span>
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950/60 text-crt-amber border border-amber-800/50">
                  {unlockedBadges?.length || 0} / {BADGE_CATALOG.length}
                </span>
              </button>

              {/* Settings & Audio Preferences */}
              <button
                onClick={onOpenSettings}
                className="w-full p-3 rounded-lg bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-800 text-neutral-200 hover:text-crt-amber font-bold text-xs flex items-center justify-between transition"
              >
                <span className="flex items-center gap-2.5">
                  <Settings className="w-4 h-4 text-crt-amber" />
                  <span>SETTINGS, AUDIO &amp; DATA RESET</span>
                </span>
                <span className="text-[10px] text-neutral-500">CONFIG</span>
              </button>

              {/* One-Click Install PWA Button (Appears when browser supports PWA installation) */}
              {installPromptEvent && (
                <button
                  onClick={handleInstallPWA}
                  className="w-full p-3 rounded-lg bg-emerald-950/50 hover:bg-emerald-900/60 border border-emerald-700/80 text-emerald-300 font-bold text-xs flex items-center justify-between transition shadow-md"
                >
                  <span className="flex items-center gap-2.5">
                    <Monitor className="w-4 h-4 text-emerald-400" />
                    <span>INSTALL DEAD AIR APP (OFFLINE PWA)</span>
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500 text-black font-bold">
                    INSTALL
                  </span>
                </button>
              )}
            </div>
          </div>
        ) : (
          /* VIEW 2: PRE-SHIFT SETUP (MODE + CASE SELECTOR) */
          <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-800 pb-3">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-crt-amber glow-amber">
                  PRE-SHIFT CONFIGURATION // SELECT MODE &amp; INCIDENT DOSSIER
                </h2>
                <p className="text-xs text-neutral-400">
                  Choose your investigation mode and select one of the 10 emergency incident files below.
                </p>
              </div>
              <button
                onClick={() => setView('home')}
                className="px-3 py-1.5 rounded bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-xs font-bold text-neutral-300 transition"
              >
                ← BACK TO TITLE SCREEN
              </button>
            </div>

            {/* Step 1: Gameplay Mode Selection */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-crt-amber flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span>STEP 1: SELECT INVESTIGATION DIFFICULTY MODE</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {MODE_OPTIONS.map((m) => {
                  const active = selectedMode === m.id;
                  return (
                    <div
                      key={m.id}
                      onClick={() => handleModeSelect(m.id)}
                      className={`p-3.5 rounded-lg border cursor-pointer transition flex flex-col justify-between ${
                        active
                          ? 'border-crt-amber bg-amber-950/30 shadow-md'
                          : 'border-neutral-800 bg-neutral-900/60 hover:border-neutral-700'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-xs text-white">{m.title}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                            active ? 'bg-crt-amber text-black' : 'bg-neutral-800 text-neutral-400'
                          }`}>
                            {m.tag}
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-400 mb-2 leading-relaxed">{m.desc}</p>
                      </div>
                      <ul className="space-y-1 border-t border-neutral-800/80 pt-2 text-[10px] text-neutral-300">
                        {m.bullets.map((b) => (
                          <li key={b} className="flex items-start gap-1.5">
                            <span className="text-crt-amber">•</span>
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Case File Selection */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-crt-amber flex items-center gap-2">
                <Headphones className="w-4 h-4" />
                <span>STEP 2: SELECT INCIDENT CASE FILE (01–10)</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[42vh] overflow-y-auto pr-1">
                {CASE_LIST.map((c) => {
                  const isSelected = selectedCaseId === c.id;
                  const isSolved = completedCaseIds.includes(c.id);
                  return (
                    <div
                      key={c.id}
                      onClick={() => setSelectedCaseId(c.id)}
                      className={`p-3.5 rounded-lg border cursor-pointer transition flex flex-col justify-between ${
                        isSelected
                          ? 'border-crt-amber bg-amber-950/35 shadow-md'
                          : 'border-neutral-800 bg-neutral-900/60 hover:border-neutral-700'
                      }`}
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <div className="flex items-start gap-2 min-w-0">
                            <span className="text-[11px] font-bold text-crt-amber shrink-0 mt-0.5">
                              CASE {String(c.number).padStart(2, '0')}
                            </span>
                            <h3 className="font-bold text-xs sm:text-sm text-white leading-snug whitespace-normal break-words">
                              {c.title}
                            </h3>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            {isSolved && (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center gap-1">
                                <CheckCircle className="w-2.5 h-2.5" /> SOLVED
                              </span>
                            )}
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${getDifficultyStyle(c.difficulty)}`}>
                              {c.difficulty}
                            </span>
                          </div>
                        </div>

                        <p className="text-[11px] text-neutral-400 leading-relaxed mb-2">
                          {c.synopsis}
                        </p>
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-neutral-500 border-t border-neutral-800/80 pt-2">
                        <span>{c.date} // {c.incidentCode}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            startNewShift(c.id, selectedMode);
                          }}
                          className={`px-2.5 py-1 rounded font-bold flex items-center gap-1 transition ${
                            isSelected
                              ? 'bg-crt-amber text-black hover:bg-yellow-400'
                              : 'bg-neutral-800 text-neutral-300 hover:bg-crt-amber hover:text-black'
                          }`}
                        >
                          <span>START SHIFT</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Launch Bar */}
            <div className="p-3.5 rounded-lg bg-neutral-900 border border-neutral-800 flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs">
                <span className="text-neutral-400">READY TO DEPLOY: </span>
                <strong className="text-crt-amber">
                  CASE {String(CASE_LIST.find((c) => c.id === selectedCaseId)?.number || 1).padStart(2, '0')} — {CASE_LIST.find((c) => c.id === selectedCaseId)?.title}
                </strong>
                <span className="text-neutral-500"> ({selectedMode.toUpperCase()} MODE)</span>
              </div>
              <button
                onClick={() => startNewShift(selectedCaseId, selectedMode)}
                className="px-6 py-2.5 bg-crt-amber hover:bg-yellow-400 text-black font-bold rounded text-xs sm:text-sm flex items-center gap-2 shadow-lg transition active:scale-95"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>ENTER OPERATOR WORKSTATION</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Footer */}
      <div className="max-w-5xl w-full mx-auto pt-3 border-t border-neutral-800/80 flex flex-wrap items-center justify-between gap-2 text-[11px] text-neutral-500">
        <span>DEAD AIR // 1994 EMERGENCY DISPATCH &amp; FORENSIC AUDIO SIMULATOR</span>
        <span>USE HEADPHONES FOR OPTIMAL ACOUSTIC FORENSICS</span>
      </div>
    </div>
  );
};
