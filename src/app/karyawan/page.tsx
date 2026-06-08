"use client";

import { useEffect, useMemo, useState } from "react";

import AppHeader from "@/components/AppHeader";
import Navbar from "@/components/Navbar";

import "@/style/pages/halaman-karyawan.css";

import { useDataKaryawan } from "@/lib/useDataKaryawan";

import EmployeeListCard from "./components/EmployeeListCard";
import EmployeeDetailCard from "./components/EmployeeDetailCard";

export type TabType =
  | "personal"
  | "keluarga"
  | "kepegawaian"
  | "penempatan"
  | "dokumen";

export type StatusFilter =
  | "Aktif"
  | "Nonaktif"
  | "Semua";

export default function EmployeePage() {
  /* ================= TAB ================= */

  const [activeTab, setActiveTab] =
    useState<TabType>("personal");

  /* ================= FILTER ================= */

  const [searchText, setSearchText] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("Aktif");

  const [
    filterPenempatan,
    setFilterPenempatan,
  ] = useState("");

  /* ================= PAGINATION ================= */

  const [rowsPerPage, setRowsPerPage] =
    useState(10);

  const [currentPage, setCurrentPage] =
    useState(1);

  /* ================= LOCAL STATUS ================= */

  const [
    employeeStatusMap,
    setEmployeeStatusMap,
  ] = useState<Record<string, string>>(
    {}
  );

  const {
    data: karyawanList,
    loading,
    error,
    form,
    selectKaryawan,
    fetchKaryawan,
  } = useDataKaryawan();

  /* ================= FETCH ================= */

  useEffect(() => {
    fetchKaryawan();
  }, [fetchKaryawan]);

  /* ================= INIT STATUS ================= */

  useEffect(() => {
    const initialStatus: Record<
      string,
      string
    > = {};

    karyawanList.forEach((k) => {
      initialStatus[k.id_karyawan] =
        k.status_karyawan || "Aktif";
    });

    setEmployeeStatusMap(initialStatus);
  }, [karyawanList]);

  /* ================= OPTIONS ================= */

  const penempatanOptions = Array.from(
    new Set(
      karyawanList
        .map((k) => k.penempatan)
        .filter(Boolean)
    )
  );

  /* ================= FILTERED DATA ================= */

  const filteredKaryawan = useMemo(() => {
    return karyawanList.filter((k) => {
      const nama = k.nama || "";

      const penempatan =
        k.penempatan || "";

      const currentStatus =
        employeeStatusMap[
          k.id_karyawan
        ] || "Aktif";

      const matchSearch = nama
        .toLowerCase()
        .includes(
          searchText.toLowerCase()
        );

      const matchStatus =
        statusFilter === "Semua"
          ? true
          : currentStatus.toLowerCase() ===
            statusFilter.toLowerCase();

      const matchPenempatan =
        !filterPenempatan ||
        penempatan ===
          filterPenempatan;

      return (
        matchSearch &&
        matchStatus &&
        matchPenempatan
      );
    });
  }, [
    karyawanList,
    employeeStatusMap,
    searchText,
    statusFilter,
    filterPenempatan,
  ]);

  /* ================= PAGINATION ================= */

  const totalData =
    filteredKaryawan.length;

  const totalPages = Math.ceil(
    totalData / rowsPerPage
  );

  const startIndex =
    (currentPage - 1) *
    rowsPerPage;

  const endIndex =
    startIndex + rowsPerPage;

  const paginatedKaryawan =
    filteredKaryawan.slice(
      startIndex,
      endIndex
    );

  /* ================= RESET PAGE ================= */

  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchText,
    statusFilter,
    filterPenempatan,
    rowsPerPage,
  ]);

  /* ================= TOGGLE STATUS ================= */

  const toggleEmployeeStatus = (
    idKaryawan: string
  ) => {
    setEmployeeStatusMap((prev) => ({
      ...prev,
      [idKaryawan]:
        prev[idKaryawan] === "Aktif"
          ? "Nonaktif"
          : "Aktif",
    }));
  };

  return (
    <div className="simakEmployeePage__wrapper">
      <div className="simakEmployeePage__main">

        <AppHeader title="Management Karyawan" />

        <Navbar />

        <div className="simakEmployeePage__content">
          <div className="simakEmployeePage__layout">

            {/* ================= LEFT PANEL ================= */}

            <EmployeeListCard
              loading={loading}
              error={error}
              form={form}
              paginatedKaryawan={
                paginatedKaryawan
              }
              totalData={totalData}
              startIndex={startIndex}
              endIndex={endIndex}
              rowsPerPage={rowsPerPage}
              setRowsPerPage={
                setRowsPerPage
              }
              currentPage={currentPage}
              setCurrentPage={
                setCurrentPage
              }
              totalPages={totalPages}
              searchText={searchText}
              setSearchText={
                setSearchText
              }
              statusFilter={
                statusFilter
              }
              setStatusFilter={
                setStatusFilter
              }
              filterPenempatan={
                filterPenempatan
              }
              setFilterPenempatan={
                setFilterPenempatan
              }
              penempatanOptions={
                penempatanOptions
              }
              employeeStatusMap={
                employeeStatusMap
              }
              toggleEmployeeStatus={
                toggleEmployeeStatus
              }
              selectKaryawan={
                selectKaryawan
              }
            />

            {/* ================= RIGHT PANEL ================= */}

            <EmployeeDetailCard
              form={form}
              activeTab={activeTab}
              setActiveTab={
                setActiveTab
              }
            />

          </div>
        </div>
      </div>
    </div>
  );
}