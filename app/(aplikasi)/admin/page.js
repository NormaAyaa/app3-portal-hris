"use client";

import Link from "next/link";
import { useAmbilData } from "@/lib/useAmbilData";
import { ambilRingkasanDasbor } from "@/lib/data";
import { tanggalHariIni, formatTanggal } from "@/lib/waktu";
import Memuat from "@/components/Memuat";
import Gagal from "@/components/Gagal";

/**
 * Dasbor HRD (PRD 4.6). SENGAJA tanpa pemeriksaan peran; route guard dikerjakan di Sesi 6.
 *
 * HRD dashboard (PRD 4.6). DELIBERATELY has no role check; the route guard is built in Session 6.
 */
export default function HalamanDasborHrd() {
  const { status, data, cobaLagi } = useAmbilData(async () => {
    // Tanggal dihitung di sini supaya tidak terkunci di tanggal build / Computed here so it is not frozen at build date
    const hariIni = tanggalHariIni();
    return { hariIni, ...(await ambilRingkasanDasbor(hariIni)) };
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Dasbor HRD</h1>
        {data && <p className="text-redup tabular-nums">{formatTanggal(data.hariIni)}</p>}
      </div>

      {status === "memuat" && <Memuat />}
      {status === "gagal" && <Gagal onCobaLagi={cobaLagi} />}
      {status === "berhasil" && (
        <div className="grid gap-4 sm:grid-cols-3">
          <Link href="/admin/laporan" className="rounded-lg bg-panel p-5 shadow-sm hover:ring-2 hover:ring-sedap/30">
            <p className="text-sm text-redup">Kehadiran hari ini</p>
            <p className="mt-1 text-3xl font-semibold tabular-nums">{data.hadir}</p>
            <p className="text-sm text-redup tabular-nums">{data.terlambat} terlambat</p>
          </Link>
          <Link href="/admin/cuti?status=menunggu" className="rounded-lg bg-panel p-5 shadow-sm hover:ring-2 hover:ring-sedap/30">
            <p className="text-sm text-redup">Cuti menunggu</p>
            <p className="mt-1 text-3xl font-semibold tabular-nums">{data.cutiMenunggu}</p>
            <p className="text-sm text-redup">perlu diputuskan</p>
          </Link>
          <Link href="/admin/karyawan" className="rounded-lg bg-panel p-5 shadow-sm hover:ring-2 hover:ring-sedap/30">
            <p className="text-sm text-redup">Karyawan</p>
            <p className="mt-1 text-3xl font-semibold tabular-nums">{data.jumlahKaryawan}</p>
            <p className="text-sm text-redup">terdaftar</p>
          </Link>
        </div>
      )}
    </div>
  );
}
