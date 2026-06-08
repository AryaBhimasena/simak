"use client";

import {
  PersonalTab,
  KeluargaTab,
  KepegawaianTab,
  PenempatanTab,
  DokumenTab,
} from "../tabs/PersonalTabs";

import TabButton from "./TabButton";

import {
  TabType,
} from "../page";

const TABS = [
  {
    label: "Personal",
    value: "personal",
  },
  {
    label: "Keluarga",
    value: "keluarga",
  },
  {
    label: "Kepegawaian",
    value: "kepegawaian",
  },
  {
    label: "Penempatan",
    value: "penempatan",
  },
  {
    label: "Dokumen",
    value: "dokumen",
  },
];

const TAB_CONTENT: Record<
  TabType,
  () => JSX.Element
> = {
  personal: PersonalTab,
  keluarga: KeluargaTab,
  kepegawaian: KepegawaianTab,
  penempatan: PenempatanTab,
  dokumen: DokumenTab,
};

export default function EmployeeDetailCard({
  form,
  activeTab,
  setActiveTab,
}: any) {
  const ActiveTabComponent =
    TAB_CONTENT[activeTab];

  return (
    <div className="simakEmployeePage__detailPanel">

      {/* HEADER */}

      <div className="simakEmployeePage__detailHeader">

        <div>

          <h1>
            Detail Karyawan
          </h1>

          <p>
            Informasi lengkap dan
            pengelolaan data
            karyawan
          </p>

        </div>

        <button className="simakEmployeePage__btnPrimary">
          Simpan Perubahan
        </button>

      </div>

      {/* EMPTY */}

      {!form.id_karyawan ? (
        <div className="simakEmployeePage__emptyDetail">

          <h2>
            Pilih Karyawan
          </h2>

          <p>
            Pilih data karyawan
            dari daftar sebelah
            kiri untuk melihat
            detail lengkap.
          </p>

        </div>
      ) : (
        <div className="simakEmployeePage__detailContent">

          {/* PROFILE */}

          <div className="simakEmployeePage__profileHeader">

            <div className="simakEmployeePage__avatar" />

            <div>

              <h2>
                {form.nama ||
                  "Nama Karyawan"}
              </h2>

              <p>
                {form.jabatan ||
                  "-"}

                {" • "}

                {form.penempatan ||
                  "-"}
              </p>

            </div>

          </div>

          {/* TABS */}

          <div className="simakEmployeePage__tabs">

            {TABS.map((tab) => (
              <TabButton
                key={tab.value}
                label={tab.label}
                value={tab.value}
                activeTab={
                  activeTab
                }
                setActiveTab={
                  setActiveTab
                }
              />
            ))}

          </div>

          {/* CONTENT */}

          <div className="simakEmployeePage__tabContent">
            <ActiveTabComponent />
          </div>

        </div>
      )}

    </div>
  );
}