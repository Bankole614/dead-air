# Dead Air: Product Requirements Document (PRD)

**Version:** 1.0 (Production Specification)  
**Status:** Implemented & Verified  
**Platform:** Web (Desktop-first, Adaptive Laptop & Tablet Responsive)  
**Stack:** TypeScript, React 18, Vite, Web Audio API, Zustand, Tailwind CSS  
**Genre:** Narrative Audio Thriller / 1994 Retro CRT Dispatch Simulator / Deduction Game  

---

## 1. Executive Summary

**Dead Air** is an atmospheric browser-based investigative thriller where the player operates the night shift switchboard at an aging rural emergency dispatch center in 1994 (**Operator 7**). The player cannot see outside their console: they interact strictly through telephone trunk wires, intercepted radio frequencies, a vector CRT county map, forensic audio analysis, and physical dispatch decisions.

Over the course of their shift, routine calls unravel into coordinated criminal sabotage, conflicting testimonies, electrical grid surges, and high-stakes moral dilemmas.

### 1.1 Core Fantasy
**Powerlessness with absolute responsibility:** You cannot leave your terminal, you cannot physically intervene, and someone on the line is deliberately feeding you decoys.

### 1.2 Core Gameplay Pillars
1. **Auditory & Textual Forensic Deduction:** Information is partial and subjective. Background acoustic artifacts (train horns, diesel engine rumble, rain on tin) reveal truths callers try to hide.
2. **Tactical Resource Scarcity:** Limited squad cruisers, ambulances, and fire units create punishing triage decisions and mutual exclusivity.
3. **Tactical Command Workstation (F1–F4):** A tactile 1994 CRT console mode switcher dividing the desk into focused operational screens without clutter.
4. **Mechanical Immersion & Environmental Hazards:** Circuit breaker overloads, analog radio squelches, mechanical rotary tuning, and CRT phosphor styling.

---

## 2. Workstation Terminal Architecture (Console Modes F1–F4)

To prevent cognitive overload, the workstation is organized into four dedicated hardware terminal screens, accessible via top console buttons or physical keyboard shortcuts (`[F1]`–`[F4]` or keys `[1]`–`[4]`):

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ [● OPERATOR 7]  SHIFT: 22:04  [⚡ BUS 120V]  [MEDALS (3)]  [MANUAL]  [SETTINGS] │
├─────────────────────────────────────────────────────────────────────────────────┤
│ [F1] SWITCHBOARD    [F2] VECTOR MAP & DISPATCH   [F3] EVIDENCE   [F4] SCANNER   │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### 2.1 Mode `[F1]` — Switchboard & Live Wire
- **Focused Call Conversation:** Full-width telephone wire console prioritizing readability.
- **Dynamic Content-Fit Layout:** The transcript height automatically hugs the conversation length. When a call starts with 1 line, dialogue options sit directly beneath it without scrolling. As exchanges grow, it smoothly expands and enables internal scrolling (`max-h-[48vh]`).
- **Compact Telephony Trunk Monitor:** Displays Line 01 (Operator), Line 02 (Incoming), and Line 03 (On-Hold). Features a `[▼ COMPACT]` toggle collapsing the 3 bulky line cards into a 30px status bar (`L1: ACTIVE | L2: IDLE | L3: IDLE`).
- **Gated Dialogue Challenges:** Operator responses that require investigative evidence (e.g., `[CHALLENGE CONTRADICTION]`) remain locked until required clues are pinned in the notebook.
- **Voice Playback & Speech Synthesis:** Dedicated `[Volume2]` triggers to replay character-acted lines or speech synthesis with specialized pitch/cadence.

### 2.2 Mode `[F2]` — Tactical Vector CRT Map & Dispatch CAD
- **1994 USGS Vector Map:** Interactive vector SVG map of Blackwood County (Sectors 1 through 6) with pulsing patrol radar blips and incident markers.
- **Deployable Spike Strip Roadblocks:** Clickable tactical chokepoints across **River Bridge (Sector 1)**, **Ridge Road Pass (Sector 3)**, and **Route 9 Border (Sector 2)**. Deploying roadblocks triggers simulated cruiser radio transmissions and catches fleeing suspects.
- **Computer-Aided Dispatch (CAD) Sidebar:** 
  - 2x2 grid of patrol unit cards (Cruiser 108, Rescue 3, Engine 12, Welfare Unit) with real-time status badges, assigned locations, and cooldown timers.
  - Manual address dispatch input form.
  - Full-height, scrollable **Live Patrol Radio SITREP Feed** streaming unit reports with one-click **`[PIN]`** evidence buttons.

### 2.3 Mode `[F3]` — Evidence Dossiers & Forensics
- **Evidence Pins Board:** Repository of all captured clues, speaker tags, timestamps, and operator notes.
- **Timeline Chronology:** Drag-and-drop 15-minute deduction slots (22:00–23:00) for cross-referencing caller alibis.
- **Persons of Interest:** Dossier cards for suspects and callers (Martha Gable, Subject 3, Clara Vance, Ruth Miller) with contradiction logs.
- **Operator Scratchpad:** Typewriter-style freeform shift notes.
- **Forensic Audio Oscilloscope & Scrubber:** 
  - Animated green phosphor vector CRT oscilloscope.
  - Audio playhead scrubber with variable playback speeds (0.75x, 1.0x, 1.25x).
  - Bandpass filtering: **FLAT**, **LOW-CUT** (treble boost for muffled whisper clarity), and **HIGH-CUT** (bass boost for rumbling engine notes).
  - Automatic acoustic signature detection with clue pinning.

### 2.4 Mode `[F4]` — Rotary Radio Scanner & Decrypted Wire
- **Hardware Receiver Deck:** 
  - Carrier signal lock meter (`■■■■■■ LOCK`).
  - Digital green LED frequency readout (`MHz`).
  - Analog rotary fine-tuning slider with step adjustment buttons (`-5.0`, `-0.05`, `+0.05`, `+5.0`).
  - Squelch white-noise static simulation when searching between carriers.
- **Frequency Presets:**
  - `154.80 MHz`: County Sheriff Tactical Trunk (patrol reports, roadblocks).
  - `27.185 MHz`: CB Trucker Channel 19 (unlicensed walkie-talkies and conspirator chatter).
  - `162.55 MHz`: NOAA Civil Defense Wire (storm advisories, barometric pressure).
  - `462.57 MHz`: Private Microwave Repeater (encrypted telemetry, cryptic transmissions).
- **Decrypted Audio Stream:** Full-height transmission log for the active frequency with character callsigns, timestamps, and interactive **`[LISTEN 🔊]`** voice synthesis playback.

---

## 3. Advanced Gameplay Mechanics

### 3.1 Workstation Hazard Events & Mechanical Circuit Breaker
- **440V Substation Overload:** Atmospheric lightning and switchboard draw trigger electrical faults during shift operations.
- **Warning Alert Banner:** Flashing amber/red emergency warning banner displaying voltage overload countdown (15s).
- **Physical Trip-Reset:** Press **`[R]`** or click the header Breaker switch to reset the bus. Plays procedural mechanical relay `CLUNK` audio and purges line static.
- **Blackout Consequence:** Neglected surges blow the main breaker, dropping active telephone calls to hold and activating backup generator delay.

### 3.2 High-Stakes Moral Divergences & Branching Dilemmas
- **Split-Dispatch Conflicts:** In critical narrative beats when multiple emergencies erupt and only one unit is in range, an emergency tactical modal triggers.
- **Mutually Exclusive Choices:**
  - *Option Alpha (Sawmill Structure Fire):* Dispatch unit to rescue trapped watchman and recover an accelerant canister; suspect vehicle slips through roadblock.
  - *Option Bravo (Route 9 Roadblock Intercept):* Box the fleeing suspect vehicle and recover stolen hydro blueprints; sawmill office collapses.
- **Consequence Engine:** Choices set narrative flags, generate live radio transmissions, log unique physical clues to the notebook, and influence case endings.

### 3.3 Dynamic Emergency Alert Beacons
- **Cross-Screen Awareness:** If the operator is investigating evidence on `[F3]` and a 911 call rings into the queue, the `[F1: SWITCHBOARD]` tab pulses red with `[1 INCOMING CALL ⚡]`.
- **Keyboard Shortcuts:** Pressing `Space` instantly switches to the switchboard and picks up the ringing line.

### 3.4 Civil Dispatch Commendations & Service Medals (Badges)
A persistent achievement and performance grading system rewarding deduction mastery and speed:
- **Sheriff's Medal of Deduction:** Attain Grade S on any incident case.
- **Rapid Dispatch Commendation:** Solve a case under 10 in-game minutes with Grade A or S.
- **Acoustics Specialist Medal:** Identify and pin 4+ acoustic background signatures.
- **Iron Discernment:** Correctly identify both the primary culprit and diversion target.
- **Switchboard Veteran:** Successfully triage multiple incoming lines under hold pressure.
- **Master Archivist:** Complete 5 full case files in the anthology.

---

## 4. Case Anthology Structure

The game supports an anthology of hand-authored cases (`src/content/cases.ts`):

| Case ID | Title | Incident Code | Time Window | Difficulty | Synopsis |
|---|---|---|---|---|---|
| `case_1` | *Dead Air at Blackwood Creek* | 10-99 (SUSPICIOUS / INTRUSION) | 22:00 - 23:00 | STANDARD | A noise complaint at 114 Elm St reveals a multi-call decoy operation targeting the municipal water supply. |
| `case_2` | *Substation Blackout* | 10-44 (GRID FAILURE) | 22:00 - 23:00 | HARD | Cascading power outages across Sector 5 mask an armed heist at the county transmission array. |
| `case_3` | *The Watcher on Route 9* | 10-88 (PROWLER / HAZARD) | 22:00 - 23:30 | HARD | Stranded motorists along a foggy highway report a phantom police cruiser signaling vehicles off the road. |
| `case_4` | *The Whispering Dam* | 10-50 (INFRASTRUCTURE FAILURE) | 22:00 - 23:00 | CRITICAL | Sluice gates open remotely; operators race against time to evacuate downstream residents and find the transmitter. |
| `case_5` | *Night Shift Final Protocol* | 10-00 (CIVIL CRISIS) | 22:00 - 00:00 | CRITICAL | All trunk lines flood simultaneously as the central switchboard itself is surrounded. |

### 4.1 Incident Dossier Filing & Verdict Scoring
At the conclusion of a case, the operator files an official **Incident Deduction Report**:
- **Primary Suspect:** Selection from identified persons of interest.
- **True Target:** Selection from potential infrastructure targets.
- **Corroborating Evidence:** Selection of pinned clues demonstrating contradiction or motive.
- **Scoring & Performance Grades:**
  - `S` (95–100): Flawless investigation; penetrated decoy and saved infrastructure.
  - `A` (80–94): Commendable performance; identified culprit and protected target.
  - `B` (60–79): Partial success; units responded but key contradictions were missed.
  - `C` / `F` (<60): Investigation failure; units diverted, culprits escaped.

---

## 5. Audio Architecture (Procedural Synthesis & Voice Engine)

Implemented in `src/engine/sound.ts` with zero external audio library dependencies:

1. **Web Audio API Procedural Synthesis:**
   - **Fluorescent Room Tone & HVAC Hum:** Dual oscillators (60Hz + 118Hz) through a low-pass filter (160Hz).
   - **DTMF Telephony Ringer:** Dual sine frequencies (440Hz + 480Hz) pulsed with standard 3.5s American cadence.
   - **Line Clicks & Receiver Lift:** Frequency sweep (350Hz -> 60Hz) with exponential gain drop.
   - **Mechanical Keyboard Typing:** Random jittered square-wave clicks (1200–1500Hz).
   - **Analog Rotary Dial Clicks:** Triangle wave pulses (600Hz -> 80Hz).
   - **RF Static Bursts:** Procedural white-noise buffer passed through a 1100Hz bandpass filter.
   - **Motorola Radio Carrier Chirp:** Two-tone sine pulse (880Hz -> 1240Hz).
   - **Circuit Breaker Trip & Reset:** Sawtooth surge pop + dual metallic mechanical square/triangle thuds.
2. **Speech Synthesis & Radio Voice Pipeline:**
   - Character pitch and cadence scaling based on caller identity (e.g. Martha Gable: pitch 1.15; Conspirators: pitch 0.72; Operator: steady 0.98).
   - Radio filter: Speech lines are bracketed with mic-key static bursts and roger beeps.
   - Voice audio playback rate scaling (0.5x to 2.0x) tied to forensic audio scrubber.

---

## 6. Technical Stack & State Model

- **Language:** TypeScript 5.6 (strict mode enabled).
- **UI Framework:** React 18 with Vite.
- **State Management:** Zustand 5 with single-source serializable snapshot store.
- **Persistence:** LocalStorage schema (`dead_air_save_v1`) serializing game clock, units, calls, notebook pins, character dossier notes, active roadblocks, hazard states, badges, and radio feeds.
- **Styling:** Tailwind CSS with custom CRT shaders (`crt-overlay`, phosphor scanline sweep animations).

---

## 7. Responsive & Accessibility Standards

- **Adaptive Dual-Scrolling System:**
  - Desktop displays (`1080p+`): Fixed CRT workstation frame (`h-screen overflow-hidden`) with independent internal scrollable panels.
  - Laptops and small screens (`< 1024px` width or short heights): Seamless vertical container scrolling (`overflow-y-auto`) ensuring no panel, map, or button is cut off.
- **Content-Fit Layouts:** Main transcript area hugs content height dynamically, allowing dialogue choices to sit directly beneath initial caller messages without requiring scroll.
- **Accessibility Assist Mode:** Optional toggle to highlight logical contradictions and acoustic clues in dialogue options.
- **Full Keyboard Navigation:**
  - `Space`: Answer call / Talk / Advance typewriter.
  - `F1` / `1`: Switchboard & Wire screen.
  - `F2` / `2`: Vector Map & Dispatch screen.
  - `F3` / `3`: Evidence & Dossier screen.
  - `F4` / `4`: Radio Scanner screen.
  - `R`: Trip-reset circuit breaker during power surge.
  - `P`: Pause shift clock.
