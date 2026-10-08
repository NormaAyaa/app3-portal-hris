"use client";

import Link from "next/link";
import { usePengguna } from "@/lib/pengguna";
import { useAmbilData } from "@/lib/useAmbilData";
import { ambilPresensiTanggal, ambilPengajuanCuti } from "@/lib/data";
import { tanggalHariIni, formatJam, formatTanggal } from "@/lib/waktu";
import Memuat from "@/components/Memuat";
import Gagal from "@/components/Gagal";

// Beranda karyawan (PRD 4.2) / Employee home (PRD 4.2)
export default function HalamanBeranda() {
  const { pengguna } = usePengguna();

  // Dua data diambil bersamaan / Both pieces of data are fetched together
  const { status, data, cobaLagi } = useAmbilData(async () => {
    // Tanggal dihitung di sini, bukan saat render, supaya tidak terkunci di tanggal build / Computed here, not during render, so it is not frozen at build date
    const hariIni = tanggalHariIni();
    const [presensi, cuti] = await Promise.all([
      ambilPresensiTanggal(pengguna.uid, hariIni),
      ambilPengajuanCuti(pengguna.uid),
    ]);
    return { hariIni, presensi, menunggu: cuti.filter((c) => c.status === "menunggu").length };
  }, [pengguna.uid]);

  let teksPresensi = "Belum presensi hari ini";
  if (data?.presensi?.jamPulang) teksPresensi = "Sudah pulang";
  else if (data?.presensi) teksPresensi = `Sudah masuk pukul ${formatJam(data.presensi.jamMasuk)}`;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Halo, {pengguna.nama}</h1>
        {data && <p className="text-redup tabular-nums">{formatTanggal(data.hariIni)}</p>}
      </div>

      {status === "memuat" && <Memuat />}
      {status === "gagal" && <Gagal onCobaLagi={cobaLagi} />}
      {status === "berhasil" && (
        <div className="grid gap-4 sm:grid-cols-2">
          <Link href="/presensi" className="rounded-lg bg-panel p-5 shadow-sm hover:ring-2 hover:ring-sedap/30">
            <p className="text-sm text-redup">Presensi hari ini</p>
            <p className="mt-1 text-lg font-semibold tabular-nums">{teksPresensi}</p>
          </Link>
          <Link href="/cuti" className="rounded-lg bg-panel p-5 shadow-sm hover:ring-2 hover:ring-sedap/30">
            <p className="text-sm text-redup">Cuti menunggu</p>
            <p className="mt-1 text-lg font-semibold">{data.menunggu} pengajuan</p>
          </Link>
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <Link href="/presensi" className="rounded-md bg-sedap px-4 py-2 font-medium text-white hover:opacity-90">
          Catat Masuk
        </Link>
        <Link href="/cuti/baru" className="rounded-md border border-sedap px-4 py-2 font-medium text-sedap hover:bg-sedap/5">
          Ajukan Cuti
        </Link>
      </div>
    </div>
  );
}
