"use client";

import { useState } from "react";
import {
  Users,
  ShieldCheck,
  Settings,
  ChevronRight,
} from "lucide-react";

import "@/styles/pages/pengaturan.css";
import UsersTab from "./tabs/users";

const SETTINGS_TABS = [
  {
    id: "users",
    label: "Pengguna",
    description: "Kelola pengguna dan hak akses",
    icon: Users,
  },
  {
    id: "system",
    label: "Sistem",
    description: "Pengaturan umum aplikasi",
    icon: Settings,
  },
];

export default function PengaturanPage() {
  const [activeTab, setActiveTab] = useState("users");

  const renderTabContent = () => {
    switch (activeTab) {
      case "users":
        return <UsersTab />;

      case "system":
        return (
          <div className="pengaturan-placeholder">
            <Settings size={28} strokeWidth={1.7} />

            <h3>Pengaturan Sistem</h3>

            <p>
              Pengaturan umum aplikasi akan tersedia
              pada tahap berikutnya.
            </p>
          </div>
        );

      default:
        return <UsersTab />;
    }
  };

  return (
    <main className="pengaturan-page">
      {/* =========================
          HEADER
      ========================= */}

      <header className="pengaturan-header">
        <div>
          <p className="pengaturan-eyebrow">
            KONFIGURASI APLIKASI
          </p>

          <h1>Pengaturan</h1>

          <p className="pengaturan-description">
            Kelola pengguna, hak akses, dan konfigurasi
            aplikasi SIMAK-KII.
          </p>
        </div>
      </header>

      {/* =========================
          CONTENT
      ========================= */}

      <section className="pengaturan-layout">
        {/* =========================
            SIDE NAVIGATION
        ========================= */}

        <aside className="pengaturan-sidebar">
          <div className="pengaturan-sidebar-title">
            Pengaturan
          </div>

          <nav className="pengaturan-nav">
            {SETTINGS_TABS.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  className={`pengaturan-nav-item ${
                    active ? "active" : ""
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <span className="pengaturan-nav-icon">
                    <Icon
                      size={18}
                      strokeWidth={1.8}
                    />
                  </span>

                  <span className="pengaturan-nav-content">
                    <span className="pengaturan-nav-label">
                      {tab.label}
                    </span>

                    <span className="pengaturan-nav-description">
                      {tab.description}
                    </span>
                  </span>

                  <ChevronRight
                    className="pengaturan-nav-arrow"
                    size={16}
                    strokeWidth={1.8}
                  />
                </button>
              );
            })}
          </nav>
        </aside>

        {/* =========================
            TAB CONTENT
        ========================= */}

        <section className="pengaturan-content">
          {renderTabContent()}
        </section>
      </section>
    </main>
  );
}