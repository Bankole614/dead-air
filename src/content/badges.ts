export interface BadgeDef {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  category: 'accuracy' | 'speed' | 'investigation' | 'tenure';
  iconName: 'Award' | 'Zap' | 'Headphones' | 'Shield' | 'PhoneCall' | 'Star';
}

export const BADGE_CATALOG: BadgeDef[] = [
  {
    id: 'badge_grade_s',
    title: "Sheriff's Medal of Deduction",
    subtitle: 'Grade S Perfect Investigation',
    description: 'Achieved a perfect 100/100 score on Form 911-B by correctly identifying the culprit, target, and evidence.',
    category: 'accuracy',
    iconName: 'Award',
  },
  {
    id: 'badge_swift_response',
    title: 'Rapid Dispatch Commendation',
    subtitle: 'Solved in Under 10 Minutes',
    description: 'Resolved the emergency crisis and submitted the correct verdict in under 10 in-game minutes.',
    category: 'speed',
    iconName: 'Zap',
  },
  {
    id: 'badge_golden_ear',
    title: 'Acoustics Specialist Ribbon',
    subtitle: '4+ Audio Clues Pinned',
    description: 'Isolated and pinned 4 or more background acoustic environment clues to the investigation notebook.',
    category: 'investigation',
    iconName: 'Headphones',
  },
  {
    id: 'badge_decoy_breaker',
    title: 'Iron Discernment Medal',
    subtitle: 'Penetrated False Diversion',
    description: 'Discovered the true crime scene and protected county infrastructure without falling for the false alarm.',
    category: 'investigation',
    iconName: 'Shield',
  },
  {
    id: 'badge_switchboard_veteran',
    title: 'Wire Control Ribbon',
    subtitle: 'Multi-Line Hold Management',
    description: 'Successfully juggled simultaneous emergency lines without losing connection or abandoning calls.',
    category: 'tenure',
    iconName: 'PhoneCall',
  },
  {
    id: 'badge_anthology_veteran',
    title: 'All-Night Watch Commendation',
    subtitle: '3 Incident Files Solved',
    description: 'Investigated and successfully resolved at least 3 distinct case dockets in the county archives.',
    category: 'tenure',
    iconName: 'Star',
  },
  {
    id: 'badge_master_archivist',
    title: 'County Star of Honor',
    subtitle: 'All 5 Cases Completed',
    description: 'Mastered all 5 emergency transmission cases in the Dead Air archive. Highest civilian commendation.',
    category: 'tenure',
    iconName: 'Star',
  },
];

