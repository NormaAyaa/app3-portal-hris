export default function Gagal({ teks = "Data gagal dimuat. Periksa koneksi internet, lalu coba lagi.", onCobaLagi }) {
  return (
    <div role="alert" className="rounded-2xl border-2 border-ditolak bg-ditolak/10 px-6 py-10 text-center">
      <p className="mb-4 font-bold text-red-800">{teks}</p>
      <button type="button" onClick={onCobaLagi} className="tombol-utama">
        Coba lagi
      </button>
    </div>
  );
}
