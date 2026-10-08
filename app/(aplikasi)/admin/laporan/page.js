"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useAmbilData } from "@/lib/useAmbilData";
import { ambilRekapBulanan } from "@/lib/data";
import { bulanIni, formatBulan } from "@/lib/waktu";
import KepalaHalaman from "@/components/KepalaHalaman";
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

  // Hari hadir terbanyak jadi patokan panjang batang / The highest attendance sets the full bar length
  const terbanyak = data ? Math.max(1, ...data.map((r) => r.hariHadir)) : 1;

  return (
    <div className="space-y-8">
      <KepalaHalaman judul="Laporan" keterangan={`Rekap kehadiran ${formatBulan(bulan)}. Ganti bulan untuk melihat rekap lain.`} warna="tinta" ikon="grafik">
        <label className="flex items-center gap-3 rounded-xl border-2 border-tinta bg-panel px-3 py-1.5 font-bold text-tinta">
          Bulan
          <input
            type="month"
            value={bulan}
            onChange={(e) => e.target.value && router.replace(`/admin/laporan?bulan=${e.target.value}`)}
            className="rounded-lg border-2 border-tinta/25 px-2 py-1"
          />
        </label>
      </KepalaHalaman>

      <section className="kartu overflow-hidden">
        {status === "memuat" && <Memuat />}
        {status === "gagal" && (
          <div className="p-5">
            <Gagal onCobaLagi={cobaLagi} />
          </div>
        )}
        {status === "berhasil" && data.length === 0 && (
          <div className="p-5">
            <Kosong teks="Belum ada karyawan terdaftar." />
          </div>
        )}
        {status === "berhasil" && data.length > 0 && (
          <div className="overflow-x-auto">
            <table className="tabel">
              <thead>
                <tr>
                  <th>Nama</th>
                  <th className="w-2/5">Hari Hadir</th>
                  <th className="text-right">Terlambat</th>
                  <th className="text-right">Cuti Disetujui</th>
                </tr>
              </thead>
              <tbody>
                {data.map((r) => (
                  <tr key={r.karyawanId} className="transition hover:bg-krem">
                    <td className="font-black text-tinta">{r.nama}</td>
                    <td>
                      <div className="flex items-center gap-3">
                        <span className="w-6 text-right font-black">{r.hariHadir}</span>
                        <span className="h-3 flex-1 overflow-hidden rounded-full bg-latar">
                          <span className="block h-full rounded-full bg-sedap" style={{ width: `${(r.hariHadir / terbanyak) * 100}%` }} />
                        </span>
                      </div>
                    </td>
                    <td className={`text-right font-black ${r.terlambat > 0 ? "text-red-700" : "text-redup"}`}>{r.terlambat}</td>
                    <td className="text-right">
                      <span className={r.cutiDisetujui > 0 ? "rounded-lg bg-kunyit px-2 py-0.5 font-black text-tinta" : "font-bold text-redup"}>
                        {r.cutiDisetujui} hari
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
