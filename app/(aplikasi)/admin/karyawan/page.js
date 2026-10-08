"use client";

import { useState } from "react";
import Link from "next/link";
import { useAmbilData } from "@/lib/useAmbilData";
import { ambilSemuaKaryawan } from "@/lib/data";
import KepalaHalaman from "@/components/KepalaHalaman";
import Ikon from "@/components/Ikon";
import Memuat from "@/components/Memuat";
import Kosong from "@/components/Kosong";
import Gagal from "@/components/Gagal";

// Data Karyawan (PRD 4.7). Tanpa pemeriksaan peran, lihat Sesi 6 / Employee data (PRD 4.7). No role check, see Session 6
export default function HalamanDataKaryawan() {
  const { status, data, cobaLagi } = useAmbilData(ambilSemuaKaryawan);
  const [cari, setCari] = useState("");

  const tampil = data ? data.filter((k) => k.nama.toLowerCase().includes(cari.trim().toLowerCase())) : [];

  return (
    <div className="space-y-8">
      <KepalaHalaman judul="Data Karyawan" keterangan="Klik nama karyawan untuk melihat rincian dan mengubah perannya." warna="tinta" ikon="tim" />

      <section className="kartu overflow-hidden">
        <div className="border-b border-tinta/10 p-5">
          <label htmlFor="cari" className="sr-only">Cari nama</label>
          <div className="relative max-w-sm">
            <Ikon nama="cari" className="pointer-events-none absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-redup" />
            <input
              id="cari"
              type="search"
              placeholder="Cari nama karyawan"
              value={cari}
              onChange={(e) => setCari(e.target.value)}
              className="isian pl-10"
            />
          </div>
        </div>

        {status === "memuat" && <Memuat />}
        {status === "gagal" && (
          <div className="p-5">
            <Gagal onCobaLagi={cobaLagi} />
          </div>
        )}
        {status === "berhasil" && tampil.length === 0 && (
          <div className="p-5">
            <Kosong teks={cari ? `Tidak ada karyawan bernama "${cari}". Periksa ejaannya.` : "Belum ada karyawan terdaftar."} />
          </div>
        )}
        {status === "berhasil" && tampil.length > 0 && (
          <div className="overflow-x-auto">
            <table className="tabel">
              <thead>
                <tr>
                  <th>Nama</th>
                  <th>Email</th>
                  <th>Peran</th>
                </tr>
              </thead>
              <tbody>
                {tampil.map((k) => (
                  <tr key={k.id} className="transition hover:bg-krem">
                    <td>
                      <Link href={`/admin/karyawan/${k.id}`} className="flex items-center gap-3 font-bold text-tinta hover:text-sedap">
                        <span className="grid h-9 w-9 place-items-center rounded-full border border-tinta/10 bg-krem text-sm">
                          {k.nama.charAt(0)}
                        </span>
                        {k.nama}
                      </Link>
                    </td>
                    <td className="font-medium text-redup">{k.email}</td>
                    <td>
                      <span
                        className={`rounded-full border border-tinta/10 px-3 py-0.5 text-xs font-semibold ${
                          k.role === "hrd" ? "bg-terong text-white" : "bg-panel text-tinta"
                        }`}
                      >
                        {k.role === "hrd" ? "HRD" : "Karyawan"}
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
