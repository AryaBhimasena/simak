// app/pengaturan/tabs/TabUMP.js
'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebaseConfig';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { useUserContext } from '@/context/UserContext';
import '../pengaturanUmum.css';

export default function TabUMP() {
  const [regional, setRegional] = useState('');
  const [tarifUMP, setTarifUMP] = useState(''); // string terformat
  const [periode, setPeriode] = useState('2025');
  const { user } = useUserContext();
  const [umpList, setUmpList] = useState([]);

  // Format angka jadi currency dengan titik ribuan
  const formatCurrency = (value) => {
    if (value === null || value === undefined) return '';
    const numeric = String(value).replace(/\D/g, '').replace(/^0+/, '');
    if (!numeric) return '';
    return new Intl.NumberFormat('id-ID').format(Number(numeric));
  };

  // Handler untuk input tarif
  const handleTarifChange = (e) => {
    const raw = e.target.value;
    const formatted = formatCurrency(raw);
    setTarifUMP(formatted);
  };

  // Simpan data UMP
  const handleAddUmp = async () => {
    if (!regional || !tarifUMP) {
      alert('Regional dan Tarif UMP harus diisi');
      return;
    }

    try {
      const umpRef = doc(db, 'pengaturanUmum', 'listUMP');

      // convert formatted string jadi number
      const cleanNumber = Number(
        (tarifUMP || '').toString().replace(/\./g, '')
      );

      await setDoc(
        umpRef,
        {
          [regional]: {
            regional,
            tarifUMP: cleanNumber,
            periode,
            timestamp: serverTimestamp(),
            user: user?.email || 'unknown',
          },
        },
        { merge: true }
      );

      alert('Data UMP berhasil disimpan');
      setRegional('');
      setTarifUMP('');
      setPeriode('2025');
      fetchUMP(); // refresh tabel
    } catch (error) {
      console.error('Error simpan UMP:', error);
      alert('Gagal menyimpan UMP');
    }
  };

  // Ambil data UMP dari Firestore
  const fetchUMP = async () => {
    try {
      const umpRef = doc(db, 'pengaturanUmum', 'listUMP');
      const snapshot = await getDoc(umpRef);
      if (snapshot.exists()) {
        const data = snapshot.data();
        const arr = Object.values(data);
        setUmpList(arr);
      }
    } catch (error) {
      console.error('Error ambil UMP:', error);
    }
  };

  useEffect(() => {
    fetchUMP();
  }, []);

  return (
    <div className="ump-container">
      {/* kiri: form input */}
      <div className="ump-form">
        <h3 className="ump-title">Tambah UMP</h3>

        <div className="ump-form-field">
          <label>Regional</label>
          <input
            type="text"
            value={regional}
            onChange={(e) => setRegional(e.target.value)}
          />
        </div>

        <div className="ump-form-field">
          <label>Tarif UMP</label>
          <input
            type="text"
            value={tarifUMP}
            onChange={handleTarifChange}
          />
        </div>

        <div className="ump-form-field">
          <label>Periode</label>
          <select
            value={periode}
            onChange={(e) => setPeriode(e.target.value)}
          >
            <option value="2025">2025</option>
            <option value="2024">2024</option>
          </select>
        </div>

        <button className="ump-add-button" onClick={handleAddUmp}>
          Tambah UMP
        </button>
      </div>

      {/* kanan: tabel data */}
      <div className="ump-table-wrapper">
        <table className="ump-table">
          <thead>
            <tr>
              <th>Regional</th>
              <th>Tarif UMP</th>
              <th>Periode</th>
              <th>User</th>
            </tr>
          </thead>
          <tbody>
            {umpList.map((item, idx) => (
              <tr key={idx}>
                <td>{item.regional}</td>
                <td>{formatCurrency(item.tarifUMP)}</td>
                <td>{item.periode}</td>
                <td>{item.user}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
