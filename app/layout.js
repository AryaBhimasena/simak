// app/layout.js
'use client';

import './globals.css';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import { usePathname } from 'next/navigation';
import { UserProvider } from '@/context/UserContext'; // ✅ import provider

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  return (
    <html lang="en">
      <body className="app-container">
        <UserProvider> {/* ✅ Bungkus semua dengan provider */}
          {isLoginPage ? (
            // Layout khusus login, tanpa sidebar & navbar
            <main className="login-content">{children}</main>
          ) : (
            // Layout default dengan sidebar + navbar
            <div className="layout">
              <Sidebar />
              <div className="main-wrapper">
                <Navbar />
                <main className="main-content">{children}</main>
              </div>
            </div>
          )}
        </UserProvider>
      </body>
    </html>
  );
}
