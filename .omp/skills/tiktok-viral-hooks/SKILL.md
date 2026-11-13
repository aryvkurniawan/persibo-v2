---
name: tiktok-viral-hooks
description: "Use when writing hooks for TikTok/Reels/Shorts video scripts, or when the user asks for a viral hook, 3-second opener, retention structure, or script template for short-form video. Database of 2600+ real viral TikTok teardowns: exact openers quoted line-by-line, hook patterns named, retention moves mapped by second, and copy-paste script templates. Browse by niche (entertainment, finance, beauty, food, tech, fitness, marketing) or by pattern (Curiosity Gap, Contrast Hook, Emotional Confession, Question Hook, Problem-Solution-Promise, and 200+ more). License: CC BY-NC-SA 4.0, data from github.com/shixinzhang/tiktok-viral-hooks."
license: CC BY-NC-SA 4.0
metadata:
  source: https://github.com/shixinzhang/tiktok-viral-hooks
  version: "2026-11"
---

# TikTok Viral Hooks — database teardown video viral

Bukan skill proses — ini **database riset**: 2.600+ video viral TikTok yang dibedah
(openernya persis, pola hook-nya dinamai, titik retensi dipetakan per detik,
template skrip siap isi).

## Cara pakai

1. **Tentukan niche dulu.** Daftar per niche ada di `by-niche/en/*.md`
   (other, entertainment, finance, beauty, food, tech, fitness, marketing).
2. **Pilih pola hook yang cocok** dari `by-pattern/en/*.md` — 200+ pola, tiap file
   berisi contoh video viral asli yang memakai pola itu.
3. **Baca 2-3 breakdown lengkap** di `breakdowns/en/YYYY-MM/*.md` untuk pola yang
   dipilih: buka `by-pattern/en/hook-*.md` → link breakdown di dalamnya.
4. **Adaptasi, jangan salin mentah.** Ambil struktur (pola + ritme retensi),
   isi dengan konteks user. Breakdown memberi template 2 kalimat yang tinggal
   diisi topik.

## Struktur

```
by-niche/en/<niche>.md      # indeks video per niche, dengan jumlah views
by-pattern/en/hook-*.md     # indeks per pola hook
breakdowns/en/YYYY-MM/*.md  # bedah lengkap: opener, retensi, template, mind map
_data/all-videos.json       # seluruh data mentah (views, pattern, url, tanggal)
```

## Catatan

- Data bahasa Inggris; hook bisa diadaptasi ke bahasa apa pun — polanya universal,
  kata-katanya tidak. Untuk konten Indonesia, terjemahkan struktur bukan kalimat.
- Krediting: CC BY-NC-SA — sebut sumber bila mempublikasi turunan database-nya.
- File `_data/all-videos.json` berguna untuk query cepat: filter views > N,
  pattern = X, niche = Y dengan `jq`.
