"use client";

import { useEffect, useRef, useState } from "react";
import {
  BriefcaseBusiness,
  Building2,
  Camera,
  CreditCard,
  Download,
  FileText,
  MapPin,
  Phone,
  Save,
  ShieldCheck,
  Upload,
  UserRound,
  X,
} from "lucide-react";

import { saveKaryawan } from "@/lib/karyawan";

import {
  createInitialForm,
  normalizeKaryawanData,
  validateKaryawanForm,
  toggleEmployeeStatus,
  isEmployeeActive,
  getGeneratedKaryawanId,
  buildSavedKaryawanData,
  getEmployeeName,
  getEmployeePhoto,
  formatInputDate,
  getCreateSuccessMessage,
  getEditSuccessMessage,
  getSaveErrorMessage,
  getModalTitle,
  getModalEyebrow,
  getModalDescription,
  getSaveButtonLabel,
  STATUS_PERNIKAHAN_OPTIONS,
  STATUS_KARYAWAN_OPTIONS,
} from "@/lib/util-modal-karyawan";

import "@/styles/components/modal-karyawan.css";

/* =========================================================
   MODAL KARYAWAN
========================================================= */

export default function KaryawanModal({
  mode = "create",
  employee = null,
  kategori = [],
  jabatan = [],
  onClose,
  onSaved,
}) {
  const [form, setForm] = useState(createInitialForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [activeTab, setActiveTab] = useState("personal");

  const [photoFile, setPhotoFile] = useState(null);
  const [ktpFile, setKtpFile] = useState(null);
  const [kkFile, setKkFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");

  const photoInputRef = useRef(null);
  const ktpInputRef = useRef(null);
  const kkInputRef = useRef(null);

  /* =======================================================
     INITIALIZE
  ======================================================= */

  useEffect(() => {
    setError("");
    setSuccessMessage("");
    setSaving(false);
    setActiveTab("personal");
    setPhotoFile(null);
    setKtpFile(null);
    setKkFile(null);
    setPhotoPreview("");

    if (mode === "create") {
      setForm(createInitialForm());
      return;
    }

	if (mode === "edit" && employee) {
	  const normalized = normalizeKaryawanData(employee);

	  setForm(normalized);
	  setPhotoPreview(normalized.foto_url || "");

	  return;
	}

    if (mode === "edit") {
      setForm(createInitialForm());
      setError("Data karyawan tidak tersedia.");
    }
  }, [mode, employee]);

  /* =======================================================
     CLEANUP PHOTO PREVIEW
  ======================================================= */

  useEffect(() => {
    return () => {
      if (photoPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(photoPreview);
      }
    };
  }, [photoPreview]);

  /* =======================================================
     FORM HANDLERS
  ======================================================= */

  function resetFeedback() {
    setError("");
    setSuccessMessage("");
  }

  function handleChange(e) {
    const { name, value } = e.target;

    setForm(prev => ({
      ...prev,
      [name]: value,
    }));

    resetFeedback();
  }

  function handlePhotoSelect(e) {
    const file = e.target.files?.[0];

    if (!file) return;

    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
    resetFeedback();
  }

  function handleKtpSelect(e) {
    const file = e.target.files?.[0];

    if (!file) return;

    setKtpFile(file);
    resetFeedback();
  }

  function handleKkSelect(e) {
    const file = e.target.files?.[0];

    if (!file) return;

    setKkFile(file);
    resetFeedback();
  }

  function handleStatusToggle() {
    setForm(prev => ({
      ...prev,
      status_aktif: toggleEmployeeStatus(prev.status_aktif),
    }));

    resetFeedback();
  }

  /* =======================================================
     SUBMIT
  ======================================================= */

  async function handleSubmit(e) {
    e.preventDefault();
    resetFeedback();

    const validation = validateKaryawanForm(form);

    if (validation) {
      setActiveTab(validation.tab);
      setError(validation.message);
      return;
    }

    setSaving(true);

    try {
      const result = await saveKaryawan(form);
      const generatedId = getGeneratedKaryawanId(result, form);
      const savedData = buildSavedKaryawanData(form, result);

      if (mode === "create") {
        setForm(prev => ({
          ...prev,
          id_karyawan: generatedId,
        }));

        setSuccessMessage(getCreateSuccessMessage(generatedId));
        onSaved?.(savedData, "create");

        return;
      }

      onSaved?.(savedData, "edit");
      setSuccessMessage(getEditSuccessMessage());
    } catch (err) {
      setError(getSaveErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  /* =======================================================
     CLOSE HANDLERS
  ======================================================= */

  function handleOverlayMouseDown(e) {
    if (e.target !== e.currentTarget || saving) return;

    onClose?.();
  }

  function handleClose() {
    if (!saving) onClose?.();
  }

  /* =======================================================
     PROFILE DATA
  ======================================================= */

const employeeName = getEmployeeName(form);
const employeePhoto = getEmployeePhoto(form);
const employeeActive = isEmployeeActive(form.status_aktif);
const currentPhotoPreview = photoPreview || employeePhoto;

  /* =======================================================
     TABS
  ======================================================= */

  const tabs = [
    {
      id: "personal",
      label: "Data Pribadi",
      icon: <UserRound size={16} strokeWidth={1.8} />,
    },
    {
      id: "contact",
      label: "Kontak & Alamat",
      icon: <Phone size={16} strokeWidth={1.8} />,
    },
    {
      id: "employment",
      label: "Pekerjaan",
      icon: <BriefcaseBusiness size={16} strokeWidth={1.8} />,
    },
    {
      id: "bpjs-bank",
      label: "BPJS & Bank",
      icon: <CreditCard size={16} strokeWidth={1.8} />,
    },
    {
      id: "income",
      label: "Penghasilan & Ukuran",
      icon: <Building2 size={16} strokeWidth={1.8} />,
    },
    {
      id: "notes",
      label: "Catatan",
      icon: <FileText size={16} strokeWidth={1.8} />,
    },
  ];

  return (
    <div
      className="modal-karyawan-overlay"
      onMouseDown={handleOverlayMouseDown}
    >
      <div
        className="modal-karyawan"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-karyawan-title"
      >
        {/* =================================================
            HEADER
        ================================================= */}

        <header className="modal-karyawan-header">
          <div className="modal-karyawan-header-content">
            <p className="modal-karyawan-eyebrow">
              {getModalEyebrow(mode)}
            </p>

            <h2 id="modal-karyawan-title">{getModalTitle(mode)}</h2>

            <p>{getModalDescription(mode)}</p>
          </div>

          <div className="modal-karyawan-header-actions">
            <button
              type="submit"
              form="form-karyawan"
              className="modal-karyawan-primary-button"
              disabled={saving}
            >
              {saving ? (
                <>
                  <span className="modal-karyawan-button-spinner" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save size={16} strokeWidth={1.8} />
                  {getSaveButtonLabel(mode)}
                </>
              )}
            </button>

            <button
              type="button"
              className="modal-karyawan-close-button"
              onClick={handleClose}
              disabled={saving}
              aria-label="Tutup modal"
              title="Tutup"
            >
              <X size={18} strokeWidth={1.8} />
            </button>
          </div>
        </header>

        {/* =================================================
            PROFILE — 3 GRID
        ================================================= */}

        <section className="modal-karyawan-profile">
          {/* GRID 1 — FOTO */}

          <div className="modal-karyawan-profile-grid modal-karyawan-profile-photo-grid">
            <div className="modal-karyawan-profile-photo-wrapper">
              <div className="modal-karyawan-profile-photo">
                {currentPhotoPreview ? (
                  <img
                    src={currentPhotoPreview}
                    alt={
                      employeeName
                        ? `Foto ${employeeName}`
                        : "Foto karyawan"
                    }
                  />
                ) : (
                  <div className="modal-karyawan-profile-placeholder">
                    <UserRound size={34} strokeWidth={1.5} />
                  </div>
                )}
              </div>

              <input
                ref={photoInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoSelect}
                disabled={saving}
                style={{ display: "none" }}
              />

              <button
                type="button"
                className="modal-karyawan-upload-photo-button"
                onClick={() => photoInputRef.current?.click()}
                disabled={saving}
              >
                <Camera size={14} strokeWidth={1.8} />
                <span>Upload Foto</span>
              </button>
            </div>
          </div>

			{/* GRID 2 — IDENTITAS */}

			<div className="modal-karyawan-profile-identity-grid">

			  {/* ID KARYAWAN */}
			  <div className="modal-karyawan-profile-id">
				<span className="modal-karyawan-profile-label">
				  ID Karyawan
				</span>

				<strong>
				  {form.id_karyawan || "ID akan dibuat otomatis"}
				</strong>
			  </div>

			  {/* STATUS */}
			  <div className="modal-karyawan-profile-status">
				<StatusToggle
				  active={employeeActive}
				  onChange={handleStatusToggle}
				  disabled={saving}
				/>
			  </div>

			  {/* NAMA */}
			  <div className="modal-karyawan-profile-name">
				<span className="modal-karyawan-profile-label">
				  Nama Karyawan
				</span>

				<h3>
				  {employeeName || "Karyawan Baru"}
				</h3>
			  </div>

			</div>

          {/* GRID 3 — PENEMPATAN */}

          <div className="modal-karyawan-profile-grid modal-karyawan-profile-placement-grid">
            <div className="modal-karyawan-profile-edit-field">
              <label>Kategori TK</label>

              <select
                name="kategori_tk"
                value={form.kategori_tk ?? ""}
                onChange={handleChange}
                disabled={saving}
              >
                <option value="">Pilih kategori</option>

                {kategori.map(item => (
                  <option key={String(item?.id)} value={String(item?.id)}>
                    {item?.nama}
                  </option>
                ))}
              </select>
            </div>

            <div className="modal-karyawan-profile-edit-field">
              <label>Lokasi Penempatan</label>

              <div className="modal-karyawan-profile-location">
                <MapPin size={14} strokeWidth={1.8} />

                <input
                  name="penempatan"
                  value={form.penempatan ?? ""}
                  onChange={handleChange}
                  placeholder="Lokasi penempatan"
                  disabled={saving}
                />
              </div>
            </div>
          </div>
        </section>

		{/* =================================================
			TABS — SINGLE LINE
		================================================= */}

		<nav className="modal-karyawan-tabs" aria-label="Form karyawan">
		  {tabs.map(tab => (
			<button
			  key={tab.id}
			  type="button"
			  className={
				activeTab === tab.id
				  ? "modal-karyawan-tab modal-karyawan-tab-active"
				  : "modal-karyawan-tab"
			  }
			  onClick={() => setActiveTab(tab.id)}
			>
			  {tab.icon}
			  <span>{tab.label}</span>
			</button>
		  ))}
		</nav>

        {/* =================================================
            FORM
        ================================================= */}

        <form
          id="form-karyawan"
          className="modal-karyawan-form"
          onSubmit={handleSubmit}
        >
          {/* =================================================
              PERSONAL
          ================================================= */}

          {activeTab === "personal" && (
            <FormTabContent>
              <FormSectionHeader
                icon={<UserRound size={17} strokeWidth={1.8} />}
                title="Data Pribadi"
                description="Informasi identitas dan data dasar karyawan."
              />

              <div className="modal-karyawan-form-grid modal-karyawan-form-grid-3">
                <FormField
                  label="NIK"
                  name="nik"
                  value={form.nik}
                  onChange={handleChange}
                  placeholder="Masukkan NIK"
                />

                <FormField
                  label="NPP"
                  name="npp"
                  value={form.npp}
                  onChange={handleChange}
                  placeholder="Masukkan NPP"
                />

                <FormField
                  label="Nama Karyawan"
                  name="nama_karyawan"
                  value={form.nama_karyawan}
                  onChange={handleChange}
                  placeholder="Nama lengkap karyawan"
                  required
                />

                <FormField
                  label="Kota Lahir"
                  name="kota_lahir"
                  value={form.kota_lahir}
                  onChange={handleChange}
                  placeholder="Kota kelahiran"
                />

                <FormField
                  label="Tanggal Lahir"
                  name="tanggal_lahir"
                  type="date"
                  value={formatInputDate(form.tanggal_lahir)}
                  onChange={handleChange}
                />

                <FormSelect
                  label="Status Pernikahan"
                  name="status_pernikahan"
                  value={form.status_pernikahan}
                  onChange={handleChange}
                  options={STATUS_PERNIKAHAN_OPTIONS}
                />

                <FormSectionDivider title="Dokumen Identitas" />

                <DocumentUploadField
                  label="Kartu Tanda Penduduk (KTP)"
                  existingUrl={form.KTP}
                  selectedFile={ktpFile}
                  inputRef={ktpInputRef}
                  onChange={handleKtpSelect}
                  disabled={saving}
                />

                <DocumentUploadField
                  label="Kartu Keluarga (KK)"
                  existingUrl={form.KK}
                  selectedFile={kkFile}
                  inputRef={kkInputRef}
                  onChange={handleKkSelect}
                  disabled={saving}
                />
              </div>
            </FormTabContent>
          )}

          {/* =================================================
              CONTACT
          ================================================= */}

          {activeTab === "contact" && (
            <FormTabContent>
              <FormSectionHeader
                icon={<Phone size={17} strokeWidth={1.8} />}
                title="Kontak & Alamat"
                description="Informasi komunikasi dan tempat tinggal."
              />

              <div className="modal-karyawan-form-grid modal-karyawan-form-grid-3">
                <FormField
                  label="No. HP"
                  name="no_hp"
                  value={form.no_hp}
                  onChange={handleChange}
                  placeholder="08xxxxxxxxxx"
                />

                <FormField
                  label="Nama Kontak Darurat"
                  name="nama_kontak_darurat"
                  value={form.nama_kontak_darurat}
                  onChange={handleChange}
                  placeholder="Nama kontak darurat"
                />

                <FormField
                  label="Nomor Kontak Darurat"
                  name="nomor_kontak_darurat"
                  value={form.nomor_kontak_darurat}
                  onChange={handleChange}
                  placeholder="Nomor kontak"
                />

                <FormField
                  label="Alamat KTP"
                  name="alamat_ktp"
                  value={form.alamat_ktp}
                  onChange={handleChange}
                  placeholder="Alamat sesuai KTP"
                  full
                  textarea
                />

                <FormField
                  label="Alamat Domisili"
                  name="alamat_domisili"
                  value={form.alamat_domisili}
                  onChange={handleChange}
                  placeholder="Alamat tempat tinggal saat ini"
                  full
                  textarea
                />
              </div>
            </FormTabContent>
          )}

          {/* =================================================
              EMPLOYMENT
          ================================================= */}

          {activeTab === "employment" && (
            <FormTabContent>
              <FormSectionHeader
                icon={<BriefcaseBusiness size={17} strokeWidth={1.8} />}
                title="Informasi Pekerjaan"
                description="Posisi, kategori, penempatan, dan status kepegawaian."
              />

              <div className="modal-karyawan-form-grid modal-karyawan-form-grid-3">
                <FormSelect
                  label="Kategori TK"
                  name="kategori_tk"
                  value={form.kategori_tk}
                  onChange={handleChange}
                  options={kategori.map(item => ({
                    value: item.id,
                    label: item.nama,
                  }))}
                  required
                />

                <FormSelect
                  label="Jabatan"
                  name="jabatan"
                  value={form.jabatan}
                  onChange={handleChange}
                  options={jabatan.map(item => ({
                    value: item.id,
                    label: item.nama,
                  }))}
                  required
                />

                <FormField
                  label="Lokasi Penempatan"
                  name="penempatan"
                  value={form.penempatan}
                  onChange={handleChange}
                  placeholder="Lokasi penempatan"
                />

                <FormField
                  label="Tanggal Masuk"
                  name="tanggal_masuk"
                  type="date"
                  value={formatInputDate(form.tanggal_masuk)}
                  onChange={handleChange}
                  required
                />

                <FormField
                  label="Tanggal Keluar"
                  name="tanggal_keluar"
                  type="date"
                  value={formatInputDate(form.tanggal_keluar)}
                  onChange={handleChange}
                />

                <FormSelect
                  label="Status Karyawan"
                  name="status_karyawan"
                  value={form.status_karyawan}
                  onChange={handleChange}
                  options={STATUS_KARYAWAN_OPTIONS}
                />

                <div className="modal-karyawan-form-status-field">
                  <label>Status Aktif</label>

                  <StatusToggle
                    active={employeeActive}
                    onChange={handleStatusToggle}
                    disabled={saving}
                    large
                  />
                </div>
              </div>
            </FormTabContent>
          )}

          {/* =================================================
              BPJS & BANK
          ================================================= */}

          {activeTab === "bpjs-bank" && (
            <FormTabContent>
              <FormSectionHeader
                icon={<ShieldCheck size={17} strokeWidth={1.8} />}
                title="BPJS & Informasi Bank"
                description="Informasi kepesertaan BPJS dan rekening pembayaran."
              />

              <div className="modal-karyawan-form-grid modal-karyawan-form-grid-3">
                <FormField
                  label="No. JKN Peserta"
                  name="no_jkn_peserta"
                  value={form.no_jkn_peserta}
                  onChange={handleChange}
                  placeholder="Nomor JKN peserta"
                />

                <FormField
                  label="Iuran BPJS Kesehatan"
                  name="iuran_bpjs_kesehatan"
                  value={form.iuran_bpjs_kesehatan}
                  onChange={handleChange}
                  placeholder="0"
                  type="number"
                />

                <FormField
                  label="Iuran BPJS Naker"
                  name="iuran_bpjs_naker"
                  value={form.iuran_bpjs_naker}
                  onChange={handleChange}
                  placeholder="0"
                  type="number"
                />

                <FormSectionDivider title="Informasi Bank" />

                <FormField
                  label="Nama Bank"
                  name="nama_bank"
                  value={form.nama_bank}
                  onChange={handleChange}
                  placeholder="Nama bank"
                />

                <FormField
                  label="Nomor Rekening"
                  name="nomor_rekening"
                  value={form.nomor_rekening}
                  onChange={handleChange}
                  placeholder="Nomor rekening"
                />

                <FormField
                  label="Nama Rekening"
                  name="nama_rekening"
                  value={form.nama_rekening}
                  onChange={handleChange}
                  placeholder="Nama pemilik rekening"
                />
              </div>
            </FormTabContent>
          )}

          {/* =================================================
              INCOME
          ================================================= */}

          {activeTab === "income" && (
            <FormTabContent>
              <FormSectionHeader
                icon={<Building2 size={17} strokeWidth={1.8} />}
                title="Penghasilan & Ukuran"
                description="Komponen penghasilan dan ukuran perlengkapan karyawan."
              />

              <div className="modal-karyawan-form-grid modal-karyawan-form-grid-3">
                <FormField
                  label="Gaji Pokok"
                  name="gaji_pokok"
                  value={form.gaji_pokok}
                  onChange={handleChange}
                  placeholder="0"
                  type="number"
                />

                <FormField
                  label="Tunj. Makan"
                  name="tunj_makan"
                  value={form.tunj_makan}
                  onChange={handleChange}
                  placeholder="0"
                  type="number"
                />

                <FormField
                  label="Tunj. Transport"
                  name="tunj_transport"
                  value={form.tunj_transport}
                  onChange={handleChange}
                  placeholder="0"
                  type="number"
                />

                <FormField
                  label="Tunj. Jabatan"
                  name="tunj_jabatan"
                  value={form.tunj_jabatan}
                  onChange={handleChange}
                  placeholder="0"
                  type="number"
                />

                <FormSectionDivider title="Ukuran Perlengkapan" />

                <FormField
                  label="Ukuran Baju"
                  name="ukuran_baju"
                  value={form.ukuran_baju}
                  onChange={handleChange}
                  placeholder="S / M / L / XL"
                />

                <FormField
                  label="Ukuran Celana"
                  name="ukuran_celana"
                  value={form.ukuran_celana}
                  onChange={handleChange}
                  placeholder="Ukuran celana"
                />

                <FormField
                  label="Ukuran Sepatu"
                  name="ukuran_sepatu"
                  value={form.ukuran_sepatu}
                  onChange={handleChange}
                  placeholder="Ukuran sepatu"
                />
              </div>
            </FormTabContent>
          )}

          {/* =================================================
              NOTES
          ================================================= */}

          {activeTab === "notes" && (
            <FormTabContent>
              <FormSectionHeader
                icon={<FileText size={17} strokeWidth={1.8} />}
                title="Catatan"
                description="Informasi tambahan terkait karyawan."
              />

              <div className="modal-karyawan-form-grid modal-karyawan-form-grid-3">
                <FormField
                  label="Keterangan"
                  name="Keterangan"
                  value={form.Keterangan}
                  onChange={handleChange}
                  placeholder="Keterangan tambahan"
                  full
                  textarea
                />

                <FormField
                  label="Catatan"
                  name="Catatan"
                  value={form.Catatan}
                  onChange={handleChange}
                  placeholder="Catatan internal"
                  full
                  textarea
                />
              </div>
            </FormTabContent>
          )}

          {/* =================================================
              FEEDBACK
          ================================================= */}

          {error && (
            <div className="modal-karyawan-form-error">
              <span>!</span>
              <p>{error}</p>
            </div>
          )}

          {successMessage && (
            <div className="modal-karyawan-form-success">
              <span>✓</span>
              <p>{successMessage}</p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

/* =========================================================
   FORM TAB CONTENT
========================================================= */

function FormTabContent({ children }) {
  return (
    <div className="modal-karyawan-tab-content">{children}</div>
  );
}

/* =========================================================
   FORM SECTION HEADER
========================================================= */

function FormSectionHeader({ icon, title, description }) {
  return (
    <div className="modal-karyawan-form-section-header">
      <div className="modal-karyawan-section-icon">{icon}</div>

      <div>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

/* =========================================================
   FORM SECTION DIVIDER
========================================================= */

function FormSectionDivider({ title }) {
  return (
    <div className="modal-karyawan-form-divider">
      <span>{title}</span>
    </div>
  );
}

/* =========================================================
   DOCUMENT UPLOAD
========================================================= */

function DocumentUploadField({
  label,
  existingUrl = "",
  selectedFile = null,
  inputRef,
  onChange,
  disabled = false,
}) {
  const existingFile = String(existingUrl || "").trim();
  const selectedFileName = selectedFile?.name || "";

  return (
    <div className="modal-karyawan-document-field">
      <div className="modal-karyawan-document-label">
        <label>{label}</label>

        <span>
          {selectedFileName
            ? selectedFileName
            : existingFile
              ? "Dokumen tersimpan"
              : "Belum ada dokumen"}
        </span>
      </div>

      <div className="modal-karyawan-document-actions">
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,image/*"
          onChange={onChange}
          disabled={disabled}
          style={{ display: "none" }}
        />

        <button
          type="button"
          className="modal-karyawan-document-upload-button"
          onClick={() => inputRef.current?.click()}
          disabled={disabled}
        >
          <Upload size={14} strokeWidth={1.8} />

          <span>{selectedFile ? "Ganti File" : "Upload"}</span>
        </button>

        {existingFile && (
          <a
            href={existingFile}
            target="_blank"
            rel="noopener noreferrer"
            className="modal-karyawan-document-download-button"
          >
            <Download size={14} strokeWidth={1.8} />
            <span>Download</span>
          </a>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   STATUS TOGGLE
========================================================= */

function StatusToggle({
  active,
  onChange,
  disabled = false,
  large = false,
}) {
  const classes = [
    "modal-karyawan-status-toggle",
    large && "modal-karyawan-status-toggle-large",
    active
      ? "modal-karyawan-status-toggle-active"
      : "modal-karyawan-status-toggle-inactive",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type="button"
      className={classes}
      onClick={onChange}
      disabled={disabled}
      aria-pressed={active}
      aria-label={active ? "Status Aktif" : "Status Tidak Aktif"}
    >
      <span className="modal-karyawan-status-toggle-track">
        <span className="modal-karyawan-status-toggle-thumb" />
      </span>

      <span className="modal-karyawan-status-toggle-label">
        {active ? "Aktif" : "Tidak Aktif"}
      </span>
    </button>
  );
}

/* =========================================================
   FORM FIELD
========================================================= */

function FormField({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
  full = false,
  textarea = false,
}) {
  const className = [
    "modal-karyawan-form-field",
    full && "modal-karyawan-form-field-full",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={className}>
      {label && (
        <label htmlFor={`karyawan-${name}`}>
          {label}

          {required && (
            <span className="modal-karyawan-required">*</span>
          )}
        </label>
      )}

      {textarea ? (
        <textarea
          id={`karyawan-${name}`}
          name={name}
          value={value ?? ""}
          onChange={onChange}
          placeholder={placeholder}
          rows={4}
          required={required}
        />
      ) : (
        <div className="modal-karyawan-input-wrapper">
          <input
            id={`karyawan-${name}`}
            name={name}
            type={type}
            value={value ?? ""}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
          />
        </div>
      )}
    </div>
  );
}

/* =========================================================
   FORM SELECT
========================================================= */

function FormSelect({
  label,
  name,
  value,
  onChange,
  options = [],
  required = false,
}) {
  return (
    <div className="modal-karyawan-form-field">
      <label htmlFor={`karyawan-${name}`}>
        {label}

        {required && (
          <span className="modal-karyawan-required">*</span>
        )}
      </label>

      <select
        id={`karyawan-${name}`}
        name={name}
        value={value ?? ""}
        onChange={onChange}
        required={required}
      >
        <option value="">Pilih {label}</option>

        {options.map(option => (
          <option
            key={String(option.value)}
            value={String(option.value)}
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}