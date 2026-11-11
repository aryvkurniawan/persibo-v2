# AGENT.md - Dokumentasi untuk AI Agent

Dokumentasi ini dibuat untuk membantu AI agent memahami konteks, struktur, dan konvensi proyek PERSIBO Bojonegoro Website.

## 📋 Konteks Proyek

**Nama Proyek:** PERSIBO Bojonegoro - Website Unofficial  
**Teknologi:** Astro 7.4.1 + Tailwind CSS + TypeScript  
**Tujuan:** Website unofficial untuk menyediakan informasi lengkap tentang tim sepak bola PERSIBO Bojonegoro yang berlaga di Liga Nusantara 2026-27  
**Target Audience:** Penggemar dan masyarakat Bojonegoro (mobile-first design)  
**Domain:** https://persibo.com
**Musim:** aktif `2026-27` (`CURRENT_SEASON`); beku `2025-26` (`ARCHIVE_SEASON`) dan `2024-25`
**Status:** Website UNOFFICIAL - tidak berafiliasi dengan manajemen resmi

## 🏗️ Arsitektur Proyek

### Struktur Folder

```
persibo/
├── public/              # img/, video/, search-index.json, logo, favicon
├── scripts/             # Tooling: build, optimize-images, sosmed, fetch-assets
├── social/              # posts.json + out/*.png (bahan poster, di-commit)
├── docs/agents/         # Konfigurasi skill engineering
├── .scratch/            # Scraper Python + dump HTML/JSON (bukan sumber data)
├── src/
│   ├── components/     # Komponen Astro reusable
│   ├── data/           # Data JSON (players, fixtures, standings, dll)
│   ├── layouts/        # Layout templates
│   ├── pages/          # Halaman website (file-based routing)
│   ├── styles/         # global.css (Tailwind + font)
│   ├── types.ts        # TypeScript type definitions
│   └── utils/          # dataLoader, dates, matchTimeline, slugify
├── astro.config.mjs    # Konfigurasi Astro
├── postcss.config.mjs  # Tailwind + autoprefixer
├── package.json
├── tailwind.config.mjs
└── tsconfig.json
```

### Teknologi Stack

- **Astro 7.4.1** - Static Site Generator
- **Tailwind CSS 3.4** - Utility-first CSS framework (via PostCSS, `postcss.config.mjs`)
- **TypeScript** - Type safety
- **@astrojs/sitemap 3.7.4** - Sitemap generation
- **autoprefixer** - CSS vendor prefixes
- **sharp** image service Astro + `scripts/optimize-images.js`
- **terser** - minify JS produksi
- **playwright-core** - screenshot poster sosmed

## 📊 Data Structure

### Data Files (src/data/)

Semua data disimpan dalam format JSON dan di-load menggunakan `dataLoader.ts`.

Data per musim ada di `src/data/seasons/<musim>/`:

1. **standings.json** - Klasemen
2. **fixtures.json** - Jadwal & hasil pertandingan
3. **teams.json** - Informasi tim dengan logo
4. **matchDetails.json** - Detail pertandingan (lineup, events, statistics); laga uji coba ada di `friendlies.json`, hanya musim 2026-27.

Data skuad (players.json & officials.json = musim aktif 2026-27; playerDetails/faces = lintas musim):

5. **players.json** - Daftar pemain (basic info)
6. **playerDetails.json** - Detail lengkap pemain (statistik, club history, foto)
7. **officials.json** - Official & staff tim
8. **players/faces.json** - Wajah pemain per musim (halaman arsip)
9. **history.json** / **historyStandings.json** - Arsip pra-2024-25 (RSSSF)
10. **social.json** - Link sosmed footer; **assets-manifest.json** - asal gambar hasil `fetch-assets`

`src/data/fixtures.json`, `standings.json`, `teams.json`, `matchDetails.json`, `matches.json`
adalah sisa struktur lama: tidak diimpor siapa pun lagi. Jangan dipakai atau diperbarui.

`2025-26` dan `2024-25` adalah arsip beku; `2026-27` aktif. Jangan timpa arsip saat scraping.

Scraper (`.scratch/scrape_ileague.py`) menolak menulis ke musim yang filenya sudah ada
kecuali dijalankan dengan `--force`. Arsip juga di-tag git: `archive/2025-26-final`.
Kalau arsip terlanjur tertimpa, pulihkan dengan:

```bash
git checkout archive/2025-26-final -- src/data/seasons/2025-26
```

Detail pertandingan 2025-26 punya scraper sendiri, `.scratch/scrape_ileague_2025_26.py`
(menolak menimpa tanpa `--force`). Arsip 2024-25 punya `scrape_ileague_2024_25.py` (detail) dan
`scrape_ileague_2024_25_players.py` (skuad); arsip pra-2024-25 dari `scrape_history_rsssf.py`. Scraper 2025-26 memakai parser 2024-25 untuk lineup/pelatih/wasit,
lalu menambal tiga hal yang beda di musim itu: gol & kartu dibaca dari blok hero karena
tab Linimasa kosong, label wasit "Cadangan Wasit"/"Asisten Wasit 2" ikut dipetakan, dan
statistik yang tidak pernah terbit dibuang (bukan ditulis nol).

Endpoint iLeague yang dipakai scraper (`/embed/klasemen/...`, `/table/index/...`,
`/clubs/single/...`) tetap sama antar musim; halaman `/table/embed/<KOMPETISI>`
hanya membungkus endpoint tersebut lewat `<iframe>`.

### Type Definitions (src/types.ts)

**Key Interfaces:**
- `Player` - Basic player info
- `PlayerDetail` - Extended player info dengan statistik dan club history
- `Official` - Official & staff info
- `Fixture` - Match schedule/result
- `MatchDetail` - Detailed match info (lineup, events, stats)
- `Standing` - League standings
- `Team` - Team information dengan logo
- `MatchDetailPlayer`, `MatchDetailLineup`, `MatchDetailEvent` - Bagian `MatchDetail`
- `Friendly`, `FriendlyScorer`, `FriendlySource` - Laga uji coba (`friendlies.json`)

**Penting:** Selalu gunakan types dari `src/types.ts` untuk type safety.

## 🔧 Utility Functions (src/utils/dataLoader.ts)

### Data Loading Functions
- `loadOfficials()` - Load officials data
- `loadPlayers()` - Load players data
- `loadPlayerDetails()` - Load player details
- `loadStandings(season?)` - Load standings (default `CURRENT_SEASON`)
- `loadFixtures(season?)` - Load fixtures
- `loadMatchDetails(season?)` - Load match details
- `loadTeams(season?)` - Load teams
- `loadFriendlies(season?)` - Load laga uji coba (`friendlies.json`, hanya `2026-27`)

### Helper Functions
- `getPlayerBySlug()` - Find player by slug
- `getPlayerPhoto()` - Foto pemain dari `players/faces.json`
- `localLogoFor()` - Logo tim dari `public/img` (fallback hotlink iLeague)
- `getPlayerDetailWithPhoto()` - Merge player detail dengan photo dari players.json
- `getPersiboStanding()` - Get PERSIBO standing
- `getStandingsByGroup()` - Filter standings by group
- `getCompletedFixtures()` - Filter completed matches
- `getScheduledFixtures()` - Filter scheduled matches
- `getTeamLogo()` - Get team logo dengan name matching logic
- `getMatchDetailByUrl()` - Find match detail by match_url
- `getMatchDetailSlug()` - Generate slug untuk match detail page

**Catatan:** Loader memakai static import JSON per musim di `dataLoader.ts` (bukan dynamic import). Tambah musim baru dengan menambah import dan entri di objek `SEASONS`, plus perluas tipe `Season`. Konstanta: `CURRENT_SEASON` = `'2026-27'`, `ARCHIVE_SEASON` = `'2025-26'`.

Utility lain: `dates.ts` (format tanggal/waktu), `matchTimeline.ts` (normalisasi event laga), `slugify.ts` (slug pemain/laga).

## 🎨 Komponen (src/components/)

### Komponen yang Tersedia

- **Kerangka:** `PageHeader` (judul halaman), `Breadcrumb` (+ JSON-LD BreadcrumbList)
- **Laga:** `MatchCard`, `LastMatchCard`, `MatchPreviewPanel`, `MatchTimeline`, `Lineup`, `LineupPitch`, `FriendlyMatches`
- **Pemain:** `PlayerTable`, `PlayerDetail`, `PlayerStatsChart`, `TopPerformers`
- **Klasemen:** `StandingsTable`
- **Navigasi/filter:** `GlobalSearch`, `SearchBar`, `FilterBar`
- **Lain:** `ShareButtons` (native, WhatsApp, Facebook, X, Telegram, salin link)

### Konvensi Komponen

- Semua komponen menggunakan `.astro` extension
- Props didefinisikan di frontmatter dengan TypeScript interface
- Styling menggunakan Tailwind CSS classes
- Dark theme (class="dark" di html tag)
- Mobile-first responsive design

## 📄 Halaman (src/pages/)

### Static Pages
- `index.astro` - Homepage
- `klasemen.astro` - Klasemen page
- `tim/index.astro` - Tim menu page
- `tim/profil.astro` - Profil tim dengan FAQ
- `tim/official.astro` - Official & staff
- `tim/berita.astro` - Daftar berita
- `pemain/index.astro` - Daftar pemain dengan search & filter
- `pertandingan/index.astro` - Jadwal & hasil pertandingan
- `arsip/2024-25.astro` - Arsip Liga 2 2024-25 (tahap Penyisihan / Play-off / 8 Besar)
- `arsip/2025-26.astro` - Arsip Liga Nusantara 2025-26 (`ARCHIVE_SEASON`)
- `arsip/pemain.astro` - Wajah pemain per musim
- `arsip/sejarah.astro` - Sejarah & honours pra-2024-25 (`history.json`)
- `privasi.astro` - Kebijakan privasi
- `tim/berita/*.astro` - Satu file per artikel berita

### Dynamic Routes
- `pemain/[slug].astro` - Detail pemain (generate dari playerDetails)
- `pertandingan/[slug].astro` - Detail pertandingan (generate dari fixtures COMPLETED)
- `sosmed/[poster].astro` - Poster media sosial (dev-only, lihat bagian di bawah)
- `sosmed/jadwal/[bagian].astro`, `sosmed/artboard/[art].astro` - Poster jadwal & artboard identitas (dev-only)

**Penting:** Semua dynamic routes HARUS memiliki `getStaticPaths()` function untuk pre-render.

### Poster Media Sosial (`npm run sosmed`)

Poster dibuat sebagai halaman Astro biasa (Tailwind + font situs), lalu di-screenshot headless Chrome
lewat `scripts/sosmed.mjs` → `social/out/<out>.png`. Resolusi 1080×1350 (portrait, sama dengan
carousel jadwal grup); isi resep poster ada di `social/posts.json` (satu entry = satu PNG).

```json
{ "out": "laga-persipa", "md": 1 }
```

Field opsional: `mode` (`jadwal`|`hasil`), `date`, `time`, `home`, `away`, `venue`, `grup`, `md`,
`hs`/`as` (skor), `scorers` (`[{ minute, player, team }]`). Yang tidak diisi diambil dari laga
berikutnya di `fixtures.json` musim aktif. Kanvas 1080×1350.

Laga non-liga (uji coba) memakai empat field tambahan: `competition` (label header, mis. "Uji
Coba"), `tag` (chip kanan atas, default `Grup B`), `ticket` (satu baris harga tiket di panel
tanggal; CTA oranye tetap `persibo.com`), dan `captions: { home, away }` karena laga uji coba tidak
punya grup untuk dijadikan keterangan lawan.

Mode `hasil` menampilkan skor besar, badge MENANG/KALAH/SERI, dan daftar pencetak gol. Blok
pencetak gol hanya muncul kalau `scorers` diisi; kalau tidak, poster jatuh ke blok jadwal
berikutnya. `matchDetails.events` sengaja tidak dipakai: isinya tidak cocok dengan skor laga
(8 gol untuk laga 1:2) dan `team` selalu null — pencetak gol harus ditulis manual dari laporan laga.

- Route hanya ada saat `astro dev` (`getStaticPaths` mengembalikan array kosong di build), jadi
  tidak ikut ke `dist/` maupun sitemap.
- Hasil render di `social/out/` ikut di-commit: itu bahan yang diposting, bukan artefak build. Render ulang boleh menimpa berkas yang sama.
- Script memakai dev server yang sudah jalan di port 4321; kalau belum ada, ia menyalakannya sendiri.
- Logo lawan diambil dari URL musim aktif dengan varian `/h/200/` (830px), bukan crest mirror
  50–105px yang dipakai situs — kalau digambar di 184px hasilnya blur. Mirror tetap jadi fallback
  lewat `onerror`.
- Job boleh menunjuk halaman lain: `{ "out", "url": "/sosmed/identitas", "selector": "#art-wordmark", "transparent": true }`. Tanpa `url`/ `selector`, dipakai `/sosmed/<out>` dan `#poster`.
- Artboard identitas (logotype, post pengumuman) ada di `src/pages/sosmed/identitas.astro`; filosofi mark di `brand/FILOSOFI.md`.
- Font Barlow Condensed/Lexend diambil dari Google Fonts, jadi render butuh koneksi internet.

## 🎯 Design Principles

### Mobile-First
- Semua design dioptimalkan untuk mobile terlebih dahulu
- Gunakan responsive classes: `sm:`, `md:`, `lg:`
- Touch target minimal 44x44px
- Horizontal scroll untuk sections tertentu (top players)

### Dark Theme (broadcast style)
- Background: `bg-background-dark` (#121018); panels `bg-[#0c0b0f]`
- Text: `text-white`, `text-white/60`, `text-white/40`
- Borders: `border-white/12`, `border-white/15`
- Accent: `text-primary` (#f97316); square corners, condensed headings (`font-cond`)
- Page title block: `PageHeader.astro`; section header: `border-b border-white/15 pb-3` + `font-cond text-2xl uppercase`

### Typography
- Font: Lexend (`font-display`); judul condensed memakai kelas `font-cond`
- Icons: Material Symbols Outlined
- Sizes: Responsive dengan Tailwind text sizes

## 🔍 SEO & Structured Data

### Meta Tags
Setiap halaman harus memiliki:
- `title` - Unique untuk setiap halaman
- `description` - Meta description
- `keywords` - SEO keywords
- Open Graph tags
- Twitter Card tags
- Canonical URL

### JSON-LD Structured Data
Implementasi di berbagai halaman:
- **Organization** - Di Layout.astro
- **SportsTeam** - Di tim/profil.astro
- **Person** - Di pemain/[slug].astro
- **NewsArticle** - Di artikel berita
- **SportsEvent** - Di pertandingan/[slug].astro (semua laga) dan beranda (laga terjadwal terdekat, termasuk uji coba)
- **FAQPage** - Di tim/profil.astro
- **BreadcrumbList** - Di Breadcrumb.astro

### Sitemap
- Otomatis generate dengan `@astrojs/sitemap`
- Config di `astro.config.mjs`
- Output: `dist/sitemap-index.xml` dan `dist/sitemap-0.xml`

## 📱 Analytics & Ads

### Google Analytics
- ID: `G-W843MTD8G4`
- Script di Layout.astro dengan `is:inline`
- gtag.js implementation

### Google AdSense
- Client ID: `ca-pub-1300254481589524`
- Script di Layout.astro

## 🚨 Common Issues & Solutions

### 1. GetStaticPathsRequired Error
**Problem:** Dynamic route tidak memiliki `getStaticPaths()`  
**Solution:** Tambahkan `export async function getStaticPaths()` di dynamic route

### 2. JSON Import Error
**Problem:** `Failed to load url /src/data/file.json`  
**Solution:** Pakai static import:
```typescript
import data from '../data/file.json';
```
Pola `await import()` lama tidak diperlukan lagi di Astro/Vite.

### 3. Player Detail Not Found
**Problem:** Beberapa pemain tidak memiliki halaman detail  
**Solution:** Enhanced `getStaticPaths()` untuk generate semua players, bahkan jika `playerDetails.json` incomplete

### 4. TypeScript Error di Client Script
**Problem:** `Unexpected identifier 'as'` di client-side script  
**Solution:** Jangan gunakan TypeScript syntax di `<script>` tag. Gunakan vanilla JS dengan null checks.

### 5. Sitemap Tidak Generate
**Problem:** Sitemap files tidak muncul di `dist/`  
**Solution:** 
- Pastikan `@astrojs/sitemap` terinstall
- Pastikan `site` property ada di `astro.config.mjs`
- Run `npm run build` dan cek `dist/` folder

### 6. Match Detail Slug Generation
**Problem:** Slug tidak konsisten atau terlalu panjang  
**Solution:** Gunakan `getMatchDetailSlug()` yang:
- Extract date dan format YYYY-MM-DD
- Normalize team names
- Truncate team names ke 20 karakter
- Format: `YYYY-MM-DD-team1-vs-team2`

## 📝 Konvensi Kode

### Naming Conventions
- **Files:** kebab-case (e.g., `player-detail.astro`)
- **Components:** PascalCase (e.g., `StandingsTable.astro`)
- **Functions:** camelCase (e.g., `getPlayerBySlug()`)
- **Types/Interfaces:** PascalCase (e.g., `PlayerDetail`)

### Astro Component Structure
```astro
---
// 1. Imports
import Layout from '../layouts/Layout.astro';
import type { Player } from '../types';

// 2. Props interface
interface Props {
  title?: string;
}

// 3. Get props
const { title = 'Default' } = Astro.props;

// 4. Load data
const players = await loadPlayers();
---

<!-- 5. HTML Template -->
<Layout title={title}>
  <!-- Content -->
</Layout>

<!-- 6. Client-side scripts (if needed) -->
<script>
  // Vanilla JS only, no TypeScript syntax
</script>
```

### Data Loading Pattern
Static import JSON didukung Astro/Vite dan dipakai `dataLoader.ts`:

```typescript
import fixtures from '../data/seasons/2026-27/fixtures.json';
const data = fixtures as Fixture[];
```

Untuk data per musim, pakai `loadFixtures(season)` dsb. dari `dataLoader.ts`, jangan import langsung.

## 🎨 Styling Guidelines

### Color Palette
- Primary: Slate (dark theme)
- Accent: Orange `primary` (#f97316) untuk links, buttons, highlight
- Success: Green (untuk menang)
- Danger: Red (untuk kalah)
- Warning: Yellow (untuk seri)

### Spacing
- Container: `max-w-7xl mx-auto px-4`
- Section spacing: `space-y-6` atau `mb-6`
- Card padding: `p-4` atau `p-6`

### Responsive Breakpoints
- `sm:` - 640px
- `md:` - 768px
- `lg:` - 1024px
- `xl:` - 1280px

## 🔄 Update Data

### Sumber Data
Data berasal dari scraping iLeague dan disimpan per musim di `src/data/seasons/<musim>/`.

### Update Process
1. Jalankan `.scratch/scrape_ileague.py` (hanya menulis musim aktif; `2025-26`/`2024-25` beku)
2. Pastikan `src/data/seasons/2026-27/` terisi dan format JSON valid
3. Jalankan `npm run derive-player-stats` bila `matchDetails` berubah (statistik pemain dihitung dari situ)
4. Rebuild: `npm run build`
5. Commit juga folder `src/data/seasons/` agar arsip ikut tersimpan di git

## ⚠️ Important Notes

1. **Unofficial Disclaimer:** Selalu ingat bahwa ini website UNOFFICIAL. Disclaimer harus ada di halaman tim.

2. **Mobile-First:** Semua perubahan harus diuji di mobile viewport terlebih dahulu.

3. **SEO Content:** Setiap halaman harus memiliki:
   - Intro text untuk SEO
   - Descriptive alt text untuk images
   - Structured data yang relevan

4. **Performance:** 
   - Optimize images
   - Lazy load jika perlu
   - Minimize client-side JavaScript

5. **Accessibility:**
   - Semantic HTML
   - ARIA labels jika perlu
   - Keyboard navigation support

## 🚀 Development Workflow

### Local Development
```bash
npm run dev      # Start dev server (localhost:4321)
npm run build    # Build untuk production
npm run preview  # Preview production build
```

Script lain (`scripts/`, dipanggil lewat npm):

| Script | Fungsi |
|---|---|
| `prebuild` | Otomatis: `optimize-images` + `generate-search-index` |
| `npm run optimize-images` | Kompres/konversi gambar `public/img` |
| `npm run generate-search-index` | Tulis `public/search-index.json` untuk `GlobalSearch` |
| `npm run derive-player-stats` | Hitung statistik pemain dari `seasons/*/matchDetails.json` |
| `npm run fetch-assets` | Rescue gambar iLeague ke `public/img` + catat di `assets-manifest.json` (idempoten) |
| `npm run sosmed` | Render poster ke `social/out/` |
| `node scripts/resize-logo.js` | Turunan ukuran logo |

Catatan `derive-player-stats`: kolom "Penampilan" iLeague menghitung listing skuad (21 per laga),
bukan menit main, dan kolom saves/cards kosong — semua angka dihitung dari `matchDetails`.

### Git Workflow
- Main branch: `main`
- Remote: `https://github.com/aryvkurniawan/persibo-v2.git`
- Tag arsip: `archive/2025-26-final`
- `.gitignore`: `dist/`, `node_modules/`, `.astro/`, `.env*`, log

## 📚 Resources

- **Astro Docs:** https://docs.astro.build
- **Tailwind Docs:** https://tailwindcss.com/docs
- **Design Reference:** `C:\Repository\persibo-scrape\stitch_beranda_tim`
- **Data Source:** `C:\Repository\persibo-scrape\py-final\output\`
- **Dokumen repo:** `README.md` (fitur), `CHANGELOG.md`, `IDEAS.md`, `REPO_DESCRIPTION.md`, `brand/FILOSOFI.md`
- **Konfigurasi skill:** `docs/agents/issue-tracker.md`, `docs/agents/triage-labels.md`, `docs/agents/domain.md`

## 🎯 Future Enhancements

Ide untuk pengembangan selanjutnya:
- [ ] PWA offline (manifest & icon sudah ada, service worker belum)
- [ ] Multi-language support
- [ ] Hapus file data flat mati di `src/data/` (fixtures/…/matches.json)

---

**Last Updated:** 2026-11-04
**Version:** 1.1.0
**Maintainer:** Jengker

## Agent skills

### Issue tracker

Issues live as GitHub issues on `aryvkurniawan/persibo-v2`, driven by the `gh` CLI. See `docs/agents/issue-tracker.md`.

### Triage labels

Default canonical vocabulary: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: `CONTEXT.md` + `docs/adr/` at the repo root. See `docs/agents/domain.md`.
