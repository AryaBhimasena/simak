// lib/karyawan.js
"use client";

import { api } from "./api";

// GET ALL
export const getKaryawan = (user_id, session_id) =>
  api.get({ action: "getKaryawan", user_id, session_id });

// GET BY ID
export async function getKaryawanById(id_karyawan, user_id, session_id) {
  if (!id_karyawan) throw new Error("id_karyawan wajib tersedia.");
  return api.get({ action: "getKaryawanById", id_karyawan, user_id, session_id });
}

// GET MASTER
export const getMasterKaryawan = (user_id, session_id) =>
  api.get({ action: "getMasterKaryawan", user_id, session_id });

// CREATE
export async function createKaryawan(data, user_id, session_id) {
  if (!data) throw new Error("Data karyawan wajib tersedia.");
  return api.post({ action: "saveKaryawan", user_id, session_id, ...data });
}

// UPDATE
export async function updateKaryawan(data, user_id, session_id) {
  if (!data?.id_karyawan)
    throw new Error("id_karyawan wajib tersedia untuk memperbarui data.");
  return api.post({ action: "saveKaryawan", user_id, session_id, ...data });
}

// SAVE
export async function saveKaryawan(data, user_id, session_id) {
  if (!data) throw new Error("Data karyawan wajib tersedia.");
  return api.post({ action: "saveKaryawan", user_id, session_id, ...data });
}

// DELETE
export async function deleteKaryawan(id_karyawan, user_id, session_id) {
  if (!id_karyawan) throw new Error("id_karyawan wajib tersedia.");
  return api.post({ action: "deleteKaryawan", user_id, session_id, id_karyawan });
}
