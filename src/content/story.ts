import { CallDef, CharacterCard } from '../types/game';

export const INITIAL_CHARACTERS: Record<string, CharacterCard> = {
  C0: {
    id: 'C0',
    code: 'C0',
    knownName: 'Martha Gable',
    role: 'Elderly resident, Elm Street',
    claimedLocation: '114 Elm Street, Apt 2B',
    trustScore: 90,
    contradictionsFound: [],
    notes: 'Elderly resident. Frequently reports nighttime sounds, but usually harmless.',
  },
  C1: {
    id: 'C1',
    code: 'C1',
    knownName: 'David Ross',
    role: 'Alleged homeowner in distress',
    claimedLocation: '412 Blackwood Lane',
    trustScore: 40,
    contradictionsFound: [],
    notes: 'Claims to be locked inside upstairs interior closet hiding from an intruder.',
  },
  C3: {
    id: 'C3',
    code: 'C3',
    knownName: 'Subject 3 / "The Static Voice"',
    role: 'Unregistered caller / Recurring voice',
    claimedLocation: 'UNKNOWN (Signal bounces)',
    trustScore: 50,
    contradictionsFound: [],
    notes: 'Flagged in old log files as harmless prank caller. But how does he know our unit logs?',
  },
  OFFICER_MILLER: {
    id: 'OFFICER_MILLER',
    code: 'UNIT-104',
    knownName: 'Officer Miller',
    role: 'Patrol Unit 104',
    claimedLocation: 'Sector 4 Patrol',
    trustScore: 70,
    contradictionsFound: [],
    notes: 'Night patrol officer assigned to Blackwood and River districts.',
  }
};

export const CALLS_DATABASE: Record<string, CallDef> = {
  call_gable: {
    id: 'call_gable',
    callerId: 'C0',
    callerNumber: '555-0188',
    callerNameDisplay: 'GABLE, M. (114 ELM ST)',
    scheduledTime: '22:02',
    priority: 'low',
    summary: 'Noise complaint: scraping noises in the alley behind Elm St.',
    initialNode: 'gable_intro',
    nodes: {
      gable_intro: {
        id: 'gable_intro',
        voiceUrl: '/audio/voices/case1/gable_intro.mp3',
        speaker: 'caller',
        speakerName: 'Martha Gable',
        text: 'Hello? Emergency? I... I hate to be a nuisance at this hour, but there is someone scraping along the brickwork behind my bedroom.',
        audioCue: 'ring',
        options: [
          {
            id: 'opt_gable_1',
            label: '"Can you tell me your exact address and if you are in immediate danger, ma\'am?"',
            next: 'gable_address',
          },
          {
            id: 'opt_gable_2',
            label: '"Are the windows locked, Mrs. Gable? Have you seen anyone outside?"',
            next: 'gable_details',
          },
          {
            id: 'opt_gable_3',
            label: '"Ma\'am, this line is reserved for critical emergencies. Is this an intruder?"',
            next: 'gable_impatient',
            trustDelta: -5,
          }
        ]
      },
      gable_address: {
        id: 'gable_address',
        voiceUrl: '/audio/voices/case1/gable_address.mp3',
        speaker: 'caller',
        speakerName: 'Martha Gable',
        text: '114 Elm Street, second floor. No, I\'m inside with my deadbolts fastened. It just sounds like metal dragging on gravel. It stopped for a second, then started again.',
        backgroundClues: ['scraping_metal', 'muffled_wind'],
        options: [
          {
            id: 'opt_gable_dispatch_welfare',
            label: '[DISPATCH] "Stay inside, Mrs. Gable. I\'m dispatching a Welfare Check unit to inspect the alley."',
            next: 'gable_dispatched',
            effects: [
              { type: 'dispatch_lock', payload: { unitType: 'welfare', location: '114 Elm Street' } },
              { type: 'set_flag', payload: { key: 'gable_unit_dispatched', value: true } },
            ]
          },
          {
            id: 'opt_gable_reassure',
            label: '"The wind picks up trash in the alley frequently tonight. Stay away from the glass, and call us if you see a figure."',
            next: 'gable_reassured',
          }
        ]
      },
      gable_details: {
        id: 'gable_details',
        voiceUrl: '/audio/voices/case1/gable_details.mp3',
        speaker: 'caller',
        speakerName: 'Martha Gable',
        text: 'Yes, locks are on. I peered through the blinds, but the streetlamp on Elm has been flickering out all week. It\'s pitch black down there. Wait... I heard a recycling bin tumble over.',
        backgroundClues: ['cat_hiss', 'clattering_metal'],
        options: [
          {
            id: 'opt_gable_dispatch_welfare_2',
            label: '[DISPATCH] "Sending Welfare unit to check the alleyway now. Keep your doors locked."',
            next: 'gable_dispatched',
            effects: [
              { type: 'dispatch_lock', payload: { unitType: 'welfare', location: '114 Elm Street' } },
              { type: 'set_flag', payload: { key: 'gable_unit_dispatched', value: true } },
            ]
          },
          {
            id: 'opt_gable_cat',
            label: '"Sounds like stray animals or raccoons knocked a bin over. Don\'t go outside. We\'ll keep a patrol note."',
            next: 'gable_reassured',
          }
        ]
      },
      gable_impatient: {
        id: 'gable_impatient',
        voiceUrl: '/audio/voices/case1/gable_impatient.mp3',
        speaker: 'caller',
        speakerName: 'Martha Gable',
        text: 'I know what the line is for, young man! My late husband was in precinct 3! You don\'t have to be curt with an old woman alone in the dark.',
        options: [
          {
            id: 'opt_gable_apology',
            label: '"My apologies, ma\'am. We\'re monitoring the sector. Lock your doors and call back if anything escalates."',
            next: 'gable_reassured',
          }
        ]
      },
      gable_dispatched: {
        id: 'gable_dispatched',
        voiceUrl: '/audio/voices/case1/gable_dispatched.mp3',
        speaker: 'caller',
        speakerName: 'Martha Gable',
        text: 'Thank you, operator. You\'re very kind. I\'ll leave the porch light flicked on for them. Goodnight.',
        audioCue: 'hangup',
        next: 'call_complete',
      },
      gable_reassured: {
        id: 'gable_reassured',
        voiceUrl: '/audio/voices/case1/gable_reassured.mp3',
        speaker: 'caller',
        speakerName: 'Martha Gable',
        text: 'Alright... maybe you\'re right. Old ears play tricks in the drafts. Thank you for answering, dear. Goodnight.',
        audioCue: 'hangup',
        next: 'call_complete',
      },
      call_complete: {
        id: 'call_complete',
        speaker: 'system',
        text: '[CALL TERMINATED // LINE CLEARED]',
        audioCue: 'click',
      }
    }
  },

  call_ross: {
    id: 'call_ross',
    callerId: 'C1',
    callerNumber: '555-0911',
    callerNameDisplay: 'ROSS, D. (412 BLACKWOOD LN)',
    scheduledTime: '22:18',
    priority: 'high',
    summary: 'Reported home invasion in progress at 412 Blackwood Lane. Caller claims to be trapped inside upstairs closet.',
    initialNode: 'ross_intro',
    nodes: {
      ross_intro: {
        id: 'ross_intro',
        voiceUrl: '/audio/voices/case1/ross_intro.mp3',
        speaker: 'caller',
        speakerName: 'David Ross',
        text: '(Whispering, heavy ragged breathing) Oh God... please... don\'t make me talk loud. There\'s someone downstairs. They just shattered the glass in the back patio door.',
        audioCue: 'breath',
        backgroundClues: ['glass_shatter', 'heavy_breath'],
        options: [
          {
            id: 'opt_ross_where_are_you',
            label: '"Stay as quiet as possible. Where inside the house are you right now?"',
            next: 'ross_location',
          },
          {
            id: 'opt_ross_who_is_it',
            label: '"Can you hear how many people? Are they speaking?"',
            next: 'ross_voices',
          },
          {
            id: 'opt_ross_instant_dispatch',
            label: '[DISPATCH] "Sending Unit 104 (Police) to 412 Blackwood immediately. Stay low."',
            next: 'ross_dispatched_early',
            effects: [
              { type: 'dispatch_lock', payload: { unitType: 'police', location: '412 Blackwood Lane' } },
              { type: 'set_flag', payload: { key: 'ross_police_dispatched', value: true } }
            ]
          }
        ]
      },
      ross_location: {
        id: 'ross_location',
        voiceUrl: '/audio/voices/case1/ross_location.mp3',
        speaker: 'caller',
        speakerName: 'David Ross',
        text: 'I\'m upstairs... in the master bedroom walk-in closet. I pulled the louvered door shut. It\'s completely black in here, no windows, just coats. I can hear floorboards groaning downstairs.',
        backgroundClues: ['muffled_footsteps'],
        options: [
          {
            id: 'opt_ross_look_out',
            label: '"Can you see anything from where you are?"',
            next: 'ross_slip',
          },
          {
            id: 'opt_ross_weapons',
            label: '"Do you have any weapon or a locked interior door?"',
            next: 'ross_defenseless',
          }
        ]
      },
      ross_voices: {
        id: 'ross_voices',
        voiceUrl: '/audio/voices/case1/ross_voices.mp3',
        speaker: 'caller',
        speakerName: 'David Ross',
        text: 'No voices! Just boots. Heavy steps. I\'m curled up in the master bedroom interior closet under some coats. It\'s pitch black.',
        options: [
          {
            id: 'opt_ross_press_details',
            label: '"Did you see how they arrived before you ran upstairs?"',
            next: 'ross_slip',
          }
        ]
      },
      ross_slip: {
        id: 'ross_slip',
        voiceUrl: '/audio/voices/case1/ross_slip.mp3',
        speaker: 'caller',
        speakerName: 'David Ross',
        // KEY CLUE / CONTRADICTION: He is supposedly in a windowless interior closet in the dark, yet he describes the car outside and its hot ticking engine!
        text: 'I didn\'t see them come in! But... there\'s a dark blue sedan idling across the street under the maple tree, its engine is still ticking. They parked crooked by the hydran— wait. Please just send cops!',
        backgroundClues: ['car_engine_tick', 'rustling_leaves'],
        options: [
          {
            id: 'opt_ross_catch_contradiction',
            label: '⚠️ [CHALLENGE] "Wait. You said you are in a windowless interior closet in pitch dark. How can you see a blue sedan under the maple tree across the street?"',
            requiresPin: ['windowless', 'closet', 'blue sedan'],
            next: 'ross_caught',
            trustDelta: -30,
          },
          {
            id: 'opt_ross_normal_question',
            label: '"Are there any other occupants or pets in the residence?"',
            next: 'ross_stall',
          },
          {
            id: 'opt_ross_dispatch_police',
            label: '[DISPATCH] "Hang tight, David. Police Unit 104 is rolling to 412 Blackwood Lane code 3."',
            next: 'ross_dispatched_late',
            effects: [
              { type: 'dispatch_lock', payload: { unitType: 'police', location: '412 Blackwood Lane' } },
              { type: 'set_flag', payload: { key: 'ross_police_dispatched', value: true } }
            ]
          }
        ]
      },
      ross_defenseless: {
        id: 'ross_defenseless',
        voiceUrl: '/audio/voices/case1/ross_defenseless.mp3',
        speaker: 'caller',
        speakerName: 'David Ross',
        text: 'No weapons, no gun, nothing! Just my cell phone. Please, tell me a squad car is en route! How long will they take?',
        options: [
          {
            id: 'opt_ross_back_to_slip',
            label: '"Did you see any vehicle pull into the driveway?"',
            next: 'ross_slip',
          },
          {
            id: 'opt_ross_dispatch_police_def',
            label: '[DISPATCH] "Unit 104 is responding to 412 Blackwood Lane now. Keep your breathing steady."',
            next: 'ross_dispatched_late',
            effects: [
              { type: 'dispatch_lock', payload: { unitType: 'police', location: '412 Blackwood Lane' } },
              { type: 'set_flag', payload: { key: 'ross_police_dispatched', value: true } }
            ]
          }
        ]
      },
      ross_caught: {
        id: 'ross_caught',
        voiceUrl: '/audio/voices/case1/ross_caught.mp3',
        speaker: 'caller',
        speakerName: 'David Ross',
        text: '(Dead silence for four seconds)... I... What did you say? I meant... I saw it before I ran upstairs! When I was locking the front door! Why are you interrogating me while my house is being broken into?!',
        audioCue: 'static',
        options: [
          {
            id: 'opt_ross_press_harder',
            label: '"You said the engine was still ticking right now. You\'re not inside that house, are you?"',
            next: 'ross_panic_hangup',
            trustDelta: -40,
            effects: [
              { type: 'set_flag', payload: { key: 'ross_caught_lying', value: true } },
              { type: 'set_flag', payload: { key: 'ross_is_accomplice', value: true } }
            ]
          },
          {
            id: 'opt_ross_deescalate',
            label: '"Just verifying details. Police unit has been dispatched."',
            next: 'ross_dispatched_late',
            effects: [
              { type: 'dispatch_lock', payload: { unitType: 'police', location: '412 Blackwood Lane' } },
              { type: 'set_flag', payload: { key: 'ross_police_dispatched', value: true } }
            ]
          }
        ]
      },
      ross_stall: {
        id: 'ross_stall',
        voiceUrl: '/audio/voices/case1/ross_stall.mp3',
        speaker: 'caller',
        speakerName: 'David Ross',
        text: 'No, just me. My wife is out of town. Just... please hurry. I think they are coming up the stairs. Send everything you have!',
        options: [
          {
            id: 'opt_ross_final_dispatch',
            label: '[DISPATCH] "Unit 104 en route to Blackwood Lane."',
            next: 'ross_dispatched_late',
            effects: [
              { type: 'dispatch_lock', payload: { unitType: 'police', location: '412 Blackwood Lane' } },
              { type: 'set_flag', payload: { key: 'ross_police_dispatched', value: true } }
            ]
          },
          {
            id: 'opt_ross_hold',
            label: '"Hold the line. I am checking sector unit availability."',
            next: 'ross_hold_agitated',
          }
        ]
      },
      ross_hold_agitated: {
        id: 'ross_hold_agitated',
        voiceUrl: '/audio/voices/case1/ross_hold_agitated.mp3',
        speaker: 'caller',
        speakerName: 'David Ross',
        text: 'Hold?! Are you insane?! Do not put me on hold! Operator! Operator!!',
        options: [
          {
            id: 'opt_ross_return',
            label: '[DISPATCH] "Unit 104 dispatched to 412 Blackwood Lane."',
            next: 'ross_dispatched_late',
            effects: [
              { type: 'dispatch_lock', payload: { unitType: 'police', location: '412 Blackwood Lane' } },
              { type: 'set_flag', payload: { key: 'ross_police_dispatched', value: true } }
            ]
          }
        ]
      },
      ross_panic_hangup: {
        id: 'ross_panic_hangup',
        voiceUrl: '/audio/voices/case1/ross_panic_hangup.mp3',
        speaker: 'caller',
        speakerName: 'David Ross',
        text: '(Whispering frantically into a two-way radio away from the receiver) "Abbr— ditch it! The desk caught the sedan call, wrap it up now—" (Sharp click)',
        audioCue: 'hangup',
        next: 'call_complete_ross_fled',
      },
      ross_dispatched_early: {
        id: 'ross_dispatched_early',
        voiceUrl: '/audio/voices/case1/ross_dispatched_early.mp3',
        speaker: 'caller',
        speakerName: 'David Ross',
        text: 'Thank you... thank God. Please tell them to hurry. I won\'t make a sound.',
        audioCue: 'hangup',
        next: 'call_complete',
      },
      ross_dispatched_late: {
        id: 'ross_dispatched_late',
        voiceUrl: '/audio/voices/case1/ross_dispatched_late.mp3',
        speaker: 'caller',
        speakerName: 'David Ross',
        text: 'Okay. I hear sirens far away. I\'m staying down.',
        audioCue: 'hangup',
        next: 'call_complete',
      },
      call_complete_ross_fled: {
        id: 'call_complete_ross_fled',
        speaker: 'system',
        text: '[LINE DISCONNECTED BY CALLER // AUDIO LOG FLAGGED FOR REVIEW]',
        audioCue: 'click',
      },
      call_complete: {
        id: 'call_complete',
        speaker: 'system',
        text: '[CALL TERMINATED // LOG COMMITTED]',
        audioCue: 'click',
      }
    }
  },

  call_c3_hook: {
    id: 'call_c3_hook',
    callerId: 'C3',
    callerNumber: 'UNAVAILABLE / TRACE BLOCKED',
    callerNameDisplay: 'UNKNOWN (TERMINAL 0-DIRECT)',
    scheduledTime: '22:38',
    priority: 'critical',
    summary: 'Recurring anomalous caller. Old logs label this a harmless recurring prank.',
    initialNode: 'c3_intro',
    nodes: {
      c3_intro: {
        id: 'c3_intro',
        voiceUrl: '/audio/voices/case1/c3_intro.mp3',
        speaker: 'caller',
        speakerName: 'The Static Voice',
        text: 'Good evening, Operator 7. Welcome to the graveyard shift. The tea on your console is getting cold.',
        audioCue: 'static',
        options: [
          {
            id: 'opt_c3_who_are_you',
            label: '"Identify yourself. How do you have this internal operator number?"',
            next: 'c3_identity',
          },
          {
            id: 'opt_c3_trace',
            label: '"This line is monitored and traced by County Telecom. State your emergency or disconnect."',
            next: 'c3_trace_mockery',
          },
          {
            id: 'opt_c3_tea',
            label: '"How do you know what\'s on my desk?"',
            next: 'c3_observation',
          }
        ]
      },
      c3_identity: {
        id: 'c3_identity',
        voiceUrl: '/audio/voices/case1/c3_identity.mp3',
        speaker: 'caller',
        speakerName: 'The Static Voice',
        text: 'You can check your binder under "Frequent Pranks." They told you to write me off as code 4. But you already know tonight isn\'t code 4, don\'t you?',
        backgroundClues: ['tape_recorder_click', 'subtle_oscillator_tone'],
        options: [
          {
            id: 'opt_c3_what_do_you_want',
            label: '"What are you talking about? What is happening tonight?"',
            next: 'c3_the_reveal',
          },
          {
            id: 'opt_c3_ross_mention',
            label: '"Did you call from Blackwood Lane earlier?"',
            next: 'c3_ross_insight',
          }
        ]
      },
      c3_trace_mockery: {
        id: 'c3_trace_mockery',
        voiceUrl: '/audio/voices/case1/c3_trace_mockery.mp3',
        speaker: 'caller',
        speakerName: 'The Static Voice',
        text: '(A quiet, mirthless chuckle) County Telecom rerouted their trunk line through junction 12 six minutes ago. The signal isn\'t coming from outside the facility, Operator 7.',
        audioCue: 'static',
        options: [
          {
            id: 'opt_c3_inside',
            label: '"Inside the facility? Where are you?"',
            next: 'c3_the_reveal',
          }
        ]
      },
      c3_observation: {
        id: 'c3_observation',
        voiceUrl: '/audio/voices/case1/c3_observation.mp3',
        speaker: 'caller',
        speakerName: 'The Static Voice',
        text: 'Because your predecessor, Operator 4, drank black coffee. You prefer chamomile. And you spent the first eighteen minutes fidgeting with the headset volume.',
        backgroundClues: ['distant_footsteps'],
        options: [
          {
            id: 'opt_c3_why_tell_me',
            label: '"Why are you telling me this? What do you want?"',
            next: 'c3_the_reveal',
          }
        ]
      },
      c3_ross_insight: {
        id: 'c3_ross_insight',
        voiceUrl: '/audio/voices/case1/c3_ross_insight.mp3',
        speaker: 'caller',
        speakerName: 'The Static Voice',
        text: 'Blackwood Lane wasn\'t a robbery. It was a decoy to pull Unit 104 out of the River District. And if you checked the log, Unit 104\'s transponder took twelve extra minutes to "respond".',
        audioCue: 'static',
        options: [
          {
            id: 'opt_c3_miller_compromised',
            label: '"Are you saying Officer Miller is compromised?"',
            next: 'c3_the_warning',
          }
        ]
      },
      c3_the_reveal: {
        id: 'c3_the_reveal',
        voiceUrl: '/audio/voices/case1/c3_the_reveal.mp3',
        speaker: 'caller',
        speakerName: 'The Static Voice',
        text: 'The break-in at 412 Blackwood wasn\'t meant to steal jewelry. It was meant to pull Unit 104 away from the municipal reservoir. Look at your dispatch log at 23:00 when the radio chatter starts.',
        backgroundClues: ['humming_radio_tower'],
        options: [
          {
            id: 'opt_c3_who_are_they',
            label: '"Who is orchestrating this? Who are you?"',
            next: 'c3_the_warning',
          }
        ]
      },
      c3_the_warning: {
        id: 'c3_the_warning',
        voiceUrl: '/audio/voices/case1/c3_the_warning.mp3',
        speaker: 'caller',
        speakerName: 'The Static Voice',
        text: 'I am the one who worked your console before they took her away. Keep your notebook open, 7. At 23:15, a woman will call crying about her missing brother. Do NOT dispatch Medical to the bridge. Listen to the background of her call.',
        audioCue: 'breath',
        options: [
          {
            id: 'opt_c3_accept_warning',
            label: '"Why should I believe you?"',
            next: 'c3_concluding_line',
          },
          {
            id: 'opt_c3_demand_name',
            label: '"Give me a name or I\'m sounding the facility alarm."',
            next: 'c3_concluding_line',
          }
        ]
      },
      c3_concluding_line: {
        id: 'c3_concluding_line',
        voiceUrl: '/audio/voices/case1/c3_concluding_line.mp3',
        speaker: 'caller',
        speakerName: 'The Static Voice',
        text: 'You don\'t have to believe me. Just listen. The dead air always tells the truth before they do. See you at midnight.',
        audioCue: 'hangup',
        next: 'call_complete_c3',
      },
      call_complete_c3: {
        id: 'call_complete_c3',
        speaker: 'system',
        text: '[SIGNAL TERMINATED // AUTOMATED ENCRYPTED CARRIER TONE DETECTED]',
        audioCue: 'static',
      }
    }
  }
};

