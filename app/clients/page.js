'use client';

import { useState, useEffect, useRef } from 'react';
import { Eye, Pencil } from 'lucide-react';
import Swal from 'sweetalert2';
import { getAllClient, bulkUploadClient } from '@/services/dataClientService';

export default function DataClientPage() {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [search, setSearch] = useState('');
  const fileInputRef = useRef();

  const loadData = async () => {
    try {
      const data = await getAllClient();
      const sortedData = [...data].sort((a, b) => {
        const namaA = a['namaClient']?.toLowerCase() || '';
        const namaB = b['namaClient']?.toLowerCase() || '';
        return namaA.localeCompare(namaB);
      });
      setClients(sortedData);
      setFilteredClients(sortedData);
    } catch (err) {
      Swal.fire('Error', 'Gagal memuat data client', 'error');
      console.error('Load data error:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    let filtered = clients;
    if (search) {
      filtered = filtered.filter(c =>
        c['namaClient']?.toLowerCase().includes(search.toLowerCase()) ||
        c['kodeClient']?.toLowerCase().includes(search.toLowerCase()) ||
        c['kotaClient']?.toLowerCase().includes(search.toLowerCase())
      );
    }
    setFilteredClients(filtered);
  }, [search, clients]);

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    Swal.fire({
      title: 'Sedang mengupload...',
      text: 'Harap tunggu, proses upload data client sedang berlangsung.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      const result = await bulkUploadClient(file);
      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: `Data client berhasil diupload (${result.inserted} baris).`
      });
      loadData();
    } catch (err) {
      console.error('Upload error:', err);
      Swal.fire({
        icon: 'error',
        title: 'Gagal Upload',
        text: err?.message || err
      });
    } finally {
      e.target.value = ''; // reset input supaya bisa upload file yang sama lagi
    }
  };

  // === Handlers tanpa modal ===
  const handleOpenAdd = () => {
    Swal.fire('Info', 'Fitur Tambah Client belum tersedia', 'info');
  };

  const handleOpenView = (data) => {
    Swal.fire({
      title: 'Detail Client',
      html: `<pre style="text-align:left">${JSON.stringify(data, null, 2)}</pre>`,
      width: 600,
    });
  };

  const handleOpenEdit = (data) => {
    Swal.fire({
      title: 'Edit Client',
      html: `<pre style="text-align:left">${JSON.stringify(data, null, 2)}</pre>`,
      width: 600,
    });
  };

  return (
    <div className="app-page">
      <main className="app-card" role="main" aria-labelledby="data-client-title">

        {/* ===== HEADER ===== */}
        <section className="data-client-header">
          <div className="header-top">
            <h2 id="data-client-title" className="data-client-title">Data Client</h2>
            <div className="header-actions">
              <button className="btn-primary" onClick={handleOpenAdd}>
                Tambah Client
              </button>
              <button className="btn-secondary" onClick={handleUploadClick}>
                Upload Data Client
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

          <div className="search-container">
            <input
              type="text"
              placeholder="Cari client (nama, kode, kota)"
              className="search-box"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="separator" />
        </section>

        {/* ===== CONTENT / TABLE ===== */}
        <section className="data-client-content">
          <table className="client-table">
            <thead>
              <tr>
                <th>No</th>
                <th>Kode Client</th>
                <th>Nama Client</th>
                <th>Nama Gedung</th>
                <th>Alamat Client</th>
                <th>Kota</th>
                <th>Kode Pos</th>
                <th>NPWP</th>
                <th>Contact Person</th>
                <th>No Contact</th>
                <th>Periode Kontrak</th>
                <th>Dokumen Kontrak</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.length === 0 ? (
                <tr>
                  <td colSpan={13} style={{ textAlign: 'center', padding: '1rem' }}>
                    Tidak ada data client
                  </td>
                </tr>
              ) : (
                filteredClients.map((c, index) => (
                  <tr key={c.id}>
                    <td>{index + 1}</td>
                    <td>{c['kodeClient']}</td>
                    <td>{c['namaClient']}</td>
                    <td>{c['namaGedung']}</td>
                    <td>{c['alamatClient']}</td>
                    <td>{c['kotaClient']}</td>
                    <td>{c['kodePos']}</td>
                    <td>{c['NPWP']}</td>
                    <td>{c['contactPerson']}</td>
                    <td>{c['nomorContactPerson']}</td>
                    <td>
                      {c['Periode Kontrak Start'] || c['Periode Kontrak End']
                        ? `${c['periodeKontrakStart'] || ''} - ${c['periodeKontrakEnd'] || ''}`
                        : '-'}
                    </td>
                    <td>
                      {c['dokumenKontrak'] ? (
                        <a href={c['dokumenKontrak']} target="_blank" rel="noopener noreferrer">
                          Lihat Dokumen
                        </a>
                      ) : '-'}
                    </td>
                    <td>
                      <button
                        title="View"
                        className="btn-icon"
                        onClick={() => handleOpenView(c)}
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        title="Edit"
                        className="btn-icon"
                        onClick={() => handleOpenEdit(c)}
                      >
                        <Pencil size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </section>

      </main>
    </div>
  );
}
