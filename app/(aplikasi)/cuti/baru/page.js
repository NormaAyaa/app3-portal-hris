"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import KepalaHalaman from "@/components/KepalaHalaman";
import Ikon from "@/components/Ikon";

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
    <div className="max-w-2xl space-y-8">
      <KepalaHalaman judul="Ajukan Cuti" keterangan="Isi tanggal dan alasan. HRD memutuskan pengajuanmu di halaman Persetujuan Cuti." warna="kunyit" ikon="tambah">
        <Link href="/cuti" className="tombol-kedua">
          <Ikon nama="kembali" />
          Daftar Cuti
        </Link>
      </KepalaHalaman>

      <form onSubmit={kirim} noValidate className="kartu space-y-5 p-6">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="tanggalMulai" className="label">Tanggal mulai</label>
            <input id="tanggalMulai" name="tanggalMulai" type="date" value={isian.tanggalMulai} onChange={ubah} className="isian tabular-nums" />
            {galat.tanggalMulai && <p className="galat">{galat.tanggalMulai}</p>}
          </div>
          <div>
            <label htmlFor="tanggalSelesai" className="label">Tanggal selesai</label>
            <input id="tanggalSelesai" name="tanggalSelesai" type="date" value={isian.tanggalSelesai} onChange={ubah} className="isian tabular-nums" />
            {galat.tanggalSelesai && <p className="galat">{galat.tanggalSelesai}</p>}
          </div>
        </div>
        <div>
          <label htmlFor="alasan" className="label">Alasan</label>
          <textarea id="alasan" name="alasan" rows={4} value={isian.alasan} onChange={ubah} className="isian" />
          {galat.alasan && <p className="galat">{galat.alasan}</p>}
        </div>

        <button type="submit" disabled={tersimpan} className="tombol-utama px-8 py-3 text-lg">
          Kirim
        </button>
        {tersimpan && (
          <p role="status" className="rounded-xl border-2 border-disetujui bg-disetujui/15 p-3 font-bold text-tinta">
            Tersimpan (contoh). Kembali ke Daftar Cuti...
          </p>
        )}
      </form>
    </div>
  );
}
