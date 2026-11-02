# DEAD AIR — CASE 04: THE WEST CAGE

> **Case file and implementation package**  
> Incident: `INC-1994-1102` · Date: **November 02, 1994**  
> Time window: **22:14–22:31** · Difficulty: **HARD**  
> Case ID: `case_4` · TypeScript export: `CASE_4`

---

## 1. Case premise

A fire breaks out beneath the City Records Annex. Night switchboard clerk Clara Bell reports smoke in the lower corridor and says that night watchman Elias Reed has disappeared after entering the West Cage, a secured archive room. A second caller, claiming to be a taxi driver outside the east gate, urges dispatch to send the fire crew to the east loading ramp and insists that nobody is trapped behind the West Cage door.

The anonymous caller sounds informed, but two details undermine the story: the caller's line carries a distinctive two-tone chime that should only be audible inside the sealed lower corridor, and the caller knows the West Cage has two deadbolts. The player must connect the audio clue with the restricted security detail before confronting the caller.

### Story ingredients

| Element | Case detail |
|---|---|
| Setting | City Records Annex, 1994 |
| Incident | Fire in the sub-basement / microfilm corridor; watchman trapped in the West Cage |
| Culprit | Mara Voss, Deputy Archivist |
| Trapped witness | Elias Reed, night watchman |
| Setup witness | Clara Bell, night switchboard clerk |
| Motive | Conceal altered entries and missing money in the municipal relief-fund archive |
| Evidence at risk | Original red ledger secured in the West Cage |
| False lead | An unidentified caller claiming to be a taxi driver outside the east gate |
| Correct rescue route | West stair → lower west corridor → West Cage |
| Diversion route | East loading ramp → old furnace room; it does not lead directly to the West Cage |

## 2. The mystery and its solution

### What actually happened

Deputy Archivist Mara Voss has been diverting money from a municipal relief-fund archive. The original red ledger, which would expose the missing entries, was secured in the West Cage. When night watchman Elias Reed discovered the altered records, Mara returned to the sub-basement, ignited a records trolley with duplicating solvent, and locked Elias behind the West Cage's two deadbolts.

Mara then called dispatch while pretending to be a taxi driver outside the east gate. She tried to send Engine 3 to the east loading ramp, away from Elias and the west corridor, while she retrieved the ledger and planned to escape through the service passage. Her claim that nobody was trapped was deliberately false.

### The fatal contradiction

The unidentified caller claims to be standing outside at the east gate. However, the call carries the same two-tone microfilm-room timer chime heard on Clara Bell's line. Clara establishes that the faulty timer is deep inside the sealed lower corridor and cannot be heard from the street.

The caller also knows the West Cage has two deadbolts, including their high-and-low arrangement. That is a restricted security detail, not something a taxi driver or ordinary passer-by should know. Together, the clues establish that the caller is inside the archive and has privileged access.

The keyholder information narrows the suspect: only the Chief Archivist and Deputy Archivist Mara Voss have keys. The Chief Archivist was taken to St. Anne's Hospital earlier that evening, while Mara's claimed departure at 21:42 was never independently witnessed. Elias later confirms that Mara locked him in and started the fire.

### The two required pins

The confrontation option is gated by these exact strings in the TypeScript definition:

```ts
requiresPin: ['two-tone chime', 'two deadbolts']
```

The intended clue chain is:

- **Pin 1 — `two-tone chime`:** Clara says the microfilm-room timer repeats every thirty seconds and can be heard through the sealed lower corridor, but not from outside. The same sound is present on the unidentified caller's line.
- **Pin 2 — `two deadbolts`:** The unidentified caller volunteers the West Cage's two-deadbolt detail and later specifies that one bolt is high and one is low, despite claiming to be a taxi driver outside.
- **Inference:** The caller is not at the east gate. The caller is inside the building and knows restricted archive security information.
- **Suspect narrowing:** Mara is one of only two authorised keyholders; the other is in hospital. Her departure was not verified.
- **Confrontation:** Pinning both clues unlocks the challenge option. Mara admits she is in the microfilm room, reveals the ledger motive, and confesses to setting the fire and locking Elias in.

The intended challenge should not unlock from either pin alone. Confirm that the notebook pin system uses the exact phrase strings above, or deliberately update both the case definition and the pin recogniser together.

## 3. Character dossiers

### C13 — Clara Bell

- **Role:** Night switchboard clerk
- **Claimed location:** Main switchboard, City Records Annex
- **Initial trust score:** 86
- **Function in the case:** Raises the alarm, describes the fire and lower-corridor sound, identifies the correct route, and explains who has keys to the West Cage.
- **Dossier note:** Raised the alarm after smoke entered the lower corridor. Familiar with the building intercom and the faulty microfilm-room timer. Says watchman Elias Reed went downstairs and did not return.

### C14 — Mara Voss

- **Role:** Deputy Archivist
- **Claimed location:** Off-site; told the switchboard she left at 21:42
- **Initial trust score:** 58
- **Function in the case:** The anonymous east-gate caller and the culprit.
- **Dossier note:** One of only two staff members authorised to open the West Cage. Her departure was reported but not independently confirmed. The Chief Archivist, the other keyholder, was taken to St. Anne's Hospital earlier tonight.

### C15 — Elias Reed

- **Role:** Night watchman
- **Claimed location:** West Cage, sub-basement; last confirmed location
- **Initial trust score:** 72
- **Function in the case:** Trapped witness who confirms Mara's identity, the motive, the sequence of events and the correct rescue route.
- **Dossier note:** Night watchman assigned to the lower archive. Last seen carrying the security key log toward the West Cage. May be trapped below the fire doors.

## 4. Emergency units and dispatch priorities

The case starts with the standard three available units:

| Unit ID | Type | Name | Initial status | Intended use |
|---|---|---|---|---|
| `P1` | Police | Unit 104 | Available | Secure exits, verify the caller and prevent the suspect from escaping |
| `M1` | Medical | Medic 2 | Available | Treat smoke inhalation and support Elias after extraction |
| `F1` | Fire | Engine 3 | Available | Suppress the sub-basement fire and reach the West Cage |

### Correct operational priorities

1. Dispatch **Engine 3 immediately**. Do not let the anonymous caller's route instructions delay the fire response.
2. Direct Engine 3 to the **west stair** and lower west corridor. The east loading ramp leads to the old furnace room and does not provide direct access to the West Cage.
3. Keep **Medic 2** available for Elias and any responder affected by smoke. The distress call indicates that Elias is coughing and that smoke is entering the cage.
4. Keep **Unit 104** available to secure the exits, verify identities and prevent Mara from leaving once her location is established.

The supplied `CaseDef` defines the initial units and narrative route information. It does not itself implement dispatch outcomes, unit movement, rescue timers or a case score; those remain responsibilities of the game's existing dispatch and debrief systems.

## 5. Call sequence

All three calls appear in `initialCallQueue`. Their scheduled times are 22:14, 22:19 and 22:26. Each call tree has a terminal system node that sets `next: 'complete'`.

### Call 1 — `call_archive_alarm` (22:14)

**Caller:** Clara Bell · `555-0113`  
**Display:** `CLARA BELL // CITY RECORDS ANNEX`  
**Priority:** High

Clara reports smoke in the sub-basement and says Elias Reed has not returned from the West Cage. She identifies the repeating two-tone sound as the faulty microfilm-room timer and establishes that it can be heard through the lower corridor but not from outside.

Optional branches let the player:

- Ask whether the west stair is passable and confirm it is the direct route to the cage.
- Establish when Elias was last seen and learn that he was checking the red ledger.
- Ask who can open the West Cage and discover the two-keyholder restriction.
- Verify that Mara's reported departure was not witnessed.

**Gameplay function:** This is the setup call. It introduces the fire, missing person, sound clue, rescue route, red-ledger lead and suspect access list.

### Call 2 — `call_east_gate` (22:19)

**Caller identity:** `MARA_VOSS` internally; identity concealed in the caller display  
**Caller number:** `555-0188`  
**Display:** `UNKNOWN // EAST LOADING BAY`  
**Priority:** High

The caller claims to be a taxi driver outside the east gate. They insist that Engine 3 use the east loading ramp and say nobody is inside the West Cage. The caller's line carries the two-tone microfilm timer. The caller also volunteers the restricted fact that the West Cage has two deadbolts.

Optional branches let the player:

- Ask the caller to establish their precise position outside.
- Ask how a taxi driver knows the West Cage's two-deadbolt arrangement.
- Ask what the repeating sound is; the caller dismisses it as a crossing signal.
- Ask when the caller supposedly performed maintenance at the archive; the caller cannot provide a date.

Once both required pins are present, the challenge option becomes available. Confronted with the chime and restricted lock detail, Mara admits she is in the microfilm room, explains the red-ledger motive, and confesses to using duplicating solvent to start the fire and locking Elias inside the cage.

**Gameplay function:** This is the deception and deduction call. The caller actively tries to redirect responders, while the audio and security clues expose the lie.

### Call 3 — `call_west_cage` (22:26)

**Caller:** Elias Reed · `555-0197`  
**Display:** `ELIAS REED // WEST CAGE`  
**Priority:** High

Elias reaches dispatch through an internal emergency handset from behind the West Cage door. He reports smoke entering the cage and says he cannot move either bolt from his side. He identifies Mara as the person who locked him in and explains that she wanted to suppress evidence in the red ledger.

Optional branches let the player:

- Establish Elias's condition and give the limited instruction to stay low.
- Confirm Mara's identity and ask what was in the ledger.
- Establish the fire timeline and obtain the correct rescue route.
- Confirm that the east ramp leads to the furnace room rather than the West Cage.

**Gameplay function:** This is the corroboration and rescue call. Elias independently confirms the accusation, motive, fire timeline and correct route. His deteriorating condition establishes urgency for Fire and Medical dispatch.

## 6. Audio and clue asset guide

The following are the `backgroundClues` identifiers used by the case. Map them to the project's actual audio library or rename them to match existing asset IDs.

| Audio tag | Intended sound / function |
|---|---|
| `fire_alarm_bell` | Building fire alarm heard in the annex |
| `two_tone_microfilm_chime` | Faulty microfilm-room timer, repeating every thirty seconds |
| `sub_basement_ventilation` | Low ventilation rumble in the sealed lower corridor |
| `metal_door_latch` | Door or deadbolt movement near the archive cage |
| `coughing` | Elias's smoke exposure |
| `metal_door_rattle` | Elias testing or striking the West Cage door |
| `distant_fire_alarm` | Fire alarm heard from behind the cage door |
| `paper_shuffling` | Papers or ledger handled during Mara's confession |

**Critical audio implementation detail:** The two-tone microfilm chime must be recognisably the same sound in Clara's setup call and the anonymous caller's line. Clara's dialogue establishes its source and acoustic location: the timer is in the sealed lower corridor and cannot be heard from the street. If the sounds differ, or if the player cannot distinguish the cue, the central deduction becomes unfair.

The caller's line also includes `sub_basement_ventilation` and `metal_door_latch`, which reinforce the impression that the caller is inside the building. The two required pins, however, are specifically `two-tone chime` and `two deadbolts`.

## 7. Branching and outcome logic

- The anonymous caller's challenge option must retain `requiresPin: ['two-tone chime', 'two deadbolts']` exactly if the notebook system expects exact string matching.
- The challenge applies `trustDelta: -40`.
- The challenge sets `culprit_caught` to `true` and `mara_confessed` to `true` using the existing `set_flag` effect shape.
- The confrontation node names Mara Voss and contains the confession. It then proceeds to the call's terminal node.
- The optional dialogue branches are nodes within the three calls; they are not extra calls.
- Every call's terminal system node uses `next: 'complete'`.
- The call queue order is `call_archive_alarm`, `call_east_gate`, then `call_west_cage`.

### Important gameplay distinction

The player can learn important facts through different optional branches, but the intended decisive confrontation is specifically gated by the two pin strings. Keep those strings consistent across the notebook UI, clue extraction logic and the `requiresPin` array. Do not silently replace them with variations such as `microfilm chime`, `two locks` or `two bolts` unless the pin matcher supports aliases.

## 8. Suggested debrief outcomes

These are narrative recommendations for the game's debrief system, not additional outcomes implemented by the supplied `CaseDef` object.

### Strong outcome

The player dispatches Engine 3 without delay, routes the crew through the west stair, stages Medic 2 for smoke exposure, preserves Unit 104 for site security, pins both clues and confronts Mara. Elias is reached through the correct corridor, and Mara's attempted diversion is exposed before she can escape with the ledger.

### Partial outcome

The player sends the fire crew to the correct building and uses Clara's route information, but fails to connect both pins or does not confront Mara. Elias may still be rescued, while the caller's deception and the red-ledger motive are only fully established when Elias speaks.

### Poor outcome

The player accepts the east-gate caller's instructions and sends responders toward the old furnace room. The crew loses time away from the West Cage while smoke enters Elias's locked room. Mara gains time to retrieve the ledger or escape through the service passage. The actual rescue or escape consequence must be implemented in the game's dispatch/debrief logic; it is not represented by a dedicated ending-score field in this `CaseDef`.

## 9. Case integration

Save the TypeScript source from this document as:

```text
src/content/cases/case4.ts
```

Then update `src/content/cases/index.ts`:

```ts
import { CASE_4 } from './case4';
```

Register the case in `ALL_CASES`:

```ts
export const ALL_CASES: Record<string, CaseDef> = {
  case_1: CASE_1,
  case_2: CASE_2,
  case_3: CASE_3,
  case_4: CASE_4,
};
```

Add it to the ordered case list:

```ts
export const CASE_LIST: CaseDef[] = [CASE_1, CASE_2, CASE_3, CASE_4];
```

If Cases 5 and later are already registered, preserve them and append `CASE_4` in the appropriate order rather than replacing the existing entries.

### Integration checklist

- [ ] Save the TypeScript source as `src/content/cases/case4.ts`.
- [ ] Import `CASE_4` from `./case4` in the case index.
- [ ] Add `case_4: CASE_4` to `ALL_CASES`.
- [ ] Add `CASE_4` to `CASE_LIST` in numerical order.
- [ ] Confirm the project `CaseDef` type accepts the fields and effect objects used here.
- [ ] Confirm the audio registry contains, or is mapped to, every `backgroundClues` tag listed above.
- [ ] Confirm the notebook pin matcher recognises `two-tone chime` and `two deadbolts` exactly.
- [ ] Test that the confrontation is unavailable with only one pin and available with both.
- [ ] Test that all three call trees can reach their terminal completion nodes.
- [ ] Test dispatch routing so the west stair is the direct rescue route and the east ramp remains a diversion.

## 10. Full TypeScript case definition

The complete case object is reproduced below. This is the source file to save as `src/content/cases/case4.ts`.

```ts
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
```
