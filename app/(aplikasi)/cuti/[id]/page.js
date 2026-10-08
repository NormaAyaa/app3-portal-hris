"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useAmbilData } from "@/lib/useAmbilData";
import { ambilSatuPengajuan } from "@/lib/data";
import { formatTanggal, formatJam, lamaHari } from "@/lib/waktu";
import Memuat from "@/components/Memuat";
import Gagal from "@/components/Gagal";
import Kosong from "@/components/Kosong";
import PilStatus from "@/components/PilStatus";

// Rincian Cuti (PRD 4.4.2) / Leave detail (PRD 4.4.2)
export default function HalamanRincianCuti() {
  const { id } = useParams();
  const { status, data: c, cobaLagi } = useAmbilData(() => ambilSatuPengajuan(id), [id]);

  return (
    <div className="max-w-lg space-y-6">
      <div>
        <Link href="/cuti" className="text-sm text-sedap hover:underline">← Daftar Cuti</Link>
        <h1 className="text-2xl font-semibold">Rincian Cuti</h1>
      </div>

      {status === "memuat" && <Memuat />}
      {status === "gagal" && <Gagal onCobaLagi={cobaLagi} />}
      {status === "berhasil" && c === null && <Kosong teks="Pengajuan tidak ditemukan" />}
      {status === "berhasil" && c && (
        <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 rounded-lg bg-panel p-5 text-sm shadow-sm tabular-nums">
          <dt className="text-redup">Nomor</dt>
          <dd className="font-medium">{c.id}</dd>
          <dt className="text-redup">Tanggal</dt>
          <dd>
            {formatTanggal(c.tanggalMulai)} – {formatTanggal(c.tanggalSelesai)} ({lamaHari(c.tanggalMulai, c.tanggalSelesai)} hari)
          </dd>
          <dt className="text-redup">Alasan</dt>
          <dd>{c.alasan}</dd>
          <dt className="text-redup">Status</dt>
          <dd><PilStatus status={c.status} /></dd>
          <dt className="text-redup">Catatan HRD</dt>
          <dd>{c.catatanHrd || <span className="text-redup">Belum ada catatan</span>}</dd>
          <dt className="text-redup">Diajukan</dt>
          <dd>{formatTanggal(c.diajukanPada)}, {formatJam(c.diajukanPada)}</dd>
        </dl>
      )}
    </div>
  );
}
