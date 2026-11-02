import React, { useEffect } from 'react';
import { useGameStore } from '../state/store';
import { sound } from '../engine/sound';
import { Shield, HeartPulse, UserCheck, Volume2, VolumeX, Pause, Play, Settings, RotateCcw, FastForward, HelpCircle, FolderArchive } from './icons';

interface ConsoleHeaderProps {
  onOpenSettings: () => void;
  onOpenBriefing: () => void;
  onOpenCaseSelector: () => void;
}

export const ConsoleHeader: React.FC<ConsoleHeaderProps> = ({ onOpenSettings, onOpenBriefing, onOpenCaseSelector }) => {
  const {
    inGameTimeSeconds,
    isPaused,
    timeSpeed,
    activeUnits,
    settings,
    activeCallId,
    calls,
    fastForwardToNextCall,
    togglePause,
    setTimeSpeed,
    updateSettings,
    resetGame,
    getActiveCase,
  } = useGameStore();

  const currentCase = getActiveCase();
  const isCurrentCallDone = !activeCallId || calls[activeCallId]?.status === 'completed';

  const hours = Math.floor(inGameTimeSeconds / 3600);
  const minutes = Math.floor((inGameTimeSeconds % 3600) / 60);
  const seconds = Math.floor(inGameTimeSeconds % 60);
  const timeFormatted = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const availablePolice = Object.values(activeUnits).filter(u => u.type === 'police' && u.status === 'available').length;
  const totalPolice = Object.values(activeUnits).filter(u => u.type === 'police').length;

  const availableMedical = Object.values(activeUnits).filter(u => u.type === 'medical' && u.status === 'available').length;
  const totalMedical = Object.values(activeUnits).filter(u => u.type === 'medical').length;

  const availableWelfare = Object.values(activeUnits).filter(u => u.type === 'welfare' && u.status === 'available').length;
  const totalWelfare = Object.values(activeUnits).filter(u => u.type === 'welfare').length;

  // Start ambient audio on user click
  const toggleSound = () => {
    const nextState = !settings.soundEnabled;
    updateSettings({ soundEnabled: nextState });
    if (nextState) {
      sound.startAmbientHum();
    }
  };

  useEffect(() => {
    // Ambient sound trigger when sound is enabled
    if (settings.soundEnabled) {
      sound.startAmbientHum();
    }
  }, [settings.soundEnabled]);

  return (
    <header className="bg-crt-panel border-b border-crt-panel-border px-4 py-2 flex flex-wrap items-center justify-between gap-4 text-xs select-none">
      {/* Brand & Terminal Station */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-sm shadow-emerald-500"></span>
          <span className="font-bold text-crt-amber tracking-wider glow-amber text-sm font-mono">
            DEAD AIR // OPERATOR 7
          </span>
        </div>
        <button
          onClick={onOpenCaseSelector}
          className="text-neutral-400 hover:text-crt-amber border-l border-neutral-800 pl-3 hidden sm:flex items-center gap-1.5 transition font-bold"
          title="Click to browse case archives"
        >
          <FolderArchive className="w-3.5 h-3.5 text-crt-amber" />
          <span>CASE 0{currentCase.number}: {currentCase.title}</span>
        </button>
      </div>

      {/* Resource Badges */}
      <div className="flex items-center gap-3 font-mono">
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded border transition-colors ${
          availablePolice > 0 ? 'border-blue-900 bg-blue-950/40 text-blue-400' : 'border-red-900 bg-red-950/40 text-red-400'
        }`}>
          <Shield className="w-3.5 h-3.5" />
          <span>POLICE:</span>
          <span className="font-bold">{availablePolice}/{totalPolice}</span>
        </div>

        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded border transition-colors ${
          availableMedical > 0 ? 'border-emerald-900 bg-emerald-950/40 text-emerald-400' : 'border-red-900 bg-red-950/40 text-red-400'
        }`}>
          <HeartPulse className="w-3.5 h-3.5" />
          <span>MEDIC:</span>
          <span className="font-bold">{availableMedical}/{totalMedical}</span>
        </div>

        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded border transition-colors ${
          availableWelfare > 0 ? 'border-amber-900 bg-amber-950/40 text-amber-400' : 'border-red-900 bg-red-950/40 text-red-400'
        }`}>
          <UserCheck className="w-3.5 h-3.5" />
          <span>WELFARE:</span>
          <span className="font-bold">{availableWelfare}/{totalWelfare}</span>
        </div>
      </div>

      {/* Clock & Controls */}
      <div className="flex items-center gap-3">
        <div className="bg-black/60 px-3 py-1 rounded border border-neutral-800 text-crt-amber font-mono font-bold tracking-widest text-sm shadow-inner">
          {timeFormatted}
        </div>

        {/* Speed / Pause */}
        <div className="flex items-center bg-neutral-900 rounded border border-neutral-800 p-0.5">
          <button
            onClick={togglePause}
            title={isPaused ? "Resume Shift" : "Pause Shift"}
            className="p-1 hover:bg-neutral-800 text-neutral-400 hover:text-white rounded"
          >
            {isPaused ? <Play className="w-3.5 h-3.5 text-crt-amber" /> : <Pause className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={() => setTimeSpeed(1)}
            className={`px-1.5 py-0.5 text-[10px] font-mono rounded ${timeSpeed === 1 ? 'bg-neutral-700 text-crt-amber font-bold' : 'text-neutral-400 hover:text-white'}`}
          >
            1x
          </button>
          <button
            onClick={() => setTimeSpeed(3)}
            className={`px-1.5 py-0.5 text-[10px] font-mono rounded ${timeSpeed === 3 ? 'bg-neutral-700 text-crt-amber font-bold' : 'text-neutral-400 hover:text-white'}`}
          >
            3x
          </button>
          <button
            onClick={() => setTimeSpeed(5)}
            className={`px-1.5 py-0.5 text-[10px] font-mono rounded ${timeSpeed === 5 ? 'bg-neutral-700 text-crt-amber font-bold' : 'text-neutral-400 hover:text-white'}`}
          >
            5x
          </button>
        </div>

        {/* Fast forward to next call button */}
        {isCurrentCallDone && (
          <button
            onClick={fastForwardToNextCall}
            className="px-2.5 py-1 bg-amber-600 hover:bg-amber-500 text-black font-bold rounded text-[11px] flex items-center gap-1.5 shadow transition animate-pulse"
            title="Fast-forward clock to the next emergency transmission"
          >
            <FastForward className="w-3 h-3" />
            <span>NEXT CALL</span>
          </button>
        )}

        {/* Case Dossier Selector */}
        <button
          onClick={onOpenCaseSelector}
          title="Select Incident Case Dossier"
          className="p-1.5 bg-neutral-900 border border-neutral-800 rounded hover:bg-neutral-800 text-crt-amber hover:text-yellow-300 flex items-center gap-1"
        >
          <FolderArchive className="w-3.5 h-3.5" />
          <span className="hidden xl:inline text-[10px] font-bold">CASES</span>
        </button>

        {/* Help / Briefing */}
        <button
          onClick={onOpenBriefing}
          title="Operator Directives & Rules"
          className="p-1.5 bg-neutral-900 border border-neutral-800 rounded hover:bg-neutral-800 text-crt-amber hover:text-yellow-300 flex items-center gap-1"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span className="hidden xl:inline text-[10px] font-bold">MANUAL</span>
        </button>

        {/* Sound toggle */}
        <button
          onClick={toggleSound}
          title={settings.soundEnabled ? "Mute Atmospheric Sound" : "Enable Sound"}
          className="p-1.5 bg-neutral-900 border border-neutral-800 rounded hover:bg-neutral-800 text-neutral-300 hover:text-white"
        >
          {settings.soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-crt-green" /> : <VolumeX className="w-3.5 h-3.5 text-neutral-500" />}
        </button>

        {/* Settings */}
        <button
          onClick={onOpenSettings}
          title="Terminal Settings"
          className="p-1.5 bg-neutral-900 border border-neutral-800 rounded hover:bg-neutral-800 text-neutral-300 hover:text-white"
        >
          <Settings className="w-3.5 h-3.5" />
        </button>

        {/* Restart */}
        <button
          onClick={() => {
            if (confirm("Reset current shift progress back to 22:00?")) {
              resetGame();
            }
          }}
          title="Reset Shift"
          className="p-1.5 bg-neutral-900 border border-neutral-800 rounded hover:bg-neutral-800 text-neutral-500 hover:text-red-400"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  );
};
