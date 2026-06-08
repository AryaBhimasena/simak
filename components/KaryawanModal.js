'use client';
import { useState, useRef } from 'react';
import { Pencil, Trash } from 'lucide-react';

export default function KaryawanModal({ isOpen, onClose, mode, data }) {
  const [isActive, setIsActive] = useState(true);
  const [photo, setPhoto] = useState(data?.foto || null);
  const [activeTab, setActiveTab] = useState('dataKaryawan');
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file && ['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
      const reader = new FileReader();
      reader.onload = () => {
        setPhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const calculateAge = (dob) => {
    if (!dob) return '';
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return `${age}th`;
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        {/* HEADER */}
        <div className="modal-header">
          <h2>{mode === 'edit' ? 'Edit Karyawan' : 'Tambah Karyawan'}</h2>

          {/* Toggle Status dengan prefix km- */}
          <div
            className={`km-toggle-switch ${isActive ? 'km-active' : 'km-inactive'}`}
            onClick={() => {
              const newStatus = !isActive;
              setIsActive(newStatus);
              // TODO: update Firestore di sini
            }}
          >
            <div className="km-toggle-slider"></div>
            <span className="km-toggle-label km-aktif">Aktif</span>
            <span className="km-toggle-label km-nonaktif">Non Aktif</span>
          </div>
        </div>

        {/* DATA KARYAWAN */}
        <div className="modal-body">
          <div className="data-karyawan">
            {/* Foto */}
            <div
              className="photo-section"
              onDoubleClick={() => fileInputRef.current.click()}
            >
              {photo ? (
                <img src={photo} alt="Foto Karyawan" className="profile-photo" />
              ) : (
                <div className="avatar-placeholder">
                  <span>Double click untuk upload foto</span>
                </div>
              )}
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept="image/jpeg, image/jpg, image/png"
                onChange={handlePhotoUpload}
              />
              
              {/* Icon Edit & Hapus dengan prefix km- */}
				<div className="km-photo-actions">
				  <button
					type="button"
					className="km-icon-btn km-edit-icon"
					onClick={() => fileInputRef.current.click()}
				  >
					<Pencil size={18} />
				  </button>

				  <button
					type="button"
					className="km-icon-btn km-delete-icon"
					onClick={() => setPhoto(null)}
				  >
					<Trash size={18} />
				  </button>
				</div>
            </div>

            {/* Info Karyawan */}
            <div className="info-section">
              <h3>
                {data?.Nama || 'Nama Karyawan'}, {calculateAge(data?.['Tanggal Lahir'])}
              </h3>
              <p className="jabatan">{data?.Jabatan || '-'}</p>
              <p className="lokasi">{data?.Lokasi || '-'}</p>
              <p className="nohp">{data?.['No HP'] || '-'}</p>
            </div>
          </div>
        </div>

        {/* DETAIL KARYAWAN */}
        <div className="km-detail-section">
          <div className="tab-nav">
            <button
              className={activeTab === 'dataKaryawan' ? 'active' : ''}
              onClick={() => setActiveTab('dataKaryawan')}
            >
              Data Karyawan
            </button>
            <button
              className={activeTab === 'dataPribadi' ? 'active' : ''}
              onClick={() => setActiveTab('dataPribadi')}
            >
              Data Pribadi
            </button>
            <button
              className={activeTab === 'unsurGaji' ? 'active' : ''}
              onClick={() => setActiveTab('unsurGaji')}
            >
              Unsur Gaji
            </button>
          </div>

          <div className="tab-content">
		  {activeTab === 'dataKaryawan' && (
			<div className="form-grid">
			  <label>NIK<input type="text" defaultValue={data?.NIK || ''} /></label>
			  <label>Kategori Tenaga Kerja<input type="text" defaultValue={data?.['Kategori Tenaga Kerja'] || ''} /></label>
			  <label>Status<input type="text" defaultValue={data?.Status || ''} /></label>
			  <label>Status Kerja<input type="text" defaultValue={data?.['Status Kerja'] || ''} /></label>
			  <label>TMT<input type="text" defaultValue={data?.TMT || ''} /></label>
			  <label>Tanggal Non Aktif<input type="text" defaultValue={data?.['Tanggal Non Aktif'] || ''} /></label>
			  <label>Libur Nasional<input type="text" defaultValue={data?.['Libur Nasional'] || ''} /></label>
			  <label>Keterangan<input type="text" defaultValue={data?.Keterangan || ''} /></label>
			</div>
		  )}

		  {activeTab === 'dataPribadi' && (
			<div className="form-grid">
			  <label>Kota Lahir<input type="text" defaultValue={data?.['Kota Lahir'] || ''} /></label>
			  <label>Tanggal Lahir<input type="text" defaultValue={data?.['Tanggal Lahir'] || ''} /></label>
			  <label>Status Pernikahan<input type="text" defaultValue={data?.['Status Pernikahan'] || ''} /></label>
			  <label>Alamat KTP<input type="text" defaultValue={data?.['Alamat KTP'] || ''} /></label>
			  <label>Alamat Domisili<input type="text" defaultValue={data?.['Alamat Domisili'] || ''} /></label>
			  <label>Nama Kontak Darurat<input type="text" defaultValue={data?.['Nama Kontak Darurat'] || ''} /></label>
			  <label>Nomor Kontak Darurat<input type="text" defaultValue={data?.['Nomor Kontak Darurat'] || ''} /></label>
			  <label>Nama Bank<input type="text" defaultValue={data?.['Nama Bank'] || ''} /></label>
			  <label>Nomor Rekening<input type="text" defaultValue={data?.['Nomor Rekening'] || ''} /></label>
			  <label>BPJS Kesehatan<input type="text" defaultValue={data?.['BPJS Kesehatan'] || ''} /></label>
			  <label>BPJS Naker<input type="text" defaultValue={data?.['BPJS Naker'] || ''} /></label>
			  <label>NO JKN Peserta<input type="text" defaultValue={data?.['NO JKN Peserta'] || ''} /></label>
			  <label>NPP<input type="text" defaultValue={data?.NPP || ''} /></label>
			  <label>Ukuran Baju<input type="text" defaultValue={data?.['Ukuran Baju'] || ''} /></label>
			  <label>Ukuran Celana<input type="text" defaultValue={data?.['Ukuran Celana'] || ''} /></label>
			  <label>Ukuran Sepatu<input type="text" defaultValue={data?.['Ukuran Sepatu'] || ''} /></label>
			</div>
		  )}

		  {activeTab === 'unsurGaji' && (
			<div className="form-grid">
			  <label>Basic Salary<input type="text" defaultValue={data?.['Basic Salary'] || ''} /></label>
			  <label>Tunjangan Jabatan<input type="text" defaultValue={data?.['Tunjangan Jabatan'] || ''} /></label>
			  <label>Tunjangan Makan<input type="text" defaultValue={data?.['Tunjangan Makan'] || ''} /></label>
			  <label>Tunjangan Transport<input type="text" defaultValue={data?.['Tunjangan Transport'] || ''} /></label>
			  <label>Rit Dalam Kota<input type="text" defaultValue={data?.['Rit Dalam Kota'] || ''} /></label>
			  <label>Rit Luar Kota<input type="text" defaultValue={data?.['Rit Luar Kota'] || ''} /></label>
			</div>
		  )}
		</div>
        </div>

        {/* FOOTER */}
        <div className="modal-footer">
          <button onClick={onClose}>Tutup</button>
          <button className="btn-primary">Simpan</button>
        </div>
      </div>
    </div>
  );
}
