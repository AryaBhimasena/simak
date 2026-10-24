"use client";

import { useMemo, useState } from "react";
import { CalendarDays, Download, Pencil, Receipt, Search, Upload } from "lucide-react";
import "@/styles/pages/monitoring-invoice.css";

const INITIAL_INVOICES = [
  { id: "INV-2026-0001", client: "PT Karya Industri Nusantara", periode: "September 2026", tanggal: "2026-09-05", jatuhTempo: "2026-10-05", nominal: 28500000, bayar: 28500000, tanggalBayar: "2026-09-30", rekening: "BCA Operasional", invoiceFile: true, fakturFile: true, status: "DIBAYAR" },
  { id: "INV-2026-0002", client: "PT Maju Bersama", periode: "September 2026", tanggal: "2026-09-07", jatuhTempo: "2026-10-07", nominal: 18750000, bayar: 0, tanggalBayar: "", rekening: "", invoiceFile: true, fakturFile: true, status: "BELUM BAYAR" },
  { id: "INV-2026-0003", client: "CV Sinar Abadi", periode: "September 2026", tanggal: "2026-09-10", jatuhTempo: "2026-10-10", nominal: 12400000, bayar: 6000000, tanggalBayar: "2026-10-01", rekening: "Mandiri Penerimaan", invoiceFile: true, fakturFile: false, status: "BELUM BAYAR" },
  { id: "INV-2026-0004", client: "PT Sentosa Prima", periode: "Agustus 2026", tanggal: "2026-08-04", jatuhTempo: "2026-09-04", nominal: 32600000, bayar: 0, tanggalBayar: "", rekening: "", invoiceFile: true, fakturFile: true, status: "JATUH TEMPO" },
  { id: "INV-2026-0005", client: "PT Bintang Sejahtera", periode: "September 2026", tanggal: "2026-09-12", jatuhTempo: "2026-10-12", nominal: 9600000, bayar: 9600000, tanggalBayar: "2026-10-03", rekening: "BCA Operasional", invoiceFile: true, fakturFile: true, status: "DIBAYAR" },
];

const ACCOUNTS = ["BCA Operasional", "Mandiri Penerimaan", "BRI Penerimaan", "BNI Penerimaan"];

const formatCurrency = value =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value || 0);

const formatDate = value => {
  if (!value) return "-";
  return new Intl.DateTimeFormat("id-ID", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(value));
};

export default function MonitoringInvoicePage() {
  const [invoices, setInvoices] = useState(INITIAL_INVOICES);
  const [search, setSearch] = useState("");
  const [clientFilter, setClientFilter] = useState("ALL");
  const [periodeFilter, setPeriodeFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [paymentInvoice, setPaymentInvoice] = useState(null);

  const clients = useMemo(
    () => [...new Set(invoices.map(item => item.client))].sort((a, b) => a.localeCompare(b, "id-ID")),
    [invoices]
  );

  const periods = useMemo(
    () => [...new Set(invoices.map(item => item.periode))].sort(),
    [invoices]
  );

  const filteredInvoices = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return invoices.filter(item => {
      const matchesSearch = !keyword || [item.id, item.client, item.periode].some(value => String(value).toLowerCase().includes(keyword));
      const matchesClient = clientFilter === "ALL" || item.client === clientFilter;
      const matchesPeriode = periodeFilter === "ALL" || item.periode === periodeFilter;
      const matchesStatus = statusFilter === "ALL" || item.status === statusFilter;
      return matchesSearch && matchesClient && matchesPeriode && matchesStatus;
    });
  }, [invoices, search, clientFilter, periodeFilter, statusFilter]);

  const summary = useMemo(() => ({
    total: filteredInvoices.length,
    nominal: filteredInvoices.reduce((sum, item) => sum + item.nominal, 0),
    paid: filteredInvoices.filter(item => item.status === "DIBAYAR").length,
    overdue: filteredInvoices.filter(item => item.status === "JATUH TEMPO").length,
  }), [filteredInvoices]);

  function savePayment(data) {
    setInvoices(prev => prev.map(item => {
      if (item.id !== data.id) return item;
      const payment = Number(data.bayar) || 0;
      return {
        ...item,
        bayar: payment,
        tanggalBayar: data.tanggalBayar,
        rekening: data.rekening,
        status: payment >= item.nominal ? "DIBAYAR" : item.status === "JATUH TEMPO" ? "JATUH TEMPO" : "BELUM BAYAR",
      };
    }));
    setPaymentInvoice(null);
  }

  return (
    <main className="monitoring-invoice-page">
      <section className="monitoring-invoice-header">
        <div>
          <p className="monitoring-invoice-eyebrow">FINANCE / INVOICE</p>
          <h1>Monitoring Invoice</h1>
          <p className="monitoring-invoice-description">Pantau penerbitan invoice, pembayaran, jatuh tempo, dan kelengkapan dokumentasi setiap client.</p>
        </div>
      </section>

      <section className="invoice-summary">
        <Summary label="Total Invoice" value={summary.total} />
        <Summary label="Nilai Invoice" value={formatCurrency(summary.nominal)} />
        <Summary label="Sudah Dibayar" value={summary.paid} accent="success" />
        <Summary label="Jatuh Tempo" value={summary.overdue} accent="danger" />
      </section>

      <section className="monitoring-invoice-toolbar">
        <div className="invoice-search">
          <Search size={17} strokeWidth={1.8} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari invoice atau client..." />
        </div>
        <Filter label="Client" value={clientFilter} onChange={setClientFilter} options={clients} />
        <Filter label="Periode" value={periodeFilter} onChange={setPeriodeFilter} options={periods} />
        <Filter label="Status" value={statusFilter} onChange={setStatusFilter} options={["DIBAYAR", "BELUM BAYAR", "JATUH TEMPO"]} />
        <div className="invoice-total"><span>Menampilkan</span><strong>{filteredInvoices.length}</strong></div>
      </section>

      <section className="monitoring-invoice-card">
        <div className="monitoring-invoice-table-wrapper">
          <table className="monitoring-invoice-table">
            <thead>
              <tr>
                <th>INVOICE</th>
                <th>CLIENT</th>
                <th>PERIODE</th>
                <th>JATUH TEMPO</th>
                <th>NOMINAL</th>
                <th>PEMBAYARAN</th>
                <th>STATUS</th>
                <th>DOKUMENTASI</th>
                <th>AKSI</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.length === 0 ? (
                <tr><td colSpan="9" className="invoice-empty">Tidak ada invoice yang sesuai dengan filter.</td></tr>
              ) : filteredInvoices.map(item => {
                const selisih = item.nominal - item.bayar;
                return (
                  <tr key={item.id}>
                    <td>
                      <div className="invoice-id">{item.id}</div>
                      <span className="invoice-date">{formatDate(item.tanggal)}</span>
                    </td>
                    <td><strong className="invoice-client">{item.client}</strong></td>
                    <td>{item.periode}</td>
                    <td>
                      <div className="due-date"><CalendarDays size={14} />{formatDate(item.jatuhTempo)}</div>
                    </td>
                    <td><strong className="invoice-amount">{formatCurrency(item.nominal)}</strong></td>
                    <td>
                      <div className="payment-cell">
                        <strong>{formatCurrency(item.bayar)}</strong>
                        {item.bayar > 0 && selisih !== 0 && <span className="payment-difference">Selisih {formatCurrency(selisih)}</span>}
                        {item.tanggalBayar && <span>{formatDate(item.tanggalBayar)} · {item.rekening}</span>}
                      </div>
                    </td>
                    <td><StatusBadge status={item.status} /></td>
                    <td>
                      <div className="document-actions">
                        <DocumentButton label="Invoice" available={item.invoiceFile} />
                        <DocumentButton label="Faktur" available={item.fakturFile} />
                      </div>
                    </td>
                    <td>
                      <div className="invoice-actions">
                        <button className="invoice-payment-button" onClick={() => setPaymentInvoice(item)}>
                          <Receipt size={15} /> Pembayaran
                        </button>
                        <button className="invoice-edit-button" title="Edit invoice"><Pencil size={15} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {paymentInvoice && <PaymentModal invoice={paymentInvoice} onClose={() => setPaymentInvoice(null)} onSave={savePayment} />}
    </main>
  );
}

function Summary({ label, value, accent = "" }) {
  return <div className={`invoice-summary-item ${accent}`}><span>{label}</span><strong>{value}</strong></div>;
}

function Filter({ label, value, onChange, options }) {
  return (
    <div className="invoice-filter">
      <label>{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)}>
        <option value="ALL">Semua</option>
        {options.map(option => <option key={option} value={option}>{option}</option>)}
      </select>
    </div>
  );
}

function StatusBadge({ status }) {
  const className = status === "DIBAYAR" ? "paid" : status === "JATUH TEMPO" ? "overdue" : "unpaid";
  return <span className={`invoice-status ${className}`}><span />{status}</span>;
}

function DocumentButton({ label, available }) {
  return (
    <button className={`document-button ${available ? "available" : "missing"}`} title={available ? `Download ${label}` : `Upload ${label}`}>
      {available ? <Download size={13} /> : <Upload size={13} />}
      {label}
    </button>
  );
}

function PaymentModal({ invoice, onClose, onSave }) {
  const [bayar, setBayar] = useState(invoice.bayar || "");
  const [tanggalBayar, setTanggalBayar] = useState(invoice.tanggalBayar || "");
  const [rekening, setRekening] = useState(invoice.rekening || "");

  const numericPayment = Number(bayar) || 0;
  const difference = invoice.nominal - numericPayment;

  return (
    <div className="invoice-modal-overlay" onMouseDown={e => e.target === e.currentTarget && onClose()}>
      <div className="invoice-payment-modal">
        <header className="invoice-modal-header">
          <div>
            <p className="monitoring-invoice-eyebrow">PEMBAYARAN INVOICE</p>
            <h2>{invoice.id}</h2>
            <span>{invoice.client}</span>
          </div>
          <button onClick={onClose}>×</button>
        </header>

        <div className="invoice-payment-body">
          <div className="payment-reference">
            <span>Nilai Invoice</span>
            <strong>{formatCurrency(invoice.nominal)}</strong>
          </div>

          <div className="payment-form-grid">
            <label>Nominal Bayar<input type="number" value={bayar} onChange={e => setBayar(e.target.value)} placeholder="0" /></label>
            <label>Tanggal Bayar<input type="date" value={tanggalBayar} onChange={e => setTanggalBayar(e.target.value)} /></label>
            <label className="payment-field-full">Rekening Penerimaan
              <select value={rekening} onChange={e => setRekening(e.target.value)}>
                <option value="">Pilih rekening</option>
                {ACCOUNTS.map(account => <option key={account} value={account}>{account}</option>)}
              </select>
            </label>
          </div>

          <div className={`payment-difference ${difference === 0 ? "balanced" : difference > 0 ? "remaining" : "overpaid"}`}>
            <span>{difference === 0 ? "Pembayaran sesuai invoice" : difference > 0 ? "Sisa tagihan" : "Kelebihan pembayaran"}</span>
            <strong>{formatCurrency(Math.abs(difference))}</strong>
          </div>
        </div>

        <footer className="invoice-modal-footer">
          <button className="invoice-secondary-button" onClick={onClose}>Batal</button>
          <button className="invoice-primary-button" onClick={() => onSave({ id: invoice.id, bayar, tanggalBayar, rekening })}>Simpan Pembayaran</button>
        </footer>
      </div>
    </div>
  );
}