"use client";

import Link from "next/link";
import { usePengguna } from "@/lib/pengguna";

export default function BilahAtas() {
  const { pengguna } = usePengguna();

  return (
    <header className="flex items-center justify-between gap-4 border-b-4 border-tinta bg-sedap px-4 py-3 text-white md:px-6">
      <Link href="/beranda" className="flex items-center gap-2.5">
        <span className="grid h-9 w-9 place-items-center rounded-lg border-2 border-tinta bg-kunyit text-lg font-black text-tinta shadow-keras-kecil">
          S
        </span>
        <span className="text-xl font-black tracking-tight">Portal HRIS</span>
      </Link>
      {pengguna && (
        <div className="flex items-center gap-3">
          <div className="text-right leading-tight">
            <div className="text-sm font-bold">{pengguna.nama}</div>
            <div className="text-xs font-semibold text-kunyit">{pengguna.role === "hrd" ? "HRD" : "Karyawan"}</div>
          </div>
          {/* Inisial nama sebagai avatar / Name initial as the avatar */}
          <span className="grid h-10 w-10 place-items-center rounded-full border-2 border-tinta bg-krem font-black text-tinta">
            {pengguna.nama.charAt(0)}
          </span>
        </div>
      )}
    </header>
  );
}
