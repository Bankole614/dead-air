import React from 'react';
import { useGameStore } from '../state/store';
import { Settings, X, Monitor, Volume2, FastForward, HelpCircle } from './icons';

interface SettingsModalProps {
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ onClose }) => {
  const { settings, updateSettings } = useGameStore();

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 font-mono select-none">
      <div className="max-w-md w-full bg-crt-panel border border-neutral-700 rounded-lg shadow-2xl p-5 text-neutral-200">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3 mb-4">
          <div className="flex items-center gap-2 text-sm font-bold text-crt-amber">
            <Settings className="w-4 h-4" />
            <span>OPERATOR TERMINAL PREFERENCES</span>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-white transition">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4 text-xs">
          {/* CRT scanlines toggle */}
          <div className="flex items-center justify-between p-2.5 bg-neutral-900 rounded border border-neutral-800">
            <div className="flex items-center gap-2.5">
              <Monitor className="w-4 h-4 text-crt-amber" />
              <div>
                <div className="font-bold text-neutral-200">CRT Monitor Scanlines</div>
                <div className="text-[10px] text-neutral-500">Phosphor flicker and retro horizontal scanlines</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.crtScanlines}
              onChange={(e) => updateSettings({ crtScanlines: e.target.checked })}
              className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
            />
          </div>

          {/* Sound toggle */}
          <div className="flex items-center justify-between p-2.5 bg-neutral-900 rounded border border-neutral-800">
            <div className="flex items-center gap-2.5">
              <Volume2 className="w-4 h-4 text-emerald-400" />
              <div>
                <div className="font-bold text-neutral-200">Atmospheric Audio & Telephony</div>
                <div className="text-[10px] text-neutral-500">HVAC room tone, phone rings, static, line clicks</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.soundEnabled}
              onChange={(e) => updateSettings({ soundEnabled: e.target.checked })}
              className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
            />
          </div>

          {/* Text speed */}
          <div className="p-2.5 bg-neutral-900 rounded border border-neutral-800">
            <div className="flex items-center gap-2.5 mb-2">
              <FastForward className="w-4 h-4 text-blue-400" />
              <div>
                <div className="font-bold text-neutral-200">Teletype Transmission Speed</div>
                <div className="text-[10px] text-neutral-500">Speed of live incoming call transcript typing</div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-2">
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

          {/* Assist Mode */}
          <div className="flex items-center justify-between p-2.5 bg-neutral-900 rounded border border-neutral-800">
            <div className="flex items-center gap-2.5">
              <HelpCircle className="w-4 h-4 text-purple-400" />
              <div>
                <div className="font-bold text-neutral-200">Investigation Assist Mode</div>
                <div className="text-[10px] text-neutral-500">Shows clue hints on gated dialogue choices</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.assistMode}
              onChange={(e) => updateSettings({ assistMode: e.target.checked })}
              className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
            />
          </div>
        </div>

        <div className="mt-5 pt-3 border-t border-neutral-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded text-xs font-bold transition"
          >
            CONFIRM & CLOSE
          </button>
        </div>
      </div>
    </div>
  );
};
