# Portal HRIS Sedap

Codebase starter App 3 untuk Sesi 6 Bootcamp AI Web Programming. Aplikasi ini mencatat presensi dan cuti karyawan Sedap. Semua halaman sudah tampil dengan data contoh. Login, pengalihan sesuai peran, dan *route guard* sengaja belum dipasang karena itu bahan praktik Sesi 6.

Kebutuhan produk lengkap ada di [docs/PRD_App_3.md](docs/PRD_App_3.md).

## Cara Menjalankan

1. Pasang paket.

   ```bash
   npm install
   ```

2. Salin `.env.local.example` menjadi `.env.local`, lalu isi dengan konfigurasi proyek Firebase.

   ```bash
   cp .env.local.example .env.local
   ```

   Di Command Prompt Windows, pakai `copy .env.local.example .env.local`.

3. Jalankan server pengembangan, lalu buka http://localhost:3000.

   ```bash
   npm run dev
   ```

Alamat `/` langsung mengarah ke `/masuk`. Halaman lain bisa dibuka langsung dari alamatnya walaupun belum masuk.

## Daftar Halaman

| Halaman | Alamat | Kondisi di starter |
|---|---|---|
| Masuk | `/masuk` | Formulir dan tombol Google tampil, belum tersambung |
| Daftar | `/daftar` | Formulir dan tombol Google tampil, belum tersambung |
| Beranda | `/beranda` | Data contoh |
| Presensi Saya | `/presensi?bulan=2026-09` | Bulan tersimpan di alamat, tombol Catat Masuk dan Catat Pulang tidak menyimpan |
| Cuti Saya | `/cuti` | Data contoh, urutan terbaru |
| Ajukan Cuti | `/cuti/baru` | Validasi tanggal, tidak menyimpan |
| Rincian Cuti | `/cuti/C001` | Nomor yang tidak ada menampilkan "Pengajuan tidak ditemukan" |
| Profil | `/profil` | Nama bisa diubah di tampilan |
| Dasbor HRD | `/admin` | Data contoh, tanpa pemeriksaan peran |
| Data Karyawan | `/admin/karyawan` | Pencarian nama |
| Rincian Karyawan | `/admin/karyawan/dina` | Peran bisa diubah di tampilan |
| Persetujuan Cuti | `/admin/cuti?status=menunggu` | Saringan status tersimpan di alamat, Setujui dan Tolak tidak menyimpan |
| Laporan | `/admin/laporan?bulan=2026-09` | Bulan tersimpan di alamat |
| Tidak Ditemukan | alamat lain | Tombol kembali ke Beranda |

Semua halaman di bawah `/admin` sengaja bisa dibuka siapa saja. Penjagaannya dikerjakan di Sesi 6.

## Data Contoh

Starter belum membaca atau menulis Firestore. Semua halaman mengambil data dari `lib/data.js`, yang membaca `lib/dataContoh.js` dengan jeda 400 ms supaya layar Memuat terlihat.

Pengguna yang sedang "masuk" berasal dari `usePengguna()` di `lib/pengguna.js`. Nilainya sementara: uid `dina` dan peran `hrd`, supaya halaman karyawan berisi data Dina dan semua menu HRD tampil.

| Nama | Email | Peran |
|---|---|---|
| Dina | dina@sedap.id | karyawan |
| Nisa | nisa@sedap.id | karyawan |
| Wulan | wulan@sedap.id | hrd |

Lima karyawan lain melengkapi daftar: Rama, Sari, Budi, Ayu, dan Joko.

## Yang Dikerjakan di Sesi 6

1. Menambahkan Firebase Authentication di `lib/firebase.js`.
2. Menyambungkan halaman Masuk dan Daftar ke login email dan Google.
3. Membuat dokumen `users/{uid}` saat pengguna pertama kali masuk.
4. Membuat akun HRD pertama lewat Firebase MCP.
5. Mengganti `usePengguna()` dengan data dari Firebase Auth dan dokumen `users/{uid}`.
6. Mengarahkan pengguna sesuai peran setelah masuk.
7. Memasang *route guard* untuk halaman karyawan dan halaman HRD dengan komponen `Memuat` dan `AksesDitolak`.
