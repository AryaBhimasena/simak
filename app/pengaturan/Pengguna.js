'use client';

import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { getAllUsers, deleteUser, setUser } from '@/services/userService';

export default function Pengguna() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // ambil data user dari Firestore
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllUsers();
        setUsers(data);
      } catch (error) {
        console.error('Gagal ambil data pengguna:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Semua role valid, bisa diperluas jika ada role baru
  const allRoles = ['User', 'Staff', 'Admin', 'SuperAdmin'];

  const handleAddUser = async () => {
    const optionsHtml = allRoles
      .map(r => `<option value="${r.toLowerCase()}">${r}</option>`)
      .join('');

    const { value: formValues } = await Swal.fire({
      title: 'Tambah Pengguna',
      html: `
        <div class="swal2-form-row">
          <input id="swal-email" class="swal2-input-pengguna" placeholder="Email">
          <select id="swal-role" class="swal2-select-pengguna">${optionsHtml}</select>
        </div>
        <p style="font-size:0.85rem;color:#6b7280;margin-top:0.5rem;">
          Untuk aktivasi akun dan password login, harap hubungi Sistem Administrator
        </p>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Submit',
      cancelButtonText: 'Cancel',
      buttonsStyling: false,
      preConfirm: () => {
        const email = document.getElementById('swal-email').value;
        const role = document.getElementById('swal-role').value;
        if (!email) Swal.showValidationMessage('Email wajib diisi');
        return { email, role };
      },
      customClass: {
        popup: 'swal2-popup-pengguna',
        confirmButton: 'swal2-confirm-pengguna',
        cancelButton: 'swal2-cancel-pengguna',
      },
    });

    if (formValues) {
      try {
        const uid = crypto.randomUUID();
        const titleCaseRole = formValues.role.charAt(0).toUpperCase() + formValues.role.slice(1).toLowerCase();
        await setUser(uid, { email: formValues.email, role: titleCaseRole });
        setUsers(prev => [...prev, { uid, email: formValues.email, role: titleCaseRole }]);
        Swal.fire('Berhasil!', 'Pengguna berhasil ditambahkan.', 'success');
      } catch (error) {
        console.error(error);
        Swal.fire('Gagal', 'Terjadi kesalahan saat menambahkan pengguna.', 'error');
      }
    }
  };

  const handleEditUser = async (user) => {
    const firestoreRole = user.role ?? 'User';
    const currentRole = firestoreRole.toLowerCase();

    const optionsHtml = allRoles
      .map(r => `<option value="${r.toLowerCase()}" ${r.toLowerCase() === currentRole ? 'selected' : ''}>${r}</option>`)
      .join('');

    const { value: formValues } = await Swal.fire({
      title: `Edit Role Pengguna`,
      html: `
        <div class="swal2-form-row">
          <input id="swal-email" class="swal2-input-pengguna" value="${user.email}" readonly>
          <select id="swal-role" class="swal2-select-pengguna">${optionsHtml}</select>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Submit',
      cancelButtonText: 'Cancel',
      buttonsStyling: false,
      preConfirm: () => {
        const role = document.getElementById('swal-role').value;
        return { role };
      },
      customClass: {
        popup: 'swal2-popup-pengguna',
        confirmButton: 'swal2-confirm-pengguna',
        cancelButton: 'swal2-cancel-pengguna',
      },
    });

    if (formValues && formValues.role.toLowerCase() !== currentRole) {
      try {
        const id = user.uid || user.id;
        const updatedRole = formValues.role.charAt(0).toUpperCase() + formValues.role.slice(1).toLowerCase();
        await setUser(id, { ...user, role: updatedRole });
        setUsers(prev =>
          prev.map(u => (u.uid === id || u.id === id ? { ...u, role: updatedRole } : u))
        );
        Swal.fire('Berhasil!', 'Role pengguna berhasil diperbarui.', 'success');
      } catch (error) {
        console.error(error);
        Swal.fire('Gagal', 'Terjadi kesalahan saat memperbarui role.', 'error');
      }
    }
  };

  const handleDelete = async (idOrUid) => {
    if (!confirm('Yakin ingin menghapus pengguna ini?')) return;
    try {
      await deleteUser(idOrUid);
      setUsers(prev => prev.filter(u => (u.uid || u.id) !== idOrUid));
    } catch (error) {
      console.error('Gagal hapus pengguna:', error);
    }
  };

  return (
    <div className="pengguna-container">
      <div className="pengguna-header">
        <button
          onClick={handleAddUser}
          className="btn-add"
          aria-label="Tambah Pengguna"
          title="Tambah Pengguna"
        >
          + Tambah Pengguna
        </button>
      </div>

      <div className="pengguna-content">
        {loading ? (
          <p className="pengguna-loading">Sedang memuat...</p>
        ) : users.length === 0 ? (
          <p className="pengguna-empty">Belum ada pengguna.</p>
        ) : (
          <table className="pengguna-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Role</th>
                <th style={{ width: 140 }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => {
                const id = user.uid || user.id;
                return (
                  <tr key={id}>
                    <td>{user.email}</td>
                    <td>
                      <span className={`role-badge role-${user.role ?? 'user'}`}>
                        {user.role ?? 'user'}
                      </span>
                    </td>
                    <td className="aksi-cell">
                      <button onClick={() => handleEditUser(user)} className="btn-edit">Edit</button>
                      <button onClick={() => handleDelete(id)} className="btn-delete">Hapus</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
