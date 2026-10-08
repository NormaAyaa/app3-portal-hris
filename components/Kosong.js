// children = tombol langkah berikutnya, mis. "Ajukan Cuti" / children = the next-step button, e.g. "Ajukan Cuti"
export default function Kosong({ teks = "Belum ada data.", children }) {
  return (
    <div className="rounded-2xl border border-dashed border-tinta/20 bg-krem/60 px-6 py-12 text-center">
      <p className="font-bold text-tinta">{teks}</p>
      {children && <div className="mt-4 flex justify-center">{children}</div>}
    </div>
  );
}
