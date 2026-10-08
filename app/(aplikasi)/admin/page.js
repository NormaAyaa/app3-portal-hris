"use client";

import Link from "next/link";
import { useAmbilData } from "@/lib/useAmbilData";
import { ambilRingkasanDasbor } from "@/lib/data";
import { tanggalHariIni, formatTanggal } from "@/lib/waktu";
import KepalaHalaman from "@/components/KepalaHalaman";
import Ikon from "@/components/Ikon";
import Memuat from "@/components/Memuat";
import Gagal from "@/components/Gagal";

/**
 * Dasbor HRD (PRD 4.6). SENGAJA tanpa pemeriksaan peran; route guard dikerjakan di Sesi 6.
 * Kartu Cuti menunggu dibuat paling besar karena memutuskan cuti adalah tugas utama HRD pagi hari.
 *
 * HRD dashboard (PRD 4.6). DELIBERATELY has no role check; the route guard is built in Session 6.
 * The pending-leave card is the largest because deciding leave is HRD's main morning task.
 */
export default function HalamanDasborHrd() {
  const { status, data, cobaLagi } = useAmbilData(async () => {
    // Tanggal dihitung di sini supaya tidak terkunci di tanggal build / Computed here so it is not frozen at build date
    const hariIni = tanggalHariIni();
    return { hariIni, ...(await ambilRingkasanDasbor(hariIni)) };
  });

  return (
    <div className="space-y-8">
      <KepalaHalaman judul="Dasbor HRD" keterangan={data ? formatTanggal(data.hariIni) : "Kondisi hari ini"} warna="tinta" ikon="dasbor" />

      {status === "memuat" && <Memuat />}
      {status === "gagal" && <Gagal onCobaLagi={cobaLagi} />}
      {status === "berhasil" && (
        <div className="grid gap-6 md:grid-cols-2">
          <Link
            href="/admin/cuti?status=menunggu"
            className="kartu group flex flex-col justify-between gap-6 bg-kunyit p-8 transition hover:-translate-y-1 md:row-span-2"
          >
            <div>
              <p className="text-sm font-extrabold tracking-wide text-tinta uppercase">Cuti menunggu</p>
              <p className="mt-2 text-8xl leading-none font-black text-tinta tabular-nums">{data.cutiMenunggu}</p>
              <p className="mt-2 text-lg font-bold text-tinta">pengajuan perlu diputuskan</p>
            </div>
            <span className="tombol-utama self-start group-hover:-translate-y-0.5">
              <Ikon nama="centang" />
              Putuskan sekarang
            </span>
          </Link>

          <Link href="/admin/laporan" className="kartu group flex items-center gap-5 bg-sedap p-6 text-white transition hover:-translate-y-1">
            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-xl border-2 border-tinta bg-white text-sedap">
              <Ikon nama="jam" className="h-7 w-7" />
            </span>
            <div>
              <p className="text-sm font-extrabold tracking-wide uppercase opacity-90">Kehadiran hari ini</p>
              <p className="text-4xl font-black tabular-nums">{data.hadir}</p>
              <p className="font-bold text-kunyit tabular-nums">{data.terlambat} terlambat</p>
            </div>
          </Link>

          <Link href="/admin/karyawan" className="kartu group flex items-center gap-5 bg-terong p-6 text-white transition hover:-translate-y-1">
            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-xl border-2 border-tinta bg-white text-terong">
              <Ikon nama="tim" className="h-7 w-7" />
            </span>
            <div>
              <p className="text-sm font-extrabold tracking-wide uppercase opacity-90">Karyawan</p>
              <p className="text-4xl font-black tabular-nums">{data.jumlahKaryawan}</p>
              <p className="font-bold opacity-90">terdaftar</p>
            </div>
          </Link>
        </div>
      )}
    </div>
  );
}
