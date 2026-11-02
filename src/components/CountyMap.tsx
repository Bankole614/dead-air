import React, { useState } from 'react';
import { useGameStore } from '../state/store';
import { MapPin, Shield, ShieldAlert } from './icons';

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
  { id: 'loc_elm', name: '114 Elm Street', type: 'incident', x: 28, y: 38, sector: 'SECTOR 1 [DOWNTOWN]', desc: 'Martha Gable residence (Noise complaint)' },
  { id: 'loc_blackwood', name: '412 Blackwood Lane', type: 'incident', x: 42, y: 72, sector: 'SECTOR 4 [RESIDENTIAL]', desc: 'David Ross residence (Reported burglary decoy)' },
  { id: 'loc_reservoir', name: 'North Municipal Reservoir', type: 'facility', x: 74, y: 22, sector: 'SECTOR 5 [UTILITIES]', desc: 'County water treatment & chemical pump station' },
  { id: 'loc_tower', name: 'Mount Baldy Transmitter', type: 'facility', x: 82, y: 65, sector: 'SECTOR 6 [UPLINK]', desc: 'County microwave broadcast relay array' },
  { id: 'loc_route_9', name: 'Route 9 Mile 40', type: 'incident', x: 18, y: 82, sector: 'SECTOR 3 [HIGHWAY]', desc: 'Hazardous transport corridor & mountain pass' },
  
  // Tactical Roadblock Checkpoints
  { id: 'cp_river_bridge', name: 'River Bridge Chokepoint', type: 'checkpoint', x: 48, y: 50, sector: 'CHOKEPOINT A', desc: 'Sole river crossing connecting Sector 4 to South Highway' },
  { id: 'cp_ridge_road', name: 'Ridge Road Access', type: 'checkpoint', x: 62, y: 28, sector: 'CHOKEPOINT B', desc: 'Paved access road leading into North Reservoir' },
  { id: 'cp_route_9', name: 'Route 9 Overpass', type: 'checkpoint', x: 25, y: 70, sector: 'CHOKEPOINT C', desc: 'County line highway border interception zone' },
];

export const CountyMap: React.FC = () => {
  const {
    activeUnits,
    activeRoadblocks,
    toggleRoadblock,
  } = useGameStore();

  const [selectedNode, setSelectedNode] = useState<MapNode | null>(MAP_LOCATIONS[0]);

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
          SECTOR 1: DOWNTOWN
        </div>
        <div className="absolute top-2 right-2 text-[9px] text-emerald-700 font-mono tracking-widest pointer-events-none">
          SECTOR 5: RESERVOIR
        </div>
        <div className="absolute bottom-2 left-2 text-[9px] text-emerald-700 font-mono tracking-widest pointer-events-none">
          SECTOR 3: ROUTE 9 PASS
        </div>
        <div className="absolute bottom-2 right-2 text-[9px] text-emerald-700 font-mono tracking-widest pointer-events-none">
          SECTOR 4: BLACKWOOD
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
                {/* Visual Marker Icon */}
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

                {/* Tooltip Label */}
                <div className={`mt-1 text-[9px] font-mono whitespace-nowrap px-1.5 py-0.5 rounded border pointer-events-none transition ${
                  isRoadblockActive
                    ? 'border-red-600 bg-black text-red-400 font-bold'
                    : isSelected
                    ? 'border-crt-amber bg-black text-crt-amber font-bold'
                    : 'border-neutral-800 bg-neutral-950/80 text-neutral-400 group-hover:text-white'
                }`}>
                  {loc.name} {isRoadblockActive && '[LOCKED]'}
                </div>
              </button>
            );
          })}

          {/* Real-time Patrol Unit Blips */}
          {Object.values(activeUnits).map((unit) => {
            const isDispatched = unit.status === 'dispatched';
            // Simulated position near center or assigned destination
            return (
              <div
                key={unit.id}
                className="absolute transition-all duration-1000 z-20 pointer-events-none"
                style={{
                  left: isDispatched ? '52%' : '32%',
                  top: isDispatched ? '45%' : '40%',
                }}
              >
                <div className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-ping"></span>
                  <span className="text-[9px] font-bold text-blue-300 bg-black/80 px-1 rounded border border-blue-900">
                    {unit.name.split(' ')[0]} {unit.status === 'dispatched' ? '→ EN ROUTE' : '● PATROL'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Location / Roadblock Tactical Panel */}
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
            <div className="text-[10px] text-neutral-500 italic shrink-0">
              Select a checkpoint chokepoint to issue roadblock orders
            </div>
          )}
        </div>
      )}
    </div>
  );
};

