# Changelog

Semua perubahan penting pada proyek ini akan didokumentasikan dalam file ini.

Format berdasarkan [Keep a Changelog](https://keepachangelog.com/id/1.0.0/),
dan proyek ini mengikuti [Semantic Versioning](https://semver.org/lang/id/).

## [1.0.0] - 2025-12-05

### Added

#### Fitur Utama
- ✅ Setup proyek Astro dari scratch dengan Tailwind CSS dan TypeScript
- ✅ Integrasi data dari JSON files (players, officials, fixtures, standings, teams)
- ✅ Halaman homepage dengan hero section, timeline pertandingan, klasemen, top scorer, dan berita terbaru
- ✅ Halaman daftar pemain dengan search dan filter (posisi, usia, negara)
- ✅ Halaman detail pemain dengan informasi lengkap (foto, statistik, riwayat klub)
- ✅ Halaman jadwal & hasil pertandingan dengan tab switcher
- ✅ Halaman detail pertandingan dengan lineup, events timeline, dan statistik
- ✅ Halaman tim (profil, official, berita, galeri)
- ✅ Dynamic routes untuk pemain (`/pemain/[slug]`) dan pertandingan (`/pertandingan/[slug]`)

#### Komponen
- ✅ `Breadcrumb.astro` - Navigasi breadcrumb dengan JSON-LD schema
- ✅ `Lineup.astro` - Komponen untuk menampilkan lineup pertandingan
- ✅ `MatchCard.astro` - Card untuk menampilkan pertandingan
- ✅ `MatchTimelineCard.astro` - Card untuk timeline pertandingan di homepage
- ✅ `PlayerCard.astro` - Card untuk menampilkan pemain
- ✅ `StandingsTable.astro` - Tabel klasemen yang responsive

#### SEO & Analytics
- ✅ SEO Meta Tags lengkap (keywords, author, robots, language, revisit-after)
- ✅ Open Graph dan Twitter Card meta tags
- ✅ Canonical URL
- ✅ Structured Data (JSON-LD) untuk:
  - Organization
  - SportsTeam
  - Person (pemain)
  - NewsArticle
  - SportsEvent
  - FAQPage
  - BreadcrumbList
- ✅ Sitemap otomatis dengan `@astrojs/sitemap`
- ✅ Google Analytics (gtag.js) dengan ID `G-W843MTD8G4`
- ✅ Google AdSense integration

#### UI/UX
- ✅ Mobile-first responsive design
- ✅ Dark theme dengan Tailwind CSS
- ✅ Bottom navigation untuk navigasi mudah
- ✅ Scroll to top button
- ✅ Collapsible filters untuk pemain
- ✅ Tab switcher untuk jadwal/hasil pertandingan
- ✅ Quick jump links untuk klasemen grup
- ✅ Horizontal scroll untuk top players section
- ✅ Responsive tables untuk klasemen
- ✅ Intro text sections di berbagai halaman untuk SEO

#### Konten
- ✅ Artikel berita:
  - "Siap Tempur di Solo! Persibo Bojonegoro Resmi Luncurkan Skuad dan Jersey Anyar Musim 2025/2026"
  - "Pukulan Telak di Injury Time, Persibo Tumbang 0-1 dari RANS Nusantara FC di Laga Perdana"
  - "Bangkit Persibo Raih Kemenangan Perdana Tumbangkan Persikutim"
  - "Drama Penalti Degradasi Liga 2"
- ✅ Profil tim dengan FAQ section
- ✅ Credit "Jengker Proudly Present Persibo v2"
- ✅ Disclaimer "Unofficial" di halaman tim

#### Data Integration
- ✅ Loader functions untuk semua data types (`dataLoader.ts`)
- ✅ TypeScript types untuk semua data structures (`types.ts`)
- ✅ Support untuk match details (lineup, events, statistics)
- ✅ Support untuk player details dengan foto
- ✅ Support untuk team logos

### Changed

#### Homepage
- ✅ Hero section: Ganti background dengan `hero.jpg`, hapus logo dari tengah
- ✅ Intro text: Pindahkan dari atas ke bawah hero card
- ✅ Timeline pertandingan: 
  - Hapus badge menang/kalah/seri
  - Urutkan: pertandingan selanjutnya → hasil pertandingan terakhir
  - Layout vertikal (tim atas-bawah)
- ✅ Top Players: Horizontal scroll, sort berdasarkan club history terbanyak
- ✅ Berita Terbaru: Awalnya horizontal scroll, kemudian diubah ke single article full width

#### Halaman Pemain
- ✅ Ukuran foto pemain: Ditingkatkan untuk menampilkan kepala dan bagian bawah
- ✅ Filter & Search: Perbaikan JavaScript untuk menghindari syntax error

#### Halaman Pertandingan
- ✅ Match detail header: Responsive design untuk mobile
- ✅ Link detail: Internal link ke halaman detail pertandingan untuk match selesai

#### Klasemen
- ✅ Tabel klasemen: Refactor dari CSS grid ke HTML table dengan fixed column widths untuk alignment yang lebih baik

#### Layout
- ✅ Header: Ganti "Beranda Tim" menjadi "PERSIBO Bojonegoro" dengan logo
- ✅ Header notification button: Awalnya diubah ke dropdown menu, kemudian dihapus karena redundant dengan bottom navigation
- ✅ Footer: Tambahkan disclaimer "Unofficial" dengan styling elegan

### Fixed

- ✅ `GetStaticPathsRequired` error: Implementasi `getStaticPaths()` untuk semua dynamic routes
- ✅ JSON import issues: Perbaikan pattern import untuk JSON files
- ✅ Player detail pages not found: Enhanced `getStaticPaths()` untuk memastikan semua pemain memiliki halaman detail
- ✅ Fixtures JSON loading error: Re-format JSON dengan consistent indentation
- ✅ `@astrojs/sitemap` module not found: Install package dan update `package.json`
- ✅ Client-side JavaScript errors: Perbaikan TypeScript syntax di client-side scripts
- ✅ Match detail page generation error: Perbaikan variable reference (`f` → `fixture`)
- ✅ Sitemap generation: Troubleshooting dan verifikasi sitemap files di `dist` folder

### Technical Details

#### Dependencies
```json
{
  "dependencies": {
    "astro": "^4.15.0"
  },
  "devDependencies": {
    "@astrojs/sitemap": "^3.2.0",
    "@astrojs/tailwind": "^5.1.3",
    "tailwindcss": "^3.4.1"
  }
}
```

#### Configuration
- Site URL: `https://persibo.com`
- Sitemap: Enabled dengan default settings
- Tailwind: Dark mode enabled

#### Data Files
- `players.json` - Daftar pemain
- `playerDetails.json` - Detail pemain dengan foto
- `officials.json` - Official & staff dengan foto
- `fixtures.json` - Jadwal & hasil pertandingan
- `matchDetails.json` - Detail pertandingan (lineup, events, stats)
- `standings.json` - Klasemen Liga Nusantara 2025-26 Grup C
- `teams.json` - Informasi tim dengan logo

---

## [Unreleased]

### Planned
- [ ] Galeri foto/video
- [ ] Statistik lebih detail untuk pemain
- [ ] Grafik statistik pertandingan
- [ ] Share buttons untuk artikel
- [ ] Print-friendly styles
- [ ] PWA support
- [ ] Multi-language support (jika diperlukan)

---

**Catatan**: Semua perubahan mengikuti prinsip mobile-first design dan SEO best practices.
