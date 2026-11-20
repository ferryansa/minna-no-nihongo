# Minna no Nihongo

Aplikasi belajar Minna no Nihongo I (bab 1–25) dan II (bab 26–50): Kotoba (tabel + flashcard),
かず・かつよう (bilangan & konjugasi, hanya Minna I), Bunpou, dan Kanji.

**Cara pakai:** buka `index.html` di browser. Tidak perlu server, tidak perlu instalasi.

## Susunan folder

```
index.html                 kerangka halaman (header, dock, lembar pengaturan) + daftar skrip
css/
  main.css                 titik masuk: mengimpor semua CSS berurutan (urutan = urutan cascade)
  base/
    variables.css          warna & font (ubah warna Minna I di sini)
    layout.css             reset, body, lebar konten, [hidden], footer kredit
  components/              bagian UI yang dipakai di banyak halaman
    header.css             judul, ilustrasi Fuji, bar progres, pemilih buku
    buttons.css            tombol, chip, kontrol, label dwibahasa
    table.css              tabel kosakata & kotak centang hafal
    flashcard.css          kartu flashcard & kartu latihan
    deck-picker.css        pemilih bab untuk deck flashcard
    sheet.css              lembar pengaturan (panel dari bawah)
    dock.css               dock bawah: tab halaman, tab mode, pemilih bab, tombol ⚙
  pages/                   gaya khusus satu halaman
    bunpou.css             Bunpou (Materi, Ringkasan, Partikel)
    kanji.css              Kanji (daftar, kartu, menulis)
    kazu-katsuyou.css      かず・かつよう
  themes/
    book2-blue.css         tema biru Minna II (menukar variabel warna)
js/
  core/                    fondasi, dimuat paling awal / paling akhir
    book-theme.js          menentukan Minna I/II (URL hash atau localStorage)
    utils.js               fungsi bantu global: $, $$, esc
    mount.js               memasang template + isi Bunpou; setBook() untuk ganti buku
    finish.js              penutup: membersihkan hash lompatan di URL
  components/              perilaku UI bersama
    book-selector.js       dropdown Minna I/II
    dock-settings.js       tombol ⚙ tunggal di dock
    dock-autohide.js       dock menyingkir saat scroll ke bawah
  pages/                   logika tiap halaman
    kotoba.js              Kotoba: tabel, flashcard, hafalan, dock
    kazu-katsuyou.js       かず・かつよう: bilangan, waktu, kata bantu bilangan, konjugasi, latihan
    bunpou.js              Bunpou: materi, ringkasan, partikel, lompat antar bab
    kanji.js               Kanji: daftar, kartu, cara menulis
  data/                    isi materi (edit di sini untuk menambah/mengoreksi)
    kotoba-data.js         kosakata per bab, kedua buku
    kanji-data.js          daftar kanji + data goresan (KanjiVG)
    bunpou-minna-1.js      materi Bunpou bab 1–25 (HTML sebagai teks)
    bunpou-minna-2.js      materi Bunpou bab 26–50 (HTML sebagai teks)
```

## Aturan penamaan
- Nama file memakai bahasa Inggris atau romaji Jepang: `kotoba`, `bunpou`, `kanji`, `kazu-katsuyou`.
- Folder menunjukkan peran: `core` (fondasi), `components` (bagian UI), `pages` (satu halaman),
  `data` (isi materi), `themes` (warna per buku).
- Satu halaman = satu file CSS + satu file JS dengan nama sama (`pages/bunpou.css` ↔ `pages/bunpou.js`).

## Mengubah sesuatu
| Ingin mengubah… | Edit file |
|---|---|
| menambah/mengoreksi kosakata | `js/data/kotoba-data.js` |
| menambah/mengoreksi kanji | `js/data/kanji-data.js` |
| materi Bunpou | `js/data/bunpou-minna-1.js` / `bunpou-minna-2.js` |
| warna Minna I / Minna II | `css/base/variables.css` / `css/themes/book2-blue.css` |
| dock & tombol bawah | `css/components/dock.css` |
| aktifkan tab かず・かつよう di Minna II | hapus 2 aturan `html[data-book="2"]` di `css/components/dock.css` |

Catatan untuk `bunpou-minna-*.js`: isinya HTML yang disimpan sebagai teks.
Jangan memakai tanda backtick (`` ` ``) atau `${ }` di dalamnya.

## Catatan teknis
- Ganti buku memuat ulang halaman; progres hafalan disimpan terpisah per buku di localStorage dan tidak terhapus.
- Urutan `@import` di `css/main.css` dan urutan `<script>` di `index.html` penting; jangan diacak.
- Data goresan kanji: KanjiVG © Ulrich Apel, CC BY-SA 3.0.
