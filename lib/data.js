/**
 * Semua halaman mengambil data lewat fungsi di sini, bukan langsung dari Firestore.
 * Nanti diganti dengan query Firestore. Bentuk keluarannya sengaja sama, jadi halaman tidak perlu diubah.
 *
 * Every page fetches data through these functions, never straight from Firestore.
 * Later replaced with Firestore queries. The output shape stays the same, so pages need no changes.
 */
import { users, presensi, pengajuan_cuti } from "./dataContoh";
import { keTanggal, terlambat } from "./waktu";

// Jeda 400 ms meniru waktu tunggu jaringan supaya layar Memuat terlihat / 400 ms delay mimics network latency so the loading screen shows
const jeda = () => new Promise((selesai) => setTimeout(selesai, 400));

const namaKaryawan = (id) => users.find((u) => u.id === id)?.nama ?? "(tidak dikenal)";
const terbaruDulu = (a, b) => b.diajukanPada - a.diajukanPada;

// Nanti diganti dengan query Firestore. / Later replaced with a Firestore query.
// bulan berformat "2026-09" / bulan is formatted "2026-09"
export async function ambilPresensi(karyawanId, bulan) {
  await jeda();
  return presensi
    .filter((p) => p.karyawanId === karyawanId && p.tanggal.startsWith(bulan))
    .sort((a, b) => b.tanggal.localeCompare(a.tanggal));
}

// Nanti diganti dengan query Firestore. / Later replaced with a Firestore query.
export async function ambilPresensiTanggal(karyawanId, tanggal) {
  await jeda();
  return presensi.find((p) => p.karyawanId === karyawanId && p.tanggal === tanggal) ?? null;
}

// Nanti diganti dengan query Firestore. / Later replaced with a Firestore query.
export async function ambilPengajuanCuti(karyawanId) {
  await jeda();
  return pengajuan_cuti.filter((c) => c.karyawanId === karyawanId).sort(terbaruDulu);
}

// Nanti diganti dengan query Firestore. Hasil null berarti nomor tidak ada. / Later replaced with a Firestore query. null means the number does not exist.
export async function ambilSatuPengajuan(id) {
  await jeda();
  const c = pengajuan_cuti.find((c) => c.id === id);
  return c ? { ...c, nama: namaKaryawan(c.karyawanId) } : null;
}

// Nanti diganti dengan query Firestore. status kosong atau "semua" = tanpa saringan. / Later replaced with a Firestore query. Empty or "semua" status = no filter.
export async function ambilSemuaPengajuan(status) {
  await jeda();
  return pengajuan_cuti
    .filter((c) => !status || status === "semua" || c.status === status)
    .sort(terbaruDulu)
    .map((c) => ({ ...c, nama: namaKaryawan(c.karyawanId) }));
}

// Nanti diganti dengan query Firestore. / Later replaced with a Firestore query.
export async function ambilSemuaKaryawan() {
  await jeda();
  return [...users].sort((a, b) => a.nama.localeCompare(b.nama));
}

// Nanti diganti dengan query Firestore. / Later replaced with a Firestore query.
export async function ambilKaryawan(id) {
  await jeda();
  return users.find((u) => u.id === id) ?? null;
}

/**
 * Angka untuk Dasbor HRD. Nanti diganti dengan query Firestore yang menghitung
 * (getCountFromServer), bukan menarik semua dokumen lalu dihitung di peramban.
 *
 * Numbers for the HRD dashboard. Later replaced with Firestore count queries
 * (getCountFromServer), not by fetching every document and counting in the browser.
 */
export async function ambilRingkasanDasbor(tanggal) {
  await jeda();
  const hariIni = presensi.filter((p) => p.tanggal === tanggal);
  return {
    hadir: hariIni.length,
    terlambat: hariIni.filter((p) => terlambat(p.jamMasuk)).length,
    cutiMenunggu: pengajuan_cuti.filter((c) => c.status === "menunggu").length,
    jumlahKaryawan: users.length,
  };
}

/**
 * Rekap per karyawan untuk Laporan (PRD 4.9). Cuti Disetujui = jumlah hari cuti
 * disetujui yang jatuh di bulan itu. Nanti diganti dengan query Firestore.
 *
 * Per-employee summary for the Report page (PRD 4.9). Cuti Disetujui = number of
 * approved leave days that fall in that month. Later replaced with a Firestore query.
 */
export async function ambilRekapBulanan(bulan) {
  await jeda();
  return [...users]
    .sort((a, b) => a.nama.localeCompare(b.nama))
    .map((u) => {
      const hadir = presensi.filter((p) => p.karyawanId === u.id && p.tanggal.startsWith(bulan));
      let cutiDisetujui = 0;
      for (const c of pengajuan_cuti) {
        if (c.karyawanId !== u.id || c.status !== "disetujui") continue;
        for (let d = new Date(c.tanggalMulai); d <= c.tanggalSelesai; d.setDate(d.getDate() + 1)) {
          if (keTanggal(d).startsWith(bulan)) cutiDisetujui++;
        }
      }
      return {
        karyawanId: u.id,
        nama: u.nama,
        hariHadir: hadir.length,
        terlambat: hadir.filter((p) => terlambat(p.jamMasuk)).length,
        cutiDisetujui,
      };
    });
}
