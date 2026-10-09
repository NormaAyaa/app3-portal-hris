"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "./firebase";

const PenggunaContext = createContext({
  pengguna: null,
  memuat: true,
  keluar: async () => {},
});

/**
 * Penyedia konteks data akun masuk dan profil Firestore users/{uid}.
 * Memastikan semua komponen berbagi satu status otentikasi tanpa langganan ganda.
 */
export function PenggunaProvider({ children }) {
  const [pengguna, setPengguna] = useState(null);
  const [memuat, setMemuat] = useState(true);

  useEffect(() => {
    let unsubsDoc = null;

    const unsubsAuth = onAuthStateChanged(auth, (user) => {
      if (unsubsDoc) {
        unsubsDoc();
        unsubsDoc = null;
      }

      if (!user) {
        setPengguna(null);
        setMemuat(false);
        return;
      }

      // Langganan pembaruan dokumen users/{uid} secara waktu nyata
      const userRef = doc(db, "users", user.uid);
      unsubsDoc = onSnapshot(
        userRef,
        (snap) => {
          if (snap.exists()) {
            const data = snap.data();
            setPengguna({
              uid: user.uid,
              nama: data.nama || user.displayName || "Pengguna",
              email: data.email || user.email || "",
              role: data.role || "karyawan",
            });
          } else {
            // Jika dokumen belum terbuat (misal proses pendaftaran baru berjalan)
            setPengguna({
              uid: user.uid,
              nama: user.displayName || "Pengguna",
              email: user.email || "",
              role: "karyawan",
            });
          }
          setMemuat(false);
        },
        (error) => {
          console.error("Gagal membaca profil pengguna:", error);
          setPengguna({
            uid: user.uid,
            nama: user.displayName || "Pengguna",
            email: user.email || "",
            role: "karyawan",
          });
          setMemuat(false);
        }
      );
    });

    return () => {
      if (unsubsDoc) unsubsDoc();
      unsubsAuth();
    };
  }, []);

  async function keluar() {
    await signOut(auth);
  }

  return (
    <PenggunaContext.Provider value={{ pengguna, memuat, keluar }}>
      {children}
    </PenggunaContext.Provider>
  );
}

/**
 * Hook usePengguna() mengembalikan { pengguna, memuat, keluar }.
 * Digunakan oleh bilah atas, menu samping, profil, dan route guard.
 */
export function usePengguna() {
  return useContext(PenggunaContext);
}

