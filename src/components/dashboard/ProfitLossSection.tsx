export default function ProfitLossSection() {

  return (

    <div className="simakDash__sectionCard">

      <div className="simakDash__sectionHeader">

        <div className="simakDash__sectionHeading">

          <p className="simakDash__sectionLabel">
            Financial Report
          </p>

          <h3 className="simakDash__sectionTitle">
            Status Laba Rugi
          </h3>

        </div>

        <div className="simakDash__profitBadge">
          Januari 2026
        </div>

      </div>

      <div className="simakDash__financeTableWrapper">

        <table className="simakDash__financeTable">

          <tbody>

            {/* ====================================== */}
            {/* INCOME */}
            {/* ====================================== */}

            <tr className="simakDash__financeGroup">

              <td colSpan="6">

                <div className="simakDash__financeGroupContent">

                  <div className="simakDash__financeGroupDot simakDash__financeGroupDot--income" />

                  <span>
                    Penerimaan Invoice
                  </span>

                </div>

              </td>

            </tr>

            <tr>

              <td>-</td>

              <td>
                10 Jan 2026
              </td>

              <td>
                INV-001
              </td>

              <td>
                PT Alpha
              </td>

              <td className="simakDash__amountPositive">
                Rp 120.000.000
              </td>

              <td>
                Januari
              </td>

            </tr>

            {/* ====================================== */}
            {/* EXPENSE */}
            {/* ====================================== */}

            <tr className="simakDash__financeGroup">

              <td colSpan="6">

                <div className="simakDash__financeGroupContent">

                  <div className="simakDash__financeGroupDot simakDash__financeGroupDot--expense" />

                  <span>
                    Pengeluaran
                  </span>

                </div>

              </td>

            </tr>

            <tr>

              <td colSpan="4">
                Pembayaran Gaji
              </td>

              <td className="simakDash__amountNegative">
                Rp 845.000.000
              </td>

              <td>-</td>

            </tr>

            <tr>

              <td colSpan="4">
                Pembayaran BPJS Tenaga Kerja
              </td>

              <td className="simakDash__amountNegative">
                Rp 72.000.000
              </td>

              <td>-</td>

            </tr>

            <tr>

              <td colSpan="4">
                Pembayaran Pajak
              </td>

              <td className="simakDash__amountNegative">
                Rp 94.500.000
              </td>

              <td>-</td>

            </tr>

          </tbody>

          {/* ====================================== */}
          {/* FOOTER */}
          {/* ====================================== */}

          <tfoot>

            <tr className="simakDash__financeSummary">

              <td colSpan="4">
                Total Laba / Rugi
              </td>

              <td className="simakDash__financeSummaryAmount">
                -Rp 891.500.000
              </td>

              <td>
                Januari
              </td>

            </tr>

          </tfoot>

        </table>

      </div>

    </div>

  );

}