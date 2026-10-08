import Link from "next/link";

// Tampil untuk semua alamat yang tidak dikenal (PRD 6.3) / Shown for every unknown URL (PRD 6.3)
export default function TidakDitemukan() {
  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <div className="max-w-md rounded-lg bg-panel p-8 text-center shadow-sm">
        <p className="mb-2 text-5xl font-bold text-sedap">404</p>
        <h1 className="mb-2 text-xl font-semibold">Halaman tidak ditemukan</h1>
        <p className="mb-6 text-redup">Alamat yang kamu buka tidak ada. Periksa kembali alamatnya.</p>
        <Link href="/beranda" className="inline-block rounded-md bg-sedap px-4 py-2 text-sm font-medium text-white hover:opacity-90">
          Kembali ke Beranda
        </Link>
      </div>
    </main>
  );
}
