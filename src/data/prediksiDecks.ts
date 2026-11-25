// Isi poster prediksi sosmed. Dipisah dari halaman karena getStaticPaths
// dievaluasi di luar scope frontmatter Astro.

export const decks = {
  gresik: {
    title: 'Poster prediksi Persibo vs Gresik United | PERSIBO',
    kicker: 'Matchday 3 · Minggu',
    day: '22',
    month: 'Nov',
    year: '2026',
    time: '15.30',
    venue: 'Letjen H. Soedirman',
    home: { name: 'Persibo', logo: '/logo.png' },
    away: { name: 'Gresik Utd', logo: '/img/teams/gresik-united-fc.png' },
    side: 'Kandang',
    score: '1 : 0',
    verdict: 'Persibo menang',
    alt: 'Skor 1-1 dan 2-0 juga mungkin',
    note: 'Analisis berdasarkan dua laga pertama, bukan hasil pertandingan',
    stats: {
      kicker: 'Dua laga pertama',
      heading: 'Perbandingan',
      left: 'Persibo',
      right: 'Gresik',
      rows: [
        { l: '1', r: '1', label: 'Gol', pct: 50 },
        { l: '6', r: '18', label: 'Tembakan tepat sasaran', pct: 25 },
        { l: '16,7%', r: '5,6%', label: 'Konversi gol', pct: 75 },
        { l: '48%', r: '55%', label: 'Penguasaan bola rata-rata', pct: 47 },
      ],
      callout:
        'Gresik melepas lebih banyak tembakan, tetapi Persibo lebih tajam. Enam tembakan tepat sudah cukup untuk satu gol.',
    },
    keys: {
      kicker: 'Supaya menang',
      heading: 'Kunci kemenangan',
      items: [
        {
          title: 'Tekan lini tengah',
          body: 'Gresik menguasai bola 52% dan 58% di dua laga. Potong aliran bola sebelum masuk ke area berbahaya.',
        },
        {
          title: 'Perbanyak tembakan tepat',
          body: 'Persibo hanya menghasilkan dua tembakan tepat ke Persipa. Target lima sampai enam kali.',
        },
        {
          title: 'Jaga fokus sampai akhir',
          body: 'Dua kebobolan terjadi di menit 90+3 dan 90+4. Jangan mundur terlalu dalam di menit 80 ke atas.',
        },
      ],
      riskLabel: 'Risikonya',
      risk: 'Kalau masih 0-0 sampai menit 75, Gresik punya bukti bisa mencetak gol di menit 78.',
    },
  },
  psf: {
    title: 'Poster prediksi Putra Sang Fajar vs Persibo | PERSIBO',
    kicker: 'Matchday 4 · Kamis',
    day: '26',
    month: 'Nov',
    year: '2026',
    time: '15.30',
    venue: 'Gelora Soepriadi',
    home: { name: 'Putra Sang Fajar', logo: '/img/teams/putra-sang-fajar-fc.png' },
    away: { name: 'Persibo', logo: '/logo.png' },
    side: 'Tandang',
    score: '1 : 1',
    verdict: 'Persibo mencuri poin',
    alt: 'Skor 1-0 PSF dan 1-2 Persibo juga mungkin',
    note: 'Analisis berdasarkan tiga laga, bukan hasil pertandingan',
    stats: {
      kicker: 'Tiga laga pertama',
      heading: 'Perbandingan',
      left: 'Persibo',
      right: 'PSF',
      rows: [
        { l: '2', r: '9', label: 'Poin', pct: 18 },
        { l: '0', r: '3', label: 'Kemenangan', pct: 4 },
        { l: '2', r: '5', label: 'Gol', pct: 29 },
        { l: '6', r: '8', label: 'Kartu kuning', pct: 43 },
      ],
      callout:
        'PSF belum pernah tertinggal di tiga laga. Empat dari lima gol mereka lahir dari Johan Yoga Utama.',
    },
    keys: {
      kicker: 'Modal Persibo',
      heading: 'Kunci pertandingan',
      items: [
        {
          title: 'Jaga Johan Yoga Utama',
          body: 'Empat dari lima gol PSF miliknya, dua lewat penalti. Jangan beri ruang di kotak dan jangan melanggar di area.',
        },
        {
          title: 'Cetak lebih dulu',
          body: 'PSF belum pernah tertinggal. Di Persinga mereka disamakan menit 56, lalu tetap menang lewat gol menit 86.',
        },
        {
          title: 'Manfaatkan kartu',
          body: 'Delapan kartu kuning dalam dua laga PSF. Pemain yang sudah berkartu bisa terus ditekan.',
        },
      ],
      riskLabel: 'Risikonya',
      risk: 'Persibo kebobolan di menit 88 dan 90+4. Fokus sampai peluit akhir tetap wajib.',
    },
  },
} as const;

export type DeckSlug = keyof typeof decks;
