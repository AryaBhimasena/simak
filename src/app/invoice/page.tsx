"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import AppHeader from "@/components/AppHeader";
import Navbar from "@/components/Navbar";
import { api } from "@/lib/api";

import "@/style/pages/halaman-invoice.css";

import {
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Eye,
  FileText,
  ReceiptText,
  Search,
  Wallet,
  X,
  Download,
  Upload,
} from "lucide-react";

/* ====================================== */
/* TYPES */
/* ====================================== */

type TabType =
  | "monitoring"
  | "buat";

type StatusBayar =
  | "Belum Bayar"
  | "Sudah Bayar";

interface InvoiceItem {
  id: number;
  invoice_id: string;

  client: string;
  kategoriTK: string;
  jumlahAnggota: number;

  nomorInvoice: string;

  tanggalInvoice: string;
  bulanInvoice: string;
  tahunInvoice: number;

  tempoInvoice: string;

  periodeInvoice: string;

  statusBayar:
    | "Belum Bayar"
    | "Sudah Bayar";

  tanggalBayar: string;
  bulanBayar: string;
  tahunBayar: number;

  totalTagihan: number;
  totalPembayaran: number;
  selisih: number;

  managementFee: number;
  totalGaji: number;

  bpjsKesehatan: number;
  bpjsTenagaKerja: number;

  seragam: number;
  peralatan: number;

  thr: number;

  tunjanganLibur: number;

  contractorOverhead: number;

  lembur: number;

  potonganKehadiran: number;

  ppn: number;
  pph: number;

  totalPajak: number;
}

/* ====================================== */
/* CONSTANT */
/* ====================================== */

const TABS = [
  {
    label:
      "Monitoring Invoice",

    value:
      "monitoring",
  },

  {
    label:
      "Buat Invoice",

    value:
      "buat",
  },
];

export default function InvoicePage() {

  /* ====================================== */
  /* STATE */
  /* ====================================== */

  const [activeTab, setActiveTab] =
    useState<TabType>(
      "monitoring"
    );

  const [periode, setPeriode] =
    useState("");

  const [searchText, setSearchText] =
    useState("");

  const [
    kategoriFilter,
    setKategoriFilter,
  ] = useState("Semua");

  const [
    statusFilter,
    setStatusFilter,
  ] = useState("Semua");

  const [
    invoiceList,
    setInvoiceList,
  ] = useState<InvoiceItem[]>(
    []
  );

const [
  loading,
  setLoading,
] = useState(true);

  const [
    selectedInvoice,
    setSelectedInvoice,
  ] =
    useState<InvoiceItem | null>(
      null
    );

  const [
    showDetailModal,
    setShowDetailModal,
  ] = useState(false);

  const [
    showPaymentModal,
    setShowPaymentModal,
  ] = useState(false);

  const [
    nominalBayar,
    setNominalBayar,
  ] = useState("");

const [
  uploadLoading,
  setUploadLoading,
] = useState(false);

const [
  selectedUploadInvoice,
  setSelectedUploadInvoice,
] =
  useState<InvoiceItem | null>(
    null
  );

const [
  showUploadModal,
  setShowUploadModal,
] = useState(false);

const [
  uploadFolderType,
  setUploadFolderType,
] = useState("Faktur");

const [
  uploadFile,
  setUploadFile,
] = useState<File | null>(
  null
);

/* ====================================== */
/* LOAD DATA */
/* ====================================== */

useEffect(() => {

  const today =
    new Date();

  setPeriode(
    `${today.getFullYear()}-${String(
      today.getMonth() + 1
    ).padStart(2, "0")}`
  );

  loadInvoices();

}, []);

const loadInvoices =
  async () => {

    try {

      setLoading(true);

      const response =
        await api.get<InvoiceItem[]>(
          "invoice.list"
        );

      if (!response.success) {

        throw new Error(
          response.message
        );

      }

      setInvoiceList(
        response.data || []
      );

    } catch (error) {

      console.error(
        "Gagal memuat invoice:",
        error
      );

      setInvoiceList([]);

    } finally {

      setLoading(false);

    }

  };
 
const handleUploadInvoice =
  async () => {

    if (
      !selectedUploadInvoice ||
      !uploadFile
    ) {
      return;
    }

    try {

      setUploadLoading(
        true
      );

		const response =
		  await api.uploadInvoiceFile({

			invoice_id:
			  selectedUploadInvoice.invoice_id,

			folder_tahun:
			  String(
				selectedUploadInvoice.tahunInvoice
			  ),

			folder_bulan:
			  String(
				selectedUploadInvoice.bulanInvoice
			  ).padStart(2, "0"),

			folder_tipe:
			  uploadFolderType,

			file:
			  uploadFile,

		  });

      if (
        !response.success
      ) {

        alert(
          response.message
        );

        return;

      }

      alert(
        "File berhasil diupload"
      );

      setShowUploadModal(
        false
      );

      setUploadFile(
        null
      );

    } catch (error) {

      console.error(
        error
      );

      alert(
        "Upload file gagal"
      );

    } finally {

      setUploadLoading(
        false
      );

    }

  };
  
  /* ====================================== */
  /* FILTER DATA */
  /* ====================================== */

const filteredInvoices =
  useMemo(() => {

    const [
      selectedYear,
      selectedMonth,
    ] =
      periode.split("-");

    return invoiceList.filter(
      (item) => {

        const matchPeriode =
          String(
            item.tahunInvoice
          ) ===
            selectedYear &&
          String(
            item.bulanInvoice
          ).padStart(
            2,
            "0"
          ) ===
            selectedMonth;

        const matchSearch =
          item.client
            .toLowerCase()
            .includes(
              searchText.toLowerCase()
            ) ||
          item.nomorInvoice
            .toLowerCase()
            .includes(
              searchText.toLowerCase()
            );

        const matchKategori =
          kategoriFilter ===
            "Semua" ||
          item.kategoriTK ===
            kategoriFilter;

        const matchStatus =
          statusFilter ===
            "Semua" ||
          item.statusBayar ===
            statusFilter;

        return (
          matchPeriode &&
          matchSearch &&
          matchKategori &&
          matchStatus
        );

      }
    );

  }, [
    invoiceList,
    periode,
    searchText,
    kategoriFilter,
    statusFilter,
  ]);
  
const kategoriList =
  useMemo(() => {

    return [
      "Semua",
      ...new Set(
        invoiceList.map(
          (item) =>
            item.kategoriTK
        )
      ),
    ];

  }, [invoiceList]);
  
  /* ====================================== */
  /* SUMMARY */
  /* ====================================== */

  const totalInvoice =
    filteredInvoices.length;

  const totalTagihan =
    filteredInvoices.reduce(
      (
        total,
        item
      ) =>
        total +
        item.totalTagihan,
      0
    );

  const totalBelumBayar =
    filteredInvoices.filter(
      (item) =>
        item.statusBayar ===
        "Belum Bayar"
    ).length;

  const totalSudahBayar =
    filteredInvoices.filter(
      (item) =>
        item.statusBayar ===
        "Sudah Bayar"
    ).length;

  /* ====================================== */
  /* MONTH */
  /* ====================================== */

  const bulanList = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  const currentDate =
    useMemo(() => {

      if (!periode)
        return new Date();

      const [
        year,
        month,
      ] =
        periode.split("-");

      return new Date(
        Number(year),
        Number(month) - 1
      );

    }, [periode]);

  const handlePrevMonth =
    () => {

      const newDate =
        new Date(
          currentDate
        );

      newDate.setMonth(
        newDate.getMonth() - 1
      );

      setPeriode(
        `${newDate.getFullYear()}-${String(
          newDate.getMonth() + 1
        ).padStart(2, "0")}`
      );

    };

  const handleNextMonth =
    () => {

      const newDate =
        new Date(
          currentDate
        );

      newDate.setMonth(
        newDate.getMonth() + 1
      );

      setPeriode(
        `${newDate.getFullYear()}-${String(
          newDate.getMonth() + 1
        ).padStart(2, "0")}`
      );

    };

  /* ====================================== */
  /* FORMAT */
  /* ====================================== */

  const formatCurrency = (
    value: number
  ) => {

    return new Intl.NumberFormat(
      "id-ID",
      {
        style:
          "currency",

        currency:
          "IDR",

        maximumFractionDigits: 0,
      }
    ).format(value);

  };

  const totalSelisih =
    selectedInvoice
      ? selectedInvoice.totalTagihan -
        Number(
          nominalBayar || 0
        )
      : 0;

  return (
    <div className="simakInvoicePage__wrapper">

      <div className="simakInvoicePage__main">

        <AppHeader title="Management Invoice" />

        <Navbar />

        <div className="simakInvoicePage__content">

          {/* ====================================== */}
          {/* HERO */}
          {/* ====================================== */}

<section className="simakInvoicePage__pageHeader">

  <div className="simakInvoicePage__pageHeaderLeft">

    <h1 className="simakInvoicePage__pageTitle">
      Management Invoice
    </h1>

    <p className="simakInvoicePage__pageDescription">
      Monitoring invoice, pembayaran client,
      dan validasi penerimaan invoice.
    </p>

  </div>

  <div className="simakInvoicePage__tabs">

    {TABS.map((tab) => (

      <button
        key={tab.value}
        onClick={() =>
          setActiveTab(
            tab.value as TabType
          )
        }
        className={`simakInvoicePage__tab ${
          activeTab === tab.value
            ? "simakInvoicePage__tab--active"
            : ""
        }`}
      >

        {tab.label}

      </button>

    ))}

  </div>

</section>

          {/* ====================================== */}
          {/* MONITORING */}
          {/* ====================================== */}

{activeTab ===
  "monitoring" && (

  <section className="simakInvoicePage__panel">

    {/* ====================================== */}
    {/* HEADER */}
    {/* ====================================== */}

    <div className="simakInvoicePage__panelHeader">

      <div>

        <div className="simakInvoicePage__panelTitle">
          Monitoring Invoice
        </div>

        <div className="simakInvoicePage__panelSubtitle">
          Monitoring seluruh invoice,
          status pembayaran, dan
          rincian tagihan client.
        </div>

      </div>

      <div className="simakInvoicePage__monthPicker">

        <button
          className="simakInvoicePage__monthBtn"
          onClick={
            handlePrevMonth
          }
        >
          <ChevronLeft size={18} />
        </button>

        <div className="simakInvoicePage__monthInfo">

          <CalendarDays size={16} />

          <div>

            <div className="simakInvoicePage__monthName">
              {
                bulanList[
                  currentDate.getMonth()
                ]
              }
            </div>

            <div className="simakInvoicePage__yearName">
              {
                currentDate.getFullYear()
              }
            </div>

          </div>

        </div>

        <button
          className="simakInvoicePage__monthBtn"
          onClick={
            handleNextMonth
          }
        >
          <ChevronRight size={18} />
        </button>

      </div>

    </div>

    {/* ====================================== */}
    {/* SUMMARY */}
    {/* ====================================== */}

    <div className="simakInvoicePage__summaryGrid">

      <div className="simakInvoicePage__summaryCard">

        <div className="simakInvoicePage__summaryLabel">
          Total Invoice
        </div>

        <div className="simakInvoicePage__summaryValue">
          {totalInvoice}
        </div>

      </div>

      <div className="simakInvoicePage__summaryCard">

        <div className="simakInvoicePage__summaryLabel">
          Belum Bayar
        </div>

        <div className="simakInvoicePage__summaryValue">
          {totalBelumBayar}
        </div>

      </div>

      <div className="simakInvoicePage__summaryCard">

        <div className="simakInvoicePage__summaryLabel">
          Sudah Bayar
        </div>

        <div className="simakInvoicePage__summaryValue">
          {totalSudahBayar}
        </div>

      </div>

      <div className="simakInvoicePage__summaryCard">

        <div className="simakInvoicePage__summaryLabel">
          Total Tagihan
        </div>

        <div className="simakInvoicePage__summaryValue">
          {formatCurrency(
            totalTagihan
          )}
        </div>

      </div>

    </div>

    {/* ====================================== */}
    {/* FILTER */}
    {/* ====================================== */}

    <div className="simakInvoicePage__toolbar">

      <div className="simakInvoicePage__searchBox">

        <Search size={16} />

        <input
          type="text"
          placeholder="Cari client atau invoice..."
          value={
            searchText
          }
          onChange={(e) =>
            setSearchText(
              e.target.value
            )
          }
        />

      </div>

<select
  value={kategoriFilter}
  onChange={(e) =>
    setKategoriFilter(
      e.target.value
    )
  }
  className="simakInvoicePage__filterSelect"
>
  {kategoriList.map(
    (kategori) => (

      <option
        key={kategori}
      >
        {kategori}
      </option>

    )
  )}
</select>

      <select
        value={
          statusFilter
        }
        onChange={(e) =>
          setStatusFilter(
            e.target.value
          )
        }
        className="simakInvoicePage__filterSelect"
      >

        <option>
          Semua
        </option>

        <option>
          Belum Bayar
        </option>

        <option>
          Sudah Bayar
        </option>

      </select>

      <div className="simakInvoicePage__summary">

        <div className="simakInvoicePage__summaryBadge">

          <ReceiptText
            size={14}
          />

          {
            filteredInvoices.length
          }{" "}
          Invoice

        </div>

      </div>

    </div>

    {/* ====================================== */}
    {/* TABLE */}
    {/* ====================================== */}

    <div className="simakInvoicePage__tableWrapper">

      <table className="simakInvoicePage__table">

        <thead>

          <tr>

            <th>
              Invoice
            </th>

            <th>
              Client
            </th>

            <th>
              Kategori
            </th>

            <th>
              Anggota
            </th>

            <th>
              Periode
            </th>

            <th>
              Total Tagihan
            </th>

            <th>
              Status
            </th>

            <th>
              Aksi
            </th>

          </tr>

        </thead>

<tbody>

  {loading ? (

    <tr>
      <td
        colSpan={8}
        style={{
          textAlign: "center",
        }}
      >
        Memuat data invoice...
      </td>
    </tr>

  ) : filteredInvoices.length === 0 ? (

    <tr>
      <td
        colSpan={8}
        style={{
          textAlign: "center",
        }}
      >
        Tidak ada data invoice
      </td>
    </tr>

  ) : (

    filteredInvoices.map(
      (invoice) => (

        <tr
          key={
            invoice.nomorInvoice
          }
        >

          <td>

            <div className="simakInvoicePage__invoiceCell">

              <div className="simakInvoicePage__invoiceIcon">
                <FileText size={16} />
              </div>

              <div>

                <div className="simakInvoicePage__invoiceId">
                  {invoice.nomorInvoice}
                </div>

                <div className="simakInvoicePage__invoiceSub">
                  Invoice Client
                </div>

              </div>

            </div>

          </td>

          <td>

            <div className="simakInvoicePage__clientName">
              {invoice.client}
            </div>

          </td>

          <td>
            {invoice.kategoriTK}
          </td>

          <td>
            {invoice.jumlahAnggota} Orang
          </td>

          <td>
            {invoice.periodeInvoice}
          </td>

          <td>

            <div className="simakInvoicePage__amount">
              {formatCurrency(
                invoice.totalTagihan
              )}
            </div>

          </td>

          <td>

            <div
              className={`simakInvoicePage__status ${
                invoice.statusBayar ===
                "Sudah Bayar"
                  ? "simakInvoicePage__status--paid"
                  : "simakInvoicePage__status--unpaid"
              }`}
            >

              {invoice.statusBayar}

            </div>

          </td>

          <td>

            <div className="simakInvoicePage__actionGroup">

              <button
                className="simakInvoicePage__detailBtn"
                onClick={() => {

                  setSelectedInvoice(
                    invoice
                  );

                  setShowDetailModal(
                    true
                  );

                }}
              >

                <Eye size={15} />

                Detail

              </button>

              <button
                className="simakInvoicePage__payBtn"
                onClick={() => {

                  setSelectedInvoice(
                    invoice
                  );

                  setShowPaymentModal(
                    true
                  );

                }}
              >

                Bayar

              </button>

<button
  className="simakInvoicePage__downloadBtn"
  onClick={() => {

    setSelectedUploadInvoice(
      invoice
    );

    setShowUploadModal(
      true
    );

  }}
>

  <Upload size={15} />

  Upload

</button>

<button
  className="simakInvoicePage__detailBtn"
  onClick={async () => {

    try {

      const response =
        await api.invoiceFiles(
          invoice.invoice_id
        );

      if (
        response.data.length === 0
      ) {

        alert(
          "Belum ada file"
        );

        return;

      }

      window.open(
        response.data[0].url,
        "_blank"
      );

    } catch {

      alert(
        "Gagal membaca file"
      );

    }

  }}
>

  <Download size={15} />

  File

</button>

            </div>

          </td>

        </tr>

      )
    )

  )}

</tbody>

      </table>

    </div>

  </section>

)}

          {/* ====================================== */}
          {/* BUAT INVOICE */}
          {/* ====================================== */}

          {activeTab ===
            "buat" && (

            <section className="simakInvoicePage__development">

              <div className="simakInvoicePage__developmentIcon">

                <Wallet size={38} />

              </div>

              <h2>
                Halaman Sedang
                Dalam Pengembangan
              </h2>

              <p>
                Fitur pembuatan
                invoice sedang
                dipersiapkan dan
                akan segera
                tersedia.
              </p>

            </section>

          )}

        </div>

      </div>

{/* ====================================== */}
{/* DETAIL MODAL */}
{/* ====================================== */}

{showDetailModal &&
  selectedInvoice && (

    <div className="simakInvoicePage__modalOverlay">

      <div className="simakInvoicePage__modal simakInvoicePage__modal--large">

        <div className="simakInvoicePage__modalHeader">

          <div>

            <div className="simakInvoicePage__modalTitle">
              Detail Invoice
            </div>

            <div className="simakInvoicePage__modalSubtitle">
              {
                selectedInvoice.nomorInvoice
              }
            </div>

          </div>

          <button
            className="simakInvoicePage__closeBtn"
            onClick={() =>
              setShowDetailModal(
                false
              )
            }
          >
            <X size={18} />
          </button>

        </div>

        {/* ====================================== */}
        {/* INFORMASI */}
        {/* ====================================== */}

        <div className="simakInvoicePage__detailSection">

          <h3>
            Informasi Invoice
          </h3>

          <div className="simakInvoicePage__detailGrid">

            <div>
              <span>
                Client
              </span>

              <strong>
                {
                  selectedInvoice.client
                }
              </strong>
            </div>

            <div>
              <span>
                Kategori TK
              </span>

              <strong>
                {
                  selectedInvoice.kategoriTK
                }
              </strong>
            </div>

            <div>
              <span>
                Jumlah Anggota
              </span>

              <strong>
                {
                  selectedInvoice.jumlahAnggota
                } Orang
              </strong>
            </div>

            <div>
              <span>
                Periode
              </span>

              <strong>
                {
                  selectedInvoice.periodeInvoice
                }
              </strong>
            </div>

            <div>
              <span>
                Tanggal Invoice
              </span>

              <strong>
                {
                  selectedInvoice.tanggalInvoice
                }
              </strong>
            </div>

            <div>
              <span>
                Jatuh Tempo
              </span>

              <strong>
                {
                  selectedInvoice.tempoInvoice
                }
              </strong>
            </div>

          </div>

        </div>

        {/* ====================================== */}
        {/* KOMPONEN TAGIHAN */}
        {/* ====================================== */}

        <div className="simakInvoicePage__detailSection">

          <h3>
            Komponen Tagihan
          </h3>

          <div className="simakInvoicePage__breakdown">

            <div>
              <span>
                Management Fee
              </span>

              <strong>
                {formatCurrency(
                  selectedInvoice.managementFee
                )}
              </strong>
            </div>

            <div>
              <span>
                Total Gaji
              </span>

              <strong>
                {formatCurrency(
                  selectedInvoice.totalGaji
                )}
              </strong>
            </div>

            <div>
              <span>
                BPJS Kesehatan
              </span>

              <strong>
                {formatCurrency(
                  selectedInvoice.bpjsKesehatan
                )}
              </strong>
            </div>

            <div>
              <span>
                BPJS Tenaga Kerja
              </span>

              <strong>
                {formatCurrency(
                  selectedInvoice.bpjsTenagaKerja
                )}
              </strong>
            </div>

            <div>
              <span>
                Seragam
              </span>

              <strong>
                {formatCurrency(
                  selectedInvoice.seragam
                )}
              </strong>
            </div>

            <div>
              <span>
                Peralatan
              </span>

              <strong>
                {formatCurrency(
                  selectedInvoice.peralatan
                )}
              </strong>
            </div>

            <div>
              <span>
                THR
              </span>

              <strong>
                {formatCurrency(
                  selectedInvoice.thr
                )}
              </strong>
            </div>

            <div>
              <span>
                Tunjangan Libur
              </span>

              <strong>
                {formatCurrency(
                  selectedInvoice.tunjanganLibur
                )}
              </strong>
            </div>

            <div>
              <span>
                Contractor Overhead
              </span>

              <strong>
                {formatCurrency(
                  selectedInvoice.contractorOverhead
                )}
              </strong>
            </div>

            <div>
              <span>
                Lembur
              </span>

              <strong>
                {formatCurrency(
                  selectedInvoice.lembur
                )}
              </strong>
            </div>

            <div>
              <span>
                Potongan Kehadiran
              </span>

              <strong>
                -
                {formatCurrency(
                  selectedInvoice.potonganKehadiran
                )}
              </strong>
            </div>

          </div>

        </div>

        {/* ====================================== */}
        {/* PAJAK */}
        {/* ====================================== */}

        <div className="simakInvoicePage__detailSection">

          <h3>
            Pajak
          </h3>

          <div className="simakInvoicePage__breakdown">

            <div>
              <span>
                PPN
              </span>

              <strong>
                {formatCurrency(
                  selectedInvoice.ppn
                )}
              </strong>
            </div>

            <div>
              <span>
                PPH
              </span>

              <strong>
                {formatCurrency(
                  selectedInvoice.pph
                )}
              </strong>
            </div>

            <div>
              <span>
                Total Pajak
              </span>

              <strong>
                {formatCurrency(
                  selectedInvoice.totalPajak
                )}
              </strong>
            </div>

          </div>

        </div>

        {/* ====================================== */}
        {/* RINGKASAN */}
        {/* ====================================== */}

        <div className="simakInvoicePage__summaryBox">

          <div>

            <span>
              Total Tagihan
            </span>

            <strong>
              {formatCurrency(
                selectedInvoice.totalTagihan
              )}
            </strong>

          </div>

          <div>

            <span>
              Total Pembayaran
            </span>

            <strong>
              {formatCurrency(
                selectedInvoice.totalPembayaran
              )}
            </strong>

          </div>

          <div>

            <span>
              Selisih
            </span>

            <strong>
              {formatCurrency(
                selectedInvoice.selisih
              )}
            </strong>

          </div>

        </div>

      </div>

    </div>

)}

{/* ====================================== */}
{/* PAYMENT MODAL */}
{/* ====================================== */}

{showPaymentModal &&
  selectedInvoice && (

    <div className="simakInvoicePage__modalOverlay">

      <div className="simakInvoicePage__modal">

        <div className="simakInvoicePage__modalHeader">

          <div>

            <div className="simakInvoicePage__modalTitle">
              Pembayaran Invoice
            </div>

            <div className="simakInvoicePage__modalSubtitle">
              {
                selectedInvoice.nomorInvoice
              }
            </div>

          </div>

          <button
            className="simakInvoicePage__closeBtn"
            onClick={() =>
              setShowPaymentModal(
                false
              )
            }
          >
            <X size={18} />
          </button>

        </div>

        {/* ====================================== */}
        {/* REFERENCE */}
        {/* ====================================== */}

        <div className="simakInvoicePage__paymentReference">

          <div>

            <span>
              Client
            </span>

            <strong>
              {
                selectedInvoice.client
              }
            </strong>

          </div>

          <div>

            <span>
              Periode
            </span>

            <strong>
              {
                selectedInvoice.periodeInvoice
              }
            </strong>

          </div>

          <div>

            <span>
              Total Tagihan
            </span>

            <strong>
              {formatCurrency(
                selectedInvoice.totalTagihan
              )}
            </strong>

          </div>

          <div>

            <span>
              Total Pembayaran
            </span>

            <strong>
              {formatCurrency(
                selectedInvoice.totalPembayaran
              )}
            </strong>

          </div>

          <div>

            <span>
              Selisih
            </span>

            <strong>
              {formatCurrency(
                selectedInvoice.selisih
              )}
            </strong>

          </div>

          <div>

            <span>
              Status
            </span>

            <strong>
              {
                selectedInvoice.statusBayar
              }
            </strong>

          </div>

        </div>

        {/* ====================================== */}
        {/* FORM */}
        {/* ====================================== */}

        <div className="simakInvoicePage__formGrid">

          <div className="simakInvoicePage__inputGroup">

            <label>
              Tanggal Bayar
            </label>

            <input
              type="date"
            />

          </div>

          <div className="simakInvoicePage__inputGroup">

            <label>
              Nominal Bayar
            </label>

            <input
              type="number"
              value={
                nominalBayar
              }
              placeholder="Masukkan nominal pembayaran"
              onChange={(e) =>
                setNominalBayar(
                  e.target.value
                )
              }
            />

          </div>

        </div>

        {/* ====================================== */}
        {/* VALIDASI */}
        {/* ====================================== */}

        <div className="simakInvoicePage__differenceCard">

          <div>

            <div className="simakInvoicePage__differenceLabel">
              Selisih Setelah Pembayaran
            </div>

            <div className="simakInvoicePage__differenceValue">

              {formatCurrency(
                totalSelisih
              )}

            </div>

          </div>

          <div className="simakInvoicePage__differenceBadge">

            <CheckCircle2
              size={14}
            />

            Validasi Pembayaran

          </div>

        </div>

        {/* ====================================== */}
        {/* ACTION */}
        {/* ====================================== */}

        <div className="simakInvoicePage__modalAction">

          <button
            className="simakInvoicePage__cancelBtn"
            onClick={() =>
              setShowPaymentModal(
                false
              )
            }
          >
            Batal
          </button>

          <button
            className="simakInvoicePage__saveBtn"
          >
            Simpan Pembayaran
          </button>

        </div>

      </div>

    </div>

)}

{/* ====================================== */}
{/* UPLOAD MODAL */}
{/* ====================================== */}

{showUploadModal &&
  selectedUploadInvoice && (

  <div className="simakInvoicePage__modalOverlay">

    <div className="simakInvoicePage__modal">

      <div className="simakInvoicePage__modalHeader">

        <div>

          <div className="simakInvoicePage__modalTitle">
            Upload File Invoice
          </div>

          <div className="simakInvoicePage__modalSubtitle">
            {
              selectedUploadInvoice.nomorInvoice
            }
          </div>

        </div>

        <button
          className="simakInvoicePage__closeBtn"
          onClick={() =>
            setShowUploadModal(
              false
            )
          }
        >
          <X size={18} />
        </button>

      </div>

      <div className="simakInvoicePage__formGrid">
<div className="simakInvoicePage__uploadInfo">

  <div className="simakInvoicePage__uploadInfoLabel">

    <div className="simakInvoicePage__uploadInfoTitle">
      Lokasi Penyimpanan
    </div>

    <div className="simakInvoicePage__uploadInfoValue">
      {selectedUploadInvoice.tahunInvoice}
      /
      {String(
        selectedUploadInvoice.bulanInvoice
      ).padStart(2, "0")}
      /
      {uploadFolderType}
    </div>

  </div>

  <div className="simakInvoicePage__folderBadge">
    Google Drive
  </div>

</div>

        <div className="simakInvoicePage__inputGroup">

          <label>
            Tipe File
          </label>

<select
  value={
    uploadFolderType
  }
  onChange={(e) =>
    setUploadFolderType(
      e.target.value
    )
  }
>

  <option value="Faktur">
    Faktur
  </option>

  <option value="Non-Faktur">
    Non-Faktur
  </option>

</select>

        </div>

        <div className="simakInvoicePage__inputGroup">

          <label>
            Pilih File
          </label>

          <input
            type="file"
            onChange={(e) =>
              setUploadFile(
                e.target.files?.[0] ??
                  null
              )
            }
          />

        </div>

      </div>

      <div className="simakInvoicePage__modalAction">

        <button
          className="simakInvoicePage__cancelBtn"
          onClick={() =>
            setShowUploadModal(
              false
            )
          }
        >
          Batal
        </button>

        <button
          className="simakInvoicePage__saveBtn"
          disabled={
            uploadLoading
          }
          onClick={
            handleUploadInvoice
          }
        >

          {uploadLoading
            ? "Uploading..."
            : "Upload File"}

        </button>

      </div>

    </div>

  </div>

)}
    </div>
  );
}