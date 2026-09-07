import { SpiritCompanion } from '../types';

export const INITIAL_SPIRITS: SpiritCompanion[] = [
  // ==========================================
  // 8 SSR SPIRITS (KELANGKAAN TERTINGGI - CHANCE 0.75%)
  // ==========================================
  {
    id: 'garuda_hayam',
    name: 'Garuda Hayam',
    title: 'Roh Sayap Bara Api Kebebasan',
    element: 'Agni',
    rarity: 'SSR',
    level: 1,
    bonusHp: 180,
    bonusSp: 60,
    bonusAtk: 45,
    bonusDef: 20,
    colorHex: '#e60012',
    avatarIcon: 'flame',
    signatureQuote: '“Kobarkan jiwamu! Jangan biarkan kegelapan merenggut cahaya saudaraku!”',
    lore: 'Burung api abadi berparuh elang dengan sayap bara menyala merah darah. Manifestasi dari tekad mendalam Gilang, kakak kandung Renald yang lenyap di sayap gedung lama pada 14 November 1998.',
    originStory: 'Saat insiden ritual 1998, Gilang mengunci dirinya bersama roh genderuwo kuno di dalam ruang arsip untuk memberi waktu kepada 12 murid lain melarikan diri. Di ambang kematian, darahnya menyatu dengan jimat kuno burung garuda peninggalan kakeknya.',
    skills: [
      {
        id: 'agni_strike',
        name: 'Agilao: Pukulan Bara',
        element: 'Agni',
        spCost: 28,
        power: 95,
        target: 'single',
        description: 'Menghantam target dengan tinju api bertekanan tinggi. (Konsumsi SP Berat - SSR Overpower)',
        effectType: 'damage',
        hitAnimation: 'flame'
      },
      {
        id: 'cleave_blade',
        name: 'Tebasan Cakar Garuda',
        element: 'Fisik',
        spCost: 0,
        hpCost: 45,
        power: 110,
        target: 'single',
        description: 'Tebasan cakar tajam berdaya hancur tinggi yang mengorbankan 45 HP. (SSR Overpower)',
        effectType: 'damage',
        hitAnimation: 'slash'
      },
      {
        id: 'maragion',
        name: 'Maragion: Badai Lahar',
        element: 'Agni',
        spCost: 48,
        power: 80,
        target: 'all',
        description: 'Membakar seluruh musuh di hadapan dengan hempasan sayap api berkobar. (Konsumsi SP Berat - SSR Overpower)',
        effectType: 'damage',
        hitAnimation: 'flame'
      },
      {
        id: 'tarukaja',
        name: 'Tarukaja: Kobaran Semangat',
        element: 'Nur',
        spCost: 36,
        power: 0,
        target: 'ally',
        description: 'Meningkatkan Attack sekutu sebesar 40% selama 3 ronde. (Konsumsi SP Tinggi - SSR Overpower)',
        effectType: 'buff'
      }
    ],
    highlightSkill: {
      id: 'hl_garuda',
      name: 'SHOWTIME: PENGHAKIMAN BARA HAYAM',
      element: 'Agni',
      spCost: 0,
      power: 320,
      target: 'all',
      description: 'Serangan sinematik pamungkas! Membumbung tinggi ke angkasa menembus atap sekolah, lalu menukik melumatkan seluruh hantu dengan ledakan kosmik!',
      effectType: 'damage',
      hitAnimation: 'flame'
    }
  },
  {
    id: 'banaspati_purba',
    name: 'Banaspati Purba',
    title: 'Mata Api Kutukan Berdarah',
    element: 'Agni',
    rarity: 'SSR',
    level: 1,
    bonusHp: 240,
    bonusSp: 80,
    bonusAtk: 60,
    bonusDef: 30,
    colorHex: '#ff4800',
    avatarIcon: 'skull',
    signatureQuote: '“Dendam berabad-abad... akan memangsamu hingga abu!”',
    lore: 'Bola api melayang berkepala tengkorak menakutkan yang dahulu menjadi senjata rahasia juru kunci makam keramat.',
    originStory: 'Tercipta dari abu pembakaran sesajen tumbal terlarang yang dilakukan yayasan sekolah pada masa gerhana matahari 1988.',
    skills: [
      {
        id: 'banas_blaze',
        name: 'Hellfire: Api Kawah Neraka',
        element: 'Agni',
        spCost: 35,
        power: 120,
        target: 'single',
        description: 'Menyemburkan magma cair beracun yang menghanguskan pertahanan musuh. (Konsumsi SP Berat - SSR Overpower)',
        effectType: 'damage',
        hitAnimation: 'flame'
      },
      {
        id: 'curse_gaze',
        name: 'Pandangan Maut Banaspati',
        element: 'Ghaib',
        spCost: 38,
        power: 90,
        target: 'single',
        description: 'Mengutuk target dengan energi gelap penurun Atk & Def musuh. (Konsumsi SP Berat - SSR Overpower)',
        effectType: 'debuff',
        hitAnimation: 'curse'
      }
    ],
    highlightSkill: {
      id: 'hl_banas',
      name: 'SHOWTIME: KIAMAT API BANASPATI',
      element: 'Agni',
      spCost: 0,
      power: 340,
      target: 'all',
      description: 'Memuntahkan lautan api neraka yang melalap seluruh dimensi pertempuran!',
      effectType: 'damage',
      hitAnimation: 'flame'
    }
  },
  {
    id: 'naga_antaboga',
    name: 'Naga Antaboga',
    title: 'Penguasa Inti Bumi Ghaib',
    element: 'Nur',
    rarity: 'SSR',
    level: 1,
    bonusHp: 300,
    bonusSp: 100,
    bonusAtk: 55,
    bonusDef: 60,
    colorHex: '#ffd700',
    avatarIcon: 'shield',
    signatureQuote: '“Bangkitlah wahai anak manusia, sang penutup gerbang takdir!”',
    lore: 'Sang Naga Pelindung berkulit emas permata yang mendiami retakan terdalam di bawah pondasi gedung sekolah.',
    originStory: 'Tertidur ribuan tahun menjaga pasak bumi tanah Jawa dari terbukanya gerbang kematian. Hanya bisa dibangkitkan oleh pewaris segel sejati.',
    skills: [
      {
        id: 'kougaon',
        name: 'Kougaon: Sinaran Surga',
        element: 'Nur',
        spCost: 36,
        power: 115,
        target: 'single',
        description: 'Menghantam musuh dengan berkas cahaya suci berkekuatan mutlak. (Konsumsi SP Berat - SSR Overpower)',
        effectType: 'damage',
        hitAnimation: 'holy'
      },
      {
        id: 'samarecarm',
        name: 'Mukjizat Antaboga: Kebangkitan',
        element: 'Nur',
        spCost: 75,
        power: 200,
        target: 'all_allies',
        description: 'Menyembuhkan seluruh tim dan memulihkan anggota tim yang tak sadarkan diri. (Konsumsi SP Ekstrem - SSR Overpower)',
        effectType: 'heal',
        hitAnimation: 'holy'
      }
    ],
    highlightSkill: {
      id: 'hl_antaboga',
      name: 'SHOWTIME: LILITAN NAGA EMAS KOSMIK',
      element: 'Nur',
      spCost: 0,
      power: 350,
      target: 'all',
      description: 'Naga raksasa melilit musuh lalu menghujamkan cakar cahaya penghancur kegelapan!',
      effectType: 'damage',
      hitAnimation: 'holy'
    }
  },
  {
    id: 'hyang_wisnu_cakra',
    name: 'Hyang Wisnu Cakra',
    title: 'Sang Penjaga Keseimbangan Kosmik',
    element: 'Tirta',
    rarity: 'SSR',
    level: 1,
    bonusHp: 280,
    bonusSp: 95,
    bonusAtk: 54,
    bonusDef: 48,
    colorHex: '#00b4d8',
    avatarIcon: 'sparkles',
    signatureQuote: '“Ketertiban semesta takkan pernah runtuh oleh ilusi kutukan sesat!”',
    lore: 'Dewa pemelihara bermahkota permata samudra dengan empat lengan memegang Cakra Sudarsana perak membekukan.',
    originStory: 'Terpanggil dari sumur purba bawah tanah SMA Bhawana yang telah mengalirkan air berkah penahan hawa panas kutukan sejak era Kerajaan Kahuripan.',
    skills: [
      {
        id: 'bufudyne',
        name: 'Bufudyne: Gletser Nirwana',
        element: 'Tirta',
        spCost: 36,
        power: 125,
        target: 'single',
        description: 'Menghantam satu musuh dengan tombak gletser es mutlak berdaya beku tinggi. (Konsumsi SP Berat - SSR Overpower)',
        effectType: 'damage',
        hitAnimation: 'ice'
      },
      {
        id: 'mabufudyne',
        name: 'Mabufudyne: Badai Cakra Dingin',
        element: 'Tirta',
        spCost: 55,
        power: 95,
        target: 'all',
        description: 'Memutarkan ribuan cakra es pemecah kutukan ke seluruh musuh. (Konsumsi SP Berat - SSR Overpower)',
        effectType: 'damage',
        hitAnimation: 'ice'
      },
      {
        id: 'wisnu_grace',
        name: 'Tirta Amerta: Pembersihan Suci',
        element: 'Nur',
        spCost: 52,
        power: 140,
        target: 'all_allies',
        description: 'Membersihkan kutukan dan memulihkan HP besar seluruh anggota tim. (Konsumsi SP Tinggi - SSR Overpower)',
        effectType: 'heal',
        hitAnimation: 'holy'
      }
    ],
    highlightSkill: {
      id: 'hl_wisnu',
      name: 'SHOWTIME: CAKRA SUDARSANA KOSMIK',
      element: 'Tirta',
      spCost: 0,
      power: 345,
      target: 'all',
      description: 'Menyeruput pusaran air suci antar-dimensi dan melempar Cakra raksasa pemotong takdir!',
      effectType: 'damage',
      hitAnimation: 'ice'
    }
  },
  {
    id: 'batara_kala_gerhana',
    name: 'Batara Kala Gerhana',
    title: 'Raksasa Pemangsa Dimensi Kegelapan',
    element: 'Ghaib',
    rarity: 'SSR',
    level: 1,
    bonusHp: 320,
    bonusSp: 85,
    bonusAtk: 66,
    bonusDef: 36,
    colorHex: '#7928ca',
    avatarIcon: 'skull',
    signatureQuote: '“Waktu dan cahaya... semuanya akan kutelan ke dalam perut ketiadaan!”',
    lore: 'Raksasa bertanduk hitam legam berkalung rantai tengkorak bermahkota gerhana matahari.',
    originStory: 'Terbentuk dari akumulasi keputusasaan dan dendam ratusan korban ritual tumbal sejak zaman kolonial yang terperangkap di dinding sekolah.',
    skills: [
      {
        id: 'eigaon',
        name: 'Eigaon: Lubang Hitam Maut',
        element: 'Ghaib',
        spCost: 38,
        power: 130,
        target: 'single',
        description: 'Membuka singularitas kutukan gelap yang meremukkan jiwa sasaran. (Konsumsi SP Berat - SSR Overpower)',
        effectType: 'damage',
        hitAnimation: 'curse'
      },
      {
        id: 'maeigaon',
        name: 'Maeigaon: Gelombang Gerhana',
        element: 'Ghaib',
        spCost: 58,
        power: 100,
        target: 'all',
        description: 'Menerjang seluruh barisan musuh dengan gelombang miasma hitam pekat. (Konsumsi SP Berat - SSR Overpower)',
        effectType: 'damage',
        hitAnimation: 'curse'
      },
      {
        id: 'debilatate',
        name: 'Kutukan Batara: Pembongkar Zirah',
        element: 'Ghaib',
        spCost: 50,
        power: 0,
        target: 'single',
        description: 'Menurunkan Atk, Def, dan Speed musuh sebesar 40% selama 3 ronde. (Konsumsi SP Tinggi - SSR Overpower)',
        effectType: 'debuff'
      }
    ],
    highlightSkill: {
      id: 'hl_kala',
      name: 'SHOWTIME: TELANAN GERHANA ABADI',
      element: 'Ghaib',
      spCost: 0,
      power: 360,
      target: 'all',
      description: 'Membuka rahang angkasa raksasa dan menelan dimensi musuh ke dalam kekosongan abadi!',
      effectType: 'damage',
      hitAnimation: 'curse'
    }
  },
  {
    id: 'brahma_agni_murti',
    name: 'Brahma Agni Murti',
    title: 'Pencipta Badai Api Tri-Buwana',
    element: 'Agni',
    rarity: 'SSR',
    level: 1,
    bonusHp: 260,
    bonusSp: 110,
    bonusAtk: 68,
    bonusDef: 28,
    colorHex: '#ff0055',
    avatarIcon: 'flame',
    signatureQuote: '“Api ini bukan sekadar membakar... api ini membakar dosa masa lalu!”',
    lore: 'Dewa agung berkepala empat bermahkota teratai pijar dengan pedang api abadi pemusnah angkara.',
    originStory: 'Roh suci penjaga tungku pembakaran laboratorium kimia tua yang dahulu digunakan seorang guru pahlawan untuk meracik penawar racun kolonial.',
    skills: [
      {
        id: 'agidyne',
        name: 'Agidyne: Tombak Pijar Surya',
        element: 'Agni',
        spCost: 38,
        power: 128,
        target: 'single',
        description: 'Menancapkan tombak plasma api murni berdaya ledak super tinggi. (Konsumsi SP Berat - SSR Overpower)',
        effectType: 'damage',
        hitAnimation: 'flame'
      },
      {
        id: 'maragidyne',
        name: 'Maragidyne: Lautan Teratai Merah',
        element: 'Agni',
        spCost: 60,
        power: 102,
        target: 'all',
        description: 'Menebarkan kelopak api abadi yang membakar seluruh penjuru arena. (Konsumsi SP Berat - SSR Overpower)',
        effectType: 'damage',
        hitAnimation: 'flame'
      },
      {
        id: 'matarukaja',
        name: 'Matarukaja: Gelora Murti',
        element: 'Nur',
        spCost: 52,
        power: 0,
        target: 'all_allies',
        description: 'Meningkatkan Attack seluruh tim sebesar 50% selama 3 ronde. (Konsumsi SP Tinggi - SSR Overpower)',
        effectType: 'buff'
      }
    ],
    highlightSkill: {
      id: 'hl_brahma',
      name: 'SHOWTIME: BRAHMASTRA PURBA',
      element: 'Agni',
      spCost: 0,
      power: 355,
      target: 'all',
      description: 'Memanggil senjata legendaris Brahmastra yang meledak bagai bintang jatuh di atas musuh!',
      effectType: 'damage',
      hitAnimation: 'flame'
    }
  },
  {
    id: 'dewi_sri_padi_mas',
    name: 'Dewi Sri Padi Mas',
    title: 'Ratu Kesucian & Nirwana Abadi',
    element: 'Nur',
    rarity: 'SSR',
    level: 1,
    bonusHp: 310,
    bonusSp: 120,
    bonusAtk: 40,
    bonusDef: 64,
    colorHex: '#facc15',
    avatarIcon: 'shield',
    signatureQuote: '“Kembalilah ke dalam pangkuan damai, tiada lagi penderitaan di tanah ini.”',
    lore: 'Dewi berparas anggun mengenakan mahkota padi emas bertabur permata suci penenteram arwah gentayangan.',
    originStory: 'Penunggu sejati tanah persawahan subur yang dirampas untuk pembangunan sekolah berdarah pada era kolonial.',
    skills: [
      {
        id: 'kouga_blast',
        name: 'Kougaon: Sinar Permata Nirwana',
        element: 'Nur',
        spCost: 36,
        power: 120,
        target: 'single',
        description: 'Menghujamkan berkas cahaya permata yang melumpuhkan energi hitam musuh. (Konsumsi SP Berat - SSR Overpower)',
        effectType: 'damage',
        hitAnimation: 'holy'
      },
      {
        id: 'medirahan',
        name: 'Mediarahan: Embun Surga Paripurna',
        element: 'Nur',
        spCost: 75,
        power: 300,
        target: 'all_allies',
        description: 'Memulihkan HP seluruh anggota tim hingga penuh dan memberi perisai suci. (Konsumsi SP Ekstrem - SSR Overpower)',
        effectType: 'heal',
        hitAnimation: 'holy'
      },
      {
        id: 'marakukaja',
        name: 'Marakukaja: Zirah Butir Emas',
        element: 'Nur',
        spCost: 48,
        power: 0,
        target: 'all_allies',
        description: 'Meningkatkan Defense seluruh tim sebesar 50% selama 3 ronde. (Konsumsi SP Tinggi - SSR Overpower)',
        effectType: 'buff'
      }
    ],
    highlightSkill: {
      id: 'hl_dewisri',
      name: 'SHOWTIME: HUJAN EMAS NIRWANA',
      element: 'Nur',
      spCost: 0,
      power: 330,
      target: 'all',
      description: 'Menaburkan bulir padi suci bercahaya yang menyembuhkan tim dan menyucikan barisan musuh!',
      effectType: 'heal',
      hitAnimation: 'holy'
    }
  },
  {
    id: 'garuda_indrajit',
    name: 'Garuda Kencana Indrajit',
    title: 'Pemanah Kilat Halilintar Langit Ketujuh',
    element: 'Peluru',
    rarity: 'SSR',
    level: 1,
    bonusHp: 250,
    bonusSp: 90,
    bonusAtk: 64,
    bonusDef: 38,
    colorHex: '#00f5d4',
    avatarIcon: 'zap',
    signatureQuote: '“Satu tarikan busur, seribu petir menembus kegelapan!”',
    lore: 'Ksatria bersayap emas berkilau yang memegang busur panah Nagapasa berenergi plasma halilintar tak terhentikan.',
    originStory: 'Terbangkit dari busur panah pusaka pahlawan kemerdekaan yang tersimpan di brankas tersembunyi ruang kepala sekolah lama.',
    skills: [
      {
        id: 'sniper_talisman',
        name: 'One-Shot Kill: Panah Jimat Perak',
        element: 'Peluru',
        spCost: 36,
        power: 135,
        target: 'single',
        description: 'Tembakan jimat peluru presisi tinggi dengan peluang Critical masif. (Konsumsi SP Berat - SSR Overpower)',
        effectType: 'damage',
        hitAnimation: 'slash'
      },
      {
        id: 'riot_gun',
        name: 'Riot Lightning: Badai Peluru Petir',
        element: 'Peluru',
        spCost: 58,
        power: 105,
        target: 'all',
        description: 'Menembakkan ribuan proyektil jimat berpetir ke seluruh musuh. (Konsumsi SP Berat - SSR Overpower)',
        effectType: 'damage',
        hitAnimation: 'lightning'
      },
      {
        id: 'charge_focus',
        name: 'Konsentrasi Busur Dewata',
        element: 'Nur',
        spCost: 44,
        power: 0,
        target: 'ally',
        description: 'Meningkatkan Damage serangan berikutnya sebesar 100%! (Konsumsi SP Tinggi - SSR Overpower)',
        effectType: 'buff'
      }
    ],
    highlightSkill: {
      id: 'hl_indrajit',
      name: 'SHOWTIME: HUJAN PANAH HALILINTAR NAGAPASA',
      element: 'Peluru',
      spCost: 0,
      power: 365,
      target: 'all',
      description: 'Terbang menembus awan badai lalu melepaskan panah naga petir yang membelah arena!',
      effectType: 'damage',
      hitAnimation: 'lightning'
    }
  },

  // ==========================================
  // 10 SR SPIRITS (KELANGKAAN SEDANG - CHANCE 9.25%)
  // ==========================================
  {
    id: 'nyai_candra_kirana',
    name: 'Nyai Candra Kirana',
    title: 'Ratu Telaga Cermin Dingin',
    element: 'Tirta',
    rarity: 'SR',
    level: 1,
    bonusHp: 130,
    bonusSp: 90,
    bonusAtk: 25,
    bonusDef: 35,
    colorHex: '#00f5d4',
    avatarIcon: 'sparkles',
    signatureQuote: '“Lihatlah ke dalam cermin ini... temukan kebenaran yang ditenggelamkan waktu.”',
    lore: 'Arwah putri penari kerajaan lereng bukit bergaun sutra putih perak. Membawa cermin keramat pemantul dosa.',
    originStory: 'Sebelum SMA Bhawana dibangun, tanah ini merupakan telaga suci penenang roh gentayangan yang kemudian ditimbun semen.',
    skills: [
      {
        id: 'bufula',
        name: 'Bufula: Jarum Es Telaga',
        element: 'Tirta',
        spCost: 8,
        power: 90,
        target: 'single',
        description: 'Menusuk musuh dengan jarum es sedingin kutub.',
        effectType: 'damage',
        hitAnimation: 'ice'
      },
      {
        id: 'media_tirta',
        name: 'Media: Embun Ruwatan',
        element: 'Nur',
        spCost: 14,
        power: 120,
        target: 'all_allies',
        description: 'Memulihkan HP seluruh tim dengan guyuran air suci.',
        effectType: 'heal',
        hitAnimation: 'holy'
      },
      {
        id: 'mabufula',
        name: 'Mabufula: Salju Ghaib',
        element: 'Tirta',
        spCost: 18,
        power: 75,
        target: 'all',
        description: 'Menghujani seluruh musuh dengan pecahan kristal es mematikan.',
        effectType: 'damage',
        hitAnimation: 'ice'
      }
    ],
    highlightSkill: {
      id: 'hl_candra',
      name: 'SHOWTIME: CUKURAN CERMIN REMBULAN',
      element: 'Tirta',
      spCost: 0,
      power: 280,
      target: 'all',
      description: 'Menjebak musuh dalam dimensi cermin retak dan memecahkannya menjadi ribuan bilah es!',
      effectType: 'damage',
      hitAnimation: 'ice'
    }
  },
  {
    id: 'bharata_petir',
    name: 'Bharata Petir',
    title: 'Panglima Guntur Perisai Baja',
    element: 'Vidyut',
    rarity: 'SR',
    level: 1,
    bonusHp: 220,
    bonusSp: 45,
    bonusAtk: 50,
    bonusDef: 40,
    colorHex: '#ffd166',
    avatarIcon: 'zap',
    signatureQuote: '“Sekali kulontarkan guntur ini, tiada hantu busuk yang sanggup berdiri!”',
    lore: 'Panglima perang perkasa berkulit tembaga dengan cambuk petir berkilauan.',
    originStory: 'Roh alumni tolak peluru dan silat yang menjadi korban tumbal pertama ritual kepala sekolah di lorong tangga darurat.',
    skills: [
      {
        id: 'zionga',
        name: 'Zionga: Sambaran Kilat',
        element: 'Vidyut',
        spCost: 8,
        power: 95,
        target: 'single',
        description: 'Menyengat satu musuh dengan tegangan ribuan volt.',
        effectType: 'damage',
        hitAnimation: 'lightning'
      },
      {
        id: 'heavy_punch',
        name: 'Bogem Guntur Pemecah Tengkorak',
        element: 'Fisik',
        spCost: 0,
        hpCost: 30,
        power: 125,
        target: 'single',
        description: 'Hantaman tinju bertubi-tubi dengan daya hancur fisik masif.',
        effectType: 'damage',
        hitAnimation: 'slash'
      },
      {
        id: 'rakukaja',
        name: 'Rakukaja: Perisai Zirah Ghaib',
        element: 'Nur',
        spCost: 12,
        power: 0,
        target: 'all_allies',
        description: 'Meningkatkan Defense seluruh tim sebesar 50% selama 3 ronde.',
        effectType: 'buff'
      }
    ],
    highlightSkill: {
      id: 'hl_bharata',
      name: 'SHOWTIME: INDRA BRAHMASHIRA',
      element: 'Vidyut',
      spCost: 0,
      power: 310,
      target: 'all',
      description: 'Memanggil tombak halilintar raksasa dari langit mendung dan menancapkannya ke bumi!',
      effectType: 'damage',
      hitAnimation: 'lightning'
    }
  },
  {
    id: 'kresna_dwipayana',
    name: 'Kresna Dwipayana',
    title: 'Penasihat Takdir Angin Seribu Kebijaksanaan',
    element: 'Bayu',
    rarity: 'SR',
    level: 1,
    bonusHp: 160,
    bonusSp: 85,
    bonusAtk: 42,
    bonusDef: 32,
    colorHex: '#06d6a0',
    avatarIcon: 'wind',
    signatureQuote: '“Angin berbisik tentang takdir... jangan melawan arus kebenaran.”',
    lore: 'Penasihat agung bertongkat bulu merak dengan seruling sakti yang memanipulasi arah angin dan pikiran musuh.',
    originStory: 'Terbangkit dari kitab silsilah pewayangan kuno yang tersimpan di lemari kaca ruang kepala sekolah.',
    skills: [
      {
        id: 'garudyne',
        name: 'Garudyne: Badai Cakra Angin',
        element: 'Bayu',
        spCost: 12,
        power: 110,
        target: 'single',
        description: 'Tebasan angin bertekanan tinggi yang mengoyak perisai gaib.',
        effectType: 'damage',
        hitAnimation: 'wind'
      },
      {
        id: 'wind_whisper',
        name: 'Kidungan Sukukaja',
        element: 'Nur',
        spCost: 14,
        power: 0,
        target: 'all_allies',
        description: 'Meningkatkan Hit Rate & Evasion seluruh tim sebesar 40%.',
        effectType: 'buff'
      }
    ],
    highlightSkill: {
      id: 'hl_kresna',
      name: 'SHOWTIME: TOPAN BADAI SALAKA DOMAS',
      element: 'Bayu',
      spCost: 0,
      power: 295,
      target: 'all',
      description: 'Memainkan seruling sakti yang membangkitkan badai tornado menelan barisan musuh!',
      effectType: 'damage',
      hitAnimation: 'wind'
    }
  },
  {
    id: 'hanoman_putih',
    name: 'Hanoman Bayu Putih',
    title: 'Satria Kera Putih Pemecah Karang',
    element: 'Fisik',
    rarity: 'SR',
    level: 1,
    bonusHp: 230,
    bonusSp: 50,
    bonusAtk: 58,
    bonusDef: 42,
    colorHex: '#ffffff',
    avatarIcon: 'shield',
    signatureQuote: '“Bakar Alengka! Tak ada kejahatan yang luput dari tinju suciku!”',
    lore: 'Kera putih gagah berzirah perak yang mampu melompat antar awan dan memukul hancur gunung batu.',
    originStory: 'Mewakili semangat pantang menyerah anak-anak ekskul teater sekolah yang memainkan lakon Ramayana sebelum tragedi 1998.',
    skills: [
      {
        id: 'god_hand',
        name: 'Hantaman Tinju Sukma Suci',
        element: 'Fisik',
        spCost: 0,
        hpCost: 35,
        power: 135,
        target: 'single',
        description: 'Pukulan fisik raksasa dari langit dengan peluang Knock Down tinggi.',
        effectType: 'damage',
        hitAnimation: 'slash'
      },
      {
        id: 'kera_bakar',
        name: 'Lompatan Angin Suci',
        element: 'Bayu',
        spCost: 10,
        power: 85,
        target: 'single',
        description: 'Serangan kombinasi lompatan angin dan tendangan lutut.',
        effectType: 'damage',
        hitAnimation: 'wind'
      }
    ],
    highlightSkill: {
      id: 'hl_hanoman',
      name: 'SHOWTIME: PENGHANCURAN KARANG BRAJAMUSTI',
      element: 'Fisik',
      spCost: 0,
      power: 315,
      target: 'all',
      description: 'Membesar menjadi raksasa kera putih dan menghantamkan kedua tinju ke tanah sekolah!',
      effectType: 'damage',
      hitAnimation: 'slash'
    }
  },
  {
    id: 'gatotkaca_urat_kawat',
    name: 'Gatotkaca Brajamusti',
    title: 'Satria Otot Kawat Tulang Besi',
    element: 'Vidyut',
    rarity: 'SR',
    level: 1,
    bonusHp: 240,
    bonusSp: 55,
    bonusAtk: 55,
    bonusDef: 46,
    colorHex: '#f59e0b',
    avatarIcon: 'zap',
    signatureQuote: '“Bumi berguncang saat tapak kakiku menginjak medan pertempuran!”',
    lore: 'Ksatria berrompi antakusuma kebal senjata tajam yang terbang secepat kilat menyambar musuh.',
    originStory: 'Terlahir dari cita-cita luhur murid-murid jurusan mesin yang bermimpi terbang membanggakan negeri.',
    skills: [
      {
        id: 'brajamusti_punch',
        name: 'Ajian Brajamusti: Tinju Halilintar',
        element: 'Vidyut',
        spCost: 10,
        power: 105,
        target: 'single',
        description: 'Pukulan berlapis arus listrik berkekuatan petir menyambar.',
        effectType: 'damage',
        hitAnimation: 'lightning'
      },
      {
        id: 'iron_body',
        name: 'Otot Kawat Tulang Besi',
        element: 'Nur',
        spCost: 12,
        power: 0,
        target: 'all_allies',
        description: 'Meningkatkan Physical Defense seluruh tim sebesar 50% selama 3 ronde.',
        effectType: 'buff'
      }
    ],
    highlightSkill: {
      id: 'hl_gatotkaca',
      name: 'SHOWTIME: TUKIKAN PETIR DARI ANGKASA',
      element: 'Vidyut',
      spCost: 0,
      power: 320,
      target: 'all',
      description: 'Melesat menembus awan badai lalu menabrakkan diri bagai meteor petir ke musuh!',
      effectType: 'damage',
      hitAnimation: 'lightning'
    }
  },
  {
    id: 'nyi_roro_selatan',
    name: 'Nyi Roro Ombak Kidul',
    title: 'Ratu Samudera Zamrud Khatulistiwa',
    element: 'Tirta',
    rarity: 'SR',
    level: 1,
    bonusHp: 170,
    bonusSp: 95,
    bonusAtk: 38,
    bonusDef: 38,
    colorHex: '#10b981',
    avatarIcon: 'sparkles',
    signatureQuote: '“Hormatilah gelombang samudera, atau jiwamu karam di palung terdalam.”',
    lore: 'Ratu bermahkota naga laut berkebaya hijau lumut yang mengendalikan pasang surut air kutukan.',
    originStory: 'Kisah legendaris yang selalu diceritakan turun temurun oleh penjaga malam sekolah tua tentang bau laut di aula setiap malam Jumat Kliwon.',
    skills: [
      {
        id: 'tidal_surge',
        name: 'Pusaran Palung Selatan',
        element: 'Tirta',
        spCost: 12,
        power: 110,
        target: 'single',
        description: 'Menggulung musuh ke dalam pusaran air laut bertekanan ribuan atmosfer.',
        effectType: 'damage',
        hitAnimation: 'ice'
      },
      {
        id: 'sea_breeze_heal',
        name: 'Buih Samudera Penenang Sukma',
        element: 'Nur',
        spCost: 16,
        power: 130,
        target: 'all_allies',
        description: 'Menyembuhkan HP dan menghilangkan status buruk anggota tim.',
        effectType: 'heal',
        hitAnimation: 'holy'
      }
    ],
    highlightSkill: {
      id: 'hl_roro',
      name: 'SHOWTIME: TSUNAMI ZAMRUD PANTAI SELATAN',
      element: 'Tirta',
      spCost: 0,
      power: 300,
      target: 'all',
      description: 'Membangkitkan gelombang ombak raksasa yang menyapu bersih seluruh hantu koridor!',
      effectType: 'damage',
      hitAnimation: 'ice'
    }
  },
  {
    id: 'ki_ageng_jiwa',
    name: 'Ki Ageng Suryomentaram',
    title: 'Pertapa Suci Penakluk Hasrat Duniawi',
    element: 'Nur',
    rarity: 'SR',
    level: 1,
    bonusHp: 190,
    bonusSp: 90,
    bonusAtk: 32,
    bonusDef: 45,
    colorHex: '#e2e8f0',
    avatarIcon: 'shield',
    signatureQuote: '“Kenalilah dirimu sendiri... maka rasa takut akan lenyap menjadi abu.”',
    lore: 'Pertapa tua bersahaja berselempang kain putih yang menenangkan gejolak amarah kutukan dengan pencerahan batin.',
    originStory: 'Pernah bersemedi di bawah pohon beringin tua lapangan upacara sebelum ditebang yayasan sekolah.',
    skills: [
      {
        id: 'batin_cleanse',
        name: 'Mantra Pangruwat Jiwa',
        element: 'Nur',
        spCost: 10,
        power: 95,
        target: 'single',
        description: 'Menghanguskan hawa setan dengan getaran batin suci.',
        effectType: 'damage',
        hitAnimation: 'holy'
      },
      {
        id: 'inner_peace',
        name: 'Hening Cipta Kawruh Jiwa',
        element: 'Nur',
        spCost: 18,
        power: 110,
        target: 'all_allies',
        description: 'Memulihkan SP dan HP tim secara seimbang.',
        effectType: 'heal',
        hitAnimation: 'holy'
      }
    ],
    highlightSkill: {
      id: 'hl_kiageng',
      name: 'SHOWTIME: PENCERAHAN MATA HATI',
      element: 'Nur',
      spCost: 0,
      power: 285,
      target: 'all',
      description: 'Menyinari seluruh aula dengan cahaya kesadaran yang melunturkan dendam roh jahat!',
      effectType: 'damage',
      hitAnimation: 'holy'
    }
  },
  {
    id: 'raden_wijaya',
    name: 'Raden Wijaya Majapahit',
    title: 'Pendiri Imperium Singa Tarik',
    element: 'Fisik',
    rarity: 'SR',
    level: 1,
    bonusHp: 210,
    bonusSp: 55,
    bonusAtk: 56,
    bonusDef: 40,
    colorHex: '#dc2626',
    avatarIcon: 'sword',
    signatureQuote: '“Dari reruntuhan Singhasari, kubangun kejayaan yang takkan padam!”',
    lore: 'Raja pertama Majapahit berkuda perang emas dengan keris pusaka pembelah baju zirah musuh.',
    originStory: 'Manifestasi dari prasasti batu bata kuno yang ditemukan tertanam di bawah lapangan basket sekolah.',
    skills: [
      {
        id: 'keris_majapahit',
        name: 'Tikaman Keris Singa Barong',
        element: 'Fisik',
        spCost: 0,
        hpCost: 28,
        power: 120,
        target: 'single',
        description: 'Serangan tusukan berpresisi tinggi dengan peluang Critical.',
        effectType: 'damage',
        hitAnimation: 'slash'
      },
      {
        id: 'raja_command',
        name: 'Komando Ekspedisi Pamalayu',
        element: 'Nur',
        spCost: 12,
        power: 0,
        target: 'all_allies',
        description: 'Meningkatkan Attack & Speed tim sebesar 35%.',
        effectType: 'buff'
      }
    ],
    highlightSkill: {
      id: 'hl_wijaya',
      name: 'SHOWTIME: SERBUAN BUMI TARIK MAJAPAHIT',
      element: 'Fisik',
      spCost: 0,
      power: 305,
      target: 'all',
      description: 'Memimpin kavaleri berpasukan tombak gaib yang menggilas seluruh musuh di hadapannya!',
      effectType: 'damage',
      hitAnimation: 'slash'
    }
  },
  {
    id: 'srikandi_panah',
    name: 'Srikandi Panah Asmara',
    title: 'Srikandi Pemanah Jimat Berbisa',
    element: 'Peluru',
    rarity: 'SR',
    level: 1,
    bonusHp: 155,
    bonusSp: 75,
    bonusAtk: 52,
    bonusDef: 30,
    colorHex: '#ec4899',
    avatarIcon: 'zap',
    signatureQuote: '“Anak panah ini tak pernah meleset dari sasaran yang congkak!”',
    lore: 'Prajurit wanita tangguh bermahkota kembang melati dengan panah berlumur minyak bunga kenanga beracun.',
    originStory: 'Penjaga arwah siswi teladan pemanah yang menorehkan prestasi medali emas pertama bagi sekolah.',
    skills: [
      {
        id: 'arrow_barrage',
        name: 'Rentetan Panah Bambu Kuning',
        element: 'Peluru',
        spCost: 10,
        power: 100,
        target: 'single',
        description: 'Menembakkan tiga anak panah jimat beruntun ke titik lemah musuh.',
        effectType: 'damage',
        hitAnimation: 'slash'
      },
      {
        id: 'melati_poison',
        name: 'Aroma Bunga Melati Membius',
        element: 'Ghaib',
        spCost: 12,
        power: 65,
        target: 'all',
        description: 'Menebarkan racun melati yang melemahkan serangan musuh.',
        effectType: 'debuff',
        hitAnimation: 'curse'
      }
    ],
    highlightSkill: {
      id: 'hl_srikandi',
      name: 'SHOWTIME: PANAH KENCANA HRADAYASMI',
      element: 'Peluru',
      spCost: 0,
      power: 290,
      target: 'all',
      description: 'Menarik busur panah mistis dan menghujankan ribuan proyektil mawar perak berduri!',
      effectType: 'damage',
      hitAnimation: 'slash'
    }
  },
  {
    id: 'kucing_candramawa',
    name: 'Jayanegara Siluman Candramawa',
    title: 'Penjelajah Lorong Bayangan Hitam',
    element: 'Ghaib',
    rarity: 'SR',
    level: 1,
    bonusHp: 165,
    bonusSp: 70,
    bonusAtk: 48,
    bonusDef: 34,
    colorHex: '#8b5cf6',
    avatarIcon: 'skull',
    signatureQuote: '“Di dalam kegelapan pekat, matakulah yang menjadi pengintaimu!”',
    lore: 'Kucing siluman hitam berkaki empat dengan mata berkilat ungu dan ekor bercabang sembilan bayangan.',
    originStory: 'Kucing liar kesayangan penjaga sekolah tua yang setia menunggu di depan gerbang meski telah tiada.',
    skills: [
      {
        id: 'shadow_scratch',
        name: 'Cakaran Bayangan Candramawa',
        element: 'Ghaib',
        spCost: 8,
        power: 92,
        target: 'single',
        description: 'Menyusup di balik bayangan dan mencakar titik vital sasaran.',
        effectType: 'damage',
        hitAnimation: 'curse'
      },
      {
        id: 'curse_whiskers',
        name: 'Dengkur Hipnotis Siluman',
        element: 'Ghaib',
        spCost: 14,
        power: 0,
        target: 'all',
        description: 'Menurunkan Defense musuh sebesar 35% selama 3 ronde.',
        effectType: 'debuff'
      }
    ],
    highlightSkill: {
      id: 'hl_candramawa',
      name: 'SHOWTIME: SEMBILAN BAYANGAN MALAM JUMAT',
      element: 'Ghaib',
      spCost: 0,
      power: 285,
      target: 'all',
      description: 'Mengkloning tubuhnya menjadi sembilan siluet bayangan pemangsa hantu!',
      effectType: 'damage',
      hitAnimation: 'curse'
    }
  },

  // ==========================================
  // 8 R SPIRITS (KELANGKAAN STANDAR - CHANCE 90.00%)
  // ==========================================
  {
    id: 'kala_kertas',
    name: 'Kala Kertas',
    title: 'Penjaga Jimat Angin Bayu',
    element: 'Bayu',
    rarity: 'R',
    level: 1,
    bonusHp: 110,
    bonusSp: 70,
    bonusAtk: 30,
    bonusDef: 25,
    colorHex: '#06d6a0',
    avatarIcon: 'wind',
    signatureQuote: '“Terkoyak oleh seribu rajah penyegel!”',
    lore: 'Roh berwujud ribuan potongan kertas jimat rajah berterbangan yang membentuk sosok pelindung misterius.',
    originStory: 'Terlahir dari ratusan jimat tolak bala yang ditempelkan para guru di sayap gedung lama saat kepanikan massal melanda sekolah.',
    skills: [
      {
        id: 'garula',
        name: 'Garula: Pisau Angin Rajah',
        element: 'Bayu',
        spCost: 7,
        power: 85,
        target: 'single',
        description: 'Mengiris musuh dengan badai kertas jimat tajam.',
        effectType: 'damage',
        hitAnimation: 'wind'
      },
      {
        id: 'sukukaja',
        name: 'Sukukaja: Langkah Bayangan',
        element: 'Nur',
        spCost: 10,
        power: 0,
        target: 'all_allies',
        description: 'Meningkatkan kelincahan dan peluang menghindar serangan.',
        effectType: 'buff'
      }
    ],
    highlightSkill: {
      id: 'hl_kertas',
      name: 'SHOWTIME: ANGIN PUYUH SERIBU SEGEL',
      element: 'Bayu',
      spCost: 0,
      power: 260,
      target: 'all',
      description: 'Menghamburkan puluhan ribu kertas jimat meledak yang menyapu bersih aura hitam musuh!',
      effectType: 'damage',
      hitAnimation: 'wind'
    }
  },
  {
    id: 'laskar_bambu',
    name: 'Laskar Bambu Runcing',
    title: 'Roh Perjuangan Lorong Bawah Tanah',
    element: 'Fisik',
    rarity: 'R',
    level: 1,
    bonusHp: 140,
    bonusSp: 35,
    bonusAtk: 38,
    bonusDef: 28,
    colorHex: '#84cc16',
    avatarIcon: 'sword',
    signatureQuote: '“Maju terus pantang mundur! Merdeka atau mati di tangan iblis!”',
    lore: 'Kumpulan arwah pejuang pemuda berselempang merah putih yang memegang bilah bambu kuning berapi.',
    originStory: 'Gedung sekolah ini pada era 1945 pernah menjadi posko pertahanan para laskar pemuda pejuang kemerdekaan.',
    skills: [
      {
        id: 'bambu_thrust',
        name: 'Tusukan Bambu Runcing Berani',
        element: 'Fisik',
        spCost: 0,
        hpCost: 20,
        power: 90,
        target: 'single',
        description: 'Tusukan lurus bertenaga tinggi yang menembus pertahanan lawan.',
        effectType: 'damage',
        hitAnimation: 'slash'
      },
      {
        id: 'spirit_rally',
        name: 'Pekikan Merdeka!',
        element: 'Nur',
        spCost: 8,
        power: 0,
        target: 'ally',
        description: 'Meningkatkan Attack satu sekutu sebesar 30%.',
        effectType: 'buff'
      }
    ],
    highlightSkill: {
      id: 'hl_bambu',
      name: 'SHOWTIME: SERANGAN UMUM 1 MARET',
      element: 'Fisik',
      spCost: 0,
      power: 250,
      target: 'all',
      description: 'Memanggil barisan puluhan pemuda bersenjatakan bambu runcing yang menerjang serentak!',
      effectType: 'damage',
      hitAnimation: 'slash'
    }
  },
  {
    id: 'prajurit_singhasari',
    name: 'Prajurit Arwah Singhasari',
    title: 'Penjaga Tombak Berkarat Gerbang Sekolah',
    element: 'Fisik',
    rarity: 'R',
    level: 1,
    bonusHp: 150,
    bonusSp: 30,
    bonusAtk: 36,
    bonusDef: 34,
    colorHex: '#78716c',
    avatarIcon: 'shield',
    signatureQuote: '“Siapapun yang mengusik perbatasan akan merasakan dinginnya besi tombakku!”',
    lore: 'Prajurit zirah kuno Singhasari yang masih berpatroli di malam sunyi memegang tombak trisula berkarat.',
    originStory: 'Fondasi pilar gapura depan sekolah berdiri di atas bekas parit pertahanan zaman kerajaan Kertanegara.',
    skills: [
      {
        id: 'spear_jab',
        name: 'Tusukan Trisula Kuno',
        element: 'Fisik',
        spCost: 0,
        hpCost: 18,
        power: 85,
        target: 'single',
        description: 'Hantaman tombak yang menghentak pertahanan musuh.',
        effectType: 'damage',
        hitAnimation: 'slash'
      },
      {
        id: 'iron_wall',
        name: 'Kuda-Kuda Tameng Besi',
        element: 'Nur',
        spCost: 8,
        power: 0,
        target: 'ally',
        description: 'Meningkatkan Defense satu sekutu sebesar 35%.',
        effectType: 'buff'
      }
    ],
    highlightSkill: {
      id: 'hl_singhasari',
      name: 'SHOWTIME: BENTENG BESI KERTANEGARA',
      element: 'Fisik',
      spCost: 0,
      power: 245,
      target: 'all',
      description: 'Membentuk dinding perisai besi berduri yang menghancurkan barisan penyerang!',
      effectType: 'damage',
      hitAnimation: 'slash'
    }
  },
  {
    id: 'bujangga_manik',
    name: 'Bujangga Manik',
    title: 'Pengembara Kidung Angin Salaka Domas',
    element: 'Bayu',
    rarity: 'R',
    level: 1,
    bonusHp: 120,
    bonusSp: 65,
    bonusAtk: 28,
    bonusDef: 24,
    colorHex: '#34d399',
    avatarIcon: 'wind',
    signatureQuote: '“Kidung perjalanan ini menuntun jiwa tersesat pulang ke cahaya.”',
    lore: 'Pangeran pertapa Sunda kuno berjubah daun lontar yang mengembara di antara dimensi gaib nusantara.',
    originStory: 'Terbangkit dari naskah daun lontar kuno yang dipajang di etalase ruang perpustakaan sekolah.',
    skills: [
      {
        id: 'bujangga_gale',
        name: 'Embusan Angin Lontar Purba',
        element: 'Bayu',
        spCost: 6,
        power: 78,
        target: 'single',
        description: 'Menerbangkan serpihan daun lontar bertuliskan mantra penolak roh.',
        effectType: 'damage',
        hitAnimation: 'wind'
      },
      {
        id: 'lontar_heal',
        name: 'Kidung Penenang Jiwa',
        element: 'Nur',
        spCost: 10,
        power: 80,
        target: 'all_allies',
        description: 'Memulihkan sedikit HP seluruh tim dengan kidung merdu.',
        effectType: 'heal',
        hitAnimation: 'holy'
      }
    ],
    highlightSkill: {
      id: 'hl_bujangga',
      name: 'SHOWTIME: NYANYIAN ANGIN GUNUNG GEDE',
      element: 'Bayu',
      spCost: 0,
      power: 240,
      target: 'all',
      description: 'Menghadirkan pusaran angin gunung penawar racun kutukan yang memukul mundur musuh!',
      effectType: 'damage',
      hitAnimation: 'wind'
    }
  },
  {
    id: 'penjaga_lonceng',
    name: 'Arwah Penjaga Lonceng Tua',
    title: 'Penggetar Dentang Besi Gedung Belanda',
    element: 'Vidyut',
    rarity: 'R',
    level: 1,
    bonusHp: 135,
    bonusSp: 50,
    bonusAtk: 32,
    bonusDef: 30,
    colorHex: '#eab308',
    avatarIcon: 'zap',
    signatureQuote: '“DONG... DONG... Waktu belajar telah usai, waktu penghakiman dimulai!”',
    lore: 'Sosok kakek penjaga berseragam lapuk memegang tali tambang yang mengayunkan lonceng perunggu bermuatan listrik.',
    originStory: 'Penjaga sekolah pertama zaman kolonial HBS yang gugur tertimpa reruntuhan menara lonceng saat gempa bumi 1960.',
    skills: [
      {
        id: 'bell_chime',
        name: 'Dentang Lonceng Halilintar',
        element: 'Vidyut',
        spCost: 7,
        power: 82,
        target: 'single',
        description: 'Gema dentang lonceng yang menyengat saraf telinga musuh dengan listrik.',
        effectType: 'damage',
        hitAnimation: 'lightning'
      },
      {
        id: 'shock_wave',
        name: 'Gema Jam Keduabelas Malam',
        element: 'Vidyut',
        spCost: 14,
        power: 65,
        target: 'all',
        description: 'Gelombang getaran suara besi yang merusak konsentrasi seluruh lawan.',
        effectType: 'damage',
        hitAnimation: 'lightning'
      }
    ],
    highlightSkill: {
      id: 'hl_lonceng',
      name: 'SHOWTIME: DENTANG KEMATIAN MENARA UTAMA',
      element: 'Vidyut',
      spCost: 0,
      power: 250,
      target: 'all',
      description: 'Menjatuhkan lonceng raksasa bermuatan ribuan volt listrik ke tengah-tengah formasi musuh!',
      effectType: 'damage',
      hitAnimation: 'lightning'
    }
  },
  {
    id: 'si_pitung',
    name: 'Si Pitung Pendekar Rawabelong',
    title: 'Pendekar Golok & Peluru Minyak Bintang',
    element: 'Peluru',
    rarity: 'R',
    level: 1,
    bonusHp: 145,
    bonusSp: 40,
    bonusAtk: 40,
    bonusDef: 26,
    colorHex: '#38bdf8',
    avatarIcon: 'zap',
    signatureQuote: '“Jangan macem-macem di tanah Betawi! Peluru emas ini siap menyapa!”',
    lore: 'Pendekar berkopiah merah dan bersarung plekat yang kebal peluru dan lihai menembakkan pistol revolver kuno.',
    originStory: 'Terpanggil dari novel sejarah dan komik legendaris yang disimpan di lemari arsip sastra Indonesia.',
    skills: [
      {
        id: 'revolver_shot',
        name: 'Tembakan Revolver Minyak Bintang',
        element: 'Peluru',
        spCost: 8,
        power: 88,
        target: 'single',
        description: 'Tembakan peluru perak bersalut jimat kebal yang mengabaikan 20% Def musuh.',
        effectType: 'damage',
        hitAnimation: 'slash'
      },
      {
        id: 'kebal_stance',
        name: 'Ajian Rawa Belong',
        element: 'Nur',
        spCost: 8,
        power: 0,
        target: 'ally',
        description: 'Mengurangi damage fisik yang diterima sekutu sebesar 40%.',
        effectType: 'buff'
      }
    ],
    highlightSkill: {
      id: 'hl_pitung',
      name: 'SHOWTIME: EKSEKUSI PELURU GOLOK SAKTI',
      element: 'Peluru',
      spCost: 0,
      power: 255,
      target: 'all',
      description: 'Melompat gesit sambil menembakkan 6 peluru emas beruntun diikuti sabetan golok perak!',
      effectType: 'damage',
      hitAnimation: 'slash'
    }
  },
  {
    id: 'dewi_kilisuci',
    name: 'Dewi Kilisuci Pertapa Goa',
    title: 'Putri Suci Penolak Bala Gunung Berapi',
    element: 'Tirta',
    rarity: 'R',
    level: 1,
    bonusHp: 130,
    bonusSp: 70,
    bonusAtk: 26,
    bonusDef: 30,
    colorHex: '#38bdf8',
    avatarIcon: 'sparkles',
    signatureQuote: '“Kesucian hati adalah benteng terkokoh dari letusan amarah setan.”',
    lore: 'Putri mahkota Kediri yang menolak tahta demi bertapa di goa Selomangleng demi keselamatan rakyat dari lahar.',
    originStory: 'Terhubung dengan air tanah sejuk di kamar mandi sayap timur yang tidak pernah kering meski kemarau panjang.',
    skills: [
      {
        id: 'goa_water',
        name: 'Tetesan Air Suci Selomangleng',
        element: 'Tirta',
        spCost: 6,
        power: 75,
        target: 'single',
        description: 'Tembakan air kristal dingin penawar hawa panas hantu.',
        effectType: 'damage',
        hitAnimation: 'ice'
      },
      {
        id: 'tolak_bala',
        name: 'Mantra Penolak Sumpah Lembu Suro',
        element: 'Nur',
        spCost: 12,
        power: 90,
        target: 'all_allies',
        description: 'Menyembuhkan tim dan meningkatkan ketahanan elemen sebesar 25%.',
        effectType: 'heal',
        hitAnimation: 'holy'
      }
    ],
    highlightSkill: {
      id: 'hl_kilisuci',
      name: 'SHOWTIME: PANCURAN AIR PENYUCI LEMBUSAURA',
      element: 'Tirta',
      spCost: 0,
      power: 245,
      target: 'all',
      description: 'Memancarkan pilar air mata air suci yang membilas habis racun dan kutukan hantu!',
      effectType: 'damage',
      hitAnimation: 'ice'
    }
  },
  {
    id: 'wayang_suket',
    name: 'Penyihir Wayang Suket',
    title: 'Roh Jerami Anyaman Jimat Tolak Kutuk',
    element: 'Ghaib',
    rarity: 'R',
    level: 1,
    bonusHp: 125,
    bonusSp: 60,
    bonusAtk: 30,
    bonusDef: 26,
    colorHex: '#a855f7',
    avatarIcon: 'skull',
    signatureQuote: '“Dari rumput kering kutakdirkan menjadi penjebak bayangan jahat!”',
    lore: 'Boneka wayang yang dianyam dari rumput ilalang makam tua dengan rajah arang di dada.',
    originStory: 'Dibuat oleh salah seorang murid yang bersembunyi di gudang pramuka saat insiden kerasukan massal 2005.',
    skills: [
      {
        id: 'suket_binding',
        name: 'Jeratan Jerami Berhantu',
        element: 'Ghaib',
        spCost: 7,
        power: 76,
        target: 'single',
        description: 'Melilit pergelangan kaki musuh dengan ilalang berduri beracun.',
        effectType: 'damage',
        hitAnimation: 'curse'
      },
      {
        id: 'curse_doll',
        name: 'Boneka Pengalih Kutukan',
        element: 'Ghaib',
        spCost: 10,
        power: 0,
        target: 'all',
        description: 'Menurunkan Akurasi serangan seluruh musuh selama 2 ronde.',
        effectType: 'debuff'
      }
    ],
    highlightSkill: {
      id: 'hl_suket',
      name: 'SHOWTIME: ANYAMAN KUTUKAN SERIBU ILALANG',
      element: 'Ghaib',
      spCost: 0,
      power: 240,
      target: 'all',
      description: 'Menyulap arena menjadi padang ilalang gelap yang mengurung dan melumpuhkan musuh!',
      effectType: 'damage',
      hitAnimation: 'curse'
    }
  }
];

// ==========================================
// TINGKAT KEBANGKITAN ROH (AWAKEN TIER 1 - 5)
// ==========================================
export interface AwakenTierInfo {
  rank: number;
  title: string;
  perk: string;
  statMultiplier: number;
  bonusHp: number;
  bonusAtk: number;
  bonusDef: number;
  costTokens: number;
}

export const AWAKEN_TIERS: Record<number, AwakenTierInfo> = {
  1: {
    rank: 1,
    title: 'Tingkat I: Pengikatan Sukma',
    perk: '+15% Stat Bonus & Aura Berpendar',
    statMultiplier: 1.15,
    bonusHp: 40,
    bonusAtk: 15,
    bonusDef: 10,
    costTokens: 30
  },
  2: {
    rank: 2,
    title: 'Tingkat II: Resonansi Ghaib',
    perk: '+30% Stat Bonus & Diskon Biaya SP Jurus (-2 SP)',
    statMultiplier: 1.30,
    bonusHp: 90,
    bonusAtk: 35,
    bonusDef: 20,
    costTokens: 40
  },
  3: {
    rank: 3,
    title: 'Tingkat III: Penguasaan Elemen',
    perk: '+50% Stat Bonus & +25% Daya Serang Elemen',
    statMultiplier: 1.50,
    bonusHp: 160,
    bonusAtk: 65,
    bonusDef: 35,
    costTokens: 50
  },
  4: {
    rank: 4,
    title: 'Tingkat IV: Jiwa Abadi',
    perk: '+75% Stat Bonus & Highlight Gauge Terisi Cepat (+50%)',
    statMultiplier: 1.75,
    bonusHp: 250,
    bonusAtk: 100,
    bonusDef: 55,
    costTokens: 60
  },
  5: {
    rank: 5,
    title: 'Tingkat V: KEBANGKITAN SEMPURNA',
    perk: '+100% Stat Bonus & Showtime Ultimate 1.5x Damage (Golden Aura Dewa Roh)',
    statMultiplier: 2.00,
    bonusHp: 380,
    bonusAtk: 150,
    bonusDef: 85,
    costTokens: 80
  }
};

export const applyAwakenRankToSpirit = (spirit: SpiritCompanion, targetRank: number): SpiritCompanion => {
  const rank = Math.min(5, Math.max(0, targetRank));
  const tier = AWAKEN_TIERS[rank];
  if (!tier || rank === 0) {
    return {
      ...spirit,
      awakenRank: 0,
      awakenTitle: 'Belum Terbangkitkan',
      awakenPassive: 'Tingkatkan melalui ritual altar ghaib.'
    };
  }

  // Base values without previous stacking
  const baseHp = spirit.bonusHp > 0 ? spirit.bonusHp : 100;
  const baseAtk = spirit.bonusAtk > 0 ? spirit.bonusAtk : 20;
  const baseDef = spirit.bonusDef > 0 ? spirit.bonusDef : 10;

  return {
    ...spirit,
    awakenRank: rank,
    awakenTitle: tier.title,
    awakenPassive: tier.perk,
    bonusHp: Math.round(baseHp * tier.statMultiplier) + tier.bonusHp,
    bonusAtk: Math.round(baseAtk * tier.statMultiplier) + tier.bonusAtk,
    bonusDef: Math.round(baseDef * tier.statMultiplier) + tier.bonusDef
  };
};
