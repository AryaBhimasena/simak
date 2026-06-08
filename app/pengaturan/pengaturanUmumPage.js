// app/pengaturan/pengaturanUmumPage.js
'use client';

import { useState } from 'react';
import './pengaturanUmum.css';
import TabUMP from './tabs/TabUMP';
import TabKategoriTK from './tabs/TabKategoriTK'; // 🔹 import komponen kategori
import TabShifting from './tabs/TabShifting'; // 🔹 import komponen shifting

export default function PengaturanUmumPage() {
  const [activeTab, setActiveTab] = useState('ump'); // ump | kategori | shifting

  const renderContent = () => {
    switch (activeTab) {
      case 'ump':
        return <TabUMP />; // 🔹 komponen UMP
      case 'kategori':
        return <TabKategoriTK />; // 🔹 komponen Kategori TK
      case 'shifting':
        return <TabShifting />; // 🔹 komponen Shifting
      default:
        return null;
    }
  };

  return (
    <div className="pengaturan-umum-page">
      {/* ==== TAB NAV ==== */}
      <div className="pengaturan-umum-tabs">
        <button
          className={activeTab === 'ump' ? 'tab-active' : ''}
          onClick={() => setActiveTab('ump')}
        >
          List UMP
        </button>
        <button
          className={activeTab === 'kategori' ? 'tab-active' : ''}
          onClick={() => setActiveTab('kategori')}
        >
          List Kategori Tenaga Kerja
        </button>
        <button
          className={activeTab === 'shifting' ? 'tab-active' : ''}
          onClick={() => setActiveTab('shifting')}
        >
          List Shifting
        </button>
      </div>

      {/* ==== TAB CONTENT ==== */}
      {renderContent()}
    </div>
  );
}
