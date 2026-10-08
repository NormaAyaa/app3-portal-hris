import Link from "next/link";
import Ikon from "@/components/Ikon";

// Tampil untuk semua alamat yang tidak dikenal (PRD 6.3) / Shown for every unknown URL (PRD 6.3)
export default function TidakDitemukan() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-sedap p-4">
      <div className="kartu max-w-md p-8 text-center">
        <p className="text-8xl leading-none font-black tracking-tighter text-sedap">
          4<span className="text-kunyit [-webkit-text-stroke:3px_var(--color-tinta)]">0</span>4
        </p>
        <h1 className="mt-4 mb-2 text-2xl font-black text-tinta">Halaman tidak ditemukan</h1>
        <p className="mb-8 font-medium text-redup">Alamat yang kamu buka tidak ada. Periksa kembali alamatnya.</p>
        <Link href="/beranda" className="tombol-kunyit">
          <Ikon nama="kembali" />
          Kembali ke Beranda
        </Link>
      </div>
    </main>
  );
}
