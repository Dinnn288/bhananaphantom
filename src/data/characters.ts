import { Hero } from '../types';
import { INITIAL_SPIRITS, applyAwakenRankToSpirit } from './spirits';

const getSpirit = (id: string, fallbackIdx: number) => {
  const base = INITIAL_SPIRITS.find(s => s.id === id) || INITIAL_SPIRITS[fallbackIdx];
  return applyAwakenRankToSpirit(base, 1);
};

export const INITIAL_HEROES: Hero[] = [
  {
    id: 'renald',
    name: 'Renald Suryakusuma',
    alias: 'CROW',
    role: 'Pemimpin / Penyerang Agni & Fisik',
    quote: '“Aku tidak akan lari lagi... Kakak, berikan kekuatanmu padaku!”',
    avatarColor: 'from-red-600 to-red-950',
    themeColor: '#e60012',
    maxHp: 480,
    hp: 480,
    maxSp: 140,
    sp: 140,
    baseAtk: 65,
    baseDef: 42,
    speed: 55,
    gunBullets: 8,
    maxGunBullets: 8,
    equippedSpiritId: 'garuda_hayam',
    spirits: [getSpirit('garuda_hayam', 0)],
    isDown: false,
    highlightGauge: 25,
    isDefending: false
  },
  {
    id: 'maya',
    name: 'Maya Kirana',
    alias: 'MIRROR',
    role: 'Dukungan / Pembeku Tirta & Pemulih',
    quote: '“Melodi kebenaran akan menghapus segala ilusi palsu di sekolah ini.”',
    avatarColor: 'from-cyan-500 to-blue-950',
    themeColor: '#00f5d4',
    maxHp: 410,
    hp: 410,
    maxSp: 210,
    sp: 210,
    baseAtk: 48,
    baseDef: 38,
    speed: 62,
    gunBullets: 6,
    maxGunBullets: 6,
    equippedSpiritId: 'nyai_candra_kirana',
    spirits: [getSpirit('nyai_candra_kirana', 8)],
    isDown: false,
    highlightGauge: 30,
    isDefending: false
  },
  {
    id: 'bagas',
    name: 'Bagas Perkasa',
    alias: 'THUNDER',
    role: 'Brawler / Penyerang Guntur & Tank',
    quote: '“Maju sini kalian para hantu pengecut, rasakan bogem mentahku!”',
    avatarColor: 'from-amber-500 to-amber-950',
    themeColor: '#ffd166',
    maxHp: 560,
    hp: 560,
    maxSp: 120,
    sp: 120,
    baseAtk: 74,
    baseDef: 58,
    speed: 46,
    gunBullets: 5,
    maxGunBullets: 5,
    equippedSpiritId: 'bharata_petir',
    spirits: [getSpirit('bharata_petir', 9)],
    isDown: false,
    highlightGauge: 20,
    isDefending: false
  }
];
