"use client";

import { useState } from "react";
import Link from "next/link";
import KerangkaPublik from "@/components/KerangkaPublik";

const PESAN_BELUM_DIPASANG = "Login belum dipasang. Dikerjakan di Sesi 6.";

/**
 * Halaman Masuk (PRD 4.1). SENGAJA belum tersambung ke Firebase Auth.
 * Di Sesi 6 peserta mengganti isi fungsi kirim() dan masukGoogle().
 *
 * Sign-in page (PRD 4.1). DELIBERATELY not wired to Firebase Auth yet.
 * In Session 6 participants replace the bodies of kirim() and masukGoogle().
 */
export default function HalamanMasuk() {
  const [email, setEmail] = useState("");
  const [kataSandi, setKataSandi] = useState("");
  const [galat, setGalat] = useState({});
  const [pesan, setPesan] = useState("");

  function kirim(e) {
    e.preventDefault();
    // Validasi tampilan saja / Display-only validation
    const g = {};
    if (!email.trim()) g.email = "Email wajib diisi.";
    if (kataSandi.length < 6) g.kataSandi = "Kata sandi minimal 6 karakter.";
    setGalat(g);
    if (Object.keys(g).length > 0) {
      setPesan("");
      return;
    }
    setPesan(PESAN_BELUM_DIPASANG);
  }

  function masukGoogle() {
    setPesan(PESAN_BELUM_DIPASANG);
  }

  return (
    <KerangkaPublik judul="Masuk">
      <form onSubmit={kirim} noValidate className="space-y-4">
        <div>
          <label htmlFor="email" className="label">Email</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="isian"
          />
          {galat.email && <p className="galat">{galat.email}</p>}
        </div>
        <div>
          <label htmlFor="kataSandi" className="label">Kata sandi</label>
          <input
            id="kataSandi"
            type="password"
            autoComplete="current-password"
            value={kataSandi}
            onChange={(e) => setKataSandi(e.target.value)}
            className="isian"
          />
          {galat.kataSandi && <p className="galat">{galat.kataSandi}</p>}
        </div>
        <button type="submit" className="tombol-utama w-full py-3 text-lg">
          Masuk
        </button>
      </form>

      <div className="my-5 flex items-center gap-3 text-sm font-bold text-redup">
        <span className="h-0.5 flex-1 bg-tinta/15" />
        atau
        <span className="h-0.5 flex-1 bg-tinta/15" />
      </div>

      <button type="button" onClick={masukGoogle} className="tombol-kedua w-full py-3">
        <span className="grid h-6 w-6 place-items-center rounded-full bg-kunyit text-sm font-black text-tinta">G</span>
        Masuk dengan Google
      </button>

      {pesan && (
        <p role="status" className="mt-5 rounded-xl border-2 border-menunggu bg-menunggu/15 p-3 text-sm font-bold text-tinta">
          {pesan}
        </p>
      )}

      <p className="mt-6 text-center text-sm font-medium text-redup">
        Belum punya akun?{" "}
        <Link href="/daftar" className="font-extrabold text-sedap underline decoration-kunyit decoration-4 underline-offset-4">
          Daftar
        </Link>
      </p>
    </KerangkaPublik>
  );
}
