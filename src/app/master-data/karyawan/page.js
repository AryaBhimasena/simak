"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Pencil,
  Trash2,
} from "lucide-react";

import {
  useUser,
} from "@/contexts/userContext";

import {
  getKaryawan,
  getMasterKaryawan,
  deleteKaryawan,
} from "@/lib/karyawan";

import KaryawanModal from "@/components/modal-karyawan";

import "@/styles/pages/karyawan.css";


/* =========================================================
   PAGE
========================================================= */

export default function KaryawanPage() {

  /* =======================================================
     USER / AUTHENTICATION
  ======================================================= */

  const {
    userId,
    sessionId,
    authenticated,
    isInitializing,
  } = useUser();


  /* =======================================================
     DATA
  ======================================================= */

  const [
    karyawan,
    setKaryawan,
  ] = useState([]);


  const [
    kategori,
    setKategori,
  ] = useState([]);


  const [
    jabatan,
    setJabatan,
  ] = useState([]);


  /* =======================================================
     UI STATE
  ======================================================= */

  const [
    loading,
    setLoading,
  ] = useState(false);


  const [
    deleting,
    setDeleting,
  ] = useState(false);


  const [
    error,
    setError,
  ] = useState("");


  const [
    search,
    setSearch,
  ] = useState("");


  const [
    penempatanFilter,
    setPenempatanFilter,
  ] = useState("ALL");


  const [
    kategoriFilter,
    setKategoriFilter,
  ] = useState("ALL");


  const [
    statusFilter,
    setStatusFilter,
  ] = useState("ALL");


  const [
    modalOpen,
    setModalOpen,
  ] = useState(false);


  const [
    modalMode,
    setModalMode,
  ] = useState("create");


const [
  selectedEmployee,
  setSelectedEmployee,
] = useState(null);


  const [
    successMessage,
    setSuccessMessage,
  ] = useState("");


  /* =======================================================
     LOAD INITIAL DATA
  ======================================================= */

  useEffect(() => {

    if (
      isInitializing
    ) {

      return;

    }


    if (
      !authenticated ||
      !userId ||
      !sessionId
    ) {

      return;

    }


    let cancelled =
      false;


    async function loadInitialData() {

      setLoading(
        true
      );

      setError(
        ""
      );


      try {

        /* =============================================
           GET KARYAWAN
        ============================================= */

        const karyawanResult =
          await getKaryawan(
            userId,
            sessionId
          );


        /* =============================================
           GET MASTER
        ============================================= */

        let masterResult = {

          success:
            true,

          kategori:
            [],

          jabatan:
            [],

        };


        try {

          masterResult =
            await getMasterKaryawan(
              userId,
              sessionId
            );

        } catch (
          masterError
        ) {

          console.error(
            "Gagal mengambil master karyawan:",
            masterError
          );

        }


        if (
          cancelled
        ) {

          return;

        }


        /* =============================================
           KARYAWAN
        ============================================= */

        const employeeData =
          Array.isArray(
            karyawanResult?.data
          )
            ? karyawanResult.data
            : [];


        setKaryawan(
          employeeData
        );


        /* =============================================
           KATEGORI
        ============================================= */

        const kategoriData =
          Array.isArray(
            masterResult?.kategori
          )
            ? masterResult.kategori
            : [];


        setKategori(
          kategoriData
        );


        /* =============================================
           JABATAN
        ============================================= */

        const jabatanData =
          Array.isArray(
            masterResult?.jabatan
          )
            ? masterResult.jabatan
            : [];


        setJabatan(
          jabatanData
        );


      } catch (
        err
      ) {

        if (
          cancelled
        ) {

          return;

        }


        setError(
          err?.message ||
          "Data karyawan gagal dimuat."
        );


        setKaryawan(
          []
        );

      } finally {

        if (
          !cancelled
        ) {

          setLoading(
            false
          );

        }

      }

    }


    loadInitialData();


    return () => {

      cancelled =
        true;

    };

  }, [
    isInitializing,
    authenticated,
    userId,
    sessionId,
  ]);


  /* =======================================================
     PENEMPATAN OPTIONS
     -------------------------------------------------------
     Dibuat dari data karyawan yang tersedia.
     Nilai kosong tidak dimasukkan.
  ======================================================= */

  const penempatanOptions =
    useMemo(() => {

      const values =
        karyawan
          .map(
            item =>
              String(
                item.penempatan ||
                ""
              ).trim()
          )
          .filter(
            Boolean
          );


      return Array.from(
        new Set(
          values
        )
      ).sort(
        (a, b) =>
          a.localeCompare(
            b,
            "id-ID"
          )
      );

    }, [
      karyawan,
    ]);


  /* =======================================================
     KATEGORI OPTIONS
  ======================================================= */

  const kategoriOptions =
    useMemo(() => {

      return kategori
        .filter(
          item =>
            item &&
            (
              item.id !== undefined &&
              item.id !== null
            )
        )
        .sort(
          (a, b) =>
            String(
              a.nama ||
              ""
            ).localeCompare(
              String(
                b.nama ||
                ""
              ),
              "id-ID"
            )
        );

    }, [
      kategori,
    ]);


  /* =======================================================
     FILTER
  ======================================================= */

  const filteredKaryawan =
    useMemo(() => {

      const keyword =
        search
          .trim()
          .toLowerCase();


      return karyawan.filter(
        item => {

          /* ===========================================
             SEARCH
          =========================================== */

          const matchesSearch =
            !keyword ||
            String(
              item.id_karyawan || ""
            )
              .toLowerCase()
              .includes(
                keyword
              ) ||

            String(
              item.nik || ""
            )
              .toLowerCase()
              .includes(
                keyword
              ) ||

            String(
              item.nama_karyawan || ""
            )
              .toLowerCase()
              .includes(
                keyword
              ) ||

            String(
              item.npp || ""
            )
              .toLowerCase()
              .includes(
                keyword
              ) ||

            String(
              item.penempatan || ""
            )
              .toLowerCase()
              .includes(
                keyword
              );


          /* ===========================================
             PENEMPATAN
          =========================================== */

          const penempatan =
            String(
              item.penempatan ||
              ""
            ).trim();


          const matchesPenempatan =
            penempatanFilter === "ALL" ||
            penempatan ===
              penempatanFilter;


          /* ===========================================
             KATEGORI
          =========================================== */

          const kategoriId =
            String(
              item.kategori_tk ??
              ""
            ).trim();


          const matchesKategori =
            kategoriFilter === "ALL" ||
            kategoriId ===
              String(
                kategoriFilter
              );


          /* ===========================================
             STATUS
          =========================================== */

          const status =
            String(
              item.status_aktif ||
              ""
            )
              .trim()
              .toUpperCase();


          const matchesStatus =
            statusFilter === "ALL" ||
            status ===
              statusFilter;


          return (
            matchesSearch &&
            matchesPenempatan &&
            matchesKategori &&
            matchesStatus
          );

        }
      );

    }, [
      karyawan,
      search,
      penempatanFilter,
      kategoriFilter,
      statusFilter,
    ]);


  /* =======================================================
     OPEN CREATE
  ======================================================= */

function openCreate() {

  setError(
    ""
  );

  setSuccessMessage(
    ""
  );

  setSelectedEmployee(
    null
  );

  setModalMode(
    "create"
  );

  setModalOpen(
    true
  );

}

  /* =======================================================
     OPEN EDIT
  ======================================================= */

function openEdit(
  employee
) {

  if (
    !employee ||
    !employee.id_karyawan
  ) {

    return;

  }


  setError(
    ""
  );

  setSuccessMessage(
    ""
  );

  setSelectedEmployee(
    employee
  );

  setModalMode(
    "edit"
  );

  setModalOpen(
    true
  );

}

  /* =======================================================
     CLOSE MODAL
  ======================================================= */

function closeModal() {

  setModalOpen(
    false
  );

  setSelectedEmployee(
    null
  );

}

  /* =======================================================
     HANDLE SAVED
  ======================================================= */

  function handleSaved(
    savedData,
    mode = "create"
  ) {

    if (
      !savedData
    ) {

      return;

    }


    /* =============================================
       CREATE
    ============================================= */

    if (
      mode === "create"
    ) {

      if (
        typeof savedData === "object" &&
        savedData.id_karyawan
      ) {

        setKaryawan(
          prev => {

            const id =
              String(
                savedData.id_karyawan
              );


            const exists =
              prev.some(
                item =>
                  String(
                    item.id_karyawan
                  ) === id
              );


            if (
              exists
            ) {

              return prev.map(
                item =>
                  String(
                    item.id_karyawan
                  ) === id
                    ? {
                        ...item,
                        ...savedData,
                      }
                    : item
              );

            }


            return [
              ...prev,
              savedData,
            ];

          }
        );

      }


      setSuccessMessage(
        savedData.id_karyawan
          ? `Karyawan berhasil ditambahkan dengan ID ${savedData.id_karyawan}.`
          : "Karyawan berhasil ditambahkan."
      );


      closeModal();

      return;

    }


    /* =============================================
       UPDATE
    ============================================= */

    setKaryawan(
      prev =>
        prev.map(
          item =>
            String(
              item.id_karyawan
            ) ===
            String(
              savedData.id_karyawan
            )
              ? {
                  ...item,
                  ...savedData,
                }
              : item
        )
    );


    setSuccessMessage(
      "Data karyawan berhasil diperbarui."
    );


    closeModal();

  }


  /* =======================================================
     DELETE
  ======================================================= */

  async function handleDelete(
    id_karyawan,
    nama_karyawan
  ) {

    const confirmed =
      window.confirm(
        `Hapus karyawan "${nama_karyawan}" (${id_karyawan})?`
      );


    if (
      !confirmed
    ) {

      return;

    }


    setDeleting(
      true
    );

    setError(
      ""
    );

    setSuccessMessage(
      ""
    );


    try {

      const result =
        await deleteKaryawan(
          id_karyawan,
          userId,
          sessionId
        );


      setKaryawan(
        prev =>
          prev.filter(
            item =>
              String(
                item.id_karyawan
              ) !==
              String(
                id_karyawan
              )
          )
      );


      setSuccessMessage(
        result?.message ||
        "Data karyawan berhasil dihapus."
      );


    } catch (
      err
    ) {

      setError(
        err?.message ||
        "Data karyawan gagal dihapus."
      );

    } finally {

      setDeleting(
        false
      );

    }

  }


  /* =======================================================
     FORMAT DATE
  ======================================================= */

  function formatDate(
    value
  ) {

    if (
      !value
    ) {

      return "-";

    }


    const date =
      new Date(
        value
      );


    if (
      Number.isNaN(
        date.getTime()
      )
    ) {

      return String(
        value
      );

    }


    return new Intl.DateTimeFormat(
      "id-ID",
      {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }
    ).format(
      date
    );

  }


  /* =======================================================
     KATEGORI
  ======================================================= */

  function getKategoriName(
    id
  ) {

    const item =
      kategori.find(
        x =>
          String(
            x.id
          ) ===
          String(
            id
          )
      );


    return (
      item?.nama ||
      id ||
      "-"
    );

  }


  /* =======================================================
     JABATAN
  ======================================================= */

  function getJabatanName(
    id
  ) {

    const item =
      jabatan.find(
        x =>
          String(
            x.id
          ) ===
          String(
            id
          )
      );


    return (
      item?.nama ||
      id ||
      "-"
    );

  }


  /* =======================================================
     RENDER
  ======================================================= */

  return (

    <main className="karyawan-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <section className="karyawan-header">

        <div>

          <p className="karyawan-eyebrow">
            MASTER DATA
          </p>

          <h1>
            Karyawan
          </h1>

          <p className="karyawan-description">
            Kelola data pribadi, jabatan,
            penempatan, dan informasi
            administrasi karyawan.
          </p>

        </div>


        <div className="karyawan-header-actions">

          <button
            type="button"
            className="karyawan-primary-button"
            onClick={openCreate}
            disabled={
              loading ||
              isInitializing
            }
          >

            <span className="button-plus">
              +
            </span>

            Tambah Karyawan

          </button>

        </div>

      </section>


      {/* =================================================
          ERROR
      ================================================= */}

      {error && (

        <div className="karyawan-alert karyawan-alert-error">

          <span>
            !
          </span>

          <p>
            {error}
          </p>

          <button
            type="button"
            onClick={() =>
              setError("")
            }
          >
            ×
          </button>

        </div>

      )}


      {/* =================================================
          SUCCESS
      ================================================= */}

      {successMessage && (

        <div className="karyawan-alert karyawan-alert-success">

          <span>
            ✓
          </span>

          <p>
            {successMessage}
          </p>

          <button
            type="button"
            onClick={() =>
              setSuccessMessage("")
            }
          >
            ×
          </button>

        </div>

      )}


      {/* =================================================
          TOOLBAR
          URUTAN:
          SEARCH
          PENEMPATAN
          KATEGORI
          STATUS
          TOTAL
      ================================================= */}

      <section className="karyawan-toolbar">

        {/* ==============================================
            SEARCH
        ============================================== */}

        <div className="karyawan-search">

          <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            aria-hidden="true"
          >

            <circle
              cx="11"
              cy="11"
              r="7"
            />

            <path
              d="m20 20-3.5-3.5"
            />

          </svg>


          <input
            type="text"
            placeholder="Cari nama, NIK, NPP, atau penempatan..."
            value={search}
            onChange={e =>
              setSearch(
                e.target.value
              )
            }
          />

        </div>


        {/* ==============================================
            FILTER PENEMPATAN
        ============================================== */}

        <div className="karyawan-filter">

          <label>
            Penempatan
          </label>


          <select
            value={penempatanFilter}
            onChange={e =>
              setPenempatanFilter(
                e.target.value
              )
            }
          >

            <option value="ALL">
              Semua
            </option>


            {penempatanOptions.map(
              penempatan => (

                <option
                  key={
                    penempatan
                  }
                  value={
                    penempatan
                  }
                >
                  {
                    penempatan
                  }
                </option>

              )
            )}

          </select>

        </div>


        {/* ==============================================
            FILTER KATEGORI
        ============================================== */}

        <div className="karyawan-filter">

          <label>
            Kategori
          </label>


          <select
            value={kategoriFilter}
            onChange={e =>
              setKategoriFilter(
                e.target.value
              )
            }
          >

            <option value="ALL">
              Semua
            </option>


            {kategoriOptions.map(
              item => (

                <option
                  key={
                    item.id
                  }
                  value={
                    item.id
                  }
                >
                  {
                    item.nama ||
                    item.id
                  }
                </option>

              )
            )}

          </select>

        </div>


        {/* ==============================================
            FILTER STATUS
        ============================================== */}

        <div className="karyawan-filter">

          <label>
            Status
          </label>


          <select
            value={statusFilter}
            onChange={e =>
              setStatusFilter(
                e.target.value
              )
            }
          >

            <option value="ALL">
              Semua
            </option>

            <option value="AKTIF">
              Aktif
            </option>

            <option value="NON AKTIF">
              Non Aktif
            </option>

          </select>

        </div>


        {/* ==============================================
            TOTAL
        ============================================== */}

        <div className="karyawan-total">

          <span>
            Total
          </span>

          <strong>
            {
              filteredKaryawan.length
            }
          </strong>

        </div>

      </section>


      {/* =================================================
          TABLE
      ================================================= */}

      <section className="karyawan-card">

        <div className="karyawan-table-wrapper">

          <table className="karyawan-table">

            <thead>

              <tr>

                <th>ID KARYAWAN</th>
                <th>KARYAWAN</th>
                <th>NIK</th>
                <th>KATEGORI</th>
                <th>JABATAN</th>
                <th>PENEMPATAN</th>
                <th>TANGGAL MASUK</th>
                <th>STATUS</th>
                <th>AKSI</th>

              </tr>

            </thead>


            <tbody>

              {loading ? (

                <TableLoading />

              ) : filteredKaryawan.length === 0 ? (

                <EmptyTable
                  hasData={
                    karyawan.length > 0
                  }
                  search={
                    search
                  }
                  penempatanFilter={
                    penempatanFilter
                  }
                  kategoriFilter={
                    kategoriFilter
                  }
                  statusFilter={
                    statusFilter
                  }
                />

              ) : (

                filteredKaryawan.map(
                  item => {

                    const status =
                      String(
                        item.status_aktif ||
                        ""
                      )
                        .trim()
                        .toUpperCase();


                    return (

                      <tr
                        key={
                          item.id_karyawan
                        }
                      >

                        <td>

                          <span className="employee-id">
                            {
                              item.id_karyawan ||
                              "-"
                            }
                          </span>

                        </td>


                        <td>

                          <div className="employee-cell">

                            <div className="employee-avatar">

                              {String(
                                item.nama_karyawan ||
                                "?"
                              )
                                .trim()
                                .charAt(0)
                                .toUpperCase()}

                            </div>


                            <div>

                              <strong>
                                {
                                  item.nama_karyawan ||
                                  "-"
                                }
                              </strong>

                              <span>
                                {
                                  item.no_hp ||
                                  "-"
                                }
                              </span>

                            </div>

                          </div>

                        </td>


                        <td>
                          {
                            item.nik ||
                            "-"
                          }
                        </td>


                        <td>

                          {
                            item.nama_kategori ||
                            getKategoriName(
                              item.kategori_tk
                            )
                          }

                        </td>


                        <td>

                          {
                            item.nama_jabatan ||
                            getJabatanName(
                              item.jabatan
                            )
                          }

                        </td>


                        <td>
                          {
                            item.penempatan ||
                            "-"
                          }
                        </td>


                        <td>
                          {
                            formatDate(
                              item.tanggal_masuk
                            )
                          }
                        </td>


                        <td>

                          <span
                            className={
                              status === "AKTIF"
                                ? "status-badge status-active"
                                : "status-badge status-inactive"
                            }
                          >

                            <span />

                            {
                              item.status_aktif ||
                              "NON AKTIF"
                            }

                          </span>

                        </td>


                        {/* =================================
                            AKSI
                        ================================= */}

                        <td>

                          <div className="table-actions">

                            <button
                              type="button"
                              className="action-button action-edit"
                              onClick={() =>
                                openEdit(
                                  item
                                )
                              }
                              disabled={
                                deleting
                              }
                              title="Edit karyawan"
                              aria-label={`Edit karyawan ${item.nama_karyawan || item.id_karyawan}`}
                            >

                              <Pencil
                                size={16}
                                strokeWidth={1.8}
                                aria-hidden="true"
                              />

                            </button>


                            <button
                              type="button"
                              className="action-button action-delete"
                              onClick={() =>
                                handleDelete(
                                  item.id_karyawan,
                                  item.nama_karyawan
                                )
                              }
                              disabled={
                                deleting
                              }
                              title="Hapus karyawan"
                              aria-label={`Hapus karyawan ${item.nama_karyawan || item.id_karyawan}`}
                            >

                              <Trash2
                                size={16}
                                strokeWidth={1.8}
                                aria-hidden="true"
                              />

                            </button>

                          </div>

                        </td>

                      </tr>

                    );

                  }
                )

              )}

            </tbody>

          </table>

        </div>

      </section>


      {/* =================================================
          MODAL KARYAWAN
      ================================================= */}

      {modalOpen && (

        <KaryawanModal

		  mode={
			modalMode
		  }

		  employee={
			selectedEmployee
		  }

		  kategori={
			kategori
		  }

		  jabatan={
			jabatan
		  }

		  onClose={
			closeModal
		  }

		  onSaved={
			handleSaved
		  }

		/>

      )}

    </main>

  );

}


/* =========================================================
   TABLE LOADING
========================================================= */

function TableLoading() {

  return (

    <tr>

      <td
        colSpan="9"
        className="karyawan-loading"
      >

        <div className="karyawan-loading-content">

          <div className="loading-spinner" />

          <span>
            Memuat data karyawan...
          </span>

        </div>

      </td>

    </tr>

  );

}

/* =========================================================
   EMPTY TABLE
========================================================= */

function EmptyTable({
  hasData,
  search,
  penempatanFilter,
  kategoriFilter,
  statusFilter,
}) {

  const isFiltered =
    Boolean(
      search.trim()
    ) ||
    penempatanFilter !== "ALL" ||
    kategoriFilter !== "ALL" ||
    statusFilter !== "ALL";


  return (

    <tr>

      <td
        colSpan="9"
        className="karyawan-empty"
      >

        <div>

          <div className="empty-icon">
            —
          </div>


          <strong>

            {isFiltered
              ? "Tidak ada data yang sesuai"
              : "Tidak ada data karyawan tersedia"}

          </strong>


          <p>

            {isFiltered
              ? "Tidak ditemukan karyawan yang sesuai dengan pencarian atau filter."
              : "Belum terdapat data karyawan pada sistem."}

          </p>

        </div>

      </td>

    </tr>

  );

}