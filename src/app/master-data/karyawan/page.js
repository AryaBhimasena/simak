"use client";

import { useEffect, useMemo, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { useUser } from "@/contexts/userContext";
import { getKaryawan, getMasterKaryawan, deleteKaryawan } from "@/lib/karyawan";
import KaryawanModal from "@/components/modal-karyawan";
import "@/styles/pages/karyawan.css";

export default function KaryawanPage() {
  const { userId, sessionId, authenticated, isInitializing } = useUser();

  const [karyawan, setKaryawan] = useState([]);
  const [kategori, setKategori] = useState([]);
  const [jabatan, setJabatan] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [penempatanFilter, setPenempatanFilter] = useState("ALL");
  const [kategoriFilter, setKategoriFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (isInitializing || !authenticated || !userId || !sessionId) return;

    let cancelled = false;

    async function loadInitialData() {
      setLoading(true);
      setError("");

      try {
        const karyawanResult = await getKaryawan(userId, sessionId);
        let masterResult = { kategori: [], jabatan: [] };

        try {
          masterResult = await getMasterKaryawan(userId, sessionId);
        } catch (err) {
          console.error("Gagal mengambil master karyawan:", err);
        }

        if (cancelled) return;

        setKaryawan(Array.isArray(karyawanResult?.data) ? karyawanResult.data : []);
        setKategori(Array.isArray(masterResult?.kategori) ? masterResult.kategori : []);
        setJabatan(Array.isArray(masterResult?.jabatan) ? masterResult.jabatan : []);
      } catch (err) {
        if (cancelled) return;
        setError(err?.message || "Data karyawan gagal dimuat.");
        setKaryawan([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadInitialData();
    return () => { cancelled = true; };
  }, [isInitializing, authenticated, userId, sessionId]);

const penempatanOptions = useMemo(() => {
  const map = new Map();

  karyawan.forEach(item => {
    const id = String(item.penempatan || "").trim();
    const nama = String(item.nama_penempatan || "").trim();
    if (id) map.set(id, nama || id);
  });

  return [...map].map(([value, label]) => ({ value, label }))
    .sort((a, b) => a.label.localeCompare(b.label, "id-ID"));
}, [karyawan]);

  const kategoriOptions = useMemo(() =>
    kategori
      .filter(item => item?.id !== undefined && item?.id !== null)
      .sort((a, b) =>
        String(a.nama || "").localeCompare(String(b.nama || ""), "id-ID")
      ),
    [kategori]
  );

  const filteredKaryawan = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return karyawan.filter(item => {
      const matchesSearch =
        !keyword ||
        ["id_karyawan", "nik", "nama_karyawan", "npp", "nama_penempatan"]
          .some(key => String(item[key] || "").toLowerCase().includes(keyword));

      const matchesPenempatan =
        penempatanFilter === "ALL" ||
        String(item.penempatan || "").trim() === penempatanFilter;

      const matchesKategori =
        kategoriFilter === "ALL" ||
        String(item.kategori_tk ?? "").trim() === String(kategoriFilter);

      const status = String(item.status_aktif || "").trim().toUpperCase();

      const matchesStatus =
        statusFilter === "ALL" || status === statusFilter;

      return (
        matchesSearch &&
        matchesPenempatan &&
        matchesKategori &&
        matchesStatus
      );
    });
  }, [
    karyawan,
    search,
    penempatanFilter,
    kategoriFilter,
    statusFilter,
  ]);

  function resetMessage() {
    setError("");
    setSuccessMessage("");
  }

  function openCreate() {
    resetMessage();
    setSelectedEmployee(null);
    setModalMode("create");
    setModalOpen(true);
  }

  function openEdit(employee) {
    if (!employee?.id_karyawan) return;

    resetMessage();
    setSelectedEmployee(employee);
    setModalMode("edit");
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setSelectedEmployee(null);
  }

  function handleSaved(savedData, mode = "create") {
    if (!savedData) return;

    const id = String(savedData.id_karyawan || "");

    if (mode === "create") {
      setKaryawan(prev => {
        if (!id) return prev;

        const exists = prev.some(
          item => String(item.id_karyawan) === id
        );

        return exists
          ? prev.map(item =>
              String(item.id_karyawan) === id
                ? { ...item, ...savedData }
                : item
            )
          : [...prev, savedData];
      });

      setSuccessMessage(
        id
          ? `Karyawan berhasil ditambahkan dengan ID ${savedData.id_karyawan}.`
          : "Karyawan berhasil ditambahkan."
      );

      closeModal();
      return;
    }

    setKaryawan(prev =>
      prev.map(item =>
        String(item.id_karyawan) === id
          ? { ...item, ...savedData }
          : item
      )
    );

    setSuccessMessage("Data karyawan berhasil diperbarui.");
    closeModal();
  }

  async function handleDelete(id_karyawan, nama_karyawan) {
    if (!window.confirm(`Hapus karyawan "${nama_karyawan}" (${id_karyawan})?`)) {
      return;
    }

    setDeleting(true);
    resetMessage();

    try {
      const result = await deleteKaryawan(id_karyawan, userId, sessionId);

      setKaryawan(prev =>
        prev.filter(
          item => String(item.id_karyawan) !== String(id_karyawan)
        )
      );

      setSuccessMessage(
        result?.message || "Data karyawan berhasil dihapus."
      );
    } catch (err) {
      setError(err?.message || "Data karyawan gagal dihapus.");
    } finally {
      setDeleting(false);
    }
  }

  function formatDate(value) {
    if (!value) return "-";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value);

    return new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  }

  function getMasterName(list, id) {
    const item = list.find(x => String(x.id) === String(id));
    return item?.nama || id || "-";
  }

  function getKategoriName(id) {
    return getMasterName(kategori, id);
  }

  function getJabatanName(id) {
    return getMasterName(jabatan, id);
  }

  return (
    <main className="karyawan-page">

      <section className="karyawan-header">
        <div>
          <p className="karyawan-eyebrow">MASTER DATA</p>
          <h1>Karyawan</h1>
          <p className="karyawan-description">
            Kelola data pribadi, jabatan, penempatan, dan informasi administrasi karyawan.
          </p>
        </div>

        <div className="karyawan-header-actions">
          <button
            type="button"
            className="karyawan-primary-button"
            onClick={openCreate}
            disabled={loading || isInitializing}
          >
            <span className="button-plus">+</span>
            Tambah Karyawan
          </button>
        </div>
      </section>

      {error && (
        <div className="karyawan-alert karyawan-alert-error">
          <span>!</span>
          <p>{error}</p>
          <button type="button" onClick={() => setError("")}>×</button>
        </div>
      )}

      {successMessage && (
        <div className="karyawan-alert karyawan-alert-success">
          <span>✓</span>
          <p>{successMessage}</p>
          <button type="button" onClick={() => setSuccessMessage("")}>×</button>
        </div>
      )}

      <section className="karyawan-toolbar">

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
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>

          <input
            type="text"
            placeholder="Cari nama, NIK, NPP, atau penempatan..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <Filter
          label="Penempatan"
          value={penempatanFilter}
          onChange={setPenempatanFilter}
          options={penempatanOptions}
        />

        <Filter
          label="Kategori"
          value={kategoriFilter}
          onChange={setKategoriFilter}
          options={kategoriOptions.map(item => ({
            value: item.id,
            label: item.nama || item.id,
          }))}
        />

        <Filter
          label="Status"
          value={statusFilter}
          onChange={setStatusFilter}
          options={[
            { value: "AKTIF", label: "Aktif" },
            { value: "NON AKTIF", label: "Non Aktif" },
          ]}
        />

        <div className="karyawan-total">
          <span>Total</span>
          <strong>{filteredKaryawan.length}</strong>
        </div>
      </section>

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
                  hasData={karyawan.length > 0}
                  search={search}
                  penempatanFilter={penempatanFilter}
                  kategoriFilter={kategoriFilter}
                  statusFilter={statusFilter}
                />
              ) : (
                filteredKaryawan.map(item => {
                  const status = String(item.status_aktif || "")
                    .trim()
                    .toUpperCase();

                  return (
                    <tr key={item.id_karyawan}>
                      <td>
                        <span className="employee-id">
                          {item.id_karyawan || "-"}
                        </span>
                      </td>

                      <td>
                        <div className="employee-cell">
                          <div className="employee-avatar">
                            {String(item.nama_karyawan || "?")
                              .trim()
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <div>
                            <strong>{item.nama_karyawan || "-"}</strong>
                            <span>{item.no_hp || "-"}</span>
                          </div>
                        </div>
                      </td>

                      <td>{item.nik || "-"}</td>

                      <td>
                        {item.nama_kategori ||
                          getKategoriName(item.kategori_tk)}
                      </td>

                      <td>
                        {item.nama_jabatan ||
                          getJabatanName(item.jabatan)}
                      </td>

                      <td>{item.nama_penempatan || "-"}</td>
                      <td>{formatDate(item.tanggal_masuk)}</td>

                      <td>
                        <span
                          className={
                            status === "AKTIF"
                              ? "status-badge status-active"
                              : "status-badge status-inactive"
                          }
                        >
                          <span />
                          {item.status_aktif || "NON AKTIF"}
                        </span>
                      </td>

                      <td>
                        <div className="table-actions">
                          <button
                            type="button"
                            className="action-button action-edit"
                            onClick={() => openEdit(item)}
                            disabled={deleting}
                            title="Edit karyawan"
                            aria-label={`Edit karyawan ${item.nama_karyawan || item.id_karyawan}`}
                          >
                            <Pencil size={16} strokeWidth={1.8} aria-hidden="true" />
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
                            disabled={deleting}
                            title="Hapus karyawan"
                            aria-label={`Hapus karyawan ${item.nama_karyawan || item.id_karyawan}`}
                          >
                            <Trash2 size={16} strokeWidth={1.8} aria-hidden="true" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>

      {modalOpen && (
        <KaryawanModal
          mode={modalMode}
          employee={selectedEmployee}
          kategori={kategori}
          jabatan={jabatan}
          onClose={closeModal}
          onSaved={handleSaved}
        />
      )}
    </main>
  );
}

function Filter({ label, value, onChange, options }) {
  return (
    <div className="karyawan-filter">
      <label>{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)}>
        <option value="ALL">Semua</option>
        {options.map(option => {
          const item =
            typeof option === "object"
              ? option
              : { value: option, label: option };

          return (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          );
        })}
      </select>
    </div>
  );
}

function TableLoading() {
  return (
    <tr>
      <td colSpan="9" className="karyawan-loading">
        <div className="karyawan-loading-content">
          <div className="loading-spinner" />
          <span>Memuat data karyawan...</span>
        </div>
      </td>
    </tr>
  );
}

function EmptyTable({
  hasData,
  search,
  penempatanFilter,
  kategoriFilter,
  statusFilter,
}) {
  const isFiltered =
    Boolean(search.trim()) ||
    penempatanFilter !== "ALL" ||
    kategoriFilter !== "ALL" ||
    statusFilter !== "ALL";

  return (
    <tr>
      <td colSpan="9" className="karyawan-empty">
        <div>
          <div className="empty-icon">—</div>

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
