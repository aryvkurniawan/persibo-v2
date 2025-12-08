import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DATA_DIR = join(__dirname, '../src/data');
const PUBLIC_DIR = join(__dirname, '../public');

// Load all data
const players = JSON.parse(readFileSync(join(DATA_DIR, 'players.json'), 'utf-8'));
const playerDetails = JSON.parse(readFileSync(join(DATA_DIR, 'playerDetails.json'), 'utf-8'));
const fixtures = JSON.parse(readFileSync(join(DATA_DIR, 'fixtures.json'), 'utf-8'));
const teams = JSON.parse(readFileSync(join(DATA_DIR, 'teams.json'), 'utf-8'));

// News articles (static pages)
const newsArticles = [
  {
    title: 'Siap Tempur di Solo! Persibo Bojonegoro Resmi Luncurkan Skuad dan Jersey Anyar Musim 2025-2026',
    description: 'Persibo Bojonegoro secara resmi memperkenalkan komposisi skuad dan jersey terbaru untuk Liga 3 Nusantara musim 2025-2026.',
    url: '/tim/berita/siap-tempur-solo-launching-skuad-jersey-2025',
    category: 'Berita',
    date: '2025-11-25'
  },
  {
    title: 'Bangkit! Persibo Raih Kemenangan Perdana di Liga 3, Tumbangkan Persikutim 2-1',
    description: 'Persibo Bojonegoro berhasil memetik kemenangan krusial di laga kedua Grup C Liga 3 Nusantara.',
    url: '/tim/berita/bangkit-persibo-raih-kemenangan-perdana-tumbangkan-persikutim',
    category: 'Berita',
    date: '2025-12-04'
  },
  {
    title: 'Pukulan Telak di Injury Time, Persibo Tumbang 0-1 dari RANS Nusantara FC di Laga Perdana',
    description: 'Langkah awal Persibo Bojonegoro di Liga 3 Nusantara 2025-2026 harus ternodai setelah menelan kekalahan pahit 0-1 dari RANS Nusantara FC.',
    url: '/tim/berita/pukulan-telak-injury-time-persibo-tumbang-rans',
    category: 'Berita',
    date: '2025-11-29'
  },
  {
    title: 'Drama Penalti Menit Akhir: Kilas Balik Persibo Bojonegoro Terdegradasi ke Liga 3',
    description: 'Kilas balik degradasi Persibo Bojonegoro dari Liga 2 ke Liga 3 Nusantara.',
    url: '/tim/berita/drama-penalti-degradasi-liga-2',
    category: 'Berita',
    date: '2025-02-28'
  }
];

// Build search index
const searchIndex = {
  players: players.map(player => {
    const detail = playerDetails.find(pd => pd.name === player.name);
    return {
      id: player.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, ''),
      title: detail?.full_name || player.name,
      subtitle: `${player.position} • ${player.age} tahun • ${player.country}`,
      description: `Pemain ${player.position} PERSIBO Bojonegoro`,
      url: `/pemain/${player.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '')}`,
      category: 'Pemain',
      searchText: `${player.name} ${detail?.full_name || ''} ${player.position} ${player.country} ${player.age}`.toLowerCase(),
      image: player.photo_url || null
    };
  }),
  
  news: newsArticles.map(article => ({
    id: article.url.split('/').pop(),
    title: article.title,
    subtitle: article.date,
    description: article.description,
    url: article.url,
    category: article.category,
    searchText: `${article.title} ${article.description}`.toLowerCase(),
    image: null
  })),
  
  matches: fixtures
    .filter(f => f.status === 'COMPLETED')
    .map(fixture => {
      const matchSlug = `${fixture.date}-${fixture.home_team.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '').substring(0, 20)}-vs-${fixture.away_team.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '').substring(0, 20)}`;
      return {
        id: matchSlug,
        title: `${fixture.home_team} vs ${fixture.away_team}`,
        subtitle: `${fixture.score} • ${fixture.date}`,
        description: `Pertandingan Liga Nusantara 2025-2026 di ${fixture.venue}`,
        url: `/pertandingan/${matchSlug}`,
        category: 'Pertandingan',
        searchText: `${fixture.home_team} ${fixture.away_team} ${fixture.venue} ${fixture.score} ${fixture.date}`.toLowerCase(),
        image: null
      };
    }),
  
  teams: teams.map(team => ({
    id: team.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, ''),
    title: team.name,
    subtitle: 'Tim Liga Nusantara',
    description: `Tim dari Liga Nusantara 2025-2026`,
    url: null, // Teams tidak punya detail page
    category: 'Tim',
    searchText: team.name.toLowerCase(),
    image: team.logo_url || null
  }))
};

// Write to public directory
writeFileSync(
  join(PUBLIC_DIR, 'search-index.json'),
  JSON.stringify(searchIndex, null, 2),
  'utf-8'
);

console.log('✅ Search index generated successfully!');
console.log(`   - Players: ${searchIndex.players.length}`);
console.log(`   - News: ${searchIndex.news.length}`);
console.log(`   - Matches: ${searchIndex.matches.length}`);
console.log(`   - Teams: ${searchIndex.teams.length}`);

