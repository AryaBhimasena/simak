// app/absensi/input-absen.tsx

"use client";

import "@/style/pages/absensi/input-absen.css";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Search,
  Users,
} from "lucide-react";

type AttendanceStatus =
  | "H"
  | "I"
  | "A"
  | "S"
  | "CT"
  | "BA"
  | "RS"
  | "TM"
  | "BKO"
  | "OFF";

type ShiftType =
  | "P"
  | "S"
  | "M"
  | "F";

const STATUS_OPTIONS: AttendanceStatus[] =
  [
    "H",
    "I",
    "A",
    "S",
    "CT",
    "BA",
    "RS",
    "TM",
    "BKO",
    "OFF",
  ];

const SHIFT_OPTIONS: ShiftType[] =
  [
    "P",
    "S",
    "M",
    "F",
  ];

export default function InputAbsen() {
  /* ====================================== */
  /* STATE */
  /* ====================================== */

  const [searchText, setSearchText] =
    useState("");

  const [periode, setPeriode] =
    useState("");

  const [
    selectedEmployee,
    setSelectedEmployee,
  ] = useState<any | null>(null);

  const [attendanceList, setAttendanceList] =
    useState<any[]>([]);

  const [
    attendanceDetail,
    setAttendanceDetail,
  ] = useState<any>({});

  /* ====================================== */
  /* LOAD DUMMY */
  /* ====================================== */

  useEffect(() => {
    const today = new Date();

    setPeriode(
      `${today.getFullYear()}-${String(
        today.getMonth() + 1
      ).padStart(2, "0")}`
    );

    const dummyEmployees = [
      {
        id: "EMP001",
        nik: "TK001",
        nama: "Ahmad Fauzi",

        penempatan:
          "PT. Porto Indonesia Sejahtera",

        statusAktif: true,
      },

      {
        id: "EMP002",
        nik: "TK002",
        nama: "Rizky Ramadhan",

        penempatan:
          "PT. Porto Indonesia Sejahtera",

        statusAktif: true,
      },

      {
        id: "EMP003",
        nik: "TK003",
        nama: "Dimas Saputra",

        penempatan:
          "PT. Puninar Logistics",

        statusAktif: true,
      },

      {
        id: "EMP004",
        nik: "TK004",
        nama: "Bagus Pratama",

        penempatan:
          "PT. Puninar Logistics",

        statusAktif: false,
      },
    ];

    setAttendanceList(
      dummyEmployees
    );

    setSelectedEmployee(
      dummyEmployees[0]
    );
  }, []);

  /* ====================================== */
  /* FILTER */
  /* ====================================== */

  const filteredAttendance =
    useMemo(() => {
      return attendanceList.filter(
        (item) =>
          item.statusAktif &&
          item.nama
            .toLowerCase()
            .includes(
              searchText.toLowerCase()
            )
      );
    }, [
      attendanceList,
      searchText,
    ]);

  /* ====================================== */
  /* MONTH */
  /* ====================================== */

  const bulanList = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  const currentDate = useMemo(() => {
    if (!periode)
      return new Date();

    const [year, month] =
      periode.split("-");

    return new Date(
      Number(year),
      Number(month) - 1
    );
  }, [periode]);

  const totalHari = useMemo(() => {
    if (!periode) return 30;

    const [year, month] =
      periode.split("-");

    return new Date(
      Number(year),
      Number(month),
      0
    ).getDate();
  }, [periode]);

  const tanggalList = useMemo(() => {
    return Array.from(
      { length: totalHari },
      (_, index) => {
        const tanggal =
          index + 1;

        return {
          tanggal,
          hari: new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            tanggal
          ).toLocaleDateString(
            "id-ID",
            {
              weekday: "short",
            }
          ),
        };
      }
    );
  }, [
    currentDate,
    totalHari,
  ]);

  const handlePrevMonth = () => {
    const newDate =
      new Date(currentDate);

    newDate.setMonth(
      newDate.getMonth() - 1
    );

    setPeriode(
      `${newDate.getFullYear()}-${String(
        newDate.getMonth() + 1
      ).padStart(2, "0")}`
    );
  };

  const handleNextMonth = () => {
    const newDate =
      new Date(currentDate);

    newDate.setMonth(
      newDate.getMonth() + 1
    );

    setPeriode(
      `${newDate.getFullYear()}-${String(
        newDate.getMonth() + 1
      ).padStart(2, "0")}`
    );
  };

  /* ====================================== */
  /* UPDATE INPUT */
  /* ====================================== */

  const handleAttendanceChange =
    (
      tanggal: number,
      field: string,
      value: string
    ) => {
      setAttendanceDetail(
        (prev: any) => {
          const existing =
            prev?.[tanggal] || {};

          const updated = {
            ...existing,
            [field]: value,
          };

          if (
            field ===
            "jamLembur"
          ) {
            const lembur =
              Number(
                value || 0
              );

            updated.konversi =
              Number(
                (
                  lembur *
                  1.9667
                ).toFixed(1)
              );
          }

          return {
            ...prev,
            [tanggal]:
              updated,
          };
        }
      );
    };

  return (
    <div className="simakAttendancePage__layout">

      {/* ====================================== */}
      {/* LEFT CARD */}
      {/* ====================================== */}

      <div className="simakAttendancePage__employeeCard">

        <div className="simakAttendancePage__cardHeader">

          <div>

            <div className="simakAttendancePage__cardTitle">
              Karyawan Aktif
            </div>

            <div className="simakAttendancePage__cardSubtitle">
              Pilih karyawan untuk input absensi
            </div>

          </div>

          <div className="simakAttendancePage__counter">

            <Users size={15} />

            {
              filteredAttendance.length
            }

          </div>

        </div>

        <div className="simakAttendancePage__searchBox">

          <Search size={16} />

          <input
            type="text"
            placeholder="Cari karyawan..."
            value={searchText}
            onChange={(e) =>
              setSearchText(
                e.target.value
              )
            }
          />

        </div>

        <div className="simakAttendancePage__employeeList">

          {filteredAttendance.map(
            (employee) => (

              <button
                key={
                  employee.id
                }
                onClick={() =>
                  setSelectedEmployee(
                    employee
                  )
                }
                className={`simakAttendancePage__employeeItem ${
                  selectedEmployee?.id ===
                  employee.id
                    ? "simakAttendancePage__employeeItem--active"
                    : ""
                }`}
              >

                <div className="simakAttendancePage__employeeAvatar">

                  {employee.nama.charAt(
                    0
                  )}

                </div>

                <div>

                  <div className="simakAttendancePage__employeeName">

                    {
                      employee.nama
                    }

                  </div>

                  <div className="simakAttendancePage__employeeSub">

                    {
                      employee.penempatan
                    }

                  </div>

                </div>

              </button>

            )
          )}

        </div>

      </div>

      {/* ====================================== */}
      {/* RIGHT CARD */}
      {/* ====================================== */}

      <div className="simakAttendancePage__inputCard">

        {/* ====================================== */}
        {/* HEADER */}
        {/* ====================================== */}

        <div className="simakAttendancePage__cardHeader simakAttendancePage__cardHeader--between">

          <div>

            <div className="simakAttendancePage__cardTitle">
              Input Absensi Periode
            </div>

            <div className="simakAttendancePage__cardSubtitle">

              {selectedEmployee?.nama ||
                "-"}

            </div>

          </div>

          <div className="simakAttendancePage__monthPicker">

            <button
              className="simakAttendancePage__monthBtn"
              onClick={
                handlePrevMonth
              }
            >
              <ChevronLeft size={18} />
            </button>

            <div className="simakAttendancePage__monthInfo">

              <CalendarDays size={16} />

              <div>

                <div className="simakAttendancePage__monthName">

                  {
                    bulanList[
                      currentDate.getMonth()
                    ]
                  }

                </div>

                <div className="simakAttendancePage__yearName">

                  {
                    currentDate.getFullYear()
                  }

                </div>

              </div>

            </div>

            <button
              className="simakAttendancePage__monthBtn"
              onClick={
                handleNextMonth
              }
            >
              <ChevronRight size={18} />
            </button>

          </div>

        </div>

        {/* ====================================== */}
        {/* TABLE */}
        {/* ====================================== */}

        <div className="simakAttendancePage__tableWrapper">

          <table className="simakAttendancePage__table">

            <thead>

              <tr>

                <th>
                  Tanggal
                </th>

                <th>
                  Status
                </th>

                <th>
                  Shift
                </th>

                <th>
                  Masuk
                </th>

                <th>
                  Keluar
                </th>

                <th>
                  Lembur
                </th>

                <th>
                  Konversi
                </th>

                <th>
                  BKO
                </th>

                <th>
                  Keterangan
                </th>

              </tr>

            </thead>

            <tbody>

              {tanggalList.map(
                (
                  item,
                  index
                ) => {
                  const data =
                    attendanceDetail?.[
                      item.tanggal
                    ] || {};

                  return (

                    <tr
                      key={index}
                    >

                      <td>

                        <div className="simakAttendancePage__dateCell">

                          <div className="simakAttendancePage__dateNumber">

                            {
                              item.tanggal
                            }

                          </div>

                          <div className="simakAttendancePage__dateDay">

                            {
                              item.hari
                            }

                          </div>

                        </div>

                      </td>

                      <td>

                        <select
                          value={
                            data.kehadiran ||
                            "H"
                          }
                          onChange={(
                            e
                          ) =>
                            handleAttendanceChange(
                              item.tanggal,
                              "kehadiran",
                              e.target
                                .value
                            )
                          }
                          className="simakAttendancePage__input"
                        >

                          {STATUS_OPTIONS.map(
                            (
                              status
                            ) => (

                              <option
                                key={
                                  status
                                }
                                value={
                                  status
                                }
                              >
                                {
                                  status
                                }
                              </option>

                            )
                          )}

                        </select>

                      </td>

                      <td>

                        <select
                          value={
                            data.shift ||
                            "P"
                          }
                          onChange={(
                            e
                          ) =>
                            handleAttendanceChange(
                              item.tanggal,
                              "shift",
                              e.target
                                .value
                            )
                          }
                          className="simakAttendancePage__input"
                        >

                          {SHIFT_OPTIONS.map(
                            (
                              shift
                            ) => (

                              <option
                                key={
                                  shift
                                }
                                value={
                                  shift
                                }
                              >
                                {
                                  shift
                                }
                              </option>

                            )
                          )}

                        </select>

                      </td>

                      <td>

                        <input
                          type="time"
                          value={
                            data.jamMasuk ||
                            ""
                          }
                          onChange={(
                            e
                          ) =>
                            handleAttendanceChange(
                              item.tanggal,
                              "jamMasuk",
                              e.target
                                .value
                            )
                          }
                          className="simakAttendancePage__input"
                        />

                      </td>

                      <td>

                        <input
                          type="time"
                          value={
                            data.jamKeluar ||
                            ""
                          }
                          onChange={(
                            e
                          ) =>
                            handleAttendanceChange(
                              item.tanggal,
                              "jamKeluar",
                              e.target
                                .value
                            )
                          }
                          className="simakAttendancePage__input"
                        />

                      </td>

                      <td>

                        <input
                          type="number"
                          placeholder="0"
                          value={
                            data.jamLembur ||
                            ""
                          }
                          onChange={(
                            e
                          ) =>
                            handleAttendanceChange(
                              item.tanggal,
                              "jamLembur",
                              e.target
                                .value
                            )
                          }
                          className="simakAttendancePage__input"
                        />

                      </td>

                      <td>

                        <div className="simakAttendancePage__badge">

                          <Clock3 size={14} />

                          {data.konversi ||
                            0}

                        </div>

                      </td>

                      <td>

                        <input
                          type="text"
                          list={`bko-${index}`}
                          value={
                            data.anggotaBKO ||
                            ""
                          }
                          onChange={(
                            e
                          ) =>
                            handleAttendanceChange(
                              item.tanggal,
                              "anggotaBKO",
                              e.target
                                .value
                            )
                          }
                          placeholder="Cari anggota"
                          className="simakAttendancePage__input"
                        />

                        <datalist
                          id={`bko-${index}`}
                        >

                          {attendanceList.map(
                            (
                              employee
                            ) => (

                              <option
                                key={
                                  employee.id
                                }
                                value={
                                  employee.nama
                                }
                              />

                            )
                          )}

                        </datalist>

                      </td>

                      <td>

                        <input
                          type="text"
                          placeholder="Keterangan"
                          value={
                            data.keterangan ||
                            ""
                          }
                          onChange={(
                            e
                          ) =>
                            handleAttendanceChange(
                              item.tanggal,
                              "keterangan",
                              e.target
                                .value
                            )
                          }
                          className="simakAttendancePage__input"
                        />

                      </td>

                    </tr>

                  );
                }
              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}