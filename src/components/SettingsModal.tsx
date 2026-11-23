import React, { useState } from 'react';
import { useGameStore } from '../state/store';
import { GameMode } from '../types/game';
import { Settings, X, Monitor, Volume2, FastForward, Shield, Headphones, Trash2 } from './icons';

interface SettingsModalProps {
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ onClose }) => {
  const { settings, updateSettings, factoryResetAllData } = useGameStore();
  const [confirmWipe, setConfirmWipe] = useState<boolean>(false);

  const modes: Array<{ id: GameMode; label: string; desc: string }> = [
    { id: 'story', label: 'STORY / GUIDED', desc: 'No surge timers, no hold agitation, shows dialogue hints' },
    { id: 'standard', label: 'STANDARD', desc: 'Balanced 1994 dispatch rules & challenges' },
    { id: 'hardcore', label: 'HARDCORE', desc: 'Hides dialogue tags & locked challenge spoilers' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 font-mono select-none">
      <div className="max-w-lg w-full bg-crt-panel border-2 border-neutral-700 rounded-lg shadow-2xl p-4 sm:p-5 text-neutral-200 max-h-[90dvh] flex flex-col">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3 mb-4 shrink-0">
          <div className="flex items-center gap-2 text-sm font-bold text-crt-amber">
            <Settings className="w-4 h-4" />
            <span>TERMINAL SETTINGS &amp; PREFERENCES</span>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3.5 text-xs overflow-y-auto pr-1 flex-1 min-h-0">
          {/* Gameplay Mode Selector */}
          <div className="p-3 bg-neutral-900 rounded border border-neutral-800">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-crt-amber" />
              <div>
                <div className="font-bold text-neutral-200">Gameplay &amp; Difficulty Mode</div>
                <div className="text-[10px] text-neutral-500">
                  {modes.find((m) => m.id === settings.gameMode)?.desc}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {modes.map((m) => (
                <button
                  key={m.id}
                  onClick={() => updateSettings({ gameMode: m.id })}
                  className={`py-2 px-2 rounded text-[10px] font-bold border transition ${
                    settings.gameMode === m.id
                      ? 'border-crt-amber bg-amber-950/40 text-crt-amber'
                      : 'border-neutral-800 bg-neutral-800/40 text-neutral-400 hover:text-white'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Atmospheric Audio & SFX */}
          <div className="flex items-center justify-between p-3 bg-neutral-900 rounded border border-neutral-800">
            <div className="flex items-center gap-2.5">
              <Volume2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <div className="font-bold text-neutral-200">Master Sound Effects (SFX)</div>
                <div className="text-[10px] text-neutral-500">Phone ringers, radio static, line clicks &amp; room hum</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.soundEnabled}
              onChange={(e) => updateSettings({ soundEnabled: e.target.checked })}
              className="w-4 h-4 accent-amber-500 rounded cursor-pointer shrink-0"
            />
          </div>

          {/* Separate Voice Acting / Speech Synthesis Toggle */}
          <div className="flex items-center justify-between p-3 bg-neutral-900 rounded border border-neutral-800">
            <div className="flex items-center gap-2.5">
              <Headphones className="w-4 h-4 text-crt-amber shrink-0" />
              <div>
                <div className="font-bold text-neutral-200">Spoken Caller Voices &amp; TTS</div>
                <div className="text-[10px] text-neutral-500">Uncheck to read transcripts silently while keeping SFX</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.voiceEnabled}
              onChange={(e) => updateSettings({ voiceEnabled: e.target.checked })}
              className="w-4 h-4 accent-amber-500 rounded cursor-pointer shrink-0"
            />
          </div>

          {/* CRT scanlines toggle */}
          <div className="flex items-center justify-between p-3 bg-neutral-900 rounded border border-neutral-800">
            <div className="flex items-center gap-2.5">
              <Monitor className="w-4 h-4 text-blue-400 shrink-0" />
              <div>
                <div className="font-bold text-neutral-200">CRT Monitor Scanlines</div>
                <div className="text-[10px] text-neutral-500">Retro 1994 horizontal phosphor scanline overlay</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.crtScanlines}
              onChange={(e) => updateSettings({ crtScanlines: e.target.checked })}
              className="w-4 h-4 accent-amber-500 rounded cursor-pointer shrink-0"
            />
          </div>

          {/* Text speed */}
          <div className="p-3 bg-neutral-900 rounded border border-neutral-800">
            <div className="flex items-center gap-2.5 mb-2">
              <FastForward className="w-4 h-4 text-purple-400 shrink-0" />
              <div>
                <div className="font-bold text-neutral-200">Transcript Typing Speed</div>
                <div className="text-[10px] text-neutral-500">Speed of incoming dialogue teletype animation</div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {(['normal', 'fast', 'instant'] as const).map((speed) => (
                <button
                  key={speed}
                  onClick={() => updateSettings({ textSpeed: speed })}
                  className={`py-1.5 rounded uppercase text-[11px] font-bold border transition ${
                    settings.textSpeed === speed
                      ? 'border-crt-amber bg-amber-950/40 text-crt-amber'
                      : 'border-neutral-800 bg-neutral-800/40 text-neutral-400 hover:text-white'
                  }`}
                >
                  {speed}
                </button>
              ))}
            </div>
          </div>

          {/* Factory Reset Save Data */}
          <div className="p-3 bg-red-950/20 rounded border border-red-900/50 flex items-center justify-between gap-3">
            <div>
              <div className="font-bold text-red-300 text-xs">Factory Reset Save Data</div>
              <div className="text-[10px] text-neutral-400">Clears all saved progress, solved cases, and medals</div>
            </div>
            {!confirmWipe ? (
              <button
                onClick={() => setConfirmWipe(true)}
                className="px-3 py-1.5 bg-red-950 hover:bg-red-900 text-red-200 border border-red-800 rounded text-[11px] font-bold flex items-center gap-1 shrink-0 transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>WIPE DATA</span>
              </button>
            ) : (
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => {
                    factoryResetAllData();
                    setConfirmWipe(false);
                    onClose();
                  }}
                  className="px-2.5 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded text-[11px] font-bold transition"
                >
                  CONFIRM WIPE
                </button>
                <button
                  onClick={() => setConfirmWipe(false)}
                  className="px-2 py-1.5 bg-neutral-800 text-neutral-300 rounded text-[11px] transition"
                >
                  CANCEL
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-neutral-800 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-crt-amber hover:bg-yellow-400 text-black rounded text-xs font-bold transition"
          >
            SAVE &amp; CLOSE
          </button>
        </div>
      </div>
    </div>
  );
};
