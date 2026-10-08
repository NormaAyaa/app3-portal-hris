"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const kosong = { tanggalMulai: "", tanggalSelesai: "", alasan: "" };

// Ajukan Cuti (PRD 4.4.1). Belum menyimpan ke Firestore / Submit leave (PRD 4.4.1). Not saved to Firestore yet
export default function HalamanAjukanCuti() {
  const router = useRouter();
  const [isian, setIsian] = useState(kosong);
  const [galat, setGalat] = useState({});
  const [tersimpan, setTersimpan] = useState(false);

  const ubah = (e) => setIsian({ ...isian, [e.target.name]: e.target.value });

  function kirim(e) {
    e.preventDefault();
    const g = {};
    if (!isian.tanggalMulai) g.tanggalMulai = "Tanggal mulai wajib diisi.";
    if (!isian.tanggalSelesai) g.tanggalSelesai = "Tanggal selesai wajib diisi.";
    // Format "2026-10-07" bisa dibandingkan langsung sebagai teks / "2026-10-07" strings compare correctly as text
    else if (isian.tanggalMulai && isian.tanggalSelesai < isian.tanggalMulai)
      g.tanggalSelesai = "Tanggal selesai harus sama atau setelah tanggal mulai";
    if (!isian.alasan.trim()) g.alasan = "Alasan wajib diisi.";
    setGalat(g);
    if (Object.keys(g).length > 0) return;

    setTersimpan(true);
    setTimeout(() => {
      setIsian(kosong);
      setTersimpan(false);
      router.push("/cuti");
    }, 1500);
  }

  return (
    <div className="max-w-lg space-y-6">
      <div>
        <Link href="/cuti" className="text-sm text-sedap hover:underline">← Daftar Cuti</Link>
        <h1 className="text-2xl font-semibold">Ajukan Cuti</h1>
      </div>

      <form onSubmit={kirim} noValidate className="space-y-4 rounded-lg bg-panel p-5 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="tanggalMulai" className="mb-1 block text-sm font-medium">Tanggal mulai</label>
            <input
              id="tanggalMulai"
              name="tanggalMulai"
              type="date"
              value={isian.tanggalMulai}
              onChange={ubah}
              className="w-full rounded-md border border-gray-300 px-3 py-2 tabular-nums"
            />
            {galat.tanggalMulai && <p className="mt-1 text-sm text-ditolak">{galat.tanggalMulai}</p>}
          </div>
          <div>
            <label htmlFor="tanggalSelesai" className="mb-1 block text-sm font-medium">Tanggal selesai</label>
            <input
              id="tanggalSelesai"
              name="tanggalSelesai"
              type="date"
              value={isian.tanggalSelesai}
              onChange={ubah}
              className="w-full rounded-md border border-gray-300 px-3 py-2 tabular-nums"
            />
            {galat.tanggalSelesai && <p className="mt-1 text-sm text-ditolak">{galat.tanggalSelesai}</p>}
          </div>
        </div>
        <div>
          <label htmlFor="alasan" className="mb-1 block text-sm font-medium">Alasan</label>
          <textarea
            id="alasan"
            name="alasan"
            rows={3}
            value={isian.alasan}
            onChange={ubah}
            className="w-full rounded-md border border-gray-300 px-3 py-2"
          />
          {galat.alasan && <p className="mt-1 text-sm text-ditolak">{galat.alasan}</p>}
        </div>

        <button
          type="submit"
          disabled={tersimpan}
          className="rounded-md bg-sedap px-4 py-2 font-medium text-white hover:opacity-90 disabled:opacity-50"
        >
          Kirim
        </button>
        {tersimpan && (
          <p role="status" className="rounded-md bg-disetujui/15 p-3 text-sm font-medium text-disetujui">
            Tersimpan (contoh)
          </p>
        )}
      </form>
    </div>
  );
}
