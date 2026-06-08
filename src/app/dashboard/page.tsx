"use client";

import "@/style/pages/dashboard.css";
import "@/style/app-layout.css";

import AppHeader from "@/components/AppHeader";
import Navbar from "@/components/Navbar";

import {
  ArrowDownRight,
  ArrowUpRight,
  BriefcaseBusiness,
  Building2,
  CircleDollarSign,
  FileClock,
  HandCoins,
  Landmark,
  ReceiptText,
  Wallet,
} from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="simakDash__wrapper">
      <AppHeader />
      <Navbar />

      <div className="simakDash__container">

        {/* ====================================== */}
        {/* HERO OVERVIEW */}
        {/* ====================================== */}

        <section className="simakDash__heroSection">

          <div className="simakDash__heroLeft">

            <div className="simakDash__heroBadge">
              Financial Overview • Mei 2026
            </div>

            <h1 className="simakDash__heroTitle">
              Insight Keuangan Bisnis
            </h1>

            <p className="simakDash__heroDescription">
              Pantau pendapatan invoice, kewajiban bulanan,
              tunggakan pembayaran, dan biaya operasional
              dalam satu dashboard terpusat.
            </p>

            <div className="simakDash__quickActions">

              <button className="simakDash__primaryAction">
                <ArrowDownRight size={18} />
                Catat Pendapatan
              </button>

              <button className="simakDash__secondaryAction">
                <ArrowUpRight size={18} />
                Catat Pengeluaran
              </button>

            </div>

          </div>

          <div className="simakDash__heroRight">

            <div className="simakDash__cashflowCard">

              <div className="simakDash__cashflowHeader">
                <span>Arus Kas Bulan Ini</span>

                <div className="simakDash__growthBadge">
                  +12.4%
                </div>
              </div>

              <div className="simakDash__cashflowAmount">
                Rp 1.284.000.000
              </div>

              <div className="simakDash__cashflowStats">

                <div className="simakDash__cashflowItem">
                  <label>Pendapatan</label>
                  <strong>Rp 1.82 M</strong>
                </div>

                <div className="simakDash__cashflowDivider" />

                <div className="simakDash__cashflowItem">
                  <label>Pengeluaran</label>
                  <strong>Rp 536 Jt</strong>
                </div>

              </div>

            </div>

          </div>

        </section>

        {/* ====================================== */}
        {/* MAIN GRID */}
        {/* ====================================== */}

        <div className="simakDash__mainGrid">

          {/* ====================================== */}
          {/* LEFT CONTENT */}
          {/* ====================================== */}

          <div className="simakDash__leftContent">

            {/* ====================================== */}
            {/* MONTHLY INSIGHT */}
            {/* ====================================== */}

            <section className="simakDash__sectionCard">

              <div className="simakDash__sectionHeader">
                <div>
                  <h3>Ringkasan Bulanan</h3>
                  <p>Insight utama aktivitas keuangan bisnis</p>
                </div>
              </div>

              <div className="simakDash__overviewGrid">

                <div className="simakDash__overviewCard simakDash__overviewCard--income">

                  <div className="simakDash__overviewIcon">
                    <CircleDollarSign size={20} />
                  </div>

                  <div className="simakDash__overviewContent">
                    <span>Total Pendapatan Invoice</span>
                    <h2>Rp 1.820.000.000</h2>
                    <small>124 invoice berhasil dibayarkan</small>
                  </div>

                </div>

                <div className="simakDash__overviewCard simakDash__overviewCard--receivable">

                  <div className="simakDash__overviewIcon">
                    <FileClock size={20} />
                  </div>

                  <div className="simakDash__overviewContent">
                    <span>Total Tunggakan</span>
                    <h2>Rp 248.000.000</h2>
                    <small>18 invoice belum dibayarkan</small>
                  </div>

                </div>

                <div className="simakDash__overviewCard simakDash__overviewCard--expense">

                  <div className="simakDash__overviewIcon">
                    <Wallet size={20} />
                  </div>

                  <div className="simakDash__overviewContent">
                    <span>Biaya Operasional</span>
                    <h2>Rp 186.000.000</h2>
                    <small>Operasional & kebutuhan kantor</small>
                  </div>

                </div>

              </div>

            </section>

            {/* ====================================== */}
            {/* LIABILITY SECTION */}
            {/* ====================================== */}

            <section className="simakDash__sectionCard">

              <div className="simakDash__sectionHeader">
                <div>
                  <h3>Kewajiban Bulanan</h3>
                  <p>
                    Seluruh kewajiban yang harus dibayarkan
                    pada periode berjalan
                  </p>
                </div>
              </div>

              <div className="simakDash__liabilityList">

                <div className="simakDash__liabilityItem">

                  <div className="simakDash__liabilityLeft">

                    <div className="simakDash__liabilityIcon">
                      <BriefcaseBusiness size={18} />
                    </div>

                    <div>
                      <h4>Gaji Karyawan</h4>
                      <span>
                        Pembayaran payroll seluruh karyawan
                      </span>
                    </div>

                  </div>

                  <div className="simakDash__liabilityRight">
                    Rp 845.000.000
                  </div>

                </div>

                <div className="simakDash__liabilityItem">

                  <div className="simakDash__liabilityLeft">

                    <div className="simakDash__liabilityIcon">
                      <HandCoins size={18} />
                    </div>

                    <div>
                      <h4>BPJS Tenaga Kerja</h4>
                      <span>
                        Tagihan BPJS Ketenagakerjaan aktif
                      </span>
                    </div>

                  </div>

                  <div className="simakDash__liabilityRight">
                    Rp 72.000.000
                  </div>

                </div>

                <div className="simakDash__liabilityItem">

                  <div className="simakDash__liabilityLeft">

                    <div className="simakDash__liabilityIcon">
                      <Building2 size={18} />
                    </div>

                    <div>
                      <h4>BPJS Kesehatan</h4>
                      <span>
                        Kewajiban BPJS kesehatan perusahaan
                      </span>
                    </div>

                  </div>

                  <div className="simakDash__liabilityRight">
                    Rp 65.000.000
                  </div>

                </div>

                <div className="simakDash__liabilityItem">

                  <div className="simakDash__liabilityLeft">

                    <div className="simakDash__liabilityIcon">
                      <Landmark size={18} />
                    </div>

                    <div>
                      <h4>Total Pajak</h4>
                      <span>
                        Kewajiban pajak yang harus disetorkan
                      </span>
                    </div>

                  </div>

                  <div className="simakDash__liabilityRight simakDash__liabilityRight--danger">
                    Rp 94.500.000
                  </div>

                </div>

              </div>

            </section>

          </div>

          {/* ====================================== */}
          {/* RIGHT SIDEBAR */}
          {/* ====================================== */}

          <div className="simakDash__rightSidebar">

            {/* ====================================== */}
            {/* OUTSTANDING INVOICE */}
            {/* ====================================== */}

            <section className="simakDash__sectionCard">

              <div className="simakDash__sectionHeader">
                <div>
                  <h3>Tunggakan Invoice</h3>
                  <p>Invoice yang belum dilunasi client</p>
                </div>
              </div>

              <div className="simakDash__invoiceList">

                <div className="simakDash__invoiceItem">

                  <div>
                    <h4>PT Sinar Abadi</h4>
                    <span>Jatuh tempo 12 Mei 2026</span>
                  </div>

                  <strong>Rp 84 Jt</strong>

                </div>

                <div className="simakDash__invoiceItem">

                  <div>
                    <h4>PT Graha Sentosa</h4>
                    <span>Jatuh tempo 16 Mei 2026</span>
                  </div>

                  <strong>Rp 52 Jt</strong>

                </div>

                <div className="simakDash__invoiceItem">

                  <div>
                    <h4>CV Prima Mandiri</h4>
                    <span>Jatuh tempo 21 Mei 2026</span>
                  </div>

                  <strong>Rp 37 Jt</strong>

                </div>

                <div className="simakDash__invoiceItem">

                  <div>
                    <h4>PT Bintang Timur</h4>
                    <span>Jatuh tempo 25 Mei 2026</span>
                  </div>

                  <strong>Rp 75 Jt</strong>

                </div>

              </div>

            </section>

            {/* ====================================== */}
            {/* OPERATION SUMMARY */}
            {/* ====================================== */}

            <section className="simakDash__sectionCard">

              <div className="simakDash__sectionHeader">
                <div>
                  <h3>Ringkasan Operasional</h3>
                  <p>Distribusi pengeluaran operasional</p>
                </div>
              </div>

              <div className="simakDash__expenseList">

                <div className="simakDash__expenseItem">

                  <div className="simakDash__expenseLabel">
                    <ReceiptText size={16} />
                    <span>Administrasi</span>
                  </div>

                  <strong>Rp 38 Jt</strong>

                </div>

                <div className="simakDash__expenseItem">

                  <div className="simakDash__expenseLabel">
                    <ReceiptText size={16} />
                    <span>Operasional Kantor</span>
                  </div>

                  <strong>Rp 64 Jt</strong>

                </div>

                <div className="simakDash__expenseItem">

                  <div className="simakDash__expenseLabel">
                    <ReceiptText size={16} />
                    <span>Transportasi</span>
                  </div>

                  <strong>Rp 21 Jt</strong>

                </div>

                <div className="simakDash__expenseItem">

                  <div className="simakDash__expenseLabel">
                    <ReceiptText size={16} />
                    <span>Lainnya</span>
                  </div>

                  <strong>Rp 63 Jt</strong>

                </div>

              </div>

            </section>

          </div>

        </div>

      </div>
    </div>
  );
}