"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, updateProfile } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { usePengguna } from "@/lib/pengguna";
import KerangkaPublik from "@/components/KerangkaPublik";

function terjemahkanGalatAuth(kode) {
  switch (kode) {
    case "auth/email-already-in-use":
      return "Email sudah terdaftar. Silakan masuk atau gunakan email lain.";
    case "auth/invalid-email":
      return "Format email tidak valid.";
    case "auth/weak-password":
      return "Kata sandi minimal 6 karakter.";
    case "auth/popup-closed-by-user":
      return "Jendela masuk Google ditutup sebelum selesai.";
    default:
      return "Gagal mendaftar. Silakan coba beberapa saat lagi.";
  }
}

export default function HalamanDaftar() {
  const router = useRouter();
  const { pengguna, memuat } = usePengguna();

  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [kataSandi, setKataSandi] = useState("");
  const [galat, setGalat] = useState({});
  const [pesan, setPesan] = useState("");
  const [sedangMemproses, setSedangMemproses] = useState(false);

  // Jika sudah masuk, arahkan ke halamannya (PRD 4.1)
  useEffect(() => {
    if (!memuat && pengguna) {
      router.replace(pengguna.role === "hrd" ? "/admin" : "/beranda");
    }
  }, [pengguna, memuat, router]);

  async function kirim(e) {
    e.preventDefault();
    const g = {};
    if (!nama.trim()) g.nama = "Nama wajib diisi.";
    if (!email.trim()) g.email = "Email wajib diisi.";
    if (kataSandi.length < 6) g.kataSandi = "Kata sandi minimal 6 karakter.";
    setGalat(g);
    if (Object.keys(g).length > 0) {
      setPesan("");
      return;
    }

    setSedangMemproses(true);
    setPesan("");

    try {
      const hasil = await createUserWithEmailAndPassword(auth, email.trim(), kataSandi);
      const user = hasil.user;

      // Update profil akun di Firebase Auth
      await updateProfile(user, { displayName: nama.trim() });

      // Buat dokumen profil di Firestore (PRD 2.2, 7.1: otomatis berperan karyawan)
      await setDoc(doc(db, "users", user.uid), {
        nama: nama.trim(),
        email: email.trim(),
        role: "karyawan",
      });

      router.replace("/beranda");
    } catch (err) {
      setPesan(terjemahkanGalatAuth(err.code));
      setSedangMemproses(false);
    }
  }

  async function masukGoogle() {
    setSedangMemproses(true);
    setPesan("");
    try {
      const provider = new GoogleAuthProvider();
      const hasil = await signInWithPopup(auth, provider);
      const user = hasil.user;

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      let role = "karyawan";

      if (userSnap.exists()) {
        role = userSnap.data()?.role || "karyawan";
      } else {
        // Akun baru via Google otomatis role karyawan (PRD 2.2)
        await setDoc(userRef, {
          nama: user.displayName || "Karyawan",
          email: user.email,
          role: "karyawan",
        });
      }

      router.replace(role === "hrd" ? "/admin" : "/beranda");
    } catch (err) {
      if (err.code !== "auth/popup-closed-by-user") {
        setPesan(terjemahkanGalatAuth(err.code));
      }
      setSedangMemproses(false);
    }
  }

  return (
    <KerangkaPublik judul="Daftar">
      <form onSubmit={kirim} noValidate className="space-y-4">
        <div>
          <label htmlFor="nama" className="label">Nama</label>
          <input
            id="nama"
            autoComplete="name"
            value={nama}
            disabled={sedangMemproses}
            onChange={(e) => setNama(e.target.value)}
            className="isian"
          />
          {galat.nama && <p className="galat">{galat.nama}</p>}
        </div>
        <div>
          <label htmlFor="email" className="label">Email</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            disabled={sedangMemproses}
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
            autoComplete="new-password"
            value={kataSandi}
            disabled={sedangMemproses}
            onChange={(e) => setKataSandi(e.target.value)}
            className="isian"
          />
          {galat.kataSandi && <p className="galat">{galat.kataSandi}</p>}
        </div>
        <button
          type="submit"
          disabled={sedangMemproses}
          className="tombol-utama w-full py-3 text-lg disabled:opacity-60"
        >
          {sedangMemproses ? "Mendaftarkan..." : "Daftar"}
        </button>
      </form>

      <div className="my-5 flex items-center gap-3 text-sm font-bold text-redup">
        <span className="h-0.5 flex-1 bg-tinta/15" />
        atau
        <span className="h-0.5 flex-1 bg-tinta/15" />
      </div>

      <button
        type="button"
        onClick={masukGoogle}
        disabled={sedangMemproses}
        className="tombol-kedua w-full py-3 disabled:opacity-60"
      >
        <span className="grid h-6 w-6 place-items-center rounded-full bg-kunyit text-sm font-bold text-tinta">G</span>
        Masuk dengan Google
      </button>

      {pesan && (
        <p role="status" className="mt-5 rounded-xl border border-menunggu bg-menunggu/15 p-3 text-sm font-bold text-tinta">
          {pesan}
        </p>
      )}

      <p className="mt-6 text-center text-sm font-medium text-redup">
        Sudah punya akun?{" "}
        <Link href="/masuk" className="font-semibold text-sedap hover:underline">
          Masuk
        </Link>
      </p>
    </KerangkaPublik>
  );
}

