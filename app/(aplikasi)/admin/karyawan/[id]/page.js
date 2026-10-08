"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useAmbilData } from "@/lib/useAmbilData";
import { ambilKaryawan } from "@/lib/data";
import Memuat from "@/components/Memuat";
import Kosong from "@/components/Kosong";
import Gagal from "@/components/Gagal";

// Rincian Karyawan (PRD 4.7) / Employee detail (PRD 4.7)
export default function HalamanRincianKaryawan() {
  const { id } = useParams();
  const { status, data: k, cobaLagi } = useAmbilData(() => ambilKaryawan(id), [id]);

  return (
    <div className="max-w-lg space-y-6">
      <div>
        <Link href="/admin/karyawan" className="text-sm text-sedap hover:underline">← Data Karyawan</Link>
        <h1 className="text-2xl font-semibold">Rincian Karyawan</h1>
      </div>

      {status === "memuat" && <Memuat />}
      {status === "gagal" && <Gagal onCobaLagi={cobaLagi} />}
      {status === "berhasil" && k === null && <Kosong teks="Karyawan tidak ditemukan" />}
      {/* key={k.id} mengosongkan isian saat pindah ke karyawan lain / key={k.id} resets the form when switching employees */}
      {status === "berhasil" && k && <FormPeran key={k.id} karyawan={k} />}
    </div>
  );
}

// Simpan hanya mengubah tampilan, belum menulis ke Firestore / Save only changes the screen, nothing is written to Firestore
function FormPeran({ karyawan }) {
  const [peran, setPeran] = useState(karyawan.role);
  const [pesan, setPesan] = useState("");

  function simpan(e) {
    e.preventDefault();
    setPesan(`Peran diubah menjadi ${peran === "hrd" ? "HRD" : "Karyawan"} (contoh, belum tersimpan).`);
  }

  return (
    <form onSubmit={simpan} className="space-y-4 rounded-lg bg-panel p-5 shadow-sm">
      <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 text-sm">
        <dt className="text-redup">Nama</dt>
        <dd className="font-medium">{karyawan.nama}</dd>
        <dt className="text-redup">Email</dt>
        <dd>{karyawan.email}</dd>
      </dl>
      <div>
        <label htmlFor="peran" className="mb-1 block text-sm font-medium">Peran</label>
        <select
          id="peran"
          value={peran}
          onChange={(e) => {
            setPeran(e.target.value);
            setPesan("");
          }}
          className="rounded-md border border-gray-300 px-3 py-2"
        >
          <option value="karyawan">Karyawan</option>
          <option value="hrd">HRD</option>
        </select>
      </div>
      <button type="submit" className="rounded-md bg-sedap px-4 py-2 font-medium text-white hover:opacity-90">
        Simpan
      </button>
      {pesan && <p role="status" className="text-sm text-redup">{pesan}</p>}
    </form>
  );
}
