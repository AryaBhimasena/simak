"use client";

import { useMemo, useState } from "react";

/* ====================================== */
/* TYPES */
/* ====================================== */

type Contract = {
  idKontrak?: string;
  nomorKontrak?: string;

  kategoriTk?: string;

  startDate?: string;
  endDate?: string;

  statusKontrak?: string;

  managementFee?: number;

  gajiPokok?: number;

  tunjanganJabatan?: number;
  tunjanganMakan?: number;
  tunjanganTransportasi?: number;

  tarifBkoReguler?: number;
  tarifBkoResign?: number;
  tarifBkoCuti?: number;

  peralatan?: number;
  thr?: number;
  seragam?: number;

  liburNasional?: number;
  liburSabtuMinggu?: number;

  bpjsNaker?: number;
  bpjsKesehatan?: number;

  cutOffGaji?: string;
  cutOffInvoice?: string;

  contractorOverhead?: number;

  ritDalamKota?: number;
  ritLuarKota?: number;

  dokumenKontrak?: string;
  dokumenBreakdown?: string;
};

type Client = {
  id?: string;

  kodeClients?: string;
  namaClients?: string;

  namaGedung?: string;

  alamatClients?: string;
  kotaClients?: string;
  kodePos?: string;

  kontakClients?: string;

  pic?: string;
  kontakPic?: string;

  npwp?: string;

  contracts?: Contract[];
};

type ClientDetailProps = {
  client?: Client | null;
};

export default function ClientDetail({
  client,
}: ClientDetailProps) {

  /* ====================================== */
  /* SCROLL */
  /* ====================================== */

  const scrollToSection = (
    sectionId: string
  ): void => {

    const element =
      document.getElementById(
        sectionId
      );

    if (element) {

      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

    }
  };

  /* ====================================== */
  /* CONTRACTS */
  /* ====================================== */

  const contracts: Contract[] =
    Array.isArray(
      client?.contracts
    )
      ? client.contracts
      : [];

  /* ====================================== */
  /* SELECTED CONTRACT */
  /* ====================================== */

  const [
    selectedContractIndex,
    setSelectedContractIndex,
  ] = useState<number>(0);

  const selectedContract =
    contracts?.[
      selectedContractIndex
    ] || null;

  /* ====================================== */
  /* FORMAT NUMBER */
  /* ====================================== */

  const formatNumber = (
    value: unknown
  ): string => {

    const parsed =
      Number(value || 0);

    return parsed.toLocaleString(
      "id-ID"
    );

  };

  /* ====================================== */
  /* FORMAT CURRENCY */
  /* ====================================== */

  const formatCurrency = (
    value: unknown
  ): string => {

    return `Rp ${formatNumber(
      value
    )}`;

  };

  /* ====================================== */
  /* FORMAT DATE */
  /* ====================================== */

  const formatDate = (
    value: unknown
  ): string => {

    if (!value) return "-";

    const date =
      new Date(
        String(value)
      );

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {

      return String(value);

    }

    return date.toLocaleDateString(
      "id-ID",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );

  };

  /* ====================================== */
  /* CONTRACT REMAINING */
  /* ====================================== */

  const contractRemaining =
    useMemo(() => {

      const endDateValue =
        selectedContract &&
        typeof selectedContract ===
          "object"
          ? (
              selectedContract as Record<
                string,
                unknown
              >
            ).endDate
          : undefined;

      if (
        !endDateValue
      ) {

        return "-";

      }

      const today =
        new Date();

      const endDate =
        new Date(
          String(
            endDateValue
          )
        );

      const diffMonth =
        (
          endDate.getFullYear() -
          today.getFullYear()
        ) *
          12 +
        (
          endDate.getMonth() -
          today.getMonth()
        );

      if (
        diffMonth <= 0
      ) {

        return "Berakhir";

      }

      return `${diffMonth} Bulan`;

    }, [
      selectedContract,
    ]);

  return (
	<>
    <div className="simakClientPage__detailPanel">

      {/* ====================================== */}
      {/* HEADER */}
      {/* ====================================== */}

      <div className="simakClientPage__detailHeader">

        {/* ================================== */}
        {/* LEFT */}
        {/* ================================== */}

        <div className="simakClientPage__headerLeft">

          <div className="simakClientPage__title">
            {client?.namaClients || "-"}
          </div>

          <div className="simakClientPage__subtitle">

            {formatDate(
              selectedContract?.startDate
            )}

            {" - "}

            {formatDate(
              selectedContract?.endDate
            )}

            {" : "}

            {contractRemaining}

          </div>

        </div>

        {/* ================================== */}
        {/* RIGHT */}
        {/* ================================== */}

        <div className="simakClientPage__contractTabs">

          {contracts.length === 0 && (

            <div className="simakClientPage__emptyTab">
              Tidak Ada Kontrak
            </div>

          )}

          {contracts.map(
            (
              contract,
              index
            ) => {

              const isActive =
                index ===
                selectedContractIndex;

              return (

                <button
                  key={index}
                  className={`simakClientPage__contractTab ${
                    isActive
                      ? "simakClientPage__contractTab--active"
                      : ""
                  }`}
                  onClick={() =>
                    setSelectedContractIndex(
                      index
                    )
                  }
                >

                  {contract?.kategoriTk || "-"}

                </button>

              );
            }
          )}

        </div>

      </div>

      {/* ====================================== */}
      {/* SECTION NAV */}
      {/* ====================================== */}

      <div className="simakClientPage__sectionNav">

        <div className="simakClientPage__sectionNavList">

          <button
            className="simakClientPage__sectionButton"
            onClick={() =>
              scrollToSection(
                "informasi-client"
              )
            }
          >
            Informasi Umum
          </button>

          <button
            className="simakClientPage__sectionButton"
            onClick={() =>
              scrollToSection(
                "breakdown-kontrak"
              )
            }
          >
            Breakdown Kontrak
          </button>

          <button
            className="simakClientPage__sectionButton"
            onClick={() =>
              scrollToSection(
                "dokumen-kontrak"
              )
            }
          >
            Dokumen
          </button>

        </div>

        <button className="simakClientPage__btnPrimary">
          Edit Client
        </button>

      </div>

      {/* ====================================== */}
      {/* BODY */}
      {/* ====================================== */}

      <div className="simakClientPage__body">

        <div className="simakClientPage__sectionContainer">

          {/* ====================================== */}
          {/* INFORMASI UMUM */}
          {/* ====================================== */}

          <div
            id="informasi-client"
            className="simakClientPage__sectionCard"
          >

            <div className="simakClientPage__sectionTitle">
              Informasi Umum
            </div>

            <div className="simakClientPage__grid">

              <div className="simakClientPage__field">

                <label>
                  Nama Client
                </label>

                <input
                  value={
                    client?.namaClients ||
                    "-"
                  }
                  readOnly
                />

              </div>

              <div className="simakClientPage__field">

                <label>
                  Management Fee
                </label>

                <input
                  value={
                    selectedContract?.managementFee
                      ? `${formatNumber(
                          selectedContract?.managementFee
                        )}%`
                      : "0%"
                  }
                  readOnly
                />

              </div>

              <div className="simakClientPage__field">

                <label>
                  NPWP
                </label>

                <input
                  value={
                    client?.npwp ||
                    "-"
                  }
                  readOnly
                />

              </div>

              <div className="simakClientPage__field">

                <label>
                  Nama Gedung
                </label>

                <input
                  value={
                    client?.namaGedung ||
                    "-"
                  }
                  readOnly
                />

              </div>

              <div className="simakClientPage__field simakClientPage__field--double">

                <label>
                  Alamat Lengkap
                </label>

                <textarea
                  value={`${client?.alamatClients || "-"}, ${client?.kotaClients || "-"} ${client?.kodePos || ""}`}
                  readOnly
                />

              </div>

              <div className="simakClientPage__field">

                <label>
                  Kontak Client
                </label>

                <input
                  value={
                    client?.kontakClients ||
                    "-"
                  }
                  readOnly
                />

              </div>

              <div className="simakClientPage__field">

                <label>
                  PIC
                </label>

                <input
                  value={
                    client?.pic || "-"
                  }
                  readOnly
                />

              </div>

              <div className="simakClientPage__field">

                <label>
                  Kontak PIC
                </label>

                <input
                  value={
                    client?.kontakPic ||
                    "-"
                  }
                  readOnly
                />

              </div>

            </div>

          </div>

          {/* ====================================== */}
          {/* BREAKDOWN KONTRAK */}
          {/* ====================================== */}

          <div
            id="breakdown-kontrak"
            className="simakClientPage__sectionCard"
          >

            <div className="simakClientPage__sectionTitle">
              Breakdown Kontrak
            </div>

            {!selectedContract && (

              <div className="simakClientPage__emptyContract">

                Tidak ada kontrak

              </div>

            )}

            {selectedContract && (

              <div className="simakClientPage__grid">

                <div className="simakClientPage__field">
                  <label>
                    Gaji Pokok
                  </label>

                  <input
                    value={formatCurrency(
                      selectedContract?.gajiPokok
                    )}
                    readOnly
                  />
                </div>

                <div className="simakClientPage__field">
                  <label>
                    Tunjangan Makan
                  </label>

                  <input
                    value={formatCurrency(
                      selectedContract?.tunjanganMakan
                    )}
                    readOnly
                  />
                </div>

                <div className="simakClientPage__field">
                  <label>
                    Tunjangan Transportasi
                  </label>

                  <input
                    value={formatCurrency(
                      selectedContract?.tunjanganTransportasi
                    )}
                    readOnly
                  />
                </div>

                <div className="simakClientPage__field">
                  <label>
                    Tunjangan Jabatan
                  </label>

                  <input
                    value={formatCurrency(
                      selectedContract?.tunjanganJabatan
                    )}
                    readOnly
                  />
                </div>

                <div className="simakClientPage__field">
                  <label>
                    BPJS Tenaga Kerja
                  </label>

                  <input
                    value={formatCurrency(
                      selectedContract?.bpjsNaker
                    )}
                    readOnly
                  />
                </div>

                <div className="simakClientPage__field">
                  <label>
                    BPJS Kesehatan
                  </label>

                  <input
                    value={formatCurrency(
                      selectedContract?.bpjsKesehatan
                    )}
                    readOnly
                  />
                </div>

                <div className="simakClientPage__field">
                  <label>
                    Tarif BKO Reguler
                  </label>

                  <input
                    value={formatCurrency(
                      selectedContract?.tarifBkoReguler
                    )}
                    readOnly
                  />
                </div>

                <div className="simakClientPage__field">
                  <label>
                    Tarif BKO Cuti
                  </label>

                  <input
                    value={formatCurrency(
                      selectedContract?.tarifBkoCuti
                    )}
                    readOnly
                  />
                </div>

                <div className="simakClientPage__field">
                  <label>
                    Tarif BKO Resign
                  </label>

                  <input
                    value={formatCurrency(
                      selectedContract?.tarifBkoResign
                    )}
                    readOnly
                  />
                </div>

                <div className="simakClientPage__field">
                  <label>
                    Tarif Libur Nasional
                  </label>

                  <input
                    value={formatCurrency(
                      selectedContract?.liburNasional
                    )}
                    readOnly
                  />
                </div>

                <div className="simakClientPage__field">
                  <label>
                    Tarif Libur Sabtu/Minggu
                  </label>

                  <input
                    value={formatCurrency(
                      selectedContract?.liburSabtuMinggu
                    )}
                    readOnly
                  />
                </div>

                <div className="simakClientPage__field">
                  <label>
                    Peralatan
                  </label>

                  <input
                    value={formatCurrency(
                      selectedContract?.peralatan
                    )}
                    readOnly
                  />
                </div>

                <div className="simakClientPage__field">
                  <label>
                    THR
                  </label>

                  <input
                    value={formatCurrency(
                      selectedContract?.thr
                    )}
                    readOnly
                  />
                </div>

                <div className="simakClientPage__field">
                  <label>
                    Seragam
                  </label>

                  <input
                    value={formatCurrency(
                      selectedContract?.seragam
                    )}
                    readOnly
                  />
                </div>

                <div className="simakClientPage__field">
                  <label>
                    Contractor Overhead
                  </label>

                  <input
                    value={formatCurrency(
                      selectedContract?.contractorOverhead
                    )}
                    readOnly
                  />
                </div>

                <div className="simakClientPage__field">
                  <label>
                    Cut Off Gaji
                  </label>

                  <input
                    value={
                      selectedContract?.cutOffGaji || "-"
                    }
                    readOnly
                  />
                </div>

                <div className="simakClientPage__field">
                  <label>
                    Cut Off Invoice
                  </label>

                  <input
                    value={
                      selectedContract?.cutOffInvoice || "-"
                    }
                    readOnly
                  />
                </div>

              </div>

            )}

          </div>

          {/* ====================================== */}
          {/* DOKUMEN KONTRAK */}
          {/* ====================================== */}

          <div
            id="dokumen-kontrak"
            className="simakClientPage__sectionCard"
          >

            <div className="simakClientPage__sectionTitle">
              Dokumen Kontrak
            </div>

            {!selectedContract && (

              <div className="simakClientPage__emptyContract">

                Tidak ada kontrak

              </div>

            )}

            {selectedContract && (

              <div className="simakClientPage__documentGrid">

                <div className="simakClientPage__documentCard">

                  <div className="simakClientPage__documentIcon">
                    DOC
                  </div>

                  <div className="simakClientPage__documentInfo">

                    <div className="simakClientPage__documentName">
                      Kontrak
                    </div>

                    <div className="simakClientPage__documentMeta">
                      Dokumen Kontrak Kerja Sama
                    </div>

                  </div>

                  <button className="simakClientPage__btnDownload">
                    Preview
                  </button>

                </div>

                <div className="simakClientPage__documentCard">

                  <div className="simakClientPage__documentIcon">
                    XLS
                  </div>

                  <div className="simakClientPage__documentInfo">

                    <div className="simakClientPage__documentName">
                      Breakdown
                    </div>

                    <div className="simakClientPage__documentMeta">
                      Breakdown Payroll
                    </div>

                  </div>

                  <button className="simakClientPage__btnDownload">
                    Preview
                  </button>

                </div>

              </div>

            )}

          </div>

        </div>

      </div>

    </div>
	</>
  );
}