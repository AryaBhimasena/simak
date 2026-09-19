"use client";

import { useState } from "react";
import {
  CreditCard,
  ArrowLeft,
  ArrowRight,
  Search,
  MessageCircle,
  UserRound,
  BriefcaseBusiness,
  MapPin,
  X,
  CheckCircle2,
} from "lucide-react";

export default function KaryawanLama({
  hasFoundEmployee = false,

  /* SEARCH */
  searchNik,
  setSearchNik,
  searchIdKaryawan,
  setSearchIdKaryawan,
  employeeNotFound,
  setEmployeeNotFound,
  isFindingEmployee,
  handleFindEmployee,

  /* FORM */
  currentStep,
  totalSteps,
  formData,
  updateField,
  photoPreview,
  existingPhotoUrl,
  errorMessage,
  isLoading,
  handleNext,
  handlePrevious,
  handlePhotoChange,
  handleBackToTypeSelection,
  handleSubmit,

  /* COMPONENT */
  StepProgress,
  StepOne,
  StepTwo,
  StepThree,
  InputField,
  Brand,
  Footer,

  /* MASTER DATA */
  kategoriTenagaKerjaOptions = [],
  jabatanOptions = [],
  penempatanOptions = [],
  isLoadingStepTwoOptions = false,
  stepTwoOptionsError = "",
}) {
  const [searchMethod, setSearchMethod] = useState("nik");
  const [showAdminHelp, setShowAdminHelp] = useState(false);

  const [adminForm, setAdminForm] = useState({
    nama: "",
    kategori: "",
    jabatan: "",
    penempatan: "",
  });

  const handleChangeMethod = (method) => {
    setSearchMethod(method);
    setEmployeeNotFound("");
  };

  const handleSearch = () => {
    const value =
      searchMethod === "nik"
        ? searchNik
        : searchIdKaryawan;

    handleFindEmployee({
      method: searchMethod,
      value,
    });
  };

  const handleAdminFormChange = (field, value) => {
    setAdminForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleSendAdminWhatsApp = () => {
    const {
      nama,
      kategori,
      jabatan,
      penempatan,
    } = adminForm;

    const message = [
      "Halo Admin, saya ingin meminta bantuan mencari ID Karyawan untuk registrasi karyawan lama.",
      "",
      `Nama: ${nama || "-"}`,
      `Kategori tenaga kerja: ${kategori || "-"}`,
      `Jabatan: ${jabatan || "-"}`,
      `Lokasi penempatan: ${penempatan || "-"}`,
      "",
      "Mohon bantuan Admin untuk menginformasikan ID Karyawan saya.",
      "Terima kasih.",
    ].join("\n");

    const whatsappUrl =
      `https://wa.me/6285745407653?text=${encodeURIComponent(message)}`;

    window.open(
      whatsappUrl,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const isAdminFormValid =
    adminForm.nama.trim() &&
    adminForm.kategori &&
    adminForm.jabatan.trim() &&
    adminForm.penempatan.trim();

  /* =====================================================
     FORM KARYAWAN LAMA
  ===================================================== */

  if (hasFoundEmployee) {
    return (
      <main className="register-page">
        <div className="register-container">
          <div className="register-form-wrapper">
            <Brand />

            <div className="register-header">
              <p className="register-eyebrow">
                KARYAWAN LAMA
              </p>

              <h1>Perbarui data karyawan</h1>

              <p>
                Periksa dan lengkapi kembali data karyawan
                yang sudah terdaftar.
              </p>
            </div>

            <StepProgress currentStep={currentStep} />

            <form
              onSubmit={handleSubmit}
              className="register-form"
            >
              {currentStep === 1 && (
                <StepOne
                  formData={formData}
                  updateField={updateField}
                  registrationType="lama"
                />
              )}

              {currentStep === 2 && (
                <StepTwo
                  formData={formData}
                  updateField={updateField}
                  kategoriTenagaKerjaOptions={
                    kategoriTenagaKerjaOptions
                  }
                  jabatanOptions={jabatanOptions}
                  penempatanOptions={penempatanOptions}
                  isLoadingStepTwoOptions={
                    isLoadingStepTwoOptions
                  }
                  stepTwoOptionsError={
                    stepTwoOptionsError
                  }
                />
              )}

              {currentStep === 3 && (
                <StepThree
                  foto={formData.foto}
                  photoPreview={photoPreview}
                  existingPhotoUrl={existingPhotoUrl}
                  registrationType="lama"
                  handlePhotoChange={handlePhotoChange}
                />
              )}

              {errorMessage && (
                <div
                  className="register-error"
                  role="alert"
                  aria-live="polite"
                >
                  {errorMessage}
                </div>
              )}

              <div className="register-navigation">
                {currentStep === 1 && (
                  <button
                    type="button"
                    className="register-button register-button-secondary"
                    onClick={handleBackToTypeSelection}
                    disabled={isLoading}
                    aria-label="Ganti pilihan pendaftaran"
                  >
                    <ArrowLeft
                      size={18}
                      strokeWidth={2}
                    />
                    <span>Ganti pilihan</span>
                  </button>
                )}

                {currentStep > 1 && (
                  <button
                    type="button"
                    className="register-button register-button-secondary"
                    onClick={handlePrevious}
                    disabled={isLoading}
                    aria-label="Kembali ke langkah sebelumnya"
                  >
                    <ArrowLeft
                      size={18}
                      strokeWidth={2}
                    />
                    <span>Kembali</span>
                  </button>
                )}

                {currentStep < totalSteps && (
                  <button
                    type="button"
                    className="register-button"
                    onClick={handleNext}
                    disabled={
                      isLoading ||
                      (
                        currentStep === 2 &&
                        isLoadingStepTwoOptions
                      )
                    }
                  >
                    <span>Lanjutkan</span>
                    <ArrowRight
                      size={19}
                      strokeWidth={2}
                    />
                  </button>
                )}

                {currentStep === totalSteps && (
                  <button
                    type="submit"
                    className="register-button"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span>Menyimpan perubahan...</span>
                    ) : (
                      <>
                        <span>Simpan perubahan</span>
                        <CheckCircle2
                          size={19}
                          strokeWidth={2}
                        />
                      </>
                    )}
                  </button>
                )}
              </div>

              <p className="register-note">
                {currentStep === 1 &&
                  "Periksa kembali data pribadi dan masukkan NIK baru yang masih berlaku."}

                {currentStep === 2 &&
                  "Pastikan informasi kepegawaian yang ditampilkan sudah sesuai."}

                {currentStep === 3 &&
                  "Upload foto terbaru. Foto lama tidak digunakan kembali."}
              </p>
            </form>

            <Footer />
          </div>
        </div>
      </main>
    );
  }

  /* =====================================================
     PENCARIAN KARYAWAN LAMA
  ===================================================== */

  return (
    <main className="register-page">
      <div className="register-container">
        <div className="register-form-wrapper">
          <Brand />

          <div className="register-header">
            <p className="register-eyebrow">
              KARYAWAN LAMA
            </p>

            <h1>Perbarui data karyawan</h1>

            <p>
              Cari data karyawan yang sudah terdaftar
              menggunakan NIK atau ID Karyawan.
            </p>
          </div>

          <div className="form-section">
            <div className="register-method-label">
              Cari berdasarkan
            </div>

            <div className="register-method-switch">
              <button
                type="button"
                className={
                  searchMethod === "nik"
                    ? "register-method-option active"
                    : "register-method-option"
                }
                onClick={() =>
                  handleChangeMethod("nik")
                }
              >
                <CreditCard size={17} />
                <span>NIK</span>
              </button>

              <button
                type="button"
                className={
                  searchMethod === "id_karyawan"
                    ? "register-method-option active"
                    : "register-method-option"
                }
                onClick={() =>
                  handleChangeMethod("id_karyawan")
                }
              >
                <UserRound size={17} />
                <span>ID Karyawan</span>
              </button>
            </div>

            {searchMethod === "nik" && (
              <InputField
                id="search_nik"
                label="NIK"
                placeholder="Masukkan 16 digit NIK"
                icon={CreditCard}
                value={searchNik}
                onChange={(value) => {
                  setSearchNik(
                    value.replace(/\D/g, "")
                  );
                  setEmployeeNotFound("");
                }}
                inputMode="numeric"
                maxLength={16}
                autoComplete="off"
              />
            )}

            {searchMethod === "id_karyawan" && (
              <InputField
                id="search_id_karyawan"
                label="ID Karyawan"
                placeholder="Masukkan ID Karyawan"
                icon={UserRound}
                value={searchIdKaryawan}
                onChange={(value) => {
                  setSearchIdKaryawan(value);
                  setEmployeeNotFound("");
                }}
                autoComplete="off"
              />
            )}

            {employeeNotFound && (
              <div
                className="register-error"
                role="alert"
                aria-live="polite"
              >
                {employeeNotFound}
              </div>
            )}

            <button
              type="button"
              className="register-button"
              disabled={
                isFindingEmployee ||
                (
                  searchMethod === "nik"
                    ? searchNik.length !== 16
                    : !searchIdKaryawan.trim()
                )
              }
              onClick={handleSearch}
            >
              {isFindingEmployee ? (
                <span>Mencari data...</span>
              ) : (
                <>
                  <span>Pembaruan Data</span>
                  <Search
                    size={19}
                    strokeWidth={2}
                  />
                </>
              )}
            </button>

            {searchMethod === "id_karyawan" && (
              <button
                type="button"
                className="register-admin-help-link"
                onClick={() =>
                  setShowAdminHelp(true)
                }
              >
                <MessageCircle
                  size={17}
                  strokeWidth={1.8}
                />

                <span>
                  Tidak tahu ID Karyawan? Hubungi Admin
                </span>
              </button>
            )}
          </div>

          {showAdminHelp && (
            <div
              className="register-modal-backdrop"
              role="presentation"
              onClick={() =>
                setShowAdminHelp(false)
              }
            >
              <div
                className="register-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="admin-help-title"
                onClick={(event) =>
                  event.stopPropagation()
                }
              >
                <div className="register-modal-header">
                  <div>
                    <p className="register-eyebrow">
                      BANTUAN ADMIN
                    </p>

                    <h2 id="admin-help-title">
                      Minta ID Karyawan
                    </h2>
                  </div>

                  <button
                    type="button"
                    className="register-modal-close"
                    aria-label="Tutup"
                    onClick={() =>
                      setShowAdminHelp(false)
                    }
                  >
                    <X size={20} />
                  </button>
                </div>

                <p className="register-modal-description">
                  Isi data berikut agar Admin dapat
                  membantu menemukan ID Karyawan Anda.
                </p>

                <div className="register-modal-form">
                  <InputField
                    id="admin_nama"
                    label="Nama"
                    placeholder="Masukkan nama lengkap"
                    icon={UserRound}
                    value={adminForm.nama}
                    onChange={(value) =>
                      handleAdminFormChange(
                        "nama",
                        value
                      )
                    }
                    autoComplete="name"
                  />

                  <div className="register-input-group">
                    <label
                      htmlFor="admin_kategori"
                      className="register-input-label"
                    >
                      Kategori Tenaga Kerja
                    </label>

                    <select
                      id="admin_kategori"
                      className="register-select"
                      value={adminForm.kategori}
                      onChange={(event) =>
                        handleAdminFormChange(
                          "kategori",
                          event.target.value
                        )
                      }
                      disabled={
                        !kategoriTenagaKerjaOptions.length
                      }
                    >
                      <option value="">
                        {kategoriTenagaKerjaOptions.length
                          ? "Pilih kategori tenaga kerja"
                          : "Data kategori belum tersedia"}
                      </option>

                      {kategoriTenagaKerjaOptions.map(
                        (option) => (
                          <option
                            key={option.value}
                            value={option.value}
                          >
                            {option.label}
                          </option>
                        )
                      )}
                    </select>
                  </div>

                  <InputField
                    id="admin_jabatan"
                    label="Jabatan"
                    placeholder="Masukkan jabatan"
                    icon={BriefcaseBusiness}
                    value={adminForm.jabatan}
                    onChange={(value) =>
                      handleAdminFormChange(
                        "jabatan",
                        value
                      )
                    }
                    autoComplete="organization-title"
                  />

                  <InputField
                    id="admin_penempatan"
                    label="Lokasi Penempatan"
                    placeholder="Masukkan lokasi penempatan"
                    icon={MapPin}
                    value={adminForm.penempatan}
                    onChange={(value) =>
                      handleAdminFormChange(
                        "penempatan",
                        value
                      )
                    }
                    autoComplete="off"
                  />
                </div>

                <div className="register-modal-actions">
                  <button
                    type="button"
                    className="register-modal-cancel"
                    onClick={() =>
                      setShowAdminHelp(false)
                    }
                  >
                    Batal
                  </button>

                  <button
                    type="button"
                    className="register-button"
                    disabled={!isAdminFormValid}
                    onClick={handleSendAdminWhatsApp}
                  >
                    <MessageCircle size={18} />

                    <span>
                      Chat Admin via WhatsApp
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}

          <button
            type="button"
            className="register-back-choice"
            onClick={handleBackToTypeSelection}
          >
            <ArrowLeft
              size={17}
              strokeWidth={1.8}
            />

            <span>
              Kembali memilih jenis karyawan
            </span>
          </button>

          <Footer />
        </div>
      </div>
    </main>
  );
}