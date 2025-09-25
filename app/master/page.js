'use client';

import { db } from '@/lib/firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';
import { useState } from 'react';

export default function MasterPage() {
  const [loading, setLoading] = useState(false);

  const generateCollections = async () => {
    setLoading(true);
    try {
      // ========== PENGATURAN UMUM ==========
      // List Kategori TK
      await setDoc(doc(db, 'pengaturanUmum', 'ListKategoriTK'), {
        data: [] // nanti diisi array kategori TK dari UI
      });

      // List Shifting (kosong dulu, nanti per client)
      await setDoc(doc(db, 'pengaturanUmum', 'ListShifting'), {});

      // List UMP (kosong dulu, nanti per regional)
      await setDoc(doc(db, 'pengaturanUmum', 'listUMP'), {});

      // ========== UNSUR GAJI ==========
      await setDoc(doc(db, 'unsurGaji', 'default'), {
        Lokasi: '',
        Kategori: '',
        Jabatan: '',
        GajiPokok: 0,
        TunjanganJabatan: 0,
        TunjanganMakan: 0,
        TunjanganTransportasi: 0,
        LemburReguler: 0,
        LemburLiburNasional: 0,
        RITDalamKota: 0,
        RitLuarKota: 0,
        BKOReguler: 0,
        BKOCuti: 0,
        BPJSKesehatan: 0,
        BPJSTenagaKerja: 0,
        PeriodeCutOff: ''
      });

      // ========== UNSUR INVOICE ==========
      await setDoc(doc(db, 'unsurInvoice', 'default'), {
        // nanti disesuaikan field invoice apa saja
        client: '',
        komponen: [],
        tahun: new Date().getFullYear()
      });

      alert('Struktur koleksi berhasil digenerate!');
    } catch (error) {
      console.error('Error generating collections:', error);
      alert('Gagal generate koleksi: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <button
        onClick={generateCollections}
        disabled={loading}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Generating...' : 'Generate'}
      </button>
    </div>
  );
}
