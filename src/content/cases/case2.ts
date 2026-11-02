import { CaseDef } from '../../types/game';

export const CASE_2: CaseDef = {
  id: 'case_2',
  number: 2,
  title: 'BLACKOUT AT MILE 40',
  incidentCode: 'INC-1994-1102',
  date: 'NOVEMBER 02, 1994',
  timeWindow: '23:30 - 00:30',
  synopsis: 'A severe blizzard tears through the northern mountain pass. A stranded driver reports a jackknifed chemical transport truck, but a responding state trooper on the line insists the road is completely clear.',
  difficulty: 'HARD',
  initialUnits: {
    P1: { id: 'P1', type: 'police', name: 'Highway Patrol 21', status: 'available' },
    P2: { id: 'P2', type: 'police', name: 'Cruiser 09 (County)', status: 'available' },
    M1: { id: 'M1', type: 'medical', name: 'Snow Rescue Medic 4', status: 'available' },
    F1: { id: 'F1', type: 'fire', name: 'Hazmat Engine 02', status: 'available' },
  },
  characters: {
    C7: {
      id: 'C7',
      code: 'C7',
      knownName: 'Sarah Jenkins',
      role: 'Stranded Motorist, Route 9',
      claimedLocation: 'Route 9, Mile Marker 41 (Snowbank)',
      trustScore: 85,
      contradictionsFound: [],
      notes: 'Car slid off highway in blizzard. Reporting jackknifed industrial tanker with hazard lights turned off.',
    },
    C8: {
      id: 'C8',
      code: 'C8',
      knownName: 'Caller claiming to be "Trooper Vance"',
      role: 'Alleged State Highway Patrol Officer',
      claimedLocation: 'Quarry Overlook / Mile 40',
      trustScore: 35,
      contradictionsFound: [],
      notes: 'Calling via radio patch. Insists road is clear and demands all units divert to South Valley.',
    },
    C9: {
      id: 'C9',
      code: 'C9',
      knownName: 'Hank Thorne',
      role: 'Commercial Tanker Driver',
      claimedLocation: 'Quarry Drainage Culvert',
      trustScore: 90,
      contradictionsFound: [],
      notes: 'True driver of transport tanker. Whispering from hiding spot after being ambushed.',
    }
  },
  initialCallQueue: ['call_jenkins'],
  initialNotes: 'CASE 02 // WEATHER ADVISORY:\n- Route 9 visibility under 10 meters due to blizzard.\n- Hazardous industrial transport scheduled between North Chemical Works and rail depot.\n- Verify all emergency radio patches carefully.',
  answerKey: {
    truth: 'An armed hijack team ambushed Hank Thorne\'s chemical tanker at Mile 40. One of the hijackers put on a stolen state trooper coat and called dispatch via a booster patch to steer police units away to South Valley.',
    culprit: 'The Imposter ("Trooper Vance")',
    fatalContradiction: 'Vance claimed his cruiser battery was dead with no emergency lights, but Sarah Jenkins could clearly see the spinning red beacon on his cruiser parked behind the tanker.',
  },
  calls: {
    call_jenkins: {
      id: 'call_jenkins',
      callerId: 'C7',
      callerNumber: '555-0819 (Cell Booster)',
      callerNameDisplay: 'JENKINS, S. (ROUTE 9 MILE 41)',
      scheduledTime: '23:32',
      priority: 'high',
      summary: 'Motorist slid off icy road. Reports a dark jackknifed tanker blocking both lanes.',
      initialNode: 'jenkins_intro',
      nodes: {
        jenkins_intro: {
          id: 'jenkins_intro',
          speaker: 'caller',
          speakerName: 'Sarah Jenkins',
          text: 'Dispatch?! Thank God! I spun out on Route 9 right past the quarry cut. My tires are buried in a snowdrift. There\'s a massive industrial tanker truck jackknifed sideways across the whole highway!',
          audioCue: 'static',
          backgroundClues: ['howling_blizzard', 'car_heater_whine'],
          options: [
            {
              id: 'opt_jenkins_tanker_details',
              label: '"Are you injured, Sarah? Is the tanker leaking or smoking?"',
              next: 'jenkins_tanker_status',
            },
            {
              id: 'opt_jenkins_location',
              label: '"Can you confirm your exact mile marker? Did you see anyone exit the truck?"',
              next: 'jenkins_cruiser_seen',
            }
          ]
        },
        jenkins_tanker_status: {
          id: 'jenkins_tanker_status',
          speaker: 'caller',
          speakerName: 'Sarah Jenkins',
          text: 'I have a bruised shoulder, but I can walk. No smoke, but the tanker\'s lights are completely blacked out. Wait—there\'s a state trooper cruiser pulled up right behind the trailer, its roof emergency beacon is flashing bright red into the snow.',
          backgroundClues: ['howling_blizzard', 'flashing_red_reflection'],
          options: [
            {
              id: 'opt_jenkins_trooper_approach',
              label: '"If a trooper is already there, have they approached your car?"',
              next: 'jenkins_cruiser_seen',
            },
            {
              id: 'opt_jenkins_dispatch_medic',
              label: '[DISPATCH] "Sending Snow Rescue Medic 4 to Mile Marker 41. Keep your hazard lights on."',
              next: 'jenkins_hold_tight',
              effects: [
                { type: 'dispatch_lock', payload: { unitType: 'medical', location: 'Route 9 Mile 41' } },
                { type: 'set_flag', payload: { key: 'medic_sent_mile41', value: true } }
              ]
            }
          ]
        },
        jenkins_cruiser_seen: {
          id: 'jenkins_cruiser_seen',
          speaker: 'caller',
          speakerName: 'Sarah Jenkins',
          text: 'No! Nobody came to me. The trooper cruiser has its roof emergency lights spinning red, but two men in dark parkas are prying open the tanker\'s rear valves! That doesn\'t look like standard police procedure!',
          audioCue: 'breath',
          backgroundClues: ['metal_crowbar_clang', 'howling_wind'],
          options: [
            {
              id: 'opt_jenkins_stay_down',
              label: '"Do not honk your horn or leave your vehicle. Recline your seat and stay out of sight."',
              next: 'jenkins_hold_tight',
            }
          ]
        },
        jenkins_hold_tight: {
          id: 'jenkins_hold_tight',
          speaker: 'caller',
          speakerName: 'Sarah Jenkins',
          text: 'Okay... I\'m ducking down below the dashboard. Please hurry. The blizzard is getting worse.',
          audioCue: 'hangup',
          next: 'jenkins_complete',
        },
        jenkins_complete: {
          id: 'jenkins_complete',
          speaker: 'system',
          text: '[CALL COMPLETED // LOG STORED]',
          audioCue: 'click',
        }
      }
    },

    call_fake_trooper: {
      id: 'call_fake_trooper',
      callerId: 'C8',
      callerNumber: 'RADIO PATCH CH-4',
      callerNameDisplay: 'TROOPER VANCE // HIGHWAY PATROL',
      scheduledTime: '23:38',
      priority: 'critical',
      summary: 'Radio transmission claiming to be on-scene trooper on Route 9, contradicting previous report.',
      initialNode: 'trooper_intro',
      nodes: {
        trooper_intro: {
          id: 'trooper_intro',
          speaker: 'caller',
          speakerName: 'Trooper Vance (Radio)',
          text: 'Operator 7, this is Trooper Vance on frequency 4. Disregard any motorist chatter about Mile 40. I am physically at the quarry cut right now. The road is clear. A salt truck already salted the grade.',
          audioCue: 'static',
          backgroundClues: ['indoor_payphone_echo', 'radio_squelch'],
          options: [
            {
              id: 'opt_trooper_ask_tanker',
              label: '"Trooper Vance, we had a report of a jackknifed chemical transport tanker at that location."',
              next: 'trooper_deny_tanker',
            },
            {
              id: 'opt_trooper_status',
              label: '"Where is your squad vehicle positioned, officer?"',
              next: 'trooper_cruiser_excuse',
            }
          ]
        },
        trooper_deny_tanker: {
          id: 'trooper_deny_tanker',
          speaker: 'caller',
          speakerName: 'Trooper Vance (Radio)',
          text: 'Negative, negative. Just empty asphalt and drifting snow. We have a confirmed multi-vehicle pileup down in South Valley on County Road 12. Divert all available cruisers and hazmat to South Valley immediately.',
          options: [
            {
              id: 'opt_trooper_cruiser_question',
              label: '"Did you deploy flares or your cruiser lights to warn motorists?"',
              next: 'trooper_cruiser_excuse',
            }
          ]
        },
        trooper_cruiser_excuse: {
          id: 'trooper_cruiser_excuse',
          speaker: 'caller',
          speakerName: 'Trooper Vance (Radio)',
          text: 'My squad car\'s alternator blew out in the cold. My battery is 100% dead. I have zero emergency lights running. That\'s why I\'m using a hand-crank auxiliary patch. Send everything south to Road 12.',
          backgroundClues: ['clinking_glass', 'muffled_voices'],
          options: [
            {
              id: 'opt_trooper_challenge',
              label: '⚠️ [CHALLENGE] "Trooper Vance, the motorist at Mile 41 is staring directly at your cruiser right now—and its red emergency beacon is actively spinning."',
              requiresPin: ['red', 'beacon', 'flashing'],
              next: 'trooper_exposed',
              trustDelta: -50,
            },
            {
              id: 'opt_trooper_divert_south',
              label: '[DISPATCH] "Understood, Vance. Diverting Highway Patrol 21 and Hazmat Engine to South Valley."',
              next: 'trooper_diverted_bad',
              effects: [
                { type: 'dispatch_lock', payload: { unitType: 'police', location: 'South Valley' } },
                { type: 'dispatch_lock', payload: { unitType: 'fire', location: 'South Valley' } },
                { type: 'set_flag', payload: { key: 'diverted_south_failure', value: true } }
              ]
            }
          ]
        },
        trooper_exposed: {
          id: 'trooper_exposed',
          speaker: 'caller',
          speakerName: 'Trooper Vance (Radio)',
          text: '(Radio squelch cuts)... Who told you that?! (Muffled curses off-mic: "Cut the transfer valve! The board is onto us!")',
          audioCue: 'static',
          options: [
            {
              id: 'opt_trooper_intercept',
              label: '[DISPATCH] "All units: Code 10-99 at Mile 40. Imposter on county radio. Intercept hijacked tanker now!"',
              next: 'trooper_intercepted_good',
              effects: [
                { type: 'dispatch_lock', payload: { unitType: 'police', location: 'Route 9 Mile 40' } },
                { type: 'set_flag', payload: { key: 'caught_fake_trooper', value: true } },
                { type: 'set_flag', payload: { key: 'tanker_intercepted', value: true } }
              ]
            }
          ]
        },
        trooper_intercepted_good: {
          id: 'trooper_intercepted_good',
          speaker: 'caller',
          speakerName: 'Trooper Vance (Radio)',
          text: '(Carrier signal abruptly severed by caller)',
          audioCue: 'hangup',
          next: 'trooper_complete',
        },
        trooper_diverted_bad: {
          id: 'trooper_diverted_bad',
          speaker: 'caller',
          speakerName: 'Trooper Vance (Radio)',
          text: 'Copy that, 7. Out.',
          audioCue: 'hangup',
          next: 'trooper_complete',
        },
        trooper_complete: {
          id: 'trooper_complete',
          speaker: 'system',
          text: '[RADIO PATCH TERMINATED]',
          audioCue: 'click',
        }
      }
    },

    call_driver_culvert: {
      id: 'call_driver_culvert',
      callerId: 'C9',
      callerNumber: 'EMERGENCY BOX 40-B',
      callerNameDisplay: 'CALL BOX 40-B // HIGHWAY QUARRY',
      scheduledTime: '23:48',
      priority: 'critical',
      summary: 'Distressed commercial driver calling from roadside emergency call box.',
      initialNode: 'driver_intro',
      nodes: {
        driver_intro: {
          id: 'driver_intro',
          speaker: 'caller',
          speakerName: 'Hank Thorne',
          text: '(Shivering violently, teeth chattering) Helpline... I\'m the driver of tanker 88. Three guys in an old police cruiser forced me off the road into the snow. They took my uniform and keys! They\'re siphoning 10,000 gallons of industrial solvent!',
          audioCue: 'breath',
          backgroundClues: ['freezing_teeth_chatter', 'metal_pipe_reverb'],
          options: [
            {
              id: 'opt_driver_confirm_status',
              label: '"Hank, we have already flagged the fake cruiser at Mile 40. Stay in the culvert, units are closing in."',
              next: 'driver_safe',
            },
            {
              id: 'opt_driver_urgent_rescue',
              label: '[DISPATCH] "Dispatching Snow Rescue Medic to Call Box 40-B for severe hypothermia."',
              next: 'driver_safe',
              effects: [
                { type: 'dispatch_lock', payload: { unitType: 'medical', location: 'Call Box 40-B' } }
              ]
            }
          ]
        },
        driver_safe: {
          id: 'driver_safe',
          speaker: 'caller',
          speakerName: 'Hank Thorne',
          text: 'Thank God... I see police headlights piercing through the blizzard right now. You caught them in time!',
          audioCue: 'hangup',
          next: 'driver_complete',
        },
        driver_complete: {
          id: 'driver_complete',
          speaker: 'system',
          text: '[INCIDENT CLOSED // RESOLUTION COMMITTED]',
          audioCue: 'click',
        }
      }
    }
  }
};

