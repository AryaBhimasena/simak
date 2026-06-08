// app/absensi/rekap-absen.tsx

"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Building2,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  FileDown,
  Pencil,
  Search,
  Users,
} from "lucide-react";

import "@/style/pages/absensi/rekap-absen.css";

export default function RekapAbsen() {

  /* ====================================== */
  /* STATE */
  /* ====================================== */

  const [periode, setPeriode] =
    useState("");

  const [searchText, setSearchText] =
    useState("");

  const [attendanceList, setAttendanceList] =
    useState<any[]>([]);

  /* ====================================== */
  /* LOAD DUMMY */
  /* ====================================== */

  useEffect(() => {

    const today =
      new Date();

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
        jabatan: "Security",
        penempatan:
          "PT. Porto Indonesia Sejahtera",
        statusAktif: true,

        hadir: 22,
        izin: 1,
        sakit: 0,
        alpha: 0,
        cuti: 1,
        off: 3,

        totalLembur: 18,
      },

      {
        id: "EMP002",
        nik: "TK002",
        nama: "Rizky Ramadhan",
        jabatan: "Driver",
        penempatan:
          "PT. Porto Indonesia Sejahtera",
        statusAktif: true,

        hadir: 21,
        izin: 0,
        sakit: 1,
        alpha: 0,
        cuti: 2,
        off: 2,

        totalLembur: 12,
      },

      {
        id: "EMP003",
        nik: "TK003",
        nama: "Dimas Saputra",
        jabatan: "Operator",
        penempatan:
          "PT. Puninar Logistics",
        statusAktif: true,

        hadir: 24,
        izin: 0,
        sakit: 0,
        alpha: 0,
        cuti: 0,
        off: 2,

        totalLembur: 20,
      },

      {
        id: "EMP004",
        nik: "TK004",
        nama: "Bagus Pratama",
        jabatan: "Helper",
        penempatan:
          "PT. Puninar Logistics",
        statusAktif: false,

        hadir: 0,
        izin: 0,
        sakit: 0,
        alpha: 0,
        cuti: 0,
        off: 0,

        totalLembur: 0,
      },
    ];

    setAttendanceList(
      dummyEmployees
    );

  }, []);

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
  /* FILTER */
  /* ====================================== */

  const filteredEmployees =
    useMemo(() => {

      return attendanceList.filter(
        (item) =>
          item.statusAktif &&
          (
            item.nama
              ?.toLowerCase()
              .includes(
                searchText.toLowerCase()
              ) ||

            item.nik
              ?.toLowerCase()
              .includes(
                searchText.toLowerCase()
              ) ||

            item.penempatan
              ?.toLowerCase()
              .includes(
                searchText.toLowerCase()
              )
          )
      );

    }, [
      attendanceList,
      searchText,
    ]);

  /* ====================================== */
  /* SUMMARY */
  /* ====================================== */

  const summary =
    useMemo(() => {

      return filteredEmployees.reduce(
        (
          acc,
          item
        ) => {

          acc.totalKaryawan += 1;

          acc.totalHadir +=
            item.hadir;

          acc.totalLembur +=
            item.totalLembur;

          return acc;

        },
        {
          totalKaryawan: 0,
          totalHadir: 0,
          totalLembur: 0,
        }
      );

    }, [filteredEmployees]);

  return (
    <div className="simakRekapAbsen">

      {/* ====================================== */}
      {/* SUMMARY */}
      {/* ====================================== */}

      <section className="simakRekapAbsen__summaryGrid">

        <div className="simakRekapAbsen__summaryCard">

          <div className="simakRekapAbsen__summaryIcon">

            <Users size={20} />

          </div>

          <div>

            <div className="simakRekapAbsen__summaryLabel">
              Total Karyawan
            </div>

            <div className="simakRekapAbsen__summaryValue">
              {
                summary.totalKaryawan
              }
            </div>

          </div>

        </div>

        <div className="simakRekapAbsen__summaryCard">

          <div className="simakRekapAbsen__summaryIcon">

            <CalendarDays size={20} />

          </div>

          <div>

            <div className="simakRekapAbsen__summaryLabel">
              Total Hadir
            </div>

            <div className="simakRekapAbsen__summaryValue">
              {
                summary.totalHadir
              }
            </div>

          </div>

        </div>

        <div className="simakRekapAbsen__summaryCard">

          <div className="simakRekapAbsen__summaryIcon">

            <Clock3 size={20} />

          </div>

          <div>

            <div className="simakRekapAbsen__summaryLabel">
              Total Lembur
            </div>

            <div className="simakRekapAbsen__summaryValue">
              {
                summary.totalLembur
              } Jam
            </div>

          </div>

        </div>

      </section>

      {/* ====================================== */}
      {/* FILTER */}
      {/* ====================================== */}

      <section className="simakRekapAbsen__filterBar">

        <div className="simakRekapAbsen__search">

          <Search size={18} />

          <input
            type="text"
            placeholder="Cari nama, NIK, atau penempatan..."
            value={searchText}
            onChange={(event) =>
              setSearchText(
                event.target.value
              )
            }
          />

        </div>

        <div className="simakRekapAbsen__periodControl">

          <button
            onClick={
              handlePrevMonth
            }
            className="simakRekapAbsen__periodBtn"
          >

            <ChevronLeft size={18} />

          </button>

          <div className="simakRekapAbsen__periodLabel">

            <CalendarDays size={18} />

            {
              bulanList[
                currentDate.getMonth()
              ]
            }{" "}

            {
              currentDate.getFullYear()
            }

          </div>

          <button
            onClick={
              handleNextMonth
            }
            className="simakRekapAbsen__periodBtn"
          >

            <ChevronRight size={18} />

          </button>

        </div>

      </section>

      {/* ====================================== */}
      {/* TABLE */}
      {/* ====================================== */}

      <section className="simakRekapAbsen__panel">

        <div className="simakRekapAbsen__tableWrapper">

          <table className="simakRekapAbsen__table">

            <thead>

              <tr>

                <th>
                  Karyawan
                </th>

                <th>
                  Penempatan
                </th>

                <th>
                  H
                </th>

                <th>
                  I
                </th>

                <th>
                  S
                </th>

                <th>
                  A
                </th>

                <th>
                  CT
                </th>

                <th>
                  OFF
                </th>

                <th>
                  Lembur
                </th>

                <th>
                  Aksi
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredEmployees.map(
                (item) => (

                  <tr
                    key={item.id}
                  >

                    <td>

                      <div className="simakRekapAbsen__employee">

                        <div className="simakRekapAbsen__employeeAvatar">

                          {
                            item.nama.charAt(
                              0
                            )
                          }

                        </div>

                        <div>

                          <div className="simakRekapAbsen__employeeName">

                            {
                              item.nama
                            }

                          </div>

                          <div className="simakRekapAbsen__employeeSub">

                            {
                              item.nik
                            }{" "}
                            •{" "}
                            {
                              item.jabatan
                            }

                          </div>

                        </div>

                      </div>

                    </td>

                    <td>

                      <div className="simakRekapAbsen__location">

                        <Building2 size={15} />

                        <span>
                          {
                            item.penempatan
                          }
                        </span>

                      </div>

                    </td>

                    <td>
                      {
                        item.hadir
                      }
                    </td>

                    <td>
                      {
                        item.izin
                      }
                    </td>

                    <td>
                      {
                        item.sakit
                      }
                    </td>

                    <td>
                      {
                        item.alpha
                      }
                    </td>

                    <td>
                      {
                        item.cuti
                      }
                    </td>

                    <td>
                      {
                        item.off
                      }
                    </td>

                    <td>

                      <div className="simakRekapAbsen__badge">

                        {
                          item.totalLembur
                        }{" "}
                        Jam

                      </div>

                    </td>

                    <td>

                      <div className="simakRekapAbsen__actions">

                        <button className="simakRekapAbsen__actionBtn">

                          <Pencil size={16} />

                        </button>

                        <button className="simakRekapAbsen__actionBtn simakRekapAbsen__actionBtn--export">

                          <FileDown size={16} />

                        </button>

                      </div>

                    </td>

                  </tr>

                )
              )}

              {filteredEmployees.length ===
                0 && (

                <tr>

                  <td
                    colSpan={10}
                    className="simakRekapAbsen__empty"
                  >

                    Data absensi tidak ditemukan.

                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

      </section>

    </div>
  );
}