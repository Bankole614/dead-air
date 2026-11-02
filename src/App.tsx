import React, { useState, useEffect } from 'react';
import { useGameStore } from './state/store';
import { ConsoleHeader } from './components/ConsoleHeader';
import { CallQueue } from './components/CallQueue';
import { LiveTranscript } from './components/LiveTranscript';
import { NotebookBoard } from './components/NotebookBoard';
import { DispatchPanel } from './components/DispatchPanel';
import { EndingReport } from './components/EndingReport';
import { SettingsModal } from './components/SettingsModal';
import { OperatorBriefing } from './components/OperatorBriefing';
import { CaseSelectModal } from './components/CaseSelectModal';

export const App: React.FC = () => {
  const {
    settings,
    shiftCompleted,
    tick,
    saveGame,
    loadGame,
    callQueue,
    calls,
    answerCall,
    activeCallId,
    typewriterActive,
    finishTypewriter,
    fastForwardToNextCall,
    togglePause,
  } = useGameStore();

  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [showBriefing, setShowBriefing] = useState<boolean>(false);
  const [showCaseSelector, setShowCaseSelector] = useState<boolean>(false);

  // Initialize & attempt autosave restoration
  useEffect(() => {
    loadGame();
  }, []);

  // Main game loop ticker
  useEffect(() => {
    const interval = setInterval(() => {
      tick(0.25);
    }, 250);

    return () => clearInterval(interval);
  }, [tick]);

  // Periodic autosave every 15s
  useEffect(() => {
    const saveInterval = setInterval(() => {
      saveGame();
    }, 15000);

    return () => clearInterval(saveInterval);
  }, [saveGame]);

  // Global Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept typing in inputs or textareas
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        if (typewriterActive) {
          finishTypewriter();
        } else if (!activeCallId && callQueue.length > 0) {
          answerCall(callQueue[0]);
        } else if (!activeCallId || calls[activeCallId]?.status === 'completed') {
          fastForwardToNextCall();
        }
      } else if (e.key === 'p' || e.key === 'P') {
        togglePause();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [typewriterActive, activeCallId, callQueue, calls, finishTypewriter, answerCall, fastForwardToNextCall, togglePause]);

  return (
    <div className={`h-screen w-screen flex flex-col bg-crt-bg text-neutral-300 font-mono relative overflow-hidden ${
      settings.crtScanlines ? 'crt-overlay' : ''
    }`}>
      {/* CRT Scanline Bar Animation */}
      {settings.crtScanlines && <div className="scanline-bar" />}

      {/* Header Bar */}
      <ConsoleHeader
        onOpenSettings={() => setShowSettings(true)}
        onOpenBriefing={() => setShowBriefing(true)}
        onOpenCaseSelector={() => setShowCaseSelector(true)}
      />

      {/* Incoming / Trunk Lines Monitor */}
      <CallQueue />

      {/* Main Dual Console Workstation */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left: Live Wire / CRT Transcript & Responses */}
        <div className="w-full md:w-7/12 flex flex-col h-1/2 md:h-full border-b md:border-b-0">
          <LiveTranscript />
        </div>

        {/* Right: Notebook, Evidence Board, Timeline & Dossiers */}
        <div className="w-full md:w-5/12 flex flex-col h-1/2 md:h-full">
          <NotebookBoard />
        </div>
      </div>

      {/* Bottom Dispatch Console */}
      <DispatchPanel />

      {/* Debrief / Ending Screen */}
      {shiftCompleted && <EndingReport onOpenCaseSelector={() => setShowCaseSelector(true)} />}

      {/* Terminal Settings Modal */}
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}

      {/* Operator Directives & Rules Briefing */}
      {showBriefing && <OperatorBriefing onClose={() => setShowBriefing(false)} />}

      {/* Case Dossier Selector Modal */}
      {showCaseSelector && <CaseSelectModal onClose={() => setShowCaseSelector(false)} />}
    </div>
  );
};
