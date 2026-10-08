// Warna status dari PRD 5.2 / Status colors from PRD 5.2
const gaya = {
  menunggu: { label: "Menunggu", kelas: "bg-menunggu/15 text-amber-700" },
  disetujui: { label: "Disetujui", kelas: "bg-disetujui/15 text-disetujui" },
  ditolak: { label: "Ditolak", kelas: "bg-ditolak/15 text-ditolak" },
};

export default function PilStatus({ status }) {
  const s = gaya[status] ?? { label: status, kelas: "bg-gray-100 text-redup" };
  return <span className={`inline-block rounded-full px-3 py-0.5 text-xs font-semibold ${s.kelas}`}>{s.label}</span>;
}
