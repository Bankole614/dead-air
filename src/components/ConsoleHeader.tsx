import React, { useEffect } from 'react';
import { useGameStore } from '../state/store';
import { sound } from '../engine/sound';
import { Volume2, VolumeX, Pause, Play, Settings, RotateCcw, FastForward, HelpCircle, FolderArchive, Award } from './icons';

interface ConsoleHeaderProps {
  onOpenSettings: () => void;
  onOpenBriefing: () => void;
  onOpenCaseSelector: () => void;
  onOpenBadges: () => void;
}

export const ConsoleHeader: React.FC<ConsoleHeaderProps> = ({
  onOpenSettings,
  onOpenBriefing,
  onOpenCaseSelector,
  onOpenBadges,
}) => {
  const {
    inGameTimeSeconds,
    isPaused,
    settings,
    activeCallId,
    calls,
    unlockedBadges,
    fastForwardToNextCall,
    openReportFiling,
    togglePause,
    updateSettings,
    resetGame,
    returnToMainMenu,
    getActiveCase,
  } = useGameStore();

  const currentCase = getActiveCase();
  const caseCallKeys = Object.keys(currentCase.calls);
  const allCallsDone = caseCallKeys.length > 0 && caseCallKeys.every((id) => calls[id]?.status === 'completed');
  const isCurrentCallDone = !activeCallId || calls[activeCallId]?.status === 'completed';

  const hours = Math.floor(inGameTimeSeconds / 3600);
  const minutes = Math.floor((inGameTimeSeconds % 3600) / 60);
  const timeFormatted = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;

  const toggleSound = () => {
    const nextState = !settings.soundEnabled;
    updateSettings({ soundEnabled: nextState });
    if (nextState) {
      sound.startAmbientHum();
    }
  };

  useEffect(() => {
    if (settings.soundEnabled) {
      sound.startAmbientHum();
    }
  }, [settings.soundEnabled]);

  return (
    <header className="bg-crt-panel border-b border-crt-panel-border px-2.5 sm:px-4 py-2 flex items-center justify-between gap-2 text-xs select-none shrink-0">
      {/* Left: Main Menu Button & Active Case Selector */}
      <div className="flex items-center gap-2 min-w-0">
        <button
          onClick={returnToMainMenu}
          className="px-2 py-1 rounded bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-crt-amber text-crt-amber font-bold text-[11px] flex items-center gap-1.5 shrink-0 transition"
          title="Return to Main Menu"
        >
          <span>◀ MENU</span>
        </button>

        <button
          onClick={onOpenCaseSelector}
          className="px-2 sm:px-2.5 py-1 rounded bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-crt-amber text-neutral-200 hover:text-crt-amber flex items-center gap-1.5 transition font-bold truncate"
          title="Switch Incident Case File"
        >
          <FolderArchive className="w-3.5 h-3.5 text-crt-amber shrink-0" />
          <span className="truncate text-[11px] sm:text-xs">CASE {String(currentCase.number).padStart(2, '0')}: {currentCase.title}</span>
        </button>

        {/* Active Gameplay Mode Badge */}
        <button
          onClick={onOpenSettings}
          title="Click to change Gameplay Difficulty Mode"
          className={`hidden md:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border uppercase shrink-0 transition ${
            settings.gameMode === 'story'
              ? 'border-emerald-700 bg-emerald-950/50 text-emerald-300'
              : settings.gameMode === 'hardcore'
              ? 'border-red-700 bg-red-950/60 text-red-300'
              : 'border-amber-800 bg-amber-950/40 text-crt-amber'
          }`}
        >
          {settings.gameMode || 'standard'} MODE
        </button>
      </div>

      {/* Center: Clean Shift Clock & Next Call Action */}
      <div className="flex items-center gap-2 shrink-0">
        <div className="flex items-center bg-black/60 rounded border border-neutral-800 px-2.5 py-1 gap-2">
          <span className="text-[10px] text-neutral-500 hidden sm:inline">SHIFT</span>
          <span className="text-crt-amber font-mono font-bold tracking-widest text-sm">
            {timeFormatted}
          </span>
          <button
            onClick={togglePause}
            title={isPaused ? 'Resume Shift [P]' : 'Pause Shift [P]'}
            className="text-neutral-400 hover:text-white transition"
          >
            {isPaused ? <Play className="w-3.5 h-3.5 text-crt-amber" /> : <Pause className="w-3.5 h-3.5" />}
          </button>
        </div>

        {allCallsDone ? (
          <button
            onClick={openReportFiling}
            className="px-3 py-1 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded text-[11px] flex items-center gap-1 shadow transition animate-pulse"
            title="All calls completed — Open Form 911-B to file your final verdict"
          >
            <span>📋 FILE VERDICT</span>
          </button>
        ) : isCurrentCallDone ? (
          <button
            onClick={fastForwardToNextCall}
            className="px-2.5 py-1 bg-crt-amber hover:bg-yellow-400 text-black font-bold rounded text-[11px] flex items-center gap-1 shadow transition"
            title="Advance to next incoming call [SPACE]"
          >
            <FastForward className="w-3 h-3 fill-current" />
            <span className="hidden md:inline">NEXT CALL</span>
          </button>
        ) : null}
      </div>

      {/* Right: Quiet Utility Icons */}
      <div className="flex items-center gap-1.5 shrink-0">
        <button
          onClick={onOpenBadges}
          title="Service Medals & Commendations"
          className="px-2 py-1.5 bg-neutral-900 border border-neutral-800 rounded hover:bg-neutral-800 text-neutral-300 hover:text-crt-amber flex items-center gap-1 transition"
        >
          <Award className="w-3.5 h-3.5 text-crt-amber" />
          <span className="text-[10px] font-bold">{unlockedBadges?.length || 0}</span>
        </button>

        <button
          onClick={onOpenBriefing}
          title="Operator Guide & Rules"
          className="p-1.5 bg-neutral-900 border border-neutral-800 rounded hover:bg-neutral-800 text-neutral-300 hover:text-crt-amber transition"
        >
          <HelpCircle className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={toggleSound}
          title={settings.soundEnabled ? 'Mute Audio' : 'Unmute Audio'}
          className="p-1.5 bg-neutral-900 border border-neutral-800 rounded hover:bg-neutral-800 text-neutral-300 hover:text-white transition"
        >
          {settings.soundEnabled ? (
            <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
          ) : (
            <VolumeX className="w-3.5 h-3.5 text-neutral-500" />
          )}
        </button>

        <button
          onClick={onOpenSettings}
          title="Settings"
          className="p-1.5 bg-neutral-900 border border-neutral-800 rounded hover:bg-neutral-800 text-neutral-300 hover:text-white transition"
        >
          <Settings className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => {
            if (confirm('Reset current case progress back to the start of the shift?')) {
              resetGame();
            }
          }}
          title="Restart Case"
          className="p-1.5 bg-neutral-900 border border-neutral-800 rounded hover:bg-neutral-800 text-neutral-500 hover:text-red-400 transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  );
};
