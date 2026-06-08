"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import "@/style/app-layout.css";

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { label: "Dashboard", href: "/dashboard" },
	{ label: "Clients", href: "/clients" },
    { label: "Karyawan", href: "/karyawan" },
    { label: "Absensi", href: "/absensi" },
    { label: "Penggajian", href: "#" },
    { label: "Invoice", href: "/invoice" },
    { label: "Laporan", href: "#" },
  ];

  return (
    <nav className="simakLayout__navbar">
      {navItems.map((item) => {
        const isActive = pathname.startsWith(item.href);

        return (
          <Link
            key={item.label}
            href={item.href}
            className={`simakLayout__navItem ${
              isActive ? "simakLayout__navItem--active" : ""
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
