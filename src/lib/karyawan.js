// lib/karyawan.js

"use client";

import { api } from "./api";


/* =====================================================
   GET ALL KARYAWAN
===================================================== */

export async function getKaryawan(
  user_id,
  session_id
) {

  return api.get({

    action:
      "getKaryawan",

    user_id,
    session_id,

  });

}


/* =====================================================
   GET KARYAWAN BY ID
===================================================== */

export async function getKaryawanById(
  id_karyawan,
  user_id,
  session_id
) {

  if (!id_karyawan) {

    throw new Error(
      "id_karyawan wajib tersedia."
    );

  }


  return api.get({

    action:
      "getKaryawanById",

    id_karyawan,

    user_id,
    session_id,

  });

}


/* =====================================================
   GET MASTER KARYAWAN
===================================================== */

export async function getMasterKaryawan(
  user_id,
  session_id
) {

  return api.get({

    action:
      "getMasterKaryawan",

    user_id,
    session_id,

  });

}


/* =====================================================
   CREATE KARYAWAN
===================================================== */

export async function createKaryawan(
  data,
  user_id,
  session_id
) {

  if (!data) {

    throw new Error(
      "Data karyawan wajib tersedia."
    );

  }


  return api.post({

    action:
      "saveKaryawan",

    user_id,
    session_id,

    ...data,

  });

}


/* =====================================================
   UPDATE KARYAWAN
===================================================== */

export async function updateKaryawan(
  data,
  user_id,
  session_id
) {

  if (!data?.id_karyawan) {

    throw new Error(
      "id_karyawan wajib tersedia untuk memperbarui data."
    );

  }


  return api.post({

    action:
      "saveKaryawan",

    user_id,
    session_id,

    ...data,

  });

}


/* =====================================================
   SAVE KARYAWAN
===================================================== */

export async function saveKaryawan(
  data,
  user_id,
  session_id
) {

  if (!data) {

    throw new Error(
      "Data karyawan wajib tersedia."
    );

  }


  return api.post({

    action:
      "saveKaryawan",

    user_id,
    session_id,

    ...data,

  });

}


/* =====================================================
   DELETE KARYAWAN
===================================================== */

export async function deleteKaryawan(
  id_karyawan,
  user_id,
  session_id
) {

  if (!id_karyawan) {

    throw new Error(
      "id_karyawan wajib tersedia."
    );

  }


  return api.post({

    action:
      "deleteKaryawan",

    user_id,
    session_id,

    id_karyawan,

  });

}