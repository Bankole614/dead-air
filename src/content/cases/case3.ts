import { CaseDef } from '../../types/game';

export const CASE_3: CaseDef = {
  id: 'case_3',
  number: 3,
  title: 'THE MIDNIGHT FREQUENCY',
  incidentCode: 'INC-1994-1231',
  date: 'DECEMBER 31, 1994',
  timeWindow: '23:45 - 00:15',
  synopsis: 'Fifteen minutes before New Year\'s midnight. An unknown individual seizes control of the regional microwave transmitter tower. A terrified employee can only communicate using receiver taps, while a smooth-talking imposter requests remote bypass codes.',
  difficulty: 'CRITICAL',
  initialUnits: {
    P1: { id: 'P1', type: 'police', name: 'SWAT Tactical Unit 1', status: 'available' },
    P2: { id: 'P2', type: 'police', name: 'Patrol 112 (Perimeter)', status: 'available' },
    M1: { id: 'M1', type: 'medical', name: 'Trauma Unit 5', status: 'available' },
    F1: { id: 'F1', type: 'fire', name: 'Engine Company 9', status: 'available' },
  },
  characters: {
    C10: {
      id: 'C10',
      code: 'C10',
      knownName: 'The Muffled Hostage',
      role: 'Night Shift Tower Technician',
      claimedLocation: 'Sub-level 2 Cable Vault',
      trustScore: 95,
      contradictionsFound: [],
      notes: 'Cannot speak out loud without being heard. Communicates strictly via phone receiver taps (1 tap = YES, 2 taps = NO).',
    },
    C11: {
      id: 'C11',
      code: 'C11',
      knownName: 'Caller claiming to be "Chief Engineer Vance"',
      role: 'Alleged Transmitter Director',
      claimedLocation: 'Main Control Room (4th Floor)',
      trustScore: 25,
      contradictionsFound: [],
      notes: 'Requests emergency authorization bypass for the broadcast transmitter array. Background audio contradicts claimed location.',
    },
    C12: {
      id: 'C12',
      code: 'C12',
      knownName: 'EBS Broadcast Carrier (Automated)',
      role: 'County Emergency Broadcast System',
      claimedLocation: 'Automated Switching Relay',
      trustScore: 100,
      contradictionsFound: [],
      notes: 'Automated relay countdown. If lockdown is not confirmed, emergency transmitters will broadcast rogue payload.',
    }
  },
  initialCallQueue: ['call_taps'],
  initialNotes: 'CASE 03 DIRECTIVES:\n- New Year\'s countdown active. Peak broadcast coverage across the state.\n- Microwave tower holds county sirens and emergency broadcast frequency.\n- Verify all credentials against physical acoustic evidence.',
  answerKey: {
    truth: 'Intruders breached the transmitter tower to hijack the emergency broadcast network at midnight. The caller claiming to be Chief Vance is broadcasting from the antenna roof in the wind, while the true technician is locked below in the vault.',
    culprit: 'The Infiltrator ("Chief Engineer Vance")',
    fatalContradiction: 'Vance claimed to be in the soundproof 4th-floor control room, but in the background of his call, howling open-air wind and the ground-floor lobby clock chime could be heard.',
  },
  deduction: {
    suspectChoices: [
      { id: 'vance_imposter', label: 'The Infiltrator ("Chief Engineer Vance" / Antenna Roof Hostile)', isCorrect: true },
      { id: 'vault_tech', label: 'The Hiding Technician (Sub-level 2 Cable Vault Tapper)', isCorrect: false },
      { id: 'system_operator', label: 'County Broadcast Network Automated Carrier', isCorrect: false },
    ],
    targetChoices: [
      { id: 'broadcast_hijack', label: 'County Emergency Broadcast Array & Microwave Tower (Midnight Hijack)', isCorrect: true },
      { id: 'vault_theft', label: 'Sub-level Cable Vault Copper Theft', isCorrect: false },
      { id: 'lobby_vandalism', label: 'Ground Floor Lobby Break-in', isCorrect: false },
    ],
    correctEvidenceKeywords: ['soundproof', 'wind', 'roof', 'clock', 'chiming', 'howling', 'vault'],
  },
  calls: {
    call_taps: {
      id: 'call_taps',
      callerId: 'C10',
      callerNumber: 'INTERNAL EXT 402',
      callerNameDisplay: 'INTERNAL WIRE // SUB-LEVEL 2',
      scheduledTime: '23:46',
      priority: 'critical',
      summary: 'Silent call. Rhythmic tapping against phone mouthpiece.',
      initialNode: 'taps_intro',
      nodes: {
        taps_intro: {
          id: 'taps_intro',
          speaker: 'caller',
          speakerName: 'Unknown (Internal Line)',
          text: '(Dead silence... then two sharp metallic taps against the receiver: *TAP* *TAP*)',
          audioCue: 'click',
          backgroundClues: ['muffled_machinery_hum'],
          options: [
            {
              id: 'opt_taps_verify',
              label: '"This is Operator 7. If you are in distress and cannot speak freely, tap ONCE for YES, TWICE for NO."',
              next: 'taps_confirm_code',
            },
            {
              id: 'opt_taps_hangup_warning',
              label: '"Speak now or line will be disconnected."',
              next: 'taps_frantic',
            }
          ]
        },
        taps_confirm_code: {
          id: 'taps_confirm_code',
          speaker: 'caller',
          speakerName: 'Unknown (Internal Line)',
          text: '(Immediate single crisp tap: *TAP*)',
          audioCue: 'click',
          options: [
            {
              id: 'opt_taps_armed',
              label: '"Are there armed individuals inside the transmitter tower with you?"',
              next: 'taps_armed_yes',
            },
            {
              id: 'opt_taps_engineer',
              label: '"Are you Chief Engineer Vance?"',
              next: 'taps_not_vance',
            }
          ]
        },
        taps_armed_yes: {
          id: 'taps_armed_yes',
          speaker: 'caller',
          speakerName: 'Unknown (Internal Line)',
          text: '(*TAP*... then muffled heavy footsteps above the ceiling and a whisper: "Hiding in the cable vault... roof access door was blown open...")',
          backgroundClues: ['howling_roof_wind_above', 'metal_hatch_creak'],
          options: [
            {
              id: 'opt_taps_roof_confirm',
              label: '"Did the intruders head to the antenna roof?"',
              next: 'taps_roof_yes',
            }
          ]
        },
        taps_not_vance: {
          id: 'taps_not_vance',
          speaker: 'caller',
          speakerName: 'Unknown (Internal Line)',
          text: '(*TAP* *TAP* - Rapid double tap for NO)',
          audioCue: 'click',
          options: [
            {
              id: 'opt_taps_roof_confirm_2',
              label: '"Did the intruders head up to the open antenna roof?"',
              next: 'taps_roof_yes',
            }
          ]
        },
        taps_roof_yes: {
          id: 'taps_roof_yes',
          speaker: 'caller',
          speakerName: 'Unknown (Internal Line)',
          text: '(*TAP* - Confirmed. In background: grandfather clock in 1st floor lobby chimes 11:50 PM)',
          backgroundClues: ['lobby_clock_chime', 'howling_wind'],
          options: [
            {
              id: 'opt_taps_dispatch_swat',
              label: '[DISPATCH] "Stay barricaded. SWAT Tactical Unit 1 is breaching the perimeter now."',
              next: 'taps_safe',
              effects: [
                { type: 'dispatch_lock', payload: { unitType: 'police', location: 'Transmitter Tower' } },
                { type: 'set_flag', payload: { key: 'swat_en_route', value: true } }
              ]
            }
          ]
        },
        taps_frantic: {
          id: 'taps_frantic',
          speaker: 'caller',
          speakerName: 'Unknown (Internal Line)',
          text: '(*TAP* *TAP* *TAP* *TAP* - Frantic tapping, then the whisper: "Don\'t hang up! They took the roof!")',
          next: 'taps_roof_yes',
        },
        taps_safe: {
          id: 'taps_safe',
          speaker: 'caller',
          speakerName: 'Unknown (Internal Line)',
          text: '(*TAP*... Receiver placed quietly onto cradle)',
          audioCue: 'hangup',
          next: 'taps_complete',
        },
        taps_complete: {
          id: 'taps_complete',
          speaker: 'system',
          text: '[LINE 01 IDLE // TRANSMISSION LOG SAVED]',
          audioCue: 'click',
        }
      }
    },

    call_fake_engineer: {
      id: 'call_fake_engineer',
      callerId: 'C11',
      callerNumber: 'DIRECT CONSOLE 01',
      callerNameDisplay: 'VANCE, A. // CHIEF ENGINEER',
      scheduledTime: '23:52',
      priority: 'critical',
      summary: 'Call from purported Chief Engineer requesting remote electronic override of broadcast array.',
      initialNode: 'vance_intro',
      nodes: {
        vance_intro: {
          id: 'vance_intro',
        voiceUrl: '/audio/voices/case3/vance_intro.mp3',
          speaker: 'caller',
          speakerName: 'Chief Engineer Vance',
          text: 'Good evening, 911 dispatch. Arthur Vance here. We had a minor circuit trip in the fourth-floor soundproof control studio. I need you to transmit the master carrier override code to unlock the broadcast relays.',
          audioCue: 'static',
          backgroundClues: ['howling_antenna_wind', 'muffled_lobby_clock'],
          options: [
            {
              id: 'opt_vance_ask_location',
              label: '"Can you verify your exact physical location inside the facility, Mr. Vance?"',
              next: 'vance_claim_soundproof',
            },
            {
              id: 'opt_vance_challenge',
              label: '⚠️ [CHALLENGE] "Mr. Vance, you claim you are in the soundproof fourth-floor control room, but I can hear 40-knot howling wind and the first-floor lobby clock chiming in your headset."',
              requiresPin: ['soundproof', 'wind', 'lobby'],
              next: 'vance_caught',
              trustDelta: -50,
              effects: [
                { type: 'set_flag', payload: { key: 'tower_saved', value: true } }
              ]
            },
            {
              id: 'opt_vance_grant_code',
              label: '[OVERRIDE] "Transmitting broadcast carrier override code: 8-8-4-0."',
              next: 'vance_hijack_success',
              effects: [
                { type: 'set_flag', payload: { key: 'tower_hijacked', value: true } }
              ]
            }
          ]
        },
        vance_claim_soundproof: {
          id: 'vance_claim_soundproof',
        voiceUrl: '/audio/voices/case3/vance_claim_soundproof.mp3',
          speaker: 'caller',
          speakerName: 'Chief Engineer Vance',
          text: 'I told you, fourth-floor master control. Dead quiet in here, double acoustic insulation. We have six minutes before the midnight countdown. Transmit the code immediately.',
          backgroundClues: ['howling_antenna_wind', 'wind_buffeting_microphone'],
          options: [
            {
              id: 'opt_vance_challenge_2',
              label: '⚠️ [CHALLENGE] "You are lying. You are on the open antenna roof. SWAT is surrounding the tower."',
              requiresPin: ['soundproof', 'wind'],
              next: 'vance_caught',
              trustDelta: -50,
              effects: [
                { type: 'set_flag', payload: { key: 'tower_saved', value: true } }
              ]
            },
            {
              id: 'opt_vance_deny',
              label: '[DISPATCH] "Refusing override. Perimeter lockdown engaged."',
              next: 'vance_caught',
              effects: [
                { type: 'set_flag', payload: { key: 'tower_saved', value: true } }
              ]
            }
          ]
        },
        vance_caught: {
          id: 'vance_caught',
        voiceUrl: '/audio/voices/case3/vance_caught.mp3',
          speaker: 'caller',
          speakerName: 'Chief Engineer Vance',
          text: '(Mask drops, shouting over howling wind) "Sniper on the water tower! They know we\'re on the roof! Drop the transmitter equipment—move!" (Rapid gunfire, sharp metallic clatter, static)',
          audioCue: 'static',
          next: 'vance_complete',
        },
        vance_hijack_success: {
          id: 'vance_hijack_success',
        voiceUrl: '/audio/voices/case3/vance_hijack_success.mp3',
          speaker: 'caller',
          speakerName: 'Chief Engineer Vance',
          text: 'Code accepted. Thank you for your cooperation, Operator 7. (Cold laughter) Happy New Year.',
          audioCue: 'hangup',
          next: 'vance_complete',
        },
        vance_complete: {
          id: 'vance_complete',
          speaker: 'system',
          text: '[BROADCAST RELAY LOCKDOWN APPLIED // CASE CONCLUDED]',
          audioCue: 'click',
        }
      }
    }
  }
};
