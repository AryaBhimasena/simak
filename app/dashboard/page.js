'use client';

export default function DashboardPage() {
  const username = 'Budi'; // ganti dengan data dinamis sesuai kebutuhan

  return (
    <div className="app-page">
      <main className="app-card" role="main" aria-labelledby="dashboard-title">
        {/* Sambutan / title */}
        <section className="dashboard-header" aria-label="Sambutan">
          <h2 id="dashboard-title" className="dashboard-welcome">
            Selamat datang kembali, <span className="username">{username}</span>
          </h2>
        </section>

        {/* Insights Grid */}
        <section className="dashboard-insights" aria-label="Insight laporan">
          {/* Card 1 */}
          <div className="insight-card" role="group" aria-label="Billing BPJS Kesehatan">
            <div className="insight-title">Billing BPJS Kesehatan</div>
            <div className="insight-separator" />
            <div className="insight-content">
              <div className="insight-left">
                <div className="insight-doc-count">12</div>
                <div className="insight-doc-label">Dokumen</div>
              </div>
              <div className="insight-vertical-separator" />
              <div className="insight-right">
                <div className="insight-amount">Rp 25.000.000</div>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="insight-card" role="group" aria-label="Billing BPJS Tenaga Kerja">
            <div className="insight-title">Billing BPJS Tenaga Kerja</div>
            <div className="insight-separator" />
            <div className="insight-content">
              <div className="insight-left">
                <div className="insight-doc-count">8</div>
                <div className="insight-doc-label">Dokumen</div>
              </div>
              <div className="insight-vertical-separator" />
              <div className="insight-right">
                <div className="insight-amount">Rp 18.500.000</div>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="insight-card" role="group" aria-label="Total Gaji bulan aktif">
            <div className="insight-title">Total Gaji Agustus</div>
            <div className="insight-separator" />
            <div className="insight-content">
              <div className="insight-left">
                <div className="insight-doc-count">32</div>
                <div className="insight-doc-label">Slip</div>
              </div>
              <div className="insight-vertical-separator" />
              <div className="insight-right">
                <div className="insight-amount">Rp 120.000.000</div>
              </div>
            </div>
          </div>

          {/* Card 4 */}
          <div className="insight-card" role="group" aria-label="Invoice Belum Dibayar">
            <div className="insight-title">Invoice Belum Dibayar</div>
            <div className="insight-separator" />
            <div className="insight-content">
              <div className="insight-left">
                <div className="insight-doc-count">5</div>
                <div className="insight-doc-label">Invoice</div>
              </div>
              <div className="insight-vertical-separator" />
              <div className="insight-right">
                <div className="insight-amount">Rp 45.000.000</div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
