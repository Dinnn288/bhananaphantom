export type ElementType =
  | 'Agni'    // Api (Fire)
  | 'Tirta'   // Air/Es (Ice/Water)
  | 'Vidyut'  // Petir (Electric)
  | 'Bayu'    // Angin (Wind)
  | 'Nur'     // Cahaya Suci (Bless)
  | 'Ghaib'   // Kutukan Kegelapan (Curse)
  | 'Fisik'   // Serangan Fisik (Physical)
  | 'Peluru'; // Jimat Peluru / Ranged

export interface Skill {
  id: string;
  name: string;
  element: ElementType;
  spCost: number;
  hpCost?: number;
  power: number;
  target: 'single' | 'all' | 'ally' | 'all_allies';
  description: string;
  effectType?: 'damage' | 'heal' | 'buff' | 'debuff';
  hitAnimation?: 'slash' | 'flame' | 'ice' | 'lightning' | 'wind' | 'curse' | 'holy';
}

export interface SpiritCompanion {
  id: string;
  name: string;
  title: string;
  element: ElementType;
  rarity: 'R' | 'SR' | 'SSR';
  level: number;
  bonusHp: number;
  bonusSp: number;
  bonusAtk: number;
  bonusDef: number;
  lore: string;
  originStory: string; // The deep backstory of how the spirit was born or tied to the school
  signatureQuote: string;
  colorHex: string;
  avatarIcon: string;
  avatarUrl?: string;
  skills: Skill[];
  highlightSkill: Skill; // The Showtime / Highlight Ultimate
  awakenRank?: number; // 0 to 5 (Tingkat Kebangkitan Sukma I - V)
  awakenTitle?: string;
  awakenPassive?: string;
}

export interface Hero {
  id: string;
  name: string;
  alias: string;
  role: string;
  quote: string;
  avatarColor: string;
  themeColor: string;
  maxHp: number;
  hp: number;
  maxSp: number;
  sp: number;
  baseAtk: number;
  baseDef: number;
  speed: number;
  gunBullets: number;
  maxGunBullets: number;
  equippedSpiritId: string;
  spirits: SpiritCompanion[];
  isDown: boolean;
  highlightGauge: number; // 0 to 100
  isDefending: boolean;
}

export interface EnemyGhost {
  id: string;
  name: string;
  title: string;
  level: number;
  maxHp: number;
  hp: number;
  attack: number;
  defense: number;
  speed: number;
  element: ElementType;
  weaknesses: ElementType[];
  resistances: ElementType[];
  nullifies?: ElementType[];
  repels?: ElementType[];
  isDown: boolean;
  isBoss?: boolean;
  lore: string;
  secretHint: string;
  themeColor: string;
  skills: Skill[];
  avatarType: 'genderuwo' | 'kuntilanak' | 'pocong' | 'banaspati' | 'kepala_sekolah' | 'suster_ngesot' | 'kuyang';
  dropExp: number;
  dropGems: number;
}

export interface BattleLogEntry {
  id: string;
  text: string;
  type: 'action' | 'weakness' | 'critical' | 'down' | 'onemore' | 'allout' | 'highlight' | 'defeat' | 'system';
  color?: string;
}

export interface ClueDocument {
  id: string;
  title: string;
  code: string;
  location: string;
  found: boolean;
  excerpt: string;
  fullContent: string;
  date: string;
  importance: 'krusial' | 'rahasia' | 'terlarang';
}

export interface StoryChoice {
  text: string;
  nextNodeId: string;
  rewardText?: string;
  clueId?: string;
}

export interface StoryNode {
  id: string;
  speaker: string;
  speakerRole?: string;
  text: string;
  emotion?: 'normal' | 'shock' | 'determined' | 'smirk' | 'fear' | 'whisper';
  backgroundStyle: 'corridor' | 'music_room' | 'bio_lab' | 'rooftop' | 'stairwell' | 'boss_gate';
  speakerAvatar?: string;
  soundEffect?: string;
  choices?: StoryChoice[];
  autoNext?: string;
  triggerBattleEnemyId?: string;
  unlockClueId?: string;
  unlockSpiritId?: string;
}

export interface StoryChapter {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  startNodeId: string;
  isUnlocked: boolean;
  isCompleted: boolean;
  bossEnemyId: string;
  summary: string;
}
