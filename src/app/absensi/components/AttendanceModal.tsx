// app/absensi/components/AttendanceModal.tsx

"use client";

import { useMemo } from "react";
import { X } from "lucide-react";

import "@/style/pages/absensi/attendance-modal.css";

type EmployeeType = {
  id: string;
  nama: string;
  penempatan: string;
  statusAktif: boolean;

  hadir: number;
  izin: number;
  sakit: number;
  alpha: number;
  cuti: number;
  rs: number;
  off: number;
  ln: number;
  sm: number;

  bkoReg: number;
  bkoCt: number;
  bkoRs: number;

  totalLembur: number;
};

type AttendanceModalProps = {
  open: boolean;

  mode: "add" | "edit";

  employee: EmployeeType | null;

  onClose: () => void;
};

type AttendanceRowType = {
  tanggal: string;
  hari: string;
};

export default function AttendanceModal({
  open,
  mode,
  employee,
  onClose,
}: AttendanceModalProps) {
  if (!open) return null;

  /* ====================================== */
  /* DUMMY ACTIVE EMPLOYEE
  /* ====================================== */

  const activeEmployees = [
    "Ahmad Fauzi",
    "Rizky Ramadhan",
    "Dimas Saputra",
    "Bagus Pratama",
    "Riyan Maulana",
    "Fajar Nugraha",
    "Agus Setiawan",
    "M. Ilham",
  ];

  /* ====================================== */
  /* GENERATE DUMMY MONTH
  /* ====================================== */

  const attendanceRows =
    useMemo<AttendanceRowType[]>(() => {
      const result: AttendanceRowType[] =
        [];

      const year = 2026;
      const month = 5; // Juni

      const totalDays =
        new Date(
          year,
          month + 1,
          0
        ).getDate();

      const dayNames = [
        "Minggu",
        "Senin",
        "Selasa",
        "Rabu",
        "Kamis",
        "Jumat",
        "Sabtu",
      ];

      for (
        let day = 1;
        day <= totalDays;
        day++
      ) {
        const date =
          new Date(
            year,
            month,
            day
          );

        result.push({
          tanggal: `${String(
            day
          ).padStart(
            2,
            "0"
          )}/${String(
            month + 1
          ).padStart(
            2,
            "0"
          )}/${year}`,

          hari:
            dayNames[
              date.getDay()
            ],
        });
      }

      return result;
    }, []);

  /* ====================================== */
  /* RENDER
  /* ====================================== */

  return (
    <div
      className="simakAttendanceModal__overlay"
      onClick={onClose}
    >
      <div
        className="simakAttendanceModal__container"
        onClick={(e) =>
          e.stopPropagation()
        }
      >
        {/* ====================================== */}
        {/* HEADER */}
        {/* ====================================== */}

        <div className="simakAttendanceModal__header">
          <div>

            <div className="simakAttendanceModal__eyebrow">
              Management Absensi
            </div>

            <h2 className="simakAttendanceModal__title">
              {mode === "add"
                ? "Input Absensi"
                : "Edit Absensi"}
            </h2>

            <p className="simakAttendanceModal__subtitle">
              Input data
              kehadiran harian,
              shift kerja,
              lembur dan
              backup karyawan.
            </p>

          </div>

          <button
            className="simakAttendanceModal__closeBtn"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>

        {/* ====================================== */}
        {/* EMPLOYEE INFO */}
        {/* ====================================== */}

        <div className="simakAttendanceModal__info">

          <div className="simakAttendanceModal__infoItem">

            <label>
              Nama Karyawan
            </label>

            <span>
              {employee?.nama ??
                "-"}
            </span>

          </div>

          <div className="simakAttendanceModal__infoItem">

            <label>
              Penempatan
            </label>

            <span>
              {employee?.penempatan ??
                "-"}
            </span>

          </div>

          <div className="simakAttendanceModal__infoItem">

            <label>
              Periode Absen
            </label>

            <span>
              Juni 2026
            </span>

          </div>

        </div>

        {/* ====================================== */}
        {/* ACTION BAR */}
        {/* ====================================== */}

        <div className="simakAttendanceModal__actionBar">

          <button
            className="simakAttendanceModal__saveBtn"
            onClick={() => {
              console.log(
                "save attendance"
              );
            }}
          >
            {mode === "add"
              ? "Simpan Absensi"
              : "Update Absensi"}
          </button>

          <button
            className="simakAttendanceModal__cancelBtn"
            onClick={onClose}
          >
            Batal
          </button>

        </div>

        {/* ====================================== */}
        {/* TABLE */}
        {/* ====================================== */}

        <div className="simakAttendanceModal__tableWrapper">

          <table className="simakAttendanceModal__table">

            <thead>

              <tr>

                <th>
                  Tanggal
                </th>

                <th>
                  Hari
                </th>

                <th>
                  Kehadiran
                </th>

                <th>
                  Shift
                </th>

                <th>
                  Jam Masuk
                </th>

                <th>
                  Jam Keluar
                </th>

                <th>
                  Jam Lembur
                </th>

                <th>
                  Konversi
                  Lembur
                </th>

                <th>
                  Anggota
                  Pengganti
                  (BKO)
                </th>

                <th>
                  Keterangan
                </th>

              </tr>

            </thead>

            <tbody>

              {attendanceRows.map(
                (row) => (
                  <tr
                    key={
                      row.tanggal
                    }
                  >
                    <td>
                      {
                        row.tanggal
                      }
                    </td>

                    <td>
                      {row.hari}
                    </td>

                    <td>

                      <select
                        defaultValue="H"
                      >
                        <option>
                          H
                        </option>

                        <option>
                          I
                        </option>

                        <option>
                          S
                        </option>

                        <option>
                          A
                        </option>

                        <option>
                          CT
                        </option>

                        <option>
                          RS
                        </option>

                        <option>
                          OFF
                        </option>

                        <option>
                          LN
                        </option>

                        <option>
                          SM
                        </option>

                        <option>
                          NA
                        </option>
                      </select>

                    </td>

                    <td>

                      <select defaultValue="Pagi">

                        <option>
                          Pagi
                        </option>

                        <option>
                          Siang
                        </option>

                        <option>
                          Malam
                        </option>

                        <option>
                          Full Day
                        </option>

                      </select>

                    </td>

                    <td>

                      <input
                        type="text"
                        defaultValue="-:-"
                      />

                    </td>

                    <td>

                      <input
                        type="text"
                        defaultValue="-:-"
                      />

                    </td>

                    <td>

                      <input
                        type="text"
                        defaultValue="-"
                        placeholder="2.5"
                      />

                    </td>

                    <td>

                      <input
                        type="text"
                        defaultValue="0"
                        readOnly
                      />

                    </td>

                    <td>

                      <input
                        list="simakAttendanceEmployeeList"
                        placeholder="Cari nama..."
                      />

                    </td>

                    <td>

                      <input
                        type="text"
                        placeholder="Keterangan"
                      />

                    </td>

                  </tr>
                )
              )}

            </tbody>

          </table>

          <datalist id="simakAttendanceEmployeeList">

            {activeEmployees.map(
              (employeeName) => (
                <option
                  key={
                    employeeName
                  }
                  value={
                    employeeName
                  }
                />
              )
            )}

          </datalist>

        </div>

      </div>
    </div>
  );
}