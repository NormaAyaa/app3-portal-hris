// Warna status dari PRD 5.2. Teks gelap dipakai supaya tetap terbaca di atas warna terang / Status colors from PRD 5.2. Dark text keeps it readable on light tints
const gaya = {
  menunggu: { label: "Menunggu", kelas: "border-menunggu bg-menunggu/20", titik: "bg-menunggu" },
  disetujui: { label: "Disetujui", kelas: "border-disetujui bg-disetujui/20", titik: "bg-disetujui" },
  ditolak: { label: "Ditolak", kelas: "border-ditolak bg-ditolak/15", titik: "bg-ditolak" },
};

export default function PilStatus({ status }) {
  const s = gaya[status] ?? { label: status, kelas: "border-redup bg-latar", titik: "bg-redup" };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border-2 px-3 py-0.5 text-xs font-extrabold text-tinta ${s.kelas}`}>
      <span className={`h-2 w-2 rounded-full ${s.titik}`} />
      {s.label}
    </span>
  );
}
