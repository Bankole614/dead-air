import React, { useState } from 'react';
import { useGameStore } from '../state/store';
import { MapPin, Shield, ShieldAlert, Send } from './icons';

interface MapNode {
  id: string;
  name: string;
  type: 'incident' | 'checkpoint' | 'facility';
  x: number; // percentage
  y: number; // percentage
  sector: string;
  desc: string;
}

const MAP_LOCATIONS: MapNode[] = [
  { id: 'loc_elm', name: '114 Elm Street', type: 'incident', x: 24, y: 34, sector: 'SECTOR 1 [DOWNTOWN]', desc: 'Martha Gable residence & City Records Annex block' },
  { id: 'loc_bellweather', name: '44 Mercer Way (Bellweather)', type: 'incident', x: 35, y: 26, sector: 'SECTOR 1 [MERCER DISTRICT]', desc: 'Bellweather Apartments & Adjacent Steam Machine Workshop' },
  { id: 'loc_mercer_18', name: '18 & 80 Mercer Street', type: 'incident', x: 40, y: 38, sector: 'SECTOR 1 [MERCER ROW]', desc: 'Judge Sterling Probate Residence (18) & East Porch (80)' },
  { id: 'loc_blackwood', name: '412 Blackwood Lane', type: 'incident', x: 44, y: 74, sector: 'SECTOR 4 [RESIDENTIAL]', desc: 'David Ross residence & West Archive Corridor approach' },
  { id: 'loc_reservoir', name: 'North Municipal Reservoir', type: 'facility', x: 74, y: 20, sector: 'SECTOR 5 [UTILITIES]', desc: 'County water treatment & chlorine manifold station' },
  { id: 'loc_tower', name: 'WNDR / Mount Baldy Array', type: 'facility', x: 82, y: 64, sector: 'SECTOR 6 [BROADCAST]', desc: 'WNDR 98.6 Studio Building & Microwave Broadcast Relay' },
  { id: 'loc_crossing_4', name: 'Old Mill Crossing 4', type: 'incident', x: 64, y: 78, sector: 'SECTOR 4 [OLD MILL SPUR]', desc: 'Decommissioned rail crossing, Pole 19 Feeder & Cho Ridge Orchard' },
  { id: 'loc_courthouse', name: 'County Courthouse Vault', type: 'facility', x: 30, y: 48, sector: 'SECTOR 1 [CIVIC CENTER]', desc: 'Courthouse Sub-Basement Master 911 Evidence Tape Vault' },
  { id: 'loc_route_9', name: 'Route 9 Petrol & Mile 40', type: 'incident', x: 18, y: 80, sector: 'SECTOR 3 [HIGHWAY]', desc: 'Route 9 Petrol Depot, Conrail Rail Crossing & Mountain Pass' },

  // Tactical Roadblock Checkpoints
  { id: 'cp_river_bridge', name: 'River Bridge Chokepoint', type: 'checkpoint', x: 48, y: 52, sector: 'CHOKEPOINT A', desc: 'Sole river crossing connecting Sector 4 to South Highway' },
  { id: 'cp_ridge_road', name: 'Ridge Road Access', type: 'checkpoint', x: 62, y: 28, sector: 'CHOKEPOINT B', desc: 'Paved access road leading into North Reservoir' },
  { id: 'cp_route_9', name: 'Route 9 Overpass', type: 'checkpoint', x: 25, y: 66, sector: 'CHOKEPOINT C', desc: 'County line highway border & Petrol Depot overlook' },
];

export const CountyMap: React.FC = () => {
  const {
    activeUnits,
    activeRoadblocks,
    toggleRoadblock,
    dispatchUnit,
  } = useGameStore();

  const [selectedNode, setSelectedNode] = useState<MapNode | null>(MAP_LOCATIONS[1]);
  const availableUnits = Object.values(activeUnits).filter((u) => u.status === 'available');

  return (
    <div className="flex-1 flex flex-col bg-[#070c0f] p-3 text-neutral-300 font-mono select-none overflow-hidden">
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-neutral-800 text-xs shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-bold text-crt-amber tracking-wider glow-amber">
            COUNTY TACTICAL VECTOR CRT MAP // 1:50,000
          </span>
        </div>
        <div className="text-[10px] text-neutral-500 font-mono">
          DATUM: 1994 USGS GRID | ACTIVE ROADBLOCKS: {activeRoadblocks.length}
        </div>
      </div>

      {/* Main Vector CRT Map Canvas / SVG */}
      <div className="relative flex-1 bg-[#050a08] border border-emerald-950 rounded-lg overflow-hidden shadow-inner flex flex-col">
        {/* Vector Background Grid */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#10b981" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* County Road Arteries */}
          <path d="M 50 150 Q 150 200 250 200 T 450 100" fill="none" stroke="#059669" strokeWidth="2" strokeDasharray="4,2" />
          <path d="M 200 50 L 200 350" fill="none" stroke="#059669" strokeWidth="2" />
          <path d="M 100 280 L 380 280" fill="none" stroke="#059669" strokeWidth="1.5" />

          {/* County River Vector Line */}
          <path d="M 220 0 Q 240 180 200 220 T 260 400" fill="none" stroke="#0284c7" strokeWidth="4" opacity="0.6" />
        </svg>

        {/* Sector Labels */}
        <div className="absolute top-2 left-2 text-[9px] text-emerald-700 font-mono tracking-widest pointer-events-none">
          SECTOR 1: DOWNTOWN & MERCER
        </div>
        <div className="absolute top-2 right-2 text-[9px] text-emerald-700 font-mono tracking-widest pointer-events-none">
          SECTOR 5: RESERVOIR
        </div>
        <div className="absolute bottom-2 left-2 text-[9px] text-emerald-700 font-mono tracking-widest pointer-events-none">
          SECTOR 3: ROUTE 9 & PETROL DEPOT
        </div>
        <div className="absolute bottom-2 right-2 text-[9px] text-emerald-700 font-mono tracking-widest pointer-events-none">
          SECTOR 6: BROADCAST / BLACKWOOD
        </div>

        {/* Location Markers & Checkpoints */}
        <div className="relative flex-1">
          {MAP_LOCATIONS.map((loc) => {
            const isCheckpoint = loc.type === 'checkpoint';
            const isRoadblockActive = activeRoadblocks.includes(loc.id);
            const isSelected = selectedNode?.id === loc.id;

            return (
              <button
                key={loc.id}
                onClick={() => setSelectedNode(loc)}
                style={{ left: `${loc.x}%`, top: `${loc.y}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 group focus:outline-none z-10"
              >
                <div className={`p-1.5 rounded-full border transition-all flex items-center justify-center ${
                  isRoadblockActive
                    ? 'border-red-500 bg-red-950/80 text-red-300 animate-bounce shadow-[0_0_12px_rgba(239,68,68,0.8)]'
                    : isSelected
                    ? 'border-crt-amber bg-amber-950/80 text-crt-amber shadow-[0_0_10px_rgba(251,191,36,0.6)]'
                    : isCheckpoint
                    ? 'border-neutral-600 bg-neutral-900 text-neutral-400 hover:border-crt-amber hover:text-crt-amber'
                    : 'border-emerald-700 bg-emerald-950/60 text-emerald-400 hover:border-emerald-400'
                }`}>
                  {isRoadblockActive ? (
                    <ShieldAlert className="w-3.5 h-3.5" />
                  ) : isCheckpoint ? (
                    <Shield className="w-3 h-3" />
                  ) : (
                    <MapPin className="w-3 h-3" />
                  )}
                </div>

                <div className={`mt-1 text-[9px] font-mono whitespace-nowrap px-1.5 py-0.5 rounded border pointer-events-none transition ${
                  isRoadblockActive
                    ? 'border-red-600 bg-black text-red-400 font-bold block'
                    : isSelected
                    ? 'border-crt-amber bg-black text-crt-amber font-bold block'
                    : 'border-neutral-800 bg-neutral-950/80 text-neutral-400 group-hover:text-white hidden sm:block'
                }`}>
                  {loc.name} {isRoadblockActive && '[LOCKED]'}
                </div>
              </button>
            );
          })}

          {/* Real-time Patrol Unit Blips */}
          {Object.values(activeUnits).map((unit, idx) => {
            const isDispatched = unit.status === 'dispatched';
            return (
              <div
                key={unit.id}
                className="absolute transition-all duration-1000 z-20 pointer-events-none"
                style={{
                  left: isDispatched ? `${50 + idx * 6}%` : `${30 + idx * 5}%`,
                  top: isDispatched ? `${44 + idx * 4}%` : `${40 + idx * 4}%`,
                }}
              >
                <div className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-ping"></span>
                  <span className="text-[9px] font-bold text-blue-300 bg-black/80 px-1 rounded border border-blue-900">
                    {unit.name.split(' ')[0]} {unit.status === 'dispatched' ? `→ ${unit.assignedLocation}` : '● PATROL'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Location / Quick Dispatch or Roadblock Tactical Panel */}
      {selectedNode && (
        <div className="mt-3 p-3 bg-neutral-950 border border-neutral-800 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shrink-0">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-crt-amber font-bold">{selectedNode.sector}</span>
              <span className="text-[10px] text-neutral-500 font-mono">// TYPE: {selectedNode.type.toUpperCase()}</span>
            </div>
            <h4 className="font-bold text-sm text-neutral-100 truncate">{selectedNode.name}</h4>
            <p className="text-[11px] text-neutral-400 mt-0.5">{selectedNode.desc}</p>
          </div>

          {selectedNode.type === 'checkpoint' ? (
            <button
              onClick={() => toggleRoadblock(selectedNode.id)}
              className={`px-4 py-2 rounded font-bold text-xs flex items-center gap-2 transition active:scale-95 shadow-md shrink-0 ${
                activeRoadblocks.includes(selectedNode.id)
                  ? 'bg-red-600 hover:bg-red-500 text-white animate-pulse'
                  : 'bg-crt-amber hover:bg-yellow-400 text-black'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>
                {activeRoadblocks.includes(selectedNode.id)
                  ? 'DISMANTLE ROADBLOCK'
                  : 'ORDER TACTICAL ROADBLOCK'}
              </span>
            </button>
          ) : (
            <div className="flex items-center gap-2 shrink-0">
              {availableUnits.length > 0 ? (
                <button
                  onClick={() => dispatchUnit(availableUnits[0].id, selectedNode.name, 900)}
                  className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded text-xs flex items-center gap-1.5 shadow transition active:scale-95"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>DISPATCH {availableUnits[0].name.toUpperCase()} HERE</span>
                </button>
              ) : (
                <span className="text-[10px] text-red-400 font-bold">ALL UNITS CURRENTLY DEPLOYED</span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
