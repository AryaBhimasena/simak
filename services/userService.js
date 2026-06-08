// services/userService.js
import { db, getUserRoleFromFirestore } from '@/lib/auth';
import { doc, getDoc, setDoc, updateDoc, deleteDoc, collection, getDocs } from 'firebase/firestore';
import Cookies from 'js-cookie';

/**
 * Ambil cookie value berdasarkan nama
 */
function getCookie(name) {
  if (typeof document === 'undefined') return null;
  return Cookies.get(name) || null;
}

/**
 * Ambil token login dari cookie
 */
export function getAuthToken() {
  return getCookie('authToken');
}

/**
 * Ambil role user dari cookie (fallback ke 'user')
 */
export function getUserRole() {
  return getCookie('userRole') || 'user';
}

/**
 * Ambil data user dari Firestore
 * @param {string} uid - UID Firebase Auth user
 * @returns {Promise<object|null>} user data atau null
 */
export async function getUser(uid) {
  const ref = doc(db, 'users', uid);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
}

/**
 * Ambil semua user dari Firestore
 * @returns {Promise<Array<object>>} daftar user
 */
export async function getAllUsers() {
  const ref = collection(db, 'users');
  const snap = await getDocs(ref);
  const users = [];
  snap.forEach(docSnap => {
    users.push({ id: docSnap.id, ...docSnap.data() });
  });
  return users;
}

/**
 * Buat / update user di Firestore
 * @param {string} uid - UID Firebase Auth user
 * @param {object} data - Data user (email, role, dsb.)
 */
export async function setUser(uid, data) {
  const ref = doc(db, 'users', uid);
  await setDoc(ref, data, { merge: true });
}

/**
 * Update role user
 * @param {string} uid - UID Firebase Auth user
 * @param {string} role - Role baru (admin, staff, user, dll.)
 */
export async function updateUserRole(uid, role) {
  const ref = doc(db, 'users', uid);
  await updateDoc(ref, { role });

  // 🔑 update cookie juga biar sinkron dengan middleware
  Cookies.set('userRole', role, { path: '/' });
}

/**
 * Hapus user dari Firestore
 * @param {string} uid - UID Firebase Auth user
 */
export async function deleteUser(uid) {
  const ref = doc(db, 'users', uid);
  await deleteDoc(ref);
}
