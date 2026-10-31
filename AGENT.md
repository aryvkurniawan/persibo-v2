# AGENT.md - Dokumentasi untuk AI Agent

Dokumentasi ini dibuat untuk membantu AI agent memahami konteks, struktur, dan konvensi proyek PERSIBO Bojonegoro Website.

## 📋 Konteks Proyek

**Nama Proyek:** PERSIBO Bojonegoro - Website Unofficial  
**Teknologi:** Astro 7.4.1 + Tailwind CSS + TypeScript  
**Tujuan:** Website unofficial untuk menyediakan informasi lengkap tentang tim sepak bola PERSIBO Bojonegoro yang berlaga di Liga Nusantara 2026-27  
**Target Audience:** Penggemar dan masyarakat Bojonegoro (mobile-first design)  
**Status:** Website UNOFFICIAL - tidak berafiliasi dengan manajemen resmi

## 🏗️ Arsitektur Proyek

### Struktur Folder

```
persibo-astro/
├── public/              # Static assets (images, videos, favicon)
│   ├── img/            # Gambar artikel dan assets
│   ├── video/          # Video artikel
│   ├── hero.jpg        # Hero image homepage
│   └── logo.png        # Logo PERSIBO
├── src/
│   ├── components/     # Komponen Astro reusable
│   ├── data/           # Data JSON (players, fixtures, standings, dll)
│   ├── layouts/        # Layout templates
│   ├── pages/          # Halaman website (file-based routing)
│   ├── types.ts        # TypeScript type definitions
│   └── utils/          # Utility functions
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

## 📊 Data Structure

### Data Files (src/data/)

Semua data disimpan dalam format JSON dan di-load menggunakan `dataLoader.ts`.

Data per musim ada di `src/data/seasons/<musim>/`:

1. **standings.json** - Klasemen
2. **fixtures.json** - Jadwal & hasil pertandingan
3. **teams.json** - Informasi tim dengan logo
4. **matchDetails.json** - Detail pertandingan (lineup, events, statistics)

Data skuad (berlaku untuk skuad terakhir, 2025-26):

5. **players.json** - Daftar pemain (basic info)
6. **playerDetails.json** - Detail lengkap pemain (statistik, club history, foto)
7. **officials.json** - Official & staff tim

`2025-26` adalah arsip beku; `2026-27` adalah musim aktif. Jangan timpa arsip saat scraping.

Scraper (`.scratch/scrape_ileague.py`) menolak menulis ke musim yang filenya sudah ada
kecuali dijalankan dengan `--force`. Arsip juga di-tag git: `archive/2025-26-final`.
Kalau arsip terlanjur tertimpa, pulihkan dengan:

```bash
git checkout archive/2025-26-final -- src/data/seasons/2025-26
```

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

### Helper Functions
- `getPlayerBySlug()` - Find player by slug
- `getPlayerDetailWithPhoto()` - Merge player detail dengan photo dari players.json
- `getPersiboStanding()` - Get PERSIBO standing
- `getStandingsByGroup()` - Filter standings by group
- `getCompletedFixtures()` - Filter completed matches
- `getScheduledFixtures()` - Filter scheduled matches
- `getTeamLogo()` - Get team logo dengan name matching logic
- `getMatchDetailByUrl()` - Find match detail by match_url
- `getMatchDetailSlug()` - Generate slug untuk match detail page

**Catatan:** Loader memakai static import JSON per musim di `dataLoader.ts` (bukan dynamic import). Tambah musim baru dengan menambah import dan entri di objek `SEASONS`.

## 🎨 Komponen (src/components/)

### Komponen yang Tersedia

1. **PageHeader.astro** - Header halaman bersama (label, judul `font-cond`, meta, deskripsi)
2. **Breadcrumb.astro** - Breadcrumb navigation dengan JSON-LD schema
3. **Lineup.astro** - Display match lineup (Starting XI & Cadangan)
4. **MatchCard.astro** - Card untuk menampilkan pertandingan
5. **PlayerCard.astro** - Card untuk menampilkan pemain
6. **StandingsTable.astro** - Tabel klasemen responsive
7. **FilterBar.astro / SearchBar.astro** - Filter dan pencarian pemain
8. **ShareButtons.astro** - Tombol bagikan (native, WhatsApp, Facebook, X, Telegram, salin link)

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

### Dynamic Routes
- `pemain/[slug].astro` - Detail pemain (generate dari playerDetails)
- `pertandingan/[slug].astro` - Detail pertandingan (generate dari fixtures COMPLETED)
- `sosmed/[poster].astro` - Poster media sosial (dev-only, lihat bagian di bawah)

**Penting:** Semua dynamic routes HARUS memiliki `getStaticPaths()` function untuk pre-render.

### Poster Media Sosial (`npm run sosmed`)

Poster dibuat sebagai halaman Astro biasa (Tailwind + font situs), lalu di-screenshot headless Chrome
lewat `scripts/sosmed.mjs` → `social/out/<out>.png`. Resolusi default 1080×1080; isi resep poster
ada di `social/posts.json` (satu entry = satu PNG).

```json
{ "out": "laga-persipa", "md": 1 }
```

Field opsional: `mode` (`jadwal`|`hasil`), `date`, `time`, `home`, `away`, `venue`, `grup`, `md`,
`hs`/`as` (skor), `scorers` (`[{ minute, player, team }]`). Yang tidak diisi diambil dari laga
berikutnya di `fixtures.json` musim aktif. Kanvas tetap 1080×1080.

Mode `hasil` menampilkan skor besar, badge MENANG/KALAH/SERI, dan daftar pencetak gol. Blok
pencetak gol hanya muncul kalau `scorers` diisi; kalau tidak, poster jatuh ke blok jadwal
berikutnya. `matchDetails.events` sengaja tidak dipakai: isinya tidak cocok dengan skor laga
(8 gol untuk laga 1:2) dan `team` selalu null — pencetak gol harus ditulis manual dari laporan laga.

- Route hanya ada saat `astro dev` (`getStaticPaths` mengembalikan array kosong di build), jadi
  tidak ikut ke `dist/` maupun sitemap.
- Hasil render di `social/out/` ikut di-commit: itu bahan yang diposting, bukan artefak build. Render ulang boleh menimpa berkas yang sama.
- Script memakai dev server yang sudah jalan di port 4321; kalau belum ada, ia menyalakannya sendiri.
- Logo lawan diambil dari URL musim aktif dengan varian `/h/200/` (830px), bukan crest mirror
  50–105px yang dipakai situs — kalau digambar di 160px hasilnya blur. Mirror tetap jadi fallback
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
- Font: Lexend (Google Fonts)
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
- **SportsEvent** - Di pertandingan/[slug].astro
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
**Solution:** Gunakan pattern:
```typescript
const module = await import('../data/file.json');
return (module.default || module) as Type[];
```

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
- **Components:** PascalCase (e.g., `PlayerCard.astro`)
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
```typescript
// ✅ CORRECT
const module = await import('../data/file.json');
const data = (module.default || module) as Type[];

// ❌ WRONG
import data from '../data/file.json';
```

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
1. Jalankan `.scratch/scrape_ileague.py` (hanya menulis musim aktif; `2025-26` dibekukan)
2. Pastikan `src/data/seasons/2026-27/` terisi dan format JSON valid
3. Rebuild: `npm run build`
4. Commit juga folder `src/data/seasons/` agar arsip ikut tersimpan di git

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

### Git Workflow
- Main branch: `main`
- Remote: `https://github.com/monitorin/persibo-astro-v2.git`
- `.gitignore` sudah dikonfigurasi untuk exclude `dist/`, `node_modules/`, dll

## 📚 Resources

- **Astro Docs:** https://docs.astro.build
- **Tailwind Docs:** https://tailwindcss.com/docs
- **Design Reference:** `C:\Repository\persibo-scrape\stitch_beranda_tim`
- **Data Source:** `C:\Repository\persibo-scrape\py-final\output\`

## 🎯 Future Enhancements

Ide untuk pengembangan selanjutnya:
- [ ] Statistik lebih detail
- [ ] Grafik statistik
- [ ] Share buttons
- [ ] PWA support
- [ ] Multi-language support

---

**Last Updated:** 2026-10-30  
**Version:** 1.0.0  
**Maintainer:** Jengker
