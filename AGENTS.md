# AGENTS.md: Portal HRIS Sedap

Panduan untuk agen AI yang bekerja di repo ini. Baca seluruhnya sebelum mengubah kode.

## Ringkasan Aplikasi

Portal HRIS Sedap adalah aplikasi web presensi dan cuti karyawan untuk usaha katering Sedap. Ada dua peran, `karyawan` dan `hrd`. Kebutuhan produk lengkap ada di `docs/PRD_App_3.md`. Rujuk PRD itu untuk nama menu, alur, validasi, warna, dan struktur data.

Repo ini codebase starter. Semua halaman sudah tampil dengan data contoh. Login, profil di Firestore, pengalihan sesuai peran, dan *route guard* sengaja belum ada. Peserta menambahkannya di Sesi 6.

## Teknologi

| Lapisan | Pilihan |
|---|---|
| Kerangka | Next.js 16 App Router, JavaScript |
| Tampilan | Tailwind CSS v4, font Inter |
| Firebase | Paket `firebase`, baru app dan Firestore yang diinisialisasi |

`cacheComponents` aktif di `next.config.mjs`. Komponen yang membaca alamat lewat `usePathname`, `useSearchParams`, atau `useParams` wajib berada di dalam `<Suspense>`. Layout `app/(aplikasi)/layout.js` sudah membungkus menu dan isi halaman. Komponen baru yang membaca alamat di luar layout itu perlu dibungkus sendiri.

Warna PRD Bab 5 tersedia sebagai kelas Tailwind dengan nama `sedap`, `latar`, `panel`, `teks`, `redup`, `menunggu`, `disetujui`, dan `ditolak`, misalnya `bg-sedap` atau `text-redup`. Definisinya ada di `app/globals.css`.

## Struktur Folder

```
app/
├── layout.js                 font Inter dan metadata
├── page.js                   mengarahkan ke /masuk
├── not-found.js              halaman 404
├── masuk/page.js             belum tersambung ke Auth
├── daftar/page.js            belum tersambung ke Auth
└── (aplikasi)/
    ├── layout.js             BilahAtas + MenuSamping
    ├── beranda/  presensi/  profil/
    ├── cuti/  cuti/baru/  cuti/[id]/
    └── admin/                Dasbor HRD, karyawan, karyawan/[id], cuti, laporan
components/
├── BilahAtas.js  MenuSamping.js
├── Memuat.js  Kosong.js  Gagal.js
├── AksesDitolak.js           belum dipakai
└── PilStatus.js
lib/
├── firebase.js               ekspor app dan db
├── pengguna.js               hook usePengguna() sementara
├── data.js                   fungsi pengambil data
├── dataContoh.js             data contoh berbentuk koleksi Firestore
├── useAmbilData.js           hook keadaan memuat, berhasil, gagal
└── waktu.js                  format tanggal, jam, dan aturan terlambat
docs/PRD_App_3.md
```

Setiap halaman yang mengambil data memakai `useAmbilData()` dan menampilkan empat keadaan: memuat, berhasil, kosong, dan gagal dengan tombol Coba lagi.

## Titik Sambung Sesi 6

| Berkas | Kondisi sekarang | Yang dikerjakan di Sesi 6 |
|---|---|---|
| `lib/pengguna.js` | `usePengguna()` mengembalikan data tetap dengan uid `dina` dan role `hrd` | Diganti dengan data dari Firebase Auth dan dokumen `users/{uid}`. Bentuk keluarannya `{ pengguna, memuat }` dipertahankan |
| `lib/firebase.js` | Mengekspor `app` dan `db` | Firebase Auth ditambahkan di sini |
| `app/masuk/page.js`, `app/daftar/page.js` | Fungsi `kirim()` dan `masukGoogle()` hanya menampilkan pesan "Login belum dipasang" | Disambungkan ke login email dan Google |
| `components/AksesDitolak.js` | Belum dipakai | Ditampilkan *route guard* saat bukan HRD membuka halaman `/admin` |
| `components/Memuat.js` | Dipakai saat data contoh dimuat | Ditampilkan *route guard* selama keadaan masuk dan role masih dibaca |
| `components/MenuSamping.js` | Menu HRD tampil bila `role` bernilai `hrd` | Tidak perlu diubah. Menu otomatis benar setelah `usePengguna()` memakai data asli |

Halaman di bawah `app/(aplikasi)/admin/` sengaja tidak memeriksa peran. Jangan menambahkan pemeriksaan peran di halaman. Penjagaan dipasang sebagai *route guard*.

## Aturan

1. Nama koleksi `users`, `presensi`, dan `pengajuan_cuti`. Nama field mengikuti PRD 7.1: `nama`, `email`, `role`, `karyawanId`, `tanggal`, `jamMasuk`, `jamPulang`, `tanggalMulai`, `tanggalSelesai`, `alasan`, `status`, `catatanHrd`, dan `diajukanPada`. Jangan membuat nama lain.
2. ID dokumen `users` sama dengan uid Firebase Authentication. Nilai `role` hanya `karyawan` atau `hrd`. Nilai `status` hanya `menunggu`, `disetujui`, atau `ditolak`.
3. Kata sandi tidak pernah disimpan di Firestore. Kata sandi hanya ada di Firebase Authentication.
4. Halaman mengambil data lewat fungsi di `lib/data.js`, bukan memanggil Firestore langsung. Bila sebuah fungsi diganti dengan query Firestore, bentuk keluarannya dipertahankan.
5. Jangan mengubah tampilan halaman yang tidak diminta.
6. Bahasa antarmuka Indonesia. Komentar kode singkat dan menjelaskan alasan.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
