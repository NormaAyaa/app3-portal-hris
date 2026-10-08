"use client";

import { useState } from "react";
import Link from "next/link";

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
    <main className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-sm rounded-lg bg-panel p-6 shadow-sm">
        <p className="text-sm font-semibold text-sedap">Portal HRIS Sedap</p>
        <h1 className="mb-6 text-2xl font-semibold">Masuk</h1>

        <form onSubmit={kirim} noValidate className="space-y-4">
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-sedap focus:outline-none"
            />
            {galat.email && <p className="mt-1 text-sm text-ditolak">{galat.email}</p>}
          </div>
          <div>
            <label htmlFor="kataSandi" className="mb-1 block text-sm font-medium">Kata sandi</label>
            <input
              id="kataSandi"
              type="password"
              value={kataSandi}
              onChange={(e) => setKataSandi(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-sedap focus:outline-none"
            />
            {galat.kataSandi && <p className="mt-1 text-sm text-ditolak">{galat.kataSandi}</p>}
          </div>
          <button type="submit" className="w-full rounded-md bg-sedap py-2 font-medium text-white hover:opacity-90">
            Masuk
          </button>
        </form>

        <div className="my-4 flex items-center gap-3 text-sm text-redup">
          <span className="h-px flex-1 bg-gray-200" />
          atau
          <span className="h-px flex-1 bg-gray-200" />
        </div>

        <button
          type="button"
          onClick={masukGoogle}
          className="w-full rounded-md border border-gray-300 py-2 font-medium hover:bg-latar"
        >
          Masuk dengan Google
        </button>

        {pesan && <p role="status" className="mt-4 rounded-md bg-menunggu/15 p-3 text-sm text-amber-800">{pesan}</p>}

        <p className="mt-6 text-center text-sm text-redup">
          Belum punya akun?{" "}
          <Link href="/daftar" className="font-medium text-sedap hover:underline">Daftar</Link>
        </p>
      </div>
    </main>
  );
}
