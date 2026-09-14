"use client";

import { useEffect, useState } from "react";

/* =========================================================
   CONSTANT
========================================================= */

export const TOTAL_STEPS = 3;

/* =========================================================
   VALIDATION PATTERN
========================================================= */

export const NAME_PATTERN = /^[A-Za-zÀ-ÿ\s.'-]+$/;
export const PHONE_PATTERN = /^[0-9+\-\s()]+$/;
export const NIK_PATTERN = /^[0-9]{16}$/;
export const JKN_PATTERN = /^[0-9]+$/;

/* =========================================================
   INITIAL FORM DATA
========================================================= */

export const INITIAL_FORM_DATA = {
  /* -------------------------------------------------------
     DATA PRIBADI
  ------------------------------------------------------- */

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

  /* -------------------------------------------------------
     DATA KEPEGAWAIAN
  ------------------------------------------------------- */

  kategori_tk: "",
  jabatan: "",
  penempatan: "",
  tanggal_masuk: "",

  /* -------------------------------------------------------
     FOTO
  ------------------------------------------------------- */

  foto: null,
};

/* =========================================================
   CLONE INITIAL FORM DATA
========================================================= */

export function createInitialFormData() {
  return {
    ...INITIAL_FORM_DATA,
    foto: null,
  };
}

/* =========================================================
   REGISTER PAGE HOOK
========================================================= */

export function useRegisterPage() {
  /* =======================================================
     REGISTRATION TYPE

     null  = belum memilih
     baru  = karyawan baru
     lama  = karyawan lama
  ======================================================= */

  const [registrationType, setRegistrationType] = useState(null);

  /* =======================================================
     STEP
  ======================================================= */

  const [currentStep, setCurrentStep] = useState(1);

  /* =======================================================
     FORM STATE
  ======================================================= */

  const [formData, setFormData] = useState(
    createInitialFormData()
  );

  /* =======================================================
     EXISTING PHOTO
  ======================================================= */

  const [existingPhotoUrl, setExistingPhotoUrl] = useState("");

  /* =======================================================
     PHOTO PREVIEW
  ======================================================= */

  const [photoPreview, setPhotoPreview] = useState("");

  /* =======================================================
     SEARCH NIK
  ======================================================= */

  const [searchNik, setSearchNik] = useState("");

  /* =======================================================
     LOADING STATE
  ======================================================= */

  const [isLoading, setIsLoading] = useState(false);
  const [isFindingEmployee, setIsFindingEmployee] =
    useState(false);

  /* =======================================================
     ERROR STATE
  ======================================================= */

  const [errorMessage, setErrorMessage] = useState("");
  const [employeeNotFound, setEmployeeNotFound] =
    useState("");

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

    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  /* =======================================================
     RESET FORM
  ======================================================= */

  const resetForm = () => {
    setCurrentStep(1);
    setFormData(createInitialFormData());
    setExistingPhotoUrl("");
    setPhotoPreview("");
    setSearchNik("");
    setErrorMessage("");
    setEmployeeNotFound("");
    setIsSuccess(false);
  };

  /* =======================================================
     SELECT KARYAWAN BARU
  ======================================================= */

  const handleSelectNewEmployee = () => {
    resetForm();
    setRegistrationType("baru");
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

  const handleFindEmployee = async () => {
    setEmployeeNotFound("");
    setErrorMessage("");

    const nik = searchNik.trim();

    /* -----------------------------------------------------
       VALIDATE NIK
    ----------------------------------------------------- */

    if (!NIK_PATTERN.test(nik)) {
      setEmployeeNotFound(
        "NIK harus terdiri dari 16 digit angka."
      );
      return;
    }

    setIsFindingEmployee(true);

    try {
      const response = await fetch(
        `/api/register?nik=${encodeURIComponent(nik)}`,
        {
          method: "GET",
        }
      );

      let result = null;

      try {
        result = await response.json();
      } catch {
        result = null;
      }

      if (!response.ok) {
        throw new Error(
          result?.message ||
            "Data karyawan dengan NIK tersebut tidak ditemukan."
        );
      }

      if (!result?.data) {
        throw new Error("Data karyawan tidak ditemukan.");
      }

      const employee = result.data;

      setFormData((previous) => ({
        ...previous,
        ...employee,

        /*
         * NIK selalu menggunakan
         * NIK yang dicari.
         */
        nik,

        /*
         * Foto database bukan File browser.
         */
        foto: null,
      }));

      setExistingPhotoUrl(
        employee.foto_url || employee.foto || ""
      );

      setEmployeeNotFound("");
      setCurrentStep(1);
    } catch (error) {
      console.error("Find employee error:", error);

      setEmployeeNotFound(
        error?.message ||
          "Data karyawan tidak ditemukan."
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
      no_jkn_peserta = "",
      npp = "",
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

    if (
      !nik.trim() ||
      !NIK_PATTERN.test(nik.trim())
    ) {
      setErrorMessage(
        "NIK harus terdiri dari 16 digit angka."
      );
      return false;
    }

    if (
      !no_jkn_peserta.trim() ||
      !JKN_PATTERN.test(no_jkn_peserta.trim())
    ) {
      setErrorMessage(
        "Nomor JKN peserta harus diisi dengan angka yang valid."
      );
      return false;
    }

    if (!npp.trim()) {
      setErrorMessage("Silakan masukkan NPP.");
      return false;
    }

    if (
      !nama_karyawan.trim() ||
      !NAME_PATTERN.test(nama_karyawan.trim())
    ) {
      setErrorMessage(
        "Silakan masukkan nama karyawan yang valid."
      );
      return false;
    }

    if (!kota_lahir.trim()) {
      setErrorMessage(
        "Silakan masukkan kota tempat lahir."
      );
      return false;
    }

    if (!tanggal_lahir) {
      setErrorMessage(
        "Silakan masukkan tanggal lahir."
      );
      return false;
    }

    if (!status_pernikahan) {
      setErrorMessage(
        "Silakan pilih status pernikahan."
      );
      return false;
    }

    if (!alamat_ktp.trim()) {
      setErrorMessage(
        "Silakan masukkan alamat sesuai KTP."
      );
      return false;
    }

    if (!alamat_domisili.trim()) {
      setErrorMessage(
        "Silakan masukkan alamat domisili."
      );
      return false;
    }

    if (
      !no_hp.trim() ||
      !PHONE_PATTERN.test(no_hp.trim())
    ) {
      setErrorMessage(
        "Silakan masukkan nomor HP yang valid."
      );
      return false;
    }

    if (!nama_kontak_darurat.trim()) {
      setErrorMessage(
        "Silakan masukkan nama kontak darurat."
      );
      return false;
    }

    if (
      !nomor_kontak_darurat.trim() ||
      !PHONE_PATTERN.test(nomor_kontak_darurat.trim())
    ) {
      setErrorMessage(
        "Nomor kontak darurat tidak valid."
      );
      return false;
    }

    if (!nama_bank.trim()) {
      setErrorMessage(
        "Silakan masukkan nama bank."
      );
      return false;
    }

    if (!nomor_rekening.trim()) {
      setErrorMessage(
        "Silakan masukkan nomor rekening."
      );
      return false;
    }

    if (!nama_rekening.trim()) {
      setErrorMessage(
        "Silakan masukkan nama pemilik rekening."
      );
      return false;
    }

    if (!ukuran_baju) {
      setErrorMessage(
        "Silakan pilih ukuran baju."
      );
      return false;
    }

    if (!ukuran_celana) {
      setErrorMessage(
        "Silakan pilih ukuran celana."
      );
      return false;
    }

    if (!ukuran_sepatu) {
      setErrorMessage(
        "Silakan pilih ukuran sepatu."
      );
      return false;
    }

    return true;
  };

  /* =======================================================
     STEP 2 VALIDATION
  ======================================================= */

  const validateStepTwo = () => {
    const {
      kategori_tk,
      jabatan = "",
      penempatan = "",
      tanggal_masuk,
    } = formData;

    if (!kategori_tk) {
      setErrorMessage(
        "Silakan pilih kategori tenaga kerja."
      );
      return false;
    }

    if (!jabatan.trim()) {
      setErrorMessage(
        "Silakan masukkan jabatan."
      );
      return false;
    }

    if (!penempatan.trim()) {
      setErrorMessage(
        "Silakan masukkan penempatan."
      );
      return false;
    }

    if (!tanggal_masuk) {
      setErrorMessage(
        "Silakan masukkan tanggal masuk."
      );
      return false;
    }

    return true;
  };

  /* =======================================================
     STEP 3 VALIDATION
  ======================================================= */

  const validateStepThree = () => {
    /*
     * Karyawan baru wajib memiliki foto.
     * Karyawan lama boleh menggunakan foto lama.
     */

    if (
      registrationType === "baru" &&
      !formData.foto
    ) {
      setErrorMessage(
        "Silakan upload foto karyawan."
      );
      return false;
    }

    return true;
  };

  /* =======================================================
     NEXT STEP
  ======================================================= */

  const handleNext = () => {
    setErrorMessage("");

    if (
      currentStep === 1 &&
      !validateStepOne()
    ) {
      return;
    }

    if (
      currentStep === 2 &&
      !validateStepTwo()
    ) {
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

    setCurrentStep((previous) =>
      Math.max(previous - 1, 1)
    );
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
      setErrorMessage(
        "File yang dipilih harus berupa gambar."
      );

      event.target.value = "";
      return;
    }

    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      setErrorMessage(
        "Ukuran foto maksimal 5 MB."
      );

      event.target.value = "";
      return;
    }

    setErrorMessage("");
    updateField("foto", file);
  };

  /* =======================================================
     CREATE FORMDATA PAYLOAD
  ======================================================= */

  const createPayload = () => {
    const payload = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (key === "foto") {
        if (value instanceof File) {
          payload.append("foto", value);
        }

        return;
      }

      payload.append(key, value ?? "");
    });

    return payload;
  };

  /* =======================================================
     SUBMIT
  ======================================================= */

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
      const payload = createPayload();

      const method =
        registrationType === "lama"
          ? "PUT"
          : "POST";

      const response = await fetch(
        "/api/register",
        {
          method,
          body: payload,
        }
      );

      let result = null;

      try {
        result = await response.json();
      } catch {
        result = null;
      }

      if (!response.ok) {
        throw new Error(
          result?.message ||
            (
              registrationType === "lama"
                ? "Gagal memperbarui data karyawan."
                : "Gagal mengirim data karyawan."
            )
        );
      }

      setIsSuccess(true);
    } catch (error) {
      console.error("Submit register error:", error);

      setErrorMessage(
        error?.message ||
          "Terjadi kesalahan saat mengirim data."
      );
    } finally {
      setIsLoading(false);
    }
  };

  /* =======================================================
     RETURN API
  ======================================================= */

  return {
    /* Registration type */
    registrationType,
    setRegistrationType,
    handleSelectNewEmployee,
    handleSelectExistingEmployee,
    handleBackToTypeSelection,

    /* Step */
    currentStep,
    setCurrentStep,
    totalSteps: TOTAL_STEPS,
    handleNext,
    handlePrevious,

    /* Form */
    formData,
    setFormData,
    updateField,
    resetForm,

    /* Search */
    searchNik,
    setSearchNik,
    handleFindEmployee,
    isFindingEmployee,
    employeeNotFound,
    setEmployeeNotFound,

    /* Photo */
    photoPreview,
    existingPhotoUrl,
    handlePhotoChange,

    /* Submit */
    handleSubmit,
    isLoading,

    /* Error */
    errorMessage,
    setErrorMessage,

    /* Success */
    isSuccess,
    setIsSuccess,

    /* Validation */
    validateStepOne,
    validateStepTwo,
    validateStepThree,
  };
}