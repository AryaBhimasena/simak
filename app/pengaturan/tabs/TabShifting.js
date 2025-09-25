// app/pengaturan/tabs/TabShifting.js
'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebaseConfig';
import {
  collection, getDocs, doc, setDoc, getDoc, serverTimestamp
} from 'firebase/firestore';
import { useUserContext } from '@/context/UserContext';
import Swal from 'sweetalert2';
import '../pengaturanUmum.css';

export default function TabShifting() {
  const { user } = useUserContext();

  const [shfClients, setShfClients] = useState([]);
  const [shfKategoriList, setShfKategoriList] = useState([]);
  const [shfData, setShfData] = useState([]);
  const [shfDirty, setShfDirty] = useState(false);

  // === Ambil daftar client ===
  const fetchClients = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'dataClient'));
      const arr = snapshot.docs.map(docSnap => ({
        id: docSnap.id,              // ini adalah Kode Client (nama dokumen)
        ...docSnap.data()
      }));
      setShfClients(arr);
    } catch (err) {
      console.error('Error ambil client:', err);
    }
  };

  // === Ambil daftar kategori TK ===
  const fetchKategori = async () => {
    try {
      const kategoriRef = doc(db, 'pengaturanUmum', 'listKategoriTK');
      const snapshot = await getDoc(kategoriRef);
      if (snapshot.exists()) {
        const data = snapshot.data();
        setShfKategoriList(Object.values(data));
      }
    } catch (err) {
      console.error('Error ambil kategori TK:', err);
    }
  };

  // === Ambil data shifting ===
  const fetchShifting = async () => {
    try {
      const shiftRef = doc(db, 'pengaturanUmum', 'listShifting');
      const snapshot = await getDoc(shiftRef);
      if (snapshot.exists()) {
        const arr = Object.values(snapshot.data());
        setShfData(arr);
        setShfDirty(false);
      }
    } catch (err) {
      console.error('Error ambil shifting:', err);
    }
  };

  // === Tambah baris baru ===
  const handleAddRow = () => {
    const newRow = {
      client: '',
      kategori: '',
      pagiMasuk: '', pagiKeluar: '',
      soreMasuk: '', soreKeluar: '',
      malamMasuk: '', malamKeluar: '',
      fullMasuk: '', fullKeluar: '',
      cutGaji: '', cutInvoice: '',
      user: user?.email || 'unknown'
    };
    setShfData(prev => [...prev, newRow]);
    setShfDirty(true);
  };

  // === Ubah data dalam tabel ===
  const handleChange = (idx, field, value) => {
    const updated = [...shfData];
    updated[idx][field] = value;
    setShfData(updated);
    setShfDirty(true);
  };

  // === Simpan semua data ke Firestore ===
  const handleSave = async () => {
    try {
      const shiftRef = doc(db, 'pengaturanUmum', 'listShifting');

      const newData = {};
      shfData.forEach(item => {
        if (item.client && item.kategori) {
          newData[`${item.client}_${item.kategori}`] = {
            ...item,
            timestamp: serverTimestamp()
          };
        }
      });

      await setDoc(shiftRef, newData, { merge: false });
      Swal.fire('Berhasil!', 'Data shifting berhasil disimpan', 'success');
      setShfDirty(false);
      fetchShifting();
    } catch (err) {
      console.error('Error simpan shifting:', err);
      Swal.fire('Gagal', 'Terjadi kesalahan saat simpan data', 'error');
    }
  };

  // === Warning saat pindah halaman ===
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (shfDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [shfDirty]);

  useEffect(() => {
    fetchClients();
    fetchKategori();
    fetchShifting();
  }, []);

  return (
    <div className="shf-container">
      <h3 className="shf-title">Pengaturan Shifting</h3>

      <div className="shf-table-wrapper">
        <table className="shf-table">
          <thead>
            <tr>
              <th>Client</th>
              <th>Kategori TK</th>
              <th>Pagi Masuk</th>
              <th>Pagi Keluar</th>
              <th>Sore Masuk</th>
              <th>Sore Keluar</th>
              <th>Malam Masuk</th>
              <th>Malam Keluar</th>
              <th>Full Masuk</th>
              <th>Full Keluar</th>
              <th>Cut Gaji</th>
              <th>Cut Invoice</th>
            </tr>
          </thead>
          <tbody>
            {shfData.map((row, idx) => (
              <tr key={idx}>
                <td>
                  <select
                    className="shf-input"
                    value={row.client}
                    onChange={(e) => handleChange(idx, 'client', e.target.value)}
                  >
                    <option value="">-- Pilih Client --</option>
                    {shfClients.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.namaClient || c.id}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <select
                    className="shf-input"
                    value={row.kategori}
                    onChange={(e) => handleChange(idx, 'kategori', e.target.value)}
                  >
                    <option value="">-- Pilih Kategori --</option>
                    {shfKategoriList.map((k, kidx) => (
                      <option key={kidx} value={k.namaKategori}>
                        {k.namaKategori}
                      </option>
                    ))}
                  </select>
                </td>
                {['pagiMasuk','pagiKeluar','soreMasuk','soreKeluar','malamMasuk','malamKeluar','fullMasuk','fullKeluar'].map(f => (
                  <td key={f}>
                    <input
                      className="shf-input"
                      type="time"
                      value={row[f]}
                      onChange={(e) => handleChange(idx, f, e.target.value)}
                    />
                  </td>
                ))}
                <td>
                  <input
                    className="shf-input"
                    type="number"
                    value={row.cutGaji}
                    onChange={(e) => handleChange(idx, 'cutGaji', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    className="shf-input"
                    type="number"
                    value={row.cutInvoice}
                    onChange={(e) => handleChange(idx, 'cutInvoice', e.target.value)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="shf-action-buttons">
          <button className="shf-add-button" onClick={handleAddRow}>
            Tambah Data
          </button>
          <button className="shf-save-button" onClick={handleSave}>
            Simpan Data
          </button>
        </div>
      </div>
    </div>
  );
}
