# Dead Air // Case Creation Guide & AI Prompt Template

Use this guide to add a new playable case to *Dead Air*. It takes under 5 minutes to draft with an AI.

---

## 1. What Every Case Needs (The 5 Elements)

| Element | What It Is | Why It's Needed |
|---|---|---|
| **1. Metadata** | Title, Date, Code, Difficulty | Shows up in the Case Selector modal |
| **2. The Answer Key** | The secret truth, culprit, and fatal slip | The fair mystery: every clue traces back to this |
| **3. Available Units** | Police, Medical, Fire, Welfare | Forces the player to manage limited resources |
| **4. Character Dossiers** | 2–3 cards with claimed locations & notes | Displayed in the player's notebook |
| **5. Calls & Dialogue Trees** | 2–3 branching calls with audio clues & pins | Where gameplay happens: questioning, pinning, catching lies |

---

## 2. Copy-Paste AI Prompt Template

Copy everything below the line and paste it to an AI (Claude, Gemini, ChatGPT) with your idea:

```markdown
You are a narrative designer for "Dead Air", a retro 1994 CRT emergency helpline thriller game.
The player is Operator 7 working the night shift. They cannot see anything; they only hear and read what callers say.
Players question callers, pin suspicious statements to their notebook, catch contradictions, and dispatch limited emergency units.

Please write a complete, valid TypeScript case definition file (`caseX.ts`) following this exact format:

### STORY PREMISE:
- Theme: [e.g. A runaway freight train, a hostage at a hospital, a boat stranded off the coast in fog]
- The Truth / Mystery: [What is actually happening]
- The Culprit: [Who is lying to the dispatcher]
- The Fatal Contradiction: [The physical/audio slip that proves they are lying, e.g. claiming to be indoors while train whistles or rain blow on mic, or mentioning details only an outsider could know]

### TYPESCRIPT SCHEMA TO GENERATE:
```ts
import { CaseDef } from '../../types/game';

export const CASE_X: CaseDef = {
  id: 'case_X',
  number: X,
  title: 'CASE TITLE IN CAPS',
  incidentCode: 'INC-1994-XXXX',
  date: 'MONTH DD, 1994',
  timeWindow: 'HH:MM - HH:MM',
  synopsis: '2-sentence gripping synopsis of the incident.',
  difficulty: 'STANDARD', // 'STANDARD' | 'HARD' | 'CRITICAL'
  initialUnits: {
    P1: { id: 'P1', type: 'police', name: 'Unit 104', status: 'available' },
    M1: { id: 'M1', type: 'medical', name: 'Medic 2', status: 'available' },
    F1: { id: 'F1', type: 'fire', name: 'Engine 3', status: 'available' },
  },
  characters: {
    CHAR_ID: {
      id: 'CHAR_ID',
      code: 'C13',
      knownName: 'Character Name',
      role: 'Role / Occupation',
      claimedLocation: 'Claimed Address',
      trustScore: 80,
      contradictionsFound: [],
      notes: 'Initial dossier notes.',
    }
  },
  initialCallQueue: ['call_1_id'],
  initialNotes: 'OPERATOR DIRECTIVES:\n- Notes here.',
  answerKey: {
    truth: 'Explanation of what actually happened.',
    culprit: 'Name / Role of the liar.',
    fatalContradiction: 'The exact contradiction caught by the player.',
  },
  calls: {
    call_1_id: {
      id: 'call_1_id',
      callerId: 'CHAR_ID',
      callerNumber: '555-XXXX',
      callerNameDisplay: 'NAME // LOCATION',
      scheduledTime: '22:02',
      priority: 'high',
      summary: 'Summary of call',
      initialNode: 'node_intro',
      nodes: {
        node_intro: {
          id: 'node_intro',
          speaker: 'caller', // 'caller' | 'operator' | 'system'
          speakerName: 'Name',
          text: 'Caller dialogue text here.',
          audioCue: 'static', // 'static' | 'ring' | 'breath' | 'click' | 'hangup'
          backgroundClues: ['sound_tag_1', 'sound_tag_2'],
          options: [
            {
              id: 'opt_1',
              label: '"Dialogue option label for operator"',
              next: 'node_next_id',
            },
            {
              id: 'opt_challenge',
              label: '⚠️ [CHALLENGE] "Confront caller with the contradiction."',
              requiresPin: ['keyword1', 'keyword2'], // Unlocked ONLY if player pinned these words!
              next: 'node_caught_id',
              trustDelta: -40,
              effects: [
                { type: 'set_flag', payload: { key: 'culprit_caught', value: true } }
              ]
            }
          ]
        },
        node_caught_id: {
          id: 'node_caught_id',
          speaker: 'caller',
          speakerName: 'Name',
          text: 'Caller panics or confesses...',
          next: 'node_complete_id',
        },
        node_complete_id: {
          id: 'node_complete_id',
          speaker: 'system',
          text: '[CALL TERMINATED // LOG COMMITTED]',
          audioCue: 'click',
        }
      }
    }
  }
};
```

Make sure:
1. 2 to 3 calls total (a setup call, the suspicious call with the slip, and a resolution call).
2. The liar's node has an option with `requiresPin: ['keyword1', 'keyword2']` and `label: '⚠️ [CHALLENGE] ...'` so the player can pin the words to unlock the confrontation.
3. Every terminal call has an ending node that sets next to complete.
```

---

## 3. How to Plug It into the Game (2 Steps)

Once the AI generates the code:

1. Save it as `src/content/cases/case4.ts` (or next case number).
2. Open `src/content/cases/index.ts` and add two lines:
   ```ts
   import { CASE_4 } from './case4';

   export const ALL_CASES: Record<string, CaseDef> = {
     case_1: CASE_1,
     case_2: CASE_2,
     case_3: CASE_3,
     case_4: CASE_4, // <-- Add here
   };

   export const CASE_LIST: CaseDef[] = [CASE_1, CASE_2, CASE_3, CASE_4]; // <-- Add here
   ```

That's it! The case will automatically appear in the in-game Case Dossier menu with its custom units, characters, and debrief report.

