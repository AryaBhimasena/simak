"use client";

import { useMemo, useState } from "react";

import {
  Pencil,
  Trash2,
  ChevronDown,
  ChevronRight,
  Plus,
  X,
} from "lucide-react";

import "@/styles/pages/clients.css";


/* =========================================================
   DUMMY CLIENTS
========================================================= */

const INITIAL_CLIENTS = [
  {
    id_clients: "CLI-0001",
    nama_clients: "PT Maju Bersama",
    nama_gedung: "Gedung Maju Bersama",
    alamat_clients: "Jl. Gatot Subroto No. 25",
    kota_clients: "Denpasar",
    kode_pos: "80114",
    kontak_clients: "0361-445566",
    npwp: "01.234.567.8-901.000",
    PIC: "Andi Wijaya",
    kontak_PIC: "081234567890",
    status: "ACTIVE",

    kontrak: [
      {
        id_kontrak: "KTR-0001",
        tanggal_awal: "2026-01-01",
        tanggal_akhir: "2026-12-31",
        durasi_kontrak: "12 Bulan",
        id_clients: "CLI-0001",
        kategori_tk: "Security",
        management_fee: 750000,
      },
      {
        id_kontrak: "KTR-0002",
        tanggal_awal: "2026-03-01",
        tanggal_akhir: "2027-02-28",
        durasi_kontrak: "12 Bulan",
        id_clients: "CLI-0001",
        kategori_tk: "Cleaning Service",
        management_fee: 650000,
      },
    ],
  },

  {
    id_clients: "CLI-0002",
    nama_clients: "PT Bali Sejahtera",
    nama_gedung: "Bali Sejahtera Center",
    alamat_clients: "Jl. Teuku Umar No. 88",
    kota_clients: "Denpasar",
    kode_pos: "80113",
    kontak_clients: "0361-778899",
    npwp: "02.345.678.9-012.000",
    PIC: "Made Aryawan",
    kontak_PIC: "081987654321",
    status: "ACTIVE",

    kontrak: [
      {
        id_kontrak: "KTR-0003",
        tanggal_awal: "2026-02-01",
        tanggal_akhir: "2027-01-31",
        durasi_kontrak: "12 Bulan",
        id_clients: "CLI-0002",
        kategori_tk: "Security",
        management_fee: 800000,
      },
    ],
  },

  {
    id_clients: "CLI-0003",
    nama_clients: "PT Nusantara Property",
    nama_gedung: "Nusantara Tower",
    alamat_clients: "Jl. Sunset Road No. 100",
    kota_clients: "Badung",
    kode_pos: "80361",
    kontak_clients: "0361-998877",
    npwp: "03.456.789.0-123.000",
    PIC: "Budi Santoso",
    kontak_PIC: "082233445566",
    status: "NON ACTIVE",

    kontrak: [
      {
        id_kontrak: "KTR-0004",
        tanggal_awal: "2025-01-01",
        tanggal_akhir: "2025-12-31",
        durasi_kontrak: "12 Bulan",
        id_clients: "CLI-0003",
        kategori_tk: "Office Boy",
        management_fee: 500000,
      },
      {
        id_kontrak: "KTR-0005",
        tanggal_awal: "2025-06-01",
        tanggal_akhir: "2026-05-31",
        durasi_kontrak: "12 Bulan",
        id_clients: "CLI-0003",
        kategori_tk: "Cleaning Service",
        management_fee: 600000,
      },
    ],
  },

  {
    id_clients: "CLI-0004",
    nama_clients: "CV Karya Mandiri",
    nama_gedung: "Karya Mandiri Building",
    alamat_clients: "Jl. By Pass Ngurah Rai No. 55",
    kota_clients: "Badung",
    kode_pos: "80362",
    kontak_clients: "0361-223344",
    npwp: "04.567.890.1-234.000",
    PIC: "Sinta Dewi",
    kontak_PIC: "083344556677",
    status: "ACTIVE",
    kontrak: [],
  },
];


/* =========================================================
   PAGE
========================================================= */

export default function ClientsPage() {

  /* =======================================================
     DATA
  ======================================================= */

  const [clients, setClients] = useState(INITIAL_CLIENTS);


  /* =======================================================
     UI STATE
  ======================================================= */

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [expandedClient, setExpandedClient] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedClient, setSelectedClient] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");


  /* =======================================================
     FILTER
  ======================================================= */

  const filteredClients = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return clients.filter(client => {
      const searchableFields = [
        client.id_clients,
        client.nama_clients,
        client.nama_gedung,
        client.alamat_clients,
        client.kota_clients,
        client.kontak_clients,
        client.npwp,
        client.PIC,
      ];

      const matchesSearch =
        !keyword ||
        searchableFields.some(value =>
          String(value || "")
            .toLowerCase()
            .includes(keyword)
        );

      const matchesStatus =
        statusFilter === "ALL" ||
        client.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [clients, search, statusFilter]);


  /* =======================================================
     TOTAL KONTRAK
  ======================================================= */

  function getTotalKontrak(client) {
    return Array.isArray(client?.kontrak)
      ? client.kontrak.length
      : 0;
  }


  /* =======================================================
     OPEN CREATE
  ======================================================= */

  function openCreate() {
    setError("");
    setSuccessMessage("");
    setSelectedClient(null);
    setModalMode("create");
    setModalOpen(true);
  }


  /* =======================================================
     OPEN EDIT
  ======================================================= */

  function openEdit(client) {
    setError("");
    setSuccessMessage("");
    setSelectedClient(client);
    setModalMode("edit");
    setModalOpen(true);
  }


  /* =======================================================
     CLOSE MODAL
  ======================================================= */

  function closeModal() {
    setModalOpen(false);
    setSelectedClient(null);
  }


  /* =======================================================
     SAVE CLIENT
  ======================================================= */

  function handleSaved(savedClient) {
    if (!savedClient) return;

    if (modalMode === "create") {
      const newClient = {
        ...savedClient,
        id_clients:
          savedClient.id_clients ||
          `CLI-${String(clients.length + 1).padStart(4, "0")}`,
        status: savedClient.status || "ACTIVE",
        kontrak: [],
      };

      setClients(prev => [...prev, newClient]);

      setSuccessMessage(
        `Client ${newClient.nama_clients} berhasil ditambahkan.`
      );
    } else {
      setClients(prev =>
        prev.map(item =>
          item.id_clients === savedClient.id_clients
            ? { ...item, ...savedClient }
            : item
        )
      );

      setSuccessMessage("Data client berhasil diperbarui.");
    }

    closeModal();
  }


  /* =======================================================
     DELETE CLIENT
  ======================================================= */

  function handleDelete(client) {
    const confirmed = window.confirm(
      `Hapus client "${client.nama_clients}" (${client.id_clients})?`
    );

    if (!confirmed) return;

    setClients(prev =>
      prev.filter(item => item.id_clients !== client.id_clients)
    );

    if (expandedClient === client.id_clients) {
      setExpandedClient(null);
    }

    setSuccessMessage("Data client berhasil dihapus.");
  }


  /* =======================================================
     TOGGLE STATUS
  ======================================================= */

  function toggleStatus(client) {
    const newStatus =
      client.status === "ACTIVE"
        ? "NON ACTIVE"
        : "ACTIVE";

    setClients(prev =>
      prev.map(item =>
        item.id_clients === client.id_clients
          ? { ...item, status: newStatus }
          : item
      )
    );
  }


  /* =======================================================
     TOGGLE CONTRACT DETAIL
  ======================================================= */

  function toggleExpanded(clientId) {
    setExpandedClient(prev =>
      prev === clientId ? null : clientId
    );
  }


  /* =======================================================
     FORMAT DATE
  ======================================================= */

  function formatDate(value) {
    if (!value) return "-";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return String(value);
    }

    return new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  }


  /* =======================================================
     FORMAT CURRENCY
  ======================================================= */

  function formatCurrency(value) {
    const number = Number(value);

    if (Number.isNaN(number)) return "-";

    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);
  }


  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <main className="clients-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <section className="clients-header">

        <div>
          <p className="clients-eyebrow">MASTER DATA</p>

          <h1>Clients</h1>

          <p className="clients-description">
            Kelola data client, informasi perusahaan, PIC,
            dan kontrak kerja sama tenaga kerja.
          </p>
        </div>

        <div className="clients-header-actions">
          <button
            type="button"
            className="clients-primary-button"
            onClick={openCreate}
          >
            <Plus size={17} strokeWidth={2} />
            Tambah Client
          </button>
        </div>

      </section>


      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <div className="clients-alert clients-alert-error">
          <span>!</span>

          <p>{error}</p>

          <button
            type="button"
            onClick={() => setError("")}
          >
            ×
          </button>
        </div>
      )}


      {/* =================================================
          SUCCESS
      ================================================= */}

      {successMessage && (
        <div className="clients-alert clients-alert-success">
          <span>✓</span>

          <p>{successMessage}</p>

          <button
            type="button"
            onClick={() => setSuccessMessage("")}
          >
            ×
          </button>
        </div>
      )}


      {/* =================================================
          TOOLBAR
      ================================================= */}

      <section className="clients-toolbar">

        <div className="clients-search">

          <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>

          <input
            type="text"
            placeholder="Cari client, gedung, kota, PIC, NPWP..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />

        </div>


        <div className="clients-filter">

          <label>Status</label>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="ALL">Semua</option>
            <option value="ACTIVE">Active</option>
            <option value="NON ACTIVE">Non Active</option>
          </select>

        </div>


        <div className="clients-total">

          <span>Total</span>

          <strong>{filteredClients.length}</strong>

        </div>

      </section>


      {/* =================================================
          TABLE
      ================================================= */}

      <section className="clients-card">

        <div className="clients-table-wrapper">

          <table className="clients-table">

            <thead>
              <tr>
                <th></th>
                <th>ID CLIENT</th>
                <th>CLIENT</th>
                <th>GEDUNG</th>
                <th>ALAMAT</th>
                <th>KOTA</th>
                <th>KONTAK</th>
                <th>NPWP</th>
                <th>PIC</th>
                <th>TOTAL KONTRAK</th>
                <th>STATUS</th>
                <th>AKSI</th>
              </tr>
            </thead>

            <tbody>

              {filteredClients.length === 0 ? (
                <EmptyClients
                  hasData={clients.length > 0}
                  search={search}
                  statusFilter={statusFilter}
                />
              ) : (
                filteredClients.map(client => {
                  const isExpanded =
                    expandedClient === client.id_clients;

                  const status = client.status === "ACTIVE";

                  return (
                    <ClientRows
                      key={client.id_clients}
                      client={client}
                      isExpanded={isExpanded}
                      status={status}
                      onToggleExpanded={() =>
                        toggleExpanded(client.id_clients)
                      }
                      onEdit={() => openEdit(client)}
                      onDelete={() => handleDelete(client)}
                      onToggleStatus={() => toggleStatus(client)}
                      getTotalKontrak={getTotalKontrak}
                      formatDate={formatDate}
                      formatCurrency={formatCurrency}
                    />
                  );
                })
              )}

            </tbody>

          </table>

        </div>

      </section>


      {/* =================================================
          CLIENT MODAL
      ================================================= */}

      {modalOpen && (
        <ClientModal
          mode={modalMode}
          client={selectedClient}
          onClose={closeModal}
          onSaved={handleSaved}
        />
      )}

    </main>
  );
}


/* =========================================================
   CLIENT ROWS
========================================================= */

function ClientRows({
  client,
  isExpanded,
  status,
  onToggleExpanded,
  onEdit,
  onDelete,
  onToggleStatus,
  getTotalKontrak,
  formatDate,
  formatCurrency,
}) {

  return (
    <>

      {/* =================================================
          CLIENT ROW
      ================================================= */}

      <tr
        className={
          isExpanded
            ? "client-row client-row-expanded"
            : "client-row"
        }
      >

        <td
          className="client-expand-cell"
          onClick={onToggleExpanded}
        >
          <button
            type="button"
            className="client-expand-button"
            aria-label={
              isExpanded
                ? "Tutup kontrak"
                : "Lihat kontrak"
            }
          >
            {isExpanded ? (
              <ChevronDown size={17} strokeWidth={1.8} />
            ) : (
              <ChevronRight size={17} strokeWidth={1.8} />
            )}
          </button>
        </td>


        <td onClick={onToggleExpanded}>
          <span className="client-id">
            {client.id_clients}
          </span>
        </td>


        <td onClick={onToggleExpanded}>
          <div className="client-cell">

            <div className="client-avatar">
              {String(client.nama_clients || "?")
                .trim()
                .charAt(0)
                .toUpperCase()}
            </div>

            <div>
              <strong>{client.nama_clients || "-"}</strong>

              <span>{client.kontak_clients || "-"}</span>
            </div>

          </div>
        </td>


        <td onClick={onToggleExpanded}>
          {client.nama_gedung || "-"}
        </td>


        <td
          onClick={onToggleExpanded}
          className="client-address-cell"
        >
          {client.alamat_clients || "-"}
        </td>


        <td onClick={onToggleExpanded}>
          {client.kota_clients || "-"}
        </td>


        <td onClick={onToggleExpanded}>
          {client.kontak_clients || "-"}
        </td>


        <td onClick={onToggleExpanded}>
          {client.npwp || "-"}
        </td>


        <td onClick={onToggleExpanded}>

          <div className="client-pic-cell">

            <strong>{client.PIC || "-"}</strong>

            <span>{client.kontak_PIC || "-"}</span>

          </div>

        </td>


        <td onClick={onToggleExpanded}>
          <span className="contract-count">
            {getTotalKontrak(client)}
          </span>
        </td>


        <td>

          <button
            type="button"
            className={
              status
                ? "client-status-toggle is-active"
                : "client-status-toggle is-inactive"
            }
            onClick={onToggleStatus}
            title={status ? "Non Active" : "Active"}
            aria-label={
              status
                ? "Ubah menjadi Non Active"
                : "Ubah menjadi Active"
            }
          >

            <span className="client-toggle-track">
              <span className="client-toggle-thumb" />
            </span>

            <span className="client-toggle-label">
              {status ? "Active" : "Non Active"}
            </span>

          </button>

        </td>


        <td>

          <div className="table-actions">

            <button
              type="button"
              className="action-button action-edit"
              onClick={onEdit}
              title="Edit client"
              aria-label={`Edit client ${client.nama_clients}`}
            >
              <Pencil size={16} strokeWidth={1.8} />
            </button>

            <button
              type="button"
              className="action-button action-delete"
              onClick={onDelete}
              title="Hapus client"
              aria-label={`Hapus client ${client.nama_clients}`}
            >
              <Trash2 size={16} strokeWidth={1.8} />
            </button>

          </div>

        </td>

      </tr>


      {/* =================================================
          CONTRACT DETAIL
      ================================================= */}

      {isExpanded && (
        <tr className="client-contract-detail-row">

          <td colSpan="13">

            <div className="client-contract-detail">

              <div className="contract-detail-header">

                <div>
                  <span className="contract-detail-eyebrow">
                    KONTRAK KERJA SAMA
                  </span>

                  <strong>Daftar Kontrak</strong>
                </div>

                <span className="contract-detail-total">
                  {getTotalKontrak(client)} Kontrak
                </span>

              </div>


              {client.kontrak?.length > 0 ? (

                <div className="contract-table-wrapper">

                  <table className="contract-table">

                    <thead>
                      <tr>
                        <th>ID KONTRAK</th>
                        <th>TANGGAL AWAL</th>
                        <th>TANGGAL AKHIR</th>
                        <th>DURASI</th>
                        <th>ID CLIENT</th>
                        <th>KATEGORI TK</th>
                        <th>MANAGEMENT FEE</th>
                      </tr>
                    </thead>

                    <tbody>

                      {client.kontrak.map(contract => (
                        <tr key={contract.id_kontrak}>

                          <td>
                            <span className="contract-id">
                              {contract.id_kontrak}
                            </span>
                          </td>

                          <td>
                            {formatDate(contract.tanggal_awal)}
                          </td>

                          <td>
                            {formatDate(contract.tanggal_akhir)}
                          </td>

                          <td>
                            {contract.durasi_kontrak || "-"}
                          </td>

                          <td>
                            {contract.id_clients || "-"}
                          </td>

                          <td>
                            <span className="contract-category">
                              {contract.kategori_tk || "-"}
                            </span>
                          </td>

                          <td className="contract-fee">
                            {formatCurrency(contract.management_fee)}
                          </td>

                        </tr>
                      ))}

                    </tbody>

                  </table>

                </div>

              ) : (

                <div className="contract-empty">

                  <span>—</span>

                  <strong>Belum ada kontrak</strong>

                  <p>
                    Client ini belum memiliki kontrak kerja sama.
                  </p>

                </div>

              )}

            </div>

          </td>

        </tr>
      )}

    </>
  );
}


/* =========================================================
   EMPTY
========================================================= */

function EmptyClients({
  hasData,
  search,
  statusFilter,
}) {

  const isFiltered =
    Boolean(search.trim()) ||
    statusFilter !== "ALL";

  return (
    <tr>

      <td colSpan="13" className="clients-empty">

        <div>

          <div className="empty-icon">—</div>

          <strong>
            {isFiltered
              ? "Tidak ada data yang sesuai"
              : "Tidak ada data client tersedia"}
          </strong>

          <p>
            {isFiltered
              ? "Tidak ditemukan client yang sesuai dengan pencarian atau filter."
              : "Belum terdapat data client pada sistem."}
          </p>

        </div>

      </td>

    </tr>
  );
}


/* =========================================================
   CLIENT MODAL
========================================================= */

function ClientModal({
  mode,
  client,
  onClose,
  onSaved,
}) {

  const isEdit = mode === "edit";

  const [form, setForm] = useState(() => ({
    id_clients: client?.id_clients || "",
    nama_clients: client?.nama_clients || "",
    nama_gedung: client?.nama_gedung || "",
    alamat_clients: client?.alamat_clients || "",
    kota_clients: client?.kota_clients || "",
    kode_pos: client?.kode_pos || "",
    kontak_clients: client?.kontak_clients || "",
    npwp: client?.npwp || "",
    PIC: client?.PIC || "",
    kontak_PIC: client?.kontak_PIC || "",
    status: client?.status || "ACTIVE",
  }));

  const [formError, setFormError] = useState("");


  function handleChange(field, value) {
    setForm(prev => ({
      ...prev,
      [field]: value,
    }));
  }


  function handleSubmit(event) {
    event.preventDefault();

    if (!form.nama_clients.trim()) {
      setFormError("Nama client wajib diisi.");
      return;
    }

    onSaved({
      ...form,
      nama_clients: form.nama_clients.trim(),
      kontrak: client?.kontrak || [],
    });
  }


  return (
    <div
      className="clients-modal-overlay"
      onMouseDown={event => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >

      <div className="clients-modal">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="clients-modal-header">

          <div>

            <p className="clients-modal-eyebrow">
              {isEdit ? "EDIT CLIENT" : "CLIENT BARU"}
            </p>

            <h2>
              {isEdit ? "Edit Client" : "Tambah Client"}
            </h2>

            <p>
              {isEdit
                ? "Perbarui informasi client dan data perusahaan."
                : "Tambahkan client baru ke dalam master data."}
            </p>

          </div>

          <button
            type="button"
            className="modal-close"
            onClick={onClose}
            aria-label="Tutup"
          >
            <X size={20} strokeWidth={1.8} />
          </button>

        </div>


        {/* =================================================
            GENERATED ID
        ================================================= */}

        <div className="generated-id">

          <div>

            <span>ID CLIENT</span>

            <strong>
              {form.id_clients || "Akan dibuat otomatis"}
            </strong>

          </div>

          <span className="generated-id-label">
            CLIENT
          </span>

        </div>


        {/* =================================================
            FORM
        ================================================= */}

        <form
          className="clients-form"
          onSubmit={handleSubmit}
        >

          {/* =================================================
              INFORMASI CLIENT
          ================================================= */}

          <section className="form-section">

            <div className="form-section-header">

              <h3>Informasi Client</h3>

              <p>
                Informasi utama mengenai perusahaan atau client.
              </p>

            </div>

            <div className="form-section-grid">

              <FormField
                label="Nama Client"
                required
                value={form.nama_clients}
                onChange={value =>
                  handleChange("nama_clients", value)
                }
              />

              <FormField
                label="Nama Gedung"
                value={form.nama_gedung}
                onChange={value =>
                  handleChange("nama_gedung", value)
                }
              />

              <FormField
                label="Kontak Client"
                value={form.kontak_clients}
                onChange={value =>
                  handleChange("kontak_clients", value)
                }
              />

              <FormField
                label="NPWP"
                value={form.npwp}
                onChange={value =>
                  handleChange("npwp", value)
                }
              />

              <FormField
                label="Alamat"
                full
                textarea
                value={form.alamat_clients}
                onChange={value =>
                  handleChange("alamat_clients", value)
                }
              />

              <FormField
                label="Kota"
                value={form.kota_clients}
                onChange={value =>
                  handleChange("kota_clients", value)
                }
              />

              <FormField
                label="Kode Pos"
                value={form.kode_pos}
                onChange={value =>
                  handleChange("kode_pos", value)
                }
              />

            </div>

          </section>


          {/* =================================================
              PIC
          ================================================= */}

          <section className="form-section">

            <div className="form-section-header">

              <h3>Person In Charge</h3>

              <p>
                Informasi kontak utama dari pihak client.
              </p>

            </div>

            <div className="form-section-grid">

              <FormField
                label="Nama PIC"
                value={form.PIC}
                onChange={value =>
                  handleChange("PIC", value)
                }
              />

              <FormField
                label="Kontak PIC"
                value={form.kontak_PIC}
                onChange={value =>
                  handleChange("kontak_PIC", value)
                }
              />

            </div>

          </section>


          {/* =================================================
              STATUS
          ================================================= */}

          <section className="form-section">

            <div className="form-section-header">

              <h3>Status Client</h3>

              <p>
                Tentukan apakah client masih aktif digunakan.
              </p>

            </div>

            <div className="client-modal-status">

              <button
                type="button"
                className={
                  form.status === "ACTIVE"
                    ? "client-status-toggle is-active"
                    : "client-status-toggle is-inactive"
                }
                onClick={() =>
                  handleChange(
                    "status",
                    form.status === "ACTIVE"
                      ? "NON ACTIVE"
                      : "ACTIVE"
                  )
                }
              >

                <span className="client-toggle-track">
                  <span className="client-toggle-thumb" />
                </span>

                <span className="client-toggle-label">
                  {form.status === "ACTIVE"
                    ? "Active"
                    : "Non Active"}
                </span>

              </button>

            </div>

          </section>


          {/* =================================================
              KONTRAK
          ================================================= */}

          <section className="form-section">

            <div className="form-section-header">

              <h3>Kontrak Kerja Sama</h3>

              <p>
                Satu client dapat memiliki beberapa kontrak
                berdasarkan kategori tenaga kerja.
              </p>

            </div>

            <div className="client-contract-modal-card">

              <div>

                <strong>
                  {client?.kontrak?.length || 0} Kontrak terdaftar
                </strong>

                <span>
                  Kontrak akan dikelola berdasarkan kategori tenaga kerja.
                </span>

              </div>

              <button
                type="button"
                className="karyawan-secondary-button"
                onClick={() =>
                  alert(
                    "Form Tambah Kontrak akan dibuat pada tahap berikutnya."
                  )
                }
              >

                <Plus size={15} strokeWidth={2} />

                Tambah Kontrak

              </button>

            </div>

          </section>


          {/* =================================================
              ERROR
          ================================================= */}

          {formError && (
            <div className="form-error">
              {formError}
            </div>
          )}


          {/* =================================================
              FOOTER
          ================================================= */}

          <div className="clients-form-footer">

            <button
              type="button"
              className="modal-secondary-button"
              onClick={onClose}
            >
              Batal
            </button>

            <button
              type="submit"
              className="clients-primary-button"
            >
              {isEdit
                ? "Simpan Perubahan"
                : "Simpan Client"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}


/* =========================================================
   FORM FIELD
========================================================= */

function FormField({
  label,
  required = false,
  full = false,
  textarea = false,
  value,
  onChange,
}) {

  return (
    <div
      className={
        full
          ? "form-field form-field-full"
          : "form-field"
      }
    >

      <label>
        {label}

        {required && (
          <span className="required-mark">*</span>
        )}
      </label>

      {textarea ? (
        <textarea
          rows="3"
          value={value}
          onChange={event => onChange(event.target.value)}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={event => onChange(event.target.value)}
        />
      )}

    </div>
  );
}