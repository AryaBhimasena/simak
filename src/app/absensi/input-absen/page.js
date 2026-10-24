"use client";

import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";

import {
  UserRound,
  CalendarDays,
  Clock3,
  ClipboardCheck,
  CheckCircle2,
  LoaderCircle,
  X,
  FileText,
  RotateCcw,
  Search,
  ShieldCheck,
  Eye,
  EyeOff,
} from "lucide-react";

import "@/styles/pages/input-absen.css";

/* =========================================================
   01. CONSTANTS
========================================================= */

const BULAN = [
  { value: "01", label: "Januari" },
  { value: "02", label: "Februari" },
  { value: "03", label: "Maret" },
  { value: "04", label: "April" },
  { value: "05", label: "Mei" },
  { value: "06", label: "Juni" },
  { value: "07", label: "Juli" },
  { value: "08", label: "Agustus" },
  { value: "09", label: "September" },
  { value: "10", label: "Oktober" },
  { value: "11", label: "November" },
  { value: "12", label: "Desember" },
];

const HARI = [
  "Minggu",
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
];

const SHIFT_OPTIONS = ["Pagi", "Sore", "Malam", "Full Day"];

const KEHADIRAN_OPTIONS = [
  { value: "H", label: "Hadir (H)" },
  { value: "I", label: "Izin (I)" },
  { value: "S", label: "Sakit (S)" },
  { value: "A", label: "Alpha (A)" },
  { value: "CT", label: "Cuti (CT)" },
  { value: "OFF", label: "Libur (OFF)" },
  { value: "LH", label: "Lembur Sabtu/Minggu (LH)" },
  { value: "TM", label: "Lembur Tanggal Merah (TM)" },
];

const BKO_REASONS = ["Izin", "Sakit", "Alpha", "Cuti", "Resign"];
const JAM_DIWAJIBKAN = ["H", "LH", "TM"];
const CURRENT_YEAR = new Date().getFullYear();

const YEAR_OPTIONS = Array.from(
  { length: 11 },
  (_, index) => String(CURRENT_YEAR - 5 + index)
);

/* =========================================================
   02. DATE & TIME HELPERS
========================================================= */

function getToday() {
  const now = new Date();

  return [
    String(now.getDate()).padStart(2, "0"),
    String(now.getMonth() + 1).padStart(2, "0"),
    now.getFullYear(),
  ].join("/");
}

function getCurrentTime() {
  const now = new Date();

  return [
    String(now.getHours()).padStart(2, "0"),
    String(now.getMinutes()).padStart(2, "0"),
  ].join(":");
}

function getCurrentPeriod() {
  return String(new Date().getMonth() + 1).padStart(2, "0");
}

function getCurrentYear() {
  return String(new Date().getFullYear());
}

function toApiDate(value) {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(
    String(value || "").trim()
  );

  if (!match) return null;

  const [, dayText, monthText, yearText] = match;
  const day = Number(dayText);
  const month = Number(monthText);
  const year = Number(yearText);

  const date = new Date(year, month - 1, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return `${yearText}-${monthText}-${dayText}`;
}

function formatDate(value) {
  if (value === null || value === undefined || value === "") {
    return "";
  }

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return [
      String(value.getDate()).padStart(2, "0"),
      String(value.getMonth() + 1).padStart(2, "0"),
      value.getFullYear(),
    ].join("/");
  }

  const raw = String(value).trim();

  const dmy = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(raw);
  if (dmy) return raw;

  const ymd = /^(\d{4})-(\d{2})-(\d{2})/.exec(raw);
  if (ymd) return `${ymd[3]}/${ymd[2]}/${ymd[1]}`;

  return raw;
}

function formatTime(value) {
  if (value === null || value === undefined || value === "") {
    return "";
  }

  const text = String(value).trim();
  const match = /^(\d{1,2}):(\d{2})/.exec(text);

  if (!match) return text;

  return `${match[1].padStart(2, "0")}:${match[2]}`;
}

function getDayFromDate(apiDate) {
  if (!apiDate) return "";

  const [year, month, day] = apiDate.split("-").map(Number);
  return HARI[new Date(year, month - 1, day).getDay()];
}

function getDateKey(value) {
  const apiDate = toApiDate(formatDate(value));

  if (!apiDate) return null;

  return apiDate;
}

function getMonthLabel(period) {
  return BULAN.find((item) => item.value === period)?.label || "-";
}

function getDaysInMonth(period, year) {
  const month = Number(period);
  const selectedYear = Number(year);

  if (!month || !selectedYear) return [];

  const totalDays = new Date(selectedYear, month, 0).getDate();

  return Array.from({ length: totalDays }, (_, index) => {
    const day = index + 1;
    const apiDate = `${selectedYear}-${String(month).padStart(
      2,
      "0"
    )}-${String(day).padStart(2, "0")}`;

    return {
      apiDate,
      tanggal: `${String(day).padStart(2, "0")}/${String(
        month
      ).padStart(2, "0")}/${selectedYear}`,
      hari: getDayFromDate(apiDate),
    };
  });
}

/* =========================================================
   03. EMPLOYEE & RESPONSE HELPERS
========================================================= */

function getEmployeeName(employee) {
  return (
    employee?.nama_karyawan ||
    employee?.nama ||
    employee?.name ||
    "-"
  );
}

function getEmployeeId(employee) {
  return String(employee?.id_karyawan ?? "").trim();
}

function isEmployeeActive(employee) {
  const status = String(employee?.status_aktif ?? "")
    .trim()
    .toLowerCase();

  return ["aktif", "active", "true", "1", "ya", "yes"].includes(
    status
  );
}

function sanitizeEmployee(employee) {
  if (
    !employee ||
    typeof employee !== "object" ||
    Array.isArray(employee)
  ) {
    return null;
  }

  const id = getEmployeeId(employee);
  const nama = getEmployeeName(employee);

  if (!id || nama === "-") return null;

  return {
    ...employee,
    id_karyawan: id,
    nama,
    kategori_tk: employee.kategori_tk || "-",
    jabatan: employee.jabatan || "-",
    penempatan:
      employee.nama_clients ||
      employee.nama_client ||
      employee.nama_gedung ||
      employee.penempatan ||
      "",
    nama_clients:
      employee.nama_clients ||
      employee.nama_client ||
      "",
    nama_gedung: employee.nama_gedung || "",
    status_aktif: employee.status_aktif,
  };
}

function extractEmployee(result) {
  const candidate =
    result?.data?.karyawan ||
    result?.data?.employee ||
    result?.karyawan ||
    result?.employee ||
    result?.data ||
    result;

  return sanitizeEmployee(candidate);
}

function getAttendanceRows(result) {
  const candidates = [
    result?.data?.absensi,
    result?.data?.results,
    result?.data?.rows,
    result?.absensi,
    result?.results,
    result?.data,
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) return candidate;
  }

  return [];
}

function sortAttendanceByDate(rows) {
  return [...rows].sort((a, b) => {
    const dateA = getDateKey(a?.tanggal) || "";
    const dateB = getDateKey(b?.tanggal) || "";

    if (dateA !== dateB) {
      return dateA.localeCompare(dateB);
    }

    return String(a?.id_karyawan || "").localeCompare(
      String(b?.id_karyawan || "")
    );
  });
}

function getErrorMessage(error, fallback) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}

function getPlacementName(...sources) {
  const nameKeys = [
    "nama_clients",
    "nama_client",
    "client_name",
    "nama_gedung",
    "nama_penempatan",
    "lokasi_penempatan",
  ];

  for (const source of sources) {
    if (!source || typeof source !== "object") continue;

    for (const key of nameKeys) {
      const value = source[key];

      if (value === null || value === undefined) continue;

      const name = String(value).trim();

      if (name && name !== "-") {
        return name;
      }
    }
  }

  for (const source of sources) {
    if (!source || typeof source !== "object") continue;

    const placement = String(source.penempatan ?? "").trim();

    if (
      placement &&
      placement !== "-" &&
      !/^-?\d+$/.test(placement) &&
      !/^id_clients$/i.test(placement)
    ) {
      return placement;
    }
  }

  return "";
}

function indexAttendanceByDate(rows) {
  const index = new Map();

  for (const row of rows) {
    const dateKey = getDateKey(row?.tanggal);

    if (!dateKey || index.has(dateKey)) continue;

    index.set(dateKey, row);
  }

  return index;
}

/* =========================================================
   04. MAIN COMPONENT
========================================================= */

export default function InputAbsenPage() {
  const [isMounted, setIsMounted] = useState(false);

  /* EMPLOYEE */

  const [employeeIdInput, setEmployeeIdInput] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isValidating, setIsValidating] = useState(false);
  const [searchError, setSearchError] = useState("");

  /* NIK LOOKUP */

  const [showNikLookup, setShowNikLookup] = useState(false);
  const [nikInput, setNikInput] = useState("");
  const [showNikValue, setShowNikValue] = useState(false);
  const [isLookingUpNik, setIsLookingUpNik] = useState(false);
  const [nikError, setNikError] = useState("");
  const [nikMessage, setNikMessage] = useState("");

  /* PERIOD */

  const [period, setPeriod] = useState("");
  const [year, setYear] = useState("");

  /* ATTENDANCE */

  const [attendanceDate, setAttendanceDate] = useState("");
  const [shift, setShift] = useState("Pagi");
  const [kehadiran, setKehadiran] = useState("H");
  const [jamMasuk, setJamMasuk] = useState("");
  const [jamPulang, setJamPulang] = useState("");
  const [keterangan, setKeterangan] = useState("");
  const [attendanceTab, setAttendanceTab] = useState("reguler");

  /* BKO */

  const [absentIdInput, setAbsentIdInput] = useState("");
  const [absentEmployee, setAbsentEmployee] = useState(null);
  const [isValidatingAbsent, setIsValidatingAbsent] = useState(false);
  const [absentError, setAbsentError] = useState("");
  const [bkoReason, setBkoReason] = useState("");

  /* RECAP */

  const [attendanceRows, setAttendanceRows] = useState([]);
  const [isLoadingRows, setIsLoadingRows] = useState(false);
  const [rowsError, setRowsError] = useState("");

  /* SUBMISSION */

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [recapRefreshKey, setRecapRefreshKey] = useState(0);

  const requiresTime = JAM_DIWAJIBKAN.includes(kehadiran);

  const canShowAttendanceFields =
    attendanceTab === "reguler" || Boolean(absentEmployee);

  /* =====================================================
     05. BUILD FULL CALENDAR
  ===================================================== */

  const calendarDays = useMemo(
    () => getDaysInMonth(period, year),
    [period, year]
  );

  const attendanceByDate = useMemo(
    () => indexAttendanceByDate(attendanceRows),
    [attendanceRows]
  );

  /* =====================================================
     06. INITIALIZE DATE / TIME
  ===================================================== */

  useEffect(() => {
    setAttendanceDate(getToday());
    setJamMasuk(getCurrentTime());
    setPeriod(getCurrentPeriod());
    setYear(getCurrentYear());
    setIsMounted(true);
  }, []);

  /* =====================================================
     07. VALIDATE EMPLOYEE BY ID
  ===================================================== */

  async function validateEmployeeById(id) {
    const normalizedId = String(id || "").trim();

    if (!normalizedId) {
      throw new Error("Masukkan ID Karyawan terlebih dahulu.");
    }

    const result = await api.get({
      action: "validateKaryawanById",
      id_karyawan: normalizedId,
    });

    if (result?.success !== true) {
      throw new Error(
        result?.message ||
          "ID Karyawan tidak ditemukan atau tidak aktif."
      );
    }

    const employee = extractEmployee(result);

    if (!employee) {
      throw new Error("Data karyawan tidak valid.");
    }

    if (!isEmployeeActive(employee)) {
      throw new Error("Karyawan tidak aktif.");
    }

    return employee;
  }

  /* =====================================================
     08. RESET ATTENDANCE FIELDS
  ===================================================== */

  function resetAttendanceFields_() {
    setAttendanceDate(getToday());
    setShift("Pagi");
    setKehadiran("H");
    setJamMasuk(getCurrentTime());
    setJamPulang("");
    setKeterangan("");
  }

  /* =====================================================
     09. HANDLE EMPLOYEE VALIDATION
  ===================================================== */

  async function handleValidateEmployee(event) {
    event.preventDefault();

    if (isValidating) return;

    setSearchError("");
    setFormError("");
    setSuccessMessage("");
    setRowsError("");
    setAttendanceRows([]);
    setSelectedEmployee(null);
    setIsValidating(true);

    try {
      const employee = await validateEmployeeById(employeeIdInput);

      setSelectedEmployee(employee);
      setEmployeeIdInput(employee.id_karyawan);

      resetAttendanceFields_();

      setAbsentEmployee(null);
      setAbsentIdInput("");
      setAbsentError("");
      setBkoReason("");
      setAttendanceTab("reguler");
    } catch (error) {
      setSearchError(
        getErrorMessage(
          error,
          "Validasi karyawan gagal. Silakan coba kembali."
        )
      );
    } finally {
      setIsValidating(false);
    }
  }

  /* =====================================================
     10. LOOKUP ID BY NIK
  ===================================================== */

  async function handleNikLookup(event) {
    event.preventDefault();

    if (isLookingUpNik) return;

    const nik = nikInput.trim();

    setNikError("");
    setNikMessage("");

    if (!/^\d{16}$/.test(nik)) {
      setNikError("Masukkan NIK lengkap sebanyak 16 digit.");
      return;
    }

    setIsLookingUpNik(true);

    try {
      const result = await api.get({
        action: "getIdKaryawanByNIK",
        nik,
      });

      if (result?.success !== true) {
        throw new Error(
          result?.message ||
            "Data tidak ditemukan. Periksa kembali NIK Anda."
        );
      }

      const idKaryawan =
        result?.data?.id_karyawan ??
        result?.id_karyawan ??
        "";

      if (!String(idKaryawan).trim()) {
        throw new Error(
          "ID tidak ditemukan. Hubungi petugas administrasi."
        );
      }

      setEmployeeIdInput(String(idKaryawan).trim());
      setShowNikLookup(false);
      setShowNikValue(false);

      setNikMessage(
        "ID ditemukan. Silakan validasi ID untuk melanjutkan."
      );
    } catch (error) {
      setNikError(
        getErrorMessage(
          error,
          "Pencarian ID gagal. Silakan hubungi petugas."
        )
      );
    } finally {
      setNikInput("");
      setShowNikValue(false);
      setIsLookingUpNik(false);
    }
  }

  /* =====================================================
     11. CANCEL INPUT SESSION
  ===================================================== */

  function handleCancelInput() {
    setSelectedEmployee(null);
    setEmployeeIdInput("");

    setSearchError("");
    setFormError("");
    setSuccessMessage("");

    setAttendanceRows([]);
    setRowsError("");

    setAbsentEmployee(null);
    setAbsentIdInput("");
    setAbsentError("");
    setBkoReason("");

    setAttendanceTab("reguler");

    setShowNikLookup(false);
    setNikInput("");
    setShowNikValue(false);
    setNikError("");
    setNikMessage("");

    setPeriod(getCurrentPeriod());
    setYear(getCurrentYear());

    resetAttendanceFields_();
  }

  /* =====================================================
     12. LOAD ATTENDANCE RECAP
  ===================================================== */

  useEffect(() => {
    if (
      !isMounted ||
      !selectedEmployee?.id_karyawan ||
      !period ||
      !year
    ) {
      setAttendanceRows([]);
      setRowsError("");
      setIsLoadingRows(false);
      return;
    }

    let active = true;

    async function loadAttendance() {
      setIsLoadingRows(true);
      setRowsError("");
      setAttendanceRows([]);

      try {
        const result = await api.get({
          action: "getAbsensi",
          id_karyawan: selectedEmployee.id_karyawan,
          periode: period,
          tahun: year,
        });

        if (!active) return;

        if (result?.success !== true) {
          throw new Error(
            result?.message || "Rekap absensi tidak dapat dimuat."
          );
        }

        const rows = getAttendanceRows(result);

        if (!active) return;

        setAttendanceRows(sortAttendanceByDate(rows));
      } catch (error) {
        if (!active) return;

        setAttendanceRows([]);

        setRowsError(
          getErrorMessage(
            error,
            "Rekap absensi belum dapat dimuat."
          )
        );
      } finally {
        if (active) setIsLoadingRows(false);
      }
    }

    loadAttendance();

    return () => {
      active = false;
    };
  }, [
    isMounted,
    selectedEmployee?.id_karyawan,
    period,
    year,
    recapRefreshKey,
  ]);

  /* =====================================================
     13. VALIDATE BKO EMPLOYEE
  ===================================================== */

  async function handleValidateAbsentEmployee() {
    if (isValidatingAbsent) return;

    setAbsentError("");
    setAbsentEmployee(null);
    setBkoReason("");
    setFormError("");

    if (!absentIdInput.trim()) {
      setAbsentError("Masukkan ID karyawan yang digantikan.");
      return;
    }

    setIsValidatingAbsent(true);

    try {
      const employee = await validateEmployeeById(absentIdInput);

      if (employee.id_karyawan === selectedEmployee?.id_karyawan) {
        throw new Error(
          "ID karyawan yang digantikan tidak boleh sama dengan ID pengganti."
        );
      }

      setAbsentEmployee(employee);
      setAbsentIdInput(employee.id_karyawan);
    } catch (error) {
      setAbsentError(
        getErrorMessage(
          error,
          "Validasi karyawan yang digantikan gagal."
        )
      );
    } finally {
      setIsValidatingAbsent(false);
    }
  }

  /* =====================================================
     14. HANDLE ATTENDANCE SUBMISSION
  ===================================================== */

  async function handleSubmit(event) {
    event.preventDefault();

    if (isSubmitting || isValidatingAbsent) return;

    setFormError("");
    setSuccessMessage("");

    if (
      !selectedEmployee?.id_karyawan ||
      !isEmployeeActive(selectedEmployee)
    ) {
      setFormError("Validasi ID Karyawan terlebih dahulu.");
      return;
    }

    const apiDate = toApiDate(attendanceDate);

    if (!apiDate) {
      setFormError(
        "Tanggal tidak valid. Gunakan format DD/MM/YYYY dan pastikan tanggal benar."
      );
      return;
    }

    const calendarMonth = apiDate.slice(5, 7);
    const calendarYear = Number(apiDate.slice(0, 4));

    if (
      !KEHADIRAN_OPTIONS.some(
        (option) => option.value === kehadiran
      )
    ) {
      setFormError("Pilih status kehadiran yang valid.");
      return;
    }

    if (!SHIFT_OPTIONS.includes(shift)) {
      setFormError("Pilih shift yang valid.");
      return;
    }

    if (requiresTime && (!jamMasuk || !jamPulang)) {
      setFormError(
        "Lengkapi jam masuk dan jam keluar untuk status kehadiran ini."
      );
      return;
    }

    if (requiresTime && jamMasuk === jamPulang) {
      setFormError("Jam masuk dan jam keluar tidak boleh sama.");
      return;
    }

    if (attendanceTab === "bko") {
      if (!absentEmployee?.id_karyawan) {
        setFormError(
          "Validasi ID karyawan yang digantikan terlebih dahulu."
        );
        return;
      }

      if (
        absentEmployee.id_karyawan === selectedEmployee.id_karyawan
      ) {
        setFormError(
          "ID pengganti dan karyawan yang digantikan tidak boleh sama."
        );
        return;
      }

      if (!BKO_REASONS.includes(bkoReason)) {
        setFormError("Pilih alasan BKO yang valid.");
        return;
      }
    }

    const payload = {
      action: "saveAbsensi",
      tanggal: apiDate,
      hari: getDayFromDate(apiDate),
      periode: calendarMonth,
      tahun: calendarYear,
      id_karyawan: selectedEmployee.id_karyawan,
      penempatan: selectedEmployee.penempatan,
      kehadiran,
      shift,
      jam_masuk: requiresTime ? jamMasuk : "",
      jam_keluar: requiresTime ? jamPulang : "",
      jam_lembur: "",
      konversi_lembur: "",
      id_bko:
        attendanceTab === "bko"
          ? absentEmployee.id_karyawan
          : "",
      keterangan:
        attendanceTab === "bko"
          ? bkoReason
          : keterangan.trim(),
    };

    setIsSubmitting(true);

    try {
      const result = await api.post(payload);

      if (result?.success !== true) {
        throw new Error(
          result?.message || "Absensi gagal disimpan."
        );
      }

      setSuccessMessage(
        result?.message ||
          `Absensi ${
            attendanceTab === "bko" ? "BKO" : "Reguler"
          } berhasil disimpan.`
      );

      setRecapRefreshKey((previous) => previous + 1);

      setAbsentEmployee(null);
      setAbsentIdInput("");
      setAbsentError("");
      setBkoReason("");
      setAttendanceTab("reguler");

      resetAttendanceFields_();
    } catch (error) {
      setFormError(
        getErrorMessage(
          error,
          "Terjadi kesalahan saat menyimpan absensi."
        )
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  /* =====================================================
     15. RESET FORM
  ===================================================== */

  function handleResetForm() {
    resetAttendanceFields_();

    setFormError("");
    setSuccessMessage("");

    setAbsentEmployee(null);
    setAbsentIdInput("");
    setAbsentError("");
    setBkoReason("");
  }

  /* =====================================================
     16. SHARED PERIOD SELECTORS
  ===================================================== */

  function renderPeriodSelectors(prefix) {
    return (
      <div className="absen-fields-grid absen-period-grid">
        <div className="absen-field">
          <label htmlFor={`${prefix}-period`}>
            Periode Kerja <span>*</span>
          </label>

          <select
            id={`${prefix}-period`}
            className="absen-select"
            value={period}
            onChange={(event) => {
              setPeriod(event.target.value);
              setRowsError("");
              setFormError("");
            }}
            required
          >
            {BULAN.map((month) => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>
        </div>

        <div className="absen-field">
          <label htmlFor={`${prefix}-year`}>
            Tahun Periode <span>*</span>
          </label>

          <select
            id={`${prefix}-year`}
            className="absen-select"
            value={year}
            onChange={(event) => {
              setYear(event.target.value);
              setRowsError("");
              setFormError("");
            }}
            required
          >
            {!YEAR_OPTIONS.includes(year) && year && (
              <option value={year}>{year}</option>
            )}

            {YEAR_OPTIONS.map((optionYear) => (
              <option key={optionYear} value={optionYear}>
                {optionYear}
              </option>
            ))}
          </select>
        </div>
      </div>
    );
  }

  /* =====================================================
     17. RENDER
  ===================================================== */

  return (
    <main className="input-absen-page">
      <div className="input-absen-container">
        {/* BRAND */}

        <header className="absen-brand">
          <div className="absen-brand-mark">
            <ClipboardCheck size={23} strokeWidth={2.1} />
          </div>

          <div className="absen-brand-copy">
            <span className="absen-brand-title">SIMAK-KII</span>
            <span className="absen-brand-subtitle">
              Sistem Informasi Management dan Administrasi Kantor
            </span>
          </div>
        </header>

        {/* HEADING */}

        <section className="absen-page-heading">
          <span className="absen-eyebrow">
            ADMINISTRASI KEHADIRAN
          </span>

          <h1>Input Absensi</h1>

          <p>
            Validasi ID Karyawan untuk mengisi absensi dan melihat
            rekap kehadiran Anda.
          </p>
        </section>

        {/* SUCCESS */}

        {successMessage && (
          <div className="absen-success-banner" role="status">
            <CheckCircle2 size={18} />
            <span>{successMessage}</span>

            <button
              type="button"
              onClick={() => setSuccessMessage("")}
              aria-label="Tutup notifikasi"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* =================================================
            1. EMPLOYEE VALIDATION
        ================================================= */}

        <section className="absen-panel">
          <div className="absen-section-heading">
            <div className="absen-section-icon">
              <ShieldCheck size={19} />
            </div>

            <div>
              <h2>1. Validasi Karyawan</h2>
              <p>
                Masukkan ID Karyawan Anda untuk melanjutkan.
              </p>
            </div>
          </div>

          {!selectedEmployee ? (
            <>
              <form
                className="absen-form"
                onSubmit={handleValidateEmployee}
              >
                <div className="absen-field">
                  <label htmlFor="employee-id">
                    ID Karyawan <span>*</span>
                  </label>

                  <div className="absen-input-wrap">
                    <UserRound
                      size={17}
                      className="absen-input-icon"
                    />

                    <input
                      id="employee-id"
                      type="text"
                      value={employeeIdInput}
                      onChange={(event) => {
                        setEmployeeIdInput(event.target.value);
                        setSearchError("");
                        setNikMessage("");
                      }}
                      placeholder="Masukkan ID Karyawan Anda"
                      autoComplete="off"
                      required
                      disabled={isValidating}
                    />
                  </div>
                </div>

                {searchError && (
                  <div className="absen-error" role="alert">
                    <X size={17} />
                    <span>{searchError}</span>
                  </div>
                )}

                {nikMessage && (
                  <div className="absen-info-note" role="status">
                    <CheckCircle2 size={16} />
                    <span>{nikMessage}</span>
                  </div>
                )}

                <div className="absen-form-actions">
                  <button
                    type="submit"
                    className="absen-button"
                    disabled={isValidating || !isMounted}
                  >
                    {isValidating ? (
                      <>
                        <LoaderCircle
                          size={17}
                          className="absen-spinner"
                        />
                        Memvalidasi...
                      </>
                    ) : (
                      <>
                        <ShieldCheck size={17} />
                        Validasi ID
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    className="absen-button absen-button-secondary"
                    disabled={isValidating}
                    onClick={() => {
                      setShowNikLookup((previous) => !previous);
                      setNikInput("");
                      setShowNikValue(false);
                      setNikError("");
                      setNikMessage("");
                    }}
                  >
                    <Search size={16} />
                    Lupa ID Karyawan?
                  </button>
                </div>
              </form>

              {showNikLookup && (
                <div className="absen-bko-section">
                  <div className="absen-info-note">
                    <ShieldCheck size={16} />
                    <span>
                      Masukkan NIK 16 digit untuk mencari ID Karyawan
                      Anda.
                    </span>
                  </div>

                  <form
                    className="absen-form"
                    onSubmit={handleNikLookup}
                  >
                    <div className="absen-field">
                      <label htmlFor="nik-lookup">
                        NIK (16 digit) <span>*</span>
                      </label>

                      <div className="absen-input-wrap absen-nik-wrap">
                        <input
                          id="nik-lookup"
                          className="absen-nik-input"
                          type={showNikValue ? "text" : "password"}
                          inputMode="numeric"
                          pattern="[0-9]{16}"
                          maxLength={16}
                          value={nikInput}
                          onChange={(event) => {
                            const value = event.target.value
                              .replace(/\D/g, "")
                              .slice(0, 16);

                            setNikInput(value);
                            setNikError("");
                          }}
                          placeholder="Masukkan 16 digit NIK"
                          autoComplete="off"
                          required
                          disabled={isLookingUpNik}
                          aria-describedby="nik-lookup-hint"
                        />

                        <button
                          type="button"
                          className="absen-nik-toggle"
                          onClick={() =>
                            setShowNikValue((previous) => !previous)
                          }
                          aria-label={
                            showNikValue
                              ? "Sembunyikan NIK"
                              : "Tampilkan NIK"
                          }
                          aria-pressed={showNikValue}
                          title={
                            showNikValue
                              ? "Sembunyikan NIK"
                              : "Tampilkan NIK"
                          }
                          disabled={isLookingUpNik}
                        >
                          {showNikValue ? (
                            <EyeOff size={19} />
                          ) : (
                            <Eye size={19} />
                          )}
                        </button>
                      </div>

                      <p
                        id="nik-lookup-hint"
                        className="absen-field-hint"
                      >
                        NIK disamarkan secara default. Tekan ikon
                        mata untuk melihat atau menyembunyikannya.
                      </p>
                    </div>

                    {nikError && (
                      <div className="absen-error" role="alert">
                        <X size={17} />
                        <span>{nikError}</span>
                      </div>
                    )}

                    <div className="absen-form-actions">
                      <button
                        type="submit"
                        className="absen-button"
                        disabled={isLookingUpNik}
                      >
                        {isLookingUpNik ? (
                          <>
                            <LoaderCircle
                              size={17}
                              className="absen-spinner"
                            />
                            Mencari ID...
                          </>
                        ) : (
                          <>
                            <Search size={16} />
                            Cari ID
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </>
          ) : (
            <div className="absen-selected-banner">
              <CheckCircle2 size={18} />

              <div>
                <strong>Identitas berhasil divalidasi</strong>
                <span>
                  ID Karyawan: {selectedEmployee.id_karyawan}
                </span>
                <span>Nama: {selectedEmployee.nama}</span>
                <span>
                  Kategori TK: {selectedEmployee.kategori_tk}
                </span>
                <span>Jabatan: {selectedEmployee.jabatan}</span>
                <span>
                  Penempatan:{" "}
                  {getPlacementName(selectedEmployee) || "-"}
                </span>
              </div>

              <button
                type="button"
                onClick={handleCancelInput}
                aria-label="Akhiri sesi input"
                title="Akhiri sesi"
              >
                <X size={17} />
              </button>
            </div>
          )}
        </section>

        {/* =================================================
            2. ATTENDANCE DETAILS
        ================================================= */}

        <section className="absen-panel">
          <div className="absen-section-heading">
            <div className="absen-section-icon">
              <CalendarDays size={19} />
            </div>

            <div>
              <h2>2. Detail Absensi</h2>
              <p>
                {selectedEmployee
                  ? `Isi detail absensi untuk ${selectedEmployee.nama}.`
                  : "Validasi ID Karyawan terlebih dahulu untuk melanjutkan."}
              </p>
            </div>
          </div>

          {!selectedEmployee ? (
            <div className="absen-empty-state">
              <UserRound size={24} />
              <strong>Identitas belum divalidasi</strong>
              <span>
                Masukkan ID Karyawan pada bagian pertama untuk
                melanjutkan.
              </span>
            </div>
          ) : (
            <form className="absen-form" onSubmit={handleSubmit}>
              <fieldset disabled={isSubmitting}>
                {renderPeriodSelectors("attendance")}

                <div className="absen-info-note" role="status">
                  <CalendarDays size={16} />
                  <span>
                    Pilihan periode:{" "}
                    <strong>
                      {getMonthLabel(period)} {year}
                    </strong>
                    . Gunakan pilihan ini untuk melihat rekap absensi
                    pada bulan dan tahun yang diinginkan.
                  </span>
                </div>

                {/* TABS */}

                <div
                  className="absen-tabs"
                  role="tablist"
                  aria-label="Jenis absensi"
                >
                  <button
                    type="button"
                    role="tab"
                    aria-selected={attendanceTab === "reguler"}
                    className={`absen-tab ${
                      attendanceTab === "reguler" ? "active" : ""
                    }`}
                    onClick={() => {
                      setAttendanceTab("reguler");
                      setFormError("");
                    }}
                  >
                    Absen Reguler
                  </button>

                  <button
                    type="button"
                    role="tab"
                    aria-selected={attendanceTab === "bko"}
                    className={`absen-tab ${
                      attendanceTab === "bko" ? "active" : ""
                    }`}
                    onClick={() => {
                      setAttendanceTab("bko");
                      setFormError("");
                    }}
                  >
                    Absen BKO
                  </button>
                </div>

                {/* STATUS REGULER */}

                {attendanceTab === "reguler" && (
                  <div className="absen-field">
                    <label htmlFor="attendance-status">
                      Kehadiran <span>*</span>
                    </label>

                    <select
                      id="attendance-status"
                      className="absen-select"
                      value={kehadiran}
                      onChange={(event) => {
                        setKehadiran(event.target.value);
                        setFormError("");
                      }}
                      required
                    >
                      {KEHADIRAN_OPTIONS.map((option) => (
                        <option
                          key={option.value}
                          value={option.value}
                        >
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* BKO */}

                {attendanceTab === "bko" && (
                  <div className="absen-bko-section">
                    <div className="absen-info-note">
                      <FileText size={16} />
                      <span>
                        Masukkan ID Karyawan yang digantikan untuk
                        melanjutkan pengisian absensi BKO.
                      </span>
                    </div>

                    {!absentEmployee ? (
                      <div className="absen-form">
                        <div className="absen-field">
                          <label htmlFor="absent-employee-id">
                            ID Karyawan yang Digantikan{" "}
                            <span>*</span>
                          </label>

                          <input
                            id="absent-employee-id"
                            type="text"
                            value={absentIdInput}
                            onChange={(event) => {
                              setAbsentIdInput(event.target.value);
                              setAbsentError("");
                            }}
                            placeholder="Masukkan ID Karyawan"
                            autoComplete="off"
                            disabled={isValidatingAbsent}
                            onKeyDown={(event) => {
                              if (event.key === "Enter") {
                                event.preventDefault();

                                if (!isValidatingAbsent) {
                                  handleValidateAbsentEmployee();
                                }
                              }
                            }}
                          />
                        </div>

                        {absentError && (
                          <div className="absen-error" role="alert">
                            <X size={17} />
                            <span>{absentError}</span>
                          </div>
                        )}

                        <button
                          type="button"
                          className="absen-button"
                          disabled={isValidatingAbsent}
                          onClick={handleValidateAbsentEmployee}
                        >
                          {isValidatingAbsent ? (
                            <>
                              <LoaderCircle
                                size={17}
                                className="absen-spinner"
                              />
                              Memvalidasi...
                            </>
                          ) : (
                            <>
                              <Search size={16} />
                              Validasi ID
                            </>
                          )}
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="absen-selected-banner">
                          <CheckCircle2 size={18} />

                          <div>
                            <strong>
                              Karyawan yang digantikan
                            </strong>
                            <span>
                              {absentEmployee.nama} · ID:{" "}
                              {absentEmployee.id_karyawan}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              setAbsentEmployee(null);
                              setAbsentIdInput("");
                              setAbsentError("");
                              setBkoReason("");
                            }}
                            aria-label="Batalkan pilihan"
                          >
                            <X size={17} />
                          </button>
                        </div>

                        <div className="absen-field">
                          <label htmlFor="bko-reason">
                            Alasan Tidak Masuk <span>*</span>
                          </label>

                          <select
                            id="bko-reason"
                            className="absen-select"
                            value={bkoReason}
                            onChange={(event) => {
                              setBkoReason(event.target.value);
                              setFormError("");
                            }}
                            required
                          >
                            <option value="">
                              Pilih alasan tidak masuk
                            </option>

                            {BKO_REASONS.map((reason) => (
                              <option key={reason} value={reason}>
                                {reason}
                              </option>
                            ))}
                          </select>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* DATE & SHIFT */}

                {canShowAttendanceFields && (
                  <>
                    <div className="absen-fields-grid">
                      <div className="absen-field">
                        <label htmlFor="attendance-date">
                          Tanggal (DD/MM/YYYY) <span>*</span>
                        </label>

                        <div className="absen-input-wrap">
                          <CalendarDays
                            size={17}
                            className="absen-input-icon"
                          />

                          <input
                            id="attendance-date"
                            type="text"
                            inputMode="numeric"
                            placeholder="DD/MM/YYYY"
                            pattern="(0[1-9]|[12][0-9]|3[01])/(0[1-9]|1[0-2])/[0-9]{4}"
                            maxLength={10}
                            value={attendanceDate}
                            onChange={(event) => {
                              setAttendanceDate(event.target.value);
                              setFormError("");
                            }}
                            required
                          />
                        </div>

                        <p className="absen-field-hint">
                          Masukkan tanggal dengan format DD/MM/YYYY
                          dan pastikan tanggal yang dipilih benar.
                        </p>
                      </div>

                      <div className="absen-field">
                        <label htmlFor="attendance-shift">
                          Shift <span>*</span>
                        </label>

                        <select
                          id="attendance-shift"
                          className="absen-select"
                          value={shift}
                          onChange={(event) => {
                            setShift(event.target.value);
                            setFormError("");
                          }}
                          required
                        >
                          {SHIFT_OPTIONS.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* WORKING HOURS */}

                    <div className="absen-fields-grid absen-hours-grid">
                      <div className="absen-field">
                        <label htmlFor="jam-masuk">
                          Jam Masuk
                          {requiresTime && <span> *</span>}
                        </label>

                        <div className="absen-input-wrap">
                          <Clock3
                            size={17}
                            className="absen-input-icon"
                          />

                          <input
                            id="jam-masuk"
                            type="time"
                            value={jamMasuk}
                            onChange={(event) => {
                              setJamMasuk(event.target.value);
                              setFormError("");
                            }}
                            required={requiresTime}
                            disabled={!requiresTime}
                          />
                        </div>
                      </div>

                      <div className="absen-field">
                        <label htmlFor="jam-pulang">
                          Jam Keluar
                          {requiresTime && <span> *</span>}
                        </label>

                        <div className="absen-input-wrap">
                          <Clock3
                            size={17}
                            className="absen-input-icon"
                          />

                          <input
                            id="jam-pulang"
                            type="time"
                            value={jamPulang}
                            onChange={(event) => {
                              setJamPulang(event.target.value);
                              setFormError("");
                            }}
                            required={requiresTime}
                            disabled={!requiresTime}
                          />
                        </div>
                      </div>
                    </div>

                    {/* NOTES */}

                    {attendanceTab === "reguler" && (
                      <div className="absen-field">
                        <label htmlFor="attendance-notes">
                          Keterangan
                        </label>

                        <textarea
                          id="attendance-notes"
                          value={keterangan}
                          onChange={(event) =>
                            setKeterangan(event.target.value)
                          }
                          placeholder="Tambahkan keterangan jika diperlukan"
                          rows={2}
                        />
                      </div>
                    )}

                    <div className="absen-info-note">
                      <FileText size={16} />
                      <span>
                        Periksa kembali tanggal, status kehadiran,
                        shift, dan jam kerja sebelum menyimpan.
                      </span>
                    </div>

                    {formError && (
                      <div className="absen-error" role="alert">
                        <X size={17} />
                        <span>{formError}</span>
                      </div>
                    )}

                    <div className="absen-form-actions">
                      <button
                        type="button"
                        className="absen-button absen-button-secondary"
                        onClick={handleResetForm}
                        disabled={isSubmitting}
                      >
                        <RotateCcw size={16} />
                        Reset Form
                      </button>

                      <button
                        type="submit"
                        className="absen-button"
                        disabled={
                          isSubmitting ||
                          isValidatingAbsent ||
                          !isMounted
                        }
                      >
                        {isSubmitting ? (
                          <>
                            <LoaderCircle
                              size={17}
                              className="absen-spinner"
                            />
                            Menyimpan...
                          </>
                        ) : (
                          <>
                            <CheckCircle2 size={17} />
                            Simpan Absen{" "}
                            {attendanceTab === "bko"
                              ? "BKO"
                              : "Reguler"}
                          </>
                        )}
                      </button>
                    </div>
                  </>
                )}

                {attendanceTab === "bko" && !absentEmployee && (
                  <p className="absen-field-hint">
                    Validasi ID karyawan yang digantikan untuk
                    melanjutkan.
                  </p>
                )}
              </fieldset>
            </form>
          )}
        </section>

        {/* =================================================
            3. ATTENDANCE RECAP
        ================================================= */}

        <section className="absen-panel absen-recap-panel">
          <div className="absen-section-heading">
            <div className="absen-section-icon">
              <ClipboardCheck size={19} />
            </div>

            <div>
              <h2>3. Rekapitulasi Kehadiran</h2>
              <p>
                Lihat catatan absensi berdasarkan bulan dan tahun
                yang dipilih.
              </p>
            </div>
          </div>

          {!selectedEmployee ? (
            <div className="absen-empty-state">
              <ShieldCheck size={22} />
              <strong>Validasi identitas terlebih dahulu</strong>
              <span>
                Masukkan ID Karyawan pada bagian pertama untuk
                melihat rekap kehadiran.
              </span>
            </div>
          ) : (
            <>
              <div className="absen-recap-filter">
                <div className="absen-fields-grid absen-period-grid">
                  <div className="absen-field">
                    <label htmlFor="recap-period">
                      Periode Absensi
                    </label>

                    <select
                      id="recap-period"
                      className="absen-select"
                      value={period}
                      onChange={(event) => {
                        setPeriod(event.target.value);
                        setRowsError("");
                        setFormError("");
                      }}
                    >
                      {BULAN.map((month) => (
                        <option key={month.value} value={month.value}>
                          {month.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="absen-field">
                    <label htmlFor="recap-year">
                      Tahun Periode
                    </label>

                    <select
                      id="recap-year"
                      className="absen-select"
                      value={year}
                      onChange={(event) => {
                        setYear(event.target.value);
                        setRowsError("");
                        setFormError("");
                      }}
                    >
                      {!YEAR_OPTIONS.includes(year) && year && (
                        <option value={year}>{year}</option>
                      )}

                      {YEAR_OPTIONS.map((optionYear) => (
                        <option
                          key={optionYear}
                          value={optionYear}
                        >
                          {optionYear}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="absen-info-note" role="status">
                <CalendarDays size={16} />
                <span>
                  Rekap periode{" "}
                  <strong>
                    {getMonthLabel(period)} {year}
                  </strong>
                  . Tabel menampilkan seluruh tanggal pada bulan
                  kalender yang dipilih.
                </span>
              </div>

              {rowsError && (
                <div className="absen-error" role="alert">
                  <X size={17} />
                  <span>{rowsError}</span>
                </div>
              )}

              <div className="absen-table-wrapper">
                <table className="absen-table">
                  <thead>
                    <tr>
                      <th>No.</th>
                      <th>Tanggal</th>
                      <th>Hari</th>
                      <th>Nama Karyawan</th>
                      <th>Lokasi Penempatan</th>
                      <th>Kehadiran</th>
                      <th>Shift</th>
                      <th>Jam Masuk</th>
                      <th>Jam Keluar</th>
                    </tr>
                  </thead>

                  <tbody>
                    {isLoadingRows ? (
                      <tr>
                        <td colSpan={9} className="absen-table-state">
                          <LoaderCircle
                            size={18}
                            className="absen-spinner"
                          />
                          <strong>Memuat rekap absensi...</strong>
                        </td>
                      </tr>
                    ) : rowsError ? (
                      <tr>
                        <td colSpan={9} className="absen-table-state">
                          <X size={22} />
                          <strong>Rekap absensi gagal dimuat</strong>
                          <span>{rowsError}</span>
                        </td>
                      </tr>
                    ) : calendarDays.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="absen-table-state">
                          <CalendarDays size={22} />
                          <strong>Periode tidak valid</strong>
                          <span>
                            Pilih bulan dan tahun untuk melihat
                            tanggal periode.
                          </span>
                        </td>
                      </tr>
                    ) : (
                      calendarDays.map((day, index) => {
                        const row = attendanceByDate.get(day.apiDate);

                        const employeeName = row
                          ? row.nama_karyawan ||
                            row.nama ||
                            selectedEmployee.nama
                          : "";

                        const placementName = row
                          ? getPlacementName(selectedEmployee, row)
                          : "";

                        const isSunday = day.hari === "Minggu";

                        return (
                          <tr
                            key={day.apiDate}
                            className={
                              isSunday ? "absen-sunday-row" : undefined
                            }
                          >
                            <td>{index + 1}</td>
                            <td>{day.tanggal}</td>
                            <td
                              className={
                                isSunday ? "absen-sunday-text" : undefined
                              }
                            >
                              {day.hari}
                            </td>
                            <td>{employeeName}</td>
                            <td>{placementName}</td>
                            <td>{row?.kehadiran || ""}</td>
                            <td>{row?.shift || ""}</td>
                            <td>{formatTime(row?.jam_masuk)}</td>
                            <td>{formatTime(row?.jam_keluar)}</td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {!isLoadingRows &&
                !rowsError &&
                calendarDays.length > 0 && (
                  <div className="absen-table-footer">
                    Menampilkan {calendarDays.length} tanggal kalender
                    untuk periode {getMonthLabel(period)} {year}.
                  </div>
                )}
            </>
          )}
        </section>

        {/* FOOTER */}

        <footer className="absen-footer">
          <span>SIMAK-KII</span>
          {" • "}
          Kreasi Inovasi Indonesia
        </footer>
      </div>
    </main>
  );
}