import asyncio
import os
import re
import edge_tts

# Complete voice lineup for Dead Air cases
CASES_DATA = {
    "case2": {
        "dir": os.path.join("public", "audio", "voices", "case2"),
        "lines": [
            ("en-US-JennyNeural", "jenkins_intro", "Dispatch?! Thank God! I spun out on Route 9 right past the quarry cut. My tires are buried in a snowdrift. There's a massive industrial tanker truck jackknifed sideways across the whole highway!", "+10%"),
            ("en-US-JennyNeural", "jenkins_tanker_status", "I have a bruised shoulder, but I can walk. No smoke, but the tanker's lights are completely blacked out. Wait—there's a state trooper cruiser pulled up right behind the trailer, its roof emergency beacon is flashing bright red into the snow.", "+5%"),
            ("en-US-JennyNeural", "jenkins_cruiser_seen", "No! Nobody came to me. The trooper cruiser has its roof emergency lights spinning red, but two men in dark parkas are prying open the tanker's rear valves! That doesn't look like standard police procedure!", "+12%"),
            ("en-US-JennyNeural", "jenkins_hold_tight", "Okay... I'm ducking down below the dashboard. Please hurry. The blizzard is getting worse.", "-5%"),
            ("en-US-GuyNeural", "trooper_intro", "Operator 7, this is Trooper Vance on frequency 4. Disregard any motorist chatter about Mile 40. I am physically at the quarry cut right now. The road is clear. A salt truck already salted the grade.", "-5%"),
            ("en-US-GuyNeural", "trooper_deny_tanker", "Negative, negative. Just empty asphalt and drifting snow. We have a confirmed multi-vehicle pileup down in South Valley on County Road 12. Divert all available cruisers and hazmat to South Valley immediately.", "-2%"),
            ("en-US-GuyNeural", "trooper_cruiser_excuse", "My squad car's alternator blew out in the cold. My battery is 100% dead. I have zero emergency lights running. That's why I'm using a hand-crank auxiliary patch. Send everything south to Road 12.", "+0%"),
            ("en-US-GuyNeural", "trooper_exposed", "Who told you that?! Cut the transfer valve! The board is onto us!", "+15%"),
            ("en-US-GuyNeural", "trooper_diverted_bad", "Copy that, 7. Out.", "-5%"),
            ("en-US-EricNeural", "driver_intro", "Helpline... I'm the driver of tanker 88. Three guys in an old police cruiser forced me off the road into the snow. They took my uniform and keys! They're siphoning 10,000 gallons of industrial solvent!", "+12%"),
            ("en-US-EricNeural", "driver_safe", "Thank God... I see police headlights piercing through the blizzard right now. You caught them in time!", "+5%"),
        ]
    },
    "case3": {
        "dir": os.path.join("public", "audio", "voices", "case3"),
        "lines": [
            ("en-US-RogerNeural", "vance_intro", "Good evening, 911 dispatch. Arthur Vance here. We had a minor circuit trip in the fourth-floor soundproof control studio. I need you to transmit the master carrier override code to unlock the broadcast relays.", "-5%"),
            ("en-US-RogerNeural", "vance_claim_soundproof", "I told you, fourth-floor master control. Dead quiet in here, double acoustic insulation. We have six minutes before the midnight countdown. Transmit the code immediately.", "+0%"),
            ("en-US-RogerNeural", "vance_caught", "Sniper on the water tower! They know we're on the roof! Drop the transmitter equipment—move!", "+15%"),
            ("en-US-RogerNeural", "vance_hijack_success", "Code accepted. Thank you for your cooperation, Operator 7. Happy New Year.", "-10%"),
        ]
    },
    "case4": {
        "dir": os.path.join("public", "audio", "voices", "case4"),
        "lines": [
            ("en-US-JennyNeural", "archive_clara_intro", "This is Clara Bell at the City Records Annex. The basement alarm has gone off and smoke is pushing under the lower west-stair door. Elias Reed went down to check the West Cage and he has not come back.", "+5%"),
            ("en-GB-SoniaNeural", "east_gate_mara_intro", "Listen, I am outside the Records Annex by the east gate. Taxi driver. I saw smoke in the lower windows. Send your fire engine through the east loading ramp and keep them away from the west stair. The West Cage has two deadbolts; they are both thrown. Nobody is in there.", "+5%"),
            ("en-GB-SoniaNeural", "east_gate_mara_caught", "No. No, you cannot hear that from the gate. I am in the microfilm room. I came back for the red ledger after Elias found the altered entries. Elias was not supposed to be in the cage when I threw the bolts. Please—do not tell them I am still inside.", "+8%"),
            ("en-US-GuyNeural", "west_cage_elias_intro", "This is Elias Reed. I am in the West Cage. There is smoke coming through the bottom of the door and I cannot shift either bolt from this side. Mara Voss came down for the red ledger. She locked me in. Please get someone to this door.", "+10%"),
        ]
    },
    "case5": {
        "dir": os.path.join("public", "audio", "voices", "case5"),
        "lines": [
            ("en-US-GuyNeural", "studio_harker_intro", "Paul Harker, WNDR engineering. There is smoke coming through the tape-library door and the corridor alarm has started. Ruth Adeyemi was in Booth B a few minutes ago. I cannot raise her now. The transmitter exciter tripped at twenty-three forty-one; we are off-air.", "+5%"),
            ("en-US-ChristopherNeural", "north_gate_valle_intro", "Emergency dispatch? I am parked beside the WNDR north gate in my cab. I heard on 98.6 that they were having trouble, then I saw flames over by the antenna road. Send your fire engine straight up the north road to the transmitter annex.", "+0%"),
            ("en-US-ChristopherNeural", "north_gate_valle_caught", "Turn that off. You cannot know that. All right. I am in Studio A. The transmitter is dead and the cart is in CUE. I left the cue monitor running beside the handset to make it sound like a radio in a cab. Ruth copied the blue master reel. I locked her in Booth B. Do not let them open the tape library.", "+8%"),
            ("en-GB-LibbyNeural", "booth_ruth_intro", "Dispatch? Please—I am locked inside Production Booth B at WNDR. The corridor outside is completely filled with thick smoke. Malcolm Vale locked this door from the outside ten minutes ago. He took the master reel from the tape library.", "+10%"),
        ]
    }
}

async def generate_all():
    for case_id, data in CASES_DATA.items():
        out_dir = data["dir"]
        os.makedirs(out_dir, exist_ok=True)
        print(f"--- Processing {case_id} ---")
        for voice, line_id, text, rate in data["lines"]:
            out_path = os.path.join(out_dir, f"{line_id}.mp3")
            clean_text = re.sub(r'\(.*?\)', '', text).strip()
            if not clean_text:
                continue
            if not os.path.exists(out_path):
                print(f"Generating {line_id} -> {out_path}")
                comm = edge_tts.Communicate(clean_text, voice, rate=rate)
                await comm.save(out_path)
            else:
                print(f"Skipping existing {out_path}")
    print("All cases voiced successfully!")

if __name__ == "__main__":
    asyncio.run(generate_all())

