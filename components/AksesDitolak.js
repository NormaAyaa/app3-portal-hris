import Link from "next/link";

/**
 * Belum dipakai di halaman mana pun. Peserta memakainya untuk route guard di Sesi 6.
 * PRD 5.4: jelaskan alasannya, beri tombol kembali, tanpa kode teknis.
 *
 * Not used on any page yet. Participants use it for the route guard in Session 6.
 * PRD 5.4: explain why, offer a way back, no technical codes.
 */
export default function AksesDitolak({
  alasan = "Halaman ini hanya untuk HRD. Akunmu berperan Karyawan, jadi halaman ini tidak bisa dibuka.",
  kembaliKe = "/beranda",
}) {
  return (
    <div className="mx-auto max-w-md rounded-lg bg-panel p-8 text-center shadow-sm">
      <h1 className="mb-2 text-xl font-semibold">Akses Ditolak</h1>
      <p className="mb-6 text-redup">{alasan}</p>
      <Link href={kembaliKe} className="inline-block rounded-md bg-sedap px-4 py-2 text-sm font-medium text-white hover:opacity-90">
        Kembali ke Beranda
      </Link>
    </div>
  );
}
