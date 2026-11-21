export type UnitType = 'police' | 'medical' | 'fire' | 'welfare';

export interface DispatchUnit {
  id: string;
  type: UnitType;
  name: string;
  status: 'available' | 'dispatched' | 'returning';
  assignedLocation?: string;
  busyUntil?: number; // timestamp in game seconds
}

export type Priority = 'low' | 'medium' | 'high' | 'critical';

export type ProvenanceType = 'firsthand' | 'hearsay_echo' | 'interpretation';

export type ConfidenceLevel = 50 | 75 | 95;

export interface Effect {
  type: 'dispatch_lock' | 'unlock_pin' | 'set_flag' | 'alter_trust' | 'queue_call' | 'queue_event';
  payload: any;
}

export interface DialogueOption {
  id: string;
  label: string;
  next: string;
  requiresPin?: string[]; // IDs or keywords required in notebook pins
  requiresFlag?: { key: string; value: boolean };
  trustDelta?: number;
  biasType?: 'leading_question' | 'neutral_inquiry' | 'challenge_theory';
  effects?: Effect[];
}

export interface DialogueNode {
  id: string;
  speaker: 'caller' | 'operator' | 'system' | 'radio';
  speakerName?: string;
  text: string;
  audioCue?: 'ring' | 'click' | 'static' | 'hangup' | 'breath' | 'train' | 'door_knock' | 'siren' | 'rain';
  voiceUrl?: string; // audio file path, e.g. "/audio/voices/case1/gable_intro.mp3"
  backgroundClues?: string[]; // tags like ["distant_train", "dog_bark", "creaking_floor"]
  ambientSourceId?: string; // shared broadcast or acoustic fingerprint ID for A/B comparison
  forensicReveal?: string; // what A/B comparison or deep spectral scrub reveals about this line
  options?: DialogueOption[];
  next?: string; // auto-advance if no options
  delayMs?: number; // pause before showing
}

export interface CallDef {
  id: string;
  callerId: string;
  callerNumber: string; // e.g. "BLOCKED", "555-0142"
  callerNameDisplay: string;
  scheduledTime: string; // "22:02", "22:15", "22:40"
  priority: Priority;
  initialNode: string;
  nodes: Record<string, DialogueNode>;
  summary: string;
}

export interface ActiveCall {
  callDefId: string;
  status: 'incoming' | 'active' | 'on_hold' | 'completed' | 'abandoned';
  currentNodeId: string;
  history: Array<{
    nodeId: string;
    speaker: 'caller' | 'operator' | 'system' | 'radio';
    speakerName?: string;
    text: string;
    timestamp: string;
    audioCue?: string;
    voiceUrl?: string;
    backgroundClues?: string[];
    ambientSourceId?: string;
    forensicReveal?: string;
  }>;
  holdStartedAt?: number; // game time seconds
  agitationLevel: number; // 0 to 100
  startTime: string;
}

export interface PinnedClue {
  id: string;
  text: string;
  sourceSpeaker: string;
  callId: string;
  timestamp: string;
  tags?: string[];
  userNotes?: string;
  timelineSlot?: string; // e.g. "22:00-22:15"
  characterId?: string; // e.g. "C1", "C2", "C3", "DISPATCH"
  provenance?: ProvenanceType; // 'firsthand' | 'hearsay_echo' | 'interpretation'
  ambientSourceId?: string; // shared broadcast or acoustic fingerprint ID
}

export interface CharacterCard {
  id: string;
  code: string; // e.g. "C1"
  knownName: string;
  role: string;
  claimedLocation: string;
  trustScore: number; // hidden 0 - 100
  contradictionsFound: string[];
  notes: string;
}

export interface RadioTransmission {
  id: string;
  unitId: string;
  unitName: string;
  timestamp: string;
  text: string;
  location?: string;
  clues?: string[];
  ambientSourceId?: string;
}

export interface CaseDeductionConfig {
  suspectChoices: Array<{ id: string; label: string; isCorrect: boolean }>;
  targetChoices: Array<{ id: string; label: string; isCorrect: boolean }>;
  correctEvidenceKeywords: string[];
}

export interface PsychologicalMetric {
  label: string;
  concept: string;
  assessment: 'EXCELLENT' | 'GOOD' | 'DETECTED' | 'POOR' | 'CALIBRATED' | 'OVERCONFIDENT' | 'CAUTIOUS';
  positive: boolean;
  detail: string;
}

export interface VerdictScore {
  culpritCorrect: boolean;
  targetCorrect: boolean;
  evidenceCorrect: boolean;
  totalScore: number;
  grade: 'S' | 'A' | 'B' | 'C' | 'F';
  feedback: string;
  submittedAt: string;
  confidenceLevel?: ConfidenceLevel;
  calibrationDelta?: number;
  psychologicalProfile?: PsychologicalMetric[];
}

export interface CaseDef {
  id: string;
  number: number;
  title: string;
  incidentCode: string;
  date: string;
  timeWindow: string;
  synopsis: string;
  difficulty: 'STANDARD' | 'HARD' | 'CRITICAL';
  supervisorBiasBrief?: {
    supervisorName: string;
    suspectFramed: string;
    memoText: string;
    biasTrapExplanation: string;
  };
  initialUnits: Record<string, DispatchUnit>;
  characters: Record<string, CharacterCard>;
  calls: Record<string, CallDef>;
  initialCallQueue: string[];
  initialNotes: string;
  deduction?: CaseDeductionConfig;
  answerKey: {
    truth: string;
    culprit: string;
    fatalContradiction: string;
  };
}

export interface WorkstationHazard {
  active: boolean;
  type: 'power_surge' | 'line_bleed' | 'blown_fuse';
  title: string;
  description: string;
  timeRemaining: number;
  maxTime: number;
}

export interface DilemmaChoice {
  id: string;
  title: string;
  description: string;
  sector: string;
  requiredUnit: string;
  outcomeLog: string;
  consequenceSummary: string;
  flagToSet: string;
}

export interface ActiveDilemma {
  id: string;
  title: string;
  urgentBrief: string;
  timestamp: string;
  optionA: DilemmaChoice;
  optionB: DilemmaChoice;
  resolvedChoice?: 'A' | 'B';
}

export type ConsoleMode = 'switchboard' | 'map' | 'evidence' | 'scanner';

export interface WorkingTheory {
  suspectId: string;
  challenged: boolean;
  counterPinIds: string[];
}

export interface QuickScratchpad {
  address: string;
  entrance: string;
  suspectDir: string;
  keySound: string;
  verification: string;
}

export interface ShiftState {
  activeCaseId: string;
  completedCaseIds: string[];
  inGameTimeSeconds: number; // starts at 22:00 = 79200 seconds
  isPaused: boolean;
  timeSpeed: number; // 1 = real, 5 = accelerated game minute
  flags: Record<string, boolean | string | number>;
  activeUnits: Record<string, DispatchUnit>;
  callQueue: string[]; // call IDs waiting
  activeCallId: string | null;
  calls: Record<string, ActiveCall>;
  notebook: {
    pins: PinnedClue[];
    freeNotes: string;
  };
  workingTheory?: WorkingTheory;
  quickScratchpad?: QuickScratchpad;
  characters: Record<string, CharacterCard>;
  radioFeed: RadioTransmission[];
  pendingRadioEvents: Array<{
    triggerTime: number;
    transmission: RadioTransmission;
  }>;
  reportFilingActive: boolean;
  verdictScore?: VerdictScore;
  unlockedBadges: Array<{ id: string; unlockedAt: string; caseId: string }>;
  scannerFrequency: number; // e.g. 154.80
  scannerMessages: Array<{
    id: string;
    freq: number;
    channelName: string;
    timestamp: string;
    speaker: string;
    text: string;
  }>;
  activeRoadblocks: string[];
  hazardState: WorkstationHazard | null;
  activeDilemma: ActiveDilemma | null;
  consoleMode: ConsoleMode;
  consequences: Array<{
    id: string;
    triggerTimeSeconds: number;
    description: string;
    action: () => void;
  }>;
  shiftCompleted: boolean;
  endingId?: 'dawn' | 'static' | 'dead_air' | 'impossible';
}

