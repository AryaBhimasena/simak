// app/absensi/inputAbsen/admin/page.js
'use client';
import { useState } from 'react';
import './inputAbsen.css';

export default function InputAbsenAdmin() {
  const [lokasi, setLokasi] = useState('');
  const [anggota, setAnggota] = useState('');
  const [kategori, setKategori] = useState('Semua Kategori');
  const [jabatan, setJabatan] = useState('Semua Jabatan');
  const [periode, setPeriode] = useState('Agustus 2025');
  const [cutoff, setCutoff] = useState('21');

  const tanggalData = generateTanggal(cutoff);

  return (
    <div className="app-page">
      <main className="app-card" role="main" aria-labelledby="absensi-title">

        {/* ===== HEADER ===== */}
        <section className="absensi-header">

          {/* Row 1: Title + Save Button */}
          <div className="absensi-title-row">
            <h2 id="absensi-title" className="absensi-title">Input Absensi</h2>
            <button className="save-button">Simpan Absensi</button>
          </div>

          {/* Row 2: Filter (grid 3 kolom) */}
          <div className="header-filters">
            <select value={lokasi} onChange={(e) => setLokasi(e.target.value)} className="filter-dropdown">
              <option value="">Lokasi Penempatan</option>
              <option value="client1">Client A</option>
              <option value="client2">Client B</option>
            </select>

            <select value={anggota} onChange={(e) => setAnggota(e.target.value)} className="filter-dropdown">
              <option value="">Nama Anggota</option>
              {lokasi && <option value="1">Budi</option>}
              {lokasi && <option value="2">Sari</option>}
            </select>

            <select value={kategori} onChange={(e) => setKategori(e.target.value)} className="filter-dropdown">
              <option>Semua Kategori</option>
              <option>Kontrak</option>
              <option>Tetap</option>
            </select>

            <select value={jabatan} onChange={(e) => setJabatan(e.target.value)} className="filter-dropdown">
              <option>Semua Jabatan</option>
              <option>Staff</option>
              <option>Supervisor</option>
            </select>

            <select value={periode} onChange={(e) => setPeriode(e.target.value)} className="filter-dropdown">
              <option>Agustus 2025</option>
              <option>Juli 2025</option>
            </select>

            <select value={cutoff} onChange={(e) => setCutoff(e.target.value)} className="filter-dropdown">
              <option value="21">Cut Off 21</option>
              <option value="26">Cut Off 26</option>
            </select>
          </div>

          <div className="separator" />
        </section>

        {/* ===== TABEL ABSENSI (scrollable area) ===== */}
        <section className="absensi-content">
          <div className="absensi-table-wrapper">
            <table className="absensi-table">
              <thead>
                <tr>
                  <th>Tanggal</th>
                  <th>Hari</th>
                  <th>Kehadiran</th>
                  <th>Shift</th>
                  <th className="jam">Jam Masuk</th>
                  <th className="jam">Jam Keluar</th>
                  <th className="jam">Total Jam</th>
                  <th className="jam">Total Lembur</th>
                  <th className="jam">Konversi Lembur</th>
                  <th className="nama">Back Up</th>
                  <th>Keterangan</th>
                </tr>
              </thead>
              <tbody>
                {tanggalData.map((t, idx) => (
                  <tr key={idx}>
                    <td>{t.tanggal}</td>
                    <td>{t.hari}</td>
                    <td>
                      <select>
                        <option>I</option>
                        <option>S</option>
                        <option>A</option>
                        <option>Cuti</option>
                        <option>LN</option>
                      </select>
                    </td>
                    <td>
                      <select>
                        <option>Pagi</option>
                        <option>Siang</option>
                        <option>Sore</option>
                        <option>Malam</option>
                        <option>All Day</option>
                      </select>
                    </td>
                    <td className="jam"><input type="time" /></td>
                    <td className="jam"><input type="time" /></td>
                    <td className="jam"><input type="text" readOnly /></td>
                    <td className="jam"><input type="number" /></td>
                    <td className="jam"><input type="text" readOnly /></td>
                    <td className="nama">
                      <select>
                        <option>-</option>
                        <option>Budi</option>
                        <option>Sari</option>
                      </select>
                    </td>
                    <td><input type="text" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

      </main>
    </div>
  );
}

// Helper generate tanggal dummy
function generateTanggal(cutoff) {
  const start = cutoff === '21' ? 21 : 26;
  const days = 30;
  const data = [];
  for (let i = 0; i < days; i++) {
    const tanggal = `${start + i <= 30 ? start + i : (start + i) - 30}/08/2025`;
    const hari = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'][i % 7];
    data.push({ tanggal, hari });
  }
  return data;
}
