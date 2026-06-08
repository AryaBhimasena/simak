// context/pengaturanContext.js
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getListKategoriTK, getListShifting, getListUMP } from "@/services/pengaturanUmumService";

const PengaturanContext = createContext();

export const PengaturanProvider = ({ children }) => {
  const [kategoriTK, setKategoriTK] = useState({});
  const [shifting, setShifting] = useState({});
  const [ump, setUMP] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchPengaturan = async () => {
    setLoading(true);
    const [kat, shift, umpData] = await Promise.all([
      getListKategoriTK(),
      getListShifting(),
      getListUMP()
    ]);
    setKategoriTK(kat);
    setShifting(shift);
    setUMP(umpData);
    setLoading(false);
  };

  useEffect(() => {
    fetchPengaturan();
  }, []);

  return (
    <PengaturanContext.Provider value={{ kategoriTK, shifting, ump, loading, refresh: fetchPengaturan }}>
      {children}
    </PengaturanContext.Provider>
  );
};

export const usePengaturan = () => useContext(PengaturanContext);
