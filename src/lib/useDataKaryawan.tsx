"use client";

import { useKaryawanStore } from "@/store/useKaryawanStore";

export function useDataKaryawan() {
  const {
    data,
    loading,
    error,
    form,
    fetchKaryawan,
    selectKaryawan,
    handleChange,
    resetForm,
  } = useKaryawanStore();

  return {
    data,
    loading,
    error,
    form,
    fetchKaryawan,
    selectKaryawan,
    handleChange,
    resetForm,
  };
}
