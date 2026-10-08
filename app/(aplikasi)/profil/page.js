"use client";

import { useState } from "react";
import { usePengguna } from "@/lib/pengguna";

// Profil (PRD 4.5). Nama bisa diubah di tampilan, belum disimpan / Profile (PRD 4.5). Name is editable on screen, not saved yet
export default function HalamanProfil() {
  const { pengguna } = usePengguna();
  const [nama, setNama] = useState(pengguna.nama);
  const [pesan, setPesan] = useState("");

  function simpan(e) {
    e.preventDefault();
    setPesan(nama.trim() ? "Nama diperbarui (contoh, belum tersimpan)." : "Nama wajib diisi.");
  }

  return (
    <div className="max-w-lg space-y-6">
      <h1 className="text-2xl font-semibold">Profil</h1>

      <form onSubmit={simpan} className="space-y-4 rounded-lg bg-panel p-5 shadow-sm">
        <div>
          <label htmlFor="nama" className="mb-1 block text-sm font-medium">Nama</label>
          <input
            id="nama"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>
        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium">Email</label>
          <input id="email" value={pengguna.email} readOnly className="w-full rounded-md border border-gray-200 bg-latar px-3 py-2 text-redup" />
        </div>
        <div>
          <label htmlFor="peran" className="mb-1 block text-sm font-medium">Peran</label>
          <input
            id="peran"
            value={pengguna.role === "hrd" ? "HRD" : "Karyawan"}
            readOnly
            className="w-full rounded-md border border-gray-200 bg-latar px-3 py-2 text-redup"
          />
        </div>
        <button type="submit" className="rounded-md bg-sedap px-4 py-2 font-medium text-white hover:opacity-90">
          Simpan
        </button>
        {pesan && <p role="status" className="text-sm text-redup">{pesan}</p>}
      </form>
    </div>
  );
}
