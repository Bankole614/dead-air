import { CaseDef } from '../../types/game';

/**
 * CASE 5 — THE LAST BROADCAST
 *
 * Design notes:
 * - Paul establishes that WNDR's transmitter has been physically taken off-air.
 * - Paul also explains that Cart C-6's eight-second station ident is looping
 *   through a local Studio A cue monitor only; it is not being transmitted.
 * - The anonymous caller claims to be outside listening on a car radio, while
 *   the same C-6 loop and tape-splice click are audible behind them.
 * - Pinning "transmitter off-air" and "eight-second cart loop" unlocks the
 *   confrontation. Together, those clues place the caller inside Studio A.
 * - Ruth's call independently confirms Malcolm's identity, the fire location,
 *   and the correct rescue entrance.
 */
export const CASE_5: CaseDef = {
  id: 'case_5',
  number: 5,
  title: 'THE LAST BROADCAST',
  incidentCode: 'INC-1994-1106',
  date: 'NOVEMBER 06, 1994',
  timeWindow: '23:48 - 23:59',
  synopsis:
    'Smoke is pouring from the archive of WNDR, a late-night radio station, and its presenter is missing behind a locked studio door. An anonymous caller insists the fire is at the transmitter tower—but the sound on the line suggests the caller is listening from somewhere that should be silent.',
  difficulty: 'HARD',

  initialUnits: {
    P1: { id: 'P1', type: 'police', name: 'Unit 104', status: 'available' },
    M1: { id: 'M1', type: 'medical', name: 'Medic 2', status: 'available' },
    F1: { id: 'F1', type: 'fire', name: 'Engine 3', status: 'available' },
  },

  characters: {
    PAUL_HARKER: {
      id: 'PAUL_HARKER',
      code: 'C16',
      knownName: 'Paul Harker',
      role: 'Overnight sound engineer',
      claimedLocation: 'Studio A control room, WNDR radio station',
      trustScore: 88,
      contradictionsFound: [],
      notes:
        'Raised the alarm after smoke began entering the studio corridor. Reports that the transmitter exciter tripped at 23:41 and was physically isolated. The automation deck is stuck in CUE, looping Cart C-6 through the local Studio A monitor. He says the presenter, Ruth Adeyemi, was still inside when he last saw her.',
    },
    MALCOLM_VALE: {
      id: 'MALCOLM_VALE',
      code: 'C17',
      knownName: 'Malcolm Vale',
      role: 'Station manager',
      claimedLocation: 'Reported off-site; last said to have left at 23:20',
      trustScore: 54,
      contradictionsFound: [],
      notes:
        'Controls the station office, Studio A and tape-library keys. Has authority over the automation desk and transmitter room. His departure tonight was not witnessed. Staff say he had been arguing with Ruth Adeyemi over a master recording marked BLUE / CART 6.',
    },
    RUTH_ADEYEMI: {
      id: 'RUTH_ADEYEMI',
      code: 'C18',
      knownName: 'Ruth Adeyemi',
      role: 'Late-night presenter and newsreader',
      claimedLocation: 'Production Booth B, WNDR main building',
      trustScore: 79,
      contradictionsFound: [],
      notes:
        'Was presenting the late bulletin shortly before the station went silent. Paul believes she may be trapped in Booth B. She recently asked to make a private copy of a recording from the station archive; the subject of that recording is not yet known.',
    },
  },

  initialCallQueue: ['call_studio_alarm', 'call_north_gate', 'call_booth_distress'],

  initialNotes:
    'OPERATOR DIRECTIVES:\n' +
    '- Smoke and possible open flame are reported in the WNDR tape library. Do not delay dispatching Engine 3.\n' +
    '- Presenter Ruth Adeyemi may be trapped in Production Booth B. Keep Medic 2 available to receive a smoke-inhalation casualty at the main building.\n' +
    '- The correct approach to the tape library and Studio A is the SOUTH LOADING DOOR. The north antenna road leads to a separate transmitter annex and does not connect to the main studio floor.\n' +
    '- Paul Harker reports that the transmitter exciter was physically isolated at 23:41. WNDR 98.6 is off-air; an outside radio cannot receive the station tonight.\n' +
    '- Automation Cart C-6 is stuck in CUE. Its eight-second station ident and the tape-splice click repeat through the nearfield monitor in Studio A only. It is not routed to the transmitter.\n' +
    '- The anonymous caller is pushing responders toward the north antenna road and away from the south loading door. Verify the caller’s location before changing the response route. Keep Unit 104 available to secure the exits and identify anyone leaving the main building.',

  answerKey: {
    truth:
      'Station manager Malcolm Vale had been accepting money from a local demolition contractor in exchange for suppressing WNDR coverage of unsafe riverfront buildings. Presenter Ruth Adeyemi secretly copied a master recording of Vale discussing the arrangement; the original was stored in the tape library and labelled BLUE / CART 6. When Ruth confronted him, Vale locked her inside Production Booth B, started a fire in the tape library to destroy the original recording, and tried to buy time to escape with the remaining copy. He used the internal Studio A phone to call dispatch while pretending to be a taxi driver outside the north gate. He claimed to hear WNDR on his car radio and directed Engine 3 toward the remote transmitter annex, hoping responders would waste time away from the burning archive and the trapped presenter.',
    culprit: 'Malcolm Vale — Station Manager at WNDR radio.',
    fatalContradiction:
      'The anonymous caller claims to be outside at the north gate, listening to WNDR 98.6 on a car radio. Paul has already established that the transmitter exciter was physically isolated at 23:41, so no WNDR signal is reaching outside radios. The caller’s line also carries the same eight-second Cart C-6 station-ident loop and tape-splice click that Paul says are routed only to the nearfield monitor in Studio A, not to the transmitter. The caller therefore cannot be outside listening on a car radio: they are inside Studio A. Malcolm has the keys to that room, his departure was never witnessed, and Ruth later confirms that he locked her in Booth B and started the archive fire.',
  },

  calls: {
    call_studio_alarm: {
      id: 'call_studio_alarm',
      callerId: 'PAUL_HARKER',
      callerNumber: '555-0214',
      callerNameDisplay: 'PAUL HARKER // WNDR STUDIO A',
      scheduledTime: '23:48',
      priority: 'high',
      summary:
        'The overnight engineer reports smoke in the tape library, a missing presenter and a transmitter that has already gone off-air. A short station ident repeats through a local cue monitor.',
      initialNode: 'node_intro',
      nodes: {
        node_intro: {
          id: 'node_intro',
        voiceUrl: '/audio/voices/case5/studio_harker_intro.mp3',
          speaker: 'caller',
          speakerName: 'Paul Harker',
          text:
            'Paul Harker, WNDR engineering. There is smoke coming through the tape-library door and the corridor alarm has started. Ruth Adeyemi was in Booth B a few minutes ago. I cannot raise her now. The transmitter exciter tripped at twenty-three forty-one; I pulled the isolator after the fault. We are off-air. (A short station ident repeats behind him, followed by a dry tape-splice click.) That is Cart C-6 stuck in CUE. It is looping through the little nearfield monitor in Studio A. It is not going out over the transmitter.',
          audioCue: 'breath',
          backgroundClues: ['smoke_alarm', 'cart_c6_ident_loop', 'tape_splice_click', 'studio_ventilation'],
          options: [
            {
              id: 'opt_fire_location',
              label: 'Ask where the smoke is strongest and how responders should enter.',
              next: 'node_fire_location',
            },
            {
              id: 'opt_transmitter_status',
              label: 'Confirm whether any part of WNDR is still broadcasting.',
              next: 'node_transmitter_status',
            },
            {
              id: 'opt_cart_detail',
              label: 'Ask about the repeating station ident and the sound after it.',
              next: 'node_cart_detail',
            },
          ],
        },
        node_fire_location: {
          id: 'node_fire_location',
          speaker: 'caller',
          speakerName: 'Paul Harker',
          text:
            'The tape library, on the south side of the main building. The south loading door opens directly onto that corridor. The north antenna road goes to a separate hut by the mast; it does not connect to the studio floor. If the crew goes there first, they will lose time. Ruth was working in Booth B, past the library corridor.',
          audioCue: 'breath',
          backgroundClues: ['smoke_alarm', 'studio_ventilation'],
          options: [
            {
              id: 'opt_confirm_south_route',
              label: 'Confirm the south loading door is the fastest route to Booth B.',
              next: 'node_south_route_confirmed',
            },
            {
              id: 'opt_end_fire_location',
              label: 'End the call and dispatch the fire crew.',
              next: 'node_complete',
            },
          ],
        },
        node_south_route_confirmed: {
          id: 'node_south_route_confirmed',
          speaker: 'caller',
          speakerName: 'Paul Harker',
          text:
            'Yes. South loading door, then follow the corridor past the tape library to the studio block. The fire door may be hot, so they should not force it without the crew lead checking it. Please tell them someone may still be behind Booth B.',
          audioCue: 'breath',
          backgroundClues: ['smoke_alarm'],
          next: 'node_complete',
        },
        node_transmitter_status: {
          id: 'node_transmitter_status',
          speaker: 'caller',
          speakerName: 'Paul Harker',
          text:
            'Completely off-air. The exciter is isolated at the transmitter rack. The aerial is not carrying our signal. Anyone outside with a portable or car radio will get silence on 98.6, not our station ident. The phones inside the building still work on the emergency circuit.',
          audioCue: 'static',
          backgroundClues: ['cart_c6_ident_loop', 'tape_splice_click'],
          options: [
            {
              id: 'opt_confirm_radio_silence',
              label: 'Ask whether the automation cart can still be heard inside the building.',
              next: 'node_radio_silence',
            },
            {
              id: 'opt_end_transmitter',
              label: 'End the call and record that the station is off-air.',
              next: 'node_complete',
            },
          ],
        },
        node_radio_silence: {
          id: 'node_radio_silence',
          speaker: 'caller',
          speakerName: 'Paul Harker',
          text:
            'Only in Studio A. Cart C-6 is physically stuck in CUE, so its eight-second ident repeats through the nearfield monitor beside the mixing desk. The tape ends with a little splice click. It is a local monitor feed. It cannot be heard on a radio outside because the transmitter is isolated.',
          audioCue: 'static',
          backgroundClues: ['cart_c6_ident_loop', 'tape_splice_click'],
          next: 'node_complete',
        },
        node_cart_detail: {
          id: 'node_cart_detail',
          speaker: 'caller',
          speakerName: 'Paul Harker',
          text:
            'It is the old eight-second ident: “WNDR, the city after dark.” Then the splice click, then it starts again. Cart C-6 is stuck in CUE and the nearfield monitor is the only thing playing it. That monitor is in Studio A, beside the mixing desk. It is not on the programme feed.',
          audioCue: 'static',
          backgroundClues: ['cart_c6_ident_loop', 'tape_splice_click'],
          options: [
            {
              id: 'opt_ask_who_uses_studio_a',
              label: 'Ask who had access to Studio A tonight.',
              next: 'node_studio_access',
            },
            {
              id: 'opt_end_cart_detail',
              label: 'End the call and preserve the audio detail in your notes.',
              next: 'node_complete',
            },
          ],
        },
        node_studio_access: {
          id: 'node_studio_access',
          speaker: 'caller',
          speakerName: 'Paul Harker',
          text:
            'Me, Ruth when she needs the desk, and Malcolm Vale. He is the station manager. He has his own key. He told me he was leaving around twenty-three twenty, but I never saw him go through reception. I was in the equipment room when the alarm started.',
          audioCue: 'breath',
          backgroundClues: ['smoke_alarm'],
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

    call_north_gate: {
      id: 'call_north_gate',
      callerId: 'MALCOLM_VALE',
      callerNumber: '555-0196',
      callerNameDisplay: 'UNKNOWN // NORTH GATE',
      scheduledTime: '23:52',
      priority: 'high',
      summary:
        'An unidentified caller claiming to be a taxi driver at the north gate says the fire is at the transmitter annex and insists the engine avoid the south loading door. The caller claims to hear WNDR on a car radio, although the station is off-air.',
      initialNode: 'node_intro',
      nodes: {
        node_intro: {
          id: 'node_intro',
        voiceUrl: '/audio/voices/case5/north_gate_valle_intro.mp3',
          speaker: 'caller',
          speakerName: 'Unknown Caller',
          text:
            'This is Cab Twelve, I am at the north gate of WNDR. There is smoke by the aerial hut. I have the radio on 98.6 and your station ident keeps coming round every few seconds. Send the engine up the north antenna road. Do not use the south loading door; it is chained shut. There is nobody left in the main building, so keep your people out of there. (The same eight-second ident and dry splice click repeat behind the caller.)',
          audioCue: 'static',
          backgroundClues: ['cart_c6_ident_loop', 'tape_splice_click', 'studio_ventilation'],
          options: [
            {
              id: 'opt_caller_position',
              label: 'Ask the caller to describe exactly what they can see from the north gate.',
              next: 'node_caller_position',
            },
            {
              id: 'opt_south_door',
              label: 'Ask how the caller knows the south loading door is chained.',
              next: 'node_south_door_claim',
            },
            {
              id: 'opt_challenge',
              label: '⚠️ [CHALLENGE] “You are not outside listening to a radio. The transmitter is dead, and that loop is only audible in Studio A.”',
              requiresPin: ['transmitter off-air', 'eight-second cart loop'],
              next: 'node_caught',
              trustDelta: -40,
              effects: [
                { type: 'set_flag', payload: { key: 'culprit_caught', value: true } },
                { type: 'set_flag', payload: { key: 'malcolm_confessed', value: true } },
              ],
            },
          ],
        },
        node_caller_position: {
          id: 'node_caller_position',
          speaker: 'caller',
          speakerName: 'Unknown Caller',
          text:
            'I am beside the north gate in my cab. I can see the red aircraft light on the mast and the fence round the transmitter hut. The main building is further south. The smoke is drifting over the aerial road. You are wasting time asking me questions; send the engine north.',
          audioCue: 'static',
          backgroundClues: ['cart_c6_ident_loop', 'tape_splice_click'],
          options: [
            {
              id: 'opt_ask_radio_detail',
              label: 'Ask what exactly is playing on the caller’s radio.',
              next: 'node_radio_detail',
            },
            {
              id: 'opt_end_position',
              label: 'End the call without changing the original route information.',
              next: 'node_complete',
            },
          ],
        },
        node_radio_detail: {
          id: 'node_radio_detail',
          speaker: 'caller',
          speakerName: 'Unknown Caller',
          text:
            'The station ident. “WNDR, the city after dark.” It repeats, then there is a little click. I do not know what you want me to call it. It is coming through my radio. Now send the fire engine before the whole place goes up.',
          audioCue: 'static',
          backgroundClues: ['cart_c6_ident_loop', 'tape_splice_click'],
          next: 'node_complete',
        },
        node_south_door_claim: {
          id: 'node_south_door_claim',
          speaker: 'caller',
          speakerName: 'Unknown Caller',
          text:
            'I saw the chain across it earlier. There is a heavy padlock on the hasp. You cannot get into the main building from that side. The north road is clear, and the tower hut is where the smoke is. Stop sending people toward the studio.',
          audioCue: 'breath',
          backgroundClues: ['cart_c6_ident_loop', 'tape_splice_click'],
          options: [
            {
              id: 'opt_ask_when_seen',
              label: 'Ask when the caller last saw the south door chained.',
              next: 'node_when_seen',
            },
            {
              id: 'opt_end_door_claim',
              label: 'End the call and compare the claim with Paul’s account.',
              next: 'node_complete',
            },
          ],
        },
        node_when_seen: {
          id: 'node_when_seen',
          speaker: 'caller',
          speakerName: 'Unknown Caller',
          text:
            'A few minutes ago. I was close enough to see it. Look, I have told you everything. No one is trapped inside. Send the engine to the aerial hut.',
          audioCue: 'static',
          backgroundClues: ['cart_c6_ident_loop'],
          next: 'node_complete',
        },
        node_caught: {
          id: 'node_caught',
        voiceUrl: '/audio/voices/case5/north_gate_valle_caught.mp3',
          speaker: 'caller',
          speakerName: 'Malcolm Vale',
          text:
            'Turn that off. You cannot know that. (A chair scrapes; the ident keeps repeating.) All right. I am in Studio A. I used the desk phone. The transmitter is dead and the cart is in CUE. I left the cue monitor running beside the handset to make it sound like a radio in a cab. Ruth copied the blue master reel. She said she would take it to the papers. I locked her in Booth B and set the archive alight to destroy the original. I only needed the fire crew sent to the tower long enough for me to get out. Do not let them open the tape library. The blue reel is still in there.',
          audioCue: 'breath',
          backgroundClues: ['cart_c6_ident_loop', 'tape_splice_click', 'chair_scrape', 'smoke_alarm'],
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

    call_booth_distress: {
      id: 'call_booth_distress',
      callerId: 'RUTH_ADEYEMI',
      callerNumber: '555-0221',
      callerNameDisplay: 'RUTH ADEYEMI // PRODUCTION BOOTH B',
      scheduledTime: '23:57',
      priority: 'high',
      summary:
        'The missing presenter reaches dispatch through an internal emergency handset. She is trapped behind a jammed booth door and confirms the true fire location, the culprit and the correct rescue route.',
      initialNode: 'node_intro',
      nodes: {
        node_intro: {
          id: 'node_intro',
        voiceUrl: '/audio/voices/case5/booth_ruth_intro.mp3',
          speaker: 'caller',
          speakerName: 'Ruth Adeyemi',
          text:
            'This is Ruth Adeyemi, WNDR. I am in Production Booth B. The door will not open and smoke is coming under it. Someone wedged it from the corridor. I can hear the alarm in the tape library. Please do not send the crew to the antenna hut. The fire is in the main building, south side. I need someone at the booth door.',
          audioCue: 'breath',
          backgroundClues: ['coughing', 'door_rattle', 'smoke_alarm'],
          options: [
            {
              id: 'opt_ruth_condition',
              label: 'Ask about her condition and whether she can keep the line open.',
              next: 'node_ruth_condition',
            },
            {
              id: 'opt_ruth_identify',
              label: 'Ask who wedged the door and when she last saw them.',
              next: 'node_ruth_identify',
            },
            {
              id: 'opt_ruth_route',
              label: 'Ask for the safest route to Production Booth B.',
              next: 'node_ruth_route',
            },
          ],
        },
        node_ruth_condition: {
          id: 'node_ruth_condition',
          speaker: 'caller',
          speakerName: 'Ruth Adeyemi',
          text:
            'I am coughing. My eyes are burning, but I can still speak. I have put a wet scarf over my mouth and I am staying low. The smoke is getting thicker. Please tell the medic to wait at the south loading door, not outside the tower road.',
          audioCue: 'breath',
          backgroundClues: ['coughing', 'door_rattle'],
          options: [
            {
              id: 'opt_ruth_keep_low',
              label: 'Tell Ruth to stay low and move away from the smoke under the door.',
              next: 'node_ruth_safety',
            },
            {
              id: 'opt_end_ruth_condition',
              label: 'End the call and prioritise the rescue.',
              next: 'node_complete',
            },
          ],
        },
        node_ruth_safety: {
          id: 'node_ruth_safety',
          speaker: 'caller',
          speakerName: 'Ruth Adeyemi',
          text:
            'I am on the floor, away from the door. I can hear the fire alarm and something falling in the corridor. Please hurry. I do not think the booth door will hold for long.',
          audioCue: 'breath',
          backgroundClues: ['coughing', 'door_rattle', 'smoke_alarm'],
          next: 'node_complete',
        },
        node_ruth_identify: {
          id: 'node_ruth_identify',
          speaker: 'caller',
          speakerName: 'Ruth Adeyemi',
          text:
            'Malcolm Vale. The station manager. He came into Studio A after I told him I had copied the blue master reel. He said that tape would ruin him. I heard him cross the corridor, then the wedge hit the floor outside my door. He was the last person I saw before the smoke started.',
          audioCue: 'breath',
          backgroundClues: ['door_rattle'],
          options: [
            {
              id: 'opt_ruth_motive',
              label: 'Ask what is on the blue master reel.',
              next: 'node_ruth_motive',
            },
            {
              id: 'opt_end_ruth_identity',
              label: 'End the call and relay Malcolm’s name to Unit 104.',
              next: 'node_complete',
            },
          ],
        },
        node_ruth_motive: {
          id: 'node_ruth_motive',
          speaker: 'caller',
          speakerName: 'Ruth Adeyemi',
          text:
            'A recording of Malcolm speaking to a demolition contractor. They paid him to keep our reports about the riverfront buildings off the air. He told them exactly which stories he would bury. I made a copy because the original was going to disappear. He went for the original in the tape library, and I think he started the fire there.',
          audioCue: 'breath',
          backgroundClues: ['coughing', 'smoke_alarm'],
          next: 'node_complete',
        },
        node_ruth_route: {
          id: 'node_ruth_route',
          speaker: 'caller',
          speakerName: 'Ruth Adeyemi',
          text:
            'South loading door. The corridor runs past the tape library, then turns toward the studio block. Booth B is the second door after the glass control room. The north antenna road is outside and leads to the separate mast hut. It will not bring anyone to me.',
          audioCue: 'static',
          backgroundClues: ['door_rattle'],
          options: [
            {
              id: 'opt_ruth_confirm_route',
              label: 'Confirm the crew should ignore the north antenna road.',
              next: 'node_ruth_confirm_route',
            },
            {
              id: 'opt_end_ruth_route',
              label: 'End the call and relay the route to Engine 3.',
              next: 'node_complete',
            },
          ],
        },
        node_ruth_confirm_route: {
          id: 'node_ruth_confirm_route',
          speaker: 'caller',
          speakerName: 'Ruth Adeyemi',
          text:
            'Yes. South loading door, then the main corridor to the studio block. Please tell them I am behind the second booth door. I can hear the engine from somewhere outside, but it sounds far away.',
          audioCue: 'breath',
          backgroundClues: ['coughing', 'door_rattle'],
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
