'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ChevronLeft,
  ChevronRight,
  Settings,
  Home,
  Users,
  Calendar,
  FileText,
  WalletCards,
  Handshake,
} from 'lucide-react';

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : 'expanded'}`}>
      {/* HEADER */}
      <div className="sidebar-header">
        {!collapsed && <div className="sidebar-logo">SIMAK</div>}
        <button
          className="sidebar-toggle-btn"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* MENU */}
      <nav className="sidebar-menu">
        <Link href="/dashboard" className="sidebar-link">
          <Home size={20} />
          {!collapsed && <span>Dashboard</span>}
        </Link>

        <Link href="/absensi" className="sidebar-link">
          <Calendar size={20} />
          {!collapsed && <span>Absensi</span>}
        </Link>
        {!collapsed && (
          <div className="sidebar-submenu">
            <Link href="/absensi/inputAbsen/admin" className="sidebar-link">
              <span style={{ marginLeft: 28 }}>Input Absensi</span>
            </Link>
            <Link href="/absensi/rekap" className="sidebar-link">
              <span style={{ marginLeft: 28 }}>Rekap Absensi</span>
            </Link>
          </div>
        )}

        <Link href="/gaji" className="sidebar-link">
          <WalletCards size={20} />
          {!collapsed && <span>Gaji</span>}
        </Link>

        <Link href="/invoice" className="sidebar-link">
          <FileText size={20} />
          {!collapsed && <span>Invoice</span>}
        </Link>
		
        <Link href="/clients" className="sidebar-link">
          <Handshake size={20} />
          {!collapsed && <span>Clients</span>}
        </Link>

        <Link href="/dataKaryawan" className="sidebar-link">
          <Users size={20} />
          {!collapsed && <span>Data Karyawan</span>}
        </Link>
      </nav>

      {/* FOOTER */}
      <div className="sidebar-footer">
        <Link href="/pengaturan" className="sidebar-link">
          <Settings size={20} />
          {!collapsed && <span>Pengaturan</span>}
        </Link>
      </div>
    </aside>
  );
}
