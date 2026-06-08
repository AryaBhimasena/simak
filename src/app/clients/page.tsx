"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import AppHeader from "@/components/AppHeader";
import Navbar from "@/components/Navbar";

import ClientListCard from "./components/ClientListCard";
import ClientDetail from "./components/ClientDetail";

import { api } from "@/lib/api";

import "@/style/pages/halaman-clients.css";
import "@/style/pages/clients/clients-data-card.css";
import "@/style/pages/clients/clients-list-card.css";

export default function ClientsPage() {

  /* ====================================== */
  /* EMPTY CLIENT */
  /* ====================================== */

const emptyClient = {

  id: "",

  kodeClients: "-",
  namaClients: "-",
  namaGedung: "-",
  alamatClients: "-",
  kotaClients: "-",
  kodePos: "-",
  kontakClients: "-",

  pic: "-",
  kontakPic: "-",

  npwp: "",

  contracts: [],

};

const emptyContract = {

  idKontrak: "-",
  nomorKontrak: "-",

  kategoriTk: "-",

  startDate: "-",
  endDate: "-",

  statusKontrak: "-",

  managementFee: 0,

  gajiPokok: 0,

  tunjanganJabatan: 0,
  tunjanganMakan: 0,
  tunjanganTransportasi: 0,

  tarifBkoReguler: 0,
  tarifBkoResign: 0,
  tarifBkoCuti: 0,

  peralatan: 0,
  thr: 0,
  seragam: 0,

  liburNasional: 0,
  liburSabtuMinggu: 0,

  bpjsNaker: 0,
  bpjsKesehatan: 0,

  cutOffGaji: "-",
  cutOffInvoice: "-",

  contractorOverhead: 0,

  ritDalamKota: 0,
  ritLuarKota: 0,

  dokumenKontrak: "",
  dokumenBreakdown: "",

};

  /* ====================================== */
  /* HELPER */
  /* ====================================== */

  const safeString = (
    value: any,
    fallback = "-"
  ) => {

    if (
      value === undefined ||
      value === null
    ) {
      return fallback;
    }

    const stringValue =
      String(value).trim();

    return stringValue || fallback;

  };

  const safeNumber = (
    value: any,
    fallback = 0
  ) => {

    if (
      value === undefined ||
      value === null ||
      value === ""
    ) {
      return fallback;
    }

    const parsed =
      Number(value);

    return Number.isNaN(parsed)
      ? fallback
      : parsed;

  };

  const safeFile = (
    value: any
  ) => {

    if (
      value === undefined ||
      value === null
    ) {
      return "";
    }

    return String(value);

  };

  /* ====================================== */
  /* STATE */
  /* ====================================== */

  const [searchText, setSearchText] =
    useState("");

  const [clients, setClients] =
    useState<any[]>([]);

  const [selectedClient, setSelectedClient] =
    useState<any | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  /* ====================================== */
  /* LOAD API */
  /* ====================================== */

  useEffect(() => {

    async function loadClients() {

      try {

        setIsLoading(true);

        const response =
          await api.get(
            "client.list"
          );

        /* ====================================== */
        /* VALIDASI RESPONSE */
        /* ====================================== */

        if (
          !response ||
          typeof response !== "object"
        ) {

          setClients([]);
          setSelectedClient(null);

          return;
        }

        if (
          !response?.success ||
          !Array.isArray(
            response?.data
          )
        ) {

          setClients([]);
          setSelectedClient(null);

          return;
        }

        /* ====================================== */
        /* NORMALIZE DATA */
        /* ====================================== */

const mappedClients =
  response.data
    .filter(
      (item: any) =>
        item &&
        typeof item === "object"
    )
    .map(
      (
        item: any,
        index: number
      ) => {

        try {

          const contracts =
            Array.isArray(
              item?.contracts
            )
              ? item.contracts.map(
                  (
                    contract: any,
                    contractIndex: number
                  ) => ({

                    ...emptyContract,

                    idKontrak:
                      safeString(
                        contract?.[
                          "id_kontrak"
                        ],
                        `CONTRACT-${contractIndex}`
                      ),

                    nomorKontrak:
                      safeString(
                        contract?.[
                          "nomor_kontrak"
                        ]
                      ),

                    kategoriTk:
                      safeString(
                        contract?.[
                          "kategori_tk"
                        ]
                      ),

                    startDate:
                      safeString(
                        contract?.[
                          "start_date"
                        ]
                      ),

                    endDate:
                      safeString(
                        contract?.[
                          "end_date"
                        ]
                      ),

                    statusKontrak:
                      safeString(
                        contract?.[
                          "status_kontrak"
                        ]
                      ),

                    managementFee:
                      safeNumber(
                        contract?.[
                          "management_fee"
                        ]
                      ),

                    gajiPokok:
                      safeNumber(
                        contract?.[
                          "gaji_pokok"
                        ]
                      ),

                    tunjanganJabatan:
                      safeNumber(
                        contract?.[
                          "tunj_jabatan"
                        ]
                      ),

                    tunjanganMakan:
                      safeNumber(
                        contract?.[
                          "tunj_makan"
                        ]
                      ),

                    tunjanganTransportasi:
                      safeNumber(
                        contract?.[
                          "tunj_transportasi"
                        ]
                      ),

                    tarifBkoReguler:
                      safeNumber(
                        contract?.[
                          "tarif_bko_reguler"
                        ]
                      ),

                    tarifBkoResign:
                      safeNumber(
                        contract?.[
                          "tarif_bko_resign"
                        ]
                      ),

                    tarifBkoCuti:
                      safeNumber(
                        contract?.[
                          "tarif_bko_cuti"
                        ]
                      ),

                    peralatan:
                      safeNumber(
                        contract?.[
                          "peralatan"
                        ]
                      ),

                    thr:
                      safeNumber(
                        contract?.["thr"]
                      ),

                    seragam:
                      safeNumber(
                        contract?.[
                          "seragam"
                        ]
                      ),

                    liburNasional:
                      safeNumber(
                        contract?.[
                          "libur_nasional"
                        ]
                      ),

                    liburSabtuMinggu:
                      safeNumber(
                        contract?.[
                          "libur_sabtu_minggu"
                        ]
                      ),

                    bpjsNaker:
                      safeNumber(
                        contract?.[
                          "bpjs_naker"
                        ]
                      ),

                    bpjsKesehatan:
                      safeNumber(
                        contract?.[
                          "bpjs_kesehatan"
                        ]
                      ),

                    cutOffGaji:
                      safeString(
                        contract?.[
                          "cut_off_gaji"
                        ]
                      ),

                    cutOffInvoice:
                      safeString(
                        contract?.[
                          "cut_off_invoice"
                        ]
                      ),

                    contractorOverhead:
                      safeNumber(
                        contract?.[
                          "contractor_overhead"
                        ]
                      ),

                    ritDalamKota:
                      safeNumber(
                        contract?.[
                          "rit_dalam_kota"
                        ]
                      ),

                    ritLuarKota:
                      safeNumber(
                        contract?.[
                          "rit_luar_kota"
                        ]
                      ),

                    dokumenKontrak:
                      safeFile(
                        contract?.[
                          "dokumen_kontrak"
                        ]
                      ),

                    dokumenBreakdown:
                      safeFile(
                        contract?.[
                          "dokumen_breakdown"
                        ]
                      ),

                  })
                )
              : [];

          return {

            ...emptyClient,

            id:
              safeString(
                item?.[
                  "kode_client"
                ],
                `CLIENT-${index}`
              ),

            kodeClients:
              safeString(
                item?.[
                  "kode_client"
                ]
              ),

            namaClients:
              safeString(
                item?.[
                  "nama_client"
                ]
              ),

            namaGedung:
              safeString(
                item?.[
                  "nama_gedung"
                ]
              ),

            alamatClients:
              safeString(
                item?.[
                  "alamat_client"
                ]
              ),

            kotaClients:
              safeString(
                item?.[
                  "kota_client"
                ]
              ),

            kodePos:
              safeString(
                item?.[
                  "kode_pos"
                ]
              ),

            kontakClients:
              safeString(
                item?.[
                  "kontak_client"
                ]
              ),

            pic:
              safeString(
                item?.["pic"]
              ),

            kontakPic:
              safeString(
                item?.[
                  "kontak_pic"
                ]
              ),

            npwp:
              safeFile(
                item?.["npwp_client"]
              ),

            contracts,

          };

        } catch (itemError) {

          console.error(
            "Gagal mapping client:",
            itemError
          );

          return {
            ...emptyClient,
            id: `ERROR-${index}`,
          };

        }
      }
    );
	
        /* ====================================== */
        /* SET STATE */
        /* ====================================== */

        setClients(
          mappedClients
        );

        setSelectedClient(
          mappedClients?.[0] ||
            null
        );

      } catch (error) {

        console.error(
          "Gagal load client:",
          error
        );

        setClients([]);
        setSelectedClient(null);

      } finally {

        setIsLoading(false);

      }
    }

    loadClients();

  }, []);

  /* ====================================== */
  /* FILTER */
  /* ====================================== */

  const filteredClients =
    useMemo(() => {

      return clients.filter(
        (client) =>
          (
            client?.namaClients ||
            ""
          )
            .toLowerCase()
            .includes(
              searchText.toLowerCase()
            )
      );

    }, [clients, searchText]);

  return (
    <div className="simakClientPage__wrapper">
      <div className="simakClientPage__main">

        <AppHeader title="Management Clients" />

        <Navbar />

        <div className="simakClientPage__content">

          <div className="simakClientPage__layout">

            {/* ====================================== */}
            {/* LEFT PANEL */}
            {/* ====================================== */}

            <div className="simakClientPage__listPanel">

              <div className="simakClientPage__listHeader">

                <div>

                  <div className="simakClientPage__title">
                    Data Clients
                  </div>

                  <div className="simakClientPage__subtitle">
                    Management data client
                  </div>

                </div>

                <button className="simakClientPage__btnPrimary">
                  + Tambah
                </button>

              </div>

              <div className="simakClientPage__filters">

                <input
                  type="text"
                  placeholder="Cari client..."
                  className="simakLayout__input"
                  value={searchText}
                  onChange={(event) =>
                    setSearchText(
                      event.target.value
                    )
                  }
                />

              </div>

              <div className="simakClientPage__list">

                {/* ====================================== */}
                {/* LOADING */}
                {/* ====================================== */}

                {isLoading && (

                  <div className="simakClientPage__loadingWrapper">

                    {[...Array(6)].map(
                      (_, index) => (

                        <div
                          key={index}
                          className="simakClientPage__loadingCard"
                        >

                          <div className="simakClientPage__loadingTop">

                            <div className="simakClientPage__loadingAvatar" />

                            <div className="simakClientPage__loadingInfo">

                              <div className="simakClientPage__loadingLine simakClientPage__loadingLineLg" />

                              <div className="simakClientPage__loadingLine simakClientPage__loadingLineSm" />

                            </div>

                          </div>

                          <div className="simakClientPage__loadingBottom">

                            <div className="simakClientPage__loadingLine simakClientPage__loadingLineFull" />

                            <div className="simakClientPage__loadingLine simakClientPage__loadingLineMd" />

                          </div>

                        </div>

                      )
                    )}

                  </div>

                )}

                {/* ====================================== */}
                {/* DATA */}
                {/* ====================================== */}

                {!isLoading &&
                  filteredClients.map(
                    (client) => (

                      <ClientListCard
                        key={
                          client?.id ||
                          Math.random()
                        }
                        client={
                          client ||
                          emptyClient
                        }
                        active={
                          selectedClient?.id ===
                          client?.id
                        }
                        onClick={() =>
                          setSelectedClient(
                            client
                          )
                        }
                      />

                    )
                  )}

                {/* ====================================== */}
                {/* EMPTY */}
                {/* ====================================== */}

                {!isLoading &&
                  filteredClients.length === 0 && (

                    <div className="simakClientPage__emptyState">

                      <div className="simakClientPage__emptyIcon">
                        ⌁
                      </div>

                      <div className="simakClientPage__emptyTitle">
                        Data client tidak ditemukan
                      </div>

                      <div className="simakClientPage__emptyDesc">
                        Coba gunakan kata kunci lain
                        atau tambahkan data client baru.
                      </div>

                    </div>

                  )}

              </div>

            </div>

            {/* ====================================== */}
            {/* RIGHT PANEL */}
            {/* ====================================== */}

            {!isLoading &&
              selectedClient && (

                <ClientDetail
                  client={
                    selectedClient ||
                    emptyClient
                  }
                />

              )}

            {isLoading && (

              <div className="simakClientPage__detailLoading">

                <div className="simakClientPage__detailLoadingHeader">

                  <div className="simakClientPage__detailAvatar" />

                  <div className="simakClientPage__detailHeaderInfo">

                    <div className="simakClientPage__loadingLine simakClientPage__loadingLineLg" />

                    <div className="simakClientPage__loadingLine simakClientPage__loadingLineSm" />

                  </div>

                </div>

                <div className="simakClientPage__detailGrid">

                  {[...Array(10)].map(
                    (_, index) => (

                      <div
                        key={index}
                        className="simakClientPage__detailItem"
                      >

                        <div className="simakClientPage__loadingLine simakClientPage__loadingLineSm" />

                        <div className="simakClientPage__loadingLine simakClientPage__loadingLineFull" />

                      </div>

                    )
                  )}

                </div>

              </div>

            )}

          </div>

        </div>

      </div>
    </div>
  );
}