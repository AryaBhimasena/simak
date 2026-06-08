// app/absensi/page.tsx

"use client";

import { useEffect, useMemo, useState } from "react";

import {
  ChevronLeft,
  ChevronRight,
  ClipboardPen,
  Pencil,
  Trash2,
} from "lucide-react";

import AppHeader from "@/components/AppHeader";
import Navbar from "@/components/Navbar";

import AttendanceModal from "./components/AttendanceModal";

import "@/style/pages/halaman-absensi.css";

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

const ROWS_PER_PAGE = 10;

export default function AttendancePage() {
  /* ====================================== */
  /* STATE */
  /* ====================================== */

  const [employees, setEmployees] = useState<
    EmployeeType[]
  >([]);

  const [search, setSearch] =
    useState("");

  const [
    locationFilter,
    setLocationFilter,
  ] = useState("all");

  const [selectedMonth, setSelectedMonth] =
    useState("");

  const [currentPage, setCurrentPage] =
    useState(1);

  const [showModal, setShowModal] =
    useState(false);

  const [modalMode, setModalMode] =
    useState<"add" | "edit">(
      "add"
    );

  const [
    selectedEmployee,
    setSelectedEmployee,
  ] = useState<EmployeeType | null>(
    null
  );

  /* ====================================== */
  /* LOAD DATA */
  /* ====================================== */

  useEffect(() => {
    const today = new Date();

    setSelectedMonth(
      `${today.getFullYear()}-${String(
        today.getMonth() + 1
      ).padStart(2, "0")}`
    );

    const dummyData: EmployeeType[] =
      [];

    for (
      let i = 1;
      i <= 35;
      i++
    ) {
      dummyData.push({
        id: `EMP${String(i).padStart(
          3,
          "0"
        )}`,

        nama: `Karyawan ${i}`,

        penempatan:
          i % 2 === 0
            ? "PT. Porto Indonesia Sejahtera"
            : "PT. Puninar Logistics",

        statusAktif:
          i % 7 !== 0,

        hadir:
          20 +
          Math.floor(
            Math.random() * 6
          ),

        izin:
          Math.floor(
            Math.random() * 2
          ),

        sakit:
          Math.floor(
            Math.random() * 2
          ),

        alpha:
          Math.floor(
            Math.random() * 2
          ),

        cuti:
          Math.floor(
            Math.random() * 2
          ),

        rs:
          Math.floor(
            Math.random() * 2
          ),

        off:
          Math.floor(
            Math.random() * 4
          ),

        ln:
          Math.floor(
            Math.random() * 3
          ),

        sm:
          Math.floor(
            Math.random() * 2
          ),

        bkoReg:
          Math.floor(
            Math.random() * 6
          ),

        bkoCt:
          Math.floor(
            Math.random() * 2
          ),

        bkoRs:
          Math.floor(
            Math.random() * 2
          ),

        totalLembur:
          Math.floor(
            Math.random() * 30
          ),
      });
    }

    setEmployees(dummyData);
  }, []);

  /* ====================================== */
  /* INSIGHT */
  /* ====================================== */

  const activeCount =
    employees.filter(
      (item) =>
        item.statusAktif
    ).length;

  const resignCount =
    employees.filter(
      (item) =>
        !item.statusAktif
    ).length;

  /* ====================================== */
  /* FILTER */
  /* ====================================== */

  const locations =
    useMemo(() => {
      return [
        ...new Set(
          employees.map(
            (item) =>
              item.penempatan
          )
        ),
      ];
    }, [employees]);

  const filteredData =
    useMemo(() => {
      return employees.filter(
        (item) => {
          const matchSearch =
            item.nama
              .toLowerCase()
              .includes(
                search.toLowerCase()
              );

          const matchLocation =
            locationFilter ===
            "all"
              ? true
              : item.penempatan ===
                locationFilter;

          return (
            matchSearch &&
            matchLocation
          );
        }
      );
    }, [
      employees,
      search,
      locationFilter,
    ]);

  /* ====================================== */
  /* PAGINATION */
  /* ====================================== */

  const totalPages =
    Math.ceil(
      filteredData.length /
        ROWS_PER_PAGE
    ) || 1;

  const paginatedData =
    useMemo(() => {
      const start =
        (currentPage - 1) *
        ROWS_PER_PAGE;

      return filteredData.slice(
        start,
        start + ROWS_PER_PAGE
      );
    }, [
      filteredData,
      currentPage,
    ]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, locationFilter]);

  /* ====================================== */
  /* ACTION */
  /* ====================================== */

  const handleAddAttendance = (
    employee: EmployeeType
  ) => {
    setSelectedEmployee(
      employee
    );

    setModalMode("add");

    setShowModal(true);
  };

  const handleEditAttendance = (
    employee: EmployeeType
  ) => {
    setSelectedEmployee(
      employee
    );

    setModalMode("edit");

    setShowModal(true);
  };

  const handleDeleteAttendance = (
    employee: EmployeeType
  ) => {
    const confirmed =
      window.confirm(
        `Hapus data absensi ${employee.nama}?`
      );

    if (!confirmed) return;

    console.log(
      "delete attendance",
      employee
    );
  };

const monthLabel = new Date(
  `${selectedMonth}-01`
).toLocaleDateString("id-ID", {
  month: "long",
  year: "numeric",
});

const changeMonth = (
  direction: "prev" | "next"
) => {
  const current = new Date(
    `${selectedMonth}-01`
  );

  if (direction === "prev") {
    current.setMonth(
      current.getMonth() - 1
    );
  } else {
    current.setMonth(
      current.getMonth() + 1
    );
  }

  setSelectedMonth(
    `${current.getFullYear()}-${String(
      current.getMonth() + 1
    ).padStart(2, "0")}`
  );
};

  return (
    <div className="simakAttendancePage__wrapper">
      <div className="simakAttendancePage__main">
        <AppHeader title="Management Absensi" />

        <Navbar />

        <div className="simakAttendancePage__content">

          {/* ====================================== */}
          {/* HERO */}
          {/* ====================================== */}

          <section className="simakAttendancePage__hero">

            <div>
              <div className="simakAttendancePage__eyebrow">
                Dashboard Absensi
              </div>

              <h1 className="simakAttendancePage__title">
                Rekap Kehadiran
                Karyawan
              </h1>

              <p className="simakAttendancePage__subtitle">
                Monitoring
                kehadiran,
                backup dan
                lembur
                karyawan
                berdasarkan
                periode
                absensi.
              </p>
            </div>

            <div className="simakAttendancePage__insight">

              <div className="simakAttendancePage__insightCard">
                <span>
                  Karyawan
                  Aktif
                </span>

                <strong>
                  {activeCount}
                </strong>
              </div>

              <div className="simakAttendancePage__insightCard">
                <span>
                  Karyawan
                  Resign
                </span>

                <strong>
                  {resignCount}
                </strong>
              </div>

            </div>

          </section>

          {/* ====================================== */}
          {/* PANEL */}
          {/* ====================================== */}

          <section className="simakAttendancePage__panel">

            {/* ====================================== */}
            {/* FILTER */}
            {/* ====================================== */}

			<div className="simakAttendancePage__toolbar">

			  <div className="simakAttendancePage__toolbarLeft">

				<input
				  type="text"
				  placeholder="Cari nama karyawan..."
				  value={search}
				  onChange={(e) =>
					setSearch(e.target.value)
				  }
				  className="simakAttendancePage__search"
				/>

				<select
				  value={locationFilter}
				  onChange={(e) =>
					setLocationFilter(
					  e.target.value
					)
				  }
				  className="simakAttendancePage__filter"
				>
				  <option value="all">
					Semua Lokasi
				  </option>

				  {locations.map(
					(location) => (
					  <option
						key={location}
						value={location}
					  >
						{location}
					  </option>
					)
				  )}
				</select>

			  </div>

			  <div className="simakAttendancePage__toolbarRight">

				<div className="simakAttendancePage__monthSelector">

				  <button
					className="simakAttendancePage__pageBtn"
					onClick={() =>
					  changeMonth("prev")
					}
				  >
					<ChevronLeft size={18} />
				  </button>

				  <div className="simakAttendancePage__monthInfo">
					{monthLabel}
				  </div>

				  <button
					className="simakAttendancePage__pageBtn"
					onClick={() =>
					  changeMonth("next")
					}
				  >
					<ChevronRight size={18} />
				  </button>

				</div>

				<div className="simakAttendancePage__paginationBlock">

				  <div className="simakAttendancePage__pagination">

					<button
					  className="simakAttendancePage__pageBtn"
					  disabled={
						currentPage === 1
					  }
					  onClick={() =>
						setCurrentPage(
						  (prev) =>
							Math.max(
							  1,
							  prev - 1
							)
						)
					  }
					>
					  <ChevronLeft size={18} />
					</button>

					<div className="simakAttendancePage__pageInfo">
					  {currentPage} / {totalPages}
					</div>

					<button
					  className="simakAttendancePage__pageBtn"
					  disabled={
						currentPage ===
						totalPages
					  }
					  onClick={() =>
						setCurrentPage(
						  (prev) =>
							Math.min(
							  totalPages,
							  prev + 1
							)
						)
					  }
					>
					  <ChevronRight size={18} />
					</button>

				  </div>

				  <div className="simakAttendancePage__result">
					Menampilkan{" "}
					<strong>
					  {paginatedData.length}
					</strong>{" "}
					dari{" "}
					<strong>
					  {filteredData.length}
					</strong>{" "}
					karyawan
				  </div>

				</div>

			  </div>

			</div>

            {/* ====================================== */}
            {/* TABLE */}
            {/* ====================================== */}

            <div className="simakAttendancePage__tableWrapper">

              <table className="simakAttendancePage__table">

                <thead>

                  <tr>

                    <th rowSpan={2}>
                      Nama
                      Karyawan
                    </th>

                    <th rowSpan={2}>
                      Lokasi
                      Penempatan
                    </th>

                    <th
                      colSpan={9}
                    >
                      Rekap
                      Kehadiran
                    </th>

                    <th
                      colSpan={3}
                    >
                      Rekap
                      Backup
                    </th>

                    <th rowSpan={2}>
                      Lembur
                    </th>
					
                    <th rowSpan={2}>
                      Aksi
                    </th>

                  </tr>

                  <tr>

                    <th>H</th>
                    <th>I</th>
                    <th>S</th>
                    <th>A</th>
                    <th>CT</th>
                    <th>RS</th>
                    <th>OFF</th>
                    <th>LN</th>
                    <th>SM</th>

                    <th>
                      BKO
                      REG
                    </th>

                    <th>
                      BKO
                      CT
                    </th>

                    <th>
                      BKO
                      RS
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {paginatedData.map(
                    (
                      employee
                    ) => (
                      <tr
                        key={
                          employee.id
                        }
                      >

                        <td>
                          <div className="simakAttendancePage__employeeName">
                            {
                              employee.nama
                            }
                          </div>
                        </td>

                        <td>
                          {
                            employee.penempatan
                          }
                        </td>

                        <td>
                          {
                            employee.hadir
                          }
                        </td>

                        <td>
                          {
                            employee.izin
                          }
                        </td>

                        <td>
                          {
                            employee.sakit
                          }
                        </td>

                        <td>
                          {
                            employee.alpha
                          }
                        </td>

                        <td>
                          {
                            employee.cuti
                          }
                        </td>

                        <td>
                          {
                            employee.rs
                          }
                        </td>

                        <td>
                          {
                            employee.off
                          }
                        </td>

                        <td>
                          {
                            employee.ln
                          }
                        </td>

                        <td>
                          {
                            employee.sm
                          }
                        </td>

                        <td>
                          {
                            employee.bkoReg
                          }
                        </td>

                        <td>
                          {
                            employee.bkoCt
                          }
                        </td>

                        <td>
                          {
                            employee.bkoRs
                          }
                        </td>

                        <td>
                          {
                            employee.totalLembur
                          }
                          h
                        </td>

						<td>

						  <div className="simakAttendancePage__actions">

							<button
							  className="simakAttendancePage__actionBtn"
							  onClick={() =>
								handleAddAttendance(
								  employee
								)
							  }
							>
							  <ClipboardPen size={15} />
							</button>

							<button
							  className="simakAttendancePage__actionBtn"
							  onClick={() =>
								handleEditAttendance(
								  employee
								)
							  }
							>
							  <Pencil size={15} />
							</button>

							<button
							  className="simakAttendancePage__actionBtn simakAttendancePage__actionBtn--danger"
							  onClick={() =>
								handleDeleteAttendance(
								  employee
								)
							  }
							>
							  <Trash2 size={15} />
							</button>

						  </div>

						</td>
                      </tr>
                    )
                  )}

                </tbody>

              </table>

            </div>

          </section>

        </div>
      </div>

      <AttendanceModal
        open={showModal}
        mode={modalMode}
        employee={
          selectedEmployee
        }
        onClose={() =>
          setShowModal(false)
        }
      />

    </div>
  );
}