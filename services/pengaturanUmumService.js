// services/pengaturanUmumService.js
import { db } from "@/lib/firebaseConfig";
import { collection, doc, getDoc, getDocs, setDoc, updateDoc } from "firebase/firestore";

// === List Kategori TK ===
export const getListKategoriTK = async () => {
  const ref = doc(db, "pengaturanUmum", "ListKategoriTK");
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : {};
};

export const setListKategoriTK = async (data) => {
  const ref = doc(db, "pengaturanUmum", "ListKategoriTK");
  await setDoc(ref, data, { merge: true });
};

// === List Shifting (per client) ===
export const getListShifting = async () => {
  const ref = doc(db, "pengaturanUmum", "ListShifting");
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : {};
};

export const setShiftByClient = async (clientName, data) => {
  const ref = doc(db, "pengaturanUmum", "ListShifting");
  await setDoc(ref, { [clientName]: data }, { merge: true });
};

// === List UMP (per regional) ===
export const getListUMP = async () => {
  const ref = doc(db, "pengaturanUmum", "listUMP");
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : {};
};

export const setUMPRegional = async (regional, data) => {
  const ref = doc(db, "pengaturanUmum", "listUMP");
  await setDoc(ref, { [regional]: data }, { merge: true });
};
