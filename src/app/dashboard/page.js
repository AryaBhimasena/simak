"use client";

import {
  ArrowDownRight,
  ArrowUpRight,
  CalendarDays,
  ChevronRight,
  Clock3,
  CreditCard,
  FileText,
  MapPin,
  MoreHorizontal,
  Users,
  WalletCards,
} from "lucide-react";

import "@/styles/pages/dashboard.css";

const summaryCards = [
  {
    label: "Total Client",
    value: "24",
    description: "Client aktif",
    change: "+3",
    trend: "up",
    icon: Users,
  },
  {
    label: "Total Karyawan",
    value: "186",
    description: "Karyawan aktif",
    change: "+12",
    trend: "up",
    icon: Users,
  },
  {
    label: "Kehadiran Hari Ini",
    value: "94,6%",
    description: "176 dari 186 karyawan",
    change: "+2,1%",
    trend: "up",
    icon: CalendarDays,
  },
  {
    label: "Invoice Berjalan",
    value: "Rp 284,5 jt",
    description: "Belum dibayar",
    change: "-8,4%",
    trend: "down",
    icon: CreditCard,
  },
];

const attendanceData = [
  {
    label: "Hadir",
    value: 176,
    percentage: 94.6,
    className: "present",
  },
  {
    label: "Terlambat",
    value: 5,
    percentage: 2.7,
    className: "late",
  },
  {
    label: "Izin",
    value: 3,
    percentage: 1.6,
    className: "permission",
  },
  {
    label: "Tidak Hadir",
    value: 2,
    percentage: 1.1,
    className: "absent",
  },
];

const invoiceData = [
  {
    label: "Belum Jatuh Tempo",
    value: "Rp 186,2 jt",
    percentage: 65,
    className: "invoice-safe",
  },
  {
    label: "Jatuh Tempo",
    value: "Rp 62,8 jt",
    percentage: 22,
    className: "invoice-warning",
  },
  {
    label: "Terlambat",
    value: "Rp 35,5 jt",
    percentage: 13,
    className: "invoice-danger",
  },
];

const activities = [
  {
    type: "attendance",
    title: "Absensi baru diterima",
    description: "Andi Pratama melakukan absensi masuk.",
    time: "08:14",
  },
  {
    type: "invoice",
    title: "Pembayaran invoice diterima",
    description: "PT Maju Bersama · INV-0268",
    time: "09:32",
  },
  {
    type: "employee",
    title: "Data karyawan diperbarui",
    description: "Rizky Ramadhan · Administrasi",
    time: "10:05",
  },
  {
    type: "document",
    title: "Dokumen kontrak diunggah",
    description: "PT Sumber Daya Abadi · Kontrak 2026",
    time: "11:20",
  },
];

const upcomingDocuments = [
  {
    document: "Kontrak Kerja",
    owner: "Budi Santoso",
    type: "Karyawan",
    date: "18 Agu 2026",
    status: "3 hari lagi",
    statusType: "danger",
  },
  {
    document: "Kontrak Client",
    owner: "PT Maju Bersama",
    type: "Client",
    date: "24 Agu 2026",
    status: "9 hari lagi",
    statusType: "warning",
  },
  {
    document: "Kontrak Kerja",
    owner: "Dimas Saputra",
    type: "Karyawan",
    date: "29 Agu 2026",
    status: "14 hari lagi",
    statusType: "normal",
  },
];

function SummaryCard({
  label,
  value,
  description,
  change,
  trend,
  icon: Icon,
}) {
  return (
    <article className="summary-card">
      <div className="summary-card-header">
        <div className="summary-card-label">
          <span className="summary-card-icon">
            <Icon size={16} strokeWidth={1.8} />
          </span>

          <span>{label}</span>
        </div>

        <span className={`summary-change ${trend}`}>
          {trend === "up" ? (
            <ArrowUpRight size={12} strokeWidth={2} />
          ) : (
            <ArrowDownRight size={12} strokeWidth={2} />
          )}

          {change}
        </span>
      </div>

      <div className="summary-card-body">
        <strong className="summary-value">
          {value}
        </strong>

        <span className="summary-description">
          {description}
        </span>
      </div>
    </article>
  );
}

function AttendanceCard() {
  return (
    <section className="dashboard-card attendance-card">
      <div className="card-header">
        <div>
          <span className="card-eyebrow">
            ABSENSI
          </span>

          <h2>Kehadiran Hari Ini</h2>
        </div>

        <button className="card-action">
          Lihat detail
          <ChevronRight size={14} />
        </button>
      </div>

      <div className="attendance-main">
        <div className="attendance-score">
          <strong>94,6%</strong>

          <span>
            Tingkat kehadiran
          </span>
        </div>

        <div className="attendance-location">
          <MapPin
            size={14}
            strokeWidth={1.8}
          />

          <span>
            24 lokasi penempatan
          </span>
        </div>
      </div>

      <div className="attendance-progress">
        {attendanceData.map((item) => (
          <div
            key={item.label}
            className={`attendance-progress-item ${item.className}`}
            style={{
              width: `${item.percentage}%`,
            }}
          />
        ))}
      </div>

      <div className="attendance-list">
        {attendanceData.map((item) => (
          <div
            className="attendance-item"
            key={item.label}
          >
            <div className="attendance-item-label">
              <span
                className={`attendance-dot ${item.className}`}
              />

              <span>
                {item.label}
              </span>
            </div>

            <div className="attendance-item-value">
              <strong>
                {item.value}
              </strong>

              <span>
                {item.percentage}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function InvoiceCard() {
  return (
    <section className="dashboard-card invoice-card">
      <div className="card-header">
        <div>
          <span className="card-eyebrow">
            FINANCE
          </span>

          <h2>Monitoring Piutang</h2>
        </div>

        <button className="card-action">
          Semua invoice
          <ChevronRight size={14} />
        </button>
      </div>

      <div className="invoice-total">
        <div>
          <span>
            Total belum dibayar
          </span>

          <strong>
            Rp 284,5 jt
          </strong>
        </div>

        <div className="invoice-total-status">
          <span />
          Perlu monitoring
        </div>
      </div>

      <div className="invoice-bars">
        {invoiceData.map((item) => (
          <div
            className="invoice-row"
            key={item.label}
          >
            <div className="invoice-row-header">
              <div>
                <span
                  className={`invoice-status-dot ${item.className}`}
                />

                <span>
                  {item.label}
                </span>
              </div>

              <strong>
                {item.value}
              </strong>
            </div>

            <div className="invoice-track">
              <div
                className={`invoice-bar ${item.className}`}
                style={{
                  width: `${item.percentage}%`,
                }}
              />
            </div>

            <span className="invoice-percentage">
              {item.percentage}% dari total
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

function ActivityIcon({ type }) {
  if (type === "attendance") {
    return <Clock3 size={16} />;
  }

  if (type === "invoice") {
    return <WalletCards size={16} />;
  }

  if (type === "employee") {
    return <Users size={16} />;
  }

  return <FileText size={16} />;
}

function ActivityCard() {
  return (
    <section className="dashboard-card activity-card">
      <div className="card-header">
        <div>
          <span className="card-eyebrow">
            AKTIVITAS
          </span>

          <h2>Aktivitas Terbaru</h2>
        </div>

        <button className="icon-action">
          <MoreHorizontal size={17} />
        </button>
      </div>

      <div className="activity-list">
        {activities.map(
          (activity, index) => (
            <div
              className="activity-item"
              key={index}
            >
              <div
                className={`activity-icon ${activity.type}`}
              >
                <ActivityIcon
                  type={activity.type}
                />
              </div>

              <div className="activity-content">
                <strong>
                  {activity.title}
                </strong>

                <span>
                  {activity.description}
                </span>
              </div>

              <time>
                {activity.time}
              </time>
            </div>
          )
        )}
      </div>
    </section>
  );
}

function DocumentCard() {
  return (
    <section className="dashboard-card document-card">
      <div className="card-header">
        <div>
          <span className="card-eyebrow">
            DOKUMEN
          </span>

          <h2>Akan Berakhir</h2>
        </div>

        <button className="card-action">
          Semua dokumen
          <ChevronRight size={14} />
        </button>
      </div>

      <div className="document-list">
        {upcomingDocuments.map(
          (item, index) => (
            <div
              className="document-item"
              key={index}
            >
              <div className="document-icon">
                <FileText
                  size={17}
                  strokeWidth={1.7}
                />
              </div>

              <div className="document-info">
                <strong>
                  {item.document}
                </strong>

                <span>
                  {item.owner} · {item.type}
                </span>
              </div>

              <div className="document-date">
                <span>
                  {item.date}
                </span>

                <small
                  className={item.statusType}
                >
                  {item.status}
                </small>
              </div>
            </div>
          )
        )}
      </div>
    </section>
  );
}

export default function DashboardPage() {
  return (
    <main className="dashboard-page">
      <div className="dashboard-container">

        {/* HEADER */}

        <header className="dashboard-header">
          <div className="dashboard-heading">
            <span className="dashboard-eyebrow">
              SIMAK-KII / DASHBOARD
            </span>

            <h1>
              Selamat datang kembali.
            </h1>

            <p>
              Berikut ringkasan operasional
              SIMAK-KII hari ini.
            </p>
          </div>

          <div className="dashboard-date">
            <CalendarDays
              size={15}
              strokeWidth={1.8}
            />

            <span>
              Minggu, 16 Agustus 2026
            </span>
          </div>
        </header>

        {/* SUMMARY */}

        <section className="summary-grid">
          {summaryCards.map((card) => (
            <SummaryCard
              key={card.label}
              {...card}
            />
          ))}
        </section>

        {/* PRIMARY ANALYTICS */}

        <section className="dashboard-grid primary-grid">
          <AttendanceCard />

          <InvoiceCard />
        </section>

        {/* SECONDARY */}

        <section className="dashboard-grid secondary-grid">
          <ActivityCard />

          <DocumentCard />
        </section>

      </div>
    </main>
  );
}