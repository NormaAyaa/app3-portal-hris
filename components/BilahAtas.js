"use client";

import { usePengguna } from "@/lib/pengguna";

export default function BilahAtas() {
  const { pengguna } = usePengguna();

  return (
    <header className="flex items-center justify-between bg-sedap px-4 py-3 text-white md:px-6">
      <span className="text-lg font-semibold">Portal HRIS</span>
      {pengguna && (
        <div className="text-right leading-tight">
          <div className="text-sm font-medium">{pengguna.nama}</div>
          <div className="text-xs text-white/80">{pengguna.role === "hrd" ? "HRD" : "Karyawan"}</div>
        </div>
      )}
    </header>
  );
}
