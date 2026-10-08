import Ikon from "./Ikon";

/**
 * Pita judul berwarna di atas setiap halaman. Warnanya mengikuti modul
 * (sedap = presensi dan beranda, kunyit = cuti, terong = profil, tinta = HRD)
 * supaya pengguna langsung tahu sedang di bagian mana.
 *
 * Colored title band at the top of every page. Its color follows the module
 * (sedap = attendance and home, kunyit = leave, terong = profile, tinta = HRD)
 * so users instantly know which part of the app they are in.
 */
const warnaModul = {
  sedap: "bg-sedap text-white",
  kunyit: "bg-kunyit text-tinta",
  terong: "bg-terong text-white",
  tinta: "bg-tinta text-white",
};

export default function KepalaHalaman({ judul, keterangan, warna = "sedap", ikon, children }) {
  return (
    <header className={`kartu relative overflow-hidden p-6 md:p-8 ${warnaModul[warna]}`}>
      {ikon && <Ikon nama={ikon} className="absolute -right-6 -bottom-8 h-40 w-40 opacity-10" />}
      <div className="relative flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-xl">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{judul}</h1>
          {keterangan && <div className="mt-2 font-medium opacity-90">{keterangan}</div>}
        </div>
        {children && <div className="flex flex-wrap gap-3">{children}</div>}
      </div>
    </header>
  );
}
