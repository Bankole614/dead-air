import { CaseDef } from '../../types/game';
import { CALLS_DATABASE, INITIAL_CHARACTERS } from '../story';

export const CASE_1: CaseDef = {
  id: 'case_1',
  number: 1,
  title: 'THE RESERVOIR DECOY',
  incidentCode: 'INC-1994-1014',
  date: 'OCTOBER 14, 1994',
  timeWindow: '22:00 - 23:00',
  synopsis: 'A routine noise complaint gives way to a reported home invasion. But when the homeowner describes details he couldn\'t possibly see, Operator 7 discovers a coordinated diversion pulling police away from county infrastructure.',
  difficulty: 'STANDARD',
  initialUnits: {
    P1: { id: 'P1', type: 'police', name: 'Unit 104 (Patrol)', status: 'available' },
    P2: { id: 'P2', type: 'police', name: 'Unit 108 (Cruiser)', status: 'available' },
    M1: { id: 'M1', type: 'medical', name: 'Medic 3 (Ambulance)', status: 'available' },
    W1: { id: 'W1', type: 'welfare', name: 'Welfare 1 (Social Response)', status: 'available' },
  },
  characters: INITIAL_CHARACTERS,
  calls: CALLS_DATABASE,
  initialCallQueue: ['call_gable'],
  initialNotes: 'CASE 01 DIRECTIVES:\n- Sector 4 night watch.\n- Keep track of caller claimed positions vs acoustic evidence.\n- Dispatch units responsibly.',
  answerKey: {
    truth: 'David Ross was acting as a lookout accomplice, faking a burglary at 412 Blackwood Lane to divert Unit 104 away from the municipal water reservoir.',
    culprit: 'David Ross (Accomplice) & Unknown Infiltrators',
    fatalContradiction: 'Ross claimed to be locked in a dark windowless interior closet, yet accurately described a blue sedan with a hot ticking engine parked across the street.',
  }
};

