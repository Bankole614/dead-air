import { create } from 'zustand';
import { ShiftState, UnitType, PinnedClue, DialogueOption, CaseDef, ActiveDilemma, ConsoleMode, ProvenanceType, ConfidenceLevel, PsychologicalMetric } from '../types/game';
import { ALL_CASES } from '../content/cases';
import { sound } from '../engine/sound';

const STORAGE_KEY = 'dead_air_save_v1';

export interface GameSettings {
  crtScanlines: boolean;
  soundEnabled: boolean;
  textSpeed: 'instant' | 'fast' | 'normal';
  assistMode: boolean; // highlights potential contradictions
}

interface GameStore extends ShiftState {
  settings: GameSettings;
  typewriterActive: boolean;
  displayedText: string;
  isGameOver: boolean;

  // Case actions
  selectCase: (caseId: string) => void;
  getActiveCase: () => CaseDef;

  // Actions
  tick: (deltaSeconds: number) => void;
  togglePause: () => void;
  setTimeSpeed: (speed: number) => void;
  fastForwardToNextCall: () => void;
  
  // Call actions
  answerCall: (callId: string) => void;
  holdCall: (callId: string) => void;
  resumeCall: (callId: string) => void;
  selectDialogueOption: (option: DialogueOption) => void;
  finishTypewriter: () => void;
  
  // Dispatch actions
  dispatchUnit: (unitId: string, location: string, durationGameSeconds?: number) => void;
  submitVerdict: (suspectId: string, targetId: string, pinnedEvidenceIds: string[], confidenceLevel?: ConfidenceLevel) => void;
  setScannerFrequency: (freq: number) => void;
  toggleRoadblock: (checkpointId: string) => void;
  setConsoleMode: (mode: ConsoleMode) => void;
  
  // Hazard actions
  resetCircuitBreaker: () => void;
  triggerHazard: (type?: 'power_surge' | 'line_bleed' | 'blown_fuse') => void;

  // Moral dilemma actions
  triggerDilemma: (dilemma: ActiveDilemma) => void;
  resolveDilemma: (choice: 'A' | 'B') => void;

  // Notebook & Epistemic Psychology actions
  addPinnedClue: (text: string, speaker: string, callId: string, timestamp: string, ambientSourceId?: string, provenance?: ProvenanceType) => void;
  removePinnedClue: (pinId: string) => void;
  updateFreeNotes: (notes: string) => void;
  assignPinToTimeline: (pinId: string, slot: string) => void;
  assignPinToCharacter: (pinId: string, charId: string) => void;
  assignPinProvenance: (pinId: string, provenance: ProvenanceType) => void;
  updateCharacterNotes: (charId: string, notes: string) => void;
  setWorkingTheorySuspect: (suspectId: string) => void;
  toggleChallengeCounterPin: (pinId: string) => void;
  updateQuickScratchpad: (field: 'address' | 'entrance' | 'suspectDir' | 'keySound' | 'verification', value: string) => void;
  recordABComparisonDiscovery: (findingText: string, ambientSourceId?: string) => void;

  // Settings
  updateSettings: (newSettings: Partial<GameSettings>) => void;
  
  // Save & Reset
  saveGame: () => void;
  loadGame: () => boolean;
  resetGame: () => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  activeCaseId: 'case_1',
  completedCaseIds: [],
  inGameTimeSeconds: 22 * 3600, // 22:00:00 (79200 seconds)
  isPaused: false,
  timeSpeed: 3, // 1 real second = 3 game seconds (~12 min for 1 in-game hour)
  flags: {},
  activeUnits: ALL_CASES['case_1'].initialUnits,
  callQueue: [...ALL_CASES['case_1'].initialCallQueue],
  activeCallId: null,
  calls: {},
  notebook: {
    pins: [],
    freeNotes: ALL_CASES['case_1'].initialNotes,
  },
  workingTheory: {
    suspectId: '',
    challenged: false,
    counterPinIds: [],
  },
  quickScratchpad: {
    address: '',
    entrance: '',
    suspectDir: '',
    keySound: '',
    verification: '',
  },
  characters: ALL_CASES['case_1'].characters,
  consequences: [],
  radioFeed: [],
  pendingRadioEvents: [],
  reportFilingActive: false,
  unlockedBadges: [],
  scannerFrequency: 154.80,
  scannerMessages: [],
  activeRoadblocks: [],
  hazardState: null,
  activeDilemma: null,
  consoleMode: 'switchboard',
  shiftCompleted: false,
  isGameOver: false,
  settings: {
    crtScanlines: true,
    soundEnabled: true,
    textSpeed: 'normal',
    assistMode: false,
  },
  typewriterActive: false,
  displayedText: '',

  getActiveCase: () => {
    const cId = get().activeCaseId || 'case_1';
    return ALL_CASES[cId] || ALL_CASES['case_1'];
  },

  selectCase: (caseId: string) => {
    const targetCase = ALL_CASES[caseId];
    if (!targetCase) return;
    sound.stopPhoneRing();
    sound.playLineClick();
    set({
      activeCaseId: caseId,
      activeUnits: { ...targetCase.initialUnits },
      characters: { ...targetCase.characters },
      callQueue: [...targetCase.initialCallQueue],
      activeCallId: null,
      calls: {},
      notebook: {
        pins: [],
        freeNotes: targetCase.initialNotes,
      },
      workingTheory: {
        suspectId: '',
        challenged: false,
        counterPinIds: [],
      },
      quickScratchpad: {
        address: '',
        entrance: '',
        suspectDir: '',
        keySound: '',
        verification: '',
      },
      inGameTimeSeconds: 22 * 3600,
      shiftCompleted: false,
      reportFilingActive: false,
      verdictScore: undefined,
      hazardState: null,
      activeDilemma: null,
      consoleMode: 'switchboard',
      radioFeed: [],
      pendingRadioEvents: [],
      flags: {},
      displayedText: '',
      typewriterActive: false,
    });
    get().saveGame();
  },

  setConsoleMode: (mode: ConsoleMode) => {
    sound.playLineClick();
    set({ consoleMode: mode });
  },

  tick: (deltaSeconds: number) => {
    const state = get();
    if (state.isPaused || state.shiftCompleted) return;

    const gameDelta = deltaSeconds * state.timeSpeed;
    const newGameTime = state.inGameTimeSeconds + gameDelta;

    // Check unit cooldowns
    let unitsUpdated = false;
    const updatedUnits = { ...state.activeUnits };
    for (const id in updatedUnits) {
      const unit = updatedUnits[id];
      if (unit.status === 'dispatched' && unit.busyUntil && newGameTime >= unit.busyUntil) {
        updatedUnits[id] = {
          ...unit,
          status: 'available',
          assignedLocation: undefined,
          busyUntil: undefined,
        };
        unitsUpdated = true;
      }
    }

    // Check pending radio SITREP events
    let remainingEvents = [...state.pendingRadioEvents];
    let newRadioFeed = [...state.radioFeed];
    let radioTriggered = false;
    let updatedActiveCalls = { ...state.calls };
    let callsWereUpdated = false;

    const readyEvents = remainingEvents.filter(e => newGameTime >= e.triggerTime);
    if (readyEvents.length > 0) {
      remainingEvents = remainingEvents.filter(e => newGameTime < e.triggerTime);
      for (const ev of readyEvents) {
        sound.playStaticBurst(0.35);
        newRadioFeed.push(ev.transmission);
        radioTriggered = true;

        if (state.activeCallId && updatedActiveCalls[state.activeCallId]) {
          const currentCall = updatedActiveCalls[state.activeCallId];
          const hours = Math.floor(newGameTime / 3600);
          const minutes = Math.floor((newGameTime % 3600) / 60);
          const timeFormatted = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;

          updatedActiveCalls[state.activeCallId] = {
            ...currentCall,
            history: [
              ...currentCall.history,
              {
                nodeId: `rad_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
                speaker: 'radio',
                speakerName: `RADIO // ${ev.transmission.unitName.toUpperCase()}`,
                text: ev.transmission.text,
                timestamp: timeFormatted,
                audioCue: 'static',
              }
            ]
          };
          callsWereUpdated = true;
        }
      }
    }

    // Dynamic queue advancement:
    // Allow calls to ring when scheduled or when previous call has progressed
    const currentCase = state.getActiveCase();
    const caseCallKeys = Object.keys(currentCase.calls);
    const updatedQueue = [...state.callQueue];
    let queueChanged = false;

    for (let i = 0; i < caseCallKeys.length; i++) {
      const cId = caseCallKeys[i];
      const isDone = state.calls[cId]?.status === 'completed';
      const isStarted = !!state.calls[cId] || updatedQueue.includes(cId);

      if (!isStarted && !isDone) {
        const prevCall = i === 0 ? null : state.calls[caseCallKeys[i - 1]];
        // Queue if first call OR if previous call completed OR previous call reached at least 2 exchanges (history length >= 3)
        const prevProgressed = i === 0 || (prevCall && (prevCall.status === 'completed' || prevCall.history.length >= 3));

        if (prevProgressed) {
          updatedQueue.push(cId);
          queueChanged = true;
          sound.startPhoneRing();
          break;
        }
      }
    }

    // Increase agitation for callers on hold
    const updatedCalls = callsWereUpdated ? updatedActiveCalls : { ...state.calls };
    let callsChanged = callsWereUpdated;
    for (const cId in updatedCalls) {
      const call = updatedCalls[cId];
      if (call.status === 'on_hold') {
        const newAgitation = Math.min(100, call.agitationLevel + (gameDelta * 0.15));
        if (newAgitation !== call.agitationLevel) {
          updatedCalls[cId] = { ...call, agitationLevel: newAgitation };
          callsChanged = true;
        }
      }
    }

    // Hazard countdown handling
    let currentHazard = state.hazardState;
    if (currentHazard && currentHazard.active) {
      const remaining = currentHazard.timeRemaining - deltaSeconds;
      if (remaining <= 0) {
        sound.playStaticBurst(0.7);
        const hours = Math.floor(newGameTime / 3600);
        const minutes = Math.floor((newGameTime % 3600) / 60);
        const timeFormatted = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
        newRadioFeed.push({
          id: `haz_fail_${Date.now()}`,
          unitId: 'SWITCHBOARD',
          unitName: 'STATION BREAKER',
          timestamp: timeFormatted,
          text: 'CIRCUIT BREAKER OVERLOAD: Main bus tripped under unmitigated surge. Standby battery backup engaged.',
        });
        radioTriggered = true;
        currentHazard = null;
      } else {
        currentHazard = { ...currentHazard, timeRemaining: remaining };
      }
    } else if (!currentHazard && !state.flags['hazard_1_done'] && newGameTime >= 22 * 3600 + 360) {
      sound.playBreakerTrip();
      currentHazard = {
        active: true,
        type: 'power_surge',
        title: 'SUBSTATION TRANSFORMER 440V SURGE',
        description: 'High voltage fault detected on incoming switchboard trunk. Circuit breaker overheating!',
        timeRemaining: 15,
        maxTime: 15,
      };
      state.flags['hazard_1_done'] = true;
    }

    // Dynamic Moral Dilemma trigger (around 22:14 in Case 1 only)
    let currentDilemma = state.activeDilemma;
    if (state.activeCaseId === 'case_1' && !currentDilemma && !state.flags['dilemma_1_triggered'] && newGameTime >= 22 * 3600 + 840) {
      state.flags['dilemma_1_triggered'] = true;
      sound.playDispatchAlarm();
      const hours = Math.floor(newGameTime / 3600);
      const minutes = Math.floor((newGameTime % 3600) / 60);
      const timeFormatted = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
      currentDilemma = {
        id: 'dilemma_case1',
        title: 'TACTICAL DUAL-DISPATCH CONFLICT',
        urgentBrief: 'Cruiser 108 is currently our only mobile response unit in Sectors 2 & 4. Two critical incidents have escalated simultaneously.',
        timestamp: timeFormatted,
        optionA: {
          id: 'opt_sawmill',
          title: 'PRIORITIZE SAWMILL STRUCTURE FIRE',
          sector: 'SECTOR 4 - MILL CREEK',
          requiredUnit: 'Cruiser 108',
          description: 'Emergency 911 reports night watchman trapped inside burning office. Flames spreading towards chemical barrels.',
          consequenceSummary: 'Watchman cut free; recovers arson canister stamped with water board seal. Suspect sedan escapes roadblock.',
          outcomeLog: 'Cruiser 108: Rescued watchman from smoke! Found green accelerant canister near back loading dock.',
          flagToSet: 'saved_watchman',
        },
        optionB: {
          id: 'opt_roadblock',
          title: 'INTERCEPT FLEEING SEDAN AT ROUTE 9 CHECKPOINT',
          sector: 'SECTOR 2 - ROUTE 9 CHECKPOINT',
          requiredUnit: 'Cruiser 108',
          description: 'Black sedan matching Martha Gable\'s report spotted accelerating towards county border. Roadblock in position.',
          consequenceSummary: 'Suspect vehicle boxed against guardrail; driver flees leaving sluice blueprint in trunk. Sawmill office collapses.',
          outcomeLog: 'Cruiser 108: Roadblock hit! Driver fled on foot into brush; recovered stolen Blackwood Reservoir sluice blueprint.',
          flagToSet: 'intercepted_sedan',
        },
      };
    }

    // Check shift completion / deduction filing phase
    const allCallsDone = caseCallKeys.length > 0 && caseCallKeys.every(id => state.calls[id]?.status === 'completed');
    let filingActive: boolean = state.reportFilingActive;
    if (allCallsDone && !state.shiftCompleted && !state.reportFilingActive) {
      filingActive = true;
      sound.playPinSound();
    }

    set({
      inGameTimeSeconds: newGameTime,
      activeUnits: unitsUpdated ? updatedUnits : state.activeUnits,
      callQueue: queueChanged ? updatedQueue : state.callQueue,
      calls: callsChanged ? updatedCalls : state.calls,
      pendingRadioEvents: remainingEvents,
      radioFeed: radioTriggered ? newRadioFeed : state.radioFeed,
      hazardState: currentHazard,
      activeDilemma: currentDilemma,
      reportFilingActive: filingActive,
    });
  },

  togglePause: () => set((s) => ({ isPaused: !s.isPaused })),
  
  setTimeSpeed: (speed: number) => set({ timeSpeed: speed }),

  fastForwardToNextCall: () => {
    const state = get();
    // If there is already a call in the queue, answer it directly!
    if (state.callQueue.length > 0) {
      state.answerCall(state.callQueue[0]);
      return;
    }

    const currentCase = state.getActiveCase();
    const caseCallKeys = Object.keys(currentCase.calls);

    for (const cId of caseCallKeys) {
      if (!state.calls[cId]) {
        sound.stopPhoneRing();
        set({ callQueue: [] });
        state.answerCall(cId);
        return;
      }
    }

    // All calls in case are done
    set({ shiftCompleted: true });
  },

  answerCall: (callId: string) => {
    sound.stopPhoneRing();
    sound.playLineClick();
    const state = get();
    const currentCase = state.getActiveCase();
    const callDef = currentCase.calls[callId];
    if (!callDef) return;

    const initialNode = callDef.nodes[callDef.initialNode];
    const hours = Math.floor(state.inGameTimeSeconds / 3600);
    const minutes = Math.floor((state.inGameTimeSeconds % 3600) / 60);
    const timeFormatted = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;

    const newCall: typeof state.calls[string] = state.calls[callId] || {
      callDefId: callId,
      status: 'active',
      currentNodeId: callDef.initialNode,
      history: [
        {
          nodeId: initialNode.id,
          speaker: initialNode.speaker,
          speakerName: initialNode.speakerName || 'Caller',
          text: initialNode.text,
          timestamp: timeFormatted,
          audioCue: initialNode.audioCue,
          voiceUrl: initialNode.voiceUrl,
          backgroundClues: initialNode.backgroundClues,
          ambientSourceId: initialNode.ambientSourceId,
          forensicReveal: initialNode.forensicReveal,
        }
      ],
      agitationLevel: 0,
      startTime: timeFormatted,
    };

    if (initialNode.audioCue === 'static') {
      sound.playStaticBurst(0.6);
    }
    // Play voice audio or speech synthesis for the incoming caller line
    sound.playVoiceOrSpeak(
      initialNode.text,
      initialNode.speaker,
      initialNode.voiceUrl,
      initialNode.speakerName
    );

    // Remove from queue if present
    const newQueue = state.callQueue.filter(id => id !== callId);

    set({
      consoleMode: 'switchboard',
      activeCallId: callId,
      callQueue: newQueue,
      calls: {
        ...state.calls,
        [callId]: { ...newCall, status: 'active' },
      },
      displayedText: initialNode.text,
      typewriterActive: state.settings.textSpeed !== 'instant',
    });
    get().saveGame();
  },

  holdCall: (callId: string) => {
    sound.stopVoice();
    sound.playLineClick();
    const state = get();
    const call = state.calls[callId];
    if (!call) return;

    set({
      activeCallId: null,
      calls: {
        ...state.calls,
        [callId]: {
          ...call,
          status: 'on_hold',
          holdStartedAt: state.inGameTimeSeconds,
        }
      }
    });
    get().saveGame();
  },

  resumeCall: (callId: string) => {
    sound.playLineClick();
    const state = get();
    const call = state.calls[callId];
    if (!call) return;

    set({
      activeCallId: callId,
      calls: {
        ...state.calls,
        [callId]: {
          ...call,
          status: 'active',
        }
      }
    });
    get().saveGame();
  },

  selectDialogueOption: (option: DialogueOption) => {
    sound.playKeypress();
    const state = get();
    if (!state.activeCallId) return;

    const currentCase = state.getActiveCase();
    const activeCall = state.calls[state.activeCallId];
    const callDef = currentCase.calls[activeCall.callDefId];
    if (!callDef) return;

    const nextNode = callDef.nodes[option.next];
    if (!nextNode) return;

    const hours = Math.floor(state.inGameTimeSeconds / 3600);
    const minutes = Math.floor((state.inGameTimeSeconds % 3600) / 60);
    const timeFormatted = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;

    // Apply effects
    let updatedUnits = { ...state.activeUnits };
    let updatedFlags = { ...state.flags };

    if (option.biasType === 'leading_question') {
      updatedFlags['leading_questions_count'] = ((updatedFlags['leading_questions_count'] as number) || 0) + 1;
    } else if (option.biasType === 'challenge_theory') {
      updatedFlags['challenged_bias_in_dialogue'] = true;
    }

    if (option.effects) {
      for (const effect of option.effects) {
        if (effect.type === 'dispatch_lock') {
          sound.playDispatchAlarm();
          const unitType = effect.payload.unitType as UnitType;
          const loc = effect.payload.location;
          // find available unit of this type
          const availableUnit = Object.values(updatedUnits).find(u => u.type === unitType && u.status === 'available');
          if (availableUnit) {
            updatedUnits[availableUnit.id] = {
              ...availableUnit,
              status: 'dispatched',
              assignedLocation: loc,
              busyUntil: state.inGameTimeSeconds + (20 * 60), // 20 in-game minutes
            };
          }
        } else if (effect.type === 'set_flag') {
          updatedFlags[effect.payload.key] = effect.payload.value;
        }
      }
    }

    // Play cues
    if (nextNode.audioCue === 'static') {
      sound.playStaticBurst(0.7);
    } else if (nextNode.audioCue === 'hangup') {
      sound.playHangupTone();
    } else if (nextNode.audioCue === 'click') {
      sound.playLineClick();
    }

    // Two-way radio dialogue: Operator speaks the selected option, then Caller replies
    const cleanOptionText = option.label
      .replace(/\[[^\]]*\]/g, '')
      .replace(/⚠️/g, '')
      .replace(/^["'>\s]+|["'\s]+$/g, '')
      .trim();

    sound.playVoiceOrSpeak(
      cleanOptionText,
      'operator',
      undefined,
      'Operator 7',
      () => {
        // When Operator finishes speaking, Caller speaks the next node
        sound.playVoiceOrSpeak(
          nextNode.text,
          nextNode.speaker,
          nextNode.voiceUrl,
          nextNode.speakerName
        );
      }
    );

    const newHistory = [
      ...activeCall.history,
      {
        nodeId: `opt_${Date.now()}`,
        speaker: 'operator' as const,
        speakerName: 'Operator 7',
        text: option.label,
        timestamp: timeFormatted,
      },
      {
        nodeId: nextNode.id,
        speaker: nextNode.speaker,
        speakerName: nextNode.speakerName || 'Caller',
        text: nextNode.text,
        timestamp: timeFormatted,
        audioCue: nextNode.audioCue,
        voiceUrl: nextNode.voiceUrl,
        backgroundClues: nextNode.backgroundClues,
        ambientSourceId: nextNode.ambientSourceId,
        forensicReveal: nextNode.forensicReveal,
      }
    ];

    const isTerminal = !nextNode.options || nextNode.options.length === 0;

    set({
      activeUnits: updatedUnits,
      flags: updatedFlags,
      displayedText: nextNode.text,
      typewriterActive: state.settings.textSpeed !== 'instant',
      calls: {
        ...state.calls,
        [state.activeCallId]: {
          ...activeCall,
          currentNodeId: nextNode.id,
          status: isTerminal && nextNode.audioCue === 'hangup' ? 'completed' : 'active',
          history: newHistory,
        }
      }
    });
    get().saveGame();
  },

  finishTypewriter: () => set({ typewriterActive: false }),

  dispatchUnit: (unitId: string, location: string, durationGameSeconds = 1200) => {
    sound.playDispatchAlarm();
    const state = get();
    const unit = state.activeUnits[unitId];
    if (!unit || unit.status !== 'available') return;

    // Schedule realistic field radio SITREP feedback
    const hours = Math.floor(state.inGameTimeSeconds / 3600);
    const minutes = Math.floor((state.inGameTimeSeconds % 3600) / 60);
    const timeFormatted = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;

    const locLower = location.toLowerCase();
    const isBlackwood = locLower.includes('blackwood');
    const isReservoir = locLower.includes('reservoir');
    const isElm = locLower.includes('elm');
    const isBellweather = locLower.includes('bellweather') || locLower.includes('44 mercer');
    const isMercer18 = locLower.includes('18 mercer') || locLower.includes('80 mercer') || locLower.includes('sterling');
    const isPetrol9 = locLower.includes('petrol') || locLower.includes('route 9') || locLower.includes('culvert');
    const isWndr = locLower.includes('wndr') || locLower.includes('studio') || locLower.includes('baldy');
    const isAnnex = locLower.includes('annex') || locLower.includes('cage') || locLower.includes('west');

    // Event 1: Arrival report (+15 game seconds)
    const arrivalTime = state.inGameTimeSeconds + 15;
    const arrivalText = `${unit.name} to Central Dispatch: 10-23, arrived on scene at ${location}. Approaching exterior perimeter.`;

    // Event 2: Investigation findings (+38 game seconds)
    const findingsTime = state.inGameTimeSeconds + 38;
    const findingsText = isBellweather
      ? `${unit.name} to Central: On scene at Bellweather Apartments (44 Mercer Way)! No gunshots fired—confirming a 300-PSI cast-iron steam manifold ruptured in the adjacent machine workshop! Caretaker Donovan Vance is unarmed and assisting with boiler shutoff. Rear alley tire tracks belong to Valley Bakery Delivery Van #4!`
      : isMercer18
      ? `${unit.name} to Central: Inspected 18 Mercer Street! The Western Entrance deadbolt is locked from the INSIDE with Judge Sterling's brass key in the interior cylinder! Study grandfather clock strike hammer is mechanically jammed, and we found an arson delay candle inside the probate vault! Judge Sterling was spotted two blocks away at the diner payphone!`
      : isPetrol9
      ? `${unit.name} to Central: At Route 9 Petrol Depot! Confirming ONLY ONE blast occurred in the drainage culvert beneath the Conrail tracks from a cracked natural gas main! Night attendant Cole Mercer's white coupe is still parked under the canopy—he remained in the manifold trench to shut off the main fuel valve and saved the storage tanks!`
      : isWndr
      ? `${unit.name} to Central: Breached WNDR South Loading Door! Station Manager Malcolm Vale intercepted in Studio A with Cart C-6 looping on the local cue monitor! Presenter Ruth Adeyemi rescued from Production Booth B!`
      : isAnnex
      ? `${unit.name} to Central: Entered City Records Annex lower west corridor! Rescued watchman Elias Reed from behind the West Cage's two deadbolts and intercepted Deputy Archivist Mara Voss with the red relief-fund ledger!`
      : isBlackwood
      ? `${unit.name} to Central: Code 4 at Blackwood Lane! Ground floor is secure, no signs of ransacking. Found a hot CB radio scanner on the kitchen counter tuned to our dispatch channel. Nobody is barricaded inside—this whole call was a diversion!`
      : isReservoir
      ? `${unit.name} to Central: 10-33 Emergency at County Reservoir! We have two male suspects in dark jump-suits cutting the chlorine manifold padlock! Suspects fleeing on foot into north treeline, requesting perimeter containment!`
      : isElm
      ? `${unit.name} to Central: 114 Elm Street is all clear. Spoke with Mrs. Gable—loose aluminum shutter was flapping against brickwork in high wind. Returning to Sector 4 patrol.`
      : `${unit.name} to Central: Completed sweep of ${location}. Area is quiet and secure. Resuming patrol.`;

    const newEvents = [
      ...state.pendingRadioEvents,
      {
        triggerTime: arrivalTime,
        transmission: {
          id: `radio_${Date.now()}_1`,
          unitId: unit.id,
          unitName: unit.name,
          timestamp: timeFormatted,
          text: arrivalText,
          location,
        }
      },
      {
        triggerTime: findingsTime,
        transmission: {
          id: `radio_${Date.now()}_2`,
          unitId: unit.id,
          unitName: unit.name,
          timestamp: timeFormatted,
          text: findingsText,
          location,
        }
      }
    ];

    set({
      pendingRadioEvents: newEvents,
      flags: {
        ...state.flags,
        ...(state.notebook.pins.length < 2 ? { premature_dispatch: true } : {}),
      },
      activeUnits: {
        ...state.activeUnits,
        [unitId]: {
          ...unit,
          status: 'dispatched',
          assignedLocation: location,
          busyUntil: state.inGameTimeSeconds + durationGameSeconds,
        }
      }
    });
    get().saveGame();
  },

  setScannerFrequency: (freq: number) => {
    sound.playTuningClick();
    sound.playStaticBurst(0.18);
    set({ scannerFrequency: Number(freq.toFixed(3)) });
    get().saveGame();
  },

  toggleRoadblock: (checkpointId: string) => {
    sound.playDispatchAlarm();
    const state = get();
    const isCurrentlyActive = state.activeRoadblocks.includes(checkpointId);
    const updated = isCurrentlyActive
      ? state.activeRoadblocks.filter(id => id !== checkpointId)
      : [...state.activeRoadblocks, checkpointId];

    const checkpointNames: Record<string, string> = {
      cp_river_bridge: 'River Bridge Chokepoint (Sector 4 / South Exit)',
      cp_ridge_road: 'Ridge Road Access (North Reservoir Approach)',
      cp_route_9: 'Route 9 Mile 40 Overpass (County Border)',
      cp_west_gate: 'West Industrial Corridor (Railhead Gate)',
    };

    const name = checkpointNames[checkpointId] || 'County Checkpoint';
    const hours = Math.floor(state.inGameTimeSeconds / 3600);
    const minutes = Math.floor((state.inGameTimeSeconds % 3600) / 60);
    const timeFormatted = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;

    if (!isCurrentlyActive) {
      // Deploying roadblock
      const deployText = `Cruiser 108 to Central: Spike strips and road barricades deployed at ${name}. Vehicle checkpoint is locked down.`;
      const interceptText = `Cruiser 108 to Central: Roadblock hit! Dark suspect vehicle attempted to run the spikes at ${name}! Tires shredded, suspects contained and in custody!`;

      const newEvents = [
        ...state.pendingRadioEvents,
        {
          triggerTime: state.inGameTimeSeconds + 8,
          transmission: {
            id: `rb_dep_${Date.now()}`,
            unitId: 'P2',
            unitName: 'Cruiser 108',
            timestamp: timeFormatted,
            text: deployText,
            location: name,
          }
        },
        {
          triggerTime: state.inGameTimeSeconds + 32,
          transmission: {
            id: `rb_hit_${Date.now()}`,
            unitId: 'P2',
            unitName: 'Cruiser 108',
            timestamp: timeFormatted,
            text: interceptText,
            location: name,
          }
        }
      ];

      set({
        activeRoadblocks: updated,
        pendingRadioEvents: newEvents,
        flags: {
          ...state.flags,
          ['roadblock_' + checkpointId]: true,
          suspects_captured: true,
        }
      });
    } else {
      set({
        activeRoadblocks: updated,
      });
    }

    get().saveGame();
  },

  resetCircuitBreaker: () => {
    sound.playBreakerReset();
    const state = get();
    const hours = Math.floor(state.inGameTimeSeconds / 3600);
    const minutes = Math.floor((state.inGameTimeSeconds % 3600) / 60);
    const timeFormatted = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;

    const newFeed = [
      ...state.radioFeed,
      {
        id: `breaker_rst_${Date.now()}`,
        unitId: 'CONSOLE',
        unitName: 'OPERATOR 7',
        timestamp: timeFormatted,
        text: 'MANUAL BREAKER RESET: Main station bus voltage stabilized at 120V / 60Hz. Grid interference purged.',
      },
    ];

    set({
      hazardState: null,
      radioFeed: newFeed,
    });
  },

  triggerHazard: (type: 'power_surge' | 'line_bleed' | 'blown_fuse' = 'power_surge') => {
    sound.playBreakerTrip();
    set({
      hazardState: {
        active: true,
        type,
        title: type === 'line_bleed' ? 'TELEGRAPHIC CROSS-TALK BLEED' : '440V SUBSTATION TRANSFORMER SURGE',
        description: type === 'line_bleed'
          ? 'Trunk line audio crosstalk bleeding into caller frequency. Reset patch relay bus.'
          : 'High voltage fault detected on incoming lines. Circuit breaker overheating!',
        timeRemaining: 15,
        maxTime: 15,
      },
    });
  },

  triggerDilemma: (dilemma: ActiveDilemma) => {
    sound.playDispatchAlarm();
    set({ activeDilemma: dilemma });
  },

  resolveDilemma: (choice: 'A' | 'B') => {
    const state = get();
    const dilemma = state.activeDilemma;
    if (!dilemma) return;

    sound.playDispatchAlarm();
    const chosen = choice === 'A' ? dilemma.optionA : dilemma.optionB;
    const hours = Math.floor(state.inGameTimeSeconds / 3600);
    const minutes = Math.floor((state.inGameTimeSeconds % 3600) / 60);
    const timeFormatted = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;

    const updatedUnits = { ...state.activeUnits };
    const targetUnitKey = Object.keys(updatedUnits).find(
      (k) => k === 'P2' || updatedUnits[k].name.toLowerCase().includes('108') || updatedUnits[k].type === 'police'
    );
    if (targetUnitKey && updatedUnits[targetUnitKey]) {
      updatedUnits[targetUnitKey] = {
        ...updatedUnits[targetUnitKey],
        status: 'dispatched',
        assignedLocation: chosen.sector,
        busyUntil: state.inGameTimeSeconds + 180,
      };
    }

    const newTransmission = {
      id: `rad_dil_${Date.now()}`,
      unitId: 'cruiser_108',
      unitName: 'Cruiser 108 (Vance)',
      timestamp: timeFormatted,
      text: chosen.outcomeLog,
      location: chosen.sector,
    };

    const newPin: PinnedClue = {
      id: `pin_dil_${Date.now()}`,
      text: chosen.outcomeLog,
      sourceSpeaker: 'Cruiser 108',
      callId: 'tactical_dispatch',
      timestamp: timeFormatted,
    };

    const updatedFlags = {
      ...state.flags,
      [chosen.flagToSet]: true,
      dilemma_resolved: choice,
    };

    set({
      activeUnits: updatedUnits,
      activeDilemma: {
        ...dilemma,
        resolvedChoice: choice,
      },
      flags: updatedFlags,
      radioFeed: [...state.radioFeed, newTransmission],
      notebook: {
        ...state.notebook,
        pins: [...state.notebook.pins, newPin],
      },
    });

    setTimeout(() => {
      const cur = get().activeDilemma;
      if (cur && cur.resolvedChoice) {
        set({ activeDilemma: null });
      }
    }, 4500);
  },

  submitVerdict: (suspectId: string, targetId: string, pinnedEvidenceIds: string[], confidenceLevel: ConfidenceLevel = 75) => {
    sound.playPinSound();
    const state = get();
    const currentCase = state.getActiveCase();
    const deduction = currentCase.deduction;

    const suspectCorrect = deduction ? !!deduction.suspectChoices.find(s => s.id === suspectId && s.isCorrect) : true;
    const targetCorrect = deduction ? !!deduction.targetChoices.find(t => t.id === targetId && t.isCorrect) : true;

    // Check pinned evidence
    const selectedPins = state.notebook.pins.filter(p => pinnedEvidenceIds.includes(p.id));
    const pinsText = selectedPins.map(p => p.text.toLowerCase()).join(' ');
    const evidenceCorrect = deduction && deduction.correctEvidenceKeywords.length > 0
      ? deduction.correctEvidenceKeywords.some(kw => pinsText.includes(kw.toLowerCase()))
      : selectedPins.length > 0;

    let baseScore = 0;
    if (suspectCorrect) baseScore += 40;
    if (targetCorrect) baseScore += 40;
    if (evidenceCorrect) baseScore += 20;

    // Confidence Calibration calculation:
    // High confidence (95%) when right gives +5 calibration bonus; when wrong gives -15 overconfidence penalty.
    // Cautious confidence (50%) when wrong softens penalty (+10 epistemic humility); when right gives 0 delta.
    let calibrationDelta = 0;
    if (baseScore >= 80) {
      if (confidenceLevel === 95) calibrationDelta = 5;
      else if (confidenceLevel === 50) calibrationDelta = -5;
    } else {
      if (confidenceLevel === 95) calibrationDelta = -15;
      else if (confidenceLevel === 50) calibrationDelta = 10;
    }

    const score = Math.max(0, Math.min(100, baseScore + calibrationDelta));

    let grade: 'S' | 'A' | 'B' | 'C' | 'F' = 'F';
    if (score >= 95) grade = 'S';
    else if (score >= 80) grade = 'A';
    else if (score >= 60) grade = 'B';
    else if (score >= 40) grade = 'C';

    // Psychological Debrief Metrics
    const classifiedProvenanceCount = state.notebook.pins.filter(p => !!p.provenance).length;
    const echoClassifiedCount = state.notebook.pins.filter(p => p.provenance === 'hearsay_echo').length;
    const abComparisonDone = !!state.flags['ab_comparison_performed'];
    const leadingQuestions = (state.flags['leading_questions_count'] as number) || 0;
    const theoryChallenged = !!(
      (state.workingTheory && state.workingTheory.challenged && state.workingTheory.counterPinIds.length > 0) ||
      state.flags['challenged_bias_in_dialogue']
    );
    const prematureDispatch = !!state.flags['premature_dispatch'];
    const usedQuickScratchpad = !!(
      state.quickScratchpad &&
      (state.quickScratchpad.address || state.quickScratchpad.entrance || state.quickScratchpad.keySound)
    );

    const psychologicalProfile: PsychologicalMetric[] = [
      {
        label: 'Confirmation Bias Resistance',
        concept: '1. Confirmation Bias (Nickerson, 1998)',
        assessment: theoryChallenged && suspectCorrect ? 'EXCELLENT' : suspectCorrect ? 'GOOD' : 'DETECTED',
        positive: suspectCorrect,
        detail: theoryChallenged
          ? 'Actively tested initial hypothesis against contradictory evidence before filing.'
          : suspectCorrect
          ? 'Avoided the primed suspect trap, though without logging formal counter-evidence.'
          : 'Fell into institutional confirmation bias by committing to the primed suspect.',
      },
      {
        label: 'Independent Source Identification',
        concept: '2 & 4. Source Monitoring & Circular Reporting',
        assessment: abComparisonDone || echoClassifiedCount > 0 ? 'EXCELLENT' : evidenceCorrect ? 'GOOD' : 'POOR',
        positive: abComparisonDone || echoClassifiedCount > 0 || evidenceCorrect,
        detail: abComparisonDone
          ? 'Cross-referenced recordings on Dual-Deck A/B Comparator to expose shared broadcast/acoustic provenance.'
          : echoClassifiedCount > 0
          ? 'Correctly flagged secondary witnesses repeating radio/TV broadcasts as Hearsay Echoes.'
          : 'Did not audit whether corroborating callers were repeating a single broadcast source.',
      },
      {
        label: 'Witness Questioning & Reliability',
        concept: '1 & 5. Witness Contamination & Selective Listening',
        assessment: leadingQuestions === 0 && classifiedProvenanceCount >= 2 ? 'EXCELLENT' : leadingQuestions === 0 ? 'GOOD' : 'POOR',
        positive: leadingQuestions === 0,
        detail: leadingQuestions > 0
          ? `Contaminated witness memory with ${leadingQuestions} leading question(s) during live interrogation.`
          : 'Maintained neutral questioning without implanting suspect names into frightened callers.',
      },
      {
        label: 'Working Memory & Triage Discipline',
        concept: '3. Cognitive Load Management (Baddeley)',
        assessment: !prematureDispatch && (usedQuickScratchpad || state.notebook.pins.length >= 3) ? 'EXCELLENT' : !prematureDispatch ? 'GOOD' : 'DETECTED',
        positive: !prematureDispatch,
        detail: prematureDispatch
          ? 'Premature unit dispatch detected before establishing baseline timeline and provenance.'
          : usedQuickScratchpad
          ? 'Externalized working memory via Quick-Log Dispatch Pad during multi-line pressure.'
          : 'Verified evidence pins prior to committing field units.',
      },
      {
        label: 'Epistemic Confidence Calibration',
        concept: '2. Overconfidence vs. Epistemic Calibration',
        assessment: baseScore >= 80 && confidenceLevel >= 75
          ? 'CALIBRATED'
          : baseScore < 80 && confidenceLevel === 95
          ? 'OVERCONFIDENT'
          : baseScore < 80 && confidenceLevel === 50
          ? 'CAUTIOUS'
          : 'CALIBRATED',
        positive: !(baseScore < 80 && confidenceLevel === 95),
        detail: baseScore < 80 && confidenceLevel === 95
          ? 'Committed 95% (Code-3 Certainty) to an unsupported conclusion (-15 calibration penalty).'
          : baseScore < 80 && confidenceLevel === 50
          ? 'Recorded 50% tentative uncertainty on an incomplete theory (+10 epistemic humility).'
          : `Stated ${confidenceLevel}% certainty aligned accurately with empirical evidence strength.`,
      },
    ];

    const feedback = grade === 'S'
      ? 'Flawless investigation. You separated direct observation from circular hearsay, resisted confirmation bias, and uncovered the objective truth.'
      : grade === 'A'
      ? 'Commendable performance. You identified the true dynamics of the incident and calibrated your conclusions effectively.'
      : grade === 'B'
      ? 'Partial success. While key elements were uncovered, cognitive traps or unverified witness assumptions clouded the dossier.'
      : 'Investigation compromised by psychological pitfalls. Premature assumptions or circular reporting led units away from the truth.';

    const hours = Math.floor(state.inGameTimeSeconds / 3600);
    const minutes = Math.floor((state.inGameTimeSeconds % 3600) / 60);
    const timeFormatted = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;

    const completedList = state.completedCaseIds.includes(state.activeCaseId)
      ? state.completedCaseIds
      : [...state.completedCaseIds, state.activeCaseId];

    // Commendation & Badge evaluation
    const currentBadges = [...(state.unlockedBadges || [])];
    const awardBadge = (bId: string) => {
      if (!currentBadges.some(b => b.id === bId)) {
        currentBadges.push({
          id: bId,
          unlockedAt: timeFormatted,
          caseId: state.activeCaseId,
        });
      }
    };

    // 1. Sheriff's Medal of Deduction (Grade S)
    if (grade === 'S') awardBadge('badge_grade_s');

    // 2. Rapid Dispatch Commendation (Under 10 in-game minutes)
    const elapsedMinutes = Math.max(1, (state.inGameTimeSeconds - (22 * 3600)) / 60);
    if (score >= 80 && elapsedMinutes <= 10) awardBadge('badge_swift_response');

    // 3. Acoustics Specialist (4+ pinned clues)
    if (state.notebook.pins.length >= 4) awardBadge('badge_golden_ear');

    // 4. Iron Discernment (Caught culprit & target)
    if (targetCorrect && suspectCorrect) awardBadge('badge_decoy_breaker');

    // 5. Multi-line Hold Veteran
    const hadHold = Object.values(state.calls).some(c => c.status === 'on_hold' || c.holdStartedAt);
    if (hadHold && score >= 60) awardBadge('badge_switchboard_veteran');

    // 6. Anthology Commendations
    if (completedList.length >= 3) awardBadge('badge_anthology_veteran');
    if (completedList.length >= 5) awardBadge('badge_master_archivist');

    // 7. Nickerson Medal of Objectivity (Challenged theory & classified provenance)
    if (theoryChallenged && echoClassifiedCount > 0 && suspectCorrect) {
      awardBadge('badge_epistemic_skeptic');
    }

    // 8. Tektronix Dual-Tape Analyst (Used A/B comparator)
    if (abComparisonDone) {
      awardBadge('badge_forensic_comparator');
    }

    set({
      reportFilingActive: false,
      shiftCompleted: true,
      completedCaseIds: completedList,
      unlockedBadges: currentBadges,
      verdictScore: {
        culpritCorrect: suspectCorrect,
        targetCorrect,
        evidenceCorrect,
        totalScore: score,
        grade,
        feedback,
        submittedAt: timeFormatted,
        confidenceLevel,
        calibrationDelta,
        psychologicalProfile,
      },
    });
    get().saveGame();
  },

  addPinnedClue: (text: string, speaker: string, callId: string, timestamp: string, ambientSourceId?: string, provenance?: ProvenanceType) => {
    sound.playPinSound();
    set((state) => {
      const cleanText = text.trim();
      // Prevent duplicate pins of the exact same text
      if (state.notebook.pins.some((p) => p.text.toLowerCase() === cleanText.toLowerCase())) {
        return state;
      }

      const newPin: PinnedClue = {
        id: `pin_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        text: cleanText,
        sourceSpeaker: speaker,
        callId,
        timestamp,
        ambientSourceId,
        provenance,
      };

      return {
        notebook: {
          ...state.notebook,
          pins: [newPin, ...state.notebook.pins],
        }
      };
    });
    get().saveGame();
  },

  removePinnedClue: (pinId: string) => {
    set((state) => ({
      notebook: {
        ...state.notebook,
        pins: state.notebook.pins.filter((p) => p.id !== pinId),
      }
    }));
    get().saveGame();
  },

  updateFreeNotes: (notes: string) => {
    set((state) => ({
      notebook: {
        ...state.notebook,
        freeNotes: notes,
      }
    }));
    get().saveGame();
  },

  assignPinToTimeline: (pinId: string, slot: string) => {
    set((state) => ({
      notebook: {
        ...state.notebook,
        pins: state.notebook.pins.map((p) => p.id === pinId ? { ...p, timelineSlot: slot } : p),
      }
    }));
  },

  assignPinToCharacter: (pinId: string, charId: string) => {
    set((state) => ({
      notebook: {
        ...state.notebook,
        pins: state.notebook.pins.map((p) => p.id === pinId ? { ...p, characterId: charId } : p),
      }
    }));
    get().saveGame();
  },

  assignPinProvenance: (pinId: string, provenance: ProvenanceType) => {
    sound.playKeypress();
    set((state) => ({
      notebook: {
        ...state.notebook,
        pins: state.notebook.pins.map((p) => p.id === pinId ? { ...p, provenance } : p),
      }
    }));
    get().saveGame();
  },

  setWorkingTheorySuspect: (suspectId: string) => {
    sound.playKeypress();
    set((state) => ({
      workingTheory: {
        suspectId,
        challenged: state.workingTheory?.challenged || false,
        counterPinIds: state.workingTheory?.counterPinIds || [],
      }
    }));
    get().saveGame();
  },

  toggleChallengeCounterPin: (pinId: string) => {
    sound.playPinSound();
    set((state) => {
      const current = state.workingTheory || { suspectId: '', challenged: false, counterPinIds: [] };
      const exists = current.counterPinIds.includes(pinId);
      const updatedIds = exists
        ? current.counterPinIds.filter(id => id !== pinId)
        : [...current.counterPinIds, pinId];
      return {
        workingTheory: {
          ...current,
          challenged: updatedIds.length > 0,
          counterPinIds: updatedIds,
        }
      };
    });
    get().saveGame();
  },

  updateQuickScratchpad: (field, value) => {
    set((state) => ({
      quickScratchpad: {
        ...(state.quickScratchpad || { address: '', entrance: '', suspectDir: '', keySound: '', verification: '' }),
        [field]: value,
      }
    }));
    get().saveGame();
  },

  recordABComparisonDiscovery: (findingText: string, ambientSourceId?: string) => {
    const state = get();
    const hours = Math.floor(state.inGameTimeSeconds / 3600);
    const minutes = Math.floor((state.inGameTimeSeconds % 3600) / 60);
    const timeFormatted = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    set({
      flags: {
        ...state.flags,
        ab_comparison_performed: true,
      }
    });
    state.addPinnedClue(
      findingText,
      'Tektronix A/B Comparator',
      'forensic_ab',
      timeFormatted,
      ambientSourceId,
      'firsthand'
    );
  },

  updateCharacterNotes: (charId: string, notes: string) => {
    set((state) => {
      const char = state.characters[charId];
      if (!char) return state;
      return {
        characters: {
          ...state.characters,
          [charId]: { ...char, notes }
        }
      };
    });
  },

  updateSettings: (newSettings: Partial<GameSettings>) => {
    set((state) => {
      const merged = { ...state.settings, ...newSettings };
      if (newSettings.soundEnabled !== undefined) {
        sound.setMuted(!newSettings.soundEnabled);
      }
      return { settings: merged };
    });
  },

  saveGame: () => {
    const s = get();
    try {
      const snapshot = {
        activeCaseId: s.activeCaseId,
        completedCaseIds: s.completedCaseIds,
        inGameTimeSeconds: s.inGameTimeSeconds,
        flags: s.flags,
        activeUnits: s.activeUnits,
        callQueue: s.callQueue,
        activeCallId: s.activeCallId,
        calls: s.calls,
        notebook: s.notebook,
        characters: s.characters,
        settings: s.settings,
        shiftCompleted: s.shiftCompleted,
        reportFilingActive: s.reportFilingActive,
        verdictScore: s.verdictScore,
        unlockedBadges: s.unlockedBadges,
        activeRoadblocks: s.activeRoadblocks,
        radioFeed: s.radioFeed,
        pendingRadioEvents: s.pendingRadioEvents,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
    } catch (e) {
      console.warn('Failed to save state:', e);
    }
  },

  loadGame: () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return false;
      const parsed = JSON.parse(raw);
      const activeCaseId = parsed.activeCaseId || 'case_1';
      const fallbackCase = ALL_CASES[activeCaseId] || ALL_CASES['case_1'];

      set({
        activeCaseId,
        completedCaseIds: parsed.completedCaseIds || [],
        inGameTimeSeconds: parsed.inGameTimeSeconds ?? 22 * 3600,
        flags: parsed.flags ?? {},
        activeUnits: parsed.activeUnits ?? fallbackCase.initialUnits,
        callQueue: parsed.callQueue ?? [...fallbackCase.initialCallQueue],
        activeCallId: parsed.activeCallId ?? null,
        calls: parsed.calls ?? {},
        notebook: parsed.notebook ?? { pins: [], freeNotes: fallbackCase.initialNotes },
        characters: parsed.characters ?? fallbackCase.characters,
        settings: parsed.settings ?? get().settings,
        shiftCompleted: parsed.shiftCompleted ?? false,
        reportFilingActive: parsed.reportFilingActive ?? false,
        verdictScore: parsed.verdictScore,
        unlockedBadges: parsed.unlockedBadges ?? [],
        activeRoadblocks: parsed.activeRoadblocks ?? [],
        radioFeed: parsed.radioFeed ?? [],
        pendingRadioEvents: parsed.pendingRadioEvents ?? [],
        typewriterActive: false,
      });
      return true;
    } catch (e) {
      console.error('Save corrupted:', e);
      return false;
    }
  },

  resetGame: () => {
    const s = get();
    const currentCase = s.getActiveCase();
    set({
      inGameTimeSeconds: 22 * 3600,
      isPaused: false,
      flags: {},
      activeUnits: { ...currentCase.initialUnits },
      callQueue: [...currentCase.initialCallQueue],
      activeCallId: null,
      calls: {},
      notebook: {
        pins: [],
        freeNotes: currentCase.initialNotes,
      },
      characters: { ...currentCase.characters },
      hazardState: null,
      activeDilemma: null,
      consoleMode: 'switchboard',
      shiftCompleted: false,
      displayedText: '',
      typewriterActive: false,
    });
    get().saveGame();
  }
}));
