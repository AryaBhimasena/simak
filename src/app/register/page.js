"use client";

/* =========================================================
   app/register/page.js
   REGISTER / UPDATE EMPLOYEE PAGE
========================================================= */

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

import {
  UserRound,
  CreditCard,
  HeartPulse,
  BadgeCheck,
  MapPin,
  Phone,
  CalendarDays,
  UserRoundCheck,
  Landmark,
  WalletCards,
  Shirt,
  Ruler,
  Footprints,
  BriefcaseBusiness,
  Building2,
  Camera,
  ArrowRight,
  CheckCircle2,
  Upload,
} from "lucide-react";

import "@/styles/pages/register.css";
import KaryawanLama from "./karyawan-lama";
import KaryawanBaru from "./karyawan-baru";

/* =========================================================
   CONSTANT
========================================================= */

const TOTAL_STEPS = 3;

/* =========================================================
   VALIDATION PATTERN
========================================================= */

const NAME_PATTERN = /^[A-Za-zÀ-ÿ\s.'-]+$/;
const PHONE_PATTERN = /^[0-9]+$/;
const NIK_PATTERN = /^[0-9]{16}$/;
const JKN_PATTERN = /^[0-9]+$/;

/* =========================================================
   NUMERIC STRING HELPER
========================================================= */

const onlyDigits = (value) => String(value ?? "").replace(/\D/g, "");

/* =========================================================
   INITIAL FORM DATA
========================================================= */

const INITIAL_FORM_DATA = {
  id_karyawan: "",
  nik: "",
  no_jkn_peserta: "",
  npp: "",
  nama_karyawan: "",
  kota_lahir: "",
  tanggal_lahir: "",
  status_pernikahan: "",
  alamat_ktp: "",
  alamat_domisili: "",
  no_hp: "",
  nama_kontak_darurat: "",
  nomor_kontak_darurat: "",
  nama_bank: "",
  nomor_rekening: "",
  nama_rekening: "",
  ukuran_baju: "",
  ukuran_celana: "",
  ukuran_sepatu: "",
  kategori_tk: "",
  jabatan: "",
  penempatan: "",
  tanggal_masuk: "",
  foto: null,
};

/* =========================================================
   REGISTER PAGE
========================================================= */

export default function RegisterPage() {
  /* =======================================================
     REGISTRATION TYPE
  ======================================================= */

  const [registrationType, setRegistrationType] = useState(null);

  /* =======================================================
     STEP
  ======================================================= */

  const [currentStep, setCurrentStep] = useState(1);

  /* =======================================================
     FORM STATE
  ======================================================= */

  const [formData, setFormData] = useState(INITIAL_FORM_DATA);

  /* =======================================================
     STEP 2 — MASTER DATA
  ======================================================= */

  const [kategoriTenagaKerjaOptions, setKategoriTenagaKerjaOptions] = useState([]);
  const [jabatanOptions, setJabatanOptions] = useState([]);
  const [penempatanOptions, setPenempatanOptions] = useState([]);
  const [isLoadingStepTwoOptions, setIsLoadingStepTwoOptions] = useState(false);
  const [stepTwoOptionsError, setStepTwoOptionsError] = useState("");

  /* =======================================================
     EXISTING PHOTO
  ======================================================= */

  const [existingPhotoUrl, setExistingPhotoUrl] = useState("");

  /* =======================================================
     PHOTO PREVIEW
  ======================================================= */

  const [photoPreview, setPhotoPreview] = useState("");

  /* =======================================================
     SEARCH KARYAWAN LAMA
  ======================================================= */

  const [searchNik, setSearchNik] = useState("");
  const [searchIdKaryawan, setSearchIdKaryawan] = useState("");
  const [hasFoundEmployee, setHasFoundEmployee] = useState(false);

  /* =======================================================
     LOADING STATE
  ======================================================= */

  const [isLoading, setIsLoading] = useState(false);
  const [isFindingEmployee, setIsFindingEmployee] = useState(false);

  /* =======================================================
     ERROR STATE
  ======================================================= */

  const [errorMessage, setErrorMessage] = useState("");
  const [employeeNotFound, setEmployeeNotFound] = useState("");

  /* =======================================================
     SUCCESS STATE
  ======================================================= */

  const [isSuccess, setIsSuccess] = useState(false);

  /* =======================================================
     PHOTO PREVIEW EFFECT
  ======================================================= */

  useEffect(() => {
    if (!formData.foto) {
      setPhotoPreview("");
      return undefined;
    }

    const objectUrl = URL.createObjectURL(formData.foto);
    setPhotoPreview(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [formData.foto]);

  /* =======================================================
     UPDATE FIELD
  ======================================================= */

  const updateField = (field, value) => {
    setErrorMessage("");
    setFormData((previous) => ({ ...previous, [field]: value }));
  };

  /* =======================================================
     LOAD STEP 2 MASTER DATA
  ======================================================= */

  const loadStepTwoOptions = async () => {
    setIsLoadingStepTwoOptions(true);
    setStepTwoOptionsError("");

    try {
      const response = await api.get({ action: "getMasterRegistrasi" });
      const masterData = response?.data || {};

      setKategoriTenagaKerjaOptions(
        Array.isArray(masterData.kategori_tk) ? masterData.kategori_tk : []
      );
      setJabatanOptions(
        Array.isArray(masterData.jabatan) ? masterData.jabatan : []
      );
      setPenempatanOptions(
        Array.isArray(masterData.penempatan) ? masterData.penempatan : []
      );
    } catch (error) {
      console.error("Load Step 2 master data error:", error);
      setStepTwoOptionsError(
        error?.message || "Gagal mengambil master data registrasi."
      );
    } finally {
      setIsLoadingStepTwoOptions(false);
    }
  };

  /* =======================================================
     RESET FORM
  ======================================================= */

  const resetForm = () => {
    setCurrentStep(1);
    setFormData({ ...INITIAL_FORM_DATA });
    setExistingPhotoUrl("");
    setPhotoPreview("");
    setSearchNik("");
    setSearchIdKaryawan("");
    setHasFoundEmployee(false);
    setErrorMessage("");
    setEmployeeNotFound("");
    setIsSuccess(false);
    setKategoriTenagaKerjaOptions([]);
    setJabatanOptions([]);
    setPenempatanOptions([]);
    setIsLoadingStepTwoOptions(false);
    setStepTwoOptionsError("");
  };

  /* =======================================================
     SELECT KARYAWAN BARU
  ======================================================= */

  const handleSelectNewEmployee = async () => {
    resetForm();
    setRegistrationType("baru");
    await loadStepTwoOptions();
  };

  /* =======================================================
     SELECT KARYAWAN LAMA
  ======================================================= */

  const handleSelectExistingEmployee = () => {
    resetForm();
    setRegistrationType("lama");
  };

  /* =======================================================
     BACK TO REGISTRATION TYPE
  ======================================================= */

  const handleBackToTypeSelection = () => {
    resetForm();
    setRegistrationType(null);
  };

  /* =======================================================
     FIND EXISTING EMPLOYEE
  ======================================================= */

  const handleFindEmployee = async ({ method, value }) => {
    setEmployeeNotFound("");
    setErrorMessage("");

    /* -----------------------------------------------------
       VALIDASI INPUT
    ----------------------------------------------------- */

    const searchValue = String(value || "").trim();

    if (method === "nik" && !NIK_PATTERN.test(searchValue)) {
      setEmployeeNotFound("NIK harus terdiri dari 16 digit angka.");
      return;
    }

    if (method === "id_karyawan" && !searchValue) {
      setEmployeeNotFound("Silakan masukkan ID Karyawan.");
      return;
    }

    setIsFindingEmployee(true);

    try {
      /* ---------------------------------------------------
         REQUEST KE API ROUTE NEXT.JS

         Nanti endpoint API route akan meneruskan
         method dan parameter ke Apps Script.
      --------------------------------------------------- */

      const params = new URLSearchParams();
      params.set("action", "getKaryawanUntukRegistrasi");
      params.set("method", method);

      if (method === "nik") {
        params.set("nik", searchValue);
      }

      if (method === "id_karyawan") {
        params.set("id_karyawan", searchValue);
      }

      const response = await fetch(`/api/register?${params.toString()}`, {
        method: "GET",
      });

      let result = null;

      try {
        result = await response.json();
      } catch {
        result = null;
      }

      if (!response.ok) {
        throw new Error(
          result?.message || "Data karyawan tidak ditemukan."
        );
      }

      if (!result?.data) {
        throw new Error("Data karyawan tidak ditemukan.");
      }

      /* ---------------------------------------------------
         DATA DITEMUKAN
      --------------------------------------------------- */

      const employee = result.data;

      setFormData((previous) => ({
        ...previous,
        ...employee,
        nik: employee.nik || (method === "nik" ? searchValue : ""),
        foto: null,
      }));

      setExistingPhotoUrl(
        employee.foto_url ||
          employee.foto ||
          employee.Foto ||
          ""
      );

      setEmployeeNotFound("");
      setHasFoundEmployee(true);
      setCurrentStep(1);
    } catch (error) {
      console.error("Find employee error:", error);
      setEmployeeNotFound(
        error?.message || "Data karyawan tidak ditemukan."
      );
    } finally {
      setIsFindingEmployee(false);
    }
  };

  /* =======================================================
     STEP 1 VALIDATION
  ======================================================= */

  const validateStepOne = () => {
    const {
      nik = "",
      nama_karyawan = "",
      kota_lahir = "",
      tanggal_lahir = "",
      status_pernikahan = "",
      alamat_ktp = "",
      alamat_domisili = "",
      no_hp = "",
      nama_kontak_darurat = "",
      nomor_kontak_darurat = "",
      nama_bank = "",
      nomor_rekening = "",
      nama_rekening = "",
      ukuran_baju = "",
      ukuran_celana = "",
      ukuran_sepatu = "",
    } = formData;

    /* -----------------------------------------------------
       NIK — WAJIB UNTUK KARYAWAN BARU
    ----------------------------------------------------- */

    if (
      registrationType === "baru" &&
      (!nik.trim() || !NIK_PATTERN.test(nik.trim()))
    ) {
      setErrorMessage("NIK harus terdiri dari 16 digit angka.");
      return false;
    }

    /* -----------------------------------------------------
       NAMA
    ----------------------------------------------------- */

    if (
      !nama_karyawan.trim() ||
      !NAME_PATTERN.test(nama_karyawan.trim())
    ) {
      setErrorMessage("Silakan masukkan nama karyawan yang valid.");
      return false;
    }

    /* -----------------------------------------------------
       KOTA LAHIR
    ----------------------------------------------------- */

    if (!kota_lahir.trim()) {
      setErrorMessage("Silakan masukkan kota tempat lahir.");
      return false;
    }

    /* -----------------------------------------------------
       TANGGAL LAHIR
    ----------------------------------------------------- */

    if (!tanggal_lahir) {
      setErrorMessage("Silakan masukkan tanggal lahir.");
      return false;
    }

    /* -----------------------------------------------------
       STATUS PERNIKAHAN
    ----------------------------------------------------- */

    if (!status_pernikahan) {
      setErrorMessage("Silakan pilih status pernikahan.");
      return false;
    }

    /* -----------------------------------------------------
       ALAMAT KTP
    ----------------------------------------------------- */

    if (!alamat_ktp.trim()) {
      setErrorMessage("Silakan masukkan alamat sesuai KTP.");
      return false;
    }

    /* -----------------------------------------------------
       ALAMAT DOMISILI
    ----------------------------------------------------- */

    if (!alamat_domisili.trim()) {
      setErrorMessage("Silakan masukkan alamat domisili.");
      return false;
    }

    /* -----------------------------------------------------
       NO HP
    ----------------------------------------------------- */

    if (!no_hp.trim() || !PHONE_PATTERN.test(no_hp.trim())) {
      setErrorMessage("No. HP karyawan hanya boleh berisi angka.");
      return false;
    }

    /* -----------------------------------------------------
       NAMA KONTAK DARURAT
    ----------------------------------------------------- */

    if (!nama_kontak_darurat.trim()) {
      setErrorMessage("Silakan masukkan nama kontak darurat.");
      return false;
    }

    /* -----------------------------------------------------
       NOMOR KONTAK DARURAT
    ----------------------------------------------------- */

    if (
      !nomor_kontak_darurat.trim() ||
      !PHONE_PATTERN.test(nomor_kontak_darurat.trim())
    ) {
      setErrorMessage("Nomor kontak darurat hanya boleh berisi angka.");
      return false;
    }

    /* -----------------------------------------------------
       NAMA BANK
    ----------------------------------------------------- */

    if (!nama_bank.trim()) {
      setErrorMessage("Silakan masukkan nama bank.");
      return false;
    }

    /* -----------------------------------------------------
       NOMOR REKENING
    ----------------------------------------------------- */

    if (
      !nomor_rekening.trim() ||
      !/^[0-9]+$/.test(nomor_rekening.trim())
    ) {
      setErrorMessage("Nomor rekening hanya boleh berisi angka.");
      return false;
    }

    /* -----------------------------------------------------
       NAMA REKENING
    ----------------------------------------------------- */

    if (!nama_rekening.trim()) {
      setErrorMessage("Silakan masukkan nama pemilik rekening.");
      return false;
    }

    /* -----------------------------------------------------
       UKURAN BAJU
    ----------------------------------------------------- */

    if (!ukuran_baju) {
      setErrorMessage("Silakan pilih ukuran baju.");
      return false;
    }

    /* -----------------------------------------------------
       UKURAN CELANA
    ----------------------------------------------------- */

    if (!ukuran_celana) {
      setErrorMessage("Silakan pilih ukuran celana.");
      return false;
    }

    /* -----------------------------------------------------
       UKURAN SEPATU
    ----------------------------------------------------- */

    if (!ukuran_sepatu) {
      setErrorMessage("Silakan pilih ukuran sepatu.");
      return false;
    }

    return true;
  };

  /* =======================================================
     STEP 2 VALIDATION
  ======================================================= */

  const validateStepTwo = () => {
    const {
      kategori_tk = "",
      jabatan = "",
      penempatan = "",
      tanggal_masuk = "",
    } = formData;

    if (!kategori_tk.trim()) {
      setErrorMessage("Silakan pilih kategori tenaga kerja.");
      return false;
    }

    if (!jabatan.trim()) {
      setErrorMessage("Silakan pilih jabatan.");
      return false;
    }

    if (!penempatan.trim()) {
      setErrorMessage("Silakan pilih lokasi penempatan.");
      return false;
    }

    if (!tanggal_masuk) {
      setErrorMessage("Silakan masukkan tanggal masuk.");
      return false;
    }

    return true;
  };

  /* =======================================================
     STEP 3 VALIDATION
  ======================================================= */

  const validateStepThree = () => {
    if (registrationType === "baru" && !formData.foto) {
      setErrorMessage("Silakan upload foto karyawan.");
      return false;
    }

    return true;
  };

  /* =======================================================
     NEXT STEP
  ======================================================= */

  const handleNext = () => {
    setErrorMessage("");

    if (currentStep === 1 && !validateStepOne()) {
      return;
    }

    if (currentStep === 2 && !validateStepTwo()) {
      return;
    }

    setCurrentStep((previous) =>
      Math.min(previous + 1, TOTAL_STEPS)
    );
  };

  /* =======================================================
     PREVIOUS STEP
  ======================================================= */

  const handlePrevious = () => {
    setErrorMessage("");
    setCurrentStep((previous) => Math.max(previous - 1, 1));
  };

  /* =======================================================
     PHOTO CHANGE
  ======================================================= */

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setErrorMessage("File yang dipilih harus berupa gambar.");
      event.target.value = "";
      return;
    }

    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      setErrorMessage("Ukuran foto maksimal 5 MB.");
      event.target.value = "";
      return;
    }

    setErrorMessage("");
    updateField("foto", file);
  };

  /* =========================================================
     FILE TO BASE64
  ========================================================= */

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      if (!(file instanceof File)) {
        resolve("");
        return;
      }

      const reader = new FileReader();

      reader.onload = () => {
        const result = String(reader.result || "");

        /*
         * Hasil FileReader biasanya:
         * data:image/jpeg;base64,/9j/4AAQ...
         *
         * Apps Script hanya membutuhkan bagian Base64-nya.
         */

        const base64 = result.includes(",")
          ? result.split(",")[1]
          : result;

        resolve(base64);
      };

      reader.onerror = () => {
        reject(new Error("Gagal membaca file foto."));
      };

      reader.readAsDataURL(file);
    });
  };

  /* =========================================================
     SUBMIT
  ========================================================= */

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isLoading) {
      return;
    }

    setErrorMessage("");

    if (!validateStepThree()) {
      return;
    }

    setIsLoading(true);

    try {
      const foto = formData.foto;

      /*
       * Payload utama.
       *
       * Jangan masukkan object File langsung ke JSON.
       * File harus dikonversi menjadi Base64 terlebih dahulu.
       */

      const payload = {
        action: "saveRegistrasi",
        registration_type: registrationType,
        id_karyawan: String(formData.id_karyawan || ""),
        nik: String(formData.nik || ""),
        no_jkn_peserta: String(formData.no_jkn_peserta || ""),
        npp: String(formData.npp || ""),
        nama_karyawan: formData.nama_karyawan || "",
        kota_lahir: formData.kota_lahir || "",
        tanggal_lahir: formData.tanggal_lahir || "",
        status_pernikahan: formData.status_pernikahan || "",
        alamat_ktp: formData.alamat_ktp || "",
        alamat_domisili: formData.alamat_domisili || "",
        no_hp: String(formData.no_hp || ""),
        nama_kontak_darurat: formData.nama_kontak_darurat || "",
        nomor_kontak_darurat: String(
          formData.nomor_kontak_darurat || ""
        ),
        nama_bank: formData.nama_bank || "",
        nomor_rekening: String(formData.nomor_rekening || ""),
        nama_rekening: formData.nama_rekening || "",
        ukuran_baju: formData.ukuran_baju || "",
        ukuran_celana: formData.ukuran_celana || "",
        ukuran_sepatu: formData.ukuran_sepatu || "",
        kategori_tk: formData.kategori_tk || "",
        jabatan: formData.jabatan || "",
        penempatan: formData.penempatan || "",
        tanggal_masuk: formData.tanggal_masuk || "",
        foto_base64: "",
        foto_name: "",
        foto_mime_type: "",
      };

      /*
       * Jika pengguna memilih foto baru, konversi ke Base64.
       */

      if (foto instanceof File) {
        payload.foto_base64 = await fileToBase64(foto);
        payload.foto_name = foto.name;
        payload.foto_mime_type = foto.type;
      }

      /*
       * Gunakan api.post() dari lib/api.js.
       *
       * Endpoint Apps Script menerima JSON,
       * bukan FormData multipart.
       */

      const result = await api.post(payload);

      if (!result?.success) {
        throw new Error(
          result?.message ||
            (registrationType === "lama"
              ? "Gagal memperbarui data karyawan."
              : "Gagal mengirim data karyawan.")
        );
      }

      setIsSuccess(true);
    } catch (error) {
      console.error("Submit register error:", error);
      setErrorMessage(
        error?.message || "Terjadi kesalahan saat mengirim data."
      );
    } finally {
      setIsLoading(false);
    }
  };

  /* =======================================================
     SUCCESS SCREEN
  ======================================================= */

  if (isSuccess) {
    const isUpdate = registrationType === "lama";

    return (
      <main className="register-page">
        <div className="register-container">
          <div className="register-form-wrapper">
            <Brand />

            <section className="register-success">
              <div className="success-icon">
                <CheckCircle2 size={30} strokeWidth={1.8} />
              </div>

              <p className="register-eyebrow">
                {isUpdate
                  ? "PEMBARUAN BERHASIL"
                  : "PENDAFTARAN BERHASIL"}
              </p>

              <h1>
                {isUpdate
                  ? "Data berhasil diperbarui"
                  : "Data Anda sudah diterima"}
              </h1>

              <p>
                {isUpdate
                  ? "Data karyawan Anda telah berhasil diperbarui dan akan diproses oleh administrator perusahaan."
                  : "Terima kasih. Data karyawan Anda telah berhasil dikirim dan akan diproses oleh administrator perusahaan."}
              </p>
            </section>

            <Footer />
          </div>
        </div>
      </main>
    );
  }

  /* =======================================================
     INITIAL TYPE SELECTION
  ======================================================= */

  if (!registrationType) {
    return (
      <main className="register-page">
        <div className="register-container">
          <div className="register-form-wrapper">
            <Brand />

            <div className="register-header">
              <p className="register-eyebrow">SIMAK-KII</p>
              <h1>Selamat datang</h1>
              <p>
                Pilih jenis pengisian data yang ingin Anda lakukan.
              </p>
            </div>

            <div className="registration-choice">
              <button
                type="button"
                className="registration-choice-card"
                onClick={handleSelectExistingEmployee}
              >
                <div className="registration-choice-icon">
                  <UserRoundCheck size={24} strokeWidth={1.8} />
                </div>

                <div className="registration-choice-content">
                  <strong>Karyawan lama</strong>
                  <span>
                    Perbarui data karyawan yang sudah terdaftar.
                  </span>
                </div>

                <ArrowRight size={19} strokeWidth={1.8} />
              </button>

              <button
                type="button"
                className="registration-choice-card"
                onClick={handleSelectNewEmployee}
              >
                <div className="registration-choice-icon">
                  <UserRound size={24} strokeWidth={1.8} />
                </div>

                <div className="registration-choice-content">
                  <strong>Karyawan baru</strong>
                  <span>
                    Isi data diri untuk pendaftaran karyawan baru.
                  </span>
                </div>

                <ArrowRight size={19} strokeWidth={1.8} />
              </button>
            </div>

            <Footer />
          </div>
        </div>
      </main>
    );
  }

  /* =======================================================
     EXISTING EMPLOYEE — SEARCH NIK
  ======================================================= */

  if (registrationType === "lama" && !hasFoundEmployee) {
    return (
      <KaryawanLama
        searchNik={searchNik}
        setSearchNik={setSearchNik}
        employeeNotFound={employeeNotFound}
        setEmployeeNotFound={setEmployeeNotFound}
        isFindingEmployee={isFindingEmployee}
        handleFindEmployee={handleFindEmployee}
        handleBackToTypeSelection={handleBackToTypeSelection}
        InputField={InputField}
        Brand={Brand}
        Footer={Footer}
      />
    );
  }

  /* =======================================================
     KARYAWAN BARU
  ======================================================= */

  if (registrationType === "baru") {
    return (
      <KaryawanBaru
        currentStep={currentStep}
        totalSteps={TOTAL_STEPS}
        registrationType={registrationType}
        formData={formData}
        updateField={updateField}
        foto={formData.foto}
        photoPreview={photoPreview}
        existingPhotoUrl={existingPhotoUrl}
        errorMessage={errorMessage}
        isLoading={isLoading}
        handleNext={handleNext}
        handlePrevious={handlePrevious}
        handlePhotoChange={handlePhotoChange}
        handleBackToTypeSelection={handleBackToTypeSelection}
        handleSubmit={handleSubmit}
        StepProgress={StepProgress}
        StepOne={StepOne}
        StepTwo={StepTwo}
        StepThree={StepThree}
        Brand={Brand}
        Footer={Footer}
        /* MASTER DATA STEP 2 */
        kategoriTenagaKerjaOptions={kategoriTenagaKerjaOptions}
        jabatanOptions={jabatanOptions}
        penempatanOptions={penempatanOptions}
        isLoadingStepTwoOptions={isLoadingStepTwoOptions}
        stepTwoOptionsError={stepTwoOptionsError}
        loadStepTwoOptions={loadStepTwoOptions}
      />
    );
  }

  /* =======================================================
     MAIN FORM KARYAWAN LAMA
  ======================================================= */

  /*
   * Jika komponen form karyawan lama sudah dipindahkan
   * ke file terpisah, panggil komponen tersebut di sini.
   */

  return null;
}

/* =========================================================
   BRAND
========================================================= */

function Brand() {
  return (
    <div className="mobile-brand">
      <div className="mobile-brand-mark">KII</div>

      <div>
        <div className="mobile-brand-title">
          SIMAK<span>-KII</span>
        </div>

        <p>
          Sistem Informasi Management dan Administrasi Kantor
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   STEP PROGRESS
========================================================= */

function StepProgress({ currentStep }) {
  const steps = ["Data Pribadi", "Kepegawaian", "Foto"];

  return (
    <div className="register-progress">
      {steps.map((label, index) => {
        const step = index + 1;
        const isActive = step === currentStep;
        const isCompleted = step < currentStep;

        return (
          <div
            key={label}
            className={`progress-item ${isActive ? "active" : ""} ${
              isCompleted ? "completed" : ""
            }`}
          >
            <div className="progress-number">
              {isCompleted ? (
                <CheckCircle2 size={15} strokeWidth={2.2} />
              ) : (
                step
              )}
            </div>

            <span>{label}</span>
          </div>
        );
      })}
    </div>
  );
}

/* =========================================================
   STEP 1 — DATA PRIBADI
========================================================= */

function StepOne({ formData, updateField, registrationType }) {
  const isExistingEmployee = registrationType === "lama";

  return (
    <section className="register-step">
      <div className="step-heading">
        <span className="step-icon">
          <UserRound size={20} strokeWidth={1.8} />
        </span>

        <div>
          <h2>Data pribadi</h2>
          <p>
            Lengkapi informasi identitas dan data pribadi Anda.
          </p>
        </div>
      </div>

      <div className="form-section">
        <div className="form-section-title">Identitas karyawan</div>

        <InputField
          id="nik"
          label="NIK"
          placeholder="Masukkan 16 digit NIK"
          icon={CreditCard}
          value={formData.nik}
          onChange={(value) => updateField("nik", value.replace(/\D/g, ""))}
          inputMode="numeric"
          maxLength={16}
          disabled={isExistingEmployee}
        />

        <InputField
          id="no_jkn_peserta"
          label="No. JKN peserta"
          placeholder="Masukkan nomor JKN"
          icon={HeartPulse}
          value={formData.no_jkn_peserta}
          onChange={(value) =>
            updateField("no_jkn_peserta", value.replace(/\D/g, ""))
          }
          inputMode="numeric"
          required={false}
        />

        <InputField
          id="npp"
          label="NPP"
          placeholder="Masukkan NPP"
          icon={BadgeCheck}
          value={formData.npp}
          onChange={(value) => updateField("npp", value)}
          required={false}
        />

        <InputField
          id="nama_karyawan"
          label="Nama karyawan"
          placeholder="Masukkan nama lengkap"
          icon={UserRound}
          value={formData.nama_karyawan}
          onChange={(value) => updateField("nama_karyawan", value)}
          autoComplete="name"
        />

        <InputField
          id="kota_lahir"
          label="Kota lahir"
          placeholder="Contoh: Denpasar"
          icon={MapPin}
          value={formData.kota_lahir}
          onChange={(value) => updateField("kota_lahir", value)}
        />

        <InputField
          id="tanggal_lahir"
          label="Tanggal lahir"
          icon={CalendarDays}
          type="date"
          value={formData.tanggal_lahir}
          onChange={(value) => updateField("tanggal_lahir", value)}
        />

        <SelectField
          id="status_pernikahan"
          label="Status pernikahan"
          icon={UserRoundCheck}
          value={formData.status_pernikahan}
          onChange={(value) => updateField("status_pernikahan", value)}
          options={[
            { value: "belum_menikah", label: "Belum menikah" },
            { value: "menikah", label: "Menikah" },
            { value: "cerai_hidup", label: "Cerai hidup" },
            { value: "cerai_mati", label: "Cerai mati" },
          ]}
        />
      </div>

      <div className="form-section">
        <div className="form-section-title">Alamat</div>

        <TextareaField
          id="alamat_ktp"
          label="Alamat KTP"
          placeholder="Masukkan alamat sesuai KTP"
          icon={MapPin}
          value={formData.alamat_ktp}
          onChange={(value) => updateField("alamat_ktp", value)}
        />

        <TextareaField
          id="alamat_domisili"
          label="Alamat domisili"
          placeholder="Masukkan alamat tempat tinggal saat ini"
          icon={MapPin}
          value={formData.alamat_domisili}
          onChange={(value) => updateField("alamat_domisili", value)}
        />
      </div>

      <div className="form-section">
        <div className="form-section-title">Kontak</div>

        <InputField
          id="no_hp"
          label="No. HP"
          placeholder="Contoh: 081234567890"
          icon={Phone}
          value={formData.no_hp}
          onChange={(value) => updateField("no_hp", onlyDigits(value))}
          inputMode="numeric"
          maxLength={15}
        />

        <InputField
          id="nama_kontak_darurat"
          label="Nama kontak darurat"
          placeholder="Nama orang yang dapat dihubungi"
          icon={UserRoundCheck}
          value={formData.nama_kontak_darurat}
          onChange={(value) =>
            updateField("nama_kontak_darurat", value)
          }
        />

        <InputField
          id="nomor_kontak_darurat"
          label="Nomor kontak darurat"
          placeholder="Contoh: 081234567890"
          icon={Phone}
          value={formData.nomor_kontak_darurat}
          onChange={(value) =>
            updateField("nomor_kontak_darurat", onlyDigits(value))
          }
          inputMode="numeric"
          maxLength={15}
        />
      </div>

      <div className="form-section">
        <div className="form-section-title">Rekening bank</div>

        <InputField
          id="nama_bank"
          label="Nama bank"
          placeholder="Contoh: BCA"
          icon={Landmark}
          value={formData.nama_bank}
          onChange={(value) => updateField("nama_bank", value)}
        />

        <InputField
          id="nomor_rekening"
          label="Nomor rekening"
          placeholder="Masukkan nomor rekening"
          icon={WalletCards}
          value={formData.nomor_rekening}
          onChange={(value) =>
            updateField("nomor_rekening", onlyDigits(value))
          }
          inputMode="numeric"
          maxLength={25}
        />

        <InputField
          id="nama_rekening"
          label="Nama rekening"
          placeholder="Nama pemilik rekening"
          icon={UserRound}
          value={formData.nama_rekening}
          onChange={(value) => updateField("nama_rekening", value)}
        />
      </div>

      <div className="form-section">
        <div className="form-section-title">Ukuran pakaian</div>

        <SelectField
          id="ukuran_baju"
          label="Ukuran baju"
          icon={Shirt}
          value={formData.ukuran_baju}
          onChange={(value) => updateField("ukuran_baju", value)}
          options={["XS", "S", "M", "L", "XL", "XXL", "XXXL"].map(
            (size) => ({ value: size, label: size })
          )}
        />

        <SelectField
          id="ukuran_celana"
          label="Ukuran celana"
          icon={Ruler}
          value={formData.ukuran_celana}
          onChange={(value) => updateField("ukuran_celana", value)}
          options={["28", "30", "32", "34", "36", "38", "40", "42", "44"].map(
            (size) => ({ value: size, label: size })
          )}
        />

        <SelectField
          id="ukuran_sepatu"
          label="Ukuran sepatu"
          icon={Footprints}
          value={formData.ukuran_sepatu}
          onChange={(value) => updateField("ukuran_sepatu", value)}
          options={[
            "36",
            "37",
            "38",
            "39",
            "40",
            "41",
            "42",
            "43",
            "44",
            "45",
          ].map((size) => ({ value: size, label: size }))}
        />
      </div>
    </section>
  );
}

/* =========================================================
   STEP 2 — DATA KEPEGAWAIAN
========================================================= */

function StepTwo({
  formData,
  updateField,
  kategoriTenagaKerjaOptions = [],
  jabatanOptions = [],
  penempatanOptions = [],
  isLoadingStepTwoOptions = false,
  stepTwoOptionsError = "",
}) {
  return (
    <section className="register-step">
      <div className="step-heading">
        <span className="step-icon">
          <BriefcaseBusiness size={20} strokeWidth={1.8} />
        </span>

        <div>
          <h2>Data kepegawaian</h2>
          <p>
            Lengkapi informasi pekerjaan dan penempatan Anda.
          </p>
        </div>
      </div>

      {stepTwoOptionsError && (
        <div className="register-error">{stepTwoOptionsError}</div>
      )}

      <div className="form-section">
        <SelectField
          id="kategori_tk"
          label="Kategori tenaga kerja"
          icon={BriefcaseBusiness}
          value={formData.kategori_tk}
          onChange={(value) => updateField("kategori_tk", value)}
          options={kategoriTenagaKerjaOptions}
          disabled={isLoadingStepTwoOptions}
        />

        <SelectField
          id="jabatan"
          label="Jabatan"
          icon={BadgeCheck}
          value={formData.jabatan}
          onChange={(value) => updateField("jabatan", value)}
          options={jabatanOptions}
          disabled={isLoadingStepTwoOptions}
        />

        <SelectField
          id="penempatan"
          label="Lokasi penempatan"
          icon={Building2}
          value={formData.penempatan}
          onChange={(value) => updateField("penempatan", value)}
          options={penempatanOptions}
          disabled={isLoadingStepTwoOptions}
        />

        <InputField
          id="tanggal_masuk"
          label="Tanggal masuk"
          type="date"
          icon={CalendarDays}
          value={formData.tanggal_masuk}
          onChange={(value) => updateField("tanggal_masuk", value)}
        />
      </div>
    </section>
  );
}

/* =========================================================
   STEP 3 — FOTO
========================================================= */

function StepThree({
  foto,
  photoPreview,
  existingPhotoUrl,
  registrationType,
  handlePhotoChange,
}) {
  const isExistingEmployee = registrationType === "lama";
  const preview = photoPreview || existingPhotoUrl || "";

  return (
    <section className="register-step">
      <div className="step-heading">
        <span className="step-icon">
          <Camera size={20} strokeWidth={1.8} />
        </span>

        <div>
          <h2>Foto karyawan</h2>
          <p>
            {isExistingEmployee
              ? "Periksa foto lama atau upload foto baru jika ingin menggantinya."
              : "Upload foto terbaru untuk melengkapi profil karyawan."}
          </p>
        </div>
      </div>

      <div className="photo-upload-section">
        {preview ? (
          <div className="photo-preview">
            <img src={preview} alt="Foto karyawan" />

            <label
              htmlFor="foto"
              className="photo-change-button"
            >
              {foto
                ? "Ganti foto"
                : isExistingEmployee
                  ? "Ganti foto"
                  : "Pilih foto"}
            </label>
          </div>
        ) : (
          <label htmlFor="foto" className="photo-upload-box">
            <div className="photo-upload-icon">
              <Camera size={30} strokeWidth={1.6} />
            </div>

            <strong>Upload foto karyawan</strong>
            <span>JPG, JPEG, PNG, atau WEBP</span>
            <span>Maksimal 5 MB</span>

            <div className="photo-upload-action">
              <Upload size={17} strokeWidth={2} />
              Pilih foto
            </div>
          </label>
        )}

        <input
          id="foto"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handlePhotoChange}
          hidden
        />

        <div className="photo-note">
          <strong>Tips foto</strong>

          <ul>
            <li>Gunakan foto terbaru.</li>
            <li>Wajah terlihat jelas.</li>
            <li>Gunakan pencahayaan yang cukup.</li>
            <li>Hindari foto yang buram.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   INPUT FIELD
========================================================= */

function InputField({
  id,
  label,
  placeholder,
  icon: Icon,
  value,
  onChange,
  type = "text",
  inputMode,
  maxLength,
  autoComplete,
  disabled = false,
  required = true,
}) {
  return (
    <div className="form-group">
      <label htmlFor={id}>{label}</label>

      <div
        className={`input-wrapper ${
          disabled ? "input-wrapper-disabled" : ""
        }`}
      >
        <Icon size={19} strokeWidth={1.8} />

        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value ?? ""}
          onChange={(event) => onChange(event.target.value)}
          inputMode={inputMode}
          maxLength={maxLength}
          autoComplete={autoComplete}
          disabled={disabled}
          required={required}
        />
      </div>
    </div>
  );
}

/* =========================================================
   TEXTAREA FIELD
========================================================= */

function TextareaField({
  id,
  label,
  placeholder,
  icon: Icon,
  value,
  onChange,
  required = true,
}) {
  return (
    <div className="form-group">
      <label htmlFor={id}>{label}</label>

      <div className="input-wrapper input-wrapper-textarea">
        <Icon size={19} strokeWidth={1.8} />

        <textarea
          id={id}
          placeholder={placeholder}
          value={value ?? ""}
          onChange={(event) => onChange(event.target.value)}
          rows={4}
          required={required}
        />
      </div>
    </div>
  );
}

/* =========================================================
   SELECT FIELD
========================================================= */

function SelectField({
  id,
  label,
  icon: Icon,
  value,
  onChange,
  options = [],
  required = true,
  disabled = false,
}) {
  return (
    <div className="form-group">
      <label htmlFor={id}>{label}</label>

      <div
        className={`input-wrapper ${
          disabled ? "input-wrapper-disabled" : ""
        }`}
      >
        <Icon size={19} strokeWidth={1.8} />

        <select
          id={id}
          value={value ?? ""}
          onChange={(event) => onChange(event.target.value)}
          required={required}
          disabled={disabled}
        >
          <option value="">
            {disabled
              ? "Memuat data..."
              : `Pilih ${label.toLowerCase()}`}
          </option>

          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

/* =========================================================
   FOOTER
========================================================= */

function Footer() {
  return (
    <div className="register-footer">
      <span>SIMAK-KII</span>
      <span className="footer-dot">•</span>
      <span>Kreasi Inovasi Indonesia</span>
    </div>
  );
}