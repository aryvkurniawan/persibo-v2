# PERSIBO Bojonegoro - Website Unofficial

Website unofficial untuk PERSIBO Bojonegoro yang menyediakan informasi lengkap tentang tim sepak bola kebanggaan masyarakat Bojonegoro yang saat ini berlaga di Liga Nusantara 2026-27.

## 🚀 Fitur

### Halaman Utama
- **Hero pertandingan berikutnya** dengan countdown kickoff
- **Ticker musim** dan **klasemen grup** PERSIBO
- **Jadwal mendatang** dan **berita terbaru**
- **Link arsip musim** di footer

### Halaman Pemain
- **Daftar Pemain** dengan fitur search dan filter (posisi, usia, negara)
- **Detail Pemain** dengan informasi lengkap:
  - Foto pemain
  - Informasi pribadi (usia, posisi, negara)
  - Statistik (gol, assist, kartu)
  - Riwayat klub
  - Link ke profil pemain

### Halaman Pertandingan
- **Jadwal & Hasil Pertandingan** dalam satu halaman (jadwal lalu hasil)
- **Detail Pertandingan** untuk pertandingan selesai dan terjadwal:
  - Lineup (Starting XI & Substitutes) untuk kedua tim
  - Timeline Events (gol, kartu, pergantian pemain)
  - Statistik pertandingan
  - Link ke iLeague.id

### Halaman Tim
- **Profil Tim** dengan FAQ section
- **Official & Staff** dengan foto dan informasi
- **Berita** daftar artikel berita

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
- 🗂️ **Arsip musim** untuk data lama (2025-26)

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
│   │   ├── PlayerCard.astro
│   │   └── StandingsTable.astro
│   ├── data/         # Data JSON
│   │   ├── seasons/
│   │   │   ├── 2024-25/  # Arsip: standings, fixtures, teams, matchDetails
│   │   │   ├── 2025-26/  # Arsip: standings, fixtures, teams, matchDetails
│   │   │   └── 2026-27/  # Musim aktif
│   │   ├── players/
│   │   │   └── faces.json  # Semua yang pernah main di Persibo + fotonya
│   │   ├── officials.json
│   │   ├── playerDetails.json
│   │   └── players.json
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
│   │   ├── arsip/
│   │   │   ├── 2024-25.astro    # Arsip Liga 2 2024-25
│   │   │   ├── 2025-26.astro    # Arsip Liga Nusantara 2025-26
│   │   │   └── pemain.astro     # Semua pemain yang pernah main di Persibo
│   │   └── tim/
│   │       ├── index.astro      # Menu tim
│   │       ├── profil.astro     # Profil tim
│   │       ├── official.astro   # Official & staff
│   │       ├── berita.astro     # Daftar berita
│   │       └── berita/          # Artikel berita
│   ├── types.ts      # TypeScript types
│   └── utils/
│       └── dataLoader.ts  # Utility functions untuk load data
├── astro.config.mjs
├── package.json
└── tailwind.config.mjs
```

## 📊 Data Sources

Data diambil dari scraping iLeague dan disimpan per musim di `src/data/seasons/<musim>/`:

- `standings.json` - Klasemen
- `fixtures.json` - Jadwal & hasil pertandingan
- `teams.json` - Informasi tim dan logo
- `matchDetails.json` - Detail pertandingan (lineup, events, stats)

Data skuad terakhir ada di `src/data/players.json`, `playerDetails.json`, dan `officials.json` (belum ada data skuad 2026-27 dari iLeague). File `fixtures.json`, `standings.json`, dan `teams.json` di root `src/data/` adalah snapshot lama; jangan dipakai untuk halaman.

**Arsip dibekukan**: jangan timpa `src/data/seasons/2024-25/` dan `2025-26/` saat scraping musim baru. Halaman arsip ada di `/arsip/2024-25` dan `/arsip/2025-26`; detail pertandingan lama tetap dibuat dari data itu.

### Foto & logo disimpan lokal

Situs ini dulu menampilkan logo klub dan foto pemain langsung dari `assets.ileague.id`. Kalau iLeague mengganti atau menghapus berkasnya, arsip kehilangan gambar tanpa error apa pun. Karena itu aset disalin ke `public/img/` dan dicatat di `src/data/assets-manifest.json` (URL asli, ukuran, waktu unduh):

```bash
npm run fetch-assets
```

Skripnya idempoten: berkas yang sudah ada dilewati, dan aman dijalankan ulang kapan saja. Logo klub mempertahankan transparansi (PNG); foto pemain diperkecil ke lebar 400 px lalu disimpan sebagai JPEG.

Kalau menambah musim atau pemain baru, perbarui `src/data/players/faces.json` (atau `teams.json`) lalu jalankan skrip ini lagi. Halaman akan memakai `logo_local` / `photo_local` lebih dulu, dan jatuh ke URL iLeague kalau salinan lokalnya belum ada.

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
