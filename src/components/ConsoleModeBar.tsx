import React from 'react';
import { useGameStore } from '../state/store';
import { ConsoleMode } from '../types/game';
import { PhoneCall, MapPin, FolderArchive, Radio } from './icons';

export const ConsoleModeBar: React.FC = () => {
  const {
    consoleMode,
    setConsoleMode,
    callQueue,
    activeCallId,
    notebook,
    scannerFrequency,
    activeRoadblocks,
  } = useGameStore();

  const isCallIncoming = callQueue.length > 0;
  const isCallActive = !!activeCallId;
  const pinCount = notebook.pins.length;

  const MODES: Array<{
    id: ConsoleMode;
    key: string;
    label: string;
    sublabel: string;
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
    alert?: boolean;
    badge?: string;
  }> = [
    {
      id: 'switchboard',
      key: 'F1',
      label: 'SWITCHBOARD & WIRE',
      sublabel: isCallActive ? 'LINE ACTIVE' : isCallIncoming ? 'RINGING TRUNK' : 'STANDBY',
      icon: PhoneCall,
      alert: isCallIncoming,
      badge: isCallIncoming ? `${callQueue.length} CALL` : isCallActive ? 'ON AIR' : undefined,
    },
    {
      id: 'map',
      key: 'F2',
      label: 'VECTOR MAP & DISPATCH',
      sublabel: activeRoadblocks.length > 0 ? `${activeRoadblocks.length} ROADBLOCKS` : 'SECTORS 1-6',
      icon: MapPin,
      badge: activeRoadblocks.length > 0 ? `${activeRoadblocks.length} ACTIVE` : undefined,
    },
    {
      id: 'evidence',
      key: 'F3',
      label: 'EVIDENCE & DOSSIERS',
      sublabel: `${pinCount} CLUES PINNED`,
      icon: FolderArchive,
      badge: pinCount > 0 ? `${pinCount}` : undefined,
    },
    {
      id: 'scanner',
      key: 'F4',
      label: 'RADIO SCANNER',
      sublabel: `${scannerFrequency.toFixed(3)} MHz`,
      icon: Radio,
    },
  ];

  return (
    <div className="w-full bg-neutral-950/95 border-b border-neutral-800 px-3 py-1.5 flex items-center justify-between gap-2 select-none z-30 font-mono">
      <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto scrollbar-none py-0.5">
        <span className="hidden lg:inline text-[10px] text-neutral-500 font-bold px-1 tracking-wider">
          TERMINAL SCREEN:
        </span>

        {MODES.map((m) => {
          const isActive = consoleMode === m.id;
          const Icon = m.icon;

          return (
            <button
              key={m.id}
              onClick={() => setConsoleMode(m.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded transition text-left border relative group shrink-0 ${
                isActive
                  ? 'bg-neutral-800 text-crt-amber border-crt-amber shadow-[0_0_12px_rgba(245,158,11,0.25)]'
                  : m.alert
                  ? 'bg-red-950/80 text-red-200 border-red-600 animate-pulse'
                  : 'bg-neutral-900/80 text-neutral-400 border-neutral-800 hover:text-neutral-200 hover:border-neutral-700'
              }`}
            >
              {/* LED status light */}
              <span
                className={`w-2 h-2 rounded-full shrink-0 ${
                  isActive
                    ? 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]'
                    : m.alert
                    ? 'bg-red-500 animate-ping'
                    : 'bg-neutral-600'
                }`}
              />

              {/* Icon */}
              <Icon className="w-3.5 h-3.5 shrink-0" />

              {/* Text */}
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-neutral-500 font-bold">[{m.key}]</span>
                  <span className="text-xs font-bold tracking-wider">{m.label}</span>
                </div>
                <span className="text-[9px] text-neutral-500 group-hover:text-neutral-400 transition">
                  {m.sublabel}
                </span>
              </div>

              {/* Badge */}
              {m.badge && (
                <span
                  className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase tracking-wider ml-1 ${
                    m.alert
                      ? 'bg-red-800 text-white animate-bounce'
                      : isActive
                      ? 'bg-amber-950 text-crt-amber border border-amber-700/60'
                      : 'bg-neutral-800 text-neutral-400'
                  }`}
                >
                  {m.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Quick Status / Hotkey Hint */}
      <div className="hidden xl:flex items-center gap-3 text-[10px] text-neutral-500 shrink-0">
        <span className="flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 bg-neutral-900 border border-neutral-700 rounded text-neutral-300">F1-F4</kbd>
          or
          <kbd className="px-1.5 py-0.5 bg-neutral-900 border border-neutral-700 rounded text-neutral-300">1-4</kbd>
          SWITCH SCREENS
        </span>
        <span className="flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 bg-neutral-900 border border-neutral-700 rounded text-neutral-300">SPACE</kbd>
          TALK / ANSWER
        </span>
      </div>
    </div>
  );
};
