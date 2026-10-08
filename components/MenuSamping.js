"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePengguna } from "@/lib/pengguna";

// Menu HRD hanya untuk role "hrd" (PRD 3.1) / HRD menu is only for the "hrd" role (PRD 3.1)
const menuHrd = [
  { href: "/admin", label: "Dasbor HRD" },
  { href: "/admin/karyawan", label: "Data Karyawan" },
  { href: "/admin/cuti", label: "Persetujuan Cuti" },
  { href: "/admin/laporan", label: "Laporan" },
];

function TautanMenu({ href, label, aktif }) {
  return (
    <Link
      href={href}
      className={`block rounded-md px-3 py-2 text-sm ${
        aktif ? "bg-sedap font-medium text-white" : "text-teks hover:bg-latar"
      }`}
    >
      {label}
    </Link>
  );
}

export default function MenuSamping() {
  const pathname = usePathname();
  const { pengguna } = usePengguna();

  // Tanpa exact, menu induk ikut aktif di halaman anaknya, mis. /admin/karyawan/abc / Without exact, a parent menu also lights up on its child pages, e.g. /admin/karyawan/abc
  const aktif = (href, exact = false) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(href + "/");

  // /cuti/baru punya menu sendiri, jadi Daftar Cuti tidak ikut aktif di sana / /cuti/baru has its own menu item, so Daftar Cuti must not light up there
  const diCuti = aktif("/cuti");
  const diAjukanCuti = aktif("/cuti/baru", true);

  return (
    <nav className="space-y-1 p-3">
      <TautanMenu href="/beranda" label="Beranda" aktif={aktif("/beranda")} />
      <TautanMenu href="/presensi" label="Presensi Saya" aktif={aktif("/presensi")} />

      {/* <details> = menu buka-tutup bawaan peramban / <details> = the browser's built-in collapsible menu */}
      <details open={diCuti} className="group">
        <summary className="flex cursor-pointer list-none items-center justify-between rounded-md px-3 py-2 text-sm text-teks hover:bg-latar">
          Cuti Saya
          <span className="text-redup transition group-open:rotate-180">▾</span>
        </summary>
        <div className="mt-1 space-y-1 pl-3">
          <TautanMenu href="/cuti" label="Daftar Cuti" aktif={diCuti && !diAjukanCuti} />
          <TautanMenu href="/cuti/baru" label="Ajukan Cuti" aktif={diAjukanCuti} />
        </div>
      </details>

      <TautanMenu href="/profil" label="Profil" aktif={aktif("/profil")} />

      {pengguna?.role === "hrd" && (
        <>
          <p className="px-3 pt-4 pb-1 text-xs font-semibold uppercase tracking-wide text-redup">HRD</p>
          {menuHrd.map((m) => (
            <TautanMenu key={m.href} href={m.href} label={m.label} aktif={aktif(m.href, m.href === "/admin")} />
          ))}
        </>
      )}
    </nav>
  );
}
