// app/pengaturan/page.js
'use client';

import { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import Pengguna from '@/app/pengaturan/Pengguna';
import UnsurGajiPage from '@/app/pengaturan/unsurGajiPage';
import PengaturanUmumPage from '@/app/pengaturan/pengaturanUmumPage';

export default function PengaturanPage() {
  const [activeMenu, setActiveMenu] = useState(null);

  return (
    <div className="app-page">
      <main className="app-card" role="main" aria-labelledby="pengaturan-title">

        {/* Header */}
        <section className="pengaturan-header" aria-label="Judul Halaman Pengaturan">
          {activeMenu ? (
            <div className="pengaturan-header-flex">
              <button
                className="pengaturan-back-button"
                onClick={() => setActiveMenu(null)}
              >
                <ChevronLeft size={25} />
              </button>
              <h2 id="pengaturan-title" className="pengaturan-title">
                {activeMenu === 'pengguna' && 'Pengaturan - Pengguna'}
                {activeMenu === 'unsurGaji' && 'Pengaturan - Unsur Gaji'}
                {activeMenu === 'pengaturanUmum' && 'Pengaturan - Pengaturan Umum'}
              </h2>
            </div>
          ) : (
            <>
              <h2 id="pengaturan-title" className="pengaturan-title">
                Pengaturan Aplikasi
              </h2>
              <p className="pengaturan-subtitle">
                Atur unsur aplikasi, gaji, dan invoice.
              </p>
            </>
          )}
        </section>

        {/* Konten Utama */}
        {!activeMenu && (
          <section className="pengaturan-grid" aria-label="Menu Pengaturan">
            {/* Card 1: Pengaturan Umum */}
            <div className="pengaturan-card" role="group" aria-label="Pengaturan Umum">
              <div className="pengaturan-card-title">Pengaturan Umum</div>
              <div className="pengaturan-card-separator" />
              <div className="pengaturan-card-content">
                <p>Ubah informasi umum aplikasi dan akun Anda.</p>
                <button
                  className="pengaturan-button"
                  onClick={() => setActiveMenu('pengaturanUmum')}
                >
                  Kelola Pengaturan
                </button>
              </div>
            </div>

            {/* Card 2: Unsur Gaji */}
            <div className="pengaturan-card" role="group" aria-label="Pengaturan Unsur Gaji">
              <div className="pengaturan-card-title">Unsur Gaji</div>
              <div className="pengaturan-card-separator" />
              <div className="pengaturan-card-content">
                <p>Atur komponen dan struktur gaji tenaga kerja.</p>
                <button
                  className="pengaturan-button"
                  onClick={() => setActiveMenu('unsurGaji')}
                >
                  Atur Unsur Gaji
                </button>
              </div>
            </div>

            {/* Card 3: Unsur Invoice */}
            <div className="pengaturan-card" role="group" aria-label="Pengaturan Unsur Invoice">
              <div className="pengaturan-card-title">Unsur Invoice</div>
              <div className="pengaturan-card-separator" />
              <div className="pengaturan-card-content">
                <p>Sesuaikan komponen invoice dan perhitungan tagihan.</p>
                <button className="pengaturan-button">Ubah Unsur Invoice</button>
              </div>
            </div>

            {/* Card 4: Manajemen Pengguna */}
            <div className="pengaturan-card" role="group" aria-label="Pengaturan Manajemen Pengguna">
              <div className="pengaturan-card-title">Manajemen Pengguna</div>
              <div className="pengaturan-card-separator" />
              <div className="pengaturan-card-content">
                <p>Tambah, edit, atau hapus pengguna sistem (khusus admin).</p>
                <button
                  className="pengaturan-button"
                  onClick={() => setActiveMenu('pengguna')}
                >
                  Kelola Pengguna
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Submenu: Pengguna */}
        {activeMenu === 'pengguna' && <Pengguna />}

        {/* Submenu: Unsur Gaji */}
        {activeMenu === 'unsurGaji' && <UnsurGajiPage />}

        {/* Submenu: Pengaturan Umum */}
        {activeMenu === 'pengaturanUmum' && <PengaturanUmumPage />}
      </main>
    </div>
  );
}
