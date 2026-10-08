"use client";

import { useState } from "react";
import Link from "next/link";
import { useAmbilData } from "@/lib/useAmbilData";
import { ambilSemuaKaryawan } from "@/lib/data";
import Memuat from "@/components/Memuat";
import Kosong from "@/components/Kosong";
import Gagal from "@/components/Gagal";

// Data Karyawan (PRD 4.7). Tanpa pemeriksaan peran, lihat Sesi 6 / Employee data (PRD 4.7). No role check, see Session 6
export default function HalamanDataKaryawan() {
  const { status, data, cobaLagi } = useAmbilData(ambilSemuaKaryawan);
  const [cari, setCari] = useState("");

  const tampil = data ? data.filter((k) => k.nama.toLowerCase().includes(cari.trim().toLowerCase())) : [];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Data Karyawan</h1>

      <div className="rounded-lg bg-panel p-5 shadow-sm">
        <label htmlFor="cari" className="sr-only">Cari nama</label>
        <input
          id="cari"
          type="search"
          placeholder="Cari nama..."
          value={cari}
          onChange={(e) => setCari(e.target.value)}
          className="mb-4 w-full max-w-xs rounded-md border border-gray-300 px-3 py-2"
        />

        {status === "memuat" && <Memuat />}
        {status === "gagal" && <Gagal onCobaLagi={cobaLagi} />}
        {status === "berhasil" && tampil.length === 0 && (
          <Kosong teks={cari ? `Tidak ada karyawan bernama "${cari}".` : "Belum ada karyawan terdaftar."} />
        )}
        {status === "berhasil" && tampil.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-gray-200 text-redup">
                <tr>
                  <th className="py-2 pr-4 font-medium">Nama</th>
                  <th className="py-2 pr-4 font-medium">Email</th>
                  <th className="py-2 font-medium">Peran</th>
                </tr>
              </thead>
              <tbody>
                {tampil.map((k) => (
                  <tr key={k.id} className="border-b border-gray-100">
                    <td className="py-2 pr-4">
                      <Link href={`/admin/karyawan/${k.id}`} className="font-medium text-sedap hover:underline">{k.nama}</Link>
                    </td>
                    <td className="py-2 pr-4 text-redup">{k.email}</td>
                    <td className="py-2">{k.role === "hrd" ? "HRD" : "Karyawan"}</td>
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
