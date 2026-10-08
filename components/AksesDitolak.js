import Link from "next/link";
import Ikon from "./Ikon";

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
    <div className="kartu mx-auto max-w-md overflow-hidden text-center">
      <h1 className="bg-ditolak py-8 text-4xl font-black text-white">Akses Ditolak</h1>
      <div className="p-8">
        <p className="mb-6 font-medium text-teks">{alasan}</p>
        <Link href={kembaliKe} className="tombol-utama">
          <Ikon nama="kembali" />
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
