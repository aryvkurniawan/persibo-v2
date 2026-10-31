# Identitas PERSIBO — filosofi & bahan

Identitas untuk **situs penggemar persibo.com**. Bukan logo resmi PERSIBO Bojonegoro, bukan
pengganti crest klub, dan tidak boleh dipakai untuk mengesankan afiliasi resmi. Crest asli tetap
dipakai apa adanya di poster laga.

Berkas di sini menjawab satu hal: *sosmed iki isih urip* — masih jalan, masih baru.

---

## 1. Mark: `P.`

Satu huruf, satu titik. Tidak ada angka tahun, tidak ada pita, tidak ada bola.

| Bagian | Bentuk | Arti |
|---|---|---|
| Batang tegak | persegi panjang lurus, tanpa lengkung | Gada — senjata Angling Dharma. Lugas, ora neko-neko. Ini juga tiang gawang: satu garis, tanpa hiasan. |
| Cangkang | setengah lingkaran | Tribun. Setengah lingkaran penonton yang selalu ada, kandang maupun tandang. |
| Titik | **kotak** oranye, bukan bulat | Titik akhir kalimat. |

Kenapa kotak, bukan bulat: seluruh situs ini tidak punya sudut membulat. Kotak itu konsisten
dengan panel, tabel, dan tombol. Bulat akan terasa dari template lain.

Kenapa titiknya di bawah-kanan, bukan di tengah: supaya mark selalu "selesai" — tidak menggantung.

## 2. Arti titiknya

Titik menutup kalimat. **Sesudah titik selalu ada kalimat baru.**

Itu seluruh pesannya. Laga selesai, skor ditutup, titik dicetak — lalu besok ada kalimat lagi.
Sosmed yang mati adalah sosmed yang berhenti setelah titik pertama. Mark ini menolak berhenti:
titiknya oranye, bukan abu-abu.

Tagline kerja:

- **Isih urip.** — masih hidup.
- **Sawise titik, ana crita anyar.** — sesudah titik, ada cerita baru.

Bahasa campuran Jawa–Indonesia dipakai sengaja: itu bahasa tribun, bukan bahasa press release.
Kalau ada penutur asli Bojonegoro yang mau memperhalus pilihan katanya, silakan — jangan diubah
jadi bahasa Indonesia formal semua, nanti kehilangan suaranya.

## 3. Warna

| Nama | Hex | Arti |
|---|---|---|
| **Geni** | `#F97316` | Bara. Api kecil yang tidak mati — bukan api besar yang cepat habis. Satu-satunya warna terang; dipakai satu kali per bidang. |
| **Bengi** | `#0B0910` | Malam sebelum lampu stadion nyala. Latar default; bikin oranye dan kapur terbaca tanpa gradasi. |
| **Kapur** | `#F5F2EC` | Garis kapur lapangan. Bukan putih murni — putih murni terasa dingin dan digital. |

Tidak ada warna keempat. Tidak ada gradasi. Kalau butuh aksen tambahan, pakai opasitas kapur,
bukan warna baru.

## 4. Tipografi

- **Barlow Condensed 800**, uppercase — papan skor dan grafis siaran. Semua angka besar (tanggal,
  skor, menit) pakai ini.
- **Lexend 400–800** — teks isi. Lebih lebar, lebih tenang, dipakai untuk kalimat.

Huruf kecil tidak dipakai untuk headline. Mark dan logotype selalu uppercase.

## 5. Aturan pakai

1. Jarak aman 1/6 sisi bidang. Jangan menempel tepi.
2. Tetap kotak. Jangan dibunderkan, jangan ditambah bayangan, jangan diberi gradasi.
3. Oranye hanya satu kali per bidang — entah di titik, entah di satu blok.
4. Mark minimal 24px. Di bawah itu pakai favicon crest, bukan mark ini.
5. Di atas foto: wajib panel `Bengi` di belakangnya. Mark tidak pernah ditumpuk langsung ke foto.
6. Jangan diputar, jangan dicerminkan, jangan diganti warnanya jadi biru/hijau.

## 6. Berkas

| Berkas | Isi |
|---|---|
| `public/img/brand/mark-persibo.svg` | Mark di bidang `Bengi`, untuk avatar/OG/favicon |
| `public/img/brand/mark-persibo-transparent.svg` | Mark tanpa latar, untuk ditumpuk di bidang gelap |
| `public/img/brand/mark-persibo-orange.svg` | Versi balik: bidang oranye, mark `Bengi` |
| `public/img/brand/mark-persibo-mono.svg` | Satu warna, untuk cetak/stempel/watermark |
| `brand/png/mark-dark-{128,192,512,1024}.png` | Ekspor raster dari mark utama |
| `brand/png/mark-orange-1024.png`, `mark-transparent-1024.png` | Ekspor versi balik & transparan |
| `social/out/identitas-wordmark.png` | Logotype `PERSIBO.` + `BOJONEGORO`, 1600×500 |
| `social/out/identitas-umum.png` | Post pengumuman 1080×1080 (wordmark lengkap, tagline, palet) |
| `social/out/identitas-portrait.png` | Versi portrait 1080×1350, komposisi disusun ulang untuk feed |

SVG mark dibuat dari geometri murni (tanpa teks), jadi tajam di ukuran apa pun dan bisa dibuka di
editor vektor mana pun. Logotype dan post dirender lewat `npm run sosmed` (job di
`social/posts.json`), bukan dari file desain terpisah — jadi angkanya selalu sama dengan situs.

## 7. Batas

- Ini identitas situs penggemar, bukan rebranding klub.
- Crest resmi tetap dipakai untuk semua yang menyangkut klub (poster laga, klasemen, profil).
- Jangan pasang mark ini di materi yang mengaku resmi, menjual barang, atau mewakili manajemen.
