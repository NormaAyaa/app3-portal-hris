"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useAmbilData } from "@/lib/useAmbilData";
import { ambilRekapBulanan } from "@/lib/data";
import { bulanIni } from "@/lib/waktu";
import Memuat from "@/components/Memuat";
import Kosong from "@/components/Kosong";
import Gagal from "@/components/Gagal";

// Laporan bulanan (PRD 4.9). Tanpa pemeriksaan peran, lihat Sesi 6 / Monthly report (PRD 4.9). No role check, see Session 6
export default function HalamanLaporan() {
  const router = useRouter();

  // Bulan disimpan di alamat (?bulan=2026-09) / Month lives in the URL (?bulan=2026-09)
  const dariAlamat = useSearchParams().get("bulan");
  const bulan = /^\d{4}-\d{2}$/.test(dariAlamat ?? "") ? dariAlamat : bulanIni();

  const { status, data, cobaLagi } = useAmbilData(() => ambilRekapBulanan(bulan), [bulan]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Laporan</h1>

      <div className="rounded-lg bg-panel p-5 shadow-sm">
        <label className="mb-4 block text-sm font-medium">
          Bulan
          <input
            type="month"
            value={bulan}
            onChange={(e) => e.target.value && router.replace(`/admin/laporan?bulan=${e.target.value}`)}
            className="ml-2 rounded-md border border-gray-300 px-2 py-1"
          />
        </label>

        {status === "memuat" && <Memuat />}
        {status === "gagal" && <Gagal onCobaLagi={cobaLagi} />}
        {status === "berhasil" && data.length === 0 && <Kosong teks="Belum ada karyawan terdaftar." />}
        {status === "berhasil" && data.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm tabular-nums">
              <thead className="border-b border-gray-200 text-redup">
                <tr>
                  <th className="py-2 pr-4 font-medium">Nama</th>
                  <th className="py-2 pr-4 text-right font-medium">Hari Hadir</th>
                  <th className="py-2 pr-4 text-right font-medium">Terlambat</th>
                  <th className="py-2 text-right font-medium">Cuti Disetujui</th>
                </tr>
              </thead>
              <tbody>
                {data.map((r) => (
                  <tr key={r.karyawanId} className="border-b border-gray-100">
                    <td className="py-2 pr-4 font-medium">{r.nama}</td>
                    <td className="py-2 pr-4 text-right">{r.hariHadir}</td>
                    <td className="py-2 pr-4 text-right">{r.terlambat}</td>
                    <td className="py-2 text-right">{r.cutiDisetujui} hari</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
