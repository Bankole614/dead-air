import asyncio
import os
import re
import edge_tts

VOICE_MAP = {
  "martha": "en-GB-SoniaNeural",       # Elderly, proper British/refined older woman
  "ross": "en-US-EricNeural",           # Breathless, hurried, anxious male
  "c3": "en-US-RogerNeural",           # Calm, eerie, mysterious male
}

LINES = [
  # MARTHA GABLE
  ("martha", "gable_intro", "Hello? Emergency? I... I hate to be a nuisance at this hour, but there is someone scraping along the brickwork behind my bedroom.", "-5%"),
  ("martha", "gable_address", "114 Elm Street, second floor. No, I'm inside with my deadbolts fastened. It just sounds like metal dragging on gravel. It stopped for a second, then started again.", "-5%"),
  ("martha", "gable_details", "Yes, locks are on. I peered through the blinds, but the streetlamp on Elm has been flickering out all week. It's pitch black down there. Wait... I heard a recycling bin tumble over.", "-5%"),
  ("martha", "gable_impatient", "I know what the line is for, young man! My late husband was in precinct 3! You don't have to be curt with an old woman alone in the dark.", "+0%"),
  ("martha", "gable_dispatched", "Thank you, operator. You're very kind. I'll leave the porch light flicked on for them. Goodnight.", "-5%"),
  ("martha", "gable_reassured", "Alright... maybe you're right. Old ears play tricks in the drafts. Thank you for answering, dear. Goodnight.", "-5%"),

  # DAVID ROSS
  ("ross", "ross_intro", "Oh God... please... don't make me talk loud. There's someone downstairs. They just shattered the glass in the back patio door.", "+10%"),
  ("ross", "ross_location", "I'm upstairs... in the master bedroom walk-in closet. I pulled the louvered door shut. It's completely black in here, no windows, just coats. I can hear floorboards groaning downstairs.", "+12%"),
  ("ross", "ross_voices", "No voices! Just boots. Heavy steps. I'm curled up in the master bedroom interior closet under some coats. It's pitch black.", "+10%"),
  ("ross", "ross_slip", "I didn't see them come in! But... there's a dark blue sedan idling across the street under the maple tree, its engine is still ticking. They parked crooked by the hydrant... wait. Please just send cops!", "+12%"),
  ("ross", "ross_defenseless", "No weapons, no gun, nothing! Just my cell phone. Please, tell me a squad car is en route! How long will they take?", "+15%"),
  ("ross", "ross_caught", "I... What did you say? I meant... I saw it before I ran upstairs! When I was locking the front door! Why are you interrogating me while my house is being broken into?!", "+8%"),
  ("ross", "ross_stall", "No, just me. My wife is out of town. Just... please hurry. I think they are coming up the stairs. Send everything you have!", "+10%"),
  ("ross", "ross_hold_agitated", "Hold?! Are you insane?! Do not put me on hold! Operator! Operator!!", "+18%"),
  ("ross", "ross_panic_hangup", "Ditch it! The desk caught the sedan call, wrap it up now!", "+15%"),
  ("ross", "ross_dispatched_early", "Thank you... thank God. Please tell them to hurry. I won't make a sound.", "+5%"),
  ("ross", "ross_dispatched_late", "Okay. I hear sirens far away. I'm staying down.", "+5%"),

  # THE STATIC VOICE (C3)
  ("c3", "c3_intro", "Good evening, Operator 7. Welcome to the graveyard shift. The tea on your console is getting cold.", "-8%"),
  ("c3", "c3_identity", "You can check your binder under Frequent Pranks. They told you to write me off as code 4. But you already know tonight isn't code 4, don't you?", "-5%"),
  ("c3", "c3_trace_mockery", "County Telecom rerouted their trunk line through junction 12 six minutes ago. The signal isn't coming from outside the facility, Operator 7.", "-5%"),
  ("c3", "c3_observation", "Because your predecessor, Operator 4, drank black coffee. You prefer chamomile. And you spent the first eighteen minutes fidgeting with the headset volume.", "-6%"),
  ("c3", "c3_ross_insight", "Blackwood Lane wasn't a robbery. It was a decoy to pull Unit 104 out of the River District. And if you checked the log, Unit 104's transponder took twelve extra minutes to respond.", "-5%"),
  ("c3", "c3_the_reveal", "The break-in at 412 Blackwood wasn't meant to steal jewelry. It was meant to pull Unit 104 away from the municipal reservoir. Look at your dispatch log at 23:00 when the radio chatter starts.", "-6%"),
  ("c3", "c3_the_warning", "I am the one who worked your console before they took her away. Keep your notebook open, 7. At 23:15, a woman will call crying about her missing brother. Do NOT dispatch Medical to the bridge. Listen to the background of her call.", "-7%"),
  ("c3", "c3_concluding_line", "You don't have to believe me. Just listen. The dead air always tells the truth before they do. See you at midnight.", "-10%"),
]

OUT_DIR = os.path.join("public", "audio", "voices", "case1")
os.makedirs(OUT_DIR, exist_ok=True)

async def generate():
    for speaker, node_id, text, rate in LINES:
        voice = VOICE_MAP[speaker]
        out_path = os.path.join(OUT_DIR, f"{node_id}.mp3")
        # clean text from parenthetical stage directions for clean speaking
        clean_text = re.sub(r'\(.*?\)', '', text).strip()
        if not clean_text:
            continue
        print(f"Generating {node_id} ({speaker}) -> {out_path}...")
        communicate = edge_tts.Communicate(clean_text, voice, rate=rate)
        await communicate.save(out_path)
    print("All voice lines generated successfully!")

if __name__ == "__main__":
    asyncio.run(generate())
