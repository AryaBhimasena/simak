// lib/auth.js
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from './firebaseConfig';

// 🔑 Export ulang supaya cukup import dari sini
export { auth, db };

/**
 * Helper simpan cookie
 */
function setAuthCookies(token, role) {
  document.cookie = `authToken=${token}; path=/`;
  document.cookie = `userRole=${role}; path=/`;
}

/**
 * Helper hapus cookie
 */
function clearAuthCookies() {
  document.cookie = `authToken=; Max-Age=0; path=/`;
  document.cookie = `userRole=; Max-Age=0; path=/`;
}

/**
 * Ambil role user dari Firestore (helper reuseable)
 */
export async function getUserRoleFromFirestore(uid) {
  const userRef = doc(db, 'users', uid);
  const snap = await getDoc(userRef);
  return snap.exists() ? snap.data().role : 'user';
}

/**
 * Login dengan email & password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<object>} user + role
 */
export async function loginUser(email, password) {
  const { user } = await signInWithEmailAndPassword(auth, email, password);

  // Ambil role user dari Firestore
  let role = await getUserRoleFromFirestore(user.uid);

  // Kalau record belum ada → buat default
  if (!role) {
    role = 'user';
    await setDoc(doc(db, 'users', user.uid), {
      email: user.email,
      role,
    });
  }

  // 🔑 Ambil Firebase ID token
  const token = await user.getIdToken();

  // Simpan token & role ke cookie
  setAuthCookies(token, role);

  return { user, role };
}

/**
 * Logout user
 */
export async function logout() {
  await signOut(auth);
  clearAuthCookies();
}

/**
 * Listener perubahan auth state
 * @param {function} callback
 * @returns unsubscribe function
 */
export function onAuthChange(callback) {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      const role = await getUserRoleFromFirestore(user.uid);

      const token = await user.getIdToken();
      setAuthCookies(token, role);

      callback({ user, role });
    } else {
      clearAuthCookies();
      callback(null);
    }
  });
}
