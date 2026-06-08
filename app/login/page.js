'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginUser } from '@/lib/auth'; // fungsi login Firebase + cookies

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { role } = await loginUser(email, password);

      // Redirect sesuai role
      if (role === 'superadmin' || role === 'admin') {
        router.push('/dashboard');
      } else if (role === 'staff') {
        router.push('/staff');
      } else {
        router.push('/');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Email atau kata sandi salah.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <img
            src="/images/logo-simak.png"
            alt="Logo SIMAK"
            className="login-logo"
          />
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-form-group">
            <label className="login-form-label">Email</label>
            <input
              type="email"
              className="login-form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="login-form-group">
            <label className="login-form-label">Kata Sandi</label>
            <input
              type="password"
              className="login-form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="login-error">{error}</p>}

          <button
            type="submit"
            className="login-btn-primary"
            disabled={loading}
          >
            {loading ? 'Memproses...' : 'Masuk'}
          </button>
        </form>

        <div className="login-footer">
          <p>
            Belum punya akun?{' '}
            <a href="/register" className="login-link">
              Daftar sekarang
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
