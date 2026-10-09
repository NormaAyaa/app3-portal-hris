"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { usePengguna } from "@/lib/pengguna";
import Memuat from "@/components/Memuat";
import AksesDitolak from "@/components/AksesDitolak";

/**
 * Route guard untuk area aplikasi (PRD 6.2).
 * 1. Pengguna belum masuk diarahkan ke /masuk.
 * 2. Selama status login dibaca, menampilkan indikator Memuat.
 * 3. Halaman /admin yang dibuka pengguna bukan HRD menampilkan AksesDitolak.
 */
export default function PenjagaRute({ children }) {
  const { pengguna, memuat } = usePengguna();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Alihkan ke /masuk hanya setelah selesai memuat dan akun tidak ditemukan (PRD 6.1, 6.2)
    if (!memuat && !pengguna) {
      router.replace(`/masuk?tujuan=${encodeURIComponent(pathname)}`);
    }
  }, [pengguna, memuat, pathname, router]);

  // Tampilkan layar memuat selama auth masih dibaca atau sedang dialihkan
  if (memuat || !pengguna) {
    return <Memuat />;
  }

  // Route guard halaman admin: tolak jika bukan HRD (PRD 6.2)
  const mencobaBukaAdmin = pathname === "/admin" || pathname.startsWith("/admin/");
  if (mencobaBukaAdmin && pengguna.role !== "hrd") {
    return <AksesDitolak />;
  }

  return children;
}
