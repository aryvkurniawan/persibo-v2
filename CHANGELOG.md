# Changelog

Semua perubahan penting pada proyek ini akan didokumentasikan dalam file ini.

Format berdasarkan [Keep a Changelog](https://keepachangelog.com/id/1.0.0/),
dan proyek ini mengikuti [Semantic Versioning](https://semver.org/lang/id/).

## [Unreleased]

### Changed
- Seluruh halaman memakai satu bahasa desain "broadcast" dari homepage: judul `font-cond` uppercase, panel kotak `bg-[#0c0b0f]` + `border-white/12`, aksen oranye, tanpa sudut membulat.
- `PageHeader.astro` baru sebagai header halaman bersama (label, judul, meta, deskripsi).
- `StandingsTable`, `MatchCard`, `PlayerCard`, `Lineup`, `FilterBar`, `SearchBar`, `Breadcrumb`, `ShareButtons`, `TopPerformers`, `PlayerStatsChart` dirombak mengikuti token tersebut.
- Halaman pertandingan tidak lagi memakai tab Hasil/Jadwal: kedua bagian ditampilkan berurutan.
- Daftar berita kini data-driven (array `articles`), bukan markup duplikat per artikel.
- Profil tim disusun ulang: grid dua kolom, panel prestasi di sidebar, FAQ memakai data yang sama dengan JSON-LD.

### Removed
- `MatchTimelineCard.astro` (tidak dipakai halaman mana pun).
- Filter pemain duplikat: satu panel filter dipakai untuk mobile dan desktop.

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

## [1.0.1] - 2025-12-05

### Fixed

#### SEO & Schema Improvements
- ✅ **Organization Schema**: Menambahkan `streetAddress` ("JL. UNTUNG SUROPATI NO. 39") dan `postalCode` ("62115") ke schema Organization di `Layout.astro` dan `tim/profil.astro`
- ✅ **NewsArticle Schema**: Memperbaiki format `datePublished` dan `dateModified` dari format tanggal (`2025-12-04`) ke format ISO 8601 dengan timezone (`2025-12-04T00:00:00+07:00`) untuk validitas schema.org
- ✅ **NewsArticle Author**: Menambahkan property `url` ke schema Organization author untuk semua artikel berita
- ✅ **Artikel berita yang diperbaiki**:
  - `bangkit-persibo-raih-kemenangan-perdana-tumbangkan-persikutim.astro`
  - `siap-tempur-solo-launching-skuad-jersey-2025.astro`
  - `pukulan-telak-injury-time-persibo-tumbang-rans.astro`
  - `drama-penalti-degradasi-liga-2.astro`

#### UI/UX Fixes
- ✅ **Halaman Pertandingan (Production)**: Memperbaiki masalah link jadwal yang tidak bisa diklik di production dengan:
  - Menambahkan `is:inline` pada script tab switcher untuk memastikan script berjalan di production
  - Menggunakan IIFE (Immediately Invoked Function Expression) untuk menghindari konflik scope
  - Menambahkan `pointer-events: auto` dan `z-index` pada `MatchCard` component untuk memastikan link dapat diklik
  - Menambahkan `cursor-pointer` dan `relative z-10` pada semua link di `MatchCard`

---

## [1.0.2] - 2025-12-06

### Added

#### Desktop Design Enhancements
- ✅ **Desktop Top Navigation**: Menambahkan top navigation bar untuk desktop dengan menu horizontal (Beranda, Jadwal, Klasemen, Pemain, Tim)
- ✅ **Hybrid Navigation**: Top nav untuk desktop, bottom nav untuk mobile
- ✅ **Desktop Header**: Menambahkan header dengan page title untuk desktop
- ✅ **Footer Desktop**: Menambahkan footer dengan credit "Jengker Proudly Present Persibo v2" dan disclaimer "Website Unofficial"
- ✅ **Container Max-Width**: Semua halaman utama menggunakan `max-w-7xl mx-auto` untuk konsistensi layout desktop

#### Layout Improvements
- ✅ **Homepage Desktop**: 
  - Grid layout 3 kolom (2 kolom konten utama + 1 kolom sidebar)
  - Timeline pertandingan: Grid 2-3 kolom di desktop
  - Top Players: Grid 2-4 kolom di desktop
  - Berita Terbaru: Grid 3 kolom di desktop, horizontal scroll di mobile
- ✅ **Halaman Pertandingan Desktop**: Grid 2 kolom untuk match cards
- ✅ **Halaman Klasemen Desktop**: Optimasi spacing dan font sizes untuk desktop
- ✅ **Halaman Tim Desktop**: 
  - Grid 2 kolom untuk menu tim
  - Grid 3 kolom untuk official/staff
  - Grid 2 kolom untuk berita list
- ✅ **Detail Pertandingan Desktop**: Optimasi layout lineups dan statistics

### Changed

#### Player Detail Page
- ✅ **Layout Desktop**: Restrukturisasi layout menjadi foto di kiri (350px fixed width, sticky) dan semua info di kanan dalam satu kolom
- ✅ **Foto Portrait**: Perbaikan aspect ratio (`aspect-[3/4]` mobile, `aspect-[2/3]` desktop) dengan `max-w-sm lg:max-w-md` dan `object-center` untuk foto portrait yang lebih optimal
- ✅ **Stats Grid**: Grid 2x2 di mobile, 4 kolom di desktop
- ✅ **Mobile Layout**: Foto tetap di atas untuk mobile-first approach

#### Homepage
- ✅ **Berita Terbaru**: 
  - Tampilkan 3 artikel (sebelumnya hanya 1)
  - Mobile: Horizontal scroll dengan `overflow-x-auto`
  - Desktop: Grid 3 kolom
- ✅ **Top Players**: Filter hanya menampilkan pemain dengan umur > 28 tahun

#### Components
- ✅ **MatchCard**: Optimasi spacing dan hover effects untuk desktop
- ✅ **PlayerCard**: Optimasi spacing dan hover effects untuk desktop dengan scale transform
- ✅ **StandingsTable**: Perbaikan column widths dan spacing untuk desktop

### Technical Details

#### Breakpoints
- Mobile: default (< 640px)
- Tablet: `md:` (≥ 768px)
- Desktop: `lg:` (≥ 1024px)
- Large Desktop: `xl:` (≥ 1280px)

#### CSS Grid Layouts
- Homepage: `lg:grid lg:grid-cols-3` untuk main content area
- Match Cards: `lg:grid lg:grid-cols-2`
- Player Cards: `lg:grid lg:grid-cols-2 xl:grid-cols-3` atau `lg:grid-cols-4`
- News Articles: `lg:grid lg:grid-cols-2` atau `lg:grid-cols-3`
- Player Detail: `lg:grid lg:grid-cols-[350px_1fr]` (foto fixed width + flexible content)

---

## [1.0.4] - 2025-12-06

### Changed

#### SEO Optimization
- ✅ **Konsistensi Penulisan Tahun**: Mengubah semua instance "2025-26" dan "2025/2026" menjadi "2025-2026" (format lengkap) untuk optimasi SEO yang lebih baik
  - Meta descriptions (semua halaman)
  - Page titles
  - Headings (H1, H2)
  - Konten artikel dan preview
  - Alt text gambar
  - Schema markup (JSON-LD)
  - Keywords meta tag
- ✅ **Manfaat SEO**: Format lengkap "2025-2026" lebih eksplisit, deskriptif, dan optimal untuk long-tail keywords

#### Homepage Image Optimization
- ✅ **Gambar Berita & Hero**: Menambahkan atribut optimasi (`decoding="async"`, width/height eksplisit) untuk semua gambar di homepage
  - Hero image: `1600x900` dengan `decoding="async"`
  - Gambar berita artikel: `1200x600` dengan `decoding="async"`
  - Sakpole image: `1600` width dengan `decoding="async"`

#### Player List Page
- ✅ **Grid Layout**: 
  - Mobile: 1 kolom
  - Tablet: 2 kolom
  - Desktop: 3 kolom (dengan sidebar filter)
  - Menghapus `xl:grid-cols-4` untuk konsistensi 3 kolom di semua ukuran desktop
- ✅ **Nama Pemain**: Perbaikan truncate menjadi `line-clamp-2` agar nama panjang tidak terpotong seperti "ikhs..." dan bisa wrap ke 2 baris dengan `leading-tight`

### Fixed

- ✅ **Build Errors**: Perbaikan missing imports untuk `optimizeTeamLogo` dan `optimizePlayerPhoto` di beberapa halaman

---

## [1.0.3] - 2025-12-06

### Added

#### Image Optimization
- ✅ **Weserv.nl Integration**: Implementasi optimasi gambar eksternal menggunakan weserv.nl proxy untuk gambar dari ileague.id dan ligaindonesiabaru.com
- ✅ **Utility Functions**: 
  - `optimizeImage()` - Fungsi utama untuk optimasi gambar eksternal dengan WebP conversion
  - `optimizePlayerPhoto()` - Optimasi foto pemain (small/medium/large sizes)
  - `optimizeTeamLogo()` - Optimasi logo tim dengan retina display support (2x resolution)
- ✅ **Auto Format Detection**: WebP conversion otomatis untuk browser yang support
- ✅ **Smart Cropping**: Enable smart crop untuk foto pemain portrait

### Changed

#### Player Detail Page
- ✅ **Layout Desktop**: Restrukturisasi layout menjadi foto portrait di kiri (350px fixed width, sticky) dan semua info di kanan dalam satu kolom
- ✅ **Foto Portrait**: Perbaikan aspect ratio dan positioning (`aspect-[3/4]` mobile, `aspect-[2/3]` desktop) dengan `object-center` untuk foto portrait yang lebih optimal
- ✅ **Foto Mobile**: Tetap di atas dengan layout centered untuk mobile-first approach

#### Player List Page
- ✅ **Grid Layout**: 
  - Mobile: 1 kolom
  - Tablet: 2 kolom
  - Desktop: 3 kolom (dengan sidebar filter)
- ✅ **Nama Pemain**: Perbaikan truncate menjadi `line-clamp-2` agar nama panjang tidak terpotong seperti "ikhs..." dan bisa wrap ke 2 baris

#### Homepage
- ✅ **Berita Terbaru**: 
  - Tampilkan 3 artikel (sebelumnya hanya 1-2)
  - Mobile: Horizontal scroll dengan `overflow-x-auto`
  - Desktop: Grid 3 kolom
- ✅ **Top Players**: Filter hanya menampilkan pemain dengan umur > 28 tahun

#### Layout & Navigation
- ✅ **Desktop Header**: Menghapus header desktop yang redundan (karena sudah ada top navigation bar)
- ✅ **Halaman Berita**: 
  - Perbaikan layout header (back button hidden di desktop)
  - Perbaikan positioning artikel dengan `relative` positioning untuk judul yang benar
- ✅ **Footer Desktop**: Desain footer baru dengan:
  - Grid 4 kolom (Logo & Brand, Navigasi, Informasi, Tautan)
  - Credit "Jengker Proudly Present Persibo v2"
  - Disclaimer badge dan text

#### Components
- ✅ **PlayerCard**: 
  - Nama menggunakan `line-clamp-2` untuk wrap 2 baris
  - Optimasi gambar eksternal dengan weserv.nl
- ✅ **Lineup**: 
  - Filter validasi player yang lebih ketat untuk menghapus data tidak valid:
    - Name harus mengandung minimal 1 huruf
    - Tidak boleh hanya angka/spaces
    - Tidak boleh dimulai dengan angka
    - Panjang name 3-50 karakter
    - Jersey number 1-99
- ✅ **MatchCard**: Optimasi logo tim eksternal dengan weserv.nl
- ✅ **StandingsTable**: Optimasi logo tim eksternal dengan weserv.nl
- ✅ **MatchTimelineCard**: Optimasi logo tim eksternal dengan weserv.nl
- ✅ **Official Cards**: Optimasi foto official eksternal dengan weserv.nl

### Fixed

#### Build Errors
- ✅ **Missing Imports**: Menambahkan import `optimizeTeamLogo` dan `optimizePlayerPhoto` yang hilang di beberapa halaman
  - `pertandingan/[slug].astro` - Import optimizeTeamLogo
  - `tim/official.astro` - Import optimizePlayerPhoto

#### Data Validation
- ✅ **Lineup Data**: Filter yang lebih ketat untuk menghapus entry dengan name tidak valid (angka panjang, gabungan banyak nama tanpa separator)

### Technical Details

#### Image Optimization Strategy
- **Local Images**: Tetap menggunakan Astro Image Optimization (sharp) untuk gambar lokal
- **External Images**: Otomatis dioptimasi via weserv.nl dengan:
  - WebP format conversion
  - Quality: 85% untuk foto, 90% untuk logo
  - Smart cropping enabled
  - Retina-ready (2x resolution untuk logo)
  - Auto format detection (WebP when supported)

#### Grid Layouts Updated
- Player List: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- Official List: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- News Articles: `grid-cols-1 lg:grid-cols-3` (homepage), `grid-cols-1 lg:grid-cols-2` (berita page)

---

## [1.0.6] - 2025-01-06

### Added

#### Share Buttons
- ✅ **Native Web Share API**: Support untuk mobile devices dengan fallback ke custom buttons
- ✅ **Custom Share Buttons**: WhatsApp, Facebook, Twitter/X, Telegram, dan Copy Link untuk desktop
- ✅ **Visual Feedback**: Toast notification saat link berhasil di-copy
- ✅ **Komponen ShareButtons.astro**: Reusable component untuk semua halaman
- ✅ **Integrated**: Di halaman player detail, match detail, dan news articles

#### Pencarian Global (Global Search)
- ✅ **Search Bar**: Integrated di header desktop dan mobile
- ✅ **Cross-page Search**: Mencari players, news, matches, dan teams
- ✅ **Autocomplete**: Dropdown results dengan kategori
- ✅ **Search Results**: 
  - Grouped by category (Pemain, Berita, Pertandingan, Tim)
  - Highlight search terms
  - Thumbnail images untuk setiap result
  - Link ke halaman detail
- ✅ **Search Index Generation**: Script `scripts/generate-search-index.js` untuk generate index dari semua data
- ✅ **Performance**: 
  - Debounced search (300ms delay)
  - Shared search index untuk multiple instances
  - Client-side fuzzy search algorithm

#### Components
- ✅ **GlobalSearch.astro**: Komponen baru untuk global search dengan support multiple instances
- ✅ **Layout.astro**: Integrated GlobalSearch di desktop dan mobile header

### Technical

- ✅ **Multiple Search Instances**: Support untuk desktop dan mobile dengan unique IDs menggunakan data attributes
- ✅ **Shared State**: Search index menggunakan window object untuk menghindari duplicate declarations
- ✅ **Search Index**: Disimpan di `/public/search-index.json` yang di-generate saat build
- ✅ **Data Attributes**: Menggunakan data attributes instead of IDs untuk menghindari conflicts

## [1.0.5] - 2025-12-06

### Added

#### Statistik Pemain Lebih Detail
- ✅ **Grafik Statistik Per Musim**: 
  - Line chart interaktif menampilkan perkembangan statistik pemain per tahun
  - Dataset: Main, Gol, dan Saves (untuk kiper)
  - Theme gelap yang konsisten dengan design system
  - Interactive tooltips dengan informasi lengkap
  - Menggunakan Chart.js 4.4.0 via CDN (UMD build)
- ✅ **Total Karir**: 
  - Perhitungan total statistik dari semua musim (club_history)
  - Menampilkan: Total Main, Total Gol, Total Saves (kiper), Total Kartu Kuning, Total Kartu Merah
  - Layout grid responsif
- ✅ **Statistik Lebih Lengkap**:
  - Rata-rata gol per main
  - Rata-rata saves per main (untuk kiper)
  - Total karir vs statistik musim saat ini
  - Breakdown kartu (kuning dan merah)
- ✅ **Perbandingan dengan Pemain Lain**:
  - Top Scorer: Top 5 pemain berdasarkan total gol
  - Most Appearances: Top 5 pemain berdasarkan total main
  - Top Goalkeeper: Top 5 kiper berdasarkan total saves
  - Progress bar visualisasi perbandingan
  - Highlight pemain saat ini dengan badge peringkat
  - Link ke profil pemain lain untuk perbandingan

#### Components
- ✅ **PlayerStatsChart.astro**: Komponen baru untuk visualisasi grafik statistik per musim
- ✅ **TopPerformers.astro**: Komponen baru untuk perbandingan statistik dengan pemain lain
- ✅ **PlayerDetail.astro**: Enhanced dengan:
  - Statistik tambahan (assists, saves untuk kiper, breakdown kartu)
  - Integrasi chart statistik per musim
  - Integrasi top performers comparison
  - Penyesuaian otomatis untuk kiper (menampilkan saves bukan assist)

### Changed

#### Player Detail Page
- ✅ **Stats Cards**: 
  - Statistik utama (Main, Gol, Assist/Saves, Kartu) dengan total karir di bawah
  - Row tambahan untuk statistik rata-rata dan total karir
  - Penyesuaian warna untuk highlight (primary, accent-teal, yellow, red)
- ✅ **Club History**: 
  - Menampilkan saves untuk kiper di setiap musim
  - Layout yang lebih informatif

#### Data Processing
- ✅ **Chart Data Parsing**:
  - Filter dan validasi tahun (2010-2030)
  - Perbaikan typo "20225" menjadi "2025"
  - Sorting berdasarkan tahun (terlama ke terbaru)
  - Handling data kosong atau tidak valid

### Fixed

#### Chart.js Integration
- ✅ **Chart Loading**: Menggunakan UMD build Chart.js via script tag untuk kompatibilitas lebih baik
- ✅ **Script Execution**: Perbaikan timing untuk memastikan canvas sudah ter-render sebelum chart initialization
- ✅ **Error Handling**: Penanganan error yang lebih baik untuk loading Chart.js dan parsing data

### Technical Details

#### Chart Implementation
- **Library**: Chart.js 4.4.0 via CDN (UMD build)
- **Loading Strategy**: Lazy load via script tag dengan check untuk avoid double loading
- **Data Storage**: Menggunakan data attributes pada canvas element untuk pass data ke client script
- **Initialization**: DOMContentLoaded + delay untuk memastikan komponen sudah ter-render
- **Chart Type**: Line chart dengan multiple datasets
- **Styling**: Custom dark theme yang konsisten dengan design system

#### Performance
- Chart.js di-load hanya saat diperlukan (lazy loading)
- Script execution dengan proper timing untuk avoid blocking
- Error handling untuk graceful degradation jika Chart.js gagal load

---

## [1.0.7] - 2025-12-08

### Added

#### Konten
- ✅ **Artikel Berita Baru**: "Persibo Bojonegoro Lawan Persika Karanganyar Jumat 12 Desember" - Preview pertandingan Liga 3 Nusantara 2025-2026

#### Performance Optimization
- ✅ **Google Tag Manager Optimization**: Load on user interaction (click, scroll, touch, keydown) untuk mengurangi unused JavaScript (~55.4 KiB savings)
- ✅ **Chart.js Lazy Loading**: Menggunakan Intersection Observer untuk load Chart.js hanya saat chart terlihat di viewport
- ✅ **CSS Optimization**: 
  - `cssCodeSplit: false` untuk mengurangi dependency chain
  - `manualChunks: undefined` untuk mencegah chunk splitting yang tidak perlu
- ✅ **Rocket Loader Prevention**: 
  - Meta tags untuk disable Cloudflare Rocket Loader
  - Script prevention untuk mencegah Rocket Loader memblokir rendering
  - `data-cfasync="false"` pada AdSense script
- ✅ **Resource Hints**: DNS prefetch untuk cdn.jsdelivr.net (Chart.js CDN)

### Changed

#### Homepage
- ✅ **Berita Terbaru**: Menampilkan 3 artikel terbaru (artikel baru ditambahkan di posisi pertama)

#### Player Detail Page
- ✅ **TopPerformers Component**: Mengganti `full_name` menjadi `name` untuk menampilkan nama pemain yang benar

#### Player List Page
- ✅ **Script Structure**: Perbaikan indentasi dan struktur function untuk menghindari syntax error

### Fixed

- ✅ **TopPerformers Data**: Perbaikan tampilan nama pemain yang sebelumnya menampilkan data salah
- ✅ **Player List Script**: Perbaikan syntax error di `pemain/index.astro` dengan struktur function yang benar
- ✅ **Search & Filter**: Perbaikan script dengan `is:inline` untuk memastikan berfungsi di production

### Technical Details

#### Performance Improvements
- **GTM Loading Strategy**: Load setelah user interaction atau fallback 5 detik untuk memastikan analytics tetap berfungsi
- **Chart.js Loading**: Intersection Observer dengan `rootMargin: '50px'` untuk preload sebelum chart terlihat
- **CSS Build**: Single CSS bundle untuk mengurangi network dependency chain
- **Rocket Loader**: Multiple prevention methods untuk memastikan tidak memblokir rendering

---

## [Unreleased]

### Planned
- [ ] Galeri foto/video
- [ ] Grafik statistik pertandingan
- [ ] Print-friendly styles
- [ ] PWA support
- [ ] Multi-language support (jika diperlukan)

---

**Catatan**: Semua perubahan mengikuti prinsip mobile-first design dan SEO best practices.
