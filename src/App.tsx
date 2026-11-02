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
import { IncidentFilingModal } from './components/IncidentFilingModal';
import { BadgesModal } from './components/BadgesModal';
import { WorkstationHazardBanner } from './components/WorkstationHazardBanner';
import { MoralDilemmaModal } from './components/MoralDilemmaModal';
import { ConsoleModeBar } from './components/ConsoleModeBar';
import { CountyMap } from './components/CountyMap';
import { RadioScanner } from './components/RadioScanner';

export const App: React.FC = () => {
  const {
    settings,
    shiftCompleted,
    reportFilingActive,
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
    hazardState,
    resetCircuitBreaker,
    consoleMode,
    setConsoleMode,
  } = useGameStore();

  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [showBriefing, setShowBriefing] = useState<boolean>(false);
  const [showCaseSelector, setShowCaseSelector] = useState<boolean>(false);
  const [showBadges, setShowBadges] = useState<boolean>(false);

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
      } else if (e.key === 'r' || e.key === 'R') {
        if (hazardState && hazardState.active) {
          e.preventDefault();
          resetCircuitBreaker();
        }
      } else if (e.key === 'F1' || e.key === '1') {
        if (!e.ctrlKey && !e.altKey) {
          e.preventDefault();
          setConsoleMode('switchboard');
        }
      } else if (e.key === 'F2' || e.key === '2') {
        if (!e.ctrlKey && !e.altKey) {
          e.preventDefault();
          setConsoleMode('map');
        }
      } else if (e.key === 'F3' || e.key === '3') {
        if (!e.ctrlKey && !e.altKey) {
          e.preventDefault();
          setConsoleMode('evidence');
        }
      } else if (e.key === 'F4' || e.key === '4') {
        if (!e.ctrlKey && !e.altKey) {
          e.preventDefault();
          setConsoleMode('scanner');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [typewriterActive, activeCallId, callQueue, calls, finishTypewriter, answerCall, fastForwardToNextCall, togglePause, hazardState, resetCircuitBreaker, setConsoleMode]);

  return (
    <div className={`min-h-screen h-screen w-screen flex flex-col bg-crt-bg text-neutral-300 font-mono relative overflow-x-hidden ${
      settings.crtScanlines ? 'crt-overlay' : ''
    }`}>
      {/* CRT Scanline Bar Animation */}
      {settings.crtScanlines && <div className="scanline-bar" />}

      {/* Header Bar */}
      <ConsoleHeader
        onOpenSettings={() => setShowSettings(true)}
        onOpenBriefing={() => setShowBriefing(true)}
        onOpenCaseSelector={() => setShowCaseSelector(true)}
        onOpenBadges={() => setShowBadges(true)}
      />

      {/* Chunky Retro Terminal Screen Switcher */}
      <ConsoleModeBar />

      {/* Workstation Hazard Alert & Breaker Reset Banner */}
      <WorkstationHazardBanner />

      {/* Main Terminal Screen Area with Adaptive Laptop Scrolling */}
      <main className="flex-1 min-h-0 flex flex-col overflow-y-auto relative">
        {/* F1: SWITCHBOARD & WIRE */}
        {consoleMode === 'switchboard' && (
          <div className="flex-1 flex flex-col">
            <CallQueue />
            <div className="flex-1 flex flex-col">
              <LiveTranscript />
            </div>
          </div>
        )}

        {/* F2: TACTICAL MAP & DISPATCH */}
        {consoleMode === 'map' && (
          <div className="flex-1 min-h-0 flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden">
            <div className="w-full lg:w-3/5 min-h-[420px] lg:min-h-0 lg:h-full border-b lg:border-b-0 lg:border-r border-neutral-800 flex flex-col overflow-hidden shrink-0 lg:shrink">
              <CountyMap />
            </div>
            <div className="w-full lg:w-2/5 min-h-[400px] lg:min-h-0 lg:h-full flex flex-col overflow-hidden shrink-0 lg:shrink">
              <DispatchPanel />
            </div>
          </div>
        )}

        {/* F3: EVIDENCE & DOSSIERS */}
        {consoleMode === 'evidence' && (
          <div className="flex-1 min-h-[560px] flex flex-col">
            <NotebookBoard />
          </div>
        )}

        {/* F4: RADIO SCANNER & DECRYPTED WIRE */}
        {consoleMode === 'scanner' && (
          <div className="flex-1 min-h-[560px] flex flex-col">
            <RadioScanner />
          </div>
        )}
      </main>

      {/* Incident Deduction Dossier Filing Screen */}
      {reportFilingActive && <IncidentFilingModal />}

      {/* Debrief / Ending Screen */}
      {shiftCompleted && (
        <EndingReport
          onOpenCaseSelector={() => setShowCaseSelector(true)}
          onOpenBadges={() => setShowBadges(true)}
        />
      )}

      {/* Terminal Settings Modal */}
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}

      {/* Operator Directives & Rules Briefing */}
      {showBriefing && <OperatorBriefing onClose={() => setShowBriefing(false)} />}

      {/* Case Dossier Selector Modal */}
      {showCaseSelector && <CaseSelectModal onClose={() => setShowCaseSelector(false)} />}

      {/* Badges / Commendations Modal */}
      {showBadges && <BadgesModal onClose={() => setShowBadges(false)} />}

      {/* High-Stakes Moral Dilemma Modal */}
      <MoralDilemmaModal />
    </div>
  );
};
