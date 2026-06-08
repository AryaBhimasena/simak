// app/dataKaryawan/page.js
'use client';

import { useState, useEffect, useRef } from 'react';
import { getAllKaryawan, bulkUploadKaryawan, saveKaryawan } from '@/services/dataKaryawanService';
import { Eye, Pencil } from 'lucide-react';
import KaryawanModal from '@/components/KaryawanModal';

export default function DataKaryawanPage() {
  const [karyawan, setKaryawan] = useState([]);
  const [filteredKaryawan, setFilteredKaryawan] = useState([]);
  const [search, setSearch] = useState('');
  const [filterLokasi, setFilterLokasi] = useState('');
  const fileInputRef = useRef();

  // State modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedData, setSelectedData] = useState(null);

  const loadData = async () => {
    const data = await getAllKaryawan();
    const sortedData = [...data].sort((a, b) => {
      const penempatanA = a.Penempatan?.toLowerCase() || '';
      const penempatanB = b.Penempatan?.toLowerCase() || '';
      return penempatanA.localeCompare(penempatanB);
    });
    setKaryawan(sortedData);
    setFilteredKaryawan(sortedData);
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    let filtered = karyawan;

    if (filterLokasi) {
      filtered = filtered.filter(k => k.Penempatan === filterLokasi);
    }

    if (search) {
      filtered = filtered.filter(k =>
        k.Nama?.toLowerCase().includes(search.toLowerCase()) ||
        k.NIK?.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilteredKaryawan(filtered);
  }, [search, filterLokasi, karyawan]);

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      await bulkUploadKaryawan(file);
      alert('Data karyawan berhasil diupload');
      loadData();
    } catch (err) {
      alert('Gagal upload: ' + err);
    }
  };

  const lokasiOptions = Array.from(
    new Set(karyawan.map(k => k.Penempatan).filter(Boolean))
  );

  const StatusToggle = ({ nik, status }) => {
    const isActive = status?.toLowerCase() === 'aktif';

    const handleToggle = async () => {
      const newStatus = isActive ? 'Tidak Aktif' : 'Aktif';
      await saveKaryawan(nik, { Status: newStatus });
      loadData();
    };

    return (
      <label className="toggle-switch">
        <input
          type="checkbox"
          checked={isActive}
          onChange={handleToggle}
        />
        <span className="slider" />
      </label>
    );
  };

  // === Modal Handlers ===
  const handleOpenAdd = () => {
    setModalMode('add');
    setSelectedData(null);
    setModalOpen(true);
  };

  const handleOpenView = (data) => {
    setModalMode('view');
    setSelectedData(data);
    setModalOpen(true);
  };

  const handleOpenEdit = (data) => {
    setModalMode('edit');
    setSelectedData(data);
    setModalOpen(true);
  };

  const handleSaveKaryawan = async (formData) => {
    await saveKaryawan(formData.NIK || formData.id, formData);
    loadData();
  };

  return (
    <div className="app-page">
      <main className="app-card" role="main" aria-labelledby="data-karyawan-title">

        {/* ===== HEADER ===== */}
        <section className="data-karyawan-header">
          <div className="header-top">
            <h2 id="data-karyawan-title" className="data-karyawan-title">Data Karyawan</h2>
            <div className="header-actions">
              <button className="btn-primary" onClick={handleOpenAdd}>
                Tambah Karyawan
              </button>
              <button className="btn-secondary" onClick={handleUploadClick}>
                Upload Data Karyawan
              </button>
              <input
                type="file"
                accept=".xlsx,.xls"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
            </div>
          </div>

          <div className="header-filters">
            <select
              className="filter-dropdown"
              value={filterLokasi}
              onChange={(e) => setFilterLokasi(e.target.value)}
            >
              <option value="">Semua Lokasi</option>
              {lokasiOptions.map((lokasi, idx) => (
                <option key={idx} value={lokasi}>{lokasi}</option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Cari karyawan"
              className="search-box"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="separator" />
        </section>

        {/* ===== CONTENT / TABLE ===== */}
        <section className="data-karyawan-content">
          <table className="karyawan-table">
            <thead>
              <tr>
                <th>No</th>
                <th>NIK</th>
                <th>Nama Karyawan</th>
                <th>Kategori TK</th>
                <th>Lokasi Penempatan</th>
                <th>No HP</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredKaryawan.map((k, index) => (
                <tr key={k.id}>
                  <td>{index + 1}</td>
                  <td>{k.NIK}</td>
                  <td>{k.Nama}</td>
                  <td>{k['Kategori Tenaga Kerja']}</td>
                  <td>{k.Penempatan}</td>
                  <td>{k['No HP'] || '-'}</td>
                  <td>
                    <StatusToggle nik={k.NIK || k.id} status={k.Status} />
                  </td>
                  <td>
                    <button
                      title="View"
                      className="btn-icon"
                      onClick={() => handleOpenView(k)}
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      title="Edit"
                      className="btn-icon"
                      onClick={() => handleOpenEdit(k)}
                    >
                      <Pencil size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

      </main>

      {/* Modal */}
      <KaryawanModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        mode={modalMode}
        data={selectedData}
        onSubmit={handleSaveKaryawan}
      />
    </div>
  );
}
