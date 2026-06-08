'use client';

import { useState, useEffect } from 'react';

const tipeOptions = [
  'Lokasi',
  'Kategori',
  'Jabatan',
  'Gaji Pokok',
  'Tunjangan Jabatan',
  'Tunjangan Makan',
  'Tunjangan Transportasi',
  'Reguler',
  'Libur Nasional',
  'RIT Dalam Kota',
  'RIT Luar Kota',
  'Cuti',
  'Kesehatan',
  'Tenaga Kerja',
  'Periode Cut Off'
];

export default function UnsurGajiModal({
  isOpen,
  onClose,
  mode,
  data,
  onSubmit
}) {
  const [formData, setFormData] = useState({ nama: '', tipe: '' });

  useEffect(() => {
    if (data) {
      setFormData({ nama: data.nama, tipe: data.tipe, id: data.id });
    } else {
      setFormData({ nama: '', tipe: '' });
    }
  }, [data]);

  if (!isOpen) return null;

  const isView = mode === 'view';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="unsur-gaji-modal-overlay">
      <div className="unsur-gaji-modal">
        <h3 className="unsur-gaji-modal-title">
          {mode === 'add' && 'Tambah Unsur'}
          {mode === 'edit' && 'Edit Unsur'}
          {mode === 'view' && 'Detail Unsur'}
        </h3>

        <form onSubmit={handleSubmit} className="unsur-gaji-modal-form">
          <div className="unsur-gaji-form-group">
            <label>Nama Unsur</label>
            <input
              type="text"
              name="nama"
              value={formData.nama}
              onChange={handleChange}
              disabled={isView}
              required
              className="unsur-gaji-form-input"
            />
          </div>

          <div className="unsur-gaji-form-group">
            <label>Tipe Unsur</label>
            <select
              name="tipe"
              value={formData.tipe}
              onChange={handleChange}
              disabled={isView}
              required
              className="unsur-gaji-form-input"
            >
              <option value="">-- pilih tipe --</option>
              {tipeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          {!isView && (
            <button type="submit" className="unsur-gaji-btn-primary">
              Simpan
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="unsur-gaji-btn-secondary"
          >
            {isView ? 'Tutup' : 'Batal'}
          </button>
        </form>
      </div>
    </div>
  );
}
