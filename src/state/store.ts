import { create } from 'zustand';
import { ShiftState, UnitType, PinnedClue, DialogueOption, CaseDef } from '../types/game';
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
  
  // Notebook actions
  addPinnedClue: (text: string, speaker: string, callId: string, timestamp: string) => void;
  removePinnedClue: (pinId: string) => void;
  updateFreeNotes: (notes: string) => void;
  assignPinToTimeline: (pinId: string, slot: string) => void;
  assignPinToCharacter: (pinId: string, charId: string) => void;
  updateCharacterNotes: (charId: string, notes: string) => void;

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
  characters: ALL_CASES['case_1'].characters,
  consequences: [],
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
      inGameTimeSeconds: 22 * 3600,
      shiftCompleted: false,
      flags: {},
      displayedText: '',
      typewriterActive: false,
    });
    get().saveGame();
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

    // Dynamic queue advancement across any active case
    const currentCase = state.getActiveCase();
    const caseCallKeys = Object.keys(currentCase.calls);
    const updatedQueue = [...state.callQueue];
    let queueChanged = false;

    for (let i = 0; i < caseCallKeys.length; i++) {
      const cId = caseCallKeys[i];
      const isDone = state.calls[cId]?.status === 'completed';
      const isStarted = !!state.calls[cId] || updatedQueue.includes(cId);

      if (!isStarted && !isDone) {
        const prevCallDone = i === 0 || state.calls[caseCallKeys[i - 1]]?.status === 'completed';
        if (prevCallDone) {
          updatedQueue.push(cId);
          queueChanged = true;
          sound.startPhoneRing();
          break;
        }
      }
    }

    // Increase agitation for callers on hold
    const updatedCalls = { ...state.calls };
    let callsChanged = false;
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

    // Check shift completion (when all calls in current case are finished)
    const allCallsDone = caseCallKeys.length > 0 && caseCallKeys.every(id => state.calls[id]?.status === 'completed');
    let shiftFinished: boolean = state.shiftCompleted;
    if (allCallsDone && !state.shiftCompleted) {
      shiftFinished = true;
      const completedList = state.completedCaseIds.includes(state.activeCaseId)
        ? state.completedCaseIds
        : [...state.completedCaseIds, state.activeCaseId];
      set({ completedCaseIds: completedList });
    }

    set({
      inGameTimeSeconds: newGameTime,
      activeUnits: unitsUpdated ? updatedUnits : state.activeUnits,
      callQueue: queueChanged ? updatedQueue : state.callQueue,
      calls: callsChanged ? updatedCalls : state.calls,
      shiftCompleted: shiftFinished,
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
          backgroundClues: initialNode.backgroundClues,
        }
      ],
      agitationLevel: 0,
      startTime: timeFormatted,
    };

    if (initialNode.audioCue === 'static') {
      sound.playStaticBurst(0.6);
    }

    // Remove from queue if present
    const newQueue = state.callQueue.filter(id => id !== callId);

    set({
      activeCallId: callId,
      callQueue: newQueue,
      calls: {
        ...state.calls,
        [callId]: { ...newCall, status: 'active' },
      },
      displayedText: initialNode.text,
      typewriterActive: state.settings.textSpeed !== 'instant',
    });
  },

  holdCall: (callId: string) => {
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
        backgroundClues: nextNode.backgroundClues,
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
  },

  finishTypewriter: () => set({ typewriterActive: false }),

  dispatchUnit: (unitId: string, location: string, durationGameSeconds = 1200) => {
    sound.playDispatchAlarm();
    set((state) => {
      const unit = state.activeUnits[unitId];
      if (!unit || unit.status !== 'available') return state;

      return {
        activeUnits: {
          ...state.activeUnits,
          [unitId]: {
            ...unit,
            status: 'dispatched',
            assignedLocation: location,
            busyUntil: state.inGameTimeSeconds + durationGameSeconds,
          }
        }
      };
    });
  },

  addPinnedClue: (text: string, speaker: string, callId: string, timestamp: string) => {
    sound.playPinSound();
    set((state) => {
      const newPin: PinnedClue = {
        id: `pin_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        text: text.trim(),
        sourceSpeaker: speaker,
        callId,
        timestamp,
      };

      return {
        notebook: {
          ...state.notebook,
          pins: [newPin, ...state.notebook.pins],
        }
      };
    });
  },

  removePinnedClue: (pinId: string) => {
    set((state) => ({
      notebook: {
        ...state.notebook,
        pins: state.notebook.pins.filter((p) => p.id !== pinId),
      }
    }));
  },

  updateFreeNotes: (notes: string) => {
    set((state) => ({
      notebook: {
        ...state.notebook,
        freeNotes: notes,
      }
    }));
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
      shiftCompleted: false,
      displayedText: '',
      typewriterActive: false,
    });
    get().saveGame();
  }
}));
