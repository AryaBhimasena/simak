"use client";

import "@/style/components/app-header.css";

type AppHeaderProps = {
  title?: string;
};

export default function AppHeader({
  title = "SIMAK",
}: AppHeaderProps) {
  return (
    <header className="simakLayout__header">
      <div>
        <h1 className="simakLayout__appTitle">{title}</h1>

        <p className="simakLayout__appSubtitle">
          Sistem Informasi Management & Administratif KII
        </p>
      </div>

      <div className="simakLayout__userInfo">
        <span>Admin</span>
        <div className="simakLayout__avatar">A</div>
      </div>
    </header>
  );
}