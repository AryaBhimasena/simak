/* =========================================================
   UTIL MODAL KARYAWAN
   KII HRIS
========================================================= */

/* =========================================================
   INITIAL FORM
========================================================= */

export const INITIAL_FORM = {
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
  gaji_pokok: "",
  tunj_makan: "",
  tunj_transport: "",
  tunj_jabatan: "",
  iuran_bpjs_kesehatan: "",
  iuran_bpjs_naker: "",
  tanggal_masuk: "",
  tanggal_keluar: "",
  status_karyawan: "",
  status_aktif: "",
  Keterangan: "",
  Foto: "",
  KTP: "",
  KK: "",
  Catatan: "",
};

/* =========================================================
   FORM HELPERS
========================================================= */

export function createInitialForm() {
  return {
    ...INITIAL_FORM,
  };
}

export function normalizeValue(value) {
  return value == null
    ? ""
    : String(value);
}

/* =========================================================
   DATE HELPERS
========================================================= */

export function normalizeDateValue(value) {
  if (!value) {
    return "";
  }

  const stringValue = String(value).trim();

  if (
    /^\d{4}-\d{2}-\d{2}$/.test(
      stringValue
    )
  ) {
    return stringValue;
  }

  const isoMatch = stringValue.match(
    /^(\d{4}-\d{2}-\d{2})T/
  );

  if (isoMatch) {
    return isoMatch[1];
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return [
    date.getFullYear(),
    String(
      date.getMonth() + 1
    ).padStart(2, "0"),
    String(
      date.getDate()
    ).padStart(2, "0"),
  ].join("-");
}

export function formatInputDate(value) {
  return normalizeDateValue(value);
}

export const DATE_FIELDS = [
  "tanggal_lahir",
  "tanggal_masuk",
  "tanggal_keluar",
];

/* =========================================================
   KARYAWAN NORMALIZER
========================================================= */

export function normalizeKaryawanData(
  data = {}
) {
  const form = createInitialForm();

  Object.keys(form).forEach(key => {
    form[key] = DATE_FIELDS.includes(key)
      ? normalizeDateValue(data[key])
      : normalizeValue(data[key]);
  });

  return form;
}

/* =========================================================
   STATUS HELPERS
========================================================= */

export function isEmployeeActive(
  status
) {
  return (
    String(status || "")
      .trim()
      .toUpperCase() === "AKTIF"
  );
}

export function toggleEmployeeStatus(
  currentStatus
) {
  return isEmployeeActive(currentStatus)
    ? "TIDAK AKTIF"
    : "AKTIF";
}

/* =========================================================
   VALIDATION
========================================================= */

export const REQUIRED_FIELDS = [
  {
    field: "nama_karyawan",
    tab: "personal",
    message:
      "Nama karyawan wajib diisi.",
  },
  {
    field: "kategori_tk",
    tab: "employment",
    message:
      "Kategori tenaga kerja wajib dipilih.",
  },
  {
    field: "jabatan",
    tab: "employment",
    message:
      "Jabatan wajib dipilih.",
  },
  {
    field: "tanggal_masuk",
    tab: "employment",
    message:
      "Tanggal masuk wajib diisi.",
  },
];

export function validateKaryawanForm(
  form
) {
  for (const item of REQUIRED_FIELDS) {
    const value = String(
      form?.[item.field] || ""
    ).trim();

    if (!value) {
      return {
        field: item.field,
        tab: item.tab,
        message: item.message,
      };
    }
  }

  return null;
}

/* =========================================================
   SAVE RESULT
========================================================= */

export function getGeneratedKaryawanId(
  result,
  form
) {
  return (
    result?.id_karyawan ||
    result?.data?.id_karyawan ||
    form?.id_karyawan ||
    ""
  );
}

export function buildSavedKaryawanData(
  form,
  result
) {
  const generatedId =
    getGeneratedKaryawanId(
      result,
      form
    );

  return {
    ...form,
    ...(result?.data || {}),
    id_karyawan: generatedId,
  };
}

/* =========================================================
   MASTER HELPERS
========================================================= */

export function getMasterName(
  data = [],
  id
) {
  const item = data.find(
    entry =>
      String(entry?.id) ===
      String(id)
  );

  return (
    item?.nama ||
    id ||
    "-"
  );
}

/* =========================================================
   MASTER OPTIONS
========================================================= */

export const STATUS_PERNIKAHAN_OPTIONS = [
  {
    value: "BELUM MENIKAH",
    label: "Belum Menikah",
  },
  {
    value: "MENIKAH",
    label: "Menikah",
  },
  {
    value: "CERAI HIDUP",
    label: "Cerai Hidup",
  },
  {
    value: "CERAI MATI",
    label: "Cerai Mati",
  },
];

export const STATUS_KARYAWAN_OPTIONS = [
  {
    value: "TETAP",
    label: "Tetap",
  },
  {
    value: "KONTRAK",
    label: "Kontrak",
  },
  {
    value: "PROBATION",
    label: "Probation",
  },
  {
    value: "OUTSOURCING",
    label: "Outsourcing",
  },
];

/* =========================================================
   MODE HELPERS
========================================================= */

export function isCreateMode(mode) {
  return mode === "create";
}

export function isEditMode(mode) {
  return mode === "edit";
}

export function getModalTitle(mode) {
  return isCreateMode(mode)
    ? "Tambah Karyawan"
    : "Edit Karyawan";
}

export function getModalEyebrow(mode) {
  return isCreateMode(mode)
    ? "DATA BARU"
    : "PROFIL KARYAWAN";
}

export function getModalDescription(
  mode
) {
  return isCreateMode(mode)
    ? "Lengkapi profil dan informasi administrasi karyawan."
    : "Perbarui profil dan informasi administrasi karyawan.";
}

export function getSaveButtonLabel(
  mode
) {
  return isCreateMode(mode)
    ? "Simpan Karyawan"
    : "Simpan Perubahan";
}

/* =========================================================
   SAVE MESSAGE
========================================================= */

export function getCreateSuccessMessage(
  generatedId
) {
  return generatedId
    ? `Karyawan berhasil ditambahkan dengan ID ${generatedId}.`
    : "Karyawan berhasil ditambahkan.";
}

export function getEditSuccessMessage() {
  return "Perubahan data karyawan berhasil disimpan.";
}

export function getSaveErrorMessage(error) {
  return (
    error?.message ||
    "Data karyawan gagal disimpan."
  );
}

/* =========================================================
   PROFILE HELPERS
========================================================= */

export function getEmployeeName(form) {
  return String(
    form?.nama_karyawan || ""
  ).trim();
}

export function getEmployeePhoto(form) {
  return String(
    form?.Foto || ""
  ).trim();
}

/* =========================================================
   INITIAL MODAL STATE
========================================================= */

export function getInitialModalState() {
  return {
    saving: false,
    error: "",
    successMessage: "",
    activeTab: "personal",
    photoFile: null,
    ktpFile: null,
    kkFile: null,
    photoPreview: "",
  };
}