'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebaseConfig';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { useUserContext } from '@/context/UserContext';
import { Trash2 } from 'lucide-react';
import '../pengaturanUmum.css';

export default function TabKategoriTK() {
  const [kategoriTK, setKategoriTK] = useState('');
  const [dataKategori, setDataKategori] = useState([]);
  const { user } = useUserContext();

  // Ambil data kategoriTK dari Firestore
  const fetchKategoriTK = async () => {
    try {
      const kategoriRef = doc(db, 'pengaturanUmum', 'listKategoriTK');
      const snap = await getDoc(kategoriRef);
      if (snap.exists()) {
        const data = snap.data();
        setDataKategori(Object.values(data));
      } else {
        setDataKategori([]);
      }
    } catch (error) {
      console.error('Error fetch KategoriTK:', error);
    }
  };

  useEffect(() => {
    fetchKategoriTK();
  }, []);

  // Tambah kategori baru
  const handleAddKategori = async () => {
    if (!kategoriTK) {
      alert('Kategori TK harus diisi');
      return;
    }

    try {
      const kategoriRef = doc(db, 'pengaturanUmum', 'listKategoriTK');
      await setDoc(
        kategoriRef,
        {
          [kategoriTK]: {
            kategoriTK,
            user: user?.email || 'unknown',
          },
        },
        { merge: true }
      );

      setKategoriTK('');
      fetchKategoriTK();
    } catch (error) {
      console.error('Error simpan KategoriTK:', error);
      alert('Gagal menyimpan kategori');
    }
  };

  // Hapus kategori
  const handleDeleteKategori = async (kategori) => {
    const confirm = window.confirm(
      `Yakin ingin menghapus kategori "${kategori}"?`
    );
    if (!confirm) return;

    try {
      const kategoriRef = doc(db, 'pengaturanUmum', 'listKategoriTK');
      await updateDoc(kategoriRef, {
        [kategori]: null, // set field ke null → otomatis terhapus di Firestore
      });

      fetchKategoriTK();
    } catch (error) {
      console.error('Error hapus kategori:', error);
      alert('Gagal menghapus kategori');
    }
  };

  return (
    <div className="ump-container">
      {/* Kiri: Form input */}
      <div className="ump-form">
        <h3 className="ump-title">Tambah Kategori TK</h3>
        <div className="ump-form-field">
          <label>Kategori TK</label>
          <input
            type="text"
            value={kategoriTK}
            onChange={(e) => setKategoriTK(e.target.value)}
          />
        </div>

        <button className="ump-add-button" onClick={handleAddKategori}>
          Tambah Kategori
        </button>
      </div>

      {/* Kanan: tabel data */}
      <div className="ump-table-wrapper">
        <table className="ump-table">
          <thead>
            <tr>
              <th>Kategori TK</th>
              <th>User Input</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {dataKategori.map((item, idx) => (
              <tr key={idx}>
                <td>{item.kategoriTK}</td>
                <td>{item.user}</td>
                <td>
                  <button
                    className="ump-delete-button"
                    onClick={() => handleDeleteKategori(item.kategoriTK)}
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {dataKategori.length === 0 && (
              <tr>
                <td colSpan="3" style={{ textAlign: 'center' }}>
                  Belum ada data kategori
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
