"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePengguna } from "@/lib/pengguna";
import { useAmbilData } from "@/lib/useAmbilData";
import { ambilPengajuanCuti } from "@/lib/data";
import { formatTanggal, lamaHari } from "@/lib/waktu";
import Memuat from "@/components/Memuat";
import Kosong from "@/components/Kosong";
import Gagal from "@/components/Gagal";
import PilStatus from "@/components/PilStatus";

// Daftar Cuti (PRD 4.4.2). Urutan terbaru sudah diatur di lib/data.js / Leave list (PRD 4.4.2). Newest-first order comes from lib/data.js
export default function HalamanCuti() {
  const { pengguna } = usePengguna();
  const router = useRouter();
  const { status, data, cobaLagi } = useAmbilData(() => ambilPengajuanCuti(pengguna.uid), [pengguna.uid]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Cuti Saya</h1>
        <Link href="/cuti/baru" className="rounded-md bg-sedap px-4 py-2 font-medium text-white hover:opacity-90">
          Ajukan Cuti
        </Link>
      </div>

      <div className="rounded-lg bg-panel p-5 shadow-sm">
        {status === "memuat" && <Memuat />}
        {status === "gagal" && <Gagal onCobaLagi={cobaLagi} />}
        {status === "berhasil" && data.length === 0 && <Kosong teks="Kamu belum pernah mengajukan cuti." />}
        {status === "berhasil" && data.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm tabular-nums">
              <thead className="border-b border-gray-200 text-redup">
                <tr>
                  <th className="py-2 pr-4 font-medium">Nomor</th>
                  <th className="py-2 pr-4 font-medium">Tanggal</th>
                  <th className="py-2 pr-4 font-medium">Lama</th>
                  <th className="py-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.map((c) => (
                  // Seluruh baris bisa diklik; tautan di Nomor untuk pengguna papan ketik / Whole row is clickable; the Nomor link serves keyboard users
                  <tr
                    key={c.id}
                    onClick={() => router.push(`/cuti/${c.id}`)}
                    className="cursor-pointer border-b border-gray-100 hover:bg-latar"
                  >
                    <td className="py-2 pr-4">
                      <Link href={`/cuti/${c.id}`} className="font-medium text-sedap hover:underline">{c.id}</Link>
                    </td>
                    <td className="py-2 pr-4">
                      {formatTanggal(c.tanggalMulai)} – {formatTanggal(c.tanggalSelesai)}
                    </td>
                    <td className="py-2 pr-4">{lamaHari(c.tanggalMulai, c.tanggalSelesai)} hari</td>
                    <td className="py-2"><PilStatus status={c.status} /></td>
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
