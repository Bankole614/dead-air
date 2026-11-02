import React, { useState } from 'react';
import { useGameStore } from '../state/store';
import { sound } from '../engine/sound';
import { Radio, Pin, Volume2 } from './icons';

interface ChannelPreset {
  freq: number;
  label: string;
  name: string;
  description: string;
}

const PRESETS: ChannelPreset[] = [
  { freq: 154.80, label: 'CH 1', name: 'COUNTY SHERIFF TACTICAL', description: 'Primary sheriff patrol & cruiser trunk' },
  { freq: 27.185, label: 'CH 2', name: 'CB CHANNEL 19 (UNLICENSED)', description: 'Local short-range walkie-talkies & trucker traffic' },
  { freq: 162.55, label: 'CH 3', name: 'NOAA CIVIL DEFENSE WIRE', description: 'Continuous atmospheric & weather telemetry' },
  { freq: 462.57, label: 'CH 4', name: 'PRIVATE REPEATER / CARRIER', description: 'Restricted county microwave carrier signal' },
];

export const RadioScanner: React.FC = () => {
  const {
    scannerFrequency,
    setScannerFrequency,
    addPinnedClue,
    radioFeed,
    inGameTimeSeconds,
    activeCaseId,
  } = useGameStore();

  const [playingMessageId, setPlayingMessageId] = useState<string | null>(null);

  const hours = Math.floor(inGameTimeSeconds / 3600);
  const minutes = Math.floor((inGameTimeSeconds % 3600) / 60);
  const timeFormatted = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;

  // Find matching preset within 0.05 MHz tolerance
  const matchedPreset = PRESETS.find(p => Math.abs(p.freq - scannerFrequency) < 0.04);
  const isTunedIn = !!matchedPreset;

  const playTransmissionVoice = (id: string, speaker: string, text: string) => {
    setPlayingMessageId(id);
    sound.playStaticBurst(0.15);
    sound.speakText(text, 'radio', speaker, () => {
      sound.playStaticBurst(0.08);
      sound.playRadioChirp();
      setPlayingMessageId(null);
    });
  };

  const handleSelectPreset = (freq: number) => {
    sound.playRadioChirp();
    setScannerFrequency(freq);
  };

  // Dynamic transmissions based on case & frequency
  const getTransmissions = () => {
    if (!matchedPreset) return [];

    if (matchedPreset.freq === 154.80) {
      const baseSheriff = [
        {
          id: 'sheriff_01',
          speaker: 'DISPATCH CENTRAL',
          text: 'All Sector 4 units: maintain visual awareness near public utilities. County curfew in effect.',
          time: '22:02',
        },
      ];
      const dispatches = radioFeed.map(rf => ({
        id: rf.id,
        speaker: rf.unitName.toUpperCase(),
        text: rf.text,
        time: rf.timestamp,
      }));
      return [...baseSheriff, ...dispatches];
    }

    if (matchedPreset.freq === 27.185) {
      if (activeCaseId === 'case_1') {
        return [
          {
            id: 'cb_01',
            speaker: 'UNKNOWN [WALKIE 1]',
            text: '(Whispering over wind) "Ross, you on line? Keep that dispatcher tied up. We just reached the North Gate fence."',
            time: '22:06',
          },
          {
            id: 'cb_02',
            speaker: 'UNKNOWN [WALKIE 2]',
            text: '"Roger that. 911 board is swamped with calls from Elm Street. The decoy worked. Move the vehicle now."',
            time: '22:12',
          },
        ];
      }
      return [
        {
          id: 'cb_generic',
          speaker: 'CB TRUCKER 44',
          text: 'Heads up westbound Route 9, bridge access is slow. Thick fog rolling off Blackwood Creek.',
          time: timeFormatted,
        }
      ];
    }

    if (matchedPreset.freq === 162.55) {
      return [
        {
          id: 'noaa_01',
          speaker: 'NOAA WEATHER STATION',
          text: 'CIVIL ADVISORY: Flash thunderstorm warning in effect for Blackwood Basin. Substation grid experiencing irregular voltage surges.',
          time: '22:00',
        },
        {
          id: 'noaa_02',
          speaker: 'NOAA BAROMETRIC TELEMETRY',
          text: 'Barometric pressure dropping to 29.42 inHg. Wind gusts to 45 MPH across mountain passes.',
          time: '22:10',
        }
      ];
    }

    if (matchedPreset.freq === 462.57) {
      return [
        {
          id: 'rep_01',
          speaker: 'REPEATER BEACON // 462.57',
          text: '...PULSE... TONE 88.5 HZ ... RESERVOIR SLUICE VALVE TELEMETRY: NOMINAL ... REMOTE RELAY ARMED ...',
          time: '22:05',
        },
        {
          id: 'rep_02',
          speaker: 'CRYPTIC VOICE // FREQ 462.57',
          text: 'Operator 7... do not look at the lights. Listen to the dead air between their words. The truth was never in the house.',
          time: '22:15',
        }
      ];
    }

    return [];
  };

  const transmissions = getTransmissions();

  const handleTuneStep = (delta: number) => {
    const next = Math.max(20, Math.min(500, scannerFrequency + delta));
    setScannerFrequency(next);
  };

  return (
    <div className="flex-1 h-full min-h-0 flex flex-col lg:flex-row bg-[#080d12] font-mono text-neutral-300 select-none overflow-y-auto lg:overflow-hidden">
      {/* Left Column: Physical Rotary Radio Faceplate */}
      <div className="w-full lg:w-5/12 min-h-[440px] lg:min-h-0 lg:h-full flex flex-col justify-between p-4 border-b lg:border-b-0 lg:border-r border-neutral-800 bg-neutral-950/80 overflow-y-auto shrink-0 lg:shrink">
        <div className="space-y-3">
          {/* Hardware Faceplate Header */}
          <div className="p-3 bg-neutral-900/90 border border-neutral-800 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-crt-amber glow-amber" />
                <span className="text-xs font-bold text-crt-amber tracking-wider">
                  REGENCY 1994 RF SCANNER
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-[10px]">
                <span className="text-neutral-500">CARRIER:</span>
                <span className={`font-bold ${isTunedIn ? 'text-emerald-400' : 'text-neutral-600'}`}>
                  {isTunedIn ? '■■■■■■ LOCK' : '■□□□□□ NOISE'}
                </span>
              </div>
            </div>

            {/* Digital LED Display */}
            <div className="p-3 bg-[#050e07] border border-emerald-950 rounded flex items-center justify-between shadow-inner">
              <div>
                <div className="text-[10px] text-emerald-600 font-bold">TUNED FREQUENCY</div>
                <div className="text-2xl font-black text-emerald-400 tracking-widest font-mono drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]">
                  {scannerFrequency.toFixed(3)} <span className="text-sm font-normal text-emerald-600">MHz</span>
                </div>
              </div>

              <div className="text-right">
                <div className="text-[10px] text-emerald-600 font-bold">CHANNEL TRUNK</div>
                <div className="text-xs font-bold text-emerald-300">
                  {matchedPreset ? matchedPreset.name : 'DEAD AIR // SQUELCH'}
                </div>
                <div className="text-[10px] text-emerald-600">
                  {matchedPreset ? matchedPreset.description : 'Adjust dial to search for carriers'}
                </div>
              </div>
            </div>

            {/* Channel Preset Buttons */}
            <div className="grid grid-cols-2 gap-1.5 mt-2.5">
              {PRESETS.map((preset) => {
                const isSelected = Math.abs(preset.freq - scannerFrequency) < 0.04;
                return (
                  <button
                    key={preset.freq}
                    onClick={() => handleSelectPreset(preset.freq)}
                    className={`p-2 rounded border text-left text-xs font-bold transition ${
                      isSelected
                        ? 'border-crt-amber bg-amber-950/40 text-crt-amber shadow-sm'
                        : 'border-neutral-800 bg-neutral-900/60 text-neutral-400 hover:text-white hover:bg-neutral-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{preset.label}</span>
                      <span className="text-[10px] text-neutral-500">{preset.freq.toFixed(2)} MHz</span>
                    </div>
                    <div className="text-[10px] font-normal truncate mt-0.5 opacity-80">
                      {preset.name}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Rotary Fine-Tuning Dial */}
            <div className="mt-3 pt-2.5 border-t border-neutral-800 space-y-2">
              <div className="flex items-center justify-between text-[10px] text-neutral-400">
                <span>ROTARY DIAL TUNING:</span>
                <span>RANGE: 20 - 500 MHz</span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleTuneStep(-5.0)}
                    className="px-2 py-1 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded text-[10px] text-neutral-300 transition"
                  >
                    -5.0
                  </button>
                  <button
                    onClick={() => handleTuneStep(-0.05)}
                    className="px-2 py-1 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded text-[10px] text-neutral-300 transition"
                  >
                    -0.05
                  </button>
                </div>

                <div className="flex-1 px-2">
                  <input
                    type="range"
                    min="20"
                    max="470"
                    step="0.05"
                    value={scannerFrequency}
                    onChange={(e) => setScannerFrequency(parseFloat(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer h-1.5 bg-neutral-800 rounded-lg"
                  />
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleTuneStep(0.05)}
                    className="px-2 py-1 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded text-[10px] text-neutral-300 transition"
                  >
                    +0.05
                  </button>
                  <button
                    onClick={() => handleTuneStep(5.0)}
                    className="px-2 py-1 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded text-[10px] text-neutral-300 transition"
                  >
                    +5.0
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Frequency Guide Footnote */}
        <div className="p-3 bg-neutral-900/40 border border-neutral-800 rounded text-[10px] text-neutral-500 space-y-1 mt-3">
          <div className="text-neutral-400 font-bold">OPERATOR RF GUIDE:</div>
          <div>• 154.80 MHz: County Sheriff Trunk (Patrol reports, roadblocks)</div>
          <div>• 27.185 MHz: CB Channel 19 (Unlicensed short-range truckers & walkies)</div>
          <div>• 162.55 MHz: NOAA Weather Wire (Storm advisories & grid alerts)</div>
          <div>• 462.57 MHz: Private Repeater (Encrypted microwave carrier)</div>
        </div>
      </div>

      {/* Right Column: Live Decrypted Audio Transmissions Wire */}
      <div className="w-full lg:w-7/12 min-h-[400px] lg:min-h-0 lg:h-full flex flex-col p-4 bg-neutral-950/70 overflow-hidden shrink-0 lg:shrink">
        <div className="flex items-center justify-between pb-2 mb-3 border-b border-neutral-800 text-xs shrink-0">
          <div className="flex items-center gap-2">
            <Radio className="w-3.5 h-3.5 text-crt-amber animate-pulse" />
            <span className="font-bold text-neutral-300 tracking-wider">
              DECRYPTED RF WIRE // {scannerFrequency.toFixed(3)} MHz
            </span>
          </div>
          <span className="text-[10px] text-neutral-500 font-mono">
            {isTunedIn ? 'CARRIER LOCK ACTIVE' : 'SQUELCH MUTE // HUNTING'}
          </span>
        </div>

        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
          {transmissions.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-neutral-600 p-8">
              <Radio className="w-10 h-10 mb-3 opacity-25 animate-pulse" />
              <div className="text-sm font-mono font-bold text-neutral-500">
                SQUELCH ACTIVE // NO CARRIER ON {scannerFrequency.toFixed(3)} MHz
              </div>
              <div className="text-xs text-neutral-600 mt-1 max-w-sm">
                Press one of the preset channel buttons (CH 1–CH 4) or use the rotary fine-tuning slider to tune into active frequency transmissions.
              </div>
            </div>
          ) : (
            transmissions.map((t) => (
              <div
                key={t.id}
                className="p-3 rounded-lg border border-neutral-800/80 bg-neutral-900/60 hover:border-amber-900/70 transition group text-xs font-mono space-y-2"
              >
                <div className="flex items-center justify-between text-[11px]">
                  <button
                    onClick={() => playTransmissionVoice(t.id, t.speaker, t.text)}
                    className="flex items-center gap-1.5 p-1 px-2 rounded bg-neutral-800/80 hover:bg-neutral-700 text-crt-amber hover:text-white transition group/btn"
                    title="Click to play synthesized walkie-talkie voice line"
                  >
                    <Volume2 className={`w-3.5 h-3.5 ${playingMessageId === t.id ? 'animate-bounce text-emerald-400' : 'text-crt-amber'}`} />
                    <span className="font-bold">{t.speaker}</span>
                    <span className="text-[9px] text-neutral-400 group-hover/btn:text-crt-amber">
                      {playingMessageId === t.id ? '[PLAYING...]' : '[LISTEN]'}
                    </span>
                  </button>

                  <div className="flex items-center gap-2">
                    <span className="text-neutral-500">{t.time}</span>
                    <button
                      onClick={() => addPinnedClue(t.text, t.speaker, 'radio_scanner', t.time)}
                      title="Pin intercepted audio to notebook dossier"
                      className="p-1 hover:text-crt-amber text-neutral-500 rounded transition flex items-center gap-1 hover:bg-neutral-800 px-1.5"
                    >
                      <Pin className="w-3 h-3" />
                      <span className="text-[9px]">PIN</span>
                    </button>
                  </div>
                </div>

                <div className="text-neutral-200 leading-relaxed pl-3 border-l-2 border-amber-900/50 text-[11px]">
                  {t.text}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
