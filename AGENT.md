# AGENT.md - Dokumentasi untuk AI Agent

Dokumentasi ini dibuat untuk membantu AI agent memahami konteks, struktur, dan konvensi proyek PERSIBO Bojonegoro Website.

## 📋 Konteks Proyek

**Nama Proyek:** PERSIBO Bojonegoro - Website Unofficial  
**Teknologi:** Astro 4.15.0 + Tailwind CSS + TypeScript  
**Tujuan:** Website unofficial untuk menyediakan informasi lengkap tentang tim sepak bola PERSIBO Bojonegoro yang berlaga di Liga Nusantara 2025-26  
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
├── package.json
├── tailwind.config.mjs
└── tsconfig.json
```

### Teknologi Stack

- **Astro 4.15.0** - Static Site Generator
- **Tailwind CSS 3.4.1** - Utility-first CSS framework
- **TypeScript** - Type safety
- **@astrojs/sitemap 3.2.0** - Sitemap generation
- **@astrojs/tailwind 5.1.3** - Tailwind integration

## 📊 Data Structure

### Data Files (src/data/)

Semua data disimpan dalam format JSON dan di-load menggunakan `dataLoader.ts`:

1. **players.json** - Daftar pemain (basic info)
2. **playerDetails.json** - Detail lengkap pemain (statistik, club history, foto)
3. **officials.json** - Official & staff tim
4. **fixtures.json** - Jadwal & hasil pertandingan
5. **matchDetails.json** - Detail pertandingan (lineup, events, statistics)
6. **standings.json** - Klasemen Liga Nusantara 2025-26
7. **teams.json** - Informasi tim dengan logo

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
- `loadStandings()` - Load standings data
- `loadFixtures()` - Load fixtures data
- `loadMatchDetails()` - Load match details
- `loadTeams()` - Load teams data

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

**Catatan:** Semua loader functions menggunakan pattern:
```typescript
const module = await import('../data/file.json');
return (module.default || module) as Type[];
```

## 🎨 Komponen (src/components/)

### Komponen yang Tersedia

1. **Breadcrumb.astro** - Breadcrumb navigation dengan JSON-LD schema
2. **Lineup.astro** - Display match lineup (Starting XI & Substitutes)
3. **MatchCard.astro** - Card untuk menampilkan pertandingan
4. **MatchTimelineCard.astro** - Card untuk timeline pertandingan (homepage)
5. **PlayerCard.astro** - Card untuk menampilkan pemain
6. **StandingsTable.astro** - Tabel klasemen responsive

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
- `tim/galeri.astro` - Galeri (placeholder)
- `pemain/index.astro` - Daftar pemain dengan search & filter
- `pertandingan/index.astro` - Jadwal & hasil pertandingan

### Dynamic Routes
- `pemain/[slug].astro` - Detail pemain (generate dari playerDetails)
- `pertandingan/[slug].astro` - Detail pertandingan (generate dari fixtures COMPLETED)

**Penting:** Semua dynamic routes HARUS memiliki `getStaticPaths()` function untuk pre-render.

## 🎯 Design Principles

### Mobile-First
- Semua design dioptimalkan untuk mobile terlebih dahulu
- Gunakan responsive classes: `sm:`, `md:`, `lg:`
- Touch target minimal 44x44px
- Horizontal scroll untuk sections tertentu (top players)

### Dark Theme
- Background: `bg-slate-900` (main), `bg-slate-800/50` (cards)
- Text: `text-slate-100`, `text-slate-300`
- Borders: `border-slate-700`
- Accent: Blue/Persibo colors

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
- Accent: Blue (untuk links, buttons)
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
Data berasal dari scraping dan disimpan di:
- `C:\Repository\persibo-scrape\py-final\output\*.json`

### Update Process
1. Scrape data baru ke `py-final/output/`
2. Copy JSON files ke `persibo-astro/src/data/`
3. Pastikan format JSON valid (2-space indentation)
4. Rebuild: `npm run build`

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
- [ ] Galeri foto/video
- [ ] Statistik lebih detail
- [ ] Grafik statistik
- [ ] Share buttons
- [ ] PWA support
- [ ] Multi-language support

---

**Last Updated:** 2025-12-05  
**Version:** 1.0.0  
**Maintainer:** Jengker
