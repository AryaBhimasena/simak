"use client";

import { useDataKaryawan } from "@/lib/useDataKaryawan";

export function PersonalTab() {
  const { form, handleChange } = useDataKaryawan();

  return (
    <div className="simakEmployeePage__grid">
      <Input label="Kode Karyawan" name="id_karyawan" value={form.id_karyawan} onChange={handleChange} />
      <Input label="NIK" name="nik" value={form.nik} onChange={handleChange} />
      <Input label="Nama Lengkap" name="nama" value={form.nama} onChange={handleChange} />
      <Input label="Kota Lahir" name="kota_lahir" value={form.kota_lahir} onChange={handleChange} />
      <Input label="Tanggal Lahir" type="date" name="tanggal_lahir" value={form.tanggal_lahir} onChange={handleChange} />

      <Select label="Status Pernikahan" name="status_pernikahan" value={form.status_pernikahan} onChange={handleChange}>
        <option value="">Pilih</option>
        <option value="Belum Menikah">Belum Menikah</option>
        <option value="Menikah">Menikah</option>
        <option value="Cerai">Cerai</option>
      </Select>

      <Input label="No HP" name="no_hp" value={form.no_hp} onChange={handleChange} />
      <Input label="Upload Foto" type="file" name="foto_url" onChange={handleChange} />

      <Textarea label="Alamat KTP" name="alamat_ktp" value={form.alamat_ktp} onChange={handleChange} full />
      <Textarea label="Alamat Domisili" name="alamat_domisili" value={form.alamat_domisili} onChange={handleChange} full />
    </div>
  );
}

export function KeluargaTab() {
  const { form, handleChange } = useDataKaryawan();

  return (
    <div className="simakEmployeePage__grid">
      <Input label="Nama Kontak Darurat" name="nama_kontak_darurat" value={form.nama_kontak_darurat} onChange={handleChange} />
      <Input label="Nomor Kontak Darurat" name="no_kontak_darurat" value={form.no_kontak_darurat} onChange={handleChange} />
    </div>
  );
}

export function KepegawaianTab() {
  const { form, handleChange } = useDataKaryawan();

  return (
    <div className="simakEmployeePage__grid">
      <Select label="Kategori Tenaga Kerja" name="kategori_tenaga_kerja" value={form.kategori_tenaga_kerja} onChange={handleChange}>
        <option value="">Pilih</option>
        <option value="Security">Security</option>
        <option value="Driver">Driver</option>
        <option value="Helper">Helper</option>
        <option value="Admin">Admin</option>
      </Select>

      <Input label="Jabatan" name="jabatan" value={form.jabatan} onChange={handleChange} />

      <Select label="Status Kerja" name="status_kerja" value={form.status_kerja} onChange={handleChange}>
        <option value="">Pilih</option>
        <option value="Tetap">Tetap</option>
        <option value="Kontrak">Kontrak</option>
        <option value="Harian">Harian</option>
      </Select>

      <Select label="Status" name="status_karyawan" value={form.status_karyawan} onChange={handleChange}>
        <option value="">Pilih</option>
        <option value="Aktif">Aktif</option>
        <option value="Non Aktif">Non Aktif</option>
        <option value="Resign">Resign</option>
      </Select>

      <Input label="TMT" type="date" name="tmt" value={form.tmt} onChange={handleChange} />
      <Input label="Masa Kerja" name="masa_kerja" value={form.masa_kerja} onChange={handleChange} />
      <Input label="Tanggal Non Aktif" type="date" name="tanggal_non_aktif" value={form.tanggal_non_aktif} onChange={handleChange} />

      <Textarea label="Keterangan" name="keterangan" value={form.keterangan} onChange={handleChange} full />
    </div>
  );
}

export function PenempatanTab() {
  const { form, handleChange } = useDataKaryawan();

  return (
    <div className="simakEmployeePage__grid">
      <Input label="Penempatan" name="penempatan" value={form.penempatan} onChange={handleChange} />
      <Input label="Basic Salary" type="number" name="basic_salary" value={form.basic_salary} onChange={handleChange} />
      <Input label="Tunjangan Makan" type="number" name="tunjangan_makan" value={form.tunjangan_makan} onChange={handleChange} />
      <Input label="Tunjangan Transport" type="number" name="tunjangan_transport" value={form.tunjangan_transport} onChange={handleChange} />
      <Input label="Tunjangan Jabatan" type="number" name="tunjangan_jabatan" value={form.tunjangan_jabatan} onChange={handleChange} />
    </div>
  );
}

export function DokumenTab() {
  const { form, handleChange } = useDataKaryawan();

  return (
    <div className="simakEmployeePage__grid">
      <Input label="NO JKN Peserta" name="no_jkn" value={form.no_jkn} onChange={handleChange} />
      <Input label="BPJS Kesehatan" name="bpjs_kesehatan" value={form.bpjs_kesehatan} onChange={handleChange} />
      <Input label="BPJS Naker" name="bpjs_naker" value={form.bpjs_naker} onChange={handleChange} />
      <Input label="NPP" name="npp" value={form.npp} onChange={handleChange} />
      <Input label="Bank" name="bank" value={form.bank} onChange={handleChange} />
      <Input label="Nomor Rekening" name="nomor_rekening" value={form.nomor_rekening} onChange={handleChange} />
      <Input label="Nama Rekening" name="nama_rekening" value={form.nama_rekening} onChange={handleChange} />
      <Input label="Ukuran Baju" name="ukuran_baju" value={form.ukuran_baju} onChange={handleChange} />
      <Input label="Ukuran Celana" name="ukuran_celana" value={form.ukuran_celana} onChange={handleChange} />
      <Input label="Ukuran Sepatu" name="ukuran_sepatu" value={form.ukuran_sepatu} onChange={handleChange} />
    </div>
  );
}

/* ================= REUSABLE FIELD COMPONENTS ================= */

function Input({ label, name, type = "text", value, onChange }: any) {
  return (
    <div className="simakEmployeePage__field">
      <label>{label}</label>
      <input type={type} name={name} value={value} onChange={onChange} />
    </div>
  );
}

function Textarea({ label, name, value, onChange, full = false }: any) {
  return (
    <div className={`simakEmployeePage__field ${full ? "simakEmployeePage__field--full" : ""}`}>
      <label>{label}</label>
      <textarea name={name} value={value} onChange={onChange} />
    </div>
  );
}

function Select({ label, name, value, onChange, children }: any) {
  return (
    <div className="simakEmployeePage__field">
      <label>{label}</label>
      <select name={name} value={value} onChange={onChange}>
        {children}
      </select>
    </div>
  );
}
