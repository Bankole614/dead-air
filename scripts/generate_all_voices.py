import asyncio
import os
import re

# Complete voice lineup for Dead Air cases 2-10
CASES_DATA = {
    "case6": {
        "dir": os.path.join("public", "audio", "voices", "case6"),
        "lines": [
            ("en-US-JennyNeural", "shaw_intro", "911?! Please hurry! I'm in Apartment 3B at the Bellweather building—44 Mercer Way! A minute ago there was a massive bang like a gunshot right across the airshaft, and I heard a man screaming something like, Get Don out of here! It has to be Donovan Vance, our caretaker—he threatened the landlord yesterday!", "+10%"),
            ("en-US-JennyNeural", "shaw_leading_contaminated", "Yes! Once you say it, I'm certain it was Donovan's voice! And I just looked out my kitchen window toward the rear alley—a man in coveralls just ran out the rear service door toward a van! He's getting away!", "+12%"),
            ("en-US-JennyNeural", "shaw_neutral_details", "There was only ONE bang—a huge metallic crack that shook my radiator pipes! Right after it, the airshaft filled with this loud hissing white vapor, and I saw someone in the rear alley climbing into a delivery van with a heavy diesel engine. Please send police before someone gets killed!", "+8%"),
            ("en-US-GuyNeural", "webb_intro", "Central Dispatch, this is Security Officer Marcus Webb at the 4th Street booth! I'm calling to confirm the shooting at Bellweather Apartments—44 Mercer Way! I heard TWO gunshots. I am 100 percent positive there were two distinct shots, and caretaker Donovan Vance is armed on the third floor!", "+5%"),
            ("en-US-GuyNeural", "webb_accepted", "Glad to help, Dispatch! Like I heard on the wire, definitely a double gunshot on the third floor. Lock him up!", "+5%"),
            ("en-US-GuyNeural", "webb_source_exposed", "Uh... well, that's my Regency scanner tuned to 154.80 megahertz! Look, I heard a distant thud around 22:00, and then when your dispatcher announced a possible double gunshot at Bellweather, watch for caretaker Donovan Vance at 22:05, I realized that must have been what I heard!", "+2%"),
            ("en-US-GuyNeural", "webb_caught_echo", "I... well, when you put it like that, I only heard a single muffled boom before the radio broadcast came over the air. I honestly thought the broadcast meant two shots were confirmed, so my memory filled in the second bang. Sorry, Dispatch.", "-2%"),
            ("en-US-EricNeural", "vance_intro", "911! This is Donovan Vance—caretaker at Bellweather Apartments! Why are people screaming that police are coming to shoot me?! We just had a 300-PSI main steam manifold blow its cast-iron flange in the machine workshop next to the third-floor airshaft! Before the valve burst, I screamed at my apprentice: GET DOWN! GET DOWN!", "+12%"),
            ("en-US-EricNeural", "vance_delivery_explained", "That was the Valley Bakery driver! He drops off crates at the ground-floor commissary at 22:00 every night in a loud diesel van! When the steam flange blew above the alley, it sounded like a cannon and vented boiling cloud out the louvers, so he jumped in his van and pulled out!", "+8%"),
            ("en-US-EricNeural", "vance_relieved", "Thank God somebody at that switchboard actually listens to the evidence instead of jumping at shadows. Main boiler feed is shut off—we'll wait by the front lobby for Engine 12.", "+2%"),
        ]
    },
    "case7": {
        "dir": os.path.join("public", "audio", "voices", "case7"),
        "lines": [
            ("en-US-RogerNeural", "sterling_intro", "Operator! This is Judge Arthur Sterling at 18 Mercer Street! Someone has broken into my residence through the WESTERN entrance! I was asleep in my downstairs study and woke up the exact moment my antique grandfather clock struck the hour—and I heard a man in the hall shout: Don't open the second door! Now I smell smoke coming from my probate file room!", "+5%"),
            ("en-US-RogerNeural", "sterling_confirm_study", "Yes, 18 Mercer Street, the western entrance! I am crouched right beside the grandfather clock in my study on the house line! The clock chimed once for the hour, without a hitch, right as the intruder yelled Don't open the second door! Send fire and patrol units immediately!", "+8%"),
            ("en-US-ChristopherNeural", "prentice_intro", "911! I'm calling from my porch at 80 Mercer Street—eight-zero Mercer! I just saw Judge Sterling himself walking briskly away from the payphone booth outside the corner diner toward the EASTERN entrance of 80 Mercer! And crazier still, a minute ago I swear I heard a voice say Don't open the second door!", "+8%"),
            ("en-US-ChristopherNeural", "prentice_tv_realization", "Wait a second... my living room TV is tuned to the WKBW Channel 7 late-night mystery movie, and the diner across the street by the payphone has the exact same channel playing on their counter set! That line—Don't open the second door!—was the commercial bumper they just played twice!", "+5%"),
            ("en-US-JennyNeural", "cora_intro", "Dispatch! This is Cora, the housekeeper at 18 Mercer Street! The smoke alarm in the Judge's study just went off—there's a fire burning in his locked probate cabinet! Listen, you can hear the study's antique grandfather clock right beside me—it has a broken gear that makes a loud mechanical DOUBLE-CHIME before every strike, except the main strike hammer jammed at 8:00 PM tonight!", "+10%"),
            ("en-US-JennyNeural", "cora_western_locked", "The western entrance?! I'm looking right at it—the heavy deadbolt on the western entrance is bolted shut from the INSIDE, with the Judge's own brass key sitting in the inside lock! He walked out the front twenty minutes ago carrying a briefcase after setting a delay candle in the probate file cabinet!", "+12%"),
            ("en-US-JennyNeural", "cora_resolved", "I'm heading out the front drive right now—I hear Engine 12's sirens turning onto Mercer Street! Thank you, Operator!", "+8%"),
        ]
    },
    "case8": {
        "dir": os.path.join("public", "audio", "voices", "case8"),
        "lines": [
            ("en-US-EricNeural", "tariq_intro", "911 Dispatch! I'm parked on the Route 9 overpass looking directly down at the Petrol Depot! Sixty seconds ago—right as a heavy Conrail freight train thundered over the rail crossing—there was a loud bang from the drainage culvert between the tracks and the pumps! I heard ONE explosion. Definitely one!", "+10%"),
            ("en-US-EricNeural", "tariq_resists_leading", "Fleeing?! No! His white coupe is parked right under the canopy with nobody in it! I see a guy in a station jacket down in the valve pit wrenching a big red shutoff wheel with both hands! And like I told you, there was only ONE bang down by the train culvert, not the fuel tanks!", "+10%"),
            ("en-US-EricNeural", "tariq_attendant_detail", "Nobody fled! The attendant's white coupe is still parked cleanly by the air pump, and I can see him in his reflective vest down in the concrete manifold trench cranking the emergency fuel cutoff wheel to isolate the storage tanks!", "+8%"),
            ("en-US-JennyNeural", "brenda_intro", "911! This is Brenda at the Mile 14 Diner down the highway from Route 9 Petrol! I'm calling about the bombing at the petrol station—I am ABSOLUTELY CERTAIN there were TWO explosions! Boom-boom, two separate bombs! And that attendant Cole Mercer must have sped past eastbound in his white coupe!", "+8%"),
            ("en-US-JennyNeural", "brenda_accepted", "You bet! Everyone at the counter heard the dispatcher say it on our scanner radio too, so we know for a fact it was a double explosion!", "+8%"),
            ("en-US-JennyNeural", "brenda_admits_radio", "Well... the truckers keep our counter radio tuned to the 154.80 megahertz sheriff relay! Look, our windows rattled once around 22:02, and then three seconds later the canyon echo bounced off the ridge—and when the radio announcer came on at 22:06 saying double explosion and a white coupe departing eastbound, I became 100 percent convinced!", "+4%"),
            ("en-US-GuyNeural", "doyle_intro", "Central Dispatch, Guard Frank Doyle at the South Gatehouse! Yes, two explosions—I'm positive! An unconfirmed double explosion—repeat, two blasts—at Route 9 Petrol Depot with a white coupe departing eastbound! And I just grabbed attendant Cole Mercer climbing out of the drainage trench covered in grease with a pipe wrench in his hand!", "+5%"),
            ("en-US-GuyNeural", "doyle_stands_down", "Uh... wait a minute, I'm looking through my binoculars at the station canopy right now... Mercer's white coupe IS still parked right by the air pump! Tell Dispatch I shut the main 8-inch petrol isolation valve! The Conrail freight train cracked the municipal gas main under the culvert!", "+5%"),
        ]
    },
    "case9": {
        "dir": os.path.join("public", "audio", "voices", "case9"),
        "lines": [
            ("en-US-GuyNeural", "nolan_intro", "911! This is Nolan Vance driving County Transit Coach 14! My alternator died right across the tracks at Old Mill Crossing 4 in pitch-black freezing fog! Ten seconds ago the wooden crossing barrier slammed down onto my roof! I can hear a weird wailing siren through the trees, and I just heard a man's voice up in the fog shout: Cut the third wire! It has to be that angry signalman Victor Krol!", "+10%"),
            ("en-US-GuyNeural", "nolan_leading_panic", "Krol?! If Krol is out there in the fog cutting wires, he's trying to cause a train wreck! Wait—why hasn't that wailing siren gotten any closer in the last two minutes? It's just droning at the exact same pitch from the apple orchard!", "+10%"),
            ("en-US-GuyNeural", "nolan_neutral_observation", "Wait... now that I stop and listen, that wailing sound hasn't changed pitch or moved an inch! It's coming from the big frost-fan tower in the apple orchard next to the tracks! And overhead I see an orange utility bucket truck flashing through the fog by Pole 19!", "+6%"),
            ("en-US-JennyNeural", "cho_intro", "911 Dispatch! This is Hannah Cho at Cho Ridge Orchard! You need to send every fire engine to Old Mill Crossing 4 right now—I am 100 percent positive a runaway train is hurtling down the Old Mill Spur toward that stalled bus, and Victor Krol sabotaged the crossing gates!", "+8%"),
            ("en-US-JennyNeural", "cho_accepted", "Yes! As soon as I heard your radio announcer say it on 154.80 megahertz while my orchard frost-siren was running, I knew it had to be true!", "+8%"),
            ("en-US-JennyNeural", "cho_realization", "Oh... wait a second. Yes, our automated 600-Hertz orchard frost-alarm klaxon kicked on at 22:01 when the temperature dropped below 28 degrees! And I had my kitchen scanner tuned to 154.80 megahertz when your relay announced a possible train emergency at Crossing 4!", "+4%"),
            ("en-US-EricNeural", "krol_intro", "Central Dispatch, this is Signalman Victor Krol at Relay Hut B! Why is Lieutenant Hale broadcasting my name over the sheriff band like a terrorist?! Listen to me: first, the Old Mill Spur tracks were physically unbolted and decommissioned four weeks ago—no train can physically enter Crossing 4! Second, the crossing gate dropped because an ice-coated overhead power line shorted out!", "+10%"),
            ("en-US-EricNeural", "krol_voice_explained", "That was the county power lineman up in the cherry-picker bucket at Pole 19! His crane loudspeaker is patched into the 462.57 megahertz repeater, and he yelled down to me: SHUT THE THIRD FEEDER! so we could de-energize the icy cable arching over the bus roof!", "+8%"),
            ("en-US-EricNeural", "krol_resolved", "Third feeder is locked out and grounded! The bus passengers are safe in the heated relay hut waiting for Engine 12. Appreciate you checking the facts before sending a SWAT team after me, Operator 7.", "+4%"),
        ]
    },
    "case10": {
        "dir": os.path.join("public", "audio", "voices", "case10"),
        "lines": [
            ("en-US-EricNeural", "gentry_intro", "911! This is Miles Gentry, night custodian at the County Courthouse! I'm whispering from the service phone outside the Sub-Basement Master Evidence Vault! Someone used an override key to lock themselves inside the tape vault ten minutes ago! Listen—every fifteen seconds you can hear the heavy magnetic bulk-degausser coil firing right alongside our broken basement sump-pump knock!", "+10%"),
            ("en-US-EricNeural", "gentry_leading_doubt", "A woman?! Well, if your captain says it's a woman, maybe the air duct distorted it... wait, no, that cough I just heard through the steel door sounded like a gravelly older man smoking a cigar, and he's carrying a command-band walkie-talkie!", "+8%"),
            ("en-US-EricNeural", "gentry_neutral_detail", "It was a deep, gravelly male voice—definitely not a woman! He smelled like cigar smoke when he walked past the freight elevator, and right before he fired up the magnetic tape degausser, I heard him key a sheriff's command radio to broadcast a BOLO about the Old Post Office!", "+8%"),
            ("en-US-JennyNeural", "rostova_intro", "Operator 7, don't hang up—this is Elena Rostova! I held your chair at Desk 7 before Captain Stahl fired me for refusing to delete Judge Sterling's dispatch logs! I'm sitting right here at Saint Anne's Hospital in front of two hospital security guards, yet I just heard Stahl go on 154.80 megahertz claiming three witnesses confirmed Rostova is at the Old Post Office!", "+8%"),
            ("en-US-JennyNeural", "rostova_ab_advice", "Use the Tektronix Dual-Tape A/B Comparator on F3! Captain Stahl always claims to be calling from his carpeted third-floor office at Police Headquarters—which is dead quiet. If he is actually inside the Courthouse Sub-Basement erasing the master 911 tapes, his microphone will pick up the 15-second magnetic degausser pulse and the basement sump-pump knock!", "+6%"),
            ("en-US-RogerNeural", "stahl_intro", "Operator 7, this is Captain Vernon Stahl calling from my third-floor office at Police Headquarters! Disregard any prank calls from the County Courthouse—that building is completely empty tonight! We now have three separate radio reports confirming Elena Rostova is at the Old Post Office payphone! Send every available patrol unit to the Old Post Office!", "+0%"),
            ("en-US-RogerNeural", "stahl_coverup_succeeds", "Good soldier, Operator 7. Always trust command authority over your own ears. Just let this last magnetic coil cycle finish and there won't be a single tape left in Blackwood County...", "-5%"),
            ("en-US-RogerNeural", "stahl_caught_finale", "You ran a dual-deck spectral comparison on my command line?! Damn you, Operator 7! Wait—I hear Sheriff's Tactical boots coming down the Courthouse sub-basement stairs right now! Put down that dispatch mic!", "+12%"),
        ]
    }
}

async def generate_all():
    import edge_tts
    for case_id, data in CASES_DATA.items():
        out_dir = data["dir"]
        os.makedirs(out_dir, exist_ok=True)
        print(f"--- Processing {case_id} ---")
        for voice, line_id, text, rate in data["lines"]:
            out_path = os.path.join(out_dir, f"{line_id}.mp3")
            clean_text = re.sub(r'\(.*?\)', '', text).strip()
            if not clean_text:
                continue
            if not os.path.exists(out_path) or os.path.getsize(out_path) == 0:
                print(f"Generating {line_id} -> {out_path}")
                for attempt in range(4):
                    try:
                        comm = edge_tts.Communicate(clean_text, voice, rate=rate)
                        await comm.save(out_path)
                        break
                    except Exception as e:
                        print(f"Attempt {attempt + 1} failed for {line_id}: {e}")
                        await asyncio.sleep(2)
            else:
                print(f"Skipping existing {out_path}")
    print("All cases 6-10 voiced successfully!")

if __name__ == "__main__":
    asyncio.run(generate_all())
