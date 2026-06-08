"use client";

import {
  StatusFilter,
} from "../page";

export default function EmployeeListCard({
  loading,
  error,
  form,
  paginatedKaryawan,
  totalData,
  startIndex,
  endIndex,
  rowsPerPage,
  setRowsPerPage,
  currentPage,
  setCurrentPage,
  totalPages,
  searchText,
  setSearchText,
  statusFilter,
  setStatusFilter,
  filterPenempatan,
  setFilterPenempatan,
  penempatanOptions,
  employeeStatusMap,
  toggleEmployeeStatus,
  selectKaryawan,
}: any) {
  return (
    <div className="simakEmployeePage__listPanel">

      {/* HEADER */}

      <div className="simakEmployeePage__listHeader">

        <div>
          <h3>
            Daftar Karyawan
          </h3>

          <p className="simakEmployeePage__listSubtitle">
            Management data
            karyawan aktif dan
            nonaktif
          </p>
        </div>

        <button
          className="simakEmployeePage__btnAdd"
        >
          + Tambah
        </button>

      </div>

      {/* TOOLBAR */}

      <div className="simakEmployeePage__toolbar">

        <input
          className="simakEmployeePage__search"
          placeholder="Cari nama karyawan..."
          value={searchText}
          onChange={(e) =>
            setSearchText(
              e.target.value
            )
          }
        />

        <select
          className="simakEmployeePage__toolbarSelect"
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(
              e.target
                .value as StatusFilter
            )
          }
        >
          <option value="Aktif">
            Status: Aktif
          </option>

          <option value="Nonaktif">
            Status: Nonaktif
          </option>

          <option value="Semua">
            Semua Status
          </option>
        </select>

        <select
          className="simakEmployeePage__toolbarSelect"
          value={
            filterPenempatan
          }
          onChange={(e) =>
            setFilterPenempatan(
              e.target.value
            )
          }
        >
          <option value="">
            Semua Penempatan
          </option>

          {penempatanOptions.map(
            (p: string) => (
              <option
                key={p}
                value={p}
              >
                {p}
              </option>
            )
          )}
        </select>

      </div>

      {/* INFO BAR */}

      <div className="simakEmployeePage__infoBar">

        <div className="simakEmployeePage__recordInfo">

          Menampilkan{" "}

          <strong>
            {totalData === 0
              ? 0
              : startIndex + 1}
          </strong>

          {" - "}

          <strong>
            {Math.min(
              endIndex,
              totalData
            )}
          </strong>

          {" dari "}

          <strong>
            {totalData}
          </strong>

          {" data"}

        </div>

        <div className="simakEmployeePage__recordSelector">

          <span>
            Tampilkan
          </span>

          <select
            value={rowsPerPage}
            onChange={(e) =>
              setRowsPerPage(
                Number(
                  e.target.value
                )
              )
            }
          >
            <option value={10}>
              10
            </option>

            <option value={25}>
              25
            </option>

            <option value={50}>
              50
            </option>

            <option value={100}>
              100
            </option>
          </select>

          <span>
            baris
          </span>

        </div>
      </div>

      {/* LOADING */}

      {loading && (
        <p>
          Loading data...
        </p>
      )}

      {/* ERROR */}

      {error && (
        <p
          style={{
            color: "red",
          }}
        >
          {error}
        </p>
      )}

      {/* TABLE */}

      <div className="simakEmployeePage__tableWrapper">

        <table className="simakEmployeePage__table">

          <thead>
            <tr>
              <th>Nama</th>
              <th>Jabatan</th>
              <th>Penempatan</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>

            {paginatedKaryawan.length ===
            0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="simakEmployeePage__empty"
                >
                  Tidak ada data
                  karyawan ditemukan
                </td>
              </tr>
            ) : (
              paginatedKaryawan.map(
                (k: any) => {
                  const currentStatus =
                    employeeStatusMap[
                      k.id_karyawan
                    ] ||
                    "Aktif";

                  const isActive =
                    currentStatus ===
                    "Aktif";

                  return (
                    <tr
                      key={
                        k.id_karyawan
                      }
                      className={`simakEmployeePage__row ${
                        form.id_karyawan ===
                        k.id_karyawan
                          ? "simakEmployeePage__row--active"
                          : ""
                      }`}
                      onClick={() =>
                        selectKaryawan(
                          k
                        )
                      }
                    >
                      <td>
                        {k.nama}
                      </td>

                      <td>
                        {k.jabatan ||
                          "-"}
                      </td>

                      <td>
                        {k.penempatan_nama ||
                          "-"}
                      </td>

                      <td>

						<button
						  type="button"
						  className={`simakEmployeePage__inlineStatusSwitch ${
							isActive
							  ? "simakEmployeePage__inlineStatusSwitch--active"
							  : "simakEmployeePage__inlineStatusSwitch--inactive"
						  }`}
						  onClick={(e) => {
							e.stopPropagation();

							toggleEmployeeStatus(
							  k.id_karyawan
							);
						  }}
						>

						  <span className="simakEmployeePage__inlineStatusLabel simakEmployeePage__inlineStatusLabel--left">
							Nonaktif
						  </span>

						  <span className="simakEmployeePage__inlineStatusLabel simakEmployeePage__inlineStatusLabel--right">
							Aktif
						  </span>

						  <span className="simakEmployeePage__inlineStatusThumb" />

						</button>

                      </td>
                    </tr>
                  );
                }
              )
            )}

          </tbody>
        </table>
      </div>

      {/* PAGINATION */}

      {totalPages > 1 && (
        <div className="simakEmployeePage__pagination">

          <button
            className="simakEmployeePage__paginationButton"
            disabled={
              currentPage === 1
            }
            onClick={() =>
              setCurrentPage(
                (prev: number) =>
                  prev - 1
              )
            }
          >
            Sebelumnya
          </button>

          <div className="simakEmployeePage__paginationInfo">
            Halaman{" "}
            {currentPage} dari{" "}
            {totalPages}
          </div>

          <button
            className="simakEmployeePage__paginationButton"
            disabled={
              currentPage ===
              totalPages
            }
            onClick={() =>
              setCurrentPage(
                (prev: number) =>
                  prev + 1
              )
            }
          >
            Berikutnya
          </button>

        </div>
      )}

    </div>
  );
}