"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { usePengguna } from "@/lib/pengguna";
import { useAmbilData } from "@/lib/useAmbilData";
import { ambilPresensi } from "@/lib/data";
import { bulanIni, formatBulan, formatJam, formatTanggal, terlambat } from "@/lib/waktu";
import Memuat from "@/components/Memuat";
import Kosong from "@/components/Kosong";
import Gagal from "@/components/Gagal";

// Presensi Saya (PRD 4.3) / My Attendance (PRD 4.3)
export default function HalamanPresensi() {
  const { pengguna } = usePengguna();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Bulan disimpan di alamat (?bulan=2026-09) supaya tetap terpilih saat dimuat ulang / Month lives in the URL (?bulan=2026-09) so it survives a reload
  const dariAlamat = searchParams.get("bulan");
  const bulan = /^\d{4}-\d{2}$/.test(dariAlamat ?? "") ? dariAlamat : bulanIni();

  const { status, data, cobaLagi } = useAmbilData(() => ambilPresensi(pengguna.uid, bulan), [pengguna.uid, bulan]);

  // Catat Masuk/Pulang hanya mengubah tampilan, belum menyimpan / Clock in/out only changes the screen, nothing is saved yet
  const [jamMasuk, setJamMasuk] = useState(null);
  const [jamPulang, setJamPulang] = useState(null);

  const jumlahTerlambat = data ? data.filter((p) => terlambat(p.jamMasuk)).length : 0;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Presensi Saya</h1>

      <div className="rounded-lg bg-panel p-5 shadow-sm">
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setJamMasuk(new Date())}
            disabled={jamMasuk !== null}
            className="rounded-md bg-sedap px-4 py-2 font-medium text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Catat Masuk
          </button>
          <button
            type="button"
            onClick={() => setJamPulang(new Date())}
            disabled={jamMasuk === null || jamPulang !== null}
            className="rounded-md border border-sedap px-4 py-2 font-medium text-sedap hover:bg-sedap/5 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Catat Pulang
          </button>
        </div>
        <p className="mt-3 text-sm text-redup tabular-nums">
          {jamMasuk === null && "Belum presensi hari ini."}
          {jamMasuk !== null && `Masuk pukul ${formatJam(jamMasuk)}${terlambat(jamMasuk) ? " (terlambat)" : ""}.`}
          {jamPulang !== null && ` Pulang pukul ${formatJam(jamPulang)}.`}
          {jamMasuk !== null && " Contoh tampilan, belum tersimpan."}
        </p>
      </div>

      <div className="rounded-lg bg-panel p-5 shadow-sm">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <label className="text-sm font-medium">
            Bulan
            <input
              type="month"
              value={bulan}
              onChange={(e) => e.target.value && router.replace(`/presensi?bulan=${e.target.value}`)}
              className="ml-2 rounded-md border border-gray-300 px-2 py-1"
            />
          </label>
          {status === "berhasil" && (
            <p className="text-sm text-redup tabular-nums">
              Hadir <strong className="text-teks">{data.length}</strong> hari · Terlambat{" "}
              <strong className="text-teks">{jumlahTerlambat}</strong> hari
            </p>
          )}
        </div>

        {status === "memuat" && <Memuat />}
        {status === "gagal" && <Gagal onCobaLagi={cobaLagi} />}
        {status === "berhasil" && data.length === 0 && <Kosong teks={`Belum ada catatan presensi di ${formatBulan(bulan)}.`} />}
        {status === "berhasil" && data.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm tabular-nums">
              <thead className="border-b border-gray-200 text-redup">
                <tr>
                  <th className="py-2 pr-4 font-medium">Tanggal</th>
                  <th className="py-2 pr-4 font-medium">Jam Masuk</th>
                  <th className="py-2 pr-4 font-medium">Jam Pulang</th>
                  <th className="py-2 font-medium">Keterangan</th>
                </tr>
              </thead>
              <tbody>
                {data.map((p) => (
                  <tr key={p.id} className="border-b border-gray-100">
                    <td className="py-2 pr-4">{formatTanggal(p.tanggal)}</td>
                    <td className="py-2 pr-4">{formatJam(p.jamMasuk)}</td>
                    <td className="py-2 pr-4">{formatJam(p.jamPulang)}</td>
                    <td className={`py-2 ${terlambat(p.jamMasuk) ? "font-medium text-ditolak" : "text-redup"}`}>
                      {terlambat(p.jamMasuk) ? "Terlambat" : "Tepat waktu"}
                    </td>
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
