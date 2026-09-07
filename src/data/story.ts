import { ClueDocument, StoryChapter, StoryNode } from '../types';

export const CLUE_DOCUMENTS: ClueDocument[] = [
  {
    id: 'clue_partitur',
    title: 'Partitur Sonata Terkutuk 1995',
    code: 'DOK-01/MUSIK',
    location: 'Laci Rahasia Piano Tua - Ruang Musik Lantai 2',
    found: true,
    date: '12 Oktober 1995',
    importance: 'rahasia',
    excerpt: 'Not-not balok ditulis dengan tinta merah kecokelatan... tertera bisikan: "Nada ketujuh memanggil yang di bawah tanah..."',
    fullContent: 'Catatan tersembunyi guru musik: "Setiap kali melodi ini dimainkan tepat jam 00:00, cermin besar di ruang latihan bergetar hebat. Siswi terbaikku, Melati Kusuma, melihat sosok bertangan seribu di balik bayangannya sendiri. Kepala Sekolah Soedjarwo memerintahkanku untuk terus mengurungnya berlatih... dia bilang ini demi beasiswa kehormatan ke Eropa. Bohong besar. Ini bukan seleksi siswa teladan... ini ritual penyerahan tumbal."'
  },
  {
    id: 'clue_yayasan',
    title: 'Perjanjian Darah Yayasan Bhawana 1972',
    code: 'DOK-02/YAYASAN',
    location: 'Brankas Terbakar - Ruang Kepala Sekolah Lama',
    found: false,
    date: '3 Juli 1972',
    importance: 'terlarang',
    excerpt: 'Perjanjian antara Soedjarwo dan sekte pemuja Gerhana Kuno...',
    fullContent: '"Pondasi gedung SMA 7 Bhawana didirikan tepat di atas mata air Telaga Suci Candra Kirana. Arwah penjaga bumi dipasak paksa dengan 7 taring tembaga berlumur darah gagak hitam. Sebagai gantinya, para petinggi yayasan dianugerahi kekayaan melimpah, kedudukan politik, serta penundaan ajal tanpa batas—dengan syarat mutlak: 33 nyawa darah murni anak muda wajib dipersembahkan saat gerhana merah melintasi rasi bintang Kartika."'
  },
  {
    id: 'clue_daftar_tumbal',
    title: 'Daftar 33 Siswa Pilihan 1998',
    code: 'DOK-03/ARSIP',
    location: 'Toples "Awetan Khusus" - Ruang Rahasia Lab Biologi',
    found: false,
    date: '14 November 1998',
    importance: 'krusial',
    excerpt: '33 nama siswa berprestasi bergolongan darah ganjil dengan tanda silang darah...',
    fullContent: 'Tercatat dengan cap tinta merah pekat: \n1. Gilang Suryakusuma (Ketua OSIS / Golongan Darah O Murni - Wadah Roh Matahari Hayam).\n2. Satria Perkasa (Kapten Silat / Golongan Darah B - Pengunci Petir).\n3. Melati Kusuma (Pianis Jenius / Pewaris Garis Danau).\n\nKeterangan resmi koran: "Seluruh korban tewas terpanggang akibat korsleting listrik sayap barat". Keterangan rahasia terlampir: "Darah mereka berhasil disuling untuk membangkitkan Gerbang Batara Murka tahap pertama."'
  },
  {
    id: 'clue_jurnal_gilang',
    title: 'Jurnal Sobek Terakhir Gilang Suryakusuma',
    code: 'DOK-04/GILANG',
    location: 'Bawah Papan Lantai Retak - Tangga Darurat Dimensi',
    found: false,
    date: '14 November 1998 - Jam 23:45',
    importance: 'krusial',
    excerpt: '"Renald adikku... jika kelak kau membaca ini, ketahuilah jiwaku tak pernah mati. Aku akan menunggumu di lorong waktu..."',
    fullContent: '"Pintu koridor telah digembok rantai baja dari luar. Api dupa hitam membumbung dari ruang kepala sekolah. Soedjarwo telah mengorbankan teman-temanku satu per satu. Sebelum aku tertangkap, aku berhasil menelan Jimat Garuda Hayam pusaka leluhur kita. Jika ragaku harus binasa dalam kobaran api ini, jiwaku akan menyatu abadi ke dalam Garuda Hayam. Renald, darah Suryakusuma di nadimu adalah kunci segel. Jika saatnya tiba, panggil namaku, dan kita akan meremukkan rantai kutukan ini bersama!"'
  },
  {
    id: 'clue_pasak_naga',
    title: 'Kitab Kuno: 7 Pasak Segel Mataram',
    code: 'DOK-05/SEGEL',
    location: 'Dinding Rahasia Kubah Magma Bawah Tanah',
    found: false,
    date: 'Abad ke-14 Mataram Kuno',
    importance: 'terlarang',
    excerpt: 'Hanya perpaduan Tiga Pilar Roh (Bara Api Hayam, Es Telaga Suci, dan Guntur Jagad) yang sanggup meremukkan belenggu Batara Murka.',
    fullContent: '"Batara Murka bukanlah iblis tunggal alam bawah, melainkan benih dari Pohon Kematian Sembilan Gerbang. Jika satu pasak dirobohkan oleh Serangan Total Pengusiran Jiwa (All-Out Exorcism), maka segel dimensi penjara arwah akan terbuka. Namun waspadalah: runtuhnya gerbang pertama akan memicu getaran bagi delapan gerbang lainnya di seantero negeri."'
  },
  {
    id: 'clue_transkrip_radio',
    title: 'Transkrip Transmisi Gelombang Sandi 9 Gerbang',
    code: 'DOK-06/SINDIKAT',
    location: 'Saku Jas Batara Soedjarwo yang Hangus',
    found: false,
    date: 'Malam Gerhana Merah 2026',
    importance: 'terlarang',
    excerpt: 'Rekaman audio berfrekuensi militer rahasia yang menghubungkan SMA Bhawana dengan jaringan nasional...',
    fullContent: 'KODE FREKUENSI [09-GERHANA-PUSAT]:\n"Laporan masuk dari Sektor 01: Agen Soedjarwo gagal menumbalkan Renald Suryakusuma. Pasak Gerbang Pertama di SMA 7 Bhawana telah runtuh total. Seluruh unit di SMA Garuda Megantara (Gerbang 02 Ibu Kota) dan SMA Watu Ireng (Gerbang 03 Lereng Merapi) bersiap masuk Siaga Satu. Cari dan musnahkan Trio Pengusir Roh sebelum mereka mengetahui keberadaan Dewan Sembilan!"'
  },
  {
    id: 'clue_peta_nusantara',
    title: 'Peta Okultisme 9 Gerbang Nusantara (Season 2)',
    code: 'DOK-07/SEASON2',
    location: 'Piringan Obsidian Berukir Simbol Sembilan Bintang',
    found: false,
    date: 'Dokumen Strategis Sindikat Hitam',
    importance: 'terlarang',
    excerpt: 'Peta kepulauan Indonesia yang ditandai dengan sembilan titik segel darah raksasa...',
    fullContent: 'TITIK TUMBAL GERBANG NUSANTARA:\n1. [HANCUR] SMA 7 Bhawana (Pasak Jiwa 1998)\n2. [AKTIF] SMA Garuda Megantara - Jakarta Pusat (Pusat Elit Pengendali Pikiran)\n3. [AKTIF] SMA Watu Ireng - Yogyakarta (Kuil Kuno Bawah Tanah)\n4. [AKTIF] Kompleks Asrama Giri Kencana - Bali\n5. [AKTIF] Kampus Tua Dayak Meratus - Kalimantan\n...\nCatatan Pinggir Utusan: "Bocah pembawa Garuda Hayam itu kini tahu. Perang suci sesungguhnya baru saja dimulai."'
  },
  {
    id: 'clue_flashdisk_hitam',
    title: 'Flash Disk Hitam Enkripsi Militer Soedjarwo',
    code: 'DOK-08/S2-INTEL',
    location: 'Saku Dalam Rompi Zirah Soedjarwo',
    found: false,
    date: 'File Terenkripsi Tingkat Tiga',
    importance: 'terlarang',
    excerpt: 'Memuat rekaman rapat rahasia Dewan Sembilan dan kode akses pintu darurat SMA Megantara...',
    fullContent: 'DEKRIPSI DATA SEKTOR 02:\n"Proyek Megantara dikepalai oleh Komandan Wira. Pasak Gerbang Kedua menggunakan tiang pemancar 5G di atap gedung sains untuk memanipulasi kesadaran ribuan murid ber-IQ tinggi di ibu kota. Jangan biarkan siapapun dengan darah Suryakusuma mendekati menara pusat!"'
  },
  {
    id: 'clue_peta_megantara',
    title: 'Cetak Biru Rahasia SMA Garuda Megantara Jakarta',
    code: 'DOK-09/BLUEPRINT-S2',
    location: 'Koper Pengintai Bayangan Sindikat',
    found: false,
    date: 'Cetak Biru Lantai 13 Terlarang',
    importance: 'terlarang',
    excerpt: 'Denah arsitektur modern SMA Megantara yang menyembunyikan laboratorium kultus di lantai 13...',
    fullContent: 'DENAH LANTAI 13 SMA GARUDA MEGANTARA:\n- Lift utama hanya memiliki tombol hingga lantai 12.\n- Akses ke lantai 13 memerlukan kartu gesek bermuatan energi ghaib pasak darah.\n- Altar penyerapan jiwa terletak tepat di ruang serba guna auditorium kaca gantung.'
  }
];

export const STORY_CHAPTERS: StoryChapter[] = [
  {
    id: 'chap_0',
    number: 0,
    title: 'Prolog: Panggilan Jam Ke-13',
    subtitle: 'Kebangkitan Sang Sayap Bara Api Hayam',
    startNodeId: 'node_p_01',
    isUnlocked: true,
    isCompleted: false,
    bossEnemyId: 'genderuwo_lorong',
    summary: 'Renald Suryakusuma, murid pindahan baru, terkunci di koridor sayap barat saat larut malam. Jam berdentang 13 kali, genderuwo menyerang, dan jiwa Kak Gilang bangkit dalam kobaran api Garuda Hayam.'
  },
  {
    id: 'chap_1',
    number: 1,
    title: 'Bab 1: Simfoni Darah & Cermin Melati',
    subtitle: 'Arwah Sang Pianis 1995 & Cermin Es Maya Kirana',
    startNodeId: 'node_c1_01',
    isUnlocked: false,
    isCompleted: false,
    bossEnemyId: 'boss_clara',
    summary: 'Menyelidiki ruang musik angker bersama Wakil Ketua OSIS Maya Kirana. Menghadapi Madame Clara, membangkitkan roh Nyai Candra Kirana, dan menemukan bukti perjanjian darah yayasan 1972.'
  },
  {
    id: 'chap_2',
    number: 2,
    title: 'Bab 2: Anatomi 33 Tumbal & Kamar Jenazah',
    subtitle: 'Horor UKS Bawah Tanah & Guntur Silat Bagas',
    startNodeId: 'node_c2_01',
    isUnlocked: false,
    isCompleted: false,
    bossEnemyId: 'boss_anatomi',
    summary: 'Menerobos lorong UKS dan Laboratorium Biologi. Menyelamatkan atlet silat Bagas Perkasa, membangkitkan Bharata Petir, mengalahkan manekin terkutuk Kala Belatung, dan membongkar toples 33 darah tumbal.'
  },
  {
    id: 'chap_3',
    number: 3,
    title: 'Bab 3: Labirin Tangga Dimensi & Ujian Jiwa',
    subtitle: 'Pekikan Kuyang Ventilasi & Bayangan Gilang',
    startNodeId: 'node_c3_01',
    isUnlocked: false,
    isCompleted: false,
    bossEnemyId: 'kuyang_ventilasi',
    summary: 'Terperangkap dalam tangga darurat dimensi tanpa ujung. Mengalahkan Kuyang penghisap darah, menemukan jurnal sobek Gilang 1998, dan menuntaskan ujian batin antara Renald dan sang kakak.'
  },
  {
    id: 'chap_4',
    number: 4,
    title: 'Bab 4: Dapur Magma & Sindikat Matahari Hitam',
    subtitle: 'Raja Banaspati Purba & Rahasia Konspirasi Nasional',
    startNodeId: 'node_c4_01',
    isUnlocked: false,
    isCompleted: false,
    bossEnemyId: 'banaspati_raja',
    summary: 'Menerobos ruang ketel pemanas bawah tanah tempat segel Mataram kuno ditempa. Menghadapi kobaran lahar Raja Banaspati dan menemukan bahwa kepala sekolah hanyalah pion dari sindikat rahasia nasional.'
  },
  {
    id: 'chap_5',
    number: 5,
    title: 'Bab 5: Gerhana Darah Menara Lonceng',
    subtitle: 'Pertarungan Akbar Melawan Batara Kala Soedjarwo',
    startNodeId: 'node_c5_01',
    isUnlocked: false,
    isCompleted: false,
    bossEnemyId: 'boss_soedjarwo',
    summary: 'Pertempuran puncak di puncak menara lonceng sekolah di bawah langit gerhana berdarah. Menghancurkan wujud iblis kepala sekolah dan membebaskan arwah seluruh 33 korban pembantaian 1998.'
  },
  {
    id: 'chap_6',
    number: 6,
    title: 'Epilog Season 1: Fajar & Sinyal Gerbang Kedua',
    subtitle: 'Tirai Tersibak: Menuju Season 2 (Sindikat 9 Gerbang)',
    startNodeId: 'node_c6_01',
    isUnlocked: false,
    isCompleted: false,
    bossEnemyId: 'boss_soedjarwo',
    summary: 'Fajar menyingsing di SMA 7 Bhawana. Perpisahan mengharukan dengan arwah Kak Gilang, disusul penemuan transmisi radio misterius yang membongkar eksistensi 8 sekolah tumbal lainnya di Nusantara.'
  },
  {
    id: 'chap_7',
    number: 7,
    title: 'Season 2 - Bab 1: Dekripsi Berkas Hitam & Markas Intelijen',
    subtitle: 'Pangkalan Safehouse Trio Bhawana & Serangan Pengintai Bayangan',
    startNodeId: 'node_c7_01',
    isUnlocked: false,
    isCompleted: false,
    bossEnemyId: 'shadow_scout',
    summary: 'Trio Bhawana mendirikan safehouse untuk membedah flash disk hitam Soedjarwo. Menguak koordinat Gerbang Kedua di Jakarta, menerima transmisi darurat dari agen rahasia Srikandi 07, dan disergap oleh Pengintai Bayangan Sindikat.'
  },
  {
    id: 'chap_8',
    number: 8,
    title: 'Season 2 - Bab 2: Infiltrasi SMA Garuda Megantara Ibu Kota',
    subtitle: 'Lantai Tiga Belas Terlarang & Duel Melawan Komandan Wira',
    startNodeId: 'node_c8_01',
    isUnlocked: false,
    isCompleted: false,
    bossEnemyId: 'boss_wira',
    summary: 'Menembus gedung modern SMA Garuda Megantara di Jakarta. Melewati laser kutukan astral, mencapai altar lantai 13, dan bertarung hidup-mati melawan Komandan Wira Sang Pedang Obsidian demi mematahkan pasak Gerbang Kedua!'
  }
];

export const STORY_NODES: Record<string, StoryNode> = {
  // ==========================================
  // PROLOGUE NODES (BAB 0)
  // ==========================================
  node_p_01: {
    id: 'node_p_01',
    speaker: 'Renald Suryakusuma',
    speakerRole: 'Murid Pindahan Kelas 2-A',
    text: 'Hujan badai mengguncang kaca jendela lantai dua sayap barat SMA 7 Bhawana. Jarum jam dinding menunjuk pukul 23:55. Bau bunga sedap malam menusuk hidung bercampur amis darah yang pekat. Mengapa gerbang sekolah tiba-tiba digembok rantai dari luar...?',
    emotion: 'whisper',
    backgroundStyle: 'corridor',
    choices: [
      { text: 'Periksa jendela koridor yang terlapisi embun merah', nextNodeId: 'node_p_02' },
      { text: 'Genggam liontin bulu burung emas peninggalan Kak Gilang', nextNodeId: 'node_p_03' }
    ]
  },
  node_p_02: {
    id: 'node_p_02',
    speaker: 'Renald Suryakusuma',
    speakerRole: 'Murid Pindahan Kelas 2-A',
    text: 'Di luar kaca, halaman sekolah tampak gulita seperti jurang tanpa dasar. Tiang bendera bergoyang liar ke kiri dan ke kanan, diiringi suara desah tangis puluhan anak remaja yang sayup-sayup meminta tolong dari bawah tanah...',
    emotion: 'fear',
    backgroundStyle: 'corridor',
    autoNext: 'node_p_04'
  },
  node_p_03: {
    id: 'node_p_03',
    speaker: 'Renald Suryakusuma',
    speakerRole: 'Murid Pindahan Kelas 2-A',
    text: 'Bulu burung logam berukir aksara Kawi peninggalan Kak Gilang terasa mendidih di balik saku seragamku. Sepuluh tahun lalu, kakakku berpamitan ke sekolah ini sebagai Ketua OSIS teladan dan tidak pernah pulang lagi. Polisi menyebutnya korban kebakaran... tapi aku tahu ada rahasia gelap di sini.',
    emotion: 'determined',
    backgroundStyle: 'corridor',
    autoNext: 'node_p_04'
  },
  node_p_04: {
    id: 'node_p_04',
    speaker: 'Lonceng Menara Sekolah',
    speakerRole: 'DENTANG MISTIS PUKUL 00:00',
    text: 'DDOOONNGGG... DDOOONNGGG... DDOOONNGGG...! Dentang ketiga belas bergaung memekakkan telinga! Dinding semen koridor retak memanjang, meneteskan nanah hitam pekat berbau kemenyan!',
    emotion: 'shock',
    backgroundStyle: 'corridor',
    autoNext: 'node_p_05'
  },
  node_p_05: {
    id: 'node_p_05',
    speaker: 'Genderuwo Koridor',
    speakerRole: 'Penjaga Sayap Gedung Terbengkalai',
    text: '“GGGRRRROOAAARRR...! Bau darah murni keluarga Suryakusuma! Akhirnya anak kedua datang menyerahkan kepalanya ke altar gerhana!” Sosok raksasa setinggi 3 meter bertaring tajam muncul dari balik bayang-bayang!',
    emotion: 'fear',
    backgroundStyle: 'corridor',
    autoNext: 'node_p_06'
  },
  node_p_06: {
    id: 'node_p_06',
    speaker: 'Gilang (Suara Jiwa)',
    speakerRole: 'Bisikan Suci Sang Kakak',
    text: '“Renald! Tatap mataku! Jangan tunduk pada rasa takutmu! Darah yang mengalir di tubuh kita adalah nyala api pembebas jiwa! Robek topeng keraguanmu, dan panggil namaku sekarang!!”',
    emotion: 'determined',
    backgroundStyle: 'corridor',
    choices: [
      { text: '“BANGKITLAH DARI ABU KEMATIAN... GARUDA HAYAM!!” (Awakening Summon)', nextNodeId: 'node_p_07' }
    ]
  },
  node_p_07: {
    id: 'node_p_07',
    speaker: 'Renald & Garuda Hayam',
    speakerRole: 'Kebangkitan Sumpah Jiwa',
    text: 'Kobaran api merah keemasan membakar wajah Renald, melebur menjadi topeng bulu garuda yang megah! Sepasang sayap bara api raksasa mengepak dari punggungnya, menerangi kegelapan koridor terkutuk! “Aku akan membebaskan seluruh jiwa yang kau pasung di sekolah ini!”',
    emotion: 'determined',
    backgroundStyle: 'corridor',
    triggerBattleEnemyId: 'genderuwo_lorong',
    autoNext: 'node_p_victory'
  },
  node_p_victory: {
    id: 'node_p_victory',
    speaker: 'Renald Suryakusuma',
    speakerRole: 'Murid Pindahan Kelas 2-A',
    text: 'Genderuwo koridor melolong kesakitan sebelum lebur menjadi abu bara. Di sela abunya yang berceceran di lantai ubin, aku menemukan lembaran kertas partitur musik berlumur darah bertanggal 12 Oktober 1995...',
    emotion: 'determined',
    backgroundStyle: 'corridor',
    unlockClueId: 'clue_partitur',
    choices: [
      { text: 'Menuju Ruang Musik di lantai dua (Mulai Bab 1)', nextNodeId: 'node_c1_01' }
    ]
  },

  // ==========================================
  // CHAPTER 1: RUANG MUSIK (BAB 1)
  // ==========================================
  node_c1_01: {
    id: 'node_c1_01',
    speaker: 'Maya Kirana',
    speakerRole: 'Wakil Ketua OSIS',
    text: '“Berhenti di sana dan angkat tanganmu! Siapa kau, dan mengapa kau membawa aura kobaran api iblis di koridor terlarang ini?!” Seorang siswi berambut biru gelap mengacungkan tongkat es berujung belati perak ke leherku.',
    emotion: 'shock',
    backgroundStyle: 'music_room',
    choices: [
      { text: '“Namaku Renald Suryakusuma. Aku sedang mencari jejak kakakku yang hilang.”', nextNodeId: 'node_c1_02' },
      { text: '“Tenang! Aku baru saja mengalahkan makhluk hitam berbulu di koridor bawah!”', nextNodeId: 'node_c1_02' }
    ]
  },
  node_c1_02: {
    id: 'node_c1_02',
    speaker: 'Maya Kirana',
    speakerRole: 'Wakil Ketua OSIS',
    text: '“Suryakusuma?! Kau... adik dari Kak Gilang Suryakusuma, ketua OSIS legendaris yang dikorbankan tahun 1998 itu?! Turunkan senjatamu... Dengar, ruang musik ini bukan sekadar ruangan latihan biasa. Bibiku, Melati Kusuma, adalah siswi terpintar di sini sebelum dia meninggal secara tak wajar di depan piano besar itu.”',
    emotion: 'whisper',
    backgroundStyle: 'music_room',
    autoNext: 'node_c1_03'
  },
  node_c1_03: {
    id: 'node_c1_03',
    speaker: 'Madame Clara',
    speakerRole: 'Arwah Sang Sonata Berdarah 1995',
    text: '“Kkkhhh... anak-anak manis pembangkang... Tuts piano ini haus akan simfoni darah baru! Melati telah menyerahkan jari-jemarinya demi keabadian nada, kini giliran kalian menjadi senar kematianku!!” Suara denting piano terdengar kencang, dan puluhan kawat baja berduri melesat keluar dari dinding!',
    emotion: 'fear',
    backgroundStyle: 'music_room',
    autoNext: 'node_c1_04'
  },
  node_c1_04: {
    id: 'node_c1_04',
    speaker: 'Maya Kirana',
    speakerRole: 'Kebangkitan Candra Kirana',
    text: '“Kau takkan menyentuh siapa pun lagi, Clara! Sucikan ruangan ini dari kebencian purba! Datanglah padaku... NYAI CANDRA KIRANA!” Suhu ruang musik merosot drastis hingga membeku, memancarkan kristal salju permata yang melindungi kami berdua!',
    emotion: 'determined',
    backgroundStyle: 'music_room',
    triggerBattleEnemyId: 'boss_clara',
    autoNext: 'node_c1_victory'
  },
  node_c1_victory: {
    id: 'node_c1_victory',
    speaker: 'Maya Kirana',
    speakerRole: 'Wakil Ketua OSIS',
    text: 'Madame Clara menjerit serak saat pedang es dan bara Garuda Hayam memecahkan tuts piano kutukannya. Dari dalam rangka piano yang pecah berantakan, sebuah map logam tebal terpental ke lantai: "Perjanjian Darah Yayasan Bhawana 1972"!',
    emotion: 'shock',
    backgroundStyle: 'music_room',
    unlockClueId: 'clue_yayasan',
    choices: [
      { text: 'Baca dokumen rahasia 1972 bersama Maya', nextNodeId: 'node_c1_doc' }
    ]
  },
  node_c1_doc: {
    id: 'node_c1_doc',
    speaker: 'Renald Suryakusuma',
    speakerRole: 'Murid Pindahan Kelas 2-A',
    text: '“Sekolah ini... sengaja didirikan di atas mata air makam keramat demi menyerap energi kehidupan murid-muridnya setiap 25 tahun sekali! Dan tahun ini adalah siklus gerhana berikutnya!” Tiba-tiba, suara dentuman keras dan jeritan terdengar dari sayap Laboratorium Biologi!',
    emotion: 'shock',
    backgroundStyle: 'music_room',
    choices: [
      { text: 'Berlari ke Laboratorium Biologi untuk menyelidiki (Lanjut Bab 2)', nextNodeId: 'node_c2_01' }
    ]
  },

  // ==========================================
  // CHAPTER 2: LAB BIOLOGI & UKS (BAB 2)
  // ==========================================
  node_c2_01: {
    id: 'node_c2_01',
    speaker: 'Bagas Perkasa',
    speakerRole: 'Atlet Bela Diri Sekolah',
    text: '“HIAAATTTT! Jangan harap kalian bisa lewat, bangkai tak berkepala!!” Seorang pemuda bertubuh kekar berseragam olahraga robek-robek menghantamkan pipa besi berlapis percikan petir ke arah kawanan mayat hidup berantai yang merayap di lorong UKS!',
    emotion: 'determined',
    backgroundStyle: 'bio_lab',
    choices: [
      { text: 'Bantu Bagas dengan tebasan sayap api Garuda Hayam!', nextNodeId: 'node_c2_02' },
      { text: 'Bekukan lantai koridor dengan kristal es Maya!', nextNodeId: 'node_c2_02' }
    ]
  },
  node_c2_02: {
    id: 'node_c2_02',
    speaker: 'Bagas Perkasa',
    speakerRole: 'Atlet Bela Diri Sekolah',
    text: '“Hah, kalian bisa mengendalikan roh juga?! Bagus! Abangku, Satria Perkasa, adalah kapten silat 1998 yang dinyatakan tewas terbakar bersama kakakmu, Renald! Tapi seminggu lalu aku menemukan foto abangku diikat di ranjang operasi lab ini... mereka tidak mati terbakar, mereka dijadikan bahan eksperimen!”',
    emotion: 'determined',
    backgroundStyle: 'bio_lab',
    autoNext: 'node_c2_03'
  },
  node_c2_03: {
    id: 'node_c2_03',
    speaker: 'Kala Belatung',
    speakerRole: 'Manekin Anatomi Terkutuk 1998',
    text: 'Pintu lemari kaca laboratorium meledak pecah! Sosok manekin anatomi setinggi dua setengah meter yang dirakit dari tulang belulang manusia, paku karatan, dan toples organ berdenyut bangkit menyemburkan uap formalin beracun!',
    emotion: 'fear',
    backgroundStyle: 'bio_lab',
    autoNext: 'node_c2_04'
  },
  node_c2_04: {
    id: 'node_c2_04',
    speaker: 'Bagas Perkasa',
    speakerRole: 'Kebangkitan Bharata Petir',
    text: '“Monster jahanam! Kembalikan kehormatan abangku dan seluruh teman-temannya! Hancurkan dia... BHARATA PETIR!!” Kilat keemasan menyambar dari dada Bagas, membentuk zirah prajurit petir purba bersenjatakan godam guntur!',
    emotion: 'determined',
    backgroundStyle: 'bio_lab',
    triggerBattleEnemyId: 'boss_anatomi',
    autoNext: 'node_c2_victory'
  },
  node_c2_victory: {
    id: 'node_c2_victory',
    speaker: 'Renald Suryakusuma',
    speakerRole: 'Murid Pindahan Kelas 2-A',
    text: 'Hantaman petir Bharata Petir dan api Hayam melumatkan manekin anatomi tersebut hingga menjadi serpihan abu. Di balik brankas pendingin spesimen, kami menemukan toples kristal tersegel berlabel: "Daftar 33 Siswa Pilihan 1998". Kak Gilang dan Satria terdaftar dengan tanda silang darah!',
    emotion: 'shock',
    backgroundStyle: 'bio_lab',
    unlockClueId: 'clue_daftar_tumbal',
    choices: [
      { text: 'Membaca rincian 33 korban tumbal', nextNodeId: 'node_c2_clue' }
    ]
  },
  node_c2_clue: {
    id: 'node_c2_clue',
    speaker: 'Bagas Perkasa',
    speakerRole: 'Atlet Bela Diri Sekolah',
    text: '“Lihat ini... di catatan bawah toples tertulis: ‘Jiwa-jiwa ini disalurkan melalui tangga darurat menuju puncak menara lonceng untuk persiapan gerhana abadi’. Mantan Kepala Sekolah Soedjarwo... bajingan itu masih hidup dan bersembunyi di atas sana!”',
    emotion: 'determined',
    backgroundStyle: 'bio_lab',
    choices: [
      { text: 'Menerobos pintu Tangga Darurat menuju Menara Lonceng (Lanjut Bab 3)', nextNodeId: 'node_c3_01' }
    ]
  },

  // ==========================================
  // CHAPTER 3: LABIRIN TANGGA DARURAT (BAB 3)
  // ==========================================
  node_c3_01: {
    id: 'node_c3_01',
    speaker: 'Maya Kirana',
    speakerRole: 'Wakil Ketua OSIS',
    text: '“Tunggu... ada yang tidak beres. Kita sudah menaiki lebih dari seratus anak tangga, tapi papan penunjuk di dinding tetap tertulis ‘Lantai 3’. Tangga ini berputar melingkar dalam ilusi tanpa batas!”',
    emotion: 'shock',
    backgroundStyle: 'stairwell',
    choices: [
      { text: 'Pecahkan kaca ventilasi udara yang mengucurkan darah', nextNodeId: 'node_c3_02' },
      { text: 'Fokuskan indra spiritual Garuda Hayam mencari anomali dimensi', nextNodeId: 'node_c3_02' }
    ]
  },
  node_c3_02: {
    id: 'node_c3_02',
    speaker: 'Kuyang Ventilasi Lab',
    speakerRole: 'Penjaga Labirin Dimensi',
    text: '“Heehehehehe...! Kalian tidak akan pernah sampai ke puncak! Kepala kalian akan melayang bersama isi perutku di lorong hampa ini!” Kepala melayang dengan organ usus dan jantung berlumuran darah meluncur turun dari kisi-kisi ventilasi atap!',
    emotion: 'fear',
    backgroundStyle: 'stairwell',
    triggerBattleEnemyId: 'kuyang_ventilasi',
    autoNext: 'node_c3_post_battle'
  },
  node_c3_post_battle: {
    id: 'node_c3_post_battle',
    speaker: 'Renald Suryakusuma',
    speakerRole: 'Murid Pindahan Kelas 2-A',
    text: 'Setelah kuyang itu tersapu oleh tembakan Jimat Peluru dan hembusan badai salju, lantai ubin tangga runtuh, menampakkan rongga tersembunyi. Di dalamnya tergeletak sebuah buku catatan tebal bersampul kulit terbakar bertuliskan inisial ‘G.S.’. Ini tulisan tangan Kak Gilang!',
    emotion: 'whisper',
    backgroundStyle: 'stairwell',
    unlockClueId: 'clue_jurnal_gilang',
    autoNext: 'node_c3_shadow'
  },
  node_c3_shadow: {
    id: 'node_c3_shadow',
    speaker: 'Gilang (Suara Jiwa)',
    speakerRole: 'Manifestasi Roh Pelindung',
    text: 'Sosok cahaya keemasan Kak Gilang mewujud di depan mataku. Senyumnya teduh, namun sorot matanya tegas: “Renald... kau telah membuktikan keberanianmu. Tapi ketahuilah, musuh kita di puncak menara bukan sekadar manusia serakah. Soedjarwo terikat pada kekuatan gelap yang jauh melampaui sekolah ini. Apakah kau siap memikul beban ini?”',
    emotion: 'determined',
    backgroundStyle: 'stairwell',
    choices: [
      { text: '“Aku tidak akan mundur selangkah pun, Kak. Demi keadilanmu dan teman-temanmu!”', nextNodeId: 'node_c3_bond' }
    ]
  },
  node_c3_bond: {
    id: 'node_c3_bond',
    speaker: 'Garuda Hayam',
    speakerRole: 'Resonansi Ikatan Pahlawan',
    text: 'Cahaya Garuda Hayam berkobar dua kali lipat lebih dahsyat! Rantai ilusi tangga darurat hancur berkeping-keping. Di depan kami, sebuah pintu besi tua berkarat bertuliskan "RUANG PEMANAS & TUNGKU MATARAM" mendadak terbuka, memuntahkan hawa panas yang menyengat!',
    emotion: 'determined',
    backgroundStyle: 'stairwell',
    choices: [
      { text: 'Masuki Ruang Pemanas Kuno (Mulai Bab 4)', nextNodeId: 'node_c4_01' }
    ]
  },

  // ==========================================
  // CHAPTER 4: DAPUR MAGMA & SINDIKAT (BAB 4)
  // ==========================================
  node_c4_01: {
    id: 'node_c4_01',
    speaker: 'Bagas Perkasa',
    speakerRole: 'Atlet Bela Diri Sekolah',
    text: '“Panas sekali tempat ini! Mengapa di bawah gedung sekolah modern ada tungku pembakaran batu bara kuno sebesar ini? Dan lihat dinding itu... ukirannya bukan dari zaman Belanda, tapi relief candi Mataram Kuno!”',
    emotion: 'shock',
    backgroundStyle: 'boss_gate',
    choices: [
      { text: 'Periksa prasasti relief 7 pasak tembaga di dinding', nextNodeId: 'node_c4_02' },
      { text: 'Waspadai kolam magma yang mulai bergejolak', nextNodeId: 'node_c4_02' }
    ]
  },
  node_c4_02: {
    id: 'node_c4_02',
    speaker: 'Raja Banaspati Purba',
    speakerRole: 'ELITE - Penjaga Pasak Bumi Mataram',
    text: '“BOOOMMMM! Siapa yang berani menginjakkan kaki di tungku persembahan Batara Murka?! Jiwa kalian akan dilelehkan menjadi pelumas gerbang neraka!!” Tengkorak raksasa terbakar magma merah menyala muncul dari kawah batu bara!',
    emotion: 'fear',
    backgroundStyle: 'boss_gate',
    triggerBattleEnemyId: 'banaspati_raja',
    autoNext: 'node_c4_victory'
  },
  node_c4_victory: {
    id: 'node_c4_victory',
    speaker: 'Maya Kirana',
    speakerRole: 'Wakil Ketua OSIS',
    text: 'Dengan serangan gabungan es Candra Kirana dan tebasan petir Bagas, kobaran api Raja Banaspati berhasil dipadamkan. Di balik tungku pemanas yang runtuh, kami menemukan sebuah kotak logam tahan api berlabel segel: "Kitab Kuno: 7 Pasak Segel Mataram".',
    emotion: 'determined',
    backgroundStyle: 'boss_gate',
    unlockClueId: 'clue_pasak_naga',
    autoNext: 'node_c4_discovery'
  },
  node_c4_discovery: {
    id: 'node_c4_discovery',
    speaker: 'Renald Suryakusuma',
    speakerRole: 'Murid Pindahan Kelas 2-A',
    text: '“Tunggu... di balik kitab kuno ini ada perangkat komunikasi modern berlambang sembilan bintang hitam bertuliskan: ‘SINDIKAT SEMBILAN GERBANG NUSANTARA’. Soedjarwo ternyata tidak bergerak sendirian! Dia hanya pion lokal yang bertugas mengaktifkan Gerbang Pertama dari sembilan gerbang tumbal di Indonesia!”',
    emotion: 'shock',
    backgroundStyle: 'boss_gate',
    choices: [
      { text: '“Kita harus hentikan Soedjarwo sebelum Gerbang Pertama terbuka!” (Lanjut Bab 5)', nextNodeId: 'node_c5_01' }
    ]
  },

  // ==========================================
  // CHAPTER 5: GERHANA MENARA LONCENG (BAB 5)
  // ==========================================
  node_c5_01: {
    id: 'node_c5_01',
    speaker: 'Batara Kala Soedjarwo',
    speakerRole: 'Mantan Kepala Sekolah / Iblis Gerhana 1998',
    text: '“Hahahahaha! Luar biasa! Kalian berhasil menembus seluruh anjing penjagaku sampai ke puncak menara ini! Tapi kalian terlambat! Lihatlah ke langit!” Langit malam telah berubah menjadi merah darah pekat; bulan purnama tertutup bayangan hitam gerhana total!',
    emotion: 'smirk',
    backgroundStyle: 'rooftop',
    autoNext: 'node_c5_02'
  },
  node_c5_02: {
    id: 'node_c5_02',
    speaker: 'Renald Suryakusuma',
    speakerRole: 'Murid Pindahan Kelas 2-A',
    text: '“Soedjarwo! Dua puluh delapan tahun kau bersembunyi di balik nama baik yayasan, menumbalkan 33 murid tak bersalah demi nafsu busukmu! Hari ini, seluruh darah yang kau tumpahkan akan menuntut balas!!”',
    emotion: 'determined',
    backgroundStyle: 'rooftop',
    choices: [
      { text: '“Maya, Bagas... serang dengan seluruh kekuatan jiwa kita!”', nextNodeId: 'node_c5_transform' }
    ]
  },
  node_c5_transform: {
    id: 'node_c5_transform',
    speaker: 'Batara Kala Soedjarwo',
    speakerRole: 'Manifestasi Iblis Tangan Seribu',
    text: 'Tubuh tua Soedjarwo meledak, bertransformasi menjadi sosok raksasa berzirah gerhana hitam bertangan seribu dengan mata merah menyala di sekujur dadanya! “Kalian hanyalah serangga di hadapan keabadian! Serahkan darahmu, Renald, dan bukalah Gerbang Sembilan Alam!!”',
    emotion: 'fear',
    backgroundStyle: 'rooftop',
    triggerBattleEnemyId: 'boss_soedjarwo',
    autoNext: 'node_c5_climax'
  },
  node_c5_climax: {
    id: 'node_c5_climax',
    speaker: 'Trio Pengusir Roh Bhawana',
    speakerRole: 'SERANGAN TOTAL PENGUSIRAN JIWA',
    text: '“CANDRA KIRANA, BEKUKAN KEBENCIANNYA! BHARATA PETIR, HANCURKAN ZIRAH KUTUKANNYA! DAN GARUDA HAYAM... BAKAR KEGELAPAN INI DENGAN CAHAYA MENTARI ABADI!! ALL-OUT EXORCISM!!” Ketiga pahlawan melesat bersatu dalam pusaran cahaya kosmik yang meremukkan jantung Batara Kala Soedjarwo!',
    emotion: 'determined',
    backgroundStyle: 'rooftop',
    unlockClueId: 'clue_transkrip_radio',
    autoNext: 'node_c5_defeat'
  },
  node_c5_defeat: {
    id: 'node_c5_defeat',
    speaker: 'Batara Kala Soedjarwo',
    speakerRole: 'Runtuhnya Sang Arsitek Tumbal',
    text: '“TIIIDDAAAKKKK! Ini mustahil... Gerbang Pertama... bagaimana bisa segelku hancur oleh bocah ingusan...?! Tapi jangan kira... kalian sudah menang... Dewan Sembilan... tidak akan membiarkan kalian hidup...” Tubuh raksasa Soedjarwo roboh dan meledak menjadi debu hitam yang tertiup angin fajar.',
    emotion: 'shock',
    backgroundStyle: 'rooftop',
    choices: [
      { text: 'Saksikan pembebasan 33 arwah korban 1998 (Lanjut Bab 6 Epilog)', nextNodeId: 'node_c6_01' }
    ]
  },

  // ==========================================
  // CHAPTER 6: EPILOG SEASON 1 & CLIFFHANGER S2
  // ==========================================
  node_c6_01: {
    id: 'node_c6_01',
    speaker: 'Gilang Suryakusuma',
    speakerRole: 'Arwah Sang Kakak Teladan 1998',
    text: 'Rantai-rantai astral yang melilit sekolah pecah bergemerincing. Tiga puluh tiga arwah murid—termasuk Satria abang Bagas dan Melati bibi Maya—berkumpul di atap menara. Di tengah mereka, Kak Gilang melangkah maju dengan senyuman terindah yang pernah kulihat. Dia meletakkan tangannya di pundakku: “Renald... kau telah membebaskan kami semua. Terima kasih telah mempercayai janjiku.”',
    emotion: 'normal',
    backgroundStyle: 'rooftop',
    autoNext: 'node_c6_02'
  },
  node_c6_02: {
    id: 'node_c6_02',
    speaker: 'Renald Suryakusuma',
    speakerRole: 'Murid Pindahan Kelas 2-A',
    text: 'Air mataku menetes di pipi saat melihat mereka perlahan larut menjadi partikel cahaya keemasan yang naik menuju langit pagi. Namun sebelum benar-benar pudar, Kak Gilang membisikkan sesuatu di telingaku: “Renald... Garuda Hayam kini milikmu seutuhnya. Jaga dirimu baik-baik... karena Soedjarwo hanyalah permulaan. Badai sesungguhnya sedang menuju ibu kota.”',
    emotion: 'whisper',
    backgroundStyle: 'rooftop',
    autoNext: 'node_c6_03'
  },
  node_c6_03: {
    id: 'node_c6_03',
    speaker: 'Pemancar Sandi Misterius',
    speakerRole: 'FREKUENSI GELOMBANG SINDIKAT 9 GERBANG',
    text: 'KRESEK... KRESEKKK... Dari sela abu Soedjarwo yang berserakan, sebuah radio transmisi militer hitam menyala sendiri dengan frekuensi berderit! \n\n“Panggilan darurat dari Sektor 01 terputus. Agen Soedjarwo telah dieliminasi oleh keturunan Suryakusuma. Peta 9 Gerbang Nusantara telah bocor. Seluruh komandan sektor: Pindahkan ritual tumbal berikutnya ke Gerbang Kedua: SMA Garuda Megantara di Jakarta. Habisi Trio Bhawana sebelum mereka menyatukan kekuatan!”',
    emotion: 'shock',
    backgroundStyle: 'rooftop',
    unlockClueId: 'clue_peta_nusantara',
    autoNext: 'node_c6_04'
  },
  node_c6_04: {
    id: 'node_c6_04',
    speaker: 'Utusan Sindikat 9 Gerbang',
    speakerRole: 'Bayangan Misterius di Gerbang Sekolah',
    text: 'Di gerbang depan sekolah yang diselimuti kabut pagi, seorang pria berjas hitam dengan topi fedora dan pin lambang sembilan bintang merah berdiri menatap ke arah atap menara. Dia memutar cincin obsidian di jarinya, tersenyum dingin penuh teka-teki, lalu menghilang tanpa jejak di balik kabut tebal...',
    emotion: 'smirk',
    backgroundStyle: 'corridor',
    autoNext: 'node_c6_05'
  },
  node_c6_05: {
    id: 'node_c6_05',
    speaker: 'Renald, Maya, & Bagas',
    speakerRole: 'SUMPAH TRIO PENGUSIR ROH NUSANTARA',
    text: 'Kami bertiga berdiri di tepi atap menara lonceng, menatap matahari terbit di atas kota. Kami tahu, kutukan di SMA 7 Bhawana telah usai, namun perang sesungguhnya melawan Sindikat Sembilan Gerbang baru saja dimulai. \n\n“Ke mana pun mereka bersembunyi, kita akan buru mereka dan lindungi seluruh murid di negeri ini!”',
    emotion: 'determined',
    backgroundStyle: 'rooftop',
    choices: [
      { text: 'Tonton Pengumuman Season 2: Sindikat Sembilan Gerbang & Selesaikan Season 1', nextNodeId: 'node_c6_season2_teaser' }
    ]
  },
  node_c6_season2_teaser: {
    id: 'node_c6_season2_teaser',
    speaker: 'NARATOR TAKDIR (SEASON 2 RESMI DIMULAI)',
    speakerRole: 'KEMENANGAN SEASON 1 & SAMBUNGAN MENUJU SEASON 2',
    text: 'SELAMAT! KAU TELAH MENYELESAIKAN SELURUH SEASON 1: KUTUKAN KORIDOR BHAWANA 1998!\n\nKutukan di SMA 7 Bhawana telah dipatahkan, namun konspirasi Sindikat Sembilan Gerbang baru saja terkuak. Bersiaplah melangkah ke ibu kota untuk memburu pasak gerbang berikutnya!',
    emotion: 'determined',
    backgroundStyle: 'rooftop',
    choices: [
      { text: '🔥 Mulai Season 2 - Bab 1: Dekripsi Berkas Hitam & Markas Intelijen', nextNodeId: 'node_c7_01' }
    ]
  },

  // ==========================================
  // SEASON 2 - CHAPTER 7: SAFEHOUSE & DEKRIPSI BERKAS HITAM
  // ==========================================
  node_c7_01: {
    id: 'node_c7_01',
    speaker: 'Renald Suryakusuma',
    speakerRole: 'Pemimpin Trio Bhawana',
    text: 'Dua minggu setelah malam gerhana berdarah di SMA 7 Bhawana, kami mendirikan safehouse sementara di sebuah ruko tua peninggalan keluarga Suryakusuma di pinggiran kota. Di atas meja kerja, flash disk hitam berlumur abu Soedjarwo terhubung ke terminal forensik ghaib yang dirakit oleh Maya.',
    emotion: 'normal',
    backgroundStyle: 'corridor',
    choices: [
      { text: '“Maya, bagaimana proses dekripsi data memori Soedjarwo?”', nextNodeId: 'node_c7_02' },
      { text: '“Bagas, pastikan barikade jimat petir di jendela aman.”', nextNodeId: 'node_c7_02' }
    ]
  },
  node_c7_02: {
    id: 'node_c7_02',
    speaker: 'Maya Kirana',
    speakerRole: 'Analis Intelijen Ghaib',
    text: '“Berhasil! Firewall tingkat tiganya berhasil kutembus! Renald, Bagas... lihat dokumen ini! SMA Garuda Megantara di jantung Jakarta bukan sekadar sekolah elit internasional bertingkat 20. Di lantai 13 yang dirahasiakan, mereka menanam Pasak Gerbang Kedua untuk menyerap energi otak ribuan murid peraih medali olimpiade!”',
    emotion: 'shock',
    backgroundStyle: 'corridor',
    unlockClueId: 'clue_flashdisk_hitam',
    autoNext: 'node_c7_03'
  },
  node_c7_03: {
    id: 'node_c7_03',
    speaker: 'Panggilan Rahasia: Srikandi 07',
    speakerRole: 'Agen Intelijen Penyamar di SMA Megantara',
    text: 'KRESEK... BZZZZTTT! Layar monitor berkedip merah menampilkan rekaman darurat seorang siswi berseragam blazer abu-abu SMA Megantara: “Panggilan darurat untuk pembawa Garuda Hayam! Namaku Srikandi 07. Aku menyamar sebagai murid pertukaran di sini. Komandan Wira telah mengetahui markas kalian dan mengirim unit pembersih bayangan—awas jendela!!”',
    emotion: 'fear',
    backgroundStyle: 'corridor',
    autoNext: 'node_c7_ambush'
  },
  node_c7_ambush: {
    id: 'node_c7_ambush',
    speaker: 'Pengintai Bayangan Sindikat',
    speakerRole: 'Regu Pembunuh Elit Dewan Sembilan',
    text: 'PRAAANGGG!! Kaca jendela ruko pecah berhamburan dihantam peluru berenergi kutukan hitam! Sosok bayangan berkain kafan tak kasat mata dengan senapan laras panjang melayang masuk! “Trio ingusan dari Bhawana... kepala kalian bernilai 10 miliar Kristal Jiwa di hadapan Dewan Sembilan!!”',
    emotion: 'fear',
    backgroundStyle: 'corridor',
    triggerBattleEnemyId: 'shadow_scout',
    autoNext: 'node_c7_victory'
  },
  node_c7_victory: {
    id: 'node_c7_victory',
    speaker: 'Bagas Perkasa',
    speakerRole: 'Guntur Silat Bhawana',
    text: '“Hempasan Bharata Petir merontokkan zirah kamuflasenya! Lihat apa yang ada di koper taktisnya: Kartu akses magnetik lantai 13 dan denah arsitektur lengkap SMA Garuda Megantara!”',
    emotion: 'determined',
    backgroundStyle: 'corridor',
    unlockClueId: 'clue_peta_megantara',
    autoNext: 'node_c7_pack'
  },
  node_c7_pack: {
    id: 'node_c7_pack',
    speaker: 'Renald Suryakusuma',
    speakerRole: 'Pemimpin Trio Bhawana',
    text: 'Aku menyematkan kembali sarung tangan api Garuda Hayam. “Sindikat ini tidak akan berhenti sampai seluruh generasi muda negeri ini ditumbalkan. Kita berangkat ke Jakarta malam ini juga. Kita hancurkan Pasak Gerbang Kedua!”',
    emotion: 'determined',
    backgroundStyle: 'corridor',
    choices: [
      { text: 'Berangkat ke Jakarta & Infiltrasi SMA Garuda Megantara (Lanjut Bab 8)', nextNodeId: 'node_c8_01' }
    ]
  },

  // ==========================================
  // SEASON 2 - CHAPTER 8: INFILTRASI SMA GARUDA MEGANTARA
  // ==========================================
  node_c8_01: {
    id: 'node_c8_01',
    speaker: 'Renald Suryakusuma',
    speakerRole: 'Infiltrasi Megantara Lantai 13',
    text: 'Malam badai petir di atas langit Jakarta. Di hadapan kami berdiri megah menara pencakar langit kaca SMA Garuda Megantara. Dari luar terlihat seperti sekolah modern masa depan, namun di mata batin Garuda Hayam, pusaran kabut darah pekat berputar di sekitar atap lantai tiga belas.',
    emotion: 'normal',
    backgroundStyle: 'rooftop',
    choices: [
      { text: '“Maya, retas sistem pintu darurat menggunakan kartu akses Srikandi.”', nextNodeId: 'node_c8_02' },
      { text: '“Bagas, siapkan medan petir jika sistem keamanan otomatis bereaksi.”', nextNodeId: 'node_c8_02' }
    ]
  },
  node_c8_02: {
    id: 'node_c8_02',
    speaker: 'Maya Kirana',
    speakerRole: 'Wakil Ketua OSIS & Ahli Taktik',
    text: 'KLIK... Pintu geser pneumatik terbuka tanpa suara. Di dalam aula lantai 13 yang dingin mencekam, puluhan tabung silinder kaca berisi murid-murid berprestasi berjejer dalam keadaan tidur koma! Pipa-pipa cairan energi mengalir dari tabung menuju monolit hitam obsidian di tengah ruangan!',
    emotion: 'shock',
    backgroundStyle: 'boss_gate',
    autoNext: 'node_c8_03'
  },
  node_c8_03: {
    id: 'node_c8_03',
    speaker: 'Komandan Wira "Pedang Obsidian"',
    speakerRole: 'SEASON 2 CLIMAX - Penjaga Pasak Gerbang Kedua',
    text: 'KRAK... KRAK... Suara langkah sepatu besi bergema di lantai marmer hitam. Seorang pria tegap berjas taktis militer hitam dengan pedang obsidian berlumur kilat ungu melangkah dari balik pilar. \n\n“Suryakusuma kecil... Soedjarwo hanyalah anjing penjaga gerbang tua. Di Megantara inilah kami menciptakan tatanan dunia baru di bawah kehendak Dewan Sembilan! Pedangku haus akan darah keturunan pembawa Garuda!”',
    emotion: 'fear',
    backgroundStyle: 'boss_gate',
    triggerBattleEnemyId: 'boss_wira',
    autoNext: 'node_c8_climax'
  },
  node_c8_climax: {
    id: 'node_c8_climax',
    speaker: 'Trio Bhawana & Roh Leluhur',
    speakerRole: 'ULTIMATE SYNERGY EXORCISM',
    text: '“ES NYAI CANDRA KIRANA, BEKUKAN ALIRAN LISTRIKNYA! GUNTUR BHARATA PETIR, REMUKKAN KEPINGAN OBSIDIANNYA! DAN SAYAP HAYAM SANG SURYA, LEBURKAN PASAK TERKUTUK INI HINGGA KE AKAR-AKARNYA!!” Sebuah ledakan cahaya keemasan menyapu seluruh lantai 13, membelah pedang obsidian Wira menjadi dua bagian!',
    emotion: 'determined',
    backgroundStyle: 'boss_gate',
    autoNext: 'node_c8_victory'
  },
  node_c8_victory: {
    id: 'node_c8_victory',
    speaker: 'Komandan Wira "Pedang Obsidian"',
    speakerRole: 'Runtuhnya Penjaga Gerbang Kedua',
    text: 'Wira berlutut memuntahkan darah hitam, bilah pedangnya patah berdentang di lantai marmer. “Kkkhhh... luar biasa... kekuatan tiga roh bersatu... Tapi jangan berbangga diri! Pasak Gerbang Ketiga di SMA Watu Ireng lereng Gunung Merapi... dan Gerbang Keempat di Pulau Dewata... sudah mulai memanen jiwa! Ketua Dewan Sembilan... menunggumu di puncak takhta...!!” Wira mengaktifkan kristal teleportasi bayangan dan lenyap meninggalkan asap pekat.',
    emotion: 'shock',
    backgroundStyle: 'boss_gate',
    autoNext: 'node_c8_ending'
  },
  node_c8_ending: {
    id: 'node_c8_ending',
    speaker: 'Srikandi 07 & Trio Bhawana',
    speakerRole: 'ALIANSI BARU NUSANTARA BERKEMBANG',
    text: 'Tabung-tabung kaca retak terbuka, membebaskan ratusan murid yang tersadar dengan selamat. Seorang gadis berambut kuncir kuda berseragam Megantara melangkah mendekat sambil tersenyum bangga: “Kalian benar-benar membuktikannya, Trio Bhawana. Namaku Alika—agen sandi Srikandi 07. Sekarang aku resmi bergabung dengan kalian. Selanjutnya: Kita berangkat ke SMA Watu Ireng di lereng Gunung Merapi!” \n\n★★ BERSAMBUNG KE SEASON 2: BABAK GUNUNG MERAPI & LEMBAH KEMATIAN ★★',
    emotion: 'determined',
    backgroundStyle: 'rooftop'
  }
};
