import Ikon from "./Ikon";

// Fitur utama dari PRD Bab 1 / Main features from PRD chapter 1
const fitur = [
  { ikon: "jam", teks: "Catat jam masuk dan pulang tanpa buku hadir." },
  { ikon: "kalender", teks: "Ajukan cuti dan pantau keputusannya di satu tempat." },
  { ikon: "masuk", teks: "Masuk dengan akun Google yang sudah kamu punya." },
];

/**
 * Bingkai halaman Masuk dan Daftar: panel sambutan berwarna di kiri, formulir di kanan.
 * Di layar kecil panel sambutan disembunyikan supaya formulir langsung terlihat.
 *
 * Frame for the sign-in and sign-up pages: colored welcome panel on the left, form on the right.
 * On small screens the welcome panel is hidden so the form is visible right away.
 */
export default function KerangkaPublik({ judul, children }) {
  return (
    <main className="grid min-h-screen md:grid-cols-2">
      <section className="relative hidden overflow-hidden bg-sedap p-12 text-white md:flex md:flex-col md:justify-between">
        <div className="flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-xl border border-tinta/10 bg-kunyit text-2xl font-bold text-tinta shadow-kartu">
            S
          </span>
          <span className="text-2xl font-bold">Sedap</span>
        </div>

        <div>
          <h2 className="text-5xl leading-none font-bold tracking-tight lg:text-6xl">
            Portal
            <br />
            <span className="text-kunyit">HRIS</span> Sedap
          </h2>
          <ul className="mt-10 space-y-4">
            {fitur.map((f) => (
              <li key={f.ikon} className="flex items-center gap-4 text-lg font-semibold">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-tinta/10 bg-white text-sedap shadow-tipis">
                  <Ikon nama={f.ikon} />
                </span>
                {f.teks}
              </li>
            ))}
          </ul>
        </div>

        <p className="text-sm font-semibold text-white/75">Presensi dan cuti karyawan Sedap</p>
      </section>

      <section className="flex items-center justify-center bg-krem p-4 md:p-10">
        <div className="kartu w-full max-w-md p-6 md:p-8">
          <p className="text-sm font-semibold tracking-wider text-sedap uppercase md:hidden">Portal HRIS Sedap</p>
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-tinta">{judul}</h1>
          {children}
        </div>
      </section>
    </main>
  );
}
