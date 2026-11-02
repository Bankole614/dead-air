# Dead Air: Product Requirements Document

**Version:** 0.1 (Draft)
**Owner:** AY
**Platform:** Web (desktop-first, mobile-friendly)
**Stack:** TypeScript, React, Vite, Howler.js (audio), Zustand (state)
**Genre:** Narrative thriller / investigation / resource management

---

## 1. Overview

**Dead Air** is a browser-based thriller where the player works the night shift at an emergency helpline. They never see anything. They only hear and read what callers say. Over one night (10 PM to 6 AM), they take calls, dispatch limited resources, keep a notebook, and slowly realize that one caller is connected to something far bigger than a routine emergency.

The core fantasy is **powerlessness with responsibility**: you can't act directly, you can only decide who to believe.

### 1.1 One-line pitch
*You can't see anything, you can't leave your desk, and someone on the line is lying to you.*

### 1.2 Why this game
- Suspense comes from limited information, not graphics.
- Cheap to build solo: mostly state, text, audio, and UI.
- Naturally replayable through branching outcomes.
- Plays to the builder's strengths: frontend engineering and video/sound/pacing instincts.

---

## 2. Goals and Non-Goals

### 2.1 Goals
1. Deliver a gripping 45 to 60 minute single-night experience.
2. Make players *think*: take notes, cross-reference, and catch contradictions.
3. Create real consequences. Every dispatch decision matters and some are irreversible.
4. Support at least 3 distinct endings driven by player choices and deductions.
5. Ship a playable vertical slice (one 10-minute "hour") before building the full night.

### 2.2 Non-Goals (v1)
- No 3D, animation-heavy visuals, or voice acting beyond a small number of key lines.
- No multiplayer.
- No procedurally generated stories. Content is hand-authored.
- No native mobile apps.
- No monetization system in v1.

---

## 3. Target Audience

| Segment | Description | What they want |
|---|---|---|
| Primary | Fans of *Her Story*, *Papers, Please*, *Return of the Obra Dinn*, *Orwell* | Deduction, moral weight, and story that rewards attention |
| Secondary | Thriller and true-crime audiences | Atmosphere, twists, and a good "I knew it!" moment |
| Tertiary | Casual browser-game players | A short, intense session with a shareable ending |

**Session length:** 45 to 60 minutes for one full night. Autosave allows pause and resume.

---

## 4. Core Game Loop

```
Incoming call -> Listen/Read -> Question the caller -> Take notes
      -> Decide: Dispatch / Hold / Escalate / Dismiss -> Consequence (immediate or delayed)
      -> Next call (clock advances)
```

**Macro loop (per shift):** 8 hours of in-game time compressed into about 50 real minutes. The pace accelerates as the night progresses, and the final hour (5 to 6 AM) is where the central twist resolves.

---

## 5. Setting and Narrative

### 5.1 Setting
A small-city regional emergency and crisis line. Fluorescent lights, a cold coffee machine, a dying radio, and a city outside the window the player never sees. The player is **Operator 7**, a new hire covering a colleague's shift.

### 5.2 Story structure
The story is built from an **Answer Key**, a private document the player never sees, that defines:
- What actually happened that night.
- Who is involved and why.
- The true timeline, minute by minute.
- Which calls are connected, which are noise, and which are lies.

> **Design rule:** Write the truth first. Every clue in the game must be traceable to a line in the Answer Key.

### 5.3 Cast (target: 6 core callers, plus 4 to 6 filler calls)

| ID | Role | Surface story | Hidden truth | Tell (how a sharp player catches them) |
|---|---|---|---|---|
| C1 | Frightened caller | Hears someone in their house | Is the intruder's accomplice, stalling | Mentions a detail only a person outside could know |
| C2 | Calm witness | Reports a car accident | Saw something worse and is hiding it | Changes the street name between calls |
| C3 | Returning caller | Calls every night with a "prank" | Is giving warnings, not pranking | Knows things before they happen |
| C4 | Colleague (radio) | Dispatcher on another channel | Is compromised | Timestamp mismatch in logs |
| C5 | Distressed relative | Looking for a missing person | Is the cause of the disappearance | Over-explains, details too rehearsed |
| C6 | Anonymous caller | Gives a cryptic tip | Is the actual victim, unable to speak freely | Yes/no answers, background audio |

(Final cast and twist to be locked in the Answer Key. See Section 12.)

### 5.4 Endings (minimum 3)
1. **Dawn (Good):** Player identifies the real threat, saves the key victim, and exposes the compromised colleague.
2. **Static (Partial):** Some lives saved, but the central conspiracy stays hidden. The player is left with unanswered questions.
3. **Dead Air (Bad):** Player trusts the wrong caller, resources are misallocated, and the final call ends in silence.
4. *(Stretch)* **Hidden Ending:** Unlocked by catching the "impossible" caller's secret.

---

## 6. Gameplay Systems

### 6.1 Calls
- Calls arrive on a schedule with some randomized timing for tension.
- Each call has: caller ID (may be blocked or spoofed), timestamp, location claim, duration, and a **dialogue tree**.
- The player can: **answer**, **put on hold**, **let it ring out**, or **transfer**.
- A call left on hold gets increasingly agitated (state change, shown in the UI).

### 6.2 Questioning
- Player chooses from a short list of prompts per node (3 to 5 options): clarifying questions, challenging a detail, requesting a repeat, or reassuring.
- Some options unlock only after the player has noted a specific clue (notebook-gated dialogue).

### 6.3 Dispatch and Resources
- Limited units: **Police (3), Medical (2), Fire (1), Welfare Check (2)**.
- Each dispatch locks a unit for a time window. Unavailable units mean hard choices.
- Dispatching to a false report can leave a real emergency uncovered.

### 6.4 Notebook (the signature mechanic)
- A free-form notebook plus structured pins.
- Player can **pin** any line from a transcript to a character card or timeline.
- The game **never** marks what's important. The player decides.
- Contradictions are *not* auto-detected. The player must spot them. (Optional "accessibility assist" mode can highlight potential conflicts.)
- Notebook state is saved and also used by the game to unlock gated dialogue and to compute the ending.

### 6.5 Timeline Board
- A visual board with time slots from 10 PM to 6 AM.
- Player drags pinned items onto it to build their theory.
- Used at the **Final Call** to commit to an accusation.

### 6.6 Trust Meter (hidden)
- Each caller has a hidden trust score the game uses to shape their behavior. It is *not* shown to the player.
- Trust rises and falls based on whether the player's dispatches are validated or contradicted by later events.

### 6.7 Delayed Consequences
- Many dispatches show their outcome **only later** in the night, via follow-up calls, radio chatter, or a morning report.
- The player never gets a clean "you were right" screen mid-shift.

### 6.8 The Recurring Caller
- One caller (C3) rings back at fixed intervals with information that "shouldn't be possible."
- This is the thread that gradually reframes the entire night.

### 6.9 Shift Clock and Pacing

| In-game time | Real time | Beat |
|---|---|---|
| 10 PM to 12 AM | 0 to 12 min | Onboarding, routine calls, plant first clues |
| 12 AM to 2 AM | 12 to 25 min | First conflicts and the first impossible detail |
| 2 AM to 4 AM | 25 to 38 min | Pressure rises, resources run thin, lies start to unravel |
| 4 AM to 5 AM | 38 to 46 min | Twist reveal, compromised colleague, all lines lit |
| 5 AM to 6 AM | 46 to 55 min | Final Call and accusation, then the ending |

---

## 7. User Experience and Interface

### 7.1 Layout (desktop)

```
+------------------------------------------------------------+
|  CLOCK 02:47  |  UNITS: P P P  M M  F  W W  |  LINES: 1 2 3 |
+----------------------+-------------------------------------+
|   LIVE TRANSCRIPT    |          NOTEBOOK / BOARD           |
|   (typed + audio)    |   - pinned lines                    |
|                      |   - character cards                 |
|   [Response options] |   - timeline                        |
+----------------------+-------------------------------------+
|   DISPATCH PANEL     |   CALL QUEUE / LOG                  |
+------------------------------------------------------------+
```

### 7.2 Visual style
- Dark console aesthetic: amber and green phosphor, scanlines, subtle noise.
- Minimal motion. Light flicker and typing cadence do the work.
- High contrast and large type for readability.

### 7.3 Audio design (half the game)
- **Ambient bed:** room tone, HVAC hum, distant traffic, and a ticking clock.
- **Caller audio:** low-fidelity filtered voice lines for key moments (TTS or recorded for v1 key lines, text for the rest).
- **Background-detail audio:** a distant train, a dog, a TV, a door. These are clues.
- **Silence is a mechanic.** Dropped lines, dead air, and breathing carry tension.
- Audio is optional with full text fallback and captions.

### 7.4 Mobile
- Responsive stack: transcript on top, tabs for Notebook, Board, and Dispatch.
- Touch-friendly pin and drag interactions.

### 7.5 Accessibility
- Full captions for all audio, including descriptions of key background sounds.
- Adjustable text size, high-contrast mode, and reduced motion.
- Keyboard navigable.
- Optional contradiction-highlight assist.
- Content warning screen at start (distress, violence, emergency scenarios).

---

## 8. Functional Requirements

### 8.1 Must Have (MVP / Vertical Slice)
| ID | Requirement |
|---|---|
| F1 | Call queue with answer, hold, and ignore actions |
| F2 | Branching dialogue engine reading from JSON content |
| F3 | Live transcript rendering with typewriter pacing |
| F4 | Notebook with line pinning and free text |
| F5 | Unit dispatch with cooldown windows |
| F6 | In-game clock and scripted event scheduler |
| F7 | Ambient audio and per-call audio cues |
| F8 | Autosave and resume (localStorage) |
| F9 | One complete 10-minute "hour" with 3 callers |

### 8.2 Should Have (Full v1)
| ID | Requirement |
|---|---|
| F10 | Timeline board with drag-and-drop |
| F11 | Delayed-consequence engine (outcome queue) |
| F12 | Hidden trust model |
| F13 | Final Call and accusation flow |
| F14 | 3 endings plus end-of-night report |
| F15 | Accessibility settings |
| F16 | Settings: volume, text speed, captions |

### 8.3 Could Have (Post-v1)
- Hidden ending and New Game+ with a changed Answer Key.
- Shareable end-of-night summary card.
- Additional nights or DLC-style cases.
- Voice-acted key calls.
- Analytics-driven "what most players got wrong" screen.

---

## 9. Technical Architecture

### 9.1 Stack
- **Frontend:** React and TypeScript, bundled with Vite.
- **State:** Zustand (or Redux Toolkit) with a serializable store, so saving is trivial.
- **Audio:** Howler.js for layered ambient and one-shot cues.
- **Styling:** Tailwind or CSS Modules, with a CRT-style shader layer in CSS.
- **Persistence:** localStorage in v1 (IndexedDB if saves grow).
- **Hosting:** Static deploy (Vercel, Netlify, or the existing VPS).
- **Backend:** None in v1. Optional later for anonymous analytics and shared endings.

### 9.2 Architecture overview

```
/content          -> JSON: calls, dialogue nodes, events, endings
/engine
   scheduler.ts   -> game clock, event triggers
   dialogue.ts    -> node traversal, gating by notebook state
   dispatch.ts    -> units, cooldowns, outcomes
   consequences.ts-> delayed outcome queue
   trust.ts       -> hidden trust model
   endings.ts     -> ending resolver
/state            -> store, selectors, save/load
/ui               -> components (Console, Transcript, Notebook, Board, Dispatch)
/audio            -> sound manager, cue map
```

Principle: **content is data, engine is code.** Writers (you, and Claude as a drafting partner) edit JSON without touching engine logic.

### 9.3 Data model (simplified)

```ts
type Call = {
  id: string;
  callerId: string;
  scheduledAt: string;        // in-game time "02:15"
  callerIdDisplay: string;    // may be spoofed
  entryNode: string;
  priority: 'low' | 'medium' | 'high';
};

type DialogueNode = {
  id: string;
  speaker: 'caller' | 'operator' | 'system';
  text: string;
  audioCue?: string;
  background?: string[];      // clue tags, e.g., ["train", "dog"]
  options?: Option[];
  next?: string;
};

type Option = {
  label: string;
  next: string;
  requiresPin?: string[];     // notebook-gated
  trustDelta?: number;
  effects?: Effect[];
};

type Effect =
  | { type: 'dispatch'; unit: UnitType; location: string }
  | { type: 'queueConsequence'; id: string; delayMin: number }
  | { type: 'setFlag'; key: string; value: boolean };

type Consequence = {
  id: string;
  triggerAt: string;          // computed from delay
  condition: string;          // flag expression
  outcomeNode: string;
};
```

### 9.4 Save data
- Serializable snapshot: clock, flags, trust values, notebook pins, dispatch state, consequence queue, and current node.
- Versioned schema with a migration function.

### 9.5 Performance
- Initial load under 3 seconds on a mid-range connection (lazy-load audio per hour).
- Audio streamed or preloaded per segment. Target total under 40 MB for v1.

### 9.6 Analytics (optional)
- Anonymous event logging: endings reached, completion time, and drop-off points. Opt-in only.

---

## 10. Content Pipeline

1. **Answer Key** (1 to 2 pages, private): truth, timeline, motives.
2. **Clue map:** for each fact, list how a player can discover it.
3. **Call sheets:** per caller, a script outline with their lie and their slip.
4. **Draft with AI assistance:** feed Claude the Answer Key plus a call sheet, and ask for transcripts where the caller hides X and slips on Y. Edit for voice.
5. **Consistency pass:** a spreadsheet of every clue, timestamp, and name, checked against the Answer Key.
6. **Implement in JSON.**
7. **Playtest and revise.**

> **Rule:** AI drafts, you decide. Clue consistency is the author's responsibility.

---

## 11. Scope and Milestones

| Milestone | Deliverable | Target |
|---|---|---|
| **M0: Design lock** | Answer Key, cast, endings outline | Week 1 |
| **M1: Engine prototype** | Dialogue traversal, call queue, clock, transcript UI | Weeks 2 to 3 |
| **M2: Vertical slice** | One "hour": 3 callers, notebook, dispatch, ambient audio | Weeks 4 to 5 |
| **M3: Slice playtest** | 5 to 10 external testers, feedback round | Week 6 |
| **M4: Full night build** | All hours, delayed consequences, board, trust model | Weeks 7 to 11 |
| **M5: Endings and polish** | Final Call, endings, accessibility, audio pass | Weeks 12 to 13 |
| **M6: Beta and launch** | Bug fixes, content warnings, deploy, itch.io/web release | Weeks 14 to 15 |

(Adjust to your available hours per week. This assumes part-time solo work.)

---

## 12. Open Questions
1. What is the central twist? (Compromised colleague, staged crime, or something else.)
2. Text-only, TTS, or real voice for key lines?
3. Single linear night with branches, or branching state that changes the night itself?
4. Tone: grounded realism, or slightly surreal and paranoid?
5. Is there a persistent meta-layer (e.g., a "case file" carried across replays)?

---

## 13. Success Metrics

| Metric | Target |
|---|---|
| Slice completion rate (testers who finish the first hour) | 70% or more |
| Players who say "I want to know what happens next" | 80% or more of testers |
| Average notebook usage (pins per session) | 15 or more |
| Full-night completion rate | 40% or more |
| Players reaching more than one ending | 25% or more |
| Qualitative: "I caught a lie" moments reported | Majority of testers |

---

## 14. Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Writing workload balloons | High | Cap at 6 core callers; interlock stories rather than expand them |
| Clues contradict each other accidentally | High | Answer Key plus clue consistency spreadsheet |
| Too hard or too vague, players feel lost | Medium | Playtest early, optional assist mode, gentle in-world hints |
| Too much reading, pacing drags | Medium | Short lines, audio cues, timed pressure, dispatch decisions every few minutes |
| Audio quality or licensing | Medium | Use royalty-free or self-recorded sound; keep a source log |
| Sensitive subject matter | Medium | Content warning, avoid graphic detail, no real helpline branding |
| Scope creep (branching explosion) | High | Use flags and state, not unique branches per choice; merge paths often |

---

## 15. Appendix: Vertical Slice Spec (First Hour)

**Goal:** Prove the core loop is gripping in 10 minutes.

- **Time window:** 10:00 PM to 11:00 PM (compressed).
- **Calls:** 3 (one routine, one ambiguous, one that plants the first "impossible" detail).
- **Units:** Police (2), Medical (1).
- **Systems live:** call queue, dialogue, notebook, dispatch, clock, ambient audio.
- **Ends with:** a callback from C3 that references something the player hasn't told anyone.
- **Pass criteria:** testers voluntarily ask for the next hour.

---

*End of document.*
