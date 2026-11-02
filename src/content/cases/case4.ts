import { CaseDef } from '../../types/game';

/**
 * CASE 4 — THE WEST CAGE
 *
 * Design notes:
 * - The player must connect an audio clue from Clara's call to the same sound
 *   in the unidentified caller's line.
 * - The caller's knowledge of the West Cage's two deadbolts is the second pin.
 * - Pinning both "two-tone chime" and "two deadbolts" unlocks the confrontation.
 * - The caller is Mara Voss, despite the caller display disguising her identity.
 */
export const CASE_4: CaseDef = {
  id: 'case_4',
  number: 4,
  title: 'THE WEST CAGE',
  incidentCode: 'INC-1994-1102',
  date: 'NOVEMBER 02, 1994',
  timeWindow: '22:14 - 22:31',
  synopsis:
    'A fire breaks out beneath the City Records Annex, and a night watchman vanishes behind a locked archive door. A supposedly helpful witness keeps trying to redirect the fire crew—while a sound on the line suggests the witness is nowhere near the street.',
  difficulty: 'HARD',

  initialUnits: {
    P1: { id: 'P1', type: 'police', name: 'Unit 104', status: 'available' },
    M1: { id: 'M1', type: 'medical', name: 'Medic 2', status: 'available' },
    F1: { id: 'F1', type: 'fire', name: 'Engine 3', status: 'available' },
  },

  characters: {
    CLARA_BELL: {
      id: 'CLARA_BELL',
      code: 'C13',
      knownName: 'Clara Bell',
      role: 'Night switchboard clerk',
      claimedLocation: 'Main switchboard, City Records Annex',
      trustScore: 86,
      contradictionsFound: [],
      notes:
        'Raised the alarm after smoke entered the lower corridor. Familiar with the building intercom and the faulty microfilm-room timer. Says watchman Elias Reed went downstairs and did not return.',
    },
    MARA_VOSS: {
      id: 'MARA_VOSS',
      code: 'C14',
      knownName: 'Mara Voss',
      role: 'Deputy Archivist',
      claimedLocation: 'Off-site; told the switchboard she left at 21:42',
      trustScore: 58,
      contradictionsFound: [],
      notes:
        'One of only two staff members authorised to open the West Cage. Her departure was reported but not independently confirmed. The Chief Archivist, the other keyholder, was taken to St. Anne’s Hospital earlier tonight.',
    },
    ELIAS_REED: {
      id: 'ELIAS_REED',
      code: 'C15',
      knownName: 'Elias Reed',
      role: 'Night watchman',
      claimedLocation: 'West Cage, sub-basement; last confirmed location',
      trustScore: 72,
      contradictionsFound: [],
      notes:
        'Night watchman assigned to the lower archive. Last seen carrying the security key log toward the West Cage. May be trapped below the fire doors.',
    },
  },

  initialCallQueue: ['call_archive_alarm', 'call_east_gate', 'call_west_cage'],

  initialNotes:
    'OPERATOR DIRECTIVES:\n' +
    '- Active smoke is reported in the sub-basement. Do not delay dispatching Engine 3.\n' +
    '- Elias Reed is unaccounted for. Establish whether anyone is trapped in the West Cage.\n' +
    '- The West Cage is reached through the lower west corridor. The east loading ramp does not lead directly to it.\n' +
    '- The microfilm-room timer produces a distinctive two-tone chime. Clara says it is audible only in the sealed lower corridor, not from the street.\n' +
    '- Treat any caller attempting to redirect responders as unverified until their location is established. Keep Medic 2 available for smoke inhalation and Unit 104 available to secure the exits.',

  answerKey: {
    truth:
      'Deputy Archivist Mara Voss has been diverting money from a municipal relief-fund archive. The original red ledger, which would expose the missing entries, was secured in the West Cage. When night watchman Elias Reed discovered the altered records, Mara went back into the sub-basement, ignited a records trolley with duplicating solvent, and locked Elias behind the West Cage’s two deadbolts. She then called dispatch while pretending to be a taxi driver outside the east gate. Her plan was to send Engine 3 to the east loading ramp, away from Elias and the west corridor, while she retrieved the ledger and escaped through the service passage.',
    culprit: 'Mara Voss — Deputy Archivist at the City Records Annex.',
    fatalContradiction:
      'The unidentified caller claims to be standing outside at the east gate, but the call carries the same two-tone microfilm timer chime heard on Clara’s line. Clara establishes that the timer is deep inside the sealed lower corridor and cannot be heard from the street. The caller also knows the West Cage has two deadbolts, a restricted security detail not given to the public. Pinning "two-tone chime" and "two deadbolts" establishes that the caller is inside the archive and has privileged access. The keyholder record narrows that access to Mara: the Chief Archivist is in hospital, while Mara’s departure was never verified.',
  },
  deduction: {
    suspectChoices: [
      { id: 'mara_voss', label: 'Mara Voss (Deputy Archivist pretending to be outsider at East Gate)', isCorrect: true },
      { id: 'elias_reed', label: 'Elias Reed (Night watchman trapped in West Cage)', isCorrect: false },
      { id: 'clara_bell', label: 'Clara Bell (Night switchboard clerk)', isCorrect: false },
    ],
    targetChoices: [
      { id: 'ledger_theft', label: 'City Records Annex Sub-Basement (Red Ledger Arson & West Cage Trapping)', isCorrect: true },
      { id: 'east_gate', label: 'East Gate Loading Ramp (Reported Toxic Spill)', isCorrect: false },
      { id: 'hospital', label: 'St. Anne’s Hospital Archive Records', isCorrect: false },
    ],
    correctEvidenceKeywords: ['chime', 'two-tone', 'deadbolt', 'deadbolts', 'corridor', 'solvent', 'ledger'],
  },

  calls: {
    call_archive_alarm: {
      id: 'call_archive_alarm',
      callerId: 'CLARA_BELL',
      callerNumber: '555-0113',
      callerNameDisplay: 'CLARA BELL // CITY RECORDS ANNEX',
      scheduledTime: '22:14',
      priority: 'high',
      summary:
        'The night switchboard clerk reports smoke in the sub-basement and a missing watchman. A repeating two-tone chime is audible behind her.',
      initialNode: 'node_intro',
      nodes: {
        node_intro: {
          id: 'node_intro',
        voiceUrl: '/audio/voices/case4/archive_clara_intro.mp3',
          speaker: 'caller',
          speakerName: 'Clara Bell',
          text:
            'This is Clara Bell at the City Records Annex. The basement alarm has gone off and smoke is pushing under the lower west-stair door. Elias Reed went down to check the West Cage and he has not come back. There is that two-tone chime again—the faulty timer in the microfilm room. It repeats every thirty seconds. You can hear it through the lower corridor, but not from outside the building. Please send the fire brigade.',
          audioCue: 'breath',
          backgroundClues: ['fire_alarm_bell', 'two_tone_microfilm_chime', 'sub_basement_ventilation'],
          options: [
            {
              id: 'opt_stair_access',
              label: 'Ask whether the west stair is passable.',
              next: 'node_stair_access',
            },
            {
              id: 'opt_last_seen',
              label: 'Ask when Elias was last seen and where he was going.',
              next: 'node_last_seen',
            },
            {
              id: 'opt_keyholders',
              label: 'Ask who is authorised to open the West Cage.',
              next: 'node_keyholders',
            },
          ],
        },
        node_stair_access: {
          id: 'node_stair_access',
          speaker: 'caller',
          speakerName: 'Clara Bell',
          text:
            'The west stair door is still open, but the smoke is getting thicker below it. The east loading ramp is clear as far as I know, but that ramp opens by the old furnace room. It does not lead straight to the West Cage.',
          audioCue: 'static',
          backgroundClues: ['fire_alarm_bell', 'sub_basement_ventilation'],
          options: [
            {
              id: 'opt_confirm_route',
              label: 'Confirm that the west stair is the direct route to the West Cage.',
              next: 'node_route_confirmed',
            },
            {
              id: 'opt_end_stair',
              label: 'End the call and act on the reported fire.',
              next: 'node_complete',
            },
          ],
        },
        node_route_confirmed: {
          id: 'node_route_confirmed',
          speaker: 'caller',
          speakerName: 'Clara Bell',
          text:
            'Yes. The west stair opens onto the lower corridor. The cage is at the far end, behind the fire door. Please tell the crew there may be a man behind that door.',
          audioCue: 'breath',
          backgroundClues: ['fire_alarm_bell'],
          next: 'node_complete',
        },
        node_last_seen: {
          id: 'node_last_seen',
          speaker: 'caller',
          speakerName: 'Clara Bell',
          text:
            'A little after ten. He took the security key log and said he was checking the red-folio shelf in the West Cage. He sounded annoyed. He said someone had moved the ledger again.',
          audioCue: 'static',
          backgroundClues: ['two_tone_microfilm_chime'],
          options: [
            {
              id: 'opt_ledger_detail',
              label: 'Ask why a watchman would be checking a ledger.',
              next: 'node_ledger_detail',
            },
            {
              id: 'opt_end_last_seen',
              label: 'End the call and keep the line clear.',
              next: 'node_complete',
            },
          ],
        },
        node_ledger_detail: {
          id: 'node_ledger_detail',
          speaker: 'caller',
          speakerName: 'Clara Bell',
          text:
            'I do not know what was in it. Elias said the red ledger was not where the catalogue said it should be. He was going to check the cage before the morning audit.',
          audioCue: 'static',
          backgroundClues: ['two_tone_microfilm_chime'],
          next: 'node_complete',
        },
        node_keyholders: {
          id: 'node_keyholders',
          speaker: 'caller',
          speakerName: 'Clara Bell',
          text:
            'Only the Chief Archivist and Deputy Archivist Mara Voss have keys for that cage. The Chief was taken to St. Anne’s with a broken wrist at about nine. Mara told me she was leaving at twenty-one forty-two. I did not see her go.',
          audioCue: 'breath',
          backgroundClues: ['fire_alarm_bell'],
          options: [
            {
              id: 'opt_mara_departure',
              label: 'Ask whether anyone confirmed Mara actually left.',
              next: 'node_mara_departure',
            },
            {
              id: 'opt_end_keys',
              label: 'End the call and record the keyholder information.',
              next: 'node_complete',
            },
          ],
        },
        node_mara_departure: {
          id: 'node_mara_departure',
          speaker: 'caller',
          speakerName: 'Clara Bell',
          text:
            'No. She said she was going to the chemist, then she signed the book and left the switchboard area. I was answering another line. I cannot swear she went through the front door.',
          audioCue: 'static',
          backgroundClues: ['fire_alarm_bell'],
          next: 'node_complete',
        },
        node_complete: {
          id: 'node_complete',
          speaker: 'system',
          text: '[CALL TERMINATED // LOG COMMITTED]',
          audioCue: 'click',
          next: 'complete',
        },
      },
    },

    call_east_gate: {
      id: 'call_east_gate',
      callerId: 'MARA_VOSS',
      callerNumber: '555-0188',
      callerNameDisplay: 'UNKNOWN // EAST LOADING BAY',
      scheduledTime: '22:19',
      priority: 'high',
      summary:
        'An unidentified caller claiming to be a taxi driver insists the fire crew use the east loading ramp. Their line carries a sound Clara identified as coming only from the sealed lower corridor.',
      initialNode: 'node_intro',
      nodes: {
        node_intro: {
          id: 'node_intro',
        voiceUrl: '/audio/voices/case4/east_gate_mara_intro.mp3',
          speaker: 'caller',
          speakerName: 'Unknown Caller',
          text:
            'Listen, I am outside the Records Annex by the east gate. Taxi driver. I saw smoke in the lower windows. Send your fire engine through the east loading ramp and keep them away from the west stair. (A two-tone chime repeats faintly behind the caller.) The West Cage has two deadbolts; they are both thrown. Nobody is in there. There is no reason to send anyone down that side.',
          audioCue: 'static',
          backgroundClues: ['two_tone_microfilm_chime', 'sub_basement_ventilation', 'metal_door_latch'],
          options: [
            {
              id: 'opt_caller_location',
              label: 'Ask the caller to establish their exact position outside.',
              next: 'node_location',
            },
            {
              id: 'opt_cage_knowledge',
              label: 'Ask how a taxi driver knows the West Cage has two deadbolts.',
              next: 'node_cage_knowledge',
            },
            {
              id: 'opt_challenge',
              label: '⚠️ [CHALLENGE] “You are not outside. That is the microfilm timer, and you know a restricted lock detail.”',
              requiresPin: ['two-tone chime', 'two deadbolts'],
              next: 'node_caught',
              trustDelta: -40,
              effects: [
                { type: 'set_flag', payload: { key: 'culprit_caught', value: true } },
                { type: 'set_flag', payload: { key: 'mara_confessed', value: true } },
              ],
            },
          ],
        },
        node_location: {
          id: 'node_location',
          speaker: 'caller',
          speakerName: 'Unknown Caller',
          text:
            'At the street payphone, just outside the east gate. I can see the loading bay doors from here. There is rain coming down hard. I am not going into that place.',
          audioCue: 'static',
          backgroundClues: ['two_tone_microfilm_chime', 'sub_basement_ventilation'],
          options: [
            {
              id: 'opt_question_chime',
              label: 'Ask what the repeating two-tone sound is.',
              next: 'node_chime_denial',
            },
            {
              id: 'opt_end_location',
              label: 'End the call without accepting the caller’s suggested route.',
              next: 'node_complete',
            },
          ],
        },
        node_chime_denial: {
          id: 'node_chime_denial',
          speaker: 'caller',
          speakerName: 'Unknown Caller',
          text:
            'A crossing signal, probably. There are roads all around here. Stop listening to noises and get that engine moving. Use the east ramp.',
          audioCue: 'static',
          backgroundClues: ['two_tone_microfilm_chime'],
          next: 'node_complete',
        },
        node_cage_knowledge: {
          id: 'node_cage_knowledge',
          speaker: 'caller',
          speakerName: 'Unknown Caller',
          text:
            'I did maintenance there once. Old buildings, old locks. The West Cage has two deadbolts, one high and one low. You do not need to know how I know. Just keep your people on the east side.',
          audioCue: 'breath',
          backgroundClues: ['two_tone_microfilm_chime', 'metal_door_latch'],
          options: [
            {
              id: 'opt_ask_maintenance',
              label: 'Ask when they last worked inside the archive.',
              next: 'node_maintenance_date',
            },
            {
              id: 'opt_end_cage',
              label: 'End the call and verify the caller’s story independently.',
              next: 'node_complete',
            },
          ],
        },
        node_maintenance_date: {
          id: 'node_maintenance_date',
          speaker: 'caller',
          speakerName: 'Unknown Caller',
          text:
            'Years ago. I do not remember dates. Look, I have told you what I saw. Get the fire crew to the east ramp and stop wasting time.',
          audioCue: 'static',
          backgroundClues: ['two_tone_microfilm_chime'],
          next: 'node_complete',
        },
        node_caught: {
          id: 'node_caught',
        voiceUrl: '/audio/voices/case4/east_gate_mara_caught.mp3',
          speaker: 'caller',
          speakerName: 'Mara Voss',
          text:
            'No. No, you cannot hear that from the gate. I am in the microfilm room. I came back for the red ledger after Elias found the altered entries. I used duplicating solvent on the records trolley. I only needed the lower corridor empty. Elias was not supposed to be in the cage when I threw the bolts. I was going to get the ledger and leave before anyone came down. Please—do not tell them I am still inside.',
          audioCue: 'breath',
          backgroundClues: ['two_tone_microfilm_chime', 'fire_alarm_bell', 'paper_shuffling'],
          next: 'node_complete',
        },
        node_complete: {
          id: 'node_complete',
          speaker: 'system',
          text: '[CALL TERMINATED // LOG COMMITTED]',
          audioCue: 'click',
          next: 'complete',
        },
      },
    },

    call_west_cage: {
      id: 'call_west_cage',
      callerId: 'ELIAS_REED',
      callerNumber: '555-0197',
      callerNameDisplay: 'ELIAS REED // WEST CAGE',
      scheduledTime: '22:26',
      priority: 'high',
      summary:
        'The missing night watchman reaches an internal emergency handset from behind the West Cage door. He confirms who locked him in and why the fire was started.',
      initialNode: 'node_intro',
      nodes: {
        node_intro: {
          id: 'node_intro',
        voiceUrl: '/audio/voices/case4/west_cage_elias_intro.mp3',
          speaker: 'caller',
          speakerName: 'Elias Reed',
          text:
            'This is Elias Reed. I am in the West Cage. There is smoke coming through the bottom of the door and I cannot shift either bolt from this side. I found the red ledger in the wrong drawer. Mara Voss came down for it. She locked me in, then I heard her running toward the microfilm room. There is an emergency wall telephone in here. Please get someone to this door.',
          audioCue: 'breath',
          backgroundClues: ['coughing', 'metal_door_rattle', 'distant_fire_alarm'],
          options: [
            {
              id: 'opt_elias_condition',
              label: 'Ask about his injuries and the amount of smoke inside.',
              next: 'node_condition',
            },
            {
              id: 'opt_elias_identity',
              label: 'Ask him to confirm who locked the cage.',
              next: 'node_identity',
            },
            {
              id: 'opt_elias_fire',
              label: 'Ask what happened before the fire started.',
              next: 'node_fire_timeline',
            },
          ],
        },
        node_condition: {
          id: 'node_condition',
          speaker: 'caller',
          speakerName: 'Elias Reed',
          text:
            'I am coughing, but I can still speak. The smoke is getting lower. My eyes are burning. Send the medic with the fire crew, not after them. I do not know how long this door will hold.',
          audioCue: 'breath',
          backgroundClues: ['coughing', 'metal_door_rattle'],
          options: [
            {
              id: 'opt_elias_stay_low',
              label: 'Tell Elias to stay low and keep the handset away from the door seam.',
              next: 'node_safety_advice',
            },
            {
              id: 'opt_end_condition',
              label: 'End the call and prioritise the rescue.',
              next: 'node_complete',
            },
          ],
        },
        node_safety_advice: {
          id: 'node_safety_advice',
          speaker: 'caller',
          speakerName: 'Elias Reed',
          text:
            'I am on the floor now. I can hear the fire alarm through the wall. Please hurry. The inner latch is hot.',
          audioCue: 'breath',
          backgroundClues: ['coughing', 'distant_fire_alarm'],
          next: 'node_complete',
        },
        node_identity: {
          id: 'node_identity',
          speaker: 'caller',
          speakerName: 'Elias Reed',
          text:
            'Mara Voss. I know her voice. She said the red ledger would ruin her and that nobody was going to read it. She had the deputy archivist’s brass key ring. I heard both bolts slam after she shut the door.',
          audioCue: 'breath',
          backgroundClues: ['metal_door_rattle'],
          options: [
            {
              id: 'opt_elias_motive',
              label: 'Ask what was in the red ledger.',
              next: 'node_ledger_motive',
            },
            {
              id: 'opt_end_identity',
              label: 'End the call and relay his identification to police.',
              next: 'node_complete',
            },
          ],
        },
        node_ledger_motive: {
          id: 'node_ledger_motive',
          speaker: 'caller',
          speakerName: 'Elias Reed',
          text:
            'The municipal relief fund. Names, payments, amounts—some of the entries were changed after the cheques went out. I found the original figures. Mara knew I had seen them. That is why she came back tonight.',
          audioCue: 'breath',
          backgroundClues: ['coughing', 'distant_fire_alarm'],
          next: 'node_complete',
        },
        node_fire_timeline: {
          id: 'node_fire_timeline',
          speaker: 'caller',
          speakerName: 'Elias Reed',
          text:
            'She asked me to check the red ledger. When I turned toward the shelf, she pushed me inside and threw the upper and lower bolts. A few seconds later I smelled that sharp duplicating fluid. Then the alarm started. The fire is in the microfilm corridor, not in this cage.',
          audioCue: 'breath',
          backgroundClues: ['coughing', 'metal_door_rattle', 'distant_fire_alarm'],
          options: [
            {
              id: 'opt_elias_route',
              label: 'Ask which route responders should use to reach him.',
              next: 'node_rescue_route',
            },
            {
              id: 'opt_end_timeline',
              label: 'End the call and relay the fire location to Engine 3.',
              next: 'node_complete',
            },
          ],
        },
        node_rescue_route: {
          id: 'node_rescue_route',
          speaker: 'caller',
          speakerName: 'Elias Reed',
          text:
            'West stair. The cage is at the far end of the lower corridor. The east ramp goes to the furnace room. Do not let anyone waste time down there. I can hear the timer—two notes, every half-minute. I am right beside it.',
          audioCue: 'breath',
          backgroundClues: ['two_tone_microfilm_chime', 'metal_door_rattle'],
          next: 'node_complete',
        },
        node_complete: {
          id: 'node_complete',
          speaker: 'system',
          text: '[CALL TERMINATED // LOG COMMITTED]',
          audioCue: 'click',
          next: 'complete',
        },
      },
    },
  },
};
