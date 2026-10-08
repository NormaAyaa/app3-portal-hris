"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAmbilData } from "@/lib/useAmbilData";
import { ambilSemuaPengajuan } from "@/lib/data";
import { formatTanggal, lamaHari } from "@/lib/waktu";
import Memuat from "@/components/Memuat";
import Kosong from "@/components/Kosong";
import Gagal from "@/components/Gagal";
import PilStatus from "@/components/PilStatus";

const saringan = [
  { nilai: "semua", label: "Semua" },
  { nilai: "menunggu", label: "Menunggu" },
  { nilai: "disetujui", label: "Disetujui" },
  { nilai: "ditolak", label: "Ditolak" },
];

// Persetujuan Cuti (PRD 4.8). Tanpa pemeriksaan peran, lihat Sesi 6 / Leave approval (PRD 4.8). No role check, see Session 6
export default function HalamanPersetujuanCuti() {
  // Saringan disimpan di alamat (?status=menunggu) supaya tautannya bisa dibagikan / Filter lives in the URL (?status=menunggu) so the link can be shared
  const dariAlamat = useSearchParams().get("status");
  const status = saringan.some((s) => s.nilai === dariAlamat) ? dariAlamat : "semua";

  const { status: keadaan, data, cobaLagi } = useAmbilData(() => ambilSemuaPengajuan(status), [status]);

  // Keputusan dan catatan hanya disimpan di tampilan / Decisions and notes are only kept on screen
  const [keputusan, setKeputusan] = useState({});
  const [catatan, setCatatan] = useState({});
  const [pesan, setPesan] = useState("");

  function putuskan(c, statusBaru) {
    setKeputusan({ ...keputusan, [c.id]: statusBaru });
    setPesan(`${c.id} milik ${c.nama} ${statusBaru} (contoh, belum tersimpan).`);
  }

  // Pengajuan yang baru diputuskan keluar dari saringan Menunggu / Freshly decided requests drop out of the Menunggu filter
  const tampil = (data ?? [])
    .map((c) => ({ ...c, status: keputusan[c.id] ?? c.status, catatanHrd: catatan[c.id] ?? c.catatanHrd }))
    .filter((c) => status === "semua" || c.status === status);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Persetujuan Cuti</h1>

      <div className="rounded-lg bg-panel p-5 shadow-sm">
        <div className="mb-4 flex flex-wrap gap-2">
          {saringan.map((s) => (
            <Link
              key={s.nilai}
              href={s.nilai === "semua" ? "/admin/cuti" : `/admin/cuti?status=${s.nilai}`}
              className={`rounded-full px-4 py-1 text-sm ${
                status === s.nilai ? "bg-sedap font-medium text-white" : "bg-latar text-teks hover:bg-gray-200"
              }`}
            >
              {s.label}
            </Link>
          ))}
        </div>

        {pesan && <p role="status" className="mb-4 rounded-md bg-latar p-3 text-sm">{pesan}</p>}

        {keadaan === "memuat" && <Memuat />}
        {keadaan === "gagal" && <Gagal onCobaLagi={cobaLagi} />}
        {keadaan === "berhasil" && tampil.length === 0 && <Kosong teks="Tidak ada pengajuan dengan status ini." />}
        {keadaan === "berhasil" && tampil.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm tabular-nums">
              <thead className="border-b border-gray-200 text-redup">
                <tr>
                  <th className="py-2 pr-4 font-medium">Nama</th>
                  <th className="py-2 pr-4 font-medium">Tanggal</th>
                  <th className="py-2 pr-4 font-medium">Lama</th>
                  <th className="py-2 pr-4 font-medium">Alasan</th>
                  <th className="py-2 pr-4 font-medium">Status</th>
                  <th className="py-2 pr-4 font-medium">Catatan HRD</th>
                  <th className="py-2 font-medium">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {tampil.map((c) => (
                  <tr key={c.id} className="border-b border-gray-100 align-top">
                    <td className="py-2 pr-4 font-medium">{c.nama}</td>
                    <td className="py-2 pr-4 whitespace-nowrap">
                      {formatTanggal(c.tanggalMulai)} – {formatTanggal(c.tanggalSelesai)}
                    </td>
                    <td className="py-2 pr-4 whitespace-nowrap">{lamaHari(c.tanggalMulai, c.tanggalSelesai)} hari</td>
                    <td className="py-2 pr-4">{c.alasan}</td>
                    <td className="py-2 pr-4"><PilStatus status={c.status} /></td>
                    <td className="py-2 pr-4">
                      {c.status === "menunggu" ? (
                        <textarea
                          aria-label={`Catatan HRD untuk ${c.id}`}
                          rows={2}
                          value={c.catatanHrd}
                          onChange={(e) => setCatatan({ ...catatan, [c.id]: e.target.value })}
                          className="w-48 rounded-md border border-gray-300 px-2 py-1"
                        />
                      ) : (
                        c.catatanHrd || <span className="text-redup">—</span>
                      )}
                    </td>
                    <td className="py-2">
                      {c.status === "menunggu" && (
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => putuskan(c, "disetujui")}
                            className="rounded-md bg-disetujui px-3 py-1 text-white hover:opacity-90"
                          >
                            Setujui
                          </button>
                          <button
                            type="button"
                            onClick={() => putuskan(c, "ditolak")}
                            className="rounded-md bg-ditolak px-3 py-1 text-white hover:opacity-90"
                          >
                            Tolak
                          </button>
                        </div>
                      )}
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
