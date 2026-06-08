"use client";

/* ====================================== */
/* TYPES */
/* ====================================== */

type Contract = {
  statusKontrak?: string;
  kategoriTk?: string;
};

type Client = {
  namaClients?: string;
  contracts?: Contract[];
};

type ClientListCardProps = {
  client?: Client | null;
  active?: boolean;
  onClick?: () => void;
};

export default function ClientListCard({
  client,
  active = false,
  onClick,
}: ClientListCardProps) {

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
  /* ACTIVE CONTRACTS */
  /* ====================================== */

  const activeContracts =
    contracts.filter(
      (contract) =>
        String(
          contract?.statusKontrak || ""
        )
          .toLowerCase()
          .includes("aktif")
    );

  /* ====================================== */
  /* STATUS */
  /* ====================================== */

  const contractStatus =
    activeContracts.length > 0
      ? "Aktif"
      : contracts.length > 0
      ? "Nonaktif"
      : "No Contract";

  const isActive =
    contractStatus === "Aktif";

  /* ====================================== */
  /* ACTIVE CATEGORIES */
  /* ====================================== */

  const activeCategories =
    activeContracts.map(
      (contract) =>
        contract?.kategoriTk
    );

  const uniqueCategories =
    [...new Set(activeCategories)]
      .filter(Boolean);

  const categoryLabel =
    uniqueCategories.length > 0
      ? uniqueCategories.join(" - ")
      : "-";

  return (
    <div
      className={`simakClientPage__clientItem ${
        active
          ? "simakClientPage__clientItem--active"
          : ""
      }`}
      onClick={onClick}
    >

      {/* ====================================== */}
      {/* TOP */}
      {/* ====================================== */}

      <div className="simakClientPage__clientTop">

        {/* ====================================== */}
        {/* LEFT */}
        {/* ====================================== */}

        <div className="simakClientPage__clientInfo">

          <div className="simakClientPage__clientName">
            {client?.namaClients || "-"}
          </div>

          <div className="simakClientPage__clientCategory">
            {categoryLabel}
          </div>

        </div>

        {/* ====================================== */}
        {/* RIGHT */}
        {/* ====================================== */}

        <div className="simakClientPage__clientMeta">

          <div
            className={`simakClientPage__statusBadge ${
              isActive
                ? "simakClientPage__statusBadge--active"
                : "simakClientPage__statusBadge--expired"
            }`}
          >
            {contractStatus}
          </div>

          <div className="simakClientPage__clientContractCount">
            {contracts.length} Kontrak
          </div>

        </div>

      </div>

    </div>
  );
}