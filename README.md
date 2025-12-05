# PERSIBO Bojonegoro - Website Unofficial

Website unofficial untuk PERSIBO Bojonegoro yang menyediakan informasi lengkap tentang tim sepak bola kebanggaan masyarakat Bojonegoro yang saat ini berlaga di Liga Nusantara 2025-26.

## 🚀 Fitur

### Halaman Utama
- **Hero Section** dengan gambar tim
- **Timeline Mini** menampilkan pertandingan selanjutnya dan 3 hasil pertandingan terakhir
- **Klasemen Grup C** dengan quick jump links
- **Top Scorer** tabel pemain dengan gol terbanyak
- **Top Players** dengan horizontal scroll, diurutkan berdasarkan club history
- **Berita Terbaru** menampilkan artikel terbaru

### Halaman Pemain
- **Daftar Pemain** dengan fitur search dan filter (posisi, usia, negara)
- **Detail Pemain** dengan informasi lengkap:
  - Foto pemain
  - Informasi pribadi (usia, posisi, negara)
  - Statistik (gol, assist, kartu)
  - Riwayat klub
  - Link ke profil pemain

### Halaman Pertandingan
- **Jadwal & Hasil Pertandingan** dengan tab switcher (Jadwal/Hasil)
- **Detail Pertandingan** untuk setiap pertandingan selesai:
  - Lineup (Starting XI & Substitutes) untuk kedua tim
  - Timeline Events (gol, kartu, pergantian pemain)
  - Statistik pertandingan
  - Link ke iLeague.id

### Halaman Tim
- **Profil Tim** dengan FAQ section
- **Official & Staff** dengan foto dan informasi
- **Berita** daftar artikel berita
- **Galeri** (placeholder)

### Fitur SEO & Analytics
- ✅ SEO Meta Tags lengkap
- ✅ Structured Data (JSON-LD) untuk:
  - Organization
  - SportsTeam
  - Person (pemain)
  - NewsArticle
  - SportsEvent
  - FAQPage
  - BreadcrumbList
- ✅ Sitemap otomatis
- ✅ Google Analytics (gtag.js)
- ✅ Google AdSense

### UI/UX
- 📱 **Mobile-First Design** - Optimized untuk perangkat mobile
- 🎨 **Dark Theme** dengan Tailwind CSS
- 🔍 **Search & Filter** untuk pemain
- 📊 **Responsive Tables** untuk klasemen
- 🔝 **Scroll to Top** button
- 🧭 **Breadcrumb Navigation**
- 📱 **Bottom Navigation** untuk navigasi mudah

## 🛠️ Teknologi

- **[Astro](https://astro.build/)** - Static Site Generator
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS Framework
- **[TypeScript](https://www.typescriptlang.org/)** - Type Safety
- **[@astrojs/sitemap](https://docs.astro.build/en/guides/integrations-guide/sitemap/)** - Sitemap generation

## 📦 Instalasi

```bash
# Clone repository
git clone <repository-url>
cd persibo-astro

# Install dependencies
npm install

# Jalankan development server
npm run dev

# Build untuk production
npm run build

# Preview build
npm run preview
```

## 📁 Struktur Proyek

```
persibo-astro/
├── public/
│   ├── img/          # Gambar artikel dan assets
│   ├── video/        # Video artikel
│   ├── hero.jpg      # Hero image homepage
│   └── logo.png      # Logo PERSIBO
├── src/
│   ├── components/   # Komponen reusable
│   │   ├── Breadcrumb.astro
│   │   ├── Lineup.astro
│   │   ├── MatchCard.astro
│   │   ├── MatchTimelineCard.astro
│   │   ├── PlayerCard.astro
│   │   └── StandingsTable.astro
│   ├── data/         # Data JSON
│   │   ├── fixtures.json
│   │   ├── matchDetails.json
│   │   ├── officials.json
│   │   ├── playerDetails.json
│   │   ├── players.json
│   │   ├── standings.json
│   │   └── teams.json
│   ├── layouts/      # Layout templates
│   │   └── Layout.astro
│   ├── pages/        # Halaman website
│   │   ├── index.astro          # Homepage
│   │   ├── klasemen.astro       # Klasemen
│   │   ├── pemain/
│   │   │   ├── index.astro      # Daftar pemain
│   │   │   └── [slug].astro     # Detail pemain
│   │   ├── pertandingan/
│   │   │   ├── index.astro      # Jadwal & hasil
│   │   │   └── [slug].astro     # Detail pertandingan
│   │   └── tim/
│   │       ├── index.astro      # Menu tim
│   │       ├── profil.astro     # Profil tim
│   │       ├── official.astro   # Official & staff
│   │       ├── berita.astro     # Daftar berita
│   │       ├── berita/          # Artikel berita
│   │       └── galeri.astro     # Galeri
│   ├── types.ts      # TypeScript types
│   └── utils/
│       └── dataLoader.ts  # Utility functions untuk load data
├── astro.config.mjs
├── package.json
└── tailwind.config.mjs
```

## 📊 Data Sources

Data diambil dari scraping dan disimpan dalam format JSON di folder `src/data/`:

- `players.json` - Daftar pemain
- `playerDetails.json` - Detail lengkap pemain
- `officials.json` - Official & staff
- `fixtures.json` - Jadwal & hasil pertandingan
- `matchDetails.json` - Detail pertandingan (lineup, events, stats)
- `standings.json` - Klasemen
- `teams.json` - Informasi tim

## 🎨 Design Reference

Desain mengacu pada referensi dari `C:\Repository\persibo-scrape\stitch_beranda_tim` dengan fokus pada:
- Mobile-first approach
- Dark theme
- Clean dan modern UI
- Responsive design

## 📝 Catatan Penting

⚠️ **Website ini adalah website UNOFFICIAL dan tidak berafiliasi dengan manajemen resmi PERSIBO Bojonegoro.**

Website ini dibuat dengan tujuan menyediakan informasi tentang PERSIBO Bojonegoro untuk para penggemar dan masyarakat Bojonegoro.

## 📄 Lisensi

Proyek ini dibuat untuk keperluan non-komersial dan edukasi.

## 👨‍💻 Kontributor

Dibuat dengan ❤️ oleh Jengker untuk PERSIBO Bojonegoro

---

**PERSIBO Bojonegoro - Laskar Angling Dharma** ⚽
