import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Pembersih nilai environment variable: hapus tanda petik, koma, dan spasi di awal/akhir
function bersihkan(nilai) {
  if (!nilai) return "";
  return String(nilai)
    .trim()
    .replace(/^["'`\s]+|["'`\s,]+$/g, "")
    .trim();
}

// Konfigurasi dibaca dari environment variables (.env.local atau Netlify)
const firebaseConfig = {
  apiKey: bersihkan(process.env.NEXT_PUBLIC_FIREBASE_API_KEY),
  authDomain: bersihkan(process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN),
  projectId: bersihkan(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID),
  storageBucket: bersihkan(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET),
  messagingSenderId: bersihkan(process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID),
  appId: bersihkan(process.env.NEXT_PUBLIC_FIREBASE_APP_ID),
};

// Pakai app yang sudah ada supaya tidak dobel saat halaman dimuat ulang / Reuse the existing app so it is not initialized twice on hot reload
export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);

