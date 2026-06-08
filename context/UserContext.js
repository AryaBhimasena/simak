// context/UserContext.js
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthChange } from '@/lib/auth';   // wrapper dari Firebase
import { getUser, getUserRole } from '@/services/userService';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // pakai wrapper dari lib/auth.js → cookie otomatis sinkron
    const unsubscribe = onAuthChange(async (session) => {
      if (session?.user) {
        setUser(session.user);
        setRole(session.role);

        // ambil profile lengkap dari Firestore
        const userProfile = await getUser(session.user.uid);
        setProfile(userProfile);
      } else {
        setUser(null);
        setRole(null);
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <UserContext.Provider value={{ user, role, profile, loading }}>
      {children}
    </UserContext.Provider>
  );
}

/**
 * Hook utama untuk akses context user
 */
export function useAuth() {
  return useContext(UserContext);
}

/**
 * Hook helper untuk ambil role saja
 * - fallback ke cookie kalau context kosong
 */
export function useUserRole() {
  const { role } = useAuth() || {};
  return role || getUserRole(); 
}

/**
 * Alias supaya tetap kompatibel dengan kode lama
 * Sama saja dengan useAuth()
 */
export function useUserContext() {
  return useAuth();
}
