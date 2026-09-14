"use client";
import { useMemo, useState } from "react";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  UserCheck,
  UserX,
  X,
  Save,
  ShieldCheck,
} from "lucide-react";
import "@/styles/tabs/users-tab.css";
/* ======================================================
   ROLE OPTIONS
   Untuk sementara role ditentukan aplikasi.
   Nanti dapat dipindahkan ke konfigurasi terpusat.
====================================================== */
const ROLE_OPTIONS = [
  "Super Admin",
  "Admin",
  "Manager",
  "Finance",
  "HRD",
  "Staff Absensi",
];
/* ======================================================
   APPLICATION ACCESS
   Struktur menu aplikasi.
   Parent group:
   - menentukan apakah group dapat diakses
   Children:
   - menentukan akses masing-masing halaman
====================================================== */
const ACCESS_MENU_CONFIG = [
  {
    key: "dashboard",
    label: "Dashboard",
    description: "Halaman utama aplikasi.",
    children: [],
  },

  {
    key: "master_data",
    label: "Master Data",
    description: "Pengelolaan data utama aplikasi.",
    children: [
      {
        key: "clients",
        label: "Data Clients",
        description: "Mengelola data client.",
      },
      {
        key: "karyawan",
        label: "Data Karyawan",
        description: "Mengelola data karyawan.",
      },
    ],
  },

  {
    key: "finance",
    label: "Finance",
    description: "Pengelolaan keuangan dan transaksi.",
    children: [],
  },

  {
    key: "hrd",
    label: "HRD",
    description: "Pengelolaan sumber daya manusia.",
    children: [],
  },

  {
    key: "attendance",
    label: "Absensi",
    description: "Pengelolaan dan monitoring absensi.",
    children: [],
  },
];

/* ======================================================
   DEFAULT ACCESS
====================================================== */
function createDefaultAccess() {
  const access = {};

  ACCESS_MENU_CONFIG.forEach((group) => {
    access[group.key] = {
      enabled: true,
      children: {},
    };

    group.children.forEach((child) => {
      access[group.key].children[child.key] = true;
    });
  });

  return access;
}

/* ======================================================
   MOCK DATA
   Sementara digunakan untuk membangun UI.
   Nanti diganti dengan data dari endpoint GAS.
====================================================== */
const INITIAL_USERS = [
  {
    id_user: "USR001",
    id_karyawan: "KRY001",
    nama_user: "admin@kii.co.id",
    role: "Super Admin",
    aktif: true,

    access: createDefaultAccess(),

    created_at: "2026-08-01",
    updated_at: "2026-08-01",
  },

  {
    id_user: "USR002",
    id_karyawan: "KRY002",
    nama_user: "finance@kii.co.id",
    role: "Finance",
    aktif: true,

    access: {
      dashboard: {
        enabled: true,
        children: {},
      },

      master_data: {
        enabled: false,
        children: {
          clients: false,
          karyawan: false,
        },
      },

      finance: {
        enabled: true,
        children: {},
      },

      hrd: {
        enabled: false,
        children: {},
      },

      attendance: {
        enabled: false,
        children: {},
      },
    },

    created_at: "2026-08-02",
    updated_at: "2026-08-02",
  },
];

export default function UsersTab() {
  const [users, setUsers] =
    useState(INITIAL_USERS);
  const [search, setSearch] =
    useState("");
  const [roleFilter, setRoleFilter] =
    useState("ALL");
  const [statusFilter, setStatusFilter] =
    useState("ALL");
  const [modalOpen, setModalOpen] =
    useState(false);
  const [editingUser, setEditingUser] =
    useState(null);
  /* ====================================================
     FILTER
  ==================================================== */
  const filteredUsers = useMemo(() => {
    const keyword =
      search.trim().toLowerCase();
    return users.filter((user) => {
const matchesSearch =
  !keyword ||
  String(user.id_user || "")
    .toLowerCase()
    .includes(keyword) ||
  String(user.id_karyawan || "")
    .toLowerCase()
    .includes(keyword) ||
  String(user.nama_user || "")
    .toLowerCase()
    .includes(keyword);
      const matchesRole =
        roleFilter === "ALL" ||
        user.role === roleFilter;
      const matchesStatus =
        statusFilter === "ALL" ||
        (statusFilter === "ACTIVE" &&
          user.aktif) ||
        (statusFilter === "INACTIVE" &&
          !user.aktif);
      return (
        matchesSearch &&
        matchesRole &&
        matchesStatus
      );
    });
  }, [
    users,
    search,
    roleFilter,
    statusFilter,
  ]);
  /* ====================================================
     OPEN CREATE
  ==================================================== */
  const handleCreate = () => {
    setEditingUser(null);
    setModalOpen(true);
  };
  /* ====================================================
     OPEN EDIT
  ==================================================== */
  const handleEdit = (user) => {
    setEditingUser(user);
    setModalOpen(true);
  };
  /* ====================================================
     DELETE
  ==================================================== */
  const handleDelete = (user) => {
    const confirmed = window.confirm(
      `Hapus pengguna "${user.nama_user}"?`
    );
    if (!confirmed) {
      return;
    }
    setUsers((current) =>
      current.filter(
        (item) =>
          item.id_user !== user.id_user
      )
    );
  };
  /* ====================================================
     TOGGLE STATUS
  ==================================================== */
  const handleToggleStatus = (user) => {
    setUsers((current) =>
      current.map((item) =>
        item.id_user === user.id_user
          ? {
              ...item,
              aktif: !item.aktif,
            }
          : item
      )
    );
  };
  /* ====================================================
     SAVE USER
     Sementara local state.
     Nanti diganti API GAS.
  ==================================================== */
  const handleSaveUser = (formData) => {
    if (editingUser) {
      setUsers((current) =>
        current.map((item) =>
          item.id_user ===
          editingUser.id_user
            ? {
                ...item,
                ...formData,
                updated_at:
                  new Date()
                    .toISOString()
                    .slice(0, 10),
              }
            : item
        )
      );
    } else {
      const newUser = {
  id_user: `USR${String(
    users.length + 1
  ).padStart(3, "0")}`,

  id_karyawan:
    formData.id_karyawan,

  nama_user:
    formData.nama_user,

  role:
    formData.role,

  aktif:
    formData.aktif,

  access:
    formData.access,

  created_at:
    new Date()
      .toISOString()
      .slice(0, 10),

  updated_at:
    new Date()
      .toISOString()
      .slice(0, 10),
};
	  setUsers((current) => [
        ...current,
        newUser,
      ]);
    }
    setModalOpen(false);
    setEditingUser(null);
  };
  return (
    <div className="users-page">
      {/* ==================================================
          HEADER
      ================================================== */}
      <div className="users-header">
        <div>
          <p className="users-eyebrow">
            MANAJEMEN PENGGUNA
          </p>
          <h2>Pengguna</h2>
          <p>
            Kelola akun pengguna dan role yang
            digunakan untuk membatasi akses aplikasi.
          </p>
        </div>
        <button
          type="button"
          className="users-primary-button"
          onClick={handleCreate}
        >
          <Plus
            size={17}
            strokeWidth={2}
          />
          <span>Tambah Pengguna</span>
        </button>
      </div>
      {/* ==================================================
          SUMMARY
      ================================================== */}
      <div className="users-summary">
        <div className="users-summary-item">
          <div className="users-summary-icon">
            <UserCheck
              size={18}
              strokeWidth={1.8}
            />
          </div>
          <div>
            <span>Total Pengguna</span>
            <strong>{users.length}</strong>
          </div>
        </div>
        <div className="users-summary-item">
          <div className="users-summary-icon">
            <ShieldCheck
              size={18}
              strokeWidth={1.8}
            />
          </div>
          <div>
            <span>Pengguna Aktif</span>
            <strong>
              {
                users.filter(
                  (user) => user.aktif
                ).length
              }
            </strong>
          </div>
        </div>
        <div className="users-summary-item">
          <div className="users-summary-icon">
            <UserX
              size={18}
              strokeWidth={1.8}
            />
          </div>
          <div>
            <span>Nonaktif</span>
            <strong>
              {
                users.filter(
                  (user) => !user.aktif
                ).length
              }
            </strong>
          </div>
        </div>
      </div>
      {/* ==================================================
          TOOLBAR
      ================================================== */}
      <div className="users-toolbar">
        <div className="users-search">
          <Search
            size={17}
            strokeWidth={1.8}
          />
          <input
            type="text"
            placeholder="Cari pengguna..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) =>
            setRoleFilter(e.target.value)
          }
        >
          <option value="ALL">
            Semua Role
          </option>
          {ROLE_OPTIONS.map((role) => (
            <option
              key={role}
              value={role}
            >
              {role}
            </option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value)
          }
        >
          <option value="ALL">
            Semua Status
          </option>
          <option value="ACTIVE">
            Aktif
          </option>
          <option value="INACTIVE">
            Nonaktif
          </option>
        </select>
      </div>
      {/* ==================================================
          TABLE
      ================================================== */}
      <div className="users-table-wrapper">
        <table className="users-table">
          <thead>
            <tr>
              <th>Pengguna</th>
              <th>ID Karyawan</th>
              <th>Role</th>
              <th>Status</th>
              <th>Update Terakhir</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="users-empty"
                >
                  Tidak ada pengguna yang
                  sesuai dengan filter.
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.id_user}>
                  <td>
                    <div className="user-identity">
                      <div className="user-avatar">
                        {user.nama_user
                          .charAt(0)
                          .toUpperCase()}
                      </div>
                      <div>
                        <strong>
                          {user.nama_user}
                        </strong>
                        <span>
                          {user.id_user}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="user-id">
                      {user.id_karyawan ||
                        "-"}
                    </span>
                  </td>
                  <td>
                    <span className="user-role">
                      {user.role}
                    </span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className={`user-status ${
                        user.aktif
                          ? "active"
                          : "inactive"
                      }`}
                      onClick={() =>
                        handleToggleStatus(
                          user
                        )
                      }
                      title={
                        user.aktif
                          ? "Nonaktifkan pengguna"
                          : "Aktifkan pengguna"
                      }
                    >
                      <span />
                      {user.aktif
                        ? "Aktif"
                        : "Nonaktif"}
                    </button>
                  </td>
                  <td>
                    <span className="user-date">
                      {user.updated_at}
                    </span>
                  </td>
                  <td>
                    <div className="user-actions">
                      <button
                        type="button"
                        className="user-action-button"
                        onClick={() =>
                          handleEdit(user)
                        }
                        title="Edit pengguna"
                      >
                        <Pencil
                          size={16}
                          strokeWidth={1.8}
                        />
                      </button>
                      <button
                        type="button"
                        className="user-action-button danger"
                        onClick={() =>
                          handleDelete(user)
                        }
                        title="Hapus pengguna"
                      >
                        <Trash2
                          size={16}
                          strokeWidth={1.8}
                        />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* ==================================================
          MODAL
      ================================================== */}
      {modalOpen && (
        <UserModal
          user={editingUser}
          onClose={() => {
            setModalOpen(false);
            setEditingUser(null);
          }}
          onSave={handleSaveUser}
        />
      )}
    </div>
  );
}
/* ========================================================
   USER MODAL
======================================================== */
function UserModal({
  user,
  onClose,
  onSave,
}) {
  const [namaUser, setNamaUser] =
    useState(user?.nama_user || "");
  const [idKaryawan, setIdKaryawan] =
    useState(user?.id_karyawan || "");
  const [password, setPassword] =
    useState("");
  const [role, setRole] =
    useState(
      user?.role ||
        ROLE_OPTIONS[1]
    );
  const [aktif, setAktif] =
    useState(
      user?.aktif ?? true
    );
const [access, setAccess] = useState(() => {
  if (user?.access) {
    return structuredClone(user.access);
  }

  return createDefaultAccess();
});

/* ====================================================
   ACCESS CONTROL
==================================================== */
const handleAccessChange = (
  groupKey,
  childKey,
  value
) => {
  setAccess((current) => ({
    ...current,

    [groupKey]: {
      ...current[groupKey],

      children: {
        ...current[groupKey]?.children,
        [childKey]: value,
      },
    },
  }));
};

const handleGroupAccessChange = (
  group,
  value
) => {
  setAccess((current) => {
    const currentGroup =
      current[group.key] || {
        enabled: true,
        children: {},
      };

    const children = {
      ...currentGroup.children,
    };

    /*
      Jika parent ditolak,
      semua child otomatis ditolak.
    */

    if (!value) {
      group.children.forEach((child) => {
        children[child.key] = false;
      });
    }

    return {
      ...current,

      [group.key]: {
        enabled: value,
        children,
      },
    };
  });
};

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!namaUser.trim()) {
      return;
    }
    onSave({
      nama_user:
        namaUser.trim(),
      id_karyawan:
        idKaryawan.trim(),
      password,
      role,
      aktif,
	  access,
    });
  };
  return (
    <div
      className="users-modal-overlay"
      onMouseDown={(e) => {
        if (
          e.target === e.currentTarget
        ) {
          onClose();
        }
      }}
    >
      <div className="users-modal">
        {/* HEADER */}
        <div className="users-modal-header">
          <div>
            <p>
              {user
                ? "EDIT PENGGUNA"
                : "PENGGUNA BARU"}
            </p>
            <h3>
              {user
                ? "Edit Pengguna"
                : "Tambah Pengguna"}
            </h3>
          </div>
          <button
            type="button"
            className="users-modal-close"
            onClick={onClose}
          >
            <X
              size={19}
              strokeWidth={1.8}
            />
          </button>
        </div>
        {/* FORM */}
        <form
          className="users-modal-form"
          onSubmit={handleSubmit}
        >
          <div className="users-form-group">
            <label htmlFor="id-karyawan">
              ID Karyawan
            </label>
            <input
              id="id-karyawan"
              type="text"
              value={idKaryawan}
              onChange={(e) =>
                setIdKaryawan(
                  e.target.value
                )
              }
              placeholder="Contoh: KRY001"
            />
          </div>
          <div className="users-form-group">
            <label htmlFor="nama-user">
              Nama User / Email
            </label>
            <input
              id="nama-user"
              type="email"
              value={namaUser}
              onChange={(e) =>
                setNamaUser(
                  e.target.value
                )
              }
              placeholder="nama@kii.co.id"
              required
            />
          </div>
          <div className="users-form-group">
            <label htmlFor="user-password">
              Password
            </label>
            <input
              id="user-password"
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
              placeholder={
                user
                  ? "Kosongkan jika tidak diubah"
                  : "Masukkan password"
              }
              required={!user}
            />
          </div>
          <div className="users-form-group">
            <label htmlFor="user-role">
              Role
            </label>
            <select
              id="user-role"
              value={role}
              onChange={(e) =>
                setRole(e.target.value)
              }
            >
              {ROLE_OPTIONS.map(
                (item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>
                )
              )}
            </select>
          </div>
          <div className="users-form-status">
            <div>
              <strong>
                Status pengguna
              </strong>
              <span>
                Pengguna dapat masuk ke
                aplikasi ketika status aktif.
              </span>
            </div>
            <button
              type="button"
              className={`users-switch ${
                aktif ? "active" : ""
              }`}
              onClick={() =>
                setAktif(!aktif)
              }
              aria-label={
                aktif
                  ? "Nonaktifkan"
                  : "Aktifkan"
              }
            >
              <span />
            </button>
          </div>
{/* ==================================================
    ACCESS CONTROL
================================================== */}
<div className="users-access-section">
  <div className="users-access-header">
    <div>
      <strong>Hak Akses Aplikasi</strong>
      <span>
        Tentukan menu dan halaman yang dapat
        digunakan oleh pengguna ini.
      </span>
    </div>
  </div>
  <div className="users-access-list">
    {ACCESS_MENU_CONFIG.map((group) => {
const groupAccess =
  access[group.key] || {
    enabled: false,
    children: {},
  };

const groupAllowed =
  groupAccess.enabled === true;
  
      return (
        <div
          key={group.key}
          className="users-access-group"
        >
          {/* ==============================
              GROUP HEADER
          ============================== */}
          <div className="users-access-group-header">
            <div className="users-access-group-info">
              <strong>
                {group.label}
              </strong>
              <span>
                {group.description}
              </span>
            </div>
            <div className="users-access-radio-group">
              <label
                className={
                  groupAllowed
                    ? "selected"
                    : ""
                }
              >
                <input
                  type="radio"
                  name={`access-${group.key}`}
                  checked={groupAllowed}
                  onChange={() =>
                    handleGroupAccessChange(
                      group,
                      true
                    )
                  }
                />
                <span>
                  Diizinkan
                </span>
              </label>
              <label
                className={
                  !groupAllowed
                    ? "selected denied"
                    : ""
                }
              >
                <input
                  type="radio"
                  name={`access-${group.key}`}
                  checked={!groupAllowed}
                  onChange={() =>
                    handleGroupAccessChange(
                      group,
                      false
                    )
                  }
                />
                <span>
                  Ditolak
                </span>
              </label>
            </div>
          </div>
          {/* ==============================
              CHILDREN
          ============================== */}
          {group.children.length > 0 && (
            <div className="users-access-children">
              {group.children.map((child) => {
				const childAllowed =
				  groupAccess.children?.[child.key] === true;
                return (
                  <div
                    key={child.key}
                    className={`users-access-child ${
                      !groupAllowed
                        ? "disabled"
                        : ""
                    }`}
                  >
                    <div className="users-access-child-info">
                      <strong>
                        {child.label}
                      </strong>
                      <span>
                        {child.description}
                      </span>
                    </div>
                    <div className="users-access-radio-group">
                      <label
                        className={
                          childAllowed
                            ? "selected"
                            : ""
                        }
                      >
                        <input
                          type="radio"
                          name={`access-${group.key}-${child.key}`}
                          checked={childAllowed}
                          disabled={!groupAllowed}
                          onChange={() =>
                            handleAccessChange(
							  group.key,
                              child.key,
                              true
                            )
                          }
                        />
                        <span>
                          Diizinkan
                        </span>
                      </label>
                      <label
                        className={
                          !childAllowed
                            ? "selected denied"
                            : ""
                        }
                      >
                        <input
                          type="radio"
                          name={`access-${group.key}-${child.key}`}
                          checked={!childAllowed}
                          disabled={!groupAllowed}
                          onChange={() =>
                            handleAccessChange(
							  group.key,
                              child.key,
                              false
                            )
                          }
                        />
                        <span>
                          Ditolak
                        </span>
                      </label>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      );
    })}
  </div>
</div>
          {/* FOOTER */}
          <div className="users-modal-footer">
            <button
              type="button"
              className="users-cancel-button"
              onClick={onClose}
            >
              Batal
            </button>
            <button
              type="submit"
              className="users-save-button"
            >
              <Save
                size={16}
                strokeWidth={1.9}
              />
              <span>
                {user
                  ? "Simpan Perubahan"
                  : "Simpan Pengguna"}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}