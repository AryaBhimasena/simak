// app/pengaturan/unsurGajiPage.js
'use client';

import { useState, useEffect } from 'react';

export default function UnsurGajiPage() {
  const [unsurList, setUnsurList] = useState([]);

  useEffect(() => {
    const dummy = [
      {
        id: 1,
        lokasi: '',
        kategori: '',
        jabatan: '',
        gajiPokok: 0,
        tunjanganJabatan: 0,
        tunjanganMakan: 0,
        tunjanganTransportasi: 0,
        lemburReguler: 0,
        lemburLibur: 0,
        ritDalam: 0,
        ritLuar: 0,
        bkoReguler: 0,
        bkoCuti: 0,
        bpjsKesehatan: 0,
        bpjsTenagaKerja: 0,
        periodeCutoff: ''
      }
    ];
    setUnsurList(dummy);
  }, []);

  const handleChange = (id, field, value) => {
    setUnsurList((prev) =>
      prev.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    );
  };

  const handleSave = () => {
    console.log('Simpan data', unsurList);
    // TODO: save to backend / firestore
  };

  return (
    <div className="unsur-gaji-page">
      <main className="unsur-gaji-card" role="main">
        <section className="unsur-gaji-header">
          <div className="unsur-gaji-separator" />
        </section>

        <section className="unsur-gaji-content">
          <div className="unsur-gaji-table-wrapper">
            <table className="unsur-gaji-table">
              <thead>
                <tr>
                  <th>Lokasi</th>
                  <th>Kategori</th>
                  <th>Jabatan</th>
                  <th>Gaji Pokok</th>
                  <th>Tunj. Jabatan</th>
                  <th>Tunj. Makan</th>
                  <th>Tunj. Transport</th>
                  <th>Lembur Reg</th>
                  <th>Lembur Libur</th>
                  <th>RIT Dalam</th>
                  <th>RIT Luar</th>
                  <th>BKO Reg</th>
                  <th>BKO Cuti</th>
                  <th>BPJS Kes</th>
                  <th>BPJS TK</th>
                  <th>Periode Cut Off</th>
                </tr>
              </thead>
              <tbody>
                {unsurList.map((row) => (
                  <tr key={row.id}>
                    <td>
                      <select value={row.lokasi} onChange={(e) => handleChange(row.id, 'lokasi', e.target.value)}>
                        <option value="">Pilih Lokasi</option>
                        <option value="Jakarta">Jakarta</option>
                        <option value="Bandung">Bandung</option>
                      </select>
                    </td>
                    <td>
                      <select value={row.kategori} onChange={(e) => handleChange(row.id, 'kategori', e.target.value)}>
                        <option value="">Pilih Kategori</option>
                        <option value="A">A</option>
                        <option value="B">B</option>
                      </select>
                    </td>
                    <td>
                      <select value={row.jabatan} onChange={(e) => handleChange(row.id, 'jabatan', e.target.value)}>
                        <option value="">Pilih Jabatan</option>
                        <option value="Staff">Staff</option>
                        <option value="Supervisor">Supervisor</option>
                      </select>
                    </td>
                    <td><input type="number" value={row.gajiPokok} onChange={(e) => handleChange(row.id, 'gajiPokok', e.target.value)} /></td>
                    <td><input type="number" value={row.tunjanganJabatan} onChange={(e) => handleChange(row.id, 'tunjanganJabatan', e.target.value)} /></td>
                    <td><input type="number" value={row.tunjanganMakan} onChange={(e) => handleChange(row.id, 'tunjanganMakan', e.target.value)} /></td>
                    <td><input type="number" value={row.tunjanganTransportasi} onChange={(e) => handleChange(row.id, 'tunjanganTransportasi', e.target.value)} /></td>
                    <td><input type="number" value={row.lemburReguler} onChange={(e) => handleChange(row.id, 'lemburReguler', e.target.value)} /></td>
                    <td><input type="number" value={row.lemburLibur} onChange={(e) => handleChange(row.id, 'lemburLibur', e.target.value)} /></td>
                    <td><input type="number" value={row.ritDalam} onChange={(e) => handleChange(row.id, 'ritDalam', e.target.value)} /></td>
                    <td><input type="number" value={row.ritLuar} onChange={(e) => handleChange(row.id, 'ritLuar', e.target.value)} /></td>
                    <td><input type="number" value={row.bkoReguler} onChange={(e) => handleChange(row.id, 'bkoReguler', e.target.value)} /></td>
                    <td><input type="number" value={row.bkoCuti} onChange={(e) => handleChange(row.id, 'bkoCuti', e.target.value)} /></td>
                    <td><input type="number" value={row.bpjsKesehatan} onChange={(e) => handleChange(row.id, 'bpjsKesehatan', e.target.value)} /></td>
                    <td><input type="number" value={row.bpjsTenagaKerja} onChange={(e) => handleChange(row.id, 'bpjsTenagaKerja', e.target.value)} /></td>
                    <td>
                      <select value={row.periodeCutoff} onChange={(e) => handleChange(row.id, 'periodeCutoff', e.target.value)}>
                        <option value="">Pilih</option>
                        <option value="21">Cut Off 21</option>
                        <option value="26">Cut Off 26</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* footer tombol simpan */}
          <div className="unsur-gaji-footer">
            <button className="unsur-gaji-save-button" onClick={handleSave}>
              Simpan Unsur Gaji
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
