// app/register/karyawan-lama.js

"use client";

import { useState } from "react";
import {
  CreditCard,
  ArrowLeft,
  Search,
  MessageCircle,
  UserRound,
  BriefcaseBusiness,
  MapPin,
  X,
} from "lucide-react";

const KATEGORI_TENAGA_KERJA = [
  "security",
  "driver",
  "helper",
  "admin",
  "ob",
];

export default function KaryawanLama({
  searchNik,
  setSearchNik,
  employeeNotFound,
  setEmployeeNotFound,
  isFindingEmployee,
  handleFindEmployee,
  handleBackToTypeSelection,
  InputField,
  Brand,
  Footer,
}) {

  /* =====================================================
   * STATE
   * ===================================================== */

  const [searchMethod, setSearchMethod] = useState("nik");

  const [searchIdKaryawan, setSearchIdKaryawan] = useState("");

  const [showAdminHelp, setShowAdminHelp] = useState(false);

  const [adminForm, setAdminForm] = useState({
    nama: "",
    kategori: "",
    jabatan: "",
    penempatan: "",
  });


  /* =====================================================
   * HANDLER
   * ===================================================== */

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

    setAdminForm((prev) => ({
      ...prev,
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
   * RENDER
   * ===================================================== */

  return (
    <main className="register-page">
      <div className="register-container">
        <div className="register-form-wrapper">

          <Brand />

          <div className="register-header">
            <p className="register-eyebrow">
              KARYAWAN LAMA
            </p>

            <h1>
              Perbarui data karyawan
            </h1>

            <p>
              Cari data karyawan yang sudah terdaftar
              menggunakan NIK atau ID Karyawan.
            </p>
          </div>


          {/* =================================================
           * PILIH METODE PENCARIAN
           * ================================================= */}

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
                onClick={() => handleChangeMethod("nik")}
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
                onClick={() => handleChangeMethod("id_karyawan")}
              >
                <UserRound size={17} />
                <span>ID Karyawan</span>
              </button>

            </div>


            {/* =================================================
             * INPUT NIK
             * ================================================= */}

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


            {/* =================================================
             * INPUT ID KARYAWAN
             * ================================================= */}

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


            {/* =================================================
             * PESAN ERROR / INFORMASI
             * ================================================= */}

            {employeeNotFound && (

              <div
                className="register-error"
                role="alert"
              >
                {employeeNotFound}
              </div>

            )}


            {/* =================================================
             * TOMBOL CARI
             * ================================================= */}

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


            {/* =================================================
             * BANTUAN ADMIN
             * ================================================= */}

            {searchMethod === "id_karyawan" && (

              <button
                type="button"
                className="register-admin-help-link"
                onClick={() => setShowAdminHelp(true)}
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


          {/* ===================================================
           * MODAL FORM BANTUAN ADMIN
           * =================================================== */}

          {showAdminHelp && (

            <div
              className="register-modal-backdrop"
              role="presentation"
              onClick={() => setShowAdminHelp(false)}
            >

              <div
                className="register-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="admin-help-title"
                onClick={(event) => event.stopPropagation()}
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
                    onClick={() => setShowAdminHelp(false)}
                  >
                    <X size={20} />
                  </button>

                </div>


                <p className="register-modal-description">
                  Isi data berikut agar Admin dapat membantu
                  menemukan ID Karyawan Anda.
                </p>


                <div className="register-modal-form">

                  <InputField
                    id="admin_nama"
                    label="Nama"
                    placeholder="Masukkan nama lengkap"
                    icon={UserRound}
                    value={adminForm.nama}
                    onChange={(value) =>
                      handleAdminFormChange("nama", value)
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
                    >
                      <option value="">
                        Pilih kategori tenaga kerja
                      </option>

                      {KATEGORI_TENAGA_KERJA.map((kategori) => (
                        <option
                          key={kategori}
                          value={kategori}
                        >
                          {kategori.toUpperCase()}
                        </option>
                      ))}

                    </select>

                  </div>


                  <InputField
                    id="admin_jabatan"
                    label="Jabatan"
                    placeholder="Masukkan jabatan"
                    icon={BriefcaseBusiness}
                    value={adminForm.jabatan}
                    onChange={(value) =>
                      handleAdminFormChange("jabatan", value)
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
                    onClick={() => setShowAdminHelp(false)}
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


          {/* =================================================
           * KEMBALI
           * ================================================= */}

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