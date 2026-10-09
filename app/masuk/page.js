"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { usePengguna } from "@/lib/pengguna";
import KerangkaPublik from "@/components/KerangkaPublik";

function terjemahkanGalatAuth(kode) {
  switch (kode) {
    case "auth/invalid-email":
      return "Format email tidak valid.";
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Email atau kata sandi salah.";
    case "auth/too-many-requests":
      return "Terlalu banyak percobaan gagal. Silakan coba lagi nanti.";
    case "auth/popup-closed-by-user":
      return "Jendela masuk Google ditutup sebelum selesai.";
    default:
      return "Gagal masuk. Periksa kembali email dan kata sandi Anda.";
  }
}

function FormMasuk() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tujuan = searchParams.get("tujuan") || searchParams.get("kembaliKe");
  const { pengguna, memuat } = usePengguna();

  const [email, setEmail] = useState("");
  const [kataSandi, setKataSandi] = useState("");
  const [galat, setGalat] = useState({});
  const [pesan, setPesan] = useState("");
  const [sedangMemproses, setSedangMemproses] = useState(false);

  // Jika sudah masuk, langsung arahkan ke halamannya (PRD 4.1)
  useEffect(() => {
    if (!memuat && pengguna) {
      if (tujuan && (!tujuan.startsWith("/admin") || pengguna.role === "hrd")) {
        router.replace(tujuan);
      } else {
        router.replace(pengguna.role === "hrd" ? "/admin" : "/beranda");
      }
    }
  }, [pengguna, memuat, router, tujuan]);

  async function arahkanSesuaiPeran(uid) {
    try {
      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);
      let role = "karyawan";

      if (userSnap.exists()) {
        role = userSnap.data()?.role || "karyawan";
      } else {
        // Buat profil jika belum ada (PRD 4.1)
        const currentUser = auth.currentUser;
        await setDoc(userRef, {
          nama: currentUser?.displayName || email.split("@")[0] || "Pengguna",
          email: currentUser?.email || email,
          role: "karyawan",
        });
      }

      if (tujuan && (!tujuan.startsWith("/admin") || role === "hrd")) {
        router.replace(tujuan);
      } else {
        router.replace(role === "hrd" ? "/admin" : "/beranda");
      }
    } catch (err) {
      console.error("Gagal memeriksa peran pengguna:", err);
      // Fallback jika Firestore lambat
      router.replace("/beranda");
    }
  }

  async function kirim(e) {
    e.preventDefault();
    const g = {};
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
      const hasil = await signInWithEmailAndPassword(auth, email.trim(), kataSandi);
      await arahkanSesuaiPeran(hasil.user.uid);
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
      await arahkanSesuaiPeran(hasil.user.uid);
    } catch (err) {
      if (err.code !== "auth/popup-closed-by-user") {
        setPesan(terjemahkanGalatAuth(err.code));
      }
      setSedangMemproses(false);
    }
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
            autoComplete="current-password"
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
          {sedangMemproses ? "Memproses..." : "Masuk"}
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
        Belum punya akun?{" "}
        <Link href="/daftar" className="font-semibold text-sedap hover:underline">
          Daftar
        </Link>
      </p>
    </KerangkaPublik>
  );
}

export default function HalamanMasuk() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-redup">Memuat...</div>}>
      <FormMasuk />
    </Suspense>
  );
}

