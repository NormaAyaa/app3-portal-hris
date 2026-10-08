/**
 * SEMENTARA. Di Sesi 6 hook ini diganti dengan data dari Firebase Auth dan dokumen users/{uid}.
 * Role dibuat "hrd" supaya semua menu tampil saat starter diperiksa.
 *
 * TEMPORARY. In Session 6 this hook is replaced with data from Firebase Auth and the users/{uid} document.
 * Role is "hrd" so every menu shows while the starter is being reviewed.
 */
export function usePengguna() {
  return {
    pengguna: {
      uid: "contoh",
      nama: "Pengguna Contoh",
      email: "contoh@sedap.id",
      role: "hrd",
    },
    memuat: false,
  };
}
