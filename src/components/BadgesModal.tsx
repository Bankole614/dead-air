import React from 'react';
import { useGameStore } from '../state/store';
import { BADGE_CATALOG, BadgeDef } from '../content/badges';
import { Award, Zap, Headphones, Shield, PhoneCall, Star, Lock, X } from './icons';

interface BadgesModalProps {
  onClose: () => void;
}

export const BadgesModal: React.FC<BadgesModalProps> = ({ onClose }) => {
  const { unlockedBadges } = useGameStore();

  const getBadgeIcon = (iconName: BadgeDef['iconName'], unlocked: boolean) => {
    const iconClass = `w-6 h-6 ${unlocked ? 'text-crt-amber glow-amber' : 'text-neutral-600'}`;
    switch (iconName) {
      case 'Award': return <Award className={iconClass} />;
      case 'Zap': return <Zap className={iconClass} />;
      case 'Headphones': return <Headphones className={iconClass} />;
      case 'Shield': return <Shield className={iconClass} />;
      case 'PhoneCall': return <PhoneCall className={iconClass} />;
      case 'Star': return <Star className={iconClass} />;
      default: return <Award className={iconClass} />;
    }
  };

  const unlockedCount = unlockedBadges?.length || 0;
  const totalCount = BADGE_CATALOG.length;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 font-mono select-none">
      <div className="max-w-3xl w-full bg-[#0d1117] border-2 border-crt-amber rounded-lg shadow-2xl p-6 text-neutral-200 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3 mb-4 shrink-0">
          <div className="flex items-center gap-3">
            <Award className="w-8 h-8 text-crt-amber glow-amber" />
            <div>
              <h2 className="text-base font-bold text-crt-amber glow-amber tracking-wider">
                SERVICE COMMENDATIONS & MEDALS
              </h2>
              <div className="text-xs text-neutral-400">
                COUNTY 911 CIVIL DISPATCH // OFFICIAL MERIT RECORD
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right px-3 py-1 bg-neutral-900 border border-neutral-700 rounded">
              <span className="text-[10px] text-neutral-500 font-bold block">HONORS EARNED</span>
              <span className="text-sm font-bold text-crt-amber">{unlockedCount} / {totalCount}</span>
            </div>
            <button onClick={onClose} className="text-neutral-400 hover:text-white transition">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Badges Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 overflow-y-auto pr-1 flex-1 min-h-0">
          {BADGE_CATALOG.map((badge) => {
            const unlockInfo = unlockedBadges?.find(b => b.id === badge.id);
            const isUnlocked = !!unlockInfo;

            return (
              <div
                key={badge.id}
                className={`p-3.5 rounded-lg border transition-all flex items-start gap-3.5 ${
                  isUnlocked
                    ? 'border-amber-600/60 bg-gradient-to-br from-amber-950/30 to-neutral-900/80 shadow-md shadow-amber-950/20'
                    : 'border-neutral-800/80 bg-neutral-900/30 opacity-70'
                }`}
              >
                {/* Badge Medal / Icon Box */}
                <div className={`p-3 rounded-md border shrink-0 flex flex-col items-center justify-center ${
                  isUnlocked
                    ? 'border-crt-amber bg-neutral-900 shadow-inner'
                    : 'border-neutral-800 bg-black/60'
                }`}>
                  {isUnlocked ? getBadgeIcon(badge.iconName, true) : <Lock className="w-5 h-5 text-neutral-600" />}
                  {isUnlocked && (
                    <div className="w-6 h-1 bg-crt-amber mt-2 rounded-full" />
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <h3 className={`font-bold text-xs truncate ${isUnlocked ? 'text-crt-amber glow-amber' : 'text-neutral-400'}`}>
                      {badge.title}
                    </h3>
                    <span className={`text-[10px] uppercase font-bold shrink-0 px-1.5 py-0.2 rounded border ${
                      isUnlocked
                        ? 'border-emerald-800 text-emerald-400 bg-emerald-950/30'
                        : 'border-neutral-800 text-neutral-600 bg-black/40'
                    }`}>
                      {isUnlocked ? 'AWARDED' : 'LOCKED'}
                    </span>
                  </div>

                  <div className="text-[11px] font-semibold text-neutral-300 mb-1">
                    {badge.subtitle}
                  </div>

                  <p className="text-[11px] text-neutral-400 leading-relaxed font-sans">
                    {badge.description}
                  </p>

                  {isUnlocked && (
                    <div className="mt-2 text-[10px] text-neutral-500 font-mono border-t border-neutral-800/80 pt-1 flex items-center justify-between">
                      <span>TIME: {unlockInfo.unlockedAt}</span>
                      <span className="uppercase text-crt-amber">CASE: {unlockInfo.caseId.replace('_', ' 0')}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-neutral-800 flex items-center justify-between text-[11px] text-neutral-500 shrink-0">
          <div>COMMENDATIONS PERSIST ACROSS ALL INCIDENT ARCHIVES</div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded font-bold transition text-xs"
          >
            CLOSE CABINET [ESC]
          </button>
        </div>
      </div>
    </div>
  );
};

