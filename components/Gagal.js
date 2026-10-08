export default function Gagal({ teks = "Data gagal dimuat.", onCobaLagi }) {
  return (
    <div role="alert" className="rounded-lg border border-ditolak/30 bg-ditolak/5 py-8 text-center">
      <p className="mb-3 text-ditolak">{teks}</p>
      <button
        type="button"
        onClick={onCobaLagi}
        className="rounded-md bg-sedap px-4 py-2 text-sm font-medium text-white hover:opacity-90"
      >
        Coba lagi
      </button>
    </div>
  );
}
