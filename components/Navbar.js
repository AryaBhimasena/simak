// components/Navbar.js
'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Power } from 'lucide-react';
import { useAuth } from '@/context/UserContext';
import { auth } from '@/lib/firebaseConfig';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { user, role, profile } = useAuth();
  const router = useRouter();

  // Ambil nama & avatar
  const displayName =
    profile?.displayName ||
    user?.displayName ||
    user?.email ||
    'User';

  const avatar = user?.photoURL || '/avatar.jpg';

  // Tutup dropdown saat klik luar
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setOpen(false);
      router.push('/login'); // ✅ redirect setelah logout
    } catch (error) {
      console.error('Logout gagal:', error);
    }
  };

  return (
    <header className="navbar">
      <div className="nav-right" ref={dropdownRef}>
        <button
          className="user-button"
          onClick={() => setOpen((v) => !v)}
          aria-haspopup="true"
          aria-expanded={open}
        >
          <span className="user-name">{displayName}</span>
        </button>

        {open && (
          <div className="user-card" role="dialog" aria-label="User menu">
            <div className="user-info">
              <div className="avatar-wrapper">
                <Image
                  src={avatar}
                  alt={displayName}
                  width={48}
                  height={48}
                  className="avatar"
                />
              </div>

              <div className="user-meta">
                <div className="user-fullname">{displayName}</div>
                <div className="user-role">{role || 'user'}</div>
              </div>
            </div>

            <div
              className="logout"
              role="button"
              tabIndex={0}
              onClick={handleLogout}
            >
              <Power size={16} />
              <span className="logout-text">Logout</span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
